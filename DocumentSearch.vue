<template>
<div>
  <div class="loading"
       v-if="fetchingMpiID || fetchingMetadata">
    <QLinearProgress :value="fetchingProgress" class="q-mt-md" />
    <p v-if="fetchingMpiID" class="pulse">{{ translations.fetchMpiLabel }}</p>
    <p v-if="mpiID.value" class="ready">{{ translations.mpiLabel}} {{ mpiID.value }}</p>
    <p v-if="fetchingMetadata" class="pulse">{{ translations.fetchMetadataLabel }}</p>
  </div>
  <div v-else>
    <QTable :title="translations.titleLabel + mpiID.value"
             dense
             :rows="documents"
             :columns="tableColumns"
             :filter="tableFilter"
             :filter-method="filterTable"
             :pagination="{rowsPerPage: 10}"
             @row-click="selectDocument"
    >
      <template v-slot:top-right>
        <QInput borderless dense debounce="300" v-model="tableFilter" :placeholder="translations.searchLabel">
          <template v-slot:append>
            <QIcon name="fas fa-search" />
          </template>
        </QInput>
      </template>
    </QTable>
  </div>
  <p v-if="fetchingError" class="warning">{{ translations.fetchingError }}</p>
</div>
</template>

<script lang="ts">
import { DocumentReference, Patient, DocumentReferenceStatus, Identifier, Coding } from '@i4mi/fhir_r4';
import { QLinearProgress, QIcon, QTable, QInput } from 'quasar';
import FhirUtils, { FhirUtilLanguageType } from '../utils/fhirUtils';
import { defineComponent, PropType } from 'vue';
import EpdPlaygroundUtils from '../utils/epdPlaygroundUtils';
import { DocumentSearchTranslationStrings } from '../TranslationInterfaces';

// the delay for transactions when in demo mode (in ms)
const DEMO_MODE_DELAY = 2000;

/**
 * Loads & displays documents that belong to a patient.
 */
const DocumentSearch = defineComponent({
  name: 'DocumentSearch',
  components: {
    QLinearProgress, QIcon, QTable, QInput
  },
  data() {
    return {
      loadedDocuments: new Array<DocumentReference>(),  // the fetched Metadata Resources
      fetchingMpiID: false,                             // indicates if the fetching of the MPI ID is in process
      fetchingMetadata: false,                          // indicates if the fetching of metadata is in process
      fetchingError: false,                             // indicates an error fetching the data
      fetchingProgress: 0,                              // model for progress bar
      dateFormatter: new Intl.DateTimeFormat(this.$props.locale || 'de-CH'),
                                                        // helper for formating date according to locale
      mpiID: {} as Identifier,                          // the fetched master patient index ID
      tableFilter: '',                                  // model for filtering the result table
      tableColumns: [                                   // definitions of the result table rows
        {
          name: 'date',
          required: true,
          label: this.$props.translations.dateLabel,
          align: 'left',
          field: (row: DocumentReference) => row.date,
          format: this.formatDateString,
          sortable: true
        },
        {
          name: 'description',
          required: true,
          label: this.$props.translations.descriptionLabel,
          align: 'left',
          field: (row: DocumentReference) => row.description,
          format: (val: string) => this.shortenString(val) as string,
          sortable: true
        },
        {
          name: 'class',
          required: false,
          label: this.$props.translations.classLabel,
          align: 'left',
          field: (row: DocumentReference) => row.category && row.category[0].coding ? row.category[0].coding[0] : null,
          format: (coding: Coding) => {
            if (coding && coding.code) {
              const translated = this.fhirUtils.getClassCodeString(coding.code, 'de');
              return translated === '?' && coding.display
                ? this.shortenString(coding.display) as string
                : this.shortenString(translated) as string
            }
            return '?';
          },
          sortable: true
        },
        {
          name: 'type',
          required: false,
          label: this.$props.translations.typeLabel,
          align: 'left',
          field: (row: DocumentReference) => row.type && row.type.coding ? row.type.coding[0] : null,
          format: (coding: Coding) => {
            if (coding && coding.code) {
              const translated = this.fhirUtils.getTypeCodeString(coding.code, 'de');
              return translated === '?' && coding.display
                ? this.shortenString(coding.display) as string
                : this.shortenString(translated) as string
            }
            return '?';
          },
          sortable: true
        },
        {
          name: 'sourceType',
          required: false,
          label: this.$props.translations.authorLabel,
          align: 'left',
          field: (row: DocumentReference) => row.context?.facilityType?.coding ? row.context?.facilityType?.coding[0] : null,
          format: (coding: Coding) => {
            if (coding && coding.code) {
              const translated = this.fhirUtils.getFacilityClassCodeString(coding.code, 'de');
              return (translated === '?' && coding.display)
                ? this.shortenString(coding.display) as string
                : this.shortenString(translated) as string
            }
            return '?';
          },
          sortable: true
        },
        {
          name: 'filetype',
          required: false,
          label: this.$props.translations.fileTypeLabel,
          align: 'left',
          field: (row: DocumentReference) => row.content[0].attachment.contentType,
          format: (val: string) => val,
          sortable: true
        },
        {
          name: 'size',
          required: false,
          label: this.$props.translations.fileSizeLabel,
          align: 'left',
          field: (row: DocumentReference) => row.content[0].attachment.size,
          format: (val: number) => {
            return (Math.round(val / 1.024) / 1000).toString() + ' ' +
              ( val < 1024 * 1024
                ? this.$props.translations.kiloByteLabel
                : this.$props.translations.megaByteLabel
              )
            },
          sortable: true
        }
      ]
    }
  },
  emits: {
    /**
     * Make available selected document to parent component e.g. for download or display.
     * Emitted when the user selects a document from the search result list.
     */
    'found-document': (payload: {document: string, metadata: DocumentReference}) => {
      if (payload !== undefined && payload.document && payload.metadata) {
        return true;
      } else {
        console.log('Payload does not fulfill foundDocument event specification, event is not emitted.', payload);
        return false;
      }
    }
  },
  props: {
    /**
     * The Patient resource of the person the documents shall be searched for.
     */
    patient: {
      type: Object as PropType<Patient>,
      required: true
    },
    /**
     * Strings for displaying on the page.
     * @see   DocumentSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<DocumentSearchTranslationStrings>,
      required: true
    },
    /**
     * Array of documents added on client (e.g. with DocumentUpload.vue) after data was fetched from server.
     */
    addedDocuments: {
      type: Object as PropType<Array<DocumentReference>>,
      required: false
    },
    /**
     * The shorthand for the local language (e.g. de-CH). Default is de-CH.
     */
    locale: {
      type: String,
      required: false
    },
     /**
     * Two-character representation for the current language. Must be one of
     * 'de' | 'en' | 'fr' | 'it' | 'rm'
     */
    languageString: {
      type: String as PropType<FhirUtilLanguageType>,
      required: true
    },
    /**
     * Slows down the transactions to make the transactions more visible in the GUI.
     * Default: false.
     */
    demoMode: {
      type: Boolean,
      required: false
    },
    /**
     * FhirUtils object initialized with the projects setup.
     */
    fhirUtils: {
      type: Object as PropType<FhirUtils>,
      required: true
    },    
    /**
     * EpdPlaygroundUtils object initialized with the projects setup.
     */
    epdPlaygroundUtils: {
      type: Object as PropType<EpdPlaygroundUtils>,
      required: true
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    /**
     * Fetches the metadata from EPD playground. Relies on patient object in props and
     * modifies the component state, so the method no direct in- and output.
     * First, it uses the patients local identifier to fetch the master patient index
     * identifier (even if this identifier is probably already known, to ensure the correct process).
     * Then it uses the retrieved MPI identifier to fetch the metadata for the available documents
     * and writes them to the state, so the document table is updated.
     */
    fetchData() {
      this.fetchingMpiID = true;
      this.fetchingError = false;
      // find local ID of patient
      let localId = this.$props.patient.identifier?.find(i => i.system === this.epdPlaygroundUtils.getOids().local);
      if (localId) {
        const localIdString = this.getIDStringFromIdentifier(localId);

        setTimeout(() => {
        // use local ID to fetch MPI ID
        this.fetchingProgress = 0.5;
        this.epdPlaygroundUtils.useITI83(localIdString, [this.epdPlaygroundUtils.getOids().mpiId])
        .then((ids) => {
          this.fetchingMpiID = false;
          this.fetchingMetadata = true;
          this.mpiID = ids.parameter?.find(
              p => (p.name === 'targetIdentifier') && p.valueIdentifier
            )?.valueIdentifier || {};
          // now we fetched the MPI ID, we can query for documents
          this.epdPlaygroundUtils.useITI67({
            status: DocumentReferenceStatus.CURRENT,
            'patient.identifier': this.getIDStringFromIdentifier(this.mpiID)
          })
          .then((documentReferences) => {
            this.loadedDocuments = documentReferences;
          })
          .catch((e: Error) => {
            this.fetchingError = true;
            console.log('Error fetching metadata', e);
          })
          .finally(() => {
            setTimeout(() => {
              this.fetchingProgress = 1;
              this.fetchingMetadata = false;
            }, this.$props.demoMode ? DEMO_MODE_DELAY : 0);
          });
        })
        .catch((e: Error) => {
          this.fetchingError = true;
          console.log('Error fetching Master Patient Index ID', e);
        });
        }, this.$props.demoMode ? DEMO_MODE_DELAY : 0);
      } else {
        console.log('Can not fetch data when patient has no local ID.');
      }
    },
    /**
     * Handles selection of a document in UI. Fetches document and emits document to be handled be parent component.
     * @param documentReference a DocumentReference resource with the metadata of the selected
     *                          document.
     * @emits foundDocument     When the selected document is valid, the actual file is loaded and
     *                          when loading was successful, the foundDocument event is emitted.
     */
    selectDocument(_: Event, documentReference: DocumentReference): void {
      if (documentReference.content && documentReference.content[0] && documentReference.content[0].attachment && documentReference.content[0].attachment.url) {
        this.epdPlaygroundUtils.useITI68(documentReference)
        .then((document: string) => {
            this.$emit('found-document', {
              document: document,
              metadata: documentReference
            });
        })
        .catch((e: Error) => {
          this.fetchingError = true;
          console.log('Error fetching document', e);
        });
      }
    },
    /**
     * Helper method to convert a Identifier (as FHIR datatype) to a string in the form of
     * $identifier.system|$identifier.actualidentifier
     * (e.g. "urn:oid:1.1.1.99.1|215503a0-11d2-4197-822a-053791ab5a8e")
     * @param id  the Identifier as FHIR datatype. Needs at least a system property (as string)
     *            and a value property (as string)
     * @returns   the id string as described above
     * @throws    an error if the identifier is undefined or has no system or value property
     */
    getIDStringFromIdentifier(id: Identifier): string {
      if (id && id.system && id.value) {
        return id.system.toString() + '|' + id.value.toString();
      } else {
        throw new Error('Identifier is not wellformed, needs system and value.');
      }
    },
    /**
     * Helper for formatting a date to locale format.
     * @param dateString the date as (part of) ISO string
     */
    formatDateString(dateString: string): string {
      return this.dateFormatter.format(new Date(dateString));
    },
    /**
     * Helper function to shorten a string to a given length and add '…'
     * if the original string exceeds the given length.
     * @param str     the string to shorten
     * @param length? the length you want the final string to be (including the …)
     *                if no value is provided, the lenght is 1/40 of the window width in pixel
     * @returns       the shortened string with … appended
     */
    shortenString(str: string, length?: number): string {
      if (str && str.length > 0) {
        length = length || window.innerWidth / 40;
        return str.substring(0,length-1) + (str.length > length-1 ? '…' : '');
      } else {
        return '';
      }
    },
    /**
     * Helper function to filter the result table. Searches in translated source type,
     * translated document type, document description, file type and in date.
     * Not case sensitive
     * @param data    the unfiltered data array
     * @param filter  the string to filter
     * @returns       the filtered data as an array
     */
    filterTable(data: DocumentReference[], filter: string): DocumentReference[] {
      const locale = this.$props.locale || 'de-CH';
      filter = filter.toLowerCase();
      return data.filter(docRef => {
        let sourceType = '';
        let docCategory = '';
        let docType = ''
        if (docRef.context?.facilityType?.coding ) {
          const coding = docRef.context?.facilityType?.coding[0];

          if (coding && coding.code) {
            const translated = this.fhirUtils.getFacilityClassCodeString(coding.code, this.languageString);
            sourceType = (translated === '?' && coding.display)
              ? coding.display
              : translated ;
          }
        }
        if (docRef.category && docRef.category[0].coding) {
          const coding = docRef.category[0].coding[0];
          if (coding && coding.code) {
              const translated = this.fhirUtils.getClassCodeString(coding.code, this.languageString);
              docCategory = (translated === '?' && coding.display)
                ? coding.display
                : translated ;
            }
        }
        if (docRef.type && docRef.type.coding) {
          const coding = docRef.type.coding[0];
          if (coding && coding.code) {
              const translated = this.fhirUtils.getTypeCodeString(coding.code, this.languageString);
              docType = (translated === '?' && coding.display)
                ? coding.display
                : translated ;
            }
        }
        return docRef.description && docRef.description.toLowerCase().includes(filter) ||
               docRef.date && docRef.date.toLowerCase().includes(filter) ||
               docRef.content[0].attachment.contentType && docRef.content[0].attachment.contentType.toLowerCase().includes(filter) ||
               docRef.date && this.formatDateString(docRef.date).toLowerCase().includes(filter) ||
               sourceType.toLowerCase().includes(filter) ||
               docCategory.toLowerCase().includes(filter) ||
               docType.toLowerCase().includes(filter);
      });
    }
  },
  computed: {
    /**
     * Documents consist of fetched documents from server and added documents fetched
     * additionally when user uploads a document.
     * Document table has default sort by newest date, descending
     * @returns all documents of a patient sorted by date
     */
    documents(): DocumentReference[] {
      const documents = this.loadedDocuments;
      if (this.$props.addedDocuments) {

        this.$props.addedDocuments.forEach(ad => {
          // check if document already exists, if so replace, otherwise push
          const index = documents.findIndex(doc => doc.id === ad.id);
          if (index === -1) {
            documents.push(ad);
          } else {
            documents[index] = ad;
          }
        })
      }

      return documents.sort((a,b) => {
        if (!a.date) return -1;
        if (!b.date) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  }
});
export default DocumentSearch;
</script>

<style scoped type="text/css">
.warning {
  color: #f2c037;
  text-align: center;
  margin-top: 1.5em;
}
.loading {
  max-width: 500pt;
  display: block;
  margin-left: auto;
  margin-right: auto;
  align-content: center;
}
.loading p {
  margin-left: 2em;
  margin-top: 0.5em;
}
.pulse {
  animation: pulse 1s infinite;
}
.ready {
  opacity: 1;
  color: #4C9F70;
  animation: none !important;
}

@keyframes pulse {
	0% {
    opacity: 1;
	}

	50% {
    opacity: 0.5;
	}

	100% {
    opacity: 1;
	}
}
</style>

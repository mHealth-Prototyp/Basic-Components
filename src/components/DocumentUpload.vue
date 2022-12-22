<template>
  <div class="document-upload">
    <QStepper
      v-model="step"
      header-nav
      ref="stepper"
      color="primary"
      animated>
      <QStep
        :name="1"
        :title="componentTranslations.selectFile">
        <p class="explain-text">
          {{ componentTranslations.selectFileText }}
        </p>

        <div class="row">
          <div class="col">
            <QFile
              v-model="file"
              :label="componentTranslations.selectFile"
              dense />
          </div>
          <div
            class="col fhir-checkbox"
            v-if="file && file.name.includes('.json')">
            <QCheckbox
              v-model="isFhir"
              :label="componentTranslations.jsonFhir" />
          </div>
        </div>

        <QStepperNavigation>
          <QBtn
            @click="
              () => {
                step = 2;
              }
            "
            color="primary"
            :label="componentTranslations.continue"
            :disable="!file" />
        </QStepperNavigation>
      </QStep>

      <QStep
        :name="2"
        :title="componentTranslations.titleAndDescription"
        :disable="!file">
        <p class="explain-text">
          {{ componentTranslations.descriptionText }}
        </p>
        <div class="row">
          <div class="col">
            <QInput
              v-model="title"
              type="text"
              dense
              :label="componentTranslations.titleInputLabel" />
          </div>
        </div>
        <div class="row">
          <div class="col description">
            <QInput
              v-model="description"
              filled
              dense
              type="textarea"
              :label="componentTranslations.descriptionInputLabel" />
          </div>
        </div>

        <QStepperNavigation>
          <QBtn
            flat
            @click="step = 1"
            color="primary"
            :label="componentTranslations.back" />
          <QBtn
            @click="
              () => {
                step = 3;
              }
            "
            color="primary"
            :label="componentTranslations.continue"
            :disable="!description || description.length < 1"
            class="q-ml-sm" />
        </QStepperNavigation>
      </QStep>

      <QStep
        :name="3"
        :title="componentTranslations.metadata"
        :disable="!file">
        <div class="row">
          <div class="col">
            <p>{{ componentTranslations.languageText }}</p>
          </div>
          <div class="col">
            <QSelect
              v-model="language"
              :label="componentTranslations.language"
              :options="languageOptions"
              :option-label="(item) => (item && item.label ? item.label[languageString] : '?')"
              :option-value="(item) => (item && item.value ? item.value : undefined)" />
          </div>
        </div>
        <div class="row">
          <div class="col select-col">
            <p>{{ componentTranslations.fileTypeText }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col select-col">
            <QSelect
              v-model="typeSelect"
              :options="typeCodeOptions"
              dense
              use-input
              @filter="filterType"
              :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="componentTranslations.typeLabel" />
          </div>
        </div>
        <div
          class="row"
          v-if="typeSelect && classCodeOptions.length > 1">
          <div class="col select-col">
            <p>{{ componentTranslations.typeNotSufficient }}</p>
            <QSelect
              v-model="categorySelect"
              :options="classCodeOptions"
              dense
              :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="componentTranslations.categoryLabel" />
          </div>
        </div>

        <QStepperNavigation>
          <QBtn
            flat
            @click="step = 2"
            color="primary"
            :label="componentTranslations.back" />
          <QBtn
            @click="
              () => {
                step = 4;
              }
            "
            color="primary"
            :label="componentTranslations.continue"
            :disable="!typeSelect"
            class="q-ml-sm" />
        </QStepperNavigation>
      </QStep>

      <QStep
        :name="4"
        :title="componentTranslations.creatingInstitution"
        :disable="!typeSelect">
        <div class="row">
          <div class="col select-col">
            <p>{{ componentTranslations.creatingInstitutionText }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col select-col">
            <QSelect
              v-model="facility"
              :options="facilityOptions"
              dense
              use-input
              @filter="filterFacility"
              :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="componentTranslations.institution" />
          </div>
        </div>

        <div class="row">
          <div class="col select-col">
            <p>{{ componentTranslations.specialisationText }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col select-col">
            <QSelect
              v-model="practiceSetting"
              :options="practiceSettingOptions"
              dense
              use-input
              @filter="filterPracticeSetting"
              :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="componentTranslations.specialisation" />
          </div>
        </div>

        <QStepperNavigation>
          <QBtn
            flat
            @click="step = 2"
            color="primary"
            :label="componentTranslations.back"
            class="q-ml-sm" />
        </QStepperNavigation>
      </QStep>
    </QStepper>

    <div class="button-container">
      <QBtn
        id="cancelButton"
        @click="() => onDone()"
        :label="componentTranslations.cancelButtonLabel" />
      <QBtn
        id="uploadButton"
        :disabled="!ready"
        @click="uploadBinaryDocument"
        :color="ready ? 'primary' : undefined"
        :label="componentTranslations.uploadButtonLabel + patientName" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {QStepper, QStep, QCheckbox, QStepperNavigation, QInput, QBtn, QSelect, QFile} from 'quasar';
import {Bundle, BundleType, Patient} from '@i4mi/fhir_r4';
import EpdPlaygroundUtils, {Iti65DocumentBundle, Settings} from '../utils/epdPlaygroundUtils';
import FhirUtils, {
  FhirUtilLanguageType,
  Iti65Metadata,
  ITI_65_AUTHOR_ROLE,
  SUPPORTED_LANGUAGE_DISPLAYS,
  SystemCodeExtension
} from '../utils/fhirUtils';
import {DocumentUploadTranslationStrings} from '../TranslationInterfaces';
import {
  CLASS_CODES,
  CLASS_TYPE_COMBINATIONS,
  FACILITY_CLASS_CODES,
  PRACTICE_SETTING_CODES,
  TYPE_CODES
} from '../utils/snomedCodes';
import * as DE from '../assets/de.json';
import * as FR from '../assets/fr.json';

// Intstantiate class of interface to iterate translation keys
class DocumentUploadTranslations implements DocumentUploadTranslationStrings {
  titleLabel = '';
  titleInputLabel = '';
  titleAndDescription = '';
  descriptionText = '';
  descriptionInputLabel = '';
  selectFileText = '';
  selectFile = '';
  metadata = '';
  metadataText = '';
  uploadButtonLabel = '';
  cancelButtonLabel = '';
  categoryLabel = '';
  typeLabel = '';
  language = '';
  languageText = '';
  fileTypeText = '';
  typeNotSufficient = '';
  creatingInstitution = '';
  creatingInstitutionText = '';
  institution = '';
  specialisation = '';
  specialisationText = '';
  jsonFhir = '';
  continue = '';
  back = '';
}

/**
 * Provides UI to describe a document with meta data and uploads it.
 */
export default defineComponent({
  name: 'DocumentUpload',
  components: {
    QStepper,
    QStep,
    QCheckbox,
    QStepperNavigation,
    QInput,
    QBtn,
    QSelect,
    QFile
  },
  data() {
    return {
      currentPatient: {} as Patient, // the patient the file belongs to, as FHIR resource
      file: undefined as File | undefined,
      // selected file of file picker
      title: '', // model for title of file
      description: '', // model for description of file
      language: undefined as {value: string; label: {de: string}} | undefined,
      // model for file language,
      languageOptions: SUPPORTED_LANGUAGE_DISPLAYS,
      // options for language picker
      date: new Date(), // model for file date
      isFhir: false, // model for describing if file is FHIR,
      step: 1, // model for step of stepper
      categorySelect: undefined as SystemCodeExtension | undefined,
      // model for selected category to describe file
      classCodeOptions: [] as Array<SystemCodeExtension>,
      // options for selected category to describe file
      typeSelect: undefined as SystemCodeExtension | undefined,
      // model for selected type to describe file
      typeCodeOptions: [] as Array<SystemCodeExtension>,
      // options for selected type to describe file
      facility: undefined as SystemCodeExtension | undefined,
      // model for facility
      facilityOptions: [] as Array<SystemCodeExtension>,
      // options for facility type
      practiceSetting: undefined as SystemCodeExtension | undefined,
      // model for practiceSetting
      practiceSettingOptions: [] as Array<SystemCodeExtension>,
      // options for practiceSetting type
      componentTranslations: new DocumentUploadTranslations()
      // contains default translations from library but can be oberwritten individually via translations prop
    };
  },
  i18n: {
    messages: {
      'de-CH': Object.assign({}, DE.documentUpload, {
        uploadButtonLabel: DE.common.uploadFor,
        cancelButtonLabel: DE.common.cancel,
        institution: DE.common.institution,
        specialisation: DE.common.specialisation,
        continue: DE.common.continue,
        back: DE.common.back
      }),
      'fr-CH': Object.assign({}, FR.documentUpload, {
        uploadButtonLabel: FR.common.uploadFor,
        cancelButtonLabel: FR.common.cancel,
        institution: FR.common.institution,
        specialisation: FR.common.specialisation,
        continue: FR.common.continue,
        back: FR.common.back
      })
    }
  },
  props: {
    /**
     * Strings to overwrite default translations of component. Oberwrite by individual keys is supported.
     * @see   PatientSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<DocumentUploadTranslationStrings>,
      required: false
    },
    /**
     * The patient resource the file belongs to.
     */
    patient: {
      type: Object as PropType<Patient>,
      required: true
    },
    /**
     * Function to be called when the upload process is done.
     * Use bundle to pass on uploaded Bundle or leave empty to e.g. close component.
     */
    onDone: {
      type: Function as PropType<(bundle?: Bundle) => void>,
      required: true
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
    },
    /**
     * Project settings.
     */
    settings: {
      type: Object as PropType<Settings>,
      required: true
    }
  },
  beforeMount() {
    // prepare options for select class and type codes
    this.classCodeOptions = CLASS_CODES as [];

    this.classCodeOptions.sort((a, b): number => {
      return this.sortCodeOptions(a, b);
    });

    this.typeCodeOptions = TYPE_CODES as [];

    this.typeCodeOptions.sort((a, b): number => {
      return this.sortCodeOptions(a, b);
    });

    this.facility = this.fhirUtils.findSystemCodeExtension(this.settings.facilityType.code || '', FACILITY_CLASS_CODES);

    this.facilityOptions = FACILITY_CLASS_CODES.sort((a, b): number => {
      return this.sortCodeOptions(a, b);
    });

    this.practiceSetting = this.fhirUtils.findSystemCodeExtension(
      this.settings.practiceSetting.code || '',
      PRACTICE_SETTING_CODES
    );

    this.practiceSettingOptions = PRACTICE_SETTING_CODES.sort((a, b): number => {
      return this.sortCodeOptions(a, b);
    });

    // set language from app setting
    this.language = this.languageOptions.find((lo) => lo.value === this.languageString);

    this.setupTranslations();
  },
  methods: {
    /**
     * Iterates over translation keys, sets default translation or set from prop.
     */
    setupTranslations() {
      let defaultTranslations = this.componentTranslations;

      for (let i in defaultTranslations) {
        if (defaultTranslations.hasOwnProperty(i)) {
          type ObjectKey = keyof typeof defaultTranslations;
          const translationKey = i as ObjectKey;

          if (this.translations && this.translations[translationKey]) {
            // there is a translation from prop
            this.componentTranslations[translationKey] = this.translations[translationKey];
          } else {
            // we take default translation
            this.componentTranslations[translationKey] = this.$t(translationKey);
          }
        }
      }
    },
    /**
     * Creates a ITI65Bundle out of selected file and other state properties
     * and uses iti65-transaction to send it to the EPD playground.
     * Updates state according to upload result.
     */
    uploadBinaryDocument() {
      if (!this.categorySelect || !this.typeSelect) {
        console.warn('Category or Type is undefined.');
        return;
      }

      const category = this.categorySelect.defaultCoding;
      category.display = this.categorySelect.languageDisplays[this.languageString];

      const type = this.typeSelect.defaultCoding;
      type.display = this.typeSelect.languageDisplays[this.languageString];

      const metadata = {
        title: this.title,
        isFhir: this.isFhir,
        description: this.description,
        contentLanguage: this.language?.value || '',
        sourceIdentifier: this.epdPlaygroundUtils.getOids().app,
        categoryCoding: category,
        typeCoding: type,
        facilityCoding: this.facility?.defaultCoding,
        practiceSettingCoding: this.practiceSetting?.defaultCoding,
        authorRole: ITI_65_AUTHOR_ROLE.HCP
      } as Iti65Metadata;

      if (this.$props.patient && this.file) {
        this.fhirUtils
          .createIti65Bundle(this.$props.patient, this.file, metadata)
          .then((bundle: Iti65DocumentBundle) => this.epdPlaygroundUtils.useITI65(bundle))
          .then((response) => {
            this.onDone(response);
          })
          .catch((err) => {
            this.onDone({resourceType: 'Bundle', type: BundleType.TRANSACTION_RESPONSE});
            console.warn('failed to upload', err);
          });
      } else {
        this.onDone({resourceType: 'Bundle', type: BundleType.TRANSACTION_RESPONSE});
        console.warn("Can't upload without file or patient.");
      }
    },
    /**
     * Finds the matching class code for a given DocumentReference type
     * @see             http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html
     * @see             https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.classCode.html#logical-definition-cld
     * @see             https://build.fhir.org/documentreference-mappings.html#xds
     * @param typeCode  the default coding code of the type to find
     * @returns         an array with all categories matching the type
     */
    findCategoryForType(typeCode: string): Array<SystemCodeExtension> {
      const classes = CLASS_TYPE_COMBINATIONS.filter((combination) => {
        return combination.possibleTypeCodes.includes(typeCode);
      }).map((combination) => combination.classCode);
      return CLASS_CODES.filter((tc) => classes.includes(tc.defaultCoding.code.toString()));
    },
    /**
     * Helper function for filtering the type dropdown
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterType(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.typeCodeOptions = TYPE_CODES;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.typeCodeOptions = TYPE_CODES.filter((code) => {
            return code.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the facility dropdown
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterFacility(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.facilityOptions = FACILITY_CLASS_CODES;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.facilityOptions = FACILITY_CLASS_CODES.filter((code) => {
            return code.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the practiceSetting dropdown
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterPracticeSetting(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.practiceSettingOptions = PRACTICE_SETTING_CODES;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.practiceSettingOptions = PRACTICE_SETTING_CODES.filter((code) => {
            return code.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Alphabetical sorting for type and category language displays according to app language.
     */
    sortCodeOptions(a: SystemCodeExtension, b: SystemCodeExtension): number {
      if (a.languageDisplays[this.languageString] < b.languageDisplays[this.languageString]) {
        return -1;
      }
      if (a.languageDisplays[this.languageString] > b.languageDisplays[this.languageString]) {
        return 1;
      }
      return 0;
    }
  },
  watch: {
    /**
     * Watcher, that updates the title property when a new file is selected.
     * @param n the changed file
     */
    file(n: File) {
      const name = n.name.split('.')[0];
      this.title = name;
    },
    /**
     * Check type select and select matching category. If more than one
     * categorie is available, the user will be prompted for that.
     */
    typeSelect(n: SystemCodeExtension) {
      if (n && n.defaultCoding && n.defaultCoding.code) {
        const categories = this.findCategoryForType(n.defaultCoding.code);
        if (categories.length === 1) {
          this.categorySelect = categories[0];
          this.classCodeOptions = categories;
        } else {
          this.classCodeOptions = categories;
        }
      }
    }
  },
  computed: {
    /**
     * Builds the full patient name out of the Patient resource.
     */
    patientName(): string {
      if (this.$props.patient.name && this.$props.patient.name[0] && this.$props.patient.name[0].given) {
        const given = this.$props.patient.name[0].given[0] || '';
        const family = this.$props.patient.name[0].family || '';
        return given + ' ' + family;
      }
      return '';
    },
    /**
     * Criteria to activate the upload button.
     */
    ready(): boolean {
      return this.description.length > 0 && this.typeSelect != undefined;
    }
  }
});
</script>

<style scoped type="text/css">
.document-upload {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
hr {
  border-top: 1px double #8c8b8b;
  margin: 1em -1em;
}
h3 {
  font-size: 1.2em;
  margin: 0;
  font-weight: bold;
}
.fhir-checkbox {
  margin-top: 0.3em;
}
.q-field__label {
  font-size: 1em !important;
  background-color: #c10015;
}
.select-col {
  margin: 0.5em;
}
.description {
  margin-top: 1em;
}

.button-container {
  margin-top: 1em;
}
.button-container > .q-btn {
  margin: 0.5em;
}
.explain-text {
  margin: 0.5em 0;
}
</style>

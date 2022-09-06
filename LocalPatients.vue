<template>
<div v-if="translations">
  <QTable :title="translations.titleLabel"
           :loading="loadingData"
           class="patients-table"
           dense
           :filter="tableFilter"
           :filter-method="filterTable"
           hide-bottom
           :rows="loadingData ? [] : localPatients"
           :pagination="{rowsPerPage: 0}"
           @row-click="select"
           :columns="tableColumns"
           row-key="localID"
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTable, QInput, QIcon } from 'quasar';
import { Patient } from '@i4mi/fhir_r4';
import * as fhirpath from 'fhirpath';
import PatientUtils from '../utils/patientUtils';
import EpdPlaygroundUtils from '../utils/epdPlaygroundUtils';
import { LocalPatientsListTranslationStrings } from '../TranslationInterfaces';


/**
 * Options for PatientSearch component.
 * @param numberOfRandomPatients  Determines how many random patients should be generated if no patients are provided.
 *                                Defaults to 10.
 */
export interface LocalPatientsOptions {
  numberOfRandomPatients?: number;
}

/**
 * Generates & displays random local patients for use in app and upload to EPD Playground.
 */
export default defineComponent({
  name: 'LocalPatients',
  components: { QTable, QInput, QIcon },
  data() {
    return {
      localPatients: new Array<{            // model for local patient list
        pat: Patient,
        hasEpr: boolean
        }>(),
      loadingData: false,                   // model for loading mode of table
      tableFilter: '',                      // model for table search / filter
      tableColumns: [                       // defines the columns of the result table
         {
          name: 'family',
          required: true,
          label: this.$props.translations.familyLabel,
          align: 'left',
          sortable: true,
          field: (row: {pat: Patient}) => (fhirpath.evaluate(row.pat, 'Patient.name.family') as string[])[0]
        },
        {
          name: 'given',
          required: true,
          label: this.$props.translations.givenLabel,
          align: 'left',
          sortable: true,
          field: (row: {pat: Patient}) => (fhirpath.evaluate(row.pat, 'Patient.name.given') as string[])[0]
        },
        {
          name: 'gender',
          required: false,
          label: this.$props.translations.genderLabel,
          align: 'left',
          sortable: true,
          field: (row: {pat: Patient}) => (fhirpath.evaluate(row.pat, 'Patient.gender') as string[])[0].substring(0,1)
        },
        {
          name: 'birthdate',
          required: true,
          label: this.$props.translations.birthdateLabel,
          align: 'left',
          sortable: true,
          field: (row: {pat: Patient}) => new Date((fhirpath.evaluate(row.pat, 'Patient.birthDate') as string[])[0]).toLocaleDateString()
        },
        {
          name: 'hasEpr',
          required: false,
          label: this.$props.translations.hasEPRLabel,
          align: 'left',
          sortable: true,
          field: (row: {pat: Patient, hasEpr: boolean}) => row.hasEpr ? this.$props.translations.yesLabel : this.$props.translations.noLabel
        },
        {
          name: 'localID',
          required: false,
          label: this.$props.translations.localPidLabel,
          align: 'left',
          field: (row: {pat: Patient}) => {
            const identifier = row.pat.identifier?.find(i => i.system === this.$props.localIdSystem.urn);
            return identifier && identifier.value
              ? identifier.value.substring(0,9) + '-' + identifier.value.substring(9)
              : '';
          }
        },
        {
          name: 'ahv',
          required: false,
          label: this.$props.translations.ahvLabel,
          align: 'left',
          field: (row: {pat: Patient}) => {
            const identifier = row.pat.identifier?.find(i => i.system === this.epdPlaygroundUtils.getOids().ahv);
            return identifier ? identifier.value : '';
          }
        }
      ]
    }
  },
  props: {
    /**
     * System of the local Identifier.
     */
    localIdSystem: {
      type: Object as PropType<{
        urn: string;
        display: string;
      }>,
      required: true
    },
    /**
     * Strings for displaying on the page.
     * @see   LocalPatientsListTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<LocalPatientsListTranslationStrings>,
      required: true
    },
    /**
     * Options for the component.
     * @see   PatientSearchOptions interface for details
     */
    options: {
      type: Object as PropType<LocalPatientsOptions>,
      required: false
    },
    /**
     * Array of patients to be displayed as local patients. When none are
     * provided, random generated patients are provided.
     */
    patients: {
      type: Object as PropType<Patient[]>,
      required: false
    },    
    /**
     * EpdPlaygroundUtils object initialized with the projects setup.
     */
    epdPlaygroundUtils: {
      type: Object as PropType<EpdPlaygroundUtils>,
      required: true
    },    
    /**
     * EpdPlaygroundUtils object initialized with the projects setup.
     */
    patientUtils: {
      type: Object as PropType<PatientUtils>,
      required: true
    }
  },
  emits: {
    /**
     * Notify parent component about selected patient.
     * Emitted when the user selects a patient from the list.
     */
    'select-patient': (payload: Patient) => {
      return payload !== undefined;
    },
    /**
     * Notify parent component about generated patients.
     * Emitted when the component generates a bunch of random patients.
     */
    'generated-patients': (payload: Patient[]) => {
      return payload !== undefined;
    }
  },
  /**
   * Set up patients from props or random patient generator before mount.
   */
  mounted() {
    this.loadingData = true;
    let preparePatients = this.$props.patients || new Array<Patient>();

    if (!this.$props.patients) {
      for (
        let i = 0;
        i < (this.$props.options?.numberOfRandomPatients ? this.$props.options?.numberOfRandomPatients : 10);
        i++
      ) {
        preparePatients.push(this.patientUtils.generateRandomPatient());
      }
    }

    this.$emit('generated-patients', preparePatients);
  
    const checkingEprPromises = new Array<Promise<void>>();

    preparePatients.forEach((pat) => {
      checkingEprPromises.push(
        this.hasEprSpid(pat)
        .then((hasEpr) => {
          this.localPatients.push({
            pat: pat,
            hasEpr: hasEpr
          })
        })
        .catch(() => {
          this.localPatients.push({
            pat: pat,
            hasEpr: false
          })
        })
      );
    });

    Promise.all(checkingEprPromises)
    .finally(() => {
      this.localPatients.sort(
        (a,b) => {
          return fhirpath.evaluate(a.pat, 'Patient.name.family') > fhirpath.evaluate(b.pat, 'Patient.name.family')
            ? 1
            : -1
        }
      );
      this.loadingData = false;
    });

  },
  methods: {
    /**
     * Method for selecting a patient from the table. Emits the event to the
     * parent component, and resets the search if specified so in the options.
     */
    select(_: Event, pat:  Patient): void {
      this.$emit('select-patient', pat);
    },
    /**
     * Checks if a patient has an EPR SPID (and therefore is already known to the
     * EPD Playground with the given local PID)
     * @param pat
     * @returns   frue  if the patient is known to the EPD Playground (with the local PID)
     *            false if the patient is not know to the EPR Playground or has no local PID
     */
    hasEprSpid(pat: Patient): Promise<boolean> {
      const localIdentifier = pat.identifier?.find(i => i.system === this.$props.localIdSystem.urn);
      if (localIdentifier && localIdentifier.system && localIdentifier.value) {
        const localIdString = localIdentifier.system + '|' + localIdentifier.value;
        return this.epdPlaygroundUtils.useITI83(localIdString, [this.epdPlaygroundUtils.getOids().eprSpid])
        .then(() => {
          return true;
        })
        .catch(() => {
          console.log('Error is thrown because patient is not known by EPD Playground.');
          return false;
        })
      } else {
        return Promise.resolve(false);
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
    filterTable(data: {pat: Patient, hasEpr: boolean}[], filter: string): {pat: Patient, hasEpr: boolean}[] {
      filter = filter.toLowerCase();

      return data.filter(row => {
        let patient = row.pat;
        const given = (fhirpath.evaluate(patient, 'Patient.name.given') as string[])[0];
        const family = (fhirpath.evaluate(patient, 'Patient.name.family') as string[])[0];
        const birthdate = (fhirpath.evaluate(patient, 'Patient.birthDate') as string[])[0];
        const pid = patient.identifier?.find(i => i.system === this.$props.localIdSystem.urn)?.value || '';
        const ahv = patient.identifier?.find(i => i.system === this.epdPlaygroundUtils.getOids().ahv)?.value || '';
        return given.toLowerCase().includes(filter) ||
               family.toLowerCase().includes(filter) ||
               birthdate.includes(filter) ||
               pid.toLowerCase().includes(filter) ||
               ahv.includes(filter);
      });
    }

  },
  computed: {

  }
});
</script>

<style scoped type="text/css">

</style>

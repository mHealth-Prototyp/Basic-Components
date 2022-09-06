<template>
<div v-if="translations" >
  <div class="patient-search">
  <form>
    <div class="row">
      <div class="col">
        <QInput v-model="familyName"
                 type="text"
                 :label="translations.nameInputLabel" />
      </div>
      <div class="col">
        <QInput v-model="givenName"
                 type="text"
                 :label="translations.givenInputLabel" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <QInput v-model="birthDate"
                 type="date"
                 class="date-input"
                 stack-label
                 :label="translations.birthdayInputLabel"/>
      </div>
      <div class="col">
        <QSelect v-model="gender"
                  :options="genderOptions"
                  :label="translations.genderInputLabel"
                  :option-label="(l) => {
                    switch (l.toUpperCase()) {
                    case 'MALE':
                      return translations.genderMale;
                    case 'FEMALE':
                      return translations.genderFemale;
                    case 'OTHER':
                      return translations.genderOther;
                    default:
                      return '-';
                    }
                  }"/>
      </div>
    </div>

    <QSeparator size="0pt" />

    <div class="row">
      <div class="col">
        <QInput v-model="localId"
                 type="text"
                 :label="translations.idInputLabel"/>
      </div>
      <div class="col local-system-label">
        <p>({{translations.systemLabel + localIdSystem.display}})</p>
      </div>
    </div>

    <QSeparator size="0pt" />

    <QBtn id="search-button"
           @click="search"
           type="submit"
           :label="translations.searchButtonLabel"
           :disable="!enoughParameters || loading"
           :loading="loading">
      <QTooltip class="bg-warning" v-if="!enoughParameters">
        {{translations.notEnoughParameter}}
      </QTooltip>
    </QBtn>
  </form>
  </div>
  <p v-if="notFound" class="warning">{{translations.noPatientFound}}</p>
  <QTable :title="translations.resultTableTitle"
           v-if="patients.length > 0"
           class="result-table"
           dense
           hide-bottom
           :rows="patients"
           :pagination="{rowsPerPage: 0}"
           @row-click="select"
           :columns="tableColumns"
           row-key="eprSpid"
  />
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QInput, QSelect, QSeparator, QBtn, QTable, QTooltip } from 'quasar';
import { Patient, PatientAdministrativeGender } from '@i4mi/fhir_r4';
import * as fhirpath from 'fhirpath';
import EpdPlaygroundUtils, { Iti78Params } from '../utils/epdPlaygroundUtils';
import { PatientSearchTranslationStrings } from '../TranslationInterfaces';


/**
 * Options for PatientSearch component.
 * @param resetOnSelect   defines if the search should be reseted when a patient
 *                        is selected from the result list. DEFAULT: false
 */
export interface PatientSearchOptions {
  resetOnSelect: boolean
}

/**
 * Searches & displays patients on the EPD Playground.
 */
export default defineComponent({
  name: 'PatientSearch',
  components: { QInput, QSelect, QSeparator, QBtn, QTable, QTooltip },
  data () {
    return {
      givenName: '',    // model for the given name search parameter
      familyName: '',   // model for the family name search parameter
      birthDate: '',    // model for the birthdate search parameter
      localId: '',      // model for the local identifier search parameter
      gender: PatientAdministrativeGender.UNKNOWN,
                        // model for the administrative gender search parameter
      genderOptions: new Array<PatientAdministrativeGender>(),
                        // list of available choices in the gender dropdown
      patients: new Array<Patient>(),
                        // model for the patients found in the ITI-78 transaction
      loading: false,   // true while an async search is taking place
      notFound: false,  // true when no patients where found with given parameters
      tableColumns: [   // defines the columns of the result table
        {
          name: 'given',
          required: true,
          label: this.$props.translations.givenInputLabel,
          align: 'left',
          field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.name.given') as string[])[0]
        },
        {
          name: 'family',
          required: true,
          label: this.$props.translations.nameInputLabel,
          align: 'left',
          field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.name.family') as string[])[0]
        },
        {
          name: 'gender',
          required: false,
          label: this.$props.translations.genderInputLabel,
          align: 'left',
          field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.gender') as string[])[0].substring(0,1)
        },
        {
          name: 'birthdate',
          required: true,
          label: this.$props.translations.birthdayInputLabel,
          align: 'left',
          field: (pat: Patient) => new Date((fhirpath.evaluate(pat, 'Patient.birthDate') as string[])[0]).toLocaleDateString()
        },
        {
          name: 'place',
          required: false,
          label: this.$props.translations.cityLabel,
          align: 'left',
          field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.address.city') as string[])[0]
        },
        {
          name: 'eprSpid',
          required: false,
          label: this.$props.translations.eprSpidLabel,
          align: 'left',
          field: (pat: Patient) => {
            const identifier = pat.identifier?.find(i => i.system === this.epdPlaygroundUtils.getOids().eprSpid);
            return identifier ? identifier.value : '';
          }
        },
        {
          name: 'localID',
          required: false,
          label: this.$props.translations.localPidLabel,
          align: 'left',
          field: (pat: Patient) => {
            const identifier = pat.identifier?.find(i => i.system === this.$props.localIdSystem.urn);
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
     * @see   PatientSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<PatientSearchTranslationStrings>,
      required: true
    },
    /**
     * Options for the component.
     * @see   PatientSearchOptions interface for details
     */
    options: {
      type: Object as PropType<PatientSearchOptions>,
      required: false
    },    
    /**
     * EpdPlaygroundUtils object initialized with the projects setup.
     */
    epdPlaygroundUtils: {
      type: Object as PropType<EpdPlaygroundUtils>,
      required: true
    }
  },
  emits: {
    /**
     * Notify parent component about found patient data.
     * Emitted when user selects a patient from the search result list.
     */
    'found-patient': (payload: Patient) => {
      return payload !== undefined;
    }
  },
  beforeMount() {
    for (var gender in PatientAdministrativeGender) {
      this.genderOptions.push(gender as PatientAdministrativeGender)
    }
  },
  methods: {
    /**
     * The actual search result. Takes all arguments from the component state,
     * except the click event (to prevent event propagation).
     * Updates the component state after successful search so the results are
     * displayed in a table.
     */
    search(e: Event) {
      e.preventDefault();
      this.patients = [];
      const searchParams: Partial<Iti78Params> = {}
      if (this.givenName.length > 0) searchParams.given = this.givenName;
      if (this.familyName.length > 0) searchParams.family = this.familyName;
      if (this.birthDate.length > 0) searchParams.birthdate = this.birthDate;
      if (this.gender.toLocaleLowerCase() != PatientAdministrativeGender.UNKNOWN) searchParams.gender = this.gender;
      if (this.localId.length > 0) searchParams.identifier = this.$props.localIdSystem.urn + '|' + this.localId
      this.loading = true;
      this.epdPlaygroundUtils.useITI78(searchParams)
      .then((result) => {
        this.patients = result;
        this.notFound = result.length === 0;
      })
      .catch((e: Error) => {
        this.patients = [];
        if (e.message.toLowerCase().indexOf('not found')) {
          this.notFound = true;
        } else {
          console.log('Error:', e.message);
        }
      })
      .finally(() => {
        this.loading = false;
      });
    },
    /**
     * Method for selecting a patient from the table. Emits the event to the
     * parent component, and resets the search if specified so in the options.
     */
    select(_: Event, pat:  Patient): void {
      this.$emit('found-patient', pat);
      if (this.$props.options && this.$props.options.resetOnSelect) {
        this.givenName = '';
        this.familyName = '';
        this.birthDate = '';
        this.gender = PatientAdministrativeGender.UNKNOWN;
        this.localId = '';
        this.patients = [];
      }
    }
  },
  computed: {
    /**
     * Checks if the minimum criteria for being able to perform a search are fulfilled.
     */
    enoughParameters(): boolean {
      return this.localId !== ''
          || this.givenName !== '' && this.familyName !== ''
          || this.givenName !== '' && this.birthDate !== ''
          || this.familyName !== '' && this.birthDate !== ''
    }
  }
});
</script>

<style scoped lang="css">
.warning {
  color: #f2c037;
  text-align: center;
  margin-top: 1.5em;
}
.result-table {
  margin-top: 2em;
  max-width: 600pt;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.patient-search {
  max-width: 500pt;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
#search-button {
  width: 200px;
  display: block;
  margin-top: 2em;
  margin-bottom: 1.5em;
  margin-left: auto;
  margin-right: auto;
}
.local-system-label {
  margin-top: 2em;
}
.col {
  padding: 1em;
}
hr {
  border-top: 1px double #8c8b8b;
}
</style>

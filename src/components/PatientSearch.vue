<template>
  <div>
    <div class="patient-search">
      <form>
        <div class="row">
          <div class="col">
            <QInput
              v-model="familyName"
              type="text"
              :label="componentTranslations.nameInputLabel" />
          </div>
          <div class="col">
            <QInput
              v-model="givenName"
              type="text"
              :label="componentTranslations.givenNameInputLabel" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <QInput
              v-model="birthDate"
              type="date"
              class="date-input"
              stack-label
              :label="componentTranslations.birthdayInputLabel" />
          </div>
          <div class="col">
            <QSelect
              v-model="gender"
              :options="genderOptions"
              :label="componentTranslations.genderInputLabel"
              :option-label="(label) => renderGender(label)" />
          </div>
        </div>

        <QSeparator size="0pt" />

        <div class="row">
          <div class="col">
            <QInput
              v-model="localId"
              type="text"
              :label="componentTranslations.idInputLabel" />
          </div>
          <div class="col local-system-label">
            <p>({{ componentTranslations.systemLabel + localIdSystem.display }})</p>
          </div>
        </div>

        <QSeparator size="0pt" />

        <QBtn
          id="search-button"
          @click="search"
          type="submit"
          :label="componentTranslations.searchButtonLabel"
          :disable="!enoughParameters || loading"
          :loading="loading">
          <QTooltip
            class="bg-warning"
            v-if="!enoughParameters">
            {{ componentTranslations.notEnoughParameter }}
          </QTooltip>
        </QBtn>
      </form>
    </div>
    <p
      v-if="notFound"
      class="warning">
      {{ componentTranslations.noPatientFound }}
    </p>
    <QTable
      :title="componentTranslations.resultTableTitle"
      v-if="patients.length > 0"
      class="result-table"
      dense
      hide-bottom
      :rows="patients"
      :pagination="{rowsPerPage: 0}"
      @row-click="select"
      :columns="tableColumns"
      row-key="eprSpid" />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {QInput, QSelect, QSeparator, QBtn, QTable, QTooltip, QTableColumn} from 'quasar';
import {Patient, PatientAdministrativeGender} from '@i4mi/fhir_r4';
import * as fhirpath from 'fhirpath';
import EpdPlaygroundUtils, {Iti78Params} from '../utils/epdPlaygroundUtils';
import {PatientSearchTranslationStrings} from '../TranslationInterfaces';
import * as DE from '../assets/de.json';
import * as FR from '../assets/fr.json';

class PatientSearchTranslations implements PatientSearchTranslationStrings {
  nameInputLabel = '';
  givenNameInputLabel = '';
  birthdayInputLabel = '';
  genderInputLabel = '';
  idInputLabel = '';
  systemLabel = '';
  cityLabel = '';
  eprSpidLabel = '';
  localPidLabel = '';
  searchButtonLabel = '';
  genderMale = '';
  genderFemale = '';
  genderOther = '';
  notEnoughParameter = '';
  noPatientFound = '';
  resultTableTitle = '';
}

/**
 * Options for PatientSearch component.
 * @param resetOnSelect   defines if the search should be reseted when a patient
 *                        is selected from the result list. DEFAULT: false
 */
export interface PatientSearchOptions {
  resetOnSelect: boolean;
}

/**
 * Searches & displays patients on the EPD Playground.
 */
export default defineComponent({
  name: 'PatientSearch',
  components: {QInput, QSelect, QSeparator, QBtn, QTable, QTooltip},
  data() {
    return {
      givenName: '', // model for the given name search parameter
      familyName: '', // model for the family name search parameter
      birthDate: '', // model for the birthdate search parameter
      localId: '', // model for the local identifier search parameter
      gender: PatientAdministrativeGender.UNKNOWN,
      // model for the administrative gender search parameter
      genderOptions: new Array<PatientAdministrativeGender>(),
      // list of available choices in the gender dropdown
      patients: new Array<Patient>(),
      // model for the patients found in the ITI-78 transaction
      loading: false, // true while an async search is taking place
      notFound: false, // true when no patients where found with given parameters
      tableColumns: new Array<QTableColumn>(),
      componentTranslations: new PatientSearchTranslations()
    };
  },
  i18n: {
    messages: {
      'de-CH': Object.assign({}, DE.patientSearch, {
        nameInputLabel: DE.common.name,
        givenNameInputLabel: DE.common.givenName,
        birthdayInputLabel: DE.common.birthdate,
        genderInputLabel: DE.common.gender,
        cityLabel: DE.common.city,
        eprSpidLabel: DE.common.eprSpid,
        localPidLabel: DE.common.localPid,
        searchButtonLabel: DE.common.search,
        genderMale: DE.common.genderMale,
        genderFemale: DE.common.genderFemale,
        genderOther: DE.common.genderOther
      }),
      'fr-CH': Object.assign({}, FR.patientSearch, {
        nameInputLabel: FR.common.name,
        givenNameInputLabel: FR.common.givenName,
        birthdayInputLabel: FR.common.birthdate,
        genderInputLabel: FR.common.gender,
        cityLabel: FR.common.city,
        eprSpidLabel: FR.common.eprSpid,
        localPidLabel: FR.common.localPid,
        searchButtonLabel: FR.common.search,
        genderMale: FR.common.genderMale,
        genderFemale: FR.common.genderFemale,
        genderOther: FR.common.genderOther
      })
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
     * Strings to overwrite default translations of component. Oberwrite by individual keys is supported.
     * @see   PatientSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<PatientSearchTranslationStrings>,
      required: false
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
    this.setupTranslations();

    for (var gender in PatientAdministrativeGender) {
      this.genderOptions.push(gender as PatientAdministrativeGender);
    }

    this.tableColumns = [
      // defines the columns of the result table
      {
        name: 'given',
        required: true,
        label: this.componentTranslations.givenNameInputLabel,
        align: 'left',
        field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.name.given') as string[])[0]
      },
      {
        name: 'family',
        required: true,
        label: this.componentTranslations.nameInputLabel,
        align: 'left',
        field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.name.family') as string[])[0]
      },
      {
        name: 'gender',
        required: false,
        label: this.componentTranslations.genderInputLabel,
        align: 'left',
        field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.gender') as string[])[0].substring(0, 1)
      },
      {
        name: 'birthdate',
        required: true,
        label: this.componentTranslations.birthdayInputLabel,
        align: 'left',
        field: (pat: Patient) =>
          new Date((fhirpath.evaluate(pat, 'Patient.birthDate') as string[])[0]).toLocaleDateString()
      },
      {
        name: 'place',
        required: false,
        label: this.componentTranslations.cityLabel,
        align: 'left',
        field: (pat: Patient) => (fhirpath.evaluate(pat, 'Patient.address.city') as string[])[0]
      },
      {
        name: 'eprSpid',
        required: false,
        label: this.componentTranslations.eprSpidLabel,
        align: 'left',
        field: (pat: Patient) => {
          const identifier = pat.identifier?.find((i) => i.system === this.epdPlaygroundUtils.getOids().eprSpid);
          return identifier ? identifier.value : '';
        }
      },
      {
        name: 'localID',
        required: false,
        label: this.componentTranslations.localPidLabel,
        align: 'left',
        field: (pat: Patient) => {
          const identifier = pat.identifier?.find((i) => i.system === this.$props.localIdSystem.urn);
          return identifier ? identifier.value : '';
        }
      }
    ];
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
     * The actual search result. Takes all arguments from the component state,
     * except the click event (to prevent event propagation).
     * Updates the component state after successful search so the results are
     * displayed in a table.
     */
    search(e: Event) {
      e.preventDefault();
      this.patients = [];
      const searchParams: Partial<Iti78Params> = {};
      if (this.givenName.length > 0) searchParams.given = this.givenName;
      if (this.familyName.length > 0) searchParams.family = this.familyName;
      if (this.birthDate.length > 0) searchParams.birthdate = this.birthDate;
      if (this.gender.toLocaleLowerCase() != PatientAdministrativeGender.UNKNOWN) searchParams.gender = this.gender;
      if (this.localId.length > 0) searchParams.identifier = this.$props.localIdSystem.urn + '|' + this.localId;
      this.loading = true;
      this.epdPlaygroundUtils
        .useITI78(searchParams)
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
    select(_: Event, pat: Patient): void {
      this.$emit('found-patient', pat);
      if (this.$props.options && this.$props.options.resetOnSelect) {
        this.givenName = '';
        this.familyName = '';
        this.birthDate = '';
        this.gender = PatientAdministrativeGender.UNKNOWN;
        this.localId = '';
        this.patients = [];
      }
    },
    /**
     * Renders gender according to patients gender.
     * Not a computed method because we need the parameter.
     */
    renderGender(gender: string): string {
      const localGender = gender.toLocaleLowerCase();
      if (localGender == 'male') {
        return this.componentTranslations.genderMale;
      } else if (localGender == 'female') {
        return this.componentTranslations.genderFemale;
      } else if (localGender == 'other') {
        return this.componentTranslations.genderOther;
      } else {
        return '-';
      }
    }
  },
  computed: {
    /**
     * Checks if the minimum criteria for being able to perform a search are fulfilled.
     */
    enoughParameters(): boolean {
      return (
        this.localId !== '' ||
        (this.givenName !== '' && this.familyName !== '') ||
        (this.givenName !== '' && this.birthDate !== '') ||
        (this.familyName !== '' && this.birthDate !== '')
      );
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

<template>
<div v-if="translations">
  <p class="title-text">{{ translations.titleText }}</p>
  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.familyLabel }}
      </b>
    </div>
    <div class="col-4">
      <span class="editable">
        {{familyName}}
      </span>
      <QPopupEdit v-model="familyName"
                    auto-save
                    v-slot="scope">
        <QInput v-model="scope.value"
                 dense
                 autofocus
                 @keyup.enter="scope.set" />
      </QPopupEdit>
    </div>
    <div class="col-2">
      <b>
        {{ translations.genderLabel }}
      </b>
    </div>
    <div class="col-4">
      <span class="editable">
        {{ translations[gender + 'Gender']}}
      </span>
      <QPopupEdit v-model="gender"
                    auto-save
                    v-slot="scope">
        <QSelect  v-model="scope.value"
                   :options="genderOptions"
                   :option-label="(l) => translations[l.toLowerCase() + 'Gender']"/>
      </QPopupEdit>
    </div>
  </div>
  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.givenLabel }}
      </b>
    </div>
    <div class="col-4">
      <span class="editable">
        {{ givenNames.join(' ') }}

      </span>
      <QPopupEdit v-model="givenNames"
                    auto-save
                    v-slot="scope">
        <div v-for="value, index in scope.value"
             :key="'nameInput' + index.toString()">
          <QInput v-model="scope.value[index]"
                   dense
                   class="given-input"
                   :autofocus="index===0"
                   @keyup.enter="scope.set" />
          <QIcon v-if="scope.value.length > 1"
                  name="fas fa-trash"
                  class="inline-icon add-delete-icon"
                  @click="() => scope.value.splice(index, 1)"/>
          <QIcon v-if="index === scope.value.length - 1"
                  name="fas fa-plus"
                  class="inline-icon add-delete-icon"
                  @click="() => scope.value.push('')"/>
        </div>

      </QPopupEdit>
    </div>


    <div class="col-2">
      <b>
        {{ translations.birthdateLabel }}
      </b>
    </div>
    <div class="col-4">
      <span class="editable">
        {{ birthdate ? dateFormatter.format(new Date(birthdate)) : '-' }}
      </span>
      <QPopupEdit v-model="birthdate"
                    auto-save
                    v-slot="scope">
        <QInput v-model="scope.value"
                 dense
                 type="date"
                 autofocus
                 @keyup.enter="scope.set" />
      </QPopupEdit>
    </div>
  </div>

  <QSeparator size="0pt" />

  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.addressLabel }}
      </b>
    </div>
    <div class="col-4">
      <ul class="editable-list">
        <li v-for="address, index in addresses"
            :key="address.toString().substring(0,20)">
          <div>
          <span class="editable">
              {{ address.line?.join(', ') }}{{ address.line && address.line[0] == '' ? ' ' : ','}}
              {{ address.postalCode }}
              {{ address.city }}
              {{ address.state?.length || -1 > 0 ? '(' + address.state + ')' : ''}}
              <QIcon v-if="addresses.length > 1"
                      name="fas fa-trash"
                      class="add-delete-icon"
                      @click.stop="() => addresses.splice(index, 1)"/>
            </span>
              <QIcon v-if="index === addresses.length - 1 && (address.city?.length || -1) > 0"
                  name="fas fa-plus"
                  class="add-delete-icon"
                  @click.stop="() => addresses.push({line: [''], city: '', postalCode: ''})"/>
          </div>

          <QPopupEdit v-model="addresses[index]"
                        auto-save
                        v-slot="scope">
            <QInput v-for="line, index in scope.value.line"
                     :key="'line' + index"
                     :autofocus="index === 0"
                     v-model="scope.value.line[index]"
                     :label="translations.streetLabel"
                     dense
                     @keyup.enter="scope.set" />
            <QInput v-model="scope.value.postalCode"
                     :label="translations.zipLabel"
                     dense
                     @keyup.enter="scope.set" />
            <QInput v-model="scope.value.city"
                     :label="translations.cityLabel"
                     dense
                     @keyup.enter="scope.set" />
            <QInput v-model="scope.value.state"
                     :label="translations.stateLabel"
                     dense
                     @keyup.enter="scope.set" />
          </QPopupEdit>
        </li>
      </ul>
    </div>
  </div>

  <QSeparator size="0pt" />

  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.identifiersLabel }}
      </b>
    </div>
  </div>
  <div class="row">
    <div class="col-2">
      <span>{{ translations.localIdLabel }}</span>
    </div>
    <div class="col-4">
      <span :class="patient.pat ? 'non-editable' : 'editable' "><!-- // only editable when not pre-loaded patient-->
            {{ localId }}
        <QPopupEdit v-if="!patient.pat"
                      v-model="localId"
                      auto-save
                      v-slot="scope">
        <QInput v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set" />
          </QPopupEdit>
      </span>
    </div>
    <div class="col-2" v-if="eprSpid">
      <span>{{ translations.eprSpidLabel }}</span>
    </div>
    <div class="col-4" v-if="eprSpid">
      <span class="non-editable">
        {{ eprSpid }}
      </span>
    </div>
    <div class="col-2" v-if="ahvNumber && !eprSpid">
      <span>{{ translations.ahvLabel }}</span>
    </div>
    <div class="col-4" v-if="ahvNumber && !eprSpid">
      <span :class="patient.pat  ? 'non-editable' : 'editable' "><!-- // only editable when not pre-loaded patient-->
        {{ ahvNumber }}
        <QPopupEdit v-if="!patient.pat"
                      v-model="ahvNumber"
                      auto-save
                      v-slot="scope">
        <QInput v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set" />
          </QPopupEdit>
      </span>
    </div>
  </div>

  <QSeparator size="0pt" />

  <div class="button-container">
    <QBtn @click="register"
         :label="translations.registerButtonLabel"
         :disable="!enoughParameters && !patient || (patient && patient.hasEpr)"
         :loading="loading"/>
    <ul class="status-list" v-if="status.length > 0">
      <li v-for="message, index in status"
          :key="'msg-' + index"
          :class="'status-message' + (index === status.length -1 && loading ? (error ? ' error-message' : ' last-message') : '')">
        {{ message }}
      </li>
    </ul>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QPopupEdit, QInput, QSelect, QIcon, QSeparator, QBtn } from 'quasar';
import { Patient, PatientAdministrativeGender, Address, Identifier, MessageHeader } from '@i4mi/fhir_r4';
import * as fhirpath from 'fhirpath';

import PatientUtils from '../utils/patientUtils';
import EpdPlaygroundUtils, { ITI_93_ACTION, Settings } from '../utils/epdPlaygroundUtils';
import { RegisterPatientTranslationStrings } from '../TranslationInterfaces';


/**
 * Registers a patient in the EPD Playground.
 */
export default defineComponent({
  name: 'RegisterPatient',
  components: { QPopupEdit, QInput, QSelect, QIcon, QSeparator, QBtn },
  data() {
    return {
      givenNames: [''],
                        // model for the given name search parameter
      familyName: '',   // model for the family name search parameter
      birthdate: '',    // model for the birthdate search parameter
      localId: '',      // model for the local identifier search parameter
      eprSpid: '',      // model for EPR spid
      ahvNumber: ' ',    // model for AHV number (only local)
      addresses: [{     // model for addresses
          line: [''],
          city: '',
          postalCode: '',
          state: ''
        } as Address],
      gender: PatientAdministrativeGender.UNKNOWN,
                        // model for the administrative gender search parameter
      genderOptions: new Array<PatientAdministrativeGender>(),
                        // list of available choices in the gender dropdown
      dateFormatter: new Intl.DateTimeFormat(this.settings.language || 'de-CH'),
                        // helper for formating date according to locale
      status: new Array<string>(),
                        // model for status messages, indicating progress of registering
      loading: false,   // true while async registering is taking place
      error: false    // true when registering aborted with an error

    }
  },
  props: {
    /**
     * Prefills the register form with a given Patient resource.
     */
    patient: {
      type: Object as PropType<{pat: Patient, hasEpr: boolean}>,
      required: false
    },
    /**
     * Strings for displaying on the page.
     * @see   PatientSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<RegisterPatientTranslationStrings>,
      required: true
    },
    /**
     * Project settings.
     */
    settings: {
      type: Object as PropType<Settings>,
      required: true
    },
    /**
     * Options for the component.
     * @see   PatientSearchOptions interface for details
     *
    options: {
      type: Object as PropType<PatientSearchOptions>,
      required: false
    }*/
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
     * Notifies parent component about registered patient.
     * Emitted after successful upload of patient data.
     */
    'uploaded-patient': (payload: Patient) => {
      return payload !== undefined;
    }
  },
  beforeMount() {
    for (var gender in PatientAdministrativeGender) {
      if (gender !== PatientAdministrativeGender.UNKNOWN) {
        this.genderOptions.push(gender as PatientAdministrativeGender);
      }
    }
    if (this.$props.patient && this.$props.patient.pat) {
      this.fillDataFromPatient(this.$props.patient.pat);
    }
  },
  methods: {
    /**
     * Populates the component state from a Patient resource (e.g. from the props, or from
     * a previous state).
     */
    fillDataFromPatient(pat: Patient): void {
      this.givenNames = (fhirpath.evaluate(pat, 'Patient.name.first().given') as string[]) || [];
      this.familyName = (fhirpath.evaluate(pat, 'Patient.name.first().family') as string[])[0] || '';
      this.gender = pat.gender || PatientAdministrativeGender.UNKNOWN;
      this.birthdate = pat.birthDate || '';
      this.addresses = pat.address || [];
      this.localId = pat.identifier?.find(i => i.system === this.epdPlaygroundUtils.getOids().local)?.value || '';
      this.ahvNumber = pat.identifier?.find(i => i.system === this.epdPlaygroundUtils.getOids().ahv)?.value || '';
    },
    /**
     * Simulates a request for getting a EPR SPID. Adds artifical delay for more realistic demonstration.
     * @param ahv   the ahv number as a string
     * @returns     A promise of an Identifier with EPR SPID
     */
    getEprSpid(ahvNumber: string): Promise<Identifier> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // TODO: better hash ffs
          const hash = ahvNumber.substring(4,8) + ahvNumber.substring(14,15) + ahvNumber.substring(9,13);
          try {
            resolve(
              {
                system: this.epdPlaygroundUtils.getOids().eprSpid,
                value: this.patientUtils.generateEprSpid(hash)
              }
            );
          }
          catch(e) {
            reject(e);
          }
        }, 1000 + Math.random() * 1000)
      });
    },
    /**
     * Mocks a query for EPR SPID and then registers the patient on EPD Playground using the local ID and the EPR SPID.
     */
    register() {
      this.loading = true;
      if (this.ahvNumber) {
        this.status = [this.$props.translations.queryEprSpidMessage + '(' + (this.ahvNumber) + ')'];
        this.getEprSpid(this.ahvNumber)
        .then((eprIdentifier) => {
          this.eprSpid = eprIdentifier.value || '?';
          this.status.push(this.$props.translations.gotEprSpidMessage + this.eprSpid);

          const org = this.settings.organization;
          org.id = org.id || '1';
          const toRegisterPatient = {
            resourceType: 'Patient',
            id: this.localId,
            identifier: [
              { system: this.epdPlaygroundUtils.getOids().local, value: this.localId },
              { system: this.epdPlaygroundUtils.getOids().eprSpid, value: this.eprSpid}
            ],
            active: true,
            name: [{ family: this.familyName, given: this.givenNames }],
            gender: this.gender,
            birthDate: this.birthdate,
            address: this.addresses,
            contained: [
              org
            ],
            managingOrganization: { reference: '#' + org.id.toString() }
          } as Patient;

          this.status.push(this.$props.translations.registerPatientMessage + this.localId + ' / ' + this.eprSpid);

          this.epdPlaygroundUtils.useITI93(toRegisterPatient, ITI_93_ACTION.ADD)
          .then(res => {
            if (res.entry && res.entry[0] && res.entry[0].resource && (res.entry[0].resource as MessageHeader).response?.code === 'ok') {
              this.status.push(this.$props.translations.doneMessage);
              this.$emit('uploaded-patient', toRegisterPatient);
            } else {
              this.status.push(this.$props.translations.errorMessage);
              console.log(res)
            }
          })
          .catch(err => {
            this.status.push(this.$props.translations.errorMessage);
            console.log(err);
            this.error = true;
          })
          .finally(() => {
            this.loading = false;
          });
        })
        .catch(e => {
          console.log('Error getting EPR SPID',e);
          this.loading = false;
        });
      }


    }
  },
  computed: {
    /**
     * Checks if the minimum criteria for being able to perform a search are fulfilled.
     */
    enoughParameters(): boolean {
      return this.givenNames.length > 0 &&
             this.familyName.length > 0 &&
             this.localId.length > 3 &&
             this.ahvNumber.length > 12 &&
             this.birthdate.length > 0
    }
  },
  watch: {
    /**
     * Necessary to parse uppercase string input from q-select to PatientAdministrativeGender.
     */
    gender(n: string | PatientAdministrativeGender): void {
      switch (n) {
        case 'MALE':
        case 'FEMALE':
        case 'OTHER':
        case 'UNKNOWN':
          this.gender = PatientAdministrativeGender[n];
      }
    },
    /**
     * Update patient data when prop changes
     */
    patient(n: {pat: Patient, hasEpr: boolean}) {
      this.fillDataFromPatient(n.pat);
    }
  }
});
</script>

<style scoped type="text/css">
.col-4, .col-2, .col-6 {
  padding: 0.5em 0;
}
.col-2 > b, .col-2 > span {
  margin-top: 0.3em;
  display: inline-block;
}
.patient-view {
  padding: 1em;
}
.editable-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.editable-list li {
  padding-bottom: 0.6em;
}
.editable-list li:last-child {
  padding-bottom: 0;
}
.non-editable {
  padding: 0.2em 0.5em;
  border: 1pt solid #e9e9e9;
  border-radius: 0.2em;
  cursor: not-allowed;
  display: inline-block;
}
.editable {
  cursor: pointer;
  padding: 0.3em 0.5em;
  border-radius: 0.2em;
  border-color: grey;
  border-style: solid;
  border-width: 1pt;
  min-width: 5em;
  height: 2.2em;
  display: inline-block;
}
.add-delete-icon {
  top: -1pt;
  margin-left: 0.5em;
  opacity: 50%;
  cursor: pointer;
}
.add-delete-icon:hover {
  opacity: 100%;
}
.given-input {
  display: inline-flex;
  width: calc(100% - 32pt);
}
div:only-child > .given-input {
  width: calc(100% - 16pt);
}
hr {
  border-top: 1px double #8c8b8b;
  margin: 1em -1em;
}
.button-container {
  width: 100%;
  display: block;
}
.button-container > .q-btn, .message-list {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.status-list {
  list-style: none;
  display: block;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}
.status-message {
  color: $positive;
  text-align: center;
  margin-top: 0.5em;
  animation: none;
}
.last-message {
  animation: pulse 0.8s infinite;
  color: #000000;
}
.error-message {
  color: #f2c037;
}

@keyframes pulse {
	0% {
    opacity: 1;
	}
	50% {
    opacity: 0.7;
	}
	100% {
    opacity: 1;
	}
}

</style>

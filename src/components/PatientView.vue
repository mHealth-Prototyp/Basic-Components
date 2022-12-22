<template>
  <div class="patient-view">
    <div class="row">
      <div class="col-2">
        <b>
          {{ componentTranslations.nameLabel }}
        </b>
      </div>
      <div class="col-4">
        <span :class="editMode ? 'editable' : 'non-editable'">
          {{ familyName.toUpperCase() }}
        </span>
        <QPopupEdit
          v-if="editMode"
          v-model="familyName"
          auto-save
          v-slot="scope">
          <QInput
            v-model="scope.value"
            dense
            autofocus
            @keyup.enter="scope.set" />
        </QPopupEdit>
      </div>
      <div class="col-2">
        <b>
          {{ componentTranslations.genderLabel }}
        </b>
      </div>
      <div class="col-4">
        <span :class="editMode ? 'editable' : 'non-editable'">
          {{ getGenderTranslation(gender) }}
        </span>
        <QPopupEdit
          v-if="editMode"
          v-model="gender"
          auto-save
          v-slot="scope">
          <QSelect
            v-model="scope.value"
            :options="genderOptions"
            :option-label="(gender) => getGenderTranslation(gender.toLowerCase())" />
        </QPopupEdit>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <b>
          {{ componentTranslations.givenNameLabel }}
        </b>
      </div>
      <div class="col-4">
        <span :class="editMode ? 'editable' : 'non-editable'">
          {{ givenNames.map((name, index) => (index === 0 ? name.toUpperCase() : name)).join(' ') }}
        </span>
        <QPopupEdit
          v-if="editMode"
          v-model="givenNames"
          auto-save
          v-slot="scope">
          <div
            v-for="(value, index) in scope.value"
            :key="'nameInput' + index.toString()">
            <QInput
              v-model="scope.value[index]"
              dense
              class="given-input"
              :autofocus="index === 0"
              @keyup.enter="scope.set" />
            <QIcon
              v-if="scope.value.length > 1"
              name="fas fa-trash"
              class="inline-icon add-delete-icon"
              @click="() => scope.value.splice(index, 1)" />
            <QIcon
              v-if="index === scope.value.length - 1"
              name="fas fa-plus"
              class="inline-icon add-delete-icon"
              @click="() => scope.value.push('')" />
          </div>
        </QPopupEdit>
      </div>

      <div class="col-2">
        <b>
          {{ componentTranslations.birthdateLabel }}
        </b>
      </div>
      <div class="col-4">
        <span :class="editMode ? 'editable' : 'non-editable'">
          {{ birthdate ? dateFormatter.format(new Date(birthdate)) : '-' }}
        </span>
        <QPopupEdit
          v-if="editMode"
          v-model="birthdate"
          auto-save
          v-slot="scope">
          <QInput
            v-model="scope.value"
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
          {{ componentTranslations.addressLabel }}
        </b>
      </div>
      <div class="col-10">
        <ul class="editable-list">
          <li
            v-for="(address, index) in addresses"
            :key="address.toString().substring(0, 20)">
            <div>
              <span :class="editMode ? 'editable' : 'non-editable'">
                {{ address.line?.join(', ') }}{{ address.line && address.line[0] == '' ? ' ' : ',' }}
                {{ address.postalCode }} {{ address.city }}
                <QIcon
                  v-if="editMode && addresses.length > 1"
                  name="fas fa-trash"
                  class="add-delete-icon"
                  @click.stop="() => addresses.splice(index, 1)" />
              </span>
              <QIcon
                v-if="editMode && index === addresses.length - 1"
                name="fas fa-plus"
                class="add-delete-icon"
                @click.stop="() => addresses.push({line: new Array(''), city: '', postalCode: ''})" />
            </div>

            <QPopupEdit
              v-if="editMode"
              v-model="addresses[index]"
              auto-save
              v-slot="scope">
              <QInput
                v-for="(line, index) in scope.value.line"
                :key="'line' + index"
                :autofocus="index === 0"
                v-model="scope.value.line[index]"
                :label="componentTranslations.streetLabel"
                dense
                @keyup.enter="scope.set" />
              <QInput
                v-model="scope.value.postalCode"
                :label="componentTranslations.zipLabel"
                dense
                @keyup.enter="scope.set" />
              <QInput
                v-model="scope.value.city"
                :label="componentTranslations.cityLabel"
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
          {{ componentTranslations.identifiersLabel }}
        </b>
      </div>
    </div>
    <div
      class="row"
      v-if="eprSpid">
      <div class="col-2">
        {{ componentTranslations.eprSpidLabel }}
      </div>
      <div class="col-6">
        <span class="non-editable">
          {{ eprSpid }}
        </span>
      </div>
    </div>
    <div
      class="row"
      v-if="localIds">
      <div class="col-2">
        {{ componentTranslations.localIdLabel }}
      </div>
      <div class="col-6">
        <ul class="editable-list">
          <li
            v-for="(id, index) in localIds"
            :key="index.toString() + id.value"
            class="id-list">
            <div>
              <span :class="editMode ? 'editable' : 'non-editable'">
                {{ id.value }}
                <QIcon
                  v-if="editMode && localIds.length > 1"
                  name="fas fa-trash"
                  class="add-delete-icon"
                  @click="() => localIds.splice(index, 1)" />
              </span>
              <QIcon
                v-if="editMode && index === localIds.length - 1"
                name="fas fa-plus"
                class="add-delete-icon"
                @click.stop="() => localIds.push({system: epdPlaygroundUtils.getOids().local, value: ''})" />
            </div>

            <QPopupEdit
              v-if="editMode"
              v-model="localIds[index].value"
              auto-save
              v-slot="scope">
              <QInput
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set" />
            </QPopupEdit>
          </li>
        </ul>
      </div>
    </div>

    <QSeparator size="0pt" />

    <div
      class="rows"
      v-if="!editMode">
      <DocumentSearch
        :patient="patient"
        ref="documentSearch"
        :locale="settings.language"
        :demoMode="true"
        :addedDocuments="uploadedDocuments"
        @found-document="openDocument"
        :fhirUtils="fhirUtils"
        :languageString="languageString"
        :epdPlaygroundUtils="epdPlaygroundUtils"
        :componentTranslations="
          childComponentsTransalations ? childComponentsTransalations.documentSearchStrings : undefined
        " />

      <QBtn
        :label="componentTranslations.addDocumentButtonLabel"
        @click="() => (showAddDocumentPopup = true)"
        class="data-button"
        small
        v-if="!editMode" />

      <QBtn
        :label="componentTranslations.addAllergyButton"
        @click="() => (showAddAllergyPopup = true)"
        class="data-button"
        small
        v-if="!editMode" />

      <div
        v-if="uploadSuccess != undefined"
        class="upload-feedback">
        <p
          v-if="uploadSuccess"
          class="success">
          {{ componentTranslations.uploadSuccessful }}
        </p>
        <p
          v-if="!uploadSuccess"
          class="error">
          {{ componentTranslations.uploadUnsuccessful }}
        </p>
      </div>
    </div>

    <QSeparator
      size="0pt"
      v-if="!editMode" />
    <div class="rows">
      <div class="col button-container">
        <QBtn
          v-if="options && options.showEditButton"
          :label="
            editMode ? componentTranslations.saveButtonLabel || 'OK' : componentTranslations.editButtonLabel || '✎'
          "
          :loading="updatingPatient"
          @click="editPatient" />
        <QBtn
          v-if="editMode"
          :label="componentTranslations.cancelButtonLabel || 'X'"
          @click="cancelEdit" />
        <div v-if="!editMode && options">
          <QBtn
            v-for="aButton in options.actionButtons"
            :key="aButton.label"
            :label="aButton.label"
            @click="aButton.onClick(patient)" />
        </div>
      </div>
      <p
        v-if="editMode && error"
        class="warning">
        {{ componentTranslations.editUploadError }}
      </p>
      <p
        v-if="success"
        class="success">
        {{ componentTranslations.editUploadSuccess }}
      </p>
    </div>

    <QDialog
      v-model="showAddDocumentPopup"
      no-backdrop-dismiss>
      <QCard class="upload-card">
        <DocumentUpload
          :patient="patient"
          :localIdSystem="localIdSystem"
          :translations="childComponentsTransalations ? childComponentsTransalations.documentUploadStrings : undefined"
          :onDone="onUploaded"
          :fhirUtils="fhirUtils"
          :languageString="languageString"
          :epdPlaygroundUtils="epdPlaygroundUtils"
          :settings="settings" />
      </QCard>
    </QDialog>

    <QDialog
      v-model="showAddAllergyPopup"
      no-backdrop-dismiss>
      <QCard class="upload-card">
        <AllergyUpload
          :allergy-intolerance-resource="allergyToEdit"
          :patient="patient"
          :languageString="languageString"
          :localIdSystem="localIdSystem"
          :translations="childComponentsTransalations ? childComponentsTransalations.allergyUploadStrings : undefined"
          :onDone="onUploaded"
          :settings="settings"
          :fhirUtils="fhirUtils"
          :epd-playground-utils="epdPlaygroundUtils" />
      </QCard>
    </QDialog>

    <QDialog
      v-if="allergyToDisplay"
      v-model="showAllergyPopup"
      class="dialog">
      <QCard class="allergy-dialog-card">
        <QCardSection class="card-title with-close-icon">
          {{ allergyToDisplay ? getAllergyName(allergyToDisplay) : '' }}
          <q-icon
            @click="
              () => {
                showAllergyPopup = false;
                allergyToDisplay = undefined;
              }
            "
            name="fas fa-times"
            class="close-icon"
            flat
            round
            dense />
        </QCardSection>
        <QCardSection>
          <AllergyView
            :allergyIntolerance="allergyToDisplay"
            :translations="childComponentsTransalations ? childComponentsTransalations.allergyViewStrings : undefined"
            :languageString="languageString"
            :fhirUtils="fhirUtils"
            :epdPlaygroundUtils="epdPlaygroundUtils"
            :showTitle="false" />
          <QBtn
            v-if="isAllergyEditAllowed"
            :label="componentTranslations.editAllergyButton"
            @click="editAllergy"
            class="data-button"
            small />
        </QCardSection>
      </QCard>
    </QDialog>

    <q-dialog
    v-model="showDocumentBundlePopup"
    class="dialog">
    <q-card class="document-dialog-card">
      <q-card-section class="card-title with-close-icon">
        {{ componentTranslations.documentViewTitle }}
        <q-icon
          @click="
            () => {
              showDocumentBundlePopup = false;
              documentBundleToDisplay = undefined;
            }
          "
          name="fas fa-times"
          class="close-icon"
          flat
          round
          dense
          v-close-popup />
      </q-card-section>
      <q-card-section>
        <DocumentView
          :document="documentBundleToDisplay"
          :languageString="languageString" />
      </q-card-section>
    </q-card>
  </q-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {QPopupEdit, QInput, QSelect, QIcon, QSeparator, QBtn, QDialog, QCard, QCardSection} from 'quasar';
import * as fhirpath from 'fhirpath';
import {
  Identifier,
  Patient,
  PatientAdministrativeGender,
  MessageHeader,
  MessageHeaderResponseType,
  Address,
  DocumentReference,
  Bundle,
Resource,
BundleType
} from '@i4mi/fhir_r4';
import {PatientViewChildComponentsTranslationString, PatientViewTranslationStrings} from '../TranslationInterfaces';
import DocumentSearch from './DocumentSearch.vue';
import DocumentUpload from './DocumentUpload.vue';
import DocumentView from './DocumentView.vue';
import EpdPlaygroundUtils, {ITI_93_ACTION, Settings} from '../utils/epdPlaygroundUtils';
import FhirUtils, {CHAllergyIntolerance, FhirUtilLanguageType} from '../utils/fhirUtils';
import AllergyUpload from './AllergyUpload.vue';
import {ALLERGY_IDENTIFICATION_CODES} from '../utils/allergyCodes';
import AllergyView from './AllergyView.vue';
import * as DE from '../assets/de.json';
import * as FR from '../assets/fr.json';

// Intstantiate class of interface to iterate translation keys
class PatientViewTranslations implements PatientViewTranslationStrings {
  nameLabel = '';
  givenNameLabel = '';
  genderLabel = '';
  birthdateLabel = '';
  identifiersLabel = '';
  localIdLabel = '';
  eprSpidLabel = '';
  addressLabel = '';
  streetLabel = '';
  zipLabel = '';
  cityLabel = '';
  maleGender = '';
  femaleGender = '';
  otherGender = '';
  unknownGender = '';
  editButtonLabel = '';
  saveButtonLabel = '';
  cancelButtonLabel = '';
  editUploadError = '';
  editUploadSuccess = '';
  openPrompt1 = '';
  openPrompt2 = '';
  addDocumentButtonLabel = '';
  uploadSuccessful = '';
  uploadUnsuccessful = '';
  addAllergyButton = '';
  editAllergyButton = '';
  documentViewTitle = '';
}

/**
 * Options for PatientView component
 * @param showEditButton  determines if the edit button is shown
 *                        and thus the patient data can be edited
 * @param actionButtons   array of possible buttons to be displayed
 *                        on the bottom of the page.
 *                        needs properties:
 *                        - label: the string to be displayed on the button
 *                        - onClick: callback method to be called with the patient
 *                          resource as an argument when the button is clicked
 */
interface PatientViewOptions {
  showEditButton: boolean;
  actionButtons: {
    label: string;
    onClick: (pat: Patient) => void;
  }[];
}

// how long to show upload message in seconds
const UPLOAD_MESSAGE_TIMER = 5;

// true when edit allergy button should be visible
const SHOW_EDIT_ALLERGY_BUTTON = false;

/**
 * Shows patient details including documents.
 * Also provides functionality to edit patient & upload documents (uses DocumentUpload.vue & DocumentSearch.vue).
 */
export default defineComponent({
  name: 'PatientView',
  components: {
    AllergyUpload,
    AllergyView,
    DocumentSearch,
    DocumentUpload,
    QPopupEdit,
    QInput,
    QSelect,
    QIcon,
    QSeparator,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    DocumentView
  },
  data() {
    return {
      givenNames: new Array<string>(),
      showAllergyPopup: false,
      allergyToDisplay: undefined as CHAllergyIntolerance | undefined,
      showDocumentBundlePopup: false,
      documentBundleToDisplay: undefined as Bundle | undefined,
      allergyToEdit: undefined as CHAllergyIntolerance | undefined,
      familyName: '',
      gender: PatientAdministrativeGender.UNKNOWN,
      // Administrative gender of the patient
      birthdate: '',
      addresses: new Array<Address>(),
      eprSpid: '',
      mpiId: '',
      localIds: new Array<Identifier>(),
      editMode: false,
      showAddDocumentPopup: false,
      showAddAllergyPopup: false,
      updatingPatient: false,
      historyPatient: {resourceType: 'Patient'} as Patient,
      uploadedDocuments: new Array<DocumentReference>(),
      dateFormatter: new Intl.DateTimeFormat(this.settings.language),
      // helper for formating date according to locale
      genderOptions: new Array<PatientAdministrativeGender>(),
      // list of available choices in the gender dropdown
      documentSearchDemoMode: true,
      localIdSystem: {
        urn: this.epdPlaygroundUtils.getOids().local,
        display: ''
      },
      error: false,
      success: false, // indicates successful updating
      uploadSuccess: undefined as boolean | undefined, // indicates success or failure of upload
      componentTranslations: new PatientViewTranslations() // contains default translations from library but can be oberwritten individually via translations prop
    };
  },
  i18n: {
    messages: {
      'de-CH': Object.assign({}, DE.patientView, {
        nameLabel: DE.common.name,
        birthdateLabel: DE.common.birthdate,
        identifiersLabel: DE.common.identifier,
        localIdLabel: DE.common.localPid,
        eprSpidLabel: DE.common.eprSpid,
        streetLabel: DE.common.street,
        zipLabel: DE.common.zip,
        cityLabel: DE.common.city,
        maleGender: DE.common.genderMale,
        femaleGender: DE.common.genderFemale,
        otherGender: DE.common.genderOther,
        unknownGender: DE.common.genderUnknown,
        cancelButtonLabel: DE.common.cancel
      }),
      'fr-CH': Object.assign({}, FR.patientView, {
        nameLabel: FR.common.name,
        birthdateLabel: FR.common.birthdate,
        identifiersLabel: FR.common.identifier,
        localIdLabel: FR.common.localPid,
        eprSpidLabel: FR.common.eprSpid,
        streetLabel: FR.common.street,
        zipLabel: FR.common.zip,
        cityLabel: FR.common.city,
        maleGender: FR.common.genderMale,
        femaleGender: FR.common.genderFemale,
        otherGender: FR.common.genderOther,
        unknownGender: FR.common.genderUnknown,
        cancelButtonLabel: FR.common.cancel
      })
    }
  },
  props: {
    /**
     * The Patient resource to be displayed (and possibly edited).
     */
    patient: {
      type: Object as PropType<Patient>,
      required: true
    },
    /**
     * Strings to overwrite default translations of component. Overwrite by individual keys is supported.
     * @see   PatientViewTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<PatientViewTranslationStrings>,
      required: false
    },
    /**
     * Strings to overwrite default translations of child components.
     * @see   PatientViewChildComponentsTranslationString interface for details
     */
    childComponentsTransalations: {
      type: Object as PropType<PatientViewChildComponentsTranslationString>,
      required: false
    },
    /**
     * Options for the component.
     * @see   PatientViewOptions interface for details
     */
    options: {
      type: Object as PropType<PatientViewOptions>,
      required: false
    },
    /**
     * Project settings.
     */
    settings: {
      type: Object as PropType<Settings>,
      required: true
    },
    /**
     * Two-character representation for the current language. Must be one of
     * 'de' | 'en' | 'fr' | 'it' | 'rm'. Default is 'de'.
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
    }
  },
  emits: {
    /**
     * Notifies parent component about updated patient. Emitted after successful upload of patient data.
     */
    'edited-patient': (payload: Patient) => {
      return payload !== undefined;
    }
  },
  beforeMount() {
    for (var gender in PatientAdministrativeGender) {
      this.genderOptions.push(gender as PatientAdministrativeGender);
    }
    this.fillDataFromPatient(this.$props.patient);

    // write organization name to localIdSystem, if available
    this.localIdSystem.display = this.settings.organization.name || this.localIdSystem.display;

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
     * Method called by the edit Button. Toggles editMode, and
     * updates the changes on the EPD playground.
     * On successful edit, the edited-patient Event is emitted.
     */
    editPatient() {
      this.documentSearchDemoMode = false; // quicker update after edit
      if (this.editMode) {
        this.settings.organization.id = this.settings.organization.id || '1';
        this.error = false;
        this.updatingPatient = true;
        const pat: Patient = this.$props.patient;
        if (pat.name && pat.name[0]) {
          pat.name[0].family = this.familyName;
          pat.name[0].given = this.givenNames.filter((name) => name !== '');
        } else {
          pat.name = [
            {
              family: this.familyName,
              given: this.givenNames
            }
          ];
        }
        pat.address = this.addresses.filter((a) => a.city !== '' && a.postalCode !== '');
        pat.gender = this.gender;
        pat.birthDate = this.birthdate;
        const oids = this.epdPlaygroundUtils.getOids();
        const foreignIdentifiers =
          pat.identifier?.filter((i) => {
            i.system !== oids.mpiId && i.system !== oids.eprSpid && i.system !== oids.local;
          }) || [];
        pat.identifier = (
          [
            {
              system: oids.mpiId,
              value: this.mpiId
            },
            {
              system: oids.eprSpid,
              value: this.eprSpid
            }
          ] as Identifier[]
        )
          .concat(this.localIds.filter((id) => id.value !== ''))
          .concat(foreignIdentifiers);
        pat.contained = [this.settings.organization];
        pat.managingOrganization = {
          reference: '#' + this.settings.organization.id
        };
        this.epdPlaygroundUtils
          .useITI93(pat, ITI_93_ACTION.UPDATE)
          .then((response) => {
            if (
              response.entry &&
              response.entry[0] &&
              response.entry[0].resource &&
              (response.entry[0].resource as MessageHeader).response?.code == MessageHeaderResponseType.OK
            ) {
              this.historyPatient = pat;
              this.$emit('edited-patient', pat);
              this.success = true;
              this.editMode = false;
            } else {
              this.error = true;
            }
            this.updatingPatient = false;
          })
          .catch((e) => {
            this.error = true;
            this.updatingPatient = false;
            console.log('Error updating Patient ' + this.givenNames[0] + ' ' + this.familyName, e);
          });
      } else {
        this.editMode = true;
        this.success = false;
      }
    },
    /**
     * Cancels edit mode and resets all data to the previous state.
     */
    cancelEdit() {
      this.editMode = false;
      this.fillDataFromPatient(this.historyPatient);
    },
    /**
     * Helper to get gender translation string.
     */
    getGenderTranslation(gender: string): string {
      let genderString = this.componentTranslations.unknownGender;
      switch (gender) {
        case 'male':
          genderString = this.componentTranslations.maleGender;
          break;
        case 'female':
          genderString = this.componentTranslations.femaleGender;
          break;
        case 'other':
          genderString = this.componentTranslations.otherGender;
          break;
      }
      return genderString;
    },
    /**
     * Populates the component state from a Patient resource (e.g. from the props, or from
     * a previous state).
     */
    fillDataFromPatient(pat: Patient): void {
      const oids = this.epdPlaygroundUtils.getOids();
      this.givenNames = (fhirpath.evaluate(pat, 'Patient.name.first().given') as string[]) || [];
      this.familyName = (fhirpath.evaluate(pat, 'Patient.name.first().family') as string[])[0] || '';
      this.gender = pat.gender || PatientAdministrativeGender.UNKNOWN;
      this.birthdate = pat.birthDate || '';
      this.addresses = pat.address || [];
      this.eprSpid = pat.identifier?.find((i) => i.system === oids.eprSpid)?.value || '';
      this.mpiId = pat.identifier?.find((i) => i.system === oids.mpiId)?.value || '';
      this.localIds = pat.identifier?.filter((i) => i.system === oids.local) || [];
      this.historyPatient = JSON.parse(JSON.stringify(pat)) as Patient;
    },
    /**
     * Opens a new window for a document selected in the SearchDocument component.
     * @param event   the Event as emitted from the SearchDocument component.
     */
    openDocument(event: {document: string; metadata: DocumentReference}) {
      const document = event.document;
      const documentReference = event.metadata;
      const resource = JSON.parse(document) as Resource;

      if (this.checkIfIsAllergy(documentReference)) {
        this.showAllergyPopup = true;
        this.allergyToDisplay = resource as CHAllergyIntolerance;
      } else if(this.checkIfIsDocumentBundle(resource)) {
        this.showDocumentBundlePopup = true;
        this.documentBundleToDisplay = JSON.parse(document) as Bundle;
      }
      else {
        if (
          confirm(
            this.componentTranslations.openPrompt1 +
              (documentReference.description || '?') +
              this.componentTranslations.openPrompt2
          )
        ) {
          window.open(documentReference.content[0].attachment.url);
        }
      }
    },
    /**
     * Checks if a DocumentReference includes a CH AllergyIntolerance resource as JSON
     * @param document  the DocumentReference in question
     * @returns         true if the content is application/fhir+json and the coding is
     *                  Snomed CT 722446000 (allergy record)
     */
    checkIfIsAllergy(document: DocumentReference): boolean {
      return (
        document.content[0].attachment.contentType === 'application/fhir+json' &&
        document.type !== undefined &&
        document.type.coding !== undefined &&
        document.type.coding.findIndex((coding) => {
          return coding.code === '722446000';
        }) > -1
      );
    },
    /**
     * Gets the localised name of an allergy.
     * @param allergy a CH AllergyIntolerance resouce
     * @returns       a string with the localised allergy name
     */
    getAllergyName(allergy: CHAllergyIntolerance): string {
      const allergyCoding = allergy.code.coding?.find(
        (coding) => coding.system && coding.system === 'http://snomed.info/sct'
      );
      if (allergyCoding && allergyCoding.code) {
        const code = ALLERGY_IDENTIFICATION_CODES.find((code) => code.defaultCoding.code === allergyCoding.code);
        return (
          code?.languageDisplays[
            this.languageString || (this.settings.language.substring(0, 2) as FhirUtilLanguageType)
          ] || '?'
        );
      }
      return '?';
    },
    /**
     * Checks if a Resource is a document bundle.
     * @param res  the resource in question.
     * @returns true if the content is bundle with type document.
     */
    checkIfIsDocumentBundle(res: Resource): boolean {
      if (res.resourceType === 'Bundle' && (res as Bundle).type === BundleType.DOCUMENT) {
        return true;
      }
      return false;
    },
    /**
     * Handles the upload result of the DocumentUpload and AllergyUpload component.
     * Also closes component views after upload or when cancelled by user.
     */
    onUploaded(bundle?: Bundle) {
      this.showAddDocumentPopup = false;
      this.showAddAllergyPopup = false;

      if (this.allergyToEdit) {
        // reset if necessary
        this.allergyToEdit = undefined;
      }

      if (!bundle) {
        // no bundle provided: user canceled
        return;
      }

      const reference = bundle.entry?.find((e) => e.response?.location?.includes('DocumentReference'));

      if (reference) {
        const id = reference.response?.location?.split('/')[1];
        if (id) {
          this.epdPlaygroundUtils
            .fetchDocumentReference(id)
            .then((ref) => {
              this.uploadedDocuments.push(ref);
              this.uploadSuccess = true;
            })
            .catch((e) => {
              console.log('couldnt fetch DocumentReference', e);
              this.uploadSuccess = false;
            });
        }
      } else {
        this.uploadSuccess = false;
      }

      setTimeout(() => {
        this.uploadSuccess = undefined;
      }, UPLOAD_MESSAGE_TIMER * 1000);
    },
    /**
     * Copies currently shown allergy resource to pass it to AllergyUpload component.
     */
    editAllergy() {
      this.allergyToEdit = Object.assign({}, this.allergyToDisplay);
      this.allergyToDisplay = undefined;
      this.showAddAllergyPopup = true;
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
    }
  },
  computed: {
    /**
     * Returns true when allergy edit button is shown.
     */
    isAllergyEditAllowed(): boolean {
      return SHOW_EDIT_ALLERGY_BUTTON;
    }
  }
});
</script>

<style scoped type="text/css">
.col-4,
.col-2,
.col-6 {
  padding: 0.5em 0;
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
  padding: 0.3em 0.5em;
  border: 1pt solid white;
}
.editable {
  cursor: pointer;
  padding: 0.3em 0.5em;
  border-radius: 0.2em;
  border-color: grey;
  border-style: solid;
  border-width: 1pt;
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
.button-container > .q-btn,
.button-container > div {
  margin: 0.5em 1em;
  display: inline;
}
.button-container > div > .q-btn {
  margin-right: 1em;
}
.upload-card {
  padding: 1em;
  width: 80vw;
  max-width: 650pt;
}
.warning {
  color: #f2c037;
  text-align: center;
  margin-top: 1.5em;
}
.success {
  color: #4c9f70;
  text-align: center;
  margin-top: 1.5em;
}
.data-button {
  margin-top: 1em;
  align-self: end;
  display: block;
  margin-left: auto;
  margin-right: 0;
}
.upload-feedback {
  margin-top: 1em;
}
.upload-feedback p {
  text-align: center;
}
.upload-feedback p.success {
  color: #4c9f70;
}
.upload-feedback p.error {
  color: #c10015;
}

.card-title.with-close-icon {
  padding-right: 2em;
}
.close-icon {
  cursor: pointer;
  color: #000000;
  right: 0.5em;
  top: 0.5em;
  position: absolute;
}
.close-icon:hover {
  opacity: 0.5;
}
.allergy-dialog-card {
  width: 60%;
  min-width: 300px;
}
.document-dialog-card {
  max-width: 600px;
  width: 100%;
}
</style>

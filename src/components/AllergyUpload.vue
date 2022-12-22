<template>
  <div class="allergy-upload">
    <QStepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated>
      <QStep
        :name="1"
        :title="componentTranslations.substance"
        :done="step > 1">
        <div class="row">
          <div class="col no-allergies-checkbox">
            <QCheckbox
              v-model="noAllergiesCheckbox"
              size="sm" />
          </div>

          <div class="col no-allergies-checkbox-text">
            <p class="no-allergies-text">
              {{ componentTranslations.noKnownAllergies }}
            </p>
          </div>
        </div>

        <div
          class="row"
          v-if="noAllergiesCheckbox">
          <div class="col">
            <QSelect
              v-model="noAllergiesSelect"
              :options="noAllergiesOptions"
              :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="componentTranslations.noKnownAllergiesMoreDetail + ' *'"
              dense />
          </div>
        </div>

        <div
          class="row"
          v-if="!noAllergiesCheckbox">
          <QSelect
            v-model="typeSelect"
            :options="typeOptions"
            :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
            :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
            :label="componentTranslations.type"
            class="input-with-tooltip"
            dense
            clearable />
          <div class="tooltip">
            <QIcon name="fas fa-question-circle">
              <QTooltip>{{ componentTranslations.typeTooltip }}</QTooltip>
            </QIcon>
          </div>
        </div>

        <div
          class="row"
          v-if="!noAllergiesCheckbox">
          <QSelect
            v-model="allergyCodeSelect"
            :rules="[(val) => !!val || componentTranslations.fieldRequired]"
            :options="allergyCodeFilteredOptions"
            :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
            :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
            @filter="filterAllergyCodeSelect"
            :label="componentTranslations.allergicFor + ' *'"
            stack-label
            :placeholder="allergyCodeSelect ? '' : componentTranslations.searchPlaceholder"
            class="input-with-tooltip"
            use-input
            dense
            clearable>
            <template v-slot:no-option>
              <QItem>
                <QItemSection class="text-grey">
                  {{ componentTranslations.noResults }}
                </QItemSection>
              </QItem>
            </template>
          </QSelect>
          <div class="tooltip">
            <QIcon name="fas fa-question-circle">
              <QTooltip>{{ componentTranslations.substanceTooltip }}</QTooltip>
            </QIcon>
          </div>
        </div>

        <div
          class="row"
          v-if="!noAllergiesCheckbox">
          <QSelect
            v-model="allergyCategorySelect"
            :options="allergyCategoryOptions"
            multiple
            :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
            :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
            :label="componentTranslations.category"
            class="input-with-tooltip"
            dense
            clearable />
          <div class="tooltip">
            <QIcon name="fas fa-question-circle">
              <QTooltip>{{ componentTranslations.categoryTooltip }}</QTooltip>
            </QIcon>
          </div>
        </div>

        <div class="row">
          <QSelect
            v-model="clinicalStatusSelect"
            :options="clinicalStatusOptions"
            :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
            :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
            :label="componentTranslations.clinicalStatus + (needsClinicalStatus ? '*' : '')"
            class="input-with-tooltip"
            dense
            clearable />
          <div class="tooltip">
            <QIcon name="fas fa-question-circle">
              <QTooltip>{{ componentTranslations.clinicalStatusTooltip }}</QTooltip>
            </QIcon>
          </div>
        </div>

        <div
          class="row"
          v-if="!noAllergiesCheckbox">
          <QSelect
            v-model="criticalitySelect"
            :options="criticalityOptions"
            :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
            :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
            :label="componentTranslations.criticality"
            class="input-with-tooltip"
            dense
            clearable />
          <div class="tooltip">
            <QIcon name="fas fa-question-circle">
              <QTooltip>{{ componentTranslations.criticalityTooltip }}</QTooltip>
            </QIcon>
          </div>
        </div>

        <div class="row">
          <QSelect
            v-model="verificationStatusSelect"
            :options="verificationStatusOptions"
            :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
            :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
            :label="componentTranslations.verificationStatus"
            class="input-with-tooltip"
            dense
            clearable />
          <div class="tooltip">
            <QIcon name="fas fa-question-circle">
              <QTooltip>{{ componentTranslations.verificationStatusTooltip }}</QTooltip>
            </QIcon>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <QInput
              v-model="identificationDateInput"
              :label="componentTranslations.dateOfIdentification"
              dense>
              <template v-slot:append>
                <QIcon name="fas fa-calendar-day">
                  <QPopupProxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <QDate
                      v-model="identificationDateInput"
                      mask="YYYY-MM-DD" />
                  </QPopupProxy>
                </QIcon>
              </template>
            </QInput>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <QInput
              v-model="commentInput"
              :label="componentTranslations.comment"
              autogrow
              filled
              dense />
          </div>
        </div>

        <QStepperNavigation>
          <QBtn
            @click="continueFromFirstStep()"
            :disabled="!readyFirstStep"
            :label="componentTranslations.continue"
            color="primary"
            dense />
        </QStepperNavigation>
      </QStep>

      <QStep
        :name="2"
        :title="componentTranslations.episode"
        :done="step > 2"
        v-if="!noAllergiesCheckbox">
        <template v-if="!isAddEpisodeFormShown">
          <QTable
            :title="componentTranslations.episodeTableTitle"
            :rows="episodes"
            :columns="episodeColumns"
            :pagination="{rowsPerPage: 10}"
            @row-click="selectEpisode"
            dense />
          <QBtn
            flat
            @click="isAddEpisodeFormShown = true"
            color="primary"
            :label="componentTranslations.addEpisodeButtonLabel" />
        </template>

        <div v-if="isAddEpisodeFormShown">
          <div class="section">
            <h3>{{ componentTranslations.reaction }}</h3>
            <div class="col">
              <QInput
                v-model="reactionDateInput"
                :label="componentTranslations.reactionDate"
                dense>
                <template v-slot:append>
                  <QIcon name="fas fa-calendar-day">
                    <QPopupProxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <QDate
                        v-model="reactionDateInput"
                        mask="YYYY-MM-DD" />
                    </QPopupProxy>
                  </QIcon>
                </template>
              </QInput>
            </div>

            <div class="row">
              <div class="col">
                <QInput
                  v-model="reactionDescriptionInput"
                  :label="componentTranslations.description"
                  dense />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <QInput
                  v-model="reactionDurationInput"
                  :label="componentTranslations.duration"
                  type="number"
                  :rules="[(val) => !val || val == 0 || val > 0 || componentTranslations.positiveValuesAllowed]"
                  dense />
              </div>
            </div>

            <div class="row">
              <QSelect
                v-model="reactionSubstanceSelect"
                :options="reactionSubstanceFilteredOptions"
                :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                @filter="filterReactionSubstanceSelect"
                :label="componentTranslations.substance"
                :placeholder="reactionSubstanceSelect ? '' : componentTranslations.searchPlaceholder"
                class="input-with-tooltip"
                use-input
                dense
                clearable>
                <template v-slot:no-option>
                  <QItem>
                    <QItemSection class="text-grey">
                      {{ componentTranslations.noResults }}
                    </QItemSection>
                  </QItem>
                </template>
              </QSelect>
              <div class="tooltip">
                <QIcon name="fas fa-question-circle">
                  <QTooltip>{{ componentTranslations.reactionSubstanceTooltip }}</QTooltip>
                </QIcon>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <QSelect
                  v-model="reactionCertaintySelect"
                  :options="reactionCertaintyOptions"
                  :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                  :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                  :label="componentTranslations.certainty"
                  dense
                  clearable />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <QSelect
                  v-model="reactionSeveritySelect"
                  :options="reactionSeverityOptions"
                  :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                  :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                  :label="componentTranslations.reactionSeverity"
                  dense
                  clearable />
              </div>
            </div>

            <div class="row">
              <QSelect
                v-model="reactionManifestationSelect"
                :rules="[(val) => !!val || componentTranslations.fieldRequired]"
                :options="reactionManifestationFilteredOptions"
                :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                @filter="filterReactionManifestationSelect"
                :label="componentTranslations.manifestation + ' *'"
                :placeholder="reactionManifestationSelect ? '' : componentTranslations.searchPlaceholder"
                class="input-with-tooltip"
                use-input
                multiple
                dense
                clearable>
                <template v-slot:no-option>
                  <QItem>
                    <QItemSection class="text-grey">
                      {{ componentTranslations.noResults }}
                    </QItemSection>
                  </QItem>
                </template>
              </QSelect>
              <div class="tooltip">
                <QIcon name="fas fa-question-circle">
                  <QTooltip>{{ componentTranslations.reactionManifestationTooltip }}</QTooltip>
                </QIcon>
              </div>
            </div>

            <div class="row">
              <QSelect
                v-model="reactionLocationSelect"
                :options="reactionLocationFilteredOptions"
                :option-label="(item) => (item == null ? '?' : item.display)"
                :option-value="(item) => (item == null ? null : item.code)"
                @filter="filterReactionLocationSelect"
                :label="componentTranslations.location"
                :placeholder="reactionLocationSelect ? '' : componentTranslations.searchPlaceholder"
                class="input-with-tooltip"
                use-input
                dense
                clearable>
                <template v-slot:no-option>
                  <QItem>
                    <QItemSection class="text-grey">
                      {{ componentTranslations.noResults }}
                    </QItemSection>
                  </QItem>
                </template>
              </QSelect>
              <div class="tooltip">
                <QIcon name="fas fa-question-circle">
                  <QTooltip>{{ componentTranslations.reactionLocationTooltip }}</QTooltip>
                </QIcon>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>{{ componentTranslations.exposure }}</h3>

            <div class="col">
              <QInput
                v-model="exposureDateInput"
                :label="componentTranslations.exposureDate">
                <template v-slot:append>
                  <QIcon name="fas fa-calendar-day">
                    <QPopupProxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <QDate
                        v-model="exposureDateInput"
                        mask="YYYY-MM-DD" />
                    </QPopupProxy>
                  </QIcon>
                </template>
              </QInput>
            </div>

            <div class="row">
              <div class="col">
                <QInput
                  v-model="exposureDescriptionInput"
                  :label="componentTranslations.description"
                  dense />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <QInput
                  v-model="exposureDurationInput"
                  :label="componentTranslations.duration"
                  type="number"
                  :rules="[(val) => !val || val == 0 || val > 0 || componentTranslations.positiveValuesAllowed]"
                  dense />
              </div>
            </div>

            <div class="row">
              <QSelect
                v-model="exposurePathSelect"
                :options="exposurePathFilteredOptions"
                :option-label="(item) => (item == null ? '?' : item.display)"
                :option-value="(item) => (item == null ? null : item.code)"
                @filter="filterExposurePathSelect"
                :label="componentTranslations.exposurePath"
                :placeholder="exposurePathSelect ? '' : componentTranslations.searchPlaceholder"
                class="input-with-tooltip"
                use-input
                dense
                clearable>
                <template v-slot:no-option>
                  <QItem>
                    <QItemSection class="text-grey">
                      {{ componentTranslations.noResults }}
                    </QItemSection>
                  </QItem>
                </template>
              </QSelect>
              <div class="tooltip">
                <QIcon name="fas fa-question-circle">
                  <QTooltip>{{ componentTranslations.exposurePathTooltip }}</QTooltip>
                </QIcon>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <QInput
                  v-model="episodeCommentInput"
                  :label="componentTranslations.episodeComment"
                  autogrow
                  filled
                  dense />
              </div>
            </div>
          </div>

          <div class="button-container">
            <QBtn
              @click="closeEpisodeForm()"
              :label="componentTranslations.cancelButtonLabel" />
            <QBtn
              @click="deleteEpisode()"
              v-if="isEpisodeInEditMode"
              :label="componentTranslations.deleteEpisodeButtonLabel" />
            <QBtn
              @click="setEpisodeValues(true)"
              v-if="!isEpisodeInEditMode"
              :disabled="!readyAddEpisode"
              color="primary"
              :label="componentTranslations.saveEpisodeButtonLabel"
              class="q-ml-sm" />
            <QBtn
              @click="setEpisodeValues(false)"
              v-if="isEpisodeInEditMode"
              :disabled="!readyAddEpisode"
              color="primary"
              :label="componentTranslations.updateEpisodeButtonLabel"
              class="q-ml-sm" />
          </div>
        </div>

        <QStepperNavigation v-if="!isAddEpisodeFormShown">
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
            :disable="false"
            class="q-ml-sm" />
        </QStepperNavigation>
      </QStep>

      <QStep
        :name="3"
        :title="componentTranslations.creatingInstitution">
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
            @click="backFromLastStep()"
            color="primary"
            :label="componentTranslations.back" />
        </QStepperNavigation>
      </QStep>
    </QStepper>

    <div class="button-container">
      <QBtn
        @click="() => onDone()"
        :label="componentTranslations.cancelButtonLabel" />
      <QBtn
        :disabled="!readyForUpload"
        @click="uploadAllergy"
        :color="readyForUpload ? 'primary' : undefined"
        :label="componentTranslations.uploadButtonLabel + patientName" />
      <p v-if="$props.allergyIntoleranceResource">{{ componentTranslations.allergyUpdateNotSupported }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {
  QStepper,
  QStep,
  QCheckbox,
  QSelect,
  QIcon,
  QTooltip,
  QItem,
  QItemSection,
  QInput,
  QPopupProxy,
  QBtn,
  QDate,
  QStepperNavigation,
  QTable,
  QTableColumn
} from 'quasar';
import {
  AllergyIntoleranceCategory,
  AllergyIntoleranceCriticality,
  AllergyIntoleranceSeverity,
  AllergyIntoleranceType,
  Bundle,
  BundleType,
  CodeableConcept,
  Coding,
  Duration,
  Organization,
  Patient
} from '@i4mi/fhir_r4';
import FhirUtils, {
  AllergyIntoleranceReactionCH,
  SystemCode,
  SystemCodeExtension,
  FhirUtilLanguageType,
  AllergyIntoleranceParams,
  Iti65Metadata,
  CHAllergyIntolerance,
  ITI_65_AUTHOR_ROLE,
  ALLERGYINTOLERANCE_DURATION_URL,
  ALLERGYINTOLERANCE_CERTAINTY_URL,
  OPENEHR_EXPOSURE_DATE_URL,
  OPENEHR_EXPOSURE_DESCIPTION_URL,
  OPENEHR_EXPOSURE_LOCATION_URL,
  OPENEHR_EXPOSURE_DURATION_URL,
  OPENEHR_EXPOSURE_MANAGEMENT_URL
} from '../utils/fhirUtils';
import {
  AllergyIdentificationType,
  AllergySystemCodeExtension,
  ALLERGY_TYPE,
  CLINICAL_STATUS_CODES,
  CRITICALITY_CODES,
  EXPOSURE_PATH_CODES,
  getAllergyIdentificationCodesByType,
  REACTION_CERTAINTY_CODES,
  REACTION_LOCATION_CODES,
  REACTION_MANIFESTATION_CODES,
  REACTION_SEVERITY_CODES,
  REACTION_SUBSTANCE_CODES,
  CATEGORY_CODES,
  VERIFICATION_STATUS_CODES
} from '../utils/allergyCodes';
import {AllergyUploadTranslationStrings} from '../TranslationInterfaces';
import EpdPlaygroundUtils, {Iti65DocumentBundle, Settings} from '../utils/epdPlaygroundUtils';
import {FACILITY_CLASS_CODES, PRACTICE_SETTING_CODES} from '../utils/snomedCodes';
import {v4 as uuid} from 'uuid';
import * as DE from '../assets/de.json';
import * as FR from '../assets/fr.json';

// Intstantiate class of interface to iterate translation keys
class AllergyUploadTranslations implements AllergyUploadTranslationStrings {
  noKnownAllergies = '';
  noKnownAllergiesMoreDetail = '';
  category = '';
  clinicalStatus = '';
  clinicalStatusTooltip = '';
  verificationStatus = '';
  verificationStatusTooltip = '';
  comment = '';
  cancelButtonLabel = '';
  uploadButtonLabel = '';
  continue = '';
  back = '';
  noResults = '';
  type = '';
  typeTooltip = '';
  substance = '';
  substanceTooltip = '';
  categoryTooltip = '';
  criticality = '';
  criticalityTooltip = '';
  dateOfIdentification = '';
  episode = '';
  episodeTableTitle = '';
  reactionDate = '';
  exposureDate = '';
  manifestation = '';
  duration = '';
  durationReaction = '';
  reactionSeverity = '';
  location = '';
  description = '';
  addEpisodeButtonLabel = '';
  updateEpisodeButtonLabel = '';
  deleteEpisodeButtonLabel = '';
  reaction = '';
  reactionSubstanceTooltip = '';
  certainty = '';
  reactionManifestationTooltip = '';
  reactionLocationTooltip = '';
  exposure = '';
  exposurePath = '';
  exposurePathTooltip = '';
  episodeComment = '';
  saveEpisodeButtonLabel = '';
  creatingInstitution = '';
  creatingInstitutionText = '';
  institution = '';
  specialisation = '';
  specialisationText = '';
  searchPlaceholder = '';
  fieldRequired = '';
  allergicFor = '';
  positiveValuesAllowed = '';
  allergyUpdateNotSupported = '';
}

/**
 * Provides UI to create an allergy data entry and upload it in fhir format as json file.
 */
export default defineComponent({
  name: 'AllergyUpload',
  components: {
    QStepper,
    QStep,
    QCheckbox,
    QSelect,
    QIcon,
    QTooltip,
    QItem,
    QItemSection,
    QInput,
    QPopupProxy,
    QBtn,
    QDate,
    QStepperNavigation,
    QTable
  },
  data() {
    return {
      step: 1, // model for step of stepper
      currentPatient: {} as Patient, // the patient as FHIR resource of the allergy report
      noAllergiesCheckbox: false, // model for not having any allergy or intolerance
      noAllergiesSelect: undefined as SystemCodeExtension | undefined,
      // model for no known allergies
      noAllergiesOptions: getAllergyIdentificationCodesByType([AllergyIdentificationType.SITUATION]),
      // options for no known allergies
      typeSelect: undefined as SystemCodeExtension | undefined,
      // model for allergy type
      typeOptions: ALLERGY_TYPE,
      // options for allergy type
      allergyCodeSelect: undefined as AllergySystemCodeExtension | undefined,
      // search model for allergy code
      allergyCodeOptions: getAllergyIdentificationCodesByType([
        AllergyIdentificationType.DISORDER,
        AllergyIdentificationType.FINDING,
        AllergyIdentificationType.MEDICINAL_PRODUCT,
        AllergyIdentificationType.ORGANISM,
        AllergyIdentificationType.PHYSICAL_OBJECT,
        AllergyIdentificationType.SUBSTANCE
      ]),
      // all possible options for allergy code search
      allergyCodeFilteredOptions: undefined as Array<AllergySystemCodeExtension> | undefined,
      // options according to filter for substance search
      allergyCategorySelect: undefined as Array<SystemCodeExtension> | undefined,
      // model for allergy category
      allergyCategoryOptions: CATEGORY_CODES,
      // options for allergy category
      clinicalStatusSelect: undefined as SystemCodeExtension | undefined,
      // model for clinical status
      clinicalStatusOptions: CLINICAL_STATUS_CODES,
      // options for clinical status
      criticalitySelect: undefined as SystemCodeExtension | undefined,
      // model for criticality
      criticalityOptions: CRITICALITY_CODES,
      // options for criticality
      verificationStatusSelect: undefined as SystemCodeExtension | undefined,
      // model for verification status
      verificationStatusOptions: VERIFICATION_STATUS_CODES,
      // options for verification status
      identificationDateInput: '', // model for input of date of indetification
      commentInput: '', // model for the comment
      episodesData: new Array<AllergyIntoleranceReactionCH>(),
      // the episodes for an intolerance
      episodeColumns: new Array<QTableColumn>(),
      isAddEpisodeFormShown: false, // true when form to add episode is visible
      isEpisodeInEditMode: false, // true when episode entry is in edit mode
      currentEpisodeIdInEdit: '', // id of episode entry in edit (only for editing episodes)
      reactionDateInput: '', // model for reaction date input
      reactionDescriptionInput: '', // model for reaction description input
      reactionDurationInput: undefined as number | undefined,
      // model for reaction duration input
      reactionSubstanceSelect: undefined as AllergySystemCodeExtension | undefined,
      // select model for reaction substance
      reactionSubstanceOptions: REACTION_SUBSTANCE_CODES,
      // options for reaction substance
      reactionSubstanceFilteredOptions: undefined as Array<AllergySystemCodeExtension> | undefined,
      // options according to filter for substance search of a reaction
      reactionSeveritySelect: undefined as SystemCodeExtension | undefined,
      // model for severity of a reaction select
      reactionSeverityOptions: REACTION_SEVERITY_CODES,
      // options for severity of a reaction select
      reactionCertaintySelect: undefined as SystemCodeExtension | undefined,
      // model for certainty of a reaction select
      reactionCertaintyOptions: REACTION_CERTAINTY_CODES,
      // options for certainty of a reaction select
      reactionManifestationSelect: undefined as Array<SystemCodeExtension> | undefined,
      // select model for reaction manifestation
      reactionManifestationOptions: REACTION_MANIFESTATION_CODES,
      // options for reaction manifestation
      reactionManifestationFilteredOptions: undefined as Array<SystemCodeExtension> | undefined,
      // options according to filter for manifestation search of a reaction
      reactionLocationSelect: undefined as SystemCode | undefined,
      // select model for reaction location
      reactionLocationOptions: REACTION_LOCATION_CODES,
      // options for reaction location
      reactionLocationFilteredOptions: undefined as Array<SystemCode> | undefined,
      // options according to filter for location search of a reaction
      exposureDateInput: '', // model for exposure date input
      exposureDescriptionInput: '', // model for exposure description input
      exposureDurationInput: undefined as number | undefined,
      // model for exposure duration input
      exposurePathSelect: undefined as SystemCode | undefined,
      // select model for exposure path
      exposurePathOptions: EXPOSURE_PATH_CODES,
      // options for exposure path
      exposurePathFilteredOptions: undefined as Array<SystemCode> | undefined,
      // options according to filter for exposure path of a reaction
      episodeCommentInput: '', // model for the comment of an episode
      facility: undefined as SystemCodeExtension | undefined,
      // model for facility
      facilityOptions: [] as Array<SystemCodeExtension>,
      // options for facility type
      practiceSetting: undefined as SystemCodeExtension | undefined,
      // model for practiceSetting
      practiceSettingOptions: [] as Array<SystemCodeExtension>,
      // options for practiceSetting type
      dateFormatter: new Intl.DateTimeFormat(this.settings.language || 'de-CH'),
      // helper for formating date according to locale
      componentTranslations: new AllergyUploadTranslations()
      // contains default translations from library but can be oberwritten individually via translations prop
    };
  },
  i18n: {
    messages: {
      'de-CH': Object.assign({}, DE.allergyUpload, {
        searchPlaceholder: DE.common.search,
        category: DE.common.category,
        continue: DE.common.continue,
        back: DE.common.back,
        description: DE.common.description,
        reaction: DE.common.reaction,
        institution: DE.common.institution,
        specialisation: DE.common.specialisation,
        cancelButtonLabel: DE.common.cancel,
        uploadButtonLabel: DE.common.uploadFor,
        creatingInstitution: DE.common.creatingInstitution,
        substance: DE.common.substance,
        criticality: DE.common.criticality
      }),
      'fr-CH': Object.assign({}, FR.allergyUpload, {
        searchPlaceholder: FR.common.search,
        category: FR.common.category,
        continue: FR.common.continue,
        back: FR.common.back,
        description: FR.common.description,
        reaction: FR.common.reaction,
        institution: FR.common.institution,
        specialisation: FR.common.specialisation,
        cancelButtonLabel: FR.common.cancel,
        uploadButtonLabel: FR.common.uploadFor,
        creatingInstitution: FR.common.creatingInstitution,
        substance: FR.common.substance,
        criticality: FR.common.criticality
      })
    }
  },
  props: {
    /**
     * Strings to overwrite default translations of component. Oberwrite by individual keys is supported.
     * @see   PatientSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<AllergyUploadTranslationStrings>,
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
     * An allergy intolerance bundle to display and edit.
     */
    allergyIntoleranceResource: {
      type: Object as PropType<CHAllergyIntolerance>,
      required: false
    },
    /**
     * Function to be called when the upload process is done or cancelled.
     * Use bundle to pass on uploaded CHAllergyIntolerance bundle or leave empty to e.g. close component.
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
     * Project settings
     */
    settings: {
      type: Object as PropType<Settings>,
      required: true
    }
  },
  beforeMount() {
    this.setupTranslations();

    this.episodeColumns = [
      // definitions of the episode table columns
      {
        name: 'reactionDate',
        required: true,
        label: this.componentTranslations.reactionDate,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.onset,
        format: this.formatDateString,
        sortable: true
      },
      {
        name: 'duration',
        required: false,
        label: this.componentTranslations.durationReaction,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.allergyintoleranceDuration,
        sortable: false,
        format: (duration: Duration) => {
          if (!duration || !duration.value) {
            return '-';
          } else {
            return '' + duration.value;
          }
        }
      },
      {
        name: 'substance',
        required: true,
        label: this.componentTranslations.substance,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.substance,
        format: (code: CodeableConcept) => {
          if (code && code.coding && code.coding.length > 0 && code.coding[0].code) {
            const translated = this.fhirUtils.getDisplayByCodeAndLanguage(
              code.coding[0].code,
              REACTION_SUBSTANCE_CODES,
              this.languageString
            );
            return translated === '?' && code.coding[0].display
              ? (this.shortenString(code.coding[0].display) as string)
              : (this.shortenString(translated) as string);
          }
          return '-';
        },
        sortable: true
      },
      {
        name: 'manifestation',
        required: false,
        label: this.componentTranslations.manifestation,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.manifestation,
        format: (codes: CodeableConcept[]) => {
          if (codes && codes.length > 0) {
            let translated = '';
            codes.forEach((code) => {
              if (code.coding && code.coding.length > 0 && code.coding[0].code) {
                translated =
                  translated +
                  this.fhirUtils.getDisplayByCodeAndLanguage(
                    code.coding[0].code,
                    REACTION_MANIFESTATION_CODES,
                    this.languageString
                  );
              }
              if (codes.length > 1) {
                // add a comma
                translated = translated + ', ';
              }
            });
            if (codes.length > 1) {
              // remove last comma again
              translated = translated.substring(0, translated.length - 2);
            }
            return translated;
          }
          return '-';
        },
        sortable: true
      },
      {
        name: 'exposureDate',
        required: false,
        label: this.componentTranslations.exposureDate,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.openEHRExposureDate,
        format: this.formatDateString,
        sortable: true
      },
      {
        name: 'severity',
        required: true,
        label: this.componentTranslations.reactionSeverity,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.severity,
        format: (severity: AllergyIntoleranceSeverity) => {
          if (severity) {
            const severityCode = REACTION_SEVERITY_CODES.find((code) => code.defaultCoding.code == severity);
            if (severityCode) {
              return severityCode.languageDisplays[this.languageString];
            }
          }
          return '-';
        },
        sortable: true
      },
      {
        name: 'location',
        required: true,
        label: this.componentTranslations.location,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.openEHRLocation,
        format: (code: CodeableConcept) => {
          if (code && code.coding && code.coding.length > 0 && code.coding[0].code && code.coding[0].display) {
            return code.coding[0].display;
          } else {
            return '-';
          }
        },
        sortable: true
      },
      {
        name: 'description',
        required: false,
        label: this.componentTranslations.description,
        align: 'left',
        field: (row: AllergyIntoleranceReactionCH) => row.description,
        format: (val: string) => {
          if (!val || val.length == 0) {
            return '-';
          } else {
            return this.shortenString(val) as string;
          }
        },
        sortable: false
      }
    ];

    // sort options for form
    [
      this.noAllergiesOptions,
      this.typeOptions,
      this.allergyCodeOptions,
      this.allergyCategoryOptions,
      this.clinicalStatusOptions,
      this.criticalityOptions,
      this.verificationStatusOptions,
      this.reactionSubstanceOptions,
      this.reactionCertaintyOptions,
      this.reactionSeverityOptions,
      this.reactionManifestationOptions
    ].forEach((optionsArray) => {
      optionsArray.sort((a, b): number => {
        return this.fhirUtils.sortSystemCodeExtensionOptions(a, b, this.languageString);
      });
    });

    [this.reactionLocationOptions, this.exposurePathOptions].forEach((optionsArray) => {
      optionsArray.sort((a, b): number => {
        return this.fhirUtils.sortSystemCodeOptions(a, b);
      });
    });

    // get options from settings store
    this.facility = this.fhirUtils.findSystemCodeExtension(this.settings.facilityType.code || '', FACILITY_CLASS_CODES);

    this.facilityOptions = FACILITY_CLASS_CODES.sort((a, b): number => {
      return this.fhirUtils.sortSystemCodeExtensionOptions(a, b, this.languageString);
    });

    this.practiceSetting = this.fhirUtils.findSystemCodeExtension(
      this.settings.practiceSetting.code || '',
      PRACTICE_SETTING_CODES
    );

    this.practiceSettingOptions = PRACTICE_SETTING_CODES.sort((a, b): number => {
      return this.fhirUtils.sortSystemCodeExtensionOptions(a, b, this.languageString);
    });

    // preselect no allergies code
    if (this.noAllergiesOptions.length > 0) {
      this.noAllergiesSelect = this.noAllergiesOptions[0];
    }

    if (this.$props.allergyIntoleranceResource) {
      // set available forms from given bundle
      this.setFormData();
    }
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
     * Sets form data from given allergy intolerance bundle.
     */
    setFormData() {
      const bundle = this.$props.allergyIntoleranceResource;

      if (bundle) {
        // check for no allergies code
        const indexNoAllergies = this.noAllergiesOptions.findIndex(
          (option) => bundle.code.coding && option.defaultCoding.code == bundle.code.coding[0].code
        );
        if (bundle.code && indexNoAllergies >= 0) {
          // no allergies selected
          this.noAllergiesCheckbox = true;
          this.noAllergiesSelect = this.noAllergiesOptions[indexNoAllergies];
        } else {
          // there is an allergy
          const allergyCode = this.allergyCodeOptions.find(
            (option) => bundle.code.coding && option.defaultCoding.code == bundle.code.coding[0].code
          );
          if (allergyCode) {
            this.allergyCodeSelect = allergyCode;
          } else {
            console.warn('Allergy code could not be found.');
          }

          if (bundle.type) {
            this.typeSelect = this.typeOptions.find((option) => option.defaultCoding.code == bundle.type);
          }

          if (bundle.category && bundle.category.length > 0) {
            this.allergyCategorySelect = new Array();
            bundle.category.forEach((category) => {
              const code = this.allergyCategoryOptions.find(
                (option) => option.defaultCoding.code == category
              ) as SystemCodeExtension;
              this.allergyCategorySelect?.push(code);
            });
          }

          if (bundle.clinicalStatus) {
            this.clinicalStatusSelect = this.clinicalStatusOptions.find((option) => {
              if (
                bundle.clinicalStatus &&
                bundle.clinicalStatus.coding &&
                bundle.clinicalStatus.coding.length > 0 &&
                bundle.clinicalStatus.coding[0] &&
                bundle.clinicalStatus.coding[0].code &&
                bundle.clinicalStatus.coding[0].code == option.defaultCoding.code
              ) {
                return option;
              }
            });
          }

          if (bundle.criticality) {
            this.criticalitySelect = this.criticalityOptions.find(
              (option) => option.defaultCoding.code == bundle.criticality
            );
          }

          if (bundle.verificationStatus) {
            this.verificationStatusSelect = this.verificationStatusOptions.find((option) => {
              if (
                bundle.verificationStatus &&
                bundle.verificationStatus.coding &&
                bundle.verificationStatus.coding.length > 0 &&
                bundle.verificationStatus.coding[0] &&
                bundle.verificationStatus.coding[0].code &&
                bundle.verificationStatus.coding[0].code == option.defaultCoding.code
              ) {
                return option;
              }
            });
          }
        }

        if (bundle.onsetDateTime) {
          this.identificationDateInput = bundle.onsetDateTime;
        }

        if (bundle.note && bundle.note.length > 0) {
          this.commentInput = bundle.note[0].text;
        }

        if (bundle.reaction) {
          bundle.reaction.forEach((reaction) => {
            // reaction can also be called episode

            // check for extensions
            const reactionDurationExtension = reaction.extension?.find(
              (extension) => extension.url == ALLERGYINTOLERANCE_DURATION_URL
            );
            const reactionCertaintyExtension = reaction.extension?.find(
              (extension) => extension.url == ALLERGYINTOLERANCE_CERTAINTY_URL
            );
            const openEHRExposureDateExtension = reaction.extension?.find(
              (extension) => extension.url == OPENEHR_EXPOSURE_DATE_URL
            );
            const openEHRExposureDescriptionExtension = reaction.extension?.find(
              (extension) => extension.url == OPENEHR_EXPOSURE_DESCIPTION_URL
            );
            const openEHRLocationExtension = reaction.extension?.find(
              (extension) => extension.url == OPENEHR_EXPOSURE_LOCATION_URL
            );
            const openEHRExposureDurationExtension = reaction.extension?.find(
              (extension) => extension.url == OPENEHR_EXPOSURE_DURATION_URL
            );
            const openEHRManagementExtension = reaction.extension?.find(
              (extension) => extension.url == OPENEHR_EXPOSURE_MANAGEMENT_URL
            );

            const episode: AllergyIntoleranceReactionCH = {
              id: reaction.id,
              onset: reaction.onset,
              description: reaction.description,
              manifestation: reaction.manifestation,
              allergyintoleranceDuration:
                reactionDurationExtension !== undefined ? reactionDurationExtension.valueDuration : undefined,
              substance: reaction.substance,
              allergyintoleranceCertainty: reactionCertaintyExtension
                ? reactionCertaintyExtension.valueCodeableConcept
                : undefined,
              openEHRExposureDate: openEHRExposureDateExtension
                ? openEHRExposureDateExtension.valueDateTime
                : undefined,
              openEHRExposureDescription: openEHRExposureDescriptionExtension
                ? openEHRExposureDescriptionExtension.valueString
                : undefined,
              openEHRLocation: openEHRLocationExtension ? openEHRLocationExtension.valueCodeableConcept : undefined,
              openEHRExposureDuration:
                openEHRExposureDurationExtension !== undefined
                  ? openEHRExposureDurationExtension.valueDuration
                  : undefined,
              openEHRManagement: openEHRManagementExtension ? openEHRManagementExtension.valueString : undefined,
              exposureRoute: reaction.exposureRoute,
              severity: reaction.severity,
              note: reaction.note
            };

            this.episodesData.push(episode);
          });
        }
      } else {
        console.warn('Could not load data for given allergy intolerance bundle.');
      }
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
        return str.substring(0, length - 1) + (str.length > length - 1 ? '…' : '');
      } else {
        return '';
      }
    },
    /**
     * Helper for formatting a date to locale format.
     * @param dateString the date as (part of) ISO string
     */
    formatDateString(dateString: string): string {
      if (!dateString || dateString.length == 0) {
        return '-';
      } else {
        return this.dateFormatter.format(new Date(dateString));
      }
    },
    /**
     * Helper function for filtering the allergy code search
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterAllergyCodeSelect(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.allergyCodeFilteredOptions = this.allergyCodeOptions;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.allergyCodeFilteredOptions = this.allergyCodeOptions.filter((option) => {
            return option.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the substance search for a reaction (episode)
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterReactionSubstanceSelect(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.reactionSubstanceFilteredOptions = this.reactionSubstanceOptions;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.reactionSubstanceFilteredOptions = this.reactionSubstanceOptions.filter((option) => {
            return option.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the manifestation search for a reaction (episode)
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterReactionManifestationSelect(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.reactionManifestationFilteredOptions = this.reactionManifestationOptions;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.reactionManifestationFilteredOptions = this.reactionManifestationOptions.filter((option) => {
            return option.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the location search for a reaction (episode)
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterReactionLocationSelect(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.reactionLocationFilteredOptions = this.reactionLocationOptions;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.reactionLocationFilteredOptions = this.reactionLocationOptions.filter((option) => {
            return option.display.toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the exposure path of a reaction (episode)
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterExposurePathSelect(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.exposurePathFilteredOptions = this.exposurePathOptions;
        });
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.exposurePathFilteredOptions = this.exposurePathOptions.filter((option) => {
            return option.display.toLowerCase().includes(searchString);
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
     * Continue method for stepper.
     *
     * Skips 2nd step (episode) if no allergies is selected.
     */
    continueFromFirstStep() {
      if (this.noAllergiesCheckbox) {
        this.step = 3;
      } else {
        this.step = 2;
      }
    },
    /**
     * Back method for stepper.
     *
     * Skips 2nd step (episode) if no allergies is selected.
     */
    backFromLastStep() {
      if (this.noAllergiesCheckbox) {
        this.step = 1;
      } else {
        this.step = 2;
      }
    },
    /**
     * Resets all inputs from episode step.
     */
    resetEpisodeInputs() {
      // reaction
      this.reactionDateInput = '';
      this.reactionDescriptionInput = '';
      this.reactionDurationInput = undefined;
      this.reactionSubstanceSelect = undefined;
      this.reactionCertaintySelect = undefined;
      this.reactionSeveritySelect = undefined;
      this.reactionManifestationSelect = undefined;
      this.reactionLocationSelect = undefined;

      //exposure
      this.exposureDateInput = '';
      this.exposureDescriptionInput = '';
      this.exposureDurationInput = undefined;
      this.exposurePathSelect = undefined;

      this.episodeCommentInput = '';
    },
    /**
     * Sets values of episode form and adds or updates an episode entry.
     */
    setEpisodeValues(isNewEpisode: boolean) {
      if (!this.reactionManifestationSelect || this.reactionManifestationSelect.length === 0) {
        console.error('Mandatory field manifestation missing');
        return;
      }

      const episode: AllergyIntoleranceReactionCH = {
        id: isNewEpisode ? uuid() : this.currentEpisodeIdInEdit,
        onset: this.reactionDateInput.length > 0 ? this.reactionDateInput : undefined,
        description: this.reactionDescriptionInput.length > 0 ? this.reactionDescriptionInput : undefined,
        manifestation:
          this.reactionManifestationSelect?.map((selected) => {
            return {
              coding: [selected.defaultCoding]
            };
          }) || [],
        allergyintoleranceDuration:
          this.reactionDurationInput !== undefined
            ? {
                value: this.reactionDurationInput,
                unit: 'hour',
                system: 'http://unitsofmeasure.org',
                code: 'h'
              }
            : undefined,
        substance: this.reactionSubstanceSelect
          ? {
              coding: [this.reactionSubstanceSelect.defaultCoding]
            }
          : undefined,
        allergyintoleranceCertainty: this.reactionCertaintySelect
          ? {
              coding: [this.reactionCertaintySelect.defaultCoding]
            }
          : undefined,
        openEHRExposureDate: this.exposureDateInput.length > 0 ? this.exposureDateInput : undefined,
        openEHRExposureDescription:
          this.exposureDescriptionInput.length > 0 ? this.exposureDescriptionInput : undefined,
        openEHRLocation: this.reactionLocationSelect
          ? {
              coding: [this.reactionLocationSelect]
            }
          : undefined,
        openEHRExposureDuration:
          this.exposureDateInput !== undefined
            ? {
                value: this.exposureDurationInput,
                unit: 'hour',
                system: 'http://unitsofmeasure.org',
                code: 'h'
              }
            : undefined,
        exposureRoute: this.exposurePathSelect
          ? {
              coding: [this.exposurePathSelect]
            }
          : undefined,
        note:
          this.episodeCommentInput.length > 0
            ? [
                {
                  text: this.episodeCommentInput
                }
              ]
            : undefined
      };

      if (this.reactionSeveritySelect) {
        const severityValues = Object.values(AllergyIntoleranceSeverity);
        const severityCode = this.reactionSeveritySelect.defaultCoding.code as AllergyIntoleranceSeverity;

        if (severityValues.includes(severityCode)) {
          episode.severity = severityCode;
        }
      }

      if (isNewEpisode) {
        this.episodesData.push(episode);
      } else {
        // replace entry with updated data
        const index = this.episodesData.findIndex((episode) => episode.id == this.currentEpisodeIdInEdit);
        this.episodesData[index] = episode;
      }
      this.closeEpisodeForm();
    },
    /**
     * Deletes the episode which is currently in edit mode.
     */
    deleteEpisode() {
      // filter all episodes which are not concerned for deleting
      const filteredArray = this.episodesData.filter((episode) => episode.id != this.currentEpisodeIdInEdit);
      this.episodesData = filteredArray;
      this.closeEpisodeForm();
    },
    /**
     * User clicked on episode in table row.
     * @param event click event
     * @param episode selected episode
     */
    selectEpisode(event: Event, episode: AllergyIntoleranceReactionCH) {
      if (episode.id) {
        this.currentEpisodeIdInEdit = episode.id;
      }

      if (episode.manifestation && episode.manifestation.length > 0) {
        this.reactionManifestationSelect = new Array();
        episode.manifestation.forEach((manifestation) => {
          let manifestationCode = this.reactionManifestationOptions.find((option) => {
            if (
              manifestation.coding &&
              manifestation.coding[0].code &&
              option.defaultCoding.code == manifestation.coding[0].code
            ) {
              return manifestation;
            }
          });
          if (manifestationCode) {
            this.reactionManifestationSelect?.push(manifestationCode);
          }
        });
      }

      if (episode.onset) {
        this.reactionDateInput = episode.onset;
      }

      if (episode.description) {
        this.reactionDescriptionInput = episode.description;
      }

      if (episode.allergyintoleranceDuration) {
        this.reactionDurationInput = episode.allergyintoleranceDuration.value;
      }

      if (episode.substance) {
        let substanceCode = this.reactionSubstanceOptions.find((option) => {
          if (
            episode.substance?.coding &&
            episode.substance.coding.length > 0 &&
            episode.substance.coding[0].code == option.defaultCoding.code
          ) {
            return option;
          }
        });
        if (substanceCode) {
          this.reactionSubstanceSelect = substanceCode;
        }
      }

      if (episode.allergyintoleranceCertainty) {
        let certaintyCode = this.reactionCertaintyOptions.find((option) => {
          if (
            episode.allergyintoleranceCertainty?.coding &&
            episode.allergyintoleranceCertainty.coding.length > 0 &&
            episode.allergyintoleranceCertainty.coding[0].code == option.defaultCoding.code
          ) {
            return option;
          }
        });
        if (certaintyCode) {
          this.reactionCertaintySelect = certaintyCode;
        }
      }

      if (episode.severity) {
        let severityCode = this.reactionSeverityOptions.find((option) => option.defaultCoding.code == episode.severity);
        if (severityCode) {
          this.reactionSeveritySelect = severityCode;
        }
      }

      if (episode.openEHRExposureDate) {
        this.exposureDateInput = episode.openEHRExposureDate;
      }

      if (episode.openEHRExposureDescription) {
        this.exposureDescriptionInput = episode.openEHRExposureDescription;
      }

      if (episode.openEHRLocation && episode.openEHRLocation.coding && episode.openEHRLocation.coding.length > 0) {
        this.reactionLocationSelect = episode.openEHRLocation.coding[0] as SystemCode;
      }

      if (episode.openEHRExposureDuration) {
        this.exposureDurationInput = episode.openEHRExposureDuration.value;
      }

      if (episode.exposureRoute && episode.exposureRoute.coding && episode.exposureRoute.coding.length > 0) {
        this.exposurePathSelect = episode.exposureRoute.coding[0] as SystemCode;
      }

      if (episode.note && episode.note.length > 0) {
        this.episodeCommentInput = episode.note[0].text;
      }

      if (episode.openEHRExposureDescription) {
        this.exposureDescriptionInput = episode.openEHRExposureDescription;
      }

      this.isEpisodeInEditMode = true;
      this.isAddEpisodeFormShown = true;
    },
    /**
     * Closes episode form and resets flags.
     */
    closeEpisodeForm() {
      this.isEpisodeInEditMode = false;
      this.isAddEpisodeFormShown = false;
      this.currentEpisodeIdInEdit = '';
      this.resetEpisodeInputs();
    },
    /**
     * Extracts a name string for a contact of an organization.
     * @param org: the organization
     * @returns    A string in the form of "Prof. Wilhelm Conrad Röntgen (Universität München)"
     */
    getContactNameStringFromOrganization(org: Organization): string {
      if (org.contact && org.contact[0] && org.contact[0].name) {
        const reduceValues = (arr: Array<string>) => {
          return arr.reduce((previousValue, currentValue) => {
            return previousValue === '' ? currentValue : previousValue + ' ' + currentValue;
          });
        };
        const prefix = reduceValues(org.contact[0].name.prefix || ['']);
        const given = reduceValues(org.contact[0].name.given || ['']);
        const family = org.contact[0].name.family;
        const orgName = org.name;
        return prefix.length > 0
          ? prefix + ' '
          : '' + (given.length > 0 ? given + ' ' : '') + (family ? family : '') + (orgName ? ' (' + orgName + ')' : '');
      } else {
        return '(' + org.name + ')';
      }
    },
    /**
     * Creates a CHAllergyIntolerance resource as JSON
     * and uses iti65-transaction to send it to the EPD playground.
     * Calls the onDone method to share bundle with parent componente.
     */
    uploadAllergy() {
      if (
        (!this.allergyCodeSelect && !this.noAllergiesCheckbox) ||
        (this.noAllergiesCheckbox && !this.noAllergiesSelect)
      ) {
        console.warn('Data about allergy is missing.');
        return;
      }

      if (!this.patient) {
        console.log('Patient data is missing.');
        return;
      }

      let allergyCode = {
        coding: new Array<Coding>()
      };

      if (this.noAllergiesCheckbox && this.noAllergiesSelect) {
        // no allergy checkbox was ticked
        allergyCode.coding.push(this.noAllergiesSelect.defaultCoding);
      } else if (this.allergyCodeSelect) {
        // there is an allergy
        allergyCode.coding.push(this.allergyCodeSelect.defaultCoding);
      }

      const allergyParams: AllergyIntoleranceParams = {
        id: uuid(),
        patient: this.patient,
        code: allergyCode,
        type: this.typeSelect?.defaultCoding.code as AllergyIntoleranceType,
        category: this.allergyCategorySelect?.map((select) => select.defaultCoding.code as AllergyIntoleranceCategory),
        clinicalStatus: this.clinicalStatusSelect ? {coding: [this.clinicalStatusSelect.defaultCoding]} : undefined,
        criticality: this.criticalitySelect?.defaultCoding.code as AllergyIntoleranceCriticality,
        verificationStatus: this.verificationStatusSelect
          ? {coding: [this.verificationStatusSelect.defaultCoding]}
          : undefined,
        onsetDateTime: this.identificationDateInput.length > 0 ? this.identificationDateInput : undefined,
        note: this.commentInput && this.commentInput.length > 0 ? [{text: this.commentInput}] : undefined,
        recorder: {
          type: 'Practitioner',
          display: this.getContactNameStringFromOrganization(this.settings.organization)
        }
      };

      let allergyResource = this.fhirUtils.createCHAllergyIntolerance(allergyParams, this.episodesData);

      if (
        allergyResource &&
        allergyResource.code &&
        allergyResource.code.coding &&
        allergyResource.code.coding.length > 0 &&
        allergyResource.code.coding[0].code
      ) {
        const translatedCodeDisplay = this.fhirUtils.getDisplayByCodeAndLanguage(
          allergyResource.code.coding[0].code,
          this.allergyCodeOptions,
          this.languageString
        );
        const documentBundleTitle = translatedCodeDisplay;

        const category = {
          system: 'http://snomed.info/sct',
          code: '184216000',
          display: 'Patient record type'
        };

        const type = {
          system: 'http://snomed.info/sct',
          code: '722446000',
          display: 'Allergy record'
        };

        const metadata = {
          title: documentBundleTitle,
          isFhir: true,
          description: translatedCodeDisplay,
          contentLanguage: this.languageString,
          sourceIdentifier: this.epdPlaygroundUtils.getOids().app,
          categoryCoding: category,
          typeCoding: type,
          facilityCoding: this.facility?.defaultCoding,
          practiceSettingCoding: this.practiceSetting?.defaultCoding,
          authorRole: ITI_65_AUTHOR_ROLE.HCP
        } as Iti65Metadata;

        // create and a file object from CHAllergyIntolerance resource
        var allergyInFile = new File([JSON.stringify(allergyResource)], 'CHAllergyIntolerance.json', {
          type: 'application/fhir+json'
        });

        //create iti65 bundle and upload
        this.fhirUtils
          .createIti65Bundle(this.patient, allergyInFile, metadata)
          .then((bundle: Iti65DocumentBundle) => this.epdPlaygroundUtils.useITI65(bundle))
          .then((response) => {
            this.onDone(response);
          })
          .catch((err) => {
            this.onDone({
              resourceType: 'Bundle',
              type: BundleType.TRANSACTION_RESPONSE
            });
            console.warn('failed to upload', err);
          });
      } else {
        console.log('Error: creating CHAllergyIntolerance resource.');
      }
    }
  },
  watch: {
    verificationStatusSelect(status: SystemCodeExtension | undefined) {
      if (status && status.defaultCoding.code === 'entered-in-error') {
        this.clinicalStatusSelect = undefined;
      }
    },
    clinicalStatusSelect(status: SystemCodeExtension | undefined) {
      if (status && this.verificationStatusSelect?.defaultCoding.code === 'entered-in-error') {
        this.verificationStatusSelect = undefined;
      }
    }
  },
  computed: {
    /**
     * Sorts episode data.
     */
    episodes(): AllergyIntoleranceReactionCH[] {
      const episodes = this.episodesData;

      return episodes.sort((a, b) => {
        if (!a.onset) return -1;
        if (!b.onset) return 1;
        return new Date(b.onset).getTime() - new Date(a.onset).getTime();
      });
    },
    /**
     * When verification status is entered-in-error, no clinical status should be present.
     * When verification status is NOT entered in error, a clinical status should be present.
     */
    needsClinicalStatus(): boolean {
      return !(this.verificationStatusSelect?.defaultCoding.code === 'entered-in-error');
    },
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
     * Criteria if format of identification date is ok.
     */
    isIdentificationDateValid(): boolean {
      const regex = /^\d{4}-\d{2}-\d{2}$/;

      if (this.identificationDateInput.match(regex) === null) {
        return false;
      }

      const date = new Date(this.identificationDateInput);
      const timestamp = date.getTime();

      if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
      }

      return true;
    },
    /**
     * Criteria to add episode.
     */
    readyAddEpisode(): boolean {
      if (
        this.reactionManifestationSelect &&
        (!this.reactionDurationInput || this.reactionDurationInput >= 0) &&
        (!this.exposureDurationInput || this.exposureDurationInput >= 0)
      ) {
        return true;
      }
      return false;
    },
    /**
     * Criteria to activate continue button on first step.
     */
    readyFirstStep(): boolean {
      if (this.noAllergiesCheckbox || this.allergyCodeSelect) {
        return true;
      }
      return false;
    },
    /**
     * Criteria to activate the upload button.
     */
    readyForUpload(): boolean {
      if (this.$props.allergyIntoleranceResource) {
        // not yet supported
        return false;
      }

      if (this.isAddEpisodeFormShown) {
        return false;
      }
      if (this.needsClinicalStatus && !this.clinicalStatusSelect) {
        return false;
      }
      if (this.noAllergiesCheckbox || this.allergyCodeSelect) {
        return true;
      }
      return false;
    }
  }
});
</script>

<style scoped type="text/css">
.row {
  margin-bottom: 5px;
}

.input-with-tooltip {
  width: 95%;
}

.q-field--with-bottom {
  padding-bottom: 0;
}

.tooltip {
  width: 5%;
  font-size: 20px;
  display: flex;
  justify-content: right;
  align-items: center;
}

.allergy-upload {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#addEpisodeButton {
  margin-top: 3%;
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

.no-allergies-checkbox {
  max-width: 5%;
}

.no-allergies-checkbox-text {
  margin-top: 0.75em;
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

.date-picker {
  position: absolute;
  z-index: 1000;
}
</style>

import AllergyUpload from './components/AllergyUpload.vue';
import DocumentSearch from './components/DocumentSearch.vue';
import DocumentUpload from './components/DocumentUpload.vue';
import LocalPatients from './components/LocalPatients.vue';
import PatientSearch from './components/PatientSearch.vue';
import PatientView from './components/PatientView.vue';
import RegisterPatient from './components/RegisterPatient.vue';
import AllergyView from './components/AllergyView.vue';
import DocumentView from './components/DocumentView.vue';
import VaccinationDocumentCard from './components/VaccinationDocumentCard.vue';

import {
  AllergyUploadTranslationStrings,
  AllergyViewTranslationStrings,
  DocumentSearchTranslationStrings,
  DocumentUploadTranslationStrings,
  LocalPatientsListTranslationStrings,
  PatientSearchTranslationStrings,
  PatientViewTranslationStrings,
  RegisterPatientTranslationStrings,
  DocumentViewTranslationStrings,
  VaccinationDocumentCardTranslationStrings
} from './TranslationInterfaces';

import {
  AllergyIdentificationType,
  AllergySystemCodeExtension,
  ALLERGY_IDENTIFICATION_CODES,
  ALLERGY_TYPE,
  CLINICAL_STATUS_CODES,
  CRITICALITY_CODES,
  EXPOSURE_PATH_CODES,
  REACTION_CERTAINTY_CODES,
  REACTION_LOCATION_CODES,
  REACTION_MANIFESTATION_CODES,
  REACTION_SEVERITY_CODES,
  REACTION_SUBSTANCE_CODES,
  CATEGORY_CODES,
  VERIFICATION_STATUS_CODES
} from './utils/allergyCodes';

import EpdPlaygroundUtils, {
  EpdPlaygroundUtilsSettings,
  Iti65DocumentBundle,
  Iti65DocumentBundleEntry,
  Iti66Params,
  Iti67Params,
  Iti78Params,
  ITI_93_ACTION,
  ITI_104_ACTION,
  Oids,
  Settings
} from './utils/epdPlaygroundUtils';

import FhirUtils, {
  Iti65Metadata,
  ITI_65_AUTHOR_ROLE,
  SystemCode,
  SystemCodeExtension,
  FhirUtilLanguageType,
  SUPPORTED_LANGUAGE_DISPLAYS,
  ContactInfo,
  AllergyIntoleranceParams,
  AllergyIntoleranceEpisodeParams,
  AllergyIntoleranceReactionCH,
  CH_ALLERGY_INTOLERANCE_PROFILE,
  ABATEMENT_DATETIME_URL,
  ALLERGYINTOLERANCE_CERTAINTY_URL,
  ALLERGYINTOLERANCE_DURATION_URL,
  OPENEHR_EXPOSURE_DATE_URL,
  OPENEHR_EXPOSURE_DURATION_URL,
  OPENEHR_EXPOSURE_DESCIPTION_URL,
  OPENEHR_EXPOSURE_LOCATION_URL,
  OPENEHR_EXPOSURE_MANAGEMENT_URL,
  ALLERGY_INTOLERANCE_VERIFICATION_URL
} from './utils/fhirUtils';

import PatientUtils from './utils/patientUtils';

import {
  CLASS_CODES,
  CLASS_TYPE_COMBINATIONS,
  FACILITY_CLASS_CODES,
  PRACTICE_SETTING_CODES,
  TYPE_CODES
} from './utils/snomedCodes';

import { CHAllergyIntolerance } from '@i4mi/fhir_ch';

export {
  // Quasar Components
  AllergyUpload,
  AllergyUploadTranslationStrings,
  DocumentSearch,
  DocumentSearchTranslationStrings,
  DocumentUpload,
  DocumentUploadTranslationStrings,
  LocalPatients,
  LocalPatientsListTranslationStrings,
  PatientSearch,
  PatientSearchTranslationStrings,
  PatientView,
  PatientViewTranslationStrings,
  RegisterPatient,
  RegisterPatientTranslationStrings,
  AllergyView,
  AllergyViewTranslationStrings,
  DocumentView,
  DocumentViewTranslationStrings,
  VaccinationDocumentCard,
  VaccinationDocumentCardTranslationStrings,
  // EpdPlaygroundUtils
  EpdPlaygroundUtils,
  EpdPlaygroundUtilsSettings,
  Iti65DocumentBundle,
  Iti65DocumentBundleEntry,
  Iti66Params,
  Iti67Params,
  Iti78Params,
  ITI_93_ACTION,
  ITI_104_ACTION,
  Oids,
  Settings,
  // FhirUtils
  FhirUtils,
  Iti65Metadata,
  ITI_65_AUTHOR_ROLE,
  SystemCode,
  SystemCodeExtension,
  FhirUtilLanguageType,
  SUPPORTED_LANGUAGE_DISPLAYS,
  ContactInfo,
  AllergyIntoleranceParams,
  AllergyIntoleranceEpisodeParams,
  AllergyIntoleranceReactionCH,
  CH_ALLERGY_INTOLERANCE_PROFILE,
  ABATEMENT_DATETIME_URL,
  ALLERGYINTOLERANCE_CERTAINTY_URL,
  ALLERGYINTOLERANCE_DURATION_URL,
  OPENEHR_EXPOSURE_DATE_URL,
  OPENEHR_EXPOSURE_DURATION_URL,
  OPENEHR_EXPOSURE_DESCIPTION_URL,
  OPENEHR_EXPOSURE_LOCATION_URL,
  OPENEHR_EXPOSURE_MANAGEMENT_URL,
  ALLERGY_INTOLERANCE_VERIFICATION_URL,
  // PatientUtils
  PatientUtils,
  // SnomedCodes
  CLASS_CODES,
  TYPE_CODES,
  CLASS_TYPE_COMBINATIONS,
  FACILITY_CLASS_CODES,
  PRACTICE_SETTING_CODES,
  AllergyIdentificationType,
  AllergySystemCodeExtension,
  ALLERGY_IDENTIFICATION_CODES,
  CATEGORY_CODES,
  ALLERGY_TYPE,
  CLINICAL_STATUS_CODES,
  VERIFICATION_STATUS_CODES,
  CRITICALITY_CODES,
  REACTION_MANIFESTATION_CODES,
  REACTION_SUBSTANCE_CODES,
  REACTION_SEVERITY_CODES,
  REACTION_CERTAINTY_CODES,
  REACTION_LOCATION_CODES,
  EXPOSURE_PATH_CODES,
  // from @i4mi/fhir_ch, just here for backward compatibility
  CHAllergyIntolerance
};

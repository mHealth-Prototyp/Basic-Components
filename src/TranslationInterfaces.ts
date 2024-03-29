/**
 * Defines the strings displayed in the DocumentSearch component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface DocumentSearchTranslationStrings {
  titleLabel: string;
  kiloByteLabel: string;
  megaByteLabel: string;
  fetchMpiLabel: string;
  fetchedMpiLabel: string;
  fetchMetadataLabel: string;
  fetchingError: string;
  searchLabel: string;
  dateLabel: string;
  descriptionLabel: string;
  classLabel: string;
  typeLabel: string;
  authorLabel: string;
  fileTypeLabel: string;
  fileSizeLabel: string;
}

/**
 * Defines the strings displayed in the DocumentUpload component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface DocumentUploadTranslationStrings {
  titleLabel: string;
  titleInputLabel: string;
  titleAndDescription: string;
  descriptionText: string;
  descriptionInputLabel: string;
  selectFileText: string;
  selectFile: string;
  metadata: string;
  metadataText: string;
  uploadButtonLabel: string;
  cancelButtonLabel: string;
  categoryLabel: string;
  typeLabel: string;
  language: string;
  languageText: string;
  fileTypeText: string;
  typeNotSufficient: string;
  creatingInstitution: string;
  creatingInstitutionText: string;
  institution: string;
  specialisation: string;
  specialisationText: string;
  jsonFhir: string;
  continue: string;
  back: string;
}

/**
 * Defines the strings displayed in the LocalPatients component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface LocalPatientsListTranslationStrings {
  titleLabel: string;
  givenNameLabel: string;
  familyLabel: string;
  birthdateLabel: string;
  genderLabel: string;
  localPidLabel: string;
  ahvLabel: string;
  hasEPRLabel: string;
  yesLabel: string;
  noLabel: string;
  searchLabel: string;
}

/**
 * Defines the strings displayed in the PatientSearch component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface PatientSearchTranslationStrings {
  nameInputLabel: string;
  givenNameInputLabel: string;
  birthdayInputLabel: string;
  genderInputLabel: string;
  idInputLabel: string;
  systemLabel: string;
  cityLabel: string;
  eprSpidLabel: string;
  localPidLabel: string;
  searchButtonLabel: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  notEnoughParameter: string;
  noPatientFound: string;
  resultTableTitle: string;
}

/**
 * Defines the strings displayed in the PatientView component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface PatientViewTranslationStrings {
  nameLabel: string;
  givenNameLabel: string;
  genderLabel: string;
  birthdateLabel: string;
  identifiersLabel: string;
  localIdLabel: string;
  eprSpidLabel: string;
  addressLabel: string;
  streetLabel: string;
  zipLabel: string;
  cityLabel: string;
  maleGender: string;
  femaleGender: string;
  otherGender: string;
  unknownGender: string;
  editButtonLabel: string;
  saveButtonLabel: string;
  cancelButtonLabel: string;
  editUploadError: string;
  editUploadSuccess: string;
  openPrompt1: string;
  openPrompt2: string;
  addDocumentButtonLabel: string;
  uploadSuccessful: string;
  uploadUnsuccessful: string;
  addAllergyButton: string;
  editAllergyButton: string;
  documentViewTitle: string;
  resourceViewTitle: string;
  resourceLink: string;
}

/**
 * Defines strings of child components in the PatientView component.
 */
export interface PatientViewChildComponentsTranslationString {
  documentSearchStrings: DocumentSearchTranslationStrings;
  documentUploadStrings: DocumentUploadTranslationStrings;
  allergyUploadStrings: AllergyUploadTranslationStrings;
  allergyViewStrings: AllergyViewTranslationStrings;
}

/**
 * Defines the strings displayed in the RegisterPatient component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface RegisterPatientTranslationStrings {
  titleText: string;
  familyLabel: string;
  genderLabel: string;
  givenNameLabel: string;
  birthdateLabel: string;
  addressLabel: string;
  streetLabel: string;
  cityLabel: string;
  zipLabel: string;
  stateLabel: string;
  identifiersLabel: string;
  localPidLabel: string;
  ahvLabel: string;
  maleGender: string;
  femaleGender: string;
  otherGender: string;
  unknownGender: string;
  eprSpidLabel: string;
  registerButtonLabel: string;
  queryEprSpidMessage: string;
  gotEprSpidMessage: string;
  registerPatientMessage: string;
  doneMessage: string;
  errorMessage: string;
}

/**
 * Defines the strings displayed in the AllergyUpload component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface AllergyUploadTranslationStrings {
  noKnownAllergies: string;
  noKnownAllergiesMoreDetail: string;
  category: string;
  clinicalStatus: string;
  clinicalStatusTooltip: string;
  verificationStatus: string;
  verificationStatusTooltip: string;
  comment: string;
  cancelButtonLabel: string;
  uploadButtonLabel: string;
  continue: string;
  back: string;
  noResults: string;
  type: string;
  typeTooltip: string;
  substance: string;
  substanceTooltip: string;
  categoryTooltip: string;
  criticality: string;
  criticalityTooltip: string;
  dateOfIdentification: string;
  episode: string;
  episodeTableTitle: string;
  reactionDate: string;
  exposureDate: string;
  manifestation: string;
  duration: string;
  durationReaction: string;
  reactionSeverity: string;
  location: string;
  description: string;
  addEpisodeButtonLabel: string;
  updateEpisodeButtonLabel: string;
  deleteEpisodeButtonLabel: string;
  saveEpisodeButtonLabel: string;
  reaction: string;
  reactionSubstanceTooltip: string;
  certainty: string;
  reactionManifestationTooltip: string;
  reactionLocationTooltip: string;
  exposure: string;
  exposurePath: string;
  exposurePathTooltip: string;
  episodeComment: string;
  creatingInstitution: string;
  creatingInstitutionText: string;
  institution: string;
  specialisation: string;
  specialisationText: string;
  searchPlaceholder: string;
  fieldRequired: string;
  allergicFor: string;
  positiveValuesAllowed: string;
  allergyUpdateNotSupported: string;
}

/**
 * Defines the strings displayed in the AllergyView component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface AllergyViewTranslationStrings {
  allergy: string;
  intolerance: string;
  typeLabel: string;
  verificationStateLabel: string;
  reactionLabel: string;
  reactionsLabel: string;
  reactionDateLabel: string;
  reactionSeverityLabel: string;
  reactionSubstanceLabel: string;
  reactionDescriptionLabel: string;
  reactionLocationLabel: string;
  additionalInformation: string;
  categoryLabel: string;
  criticalityLabel: string;
  noteLabel: string;
  exposureDateLabel: string;
  exposureRouteLabel: string;
  reactionNoteLabel: string;
  noOtherDataAvailable: string;
}

/**
 * Defines the strings displayed in the DocumentView component.
 * Used this way to be independent from different i18n systems.
 */
export interface DocumentViewTranslationStrings {
  noDocument: string;
  isNotDocument: string;
  noSubjectNarrative: string;
  noCompositionNarrative: string;
  noSectionNarrative: string;
}

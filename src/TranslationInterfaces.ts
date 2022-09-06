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
  mpiLabel: string;
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
  selectFileText: string;
  metadata: string;
  metadataText: string;
  titleInputLabel: string;
  descriptionInputLabel: string;
  uploadButtonLabel: string;
  cancelButtonLabel: string;
  categoryLabel: string;
  typeLabel: string;
  selectFile: string;
  titleAndDescription: string;
  descriptionText: string;
  languageText: string;
  language: string;
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
  givenLabel: string;
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
  givenInputLabel: string;
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
  givenLabel: string;
  genderLabel: string;
  birthdateLabel: string;
  identifiersLabel: string;
  localIdLabel: string;
  mpiIdLabel: string;
  eprSpidLabel: string;
  addressLabel: string;
  streetLabel: string;
  zipLabel: string;
  cityLabel: string;
  maleGender: string;
  femaleGender: string;
  otherGender: string;
  unknownGender: string;
  editButtonLabel?: string;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  uploadError: string;
  uploadSuccess: string;
  openPrompt1: string;
  openPrompt2: string;
  addDocumentButton: string;
  uploadSuccessful: string;
  uploadUnsuccessful: string;
  addAllergyButton: string;
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
  givenLabel: string;
  birthdateLabel: string;
  addressLabel: string;
  streetLabel: string;
  cityLabel: string;
  zipLabel: string;
  stateLabel: string;
  identifiersLabel: string;
  localIdLabel: string;
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
  identificationDate: string;
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
  reaction: string;
  reactionSubstanceTooltip: string;
  certainty: string;
  reactionManifestationTooltip: string;
  reactionLocationTooltip: string;
  exposure: string;
  exposurePath: string;
  exposurePathTooltip: string;
  episodeComment: string;
  saveEpisode: string;
  creatingInstitution: string;
  creatingInstitutionText: string;
  institution: string;
  specialisation: string;
  specialisationText: string;
  searchPlaceholder: string;
  fieldRequired: string;
  allergicFor: string;
  positiveValuesAllowed: string;
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
  codeDisplayLabel: string;
  dateLabel: string;
  clinicalStateLabel: string;
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

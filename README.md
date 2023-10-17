# mHealth Component Library

This library provides Vue/Quasar components and utils for using in demo apps for a mHealth / FHIR endpoint for the Swiss EPR.

For examples of using the components, check out https://github.com/mHealth-Prototyp/Basic-Prototyp.

## Content Table

- [1 How to use](#1-how-to-set-up)
  - [1.1 Using components](#11-set-up-components)
  - [1.2 Using util classes](#12-set-up-util-classes)
- [2 Utils](#2-utils)
  - [2.1 epdPlaygroundUtils](#21-epdplaygroundutils)
  - [2.2 fhirUtils](#22-fhirutils)
  - [2.3 patientUtils](#22-patientutils)
- [3 Components](#3-components)
  - [3.1 Document Search](#31-document-search)
  - [3.2 Document Upload](#32-document-upload)
  - [3.3 Local Patients](#33-local-patients)
  - [3.4 Allergy Upload](#34-allergy-upload)
  - [3.5 Allergy View](#35-allergy-view)
  - [3.6 Document View](#36-document-view)
  - [3.7 Patient Search](#37-patient-search)
  - [3.8 Patient View](#38-patient-view)
  - [3.9 Register Patient](#39-register-patient)
- [4 License](#4-license)
- [5 Changelog](#5-changelog)

## 1 How to set up

These components are made for Quasar web applications. To include one or more components in your app, you first need to install the package, using `npm install @i4mi/mhealth-proto-components`.

## 1.1 Set up components

You can import the components directly in the `<script>` tag of your \*.vue File as such: `import { PatientSearch, PatientView } from '@i4mi/mhealth-proto-components';` and register them in the components property of your definceComponent() function and use them as normal components in your `<template>` (see below for each component's props).

## 1.2 Set up util classes

Before you can use the util classes, you need to initialize them and pass on the projects environment variables (see below for which util needs which variables). You could do this on every page you need the util, but the easiest way is to initialize them once for the whole project.

In Quasar, this is done in the `src/boot` directory. This file has also be referenced in `quasar.conf.js` under `boot: [],`.

```typescript
import {boot} from 'quasar/wrappers';
import {FhirUtils} from '@i4mi/mhealth-proto-components';

const fhirUtils = new FhirUtils('https://my.base.url', { mpiId: 'urn:oid:1.1.1.99.1', /*more oids ...*/ });
// ... more utils

// Type declaration
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $fhirUtils: FhirUtils;
    // ... more utils
  }
}

export default boot(({app}) => {
  // Set global variables
  app.config.globalProperties.$fhirUtils = fhirUtils;
});

export {fhirUtilss};
```

After initializing this way, the util can be referred to in the whole project with `this.$fhirUtils`.

# 1.3 Component translations

The components contain default translations for German (de-CH) and French (fr-CH) stored in JSON files. The translation keys are visible in the [TranslationInterface](https://gitlab.ti.bfh.ch/epd-uc/component-test-library/-/blob/main/src/TranslationInterfaces.ts). To overwrite default translations individual properties can be passed to the translations-Prop of a component.

## 2 Utils

To provide core functionalities in a reusable manner, several util classes have been created:

- **epdPlaygroundUtils.ts**: Implements query functions based on FHIR profiles PIXm, PDQm and MHD required for the profile "Mobile access to Health Documents (MHD) by using the [Mobile Access Gateway](https://epdplayground.ch/index.php?title=Mobile_Access_Gateway).
- **fhirUtils.ts**: Provides necessary SNOMED codes in FHIR format, mapping functions and a functionality to create FHIR resources, e.g. Document Bundle.
- **patientUtils**: Provides methods for generating demo patient data.

### 2.1 EpdPlaygroundUtils

The constructor of the EpdPlaygroundUtils needs the following arguments:

- **settings**: A settings object, with following properties:
  - _FHIR_4_CONTENT_TYPE_: The content-type header, specifying the FHIR version (for FHIR R4 use 'application/fhir+json fhirVersion=4.0')
  - _BASE_URL_: The base-url for the FHIR server (when using EPD Playground and Mobile Access Gateway, this is 'https://test.ahdis.ch/mag-bfh/fhir/')
  - _MESSAGE_ENDPOINT_: The endpoint for processing FHIR messages on the FHIR server used (usually '$process-message')
  - _DEFAULT_TIMEOUT_: Number describing how long to wait until a operation times out (in milliseconds, e.g. '20000')
  - _SOURCE_ENDPOINT_: Source endpoint used for FHIR messaging (e.g. 'http://example.com/patientSource')
  - _TARGET_ENDPOINT_: Target endpoint used for FHIR messaging (e.g. 'http://example.com/patientEndpoint')
- **oids**: An object providing the urn:oid's used in the project, with following properties:
  - _eprSpid_: OID for the EPR SPID (is: 'urn:oid:2.16.756.5.30.1.127.3.10.3')
  - _mpiId_: OID for the Master Patient Index (on EPD Playground: 'urn:oid:1.1.1.99.1')
  - _ahv_: OID for the swiss AHV number code system (is: 'urn:oid:2.16.756.5.32')
  - _local_: OID for your local system, depends on your use case
  - _app_: OID for your application, depends on your use case

If your endpoints requires authorization, you can provide an access token to the EpdPlaygroundUtils that will be used for the requests.
| Function | Description | Params | Returns |
|----------|-------------|--------|----------|
| setAccessToken(\_token: string) | Sets the optional access token for servers that need authorization. Any existing access token will be replaced by the given token. | **\_token**: The access token thats needed for authorization. | - |
| deleteAccessToken() | Removes the currently set access token, if there is one. | - | - |

Following FHIR transactions are provided by the epdPlaygroundUtils class:

<!-- prettier-ignore -->
| Function | Description | FHIR Transaction | Params | Returns  |
| -------- | ----------- | ---------------- | ------ | -------- |
|    useITI65(\_documentBundle: Iti65DocumentBundle) | Uploads a document. | [ITI-65 Provide Document Bundle](http://fhir.ch/ig/ch-epr-mhealth/iti-65.html) | **\_documentBundle**: a Document Bundle representing a document, can be created with _createIti65Bundle()_ from fhirUtils.ts  | A Promise with the uploaded Document Bundle with servers IDs |
|    useITI66(\_params: Partial\<Iti66Params>) | Search for Submission Sets by given search parameters. | [ITI-66 Find Document Lists](http://fhir.ch/ig/ch-epr-mhealth/iti-66.html) | **\_params**: the FHIR search parameters (see [ihe.net](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18.4.1.2.3.7.2) for more details). The \_params object can contain one or more of following properties: <br />- code (as string)<br />- date (as string)<br />- designationType (as string)<br />- identifier (as string)<br />- patient (as string)<br />- sourceId (as string)<br />- status (as string or ListStatus when using [@i4mi/fhir_r4](https://github.com/i4mi/fhir-resources-r4))<br />- 'patient.identifier' (as string)<br />- 'source.given' (as string)<br />- 'source.family' (as string) | A Promise with an Array of List resources matching the parameters |
|    useITI67(\_params: Partial\<Iti67Params>) | Searches for documents of given patient and search parameters. | [ITI-67 Find Document References](http://fhir.ch/ig/ch-epr-mhealth/iti-67.html) | **\_params**: the FHIR search parameters (see [ihe.net](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18.4.1.2.3.7.1) for more details). The \_params object can contain one or more of following properties:<br />- 'author.given' (as string)<br />- 'author.family' (as string)<br />- category (as string)<br />- creation (as string)<br />- date (as string)<br />- event (as string)<br />- facility (as string)<br />- format (as string)<br />- identifier (as string)<br />- patient (as string)<br />- 'patient.identifier' (as string)<br />- period (as string)<br />- related (as string)<br />- 'security-label' (as string)<br />- setting (as string)<br />- sourceId (as string)<br />- status (as string or DocumentReferenceStatus when using [@i4mi/fhir_r4](https://github.com/i4mi/fhir-resources-r4))<br />- type (as string) | A Promise with an array of DocumentReference resources matching the search parameters |
|    useITI68(\_reference: DocumentReference \| string) | Downloads document by given DocumentReference or URL. | [ITI-68 Retrieve Document](https://fhir.ch/ig/ch-epr-mhealth/iti-68.html) | **\_reference**: a DocumentReference resource or a string containing and URL to a document | A Promise with the document as a string |
| useITI78(\_params: Partial\<Iti78Params>) | Search patients by demographic characteristics. | [ITI-78 Mobile Patient Demographics Query](https://profiles.ihe.net/ITI/PDQm/ITI-78.html) | **\_params**: the FHIR search parameters (see [ihe.net](https://profiles.ihe.net/ITI/PDQm/ITI-78.html#23784121-search-parameters) for more details). The \_params object can contain one or more of following properties:<br />- gender (as string)<br />- family (as string)<br />- given (as string)<br />- 'address-city' (as string)<br />- 'address-country' (as string)<br />- 'address-postalcode' (as string)<br />- 'address-state' (as string)<br />Currently, not all IHE parameters are supported by the Mobile Access Gateway. | A Promise with an array of Patient resources matching the search parameters. |
|    useITI83(\_sourceIdentifier: string, \_targetSystems?: string[]) | Request the MPI-PID and the EPR-SPID identifier for a given local patient identifier. | [ITI-83 Mobile Patient Identifier Cross-Reference Query](http://fhir.ch/ig/ch-epr-mhealth/iti-83.html) | **\_sourceIdentifier**: local patient identifier (as string)<br />**\_targetSystems?**: target systems as OIDs (optional, as Array of strings) | A Promise with a FHIR resource Parameters |
|    useITI93(\_patient: Patient, \_action: ITI_93_ACTION, \_mergePatient?: Patient) | Adds or edits patient data. | [CH:PIXm ITI-93 Mobile Patient Identity Feed](http://fhir.ch/ig/ch-epr-mhealth/iti-93.html) | **\_patient**: the Patient resource to add / update / merge / delete<br />**\_action**: wether to `ADD`, `UPDATE` or `MERGE` (`REMOVE` is not supported by EPD Playground / MAG) (as string or ITI_93_ACTION)<br />**\_mergePatient?**: optional, only needed when \_action is merge: Patient resource for the patient to replace the original \_patient when merging. | A Promise with the server response (the uploaded Bundle with servers IDs) |
|    useITI104(\_patient: Patient, \_action: ITI\_104\_ACTION, \_mergePatient?: Patient) | Adds or edits patient data. | [ITI-104 Patient Identity Feed FHIR](https://fhir.ch/ig/ch-epr-mhealth/iti-104.html) | **\_patient**: the Patient resource to add / update<br />**\_action**: wether to `ADD_REVISE` or `RESOLVE_DUPLICATE` (`REMOVE` is not supported by EPD Playground / MAG) (as string or ITI_104_ACTION)<br />**\_mergePatient?**: optional, only needed when \_action is merge: Patient resource for the patient to replace the original \_patient when merging. | A Promise with the server response (the updated Patient resource) |
|    fetchDocumentReference(\_id: string) | Helper function to fetch a DocumentReference with known ID | -| **\_id**: The known FHIR id of the DocumentReference resource. | A Promise for the DocumentReference Resource |
|    getOids() | Returns the preset project OIDs| - | - | An object containing the OIDs for eprSpid, mpiId, local, ahv and app as string. |

### 2.2 FhirUtils

The constructor for patientUtils needs only one argument:

- **baseUrl**: The base URL of the FHIR endpoint you're using as a string.
- **oids**: An object providing the urn:oid's used in the project, with following properties:
  - _eprSpid_: OID for the EPR SPID (is: 'urn:oid:2.16.756.5.30.1.127.3.10.3')
  - _mpiId_: OID for the Master Patient Index (on EPD Playground: 'urn:oid:1.1.1.99.1')
  - _ahv_: OID for the swiss AHV number code system (is: 'urn:oid:2.16.756.5.32')
  - _local_: OID for your local system, depends on your use case
  - _app_: OID for your application, depends on your use case

<!-- prettier-ignore -->
|  Function | Description | Params | Returns |
| --------- | ----------- | ------ | ------- |
|    createIti65Bundle(patient: Patient, file: File, metaData: Iti65Metadata) | Creates a document bundle with a binary file according to [ITI-65](https://fhir.ch/ig/ch-epr-mhealth/iti-65.html). | **patient**: the patient FHIR resource the document belongs to (must have a MPI identifier)<br /> **file**: the file to upload <br /> **metaData**: meta data describing the content of the file:<br />- title (as string)<br />- description (as string)<br />- isFhir? indicates that a .json file has FHIR content (as boolean)<br />- contentLanguage (as string)<br />- sourceIdentifier (as string)<br />- categoryCoding (as SystemCode)<br />- typeCoding (as SystemCode)<br />- facilityCoding (as SystemCode)<br />- practiceSettingCoding (as SystemCode)<br />- authorRole (as ITI_65_AUTHOR_ROLE): Describing the role of the file author ('PAT', 'HCP', 'ASS', 'REP' or 'TCU')  | A promise with a document bundle resource that can be used for the upload. |
|    createCHAllergyIntolerance(paramsAllergy: AllergyIntoleranceParams, paramsEpisodes?: AllergyIntoleranceEpisodeParams[]) | Creates an AllergyIntolerance resource according to CH AllergyIntolerance specification. | **paramsAllergy**: Information about allergy or intolerance (for detailed parameter types, see [@i4mi/fhir_r4](https://github.com/i4mi/fhir-resources-r4)):<br />- code (as CodeableConcept)<br />- patient (as Patient)<br />- id? (as string)<br />- meta? (as Meta)<br />- implicitRules? (as uri)<br />- language? (as code)<br />- text? (as Narrative)<br />- contained? (as Resource[])<br />- extension? (as Extension[])<br />- abatementDateTimeUvIps? (as dateTime)<br />- identifier? (as Identifier[])<br />- clinicalStatus? (as CodeableConcept)<br />- verificationStatus? (as CodeableConcept)<br />- type? (as AllergyIntoleranceType)<br />- category? (as AllergyIntoleranceCategory[])<br />- criticality? (as AllergyIntoleranceCriticality)<br />- encounter? (as Reference)<br />- onsetDateTime? (as dateTime)<br />- recordedDate? (as dateTime)<br />- recorder? (as Reference)<br />- asserter? (as Reference)<br />- lastOccurrence? (as dateTime)<br />- note? (as Annotation[])<br />**paramsEpisodes**: Adverse Reaction Events linked to exposure to substance (for detailed parameter types, see [@i4mi/fhir_r4](https://github.com/i4mi/fhir-resources-r4)):<br />- id? (as string)<br />- extension? (as Extension[])<br />- allergyintoleranceCertainty? (as CodeableConcept)<br />- allergyintoleranceDuration? (as Duration)<br />- openEHRLocation? (as CodeableConcept)<br />- openEHRExposureDate? (as dateTime)<br />- openEHRExposureDuration? (as Duration)<br />- openEHRExposureDescription? (as string)<br />- openEHRManagement? (as string)<br />- substance? (as CodeableConcept)<br />- manifestation (as CodeableConcept[])<br />- description? (as string)<br />- onset? (as dateTime)<br />- severity? (as AllergyIntoleranceSeverity)<br />- exposureRoute? (as CodeableConcept)<br />- note? (as Annotation[]) | An AllergyIntolerance resource conforming to the CH AllergyIntolerance profile. |
|    findClassTypeCombination(classCode: string) | Returns possible types for a given class code according to this mapping: [ehealthsuisse.art-decor.org](http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html) | **classCode**: class code to look for possible type codes | An Array of SystemCodeExtensions which contain possible type codes. |
|    getClassCodeString(code: string, language: FhirUtilLanguageType) | Returns a display string for a given DocumentReference category (DocumentEntry.classCode) code. | **code**: SNOMED CT code of a category as string<br />**language**: The shorthand of the language of the display string ('en', de','fr', 'it' or 'rm') | The display property of the class, respectively category coding. |
|    getTypeCodeString(code: string, language: FhirUtilLanguageType) | Returns a display string for a given DocumentReference type (DocumentEntry.typeCode) code. | **code**: SNOMED CT code of a type as string<br />**language**: The shorthand of the language of the display string ('en', de','fr', 'it' or 'rm')    | The display property of the type coding. |
|    getFacilityClassCodeString(code: string, language: FhirUtilLanguageType) | Returns a display string for a given DocumentReference context facility code. | **code**: SNOMED CT code of a facility as string<br />**language**: The shorthand of the language of the display string ('en', de','fr', 'it' or 'rm') | The display property of a facility class coding. |
|    createFhirOrganization(name: string, identifier: Identifier, contact: OrganizationContact, address?: Address) | Creates an Organization resource from the given parameters. | **name**: name of the organization<br />**identifier**: identifier of the organization<br />**contact**: contact information of the organization:<br />- given (as string)<br />- family (as string)<br />- phone? (as string)<br />- mail? (as string)<br />**address**: address of the organization | An Organization FHIR resource with random UUID as id. |
|    findClassTypeCombination(classCode: string) | Returns possible types for a given class code according to [this mapping](http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html). | **classCode**: class code to look for possible type codes | An array of matching types as SystemCodeExtension. |
|    getDisplayByCodeAndLanguage(code: string, codeLibrary: SystemCodeExtension[] &#124; AllergySystemCodeExtension[], language: FhirUtilLanguageType) | Returns a display string for a given system code according to code and language. | **code**: code of some system coding<br />**codeLibrary** collection where code is member of<br />**language**: The language wanted for the display string | A display string in the given language.|

### 2.3 PatientUtils

The constructor for patientUtils needs the following arguments:

- **oids**: An object providing the urn:oid's used in the project, with following properties:
  - _eprSpid_: OID for the EPR SPID (is: 'urn:oid:2.16.756.5.30.1.127.3.10.3')
  - _mpiId_: OID for the Master Patient Index (on EPD Playground: 'urn:oid:1.1.1.99.1')
  - _ahv_: OID for the swiss AHV number code system (is: 'urn:oid:2.16.756.5.32')
  - _local_: OID for your local system, depends on your use case
  - _app_: OID for your application, depends on your use case
- **organization**: An Organization FHIR resource representing the organization that uses the system (and manages the patients).

<!-- prettier-ignore -->
| Function                    | Description | Params | Returns |
| --------------------------- | ----------- | ------ | ------- |
| generateEprSpid(id: string) | Generates a pseudo EPR SPID from a given id. | **id**: An unique input as base for generating the EPR SPID with exactly 9 digits. | A string that is formed like a valid EPR SPID, based on the input id. |
generateAhvIdentifier()       | Generates a random AHV number. | none | A FHIR Identifier with a random AHV number and the AHV OID. |
| generateRandomPatient()     | Creates a random patient, based on the data above. | none | A FHIR Patient resource with typical swiss data, a random local id and the preset organisation as managing organization. |

### 2.4 snomedCodes.ts

Following codes are listed in the snomedCodes.ts file:

- [DocumentEntry.classCode](https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.classCode.html#logical-definition-cld) (is mapped to DocumentReference.category) as CLASS_CODES
- [DocumentEntry.typeCode](http://build.fhir.org/ig/hl7ch/ch-epr-term/ValueSet-DocumentEntry.typeCode.html#logical-definition-cld) (is mapped to DocumentReference.type) as TYPE_CODES
- [DocumentEntry.healthcareFacilityTypeCode](https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.healthcareFacilityTypeCode.html) (is mapped to DocumentReference.facilityType) as FACILITY_CLASS_CODES
- [DocumentEntry.practiceSettingCode](https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.practiceSettingCode.html) (is mapped to DocumentReference.practiceSetting) as PRACTICE_SETTING_CODES

### 2.5 allergyCodes.ts

Codes specifically used for the allergy use case are separated because there are a lot (1000+).

Following codes are listed in the allergyCodes.ts file:

- [CHAllergyIntoleranceValueSet](https://fhir.ch/ig/ch-allergyintolerance/ValueSet-CHAllergyIntoleranceValueSet.html) is mapped to AllergyIntolerance.code as ALLERGY_IDENTIFICATION_CODES (in the select form we only used type 'finding', 'medicinal product', 'organism' and 'physical object', without 'substance' to avoid redundant codes)
- [AllergyIntoleranceType](https://www.hl7.org/fhir/valueset-allergy-intolerance-type.html) is mapped to AllergyIntolerance.type as ALLERGY_TYPE
- [AllergyIntoleranceCategory](https://hl7.org/fhir/R4/codesystem-allergy-intolerance-category.html) is mapped to AllergyIntolerance.category as CATEGORY_CODES
- [AllergyIntoleranceClinicalStatusCodes](https://hl7.org/fhir/R4/valueset-allergyintolerance-clinical.html) is mapped to AllergyIntolerance.clinicalStatus as CLINICAL_STATUS_CODES
- [AllergyIntoleranceVerificationStatusCodes](https://hl7.org/fhir/R4/valueset-allergyintolerance-verification.html) is mapped to AllergyIntolerance.verificationStatus as VERIFICATION_STATUS_CODES
- [AllergyIntoleranceCriticality](https://hl7.org/fhir/R4/valueset-allergy-intolerance-criticality.html) is mapped to AllergyIntolerance.criticality as CRITICALITY_CODES
- [CHAllergyIntoleranceReactionManifestationValueSet](https://fhir.ch/ig/ch-allergyintolerance/ValueSet-CHAllergyIntoleranceReactionManifestationValueSet.html) is mapped to AllergyIntolerance.reaction.manifestation as REACTION_MANIFESTATION_CODES
- [CHAllergyIntoleranceReactionSubstanceValueSet](https://fhir.ch/ig/ch-allergyintolerance/ValueSet-CHAllergyIntoleranceReactionSubstanceValueSet.html) is mapped to AllergyIntolerance.reaction.substance as REACTION_SUBSTANCE_CODES
- [AllergyIntoleranceSeverity](https://hl7.org/fhir/R4/valueset-reaction-event-severity.html) is mapped to AllergyIntolerance.reaction.severity as REACTION_SEVERITY_CODES
- [Extension: certainty](https://hl7.org/fhir/R4/extension-allergyintolerance-certainty.html) is mapped to AllergyIntolerance.reaction.allergyintoleranceCertainty (extension according to CH specification)
- [Extension: location](https://hl7.org/fhir/R4/extension-openehr-location.html) is mapped to AllergyIntolerance.reaction.openEHRLocation (extension according to CH specification)
- [SNOMEDCTRouteCodes](https://hl7.org/fhir/R4/valueset-route-codes.html) is mapped to AllergyIntolerance.reaction.exposureRoute

## 3 Components

The mHealth prototype app consists of encapsulated components for typically needed functions, which can be easily reused in other apps based on the same technology stack. All components take use of a utils class [epdPlaygroundUtils.ts](../src/utils/epdPlaygroundUtils.ts) which implements the core functions to access the EPD Playground / Mobile Access Gateway using mHealth profiles.

Following components are currently available:

### 3.1 Document Search

[DocumentSearch.vue](../src/components/DocumentSearch.vue)

#### Description

Loads & displays documents that belong to a patient.

#### mHealth transactions used

- ITI-67 Find Document References
- ITI-68 Retrieve Document
- ITI-83 Mobile Patient Identifier Cross-Reference Query

#### Props

<!-- prettier-ignore -->
| Name               | Description                                                                                           | Type                                                         | required |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| patient            | The Patient resource of the person the documents shall be searched for.                               | Patient (FHIR resource)                                      | yes      |
| translations       | Strings to overwrite default translations of component.                                               | DocumentSearchTranslationStrings                             | no       |
| addedDocuments     | Array of documents added on client (e.g. with DocumentUpload.vue) after data was fetched from server. | Array<DocumentReference>                                     | no       |
| locale             | The shorthand for the local language (e.g. de-CH). Default is de-CH.                                  | String                                                       | no       |
| demoMode           | Slows down the transactions to make the transactions more visible in the GUI. Default: no.            | Boolean                                                      | no       |
| languageString     | Two-character representation for the current language.                                                | FhirUtilLanguageType (either 'de', 'en', 'fr', 'it' or 'rm') | yes      |
| fhirUtils          | FhirUtils object initialized with the projects setup (see [2.2](#22-fhirutils))                       | FhirUtils                                                    | yes      |
| epdPlaygroundUtils | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils))     | EpdPlaygroundUtils                                           | yes      |

#### Events emitted

- found-document: Make available selected document to parent component e.g. for download or display. Emitted when the user selects a document from the search result list.

### 3.2 Document Upload

[DocumentUpload.vue](../src/components/DocumentUpload.vue)

#### Description

Provides UI to describe a document with meta data and uploads it.

#### mHealth transactions used

- ITI-65 Provide Document Bundle

#### Props

<!-- prettier-ignore -->
| Name               | Description | Type | required |
| ------------------ | ----------- | ---- | -------- |
| translations       | Strings to overwrite default translations of component. | DocumentUploadTranslationStrings | no |
| patient            | The patient resource the file belongs to. | Patient (FHIR resource)  | yes |
| onDone             | Callback function. Parameter bundle contains the uploaded Bundle, or is undefined if no upload happened (e.g. if the user canceled the action) | function(bundle?: Bundle) => void | yes |
| languageString     | Two-character representation for the current language. | FhirUtilLanguageType (either 'de', 'en', 'fr', 'it' or 'rm') | yes |
| fhirUtils          | FhirUtils object initialized with the projects setup (see [2.2](#22-fhirutils)) | FhirUtils  | yes |
| epdPlaygroundUtils | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils)) | EpdPlaygroundUtils | yes |
| settings           | The project's settings | Settings (containing the properties <br/>-language: APP_LANGUAGES<br />- organization: Organization<br />- facilityType: Coding<br />- practiceSetting: Coding) | yes |

### 3.3 Local Patients

[LocalPatients.Vue](../src/components/LocalPatients.vue)

#### Description

Generates & displays random local patients for use in app and upload to EPD Playground.

#### mHealth transactions used

- ITI-83 Mobile Patient Identifier Cross-Reference Query

#### Props

<!-- prettier-ignore -->
| Name               | Description | Type  | required |
| ------------------ | ----------- | ----- | -------- |
| localIdSystem      | System of the local Identifier. | An object containing a "urn" property e.g. for OID and a "display" property for a name. | yes |
| translations       | Strings to overwrite default translations of component. | LocalPatientsListTranslationStrings | no |
| options            | Options for the component. | LocalPatientsOptions  | no |
| patients           | Array of patients to be displayed as local patients. When none are provided, random generated patients are provided. | Array of FHIR Patient resources | no |
| epdPlaygroundUtils | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils)) | EpdPlaygroundUtils | yes |
| patientUtils       | PatientUtils object initialized with the projects setup (see [2.3](#23-patientgroundutils)) | PatientUtils | yes |

#### Events emitted

- select-patient: Notify parent component about selected patient. Emitted when the user selects a patient from the list.

### 3.4 Allergy Upload

[AllergyUpload.vue](../src/components/AllergyUpload.vue)

#### Description

Provides UI to create an allergy data entry and upload it in fhir format as json file.

#### mHealth transactions used

- ITI-65 Provide Document Bundle

#### Props

<!-- prettier-ignore -->
| Name                       | Description | Type | required |
| -------------------------- | ----------- | -----| -------- |
| translations               | Strings to overwrite default translations of component. | AllergyUploadTranslationStrings | no |
| patient                    | The patient resource the file belongs to. | Patient | yes |
| allergyIntoleranceResource | An AllergyIntolerance bundle to display and edit. | CHAllergyIntolerance | no |
| onDone                     | Callback function. Parameter bundle contains the uploaded Bundle, or is undefined if no upload happened (e.g. if the user canceled the action) | function(bundle?: Bundle) => void | yes |
| languageString             | Two-character representation for the current language. | FhirUtilLanguageType (either 'de', 'en', 'fr', 'it' or 'rm') | yes |
| fhirUtils                  | FhirUtils object initialized with the projects setup (see [2.2](#22-fhirutils)) | FhirUtils  | yes |
| epdPlaygroundUtils         | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils)) | EpdPlaygroundUtils | yes |
| settings                   | The project's settings | Settings (containing the properties <br/>-language: APP_LANGUAGES<br />- organization: Organization<br />- facilityType: Coding<br />- practiceSetting: Coding) | yes |

### 3.5 Allergy View

[AllergyView.vue](../src/components/AllergyView.vue)

#### Description

Displays data of an AllergyIntolerance resource.

#### mHealth transactions used

- none

#### Props

<!-- prettier-ignore -->
| Name               | Description                                                                                         | Type                                                         | required |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| allergyIntolerance | An allergy intolerance resource.                                                                    | CHAllergyIntolerance                                         | yes      |
| showTitle          | If true it shows the code display of the allergy resource as title. Default if not provided: false. | Boolean                                                      | no       |
| translations       | Strings to overwrite default translations of component.                                             | AllergyViewTranslationStrings                                | no       |
| languageString     | Two-character representation for the current language.                                              | FhirUtilLanguageType (either 'de', 'en', 'fr', 'it' or 'rm') | yes      |
| fhirUtils          | FhirUtils object initialized with the projects setup (see [2.2](#22-fhirutils))                     | FhirUtils                                                    | yes      |
| epdPlaygroundUtils | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils))   | EpdPlaygroundUtils                                           | yes      |

#### Events emitted

- none

### 3.6 Document View

[DocumentView.vue](../src/components/DocumentView.vue)

#### Description

This component displays a [FHIR Document](https://www.hl7.org/fhir/documents.html). The component render the different [Narratives](https://www.hl7.org/fhir/narrative.html) from the document as described [here](https://www.hl7.org/fhir/documents.html#presentation).

#### mHealth transactions used

- none

#### Props

<!-- prettier-ignore -->
| Name               | Description                           | Type     | required |
| ------------------ | ------------------------------------- | -------- | -------- |
| document           | The FHIR document to display.         | Bundle   | yes      |
| options            | Options for the component. <br>- ratio: The aspect ratio of the QResponsive component used by DocumentView. By default the aspect ratio of an A4 portrait page is used (70/99).<br>- style: Possibility to provide a stylesheet for formatting the document by providing a StyleValue object. Per default the CSS in the style tag of the component will be used.          | DocumentViewOptions | no      |
| languageString     | Two-character representation for the current language. | FhirUtilLanguageType | yes      |
| translations       | Strings to overwrite default translations of component. | DocumentViewTranslationStrings | no      |

#### Events emitted

- none

### 3.7 Patient Search

[PatientSearch.vue](../src/components/PatientSearch.vue)

#### Description

Searches & displays patients on the EPD Playground.

#### mHealth transactions used

- ITI-78 Mobile Patient Demographics Query

#### Props

<!-- prettier-ignore -->
| Name               | Description  | Type | required |
| ------------------ | ------------ | ---- | -------- |
| localIdSystem      | System of the local Identifier. | An object containing a "urn" property e.g. for OID and a "display" property for a name. | yes |
| translations       | Strings to overwrite default translations of component. | PatientSearchTranslationStrings | no |
| options            | Options for the component. | PatientSearchOptions | no |
| epdPlaygroundUtils | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils)) | EpdPlaygroundUtils | yes |

#### Events emitted

- found-patient: Notify parent component about found patient data. Emitted when user selects a patient from the search result list.

### 3.8 Patient View

[PatientView.vue](../src/components/PatientView.vue)

#### Description

Shows patient details including documents. Also provides functionality to edit patient & upload documents (uses DocumentUpload.vue & DocumentSearch.vue).

#### mHealth transactions used

- CH:PIXm ITI-93 Mobile Patient Identity Feed

#### Props

<!-- prettier-ignore -->
| Name                         | Description | Type | required |
| ---------------------------- | ----------- | ---- | -------- |
| patient                      | The Patient resource to be displayed (and possibly edited). | Patient (FHIR resource) | yes |
| translations                 | Strings to overwrite default translations of component. | PatientViewTranslationStrings | no |
| childComponentsTransalations | Strings to overwrite default translations of child components | PatientViewChildComponentsTranslationString  | no |
| options                      | Options for the component. | PatientViewOptions | no |
| settings                     | The project's settings | Settings (containing the properties <br/>-language: APP_LANGUAGES<br />- organization: Organization<br />- facilityType: Coding<br />- practiceSetting: Coding) | yes |
| languageString               | Two-character representation for the current language. | FhirUtilLanguageType (either 'de', 'en', 'fr', 'it' or 'rm') | yes |
| fhirUtils                    | FhirUtils object initialized with the projects setup (see [2.2](#22-fhirutils)) | FhirUtils | yes |
| epdPlaygroundUtils           | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils)) | EpdPlaygroundUtils| yes |

#### Events emitted

- edited-patient: Notifies parent components about updated patient. Emitted after successful upload of patient data.

### 3.9 Register Patient

[RegisterPatient.vue](../src/components/RegisterPatient.vue)

#### Description

Registers a patient in the EPD Playground.

#### mHealth transactions used

- CH:PIXm ITI-93 Mobile Patient Identity Feed

#### Props

<!-- prettier-ignore -->
| Name               | Description | Type | required |
| ------------------ | ----------- | ---- | -------- |
| patient            | Prefills the register form with a given Patient resource. | Patient (FHIR resource) | no |
| translations       | Strings to overwrite default translations of component. | RegisterPatientTranslationStrings | no |
| settings           | The project's settings | Settings (containing the properties <br/>-language: APP_LANGUAGES<br />- organization: Organization<br />- facilityType: Coding<br />- practiceSetting: Coding) | yes|
| epdPlaygroundUtils | EpdPlaygroundUtils object initialized with the projects setup (see [2.1](#21-epdplaygroundutils)) | EpdPlaygroundUtils | yes |
| patientUtils       | PatientUtils object initialized with the projects setup (see [2.3](#23-patientgroundutils)) | PatientUtils | yes |

#### Events emitted

- uploaded-patient: Notifies parent component about registered patient. Emitted after successful upload of patient data.

# 4 License

This software is published under the [MIT License](LICENSE).

# 5 Changelog

<!-- prettier-ignore -->
| Version | Date       | Changes |
| ------- | ---------- |-------- |
| 0.4.7   | 2023-10-05 | - Added license |
| 0.4.6   | 2023-09-12 | - Added oids parameter to FhirUtils constructor (⚠️ needs adjustments in your code!)<br />-Display narrative content from simple FHIR resources<br />-  fix some bugs found during Projectathon 2023 <br />- Update dependencies|
| 0.4.5   | 2023-08-31 | Add setAccessToken() and deleteAccessToken() to EpdPlaygroundUtils |
| 0.4.4   | 2023-04-25 | Fix a bug in in the DocumentSearch component, where file size was displayed incorrectly for large files |
| 0.4.3   | -          | (skipped for technical reasons) |
| 0.4.2   | 2022-12-22 | Fix a bug in createITI65Bundle, where the title in DocumentReference was not set |
| 0.4.1   | 2022-12-08 | Add DocumentView component |
| 0.4.0   | 2022-10-28 | - add default languages German and French to components<br />- add useITI104() <br />- remove obsolete event upload-result from DocumentUpload and AllergyUpload<br />- fix missing translation for table entries in DocumentSearch<br />- rename some translation keys|
| 0.3.4   | 2022-10-20 | Update dependencies |
| 0.3.3   | 2022-10-19 | - Add `AuthorRole` to ITI-65 Bundle<br />- Allow type `Substance` in AllergyUpload form<br />- Bugfix: LocalPatient now updates on changes<br />- Bugfix: generated EPR-SPID for manually created patients in RegisterPatient contained `NaN` |
| 0.3.2   | 2022-09-06 | - Add multilanguage (DE, FR) aha.ch links to selected allergies in ALLERGY_IDENTIFICATION_CODES<br />- Bugfix: Multiple page search result bundles were not loaded correctly. |
| 0.3.1   | 2022-08-31 | Add AllergyView to PatientView component |
| 0.3.0   | 2022-08-29 | Added AllergyView component |
| 0.2.3   | 2022-08-24 | - Fixed errors in generated CHAllergyIntolerance resource<br />- increase the number of files returned by search to 500 |
| 0.2.2   | 2022-08-15 | - Final AllergyUpload component <br />- Added some Allergy related codes to the exports <br />- Replaced string by enum type for AllergySystemCodeExtension |
| 0.2.1   | 2022-07-20 | Added README.md |
| 0.2.0   | 2022-07-19 | Added AllergyUpload component |
| 0.1.0   | 2022-07-19 | Initial version |

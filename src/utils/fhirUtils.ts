import {
  Binary,
  BundleHTTPVerb,
  BundleType,
  ContactPoint,
  ContactPointSystem,
  Identifier,
  Organization,
  Patient,
  Address,
  AllergyIntoleranceReaction,
  CodeableConcept,
  Duration,
  dateTime,
  Reference,
  Meta,
  Resource,
  code,
  uri,
  Narrative,
  Annotation,
  Extension,
  AllergyIntoleranceType,
  AllergyIntoleranceCategory,
  AllergyIntoleranceCriticality,
  AllergyIntoleranceSeverity,
  Coding,
  Practitioner,
  List,
  getIdentifierString as i4miIdentifierString,
  Bundle
} from '@i4mi/fhir_r4';
import {v4 as uuid} from 'uuid';
import { CHAllergyIntolerance, CHDocumentReferenceEPR } from '@i4mi/fhir_ch';
import {AllergySystemCodeExtension} from './allergyCodes';
import {Iti65DocumentBundle, Iti65DocumentBundleEntry, Oids} from './epdPlaygroundUtils';
import {CLASS_CODES, CLASS_TYPE_COMBINATIONS, FACILITY_CLASS_CODES, TYPE_CODES} from './snomedCodes';

/**
 * Provides necessary SNOMED codes in FHIR format, mapping functions and a functionality to
 * create FHIR resources, e.g. Document Bundle.
 * @param:  baseUrl: the base url of the FHIR server in use
 */

export default class FhirUtils {
  BASE_URL: string;
  OIDS: Oids;
  constructor(baseUrl: string, oids: Oids) {
    this.BASE_URL = baseUrl;
    this.OIDS = oids;
  }

  /**
   * Creates a document bundle with a binary file according to ITI-65:
   * @see   IHE spec  https://profiles.ihe.net/ITI/MHD/ITI-65.html
   * @see   CH spec   https://fhir.ch/ig/ch-epr-mhealth/iti-65.html
   *
   * @param patient   individual or animal referenced in the bundle. needs to have the MPI Identifier as an
   *                  identifier
   * @param file      file to add to bundle
   * @param metaData  meta data of the file
   * @returns         a Promise of a document bundle as Iti65DocumentBundle
   */
  public createIti65Bundle(patient: Patient, file: File, metaData: Iti65Metadata): Promise<Iti65DocumentBundle> {
    return new Promise<Iti65DocumentBundle>((resolve, reject) => {
      if (patient == null || patient.identifier == null || patient.identifier.length === 0) {
        return reject('Patient resource missing or incomplete.');
      }

      if (this.OIDS == undefined) {
        return reject('FhirUtils has been initialized without passing oid object. Please update according to 0.4.6 version to library.');
      }

      // handle data
      const dataString = '';
      if (file == null) {
        return reject('File is missing.');
      }

      if (metaData == null) {
        return reject('Meta data is missing');
      }

      // generate ids
      const bundleId = 'bundle-id-' + uuid();
      const dataIdString = 'urn:uuid:' + uuid();
      const documentIdString = 'urn:uuid:' + uuid();
      const submissionSetIdString = 'urn:uuid:' + uuid();
      const documentReferenceMasterId = 'urn:oid:' + uuid();

      // base structure of bundle
      const newBundle = {
        id: bundleId,
        resourceType: 'Bundle',
        meta: {
          profile: ['http://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Comprehensive.ProvideBundle']
        },
        type: BundleType.TRANSACTION,
        entry: new Array<Iti65DocumentBundleEntry>()
      } as Iti65DocumentBundle;

      // handle todays date
      const todayString = new Date().toISOString().substring(0, 10);

      const identifier = patient.identifier.find((identifier: Identifier) => identifier.system === this.OIDS.mpiId);

      if (!identifier || !identifier.value) {
        return reject('No MPI identifier was provided, can not generate ITI65 Bundle.');
      }

      const patientIdentifierString = this.OIDS.mpiId + '-' + identifier.value;

      // mime type handling
      const mimeType = file.type === 'application/json' && metaData.isFhir ? 'application/fhir+json' : file.type;
      // Because we can read mime type of file, we use it to describe content,
      // https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.formatCode.html
      // TODO could also be made more intelligent, e.g. to detect and precise CDA format
      const formatCoding = {
        system: 'urn:oid:1.3.6.1.4.1.19376.1.2.3',
        code: 'urn:ihe:iti:xds:2017:mimeTypeSufficient',
        display: 'MimeType sufficient'
      };

      // entry with data, data is converted at end of function
      const dataEntry = {
        fullUrl: dataIdString,
        resource: {
          resourceType: 'Binary',
          contentType: mimeType,
          data: dataString
        } as Binary,
        request: {
          method: BundleHTTPVerb.POST,
          url: dataIdString
        }
      } as Iti65DocumentBundleEntry;
      newBundle.entry.push(dataEntry);

      // SubmissionSetrepresents collection of documents
      const submissionSetEntry: Iti65DocumentBundleEntry = {
        fullUrl: submissionSetIdString,
        resource: {
          resourceType: 'List',
          id: submissionSetIdString,
          meta: {
            profile: ['http://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Comprehensive.SubmissionSet']
          },
          extension: [
            {
              url: 'http://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-designationType',
              valueCodeableConcept: {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '71388002',
                    display: 'Procedure (procedure)'
                  }
                ]
              }
            },
            {
              url: 'http://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-sourceId',
              valueIdentifier: {
                value: metaData.sourceIdentifier
              }
            }
          ],
          identifier: [
            {
              use: 'official',
              system: 'urn:ietf:rfc:3986',
              value: submissionSetIdString
            }
          ],
          status: 'current',
          mode: 'working',
          title: metaData.title,
          code: {
            coding: [
              {
                system: 'http://profiles.ihe.net/ITI/MHD/CodeSystem/MHDlistTypes',
                code: 'submissionset',
                display: 'Submission Set'
              }
            ]
          },
          subject: {
            reference: this.BASE_URL + 'Patient/' + patientIdentifierString
          },
          entry: [
            {
              item: {
                reference: documentIdString
              }
            }
          ],
          date: todayString
        } as List,
        request: {
          method: BundleHTTPVerb.POST,
          url: submissionSetIdString
        }
      };
      newBundle.entry.push(submissionSetEntry);

      // document reference entry describes content, context and relation to patient
      const documentReferenceEntry: Iti65DocumentBundleEntry = {
        fullUrl: documentIdString,
        resource: {
          resourceType: 'DocumentReference',
          meta: {
            profile: ['http://fhir.ch/ig/ch-core/StructureDefinition/ch-core-documentreference-epr']
          },
          timestamp: new Date().toISOString(),
          author: [],
          contained: [ patient ],
          masterIdentifier: {
            value: documentReferenceMasterId
          },
          extension: [
            {
              url: 'http://fhir.ch/ig/ch-epr-mhealth/StructureDefinition/ch-ext-author-authorrole',
              valueCoding: {
                system: 'urn:oid:2.16.756.5.30.1.127.3.10.6',
                code: ITI_65_AUTHOR_ROLE[metaData.authorRole],
                display: metaData.authorRole as unknown as string
              }
            }
          ],
          identifier: [
            {
              use: 'official',
              system: 'urn:ietf:rfc:3986',
              value: documentIdString
            }
          ],
          status: 'current',
          type: {
            coding: [metaData.typeCoding]
          },
          category: [
            {
              coding: [metaData.categoryCoding]
            }
          ],
          subject: {
            reference: this.BASE_URL + 'Patient/' + patientIdentifierString
          },
          source: metaData.sourceIdentifier,
          date: todayString,
          description: metaData.description,
          securityLabel: [
            {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '17621005',
                  display: 'Normal (qualifier value)'
                }
              ]
            }
          ],
          content: [
            {
              attachment: {
                contentType: mimeType,
                language: metaData.contentLanguage,
                url: dataIdString,
                title: metaData.title
              },
              format: formatCoding
            }
          ],
          context: {
            facilityType: {
              coding: [metaData.facilityCoding]
            },
            practiceSetting: {
              coding: [metaData.practiceSettingCoding]
            },
            sourcePatientInfo: {
              reference: '#' + patient.id
            }
          }
        } as CHDocumentReferenceEPR,
        request: {
          method: BundleHTTPVerb.POST,
          url: documentIdString
        }
      };
      if (metaData.author) {
        metaData.author.id = metaData.author.id || 'document-author';
        const docRef = documentReferenceEntry.resource as CHDocumentReferenceEPR;
        docRef.contained!.push(metaData.author);
        docRef.author.push({
          type: metaData.author.resourceType,
          reference: '#' +  metaData.author.id
        });
      }
      newBundle.entry.push(documentReferenceEntry);

      // finally converting file to handle as promise
      this.convertToBase64(file)
        .then((dataBase64) => {
          if (dataBase64 == null || dataBase64 === '') {
            return reject('File is empty');
          }
          (newBundle.entry[0].resource as Binary).data = dataBase64;
          return resolve(newBundle);
        })
        .catch((e) => {
          console.log('Error while converting file: ', e);
          return reject('Problem converting file.');
        });
    });
  }

  /**
   * Returns possible types for a given class code according to this mapping:
   * @see http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html
   * @param classCode class code to look for possible type codes
   * @returns array of possible types
   */
  public findClassTypeCombination(classCode: string): SystemCodeExtension[] {
    const combinations = CLASS_TYPE_COMBINATIONS.filter((combination) => combination.classCode == classCode);
    if (combinations.length > 0) {
      const typeCodes = combinations[0].possibleTypeCodes;
      return TYPE_CODES.filter(function (value) {
        return typeCodes.indexOf(value.defaultCoding.code) !== -1;
      });
    } else {
      return [];
    }
  }

  /**
   * Returns a display string for a given DocumentReference category (DocumentEntry.classCode) code.
   * @param code     SNOMED CT code as string
   * @param language desired language as two character string
   *                 (supported: en, de, fr, it, rm)
   * @returns        the display string or '?' when no string is available for the given code and language
   */
  public getClassCodeString(code: string, language: FhirUtilLanguageType): string {
    const classCode = CLASS_CODES.find((cc) => cc.defaultCoding.code === code);
    return classCode ? classCode.languageDisplays[language] : '?';
  }

  /**
   * Returns a display string for a given DocumentReference type (DocumentEntry.typeCode) code.
   * @param code     SNOMED CT code as string
   * @param language desired language as two character string
   *                 (supported: en, de, fr, it, rm)
   * @returns        the display string or '?' when no string is available for the given code and language
   */
  public getTypeCodeString(code: string, language: FhirUtilLanguageType): string {
    const typeCode = TYPE_CODES.find((tc) => tc.defaultCoding.code === code);
    return typeCode ? typeCode.languageDisplays[language] : '?';
  }

  /**
   * Returns a display string for a given DocumentReference context facility code.
   * @param code     SNOMED CT code as string
   * @param language desired language as two character string
   *                 (supported: en, de, fr, it, rm)
   * @returns        the display string or '?' when no string is available for the given code and language
   */
  public getFacilityClassCodeString(code: string, language: FhirUtilLanguageType): string {
    const classCode = FACILITY_CLASS_CODES.find((fcc) => fcc.defaultCoding.code === code);
    return classCode ? classCode.languageDisplays[language] : '?';
  }

  /**
   * Creates an Organization resource from the given parameters.
   * @param _name         the Name of the organization
   * @param _identifier   the organizations identifier, needs at least an OID as system
   * @param _contact       (At least) name and given name of the contact person
   * @param _address?     The address of the organization
   * @returns             an Organization FHIR resource with random UUID as id.
   * @throws              an Error if the Identifier does not contain a .system property with an oid
   */
  public createFhirOrganization(
    _name: string,
    _identifier: Identifier,
    _contact: ContactInfo,
    _address?: Address
  ): Organization {
    if (!_identifier.system || !_identifier.system.includes('urn:oid:')) {
      throw new Error(
        'Error creating Organization: Identifier needs a system OID (provided was: ' +
          (_identifier.system || '<no system>') +
          ').'
      );
    }
    if (!_identifier.value) {
      _identifier.value = _name;
    }
    const organization: Organization = {
      resourceType: 'Organization',
      id: uuid(),
      identifier: [_identifier],
      name: _name,
      address: _address ? [_address] : [],
      contact: [
        {
          name: {
            family: _contact.family,
            given: [_contact.given]
          },
          telecom: new Array<ContactPoint>()
        }
      ]
    };
    if (_contact.phone && organization.contact && organization.contact[0]) {
      organization.contact[0].telecom!.push({
        system: ContactPointSystem.PHONE,
        value: _contact.phone
      });
    }
    if (_contact.mail && organization.contact && organization.contact[0]) {
      organization.contact[0].telecom!.push({
        system: ContactPointSystem.EMAIL,
        value: _contact.mail
      });
    }
    return organization;
  }

  /**
   * Creates an AllergyIntolerance resource according to CH spec.
   * @see main spec https://hl7.org/fhir/R4/allergyintolerance.html
   * @see CH spec   https://fhir.ch/ig/ch-allergyintolerance/StructureDefinition-ch-allergyintolerance.html
   *
   * @param paramsAllergy     information about allergy or intolerance
   * @param paramsEpisodes    adverse Reaction Events linked to exposure to substance
   * @returns                 a Bundle conforming to the CH AllergyIntolerance profile
   *
   * Note about reactions: paramsAllergy.reaction will be ignored, use paramsEpisodes instead
   * Bote about lastOccurrence: will be set according to paramsEpisodes if given
   */
  public createCHAllergyIntolerance(
    paramsAllergy: AllergyIntoleranceParams,
    paramsEpisodes?: AllergyIntoleranceEpisodeParams[]
  ): CHAllergyIntolerance {
    if (
      paramsAllergy.patient == null ||
      paramsAllergy.patient.identifier == null ||
      paramsAllergy.patient.identifier.length === 0
    ) {
      throw new Error('Patient resource missing or incomplete.');
    }

    if (!paramsAllergy.code) {
      throw new Error('Property code is missing.');
    }

    // FHIR validation for AllergyIntolerance
    // 'AllergyIntolerance.clinicalStatus SHALL be present if verificationStatus is not entered-in-error.'
    const verificationStatus =
      paramsAllergy.verificationStatus && paramsAllergy.verificationStatus.coding
        ? paramsAllergy.verificationStatus &&
          paramsAllergy.verificationStatus.coding.find(
            (status) => status.system === ALLERGY_INTOLERANCE_VERIFICATION_URL
          )
        : undefined;
    if (
      !paramsAllergy.clinicalStatus &&
      ((verificationStatus && verificationStatus.code !== 'entered-in-error') || !verificationStatus)
    ) {
      throw new Error(
        'AllergyIntolerance.clinicalStatus SHALL be present if verificationStatus is not entered-in-error.'
      );
    }
    if (verificationStatus && verificationStatus.code === 'entered-in-error' && paramsAllergy.clinicalStatus) {
      throw new Error(
        'AllergyIntolerance.clinicalStatus SHALL NOT be present if verification Status is entered-in-error.'
      );
    }

    // generate ids
    // TODO: does this also need to be MPI index?
    const patientValue = paramsAllergy.patient.identifier[0].value as string;
    const patientSystem = paramsAllergy.patient.identifier[0].system as string;
    const patientIdentifierString = patientSystem + '|' + patientValue;

    if (paramsAllergy.meta) {
      if (
        paramsAllergy.meta.profile &&
        paramsAllergy.meta.profile.findIndex((p) => p === CH_ALLERGY_INTOLERANCE_PROFILE) === -1
      ) {
        paramsAllergy.meta.profile.push(CH_ALLERGY_INTOLERANCE_PROFILE);
      } else {
        paramsAllergy.meta.profile = [CH_ALLERGY_INTOLERANCE_PROFILE];
      }
    }

    const resource = {
      resourceType: 'AllergyIntolerance',
      id: paramsAllergy.id ? paramsAllergy.id : uuid(),
      identifier: paramsAllergy.identifier,
      meta: paramsAllergy.meta || {profile: [CH_ALLERGY_INTOLERANCE_PROFILE]},
      code: paramsAllergy.code,
      implicitRules:
        paramsAllergy.implicitRules && paramsAllergy.implicitRules.length > 0 ? paramsAllergy.implicitRules : undefined,
      language: paramsAllergy.language && paramsAllergy.language.length > 0 ? paramsAllergy.language : undefined,
      text: paramsAllergy.text,
      contained: paramsAllergy.contained && paramsAllergy.contained.length > 0 ? paramsAllergy.contained : undefined,
      extension: paramsAllergy.extension && paramsAllergy.extension.length > 0 ? paramsAllergy.extension : undefined,
      clinicalStatus: paramsAllergy.clinicalStatus,
      verificationStatus: paramsAllergy.verificationStatus,
      type: paramsAllergy.type,
      category: paramsAllergy.category && paramsAllergy.category.length > 0 ? paramsAllergy.category : undefined,
      criticality: paramsAllergy.criticality,
      encounter: paramsAllergy.encounter,
      onsetDateTime:
        paramsAllergy.onsetDateTime && paramsAllergy.onsetDateTime.length > 0 ? paramsAllergy.onsetDateTime : undefined,
      recordedDate:
        paramsAllergy.recordedDate && paramsAllergy.recordedDate.length > 0 ? paramsAllergy.recordedDate : undefined,
      recorder: paramsAllergy.recorder,
      asserter: paramsAllergy.asserter,
      lastOccurrence:
        paramsAllergy.lastOccurrence && paramsAllergy.lastOccurrence.length > 0
          ? paramsAllergy.lastOccurrence
          : undefined,
      note: paramsAllergy.note && paramsAllergy.note.length > 0 ? paramsAllergy.note : undefined,
      patient: {
        reference: 'Patient/' + patientIdentifierString
      }
    } as CHAllergyIntolerance;

    if (paramsAllergy.abatementDateTimeUvIps) {
      if (!resource.extension) {
        resource.extension = [];
      }
      if (resource.extension.findIndex((e) => e.url === ABATEMENT_DATETIME_URL) === -1) {
        resource.extension.push({
          url: ABATEMENT_DATETIME_URL,
          valueDateTime: paramsAllergy.abatementDateTimeUvIps
        });
      }
    }

    if (paramsEpisodes && paramsEpisodes.length > 0) {
      // add reactions if available
      const episodes = new Array<AllergyIntoleranceReaction>();
      paramsEpisodes.forEach((params, index) => {
        const episode = {
          id: params.id ? params.id : 'episode ' + (index + 1),
          extension: params.extension && params.extension.length > 0 ? params.extension : undefined,
          substance: params.substance,
          manifestation: params.manifestation && params.manifestation.length > 0 ? params.manifestation : undefined,
          description: params.description && params.description.length > 0 ? params.description : undefined,
          onset: params.onset && params.onset.length > 0 ? params.onset : undefined,
          note: params.note && params.note.length > 0 ? params.note : undefined,
          severity: params.severity,
          exposureRoute: params.exposureRoute
        } as AllergyIntoleranceReaction;

        if (
          params.allergyintoleranceCertainty &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === ALLERGYINTOLERANCE_CERTAINTY_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: ALLERGYINTOLERANCE_CERTAINTY_URL,
            valueCodeableConcept: params.allergyintoleranceCertainty
          });
        }

        if (
          params.allergyintoleranceDuration &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === ALLERGYINTOLERANCE_DURATION_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: ALLERGYINTOLERANCE_DURATION_URL,
            valueDuration: params.allergyintoleranceDuration
          });
        }

        if (
          params.openEHRExposureDate &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === OPENEHR_EXPOSURE_DATE_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: OPENEHR_EXPOSURE_DATE_URL,
            valueDateTime: params.openEHRExposureDate
          });
        }

        if (
          params.openEHRExposureDuration &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === OPENEHR_EXPOSURE_DURATION_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: OPENEHR_EXPOSURE_DURATION_URL,
            valueDuration: params.openEHRExposureDuration
          });
        }

        if (
          params.openEHRExposureDescription &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === OPENEHR_EXPOSURE_DESCIPTION_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: OPENEHR_EXPOSURE_DESCIPTION_URL,
            valueString: params.openEHRExposureDescription
          });
        }

        if (
          params.openEHRLocation &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === OPENEHR_EXPOSURE_LOCATION_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: OPENEHR_EXPOSURE_LOCATION_URL,
            valueCodeableConcept: params.openEHRLocation
          });
        }

        if (
          params.openEHRManagement &&
          !(episode.extension && episode.extension.findIndex((e) => e.url === OPENEHR_EXPOSURE_MANAGEMENT_URL) === -1)
        ) {
          if (!episode.extension) {
            episode.extension = [];
          }
          episode.extension.push({
            url: OPENEHR_EXPOSURE_MANAGEMENT_URL,
            valueString: params.openEHRManagement
          });
        }
        episodes.push(episode);
      });

      resource.reaction = episodes;
    }

    if (!paramsAllergy.lastOccurrence || (paramsEpisodes && paramsEpisodes.length > 0)) {
      // check latest reaction if we can set this
      let latestReaction = {} as AllergyIntoleranceReaction;
      if (resource.reaction && resource.reaction.length > 0) {
        resource.reaction.forEach((episode) => {
          if (!episode.onset) {
            return;
          }
          const episodeDate = new Date(episode.onset);

          if (!latestReaction) {
            latestReaction = episode;
          } else if (
            latestReaction.onset &&
            episodeDate.getMilliseconds() < new Date(latestReaction.onset).getMilliseconds()
          ) {
            // current episode is before latest reaction
            latestReaction = episode;
          }
        });
        resource.lastOccurrence = latestReaction.onset;
      }
    }

    return resource;
  }

  /**
   * Alphabetical sorting for language displays of SystemCodeExtension or AllergySystemCodeExtension according to app language.
   */
  public sortSystemCodeExtensionOptions(
    a: SystemCodeExtension | AllergySystemCodeExtension,
    b: SystemCodeExtension | AllergySystemCodeExtension,
    language: FhirUtilLanguageType
  ): number {
    if (a.languageDisplays[language] < b.languageDisplays[language]) {
      return -1;
    }
    if (a.languageDisplays[language] > b.languageDisplays[language]) {
      return 1;
    }
    return 0;
  }

  /**
   * Alphabetical sorting for display of SystemCode.
   */
  public sortSystemCodeOptions(a: SystemCode, b: SystemCode): number {
    if (a.display < b.display) {
      return -1;
    }
    if (a.display > b.display) {
      return 1;
    }
    return 0;
  }

  /**
   * Returns a display string for a given system code according to code and language.
   *
   * @param code            code of some system coding
   * @param codeCollection  collection where code is member of
   * @param language        desired language as two character string
   *                          (supported: en, de, fr, it, rm)
   * @returns display string
   */
  public getDisplayByCodeAndLanguage(
    code: string,
    codeLibrary: Array<SystemCodeExtension> | Array<AllergySystemCodeExtension>,
    language: FhirUtilLanguageType
  ): string {
    if (codeLibrary && codeLibrary.length > 0) {
      const systemCode = codeLibrary.find((entry) => entry.defaultCoding.code === code);
      return systemCode ? systemCode.languageDisplays[language] : '?';
    } else {
      return '?';
    }
  }

  /**
   * Find a system code by code.
   *
   * @param code code of the searched SystemCodeExtension
   * @param extensions array of extensions
   * @returns SystemCodeExtension with provided code
   */
  public findSystemCodeExtension(code: string, extensions: SystemCodeExtension[]): SystemCodeExtension | undefined {
    return extensions.find((e) => e.defaultCoding.code === code);
  }

  /**
   * Gets the identifier string for a given OID (of the identifier) from a Patient resource
   * @param patient a Patient resource
   * @param oid     the OID of the system the wanted identifier is in
   * @returns       a string in the form of urn:oid:1.1.1.99.1|1e3796be
   * @throws        an Error if the Patient resource has no identifier whose system matches the OID.
   * @deprecated    use @i4mi/fhir_r4 getIdentifierString instead
   */
  public getIdentifierString(patient: Patient, oid: string): string {
    return i4miIdentifierString(patient, oid);
  }

  /**
   * Gets a resource that is referenced from a bundle
   * @param   bundle    the Bundle that contains the resource
   * @param   reference the reference string pointing to the resource
   * @return  the referenced resource (or undefined, if nothing was found)
   */
  public getLinkedResource(bundle: Bundle, reference?: string): Resource | undefined {
    if (!reference) return undefined;
    const id = reference.split('/').at(-1);
    return bundle.entry?.find((e) => e.resource?.id === id)?.resource;
  }

  /**
   * Converts a file to the Base64 format, which is necessary
   * for uploading it to the EPD playground.
   * @param file       - the file to convert
   * @returns          - a Promise that resolves to a String with the file encoded
   *                     in Base64 or rejects if conversion does not work.
   */
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file) {
        // FileReader function for read the file.
        const reader = new FileReader();

        // Onload of file read the file content
        reader.onload = function () {
          const input = reader.result as string;
          if (input.indexOf(';base64,') > -1) {
            return resolve(input.split(';base64,')[1]);
          } else {
            return resolve(btoa(reader.result as string));
          }
        };

        reader.onerror = function () {
          console.log(reader.error);
        };
        // Convert data to base64
        reader.readAsDataURL(file);
      } else {
        return reject('No file.');
      }
    });
  }
}

/**
 * Interfaces start here.
 */

/**
 * Parameters for ITI65, create document bundle.
 *
 * @param title                   title of the document
 * @param description             description of the document
 * @param isFhir?                 for .json files, this parameter indicates if the content is in HIR
 * @param contentLanguage         language of content: http://hl7.org/fhir/R4/valueset-languages.html
 * @param sourceIdentifier        identifier of the document source, i.e. 'urn:oid:1.3.6.1.4.1.12559.11.13.2.5'
 * @param categoryCoding          high-level kind of document: http://hl7.org/fhir/R4/valueset-document-classcodes.html
 * @param typeCoding              type of document: http://hl7.org/fhir/R4/valueset-c80-doc-typecodes.html
 * @param facilityCoding          type of organizational setting where the clinical encounter, service, interaction,
 *                                or treatment occurred: http://hl7.org/fhir/R4/valueset-c80-facilitycodes.html
 * @param practiceSettingCoding   clinical specialty of the clinician or provider who interacted with, treated,
 *                                or provided a service to/for the patient: http://hl7.org/fhir/R4/valueset-c80-practice-codes.html
 * @param author                  author of the document as Practitioner or Patient resource
 */
export interface Iti65Metadata {
  title: string;
  description: string;
  isFhir?: boolean;
  contentLanguage: string;
  sourceIdentifier: string;
  categoryCoding: SystemCode;
  typeCoding: SystemCode;
  facilityCoding: SystemCode;
  practiceSettingCoding: SystemCode;
  authorRole: ITI_65_AUTHOR_ROLE;
  author?: Practitioner | Patient | Organization;
}

/**
 * Parameters to create AllergyIntolerance resource covering the main part.
 * Episodes (reactions) are a separate interface.
 *
 * @see https://fhir.ch/ig/ch-allergyintolerance/StructureDefinition-ch-allergyintolerance.html
 *
 * @param id                        Logical id of this artifact
 * @param meta                      Metadata about the resource
 * @param implicitRules             A set of rules under which this content was created
 * @param language                  Language of the resource content
 * @param text                      Text summary of the resource, for human interpretation
 * @param contained                 Contained, inline Resources
 * @param extension                 extensions
 * @param abatementDateTimeUvIps    Abatement datetime
 * @param identifier                External ids for this item
 * @param clinicalStatus            The clinical status of the allergy or intolerance
 * @param verificationStatus        Assertion about certainty associated with a propensity, or potential risk, of a reaction to the identified substance
 * @param type                      Identification of the underlying physiological mechanism for a Reaction Risk
 * @param category                  Category of an identified substance associated with allergies or intolerances
 * @param criticality               Estimate of the potential clinical harm, or seriousness, of a reaction to an identified substance
 * @param code                      Code that identifies the allergy or intolerance
 * @param patient                   Who the sensitivity is for
 * @param encounter                 Encounter when the allergy or intolerance was asserted
 * @param onsetDateTime             When allergy or intolerance was identified
 * @param recordedDate              Date first version of the resource instance was recorded
 * @param recorder                  Who recorded the sensitivity
 * @param asserter                  Source of the information about the allergy
 * @param lastOccurrence            Date(/time) of last known occurrence of a reaction
 * @param note                      Additional text not captured in other fields
 */
export interface AllergyIntoleranceParams {
  id?: string;
  meta?: Meta;
  implicitRules?: uri;
  language?: code;
  text?: Narrative;
  contained?: Resource[];
  extension?: Extension[];
  abatementDateTimeUvIps?: dateTime;
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: AllergyIntoleranceType;
  category?: AllergyIntoleranceCategory[];
  criticality?: AllergyIntoleranceCriticality;
  code: CodeableConcept;
  patient: Patient;
  encounter?: Reference;
  onsetDateTime?: dateTime;
  recordedDate?: dateTime;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: dateTime;
  note?: Annotation[];
}

/**
 * Parameters to create AllergyIntolerance resource covering the episodes/reactions part.
 *
 * @see https://fhir.ch/ig/ch-allergyintolerance/StructureDefinition-ch-allergyintolerance.html
 *
 * @param id                              Logical id of this artifact
 * @param extension                       extensions
 * @param allergyintoleranceCertainty     Statement about the degree of clinical certainty that the specific substance was the cause of the manifestation in this reaction event
 * @param allergyintoleranceDuration      The amount of time that the Adverse Reaction persisted
 * @param openEHRLocation                 The anatomical location / body site(s) where the symptoms manifested
 * @param openEHRExposureDate             Record of the date and/or time of the first exposure to the Substance for this Reaction Event
 * @param openEHRExposureDuration         The amount of time the individual was exposed to the Substance
 * @param openEHRExposureDescription      Text description about exposure to the Substance
 * @param openEHRManagement               Text description about the clinical management provided
 * @param substance                       Specific substance or pharmaceutical product considered to be responsible for event
 * @param manifestation                   Clinical symptoms/signs associated with the Event
 * @param description                     Description of the event as a whole
 * @param onSet                           Date(/time) when manifestations showed
 * @param severity                        Clinical assessment of the severity of a reaction event as a whole, potentially considering multiple different manifestations
 * @param exposureRoute                   How the subject was exposed to the substance
 * @param note                            Text about event not captured in other fields
 */
export interface AllergyIntoleranceEpisodeParams {
  id?: string;
  extension?: Extension[];
  allergyintoleranceCertainty?: CodeableConcept;
  allergyintoleranceDuration?: Duration;
  openEHRLocation?: CodeableConcept;
  openEHRExposureDate?: dateTime;
  openEHRExposureDuration?: Duration;
  openEHRExposureDescription?: string;
  openEHRManagement?: string;
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: dateTime;
  severity?: AllergyIntoleranceSeverity;
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}

/**
 * Extended AllergyIntolerance.reactions according to CH specification.
 * @see https://fhir.ch/ig/ch-allergyintolerance/StructureDefinition-ch-allergyintolerance.html
 *
 * @param allergyintoleranceCertainty       Statement about the degree of clinical certainty that the specific substance was the cause of the manifestation in this reaction event
 * @param allergyintoleranceDuration        The amount of time that the Adverse Reaction persisted
 * @param openEHRLocation                   The anatomical location / body site(s) where the symptoms manifested
 * @param openEHRExposureDate               Record of the date and/or time of the first exposure to the Substance for this Reaction Event
 * @param openEHRExposureDuration           The amount of time the individual was exposed to the Substance
 * @param openEHRExposureDescription        Text description about exposure to the Substance
 * @param openEHRManagement                 Text description about the clinical management provided
 */
export interface AllergyIntoleranceReactionCH extends AllergyIntoleranceReaction {
  allergyintoleranceCertainty?: CodeableConcept;
  allergyintoleranceDuration?: Duration;
  openEHRLocation?: CodeableConcept;
  openEHRExposureDate?: dateTime;
  openEHRExposureDuration?: Duration;
  openEHRExposureDescription?: string;
  openEHRManagement?: string;
}

/**
 * Represents the coding of a resource.
 */
export interface SystemCode extends Coding {
  system: string;
  code: string;
  display: string;
}

/**
 * Represents the coding for a class and typeCode with a default coding and multiple language displays.
 */
export interface SystemCodeExtension {
  defaultCoding: Coding;
  languageDisplays: {
    en: string;
    de: string;
    fr: string;
    it: string;
    rm: string;
  };
}

/**
 * Available language type for FHIR usage.
 */
export type FhirUtilLanguageType = 'en' | 'de' | 'fr' | 'it' | 'rm';

/**
 * Contact interface for FHIR resource organization.
 */
export interface ContactInfo {
  given: string;
  family: string;
  phone?: string;
  mail?: string;
}

/**
 * URLS to determine properties.
 */
export const CH_ALLERGY_INTOLERANCE_PROFILE =
  'http://fhir.ch/ig/ch-allergyintolerance/StructureDefinition/ch-allergyintolerance';
export const ABATEMENT_DATETIME_URL = 'http://hl7.org/fhir/uv/ips/StructureDefinition/abatement-dateTime-uv-ips';
export const ALLERGYINTOLERANCE_CERTAINTY_URL = 'http://hl7.org/fhir/StructureDefinition/allergyintolerance-certainty';
export const ALLERGYINTOLERANCE_DURATION_URL = 'http://hl7.org/fhir/StructureDefinition/allergyintolerance-duration';
export const OPENEHR_EXPOSURE_DATE_URL = 'http://hl7.org/fhir/StructureDefinition/openEHR-exposureDate';
export const OPENEHR_EXPOSURE_DURATION_URL = 'http://hl7.org/fhir/StructureDefinition/openEHR-exposureDuration';
export const OPENEHR_EXPOSURE_DESCIPTION_URL = 'http://hl7.org/fhir/StructureDefinition/openEHR-exposureDescription';
export const OPENEHR_EXPOSURE_LOCATION_URL = 'http://hl7.org/fhir/StructureDefinition/openEHR-location';
export const OPENEHR_EXPOSURE_MANAGEMENT_URL = 'http://hl7.org/fhir/StructureDefinition/openEHR-management';
export const ALLERGY_INTOLERANCE_VERIFICATION_URL =
  'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification';

/**
 * Available language displays for FHIR usage.
 */
export const SUPPORTED_LANGUAGE_DISPLAYS = [
  {
    value: 'en',
    label: {
      de: 'Englisch',
      fr: 'anglais',
      en: 'English'
    }
  },
  {
    value: 'de',
    label: {
      de: 'Deutsch',
      fr: 'allemand',
      en: 'German'
    }
  },
  {
    value: 'fr',
    label: {
      de: 'Französisch',
      fr: 'français',
      en: 'French'
    }
  },
  {
    value: 'it',
    label: {
      de: 'Italienisch',
      fr: 'italien',
      en: 'Italian'
    }
  },
  {
    value: 'rm',
    label: {
      de: 'Rätoromanisch',
      fr: 'romanche',
      en: 'Romansh'
    }
  }
];

/**
 * ValueSet describing the author roles.
 * @see https://fhir.ch/ig/ch-epr-term/2.0.1/CodeSystem-2.16.756.5.30.1.127.3.10.6.html
 */
export enum ITI_65_AUTHOR_ROLE {
  PAT = 'Patient' as any,
  HCP = 'Healthcare professional' as any,
  ASS = 'Assistant' as any,
  REP = 'Represantive' as any,
  TCU = 'Technical user' as any
}

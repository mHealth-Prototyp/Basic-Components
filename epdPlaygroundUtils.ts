import {
  HttpMethod,
  Resource,
  Patient,
  Bundle,
  Parameters,
  List,
  ListStatus,
  DocumentReferenceStatus,
  DocumentReference,
  BundleType,
  Binary,
  BundleHTTPVerb,
  MessageHeader,
  PatientLinkType,
  Coding,
  Organization
} from '@i4mi/fhir_r4';

/**
 * Implements query functions based on FHIR profiles PIXm, PDQm and MHD required
 * for the profile "Mobile access to Health Documents (MHD)
 * by using the Mobile Access Gateway (MAG).
 *
 * @param settings  Sets the environment for the utils.
 * @see MAG https://epdplayground.ch/index.php?title=Mobile_Access_Gateway
 */
export default class EpdPlaygroundUtils {
  env: EpdPlaygroundUtilsSettings;
  oids: Oids;

  constructor(settings: EpdPlaygroundUtilsSettings, oids: Oids) {
    this.env = settings;
    this.oids = oids;
  }

  /**
   * Getter for the projects OIDs
   * @returns   an OID object as initialized for EpdPlaygroundUtils
   */
  public getOids(): Oids {
    return this.oids;
  }

  /**
   * ITI-65 Provide Document Bundle
   *
   * Uploads a document.
   *
   * @see                     IHE spec  https://profiles.ihe.net/ITI/MHD/ITI-65.html
   * @see                     CH  spec  https://fhir.ch/ig/ch-epr-mhealth/iti-65.html
   * @see                     profile   https://profiles.ihe.net/ITI/MHD/StructureDefinition-IHE.MHD.Minimal.ProvideBundle.html
   * @param  _documentBundle  the document bundle to upload
   * @returns                 a Promise with the server response (the uploaded Document Bundle with servers IDs)
   */
    public useITI65(_documentBundle: Iti65DocumentBundle): Promise<Bundle> {
    return this.fetch('', HttpMethod.POST, {}, _documentBundle).then((response) => {
      return response as Bundle;
    });
  }

  /**
   * ITI-66 Find Document List
   *
   * Search for Submission Sets by given search parameters.
   * Cave: Only 500 results are returned (to be fixed later)
   *
   * @see   IHE spec https://profiles.ihe.net/ITI/MHD/ITI-66.html
   * @see   CH spec  https://fhir.ch/ig/ch-epr-mhealth/iti-66.html
   * @param  _params search param(s) as key / value pair object with values as string.
   *                 e.g. {status: 'current', 'patient.identifier': 'urn:oid:1.1.1.99.1|0f5a8034-3c8a-4796-bd39-d3ea877a4155'}
   * @returns        a Promise with List resources matching the given search criteria.
   */
  public useITI66(_params: Partial<Iti66Params>): Promise<List[]> {
    return this.fetch('List', HttpMethod.GET, _params).then((resource) => {
      const bundle = resource as Bundle;
      if (bundle.entry) {
        return bundle.entry.map((entry) => entry.resource as List);
      } else {
        return new Array<List>();
      }
    });
  }

  /**
   * ITI-67 Find Document References
   *
   * Searches for documents of given patient and search parameters.
   * Cave: Only 500 results are returned (to be fixed later)
   *
   * @see   IHE spec https://profiles.ihe.net/ITI/MHD/ITI-67.html
   * @see   CH spec  https://fhir.ch/ig/ch-epr-mhealth/iti-67.html
   * @param  _params search param(s) as key / value pair object with values as string,
   *                 e.g. {given: 'Alan'}
   * @returns        a Promise with List resources matching the given search criteria.
   */
  public useITI67(_params: Partial<Iti67Params>): Promise<DocumentReference[]> {
    return this.fetch('DocumentReference', HttpMethod.GET, _params).then(
      (resource) => {
        const bundle = resource as Bundle;
        if (bundle.entry) {
          return bundle.entry.map((entry) => entry.resource as DocumentReference);
        } else {
          return new Array<DocumentReference>();
        }
      }
    );
  }

  /**
   * ITI-68 Retrieve Document
   *
   * Downloads document by given Document Reference or URL.
   *
   * @see    IHE spec    https://profiles.ihe.net/ITI/MHD/ITI-68.html
   * @see    CH spec     https://fhir.ch/ig/ch-epr-mhealth/iti-68.html
   * @param  _reference  Either the DocumentReference resource referring to the actual document, or
   *                     the direct URL of the document to retrieve.
   * @returns            a Promise with document as a string
   */
  public useITI68(_reference: DocumentReference | string): Promise<string> {
    return new Promise((resolve, reject) => {
      let link = typeof _reference === 'string'
        ? _reference
        : _reference.content.find((c) => c.attachment && c.attachment.url)?.attachment.url;

      if (link && (link.indexOf('http') === 0)) {
        // when app runs on https, all links should be https or browsers will block them
        // Note: apparently EPD Playground generates http links for document attachment URLs
        if (location.protocol == 'https:' && link.indexOf('https') !== 0) {
          // app is on https, and link doesn't start with https
          // so we change the link to https
          link = 'https' + link.substring('http'.length, link.length);
        }

        const xhr = new XMLHttpRequest();
        xhr.open(HttpMethod.GET, encodeURI(link), true);

        xhr.timeout = this.env.DEFAULT_TIMEOUT;

        xhr.onload = () => {
          const status = xhr.status;
          if (status >= 200 && status < 300) {
            // successful response
            return resolve(xhr.response as string);
          } else {
            // loaded but non-successful response
            return reject(
              new Error('Status: ' + status.toString() + '. ' + xhr.statusText)
            );
          }
        };
        xhr.ontimeout = () => {
          return reject(
            new Error(
              'Request timed out withouth response from server after ' +
                (this.env.DEFAULT_TIMEOUT / 1000).toString() +
                ' seconds.'
            )
          );
        };
        xhr.onerror = (error) => {
          console.log('Error when loading file.', error);
          return reject(
            new Error('Error. transaction failed. See console for details.')
          );
        };
        xhr.send();
      } else {
        return reject(
          'Invalid argument: No valid URL to document in _reference.'
        );
      }
    });
  }

  /**
   * ITI-83 Mobile Patient Identifier Cross-reference Query
   *
   * Request the MPI-PID and the EPR-SPID identifier for a given local patient identifier.
   *
   * @see    IHE spec          https://profiles.ihe.net/ITI/PIXm/ITI-83.html
   * @see    ch spec           https://fhir.ch/ig/ch-epr-mhealth/iti-83.html
   * @param _sourceIdentifier  oid of the source system and actual id in the system, separated by a pipe
   *                           (e.g. 'urn:oid:2.16.756.5.30.1.178.1.1|PATIENT1')
   * @param _targetSystems     optional. the target systems as OIDs
   *                           (e.g. 'urn:oid:2.16.756.5.30.1.127.3.10.3')
   * @returns                  a Promise with the Parameter FHIR resource with the queried identifiers
   */
  public useITI83(_sourceIdentifier: string, _targetSystems?: string[]): Promise<Parameters> {
    let endpoint = 'Patient/$ihe-pix?sourceIdentifier=' + _sourceIdentifier;
    if (_targetSystems) {
      _targetSystems.forEach((system) => {
        endpoint += '&targetSystem=' + system;
      });
    }

    return this.fetch(endpoint, HttpMethod.GET).then((resource) => {
      if (resource.resourceType === 'Parameters') {
        return resource as Parameters;
      } else {
        return Promise.reject(
          'No entry found for given sourceIdentifier (' + _sourceIdentifier + ').'
        );
      }
    });
  }

  /**
   * ITI-78 Mobile Patient Demographics Query
   *
   * Search patients by demographic characteristics.
   *
   * @see   IHE spec https://profiles.ihe.net/ITI/PDQm/ITI-78.html
   * @param _params  search param(s) as key / value pair object with values as string,
   *                 e.g. {status: 'current', 'patient.identifier': 'urn:oid:1.1.1.99.1|0f5a8034-3c8a-4796-bd39-d3ea877a4155'}
   * @returns        a Promise with an array of the matching Patient resources
   */
  public useITI78(_params: Partial<Iti78Params>): Promise<Patient[]> {
    return this.fetch('Patient', HttpMethod.GET, _params).then((resource) => {
      if (resource.resourceType === 'Patient') {
        return [resource as Patient];
      } else if (resource.resourceType === 'Bundle') {
        return (
          (resource as Bundle).entry?.map((e) => e.resource as Patient) || []
        );
      } else {
        return Promise.reject('No valid reply from server.');
      }
    });
  }

  /**
   * ITI-93 Mobile Patient Identity Feed
   *
   * Adds or edits patient resource.
   *
   * @see   CH spec         https://fhir.ch/ig/ch-epr-mhealth/iti-93.html
   * @see   IHE docu        https://www.ihe.net/uploadedFiles/Documents/ITI/IHE_ITI_Suppl_PMIR.pdf
   * @param _patient        the Patient resource to add / update / merge / delete
   * @param _action         wether to ADD / UPDATE or RESOLVE DUPLICATE (REMOVE is not supported by EPD Playground / Mobile Access Gateway
   * @param _mergePatient?  only needed when _action is merge: The patient to replace the original _patient when merging
   * @returns               a Promise with a the server response (the uploaded Bundle with servers IDs)
   */
  public useITI93(_patient: Patient, _action: ITI_93_ACTION, _mergePatient?: Patient): Promise<Bundle> {
    // check if Patient resouce is valid
    if (!_patient.contained || _patient.contained.length === 0) {
      console.log('Invalid argument: ', _patient);
      return Promise.reject('Invalid argument: Patient resource needs to contain a Organization resource of the managing organization.');
    } else if (
      !_patient.managingOrganization ||
      !_patient.managingOrganization.reference ||
      !_patient.contained[0].id ||
      _patient.managingOrganization.reference !== ('#' + _patient.contained[0].id.toString())
      ) {
      console.log('Invalid argument: ', _patient, _patient.managingOrganization?.reference, _patient.contained[0].id);
      return Promise.reject('Invalid argument: Contained Organization resource needs to be referenced in patient.managingOrganization.');
    }

    _patient.id = _patient.id || 'temporary-patient-id';

    const messageHeader: MessageHeader = {
      resourceType: 'MessageHeader',
      id: '1',
      eventUri: 'urn:ihe:iti:pmir:2019:patient-feed',
      source: {
        endpoint: this.env.SOURCE_ENDPOINT
      },
      focus: [
        {
          reference: 'Patient/' + _patient.id
        }
      ],
      destination: [
        {
          endpoint: this.env.TARGET_ENDPOINT
        }
      ]
    };
    const patientBundleEntry = {
      fullUrl: this.env.BASE_URL + 'Patient/' + _patient.id,
      request: {
        url: this.env.BASE_URL  + 'Patient',
        method: BundleHTTPVerb.POST
      },
      resource: _patient as Resource
    };

    const message: Bundle = {
      resourceType: 'Bundle',
      type: BundleType.MESSAGE,
      entry: [
        {
          fullUrl: this.env.BASE_URL + 'MessageHeader/' + (messageHeader.id || ''),
          resource: messageHeader
        }
      ]
    };

    switch (_action) {
    case ITI_93_ACTION.ADD:
      message.entry?.push(patientBundleEntry);
      break;
    case ITI_93_ACTION.UPDATE:
      patientBundleEntry.request.method = BundleHTTPVerb.PUT;
      message.entry?.push(patientBundleEntry);
      break;
    case ITI_93_ACTION.MERGE:
      if (!_mergePatient) {
        return Promise.reject('Invalid argument: _mergePatient can\'t be undefined for ITI_93_ACTION.MERGE.');
      }
      if (!_mergePatient.id || _mergePatient.id === _patient.id) {
        _mergePatient.id = 'temporary-mergePatient-id';
      }

      _mergePatient.active = true;
      _patient.active = false;
      _patient.link = [
        {
            other: {
                reference: '#' + _mergePatient.id
            },
            type: PatientLinkType.REPLACED_BY
        }
      ];
      _mergePatient.managingOrganization = _mergePatient.managingOrganization || _patient.managingOrganization;
      _patient.contained.push(_mergePatient);

      const historyBundle: Bundle = {
        resourceType: 'Bundle',
        id: 'temporary-bundle-id',
        type: BundleType.HISTORY,
        entry: [
          {
            resource: _patient,
            request: {
              url: this.env.BASE_URL  + 'Patient',
              method: BundleHTTPVerb.PUT
            }
          }
        ]
      };
      message.entry?.push({
        resource: historyBundle
      });
      break;
    case ITI_93_ACTION.REMOVE:
      patientBundleEntry.request.method = BundleHTTPVerb.DELETE;
      message.entry?.push(patientBundleEntry);
      console.warn('REMOVE is not supported on EPD Playground / Mobile Access Gateway. Patient is not deleted, although server responds with \'ok\'.');
      break;
    default:
      console.warn('ITI-93 ' + String(_action) + ' is not implemented.');
    }

    return this.fetch(this.env.MESSAGE_ENDPOINT, HttpMethod.POST, undefined, message)
    .then((res) => {
      return res as Bundle;
    });
  } 

  /**
   * ITI-104 Patient Identity Feed
   *
   * Adds or edits patient resource. (Currently not supported. Use ITI-93 instead.)
   *
   * @see   IHE spec        https://profiles.ihe.net/ITI/MHD/ITI-104.html
   * @see   CH spec         https://fhir.ch/ig/ch-epr-mhealth/iti-104.html
   * @param _patient        the Patient resource to add / update
   * @param _action         wether to ADD / UPDATE or RESOLVE DUPLICATE (REMOVE is not supported by EPD Playground / Mobile Access Gateway
   * @param _mergePatient?  only needed when _action is merge: The patient to replace the original _patient when merging
   * @returns               a Promise with a the server response (the uploaded Bundle with servers IDs)
   */
  public useITI104(_patient: Patient,_action: ITI_104_ACTION, _mergePatient?: Patient): Promise<Bundle> {
    console.log('ITI-104 not implemented.', _patient, _action, _mergePatient);
    return Promise.reject('ITI-104 is currently not supported by Mobile Access Gateway. Use ITI-93 instead');
  }

  /**
   * Helper function to fetch a DocumentReference with known ID
   * @param _id   the ID of the document reference
   * @returns     a Promise with the DocumentReference Resource
   */
  public fetchDocumentReference(_id: string): Promise<DocumentReference> {
    return this.fetch('DocumentReference/' + _id, HttpMethod.GET)
    .then(res => res as DocumentReference);
  }

  /**
   * Does the actual XHR request to the Mobile Access Gateway (MAG).
   * @param    _endpoint     the endpoint to query (without base url) as string
   * @param    _httpMethod   the http method as HttpMethod enum
   * @param    _params       (optional) key/value object with url parameters
   * @param    _payload      (optional) the payload of the transaction, for instance the resource to upload
   * @param    _headers      (optional) key/value object with header parameters
   * @returns                a Promise with the MAG response as a resource.
   */
  private fetch(
    _endpoint: string,
    _httpMethod: HttpMethod,
    _params?: { [key: string]: string },
    _payload?: Resource,
    _headers?: { [key: string]: string }
  ): Promise<Resource> {
    let url = _endpoint.indexOf('http') === 0
      ? _endpoint
      : this.env.BASE_URL + _endpoint;

    if (_params) {
      url += '?';
      for (const key in _params) {
        url += key + '=' + _params[key].toString() + '&';
      }
      url = url.substring(0, url.length - 1); // get rid of last &
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(_httpMethod, encodeURI(url), true);

      xhr.timeout = this.env.DEFAULT_TIMEOUT;
      xhr.setRequestHeader('Content-Type', this.env.FHIR_4_CONTENT_TYPE);
      if (_headers) {
        for (const key in _headers) {
          xhr.setRequestHeader(key, _headers[key]);
        }
      }

      xhr.onload = () => {
        const status = xhr.status;
        if (status >= 200 && status < 300) {
          // successful response
          const resource = JSON.parse(xhr.responseText) as Resource;
          if (resource.resourceType === 'Bundle') {
            const bundle = resource as Bundle;
            // check if it's multi page
            if (bundle.entry && bundle.total && bundle.entry.length !== Number(bundle.total)) {
              // it is a multi page bundle
              const nextLink = bundle.link?.find(link => link.relation === 'next');
              if (!nextLink || !nextLink.url) {
                return resolve(bundle);
              }
              this.fetch(nextLink.url, _httpMethod, _params)
              .then(next => {
                const nextPageBundle = next as Bundle;
                bundle.total = (Number(bundle.total) + Number(nextPageBundle.total)).toString();
                bundle.entry = (bundle.entry ?? []).concat(nextPageBundle.entry ?? []);
                bundle.link = nextPageBundle.link;
                return resolve(bundle);
              })
              .catch((error) => {
                console.log('Something went wrong fetching the next page of the bundle (' + nextLink + ')', error);
                return reject(error);
              });
            } else {
              // it's single page, just return the bundle
              return resolve(bundle);
            }
          } else {
            return resolve(resource);
          }
        } else {
          // loaded but non-successful response
          return reject(
            new Error('Status: ' + status.toString() + '. ' + xhr.statusText)
          );
        }
      };
      xhr.ontimeout = () => {
        return reject(
          new Error(
            'Request timed out withouth response from server after ' +
              (this.env.DEFAULT_TIMEOUT / 1000).toString() +
              ' seconds.'
          )
        );
      };
      xhr.onerror = (error) => {
        console.log('Error when fetching from endpoint' + _endpoint, error);
        return reject(
          new Error('Error. transaction failed. See console for details.')
        );
      };

      xhr.send(_payload ? JSON.stringify(_payload) : undefined);
    });
  }
}

/**
 * Interfaces start here
 */

/**
 * Settings for the EpdPlaygroundUtils constructor.
 * 
 * @param FHIR_4_CONTENT_TYPE the content-type header, specifying the FHIR version 
 *                            (for FHIR R4 use 'application/fhir+json; fhirVersion=4.0')
 * @param BASE_URL            base-url for the FHIR server 
 *                            ('https://test.ahdis.ch/mag-bfh/fhir/' for Mobile Access Gateway)
 * @param MESSAGE_ENDPOINT    endpoint for processing FHIR messages
 *                            (usually '$process-message')
 * @param DEFAULT_TIMEOUT     how long to wait until a operation times out 
 *                            (in milliseconds, e.g. '20000')
 * @param SOURCE_ENDPOINT     Source endpoint for FHIR messaging
 *                            (e.g. 'http://example.com/patientSource')
 * @param TARGET_ENDPOINT     Target endpoint for FHIR messaging
 *                            (e.g. 'http://example.com/patientEndpoint')
 */
 export interface EpdPlaygroundUtilsSettings {
  FHIR_4_CONTENT_TYPE: string;
  BASE_URL: string;
  MESSAGE_ENDPOINT: string;
  DEFAULT_TIMEOUT: number;
  SOURCE_ENDPOINT: string;
  TARGET_ENDPOINT: string;
}

/**
 * Represents a Document Bundle Ressource.
 */
export interface Iti65DocumentBundle extends Bundle {
  resourceType: 'Bundle';
  meta: {
    profile: [
      'http://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Comprehensive.ProvideBundle'
    ];
  };
  type: BundleType.TRANSACTION;
  entry: Iti65DocumentBundleEntry[];
}

/**
 * Represents entry of a Document Bundle.
 * Order of resources should be followed.
 */
export interface Iti65DocumentBundleEntry {
  fullUrl: string;
  resource: Binary | List | DocumentReference;
  request: {
    method: BundleHTTPVerb.POST;
    url: string;
  };
}

/**
 * Search parameters for ITI-66
 *
 * @see IHE spec https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18.4.1.2.3.7.2
 */
export interface Iti66Params {
  code: string;
  date: string;
  designationType: string;
  identifier: string;
  patient: string;
  sourceId: string;
  status: ListStatus;
  'patient.identifier': string;
  'source.given': string;
  'source.family': string;
}

/**
 * Search parameters for ITI-67 Document Reference Search. Not all parameters may be
 * supported by the Mobile Access Gateway.
 *
 * Link to ITI-18 is given, because parameters are equivalent.
 *
 * @see IHR spec https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18.4.1.2.3.7.1
 */
export interface Iti67Params {
  'author.given': string;
  'author.family': string;
  category: string;
  creation: string;
  date: string;
  event: string;
  facility: string;
  format: string;
  identifier: string;
  patient: string;
  'patient.identifier': string;
  period: string;
  related: string;
  'security-label': string;
  setting: string;
  sourceId: string;
  status: DocumentReferenceStatus;
  type: string;
}

/**
 * Search parameters for ITI-78
 */
export interface Iti78Params {
  gender: string;
  family: string;
  given: string;
  'address-city': string;
  'address-country': string;
  'address-postalcode': string;
  'address-state': string;
  _id: string; // not supported in Mobile Access Gateway?
  active: string; // not supported in Mobile Access Gateway?
  identifier: string; // not supported in Mobile Access Gateway?
  telecom: string; // not supported in Mobile Access Gateway?
  birthdate: string; // not supported in Mobile Access Gateway?
  address: string; // not supported in Mobile Access Gateway?
  mothersMaidenName: string;  // not supported in Mobile Access Gateway?
}

/**
 * Enum for ITI-93 to define action of editing patient.
 */
export enum ITI_93_ACTION {
  ADD = 'add',
  UPDATE = 'update',
  MERGE = 'merge',
  REMOVE = 'remove' // Caution: remove is currently not supported on EPD Playground with Mobile Access Gateway
}

/**
 * Enum for ITI-104 to define action of editing patient.
 */
export enum ITI_104_ACTION {
  ADD = 'add',
  UPDATE = 'update',
  RESOLVE_DUPLICATE = 'resolve-duplicate',
  REMOVE = 'remove'
}

/**
 * Interface for different OIDs
 */
export interface Oids {
  eprSpid: string;
  mpiId: string;
  local: string;
  ahv: string;
  app: string;
}

export interface Settings {
  language: APP_LANGUAGES,
  organization: Organization,
  facilityType: Coding,
  practiceSetting: Coding
}

export enum APP_LANGUAGES {
  DE = 'de-CH',
  EN = 'en',
  FR = 'fr',
  IT = 'it'
}
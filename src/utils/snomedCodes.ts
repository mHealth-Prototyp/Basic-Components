import {SystemCodeExtension} from './fhirUtils';

/**
 * Class codes according to DocumentEntry.classCode definition:
 * @see https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.classCode.html#logical-definition-cld
 *
 * DocumentEntry.classCode is mapped to DocumentReference.category:
 * @see https://build.fhir.org/documentreference-mappings.html#xds
 */
export const CLASS_CODES = [
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371531000',
      display: 'Report of clinical encounter'
    },
    languageDisplays: {
      en: 'Report of clinical encounter',
      de: 'Bericht aufgrund einer Konsultation',
      fr: 'Rapport suite à une consultation',
      it: 'Rapporto di visita medica',
      rm: "Rapport sin basa d'ina consultaziun"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '721927009',
      display: 'Referral note'
    },
    languageDisplays: {
      en: 'Referral note',
      de: 'Zuweisungsschreiben',
      fr: 'Lettre de référence',
      it: "Lettera d'invio",
      rm: "Brev d'assegnaziun"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '721963009',
      display: 'Order'
    },
    languageDisplays: {
      en: 'Order',
      de: 'Untersuchungsauftrag',
      fr: "Mandat d'analyse",
      it: 'Prescrizione di analisi',
      rm: 'Incumbensa da consultaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '422735006',
      display: 'Summary clinical document'
    },
    languageDisplays: {
      en: 'Summary clinical document',
      de: 'Zusammenfassender Bericht',
      fr: 'Rapport de synthèse',
      it: 'Rapporto riassuntivo',
      rm: 'Rapport medicinal resumà'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371525003',
      display: 'Clinical procedure report'
    },
    languageDisplays: {
      en: 'Clinical procedure report',
      de: 'Interventionsbericht / Untersuchungsresultat',
      fr: "Rapport d'intervention / résultat de l’analyse",
      it: 'Rapporto operatorio / Referto di analisi',
      rm: "Rapport d'intervenziun / resultat da la consultaziun"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '734163000',
      display: 'Care Plan'
    },
    languageDisplays: {
      en: 'Care Plan',
      de: 'Behandlungsplan',
      fr: 'Plan de traitement',
      it: 'Piano di trattamento',
      rm: 'Plan da tractament'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '440545006',
      display: 'Prescription record'
    },
    languageDisplays: {
      en: 'Prescription record',
      de: 'Verschreibung / Rezept',
      fr: 'Prescription / ordonnance',
      it: 'Prescrizione medica',
      rm: 'Prescripziun / recept'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '184216000',
      display: 'Patient record type'
    },
    languageDisplays: {
      en: 'Patient record type',
      de: 'Langzeitdokumentation',
      fr: 'Documentation à long terme',
      it: 'Documentazione a lungo termine',
      rm: 'Documentaziun da lunga durada'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371537001',
      display: 'Consent report'
    },
    languageDisplays: {
      en: 'Consent report',
      de: 'Einwilligung zur Behandlung',
      fr: 'Consentement au traitement',
      it: 'Consenso al trattamento',
      rm: 'Consentiment al tractament'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371538006',
      display: 'Advance directive report'
    },
    languageDisplays: {
      en: 'Advance directive report',
      de: 'Patientenverfügung',
      fr: 'Directives anticipées',
      it: 'Direttive del paziente',
      rm: 'Disposiziun dal pazient'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722160009',
      display: 'Audit trail report'
    },
    languageDisplays: {
      en: 'Audit trail report',
      de: 'Rückverfolgung der EPD Zugriffe',
      fr: 'Traçabilité des accès aux DEP',
      it: 'Cronologia degli accessi alla CIP',
      rm: "Repersequitabladad da l'access al DEP"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722216001',
      display: 'Emergency medical identification record'
    },
    languageDisplays: {
      en: 'Emergency medical identification record',
      de: 'Notfall-ID / Ausweis',
      fr: "ID d'urgence / carte d’urgence",
      it: "Identificativo d'emergenza / scheda d'emergenza",
      rm: "Carta d'identitad per cas d'urgenza / document d'identitad"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '772790007',
      display: 'Organ donor card'
    },
    languageDisplays: {
      en: 'Organ donor card',
      de: 'Organspendeausweis',
      fr: "Carte de donneur d'organes",
      it: 'Tessera di donatore di organi',
      rm: "Attest da donatur d'organs"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '405624007',
      display: 'Administrative documentation'
    },
    languageDisplays: {
      en: 'Administrative documentation',
      de: 'Administratives Dokument',
      fr: 'Document administratif',
      it: 'Documento amministrativo',
      rm: 'Document administrativ'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '417319006',
      display: 'Record of health event'
    },
    languageDisplays: {
      en: 'Record of health event',
      de: 'Dokument zu gesundheitsrelevantem Ereignis',
      fr: "Document sur l'événement sanitaire",
      it: 'Documento concernente un evento rilevante per la salute',
      rm: 'Document concernent  in eveniment relevant per la sanadad'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '419891008',
      display: 'Record artifact'
    },
    languageDisplays: {
      en: 'Record artifact',
      de: 'Nicht näher bezeichnetes Dokument',
      fr: 'Document non précisé',
      it: 'Documento non meglio specificato',
      rm: 'Document betg designà pli precis'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '2171000195109',
      display: 'Obstetrical Record'
    },
    languageDisplays: {
      en: 'Obstetrical Record',
      de: 'Schwangerschafts-/ Geburtsbericht',
      fr: 'Rapport de grossesse / de naissance',
      it: 'Referto della gravidanza / del parto',
      rm: 'Rapport da gravidanza / da naschientscha'
    }
  }
];

/**
 * Type code according to DocumentEntry.typeCode definition:
 * @see http://build.fhir.org/ig/hl7ch/ch-epr-term/ValueSet-DocumentEntry.typeCode.html#logical-definition-cld
 *
 * DocumentEntry.typeCode is mapped to DocumentReference.type:
 * @see https://build.fhir.org/documentreference-mappings.html#xds
 */
export const TYPE_CODES = [
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371529009',
      display: 'History and physical report'
    },
    languageDisplays: {
      en: 'History and physical report',
      de: 'Anamnese / Untersuchungsbericht',
      fr: "Anamnèse / rapport d'analyse",
      it: 'Anamnesi / Rapporto di visita medica',
      rm: 'Anamnesa / rapport da consultaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '419891008',
      display: 'Record artifact'
    },
    languageDisplays: {
      en: 'Record artifact',
      de: 'Nicht näher bezeichnetes Dokument',
      fr: 'Document non précisé',
      it: 'Documento non meglio specificato',
      rm: 'Document betg specifitgà pli precis'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '721965002',
      display: 'Laboratory Order'
    },
    languageDisplays: {
      en: 'Laboratory Order',
      de: 'Laborauftrag',
      fr: "Mandat d'analyse en laboratoire",
      it: 'Richiesta di analisi di laboratorio',
      rm: 'Incumbensa da labor'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '721966001',
      display: 'Pathology order'
    },
    languageDisplays: {
      en: 'Pathology order',
      de: 'Pathologieauftrag',
      fr: "Mandat de rapport d'examen pathologique",
      it: 'Richiesta di esame istologico',
      rm: 'Incumbensa da patologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '4201000179104',
      display: 'Imaging report'
    },
    languageDisplays: {
      en: 'Imaging report',
      de: 'Befundbericht zur Bildgebung',
      fr: "Rapport de résultat relatif à l'imagerie",
      it: 'Referto di immaginografia',
      rm: 'Rapport dal resultat dals maletgs'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '737427001',
      display: 'Clinical Management plan'
    },
    languageDisplays: {
      en: 'Clinical Management plan',
      de: 'Behandlungsplan',
      fr: 'Plan de traitement',
      it: 'Piano di trattamento',
      rm: 'Plan da tractament'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '765492005',
      display: 'Non-drug prescription'
    },
    languageDisplays: {
      en: 'Non-drug prescription',
      de: 'Nicht-Arzneimittel-Verschreibung / Rezept',
      fr: 'Prescription sans médicaments / ordonnance',
      it: 'Prescrizione non di medicamenti',
      rm: 'Prescripziun senza medischinas / recept'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '773130005',
      display: 'Nursing care plan'
    },
    languageDisplays: {
      en: 'Nursing care plan',
      de: 'Pflegeplan',
      fr: 'Plan de soins',
      it: 'Piano di cura',
      rm: 'Plan da tgira'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '736055001',
      display: 'Rehabilitation care plan'
    },
    languageDisplays: {
      en: 'Rehabilitation care plan',
      de: 'Rehabilitationsplan',
      fr: 'Plan de réhabilitation',
      it: 'Piano di riabilitazione',
      rm: 'Plan da reabilitaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '761938008',
      display: 'Medical Prescription record'
    },
    languageDisplays: {
      en: 'Medical Prescription record',
      de: 'Arzneimittel-Verschreibung / Rezept',
      fr: 'Prescription de médicaments / ordonnance',
      it: 'Prescrizione di medicamenti',
      rm: 'Prescripziun da medischinas / recept'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722446000',
      display: 'Allergy record'
    },
    languageDisplays: {
      en: 'Allergy record',
      de: 'Allergieausweis',
      fr: 'Carnet des allergies',
      it: 'Passaporto delle allergie',
      rm: "Attest d'allergia"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '772786005',
      display: 'Medical certificate'
    },
    languageDisplays: {
      en: 'Medical certificate',
      de: 'Ärztliches Attest',
      fr: 'Certificat médical',
      it: 'Certificato medico',
      rm: 'Attest medical'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '373942005',
      display: 'Discharge summary'
    },
    languageDisplays: {
      en: 'Discharge summary',
      de: 'Austrittsbericht',
      fr: 'Rapport de sortie',
      it: 'Rapporto di dimissione',
      rm: "Rapport d'extrada"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371535009',
      display: 'Transfer summary report'
    },
    languageDisplays: {
      en: 'Transfer summary report',
      de: 'Überweisungsbericht',
      fr: 'Rapport de transfert',
      it: 'Rapporto di trasferimento',
      rm: "Rapport d'assegnaziun"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '445300006',
      display: 'Emergency department record'
    },
    languageDisplays: {
      en: 'Emergency department record',
      de: 'Notfallbericht',
      fr: "Rapport d'urgence",
      it: 'Referto di pronto soccorso',
      rm: "Rapport davart in cas d'urgenza"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '445418005',
      display: 'Professional allied to medicine clinical report'
    },
    languageDisplays: {
      en: 'Professional allied to medicine clinical report',
      de: 'Dokument ausserhalb des Behandlungskontextes',
      fr: 'Document hors contexte de traitement',
      it: 'Documento al di fuori del contesto trattato',
      rm: 'Document ordaifer il context dal tractament'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371530004',
      display: 'Consultation report'
    },
    languageDisplays: {
      en: 'Consultation report',
      de: 'Beurteilung durch Fachspezialisten',
      fr: 'Évaluation par des spécialistes',
      it: 'Valutazione dello specialista',
      rm: 'Rapport da la consultaziun clinica'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '4241000179101',
      display: 'Laboratory report'
    },
    languageDisplays: {
      en: 'Laboratory report',
      de: 'Laborbericht',
      fr: 'Rapport de laboratoire',
      it: 'Referto di laboratorio',
      rm: 'Rapport da labor'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371526002',
      display: 'Operative report'
    },
    languageDisplays: {
      en: 'Operative report',
      de: 'Operationsbericht',
      fr: "Rapport d'opération",
      it: 'Rapporto operatorio',
      rm: "Rapport d'operaziun"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371532007',
      display: 'Progress note'
    },
    languageDisplays: {
      en: 'Progress note',
      de: 'Verlaufsbericht',
      fr: "Rapport d'historique",
      it: 'Rapporto sul decorso',
      rm: "Rapport da l'andament"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '900000000000471006',
      display: 'Image'
    },
    languageDisplays: {
      en: 'Image',
      de: 'Bild',
      fr: 'Image',
      it: 'Immagine',
      rm: 'Maletg'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '41000179103',
      display: 'Immunization record'
    },
    languageDisplays: {
      en: 'Immunization record',
      de: 'Impfausweis',
      fr: 'Carnet de vaccination',
      it: 'Certificato di vaccinazione',
      rm: 'Attest da vaccinaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '371528001',
      display: 'Pathology report'
    },
    languageDisplays: {
      en: 'Pathology report',
      de: 'Pathologiebericht',
      fr: "Rapport d'examen pathologique",
      it: 'Referto istologico',
      rm: 'Rapport da la patologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '721912009',
      display: 'Medication summary document'
    },
    languageDisplays: {
      en: 'Medication summary document',
      de: 'Medikationsliste',
      fr: 'Liste de médication',
      it: 'Elenco dei medicamenti',
      rm: 'Glista da medicaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '2161000195103',
      display: 'Imaging Order'
    },
    languageDisplays: {
      en: 'Imaging Order',
      de: 'Bildgebungsauftrag',
      fr: "Mandat d'imagerie",
      it: 'Richiesta di immaginografia',
      rm: 'Incumbensa da far in maletg'
    }
  }
];

/**
 * Possible combinations of class and type according to this mapping:
 * @see http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html
 */
export const CLASS_TYPE_COMBINATIONS = [
  {
    classCode: '405624007',
    possibleTypeCodes: ['772786005', '419891008']
  },
  {
    classCode: '371538006',
    possibleTypeCodes: ['419891008']
  },
  {
    classCode: '722160009',
    possibleTypeCodes: ['419891008']
  },

  {
    classCode: '734163000',
    possibleTypeCodes: ['737427001', '773130005', '736055001', '419891008']
  },
  {
    classCode: '371525003',
    possibleTypeCodes: ['371526002', '4241000179101', '371528001', '4201000179104', '900000000000471006', '419891008']
  },
  {
    classCode: '371537001',
    possibleTypeCodes: ['419891008']
  },
  {
    classCode: '722216001',
    possibleTypeCodes: ['419891008']
  },
  {
    classCode: '2171000195109',
    possibleTypeCodes: ['419891008']
  },
  {
    classCode: '721963009',
    possibleTypeCodes: ['721965002', '721966001', '2161000195103', '419891008']
  },
  {
    classCode: '772790007',
    possibleTypeCodes: ['419891008']
  },
  {
    classCode: '184216000',
    possibleTypeCodes: ['722446000', '41000179103', '419891008']
  },
  {
    classCode: '440545006',
    possibleTypeCodes: ['761938008', '765492005', '419891008']
  },
  {
    classCode: '417319006',
    possibleTypeCodes: ['445300006', '445418005', '419891008']
  },
  {
    classCode: '721927009',
    possibleTypeCodes: ['419891008']
  },
  {
    classCode: '371531000',
    possibleTypeCodes: ['371530004', '371529009', '371532007', '419891008']
  },
  {
    classCode: '422735006',
    possibleTypeCodes: ['373942005', '371535009', '721912009', '419891008']
  },
  {
    classCode: '419891008',
    possibleTypeCodes: ['419891008']
  }
];

/**
 * Class codes according to DocumentEntry.healthcareFacilityTypeCode definition:
 * @see https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.healthcareFacilityTypeCode.html
 *
 * DocumentEntry.healthcareFacilityTypeCode is mapped to DocumentReference.facilityType:
 * @see https://build.fhir.org/documentreference-mappings.html#xds
 */
export const FACILITY_CLASS_CODES: SystemCodeExtension[] = [
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722171005',
      display: 'Diagnostic institution'
    },
    languageDisplays: {
      en: 'Diagnostic institution',
      de: 'Institution für medizinische Diagnostik',
      fr: "Institut d'aide au diagnostic",
      it: 'Istituto di diagnostica medica',
      rm: 'Instituziun per diagnostica medicinala'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '225728007',
      display: 'Accident and Emergency department'
    },
    languageDisplays: {
      en: 'Accident and Emergency department',
      de: 'Notfall-/Rettungsdienste',
      fr: "Service d'urgence et de sauvetage",
      it: 'Servizio di pronto soccorso e di salvataggio',
      rm: "Servetsch d'urgenza e da salvament"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394747008',
      display: 'Health Authority'
    },
    languageDisplays: {
      en: 'Health Authority',
      de: 'Gesundheitsbehörde',
      fr: 'Autorité sanitaire',
      it: 'Autorità sanitaria',
      rm: 'Autoritad da sanadad'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '66280005',
      display: 'Private home-based care'
    },
    languageDisplays: {
      en: 'Private home-based care',
      de: 'Organisation für Pflege zu Hause',
      fr: 'Soins à domicile',
      it: 'Servizio di assistenza e cura a domicilio',
      rm: 'Organisaziun per la tgira a chasa'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '22232009',
      display: 'Hospital'
    },
    languageDisplays: {
      en: 'Hospital',
      de: 'Stationäre Einrichtung/Spital',
      fr: 'Hôpital',
      it: 'Ospedale',
      rm: 'Ospital'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722172003',
      display: 'Military health institution'
    },
    languageDisplays: {
      en: 'Military health institution',
      de: 'Armeeärztliche Dienste',
      fr: "Service sanitaire de l'armée",
      it: 'Servizio di medicina militare',
      rm: 'Servetsch da medischina militara'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722173008',
      display: 'Prison based care site'
    },
    languageDisplays: {
      en: 'Prison based care site',
      de: 'Gesundheitseinrichtung in der Haftanstalt',
      fr: 'Service de santé en milieu carcéral',
      it: 'Struttura sanitaria in uno stabilimento carcerario',
      rm: 'Structura da sanadad en in stabiliment giudizial'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '42665001',
      display: 'Nursing home'
    },
    languageDisplays: {
      en: 'Nursing home',
      de: 'Pflegeheim',
      fr: 'Etablissement médico-social',
      it: 'Casa di cura',
      rm: 'Chasa da tgira'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '264372000',
      display: 'Pharmacy'
    },
    languageDisplays: {
      en: 'Pharmacy',
      de: 'Apotheke',
      fr: 'Pharmacie',
      it: 'Farmacia',
      rm: 'Apoteca'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '35971002',
      display: 'Ambulatory care site'
    },
    languageDisplays: {
      en: 'Ambulatory care site',
      de: 'Ambulante Einrichtung/Ambulatorium',
      fr: 'Etablissement ambulatoire',
      it: 'Struttura ambulatoriale, incl. gli studi medici',
      rm: 'Instituziun ambulanta/ambulatori'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '80522000',
      display: 'Rehabilitation hospital'
    },
    languageDisplays: {
      en: 'Rehabilitation hospital',
      de: 'Organisation für stationäre Rehabilitation',
      fr: 'Réadaptation stationnaire',
      it: 'Istituto di riabilitazione stazionaria',
      rm: 'Institut da reabilitaziun staziunara'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394778007',
      display: "Client's or patient's home"
    },
    languageDisplays: {
      en: "Client's or patient's home",
      de: 'Domizil des Patienten',
      fr: 'Domicile du patient',
      it: 'Domicilio del paziente',
      rm: 'Domicil dal pazient'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '288565001',
      display: 'Telemedicine institution'
    },
    languageDisplays: {
      en: 'Telemedicine institution',
      de: 'Telemedizinische Einrichtung',
      fr: 'Institut de télémédecine',
      it: 'Centro di telemedicina',
      rm: 'Instituziun da telemedischina'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '264358009',
      display: 'General practice premises'
    },
    languageDisplays: {
      en: 'General practice premises',
      de: 'Arztpraxis',
      fr: 'Cabinet médical',
      it: 'Studio medico',
      rm: 'Pratica da medi'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '43741000',
      display: 'Other Site of Care'
    },
    languageDisplays: {
      en: 'Other Site of Care',
      de: 'Andere Gesundheitsorganisation',
      fr: 'Autres prestataires de soins',
      it: 'Altre organizzazioni sanitarie',
      rm: 'Autras organisaziuns dals fatgs da tgira'
    }
  }
];

/**
 * Class codes according to DocumentEntry.practiceSettingCode definition:
 * @see https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.practiceSettingCode.html
 *
 * DocumentEntry.practiceSettingCode is mapped to DocumentReference.practiceSetting
 * @see https://build.fhir.org/documentreference-mappings.html#xds
 */
export const PRACTICE_SETTING_CODES: SystemCodeExtension[] = [
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394805004',
      display: 'Clinical immunology/allergy'
    },
    languageDisplays: {
      en: 'Clinical immunology/allergy',
      de: 'Immunologie/Allergologie',
      fr: 'Immunologie/Allergologie',
      it: 'Allergologia e immunologia clinica',
      rm: 'Immunologia/allergologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394802001',
      display: 'General medicine'
    },
    languageDisplays: {
      en: 'General medicine',
      de: 'Allgemeinmedizin',
      fr: 'Médecine générale',
      it: 'Medicina generale',
      rm: 'Medischina generala'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394577000',
      display: 'Anaesthesiology'
    },
    languageDisplays: {
      en: 'Anaesthesiology',
      de: 'Anästhesiologie',
      fr: 'Anesthésiologie',
      it: 'Anestesiologia',
      rm: 'Anestesiologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722414000',
      display: 'Vascular medicine'
    },
    languageDisplays: {
      en: 'Vascular medicine',
      de: 'Angiologie',
      fr: 'Angiologie',
      it: 'Angiologia',
      rm: 'Angiologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722170006',
      display: 'Chiropractic service'
    },
    languageDisplays: {
      en: 'Chiropractic service',
      de: 'Chiropraktik',
      fr: 'Chiropractie',
      it: 'Chiropratica',
      rm: 'Chiropratica'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394609007',
      display: 'General surgery'
    },
    languageDisplays: {
      en: 'General surgery',
      de: 'Chirurgie',
      fr: 'Chirurgie',
      it: 'Chirurgia',
      rm: 'Chirurgia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394582007',
      display: 'Dermatology'
    },
    languageDisplays: {
      en: 'Dermatology',
      de: 'Dermatologie und Venerologie',
      fr: 'Dermatologie et vénérologie',
      it: 'Dermatologia e venereologia',
      rm: 'Dermatologia e venerologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394583002',
      display: 'Endocrinology'
    },
    languageDisplays: {
      en: 'Endocrinology',
      de: 'Endokrinologie/Diabetologie',
      fr: 'Endocrinologie/diabétologie',
      it: 'Endocrinologia/diabetologia',
      rm: 'Endocrinologia/diabetologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '310093001',
      display: 'Occupational therapy service'
    },
    languageDisplays: {
      en: 'Occupational therapy service',
      de: 'Ergotherapie',
      fr: 'Ergothérapie',
      it: 'Ergoterapia',
      rm: 'Ergoterapia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722164000',
      display: 'Dietetics and nutrition'
    },
    languageDisplays: {
      en: 'Dietetics and nutrition',
      de: 'Ernährungsberatung',
      fr: 'Conseil en nutrition et diététique',
      it: 'Dietetica',
      rm: 'Cussegliaziun da nutriment'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394584008',
      display: 'Gastroenterology'
    },
    languageDisplays: {
      en: 'Gastroenterology',
      de: 'Gastroenterologie',
      fr: 'Gastroentérologie',
      it: 'Gastroenterologia',
      rm: 'Gastroenterologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394811001',
      display: 'Geriatric medicine'
    },
    languageDisplays: {
      en: 'Geriatric medicine',
      de: 'Geriatrie',
      fr: 'Gériatrie',
      it: 'Geriatria',
      rm: 'Geriatria'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394586005',
      display: 'Gynecology and Obstretrics'
    },
    languageDisplays: {
      en: 'Gynecology and Obstretrics',
      de: 'Gynäkologie und Geburtshilfe',
      fr: 'Gynécologie et obstétrique',
      it: 'Ginecologia e ostetricia',
      rm: 'Ginecologia ed assistenza al part'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394803006',
      display: 'Clinical haematology'
    },
    languageDisplays: {
      en: 'Clinical haematology',
      de: 'Hämatologie',
      fr: 'Hématologie',
      it: 'Ematologia',
      rm: 'Hematologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408466002',
      display: 'Cardiac surgery'
    },
    languageDisplays: {
      en: 'Cardiac surgery',
      de: 'Herzchirurgie',
      fr: 'Chirurgie cardiovasculaire',
      it: 'Chirurgia cardiovascolare',
      rm: 'Chirurgia dal cor'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408480009',
      display: 'Clinical immunology'
    },
    languageDisplays: {
      en: 'Clinical immunology',
      de: 'Immunologie',
      fr: 'Immunologie',
      it: 'Immunologia',
      rm: 'Immunologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394807007',
      display: 'Infectious diseases'
    },
    languageDisplays: {
      en: 'Infectious diseases',
      de: 'Infektionskrankheiten',
      fr: 'Maladies infectieuses',
      it: 'Malattia infettiva',
      rm: 'Malsognas infectusas'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '419192003',
      display: 'Internal medicine'
    },
    languageDisplays: {
      en: 'Internal medicine',
      de: 'Innere Medizin',
      fr: 'Médecine interne',
      it: 'Medicina interna',
      rm: 'Medischina interna'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408478003',
      display: 'Critical care medicine'
    },
    languageDisplays: {
      en: 'Critical care medicine',
      de: 'Intensivmedizin',
      fr: 'Médecine intensive',
      it: 'Medicina intensiva',
      rm: 'Medischina intensiva'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394579002',
      display: 'Cardiology'
    },
    languageDisplays: {
      en: 'Cardiology',
      de: 'Kardiologie',
      fr: 'Cardiologie',
      it: 'Cardiologia',
      rm: 'Cardiologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '310025004',
      display: 'Complementary therapy'
    },
    languageDisplays: {
      en: 'Complementary therapy',
      de: 'Komplementärmedizin',
      fr: 'Médecine alternative et complémentaire',
      it: 'Medicina complementare',
      rm: 'Medischina alternativa e cumplementara'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '708184003',
      display: 'Laboratory service'
    },
    languageDisplays: {
      en: 'Laboratory service',
      de: 'Labormedizin',
      fr: 'Médecin de laboratoire',
      it: 'Medicina di laboratorio',
      rm: 'Medischina da labor'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '310101009',
      display: 'Speech and language therapy service'
    },
    languageDisplays: {
      en: 'Speech and language therapy service',
      de: 'Logopädie',
      fr: 'Logopédie',
      it: 'Logopedia',
      rm: 'Logopedia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394580004',
      display: 'Clinical genetics'
    },
    languageDisplays: {
      en: 'Clinical genetics',
      de: 'Medizinische Genetik',
      fr: 'Génétique médicale',
      it: 'Genetica medica',
      rm: 'Genetica medicinala'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408465003',
      display: 'Oral and maxillofacial surgery'
    },
    languageDisplays: {
      en: 'Oral and maxillofacial surgery',
      de: 'Mund-, Kiefer- und Gesichtschirurgie',
      fr: 'Chirurgie dento-maxillo-faciale',
      it: 'Chirurgia oro-maxillo-facciale',
      rm: 'Chirurgia da la bucca, da la missella e da la fatscha'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394589003',
      display: 'Nephrology'
    },
    languageDisplays: {
      en: 'Nephrology',
      de: 'Nephrologie',
      fr: 'Néphrologie',
      it: 'Nefrologia',
      rm: 'Nefrologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394610002',
      display: 'Neurosurgery'
    },
    languageDisplays: {
      en: 'Neurosurgery',
      de: 'Neurochirurgie',
      fr: 'Neurochirurgie',
      it: 'Neurochirurgia',
      rm: 'Neurochirurgia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394591006',
      display: 'Neurology'
    },
    languageDisplays: {
      en: 'Neurology',
      de: 'Neurologie',
      fr: 'Neurologie',
      it: 'Neurologia',
      rm: 'Neurologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394576009',
      display: 'Accident & emergency'
    },
    languageDisplays: {
      en: 'Accident & emergency',
      de: 'Notfall- und Rettungsmedizin',
      fr: "Médecine d'urgence et de sauvetage",
      it: "Medicina d'urgenza e di salvataggio",
      rm: "Medischina d'urgenza e da salvament"
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394649004',
      display: 'Nuclear medicine'
    },
    languageDisplays: {
      en: 'Nuclear medicine',
      de: 'Nuklearmedizin',
      fr: 'Médecine nucléaire',
      it: 'Medicina nucleare',
      rm: 'Medischina nucleara'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394594003',
      display: 'Ophthalmology'
    },
    languageDisplays: {
      en: 'Ophthalmology',
      de: 'Ophthalmologie',
      fr: 'Ophtalmologie',
      it: 'Oftalmologia',
      rm: 'Oftalmologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394801008',
      display: 'Trauma and orthopedics'
    },
    languageDisplays: {
      en: 'Trauma and orthopedics',
      de: 'Orthopädie und Traumatologie',
      fr: "Chirurgie orthopédique et traumatologie de l'appareil locomoteur",
      it: "Chirurgia ortopedica e traumatologia dell'apparato locomotore",
      rm: 'Ortopedia e traumatologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '416304004',
      display: 'Osteopathic manipulative medicine'
    },
    languageDisplays: {
      en: 'Osteopathic manipulative medicine',
      de: 'Osteopathie',
      fr: 'Ostéopathie',
      it: 'Osteopatia',
      rm: 'Osteopatia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '418960008',
      display: 'Otolaryngology'
    },
    languageDisplays: {
      en: 'Otolaryngology',
      de: 'Oto-Rhino-Laryngologie',
      fr: 'Oto-rhino-laryngologie',
      it: 'Otorinolaringoiatria',
      rm: 'Oto-rino-laringologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394537008',
      display: 'Pediatrics'
    },
    languageDisplays: {
      en: 'Pediatrics',
      de: 'Pädiatrie',
      fr: 'Pédiatrie',
      it: 'Pediatria',
      rm: 'Pediatria'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394806003',
      display: 'Palliative medicine'
    },
    languageDisplays: {
      en: 'Palliative medicine',
      de: 'Palliativmedizin',
      fr: 'Médecine palliative',
      it: 'Medicina palliativa',
      rm: 'Medischina palliativa'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394595002',
      display: 'Pathology'
    },
    languageDisplays: {
      en: 'Pathology',
      de: 'Pathologie',
      fr: 'Pathologie',
      it: 'Patologia',
      rm: 'Patologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722165004',
      display: 'Nursing'
    },
    languageDisplays: {
      en: 'Nursing',
      de: 'Pflege',
      fr: 'Soins',
      it: 'Cure infermieristiche',
      rm: 'Tgira'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394600006',
      display: 'Clinical pharmacology'
    },
    languageDisplays: {
      en: 'Clinical pharmacology',
      de: 'Klinische Pharmakologie',
      fr: 'Pharmacologie clinique',
      it: 'Farmacologia clinica',
      rm: 'Farmacologia clinica'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '310080006',
      display: 'Pharmacy service'
    },
    languageDisplays: {
      en: 'Pharmacy service',
      de: 'Pharmazie-Dienstleistung',
      fr: 'Service pharmaceutique',
      it: 'Farmacia',
      rm: 'Servetsch farmaceutic'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722138006',
      display: 'Physiotherapy'
    },
    languageDisplays: {
      en: 'Physiotherapy',
      de: 'Physiotherapie',
      fr: 'Physiothérapie',
      it: 'Fisioterapia',
      rm: 'Fisioterapia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394611003',
      display: 'Plastic surgery'
    },
    languageDisplays: {
      en: 'Plastic surgery',
      de: 'Plastische, Rekonstruktive und Ästhetische Chirurgie',
      fr: 'Chirurgie plastique, reconstructrice et esthétique',
      it: 'Chirurgia plastica, ricostruttiva ed estetica',
      rm: 'Chirurgia plastica, reconstructiva ed estetica'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '418112009',
      display: 'Pulmonary medicine'
    },
    languageDisplays: {
      en: 'Pulmonary medicine',
      de: 'Pneumologie',
      fr: 'Pneumologie',
      it: 'Pneumologia',
      rm: 'Pneumologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '310087009',
      display: 'Podiatry service'
    },
    languageDisplays: {
      en: 'Podiatry service',
      de: 'Podologie',
      fr: 'Podologie',
      it: 'Podologia',
      rm: 'Podologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '409968004',
      display: 'Preventive medicine'
    },
    languageDisplays: {
      en: 'Preventive medicine',
      de: 'Präventionsmedizin',
      fr: 'Médecine préventive',
      it: 'Prevenzione',
      rm: 'Medischina preventiva'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394587001',
      display: 'Psychiatry'
    },
    languageDisplays: {
      en: 'Psychiatry',
      de: 'Psychiatrie und Psychotherapie',
      fr: 'Psychiatrie et psychothérapie',
      it: 'Psichiatria e psicoterapia',
      rm: 'Psicoterapia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722162001',
      display: 'Psychology'
    },
    languageDisplays: {
      en: 'Psychology',
      de: 'Psychologie',
      fr: 'Psychologie',
      it: 'Psicologia',
      rm: 'Psicologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '721961006',
      display: 'Psycho-Somatic medicine'
    },
    languageDisplays: {
      en: 'Psycho-Somatic medicine',
      de: 'Psychosomatik',
      fr: 'Psychosomatique',
      it: 'Medicina psicosomatica',
      rm: 'Medischina psicosomatica'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394914008',
      display: 'Radiology'
    },
    languageDisplays: {
      en: 'Radiology',
      de: 'Radiologie',
      fr: 'Radiologie',
      it: 'Radiologia',
      rm: 'Radiologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '419815003',
      display: 'Radiation oncology'
    },
    languageDisplays: {
      en: 'Radiation oncology',
      de: 'Radio-Onkologie/Strahlentherapie',
      fr: 'Radio-oncologie / radiothérapie',
      it: 'Radio-oncologia / radioterapia',
      rm: 'Radio-oncologia/radioterapia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '722204007',
      display: 'Legal medicine'
    },
    languageDisplays: {
      en: 'Legal medicine',
      de: 'Rechtsmedizin',
      fr: 'Médecine légale',
      it: 'Medicina legale',
      rm: 'Medischina legala'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394602003',
      display: 'Rehabilitation'
    },
    languageDisplays: {
      en: 'Rehabilitation',
      de: 'Rehabilitation',
      fr: 'Réadaptation',
      it: 'Riabilitazione',
      rm: 'Reabilitaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394810000',
      display: 'Rheumatology'
    },
    languageDisplays: {
      en: 'Rheumatology',
      de: 'Rheumatologie',
      fr: 'Rhumatologie',
      it: 'Reumatologia',
      rm: 'Reumatologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408456005',
      display: 'Thoracic surgery'
    },
    languageDisplays: {
      en: 'Thoracic surgery',
      de: 'Thoraxchirurgie',
      fr: 'Chirurgie thoracique',
      it: 'Chirurgia toracica',
      rm: 'Chirurgia toraxala'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394819004',
      display: 'Transfusion medicine'
    },
    languageDisplays: {
      en: 'Transfusion medicine',
      de: 'Transfusionsmedizin',
      fr: 'Médecine transfusionnelle',
      it: 'Medicina trasfusionale',
      rm: 'Transfusiun da sang'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408448007',
      display: 'Tropical medicine'
    },
    languageDisplays: {
      en: 'Tropical medicine',
      de: 'Tropen- und Reisemedizin',
      fr: 'Médecine tropicale et des voyages',
      it: 'Medicina tropicale e di viaggio',
      rm: 'Medischina da las tropas e da viadis'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394612005',
      display: 'Urology'
    },
    languageDisplays: {
      en: 'Urology',
      de: 'Urologie',
      fr: 'Urologie',
      it: 'Urologia',
      rm: 'Urologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394812008',
      display: 'Dental medicine'
    },
    languageDisplays: {
      en: 'Dental medicine',
      de: 'Zahnheilkunde',
      fr: 'Odontologie',
      it: 'Odontoiatria',
      rm: 'Medischina dentala'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394592004',
      display: 'Clinical oncology'
    },
    languageDisplays: {
      en: 'Clinical oncology',
      de: 'Onkologie',
      fr: 'Oncologie',
      it: 'Oncologia medica',
      rm: 'Oncologia'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '408477008',
      display: 'Transplant surgery'
    },
    languageDisplays: {
      en: 'Transplant surgery',
      de: 'Transplantationsmedizin',
      fr: 'Médecine de la transplantation',
      it: 'Medicina dei trapianti',
      rm: 'Medischina da transplantaziun'
    }
  },
  {
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '394658006',
      display: 'Other clinical specialty'
    },
    languageDisplays: {
      en: 'Other clinical specialty',
      de: 'Andere nicht näher spezifizierte medizinische Fachrichtung',
      fr: 'Autres spécialisations non spécifiées',
      it: 'Altre specialità mediche non meglio precisate',
      rm: 'Auters secturs medicinals betg precisads'
    }
  }
];

<template>
  <QCard class="immunization-card">
    <p v-if="invalid" class="invalid-warning" color="warning">
      {{ componentTranslations.invalidDocument }}
    </p>
    <div v-else>
      <QCardSection
        v-if="name"
        class="card-title">
        <h2>
          {{ componentTranslations.title }}
          <span class="patient-name">{{ name }}</span>
          <!-- this comment is necessary because of "prettier"-->,
          {{ new Intl.DateTimeFormat($props.languageString).format(birthDate) }}
        </h2>
      </QCardSection>

      <QCardSection v-if="vaccinations.length > 0" class="vaccionation-table-section">
        <h3 class="section-title">{{ componentTranslations.vaccinationTitle }}</h3>
        <QTable
          dense
          :rows="vaccinations"
          :columns="vaccinationTableColumns"
          :visible-columns="isMobile ? mobileVaccionationVisibleCols : vaccionationVisibleCols"
          :row-key="name"
          :pagination="{rowsPerPage: 0}"
          @row-click="
            (_, element) => {
              vaccinationDetail = element;
              showVaccinationDetails = true;
            }
          ">
        </QTable>

        <q-dialog v-model="showVaccinationDetails" class="vaccionation-detail-dialog">
          <q-card v-if="vaccinationDetail">
            <q-card-section>
              <div class="text-h6">
                {{
                  vaccinationDetail.name +
                  (vaccinationDetail.occurence
                    ? ' (' + new Intl.DateTimeFormat($props.languageString).format(vaccinationDetail.occurence) + ')'
                    : '')
                }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none vaccination-details">
              <table>
                <tr>
                  <td>{{ componentTranslations.targetDisease }}</td>
                  <td>{{ vaccinationDetail.targetDisease.reduce((a, b) => a + ', ' + b) }}</td>
                </tr>
                <tr>
                  <td>{{ componentTranslations.doseNumber }}</td>
                  <td>
                    {{ vaccinationDetail.dose }}
                  </td>
                </tr>
                <tr>
                  <td>{{ componentTranslations.completed }}</td>
                  <td>
                    {{ vaccinationDetail.completed ? componentTranslations.yes : componentTranslations.no }}
                  </td>
                </tr>
                <tr>
                  <td>{{ componentTranslations.performer }}</td>
                  <td>
                    {{ vaccinationDetail.performer }}
                  </td>
                </tr>
                <tr>
                  <td>{{ componentTranslations.code }}</td>
                  <td>
                    {{ vaccinationDetail.code }}
                  </td>
                </tr>
              </table>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                v-close-popup
                flat
                label="OK"
                color="primary"
                @click="vaccinationDetail = undefined" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </QCardSection>

      <QCardSection v-else-if="vaccinationAbsentReason != undefined" class="vaccionation-absent-info">
        <p class="no-vaccinations-hint">{{ getAbsentReason() }}</p>
      </QCardSection>

      <QCardSection v-else>
        <p class="no-vaccinations-hint">{{ componentTranslations.noVaccines }}</p>
      </QCardSection>


      <QCardSection v-if="risks.length > 0" class="vaccionation-risk-section">
        <h3 class="section-title">{{ componentTranslations.riskTitle }}</h3>
        <ul class="risk-list">
          <li
            v-for="risk of risks"
            :key="risk.code">
            {{ risk.display }}
            <span class="risk-detail"
              >({{
                componentTranslations.recordedBy +
                risk.recorder +
                componentTranslations.recordedOn +
                Intl.DateTimeFormat($props.languageString).format(risk.recorded)
              }})</span
            >
          </li>
        </ul>
      </QCardSection>

      <QCardSection v-else>
        <p class="no-vaccinations-hint">{{ componentTranslations.noRisks }}</p>
      </QCardSection>

      <QCardSection
        v-if="metadata"
        class="vaccination-metadata-section">
        <table>
          <tr>
            <td>{{ componentTranslations.creator }}</td>
            <td>{{ metadata.creator }}</td>
          </tr>
          <tr>
            <td>{{ componentTranslations.createdOn }}</td>
            <td>
              {{
                new Intl.DateTimeFormat($props.languageString, {
                  dateStyle: 'full',
                  timeStyle: 'long'
                }).format(metadata.documentDate)
              }}
            </td>
          </tr>
        </table>
      </QCardSection>
    </div>
  </QCard>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {
  getFullName,
  ImmunizationStatus,
  Organization,
  Patient,
  Practitioner,
  PractitionerRole,
  Reference,
  selectName
} from '@i4mi/fhir_r4';
import {QCard, QCardSection, QTable, QBtn, QDialog, QCardActions} from 'quasar';
import {VaccinationDocumentCardTranslationStrings} from '../TranslationInterfaces';
import FhirUtils, {FhirUtilLanguageType} from '../utils/fhirUtils';

import * as DE from '../assets/de.json';
import * as FR from '../assets/fr.json';
import {
  CHDocumentEPR,
  CHPatientEPR,
  CHVacdCompositionVaccinationRecord,
  CHVacdCondition,
  CHVacdImmunization,
  CHVacdVaccinationRecordDocument
} from '@i4mi/fhir_ch';

const VACC_CODE_SYSTEMS = [
  'http://fhir.ch/ig/ch-vacd/CodeSystem/ch-vacd-swissmedic-cs',
  'http://fhir.ch/ig/ch-vacd/CodeSystem/ch-vacd-myvaccines-cs'
];
const NO_VACC_CODES = ['no-immunization-info', 'no-known-immunizations'];

class VaccinationDocumentCardTranslations implements VaccinationDocumentCardTranslationStrings {
  unknown = '';
  yes = '';
  no = '';
  title = '';
  creator = '';
  createdOn = '';
  vaccine = '';
  doseNumber = '';
  targetDisease = '';
  completed = '';
  occurence = '';
  performer = '';
  code = '';
  recordedBy = '';
  recordedOn = '';
  vaccinationTitle = 'n';
  riskTitle = '';
  invalidDocument = '';
  absentReasonNoImmunizationInfo = '';
  absentReasonNoKnownImmunizations = '';
  noVaccines = '';
  noRisks = '';
}

interface Vaccination {
  code: string;
  name: string;
  dose: number;
  targetDisease: string[];
  completed: boolean;
  lot: string;
  performer: string;
  occurence?: Date;
}

interface Risk {
  code: string;
  display: string;
  recorder?: string;
  date?: Date;
  recorded: Date;
}

interface TableColums {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  rawSort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: 'ad' | 'da';
  format?: (val: any, row: any) => any;
  style?: string | ((row: any) => string);
  classes?: string | ((row: any) => string);
  headerStyle?: string;
  headerClasses?: string;
}

export default defineComponent({
  name: 'VaccinationDocumentCard',
  components: {QCard, QCardSection, QTable, QBtn, QDialog, QCardActions},
  data() {
    return {
      risks: new Array<Risk>(),
      vaccinations: new Array<Vaccination>(),
      name: undefined as string | undefined,
      birthDate: undefined as Date | undefined,
      vaccinationAbsentReason: undefined as string | undefined,
      metadata: undefined as {documentDate: Date; creator: string} | undefined,
      componentTranslations: new VaccinationDocumentCardTranslations(),
      vaccionationVisibleCols: ['vaccine', 'target', 'occurence'],
      mobileVaccionationVisibleCols: ['vaccine', 'occurence'],
      vaccinationTableColumns: new Array<TableColums>(),
      vaccinationDetail: undefined as Vaccination | undefined,
      showVaccinationDetails: false,
      previousLanguage: undefined as string | undefined,
      invalid: false
    };
  },
  i18n: {
    messages: {
      'de-CH': DE.vaccinationDocument,
      'fr-CH': FR.vaccinationDocument
    }
  },
  props: {
    /**
     * The Vaccination Record Document (Bundle with type = document) to be displaey
     */
    document: {
      type: Object as PropType<CHVacdVaccinationRecordDocument>,
      required: true
    },
    /**
     * Strings to overwrite default translations of component. Overwrite by individual keys is supported.
     * @see   VaccinationDocumentCardTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<VaccinationDocumentCardTranslationStrings>,
      required: false
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
     * Defines if component is displayed on a mobile device (with less screen space)
     */
    isMobile: {
      type: Boolean,
      required: false
    }
  },
  created() {
    this.parseDocument(this.$props.document);
    this.setupTranslations();
    this.setTableColumns();
  },
  updated() {
    // TODO: check if necessary
    if (this.previousLanguage !== this.$props.languageString.toUpperCase()) {
      this.setupTranslations();
      this.setTableColumns();
    }
    this.parseDocument(this.$props.document);
  },
  methods: {
    /**
     * Gets the necessary stuff out of the CH VACD Vaccionation Record Document
     */
    parseDocument(doc: CHVacdVaccinationRecordDocument) {
      this.invalid = false;
      try {
        doc.entry.forEach((entry) => {
        switch (entry.resource?.resourceType) {
          // Composition document metadata
          case 'Composition':
            const comp = entry.resource as CHVacdCompositionVaccinationRecord;
            let creatorResource = this.$props.fhirUtils.getLinkedResource(
              doc,
              comp.author[0].reference || ''
            ) as Patient;
            this.metadata = {
              documentDate: new Date(comp.date),
              creator: creatorResource?.name
                ? getFullName(selectName(creatorResource.name))
                : this.translations?.unknown || ''
            };
            break;

          // Patient resource
          case 'Patient':
            const pat = entry.resource as CHPatientEPR;
            this.birthDate = new Date(pat.birthDate);
            this.name = getFullName(selectName(pat.name));
            break;

          // Immunization
          case 'Immunization':
            const vacc = entry.resource as CHVacdImmunization;
            const vacc_coding = vacc.vaccineCode.coding?.find(
              (coding) => coding.system && VACC_CODE_SYSTEMS.includes(coding.system)
            );

            if (!vacc_coding?.code || NO_VACC_CODES.includes(vacc_coding.code)) {
              this.vaccinationAbsentReason = vacc_coding?.code;
            } else {
              vacc.protocolApplied.forEach((protocol, i) => {
                this.vaccinations.push({
                  code: vacc_coding.system?.split('/').at(-1) + '|' + vacc_coding.code + '|' + i,
                  name: vacc_coding.display || this.translations?.unknown || '',
                  dose: protocol.doseNumberPositiveInt,
                  targetDisease: protocol.targetDisease.map((td) =>
                    td.coding && td.coding[0] && td.coding[0].display
                      ? td.coding[0].display?.split(' (')[0]
                      : this.translations?.unknown || ''
                  ),
                  completed: vacc.status === ImmunizationStatus.COMPLETED,
                  lot: vacc.lotNumber || this.translations?.unknown || '',
                  performer: vacc.performer
                    ? this.getPractitionerDisplay(doc, vacc.performer[0].actor)
                    : this.translations?.unknown || '',
                  occurence: vacc.occurrenceDateTime ? new Date(vacc.occurrenceDateTime) : undefined
                });
              });
            }
            break;

          // Risk
          case 'Condition':
            const condition = entry.resource as CHVacdCondition;
            const coding = condition.code?.coding ? condition.code?.coding[0] : undefined;

            if (coding?.system && coding.code) {
              this.risks.push({
                code: coding.system + coding.code,
                display: coding.display?.split(' (')[0] || this.translations?.unknown || '',
                recorder: this.getPractitionerDisplay(doc, condition.recorder),
                date: condition.onsetDateTime ? new Date(condition.onsetDateTime) : undefined,
                recorded: new Date(condition.recordedDate)
              });
            }

            break;
        }
      });
      }
      catch(e) {
        console.log('Error parsing vaccination document', e, doc);
        this.invalid = true;
      }

    },
    /**
     * Sets up the table columns, needs to be recalled after language changes
     */
     setTableColumns() {
      this.vaccinationTableColumns = [
      { name: 'name', label: 'code', field: 'code' },
      {
        name: 'vaccine',
        label: this.componentTranslations.vaccine,
        field: 'name',
        sortable: true,
        align: 'left',
        format: (name) => name.length > 40
              ? name.substring(0,37) + '...'
              : name
      },
      { name: 'dose', label: this.componentTranslations.doseNumber, field: 'dose', sortable: true, align: 'center' },
      {
        name: 'target',
        label: this.componentTranslations.targetDisease,
        field: 'targetDisease',
        sortable: true,
        align: 'left',
        format: (tds: string[]) => {
          const str = tds.reduce((a, b) => a + ', ' + b);
          return str.length > 50
            ? str.substring(0,47) + '...'
            : str
        }
      },
      {
        name: 'completed',
        label: this.componentTranslations.completed,
        field: 'completed',
        sortable: true,
        align: 'left',
        format: (v: boolean) => (v ? this.componentTranslations.yes : this.componentTranslations.no)
      },
      {
        name: 'occurence',
        label: this.componentTranslations.occurence,
        field: 'occurence',
        sortable: true,
        align: 'left',
        format: (d: Date) => {
          try {
            return new Intl.DateTimeFormat(this.$props.languageString).format(d)
          } catch(e) {
            return d.toString()
          }
        }
      },
      {
        name: 'actor',
        label: this.componentTranslations.performer,
        field: 'performer',
        sortable: true,
        align: 'left',
        format: (d: Date) => {
          try {
            return new Intl.DateTimeFormat(this.$props.languageString).format(d)
          } catch(e) {
            return d.toString()
          }
        }
      }
    ];
     },
    /**
     * Fetches a practitioner from a document Bundle
     */
    getPractitionerDisplay(bundle: CHDocumentEPR, reference?: Reference): string {
      if (!reference || !reference.reference) return this.translations?.unknown || '';

      let practitioner: Practitioner | undefined;
      let organization: Organization | undefined;

      if (reference.reference.includes('PractitionerRole')) {
        const practitionerRole = this.$props.fhirUtils.getLinkedResource(bundle, reference.reference) as
          | PractitionerRole
          | undefined;
        practitioner = this.$props.fhirUtils.getLinkedResource(bundle, practitionerRole?.practitioner?.reference) as
          | Practitioner
          | undefined;
        organization = this.$props.fhirUtils.getLinkedResource(bundle, practitionerRole?.organization?.reference) as
          | Organization
          | undefined;
      }

      return getFullName(selectName(practitioner?.name || [])) + (organization ? ' (' + organization.name + ')' : '');
    },
    getAbsentReason(): string {

      switch(this.vaccinationAbsentReason) {
        case 'no-immunization-info':
          return this.componentTranslations.absentReasonNoImmunizationInfo;
        case 'no-known-immunizations':
          return this.componentTranslations.absentReasonNoKnownImmunizations;
        default: return '';
      }
    },
    /**
     * Iterates over translation keys, sets default translation or set from prop.
     */
    setupTranslations() {
      let defaultTranslations = this.componentTranslations;
      this.previousLanguage = this.$props.languageString.toUpperCase();

      for (let i in defaultTranslations) {
        if (defaultTranslations.hasOwnProperty(i)) {
          type ObjectKey = keyof typeof defaultTranslations;
          const translationKey = i as ObjectKey;

          if (this.translations && this.translations[translationKey]) {
            // there is a translation from prop
            this.componentTranslations[translationKey] = this.translations[translationKey];
          } else if (this.previousLanguage == 'DE') {
            // we take default translation from component I18N
            this.componentTranslations[translationKey] = DE.vaccinationDocument[translationKey];
          } else if (this.previousLanguage == 'FR') {
            // we take default translation from component I18N
            this.componentTranslations[translationKey] = FR.vaccinationDocument[translationKey];
          } else if (this.$t('vaccinationDocument.' + translationKey) && this.$t('vaccinationDocument.' + translationKey) !== 'vaccinationDocument.' + translationKey) {
            // there is a translation from parent I18N
            this.componentTranslations[translationKey] = this.$t('vaccinationDocument.' + translationKey);
          } else {
            this.componentTranslations[translationKey] = translationKey
          }
        }
      }
    }
  }
});
</script>
<style lang="scss">
.card-title h2 {
  font-size: unset;
  line-height: unset;
}
.card-title .patient-name {
  font-weight: bolder;
}
.section-title {
  font-size: unset;
  font-weight: bolder;
  padding-left: 0.5em;
  padding-bottom: 0.5em;
  line-height: unset;
}
.risk-list {
  margin: 0;
}
.risk-detail {
  color: darkgrey;
}
.vaccination-metadata-section table {
  padding: 0.3em;
  background-color: #fafafa;
  border-radius: 0.3em;
  width: 100%;
}
.invalid-warning {
  padding: 2em;
}
</style>

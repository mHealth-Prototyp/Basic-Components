<template>
  <div v-if="translations" class="allergy-view">
    <div v-if="isAllergy">
      <!-- resource describes an allergy or intolerance -->
      <div class="allergy-header" v-if="isHeaderNeeded">

        <div class="text-h4 hyphenate" v-if="showTitle">
          {{  allergyCodeDisplay  }}
        </div>

        <div class="header-info">
          <QBadge v-if="allergy?.clinicalStatus" outline align="middle" class="clinical-status"
            :color="renderClinicalStateColor">
            {{  clinicalStateDisplay  }}
          </QBadge>

          <QBadge v-if="allergy?.onsetDateTime" outline align="middle" color="black">
            {{  dateFormatter.format(new Date(allergy?.onsetDateTime))  }}
          </QBadge>
        </div>

        <div class="header-info">
          <QBadge v-if="allergy?.recorder && allergy?.recorder.type && allergy?.recorder.type == 'Practicioner'"
            align="middle" color="light-blue" text-color="white">
            <QIcon name="fas fa-user-md" color="white" />
            {{  allergy?.recorder.display  }}
          </QBadge>
          <QBadge v-if="allergy?.recorder && allergy?.recorder.type && allergy?.recorder.type == 'Patient'"
            align="middle" color="light-green" text-color="white">
            <QIcon name="fas fa-user" color="white" />
            {{  allergy?.recorder.display  }}
          </QBadge>
        </div>
      </div>

      <div class="row" v-if="allergy?.type">
        <div class="col-1">{{  translations.typeLabel  }}:</div>
        <div class="col-2">{{  type  }}</div>
      </div>

      <div class="row" v-if="allergy?.verificationStatus">
        <div class="col-1">{{  translations.verificationStateLabel  }}:</div>
        <div class="col-2">{{  verificationStateDisplay  }}</div>
      </div>

      <div class="row" v-if="allergy?.category">
        <div class="col-1">{{  translations.categoryLabel  }}:</div>
        <div class="col-2">{{  renderCategory  }}</div>
      </div>

      <div class="row" v-if="allergy?.criticality">
        <div class="col-1">{{  translations.criticalityLabel  }}:</div>
        <div class="col-2">{{  renderCriticality  }}</div>
      </div>

      <div class="row" v-if="allergy?.note">
        <div class="col-1">{{  translations.noteLabel  }}:</div>
        <div class="col-2">{{  renderNote  }}</div>
      </div>

      <div class="row expansion-row">
        <QExpansionItem v-if="allergy?.reaction && allergy.reaction.length > 0"
          :label="allergy.reaction.length + ' ' + (allergy.reaction.length === 1 ? translations.reactionLabel : translations.reactionsLabel) + ':'">
          <QList bordered separator>
            <QItem v-for="reaction in allergy.reaction" :key="reaction.id" class="reaction-item">

              <template v-if="isReactionManifestationKnown(reaction.manifestation)">
                <QItemLabel class="reaction-title">{{  renderReactionManifestations(reaction.manifestation)  }}
                </QItemLabel>
              </template>
              <template
                v-else-if="!isReactionManifestationKnown(reaction.manifestation) && reaction.extension && isReactionLocationAvailable(reaction)">
                <QItemLabel class="reaction-title">{{  renderReactionLocation(reaction.extension)  }}</QItemLabel>
              </template>

              <QItemLabel v-if="reaction.onset" caption class="reaction-detail">
                <div class="reaction-property-name">{{  translations.reactionDateLabel  }}: </div>
                <div class="reaction-property-value">{{  dateFormatter.format(new Date(reaction.onset))  }}</div>
              </QItemLabel>

              <QItemLabel v-if="reaction.severity" caption class="reaction-detail">
                <div class="reaction-property-name">{{  translations.reactionSeverityLabel  }}: </div>
                <div class="reaction-property-value">{{  renderReactionSeverity(reaction.severity)  }}</div>
              </QItemLabel>

              <QItemLabel v-if="reaction.substance" caption class="reaction-detail">
                <div class="reaction-property-name">{{  translations.reactionSubstanceLabel  }}: </div>
                <div class="reaction-property-value">{{  renderReactionSubstance(reaction.substance)  }}</div>
              </QItemLabel>

              <QItemLabel
                v-if="isReactionManifestationKnown(reaction.manifestation) && reaction.extension && isReactionLocationAvailable(reaction)"
                caption class="reaction-detail">
                <!-- only render if manifestation is also given, otherwise it will be shown twice -->
                <div class="reaction-property-name">{{  translations.reactionLocationLabel  }}: </div>
                <div class="reaction-property-value">{{  renderReactionLocation(reaction.extension)  }}</div>
              </QItemLabel>

              <QItemLabel v-if="reaction.description" caption class="reaction-detail">
                <div class="reaction-property-name">{{  translations.reactionDescriptionLabel  }}: </div>
                <div class="reaction-property-value">{{  reaction.description  }}</div>
              </QItemLabel>

              <QItemLabel v-if="reaction.extension && isExposureDateAvailable(reaction)" caption
                class="reaction-detail">
                <div class="reaction-property-name">{{  translations.exposureDateLabel  }}: </div>
                <div class="reaction-property-value">{{  renderExposureDate(reaction.extension)  }}</div>
              </QItemLabel>

              <QItemLabel v-if="reaction.exposureRoute" caption class="reaction-detail">
                <div class="reaction-property-name">{{  translations.exposureRouteLabel  }}: </div>
                <div class="reaction-property-value">{{  renderExposureRoute(reaction.exposureRoute)  }}</div>
              </QItemLabel>

              <QItemLabel v-if="reaction.note" caption class="reaction-detail">
                <div class="reaction-property-name">{{  translations.reactionNoteLabel  }}: </div>
                <div class="reaction-property-value">{{  renderReactionNote(reaction.note)  }}</div>
              </QItemLabel>
            </QItem>
          </QList>
        </QExpansionItem>
      </div>

      <div v-if="additionalInformation && additionalInformation[languageString]" class="row additional-infos">
        <p>{{  translations.additionalInformation  }}</p>
        <ul>
          <li v-for="info in additionalInformation[languageString]" :key="info.name">
            <a :href=info.url target="_blank">
              {{  info.name  }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <!-- resource describes the negation of an allergy or intolerance -->
      <div class="allergy-header" v-if="isHeaderNeeded">
        <div class="text-h4 hyphenate" v-if="showTitle">
          {{  allergyCodeDisplay  }}
        </div>

        <div class="header-info">
          <QBadge v-if="allergy?.clinicalStatus" outline align="middle" class="clinical-status"
            :color="renderClinicalStateColor">
            {{  clinicalStateDisplay  }}
          </QBadge>

          <QBadge v-if="allergy?.onsetDateTime" outline align="middle" color="black">
            {{  dateFormatter.format(new Date(allergy?.onsetDateTime))  }}
          </QBadge>
        </div>

        <div class="header-info">
          <QBadge v-if="allergy?.recorder && allergy?.recorder.type && allergy?.recorder.type == 'Practicioner'"
            align="middle" color="light-blue" text-color="white">
            <QIcon name="fas fa-user-md" color="white" />
            {{  allergy?.recorder.display  }}
          </QBadge>
          <QBadge v-if="allergy?.recorder && allergy?.recorder.type && allergy?.recorder.type == 'Patient'"
            align="middle" color="light-green" text-color="white">
            <QIcon name="fas fa-user" color="white" />
            {{  allergy?.recorder.display  }}
          </QBadge>
        </div>
      </div>

      <div class="row" v-if="allergy?.verificationStatus">
        <div class="col-1">{{  translations.verificationStateLabel  }}:</div>
        <div class="col-2">{{  verificationStateDisplay  }}</div>
      </div>

      <div class="row" v-if="allergy?.note">
        <div class="col-1">{{  translations.noteLabel  }}:</div>
        <div class="col-2">{{  renderNote  }}</div>
      </div>
    </div>

    <div class="data-info" v-if="!isEnoughDataAvailable">
      <p>{{  translations.noOtherDataAvailable  }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { AllergyViewTranslationStrings } from '../TranslationInterfaces';
import FhirUtils, { CHAllergyIntolerance, FhirUtilLanguageType, OPENEHR_EXPOSURE_DATE_URL, OPENEHR_EXPOSURE_LOCATION_URL } from '../utils/fhirUtils';
import EpdPlaygroundUtils from '../utils/epdPlaygroundUtils';
import { AllergyIdentificationType, AllergySystemCodeExtension, ALLERGY_IDENTIFICATION_CODES, CATEGORY_CODES, CLINICAL_STATUS_CODES, CRITICALITY_CODES, EXPOSURE_PATH_CODES, getAllergyIdentificationCodesByType, REACTION_MANIFESTATION_CODES, REACTION_SEVERITY_CODES, REACTION_SUBSTANCE_CODES, VERIFICATION_STATUS_CODES } from '../utils/allergyCodes';
import { AllergyIntoleranceReaction, AllergyIntoleranceSeverity, AllergyIntoleranceType, Annotation, CodeableConcept, Extension } from '@i4mi/fhir_r4';
import { QExpansionItem, QList, QItem, QItemLabel, QBadge, QIcon } from 'quasar';

/**
 * Displays data of an AllergyIntolerance resource.
 */
export default defineComponent({
  name: 'AllergyView',
  components: { QExpansionItem, QList, QItem, QItemLabel, QBadge, QIcon },
  data() {
    return {
      isAllergy: false,             // false if allergy data describes an absence of an allergy
      allergy: undefined as CHAllergyIntolerance | undefined,
                                    // allergy intolerance resource to display
      allergyCode: undefined as string | undefined,
                                    // code of the allergy
      additionalInformation: undefined as {  // additional information about allergy
                            [lang: string]: { 
                              name: string; 
                              url: string
                            }[]
                          } | undefined,       
      dateFormatter: new Intl.DateTimeFormat(this.languageString)
                                    // helper for formating date according to locale
    };
  },
  props: {
    /**
     * An allergy intolerance resource.
     */
    allergyIntolerance: {
      type: Object as PropType<CHAllergyIntolerance>,
      required: true
    },
    /**
     * If true it shows the code display of the allergy resource as title.
     * Default if not provided: false.
     */
    showTitle: {
      type: Boolean,
      required: false
    },
    /**
     * Strings for displaying on the page.
     * @see   AllergyViewTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<AllergyViewTranslationStrings>,
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
  },
  beforeMount() {
    this.allergy = this.allergyIntolerance;

    if (this.allergy && this.allergy.code && this.allergy.code.coding && this.allergy.code.coding.length > 0 && this.allergy.code.coding[0].code) {

      // set code and display
      this.allergyCode = this.allergy.code.coding[0].code;

      // check for additional information
      this.additionalInformation = ALLERGY_IDENTIFICATION_CODES.find(codeEntry => codeEntry.defaultCoding.code == this.allergyCode)?.additionalInformation;

      // check if we have a allergy absence entry
      if (getAllergyIdentificationCodesByType([AllergyIdentificationType.SITUATION]).find(code => code.defaultCoding.code == this.allergyCode)) {
        this.isAllergy = false;
      } else {
        this.isAllergy = true;
      }
    } else {
      console.warn('AllergyIntolerance resource is missing code property.');
    }
  },
  methods: {
    /**
     * Returns true if no manifestation has display Unknown.
     * @param manifestations manifestations of the reaction
     */
    isReactionManifestationKnown(manifestations: CodeableConcept[]): boolean {
      if (manifestations && manifestations.length > 0) {
        let isKnown = true;
        manifestations.forEach(manifestation => {
          if (manifestation && manifestation.coding && manifestation.coding.length > 0 && manifestation.coding[0].display && manifestation.coding[0].display == 'Unknown') {
            isKnown = false;
          }
        });
        return isKnown;
      } else {
        return false;
      }
    },
    /**
     * Render a list of a reaction manifestation display with comma separation.
     * @param manifestations manifestations of the reaction
     */
    renderReactionManifestations(manifestations: CodeableConcept[]): string {
      if (manifestations && manifestations.length > 0) {
        let text = '';
        manifestations.forEach(manifestation => {
          if (manifestation.coding && manifestation.coding.length > 0 && manifestation.coding[0].code) {
            text = text + this.fhirUtils.getDisplayByCodeAndLanguage(manifestation.coding[0].code, REACTION_MANIFESTATION_CODES, this.languageString) + ', '
          }
        });
        if (text.length > 0) {
          // remove last comma
          return text.substring(0, text.length - 2);
        }
      }
      return '?';
    },
    /**
     * Render the display of a reaction severity entry.
     * @param severity severity of a reaction
     */
    renderReactionSeverity(severity: AllergyIntoleranceSeverity): string {
      if (severity) {
        return this.fhirUtils.getDisplayByCodeAndLanguage(severity, REACTION_SEVERITY_CODES, this.languageString);
      }
      return '?';
    },
    /**
     * Render the display of a reaction substance entry.
     * @param substance substance of a reaction
     */
    renderReactionSubstance(substance: CodeableConcept): string {
      if (substance && substance.coding && substance.coding.length > 0 && substance.coding[0].code) {
        return this.fhirUtils.getDisplayByCodeAndLanguage(substance.coding[0].code, REACTION_SUBSTANCE_CODES, this.languageString);
      }
      return '?';
    },
    /**
     * Renders the exposure date of a reaction.
     * @param extensions extensions of a reaction
     */
    renderExposureDate(extensions: Extension[]): string {
      const exposureDate = extensions?.find(extension => extension.url == OPENEHR_EXPOSURE_DATE_URL);
      if (exposureDate && exposureDate.valueDateTime && exposureDate.valueDateTime.length > 0) {
        let dateCheck = new Date(exposureDate.valueDateTime);
        if (dateCheck instanceof Date && !Number.isNaN(dateCheck.valueOf())) {
          return this.dateFormatter.format(dateCheck);
        }
      }
      return '?';
    },
    /**
     * Returns true if the data set of a reaction contains openEHRExposureDate property.
     * @param reaction concerned reaction
     */
    isExposureDateAvailable(reaction: AllergyIntoleranceReaction): boolean {
      const extensions = reaction.extension;
      const exposureDate = extensions?.find(extension => extension.url == OPENEHR_EXPOSURE_DATE_URL);
      if (exposureDate && exposureDate.valueDateTime && exposureDate.valueDateTime.length > 0) {
        let dateCheck = new Date(exposureDate.valueDateTime);
        if (dateCheck instanceof Date && !Number.isNaN(dateCheck.valueOf())) {
          return true;
        }
      }
      return false;
    },
    /**
     * Returns the exposure route of a reaction.
     * @param route route of a reaction
     */
    renderExposureRoute(route: CodeableConcept): string {
      if (route && route.coding && route.coding.length > 0 && route.coding[0].code) {
        const code = route.coding[0].code;
        const exposure = EXPOSURE_PATH_CODES.find(coding => coding.code == code);
        if (exposure && exposure.display) {
          // no translation because codes don't have an official translation
          return exposure.display;
        }
      }
      return '?';
    },
    /**
     * Returns the note of a reaction.
     * @param notes notes of a reaction
     */
    renderReactionNote(notes: Annotation[]): string {
      if (notes && notes.length > 0) {
        let text = '';
        notes.forEach(note => {
          text = text + note.text + ', ';
        });
        if (text.length > 0) {
          // remove last comma
          return text.substring(0, text.length - 2);
        }
      }
      return '?';
    },
    /**
     * Returns true if the data set of a reaction contains openEHRLocation property.
     * @param reaction reaction to render
     */
    isReactionLocationAvailable(reaction: AllergyIntoleranceReaction): boolean {
      const extensions = reaction.extension;
      const exposureLocation = extensions?.find(extension => extension.url == OPENEHR_EXPOSURE_LOCATION_URL);
      if (exposureLocation && exposureLocation.valueCodeableConcept) {
        const locationCoding = exposureLocation.valueCodeableConcept;
        if (locationCoding.coding && locationCoding.coding.length > 0 && locationCoding.coding[0].display && locationCoding.coding[0].display.length > 0) {
          return true;
        }
      }
      return false;
    },
    /**
     * Returns the exposure location of a reaction.
     * @param extensions extensions of a reaction
     */
    renderReactionLocation(extensions: Extension[]): string {
      const exposureLocation = extensions?.find(extension => extension.url == OPENEHR_EXPOSURE_LOCATION_URL);
      if (exposureLocation && exposureLocation.valueCodeableConcept) {
        const locationCoding = exposureLocation.valueCodeableConcept;
        if (locationCoding.coding && locationCoding.coding.length > 0 && locationCoding.coding[0].display) {
          // no translation because codes don't have an official translation
          return locationCoding.coding[0].display;
        }
      }
      return '?';
    }
  },
  computed: {
    /**
     * Returns translated type of allergy.
     */
    type(): string {
      if (this.allergy?.type) {
        if (this.allergy.type == AllergyIntoleranceType.ALLERGY) {
          return this.translations.allergy;
        } else if (this.allergy.type == AllergyIntoleranceType.INTOLERANCE) {
          return this.translations.intolerance;
        }
      }
      return '?';
    },
    /**
     * Returns translated code display of allergy.
     */
    allergyCodeDisplay(): string {
      if (this.allergyCode) {
        return this.fhirUtils.getDisplayByCodeAndLanguage(this.allergyCode, ALLERGY_IDENTIFICATION_CODES, this.languageString);
      } else {
        return '?';
      }
    },
    /**
     * Returns translated clinical state of allergy.
     */
    clinicalStateDisplay(): string {
      if (this.allergy?.clinicalStatus && this.allergy.clinicalStatus.coding && this.allergy.clinicalStatus.coding.length > 0 && this.allergy.clinicalStatus.coding[0].code) {
        return this.fhirUtils.getDisplayByCodeAndLanguage(this.allergy.clinicalStatus.coding[0].code, CLINICAL_STATUS_CODES, this.languageString);
      } else {
        return '?';
      }
    },
    /**
     * Returns translated verification state of allergy.
     */
    verificationStateDisplay(): string {
      if (this.allergy?.verificationStatus && this.allergy.verificationStatus.coding && this.allergy.verificationStatus.coding.length > 0 && this.allergy.verificationStatus.coding[0].code) {
        return this.fhirUtils.getDisplayByCodeAndLanguage(this.allergy.verificationStatus.coding[0].code, VERIFICATION_STATUS_CODES, this.languageString);
      } else {
        return '?';
      }
    },
    /**
     * Render color according to clinical state of allergy.
     */
    renderClinicalStateColor(): string {
      const clinicalState = this.allergy?.clinicalStatus;
      if (clinicalState && clinicalState.coding && clinicalState.coding.length > 0 && clinicalState.coding[0].code) {
        const code = clinicalState.coding[0].code;
        switch (code) {
          case 'active':
            return 'red-7';

          case 'inactive':
            return 'orange-12'

          case 'resolved':
            return 'green-7'

          default:
            return 'primary';
        }
      } else {
        return 'primary';
      }
    },
    /**
     * Render a list of the translated category property with comma separation.
     */
    renderCategory(): string {
      const categories = this.allergy?.category;
      let text = ''
      if (categories && categories.length > 0) {
        categories.forEach(category => {
          text = text + this.fhirUtils.getDisplayByCodeAndLanguage(category, CATEGORY_CODES, this.languageString) + ', ';
        });
        if (text.length > 0) {
          // remove last comma
          return text.substring(0, text.length - 2);
        }
      }
      return '?';
    },
    /**
     * Returns translated criticality of allergy.
     */
    renderCriticality() {
      const criticality = this.allergy?.criticality
      if (criticality) {
        return this.fhirUtils.getDisplayByCodeAndLanguage(criticality, CRITICALITY_CODES, this.languageString);
      }
      return '?';
    },
    /**
     * Renders note property of allergy.
     */
    renderNote(): string {
      const notes = this.allergy?.note;
      if (notes && notes.length > 0) {
        let text = '';
        notes.forEach(note => {
          text = text + note.text + ', ';
        });
        if (text.length > 0) {
          // remove last comma
          return text.substring(0, text.length - 2);
        }
      }
      return '?';
    },
    /**
     * Returns true of a property shown in header is given.
     */
    isHeaderNeeded(): boolean {
      if (this.showTitle || this.allergy?.clinicalStatus || this.allergy?.onsetDateTime || this.allergy?.recorder) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Returns true if there is enough data about the allergy available to show something to the user.
     */
    isEnoughDataAvailable(): boolean {
      if (this.allergy) {
        let key: keyof CHAllergyIntolerance;
        let dataCounter = 0;
        for (key in this.allergy) {
          // loop over properties of a resource and count the displayed properties
          // keys are check individually because older resources don't have all properties
          const property = this.allergy[key];
          if (property && key == 'code') {
            dataCounter++;
            continue;
          }
          if (property && key == 'clinicalStatus') {
            dataCounter++;
            continue;
          }
          if (property && key == 'verificationStatus') {
            dataCounter++;
            continue;
          }
          if (property && key == 'onsetDateTime') {
            dataCounter++;
            continue;
          }
          if (property && key == 'note') {
            dataCounter++;
            continue;
          }
          if (property && key == 'type') {
            dataCounter++;
            continue;
          }
          if (property && key == 'category') {
            dataCounter++;
            continue;
          }
          if (property && key == 'criticality') {
            dataCounter++;
            continue;
          }
          if (property && key == 'reaction') {
            const reactions = property as AllergyIntoleranceReaction[];
            if (reactions.length > 0) {
              // don't show message when reactions are available
              return true;
            }
          }
        }
        if (dataCounter >= 3) {
          return true;
        }
      }
      return false;
    }
  }
});
</script>

<style scoped type="text/css">
.allergy-view {
  padding: 0 1em 0 1em;
  min-width: 265px;
}

.hyphenate {
  word-wrap: break-word;
  overflow-wrap: break-word;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
}

.row {
  margin-bottom: 1vh;
}

.allergy-header {
  margin-bottom: 2vh;
}

.text-h4 {
  margin-bottom: 1vh;
}

.header-info {
  width: 100%;
  margin-bottom: 1vh;
}

.header-info .q-icon {
  margin-right: 5px;
}

.clinical-status {
  margin-right: 2vw;
}

@media (min-width: 750px) {
  .clinical-status {
    margin-right: 1vw;
  }
}

ul {
  margin: 0;
}

.expansion-row {
  display: block;
}

.q-expansion-item :deep(.q-item.q-link) {
  /** overwrite q-item properties */
  padding: 0;
  padding-right: 16px;
}

.reaction-item {
  flex-direction: column;
}

.reaction-title {
  margin-bottom: 1vh;
}

.reaction-detail {
  display: flex;
}

.reaction-property-name {
  width: 30%;
}

.reaction-property-value {
  width: 70%;
}


.data-info,
.additional-infos {
  margin-top: 1vh;
}

/** overwrite .col from quasar.sass */
.col-1 {
  width: 50%;
}

.col-2 {
  width: 50%;
}

@media (max-width: 500px) {
  .reaction-property-name {
    width: 0;
    font-weight: bold;
    padding-top: 0.2em;
  }

  .reaction-property-value {
    width: 100%;
    margin-top: 1.5em;
  }
}
</style>

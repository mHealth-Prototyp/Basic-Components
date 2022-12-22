<template>
  <q-responsive
    v-if="document.type === bundleType.DOCUMENT"
    :ratio="options?.ratio ?? 70 / 99">
    <q-scroll-area>
      <div style="text-align: start;">
        <q-badge
          v-if="fhirDocumentComposition?.status"
          color="primary"
          :label="fhirDocumentComposition.status.toUpperCase()" />
        <q-badge
          v-if="fhirDocumentComposition?.language"
          class="q-ml-sm"
          color="primary"
          :label="fhirDocumentComposition.language.toUpperCase()" />
        <div
          id="paper"
          :style="options?.style ?? {}">
          <div
            v-html="
              fhirDocumentSubject?.text?.div ?? '<p>' + componentTranslations.noSubjectNarrative + '</p>'
            " />
          <div
            v-html="
              fhirDocumentComposition?.text?.div ??
              '<p>' + componentTranslations.noCompositionNarrative + '</p>'
            " />
          <div
            v-for="(item, index) in fhirDocumentComposition?.section"
            v-bind:key="index"
            v-html="
              item.text?.div ??
              '<p>' + componentTranslations.noSectionNarrative.replace('#', index.toString()) + '</p>'
            " />
        </div>
      </div>
    </q-scroll-area>
  </q-responsive>

  <p v-else>{{ componentTranslations.isNotDocument }}</p>
</template>
<script lang="ts">
import {defineComponent, PropType, StyleValue} from 'vue';
import {Bundle, BundleType, Composition, DomainResource} from '@i4mi/fhir_r4';
import {QCard, QCardSection, QResponsive, QScrollArea, QBadge} from 'quasar';
import {DocumentViewTranslationStrings} from '../TranslationInterfaces';
import {FhirUtilLanguageType} from '../utils/fhirUtils';

import * as DE from '../assets/de.json';
import * as FR from '../assets/fr.json';

class DocumentViewTranslations implements DocumentViewTranslationStrings {
  noDocument = '';
  isNotDocument = '';
  noSubjectNarrative = '';
  noCompositionNarrative = '';
  noSectionNarrative = '';
}

/**
 * Options for DocumentView component
 * @param ratio Aspect ratio for the component;
 *              If value is a String, then avoid using a computational statement (like '16/9')
 *              and instead specify the String value of the result directly (eg. '1.7777')
 *
 * @param style Style to render the document.
 */
interface DocumentViewOptions {
  ratio: string | number | undefined;
  style: StyleValue | undefined;
}

export default defineComponent({
  name: 'DocumentView',
  components: {QCard, QCardSection, QScrollArea, QResponsive, QBadge},
  data() {
    return {
      fhirDocumentSubject: undefined as DomainResource | undefined,
      fhirDocumentComposition: undefined as Composition | undefined,
      bundleType: BundleType,
      componentTranslations: new DocumentViewTranslations()
    };
  },
  i18n: {
    messages: {
      'de-CH': DE.documentView,
      'fr-CH': FR.documentView
    }
  },
  props: {
    /**
     * The FHIR Document (Bundle with type = document) whose narrative will be displayed.
     */
    document: {
      type: Object as PropType<Bundle>,
      required: true
    },
    /**
     * Strings to overwrite default translations of component. Overwrite by individual keys is supported.
     * @see   PatientViewTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<DocumentViewTranslationStrings>,
      required: false
    },
    /**
     * Options for the component.
     * @see   DocumentViewOptions interface for details
     */
    options: {
      type: Object as PropType<DocumentViewOptions>,
      required: false
    },
    /**
     * Two-character representation for the current language. Must be one of
     * 'de' | 'en' | 'fr' | 'it' | 'rm'. Default is 'de'.
     */
    languageString: {
      type: String as PropType<FhirUtilLanguageType>,
      required: true
    }
  },
  created() {
    this.processDocument();
    this.setupTranslations();
  },
  updated() {
    this.processDocument();
  },
  methods: {
    processDocument() {
      if (this.document.type !== BundleType.DOCUMENT || !this.document.entry) {
        this.fhirDocumentSubject = undefined;
        this.fhirDocumentComposition = undefined;
        return;
      }

      this.fhirDocumentComposition = this.document.entry?.[0].resource as Composition;

      if (!this.fhirDocumentComposition) {
        this.fhirDocumentSubject = undefined;
        return;
      }

      if (!this.fhirDocumentComposition.subject) {
        return;
      }

      const subjectEntry = this.document.entry.find((x) =>
        x.fullUrl?.includes(this.fhirDocumentComposition?.subject?.reference ?? '')
      );

      this.fhirDocumentSubject = subjectEntry?.resource;
    },
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
    }
  }
});
</script>
<style lang="scss">
#paper {
  counter-reset: h2;

  #paper,
  * {
    all: revert;
  }

  table {
    border-collapse: collapse;
    border: 2px solid black;
    padding-bottom: 0.5em;
  }

  table thead tr {
    background-color: black;
    color: white;
    text-align: center;
  }

  table th,
  table td {
    padding: 2px 6px;
  }
  table tbody tr {
    border-bottom: 1px solid grey;
    text-align: center;
  }
  table tbody tr:nth-of-type(even) {
    background-color: lightgray;
  }

  h2 {
    counter-reset: h3;
  }
  h3 {
    counter-reset: h4;
  }
  h4 {
    counter-reset: h5;
  }
  h5 {
    counter-reset: h6;
  }
  h2:before {
    counter-increment: h2;
    content: counter(h2) '. ';
  }
  h3:before {
    counter-increment: h3;
    content: counter(h2) '.' counter(h3) '. ';
  }
  h4:before {
    counter-increment: h4;
    content: counter(h2) '.' counter(h3) '.' counter(h4) '. ';
  }
  h5:before {
    counter-increment: h5;
    content: counter(h2) '.' counter(h3) '.' counter(h4) '.' counter(h5) '. ';
  }
  h6:before {
    counter-increment: h6;
    content: counter(h2) '.' counter(h3) '.' counter(h4) '.' counter(h5) '.' counter(h6) '. ';
  }

  nocount:before,
  h5.nocount:before,
  h6.nocount:before {
    content: '';
    counter-increment: none;
  }
}
</style>

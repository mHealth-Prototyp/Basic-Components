import {boot} from 'quasar/wrappers';
import {createI18n} from 'vue-i18n';
import {FhirUtilLanguageType} from '../utils/fhirUtils';

/**
 * i18n.ts
 *
 * Handles interationalization. DE (de-CH) is the default language.
 *
 * Note: Each component has a string interface to be independant from a i18n setup.
 */

export enum APP_LANGUAGES {
  DE = 'de-CH',
  EN = 'en',
  FR = 'fr-CH',
  IT = 'it'
}

export const AVAILABLE_LANGUAGES = [APP_LANGUAGES.DE, APP_LANGUAGES.FR];

export default boot(({app}) => {
  // Create i18n instance with options
  const i18n = createI18n({
    locale: APP_LANGUAGES.DE
  });

  // Set i18n instance on app
  app.use(i18n);
});

/**
 * Parses the locale to  'de' | 'it' | 'en' | 'rm' | 'fr'
 * type. defaults to 'en'
 * @param     locale current locale to parse
 * @returns   one of the following strings:
 *            - "en"
 *            - "de"
 *            - "it"
 *            - "fr"
 *            - "rm"
 */
export function getLangStringFromLocale(locale: string): FhirUtilLanguageType {
  // TODO is there a way to import current local outside of vue component?
  // source but didn't find a working solution: https://stackoverflow.com/questions/57049471/problem-to-use-vuei18n-outside-a-component
  // When this works, this message call could be done within the getClassCodeString() and getTypeCodeString() of fhirUtils.ts
  switch (locale) {
    case 'de-CH':
    case 'de-DE':
    case 'de':
      return 'de';
    case 'fr-CH':
    case 'fr':
    case 'fr-FR':
      return 'fr';
    case 'rm-CH':
    case 'rm':
      return 'rm';
    case 'it-CH':
    case 'it-IT':
    case 'it':
      return 'it';
    default:
      return 'en';
  }
}

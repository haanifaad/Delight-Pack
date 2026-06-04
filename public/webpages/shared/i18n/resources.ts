import type { Locale } from './settings';

import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enTally from './locales/en/tally.json';
import enDelivery from './locales/en/delivery.json';

import mlCommon from './locales/ml/common.json';
import mlNavigation from './locales/ml/navigation.json';
import mlTally from './locales/ml/tally.json';
import mlDelivery from './locales/ml/delivery.json';

import arCommon from './locales/ar/common.json';
import arNavigation from './locales/ar/navigation.json';
import arTally from './locales/ar/tally.json';
import arDelivery from './locales/ar/delivery.json';

const localeBundles = {
  en: { common: enCommon, navigation: enNavigation, tally: enTally, delivery: enDelivery },
  ml: { common: mlCommon, navigation: mlNavigation, tally: mlTally, delivery: mlDelivery },
  ar: { common: arCommon, navigation: arNavigation, tally: arTally, delivery: arDelivery },
} as const;

export type LocaleResources = (typeof localeBundles)[Locale];

/** i18next resource map for all supported locales */
export const i18nResources = {
  en: localeBundles.en,
  ml: localeBundles.ml,
  ar: localeBundles.ar,
};

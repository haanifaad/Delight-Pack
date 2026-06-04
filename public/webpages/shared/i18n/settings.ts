/** Supported locales for the Delight Pack web ecosystem */
export const LOCALES = ['en', 'ml', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'delight-pack-locale';
export const LOCALE_COOKIE_NAME = 'delight-pack-locale';

/** Locales that use right-to-left layout */
export const RTL_LOCALES: readonly Locale[] = ['ar'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ml: 'മലയാളം',
  ar: 'العربية',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

export const I18N_NAMESPACES = ['common', 'navigation', 'tally'] as const;
export type I18nNamespace = (typeof I18N_NAMESPACES)[number];

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  type Locale,
  isLocale,
} from './settings';

export { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY };

/** Strip locale prefix from pathname: /en/foo -> /foo */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join('/')}` : '/';
  }
  return pathname || '/';
}

/** Build path with locale: (/transactions, ml) -> /ml/transactions */
export function pathWithLocale(pathname: string, locale: Locale): string {
  const pathWithoutLocale = stripLocaleFromPath(pathname);
  if (pathWithoutLocale === '/') return `/${locale}`;
  return `/${locale}${pathWithoutLocale}`;
}

/** Read preferred locale from cookie string (middleware) */
export function getLocaleFromCookie(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${LOCALE_COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.split('=')[1]?.trim();
  return value && isLocale(value) ? value : null;
}

/** Negotiate locale from Accept-Language header */
export function getLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const lang of preferred) {
    if (isLocale(lang)) return lang;
    const base = lang.split('-')[0];
    if (base && isLocale(base)) return base;
    if (base === 'mal') return 'ml';
  }
  return DEFAULT_LOCALE;
}

export function resolveRequestLocale(
  cookieHeader: string | null,
  acceptLanguage: string | null
): Locale {
  return getLocaleFromCookie(cookieHeader) ?? getLocaleFromAcceptLanguage(acceptLanguage);
}

export function pathnameHasLocale(pathname: string): boolean {
  const first = pathname.split('/').filter(Boolean)[0];
  return !!first && (LOCALES as readonly string[]).includes(first);
}

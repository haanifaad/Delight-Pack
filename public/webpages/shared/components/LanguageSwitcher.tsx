'use client';

import { useCallback, useEffect, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  LOCALE_LABELS,
  LOCALE_STORAGE_KEY,
  LOCALE_COOKIE_NAME,
  type Locale,
  isLocale,
} from '../i18n/settings';
import { pathWithLocale } from '../i18n/routing';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

export interface LanguageSwitcherProps {
  className?: string;
  selectClassName?: string;
}

/**
 * Global language switcher — updates URL locale segment, i18next, localStorage, and cookie.
 */
export function LanguageSwitcher({ className, selectClassName }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation('common');
  const [isPending, startTransition] = useTransition();

  const pathLocale = pathname.split('/').filter(Boolean)[0];
  const currentLocale: Locale = isLocale(pathLocale) ? pathLocale : 'en';

  /** Keep localStorage and cookie aligned with the URL locale */
  useEffect(() => {
    persistLocale(currentLocale);
    if (i18n.language !== currentLocale) {
      void i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value;
      if (!isLocale(next) || next === currentLocale) return;

      persistLocale(next);
      i18n.changeLanguage(next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.classList.toggle('rtl', next === 'ar');
      document.documentElement.classList.toggle('ltr', next !== 'ar');

      startTransition(() => {
        router.push(pathWithLocale(pathname, next));
      });
    },
    [currentLocale, i18n, pathname, router]
  );

  return (
    <label className={className ?? 'inline-flex items-center gap-2 text-sm'}>
      <span className="sr-only">{t('selectLanguage')}</span>
      <span className="text-muted-foreground whitespace-nowrap" aria-hidden>
        {t('language')}:
      </span>
      <select
        value={currentLocale}
        onChange={onChange}
        disabled={isPending}
        className={
          selectClassName ??
          'rounded-md border border-input bg-background px-2 py-1.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring rtl:text-end'
        }
        aria-label={t('selectLanguage')}
      >
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}

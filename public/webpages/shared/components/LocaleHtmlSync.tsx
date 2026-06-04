'use client';

import { useEffect } from 'react';
import { isRtlLocale, type Locale } from '../i18n/settings';

/** Syncs `<html lang dir>` when the active route locale changes */
export function LocaleHtmlSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    const rtl = isRtlLocale(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('rtl', rtl);
    document.documentElement.classList.toggle('ltr', !rtl);
  }, [locale]);

  return null;
}

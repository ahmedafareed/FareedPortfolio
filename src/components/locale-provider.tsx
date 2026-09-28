'use client';

import { createContext, useContext } from 'react';
import { getDictionary, type Dictionary, type Locale } from '@/lib/i18n';

const LocaleContext = createContext<{ locale: Locale; dictionary: Dictionary }>({
  locale: 'en',
  dictionary: getDictionary('en'),
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dictionary: getDictionary(locale) }}>{children}</LocaleContext.Provider>;
}

export default LocaleProvider;

export function useLocale() {
  return useContext(LocaleContext);
}
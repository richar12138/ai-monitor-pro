'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, I18nDict, SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';
import en from './en';
import zh from './zh';

const dictionaries: Record<Locale, I18nDict> = { en, zh };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k: string) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // 从 localStorage 恢复语言偏好
    const saved = localStorage.getItem('tt-locale');
    if (saved && SUPPORTED_LOCALES.includes(saved as Locale)) {
      setLocaleState(saved as Locale);
    } else {
      // 检测浏览器语言
      const navLang = navigator.language || (navigator as any).userLanguage || '';
      if (navLang.startsWith('zh')) {
        setLocaleState('zh');
      }
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('tt-locale', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = dictionaries[locale];
      let text = dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;

      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          // 处理 {key, plural, one{...} other{...}} 格式
          const pluralMatch = text.match(new RegExp(`{${k}, plural, one {([^}]*)} other {([^}]*)}`));
          if (pluralMatch) {
            const replacement = Number(v) === 1 ? pluralMatch[1] : pluralMatch[2];
            text = text.replace(new RegExp(`{${k}, plural, one {[^}]*} other {[^}]*}}`), replacement);
          }
          // 普通替换
          text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }
      }

      return text;
    },
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export { dictionaries };

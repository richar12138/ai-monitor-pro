export interface I18nDict {
  [key: string]: string;
}

export type Locale = 'en' | 'zh';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'zh'];
export const DEFAULT_LOCALE: Locale = 'zh'; // 默认中文

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};

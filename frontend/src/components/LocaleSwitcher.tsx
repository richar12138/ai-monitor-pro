'use client';

import { useI18n } from '@/lib/i18n';
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n/types';
import { cn } from '@/lib/cn';

interface LocaleSwitcherProps {
  collapsed?: boolean;
}

export default function LocaleSwitcher({ collapsed }: LocaleSwitcherProps) {
  const { locale, setLocale } = useI18n();

  if (collapsed) {
    return (
      <button
        onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
        title={LOCALE_LABELS[locale]}
        className="w-full flex items-center justify-center rounded-[var(--tt-radius)] py-2 text-[var(--tt-fg-dim)] hover:text-[var(--tt-fg)] transition-colors"
      >
        <span className="text-[12px] font-bold">{locale === 'en' ? 'EN' : '中'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1.5">
      {SUPPORTED_LOCALES.map((l: Locale) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            'flex-1 rounded-[var(--tt-radius-sm)] py-1 text-[12px] font-medium transition-colors',
            locale === l
              ? 'bg-[var(--tt-brand)]/15 text-[var(--tt-brand)]'
              : 'text-[var(--tt-fg-muted)] hover:text-[var(--tt-fg)] hover:bg-[var(--tt-sunken)]',
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

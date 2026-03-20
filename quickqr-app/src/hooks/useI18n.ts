import { useState, useCallback } from 'react';
import ko from '../i18n/ko.json';
import en from '../i18n/en.json';

type Lang = 'ko' | 'en';
const translations: Record<Lang, Record<string, string>> = { ko, en };

function detectLang(): Lang {
  const stored = localStorage.getItem('quickqr_lang');
  if (stored === 'ko' || stored === 'en') return stored;
  const nav = navigator.language.toLowerCase();
  return nav.startsWith('ko') ? 'ko' : 'en';
}

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('quickqr_lang', l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: string): string => translations[lang][key] ?? key,
    [lang]
  );

  return { lang, setLang, t };
}

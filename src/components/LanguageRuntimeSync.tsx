import { useEffect } from 'react';
import i18n from '../lib/i18n';
import { setupDomI18nObserver, scanAndTranslateDom } from '../lib/domI18n';

const SUPPORTED = ['pt', 'en', 'es', 'de', 'fr'] as const;
type SupportedLanguage = typeof SUPPORTED[number];

function normalize(value: string | null | undefined): SupportedLanguage | null {
  if (!value) return null;
  const base = value.toLowerCase().split('-')[0] as SupportedLanguage;
  return SUPPORTED.includes(base) ? base : null;
}

/**
 * Runtime guard for the app's single i18next instance.
 * Keeps i18next aligned with the language selected in Portal Orbit and
 * provides a last-resort exact-match translation pass for fixed JSX UI text.
 */
export default function LanguageRuntimeSync() {
  useEffect(() => {
    const sync = () => {
      const selected = normalize(localStorage.getItem('orbi_user_explicit_lang'))
        || normalize(localStorage.getItem('orbi_preferred_language'));
      if (selected && i18n.language !== selected) {
        void i18n.changeLanguage(selected);
      }

      // Run after the language change has propagated to React/i18next.
      window.setTimeout(() => scanAndTranslateDom(document), 0);
    };

    sync();
    window.addEventListener('orbi_language_changed', sync);
    window.addEventListener('storage', sync);
    const stopObserver = setupDomI18nObserver();

    return () => {
      window.removeEventListener('orbi_language_changed', sync);
      window.removeEventListener('storage', sync);
      stopObserver();
    };
  }, []);

  return null;
}

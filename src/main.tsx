import { safeLocalStorage } from './lib/safeStorage';

// Safe Storage Polyfill for sandboxed iframe environments
(() => {
  try {
    if (typeof window !== 'undefined' && typeof Storage !== 'undefined') {
      const patchStorage = (prototype: any) => {
        ['getItem', 'setItem', 'removeItem', 'clear', 'key'].forEach((method) => {
          const orig = prototype[method];
          if (typeof orig === 'function') {
            prototype[method] = function (...args: any[]) {
              try {
                return orig.apply(this, args);
              } catch (e) {
                if (method === 'getItem') return safeLocalStorage.getItem(args[0]);
                if (method === 'setItem') return safeLocalStorage.setItem(args[0], args[1]);
                if (method === 'removeItem') return safeLocalStorage.removeItem(args[0]);
                if (method === 'clear') return safeLocalStorage.clear();
                if (method === 'key') return safeLocalStorage.key(args[0]);
                return null;
              }
            };
          }
        });
      };
      patchStorage(Storage.prototype);
    }
  } catch (e) {
    console.warn("Storage API restriction handling activated.");
  }
})();

// Global Fetch Interceptor to ensure every API call carries the user's active application language header
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    try {
      const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.href : (input && (input as Request).url ? (input as Request).url : ''));
      if (urlStr && urlStr.includes('/api/')) {
        let validLang = 'pt';
        try {
          const activeLang = safeLocalStorage.getItem('orbi_user_explicit_lang') ||
                             safeLocalStorage.getItem('orbi_preferred_language') ||
                             safeLocalStorage.getItem('i18nextLng') || 'pt';
          const cleanLang = activeLang.toLowerCase().split('-')[0];
          validLang = ['pt', 'en', 'es', 'de', 'fr'].includes(cleanLang) ? cleanLang : 'pt';
        } catch (e) {
          validLang = 'pt';
        }

        const modifiedInit: RequestInit = init ? { ...init } : {};
        const headers = new Headers(modifiedInit.headers || {});
        if (!headers.has('x-app-lang')) {
          headers.set('x-app-lang', validLang);
        }
        modifiedInit.headers = headers;
        return originalFetch.call(this, input, modifiedInit);
      }
    } catch (e) {
      // Fallback cleanly on error
    }
    return originalFetch.call(this, input, init);
  };
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import i18n from './lib/i18n.ts';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import './index.css';
import { IdiomaProvider } from './context/IdiomaContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';


// Handle reset query param to force purge stale service workers and caches
if (typeof window !== 'undefined') {
  if (import.meta.env.DEV || window.location.search.includes('reset=')) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
    }
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  } else if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    const registerServiceWorker = () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA Service Worker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.error('Falha ao registrar o PWA Service Worker:', error);
        });
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      registerServiceWorker();
    } else {
      window.addEventListener('load', registerServiceWorker);
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <IdiomaProvider>
          <App />
        </IdiomaProvider>
      </I18nextProvider>
    </ErrorBoundary>
  </StrictMode>,
);


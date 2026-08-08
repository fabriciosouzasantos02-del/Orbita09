// Safe Storage Polyfill for sandboxed iframe environments
(() => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
  } catch (e) {
    console.warn("Storage API is restricted or blocked in this environment. Falling back to safe in-memory polyfill.", e);
    
    const createInMemoryStorage = () => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string): string | null => {
          return key in store ? store[key] : null;
        },
        setItem: (key: string, value: string): void => {
          store[key] = String(value);
        },
        removeItem: (key: string): void => {
          delete store[key];
        },
        clear: (): void => {
          store = {};
        },
        get length(): number {
          return Object.keys(store).length;
        },
        key: (index: number): string | null => {
          const keys = Object.keys(store);
          return index >= 0 && index < keys.length ? keys[index] : null;
        }
      };
    };

    try {
      Object.defineProperty(window, 'localStorage', {
        value: createInMemoryStorage(),
        writable: true,
        configurable: true
      });
    } catch (err) {
      console.error("Could not polyfill window.localStorage:", err);
    }

    try {
      Object.defineProperty(window, 'sessionStorage', {
        value: createInMemoryStorage(),
        writable: true,
        configurable: true
      });
    } catch (err) {
      console.error("Could not polyfill window.sessionStorage:", err);
    }
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import i18n from './lib/i18n.ts';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import './index.css';
import { IdiomaProvider } from './context/IdiomaContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';


// Handle reset query param to force purge stale service workers and caches
if (typeof window !== 'undefined' && window.location.search.includes('reset=')) {
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
}

// Register PWA Service Worker
const registerServiceWorker = () => {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('PWA Service Worker registrado com sucesso:', registration.scope);
    })
    .catch((error) => {
      console.error('Falha ao registrar o PWA Service Worker:', error);
    });
};

if ('serviceWorker' in navigator && !window.location.search.includes('reset=')) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
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


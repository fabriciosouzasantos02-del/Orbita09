// src/lib/domI18n.ts
// DOM Scanning & Auto-Translation Utility for i18n integration

import { translateUiText, getCurrentLang } from './translations';
import { getLocaleDict } from './locales';

/**
 * Scans a DOM container for elements with i18n data attributes or pending untranslated text
 * and updates titles, placeholders, labels, and modal contents automatically.
 */
export function scanAndTranslateDom(root: HTMLElement | Document = document): void {
  const lang = getCurrentLang();

  // 1. Explicit data-i18n-key
  const keyNodes = root.querySelectorAll<HTMLElement>('[data-i18n-key]');
  keyNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-key');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated && translated !== key) {
        node.textContent = translated;
      }
    }
  });

  // 2. Explicit data-i18n-placeholder
  const placeholderNodes = root.querySelectorAll<HTMLElement>('[data-i18n-placeholder]');
  placeholderNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated) {
        node.setAttribute('placeholder', translated);
      }
    }
  });

  // 3. Explicit data-i18n-title
  const titleNodes = root.querySelectorAll<HTMLElement>('[data-i18n-title]');
  titleNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-title');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated) {
        node.setAttribute('title', translated);
      }
    }
  });

  // 4. Explicit data-i18n-aria
  const ariaNodes = root.querySelectorAll<HTMLElement>('[data-i18n-aria]');
  ariaNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-aria');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated) {
        node.setAttribute('aria-label', translated);
      }
    }
  });

  // 5. Automatic Modal and Alert text scan for non-PT languages
  if (lang !== 'pt') {
    const modalContainers = root.querySelectorAll<HTMLElement>(
      '[role="dialog"], .modal, .fixed, .alert, [data-i18n-auto]'
    );

    modalContainers.forEach((container) => {
      // Find all leaf text nodes
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const text = node.textContent?.trim();
          if (!text || text.length < 2) return NodeFilter.FILTER_SKIP;
          // Skip code or script tags
          const parent = node.parentElement;
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'SVG')) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      let textNode: Node | null;
      while ((textNode = walker.nextNode())) {
        const rawText = textNode.textContent?.trim();
        if (rawText) {
          const translated = translateUiText(rawText, lang);
          if (translated && translated !== rawText) {
            textNode.textContent = translated;
          }
        }
      }
    });
  }
}

let observerInstance: MutationObserver | null = null;

/**
 * Initializes a DOM MutationObserver that automatically translates newly mounted
 * modals, toast alerts, error banners, and titles in real time.
 */
export function setupDomI18nObserver(): () => void {
  if (typeof window === 'undefined' || !window.MutationObserver) {
    return () => {};
  }

  if (observerInstance) {
    observerInstance.disconnect();
  }

  let debounceTimer: any = null;

  observerInstance = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }

    if (shouldScan) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scanAndTranslateDom(document);
      }, 100);
    }
  });

  observerInstance.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial scan
  scanAndTranslateDom(document);

  return () => {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  };
}

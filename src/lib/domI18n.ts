// src/lib/domI18n.ts
// DOM safety-net for fixed UI strings that escaped a component's t(...) call.
// It only replaces exact dictionary matches; user-generated/dynamic text is untouched.

import { translateUiText, getCurrentLang } from './translations';

function translateTextNodes(root: HTMLElement | Document): void {
  const lang = getCurrentLang();
  if (lang === 'pt') return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent?.trim();
      if (!text || text.length < 3) return NodeFilter.FILTER_SKIP;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_SKIP;
      if (
        parent.tagName === 'SCRIPT' ||
        parent.tagName === 'STYLE' ||
        parent.tagName === 'SVG' ||
        parent.tagName === 'CODE' ||
        parent.tagName === 'PRE' ||
        parent.tagName === 'TEXTAREA' ||
        parent.tagName === 'INPUT' ||
        parent.isContentEditable ||
        parent.closest('script,style,svg,code,pre,textarea,input,[contenteditable="true"]')
      ) {
        return NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const raw = node.textContent?.trim();
    if (!raw || raw.length < 3) continue;
    const translated = translateUiText(raw, lang);
    if (translated && translated !== raw) {
      node.textContent = translated;
    }
  }
}

/**
 * Scans explicit i18n attributes and then exact fixed interface text across
 * the mounted application. This catches legacy cards, tabs, buttons and
 * sections that were rendered as literal JSX strings.
 */
export function scanAndTranslateDom(root: HTMLElement | Document = document): void {
  const lang = getCurrentLang();

  const keyNodes = root.querySelectorAll<HTMLElement>('[data-i18n-key]');
  keyNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-key');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated && translated !== key) node.textContent = translated;
    }
  });

  const placeholderNodes = root.querySelectorAll<HTMLElement>('[data-i18n-placeholder]');
  placeholderNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated) node.setAttribute('placeholder', translated);
    }
  });

  const titleNodes = root.querySelectorAll<HTMLElement>('[data-i18n-title]');
  titleNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-title');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated) node.setAttribute('title', translated);
    }
  });

  const ariaNodes = root.querySelectorAll<HTMLElement>('[data-i18n-aria]');
  ariaNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n-aria');
    if (key) {
      const translated = translateUiText(key, lang);
      if (translated) node.setAttribute('aria-label', translated);
    }
  });

  // Safety net for every mounted fixed interface string, not only modals.
  translateTextNodes(root);
}

let observerInstance: MutationObserver | null = null;

export function setupDomI18nObserver(): () => void {
  if (typeof window === 'undefined' || !window.MutationObserver) return () => {};

  if (observerInstance) observerInstance.disconnect();

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  observerInstance = new MutationObserver((mutations) => {
    const shouldScan = mutations.some((m) => m.addedNodes.length > 0);
    if (!shouldScan) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scanAndTranslateDom(document);
    }, 100);
  });

  observerInstance.observe(document.body, { childList: true, subtree: true });
  scanAndTranslateDom(document);

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  };
}

/**
 * Canonical key policy for the Orbit i18n migration.
 *
 * During migration, legacy phrase keys are still accepted so existing screens
 * do not break. New translation entries should use semantic IDs only.
 */

const SEMANTIC_KEY = /^[a-z][a-z0-9]*(?:[._-][a-zA-Z0-9]+)*$/;

/** Returns true when a translation key follows the semantic-ID convention. */
export function isSemanticTranslationKey(key: string): boolean {
  return SEMANTIC_KEY.test(key) && !/\s/.test(key);
}

/**
 * Legacy keys are normally full sentences, labels, or natural-language text.
 * This intentionally errs on the side of flagging a key for human review.
 */
export function isLegacyTranslationKey(key: string): boolean {
  return !isSemanticTranslationKey(key);
}

/**
 * Suggested namespace roots. This is a policy aid, not a runtime restriction,
 * so existing modules can migrate incrementally without breaking the app.
 */
export const semanticNamespaces = [
  'common',
  'navigation',
  'actions',
  'errors',
  'validation',
  'loading',
  'auth',
  'onboarding',
  'profile',
  'settings',
  'subscription',
  'premium',
  'astrology',
  'tarot',
  'numerology',
  'biorhythm',
  'compatibility',
  'dreams',
  'chakras',
  'prosperity',
  'transits',
  'missions',
  'notifications',
  'admin'
] as const;

export type SemanticNamespace = typeof semanticNamespaces[number];

export function getSemanticNamespace(key: string): SemanticNamespace | null {
  const root = key.split('.')[0] as SemanticNamespace;
  return (semanticNamespaces as readonly string[]).includes(root) ? root : null;
}

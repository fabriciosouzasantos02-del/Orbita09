import * as fs from 'fs';
import { uiTranslations } from '../lib/translations';
import { mergedTranslations } from '../i18n';
import { staticTranslations } from '../translations';
import { applyTranslationPatches } from '../lib/translationPatch';

applyTranslationPatches();

const ptList: string[] = JSON.parse(fs.readFileSync('all-pt-strings.json', 'utf8'));
const langs = ['en', 'es', 'de', 'fr'] as const;

function getTranslation(ptText: string, lang: 'en' | 'es' | 'de' | 'fr'): string | null {
  if (uiTranslations[lang]?.[ptText]) return uiTranslations[lang][ptText];
  if (mergedTranslations[lang]?.[ptText]) return mergedTranslations[lang][ptText];
  if (staticTranslations[lang]?.[ptText]) return staticTranslations[lang][ptText];

  const clean = ptText.trim();
  if (uiTranslations[lang]?.[clean]) return uiTranslations[lang][clean];
  if (mergedTranslations[lang]?.[clean]) return mergedTranslations[lang][clean];
  if (staticTranslations[lang]?.[clean]) return staticTranslations[lang][clean];

  return null;
}

const missingMap: Record<string, { en?: boolean; es?: boolean; de?: boolean; fr?: boolean }> = {};

ptList.forEach(text => {
  const missingLangs: { en?: boolean; es?: boolean; de?: boolean; fr?: boolean } = {};
  let isMissing = false;

  langs.forEach(lang => {
    if (!getTranslation(text, lang)) {
      missingLangs[lang] = true;
      isMissing = true;
    }
  });

  if (isMissing) {
    missingMap[text] = missingLangs;
  }
});

fs.writeFileSync('missing-translations-map.json', JSON.stringify(missingMap, null, 2));

const missingCount = Object.keys(missingMap).length;
console.log(`Total strings missing in at least 1 non-PT language: ${missingCount} / ${ptList.length}`);

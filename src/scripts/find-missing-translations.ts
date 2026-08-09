import * as fs from 'fs';
import { mergedTranslations } from '../i18n';

const ptList: string[] = JSON.parse(fs.readFileSync('all-pt-strings.json', 'utf8'));
const langs = ['en', 'es', 'de', 'fr'] as const;

function getTranslation(ptText: string, lang: 'en' | 'es' | 'de' | 'fr'): string | null {
  if (mergedTranslations[lang]?.[ptText]) return mergedTranslations[lang][ptText];

  const clean = ptText.trim();
  if (mergedTranslations[lang]?.[clean]) return mergedTranslations[lang][clean];

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

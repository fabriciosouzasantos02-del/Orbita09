import { staticTranslations } from './translations';
import { translationDict, uiTranslations } from './lib/translations';
import * as fs from 'fs';

const uiLangs = Object.keys(uiTranslations) as (keyof typeof uiTranslations)[];
const allKeys = new Set<string>();
for (const lang of uiLangs) {
  Object.keys(uiTranslations[lang]).forEach(k => allKeys.add(k));
}

const missingInfo: Record<string, string[]> = {};

for (const lang of uiLangs) {
  const keys = Object.keys(uiTranslations[lang]);
  const missing = Array.from(allKeys).filter(k => !keys.includes(k));
  missingInfo[lang] = missing;
}

fs.writeFileSync('missing-keys.json', JSON.stringify(missingInfo, null, 2));
console.log('Saved missing keys to missing-keys.json');

import { mergedTranslations } from './i18n';
import * as fs from 'fs';

const uiLangs = Object.keys(mergedTranslations) as (keyof typeof mergedTranslations)[];
const allKeys = new Set<string>();
for (const lang of uiLangs) {
  Object.keys(mergedTranslations[lang]).forEach(k => allKeys.add(k));
}

const missingInfo: Record<string, string[]> = {};

for (const lang of uiLangs) {
  const keys = Object.keys(mergedTranslations[lang]);
  const missing = Array.from(allKeys).filter(k => !keys.includes(k));
  missingInfo[lang] = missing;
}

fs.writeFileSync('missing-keys.json', JSON.stringify(missingInfo, null, 2));
console.log('Saved missing keys to missing-keys.json');

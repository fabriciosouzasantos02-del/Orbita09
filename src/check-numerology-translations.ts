import { uiTranslationsMultilang, numerologyInterpretationsMultilang } from './components/numerologyTranslations';

console.log('--- CHECKING uiTranslationsMultilang ---');
const langs = Object.keys(uiTranslationsMultilang) as (keyof typeof uiTranslationsMultilang)[];
const ptKeys = Object.keys(uiTranslationsMultilang.pt);
console.log(`PT has ${ptKeys.length} keys`);

for (const lang of langs) {
  if (lang === 'pt') continue;
  const keys = Object.keys(uiTranslationsMultilang[lang]);
  const missing = ptKeys.filter(k => !keys.includes(k));
  console.log(`Lang [${lang}]: has ${keys.length} keys. Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log(`  Missing:`, missing);
  }
}

console.log('\n--- CHECKING numerologyInterpretationsMultilang ---');
const interpretLangs = Object.keys(numerologyInterpretationsMultilang) as (keyof typeof numerologyInterpretationsMultilang)[];
const ptInterpretKeys = Object.keys(numerologyInterpretationsMultilang.pt);
console.log(`PT has ${ptInterpretKeys.length} keys`);

for (const lang of interpretLangs) {
  if (lang === 'pt') continue;
  const keys = Object.keys(numerologyInterpretationsMultilang[lang]);
  const missing = ptInterpretKeys.filter(k => !keys.includes(k));
  console.log(`Lang [${lang}]: has ${keys.length} keys. Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log(`  Missing:`, missing);
  }
}

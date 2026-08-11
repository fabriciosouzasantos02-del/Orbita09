import { tarotSemanticTranslations } from '../i18n/tarotSemantic';

const languages = ['pt', 'en', 'es', 'de', 'fr'] as const;
const baseKeys = Object.keys(tarotSemanticTranslations.pt);
let errors = 0;

const report = (message: string) => {
  console.error(`❌ ${message}`);
  errors++;
};

console.log('🔮 Tarot i18n validation');
console.log(`Canonical PT keys: ${baseKeys.length}`);

for (const lang of languages) {
  const keys = Object.keys(tarotSemanticTranslations[lang]);
  const missing = baseKeys.filter(key => !keys.includes(key));
  const extra = keys.filter(key => !baseKeys.includes(key));
  if (missing.length) report(`${lang}: ${missing.length} missing canonical keys: ${missing.slice(0, 5).join(', ')}`);
  if (extra.length) report(`${lang}: ${extra.length} unexpected canonical keys: ${extra.slice(0, 5).join(', ')}`);
  for (const key of keys) {
    if (!String(tarotSemanticTranslations[lang][key] ?? '').trim()) report(`${lang}: empty value for ${key}`);
  }
}

const placeholderPattern = /\{\{?\s*[\w.-]+\s*\}?\}|%\w+%|\$\{[^}]+\}/g;
for (const key of baseKeys) {
  const expected = (tarotSemanticTranslations.pt[key].match(placeholderPattern) || []).sort().join('|');
  for (const lang of languages) {
    const actual = (tarotSemanticTranslations[lang][key].match(placeholderPattern) || []).sort().join('|');
    if (expected !== actual) report(`${lang}: placeholder mismatch for ${key} (PT=${expected || 'none'}, ${lang}=${actual || 'none'})`);
  }
}

// Known Portuguese leakage patterns that must never appear in non-PT Tarot copy.
const forbiddenInNonPt = [
  'resposta desejada',
  'resposta que gostaria',
  'para restructurer',
  'experiência intuitiva',
  'melhor compreensão del pasado',
  'uma jornada',
  'Sintonize suas intenções',
  'Sua consulta',
  'Carta Especial'
];
for (const lang of ['en', 'es', 'de', 'fr'] as const) {
  for (const [key, value] of Object.entries(tarotSemanticTranslations[lang])) {
    for (const marker of forbiddenInNonPt) {
      if (value.toLowerCase().includes(marker.toLowerCase())) report(`${lang}: Portuguese leakage in ${key}: ${marker}`);
    }
  }
}

if (errors) {
  console.error(`❌ Tarot i18n validation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log('✅ Tarot semantic keys, five-language parity, values, and placeholders passed.');

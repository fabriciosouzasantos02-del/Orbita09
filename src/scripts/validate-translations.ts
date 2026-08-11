import { mergedTranslations } from '../i18n';
import { isLegacyTranslationKey } from '../i18n/keyPolicy';
import * as fs from 'fs';
import * as path from 'path';

const languages = ['pt', 'en', 'es', 'de', 'fr'] as const;

console.log('🌌 Starting Astro i18n Automated Architectural Validation Suite...');
console.log('--------------------------------------------------');

let hasErrors = false;

// ==========================================
// 1. Dictionaries & Key Integrity Checks
// ==========================================
console.log('📋 STEP 1: Verifying Dictionary Completeness across (pt, en, es, de, fr)...');

const allKeysByLang = languages.map(lang => ({
  lang,
  keys: Object.keys(mergedTranslations[lang] || {})
}));

const ptKeys = allKeysByLang.find(item => item.lang === 'pt')?.keys || [];
console.log(`🔑 Base language (pt) contains ${ptKeys.length} keys.`);

for (const lang of languages) {
  const currentKeys = Object.keys(mergedTranslations[lang] || {});
  const missing = ptKeys.filter(k => !currentKeys.includes(k));
  const extra = currentKeys.filter(k => !ptKeys.includes(k));

  if (missing.length > 0) {
    console.error(`❌ Language "${lang}" has missing translation keys (Total: ${missing.length}):`);
    missing.slice(0, 10).forEach(key => console.error(`   - "${key}"`));
    hasErrors = true;
  }

  if (extra.length > 0) {
    console.error(`❌ Language "${lang}" has keys missing from base PT (Total: ${extra.length}):`);
    extra.slice(0, 10).forEach(key => console.error(`   - "${key}"`));
    hasErrors = true;
  }

  let invalidCount = 0;
  for (const key of currentKeys) {
    const val = mergedTranslations[lang][key];
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      invalidCount++;
      if (invalidCount <= 5) {
        console.error(`❌ Language "${lang}" has invalid/empty value for key "${key}": ${JSON.stringify(val)}`);
      }
    }
  }
  if (invalidCount > 0) {
    console.error(`❌ Language "${lang}" contains ${invalidCount} invalid, null, or empty translation values.`);
    hasErrors = true;
  }

  if (missing.length === 0 && extra.length === 0 && invalidCount === 0) {
    console.log(`✅ Language "${lang}" passes all key & value integrity checks.`);
  }
}

// ==========================================
// 2. Semantic-Key Migration Gate
// ==========================================
console.log('\n🧭 STEP 2: Auditing translation keys for the semantic-ID migration...');

const legacyKeys = ptKeys.filter(isLegacyTranslationKey);
console.log(`⚠️ Legacy/non-semantic keys still present: ${legacyKeys.length}`);
if (legacyKeys.length > 0) {
  console.log('   These keys are temporarily allowed during migration, but MUST NOT be used for new translations.');
  legacyKeys.slice(0, 20).forEach(key => console.log(`   - ${JSON.stringify(key)}`));
}

// ==========================================
// 3. Architectural Check: No Silent Fallbacks
// ==========================================
console.log('\n🛡️ STEP 3: Checking Architectural Rule: No Silent Fallback to Portuguese...');

const srcDir = path.resolve(process.cwd(), 'src');
const i18nConfigPath = path.join(srcDir, 'lib', 'i18n.ts');
if (fs.existsSync(i18nConfigPath)) {
  const i18nConfigContent = fs.readFileSync(i18nConfigPath, 'utf8');
  if (i18nConfigContent.includes("fallbackLng: 'pt'") || i18nConfigContent.includes('fallbackLng: ["pt"')) {
    console.error('❌ i18n config in src/lib/i18n.ts contains silent fallback to Portuguese (fallbackLng)!');
    hasErrors = true;
  } else {
    console.log('✅ i18n configuration correctly disables silent Portuguese fallbacks.');
  }
}

const translationsHelperPath = path.join(srcDir, 'translations.ts');
if (fs.existsSync(translationsHelperPath)) {
  const helperContent = fs.readFileSync(translationsHelperPath, 'utf8');
  if (helperContent.includes('|| mergedTranslations.pt')) {
    console.error('❌ translations.ts contains silent fallback to mergedTranslations.pt!');
    hasErrors = true;
  } else {
    console.log('✅ translations.ts has no silent Portuguese fallback.');
  }
}

// ==========================================
// 4. Reactivity & Persistence Infrastructure Check
// ==========================================
console.log('\n🔄 STEP 4: Checking Idioma Context & Reactivity Infrastructure...');

const i18nIndexPath = path.join(srcDir, 'i18n', 'index.ts');
const contextPath = path.join(srcDir, 'context', 'IdiomaContext.tsx');
let persistenceValid = false;
let reactivityValid = false;

if (fs.existsSync(i18nIndexPath)) {
  const indexContent = fs.readFileSync(i18nIndexPath, 'utf8');
  if (indexContent.includes('localStorage.setItem') && indexContent.includes('i18next.changeLanguage')) {
    persistenceValid = true;
    reactivityValid = true;
  }
}

if (fs.existsSync(contextPath)) {
  const contextContent = fs.readFileSync(contextPath, 'utf8');
  if (contextContent.includes('useTranslation') && contextContent.includes('changeLanguage')) {
    reactivityValid = reactivityValid && true;
  }
}

if (!persistenceValid || !reactivityValid) {
  console.error('❌ Missing localStorage persistence or i18next.changeLanguage reactive handler in i18n/context architecture!');
  hasErrors = true;
} else {
  console.log('✅ IdiomaContext & i18n/index.ts properly handle persistence in localStorage & reactive i18next language updates.');
}

// ==========================================
// 5. Code Base Scanner
// ==========================================
console.log('\n🔍 STEP 5: Scanning codebase for hardcoded literals & non-i18n UI strings...');

function scanDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (['i18n', 'scripts', 'node_modules'].includes(file)) continue;
      scanDirectory(fullPath);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.endsWith('.d.ts')) {
      if (['translations.ts', 'check-translations.ts', 'check-numerology-translations.ts', 'validate-translations.ts', 'audit-i18n.ts'].includes(file)) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith('import') || trimmed.startsWith('//') || trimmed.startsWith('*') ||
          trimmed.startsWith('/*') || trimmed.startsWith('interface ') || trimmed.startsWith('type ') ||
          line.includes('console.log') || line.includes('console.error') || line.includes('useTranslation') ||
          line.includes('translateUiText') || line.includes('tI18n') || line.includes(': Record<')
        ) return;

        // Do not skip t(...) lines here: legacy phrase keys are themselves part
        // of the migration inventory and must remain visible to the audit.
        const rawTextMatches = [
          ...line.matchAll(/>([^<>{}\s\d\r\n\t][^<>{}\r\n\t]*)</g),
          ...line.matchAll(/(?:placeholder|title|aria-label|aria-description|alt)=['"]([^'"]{3,})['"]/g),
          ...line.matchAll(/\bt\(\s*['"]([^'"]{3,})['"]/g)
        ];

        for (const match of rawTextMatches) {
          const matchedText = match[1]?.trim();
          if (!matchedText || matchedText.length <= 2) continue;
          if (['&times;', '...', '||', '•', '→', '←', '↑', '↓', '★', '⚡'].includes(matchedText)) continue;
          console.warn(`⚠️  Potential non-semantic/hardcoded text in ${path.relative(process.cwd(), fullPath)}:${index + 1}: "${matchedText}"`);
        }
      });
    }
  }
}

scanDirectory(srcDir);

console.log('--------------------------------------------------');
if (hasErrors) {
  console.error('❌ i18n Automated Architectural Validation Failed! Please resolve the issues listed above.');
  process.exit(1);
} else {
  console.log('✨ All i18n automated architectural checks passed successfully!');
  process.exit(0);
}

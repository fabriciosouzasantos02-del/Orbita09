import { mergedTranslations } from '../i18n';
import * as fs from 'fs';
import * as path from 'path';

const languages = ['pt', 'en', 'es', 'de', 'fr'] as const;

console.log('🌌 Starting Astro i18n Validation Engine...');
console.log('--------------------------------------------------');

let hasErrors = false;

// 1. Validate complete consistency of translation keys across languages
const allKeysByLang = languages.map(lang => ({
  lang,
  keys: Object.keys(mergedTranslations[lang] || {})
}));

const ptKeys = allKeysByLang.find(item => item.lang === 'pt')?.keys || [];
console.log(`🔑 Base language (pt) contains ${ptKeys.length} keys.`);

// Check completeness across all 5 languages
for (const lang of languages) {
  const currentKeys = Object.keys(mergedTranslations[lang] || {});
  
  // Check missing keys compared to PT
  const missing = ptKeys.filter(k => !currentKeys.includes(k));
  if (missing.length > 0) {
    console.error(`❌ Language "${lang}" has missing translation keys (Total: ${missing.length}):`);
    missing.slice(0, 10).forEach(key => console.error(`   - "${key}"`));
    hasErrors = true;
  }
  
  // Check extra keys compared to PT
  const extra = currentKeys.filter(k => !ptKeys.includes(k));
  if (extra.length > 0) {
    console.error(`❌ Language "${lang}" has keys missing from base PT (Total: ${extra.length}):`);
    extra.slice(0, 10).forEach(key => console.error(`   - "${key}"`));
    hasErrors = true;
  }

  // Check for empty strings or invalid values
  let emptyCount = 0;
  for (const key of currentKeys) {
    const val = mergedTranslations[lang][key];
    if (val === undefined || val === null || val.trim() === '') {
      emptyCount++;
      if (emptyCount <= 5) {
        console.error(`❌ Language "${lang}" has empty/invalid value for key "${key}"`);
      }
    }
  }
  if (emptyCount > 0) {
    console.error(`❌ Language "${lang}" contains ${emptyCount} empty or invalid translation values.`);
    hasErrors = true;
  }

  if (missing.length === 0 && extra.length === 0 && emptyCount === 0) {
    console.log(`✅ Language "${lang}" is 100% consistent with base keys and has no empty values.`);
  }
}

// 2. Scan components to enforce i18n usage and prevent hardcoded text
console.log('\n🔍 Scanning frontend files for hardcoded text and enforcing i18n rules...');
const srcDir = path.resolve(process.cwd(), 'src');

function scanDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(srcDir, fullPath);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (['i18n', 'scripts', 'node_modules'].includes(file)) continue;
      scanDirectory(fullPath);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.endsWith('.d.ts')) {
      if (['translations.ts', 'check-translations.ts', 'check-numerology-translations.ts'].includes(file)) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith('import') ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('*') ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('interface ') ||
          trimmed.startsWith('type ') ||
          line.includes('console.log') ||
          line.includes('console.error') ||
          line.includes('useTranslation') ||
          line.includes('translateUiText') ||
          line.includes('t(') ||
          line.includes('tI18n') ||
          line.includes(': Record<')
        ) {
          return;
        }

        const rawTextMatch = line.match(/>([^<>{}\s\d\r\n\t]+(?: [^<>{}\s\d\r\n\t]+)*)</);
        if (rawTextMatch && rawTextMatch[1]) {
          const matchedText = rawTextMatch[1].trim();
          if (matchedText.length > 2 && !['&times;', '...', '||', '•', '→', '←', '↑', '↓', '★', '⚡'].includes(matchedText)) {
            console.warn(`⚠️  Hardcoded text warning in ${path.relative(process.cwd(), fullPath)}:${index + 1}:`);
            console.warn(`   Line: "${line.trim()}"`);
            console.warn(`   Found raw text: "${matchedText}". Please register a translation key instead!`);
          }
        }
      });
    }
  }
}

scanDirectory(srcDir);

console.log('--------------------------------------------------');
if (hasErrors) {
  console.error('❌ Validation failed! Please fix missing translation keys before pushing.');
  process.exit(1);
} else {
  console.log('✨ i18n architectural constraints passed successfully!');
  process.exit(0);
}

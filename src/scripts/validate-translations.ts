import { mergedTranslations } from '../i18n';
import * as fs from 'fs';
import * as path from 'path';

const languages = ['pt', 'en', 'es', 'de', 'fr'] as const;

console.log('🌌 Starting Astro i18n Validation Engine...');
console.log('--------------------------------------------------');

let hasErrors = false;

// 1. Validate complete consistency of translation keys across languages
const ptKeys = Object.keys(mergedTranslations.pt);
console.log(`🔑 Base language (pt) contains ${ptKeys.length} keys.`);

for (const lang of languages) {
  if (lang === 'pt') continue;
  
  const currentKeys = Object.keys(mergedTranslations[lang]);
  const missing = ptKeys.filter(k => !currentKeys.includes(k));
  
  if (missing.length > 0) {
    console.error(`❌ Language "${lang}" has missing translation keys (Total: ${missing.length}):`);
    missing.forEach(key => console.error(`   - "${key}"`));
    hasErrors = true;
  } else {
    console.log(`✅ Language "${lang}" is 100% consistent with base keys.`);
  }
}

// 2. Scan components to enforce i18n usage and prevent hardcoded text
console.log('\n🔍 Scanning components for hardcoded text and enforcing i18n rules...');
const componentsDir = path.resolve(process.cwd(), 'src/components');

function scanDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for raw Portuguese text pattern or un-internationalized strings
      // Exclude comments, imports, etc.
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        // Skip lines that are clearly imports, logs, comments, or already using translation hooks/functions
        if (
          line.trim().startsWith('import') ||
          line.trim().startsWith('//') ||
          line.trim().startsWith('*') ||
          line.includes('console.log') ||
          line.includes('useTranslation') ||
          line.includes('translateUiText') ||
          line.includes('t(') ||
          line.includes('tI18n')
        ) {
          return;
        }

        // Detect raw Portuguese strings inside JSX text elements, e.g. <span>Salvar</span> or >Salvar<
        // Also look for common hardcoded texts
        const rawTextMatch = line.match(/>([^<>{}\s\d\r\n\t]+(?: [^<>{}\s\d\r\n\t]+)*)</);
        if (rawTextMatch && rawTextMatch[1]) {
          const matchedText = rawTextMatch[1].trim();
          // Exclude punctuation or short brackets
          if (matchedText.length > 2 && !['&times;', '...', '||'].includes(matchedText)) {
            console.warn(`⚠️  Hardcoded text warning in ${path.relative(process.cwd(), fullPath)}:${index + 1}:`);
            console.warn(`   Line: "${line.trim()}"`);
            console.warn(`   Found raw text: "${matchedText}". Please register a translation key instead!`);
          }
        }
      });
    }
  }
}

scanDirectory(componentsDir);

console.log('--------------------------------------------------');
if (hasErrors) {
  console.error('❌ Validation failed! Please fix missing translation keys before pushing.');
  process.exit(1);
} else {
  console.log('✨ i18n architectural constraints passed successfully!');
  process.exit(0);
}

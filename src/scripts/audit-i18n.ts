import * as fs from 'fs';
import * as path from 'path';
import { mergedTranslations } from '../i18n';
import { uiTranslations } from '../lib/translations';
import { staticTranslations } from '../translations';

const languages = ['pt', 'en', 'es', 'de', 'fr'] as const;

function getTranslation(key: string, lang: 'en' | 'es' | 'de' | 'fr'): string | null {
  if (mergedTranslations[lang]?.[key]) return mergedTranslations[lang][key];
  if (staticTranslations[lang]?.[key]) return staticTranslations[lang][key];
  if (uiTranslations[lang]?.[key]) return uiTranslations[lang][key];
  return null;
}

// 1. Audit missing keys across languages for all PT keys
const allPtKeys = new Set<string>();
Object.keys(mergedTranslations.pt).forEach(k => allPtKeys.add(k));
Object.keys(staticTranslations.pt).forEach(k => allPtKeys.add(k));
Object.keys(uiTranslations.en).forEach(k => allPtKeys.add(k));

const missingKeysPerLang: Record<string, string[]> = { en: [], es: [], de: [], fr: [] };

for (const key of Array.from(allPtKeys)) {
  for (const lang of ['en', 'es', 'de', 'fr'] as const) {
    if (!getTranslation(key, lang)) {
      missingKeysPerLang[lang].push(key);
    }
  }
}

// 2. Scan all tsx files for Portuguese text strings passed to t(...) or hardcoded in JSX
const srcDir = path.resolve(process.cwd(), 'src');
const issues: Array<{ file: string; line: number; type: string; text: string; missingLangs: string[] }> = [];

function scanFile(filePath: string) {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import')) {
      return;
    }

    // Check t("...") / tI18n("...") / translateUiText("...")
    const tRegex = /(?:t|tI18n|translateUiText|i18n\.t)\(\s*(["'])(.+?)\1\s*[\),]/g;
    let match;
    while ((match = tRegex.exec(trimmed)) !== null) {
      const text = match[2];
      if (text && text.length > 1 && !text.startsWith('http')) {
        const missing = (['en', 'es', 'de', 'fr'] as const).filter(lang => !getTranslation(text, lang));
        if (missing.length > 0) {
          issues.push({ file: relPath, line: lineNum, type: 't_missing_translation', text, missingLangs: missing });
        }
      }
    }

    // Check hardcoded JSX text
    const jsxRegex = />\s*([^<>{}\r\n\t]+?)\s*</g;
    while ((match = jsxRegex.exec(trimmed)) !== null) {
      const text = match[1].trim();
      // Skip non-Portuguese / syntax remnants
      if (text.length > 1 && /[a-zA-ZÀ-ú]/.test(text) && !['&times;', '...', '||', 'VS', 'v1.0', '100%', 'Rx', '0', '1', '2'].includes(text)) {
        if (!trimmed.includes(`t("${text}")`) && !trimmed.includes(`t('${text}')`) && !trimmed.includes(`tI18n("${text}")`) && !trimmed.includes(`translateUiText("${text}"`)) {
          // Check if it's a known PT phrase
          const missing = (['en', 'es', 'de', 'fr'] as const).filter(lang => !getTranslation(text, lang));
          issues.push({ file: relPath, line: lineNum, type: 'jsx_hardcoded', text, missingLangs: missing });
        }
      }
    }

    // Check toast messages or alert messages
    const toastRegex = /(?:toast(?:\.error|\.success|\.info|\.warning)?|alert)\(\s*(["'])(.+?)\1/g;
    while ((match = toastRegex.exec(trimmed)) !== null) {
      const text = match[2].trim();
      if (text.length > 2 && /[a-zA-ZÀ-ú]/.test(text)) {
        if (!trimmed.includes('translateUiText') && !trimmed.includes('t(') && !trimmed.includes('tI18n(')) {
          const missing = (['en', 'es', 'de', 'fr'] as const).filter(lang => !getTranslation(text, lang));
          issues.push({ file: relPath, line: lineNum, type: 'toast_hardcoded', text, missingLangs: missing });
        }
      }
    }
  });
}

function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') walkDir(full);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (!file.includes('audit-i18n') && !file.includes('validate-translations')) scanFile(full);
    }
  }
}

walkDir(srcDir);

const report = {
  missingKeysPerLangCounts: {
    en: missingKeysPerLang.en.length,
    es: missingKeysPerLang.es.length,
    de: missingKeysPerLang.de.length,
    fr: missingKeysPerLang.fr.length
  },
  missingKeysPerLang,
  issuesCount: issues.length,
  issues
};

fs.writeFileSync('i18n-audit-report.json', JSON.stringify(report, null, 2));
console.log(`Audit complete! Wrote ${issues.length} issues to i18n-audit-report.json`);

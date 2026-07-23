import * as fs from 'fs';
import * as path from 'path';
import { uiTranslations } from '../lib/translations';
import { mergedTranslations } from '../i18n';
import { staticTranslations } from '../translations';

function isPortugueseText(str: string): boolean {
  if (!str || str.length < 2) return false;
  // Ignore JS code patterns, component names, CSS classes, URLs, imports, etc.
  if (str.includes('./components/') || str.includes('className=') || str.includes('month ===') || str.includes('lLongitude')) return false;
  if (str.startsWith('http') || str.startsWith('orbi_') || str.startsWith('chart_') || str.includes('=>') || str.includes('===') || str.includes('&&')) return false;
  if (/^[0-9\s.,\/\\:;()\-+*%#@!_=\[\]{}'"]+$/.test(str)) return false; // purely numbers and symbols
  
  // Must contain letters
  if (!/[a-zA-ZÀ-ú]/.test(str)) return false;
  return true;
}

const langs = ['en', 'es', 'de', 'fr'] as const;

function isTranslated(ptText: string, lang: 'en' | 'es' | 'de' | 'fr'): boolean {
  if (uiTranslations[lang]?.[ptText]) return true;
  if (mergedTranslations[lang]?.[ptText]) return true;
  if (staticTranslations[lang]?.[ptText]) return true;
  
  const clean = ptText.trim();
  if (uiTranslations[lang]?.[clean]) return true;
  if (mergedTranslations[lang]?.[clean]) return true;
  if (staticTranslations[lang]?.[clean]) return true;

  return false;
}

const srcDir = path.resolve(process.cwd(), 'src');
const untranslatedByFile: Record<string, Array<{ line: number; text: string; missingLangs: string[] }>> = {};

function scanFile(filePath: string) {
  const rel = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import')) return;

    // Extract strings in t("..."), tI18n("..."), translateUiText("..."), i18n.t("...")
    const tRegex = /(?:t|tI18n|translateUiText|i18n\.t)\(\s*(["'])(.+?)\1/g;
    let match;
    while ((match = tRegex.exec(trimmed)) !== null) {
      const text = match[2];
      if (isPortugueseText(text)) {
        const missing = langs.filter(l => !isTranslated(text, l));
        if (missing.length > 0) {
          if (!untranslatedByFile[rel]) untranslatedByFile[rel] = [];
          untranslatedByFile[rel].push({ line: lineNum, text, missingLangs: missing });
        }
      }
    }

    // Extract raw JSX strings >text<
    const jsxRegex = />\s*([^<>{}\r\n\t]+?)\s*</g;
    while ((match = jsxRegex.exec(trimmed)) !== null) {
      const text = match[1].trim();
      if (isPortugueseText(text)) {
        if (!trimmed.includes(`t("${text}")`) && !trimmed.includes(`t('${text}')`) && !trimmed.includes(`tI18n("${text}")`) && !trimmed.includes(`translateUiText("${text}"`)) {
          const missing = langs.filter(l => !isTranslated(text, l));
          if (!untranslatedByFile[rel]) untranslatedByFile[rel] = [];
          untranslatedByFile[rel].push({ line: lineNum, text: `[JSX] ${text}`, missingLangs: missing });
        }
      }
    }

    // Extract strings in toast.error("..."), toast.success("..."), alert("...")
    const toastRegex = /(?:toast(?:\.error|\.success|\.info|\.warning)?|alert)\(\s*(["'])(.+?)\1/g;
    while ((match = toastRegex.exec(trimmed)) !== null) {
      const text = match[2].trim();
      if (isPortugueseText(text)) {
        const missing = langs.filter(l => !isTranslated(text, l));
        if (!untranslatedByFile[rel]) untranslatedByFile[rel] = [];
        untranslatedByFile[rel].push({ line: lineNum, text: `[TOAST] ${text}`, missingLangs: missing });
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
      if (!file.includes('scripts/') && !file.includes('check-')) scanFile(full);
    }
  }
}

walkDir(srcDir);

fs.writeFileSync('untranslated-report.json', JSON.stringify(untranslatedByFile, null, 2));

let totalCount = 0;
Object.keys(untranslatedByFile).forEach(f => {
  totalCount += untranslatedByFile[f].length;
});
console.log(`Scan complete! Total untranslated Portuguese items: ${totalCount}`);

import * as fs from 'fs';
import * as path from 'path';
import { mergedTranslations } from '../i18n';

const languages = ['pt', 'en', 'es', 'fr', 'de'] as const;
type Language = (typeof languages)[number];

export interface AuditIssue {
  category:
    | 'MISSING KEY'
    | 'DUPLICATE KEY'
    | 'EMPTY VALUE'
    | 'EXTRA KEY'
    | 'HARDCODED TEXT'
    | 'HARDCODED ALERT'
    | 'HARDCODED TOAST'
    | 'HARDCODED ERROR'
    | 'HARDCODED PLACEHOLDER'
    | 'HARDCODED TITLE'
    | 'UNTRANSLATED PORTUGUESE VALUE'
    | 'INVALID KEY USAGE'
    | 'UNEXPECTED FALLBACK'
    | 'COMPONENT WITHOUT I18N'
    | 'AI WITHOUT LANGUAGE'
    | 'ENDPOINT WITHOUT LANGUAGE'
    | 'PROMPT WITHOUT LANGUAGE'
    | 'STRUCTURAL DISCREPANCY';
  file?: string;
  line?: number;
  key?: string;
  lang?: string;
  details: string;
  severity: 'WARNING' | 'ERROR';
}

console.log('🌌 Starting Comprehensive Portal Órbita i18n Audit Engine...');
console.log('================================================================');

const issues: AuditIssue[] = [];

// 1. DICTIONARY STRUCTURAL AND KEY INTEGRITY AUDIT
const ptKeys = new Set(Object.keys(mergedTranslations.pt || {}));
console.log(`\n🔑 Analyzing translation dictionaries across 5 languages (Base: ${ptKeys.size} PT keys)...`);

for (const lang of languages) {
  const langObj = mergedTranslations[lang] || {};
  const langKeys = new Set(Object.keys(langObj));

  // A. Check Missing Keys
  if (lang !== 'pt') {
    for (const key of ptKeys) {
      if (!langKeys.has(key)) {
        issues.push({
          category: 'MISSING KEY',
          key,
          lang,
          details: `Key "${key}" is present in "pt" but missing in "${lang}"`,
          severity: 'ERROR'
        });
      }
    }
  }

  // B. Check Extra Keys
  for (const key of langKeys) {
    if (!ptKeys.has(key)) {
      issues.push({
        category: 'EXTRA KEY',
        key,
        lang,
        details: `Key "${key}" exists in "${lang}" but does not exist in base "pt"`,
        severity: 'WARNING'
      });
    }
  }

  // C. Check Empty Values
  for (const key of langKeys) {
    const val = langObj[key];
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      issues.push({
        category: 'EMPTY VALUE',
        key,
        lang,
        details: `Key "${key}" in "${lang}" has an empty or null value`,
        severity: 'ERROR'
      });
    }
  }

  // D. Check Untranslated Portuguese Values in Non-PT languages
  if (lang !== 'pt') {
    const ptMarkers = [
      'você', 'seu', 'sua', 'seus', 'suas', 'não', 'configurações',
      'detalhes', 'carregando', 'sucesso', 'erro ao', 'visualizar',
      'direitos reservados', 'mapa astral', 'revelado', 'previsões'
    ];
    for (const key of langKeys) {
      const val = langObj[key];
      const ptVal = mergedTranslations.pt[key];
      if (typeof val === 'string' && typeof ptVal === 'string' && val.length > 10) {
        // Exclude terms that are identical by design (brands, proper names, symbols)
        if (
          val === ptVal &&
          !val.includes('Órbita') &&
          !val.includes('Osíris') &&
          !val.includes('Tarot') &&
          !val.includes('Astrologia') &&
          !/^[A-Z0-9_\-\.\:\/@\s]+$/.test(val)
        ) {
          const lower = val.toLowerCase();
          const hasPtMarker = ptMarkers.some(m => lower.includes(m));
          if (hasPtMarker || (lang === 'en' && /[ãõçáéíóúâê]/i.test(val)) || (lang === 'de' && /[ãõç]/i.test(val))) {
            issues.push({
              category: 'UNTRANSLATED PORTUGUESE VALUE',
              key,
              lang,
              details: `Key "${key}" in "${lang}" appears to contain untranslated Portuguese text: "${val.substring(0, 60)}..."`,
              severity: 'WARNING'
            });
          }
        }
      }
    }
  }
}

// 2. SCAN FRONTEND CODE FOR KEY USAGE, HARDCODED TEXT, AND COMPONENTS WITHOUT I18N
console.log('🔍 Scanning frontend components & code files...');
const srcDir = path.resolve(process.cwd(), 'src');

function scanFrontendFile(filePath: string) {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const hasI18nImport =
    content.includes('useTranslation') ||
    content.includes('i18next') ||
    content.includes('getActiveLanguage') ||
    content.includes('getCurrentLang') ||
    content.includes('translateUiText') ||
    content.includes('tI18n') ||
    content.includes('translations');

  // Check Component Without i18n
  if (
    filePath.endsWith('.tsx') &&
    !hasI18nImport &&
    !filePath.includes('/i18n/') &&
    !filePath.includes('/scripts/')
  ) {
    // Only flag if it renders JSX
    if (content.includes('return (') || content.includes('return <')) {
      issues.push({
        category: 'COMPONENT WITHOUT I18N',
        file: relPath,
        details: `Component in file "${relPath}" renders UI without importing i18n utilities`,
        severity: 'WARNING'
      });
    }
  }

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('export type ') ||
      trimmed.startsWith('interface ')
    ) {
      return;
    }

    // Check invalid key usage: t("key") or i18next.t("key") or translateUiText("key")
    const keyCallRegex = /\b(?:t|tI18n|translateUiText|i18next\.t)\(\s*["']([^"'\s]+)["']/g;
    let match;
    while ((match = keyCallRegex.exec(trimmed)) !== null) {
      const accessedKey = match[1];
      if (
        accessedKey &&
        !accessedKey.includes('${') &&
        !accessedKey.startsWith('http') &&
        !accessedKey.includes(' ') &&
        accessedKey.length > 1
      ) {
        if (!ptKeys.has(accessedKey)) {
          issues.push({
            category: 'INVALID KEY USAGE',
            file: relPath,
            line: lineNum,
            key: accessedKey,
            details: `Key "${accessedKey}" invoked in code is missing from translation dictionary`,
            severity: 'ERROR'
          });
        }
      }
    }

    // Check Hardcoded Placeholders
    const placeholderMatch = line.match(/placeholder=\s*["']([^"']+)["']/);
    if (placeholderMatch) {
      const phText = placeholderMatch[1];
      if (
        phText &&
        !phText.includes('{') &&
        !phText.includes('t(') &&
        phText.length > 2 &&
        /[a-zA-ZÀ-ú]/.test(phText)
      ) {
        issues.push({
          category: 'HARDCODED PLACEHOLDER',
          file: relPath,
          line: lineNum,
          details: `Input placeholder is hardcoded: "${phText}"`,
          severity: 'WARNING'
        });
      }
    }

    // Check Hardcoded Title / Aria
    const titleMatch = line.match(/(?:title|aria-label)=\s*["']([^"']+)["']/);
    if (titleMatch) {
      const titleText = titleMatch[1];
      if (
        titleText &&
        !titleText.includes('{') &&
        !titleText.includes('t(') &&
        titleText.length > 2 &&
        /[a-zA-ZÀ-ú]/.test(titleText)
      ) {
        issues.push({
          category: 'HARDCODED TITLE',
          file: relPath,
          line: lineNum,
          details: `Title / aria-label attribute is hardcoded: "${titleText}"`,
          severity: 'WARNING'
        });
      }
    }

    // Check Hardcoded Alerts / Toasts / Error messages
    const toastAlertMatch = line.match(/(?:alert|toast|toast\.error|toast\.success)\(\s*["']([^"']+)["']/);
    if (toastAlertMatch) {
      const msgText = toastAlertMatch[1];
      if (
        msgText &&
        !msgText.includes('t(') &&
        !msgText.includes('translateUiText') &&
        msgText.length > 3 &&
        /[a-zA-ZÀ-ú]/.test(msgText)
      ) {
        const cat = line.includes('alert') ? 'HARDCODED ALERT' : 'HARDCODED TOAST';
        issues.push({
          category: cat,
          file: relPath,
          line: lineNum,
          details: `Literal message in ${cat.toLowerCase()}: "${msgText}"`,
          severity: 'WARNING'
        });
      }
    }

    // Check Hardcoded JSX Text
    if (filePath.endsWith('.tsx')) {
      const jsxTextMatch = line.match(/>\s*([^<>{}\r\n\t]+?)\s*</);
      if (jsxTextMatch) {
        const rawText = jsxTextMatch[1].trim();
        if (
          rawText.length > 2 &&
          /[a-zA-ZÀ-ú]/.test(rawText) &&
          !['&times;', '...', '||', 'VS', 'v1.0', '100%', 'PRO', '0', '1', '2', '3', '→', '←', '•'].includes(rawText) &&
          !rawText.includes('=') &&
          !rawText.includes('&&') &&
          !rawText.includes('||') &&
          !rawText.includes('=>')
        ) {
          if (
            !line.includes('t(') &&
            !line.includes('tI18n(') &&
            !line.includes('translateUiText(') &&
            !line.includes('i18next.t(')
          ) {
            issues.push({
              category: 'HARDCODED TEXT',
              file: relPath,
              line: lineNum,
              details: `Hardcoded JSX text found: "${rawText}"`,
              severity: 'WARNING'
            });
          }
        }
      }
    }
  });
}

function walkFrontendDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', 'i18n', 'scripts', '.git'].includes(entry)) {
        walkFrontendDir(full);
      }
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
      if (!entry.endsWith('.d.ts')) {
        scanFrontendFile(full);
      }
    }
  }
}

walkFrontendDir(srcDir);

// 3. SCAN SERVER / API ENDPOINTS & AI PROMPTS
console.log('🌐 Scanning server.ts API endpoints and AI prompts...');
const serverFile = path.resolve(process.cwd(), 'server.ts');

if (fs.existsSync(serverFile)) {
  const serverContent = fs.readFileSync(serverFile, 'utf8');
  const serverLines = serverContent.split('\n');

  // Parse API endpoints
  const endpointRegex = /app\.(post|get|put|delete)\(\s*["'](\/api\/[^"']+)["']/g;
  let epMatch;
  while ((epMatch = endpointRegex.exec(serverContent)) !== null) {
    const verb = epMatch[1].toUpperCase();
    const epPath = epMatch[2];
    const matchPos = epMatch.index;

    // Grab surrounding code block (up to 2000 chars)
    const block = serverContent.substring(matchPos, matchPos + 2500);

    const hasLang =
      block.includes('lang') ||
      block.includes('language') ||
      block.includes('activeLang') ||
      block.includes('req.t') ||
      block.includes('accept-language');

    // Skip admin endpoints or stripe webhooks that don't serve localized user content
    if (
      !hasLang &&
      !epPath.includes('/admin/') &&
      !epPath.includes('/webhook') &&
      !epPath.includes('/cities/')
    ) {
      issues.push({
        category: 'ENDPOINT WITHOUT LANGUAGE',
        file: 'server.ts',
        details: `Endpoint [${verb}] "${epPath}" does not handle user language parameter (lang/activeLang)`,
        severity: 'WARNING'
      });
    }

    // Check AI calls within endpoint block
    if (block.includes('ai.models.generateContent') || block.includes('ai.chats.create') || block.includes('generateContent')) {
      if (!block.includes('targetLanguage') && !block.includes('targetLang') && !block.includes('targetLangName') && !block.includes('${activeLang}')) {
        issues.push({
          category: 'PROMPT WITHOUT LANGUAGE',
          file: 'server.ts',
          details: `AI call in endpoint "${epPath}" does not dynamically pass output language to prompt`,
          severity: 'WARNING'
        });
      }
    }
  }
}

// 4. SUMMARY REPORT GENERATION
console.log('\n================================================================');
console.log('📊 i18n AUDIT SUMMARY REPORT:');
console.log('================================================================');

const grouped: Record<string, AuditIssue[]> = {};
for (const issue of issues) {
  if (!grouped[issue.category]) grouped[issue.category] = [];
  grouped[issue.category].push(issue);
}

for (const [cat, items] of Object.entries(grouped)) {
  console.log(`\n📌 ${cat} (Total: ${items.length})`);
  items.slice(0, 5).forEach(item => {
    const loc = item.file ? ` [${item.file}${item.line ? `:${item.line}` : ''}]` : '';
    console.log(`   - ${item.details}${loc}`);
  });
  if (items.length > 5) {
    console.log(`   ... and ${items.length - 5} more issues.`);
  }
}

const errorCount = issues.filter(i => i.severity === 'ERROR').length;
const warningCount = issues.filter(i => i.severity === 'WARNING').length;

console.log('\n----------------------------------------------------------------');
console.log(`Total Issues Found: ${issues.length} (${errorCount} ERRORS, ${warningCount} WARNINGS)`);

const reportObj = {
  timestamp: new Date().toISOString(),
  totalIssues: issues.length,
  errorCount,
  warningCount,
  categoriesCount: Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.length])),
  issues
};

fs.writeFileSync('i18n-audit-report.json', JSON.stringify(reportObj, null, 2));
console.log('📄 Detailed report saved to i18n-audit-report.json');

if (errorCount > 0) {
  console.error('\n❌ Audit failed due to critical structural or key errors!');
  process.exit(1);
} else {
  console.log('\n✨ Audit passed successfully! No breaking i18n errors found.');
  process.exit(0);
}

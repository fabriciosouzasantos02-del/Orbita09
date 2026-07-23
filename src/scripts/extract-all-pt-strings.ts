import * as fs from 'fs';
import * as path from 'path';

function isPortuguese(str: string): boolean {
  if (!str) return false;
  const s = str.trim();
  if (s.length < 2) return false;
  // Exclude JS code, CSS, URLs, keys, imports, regex, numbers only
  if (s.startsWith('.') || s.startsWith('#') || s.startsWith('${') || s.includes('./') || s.includes('className') || s.includes('==') || s.includes('=>') || s.includes('&&') || s.includes('||')) return false;
  if (s.startsWith('http') || s.startsWith('orbi_') || s.startsWith('chart_') || s.startsWith('bg-') || s.startsWith('text-') || s.startsWith('border-')) return false;
  if (/^[0-9\s.,\/\\:;()\-+*%#@!_=\[\]{}'"]+$/.test(s)) return false;
  if (['Promise', 'Helvetica', 'VS', 'Rx', 'px', 'defs', 'circle', 'text', 'Record'].includes(s)) return false;
  if (s.includes('Sync-chart with') || s.includes('Sincro-carta con') || s.includes('Sync-Horoskop mit') || s.includes('Synchro-carte avec')) return false;
  
  // Must contain actual Portuguese words (letters)
  return /[a-zA-ZÀ-ú]/.test(s);
}

const allPtStrings = new Set<string>();

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import')) return;

    // 1. Strings inside t("..."), tI18n("..."), translateUiText("..."), i18n.t("...")
    const tRegex = /(?:t|tI18n|translateUiText|i18n\.t)\(\s*(["'])(.+?)\1/g;
    let match;
    while ((match = tRegex.exec(trimmed)) !== null) {
      if (isPortuguese(match[2])) {
        allPtStrings.add(match[2].trim());
      }
    }

    // 2. Strings inside JSX text >text<
    const jsxRegex = />\s*([^<>{}\r\n\t]+?)\s*</g;
    while ((match = jsxRegex.exec(trimmed)) !== null) {
      if (isPortuguese(match[1])) {
        allPtStrings.add(match[1].trim());
      }
    }

    // 3. Strings inside toast("..."), alert("...")
    const toastRegex = /(?:toast(?:\.error|\.success|\.info|\.warning)?|alert)\(\s*(["'])(.+?)\1/g;
    while ((match = toastRegex.exec(trimmed)) !== null) {
      if (isPortuguese(match[2])) {
        allPtStrings.add(match[2].trim());
      }
    }

    // 4. Attribute values: title="...", placeholder="...", label="..."
    const attrRegex = /(?:placeholder|title|label|aria-label)\s*=\s*(["'])(.+?)\1/g;
    while ((match = attrRegex.exec(trimmed)) !== null) {
      if (isPortuguese(match[2])) {
        allPtStrings.add(match[2].trim());
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

walkDir(path.resolve(process.cwd(), 'src'));

const ptList = Array.from(allPtStrings).sort();
fs.writeFileSync('all-pt-strings.json', JSON.stringify(ptList, null, 2));
console.log(`Extracted ${ptList.length} unique Portuguese strings from source code!`);

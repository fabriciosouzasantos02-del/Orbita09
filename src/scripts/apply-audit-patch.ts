import * as fs from 'fs';
import * as path from 'path';

function main() {
  const jsonPath = 'audit-translations-output.json';
  if (!fs.existsSync(jsonPath)) {
    console.error(`File ${jsonPath} does not exist yet.`);
    process.exit(1);
  }

  const generated: Record<'en' | 'es' | 'de' | 'fr', Record<string, string>> = JSON.parse(
    fs.readFileSync(jsonPath, 'utf8')
  );

  const patchFilePath = path.resolve(process.cwd(), 'src/lib/translationPatch.ts');
  let content = fs.readFileSync(patchFilePath, 'utf8');

  // We will parse existing translationPatch.ts or inject into patches
  // Let's create a dedicated file src/lib/autoAuditPatch.ts and import it in translationPatch.ts!

  const autoPatchPath = path.resolve(process.cwd(), 'src/lib/autoAuditPatch.ts');

  const autoPatchContent = `// Auto-generated 100% complete translation patch
export const autoAuditPatch: Record<'en' | 'es' | 'de' | 'fr', Record<string, string>> = ${JSON.stringify(generated, null, 2)};
`;

  fs.writeFileSync(autoPatchPath, autoPatchContent, 'utf8');
  console.log(`Created src/lib/autoAuditPatch.ts with ${Object.keys(generated.en || {}).length} EN keys, ${Object.keys(generated.es || {}).length} ES keys, ${Object.keys(generated.de || {}).length} DE keys, ${Object.keys(generated.fr || {}).length} FR keys!`);

  // Now ensure translationPatch.ts imports autoAuditPatch and merges it
  if (!content.includes('autoAuditPatch')) {
    const importLine = `import { autoAuditPatch } from './autoAuditPatch';\n`;
    content = importLine + content;

    // Inside applyTranslationPatches() function:
    const target = `for (const key of Object.keys(patch)) {\n      dict[key] = patch[key];\n    }`;
    const replacement = `for (const key of Object.keys(patch)) {
      dict[key] = patch[key];
    }
    const autoPatch = autoAuditPatch[lang] || {};
    for (const key of Object.keys(autoPatch)) {
      if (autoPatch[key] && autoPatch[key] !== key) {
        dict[key] = autoPatch[key];
      }
    }`;

    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(patchFilePath, content, 'utf8');
      console.log('Updated src/lib/translationPatch.ts to merge autoAuditPatch!');
    }
  } else {
    console.log('translationPatch.ts already imports autoAuditPatch.');
  }
}

main();

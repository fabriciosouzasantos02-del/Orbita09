import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

interface MissingMap {
  [ptText: string]: {
    en?: boolean;
    es?: boolean;
    de?: boolean;
    fr?: boolean;
  };
}

const languageNames = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French"
};

async function main() {
  if (!fs.existsSync('missing-translations-map.json')) {
    console.error('missing-translations-map.json does not exist. Run find-missing-translations.ts first.');
    process.exit(1);
  }

  const missingMap: MissingMap = JSON.parse(fs.readFileSync('missing-translations-map.json', 'utf8'));
  const allTexts = Object.keys(missingMap);
  console.log(`Loaded ${allTexts.length} missing texts.`);

  const missingByLang: Record<'en' | 'es' | 'de' | 'fr', string[]> = {
    en: [],
    es: [],
    de: [],
    fr: []
  };

  allTexts.forEach(text => {
    if (missingMap[text].en) missingByLang.en.push(text);
    if (missingMap[text].es) missingByLang.es.push(text);
    if (missingMap[text].de) missingByLang.de.push(text);
    if (missingMap[text].fr) missingByLang.fr.push(text);
  });

  const translationsResult: Record<'en' | 'es' | 'de' | 'fr', Record<string, string>> = {
    en: {},
    es: {},
    de: {},
    fr: {}
  };

  const langs: ('en' | 'es' | 'de' | 'fr')[] = ['en', 'es', 'de', 'fr'];

  for (const lang of langs) {
    const textsToTranslate = missingByLang[lang];
    console.log(`\n========================================`);
    console.log(`Translating ${textsToTranslate.length} texts for ${lang.toUpperCase()} (${languageNames[lang]})...`);
    console.log(`========================================`);

    if (textsToTranslate.length === 0) continue;

    const batchSize = 80;
    for (let i = 0; i < textsToTranslate.length; i += batchSize) {
      const batch = textsToTranslate.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(textsToTranslate.length / batchSize)} for ${lang}...`);

      const prompt = `You are a high-precision professional translator for an astrological and tarot application. Translate the following list of Portuguese strings into accurate, elegant ${languageNames[lang]}.
CRITICAL INSTRUCTIONS:
1. Preserve all placeholders (like {name}, {birthDate}, {city}, {number}, {count}, {sign}, {house}, etc.) EXACTLY as they appear.
2. Preserve HTML tags (e.g. <strong>, <span>, <p>, <br/>) and markdown formatting (like **) intact.
3. Maintain the exact same keys in the JSON output as the original input Portuguese strings.
4. Keep the tone inspiring, mystical, and professional.

List of Portuguese strings:
${JSON.stringify(batch, null, 2)}

Return a JSON object where each key is the exact Portuguese string from the input, and the value is its translation in ${languageNames[lang]}.`;

      let success = false;
      let attempts = 0;

      while (!success && attempts < 3) {
        attempts++;
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const resultJson = JSON.parse(response.text || '{}');
          let countAdded = 0;
          for (const key of batch) {
            if (resultJson[key]) {
              translationsResult[lang][key] = resultJson[key];
              countAdded++;
            } else {
              // Fallback
              translationsResult[lang][key] = key;
            }
          }
          console.log(`  Added ${countAdded}/${batch.length} translations for ${lang}`);
          success = true;
        } catch (err: any) {
          console.error(`  Batch attempt ${attempts} failed for ${lang}:`, err?.message || err);
          if (attempts < 3) {
            console.log("  Retrying in 5 seconds...");
            await new Promise(r => setTimeout(r, 5000));
          } else {
            console.error(`  Falling back to original keys for this batch.`);
            batch.forEach(k => { translationsResult[lang][k] = k; });
          }
        }
      }

      // Small pause between batches
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Save translationsResult to a JSON file
  fs.writeFileSync('audit-translations-output.json', JSON.stringify(translationsResult, null, 2));
  console.log(`\nSuccessfully generated translations and saved to audit-translations-output.json!`);
}

main().catch(err => {
  console.error("Fatal error in generation:", err);
  process.exit(1);
});

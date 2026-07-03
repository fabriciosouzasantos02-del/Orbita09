import { GoogleGenAI, Type } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';

// Initialize GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

interface MissingKeys {
  en: string[];
  es: string[];
  de: string[];
  fr: string[];
}

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined. Cannot run Gemini translation.");
    process.exit(1);
  }

  console.log("Reading missing-keys.json...");
  const rawData = fs.readFileSync('missing-keys.json', 'utf8');
  const missingKeys: MissingKeys = JSON.parse(rawData);

  const languages: (keyof MissingKeys)[] = ['en', 'es', 'de', 'fr'];
  const languageNames = {
    en: "English",
    es: "Spanish",
    de: "German",
    fr: "French"
  };

  const translations: Record<string, Record<string, string>> = {
    en: {},
    es: {},
    de: {},
    fr: {}
  };

  for (const lang of languages) {
    const keys = missingKeys[lang];
    if (keys.length === 0) continue;

    console.log(`Translating ${keys.length} keys for ${lang} (${languageNames[lang]})...`);
    
    // Batch keys (e.g. 150 at a time to do exactly 1 request per language)
    const batchSize = 150;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      console.log(`  Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(keys.length / batchSize)}...`);
      
      const prompt = `You are an expert translator. Translate the following list of Portuguese keys (used as keys in an internationalization dictionary) into natural, grammatically correct ${languageNames[lang]}. 
Keep the tone, formatting, HTML tags, markdown bold stars (**), and placeholders (like {firstName}, {formattedBirthDate}, {aspectNum}, etc.) EXACTLY intact.
If the key has a typo, translate the intended meaning of the key but preserve placeholders.

List of Portuguese texts to translate:
${JSON.stringify(batch, null, 2)}

Return a JSON object where the keys are the EXACT original Portuguese strings, and the values are their translations in ${languageNames[lang]}.`;

      let success = false;
      let attempts = 0;
      while (!success && attempts < 3) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const batchTranslations = JSON.parse(response.text || '{}');
          Object.assign(translations[lang], batchTranslations);
          success = true;
          console.log(`  Successfully translated ${batch.length} keys for ${lang}!`);
        } catch (error: any) {
          attempts++;
          console.error(`  Attempt ${attempts} failed for ${lang}:`, error?.message || error);
          if (attempts < 3) {
            console.log("  Waiting 35 seconds before retrying...");
            await new Promise(resolve => setTimeout(resolve, 35000));
          } else {
            console.error(`  All attempts failed for ${lang}. Falling back to original keys.`);
            for (const k of batch) {
              translations[lang][k] = k;
            }
          }
        }
      }

      // Add a 15 second delay to respect rate limit perfectly
      console.log("  Waiting 15 seconds to respect rate limits perfectly...");
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }

  // Generate the TypeScript patch file
  let patchCode = `// Auto-generated translation patches to ensure 100% key consistency across all languages
import { uiTranslations } from './translations';

const patches: Record<'en' | 'es' | 'de' | 'fr', Record<string, string>> = {
  en: ${JSON.stringify(translations.en, null, 2)},
  es: ${JSON.stringify(translations.es, null, 2)},
  de: ${JSON.stringify(translations.de, null, 2)},
  fr: ${JSON.stringify(translations.fr, null, 2)}
};

// Apply patches to the central uiTranslations object
export function applyTranslationPatches() {
  const languages: ('en' | 'es' | 'de' | 'fr')[] = ['en', 'es', 'de', 'fr'];
  for (const lang of languages) {
    if (!uiTranslations[lang]) {
      (uiTranslations as any)[lang] = {};
    }
    const dict = uiTranslations[lang];
    const patch = patches[lang];
    for (const key of Object.keys(patch)) {
      if (!dict[key]) {
        dict[key] = patch[key];
      }
    }
  }
}
`;

  fs.writeFileSync('src/lib/translationPatch.ts', patchCode);
  console.log("Successfully generated src/lib/translationPatch.ts!");
}

run();

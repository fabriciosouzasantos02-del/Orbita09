import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';

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

async function translateBatchWithRetry(lang: 'en' | 'es' | 'de' | 'fr', batch: string[]): Promise<Record<string, string>> {
  const prompt = `You are a professional translator for a spiritual astrology and tarot app.
Translate the following Portuguese strings into natural ${languageNames[lang]}.
CRITICAL RULES:
1. Keep placeholders like {name}, {count}, {city}, {number}, {sign}, {house}, etc. EXACTLY intact.
2. Keep HTML tags and markdown intact.
3. Return a single JSON object where the keys are the EXACT Portuguese input strings, and the values are the ${languageNames[lang]} translations.

Portuguese strings:
${JSON.stringify(batch, null, 2)}`;

  let attempts = 0;
  while (attempts < 5) {
    attempts++;
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const parsed = JSON.parse(res.text || '{}');
      return parsed;
    } catch (err: any) {
      console.warn(`Attempt ${attempts} failed for ${lang}:`, err?.message || err);
      // Wait 7 seconds if rate limit or quota
      await new Promise(r => setTimeout(r, 7000));
    }
  }
  return {};
}

async function translateLang(lang: 'en' | 'es' | 'de' | 'fr', texts: string[]) {
  if (texts.length === 0) return {};
  console.log(`Translating ${texts.length} items for ${lang}...`);

  const result: Record<string, string> = {};
  const batchSize = 60; // 60 items per batch to avoid rate limits and keep JSON small

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    console.log(`Batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(texts.length / batchSize)} for ${lang}...`);

    const batchResult = await translateBatchWithRetry(lang, batch);
    Object.assign(result, batchResult);

    // Wait 2 seconds between batches to stay under RPM limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`Completed ${Object.keys(result).length} translations for ${lang}!`);
  return result;
}

async function main() {
  const missingMap: MissingMap = JSON.parse(fs.readFileSync('missing-translations-map.json', 'utf8'));
  const allTexts = Object.keys(missingMap);

  const missingByLang: Record<'en' | 'es' | 'de' | 'fr', string[]> = {
    en: [], es: [], de: [], fr: []
  };

  allTexts.forEach(text => {
    if (missingMap[text].en) missingByLang.en.push(text);
    if (missingMap[text].es) missingByLang.es.push(text);
    if (missingMap[text].de) missingByLang.de.push(text);
    if (missingMap[text].fr) missingByLang.fr.push(text);
  });

  console.log(`Missing counts: EN=${missingByLang.en.length}, ES=${missingByLang.es.length}, DE=${missingByLang.de.length}, FR=${missingByLang.fr.length}`);

  const output: Record<string, Record<string, string>> = { en: {}, es: {}, de: {}, fr: {} };

  const langs: ('en' | 'es' | 'de' | 'fr')[] = ['en', 'es', 'de', 'fr'];
  for (const lang of langs) {
    output[lang] = await translateLang(lang, missingByLang[lang]);
  }

  fs.writeFileSync('audit-translations-output.json', JSON.stringify(output, null, 2));
  console.log("SUCCESS! Wrote all translations to audit-translations-output.json");
}

main().catch(console.error);

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const languageNames = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French'
};

async function translateBatch(lang: 'en' | 'es' | 'de' | 'fr', batch: string[]): Promise<Record<string, string>> {
  const prompt = `You are a professional translator for a spiritual astrology, tarot, and numerology app.
Translate these Portuguese strings into natural ${languageNames[lang]}.
CRITICAL:
1. Keep placeholders ({name}, {count}, {city}, etc.) EXACTLY unchanged.
2. Return ONLY a single valid JSON object mapping exact Portuguese strings to ${languageNames[lang]} translations.

Portuguese strings:
${JSON.stringify(batch)}`;

  let retries = 0;
  while (retries < 5) {
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      const parsed = JSON.parse(res.text || '{}');
      return parsed;
    } catch (err: any) {
      retries++;
      console.warn(`Retry ${retries}/5 for ${lang}:`, err?.message || err);
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  return {};
}

async function main() {
  const missingMap: Record<string, any> = JSON.parse(fs.readFileSync('missing-translations-map.json', 'utf8'));
  const allKeys = Object.keys(missingMap);
  console.log(`Translating ${allKeys.length} strings across en, es, de, fr...`);

  let output: Record<string, Record<string, string>> = { en: {}, es: {}, de: {}, fr: {} };
  if (fs.existsSync('audit-translations-output.json')) {
    try {
      output = JSON.parse(fs.readFileSync('audit-translations-output.json', 'utf8'));
    } catch {}
  }

  const batchSize = 50;

  for (const lang of ['en', 'es', 'de', 'fr'] as const) {
    if (!output[lang]) output[lang] = {};
    const uncompleteKeys = allKeys.filter(k => !output[lang][k]);
    console.log(`Language ${lang}: ${uncompleteKeys.length} keys remaining...`);

    for (let i = 0; i < uncompleteKeys.length; i += batchSize) {
      const batch = uncompleteKeys.slice(i, i + batchSize);
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(uncompleteKeys.length / batchSize)} for ${lang}...`);
      const res = await translateBatch(lang, batch);
      Object.assign(output[lang], res);
      
      // Save incrementally after every batch!
      fs.writeFileSync('audit-translations-output.json', JSON.stringify(output, null, 2));
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log('SUCCESS! Finished translating all keys!');
}

main().catch(console.error);

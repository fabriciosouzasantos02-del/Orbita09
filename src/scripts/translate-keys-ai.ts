import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GEMINI_API_KEY environment variable is not defined.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  console.log('🔮 Loading parsed portal translations...');
  const portalTrans = JSON.parse(fs.readFileSync('src/scripts/parsed-portal-translations.json', 'utf8'));
  const resolvedTrans = JSON.parse(fs.readFileSync('src/scripts/resolved-portal-translations.json', 'utf8'));
  
  const keys = Object.keys(portalTrans.en);
  console.log(`Total keys to process: ${keys.length}`);

  const missingFrKeys = keys.filter(k => !resolvedTrans.fr[k]);
  const missingDeKeys = keys.filter(k => !resolvedTrans.de[k]);
  
  console.log(`Keys missing French: ${missingFrKeys.length}`);
  console.log(`Keys missing German: ${missingDeKeys.length}`);
  
  if (missingFrKeys.length === 0 && missingDeKeys.length === 0) {
    console.log('✅ No keys missing translations!');
    return;
  }

  // We will process in chunks of 40 keys to be safe and accurate
  const chunkSize = 40;
  const missingKeysToProcess = Array.from(new Set([...missingFrKeys, ...missingDeKeys]));
  
  console.log(`Processing ${missingKeysToProcess.length} unique missing keys in chunks...`);
  
  for (let i = 0; i < missingKeysToProcess.length; i += chunkSize) {
    const chunk = missingKeysToProcess.slice(i, i + chunkSize);
    console.log(`\n📦 Processing chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(missingKeysToProcess.length / chunkSize)} (${chunk.length} keys)...`);
    
    const chunkData = chunk.map(k => ({
      pt: k,
      en: portalTrans.en[k] || '',
      es: portalTrans.es[k] || ''
    }));

    const prompt = `You are an expert translator specializing in esoteric topics (Astrology, Horoscope, Tarot, Numerology, Dreams, Subconscious, etc.).
Translate the following Portuguese (pt) keys into highly polished French (fr) and German (de).
I will provide the English (en) and Spanish (es) translations for context, which you should use to understand the exact meaning and tone.

Return a JSON array of objects with this EXACT structure:
[
  {
    "pt": "original Portuguese key",
    "fr": "French translation",
    "de": "German translation"
  },
  ...
]

Do not return any markdown block other than the JSON itself. Make sure your translation matches the exact tone, esoteric vocabulary, and is eye-safe and polished. Keep any placeholder characters, styling, and quotes exactly intact (e.g. if there's markdown like ** or strong tags, keep them exactly).

Here are the keys:
${JSON.stringify(chunkData, null, 2)}
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const translatedChunk = JSON.parse(responseText);

      if (Array.isArray(translatedChunk)) {
        for (const item of translatedChunk) {
          if (item.pt) {
            if (item.fr) resolvedTrans.fr[item.pt] = item.fr;
            if (item.de) resolvedTrans.de[item.pt] = item.de;
          }
        }
        console.log(`✅ Chunk processed successfully. Saved translations.`);
        // Save incrementally
        fs.writeFileSync('src/scripts/resolved-portal-translations.json', JSON.stringify(resolvedTrans, null, 2));
      } else {
        console.error('❌ Error: Response was not a JSON array.');
      }
    } catch (err) {
      console.error('❌ Error processing chunk:', err);
    }
  }

  console.log('\n🎉 Translation process complete!');
  const finalFrMissing = keys.filter(k => !resolvedTrans.fr[k]);
  const finalDeMissing = keys.filter(k => !resolvedTrans.de[k]);
  console.log(`Final missing French keys: ${finalFrMissing.length}`);
  console.log(`Final missing German keys: ${finalDeMissing.length}`);
}

run().catch(console.error);

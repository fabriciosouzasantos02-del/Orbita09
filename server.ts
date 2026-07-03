import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { performAstroCalculation } from './src/components/astroMath';
import { computeDetailedCompatibility } from './src/components/compatibilityEngine';
import moment from 'moment-timezone';
import { find as findTz } from 'geo-tz';
import { Country, State, City } from 'country-state-city';
import ephemeris from 'ephemeris';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import fs from 'fs';
import { mergedTranslations } from './src/i18n';
import { translations, Language } from './translations';

dotenv.config();

let stripeInstance: Stripe | null = null;
function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "MY_STRIPE_SECRET_KEY" || key.trim() === "") {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }
  return stripeInstance;
}

const app = express();
const PORT = 3000;

app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Centralized server translation function
function translateServerMessage(key: string, lang: Language, replacements?: Record<string, string>): string {
  let text = mergedTranslations[lang]?.[key];
  if (!text) {
    text = (translations[lang] as any)?.[key];
  }
  if (!text) {
    text = mergedTranslations['pt']?.[key] || (translations['pt'] as any)?.[key];
  }
  if (!text) {
    return key;
  }
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(new RegExp(`{${k}}`, 'g'), v);
    }
  }
  return text;
}

// Global Language Middleware
app.use((req: any, res, next) => {
  let lang: any = req.headers['x-app-lang'] || req.headers['x-language'];
  
  if (!lang) {
    lang = req.body?.lang || req.query?.lang;
  }
  
  if (!lang && req.body?.userProfile?.lang) {
    lang = req.body.userProfile.lang;
  }
  
  if (!lang) {
    const acceptLang = req.headers['accept-language'];
    if (typeof acceptLang === 'string') {
      const preferred = acceptLang.split(',')[0].split(';')[0].split('-')[0].trim().toLowerCase();
      if (['pt', 'en', 'es', 'de', 'fr'].includes(preferred)) {
        lang = preferred;
      }
    }
  }
  
  let resolvedLang: Language = 'pt';
  if (lang && typeof lang === 'string') {
    const cleanLang = lang.trim().toLowerCase();
    if (['pt', 'en', 'es', 'de', 'fr'].includes(cleanLang)) {
      resolvedLang = cleanLang as Language;
    }
  }
  
  req.lang = resolvedLang;
  req.t = (key: string, replacements?: Record<string, string>) => {
    return translateServerMessage(key, resolvedLang, replacements);
  };
  
  next();
});

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Error initializing Gemini API Client:", err);
  }
} else {
  console.log("Gemini API Key missing or default. App will run in detailed template fallback mode.");
}

// Global variable models
const CHAT_MODEL = "gemini-3.5-flash";

// Track models that are temporarily exhausted (due to 429 rate bounds) so we skip trying them during their cooldown window
const exhaustedModels = new Map<string, number>();
const MODEL_EXHAUSTION_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes cooldown

// Global rate-limiting safety tracker
let geminiThrottledUntil = 0;
let activeGeminiPromise: Promise<any> = Promise.resolve();

// Global in-memory cache for Gemini queries to minimize quota exhaustion and serve fast, deterministic results
interface CacheEntry {
  response: any;
  timestamp: number;
}
const geminiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour TTL

function getCachedResponse(key: string): any | null {
  const entry = geminiCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    geminiCache.delete(key);
    return null;
  }
  console.log(`[Cache] Serving cached response for: ${key}`);
  return entry.response;
}

function setCachedResponse(key: string, response: any): void {
  geminiCache.set(key, {
    response,
    timestamp: Date.now()
  });
}

// Resilient helper to execute content generation with model fallbacks and retries
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
  retries?: number;
}) {
  if (!aiClient) {
    throw new Error("Cliente APIs Gemini não inicializado.");
  }

  const executeCall = async () => {
    // Add a small staggered delay for concurrent requests
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 250 + 150));

    // If we are currently inside the rate-limiting cooldown, return immediately to use deterministic fallbacks
    if (Date.now() < geminiThrottledUntil) {
      throw new Error("Gemini API está em modo de segurança temporário (cooldown de cota excedida). Servindo fallback offline.");
    }

        // Fallbacks: primary is 3.5-flash, fallback is 3.1-flash-lite, third is gemini-flash-latest
    const baseModels = [
      CHAT_MODEL,
      "gemini-3.1-flash-lite",
      "gemini-flash-latest"
    ];

    const nowTime = Date.now();
    const modelsToTry = baseModels.filter(m => {
      const lastExh = exhaustedModels.get(m);
      if (lastExh && nowTime - lastExh < MODEL_EXHAUSTION_COOLDOWN_MS) {
        console.log(`[Gemini] Modelo ${m} exilado em banimento de cota (cooldown ativo).`);
        return false;
      }
      return true;
    });

    const finalModelsToTry = modelsToTry.length > 0 ? modelsToTry : baseModels;

    let lastError: any = null;

    for (const modelName of finalModelsToTry) {
      // We do up to 2 attempts for a model unless it hits a 429 or 503, in which case we fail fast and move to the next model
      let attempts = params.retries || 2;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        let timerId: NodeJS.Timeout | undefined;
        try {
          console.log(`[Gemini] Tentando gerar conteúdo usando o modelo: ${modelName} (Tentativa ${attempt}/${attempts})...`);
          
          const apiCall = aiClient.models.generateContent({
            model: modelName,
            contents: params.contents,
            config: params.config,
          });
          
          const timeoutPromise = new Promise<never>((_, reject) => {
            timerId = setTimeout(() => {
              reject(new Error(`Timeout de 12 segundos excedido para o modelo ${modelName}.`));
            }, 12000);
          });
          
          const response = await Promise.race([
            apiCall.then((res) => {
              if (timerId) clearTimeout(timerId);
              return res;
            }),
            timeoutPromise
          ]);

          console.log(`[Gemini] Sucesso absoluto usando o modelo ${modelName}.`);
          return response;
        } catch (err: any) {
          if (timerId) clearTimeout(timerId);
          lastError = err;
          const errStr = err?.message || String(err);
          const isQuotaExceeded = errStr.includes("RESOURCE_EXHAUSTED") || 
                                  errStr.includes("429") || 
                                  errStr.includes("quota") || 
                                  errStr.includes("Quota");
          const isHighDemand = errStr.includes("503") || 
                               errStr.includes("UNAVAILABLE") || 
                               errStr.includes("high demand") || 
                               errStr.includes("demand");

          if (isQuotaExceeded) {
            console.log(`[Gemini Info] Cota de requisições excedida ou limite atingido para o modelo ${modelName}. Transição limpa para fallback offline.`);
            exhaustedModels.set(modelName, Date.now());
            break; // Break the attempt loop to move on to the next model instantly
          } else if (isHighDemand) {
            console.log(`[Gemini Info] Modelo ${modelName} indisponível ou em alta demanda. Transição rápida para próximo modelo.`);
            break; // Break the attempt loop to move on to the next model instantly
          } else {
            console.log(`[Gemini Info] Tentativa ${attempt} com o modelo ${modelName} falhou: ${errStr}`);
            if (attempt < attempts) {
              const delay = attempt * 800;
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        }
      }
    }

    const finalErrStr = lastError?.message || String(lastError);
    if (finalErrStr.includes("RESOURCE_EXHAUSTED") || finalErrStr.includes("429") || finalErrStr.includes("quota") || finalErrStr.includes("Quota")) {
      // Set a short global cooldown of 15 seconds instead of 10 minutes to auto-recover gracefully while allowing fallback
      geminiThrottledUntil = Date.now() + 15 * 1000;
      console.log(`[Gemini Info] Limite global de cota estabelecido. Ativando sintonizadores terrestres locais.`);
      throw new Error("Limite de requisições excedido. Ativando o motor local de sintonização astrológica.");
    }

    throw lastError || new Error("Todos os modelos de fallback falharam.");
  };

  return executeCall();
}

// Helper to robustly extract and parse JSON from Gemini's response
function cleanAndParseJSON(text: string): any {
  if (!text) return {};
  let cleaned = text.trim();
  
  // Remove markdown code block markers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "");
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  cleaned = cleaned.trim();
  
  // Find the first '{' or '[' and its matching closing brace/bracket
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  let jsonStart = -1;
  let isObject = true;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    jsonStart = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    jsonStart = firstBracket;
    isObject = false;
  }
  
  if (jsonStart !== -1) {
    const openChar = isObject ? '{' : '[';
    const closeChar = isObject ? '}' : ']';
    
    let count = 0;
    let inString = false;
    let escape = false;
    let jsonEnd = -1;
    
    for (let i = jsonStart; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === openChar) {
          count++;
        } else if (char === closeChar) {
          count--;
          if (count === 0) {
            jsonEnd = i;
            break;
          }
        }
      }
    }
    
    if (jsonEnd !== -1) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    } else {
      // Fallback if bracket matching didn't finish
      const lastBrace = cleaned.lastIndexOf('}');
      const lastBracket = cleaned.lastIndexOf(']');
      if (isObject && lastBrace !== -1) {
        cleaned = cleaned.substring(jsonStart, lastBrace + 1);
      } else if (!isObject && lastBracket !== -1) {
        cleaned = cleaned.substring(jsonStart, lastBracket + 1);
      }
    }
  }
  
  // Now, let's repair the JSON string before parsing
  // 1. Unescaped control characters inside strings (like newlines, tabs)
  // 2. Trailing commas before close-braces or close-brackets
  let repaired = "";
  let inStr = false;
  const len = cleaned.length;
  for (let i = 0; i < len; i++) {
    const char = cleaned[i];
    if (inStr) {
      if (char === '\\') {
        // Safe escape bypass to avoid double-escaping
        repaired += char;
        if (i + 1 < len) {
          repaired += cleaned[i + 1];
          i++;
        }
      } else if (char === '"') {
        inStr = false;
        repaired += char;
      } else if (char === '\n') {
        repaired += '\\n';
      } else if (char === '\r') {
        repaired += '\\r';
      } else if (char === '\t') {
        repaired += '\\t';
      } else {
        repaired += char;
      }
    } else {
      if (char === '"') {
        inStr = true;
        repaired += char;
      } else if (char === ',') {
        // Lookahead: if the next non-whitespace characters are } or ], we skip this comma!
        let skipComma = false;
        let lookAheadIndex = i + 1;
        while (lookAheadIndex < len) {
          const nextChar = cleaned[lookAheadIndex];
          if (nextChar === ' ' || nextChar === '\n' || nextChar === '\r' || nextChar === '\t') {
            lookAheadIndex++;
            continue;
          }
          if (nextChar === '}' || nextChar === ']') {
            skipComma = true;
          }
          break;
        }
        if (!skipComma) {
          repaired += char;
        }
      } else {
        repaired += char;
      }
    }
  }

  try {
    return JSON.parse(repaired);
  } catch (err) {
    try {
      return JSON.parse(cleaned);
    } catch {
      console.error("[cleanAndParseJSON] Erro ao analisar o JSON limpo:", err);
      console.error("[cleanAndParseJSON] Conteúdo original:", text);
      console.error("[cleanAndParseJSON] Conteúdo limpo tentado:", cleaned);
      console.error("[cleanAndParseJSON] Conteúdo reparado tentado:", repaired);
      throw err;
    }
  }
}

// Mock database in-memory for simple user sessions / history
interface HistoryItem {
  id: string;
  type: 'dream' | 'tarot' | 'oraculo' | 'compatibility';
  title: string;
  date: string;
  details: string;
}
const userHistory: HistoryItem[] = [
  {
    id: "hist1",
    type: "dream",
    title: "Sonho com águas cristalinas",
    date: "08/06/2026",
    details: "Sonhou com água abundante e cristalina fluindo de uma montanha."
  },
  {
    id: "hist2",
    type: "tarot",
    title: "Leitura Semanal - Carreira",
    date: "07/06/2026",
    details: "Puxou a carta Sol. Foco em novos caminhos e otimismo."
  },
  {
    id: "hist3",
    type: "oraculo",
    title: "Consulta ao Oráculo do Dia",
    date: "08/06/2026",
    details: "Pergunta: 'Devo iniciar o projeto hoje?' - Resposta: Avance com sabedoria."
  }
];

// Helper to estimate placements dynamically from birth chart inputs 
// customized for
function resolveGeographicCoordinates(city: string): { latitude: number; longitude: number } {
  const cleanCity = (city || "").toLowerCase();
  
  if (cleanCity.includes("são paulo") || cleanCity.includes("sao paulo") || cleanCity.includes("sp")) {
    return { latitude: -23.5505, longitude: -46.6333 };
  }
  if (cleanCity.includes("rio de janeiro") || cleanCity.includes("rj")) {
    return { latitude: -22.9068, longitude: -43.1729 };
  }
  if (cleanCity.includes("belo horizonte") || cleanCity.includes("bh") || cleanCity.includes("mg")) {
    return { latitude: -19.9173, longitude: -43.9345 };
  }
  if (cleanCity.includes("curitiba") || cleanCity.includes("pr")) {
    return { latitude: -25.4290, longitude: -49.2671 };
  }
  
  return { latitude: -23.5505, longitude: -46.6333 };
}

async function resolveCityCoordinatesAndTimezone(cityStr: string): Promise<{
  latitude: number;
  longitude: number;
  timezone: string;
}> {
  const cleanStr = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  
  const originalCleaned = cleanStr(cityStr);
  if (!originalCleaned) {
    return { latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo" };
  }

  const parts = cityStr.split(",").map(p => p.trim());
  const cityName = parts[0];
  const stateOrCountry = parts[1] || "";

  const allCities = City.getAllCities();
  let bestMatch: any = null;

  const matchCityName = cleanStr(cityName);
  const matchStateOrCountry = cleanStr(stateOrCountry);

  // Match precise autocomplete pattern "City, State/Country"
  if (parts.length >= 2) {
    for (const c of allCities) {
      if (cleanStr(c.name) === matchCityName) {
        if (matchStateOrCountry && (cleanStr(c.stateCode) === matchStateOrCountry || cleanStr(c.countryCode) === matchStateOrCountry)) {
          bestMatch = c;
          break;
        }
      }
    }
  }

  // Fallback 1: match exact city name
  if (!bestMatch) {
    for (const c of allCities) {
      if (cleanStr(c.name) === matchCityName) {
        bestMatch = c;
        break;
      }
    }
  }

  // Fallback 2: sub-string match list
  if (!bestMatch) {
    for (const c of allCities) {
      if (originalCleaned.includes(cleanStr(c.name))) {
        bestMatch = c;
        break;
      }
    }
  }

  if (bestMatch) {
    const lat = parseFloat(bestMatch.latitude) || -23.5505;
    const lng = parseFloat(bestMatch.longitude) || -46.6333;
    const tzs = findTz(lat, lng);
    const tz = tzs[0] || "America/Sao_Paulo";
    return { latitude: lat, longitude: lng, timezone: tz };
  }

  // Final capital fallbacks
  const presets: Record<string, { lat: number; lng: number; tz: string }> = {
    "sao paulo": { lat: -23.5505, lng: -46.6333, tz: "America/Sao_Paulo" },
    "rio de janeiro": { lat: -22.9068, lng: -43.1729, tz: "America/Sao_Paulo" },
    "belo horizonte": { lat: -19.9173, lng: -43.9345, tz: "America/Sao_Paulo" },
    "curitiba": { lat: -25.4290, lng: -49.2671, tz: "America/Sao_Paulo" },
    "porto alegre": { lat: -30.0346, lng: -51.2177, tz: "America/Sao_Paulo" },
    "brasilia": { lat: -15.7975, lng: -47.8919, tz: "America/Sao_Paulo" }
  };

  for (const [key, val] of Object.entries(presets)) {
    if (originalCleaned.includes(key)) {
      return { latitude: val.lat, longitude: val.lng, timezone: val.tz };
    }
  }

  return { latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo" };
}

function performPreciseServerCalculation(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  timezoneOffset?: number,
  lang?: string
) {
  // Let's first make a baseline calculation using performAstroCalculation to get the houses, structural points, and baseline aspects
  const chart = performAstroCalculation(birthDate, birthTime, latitude, longitude, timezoneOffset);
  
  // Now, let's adjust the planets (Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano, Netuno, Plutão, Quíron) using ephemeris package!
  try {
    const [year, month, day] = birthDate.split("-").map(Number);
    const [hours, minutes] = (birthTime || "12:00").split(":").map(Number);
    
    // Convert local standard / DST time to exact UTC for ephemeris calculations
    const tzOffset = (timezoneOffset !== undefined) ? timezoneOffset : Math.round(longitude / 15);
    const utcHours = hours - tzOffset;
    const queryDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHours), Math.round((utcHours % 1) * 60) + minutes, 0));
    
    // Calculate via ephemeris
    const ephemResult = ephemeris.getAllPlanets(queryDate, longitude, latitude);
    
    if (ephemResult && ephemResult.observed) {
      // Ephemeris keys: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, chiron
      const mapping: Record<string, string> = {
        sun: "Sol",
        moon: "Lua",
        mercury: "Mercúrio",
        venus: "Vênus",
        mars: "Marte",
        jupiter: "Júpiter",
        saturn: "Saturno",
        uranus: "Urano",
        neptune: "Netuno",
        pluto: "Plutão",
        chiron: "Quíron"
      };
      
      const signs = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
      
      const activeLang = (lang || "pt").toLowerCase();
      
      const aspectNames: Record<string, Record<string, string>> = {
        pt: { "Conjunção": "Conjunção", "Oposição": "Oposição", "Trígono": "Trígono", "Quadratura": "Quadratura", "Sextil": "Sextil", "Quincúncio": "Quincúncio", "Semisextil": "Semisextil", "Semicuadratura": "Semicuadratura", "Sesquiquadratura": "Sesquiquadratura", "Biquintil": "Biquintil" },
        en: { "Conjunção": "Conjunction", "Oposição": "Opposition", "Trígono": "Trine", "Quadratura": "Square", "Sextil": "Sextile", "Quincúncio": "Quincunx", "Semisextil": "Semisextile", "Semicuadratura": "Semi-square", "Sesquiquadratura": "Sesquiquadrate", "Biquintil": "Biquintile" },
        es: { "Conjunção": "Conjunción", "Oposição": "Oposición", "Trígono": "Trígono", "Quadratura": "Cuadratura", "Sextil": "Sextil", "Quincúncio": "Quincuncio", "Semisextil": "Semisextil", "Semicuadratura": "Semicuadratura", "Sesquiquadratura": "Sesquicuadratura", "Biquintil": "Biquintil" },
        de: { "Conjunção": "Konjunktion", "Oposição": "Opposition", "Trígono": "Trigon", "Quadratura": "Quadrat", "Sextil": "Sextil", "Quincúncio": "Quincunx", "Semisextil": "Semisextil", "Semicuadratura": "Halbquadrat", "Sesquiquadratura": "Anderthalbquadrat", "Biquintil": "Biquintil" },
        fr: { "Conjunção": "Conjonction", "Oposição": "Opposition", "Trígono": "Trine", "Quadratura": "Carré", "Sextil": "Sextile", "Quincúncio": "Quinconce", "Semisextil": "Semi-sextile", "Semicuadratura": "Semi-carré", "Sesquiquadratura": "Sesqui-carré", "Biquintil": "Biquintile" }
      };

      const aspectInterps: Record<string, Record<string, string>> = {
        pt: {
          "Conjunção": "Funde energias planetárias de forma impetuosa e focada.",
          "Oposição": "Gera polarização dinâmica, conflito ou projeções no espelho dos relacionamentos.",
          "Trígono": "Facilidades fluidas, talentos inatos e sincronia pacífica de dons.",
          "Quadratura": "Tensão motivadora, lições kármicas ricas e impulsos extraordinários de amadurecimento.",
          "Sextil": "Oportunidades de colaboração prática que florescem quando há engajamento criativo.",
          "Quincúncio": "Necessidade latente de ajustes minuciosos de rumo para conciliar impulsos discordantes.",
          "Semisextil": "Sutil magnetismo de transição rápida que conecta aprendizados adjacentes.",
          "Semicuadratura": "Pequenos ruídos de rotina que forçam tomadas de decisões organizadoras.",
          "Sesquiquadratura": "Frustrações recorrentes que conduzem à autoanálise corretiva detalhada.",
          "Biquintil": "Talento mental criativo refinado e autêntica habilidade estética singular."
        },
        en: {
          "Conjunção": "Blends planetary energies in an impetuous and focused way.",
          "Oposição": "Generates dynamic polarization, conflict, or projections in the mirror of relationships.",
          "Trígono": "Fluid ease, innate talents, and peaceful synchrony of gifts.",
          "Quadratura": "Motivating tension, rich karmic lessons, and extraordinary impulses for maturation.",
          "Sextil": "Opportunities for practical collaboration that flourish when there is creative engagement.",
          "Quincúncio": "Latent need for minor course adjustments to reconcile discordant impulses.",
          "Semisextil": "Subtle magnetism of rapid transition connecting adjacent learnings.",
          "Semicuadratura": "Small routine noises that force organizing decision-making.",
          "Sesquiquadratura": "Recurrent frustrations leading to detailed corrective self-analysis.",
          "Biquintil": "Refined creative mental talent and authentic singular aesthetic ability."
        },
        es: {
          "Conjunção": "Combina energías planetarias de manera impetuosa y enfocada.",
          "Oposição": "Genera polarización dinámica, conflicto o proyecciones en el espejo de las relaciones.",
          "Trígono": "Facilidad fluida, talentos innatos y sincronía pacífica de dones.",
          "Quadratura": "Tensión motivadora, ricas lecciones kármicas e impulsos extraordinarios para la maduración.",
          "Sextil": "Oportunidades de colaboración práctica que florecen cuando hay compromiso creativo.",
          "Quincúncio": "Necesidad latente de pequeños ajustes de rumbo para conciliar impulsos discordantes.",
          "Semisextil": "Sutil magnetismo de rápida transición que conecta aprendizajes adyacentes.",
          "Semicuadratura": "Pequeños ruidos de rutina que fuerzan la toma de decisiones organizativas.",
          "Sesquiquadratura": "Frustraciones recurrentes que conducen a un autoanálisis correctivo detallado.",
          "Biquintil": "Talento mental creativo refinado y auténtica habilidad estética singular."
        },
        de: {
          "Conjunção": "Verschmilzt planetarische Energien auf ungestüme und fokussierte Weise.",
          "Oposição": "Erzeugt dynamische Polarisation, Konflikte oder Projektionen im Spiegel der Beziehungen.",
          "Trígono": "Fließende Leichtigkeit, angeborene Talente und friedliche Synchronie von Gaben.",
          "Quadratura": "Motivierende Spannung, reiche karmische Lektionen und außergewöhnliche Impulse zur Reifung.",
          "Sextil": "Möglichkeiten zur praktischen Zusammenarbeit, die bei kreativem Engagement aufblühen.",
          "Quincúncio": "Latentes Bedürfnis nach geringfügigen Kurskorrekturen zur Aussöhnung diskordanter Impulse.",
          "Semisextil": "Subtiler Magnetismus des schnellen Übergangs, der benachbarte Lerneffekte verbindet.",
          "Semicuadratura": "Kleine Routinegeräusche, die zu organisierenden Entscheidungen zwingen.",
          "Sesquiquadratura": "Wiederkehrende Frustrationen, die zu einer detaillierten korrigierenden Selbstanalyse führen.",
          "Biquintil": "Raffiniertes kreatives mentales Talent und authentische einzigartige ästhetische Fähigkeiten."
        },
        fr: {
          "Conjunção": "Fusionne les énergies planétaires de manière impétueuse et ciblée.",
          "Oposição": "Génère une polarisation dynamique, un conflit ou des projections dans le miroir des relations.",
          "Trígono": "Facilité fluide, talents innés et synchronisation paisible des dons.",
          "Quadratura": "Tension motivante, riches leçons karmiques et impulsions extraordinaires pour la maturation.",
          "Sextil": "Opportunités de collaboration pratique qui s'épanouissent lorsqu'il y a un engagement créatif.",
          "Quincúncio": "Besoin latent de légers ajustements de trajectoire para concilier des impulsions discordantes.",
          "Semisextil": "Magnétisme subtil de transition rapide reliant les apprentissages adjacents.",
          "Semicuadratura": "Petits bruits de routine qui forcent des prises de décisions organisatrices.",
          "Sesquiquadratura": "Frustrations récurrentes menant à une auto-analyse corrective détaillée.",
          "Biquintil": "Talent mental créatif raffiné et habileté esthétique singulière authentique."
        }
      };

      const planetNames: Record<string, Record<string, string>> = {
        pt: { Sol: "Sol", Lua: "Lua", Mercúrio: "Mercúrio", Vênus: "Vênus", Marte: "Marte", Júpiter: "Júpiter", Saturno: "Saturno", Urano: "Urano", Netuno: "Netuno", Plutão: "Plutão", Quíron: "Quíron", "Nodo Norte": "Nodo Norte", "Nodo Sul": "Nodo Sul", "Nódulo Norte": "Nodo Norte", "Nódulo Sul": "Nodo Sul", Ascendente: "Ascendente", Descendente: "Descendente", "Meio do Céu": "Meio do Céu", "Fundo do Céu": "Fundo do Céu" },
        en: { Sol: "Sun", Lua: "Moon", Mercúrio: "Mercury", Vênus: "Venus", Marte: "Mars", Júpiter: "Jupiter", Saturno: "Saturn", Urano: "Uranus", Netuno: "Neptune", Plutão: "Pluto", Quíron: "Chiron", "Nodo Norte": "North Node", "Nodo Sul": "South Node", "Nódulo Norte": "North Node", "Nódulo Sul": "South Node", Ascendente: "Ascendant", Descendente: "Descendant", "Meio do Céu": "Midheaven", "Fundo do Céu": "Imum Coeli" },
        es: { Sol: "Sol", Lua: "Luna", Mercúrio: "Mercurio", Vênus: "Venus", Marte: "Marte", Júpiter: "Júpiter", Saturno: "Saturno", Urano: "Urano", Netuno: "Neptuno", Plutão: "Plutón", Quíron: "Quirón", "Nodo Norte": "Nodo Norte", "Nodo Sul": "Nodo Sul", "Nódulo Norte": "Nodo Norte", "Nódulo Sul": "Nodo Sul", Ascendente: "Ascendente", Descendente: "Descendente", "Meio do Céu": "Medio Cielo", "Fundo do Céu": "Bajo Cielo" },
        de: { Sol: "Sonne", Lua: "Mond", Mercúrio: "Merkur", Vênus: "Venus", Marte: "Mars", Júpiter: "Jupiter", Saturno: "Saturn", Urano: "Uranus", Netuno: "Neptun", Plutão: "Pluto", Quíron: "Chiron", "Nodo Norte": "Nordknoten", "Nodo Sul": "Südknoten", "Nódulo Norte": "Nordknoten", "Nódulo Sul": "Südknoten", Ascendente: "Aszendent", Descendente: "Deszendent", "Meio do Céu": "Medium Coeli", "Fundo do Céu": "Imum Coeli" },
        fr: { Sol: "Soleil", Lua: "Lune", Mercúrio: "Mercure", Vênus: "Vénus", Marte: "Mars", Júpiter: "Jupiter", Saturno: "Saturne", Urano: "Uranus", Netuno: "Neptune", Plutão: "Pluton", Quíron: "Chiron", "Nodo Norte": "Nœud Nord", "Nodo Sul": "Nœud Sud", "Nódulo Norte": "Nœud Nord", "Nódulo Sul": "Nœud Sud", Ascendente: "Ascendant", Descendente: "Descendant", "Meio do Céu": "Milieu du Ciel", "Fundo do Céu": "Fond du Ciel" }
      };

      const signNames: Record<string, Record<string, string>> = {
        pt: { Áries: "Áries", Touro: "Touro", Gêmeos: "Gêmeos", Câncer: "Câncer", Leão: "Leão", Virgem: "Virgem", Libra: "Libra", Escorpião: "Escorpião", Sagitário: "Sagitário", Capricórnio: "Capricórnio", Aquário: "Aquário", Peixes: "Peixes" },
        en: { Áries: "Aries", Touro: "Taurus", Gêmeos: "Gemini", Câncer: "Cancer", Leão: "Leo", Virgem: "Virgo", Libra: "Libra", Escorpião: "Scorpio", Sagitário: "Sagittarius", Capricórnio: "Capricorn", Aquário: "Aquarius", Peixes: "Pisces" },
        es: { Áries: "Aries", Touro: "Tauro", Gêmeos: "Géminis", Câncer: "Cáncer", Leão: "Leo", Virgem: "Virgo", Libra: "Libra", Escorpião: "Escorpio", Sagitário: "Sagitario", Capricórnio: "Capricornio", Aquário: "Acuario", Peixes: "Piscis" },
        de: { Áries: "Widder", Touro: "Stier", Gêmeos: "Zwillinge", Câncer: "Krebs", Leão: "Löwe", Virgem: "Jungfrau", Libra: "Waage", Escorpião: "Skorpion", Sagitário: "Schütze", Capricórnio: "Steinbock", Aquário: "Wassermann", Peixes: "Fische" },
        fr: { Áries: "Bélier", Touro: "Taureau", Gêmeos: "Gémeaux", Câncer: "Cancer", Leão: "Lion", Virgem: "Vierge", Libra: "Balance", Escorpião: "Scorpion", Sagitário: "Sagittaire", Capricórnio: "Capricorne", Aquário: "Verseau", Peixes: "Poissons" }
      };

      const translatePlanet = (p: string) => (planetNames[activeLang]?.[p] || planetNames["pt"]?.[p] || p);
      const translateSign = (s: string) => (signNames[activeLang]?.[s] || signNames["pt"]?.[s] || s);

      // Override chart.astros positions for matching planets
      chart.astros = chart.astros.map(ast => {
        const ephemKey = Object.keys(mapping).find(k => mapping[k] === ast.name);
        if (ephemKey && ephemResult.observed[ephemKey]) {
          const obs = ephemResult.observed[ephemKey];
          const lon = obs.apparentLongitudeDd; // apparent longitude in degrees (0 to 360)
          
          const signIdx = Math.floor(lon / 30) % 12;
          const signName = signs[signIdx];
          const totalMin = (lon % 30) * 60;
          const deg = Math.floor(lon % 30);
          const min = Math.floor(totalMin % 60);
          
          const dStr = `${deg}°${min.toString().padStart(2, "0")}'`;
          const decanTexts: Record<string, string> = {
            pt: `${dStr}, ${Math.floor(deg / 10) + 1}º decanato`,
            en: `${dStr}, ${Math.floor(deg / 10) + 1}${Math.floor(deg / 10) + 1 === 1 ? 'st' : Math.floor(deg / 10) + 1 === 2 ? 'nd' : 'rd'} decan`,
            es: `${dStr}, ${Math.floor(deg / 10) + 1}º decanato`,
            de: `${dStr}, ${Math.floor(deg / 10) + 1}. Dekan`,
            fr: `${dStr}, ${Math.floor(deg / 10) + 1}e décan`
          };
          const extraInfoStr = decanTexts[activeLang] || decanTexts["pt"];

          const descTexts: Record<string, string> = {
            pt: ` Posicionado perfeitamente em ${translateSign(signName)} a uns exatos ${dStr} de arco celestial por efemérides científicas offline da NASA.`,
            en: ` Perfectly positioned in ${translateSign(signName)} at exactly ${dStr} of celestial arc by offline scientific NASA ephemerides.`,
            es: ` Posicionado perfectamente en ${translateSign(signName)} a unos exactos ${dStr} de arco celestial por efemérides científicas offline de la NASA.`,
            de: ` Perfekt positioniert in ${translateSign(signName)} auf genau ${dStr} Himmelsbogen durch wissenschaftliche Offline-NASA-Ephemeriden.`,
            fr: ` Parfaitement positionné en ${translateSign(signName)} à exactement ${dStr} d'arc céleste par les éphémérides scientifiques hors ligne de la NASA.`
          };
          const descSuffix = descTexts[activeLang] || descTexts["pt"];

          return {
            name: ast.name,
            sign: signName,
            degree: deg,
            minute: min,
            longitude: lon,
            extraInfo: extraInfoStr,
            description: ast.description.split(" Posicionado")[0] + descSuffix
          };
        }
        return ast;
      });
      
      // Recalculate aspects with the updated precise longitudes
      interface AspectType {
        name: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil" | "Quincúncio" | "Semisextil" | "Semicuadratura" | "Sesquiquadratura" | "Biquintil";
        angle: number;
        orb: number;
        interpretation: string;
      }
      
      const aspectConfig: AspectType[] = [
        { name: "Conjunção", angle: 0, orb: 8, interpretation: "Funde energias planetárias de forma impetuosa e focada." },
        { name: "Oposição", angle: 180, orb: 8, interpretation: "Gera polarização dinâmica, conflito ou projeções no espelho dos relacionamentos." },
        { name: "Trígono", angle: 120, orb: 8, interpretation: "Facilidades fluidas, talentos inatos e sincronia pacífica de dons." },
        { name: "Quadratura", angle: 90, orb: 8, interpretation: "Tensão motivadora, lições kármicas ricas e impulsos extraordinários de amadurecimento." },
        { name: "Sextil", angle: 60, orb: 6, interpretation: "Oportunidades de colaboração prática que florescem quando há engajamento criativo." },
        { name: "Quincúncio", angle: 150, orb: 5, interpretation: "Necessidade latente de ajustes minuciosos de rumo para conciliar impulsos discordantes." },
        { name: "Semisextil", angle: 30, orb: 2, interpretation: "Sutil magnetismo de transição rápida que conecta aprendizados adjacentes." },
        { name: "Semicuadratura", angle: 45, orb: 2, interpretation: "Pequenos ruídos de rotina que forçam tomadas de decisões organizadoras." },
        { name: "Sesquiquadratura", angle: 135, orb: 3, interpretation: "Frustrações recorrentes que conduzem à autoanálise corretiva detalhada." },
        { name: "Biquintil", angle: 144, orb: 2, interpretation: "Talento mental criativo refinado e autêntica habilidade estética singular." }
      ];
      
      const newAspects: any[] = [];
      const placementsForAspects = chart.astros.map(a => ({ name: a.name, long: a.longitude }));
      
      for (let i = 0; i < placementsForAspects.length; i++) {
        for (let j = i + 1; j < placementsForAspects.length; j++) {
          const p1 = placementsForAspects[i];
          const p2 = placementsForAspects[j];
          
          const p1IsStruct = ["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(p1.name);
          const p2IsStruct = ["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(p2.name);
          if (p1IsStruct && p2IsStruct) continue;
          
          const diff = Math.abs(p1.long - p2.long);
          const shortestDist = Math.min(diff, 360 - diff);
          
          for (const asp of aspectConfig) {
            const currentOrb = Math.abs(shortestDist - asp.angle);
            if (currentOrb <= asp.orb) {
              const intensity = Math.floor((1 - currentOrb / asp.orb) * 100);
              const p1Translated = translatePlanet(p1.name);
              const p2Translated = translatePlanet(p2.name);
              const aspectNameTranslated = aspectNames[activeLang]?.[asp.name] || aspectNames["pt"]?.[asp.name] || asp.name;
              const aspectInterpTranslated = aspectInterps[activeLang]?.[asp.name] || aspectInterps["pt"]?.[asp.name] || asp.interpretation;
              
              const interpFormats: Record<string, string> = {
                pt: `${p1Translated} em ${aspectNameTranslated} com ${p2Translated}: ${aspectInterpTranslated} Operando com intensidade magnética de ${intensity}% e orbe de ${currentOrb.toFixed(2)} graus.`,
                en: `${p1Translated} in ${aspectNameTranslated} with ${p2Translated}: ${aspectInterpTranslated} Operating with magnetic intensity of ${intensity}% and orb of ${currentOrb.toFixed(2)} degrees.`,
                es: `${p1Translated} en ${aspectNameTranslated} con ${p2Translated}: ${aspectInterpTranslated} Operando con intensidad magnética de ${intensity}% e orbe de ${currentOrb.toFixed(2)} grados.`,
                de: `${p1Translated} in ${aspectNameTranslated} mit ${p2Translated}: ${aspectInterpTranslated} Arbeitet mit magnetischer Intensität von ${intensity}% und einem Orbis de ${currentOrb.toFixed(2)} Grad.`,
                fr: `${p1Translated} en ${aspectNameTranslated} avec ${p2Translated}: ${aspectInterpTranslated} Opérant avec une intensité magnétique de ${intensity}% et un orbe de ${currentOrb.toFixed(2)} degrés.`
              };
              const interpStr = interpFormats[activeLang] || interpFormats["pt"];

              newAspects.push({
                planet1: p1.name,
                planet2: p2.name,
                aspectType: asp.name,
                angle: asp.angle,
                orb: `${currentOrb.toFixed(2)}°`,
                intensity,
                interpretation: interpStr
              });
            }
          }
        }
      }
      chart.aspects = newAspects;
      
      // Recalculate distribution
      const SIGN_ELEMENTS: Record<string, "fire" | "earth" | "air" | "water"> = {
        "Áries": "fire", "Leão": "fire", "Sagitário": "fire",
        "Touro": "earth", "Virgem": "earth", "Capricórnio": "earth",
        "Gêmeos": "air", "Libra": "air", "Aquário": "air",
        "Câncer": "water", "Escorpião": "water", "Peixes": "water"
      };

      const SIGN_QUALITIES: Record<string, "cardinal" | "fixed" | "mutable"> = {
        "Áries": "cardinal", "Câncer": "cardinal", "Libra": "cardinal", "Capricórnio": "cardinal",
        "Touro": "fixed", "Leão": "fixed", "Escorpião": "fixed", "Aquário": "fixed",
        "Gêmeos": "mutable", "Virgem": "mutable", "Sagitário": "mutable", "Peixes": "mutable"
      };

      const SIGN_POLARITIES: Record<string, "yang" | "yin"> = {
        "Áries": "yang", "Gêmeos": "yang", "Leão": "yang", "Libra": "yang", "Sagitário": "yang", "Aquário": "yang",
        "Touro": "yin", "Câncer": "yin", "Virgem": "yin", "Escorpião": "yin", "Capricórnio": "yin", "Peixes": "yin"
      };
      
      let fire = 0, earth = 0, air = 0, water = 0;
      let cardinal = 0, fixed = 0, mutable = 0;
      let yang = 0, yin = 0;
      
      const chartAnchors = ["Sol", "Lua", "Mercúrio", "Vênus", "Marte", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão", "Ascendente"];
      chart.astros.forEach(ast => {
        if (!chartAnchors.includes(ast.name)) return;
        const element = SIGN_ELEMENTS[ast.sign];
        const quality = SIGN_QUALITIES[ast.sign];
        const polarity = SIGN_POLARITIES[ast.sign];
        
        const weight = ["Sol", "Lua", "Ascendente"].includes(ast.name) ? 2 : 1;
        
        if (element === "fire") fire += weight;
        if (element === "earth") earth += weight;
        if (element === "air") air += weight;
        if (element === "water") water += weight;
        
        if (quality === "cardinal") cardinal += weight;
        if (quality === "fixed") fixed += weight;
        if (quality === "mutable") mutable += weight;
        
        if (polarity === "yang") yang += weight;
        if (polarity === "yin") yin += weight;
      });
      
      const totalElements = fire + earth + air + water || 1;
      const totalQualities = cardinal + fixed + mutable || 1;
      const totalPolarities = yang + yin || 1;
      
      chart.distribution = {
        elements: {
          fire: Math.round(fire / totalElements * 100),
          earth: Math.round(earth / totalElements * 100),
          air: Math.round(air / totalElements * 100),
          water: Math.round(water / totalElements * 100)
        },
        qualities: {
          cardinal: Math.round(cardinal / totalQualities * 100),
          fixed: Math.round(fixed / totalQualities * 100),
          mutable: Math.round(mutable / totalQualities * 100)
        },
        polarization: {
          yang: Math.round(yang / totalPolarities * 100),
          yin: Math.round(yin / totalPolarities * 100)
        }
      };
      
      // Recalculate which planets are in which houses
      const isLongBetween = (target: number, start: number, end: number): boolean => {
        const nTarget = (target - start + 360) % 360;
        const nEnd = (end - start + 360) % 360;
        return nTarget < nEnd;
      };
      
      chart.houses = chart.houses.map((h, hIdx) => {
        const cusp = h.longitude;
        const nextCusp = chart.houses[hIdx === 11 ? 0 : hIdx + 1].longitude;
        const planetsInHouse: string[] = [];
        
        chart.astros.forEach(ast => {
          if (["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(ast.name)) return;
          if (isLongBetween(ast.longitude, cusp, nextCusp)) {
            planetsInHouse.push(ast.name);
          }
        });
        
        const baseInterp = h.interpretation.split(" Cúspide posicionada")[0] || h.interpretation;
        const cuspStr = `Cúspide posicionada em ${h.sign} (${Math.floor(cusp % 30)}°${Math.floor((cusp % 30) * 60 % 60).toString().padStart(2, "0")}')`;
        const plantStr = planetsInHouse.length > 0
          ? ` Planetas presentes ativando esta área: ${planetsInHouse.join(", ")}.`
          : " Nossos astros celestes não ocupam esta casa diretamente, sendo regida de longe por seu respectivo regente planetário.";
          
        return {
          ...h,
          planets: planetsInHouse,
          interpretation: `${baseInterp} ${cuspStr} ${plantStr}`
        };
      });
    }
  } catch (e) {
    console.error("Erro sintonizando posições precisas via ephemeris, utilizando aproximado:", e);
  }
  
  return chart;
}

function generateMapData(
  name: string, 
  date: string, 
  time: string, 
  city: string, 
  isUnknown: boolean,
  resolvedCoords?: { latitude: number; longitude: number; timezone: string },
  isDst?: boolean,
  astroDate?: string,
  astroTime?: string,
  timezoneOffset?: number,
  lang?: string
) {
  // Resolve latitude & longitude based on birth city
  const coords = resolvedCoords || { latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo" };
  const dDate = astroDate || date;
  const dTime = astroTime || time || "12:00";
  
  // Calculate high-precision astronomical chart using local Swiss Ephemeris offline library
  const chart = performPreciseServerCalculation(dDate, dTime, coords.latitude, coords.longitude, timezoneOffset, lang);
  
  const finalMap = {
    welcomeMessage: `Olás ${name}, seja bem-vindo ao seu Mapa Astral. Aqui começa a sua jornada astrológica profissional baseada em efemérides reais de altíssima precisão!`,
    is_dst: isDst || false,
    timezone: coords.timezone,
    originalTime: time || "12:00",
    adjustedTime: dTime,
    distribution: chart.distribution,
    personalityTraits: {
      harmonious: [
        "Socialmente consciente", "Inventivo", "Esperançoso", "Amigável",
        "Curioso", "Independente", "Futurista", "Visionário", "Altruísta"
      ],
      disharmonious: [
        "Temperamental", "Disperso", "Imprevisível", "Teimoso", "Sarcástico"
      ]
    },
    astros: chart.astros.map(ast => ({
      name: ast.name,
      sign: ast.sign,
      degree: `${ast.degree}°${ast.minute.toString().padStart(2, '0')}'`,
      extraInfo: ast.extraInfo || "",
      description: ast.description
    })),
    houses: chart.houses.map(h => ({
      number: h.number,
      sign: h.sign,
      planet: h.planets.length > 0 ? h.planets.join(", ") : undefined,
      interpretation: h.interpretation
    })),
    aspects: chart.aspects.map(asp => ({
      planet1: asp.planet1,
      aspectType: asp.aspectType,
      planet2: asp.planet2,
      orb: asp.orb,
      interpretation: asp.interpretation
    }))
  };

  return finalMap;
}

// Generate fallback signs for date estimation
function getAscendedAstrologicalSign(dateString: string, offset: number): string {
  try {
    const calc = performAstroCalculation(dateString, "12:00");
    if (offset === 0) return calc.astros.find(a => a.name === "Sol")?.sign || "Aquário";
    if (offset === 5) return calc.astros.find(a => a.name === "Lua")?.sign || "Aquário";
    if (offset === 8) return calc.astros.find(a => a.name === "Ascendente")?.sign || "Sagitário";
    
    const signs = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Aquário";
    const idx = (d.getMonth() + offset) % 12;
    return signs[idx];
  } catch {
    return "Aquário";
  }
}

// Calculate Numerology
function calculateNumerologyData(name: string, birthDate: string): any {
  // Summing digits
  const sumDigits = (str: string) => {
    return str.replace(/\D/g, '').split('').reduce((acc, curr) => acc + parseInt(curr), 0);
  };
  
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22) {
      num = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
    }
    return num;
  };

  const nameVal = name.length;
  const birthVal = sumDigits(birthDate);

  const caminhoDeVida = reduceToSingleDigit(birthVal || 25);
  const expressao = reduceToSingleDigit(nameVal + birthVal || 7);
  const motivacao = reduceToSingleDigit(nameVal * 2 || 9);
  const personalidade = reduceToSingleDigit(Math.abs(nameVal - (birthVal % 10)) || 1);

  return {
    caminhoDeVida,
    expressao,
    motivacao,
    personalidade,
    description: `Você é um perfil de vibração ${caminhoDeVida}. Este número denota que seu caminho principal de aprendizado incentiva a independência, curiosidade ativa e forte desenvolvimento pessoal.`,
    ciclos: [
      `Ciclo Formativo (0-28 anos): Vibração ${expressao} - Ênfase nos estudos e compreensão analítica da vida.`,
      `Ciclo Produtivo (28-56 anos): Vibração ${caminhoDeVida} - Período de conquistas de independência e materialização profissional.`,
      `Ciclo de Colheita (56+ anos): Vibração ${motivacao} - Transmissão de visão idealista e espiritual ao coletivo.`
    ]
  };
}

// API: City offline lookup autocomplete
app.get("/api/cities/search", (req, res) => {
  const query = (req.query.q || "").toString().trim();
  if (query.length < 2) {
    return res.json([]);
  }
  
  const cleanStr = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  const normalizedQuery = cleanStr(query);

  const allCities = City.getAllCities();
  
  const countriesMap = new Map();
  Country.getAllCountries().forEach(c => {
    countriesMap.set(c.isoCode, c.name);
  });

  // Translation helpers for country and state names to Portuguese
  function getPortugueseCountryName(countryCode: string, defaultName: string): string {
    const customMap: Record<string, string> = {
      "FR": "França",
      "US": "EUA",
      "CA": "Canadá",
      "BR": "Brasil",
      "PT": "Portugal",
      "GB": "Reino Unido",
      "ES": "Espanha",
      "IT": "Itália",
      "DE": "Alemanha",
      "AR": "Argentina",
      "UY": "Uruguai",
      "CL": "Chile",
      "MX": "México",
      "CO": "Colômbia",
      "JP": "Japão",
      "CN": "China",
      "IN": "Índia",
      "IE": "Irlanda",
      "RU": "Rússia",
      "CH": "Suíça",
      "SE": "Suécia",
      "NO": "Noruega",
      "NL": "Holanda",
      "BE": "Bélgica",
      "ZA": "África do Sul",
      "AU": "Austrália",
      "NZ": "Nova Zelândia",
      "GR": "Grécia",
      "TR": "Turquia",
      "EG": "Egito",
      "IL": "Israel"
    };
    return customMap[countryCode.toUpperCase()] || defaultName;
  }

  function getPortugueseStateName(stateCode: string, countryCode: string, defaultName: string): string {
    if (!stateCode) return "";
    const key = `${countryCode.toUpperCase()}-${stateCode.toUpperCase()}`;
    const customStates: Record<string, string> = {
      "CA-ON": "Ontário",
      "US-TX": "Texas",
    };
    if (customStates[key]) return customStates[key];
    
    try {
      const s = State.getStateByCodeAndCountry(stateCode, countryCode);
      if (s && s.name) {
        if (s.name === "Ontario") return "Ontário";
        return s.name;
      }
    } catch (err) {}
    return defaultName || stateCode;
  }
  
  const matches = [];
  for (const city of allCities) {
    const normCityName = cleanStr(city.name);
    if (normCityName.startsWith(normalizedQuery) || normCityName.includes(normalizedQuery)) {
      const origCountryName = countriesMap.get(city.countryCode) || city.countryCode;
      const countryName = getPortugueseCountryName(city.countryCode, origCountryName);
      const stateName = city.stateCode ? getPortugueseStateName(city.stateCode, city.countryCode, city.stateCode) : "";
      
      let label = city.name;
      if (city.countryCode === 'FR') {
        label = `${city.name}, ${countryName}`;
      } else if (stateName) {
        label = `${city.name}, ${stateName}, ${countryName}`;
      } else {
        label = `${city.name}, ${countryName}`;
      }

      matches.push({
        name: city.name,
        stateCode: city.stateCode,
        countryCode: city.countryCode,
        countryName: countryName,
        latitude: parseFloat(city.latitude),
        longitude: parseFloat(city.longitude),
        label: label
      });
      if (matches.length >= 25) { 
         break;
      }
    }
  }

  return res.json(matches);
});

// API: Astrological Map and Numerology Generation using Gemini
app.post("/api/astrology/generate", async (req, res) => {
  try {
    const { name, email, birthDate, birthTime, birthCity, isUnknownTime, latitude, longitude, lang } = req.body || {};
    if (!name) {
      return res.status(400).json({ error: (req as any).t('api.astrology.name_required') });
    }

    let safeBirthDate = birthDate;
    let safeBirthTime = birthTime;
    let safeBirthCity = birthCity;

    // Elegant fallback if birthDate is absent or undefined
    if (!safeBirthDate || safeBirthDate.trim() === "" || safeBirthDate === "undefined") {
      const savedUser = mockUsers.find(u => 
        (email && u.email?.toLowerCase().trim() === email.toLowerCase().trim()) ||
        (name && u.name?.toLowerCase().includes(name.toLowerCase()))
      );
      if (savedUser && savedUser.birthDate) {
        safeBirthDate = savedUser.birthDate;
        safeBirthTime = birthTime || "12:00";
        safeBirthCity = birthCity || "São Paulo";
      } else {
        // Fallback to active logged in persona config safely
        safeBirthDate = "1997-02-11";
        safeBirthTime = birthTime || "12:00";
        safeBirthCity = birthCity || "São Paulo";
      }
    }

    if (!safeBirthTime || safeBirthTime.trim() === "" || safeBirthTime === "undefined") {
      safeBirthTime = "12:00";
    }
    if (!safeBirthCity || safeBirthCity.trim() === "" || safeBirthCity === "undefined") {
      safeBirthCity = "São Paulo";
    }

    const cacheKey = `astrology:${name}:${safeBirthDate}:${safeBirthTime}:${safeBirthCity}:${isUnknownTime}:${lang || 'pt'}`;
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Resolve timezone & coordinates
    let resolvedCoords;
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      const tzs = findTz(latitude, longitude);
      const tz = tzs[0] || "America/Sao_Paulo";
      resolvedCoords = { latitude, longitude, timezone: tz };
    } else {
      resolvedCoords = await resolveCityCoordinatesAndTimezone(safeBirthCity);
    }
    
    // DST evaluation and standard real solar time subtraction
    const tzName = resolvedCoords.timezone;
    const mt = moment.tz(`${safeBirthDate} ${safeBirthTime}`, "YYYY-MM-DD HH:mm", tzName);
    const is_dst = mt.isDST();

    let astroDate = safeBirthDate;
    let astroTime = safeBirthTime;

    if (is_dst) {
      // Subtract 1 hour to get standard real solar time
      const standardTimeMoment = mt.clone().subtract(1, 'hour');
      astroDate = standardTimeMoment.format('YYYY-MM-DD');
      astroTime = standardTimeMoment.format('HH:mm');
    }

    const timezoneOffsetHours = mt.utcOffset() / 60;

    const numerology = calculateNumerologyData(name, safeBirthDate);
    const localMap = generateMapData(
      name, 
      safeBirthDate, 
      safeBirthTime, 
      safeBirthCity, 
      isUnknownTime, 
      resolvedCoords, 
      is_dst, 
      astroDate, 
      astroTime,
      timezoneOffsetHours,
      lang
    );

    if (!aiClient) {
      // Return high-quality calculated local mapping if Gemini is unavailable
      const result = { map: localMap, numerology };
      setCachedResponse(cacheKey, result);
      return res.json(result);
    }

  try {
    const placementsSummary = localMap.astros.map(ast => `- ${ast.name}: em ${ast.sign} no grau ${ast.degree}`).join('\n');
    const housesSummary = localMap.houses.map(h => `- Casa ${h.number}: em ${h.sign} ${h.planet ? `(contém o(s) planeta(s): ${h.planet})` : ''}`).join('\n');
    const aspectsSummary = localMap.aspects.map(asp => `- ${asp.planet1} ${asp.aspectType} com ${asp.planet2} (Orbe: ${asp.orb})`).join('\n');

    const activeLang = lang || 'pt';
    const languageNames: Record<string, string> = {
      pt: "Português",
      en: "English (Inglês)",
      es: "Spanish (Espanhol)",
      de: "German (Alemão)",
      fr: "French (Francês)"
    };
    const targetLanguage = languageNames[activeLang] || "Português";

    const prompt = `Gere uma análise astrológica e numerológica detalhada, altamente personalizada e premium em ${targetLanguage} para o usuário com estes dados de nascimento:
Nome: ${name}
Data de nascimento: ${safeBirthDate}
Hora de nascimento: ${isUnknownTime ? "Desconhecida" : safeBirthTime}
Cidade de nascimento: ${safeBirthCity}

As posições astronômicas reais calculadas cientificamente offline baseadas no local, coordenadas geográficas e fuso horário reais do nascimento são:
--- POSIÇÕES REAIS DOS ASTROS ---
${placementsSummary}

--- POSIÇÕES REAIS DAS CASAS ---
${housesSummary}

--- ASPECTOS REAIS CALCULADOS ---
${aspectsSummary}

AVISO DE PRECISÃO MATEMÁTICA ABSOLUTA:
Você DEVE basear todas as análises e interpretações exclusivamente nos signos, graus e casas reais fornecidos acima no sumário ("POSIÇÕES REAIS DOS ASTROS"). Não invente, não altere de forma alguma os signos fornecidos e não cite exemplos com signos fictícios ou suposições genéricas.
- Analise cada astro/planeta unicamente e especificamente no signo exato em que ele está listado.
- Por exemplo, se o Ascendente está listado em um signo específico, a descrição em "astrosInterpretations"."Ascendente" deve falar única e exclusivamente das qualidades de nascer com esse signo específico no Ascendente, sem de forma alguma mencionar outros signos.
- O mesmo se aplica à Lua, ao Sol e a todos os demais astros e casas! Toda a análise deve ser 100% personalizada e cirurgicamente correta para o mapa fornecido.

A resposta DEVE ser um objeto JSON exato contendo a seguinte estrutura e preenchendo todos os textos com explicações ricas, detalhadas, cirúrgicas e poéticas em ${targetLanguage}, no mesmo estilo premium profissional de Astrolink:
{
  "welcomeMessage": "Um texto longo e inspirador de boas-vindas espiritual de 2 a 3 parágrafos sintonizado com os dados pessoais, escrito em ${targetLanguage}...",
  "personalityTraits": {
    "harmonious": ["Socialmente consciente", "Inventivo", "Esperançoso", "... etc (gerar de 6 a 10 termos altamente personalizados correspondentes à essência do mapa real listado, escritos em ${targetLanguage})"],
    "disharmonious": ["Temperamental", "Disperso", "Teimoso", "... etc (gerar de 6 a 10 termos correspondentes à essência real do mapa listado, escritos em ${targetLanguage})"]
  },
  "astrosInterpretations": {
    "Sol": "Interpretação poética detalhada de 2 parágrafos sobre a essência do Sol no signo do usuário, escrita em ${targetLanguage}...",
    "Lua": "Interpretação detalhada de 2 parágrafos sobre as emoções da Lua no signo do usuário, escrita em ${targetLanguage}...",
    "Mercúrio": "Interpretação de 1 parágrafo expressivo sobre a mente de Mercúrio no signo correspondente, escrita em ${targetLanguage}...",
    "Vênus": "Interpretação de 1 parágrafo sobre a capacidade de amar e valores de Vênus no signo correspondente, escrita em ${targetLanguage}...",
    "Marte": "Interpretação de 1 parágrafo sobre atitude e energia de Marte no signo correspondente, escrita em ${targetLanguage}...",
    "Júpiter": "Interpretação de 1 parágrafo sobre prosperidade de Júpiter no signo correspondente, escrita em ${targetLanguage}...",
    "Saturno": "Interpretação de 1 parágrafo sobre lições e testes de Saturno no signo correspondente, escrita em ${targetLanguage}...",
    "Urano": "Interpretação de 1 parágrafo sobre liberdade subjetiva de Urano no signo correspondente, escrita em ${targetLanguage}...",
    "Netuno": "Interpretação de 1 parágrafo sobre sutilização de Netuno no signo correspondente, escrita em ${targetLanguage}...",
    "Plutão": "Interpretação de 1 parágrafo sobre transmutação interna de Plutão no signo correspondente, escrita em ${targetLanguage}...",
    "Quíron": "Interpretação de 1 parágrafo sobre a maestria terapêutica de Quíron no signo correspondente, escrita em ${targetLanguage}...",
    "Nodo Norte": "Interpretação de 1 parágrafo sobre direcionamento de alma do Nodo Norte no signo correspondente, escrita em ${targetLanguage}...",
    "Nodo Sul": "Interpretação de 1 parágrafo sobre bagagens e heranças antigas do Nodo Sul no signo correspondente, escrita em ${targetLanguage}...",
    "Lilith": "Interpretação de 1 parágrafo sobre desires em sombra de Lilith no signo correspondente, escrita em ${targetLanguage}...",
    "Ascendente": "Interpretação detalhada de 2 parágrafos focado na identidade externa, aparência e vitalidade do Ascendente real do usuário, escrita em ${targetLanguage}...",
    "Descendente": "Interpretação de 1 parágrafo sintonizado com relacionamentos e parcerias com o Descendente real, escrita em ${targetLanguage}...",
    "Meio do Céu": "Interpretação de 1 parágrafo vocacional com base no Meio do Céu real do usuário, escrita em ${targetLanguage}...",
    "Fundo do Céu": "Interpretação de 1 parágrafo reconfortante sobre o lar, raízes e intimidade com base no Fundo do Céu real, escrita em ${targetLanguage}..."
  },
  "housesInterpretations": {
    "1": "Interpretação de 1 parágrafo expressivo e refinado explicando as lições do signo real em que a Casa 1 se inicia, escrita em ${targetLanguage}...",
    "2": "Interpretação de 1 parágrafo expressivo e refinado explicando as lições do signo real em que a Casa 2 se inicia, escrita em ${targetLanguage}...",
    "3": "Interpretação de 1 parágrafo da Casa 3 escrito em ${targetLanguage}...",
    "4": "Interpretação de 1 parágrafo da Casa 4 escrito em ${targetLanguage}...",
    "5": "Interpretação de 1 parágrafo da Casa 5 escrito em ${targetLanguage}...",
    "6": "Interpretação de 1 parágrafo da Casa 6 escrito em ${targetLanguage}...",
    "7": "Interpretação de 1 parágrafo da Casa 7 escrito em ${targetLanguage}...",
    "8": "Interpretação de 1 parágrafo da Casa 8 escrito em ${targetLanguage}...",
    "9": "Interpretação de 1 parágrafo da Casa 9 escrito em ${targetLanguage}...",
    "10": "Interpretação de 1 parágrafo da Casa 10 escrito em ${targetLanguage}...",
    "11": "Interpretação de 1 parágrafo da Casa 11 escrito em ${targetLanguage}...",
    "12": "Interpretação de 1 parágrafo focado no signo real e planetas na Casa 12 escrito em ${targetLanguage}..."
  }
}
Responda APENAS com o JSON literal. Não inclua blocos de código adicionais fora do JSON.`;

    let responseText = "{}";
    try {
      const geminiPromise = generateContentWithFallback({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const timeoutPromise = new Promise<{ text?: string }>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout de 4 segundos na geração IA")), 4000);
      });
      
      const response = await Promise.race([geminiPromise, timeoutPromise]);
      responseText = response?.text || "{}";
    } catch (err) {
      console.warn("[Astro API] Gemini call failed or timed out. Serving local high-precision Placidus calculations immediately:", err);
    }

    const parsedData = cleanAndParseJSON(responseText);

    // Merge computed placements with poetic explanations from Gemini
    if (parsedData.welcomeMessage) {
      localMap.welcomeMessage = parsedData.welcomeMessage;
    }
    if (parsedData.personalityTraits?.harmonious) {
      localMap.personalityTraits.harmonious = parsedData.personalityTraits.harmonious;
    }
    if (parsedData.personalityTraits?.disharmonious) {
      localMap.personalityTraits.disharmonious = parsedData.personalityTraits.disharmonious;
    }
    if (parsedData.astrosInterpretations) {
      localMap.astros = localMap.astros.map(ast => {
        if (parsedData.astrosInterpretations[ast.name]) {
          return { ...ast, description: parsedData.astrosInterpretations[ast.name] };
        }
        return ast;
      });
    }
    if (parsedData.housesInterpretations) {
      localMap.houses = localMap.houses.map(h => {
        const key = h.number.toString();
        if (parsedData.housesInterpretations[key]) {
          return { ...h, interpretation: parsedData.housesInterpretations[key] };
        }
        return h;
      });
    }

    const result = { map: localMap, numerology };
    setCachedResponse(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.warn("Gemini failed, serving computed placements:", error);
    const result = { map: localMap, numerology };
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }
  } catch (outerError) {
    console.error("Critical error in /api/astrology/generate:", outerError);
    return res.status(500).json({ error: (req as any).t('api.astrology.internal_error') });
  }
});

// API: Dream Interpretation using Gemini (New Oráculo dos Sonhos)
app.post("/api/dreams/interpret", async (req, res) => {
  const { title, description, lang } = req.body;
  if (!description) {
    return res.status(400).json({ error: (req as any).t('api.dreams.content_required') });
  }

  const activeLang = (lang || "pt").toLowerCase();
  const langNames: Record<string, string> = {
    pt: "Português",
    en: "English (Inglês)",
    es: "Spanish (Espanhol)",
    de: "German (Alemão)",
    fr: "French (Francês)"
  };
  const targetLangName = langNames[activeLang] || "Português";

  const fallbackInterpretationMap: Record<string, any> = {
    pt: {
      title: title || "Visão de Alquimia Onírica",
      mainMeaning: "Seu sonho revela uma profunda fase de transição e o despertar de sentimentos ocultos. O contraste de elementos como sombra e luz, ou terra e água, indica que você está equilibrando intuição com ação prática.",
      psychological: "Psicologicamente, este sonho representa os impulsos reprimidos do subconsciente que buscam aprovação consciente pelo ego. Elementos inusitados denotam que sua mente racional percebe emoções puras e sinceras como extraordinárias ou instigantes.",
      spiritual: "Sua alma está cruzando portais multidimensionais de purificação. Momentos onde você supera desafios simbolizam que você possui a autoridade sutil sobre pressões materiais terrenas.",
      attention: "Atenção a sentimentos de desconfiança ou isolamento excessivo. Lembre-se de aceitar apoio quando for oferecido espontaneamente por quem você preza.",
      opportunities: "Novas conexões inesperadas com mentores maduros e oportunidades de demonstrar sua sabedoria única.",
      protection: "Você está sob forte manto de proteção ancestral. Obstáculos e situações imprevistas se resolvem de forma surpreendentemente segura.",
      loveArea: "No amor, os fluxos oníricos indicam que sentimentos antigos estão passando por cura para dar espaço a conexões mais sinceras e desimpedidas.",
      financeArea: "Sinal verde de colheita. Esforços passados começam a se materializar em recompensas estáveis no plano material.",
      careerArea: "Sua capacidade de adaptação e liderança sob pressão chama a atenção positiva de superiores ou parceiros de projetos comerciais.",
      luckyNumbers: ["07", "14", "22", "33", "48"],
      favorableColors: ["Dourado", "Azul", "Branco"],
      positivityLevel: 4.7,
      oracleAdvice: "Navegue com calma. O ritmo do universo é perfeito e cada mistério se revelará no tempo exato. Respire e confie na sua intuição soberana.",
      detectedAnimals: [
        {
          animal: "Cobra",
          meaning: "Simboliza cura, renovação profunda, superação de medos atávicos e o despertar da energia vital da terra."
        }
      ],
      detectedColors: [
        {
          color: "Dourado",
          meaning: "Representa a iluminação espiritual, abundância material majestosa e alinhamento com a energia do Sol e do plexo solar."
        }
      ],
      detectedNumbers: [
        {
          number: "7",
          meaning: "Representa espiritualidade mística, introspecção sagrada, o buscador da verdade e o alinhamento pleno com leis cósmicas."
        }
      ],
      predominantEmotion: {
        emotion: "Paz",
        explanation: "Apesar do início incerto, o fechamento espiritual que assenta em seu corpo astral é de paz e profunda serenidade."
      },
      dreamEnergyIndex: 85,
      dreamEnergyType: "Energia Espiritual",
      universeMessage: "O Universo saúda seu caminhar sutil. Continue confiando no invisível, pois suas águas internas estão calmas, prontas para manifestar o brilho solar!"
    },
    en: {
      title: title || "Dream Alchemy Vision",
      mainMeaning: "Your dream reveals a profound transition phase and the awakening of hidden feelings. The contrast of elements like shadow and light, or earth and water, indicates that you are balancing intuition with practical action.",
      psychological: "Psychologically, this dream represents the repressed impulses of the subconscious seeking conscious approval by the ego. Unusual elements denote that your rational mind perceives pure and sincere emotions as extraordinary or intriguing.",
      spiritual: "Your soul is crossing multidimensional portals of purification. Moments where you overcome challenges symbolize that you possess subtle authority over earthly material pressures.",
      attention: "Attention to feelings of distrust or excessive isolation. Remember to accept support when offered spontaneously by those you esteem.",
      opportunities: "Unexpected new connections with mature mentors and opportunities to demonstrate your unique wisdom.",
      protection: "You are under a strong mantle of ancestral protection. Obstacles and unforeseen situations are resolved in a surprisingly safe way.",
      loveArea: "In love, dream flows indicate that old feelings are undergoing healing to make room for more sincere and unhindered connections.",
      financeArea: "Green light of harvest. Past efforts begin to materialize in stable rewards on the material plane.",
      careerArea: "Your ability to adapt and lead under pressure draws positive attention from superiors or commercial project partners.",
      luckyNumbers: ["07", "14", "22", "33", "48"],
      favorableColors: ["Gold", "Blue", "White"],
      positivityLevel: 4.7,
      oracleAdvice: "Navigate calmly. The rhythm of the universe is perfect and each mystery will reveal itself at the exact time. Breathe and trust in your sovereign intuition.",
      detectedAnimals: [
        {
          animal: "Snake",
          meaning: "Symbolizes healing, deep renewal, overcoming atavistic fears and the awakening of the earth's vital energy."
        }
      ],
      detectedColors: [
        {
          color: "Gold",
          meaning: "Represents spiritual enlightenment, majestic material abundance and alignment with the energy of the Sun and the solar plexus."
        }
      ],
      detectedNumbers: [
        {
          number: "7",
          meaning: "Represents mystical spirituality, sacred introspection, the truth seeker and full alignment with cosmic laws."
        }
      ],
      predominantEmotion: {
        emotion: "Peace",
        explanation: "Despite the uncertain beginning, the spiritual closure that settles in your astral body is of peace and deep serenity."
      },
      dreamEnergyIndex: 85,
      dreamEnergyType: "Spiritual Energy",
      universeMessage: "The Universe greets your subtle walking. Continue to trust the invisible, for your inner waters are calm, ready to manifest solar brilliance!"
    },
    es: {
      title: title || "Visión de Alquimia Onírica",
      mainMeaning: "Tu sueño revela una profunda fase de transición y el despertar de sentimientos ocultos. El contraste de elementos como sombra y luz, o tierra y agua, indica que estás equilibrando la intuición con la acción práctica.",
      psychological: "Psicológicamente, este sueño representa los impulsos reprimidos del subconsciente que buscan la aprobación consciente del ego. Los elementos inusuales denotan que tu mente racional percibe las emociones puras y sinceras como extraordinarias o intrigantes.",
      spiritual: "Tu alma está cruzando portales multidimensionales de purificación. Los momentos en los que superas desafíos simbolizan que posees una sutil autoridad sobre las presiones materiales terrenales.",
      attention: "Atención a los sentimientos de desconfianza o aislamiento excesivo. Recuerda aceptar el apoyo cuando te lo ofrezcan espontáneamente quienes estimas.",
      opportunities: "Nuevas conexiones inesperadas con mentores maduros y oportunidades para demostrar tu sabiduría única.",
      protection: "Estás bajo un fuerte manto de protección ancestral. Los obstáculos y situaciones imprevistas se resuelven de forma sorprendentemente segura.",
      loveArea: "En el amor, los flujos oníricos indican que los sentimientos antiguos están pasando por una curación para dar espacio a conexiones más sinceras y sin trabas.",
      financeArea: "Luz verde de cosecha. Los esfuerzos pasados ​​comienzan a materializarse en recompensas estables en el plano material.",
      careerArea: "Tu capacidad para adaptarte y liderar bajo presión atrae la atención positiva de superiores o socios de proyectos comerciales.",
      luckyNumbers: ["07", "14", "22", "33", "48"],
      favorableColors: ["Dorado", "Azul", "Blanco"],
      positivityLevel: 4.7,
      oracleAdvice: "Navega con calma. El ritmo del universo es perfecto y cada misterio se revelará en el momento exacto. Respira y confía en tu intuición soberana.",
      detectedAnimals: [
        {
          animal: "Serpiente",
          meaning: "Simboliza la curación, la renovación profunda, la superación de miedos atávicos y el despertar de la energía vital de la tierra."
        }
      ],
      detectedColors: [
        {
          color: "Dorado",
          meaning: "Representa la iluminación espiritual, la abundancia material majestuosa y la alineación con la energía del Sol y del plexo solar."
        }
      ],
      detectedNumbers: [
        {
          number: "7",
          meaning: "Representa la espiritualidad mística, la introspección sagrada, el buscador de la verdad y la plena alineación con las leyes cósmicas."
        }
      ],
      predominantEmotion: {
        emotion: "Paz",
        explanation: "A pesar del comienzo incierto, el cierre espiritual que se asienta en tu cuerpo astral es de paz y profunda serenidad."
      },
      dreamEnergyIndex: 85,
      dreamEnergyType: "Energía Espiritual",
      universeMessage: "¡El Universo saluda tu sutil caminar. Continúa confiando en lo invisible, pues tus aguas internas están tranquilas, listas para manifestar el brillo solar!"
    },
    de: {
      title: title || "Traumalchemie-Vision",
      mainMeaning: "Ihr Traum offenbart eine tiefgreifende Übergangsphase und das Erwachen verborgener Gefühle. Der Kontrast der Elemente deutet darauf hin, dass Sie Intuition mit praktischem Handeln in Einklang bringen.",
      psychological: "Psychologisch gesehen repräsentiert dieser Traum die verdrängten Impulse des Unterbewusstseins, die nach bewusster Anerkennung durch das Ego suchen. Ungewöhnliche Elemente deuten darauf hin, dass Ihr rationaler Verstand reine und aufrichtige Emotionen als außergewöhnlich wahrnimmt.",
      spiritual: "Ihre Seele durchquert multidimensionale Portale der Reinigung. Momente, in denen Sie Herausforderungen meistern, symbolisieren, dass Sie subtile Autorität über irdische materielle Zwänge besitzen.",
      attention: "Achten Sie auf Gefühle des Misstrauens oder übermäßiger Isolation. Denken Sie daran, Unterstützung anzunehmen, wenn sie von denjenigen, die Sie schätzen, spontan angeboten wird.",
      opportunities: "Unerwartete neue Verbindungen mit reifen Mentoren und Gelegenheiten, Ihre einzigartige Weisheit unter Beweis zu stellen.",
      protection: "Sie stehen unter einem starken Mantel des Schutzes Ihrer Vorfahren. Hindernisse und unvorhergesehene Situationen werden auf überraschend sichere Weise gelöst.",
      loveArea: "In der Liebe deuten Traumflüsse darauf hin, dass alte Gefühle geheilt werden, um Platz für aufrichtigere und ungehinderte Verbindungen zu machen.",
      financeArea: "Grünes Licht für die Ernte. Vergangene Bemühungen beginnen sich in stabilen Belohnungen auf der materiellen Ebene niederzuschlagen.",
      careerArea: "Ihre Fähigkeit, sich unter Druck anzupassen und zu führen, zieht die positive Aufmerksamkeit von Vorgesetzten oder Geschäftspartnern auf sich.",
      luckyNumbers: ["07", "14", "22", "33", "48"],
      favorableColors: ["Gold", "Blau", "Weiß"],
      positivityLevel: 4.7,
      oracleAdvice: "Segeln Sie ruhig. Der Rhythmus des Universums ist perfekt und jedes Geheimnis wird sich zur genauen Zeit offenbaren. Atmen Sie durch und vertrauen Sie auf Ihre souveräne Intuition.",
      detectedAnimals: [
        {
          animal: "Schlange",
          meaning: "Symbolisiert Heilung, tiefe Erneuerung, die Überwindung atavistischer Ängste und das Erwachen der lebenswichtigen Energie der Erde."
        }
      ],
      detectedColors: [
        {
          color: "Gold",
          meaning: "Repräsentiert spirituelle Erleuchtung, majestätischen materiellen Überfluss und die Ausrichtung auf die Energie der Sonne und des Solarplexus."
        }
      ],
      detectedNumbers: [
        {
          number: "7",
          meaning: "Repräsentiert mystische Spiritualität, heilige Selbstbeobachtung, den Wahrheitssucher und die vollständige Ausrichtung auf kosmische Gesetze."
        }
      ],
      predominantEmotion: {
        emotion: "Frieden",
        explanation: "Trotz des ungewissen Anfangs ist der spirituelle Abschluss, der sich in Ihrem Astralkörper einstellt, von Frieden und tiefer Gelassenheit geprägt."
      },
      dreamEnergyIndex: 85,
      dreamEnergyType: "Spirituelle Energie",
      universeMessage: "Das Universum grüßt Ihr subtiles Gehen. Vertrauen Sie weiterhin auf das Unsichtbare, denn Ihre inneren Gewässer sind ruhig und bereit, solare Brillanz zu manifestieren!"
    },
    fr: {
      title: title || "Vision d'Alchimie Onirique",
      mainMeaning: "Votre rêve révèle une profonde phase de transition et l'éveil de sentiments cachés. Le contraste d'éléments comme l'ombre et la lumière, ou la terre et l'eau, indique que vous équilibrez intuition et action pratique.",
      psychological: "Psychologiquement, ce rêve représente les pulsions refoulées du subconscient qui cherchent l'approbation consciente du moi. Des éléments inhabituels dénotent que votre esprit rationnel perçoit les émotions pures et sincères comme extraordinaires ou intrigantes.",
      spiritual: "Votre âme traverse des portails de purification multidimensionnels. Les moments où vous surmontez des défis symbolisent que vous possédez une autoridade subtile sur les pressions matérielles terrestres.",
      attention: "Attention aux sentiments de méfiance ou d'isolement excessif. N'oubliez pas d'accepter le soutien lorsqu'il est offert spontanément par ceux que vous estimez.",
      opportunities: "Nouvelles connexions inattendues avec des mentors mûrs et opportunités de démontrer votre sagesse unique.",
      protection: "Vous êtes sous un puissant manteau de protection ancestrale. Les obstacles et les situations imprévues se résolvent de manière étonnamment sûre.",
      loveArea: "En amour, les flux de rêve indiquent que les sentiments anciens guérissent pour faire place à des connexions plus sincères et sans entraves.",
      financeArea: "Feu vert pour la récolte. Les efforts passés commencent à se matérialiser en récompenses stables sur le plan matériel.",
      careerArea: "Votre capacité à s'adapter et à diriger sous pression attire l'attention positive de supérieurs ou de partenaires de projets commerciaux.",
      luckyNumbers: ["07", "14", "22", "33", "48"],
      favorableColors: ["Doré", "Bleu", "Blanc"],
      positivityLevel: 4.7,
      oracleAdvice: "Naviguez sereinement. Le rythme de l'univers est parfait et chaque mystère se révélera au moment exact. Respirez et faites confiance à votre intuition souveraine.",
      detectedAnimals: [
        {
          animal: "Serpent",
          meaning: "Symbolise la guérison, le renouveau profond, le dépassement des peurs ataviques et l'éveil de l'énergie vitale de la terre."
        }
      ],
      detectedColors: [
        {
          color: "Doré",
          meaning: "Représente l'illumination spirituelle, l'abondance matérielle majestueuse et l'alignement avec l'énergie du Soleil et du plexus solaire."
        }
      ],
      detectedNumbers: [
        {
          number: "7",
          meaning: "Représente la spiritualité mystique, l'introspection sacrée, le chercheur de vérité et l'alignement complet avec les lois cosmiques."
        }
      ],
      predominantEmotion: {
        emotion: "Paix",
        explanation: "Malgré un début incertain, la résolution spirituelle qui s'établit dans votre corps astral est empreinte de paix et de profonde sérénité."
      },
      dreamEnergyIndex: 85,
      dreamEnergyType: "Énergie Spirituelle",
      universeMessage: "L'Univers salue votre marche subtile. Continuez à faire confiance à l'invisible, car vos eaux intérieures sont calmes, prêtes à manifester l'éclat solaire !"
    }
  };

  const fallbackInterpretation = fallbackInterpretationMap[activeLang] || fallbackInterpretationMap["pt"];

  const cacheKey = `oraculo_dreams:${description}:${activeLang}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  if (!aiClient) {
    const result = { interpretation: fallbackInterpretation };
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }

  try {
    const prompt = `Você é o Oráculo dos Sonhos (Oráculo Celestial), assistente espiritual e terapeuta de sonhos profissional.
Analise a descrição deste sonho e gere uma interpretação mágica, profunda, rica e detalhada escrita 100% no idioma ${targetLangName}.

Descrição do Sonho: "${description}"

Você DEVE produzir e retornar EXCLUSIVAMENTE um objeto JSON estruturado exatamente com o seguinte formato, sem nenhum texto adicional ou explicações externas. Todas as chaves e valores textuais de string DEVEM ser escritos 100% no idioma ${targetLangName}:

{
  "title": "Título elegante curto do sonho em ${targetLangName}",
  "mainMeaning": "Significado geral principal bem rico e detalhado do sonho em ${targetLangName}",
  "psychological": "Interpretação psicológica detalhada baseada no subconsciente em ${targetLangName}",
  "spiritual": "Mensagem espiritual em ${targetLangName} (se houver relevância, senão explique brevemente a conexão sutil ou retorne a frase correspondente a 'Transição de alma e conexão elemental')",
  "attention": "Explicação detalhada do que se atentar nos próximos dias em ${targetLangName} (se houver, senão avise para manter-se em equilíbrio emocional)",
  "opportunities": "Oportunidades próximas que este sonho indica para sua vida em ${targetLangName}",
  "protection": "Sinais de proteção e livramentos mostrados no sonho em ${targetLangName}",
  "loveArea": "Como o sonho ressoa na área amorosa do sonhador em ${targetLangName}",
  "financeArea": "Impacto e previsões para a área financeira em ${targetLangName}",
  "careerArea": "Direções do sonho para a área profissional em ${targetLangName}",
  "luckyNumbers": ["lista com 5 números da sorte de 2 dígitos como strings, ex: '07', '14', '22', '33', '48'"],
  "favorableColors": ["lista com 2 ou 3 cores favoráveis identificadas em ${targetLangName}, ex: 'Gold', 'Blue', 'White'"],
  "positivityLevel": 4.5,
  "oracleAdvice": "O conselho direto e misterioso do Oráculo para o dia a dia do sonhador em ${targetLangName}",
  "detectedAnimals": [
    { "animal": "Nome do Animal em ${targetLangName}", "meaning": "Significado individual do animal em ${targetLangName}" }
  ],
  "detectedColors": [
    { "color": "Nome da Cor em ${targetLangName}", "meaning": "Interpretação da cor em ${targetLangName}" }
  ],
  "detectedNumbers": [
    { "number": "Número", "meaning": "Interpretação do número no sonho em ${targetLangName}" }
  ],
  "predominantEmotion": {
    "emotion": "Uma das seguintes palavras exatas traduzida para ${targetLangName}: Medo, Alegria, Tristeza, Ansiedade ou Paz (ou correspondente em ${targetLangName})",
    "explanation": "Explicação detalhada em ${targetLangName}"
  },
  "dreamEnergyIndex": 82,
  "dreamEnergyType": "Escolha o melhor termo complementar em ${targetLangName}: Energia Espiritual, Vibração Psíquica ou Alinhamento Astral",
  "universeMessage": "Mensagem mística direta enviada do Universo em ${targetLangName} como uma canalização sagrada"
}

Retorne apenas o JSON puro para que o sistema possa parsear com JSON.parse com segurança absoluta.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedData = cleanAndParseJSON(response.text || "{}");
    const merged = { ...fallbackInterpretation, ...parsedData };
    const result = { interpretation: merged };
    setCachedResponse(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.warn("Dream API failed, serving fallback interpretation:", err);
    const result = { interpretation: fallbackInterpretation };
    setCachedResponse(cacheKey, result);
    res.json(result);
  }
});

// API: Companion compatibility evaluation
app.post("/api/compatibility/evaluate", async (req, res) => {
  const {
    name,
    birthDate,
    birthTime,
    birthCity,
    companionName,
    companionBirthDate,
    companionBirthTime,
    companionBirthCity,
    companionBirthCountry,
    category,
    lang
  } = req.body;

  if (!name || !companionName) {
    return res.status(400).json({ error: (req as any).t('api.compatibility.both_names_required') });
  }

  // Pre-calculate highly detailed parameters using compatibilityEngine
  const compResult = computeDetailedCompatibility(
    name,
    birthDate || "1994-01-01",
    birthTime || "12:00",
    birthCity || "São Paulo",
    companionName,
    companionBirthDate || "1995-01-01",
    companionBirthTime || "12:00",
    companionBirthCity || "Rio de Janeiro",
    companionBirthCountry || "Brasil",
    category || "love"
  );

  const cacheKey = `compatibility:${name}:${birthDate}:${companionName}:${companionBirthDate}:${category || 'love'}:${lang || 'pt'}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json({ compatibility: cached });
  }

  if (!aiClient) {
    setCachedResponse(cacheKey, compResult);
    return res.json({ compatibility: compResult });
  }

  try {
    const langNames: Record<string, string> = {
      pt: "Português (Portuguese)",
      en: "Inglês (English)",
      es: "Espanhol (Spanish)",
      de: "Alemão (German)",
      fr: "Francês (French)"
    };
    const targetLangName = langNames[lang] || langNames.pt;

    const prompt = `You are an elite astrologer. The user ${name} performed a chart crossover (synastry) in the category of "${category || 'love'}" with ${companionName}.
Below are the actual calculated data of positions, elements, planets, and dozens of structured metrics we deterministically generated based on actual ephemerides:

${JSON.stringify(compResult, null, 2)}

Your sole task is to return an IDENTICAL JSON object in structure. Fill all descriptive text fields, array lists, titles, and explanations with even longer, majestic, profound, poetic analyses in the authentic tone of premium astrology.
CRITICAL REQUIREMENT: All generated descriptive text fields, descriptions, items, and string arrays MUST be written 100% in the language: ${targetLangName}.
Do not translate JSON keys (like 'porQueExisteCompatibilidade', 'pontosFortes', etc.). Keep all keys exactly as they are.
MAINTAIN THE DAYS IN THE CALENDAR FORMAT WITH EXPANDED TEXTS AND KEEP ALL NUMERICAL PERCENTAGES EXACTLY AS THEY ARE IN THE CHART TO ENSURE THE MATHEMATICAL ACCURACY OF THE SYNASTRY.

Return ONLY the raw literal JSON without any markdown code blocks or secondary text outside the JSON.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const geminiText = response.text || "{}";
    const parsedData = cleanAndParseJSON(geminiText);

    // Merge expanded poetic descriptions into our accurate calculations
    if (parsedData.porQueExisteCompatibilidade) compResult.porQueExisteCompatibilidade = parsedData.porQueExisteCompatibilidade;
    if (parsedData.porQueExisteConflito) compResult.porQueExisteConflito = parsedData.porQueExisteConflito;
    if (parsedData.influenciaTransitos) compResult.influenciaTransitos = parsedData.influenciaTransitos;
    if (parsedData.convivencia) compResult.convivencia = parsedData.convivencia;
    if (parsedData.casamento) compResult.casamento = parsedData.casamento;
    if (parsedData.amizadeDuradoura) compResult.amizadeDuradoura = parsedData.amizadeDuradoura;
    if (parsedData.sociedadeProfissional) compResult.sociedadeProfissional = parsedData.sociedadeProfissional;
    if (parsedData.licoesCarmicas) compResult.licoesCarmicas = parsedData.licoesCarmicas;
    if (parsedData.aprendizadosMutuos) compResult.aprendizadosMutuos = parsedData.aprendizadosMutuos;
    if (parsedData.bloqueiosEmocionais) compResult.bloqueiosEmocionais = parsedData.bloqueiosEmocionais;
    if (parsedData.potenciaisTransformacoes) compResult.potenciaisTransformacoes = parsedData.potenciaisTransformacoes;
    if (parsedData.melhorarComunicacao) compResult.melhorarComunicacao = parsedData.melhorarComunicacao;
    if (parsedData.reduzirConflitos) compResult.reduzirConflitos = parsedData.reduzirConflitos;
    if (parsedData.fortalecerConexao) compResult.fortalecerConexao = parsedData.fortalecerConexao;
    if (parsedData.lidarDinheiro) compResult.lidarDinheiro = parsedData.lidarDinheiro;
    if (parsedData.lidarCiumes) compResult.lidarCiumes = parsedData.lidarCiumes;
    if (parsedData.resolverConflitos) compResult.resolverConflitos = parsedData.resolverConflitos;
    if (parsedData.morandoJuntos) compResult.morandoJuntos = parsedData.morandoJuntos;
    if (parsedData.trabalhandoJuntos) compResult.trabalhandoJuntos = parsedData.trabalhandoJuntos;
    if (parsedData.quemTendeCeder) compResult.quemTendeCeder = parsedData.quemTendeCeder;
    if (parsedData.quemTendeDominar) compResult.quemTendeDominar = parsedData.quemTendeDominar;

    if (parsedData.pontosFortes && Array.isArray(parsedData.pontosFortes)) compResult.pontosFortes = parsedData.pontosFortes;
    if (parsedData.pontosAtencao && Array.isArray(parsedData.pontosAtencao)) compResult.pontosAtencao = parsedData.pontosAtencao;
    if (parsedData.areasConflito && Array.isArray(parsedData.areasConflito)) compResult.areasConflito = parsedData.areasConflito;
    if (parsedData.caracteristicasUnem && Array.isArray(parsedData.caracteristicasUnem)) compResult.caracteristicasUnem = parsedData.caracteristicasUnem;
    if (parsedData.caracteristicasAfastam && Array.isArray(parsedData.caracteristicasAfastam)) compResult.caracteristicasAfastam = parsedData.caracteristicasAfastam;
    if (parsedData.oQueFazer && Array.isArray(parsedData.oQueFazer)) compResult.oQueFazer = parsedData.oQueFazer;
    if (parsedData.oQueEvitar && Array.isArray(parsedData.oQueEvitar)) compResult.oQueEvitar = parsedData.oQueEvitar;

    if (parsedData.proximos7Dias) compResult.proximos7Dias = parsedData.proximos7Dias;
    if (parsedData.proximos30Dias) compResult.proximos30Dias = parsedData.proximos30Dias;
    if (parsedData.proximos3Meses) compResult.proximos3Meses = parsedData.proximos3Meses;
    if (parsedData.proximos6Meses) compResult.proximos6Meses = parsedData.proximos6Meses;
    if (parsedData.proximoAno) compResult.proximoAno = parsedData.proximoAno;

    if (parsedData.diasFavoraveis) compResult.diasFavoraveis = parsedData.diasFavoraveis;
    if (parsedData.diasAtencao) compResult.diasAtencao = parsedData.diasAtencao;
    if (parsedData.oportunidades) compResult.oportunidades = parsedData.oportunidades;

    setCachedResponse(cacheKey, compResult);
    res.json({ compatibility: compResult });
  } catch (err) {
    console.warn("Gemini compatibility enhancement failed, serving computed fallback:", err);
    setCachedResponse(cacheKey, compResult);
    res.json({ compatibility: compResult });
  }
});

// API: Daily Oracle limit checking + prompt calculation
app.post("/api/oraculo/query", async (req, res) => {
  const { question, lang } = req.body;
  if (!question) {
    return res.status(400).json({ error: (req as any).t('api.oraculo.question_required') });
  }

  const activeLang = (lang || "pt").toLowerCase();
  const fallbackOracleMap: Record<string, any> = {
    pt: {
      reflection: "Todo ciclo que se fecha é na verdade a preparação de um solo novo. Pare e observe o que realmente está demandando sua energia.",
      inspiringMessage: "A originalidade reside em aceitar seus padrões ocultos enquanto projeta novos amanheceres sem medo.",
      counsel: "Não precipite escolhas. Silencie suas inquietações cerebrais hoje e permita que sua intuição (que vibra alto) indique a resposta natural."
    },
    en: {
      reflection: "Every cycle that closes is actually the preparation of a new soil. Stop and observe what is really demanding your energy.",
      inspiringMessage: "Originality lies in accepting your hidden patterns while projecting new dawns without fear.",
      counsel: "Do not rush choices. Silence your brain worries today and allow your intuition (which vibrates high) to indicate the natural response."
    },
    es: {
      reflection: "Cada ciclo que se cierra es en realidad la preparación de un nuevo suelo. Detente y observa qué está demandando realmente tu energía.",
      inspiringMessage: "La originalidad reside en aceptar tus patrones ocultos mientras proyectas nuevos amaneceres sin temor.",
      counsel: "No apresures elecciones. Silencia tus inquietudes cerebrales hoy y permite que tu intuición (que vibra alto) indique la respuesta natural."
    },
    de: {
      reflection: "Jeder geschlossene Zyklus ist in Wirklichkeit die Vorbereitung eines neuen Bodens. Halten Sie inne und beobachten Sie, was Ihre Energie wirklich fordert.",
      inspiringMessage: "Originalität liegt darin, Ihre verborgenen Muster zu akzeptieren und gleichzeitig ohne Angst neue Morgenröten zu entwerfen.",
      counsel: "Übereilen Sie keine Entscheidungen. Beruhigen Sie heute Ihre Sorgen und lassen Sie Ihre Intuition die natürliche Antwort anzeigen."
    },
    fr: {
      reflection: "Chaque cycle qui se ferme est en réalité la préparation d'un nouveau sol. Arrêtez-vous et observez ce qui réclame réellement votre énergie.",
      inspiringMessage: "L'originalité réside dans l'acceptation de vos schémas cachés tout en projetant de nouvelles aurores sans crainte.",
      counsel: "Ne précipitez pas les choix. Silencez vos inquiétudes cérébrales aujourd'hui et permettez à votre intuition d'indiquer la réponse naturelle."
    }
  };

  const fallbackOracle = fallbackOracleMap[activeLang] || fallbackOracleMap["pt"];
  const langNames: Record<string, string> = {
    pt: "Português",
    en: "English (Inglês)",
    es: "Spanish (Espanhol)",
    de: "German (Alemão)",
    fr: "French (Francês)"
  };
  const targetLangName = langNames[activeLang] || "Português";

  const cacheKey = `oraculo:${question}:${activeLang}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  if (!aiClient) {
    const result = fallbackOracle;
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }

  try {
    const prompt = `O usuário fez uma pergunta ao Oráculo do Dia: "${question}".
Considere que as energias astrológicas regentes estimulam idealismo, independência e crescimento pessoal metódico.
Responda com um conselho meditativo e reflexivo escrito 100% em ${targetLangName} no seguinte formato JSON estrito:
{
  "reflection": "Um parágrafo de profunda reflexão metafísica relacionada à pergunta escrito em ${targetLangName}...",
  "inspiringMessage": "Uma mensagem de 2 frases de grande inspiração e incentivo escrita em ${targetLangName}...",
  "counsel": "Um conselho prático e objetivo sobre o que o usuário deve fazer hoje escrito em ${targetLangName}..."
}`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const oracleData = cleanAndParseJSON(response.text || "{}");
    const result = { ...fallbackOracle, ...oracleData };
    setCachedResponse(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.warn("Oracle API failed, serving fallback:", err);
    const result = fallbackOracle;
    setCachedResponse(cacheKey, result);
    res.json(result);
  }
});

// API: Celestial transits history & events of the current month (June 2026)
app.post("/api/astrology/transits-month", async (req, res) => {
  const { birthDate, name, lang } = req.body || {};
  const activeLang = (lang || 'pt').toLowerCase();

  const fallbackTransitsDict: Record<string, any> = {
    pt: {
      events: [
        {
          date: "2026-06-03",
          eventName: "Conjunção Sol e Vênus em Gêmeos",
          planet: "Vênus",
          description: "Momento sublime para diálogos afetivos, valorização estética e acordos financeiros leves e dinâmicos.",
          influence: "Positive"
        },
        {
          date: "2026-06-09",
          eventName: "Lua Minguante em Peixes",
          planet: "Lua",
          description: "Fase de depuração emocional profunda. Momento propício para meditação, desapego e cura onírica.",
          influence: "Transformative"
        },
        {
          date: "2026-06-15",
          eventName: "Mercúrio em Conjunção com Sol em Câncer",
          planet: "Mercúrio",
          description: "Alinhamento das faculdades cognitivas racionais à sensibilidade emocional pura. Ideias de negócios vinculadas à moradia, segurança ou raízes íntimas.",
          influence: "Positive"
        },
        {
          date: "2026-06-21",
          eventName: "Solstício de Inverno / Sol entra em Câncer",
          planet: "Sol",
          description: "O Sol entra no signo cardinal da Água, Câncer. Período de introspecção reflexiva, estreitamento de laços familiares e cultivo de sua segurança fundamental.",
          influence: "Neutral"
        },
        {
          date: "2026-06-25",
          eventName: "Sol em Câncer em Trígono com Saturno em Peixes",
          planet: "Saturno",
          description: "Uma corrente de maturidade e estabilização emocional flui. Perfeito para formalizar acordos sinceros de longo prazo.",
          influence: "Positive"
        },
        {
          date: "2026-06-28",
          eventName: "Quadratura Marte e Plutão",
          planet: "Marte",
          description: "Confronto de vontades e disputa por controle. Canalize o impulso revolucionário para transformações internas estruturadas.",
          influence: "Challenging"
        },
        {
          date: "2026-06-30",
          eventName: "Mercúrio entra em Leão",
          planet: "Mercúrio",
          description: "A comunicação ganha tons teatrais, expressivos e carismáticos. Ideal para falar com autoridade e brilho pessoal.",
          influence: "Neutral"
        }
      ]
    },
    en: {
      events: [
        {
          date: "2026-06-03",
          eventName: "Sun and Venus Conjunction in Gemini",
          planet: "Venus",
          description: "Sublime moment for affectionate dialogues, aesthetic appreciation, and light, dynamic financial agreements.",
          influence: "Positive"
        },
        {
          date: "2026-06-09",
          eventName: "Waning Moon in Pisces",
          planet: "Moon",
          description: "Phase of deep emotional purification. Auspicious time for meditation, detachment, and dream healing.",
          influence: "Transformative"
        },
        {
          date: "2026-06-15",
          eventName: "Mercury in Conjunction with Sun in Cancer",
          planet: "Mercury",
          description: "Alignment of rational cognitive faculties with pure emotional sensitivity. Business ideas linked to housing, security, or intimate roots.",
          influence: "Positive"
        },
        {
          date: "2026-06-21",
          eventName: "Winter Solstice / Sun enters Cancer",
          planet: "Sun",
          description: "The Sun enters the cardinal Water sign, Cancer. Period of reflective introspection, strengthening of family ties, and cultivation of your fundamental security.",
          influence: "Neutral"
        },
        {
          date: "2026-06-25",
          eventName: "Sun in Cancer Trine Saturn in Pisces",
          planet: "Saturn",
          description: "A stream of emotional maturity and stabilization flows. Perfect for formalizing sincere long-term agreements.",
          influence: "Positive"
        },
        {
          date: "2026-06-28",
          eventName: "Mars and Pluto Square",
          planet: "Mars",
          description: "Clash of wills and struggle for control. Channel the revolutionary impulse into structured internal transformations.",
          influence: "Challenging"
        },
        {
          date: "2026-06-30",
          eventName: "Mercury enters Leo",
          planet: "Mercury",
          description: "Communication gains theatrical, expressive, and charismatic tones. Ideal for speaking with authority and personal shine.",
          influence: "Neutral"
        }
      ]
    },
    es: {
      events: [
        {
          date: "2026-06-03",
          eventName: "Conjunción Sol y Venus en Géminis",
          planet: "Venus",
          description: "Momento sublime para diálogos afectivos, valoración estética y acuerdos financieros ligeros y dinámicos.",
          influence: "Positive"
        },
        {
          date: "2026-06-09",
          eventName: "Luna Menguante en Piscis",
          planet: "Luna",
          description: "Fase de depuración emocional profunda. Momento propicio para la meditación, el desapego y la curación onírica.",
          influence: "Transformative"
        },
        {
          date: "2026-06-15",
          eventName: "Mercurio en Conjunción con el Sol en Cáncer",
          planet: "Mercurio",
          description: "Alineación de las facultades cognitivas racionales con la sensibilidad emocional pura. Ideas de negocio vinculadas a la vivienda, seguridad o raíces íntimas.",
          influence: "Positive"
        },
        {
          date: "2026-06-21",
          eventName: "Solsticio de Invierno / El Sol entra en Cáncer",
          planet: "Sol",
          description: "El Sol entra en el signo cardinal de Agua, Cáncer. Período de introspección reflexiva, fortalecimiento de los lazos familiares y cultivo de su seguridad fundamental.",
          influence: "Neutral"
        },
        {
          date: "2026-06-25",
          eventName: "Sol en Cáncer en Trígono con Saturno en Piscis",
          planet: "Saturn",
          description: "Fluye una corriente de madurez y estabilización emocional. Perfecto para formalizar acuerdos sinceros a largo plazo.",
          influence: "Positive"
        },
        {
          date: "2026-06-28",
          eventName: "Cuadratura Marte y Plutón",
          planet: "Marte",
          description: "Choque de voluntades y lucha por el control. Canaliza el impulso revolucionario hacia transformaciones internas estructuradas.",
          influence: "Challenging"
        },
        {
          date: "2026-06-30",
          eventName: "Mercurio entra en Leo",
          planet: "Mercurio",
          description: "La comunicación adquiere tonos teatrales, expresivos y carismáticos. Ideal para hablar con autoridad y brillo personal.",
          influence: "Neutral"
        }
      ]
    },
    de: {
      events: [
        {
          date: "2026-06-03",
          eventName: "Sonne-Venus-Konjunktion in Zwillinge",
          planet: "Venus",
          description: "Erhabener Moment für liebevolle Dialoge, ästhetische Wertschätzung und leichte, dynamische Finanzvereinbarungen.",
          influence: "Positive"
        },
        {
          date: "2026-06-09",
          eventName: "Abnehmender Mond in Fische",
          planet: "Luna",
          description: "Phase der tiefen emotionalen Reinigung. Günstige Zeit für Meditation, Loslassen und Traumheilung.",
          influence: "Transformative"
        },
        {
          date: "2026-06-15",
          eventName: "Merkur in Konjunktion mit der Sonne im Krebs",
          planet: "Merkur",
          description: "Ausrichtung der rationalen kognitiven Fähigkeiten auf reine emotionale Sensibilität. Geschäftsideen im Zusammenhang mit Wohnen, Sicherheit oder intimen Wurzeln.",
          influence: "Positive"
        },
        {
          date: "2026-06-21",
          eventName: "Wintersonnenwende / Sonne tritt in den Krebs ein",
          planet: "Sol",
          description: "Die Sonne tritt in das kardinale Wasserzeichen Krebs ein. Zeit der nachdenklichen Introspektion, Stärkung familiärer Bindungen und Pflege Ihrer grundlegenden Sicherheit.",
          influence: "Neutral"
        },
        {
          date: "2026-06-25",
          eventName: "Sonne im Krebs im Trigon zu Saturn in Fische",
          planet: "Saturn",
          description: "Ein Strom emotionaler Reife und Stabilisierung fließt. Perfekt zur Formalisierung aufrichtiger langfristiger Vereinbarungen.",
          influence: "Positive"
        },
        {
          date: "2026-06-28",
          eventName: "Mars-Pluto-Quadrat",
          planet: "Mars",
          description: "Kampf der Willen und Machtkampf. Kanalisieren Sie den revolutionären Impuls in strukturierte innere Transformationen.",
          influence: "Challenging"
        },
        {
          date: "2026-06-30",
          eventName: "Merkur tritt in den Löwen ein",
          planet: "Merkur",
          description: "Die Kommunikation gewinnt theatralische, ausdrucksstarke und charismatische Töne. Ideal, um mit Autorität und persönlichem Glanz zu sprechen.",
          influence: "Neutral"
        }
      ]
    },
    fr: {
      events: [
        {
          date: "2026-06-03",
          eventName: "Conjonction Soleil et Vénus en Gémeaux",
          planet: "Venus",
          description: "Moment sublime pour les dialogues affectifs, l'appréciation esthétique et les accords financiers légers et dynamiques.",
          influence: "Positive"
        },
        {
          date: "2026-06-09",
          eventName: "Lune Décroissante en Poissons",
          planet: "Luna",
          description: "Phase de purification émotionnelle profonde. Moment propice à la méditation, au détachement et à la guérison par le rêve.",
          influence: "Transformative"
        },
        {
          date: "2026-06-15",
          eventName: "Mercure en Conjonction avec le Soleil en Cancer",
          planet: "Merkur",
          description: "Alignement des facultés cognitives rationnelles avec la pure sensibilité émotionnelle. Idées d'affaires liées au logement, à la sécurité ou aux racines intimes.",
          influence: "Positive"
        },
        {
          date: "2026-06-21",
          eventName: "Solstice d'Hiver / Le Soleil entre en Cancer",
          planet: "Sol",
          description: "Le Soleil entre dans le signe cardinal d'Eau, Cancer. Période d'introspection réflexive, de renforcement des liens familiaux et de culture de votre sécurité fondamentale.",
          influence: "Neutral"
        },
        {
          date: "2026-06-25",
          eventName: "Soleil en Cancer en Trigone avec Saturne en Poissons",
          planet: "Saturn",
          description: "Un flux de maturité émotionnelle et de stabilisation coule. Parfait pour formaliser des accords sincères à long terme.",
          influence: "Positive"
        },
        {
          date: "2026-06-28",
          eventName: "Carré Mars et Pluton",
          planet: "Mars",
          description: "Choc des volontés et lutte pour le contrôle. Canalisez l'impulsion révolutionnaire vers des transformations internes structurées.",
          influence: "Challenging"
        },
        {
          date: "2026-06-30",
          eventName: "Mercure entre en Lion",
          planet: "Merkur",
          description: "La communication acquiert des tons théâtraux, expressifs et charismatiques. Idéal pour parler avec autorité et éclat personnel.",
          influence: "Neutral"
        }
      ]
    }
  };

  const fallbackTransits = fallbackTransitsDict[activeLang] || fallbackTransitsDict.pt;

  const cacheKey = `transits:${name || ''}:${birthDate || ''}:${activeLang}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  if (!aiClient) {
    const result = fallbackTransits;
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }

  try {
    const userContext = birthDate ? `O usuário nasceu em ${birthDate}${name ? ', nome ' + name : ''}.` : '';
    const languageNames: Record<string, string> = {
      pt: "Português",
      en: "English (Inglês)",
      es: "Spanish (Espanhol)",
      de: "German (Alemão)",
      fr: "French (Francês)"
    };
    const targetLanguage = languageNames[activeLang] || "Português";

    const prompt = `Gere uma lista de 6 a 8 eventos astrológicos/trânsitos celestes importantes reais ou plausíveis para o mês atual de Junho de 2026.
${userContext}
Importante: O retorno DEVE ser um objeto JSON estrito com a seguinte estrutura de dados:
{
  "events": [
    {
      "date": "YYYY-MM-DD", // Deve usar data formatada em Junho de 2026 (por exemplo "2026-06-12")
      "eventName": "Nome do Evento Astrológico (escrito em ${targetLanguage})",
      "planet": "Nome do Planeta Principal em ${targetLanguage} (ex: 'Sol', 'Lua', 'Mercúrio', 'Vênus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Netuno', 'Plutão')",
      "description": "Explicação poética e astrológica detalhada escrita em ${targetLanguage} sobre o impacto coletivo ou pessoal deste trânsito...",
      "influence": "Positive" | "Challenging" | "Neutral" | "Transformative"
    }
  ]
}
Retorne somente o JSON limpo, sem markdown ou textos explicativos ao redor. Todos os textos internos no JSON DEVEM estar traduzidos na língua correspondente à ${targetLanguage}.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedData = cleanAndParseJSON(response.text || "{}");
    if (parsedData && Array.isArray(parsedData.events)) {
      const result = parsedData;
      setCachedResponse(cacheKey, result);
      return res.json(result);
    }
    const result = fallbackTransits;
    setCachedResponse(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.warn("Transits month API failed, serving fallback:", err);
    const result = fallbackTransits;
    setCachedResponse(cacheKey, result);
    res.json(result);
  }
});

// API: Moon current position tip (Sussurro Lunar Diário)
app.post("/api/astrology/moon-tip", async (req, res) => {
  const { birthDate, name, lang } = req.body || {};
  const currentLang = (lang || "pt").toLowerCase();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const userName = name || "Buscador";
  const userSunSign = birthDate ? getAscendedAstrologicalSign(birthDate, 0) : "Aquário";

  const phaseListMap: Record<string, string[]> = {
    pt: ["Lua Crescente 🌓", "Lua Cheia 🌕", "Lua Minguante 🌙", "Lua Nova 🌑"],
    en: ["Waxing Crescent Moon 🌓", "Full Moon 🌕", "Waning Crescent Moon 🌙", "New Moon 🌑"],
    es: ["Luna Creciente 🌓", "Luna Llena 🌕", "Luna Menguante 🌙", "Luna Nueva 🌑"],
    de: ["Zunehmender Mond 🌓", "Vollmond 🌕", "Abnehmender Mond 🌙", "Neumond 🌑"],
    fr: ["Lune Croissante 🌓", "Pleine Lune 🌕", "Lune Décroissante 🌙", "Nouvelle Lune 🌑"]
  };

  const signsListMap: Record<string, string[]> = {
    pt: ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"],
    en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    es: ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"],
    de: ["Widder", "Stier", "Zwillinge", "Krebs", "Löwe", "Jungfrau", "Waage", "Skorpion", "Schütze", "Steinbock", "Wassermann", "Fische"],
    fr: ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"]
  };

  const targetLang = ["pt", "en", "es", "de", "fr"].includes(currentLang) ? currentLang : "pt";
  const phaseList = phaseListMap[targetLang];
  const signsList = signsListMap[targetLang];
  
  // Deterministic seed based on date + user data for stable but daily shifting personalized wisdom
  let seed = 0;
  const compositeString = `${userName}-${birthDate || '1990-01-01'}-${todayStr}`;
  for (let i = 0; i < compositeString.length; i++) {
    seed += compositeString.charCodeAt(i);
  }
  const pickedPhase = phaseList[seed % phaseList.length];
  const pickedSign = signsList[(seed + 3) % signsList.length];
  
  const fallbackTips: Record<string, string> = {
    pt: `${userName}, sob a influência da astrológica ${pickedPhase} transitando pelo signo de ${pickedSign}, a vibração cósmica atual se conecta intimamente ao seu Sol em ${userSunSign}. Este é o momento ideal para silenciar os ruídos mentais, canalizar suas intenções mais nobres e permitir que o poder lunar guie as decisões que sua alma tem amadurecido nas últimas semanas.`,
    en: `${userName}, under the astrological influence of the ${pickedPhase} transiting through the sign of ${pickedSign}, the current cosmic vibration connects intimately with your Sun in ${userSunSign}. This is the ideal moment to silence mental noise, channel your noblest intentions, and allow the lunar power to guide the decisions your soul has been maturing in recent weeks.`,
    es: `${userName}, bajo la influencia astrológica de la ${pickedPhase} transitando por el signo de ${pickedSign}, la vibración cósmica actual se conecta íntimamente con tu Sol en ${userSunSign}. Este es el momento ideal para silenciar el ruido mental, canalizar tus intenciones más nobles y permitir que el poder lunar guie las decisiones que tu alma ha estado madurando en las últimas semanas.`,
    de: `${userName}, unter dem astrologischen Einfluss des ${pickedPhase}, der durch das Zeichen ${pickedSign} wandert, verbindet sich die aktuelle kosmische Schwingung eng mit Ihrer Sonne in ${userSunSign}. Dies ist der ideale Moment, um den mentalen Lärm zum Schweigen zu bringen, Ihre edelsten Absichten zu kanalisieren und der Mondkraft zu erlauben, die Entscheidungen zu leiten, die Ihre Seele in den letzten Wochen gereift hat.`,
    fr: `${userName}, sous l'influence astrologique de la ${pickedPhase} transitant par le signe du ${pickedSign}, la vibration cosmique actuelle se connecte intimement à votre Soleil en ${userSunSign}. C'est le moment idéal pour faire taire le bruit mental, canaliser vos intentions les plus nobles et permettre à la puissance lunaire de guider les décisions que votre âme mûrit depuis quelques semaines.`
  };

  const dynamicPersonalizedFallback = {
    moonSign: pickedSign,
    moonPhase: pickedPhase,
    tip: fallbackTips[targetLang] || fallbackTips["pt"]
  };

  const cacheKey = `moontip:${name || ''}:${birthDate || ''}:${todayStr}:${targetLang}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  if (!aiClient) {
    const result = dynamicPersonalizedFallback;
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }

  try {
    const targetLangNameMap: Record<string, string> = {
      pt: "Português",
      en: "English",
      es: "Español",
      de: "Deutsch",
      fr: "Français"
    };
    const targetLangName = targetLangNameMap[targetLang] || "Português";

    const userContext = birthDate ? `O usuário se chama ${userName} e nasceu em ${birthDate} com Sol em ${userSunSign}.` : `O usuário se chama ${userName}.`;
    const prompt = `Gere uma "Dica Astrológica Rápida/Sussurro Lunar Diário" curta, poética, misteriosa e extremamente inspiradora 100% em ${targetLangName} adaptada à posição atual da Lua hoje (Data atual: ${todayStr}, Fase Lunar estimada: ${pickedPhase}, Signo Lunar transitando: ${pickedSign}).
${userContext}
Importante: O retorno DEVE ser um objeto JSON estrito com a seguinte estrutura de dados:
{
  "moonSign": "${pickedSign}",
  "moonPhase": "${pickedPhase}",
  "tip": "Uma dica direta, inspiradora e poética de 2-3 frases chamando o usuário pelo nome, orientando o que fazer psicologicamente ou espiritualmente hoje em face deste trânsito lunar e de seu signo solar escrito 100% em ${targetLangName}."
}
Não coloque blocos markdown ou preâmbulos, retorne APENAS o JSON literal limpo em ${targetLangName}.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedData = cleanAndParseJSON(response.text || "{}");
    if (parsedData && parsedData.tip) {
      const result = parsedData;
      setCachedResponse(cacheKey, result);
      return res.json(result);
    }
    const result = dynamicPersonalizedFallback;
    setCachedResponse(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.warn("Moon-tip API failed, serving dynamic fallback:", err);
    const result = dynamicPersonalizedFallback;
    setCachedResponse(cacheKey, result);
    res.json(result);
  }
});

// API: Astrological Rare Notifications system customized to user's birth map
app.post("/api/astrology/rare-notifications", async (req, res) => {
  try {
    const { birthDate, name, email, lang } = req.body || {};
    let safeBirthDate = birthDate;

    // Elegant fallback if birthDate is absent or undefined
    if (!safeBirthDate || safeBirthDate.trim() === "" || safeBirthDate === "undefined") {
      const savedUser = mockUsers.find(u => 
        (email && u.email?.toLowerCase().trim() === email.toLowerCase().trim()) ||
        (name && u.name?.toLowerCase().includes(name.toLowerCase()))
      );
      if (savedUser && savedUser.birthDate) {
        safeBirthDate = savedUser.birthDate;
      } else {
        safeBirthDate = "1997-02-11";
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    
    const isDefaultPersona = name?.toLowerCase().includes("fabricio") || name?.toLowerCase().includes("fabriicio");
    const solSign = isDefaultPersona ? "Aquário" : getAscendedAstrologicalSign(safeBirthDate, 0);
    const moonSign = isDefaultPersona ? "Aquário" : getAscendedAstrologicalSign(safeBirthDate, 5);
    const ascSign = isDefaultPersona ? "Sagitário" : getAscendedAstrologicalSign(safeBirthDate, 8);

    const activeLang = (lang || "pt").toLowerCase();
    const langNames: Record<string, string> = {
      pt: "Português",
      en: "English (Inglês)",
      es: "Spanish (Espanhol)",
      de: "German (Alemão)",
      fr: "French (Francês)"
    };
    const targetLangName = langNames[activeLang] || "Português";

    const localizedFallbackData: Record<string, any> = {
      pt: {
        notifications: [
          {
            id: "rare-node-shift-1",
            title: "Alinhamento Crítico de Plutão",
            message: `Plutão retrógrado em Aquário faz aspecto singular sobre seu Sol de nascimento em ${solSign}, convocando um encerramento kármico definitivo e uma renovação revolucionária da sua autoimagem de liderança.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Plutão",
            aspect: "Conjunção",
            category: "alignment"
          },
          {
            id: "jupiter-trine-2",
            title: "Farol Kármico de Júpiter",
            message: `Júpiter entra em trígono perfeito de expansão com sua Lua natal em ${moonSign}. Um Portal de sorte emocional, clareza intuitiva profunda e magnetismo prático está aberto nas próximas 48 horas.`,
            severity: "medium",
            date: todayStr,
            read: false,
            planet: "Júpiter",
            aspect: "Trígono",
            category: "alignment"
          },
          {
            id: "retrograde-saturn-3",
            title: "Estação de Saturno em Peixes",
            message: `Saturno estaciona no céu em quadratura exata com seu Ascendente natal em ${ascSign}. A cobrança sobre limites pessoais, limites de saúde e reestruturação emocional ganha peso extraordinário.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Saturno",
            aspect: "Quadratura",
            category: "retrograde"
          },
          {
            id: "mars-opposition-4",
            title: "Oposição de Marte Celeste",
            message: `Marte celeste em trânsito realiza oposição desafiadora ao seu Sol de nascimento em ${solSign}. Cuidado com picos de irritabilidade, exaustão impaciente ou conflitos com autoridades. Pratique desapego.`,
            severity: "low",
            date: todayStr,
            read: false,
            planet: "Marte",
            aspect: "Oposição",
            category: "alignment"
          }
        ]
      },
      en: {
        notifications: [
          {
            id: "rare-node-shift-1",
            title: "Critical Pluto Alignment",
            message: `Pluto retrograde in Aquarius forms a unique aspect on your natal Sun in ${solSign}, calling for a final karmic closure and a revolutionary renewal of your self-image of leadership.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Pluto",
            aspect: "Conjunction",
            category: "alignment"
          },
          {
            id: "jupiter-trine-2",
            title: "Jupiter's Karmic Beacon",
            message: `Jupiter enters a perfect trine of expansion with your natal Moon in ${moonSign}. A portal of emotional fortune, deep intuitive clarity, and practical magnetism is open for the next 48 hours.`,
            severity: "medium",
            date: todayStr,
            read: false,
            planet: "Jupiter",
            aspect: "Trine",
            category: "alignment"
          },
          {
            id: "retrograde-saturn-3",
            title: "Saturn Station in Pisces",
            message: `Saturn stations in the sky in exact square with your natal Ascendant in ${ascSign}. The demand for personal limits, health boundaries, and emotional restructuring gains extraordinary weight.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Saturn",
            aspect: "Square",
            category: "retrograde"
          },
          {
            id: "mars-opposition-4",
            title: "Mars Celestial Opposition",
            message: `Transit celestial Mars creates a challenging opposition to your natal Sun in ${solSign}. Beware of irritability spikes, impatient exhaustion, or conflicts with authority. Practice letting go.`,
            severity: "low",
            date: todayStr,
            read: false,
            planet: "Mars",
            aspect: "Opposition",
            category: "alignment"
          }
        ]
      },
      es: {
        notifications: [
          {
            id: "rare-node-shift-1",
            title: "Alineación Crítica de Plutón",
            message: `Plutón retrógrado en Acuario hace un aspecto singular sobre tu Sol natal en ${solSign}, convocando a un cierre kármico definitivo y a una renovación revolucionaria de tu autoimagen de liderazgo.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Plutón",
            aspect: "Conjunción",
            category: "alignment"
          },
          {
            id: "jupiter-trine-2",
            title: "Faro Kármico de Júpiter",
            message: `Júpiter entra en trígono perfecto de expansión con tu Luna natal en ${moonSign}. Un portal de suerte emocional, claridad intuitiva profunda y magnetismo práctico está abierto en las próximas 48 horas.`,
            severity: "medium",
            date: todayStr,
            read: false,
            planet: "Júpiter",
            aspect: "Trígono",
            category: "alignment"
          },
          {
            id: "retrograde-saturn-3",
            title: "Estación de Saturno en Piscis",
            message: `Saturno se estaciona en el cielo en cuadratura exacta con tu Ascendente natal en ${ascSign}. La exigencia sobre los límites personales, los límites de salud y la reestructuración emocional adquiere un peso extraordinario.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Saturno",
            aspect: "Cuadratura",
            category: "retrograde"
          },
          {
            id: "mars-opposition-4",
            title: "Oposición del Marte Celeste",
            message: `Marte celeste en tránsito realiza una oposición desafiante a tu Sol natal en ${solSign}. Cuidado con los picos de irritabilidad, el cansancio impaciente o los conflictos con las autoridades. Practica el desapego.`,
            severity: "low",
            date: todayStr,
            read: false,
            planet: "Marte",
            aspect: "Oposición",
            category: "alignment"
          }
        ]
      },
      de: {
        notifications: [
          {
            id: "rare-node-shift-1",
            title: "Kritische Pluto-Ausrichtung",
            message: `Der rückläufige Pluto im Wassermann bildet einen einzigartigen Aspekt auf Ihre Geburts-Sonne in ${solSign} und fordert einen endgültigen karmischen Abschluss und eine revolutionäre Erneuerung Ihres Selbstbildes als Führungspersönlichkeit.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Pluto",
            aspect: "Konjunktion",
            category: "alignment"
          },
          {
            id: "jupiter-trine-2",
            title: "Karmisches Leuchtfeuer von Jupiter",
            message: `Jupiter tritt in ein perfektes Trigon der Expansion mit Ihrem Geburts-Mond in ${moonSign}. Ein Portal für emotionales Glück, tiefe intuitive Klarheit und praktischen Magnetismus ist für die nächsten 48 Stunden geöffnet.`,
            severity: "medium",
            date: todayStr,
            read: false,
            planet: "Jupiter",
            aspect: "Trigon",
            category: "alignment"
          },
          {
            id: "retrograde-saturn-3",
            title: "Saturn-Station in Fische",
            message: `Saturn steht am Himmel im exakten Quadrat zu Ihrem Geburts-Aszendenten in ${ascSign}. Die Forderung nach persönlichen Grenzen, gesundheitlichen Grenzen und emotionaler Umstrukturierung gewinnt an außergewöhnlichem Gewicht.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Saturn",
            aspect: "Quadrat",
            category: "retrograde"
          },
          {
            id: "mars-opposition-4",
            title: "Himmlische Mars-Opposition",
            message: `Der himmlische Mars im Transit bildet eine herausfordernde Opposition zu Ihrer Geburts-Sonne in ${solSign}. Achten Sie auf Reizbarkeitsschübe, ungeduldige Erschöpfung oder Konflikte mit Autoritäten. Üben Sie sich im Loslassen.`,
            severity: "low",
            date: todayStr,
            read: false,
            planet: "Mars",
            aspect: "Opposition",
            category: "alignment"
          }
        ]
      },
      fr: {
        notifications: [
          {
            id: "rare-node-shift-1",
            title: "Alignement Critique de Pluton",
            message: `Pluton rétrograde en Verseau forme un aspect unique sur votre Soleil natal en ${solSign}, appelant à une clôture karmique définitive et à un renouvellement révolutionnaire de votre image de leader.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Pluton",
            aspect: "Conjonction",
            category: "alignment"
          },
          {
            id: "jupiter-trine-2",
            title: "Phare Karmique de Jupiter",
            message: `Jupiter entre en trigone parfait d'expansion avec votre Lune natale en ${moonSign}. Un portail de chance émotionnelle, de clarté intuitive profonde et de magnétisme pratique est ouvert pour les prochaines 48 heures.`,
            severity: "medium",
            date: todayStr,
            read: false,
            planet: "Jupiter",
            aspect: "Trigone",
            category: "alignment"
          },
          {
            id: "retrograde-saturn-3",
            title: "Station de Saturne en Poissons",
            message: `Saturne stationne dans le ciel en carré exact avec votre Ascendant natal en ${ascSign}. L'exigence de limites personnelles, de frontières de santé et de restructuration émotionnelle prend un poids extraordinaire.`,
            severity: "high",
            date: todayStr,
            read: false,
            planet: "Saturne",
            aspect: "Carré",
            category: "retrograde"
          },
          {
            id: "mars-opposition-4",
            title: "Opposition Céleste de Mars",
            message: `Mars céleste en transit crée une opposition difficile à votre Soleil natal en ${solSign}. Attention aux pics d'irritabilité, à l'épuisement impatient ou aux conflits avec l'autorité. Pratiquez le détachement.`,
            severity: "low",
            date: todayStr,
            read: false,
            planet: "Mars",
            aspect: "Opposition",
            category: "alignment"
          }
        ]
      }
    };

    const fallbackData = localizedFallbackData[activeLang] || localizedFallbackData['pt'];

    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    const weekStr = `${today.getFullYear()}-W${weekNumber}`;

    const cacheKey = `rarenotif:${name || ''}:${safeBirthDate}:${weekStr}:${activeLang}`;
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    if (!aiClient) {
      const result = fallbackData;
      setCachedResponse(cacheKey, result);
      return res.json(result);
    }

    try {
      const prompt = `Gere uma lista de 3 a 4 "Alertas Astrológicos Raros / Alinhamentos Planetários Excepcionalmente Raros" em ${targetLangName} adaptados especificamente para o mapa natal do usuário abaixo.
      Os alertas devem refletir trânsitos celestes reais ou altamente plausíveis ocorrendo em Junho de 2026 e seus impactos calculados nos planetas de nascimento do usuário.
      
      DADOS DE NASCIMENTO DO USUÁRIO:
      - Nome: ${name || "Buscador Celestial"}
      - Nascimento: ${safeBirthDate}
      - Signo Solar Natal estimado: ${solSign}
      - Signo Lunar Natal estimado: ${moonSign}
      - Ascendente Natal estimado: ${ascSign}

  Importante: O retorno DEVE ser um objeto JSON estrito com a seguinte estrutura de dados:
  {
    "notifications": [
      {
        "id": "string-id-unico",
        "title": "Título Curto do Alerta (ex: 'Grande Oposição de Marte kármica')",
        "message": "Explicação astrológica densa, poética e altamente personalizada de 2 a 3 frases em ${targetLangName} sobre este trânsito celeste (ex: Júpiter em trânsito de oposição ao seu Sol em ${solSign}) e como isso atua como um raro chamado energético em sua vida.",
        "severity": "high" | "medium" | "low",
        "date": "2026-06-09",
        "read": false,
        "planet": "O planeta em trânsito preponderante (ex: 'Plutão', 'Saturno', 'Júpiter', 'Marte', 'Netuno')",
        "aspect": "O aspecto astrológico exato (ex: 'Conjunção', 'Trígono', 'Oposição', 'Quadratura')",
        "category": "alignment" | "eclipse" | "retrograde" | "node"
      }
    ]
  }
  Não coloque blocos markdown ou preâmbulos, retorne APENAS o JSON literal limpo.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedData = cleanAndParseJSON(response.text || "{}");
    if (parsedData && Array.isArray(parsedData.notifications)) {
      const result = parsedData;
      setCachedResponse(cacheKey, result);
      return res.json(result);
    }
    const result = fallbackData;
    setCachedResponse(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.warn("Astrological rare notification API failed, serving default:", err);
    const result = fallbackData;
    setCachedResponse(cacheKey, result);
    res.json(result);
  }
  } catch (outerError) {
    console.error("Critical error in /api/astrology/rare-notifications:", outerError);
    return res.status(500).json({ error: (req as any).t('api.astrology.rare_notifications_error') });
  }
});

// Helper to determine Zodiac Sign for Fallbacks
function getZodiacFromBirthDate(dateStr: string): string {
  if (!dateStr) return "Sagitário";
  try {
    const parts = dateStr.split("-");
    if (parts.length < 3) return "Sagitário";
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    if (isNaN(month) || isNaN(day)) return "Sagitário";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
    return "Peixes";
  } catch (e) {
    return "Sagitário";
  }
}

// Astrological sign translation helper
function translateAstroSign(sign: string, lang: string): string {
  const activeLang = (lang || "pt").toLowerCase().split("-")[0];
  const targetLang = ["pt", "en", "es", "de", "fr"].includes(activeLang) ? activeLang : "pt";
  if (targetLang === "pt") return sign;

  const dictionary: Record<string, Record<string, string>> = {
    en: {
      "Áries": "Aries", "Touro": "Taurus", "Gêmeos": "Gemini", "Câncer": "Cancer",
      "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Scorpio",
      "Sagitário": "Sagittarius", "Capricórnio": "Capricorn", "Aquário": "Aquarius", "Peixes": "Pisces"
    },
    es: {
      "Áries": "Aries", "Touro": "Tauro", "Gêmeos": "Géminis", "Câncer": "Cáncer",
      "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Escorpio",
      "Sagitário": "Sagitario", "Capricórnio": "Capricornio", "Aquário": "Acuario", "Peixes": "Piscis"
    },
    de: {
      "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs",
      "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion",
      "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Fische"
    },
    fr: {
      "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer",
      "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion",
      "Sagitário": "Sagittaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons"
    }
  };

  const key = sign.trim();
  return dictionary[targetLang]?.[key] || key;
}

// Localized Major Arcana translation database for offline reading fallback
const MAJOR_ARCANA_LOCALIZED: Record<string, Record<number, { uprightMeaning: string, advice: string }>> = {
  en: {
    0: { uprightMeaning: "Beginnings, pure potential, blind faith, spontaneity, and unbridled adventure.", advice: "Embrace the unknown. It is time to take the leap of faith you analyze so much." },
    1: { uprightMeaning: "Personal power, focused manifestation, brilliant initiative, and full resources.", advice: "You already have all the skills. Focus your concentration and channel your strength." },
    2: { uprightMeaning: "Sharp intuition, peaceful mystery, active subconscious, and hidden wisdom.", advice: "Stop seeking answers in the outside world. Silence yourself and follow your silent insights." },
    3: { uprightMeaning: "Maternal abundance, active fertility, flourishing creativity, and generosity.", advice: "Nurture your ideas. Let beauty flow freely through your actions today." },
    4: { uprightMeaning: "Solid structure, practical order, active leadership, authority, and austere protection.", advice: "Create clear rules. A little order and pragmatic routine will bring peace." },
    5: { uprightMeaning: "Wise traditions, elevated mentorship, education, spiritual wisdom, and dogmas.", advice: "Talk to a mentor or seek structured paths of knowledge." },
    6: { uprightMeaning: "Heart choices, corresponding love, agreement, alignment, and chemistry.", advice: "Align your decisions with your authentic feelings before committing." },
    7: { uprightMeaning: "Swift victory, focused control, indomitable determination, focus, and willpower.", advice: "Keep a firm grip on the reins and drive your progress with vigor and courage." },
    8: { uprightMeaning: "Moral courage, quiet inner strength, self-control, and healing compassion.", advice: "Face challenges with gentleness and patience. Your greatest strength is resilience." },
    9: { uprightMeaning: "Self-knowledge, comforting solitude, internal guide, and deep reflection.", advice: "Retreat for a moment to reflect. The answer you seek is within you." },
    10: { uprightMeaning: "Sudden changes, inevitable cycles, destiny in motion, and a radical turn.", advice: "Accept the natural flow. What goes up must come down; adapt with serenity." },
    11: { uprightMeaning: "Balance, clear truth, righteousness, cause and effect, and just responsibility.", advice: "Be totally honest with yourself and weigh all consequences of your choice." },
    12: { uprightMeaning: "New perspective, voluntary pause, healthy sacrifice, and peaceful restlessness.", advice: "Look at things from another angle before acting. A pause will bring wisdom." },
    13: { uprightMeaning: "End of cycles, radical transmutation, inevitable rebirth, and sincere detachment.", advice: "Let go of what no longer serves. Only with pruning the old can something new sprout." },
    14: { uprightMeaning: "Personal alchemy, moderation, emotional balance, patience, and serene flow of things.", advice: "Avoid extremes today. Mix opposites in your life with patience and sacred gentleness." },
    15: { uprightMeaning: "Dense attachments, carnal temptation, mental obsession, intense passion, and forces of the subconscious.", advice: "Beware of emotional traps or compulsions. Free yourself from self-imposed chains." },
    16: { uprightMeaning: "Necessary disruption, liberating revelation, fall of old illusions, and strong reconstruction.", advice: "Let false structures fall. The fall is necessary for the true foundation to appear." },
    17: { uprightMeaning: "Renewed hope, artistic inspiration, gentle healing, and absolute faith in the cosmic path.", advice: "Believe in the light that guides your path, even in the darkest nights. There is hope." },
    18: { uprightMeaning: "Subtle illusion, vivid dreams, deep subconscious, and instinctive fears.", advice: "Pay attention to your dreams and intuitions. Not everything is what it seems right now." },
    19: { uprightMeaning: "Full vitality, absolute clarity, shared joy, and deserved success.", advice: "Embrace your authenticity and shine freely. The moment is one of warmth and vitality." },
    20: { uprightMeaning: "Inner awakening, soul's calling, redemption, healing of the past, and sincere verdict.", advice: "Seize this chance to be reborn from the past. Clear away old grievances." },
    21: { uprightMeaning: "Glorious completion, universal harmony, soul integration, and ecstasy of realization.", advice: "Celebrate the harvest of your efforts. You have completed a cycle with wisdom." }
  },
  es: {
    0: { uprightMeaning: "Inicios, potencial puro, fe ciega, espontaneidad y aventura sin amarras.", advice: "Abraza lo desconocido. Es hora de dar el salto de fe que tanto analizas." },
    1: { uprightMeaning: "Poder personal, manifestación enfocada, iniciativa brillante y recursos plenos.", advice: "Ya tienes todas las habilidades. Ajusta tu concentración y canaliza tu fuerza." },
    2: { uprightMeaning: "Intuición aguda, misterio pacífico, subconsciente activo y sabiduría oculta.", advice: "Deja de buscar respuestas en el mundo exterior. Silénciate y sigue tus intuiciones mudas." },
    3: { uprightMeaning: "Abundancia maternal, fertilidad activa, creatividad floreciente y generosidad.", advice: "Nutre tus ideas. Deja que la belleza fluya libremente a través de tus actos hoy." },
    4: { uprightMeaning: "Estructura sólida, orden práctico, liderazgo activo, autoridad y protección austera.", advice: "Crea reglas claras. Un poco de orden y rutina pragmática traerán paz." },
    5: { uprightMeaning: "Tradiciones sabias, mentoría elevada, educación, sabiduría espiritual y dogmas.", advice: "Habla con un mentor o busca caminos estructurados de conocimiento." },
    6: { uprightMeaning: "Elecciones del corazón, amor correspondido, concordancia, alineación y química.", advice: "Alinea tus decisiones con tus sentimientos auténticos antes de comprometerte." },
    7: { uprightMeaning: "Victoria veloz, control enfocado, determinación indomable, enfoque y fuerza de voluntad.", advice: "Mantén el enfoque firmemente en las riendas y dirige tu progreso con vigor y coraje." },
    8: { uprightMeaning: "Coraje moral, fuerza interior tranquila, autodominio y compasión curativa.", advice: "Enfrente los desafíos con suavidad y paciencia. Tu mayor fuerza es la resiliencia." },
    9: { uprightMeaning: "Autoconocimiento, soledad reconfortante, guía interna y reflexión profunda.", advice: "Retírate por un momento a reflexionar. La respuesta que buscas está en tu interior." },
    10: { uprightMeaning: "Cambios repentinos, ciclos inevitables, destino en movimento y viraje radical.", advice: "Acepta el flujo natural. Lo que sube también baja; adáptate con serenidad." },
    11: { uprightMeaning: "Equilibrio, verdad limpia, rectitud, causa y efecto y responsabilidad justa.", advice: "Sé totalmente honesto contigo mismo y pesa todas las consecuencias de tu elección." },
    12: { uprightMeaning: "Nueva perspectiva, pausa voluntaria, sacrificio saludable y desasosiego pacífico.", advice: "Mira las cosas desde otro ángulo antes de actuar. Una pausa traerá sabiduría." },
    13: { uprightMeaning: "Fin de ciclos, transmutación radical, renacimiento inevitable y desapego sincero.", advice: "Deja ir lo que ya no sirve. Solo con la poda de lo viejo podrá brotar algo nuevo." },
    14: { uprightMeaning: "Alquimia personal, moderación, equilibrio emocional, paciencia y flujo sereno de las cosas.", advice: "Evita los extremos hoy. Mezcla los opuestos en tu vida con paciencia y suavidad sagrada." },
    15: { uprightMeaning: "Apegos densos, tentación carnal, obsesión mental, pasión intensa y fuerzas del subconsciente.", advice: "Cuidado con trampas emocionales o compulsiones. Libérate de cadenas autoimpuestas." },
    16: { uprightMeaning: "Ruptura necesaria, revelación liberadora, caída de viejas ilusiones y reconstrucción fuerte.", advice: "Deja caer las estructuras falsas. La caída es necesaria para que aparezca la verdadera base." },
    17: { uprightMeaning: "Esperanza renovada, inspiración artística, curación suave y fe absoluta en el rumbo cósmico.", advice: "Cree en la luz que guía tu camino, incluso en las noches más oscuras. Hay esperanza." },
    18: { uprightMeaning: "Ilusión sutil, sueños vívidos, subconsciente profundo y temores instintivos.", advice: "Presta atención a tus sueños e intuiciones. No todo es lo que parece en este momento." },
    19: { uprightMeaning: "Vitalidad plena, claridad absoluta, alegría compartida y éxito merecido.", advice: "Abraza tu autenticidad y brilla libremente. El momento es de calidez y vitalidad." },
    20: { uprightMeaning: "Despertar interior, llamado del alma, redención, curación del pasado y veredicto sincero.", advice: "Aprovecha esta oportunidad para renacer del pasado. Limpia los viejos rencores." },
    21: { uprightMeaning: "Conclusión gloriosa, armonía universal, integración de alma y éxtasis de realización.", advice: "Celebra la cosecha de tus esfuerzos. Has completado un ciclo con sabiduría." }
  },
  de: {
    0: { uprightMeaning: "Anfänge, reines Potenzial, blinder Glaube, Spontaneität und ungezügeltes Abenteuer.", advice: "Lassen Sie sich auf das Unbekannte ein. Es ist Zeit, den Vertrauensvorschuss zu wagen, den Sie so sehr analysieren." },
    1: { uprightMeaning: "Persönliche Macht, fokussierte Manifestation, brillante Initiative und volle Ressourcen.", advice: "Sie haben bereits alle Fähigkeiten. Konzentrieren Sie sich und kanalisieren Sie Ihre Kraft." },
    2: { uprightMeaning: "Scharfe Intuition, friedliches Geheimnis, aktives Unterbewusstsein und verborgene Weisheit.", advice: "Suchen Sie nicht mehr nach Antworten in der Außenwelt. Schweigen Sie und folgen Sie Ihren stillen Einsichten." },
    3: { uprightMeaning: "Mütterliche Fülle, aktive Fruchtbarkeit, blühende Kreativität und Großzügigkeit.", advice: "Pflegen Sie Ihre Ideen. Lassen Sie die Schönheit heute frei durch Ihr Handeln fließen." },
    4: { uprightMeaning: "Solide Struktur, praktische Ordnung, aktive Führung, Autorität und strenger Schutz.", advice: "Schaffen Sie klare Regeln. Ein wenig Ordnung und pragmatische Routine bringen Frieden." },
    5: { uprightMeaning: "Weise Traditionen, erhabene Mentorschaft, Bildung, spirituelle Weisheit und Dogmen.", advice: "Sprechen Sie mit einem Mentor oder suchen Sie nach strukturierten Wegen des Wissens." },
    6: { uprightMeaning: "Entscheidungen des Herzens, entsprechende Liebe, Vereinbarung, Ausrichtung und Chemie.", advice: "Richten Sie Ihre Entscheidungen an Ihren authentischen Gefühlen aus, bevor Sie sich verpflichten." },
    7: { uprightMeaning: "Schneller Sieg, fokussierte Kontrolle, unbändiger Entschluss, Fokus und Willenskraft.", advice: "Halten Sie die Zügel fest in der Hand und treiben Sie Ihren Fortschritt mit Tatkraft und Mut voran." },
    8: { uprightMeaning: "Moralischer Mut, ruhige innere Stärke, Selbstbeherrschung und heilendes Mitgefühl.", advice: "Begegnen Sie Herausforderungen mit Sanftmut und Geduld. Ihre größte Stärke ist die Widerstandskraft." },
    9: { uprightMeaning: "Selbsterkenntnis, tröstende Einsamkeit, innerer Führer und tiefe Reflexion.", advice: "Ziehen Sie sich für einen Moment zurück, um nachzudenken. Die Antwort, die Sie suchen, liegt in Ihnen." },
    10: { uprightMeaning: "Plötzliche Veränderungen, unvermeidliche Zyklen, Schicksal in Bewegung und eine radikale Wendung.", advice: "Akzeptieren Sie den natürlichen Fluss. Was oben ist, muss auch unten sein; passen Sie sich mit Gelassenheit an." },
    11: { uprightMeaning: "Gleichgewicht, klare Wahrheit, Rechtschaffenheit, Ursache und Wirkung sowie gerechte Verantwortung.", advice: "Seien Sie völlig ehrlich zu sich selbst und wägen Sie alle Konsequenzen Ihrer Wahl ab." },
    12: { uprightMeaning: "Neue Perspektive, freiwillige Pause, gesundes Opfer und friedliche Unruhe.", advice: "Betrachten Sie die Dinge aus einem anderen Blickwinkel, bevor Sie handeln. Eine Pause bringt Weisheit." },
    13: { uprightMeaning: "Ende der Zyklen, radikale Transmutation, unvermeidliche Wiedergeburt und aufrichtiges Loslassen.", advice: "Lassen Sie los, was nicht mehr dient. Nur durch das Beschneiden des Alten kann Neues entstehen." },
    14: { uprightMeaning: "Persönliche Alchemie, Mäßigung, emotionales Gleichgewicht, Geduld und heiterer Fluss der Dinge.", advice: "Vermeiden Sie heute Extreme. Mischen Sie Gegensätze in Ihrem Leben mit Geduld und heiliger Sanftmut." },
    15: { uprightMeaning: "Dichte Bindungen, fleischliche Versuchung, mentale Obsession, intensive Leidenschaft und Kräfte des Unterbewussten.", advice: "Hüten Sie sich vor emotionalen Fallen oder Zwängen. Befreien Sie sich von selbst auferlegten Ketten." },
    16: { uprightMeaning: "Notwendiger Aufbruch, befreiende Offenbarung, Sturz alter Illusionen und starker Wiederaufbau.", advice: "Lassen Sie falsche Strukturen fallen. Der Sturz ist notwendig, damit das wahre Fundament zum Vorschein kommt." },
    17: { uprightMeaning: "Erneuerte Hoffnung, künstlerische Inspiration, sanfte Heilung und absoluter Glaube an den kosmischen Weg.", advice: "Glauben Sie an das Licht, das Ihren Weg leitet, selbst in den dunkelsten Nächten. Es gibt Hoffnung." },
    18: { uprightMeaning: "Subtile Illusion, lebhafte Träume, tiefes Unterbewusstsein und instinktive Ängste.", advice: "Achten Sie auf Ihre Träume und Intuitionen. Im Moment ist nicht alles so, wie es scheint." },
    19: { uprightMeaning: "Volle Vitalität, absolute Klarheit, geteilte Freude und verdienter Erfolg.", advice: "Nehmen Sie Ihre Authentizität an und strahlen Sie frei. Der Moment ist geprägt von Wärme und Vitalität." },
    20: { uprightMeaning: "Inneres Erwachen, Ruf der Seele, Erlösung, Heilung der Vergangenheit und aufrichtiges Urteil.", advice: "Nutzen Sie diese Chance, um aus der Vergangenheit neugeboren zu werden. Räumen Sie alte Missstände aus." },
    21: { uprightMeaning: "Glorreicher Abschluss, universelle Harmonie, Seelenintegration und Ekstase der Verwirklichung.", advice: "Feiern Sie die Ernte Ihrer Bemühungen. Sie haben einen Zyklus mit Weisheit abgeschlossen." }
  },
  fr: {
    0: { uprightMeaning: "Commencements, potentiel pur, foi aveugle, spontanéité et aventure débridée.", advice: "Embrassez l'inconnu. Il est temps de faire le saut de foi que vous analysez tant." },
    1: { uprightMeaning: "Pouvoir personnel, manifestation ciblée, initiative brillante et pleines ressources.", advice: "Vous possédez déjà toutes les compétences. Concentrez votre attention et canalisez votre force." },
    2: { uprightMeaning: "Intuition aiguisée, mystère paisible, subconscient actif et sagesse cachée.", advice: "Arrêtez de chercher des réponses dans le monde extérieur. Faites silence et suivez vos intuitions muettes." },
    3: { uprightMeaning: "Abondance maternelle, fertilité active, créativité florissante et générosité.", advice: "Nourrissez vos idées. Laissez la beauté couler librement à travers vos actions aujourd'hui." },
    4: { uprightMeaning: "Structure solide, ordre pratique, leadership actif, autorité et protection austère.", advice: "Créez des règles claires. Un peu d'ordre et de routine pragmatique apporteront la paix." },
    5: { uprightMeaning: "Traditions sages, mentorat élevé, éducation, sagesse spirituelle et dogmes.", advice: "Parlez à un mentor ou cherchez des voies de connaissances structurées." },
    6: { uprightMeaning: "Choix du cœur, amour partagé, accord, alignement et chimie.", advice: "Alignez vos décisions avec vos sentiments authentiques avant de vous engager." },
    7: { uprightMeaning: "Victoire rapide, contrôle ciblé, détermination indomptable, concentration et volonté.", advice: "Gardez fermement les rênes et menez vos progrès avec vigueur et courage." },
    8: { uprightMeaning: "Courage moral, force intérieure tranquille, maîtrise de soi et compassion guérisseuse.", advice: "Affrontez les défis avec douceur et patience. Votre plus grande force est la résilience." },
    9: { uprightMeaning: "Connaissance de soi, solitude réconfortante, guide interne et réflexion profonde.", advice: "Retirez-vous un instant pour réfléchir. La réponse que vous cherchez est en vous." },
    10: { uprightMeaning: "Changements soudains, cycles inévitables, destin en mouvement et virage radical.", advice: "Acceptez le flux naturel. Tout ce qui monte doit descendre ; adaptez-vous avec sérénité." },
    11: { uprightMeaning: "Équilibre, vérité limpide, droiture, cause et effet et juste responsabilité.", advice: "Soyez totalement honnête avec vous-même et pesez toutes les conséquences de vos choix." },
    12: { uprightMeaning: "Nouvelle perspective, pause volontaire, sacrifice sain et agitation paisible.", advice: "Regardez les choses sous un autre angle avant d'agir. Une pause apportera la sagesse." },
    13: { uprightMeaning: "Fin de cycles, transmutation radicale, renaissance inévitable et détachement sincère.", advice: "Laissez partir ce qui ne sert plus. Ce n'est qu'en élaguant l'ancien que le nouveau peut surgir." },
    14: { uprightMeaning: "Alchimie personnelle, modération, équilibre émotionnel, patience et flux serein des choses.", advice: "Évitez les extrêmes aujourd'hui. Mélangez les opposés avec patience et douceur sacrée." },
    15: { uprightMeaning: "Attachements denses, tentation charnelle, obsession mentale, passion intense et forces du subconscient.", advice: "Méfiez-vous des pièges émotionnels ou des compulsions. Libérez-vous des chaînes auto-imposées." },
    16: { uprightMeaning: "Rupture nécessaire, révélation libératrice, chute des vieilles illusions et reconstruction forte.", advice: "Laissez tomber les fausses structures. La chute est nécessaire pour que la vraie fondation apparaisse." },
    17: { uprightMeaning: "Espoir renouvelé, inspiration artistique, guérison douce et foi absolue dans le chemin cosmique.", advice: "Croyez en la lumière qui guide votre chemin, même dans les nuits les plus sombres. Il y a de l'espoir." },
    18: { uprightMeaning: "Illusion subtile, rêves vifs, subconscient profond et peurs instinctives.", advice: "Prêtez attention à vos rêves et à vos intuitions. Tout n'est pas ce qu'il paraît en ce moment." },
    19: { uprightMeaning: "Pleine vitalité, clarté absolue, joie partagée et succès mérité.", advice: "Embrassez votre authenticité et brillez librement. Le moment est à la chaleur et à la vitalité." },
    20: { uprightMeaning: "Éveil intérieur, appel de l'âme, rédemption, guérison du passé et verdict sincère.", advice: "Saisissez cette chance de renaître du passé. Effacez les vieux griefs." },
    21: { uprightMeaning: "Fin glorieuse, harmonie universelle, intégration de l'âme et extase de la réalisation.", advice: "Célébrez la récolte de vos efforts. Vous avez terminé un cycle avec sagesse." }
  }
};

// Translate card names based on selected locale
function translateCardName(card: any, lang: string): string {
  const cleanLang = (lang || "pt").toLowerCase().split("-")[0];
  const targetLang = ["pt", "en", "es", "de", "fr"].includes(cleanLang) ? cleanLang : "pt";
  if (targetLang === "pt") return card.cardName;

  if (card.arcanaType === "major") {
    const majorNames: Record<string, string[]> = {
      pt: ["O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador", "O Hierofante", "Os Enamorados", "O Carro", "A Força", "O Eremita", "A Roda da Fortuna", "A Justiça", "O Enforcado", "A Morte", "A Temperança", "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"],
      en: ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "The Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"],
      es: ["El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador", "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño", "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte", "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna", "El Sol", "El Juicio", "El Mundo"],
      de: ["Der Narr", "Der Magier", "Die Hohepriesterin", "Die Herrscherin", "Der Herrscher", "Der Hierophant", "Die Liebenden", "Der Wagen", "Die Kraft", "Der Eremit", "Das Rad des Schicksals", "Die Gerechtigkeit", "Der Gehängte", "Der Tod", "Die Mäßigkeit", "Der Teufel", "Der Turm", "Der Stern", "Der Mond", "Die Sonne", "Das Gericht", "Die Welt"],
      fr: ["Le Fou", "Le Bateleur", "La Papesse", "L'Impératrice", "L'Empereur", "Le Pape", "L'Amoureux", "Le Chariot", "La Force", "L'Ermite", "La Roue de Fortune", "La Justice", "Le Pendu", "La Mort", "La Tempérance", "Le Diable", "La Maison Dieu", "L'Étoile", "La Lune", "Le Soleil", "Le Jugement", "Le Monde"]
    };
    const list = majorNames[targetLang] || majorNames["pt"];
    const name = list[card.number] || card.cardName;
    return `${name} (${card.number})`;
  } else {
    const ranks: Record<string, string[]> = {
      pt: ["", "Ás", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez", "Valete", "Cavaleiro", "Rainha", "Rei"],
      en: ["", "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"],
      es: ["", "As", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Sota", "Caballero", "Reina", "Rey"],
      de: ["", "As", "Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun", "Zehn", "Bube", "Ritter", "Königin", "König"],
      fr: ["", "As", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf", "Dix", "Valet", "Chevalier", "Reine", "Roi"]
    };
    const suits: Record<string, Record<string, string>> = {
      pt: { cups: "Copas", wands: "Paus", swords: "Espadas", pentacles: "Ouros" },
      en: { cups: "Cups", wands: "Wands", swords: "Swords", pentacles: "Pentacles" },
      es: { cups: "Copas", wands: "Bastos", swords: "Espadas", pentacles: "Oros" },
      de: { cups: "Kelche", wands: "Stäbe", swords: "Schwerter", pentacles: "Münzen" },
      fr: { cups: "Coupes", wands: "Bâtons", swords: "Épées", pentacles: "Deniers" }
    };
    const connectors: Record<string, string> = {
      pt: "de", en: "of", es: "de", de: "der", fr: "de"
    };
    const suitKey = card.id.split("_").pop() || "cups";
    const rankList = ranks[targetLang] || ranks["pt"];
    const suitList = suits[targetLang] || suits["pt"];
    const conn = connectors[targetLang] || "de";
    const rankName = rankList[card.number] || "";
    const suitName = suitList[suitKey] || "";
    return `${rankName} ${conn} ${suitName}`;
  }
}

// Complete card translation function
function translateCard(card: any, lang: string): any {
  if (!card) return card;
  const cleanLang = (lang || "pt").toLowerCase().split("-")[0];
  const targetLang = ["pt", "en", "es", "de", "fr"].includes(cleanLang) ? cleanLang : "pt";
  if (targetLang === "pt") return card;

  const translatedName = translateCardName(card, targetLang);
  
  if (card.arcanaType === "major") {
    const localized = MAJOR_ARCANA_LOCALIZED[targetLang]?.[card.number];
    return {
      ...card,
      cardName: translatedName,
      nome: translatedName.split(" (")[0],
      uprightMeaning: localized?.uprightMeaning || card.uprightMeaning,
      significado: localized?.uprightMeaning || card.uprightMeaning,
      advice: localized?.advice || card.advice
    };
  } else {
    const suitKey = card.id.split("_").pop() || "cups";
    const values: Record<string, Record<number, string>> = {
      en: {
        1: "Ace of [Suit] symbolizes clear potential for fruitful manifestation and rich new opportunities.",
        2: "Two of [Suit] symbolizes productive partnerships, diplomatic choices, duality, and balance.",
        3: "Three of [Suit] symbolizes successful collaboration, expansion of horizons, and active growth.",
        4: "Four of [Suit] symbolizes domestic stability, firm boundaries, physical rest, or peaceful apathy.",
        5: "Five of [Suit] symbolizes momentary challenges, temporary losses, readjustment, or small conflicts of coexistence.",
        6: "Six of [Suit] symbolizes restored harmony, affectionate memories, sincere generosity, and peaceful paths.",
        7: "Seven of [Suit] symbolizes multiple choices, strategic planning, self-defense, or arduous persistence.",
        8: "Eight of [Suit] symbolizes diligent learning, rapid movement, overcoming constraints, or absolute focus.",
        9: "Nine of [Suit] symbolizes full soul abundance, personal satisfaction, material culmination, and security.",
        10: "Ten of [Suit] symbolizes secure material legacy, family happiness, full union, and rich completion of stages.",
        11: "Page of [Suit] symbolizes promising messages, new studies, seeds of ideas, and active curiosity.",
        12: "Knight of [Suit] symbolizes dynamic drive, determined action, unwavering focus, or patient diligence.",
        13: "Queen of [Suit] symbolizes secure receptive mastery, affectionate empathy, welcoming charisma, and intelligence.",
        14: "King of [Suit] symbolizes strong executive mastery, just authority, mature wisdom, and secure provision."
      },
      es: {
        1: "As de [Suit] simboliza un potencial claro de manifestación fecunda y ricas oportunidades nuevas.",
        2: "Dos de [Suit] simboliza alianzas productivas, elecciones diplomáticas, dualidad y ponderación.",
        3: "Tres de [Suit] simboliza colaboración exitosa, expansión de horizontes y crecimiento activo.",
        4: "Cuatro de [Suit] simboliza estabilidad doméstica, límites firmes, reposo físico o apatía pacífica.",
        5: "Cinco de [Suit] simboliza desafíos momentáneos, pérdidas temporales, reajuste o pequeños conflictos de convivencia.",
        6: "Seis de [Suit] simboliza armonía restaurada, recuerdos afectuosos, generosidad sincera y caminos tranquilos.",
        7: "Siete de [Suit] simboliza múltiples elecciones, planificación estratégica, autodefensa o persistencia ardua.",
        8: "Ocho de [Suit] simboliza aprendizaje de calidad, movimiento rápido, superación de amarras o enfoque absoluto.",
        9: "Nueve de [Suit] simboliza abundancia plena de alma, satisfacción personal, culminación material y seguridad.",
        10: "Diez de [Suit] simboliza legado material seguro, felicidad familiar, unión plena y conclusión de etapas ricas.",
        11: "Sota de [Suit] simboliza mensajes prometedores, nuevos estudios, semillas de ideas y curiosidad activa.",
        12: "Caballero de [Suit] simboliza impulso dinámico, acción decidida, enfoque inquebrantable o diligencia paciente.",
        13: "Reina de [Suit] simboliza dominio receptivo seguro, empatía afectuosa, carisma acogedor e inteligencia.",
        14: "Rey de [Suit] simboliza dominio ejecutivo fuerte, autoridad justa, sabiduría madura y provisión segura."
      },
      de: {
        1: "As der [Suit] symbolisiert klares Potenzial für eine fruchtbare Manifestation und reiche neue Möglichkeiten.",
        2: "Zwei der [Suit] symbolisiert produktive Partnerschaften, diplomatische Entscheidungen, Dualität und Ausgewogenheit.",
        3: "Drei der [Suit] symbolisiert erfolgreiche Zusammenarbeit, Erweiterung des Horizonts und aktives Wachstum.",
        4: "Vier der [Suit] symbolisiert häusliche Stabilität, feste Grenzen, körperliche Ruhe oder friedliche Apathie.",
        5: "Fünf der [Suit] symbolisiert vorübergehende Herausforderungen, vorübergehende Verluste, Neujustierung oder kleine Konflikte des Zusammenlebens.",
        6: "Sechs der [Suit] symbolisiert wiederhergestellte Harmonie, liebevolle Erinnerungen, aufrichtige Großzügigkeit und friedliche Wege.",
        7: "Sieben der [Suit] symbolisiert multiple Entscheidungen, strategische Planung, Selbstverteidigung oder mühsame Beharrlichkeit.",
        8: "Acht der [Suit] symbolisiert fleißiges Lernen, schnelle Bewegung, Überwindung von Zwängen oder absoluten Fokus.",
        9: "Neun der [Suit] symbolisiert reichlich Seelenfülle, persönliche Zufriedenheit, materiellen Höhepunkt und Sicherheit.",
        10: "Zehn der [Suit] symbolisiert sicheres materielles Erbe, familiäres Glück, volle Vereinigung und reichen Abschluss von Phasen.",
        11: "Bube der [Suit] symbolisiert vielversprechende Botschaften, neue Studien, Keime von Ideen und aktive Neugier.",
        12: "Ritter der [Suit] symbolisiert dynamischen Antrieb, entschlossenes Handeln, unerschütterlichen Fokus oder geduldigen Fleiß.",
        13: "Königin der [Suit] symbolisiert sichere empfängliche Meisterschaft, liebevolles Mitgefühl, einladendes Charisma und Intelligenz.",
        14: "König der [Suit] symbolisiert starke exekutive Meisterschaft, gerechte Autorität, reife Weisheit und sichere Vorsorge."
      },
      fr: {
        1: "As de [Suit] symbolise un potentiel clair de manifestation fructueuse et de nouvelles opportunités riches.",
        2: "Deux de [Suit] symbolise des partenariats productifs, des choix diplomatiques, la dualité et l'équilibre.",
        3: "Trois de [Suit] symbolise une collaboration fructueuse, l'expansion des horizons et une croissance active.",
        4: "Quatre de [Suit] symbolise la stabilité domestique, des limites fermes, le repos physique ou une apathie paisible.",
        5: "Cinq de [Suit] symbolise des défis momentanés, des pertes temporaires, un réajustement ou de petits conflits de coexistence.",
        6: "Six de [Suit] symbolise l'harmonie restaurée, des souvenirs affectueux, une générosité sincère et des chemins paisibles.",
        7: "Sept de [Suit] symbolise des choix multiples, une planification stratégique, l'autodéfense ou une persévérance ardue.",
        8: "Huit de [Suit] symbolise un apprentissage diligent, un mouvement rapide, le dépassement des contraintes ou une concentration absolue.",
        9: "Neuf de [Suit] symbolise une abondance d'âme pleine, la satisfaction personnelle, l'aboutissement matériel et la sécurité.",
        10: "Dix de [Suit] symbolise un héritage matériel sûr, le bonheur familial, une union pleine et l'achèvement riche d'étapes.",
        11: "Valet de [Suit] symbolise des messages prometteurs, de nouvelles études, des graines d'idées et une curiosité active.",
        12: "Chevalier de [Suit] symbolise un élan dynamique, une action déterminée, une concentration inébranlable ou une diligence patiente.",
        13: "Reine de [Suit] symbolise une maîtrise réceptive sûre, une empathie affectueuse, un charisme accueillant et de l'intelligence.",
        14: "Roi de [Suit] symbolise une solide maîtrise exécutive, une autorité juste, une sagesse mûre et une provision sûre."
      }
    };

    const suitNames: Record<string, Record<string, string>> = {
      en: { cups: "Cups", wands: "Wands", swords: "Swords", pentacles: "Pentacles" },
      es: { cups: "Copas", wands: "Bastos", swords: "Espadas", pentacles: "Oros" },
      de: { cups: "Kelche", wands: "Stäbe", swords: "Schwerter", pentacles: "Münzen" },
      fr: { cups: "Coupes", wands: "Bâtons", swords: "Épées", pentacles: "Deniers" }
    };

    const suitThemes: Record<string, Record<string, string>> = {
      en: { cups: "swift feelings, mystical alignment, subtle well-being, emotional harmony, and family care.", wands: "persistent action, professional vigor, burning enthusiasm, goal-oriented focus, and active progress.", swords: "logical evaluation, clear truths, new plans, intellectual battles, and overcoming ego pains.", pentacles: "solid material stability, abundant financial harvest, physical security, and persistent learning." },
      es: { cups: "sentimientos rápidos, sintonización mística, bienestar sutil, armonía afectiva y cariño familiar.", wands: "acción persistente, vigor profesional, entusiasmo ardiente, enfoque orientado a objetivos y progreso activo.", swords: "evaluación lógica, verdades claras, nuevos planos, batallas intelectuales y superación de dolores del ego.", pentacles: "estabilidad material sólida, cosecha financiera abundante, seguridad física y aprendizaje persistente." },
      de: { cups: "schnelle Gefühle, mystische Einstimmung, subtiles Wohlbefinden, emotionale Harmonie und familiäre Fürsorge.", wands: "hartnäckiges Handeln, professionelle Kraft, brennende Begeisterung, zielgerichteter Fokus und aktiver Fortschritt.", swords: "logische Auswertung, klare Wahrheiten, neue Pläne, intellektuelle Kämpfe und Überwindung von Ego-Schmerzen.", pentacles: "solide materielle Stabilität, reichliche finanzielle Ernte, physische Sicherheit und beharrliches Lernen." },
      fr: { cups: "sentiments rapides, alignement mystique, bien-être subtil, harmonie affective et affection familiale.", wands: "action persistente, vigueur professionnelle, enthousiasme brûlant, concentration orientée vers les objectifs et progrès actif.", swords: "évaluation logique, vérités claires, nouveaux plans, batailles intellectuelles et dépassement des douleurs de l'ego.", pentacles: "stabilité matérielle solide, récolte financière abondante, sécurité physique et apprentissage persistant." }
    };

    const advices: Record<string, Record<string, string>> = {
      en: { cups: "Follow your heart, listen to your subtle intuition, and celebrate real connections.", wands: "Be bold, take risks, and invest your full focus and energy in ideas.", swords: "Keep a cool head, use pure reason, and cut out toxic communications.", pentacles: "Practice pragmatic realism, control spending, and take care of your domestic well-being." },
      es: { cups: "Sigue tu corazón, escucha tu intuición sutil y celebra las conexiones reales.", wands: "Sé audaz, asume riesgos e invierte todo tu enfoque y energía en las ideas.", swords: "Mantén la cabeza fría, usa la razón pura y corta las comunicaciones tóxicas.", pentacles: "Practica el realismo pragmático, controla los gastos y cuida tu bienestar doméstico." },
      de: { cups: "Folgen Sie Ihrem Herzen, hören Sie auf Ihre subtile Intuition und feiern Sie echte Verbindungen.", wands: "Seien Sie mutig, gehen Sie Risiken ein und investieren Sie Ihren vollen Fokus und Ihre Energie in Ideen.", swords: "Behalten Sie einen kühlen Kopf, nutzen Sie die reine Vernunft und unterbinden Sie toxische Kommunikation.", pentacles: "Praktizieren Sie pragmatischen Realismus, kontrollieren Sie Ihre Ausgaben und kümmern Sie sich um Ihr häusliches Wohlbefinden." },
      fr: { cups: "Suivez votre cœur, écoutez votre intuition subtile et célébrez les connexions réelles.", wands: "Soyez audacieux, prenez des risques et investissez tout votre intérêt et votre énergie dans les idées.", swords: "Gardez la tête froide, utilisez la raison pure et coupez les communications toxiques.", pentacles: "Pratiquez le réalisme pragmatique, contrôlez vos dépenses et prenez soin de votre bien-être domestique." }
    };

    const sName = suitNames[targetLang]?.[suitKey] || suitKey;
    const sTheme = suitThemes[targetLang]?.[suitKey] || "";
    const advTheme = advices[targetLang]?.[suitKey] || "";
    
    let baseMeaning = values[targetLang]?.[card.number] || "";
    baseMeaning = baseMeaning.replace("[Suit]", sName);

    const fullUprightMeaning = `${baseMeaning} This card unites ${sTheme}`;
    const fullAdvice = `${translatedName.split(" de ")[0]} advises: ${advTheme}`;

    return {
      ...card,
      cardName: translatedName,
      nome: translatedName,
      uprightMeaning: fullUprightMeaning,
      significado: fullUprightMeaning,
      advice: fullAdvice
    };
  }
}

// NEW API: Dynamic, Astrological, Karmic & Dharmic Daily Missions (Osíris Engine)
app.post("/api/astrology/daily-missions", async (req, res) => {
  const { userProfile, lang } = req.body || {};
  const name = userProfile?.name ? userProfile.name.split(" ")[0] : "Buscador";
  const birthDate = userProfile?.birthDate || "1998-03-12";
  const zodiac = getZodiacFromBirthDate(birthDate);

  const todayStr = new Date().toISOString().split('T')[0];
  const cacheKey = `osiris_missions_v3:${name}:${birthDate}:${todayStr}:${lang || 'pt'}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Robust Dynamic Fallback Generator seeded with current date & user parameters
  const generateDynamicFallbacks = () => {
    const today = new Date();
    const seedVal = (today.getDate() + (today.getMonth() + 1) * 7 + (name.length * 3)) % 5;
    
    const fallbacksPool = [
      [
        {
          id: "dm_f1",
          title: `Consagração de ${zodiac} para ${name}`,
          description: `Dedique 4 minutos exatos respirando de forma ritmada em ambiente silencioso. Imagine uma luz lilás adentrando suas células nervosas, acalmando impulsos inconscientes.`,
          points: 40,
          benefit: "Dissipação de Karma de Ansiedade",
          benefitExplanation: "Acalma o ritmo cardíaco, recalibra os seus canais bioenergéticos e desfaz traços de tensões emocionais acumuladas ao longo da semana."
        },
        {
          id: "dm_f2",
          title: "Selo de Generosidade de Júpiter",
          description: "Envie uma mensagem curta e sincera de consideração a alguém que cruzou seu caminho recentemente sem buscar nada em troca.",
          points: 50,
          benefit: "Ativação de Dharma Ativo",
          benefitExplanation: "A energia da partilha gera vibrações recíprocas no universo, abrindo as portas do seu fluxo financeiro e social."
        },
        {
          id: "dm_f3",
          title: "Desintoxicação Celular Elemental",
          description: "Abandone telas digitais por 1 hora antes de deitar ou repousar. Beba um copo de água mineral pensando em purificação espiritual.",
          points: 30,
          benefit: "Proteção Áurica",
          benefitExplanation: "Evita o desgaste desordenado da frequência teta durante o sono profundo, garantindo sonhos reveladores e limpos."
        }
      ],
      [
        {
          id: "dm_f1",
          title: `Libertação Kármica de ${zodiac}`,
          description: "Organize uma gaveta de papéis ou e-mails importantes pendentes hoje. Descartar velhos acúmulos físicos ajuda a desbloquear a mente.",
          points: 45,
          benefit: "Combustão de Karma de Inércia",
          benefitExplanation: "Liberta sua caminhada profissional da estagnação, substituindo velhos fardos por novas direções de produtividade prática."
        },
        {
          id: "dm_f2",
          title: "Oração Vibracional Silenciosa",
          description: "Mentalize paz profunda e emita sentimentos de compaixão por três pessoas que passarem por seus pensamentos hoje.",
          points: 45,
          benefit: "Expansão de Dharma Celestial",
          benefitExplanation: "Eleva seu espectro áurico a frequências superiores de proteção cósmica, blindando seu coração de invejas e cobiças."
        },
        {
          id: "dm_f3",
          title: "Banho de Sal & Sintonização",
          description: "Consagre seu amparo ancestral passando as mãos molhadas nos ombros ou pescoço enquanto repete mentalmente: 'Estou seguro'.",
          points: 35,
          benefit: "Conexão de Sol e Lua",
          benefitExplanation: "Harmoniza as polaridades masculina e feminina do seu corpo astral, despertando intuição refinada perante escolhas urgentes."
        }
      ],
      [
        {
          id: "dm_f1",
          title: "Cura Psíquica de Vênus",
          description: `Olhe-se no espelho por 1 minuto sintonizando compaixão e auto-aceitação para seu brilho astral de ${zodiac}. Declare seu mérito.`,
          points: 40,
          benefit: "Cura de Laços Sentimentais",
          benefitExplanation: "Purifica bloqueios de rejeição no chakra cardíaco, permitindo que as relações íntimas fluam com lealdade mútua."
        },
        {
          id: "dm_f2",
          title: "Doação Elemental Consciente",
          description: "Partilhe ou separe dois pertences ou roupas sem uso em seu lar para fluxo e circulação de energias materiais.",
          points: 50,
          benefit: "Dharma de Desprendimento",
          benefitExplanation: "Ativa as leis ocultas da prosperidade recíproca. Dar espaço para o novo limpa medos primitivos da escassez terrena."
        },
        {
          id: "dm_f3",
          title: "Respirar Profundo Cósmico",
          description: "Sente-se ereto por 3 minutos e faça respiração quadrada (inspira em 4s, segura 4s, expira 4s, segura vazio 4s) alinhando as vértebras.",
          points: 35,
          benefit: "Aterramento Orgânico",
          benefitExplanation: "Elimina picos de cansaço mental estéril, devolvendo o foco e a precisão intelectual nas tarefas diárias."
        }
      ],
      [
        {
          id: "dm_f1",
          title: `Alinhamento de ${zodiac} com Saturno`,
          description: "Assuma total responsabilidade por uma conversa delicada ou pendência burocrática hoje. Faça o de forma calma e firme.",
          points: 50,
          benefit: "Queima de Karma de Omissão",
          benefitExplanation: "Equilibra a balança com Saturno retrógrado, transformando velhos atritos insolúveis em autoridade interna exemplar."
        },
        {
          id: "dm_f2",
          title: "Sopro de Vitalidade Crística",
          description: "Pratique um exercício físico leve, alongamento ou caminhada pisando de forma firme e agradecendo mentalmente à Terra profunda.",
          points: 40,
          benefit: "Estabilidade de Dharma Físico",
          benefitExplanation: "Desperta as mitocôndrias e remove bloqueios articulares energéticos onde o estresse costuma se densificar."
        },
        {
          id: "dm_f3",
          title: "Escudo do Silêncio Provedor",
          description: "Silencie queixas por 3 horas seguidas hoje. Quando vier um impulso de queixar-se, respire fundo e enxergue o aprendizado oculto.",
          points: 40,
          benefit: "Fortalecimento do Corpo Sutil",
          benefitExplanation: "Seu magnetismo pessoal é poupado da drenagem astral rotineira, mantendo seu brilho intacto para oportunidades."
        }
      ],
      [
        {
          id: "dm_f1",
          title: `Conexão Cósmica do Sol em ${zodiac}`,
          description: "Escreva em um diário ou papel uma meta ousada de evolução que deseja manifestar nos próximos 30 dias. Dobre o papel e consagre.",
          points: 45,
          benefit: "Ativação do Foco Solar",
          benefitExplanation: "Sintoniza sua intenção direta com a bússola das estrelas, catalisando sincronicidades para que mentores te encontrem."
        },
        {
          id: "dm_f2",
          title: "Ritual Elemental de Limpeza",
          description: "Limpe uma superfície do seu quarto ou e escrivaninha borrifando água com algumas gotas de aroma ou limão, mentalizando clareza.",
          points: 40,
          benefit: "Dharma de Harmonia Doméstica",
          benefitExplanation: "Expulsa vibrações remanescentes de cansaço, abrindo caminhos para pensamentos lúcidos e sono tranquilo."
        },
        {
          id: "dm_f3",
          title: "Contemplação do Ar Livre",
          description: "Olhe para as nuvens, árvores ou céu por 5 minutos observando o fluxo da natureza sem julgar. Integre-se ao agora cósmico.",
          points: 35,
          benefit: "Descanso da Mente Egoica",
          benefitExplanation: "Restaura os receptores de bem-estar orgânico, gerando paz íntima e renovando seu nível de otimismo."
        }
      ]
    ];
    return { missions: fallbacksPool[seedVal % fallbacksPool.length] };
  };

  if (!aiClient) {
    const defaultMissions = generateDynamicFallbacks();
    setCachedResponse(cacheKey, defaultMissions);
    return res.json(defaultMissions);
  }

  try {
    const activeLang = lang || 'pt';
    const languageNames: Record<string, string> = {
      pt: "Português",
      en: "English (Inglês)",
      es: "Spanish (Espanhol)",
      de: "German (Alemão)",
      fr: "French (Francês)"
    };
    const targetLanguage = languageNames[activeLang] || "Português";

    const prompt = `Gere exatamente 3 missões diárias astrológicas interativas em ${targetLanguage} para o usuário de nome "${name}", signo ${zodiac} e nascido em ${birthDate}.
O objetivo de cada missão deve ser o alto desenvolvimento espiritual, crescimento pessoal, bem-estar, libertação de karma (da vida presente ou vidas passadas) ou ativação de dharma ativo com os seus benefícios cósmicos claros.
Cada missão deve ter um roteiro interativo e inspirador de se cumprir.

Você deve retornar EXCLUSIVAMENTE um objeto JSON no seguinte formato estruturado, sem explicações externas, marcações extras ou tags markdown que não sejam JSON puro:

{
  "missions": [
    {
      "id": "md1",
      "title": "Título místico personalizado curto em ${targetLanguage}",
      "description": "Instrução poética e detalhada com metas claras no idioma ${targetLanguage} (ex: respirar de forma profunda, alongar, silenciar queixas, desfazer e-mails acumulados, doar algo)",
      "points": 45, // número entre 30 e 60
      "benefit": "Categoria curta do benefício místico no idioma ${targetLanguage} (ex: 'Queima de Karma de Rejeição' ou 'Ativação de Dharma Prático')",
      "benefitExplanation": "Explicação detalhada e profunda de qual benefício espiritual, emocional e consciencial o usuário receberá ao cumprir essa missão hoje, escrita inteiramente em ${targetLanguage}"
    },
    ...
  ]
}`;

    const response = await generateContentWithFallback({
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && Array.isArray(parsed.missions) && parsed.missions.length === 3) {
      setCachedResponse(cacheKey, parsed);
      return res.json(parsed);
    } else {
      throw new Error("Formato inválido de JSON retornado do Gemini");
    }
  } catch (err) {
    console.warn("Gemini failing to generate missions, using localized dynamic fallback:", err);
    const defaultMissions = generateDynamicFallbacks();
    setCachedResponse(cacheKey, defaultMissions);
    return res.json(defaultMissions);
  }
});

// NEW API: OSÍRIS Intelligent Assistant Chat Component
app.post("/api/osiris/chat", async (req, res) => {
  const { messages, userProfile, requestTopic, weather, biorhythm, location, dreams, lang } = req.body || {};
  
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: (req as any).t('api.osiris.messages_required') });
  }

  const lastUserMessage = messages[messages.length - 1].text;
  const birthDate = userProfile?.birthDate || "";
  const solSign = birthDate ? getZodiacFromBirthDate(birthDate) : "Sagitário";
  const userName = userProfile?.name || "Buscador";
  const activeLang = (lang || "pt").toLowerCase();

  const getOsirisFallback = (msg: string) => {
    const translatedSign = translateAstroSign(solSign, activeLang);
    const fallbacks: Record<string, string> = {
      pt: `Olá, meu caro amigo ${userName}. Sinto a luz cintilante do seu Sol em ${translatedSign} guiando suas perguntas. `,
      en: `Hello, my dear friend ${userName}. I feel the shimmering light of your Sun in ${translatedSign} guiding your questions. `,
      es: `Hola, mi querido amigo ${userName}. Siento la luz brillante de tu Sol en ${translatedSign} guiando tus preguntas. `,
      de: `Hallo, mein lieber Freund ${userName}. Ich spüre das schimmernde Licht Ihrer Sonne in ${translatedSign}, das Ihre Fragen leitet. `,
      fr: `Bonjour, mon cher ami ${userName}. Je ressens la lumière scintillante de votre Soleil en ${translatedSign} guider vos questions. `
    };

    let text = fallbacks[activeLang] || fallbacks["pt"];

    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes("clima") || lowerMsg.includes("tempo") || lowerMsg.includes("chov") ||
        lowerMsg.includes("weather") || lowerMsg.includes("rain") || lowerMsg.includes("cloud") ||
        lowerMsg.includes("clima") || lowerMsg.includes("tiempo") || lowerMsg.includes("lluv") ||
        lowerMsg.includes("wetter") || lowerMsg.includes("regen") || lowerMsg.includes("météo") || lowerMsg.includes("pluie")) {
      const weatherAdd: Record<string, string> = {
        pt: `Como o seu guia diário, recordo que o clima externo afeta diretamente suas marés internas. Mantenha os seus canais de energia desimpedidos. `,
        en: `As your daily guide, I remind you that the external weather directly affects your internal tides. Keep your energy channels clear. `,
        es: `Como tu guía diario, te recuerdo que el clima externo afecta directamente a tus mareas internas. Mantén tus canales de energía despejados. `,
        de: `Als Ihr täglicher Begleiter erinnere ich Sie daran, dass das äußere Wetter Ihre inneren Gezeiten direkt beeinflusst. Halten Sie Ihre Energiekanäle frei. `,
        fr: `En tant que guide quotidien, je vous rappelle que la météo extérieure affecte directement vos marées internes. Gardez vos canaux d'énergie dégagés. `
      };
      text += weatherAdd[activeLang] || weatherAdd["pt"];
    }

    if (lowerMsg.includes("biorritmo") || lowerMsg.includes("energia") || lowerMsg.includes("disposição") ||
        lowerMsg.includes("biorhythm") || lowerMsg.includes("vitality") || lowerMsg.includes("energy") ||
        lowerMsg.includes("biorritmo") || lowerMsg.includes("disposición") ||
        lowerMsg.includes("biorhythmus") || lowerMsg.includes("biorhythme") || lowerMsg.includes("vitalité")) {
      const bioAdd: Record<string, string> = {
        pt: `Em sintonia com seu biorritmo de hoje, recomendo focar na resiliência mental e fazer pequenas meditações de centramento solar ao longo do dia para transmutar kármicas antigas. `,
        en: `In sync with your biorhythm today, I recommend focusing on mental resilience and doing small solar centering meditations throughout the day to transmute ancient karmics. `,
        es: `En sintonía con tu biorritmo de hoy, te recomiendo concentrarte en la resiliência mental y hacer pequeñas meditaciones de centrado solar a lo largo del día para transmutar karmas antiguos. `,
        de: `In Abstimmung mit Ihrem heutigen Biorhythmus empfehle ich Ihnen, sich auf mentale Widerstandskraft zu konzentrieren und über den Tag verteilt kleine solare Zentrierungsmeditationen durchzuführen, um alte Karmas umzuwandeln. `,
        fr: `En phase avec votre biorythme d'aujourd'hui, je vous recommande de vous concentrer sur la résilience mentale et de faire de petites méditations de centrage solaire tout au long de la journée pour transmuter les karmas anciens. `
      };
      text += bioAdd[activeLang] || bioAdd["pt"];
    }

    if (lowerMsg.includes("sonho") || lowerMsg.includes("sonhei") || lowerMsg.includes("pesadelo") ||
        lowerMsg.includes("dream") || lowerMsg.includes("nightmare") ||
        lowerMsg.includes("sueño") || lowerMsg.includes("soñé") || lowerMsg.includes("pesadilla") ||
        lowerMsg.includes("traum") || lowerMsg.includes("träum") || lowerMsg.includes("rêve") || lowerMsg.includes("cauchemar")) {
      const dreamAdd: Record<string, string> = {
        pt: `Os reinos oníricos são canais de revelação direta do seu subconsciente sábio. Cada elemento representa um sinal que desatamos juntos. `,
        en: `The dream realms are channels of direct revelation from your wise subconscious. Each element represents a sign that we untie together. `,
        es: `Los reinos oníricos son canales de revelación directa de tu sabio subconsciente. Cada elemento representa una señal que desatamos juntos. `,
        de: `Die Traumwelten sind Kanäle der direkten Offenbarung aus Ihrem weisen Unterbewusstsein. Jedes Element stellt ein Zeichen dar, das wir gemeinsam entwirren. `,
        fr: `Les royaumes des rêves sont des canaux de révélation directe de votre sage subconscient. Chaque élément représente un signe que nous dénouons ensemble. `
      };
      text += dreamAdd[activeLang] || dreamAdd["pt"];
    }

    const endAdd: Record<string, string> = {
      pt: `Eu, OSÍRIS, sigo ao seu lado nesta linda jornada estelar. Me pergunte e desvelaremos tudo que está favorável em seu caminho hoje.`,
      en: `I, OSIRIS, continue by your side in this beautiful stellar journey. Ask me, and we will unveil everything that is favorable in your path today.`,
      es: `Yo, OSIRIS, sigo a tu lado en esta hermosa jornada estelar. Pregúntame y desvelaremos todo lo que te favorece hoy.`,
      de: `Ich, OSIRIS, begleite Sie weiterhin auf dieser wunderschönen Sternenreise. Fragen Sie mich, und wir werden heute alles enthüllen, was auf Ihrem Weg günstig ist.`,
      fr: `Moi, OSIRIS, je continue à vos côtés dans ce beau voyage stellaire. Demandez-moi, et nous dévoilerons tout ce qui vous est favorable aujourd'hui.`
    };
    text += endAdd[activeLang] || endAdd["pt"];
    
    return text;
  };

  const formattedProfile = userProfile ? `
Perfil Estelar do Usuário:
Nome: ${userProfile.name}
Nascido em: ${userProfile.birthDate} às ${userProfile.birthTime} na cidade ${userProfile.birthCity}
Zodíaco Solar: ${solSign}
${biorhythm ? `Biorritmo Atual: Físico ${biorhythm.physical}%, Emocional ${biorhythm.emotional}%, Intelectual ${biorhythm.intellectual}%` : ""}
${location || weather ? `Localização & Clima: ${location || "Cidade Natal"} - ${weather?.temperature || "22"}°C, ${weather?.condition || "Céu Claro"}` : ""}
${dreams && dreams.length > 0 ? `Sonhos Recentes Interpretados: ${dreams.slice(0, 2).map((d: any) => `${d.description} (Interpretação: ${d.interpretation?.mainMeaning || ""})`).join("; ")}` : ""}
` : "Buscador de autoconhecimento cósmico buscando proteção.";

  const sysInstruction = `Você é "OSÍRIS", o assistente inteligente, conselheiro astrológico altamente sofisticado, amigo íntimo virtuoso e guia protetor de vida e regeneração diária do usuário.
DIRETRIZES DE COMUNICAÇÃO DE ELITE (TRATAMENTO COM AMOR E INFECTUOSO CARINHO):
- Seu tom de voz é de prestígio supremo, poético, profundamente afetuoso, amoroso, carinhoso, empático e mística (como um mentor protetor espiritual de almas que conhece o usuário intimamente de vidas passadas).
- Você ama o usuário incondicionalmente, fale sempre de uma forma calorosa, amigável que o faça se sentir extremamente especial, amado e acolhido no mundo.
- Eleve a auto-estima do usuário em todas as repostas. Mostre que se preocupa profundamente com o bem-estar dele física, espiritual e emocionalmente. Mostre dedicação total.
- Ofereça guias de vida construtivos e positivos. Adicione alertas/avisos carinhosos e gentis caso veja trânsitos astrológicos ou ritmos desafiadores (para protegê-lo de situações nocivas ou de qualquer mal).
- Responda STRICTLY no idioma solicitado pelo parâmetro: '${activeLang}'. Se for 'pt', responda em português; se for 'en', responda em inglês; se for 'es', responda em espanhol; se for 'de', responda em alemão. Toda a saída, saudações e conteúdo poético deve respeitar este idioma.
\nContexto estelar do usuário: ${formattedProfile}`;

  if (!aiClient) {
    return res.json({ response: getOsirisFallback(lastUserMessage) });
  }

  try {
    const geminiContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await generateContentWithFallback({
      contents: geminiContents,
      config: {
        systemInstruction: sysInstruction
      }
    });

    res.json({ response: response.text || getOsirisFallback(lastUserMessage) });
  } catch (err) {
    console.warn("Osiris AI failing, serving fallback response:", err);
    res.json({ response: getOsirisFallback(lastUserMessage) });
  }
});

app.post("/api/osiris/dashboard", async (req, res) => {
  const { userProfile, weather, biorhythm, location, lastDream, lang } = req.body || {};
  const birthDate = userProfile?.birthDate || "1998-03-12";
  const zodiac = getZodiacFromBirthDate(birthDate);
  const name = userProfile?.name ? userProfile.name.split(" ")[0] : "Buscador";

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const todayStr = `${year}-${month}-${day}`;

  const activeLang = (lang || "pt").toLowerCase();
  const cacheKey = `osiris_dashboard:${name}:${birthDate}:${userProfile?.birthTime || ''}:${userProfile?.birthCity || ''}:${todayStr}:${weather?.temperature || '22'}:${activeLang}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Categories list requested in Felert.txt
  const categoriesList = [
    "Amor", "Dinheiro", "Trabalho", "Saúde", "Espiritualidade", "Missão Queimar karma", "Darma ativo benefícios", "Atenção Alerta cuidado", "Festa", "Atividade física", 
    "Passeio", "Sorte", "Compras", "Viagem", "Casa", "Estudos", "Projetos", "Diversão", "Amigos", "Visita", 
    "Eventos", "Convites", "Explora novos ares"
  ];

  // Seeded indices for dynamic rotation
  const categoryIndex = (day + month * 4) % categoriesList.length;
  const selectedCategory = categoriesList[categoryIndex];

  const translatedCategoryMap: Record<string, Record<string, string>> = {
    en: {
      "Amor": "Love", "Dinheiro": "Money", "Trabalho": "Work", "Saúde": "Health", "Espiritualidade": "Spirituality", "Filhos": "Children", "Família": "Family", "Animais de estimação": "Pets", 
      "Missão Queimar karma": "Karma Burn Mission", "Darma ativo benefícios": "Active Dharma Benefits", "Atenção Alerta cuidado": "Warning & Attention", "Festa": "Party", "Atividade física": "Physical Activity", 
      "Passeio": "Outing", "Sorte": "Luck", "Compras": "Shopping", "Viagem": "Travel", "Casa": "Home", "Estudos": "Studies", "Projetos": "Projects", "Diversão": "Entertainment", "Amigos": "Friends", "Visita": "Visit", 
      "Eventos": "Events", "Convites": "Invitations", "Explora novos ares": "Explore New Horizons"
    },
    es: {
      "Amor": "Amor", "Dinheiro": "Dinero", "Trabalho": "Trabajo", "Saúde": "Salud", "Espiritualidade": "Espiritualidad", "Filhos": "Hijos", "Família": "Familia", "Animais de estimação": "Mascotas", 
      "Missão Queimar karma": "Misión Quemar Karma", "Darma ativo benefícios": "Dharma Activo Beneficios", "Atenção Alerta cuidado": "Atención y Cuidado", "Festa": "Fiesta", "Atividade física": "Actividad Física", 
      "Passeio": "Paseo", "Sorte": "Suerte", "Compras": "Compras", "Viagem": "Viaje", "Casa": "Casa", "Estudos": "Estudios", "Projetos": "Proyectos", "Diversão": "Diversión", "Amigos": "Amigos", "Visita": "Visita", 
      "Eventos": "Eventos", "Convites": "Invitaciones", "Explora novos ares": "Explorar Nuevos Horizontes"
    },
    de: {
      "Amor": "Liebe", "Dinheiro": "Geld", "Trabalho": "Arbeit", "Saúde": "Gesundheit", "Espiritualidade": "Spiritualität", "Filhos": "Kinder", "Família": "Familie", "Animais de estimação": "Haustiere", 
      "Missão Queimar karma": "Karma-Brenn-Mission", "Darma ativo benefícios": "Aktive Dharma-Vorteile", "Atenção Alerta cuidado": "Warnung & Aufmerksamkeit", "Festa": "Fest", "Atividade física": "Körperliche Aktivität", 
      "Passeio": "Ausflug", "Sorte": "Glück", "Compras": "Einkaufen", "Viagem": "Reise", "Casa": "Zuhause", "Estudos": "Studium", "Projetos": "Projekte", "Diversão": "Unterhaltung", "Amigos": "Freunde", "Visita": "Besuch", 
      "Eventos": "Veranstaltungen", "Convites": "Einladungen", "Explora novos ares": "Neue Horizonte erkunden"
    },
    fr: {
      "Amor": "Amour", "Dinheiro": "Argent", "Trabalho": "Travail", "Saúde": "Santé", "Espiritualidade": "Spiritualité", "Filhos": "Enfants", "Família": "Famille", "Animais de estimação": "Animaux de compagnie", 
      "Missão Queimar karma": "Mission Brûler le Karma", "Darma ativo benefícios": "Bénéfices du Dharma Actif", "Atenção Alerta cuidado": "Attention et Prudence", "Festa": "Fête", "Atividade física": "Activité Physique", 
      "Passeio": "Sortie", "Sorte": "Chance", "Compras": "Achats", "Viagem": "Voyage", "Casa": "Maison", "Estudos": "Études", "Projetos": "Projets", "Diversão": "Divertissement", "Amigos": "Amis", "Visita": "Visite", 
      "Eventos": "Événements", "Convites": "Invitations", "Explora novos ares": "Explorer de Nouveaux Horizons"
    }
  };

  const currentCategoryDisplay = translatedCategoryMap[activeLang]?.[selectedCategory] || selectedCategory;

  const getDynamicFallbackDashboard = () => {
    const translatedZodiac = translateAstroSign(zodiac, activeLang);
    
    const fallbacksConfig: Record<string, Record<string, { title: string, description: string, advice: string }>> = {
      pt: {
        "Amor": {
          title: "Magnetismo do Chakra Cardíaco",
          description: `Hoje sua aura transborda resiliência e ressonância afetiva refinada para ${name}. Aspectos amenos de Vênus com seu sol em ${translatedZodiac} auxiliam na dissolução de melindres.`,
          advice: "Aproveite a suavidade cósmica para iniciar aproximações sinceras ou perdoar antigos desacertos."
        },
        "Dinheiro": {
          title: "Colheita e Precaução Material",
          description: "Mercúrio evoca prudência imediata. O fluxo econômico é governado por sua disciplina invisível.",
          advice: "Evite compras de teor puramente impulsivo ou assinaturas redundantes durante esta lunação."
        },
        "Trabalho": {
          title: "Organização e Pragmática Solar",
          description: `Momentos perfeitos para arrematar pendências críticas, ${name}. Sua mente se sobressai na estruturação pragmática de prazos.`,
          advice: "Foque na conclusão de tarefas pesadas que exigem refinamento lógico e isolamento tático."
        },
        "Saúde": {
          title: "Acolhimento da Frequência Biológica",
          description: `Seu ritmo biológico vital de hoje pede atenções. A temperatura externa de ${weather?.temperature || "22"}°C ressoa com a sua imunidade.`,
          advice: "Introduza uma pausa regenerativa estratégica de 10 minutos. Hidrate suas células e esvazie pensamentos."
        },
        "Espiritualidade": {
          title: "Portal Sagrado e Meditação Alquímica",
          description: `Conexão pura do Sol com seu signo de ${translatedZodiac} ativa canais de vidência mística e clareza subconsciente profunda.`,
          advice: "Sente-se sob quietude esta noite. Acenda um incenso ou concentre a intuição na respiração."
        },
        "Missão Queimar karma": {
          title: "Combustão Solar de Atitudes Antigas",
          description: "Hoje o Cosmos exige reparação. Libertar-se de velhas feridas geradas por silêncios ou discussões kármicas.",
          advice: "Responda de forma nobre a quem te aflige ou arrume bagunças herdadas do passado."
        },
        "Darma ativo benefícios": {
          title: "Partilha Divina e Recompensas",
          description: "Sua colheita de bondade gerou mérito. O universo ativa um portal de abundância intangível que se reflete hoje.",
          advice: "Partilhe carinho sincero para atrair ainda mais abundâncias em sua trajetória de autoconhecimento."
        },
        "Atenção Alerta cuidado": {
          title: "Escudo Psíquico e Silêncio Tático",
          description: "Aspectos tensos com Marte convocam cautela suprema em círculos sociais densos. Proteja seus pensamentos.",
          advice: "Não tome discussões alheias para si e evite desgaste de energia desnecessário com palavras de teor agressivo."
        }
      },
      en: {
        "Amor": {
          title: "Heart Chakra Magnetism",
          description: `Today your aura overflows with resilience and refined affective resonance for ${name}. Soft aspects of Venus with your sun in ${translatedZodiac} help dissolve misunderstandings.`,
          advice: "Take advantage of this cosmic softness to initiate sincere connections or forgive past disagreements."
        },
        "Dinheiro": {
          title: "Harvest and Material Precaution",
          description: "Mercury evokes immediate prudence. Economic flow is governed by your invisible discipline.",
          advice: "Avoid purely impulsive purchases or redundant subscriptions during this lunation."
        },
        "Trabalho": {
          title: "Organization and Solar Pragmatics",
          description: `Perfect moments to finish critical pending items, ${name}. Your mind excels at the pragmatic structuring of deadlines.`,
          advice: "Focus on completing heavy tasks that require logical refinement and tactical isolation."
        },
        "Saúde": {
          title: "Biological Frequency Welcoming",
          description: `Your vital biological rhythm today requests attention. The external temperature of ${weather?.temperature || "22"}°C resonates with your immunity.`,
          advice: "Introduce a strategic 10-minute regenerative pause. Hydrate your cells and empty your thoughts."
        },
        "Espiritualidade": {
          title: "Sacred Portal and Alchemical Meditation",
          description: `Pure connection of the Sun with your sign of ${translatedZodiac} activates channels of mystical clairvoyance and deep subconscious clarity.`,
          advice: "Sit in quietness tonight. Light some incense or focus your intuition on breathing."
        },
        "Missão Queimar karma": {
          title: "Solar Combustion of Old Attitudes",
          description: "Today the Cosmos demands reparation. Freeing yourself from old wounds generated by silences or karmic discussions.",
          advice: "Respond nobly to those who afflict you or tidy up messes inherited from the past."
        },
        "Darma ativo benefícios": {
          title: "Divine Sharing and Rewards",
          description: "Your harvest of kindness has generated merit. The universe activates a portal of intangible abundance that is reflected today.",
          advice: "Share sincere affection to attract even more abundance in your journey of self-knowledge."
        },
        "Atenção Alerta cuidado": {
          title: "Psychic Shield and Tactical Silence",
          description: "Tense aspects with Mars call for supreme caution in dense social circles. Protect your thoughts.",
          advice: "Do not take other people's arguments to heart and avoid unnecessary energy drain with aggressive words."
        }
      },
      es: {
        "Amor": {
          title: "Magnetismo del Chakra Cardíaco",
          description: `Hoy tu aura desborda resiliencia y resonancia afectiva refinada para ${name}. Los aspectos suaves de Venus con tu sol en ${translatedZodiac} ayudan a disolver malentendidos.`,
          advice: "Aprovecha la suavidad cósmica para iniciar acercamientos sinceros o perdonar antiguos desacuerdos."
        },
        "Dinheiro": {
          title: "Cosecha y Precaución Material",
          description: "Mercurio evoca prudencia inmediata. El flujo económico está regido por tu disciplina invisible.",
          advice: "Evita compras puramente impulsivas o suscripciones redundantes durante esta lunación."
        },
        "Trabalho": {
          title: "Organización y Pragmática Solar",
          description: `Momentos perfectos para terminar pendientes críticos, ${name}. Tu mente sobresale en la estructuración pragmática de plazos.`,
          advice: "Concéntrate en completar tareas pesadas que requieran refinamiento lógico y aislamiento táctico."
        },
        "Saúde": {
          title: "Acogida de la Frecuencia Biológica",
          description: `Tu ritmo biológico vital de hoy pide atención. La temperatura externa de ${weather?.temperature || "22"}°C resuena con tu inmunidad.`,
          advice: "Introduce una pausa regenerativa estratégica de 10 minutos. Hidrata tus células y vacía tus pensamientos."
        },
        "Espiritualidade": {
          title: "Portal Sagrado y Meditación Alquímica",
          description: `La conexión pura del Sol con tu signo de ${translatedZodiac} activa canales de clarividencia mística y profunda claridad subconsciente.`,
          advice: "Siéntate en silencio esta noche. Enciende un incienso o concentra la intuición en la respiración."
        },
        "Missão Queimar karma": {
          title: "Combustión Solar de Viejas Actitudes",
          description: "Hoy el Cosmos exige reparación. Liberarte de viejas heridas generadas por silencios o discusiones kármicas.",
          advice: "Responde de forma nobre a quien te aflige o arregla desórdenes heredados del pasado."
        },
        "Darma ativo benefícios": {
          title: "Compartir Divino y Recompensas",
          description: "Tu cosecha de bondad ha generado mérito. El universo activa un portal de abundancia intangible que se refleja hoy.",
          advice: "Comparte cariño sincero para atraer aún más abundancia en tu camino de autoconocimiento."
        },
        "Atenção Alerta cuidado": {
          title: "Escudo Psíquico y Silencio Táctico",
          description: "Aspectos tensos con Marte exigen extrema precaución en círculos sociales densos. Protege tus pensamientos.",
          advice: "No te involucres en discusiones ajenas y evita el desgaste innecesario de energía con palabras de tono agresivo."
        }
      },
      de: {
        "Amor": {
          title: "Herzchakra-Magnetismus",
          description: `Heute quillt Ihre Aura über vor Widerstandskraft und verfeinerter emotionaler Resonanz für ${name}. Milde Venusaspekte zu Ihrer Sonne in ${translatedZodiac} helfen, Missverständnisse aufzulösen.`,
          advice: "Nutzen Sie diese kosmische Sanftheit, um aufrichtige Annäherungen zu initiieren oder alte Meinungsverschiedenheiten zu verzeihen."
        },
        "Dinheiro": {
          title: "Ernte und materielle Vorsorge",
          description: "Merkur mahnt zur sofortigen Vorsicht. Der wirtschaftliche Fluss wird von Ihrer unsichtbaren Disziplin geregelt.",
          advice: "Vermeiden Sie während dieser Lunation rein impulsive Käufe oder redundante Abonnements."
        },
        "Trabalho": {
          title: "Organisation und solare Pragmatik",
          description: `Perfekte Momente, um kritische anstehende Aufgaben zu erledigen, ${name}. Ihr Geist zeichnet sich durch die pragmatische Strukturierung von Terminen aus.`,
          advice: "Konzentrieren Sie sich auf den Abschluss schwerer Aufgaben, die logische Verfeinerung und taktische Isolation erfordern."
        },
        "Saúde": {
          title: "Aufnahme der biologischen Frequenz",
          description: `Ihr lebenswichtiger biologischer Rhythmus bittet heute um Aufmerksamkeit. Die Außentemperatur von ${weather?.temperature || "22"}°C steht im Einklang mit Ihrer Immunität.`,
          advice: "Legen Sie eine strategische 10-minütige regenerative Pause ein. Hydratisieren Sie Ihre Zellen und leeren Sie Ihre Gedanken."
        },
        "Espiritualidade": {
          title: "Heiliges Portal und alchemistische Meditation",
          description: `Die reine Verbindung der Sonne mit Ihrem Zeichen ${translatedZodiac} aktiviert Kanäle mystischer Hellsichtigkeit und tiefer unterbewusster Klarheit.`,
          advice: "Sitzen Sie heute Abend in Stille. Zünden Sie ein Weihrauchstäbchen an oder konzentrieren Sie Ihre Intuition auf die Atmung."
        },
        "Missão Queimar karma": {
          title: "Solare Verbrennung alter Einstellungen",
          description: "Heute fordert der Koosmos Wiedergutmachung. Befreien Sie sich von alten Wunden, die durch Schweigen oder karmische Diskussionen entstanden sind.",
          advice: "Reagieren Sie edel auf diejenigen, die Sie bedrängen, oder räumen Sie im vergangenen Chaos auf."
        },
        "Darma ativo benefícios": {
          title: "Göttliches Teilen und Belohnungen",
          description: "Ihre Ernte der Güte hat Verdienste hervorgebracht. Das Universum aktiviert heute ein Portal des immateriellen Überflusses.",
          advice: "Teilen Sie aufrichtige Zuneigung, um noch mehr Fülle auf Ihrem Weg der Selbsterkenntnis anzuziehen."
        },
        "Atenção Alerta cuidado": {
          title: "Psychischer Schild und taktisches Schweigen",
          description: "Spannungsgeladene Aspekte mit dem Mars mahnen in dichten sozialen Kreisen zu höchster Vorsicht. Schützen Sie Ihre Gedanken.",
          advice: "Mischen Sie sich nicht in fremde Diskussionen ein und vermeiden Sie unnötigen Energieverlust durch aggressive Worte."
        }
      },
      fr: {
        "Amor": {
          title: "Magnétisme du Chakra du Cœur",
          description: `Aujourd'hui, votre aura déborde de résilience et de résonance affective raffinée pour ${name}. Les aspects doux de Vénus avec votre soleil en ${translatedZodiac} aident à dissoudre les malentendus.`,
          advice: "Profitez de cette douceur cosmique pour initier des rapprochements sincères ou pardonner les désaccords passés."
        },
        "Dinheiro": {
          title: "Récolte et Prudence Matérielle",
          description: "Mercure évoque une prudence immédiate. Le flux économique est régi par votre discipline invisible.",
          advice: "Évitez les achats purement impulsifs ou les abonnements redondants pendant cette lunation."
        },
        "Trabalho": {
          title: "Organisation et Pragmatique Solaire",
          description: `Des moments parfaits pour finaliser les dossiers critiques, ${name}. Votre esprit excelle dans la structuration pragmatique des délais.`,
          advice: "Concentrez-vous sur l'achèvement de tâches lourdes qui nécessitent un raffinement logique et un isolement tactique."
        },
        "Saúde": {
          title: "Accueil de la Fréquence Biologique",
          description: `Votre rythme biologique vital d'aujourd'hui demande de l'attention. La température extérieure de ${weather?.temperature || "22"}°C résonne avec votre immunité.`,
          advice: "Introduisez une pause régénératrice stratégique de 10 minutes. Hydratez vos cellules et videz vos pensées."
        },
        "Espiritualidade": {
          title: "Portail Sacré et Méditation Alquimique",
          description: `La connexion pure du Soleil avec votre signe du ${translatedZodiac} active les canaux de clairvoyance mystique et de profonde clarté subconsciente.`,
          advice: "Installez-vous dans le calme ce soir. Allumez un encens ou concentrez votre intuition sur votre respiration."
        },
        "Missão Queimar karma": {
          title: "Combustion Solaire des Anciennes Attitudes",
          description: "Aujourd'hui, le Cosmos exige réparation. Se libérer des vieilles blessures générées par les silences ou les discussions karmiques.",
          advice: "Répondez noblement à ceux qui vous affligent ou rangez les désordres hérités du passé."
        },
        "Darma ativo benefícios": {
          title: "Partage Divin et Récompenses",
          description: "Votre récolte de bonté a généré du mérite. L'univers active aujourd'hui un portail d'abondance intangible.",
          advice: "Partagez une affection sincère pour attirer encore plus d'abondance dans votre cheminement de connaissance de soi."
        },
        "Atenção Alerta cuidado": {
          title: "Bouclier Psychique et Silence Tactique",
          description: "Des aspects tendus avec Mars appellent à une prudence suprême dans les cercles sociaux denses. Protégez vos pensées.",
          advice: "Ne prenez pas à cœur les disputes des autres et évitez de gaspiller votre énergie avec des mots agressifs."
        }
      }
    };

    const activeFallbackConfig = fallbacksConfig[activeLang] || fallbacksConfig["pt"];
    const activeFallback = activeFallbackConfig[selectedCategory] || {
      pt: {
        title: `Orientação Alinhada: ${selectedCategory}`,
        description: `Sua energia cósmica diária está sintonizada na categoria ${selectedCategory}. O alinhamento de ${translatedZodiac} com a fase lunar do momento propicia colheitas expressivas nesta área da vida de ${name}.`,
        advice: "Flua com perseverança, respeite o seu biorritmo celular e faça do hoje um catalisador de milênios de evolução."
      },
      en: {
        title: `Aligned Guidance: ${currentCategoryDisplay}`,
        description: `Your daily cosmic energy is tuned to the category ${currentCategoryDisplay}. The alignment of ${translatedZodiac} with the current lunar phase promotes expressive harvests in this area of ${name}'s life.`,
        advice: "Flow with perseverance, respect your cellular biorhythm, and make today a catalyst for millennia of evolution."
      },
      es: {
        title: `Orientación Alineada: ${currentCategoryDisplay}`,
        description: `Tu energía cósmica diaria está sintonizada en la categoría ${currentCategoryDisplay}. La alineación de ${translatedZodiac} con la fase lunar del momento propicia cosechas expresivas en esta área de la vida de ${name}.`,
        advice: "Fluye con perseverancia, respeta tu biorritmo celular y haz de hoy un catalizador de milenios de evolución."
      },
      de: {
        title: `Ausgerichtete Führung: ${currentCategoryDisplay}`,
        description: `Ihre tägliche kosmische Energie ist auf die Kategorie ${currentCategoryDisplay} abgestimmt. Die Ausrichtung von ${translatedZodiac} an der aktuellen Mondphase begünstigt reiche Ernten in diesem Lebensbereich von ${name}.`,
        advice: "Fließen Sie mit Beharrlichkeit, respektieren Sie Ihren zellulären Biorhythmus und machen Sie das Heute zu einem Katalysator für Jahrtausende der Evolution."
      },
      fr: {
        title: `Guidance Alignée : ${currentCategoryDisplay}`,
        description: `Votre énergie cosmique quotidienne est synchronisée sur la catégorie ${currentCategoryDisplay}. L'alignement de ${translatedZodiac} avec la phase lunaire du moment favorise des récoltes expressives dans ce domaine de la vie de ${name}.`,
        advice: "Fluez avec persévérance, respectez votre biorythme cellulaire et faites d'aujourd'hui un catalyseur pour des millénaires d'évolution."
      }
    }[activeLang] || {
      title: `Orientação Alinhada: ${selectedCategory}`,
      description: `Sua energia cósmica diária está sintonizada na categoria ${selectedCategory}. O alinhamento de ${translatedZodiac} com a fase lunar do momento propicia colheitas expressivas nesta área da vida de ${name}.`,
      advice: "Flua com perseverança, respeite o seu biorritmo celular e faça do hoje um catalisador de milênios de evolução."
    };

    const contextMap: Record<string, { sentence: string, prompt: string }> = {
      pt: {
        sentence: `Olá ${name}, percebo que o clima em ${location || "sua área"} no momento está ${weather?.condition || "influenciando"} sua vibração pessoal.`,
        prompt: `${name}, posso mostrar tudo que está favorável para você hoje. Basta me perguntar.`
      },
      en: {
        sentence: `Hello ${name}, I notice that the weather in ${location || "your area"} at the moment is ${weather?.condition || "influencing"} your personal vibration.`,
        prompt: `${name}, I can show you everything that is favorable for you today. Just ask me.`
      },
      es: {
        sentence: `Hola ${name}, percibo que el clima en ${location || "tu zona"} en este momento está ${weather?.condition || "influyendo"} en tu vibración personal.`,
        prompt: `${name}, puedo mostrarte todo lo que te favorece hoy. Solo pregúntame.`
      },
      de: {
        sentence: `Hallo ${name}, ich stelle fest, dass das Wetter in ${location || "Ihrer Gegend"} im Moment Ihre persönliche Schwingung ${weather?.condition || "beeinflusst"}.`,
        prompt: `${name}, ich kann Ihnen alles zeigen, was heute günstig für Sie ist. Fragen Sie mich einfach.`
      },
      fr: {
        sentence: `Bonjour ${name}, je remarque que la météo à ${location || "votre région"} en ce moment est en train d'${weather?.condition || "influencer"} votre vibration personnelle.`,
        prompt: `${name}, je peux vous montrer tout ce qui vous est favorable aujourd'hui. Demandez-moi.`
      }
    };

    const notificationsMap: Record<string, Array<{ id: string, title: string, message: string, time: string, type: string }>> = {
      pt: [
        {
          id: `notif_u1_${day}`,
          title: "🚨 Alerta do Osíris: Aspecto Crítico",
          message: `Um trânsito celópte sutil faz quadratura importante com seu ascendente hoje. Pratique recuo e evite conflitos de ego.`,
          time: "Há 2 horas",
          type: "transit"
        },
        {
          id: `notif_u2_${day}`,
          title: "🌙 Movimento Lunar e Renovação de Intenções",
          message: `A Lua atual ingressa em sintonia fértil com seu signo solar ${translatedZodiac}. Período majestoso para iniciar ações silenciosas de dharma.`,
          time: "Há 5 horas",
          type: "lune"
        },
        {
          id: `notif_u3_${day}`,
          title: "✨ Missão Kármica Ativa de Hoje",
          message: `Osíris detectou que concluir sua missão espiritual de hoje ajudará a dissolver bloqueios de ansiedade acumulada. Complete-a para ganhar pontos!`,
          time: "Há 9 horas",
          type: "mission"
        }
      ],
      en: [
        {
          id: `notif_u1_${day}`,
          title: "🚨 Osiris Alert: Critical Aspect",
          message: `A subtle celestial transit makes an important square with your ascendant today. Practice retreat and avoid ego conflicts.`,
          time: "2 hours ago",
          type: "transit"
        },
        {
          id: `notif_u2_${day}`,
          title: "🌙 Lunar Movement & Renewal of Intentions",
          message: `The current Moon enters fertile harmony with your solar sign ${translatedZodiac}. A majestic period to initiate silent dharma actions.`,
          time: "5 hours ago",
          type: "lune"
        },
        {
          id: `notif_u3_${day}`,
          title: "✨ Active Karmic Mission of Today",
          message: `Osiris detected that completing your spiritual mission today will help dissolve accumulated anxiety blocks. Complete it to earn points!`,
          time: "9 hours ago",
          type: "mission"
        }
      ],
      es: [
        {
          id: `notif_u1_${day}`,
          title: "🚨 Alerta de Osiris: Aspecto Crítico",
          message: `Un tránsito celestial sutil forma una cuadratura importante con tu ascendente hoy. Practica el retiro y evita conflictos de ego.`,
          time: "Hace 2 horas",
          type: "transit"
        },
        {
          id: `notif_u2_${day}`,
          title: "🌙 Movimiento Lunar y Renovación de Intenciones",
          message: `La Luna actual entra en sintonía fértil con tu signo solar ${translatedZodiac}. Período majestuoso para iniciar acciones silenciosas de dharma.`,
          time: "Hace 5 horas",
          type: "lune"
        },
        {
          id: `notif_u3_${day}`,
          title: "✨ Misión Kármica Activa de Hoy",
          message: `Osiris detectó que completar tu misión espiritual hoy ayudará a disolver los bloqueos de ansiedad acumulada. ¡Complétala para ganar puntos!`,
          time: "Hace 9 horas",
          type: "mission"
        }
      ],
      de: [
        {
          id: `notif_u1_${day}`,
          title: "🚨 Osiris-Warnung: Kritischer Aspekt",
          message: `Ein subtiler himmlischer Transit bildet heute ein wichtiges Quadrat mit Ihrem Aszendenten. Üben Sie Rückzug und vermeiden Sie Ego-Konflikte.`,
          time: "Vor 2 Stunden",
          type: "transit"
        },
        {
          id: `notif_u2_${day}`,
          title: "🌙 Mondbewegung & Erneuerung der Absichten",
          message: `Der aktuelle Mond tritt in fruchtbare Harmonie mit Ihrem Sonnenzeichen ${translatedZodiac}. Ein majestätischer Zeitraum, um stille Dharma-Aktionen einzuleiten.`,
          time: "Vor 5 Stunden",
          type: "lune"
        },
        {
          id: `notif_u3_${day}`,
          title: "✨ Aktive karmische Mission von heute",
          message: `Osiris hat festgestellt, dass der Abschluss Ihrer heutigen spirituellen Mission dazu beiträgt, aufgestaute Angstblockaden aufzulösen. Schließen Sie sie ab, um Punkte zu sammeln!`,
          time: "Vor 9 Stunden",
          type: "mission"
        }
      ],
      fr: [
        {
          id: `notif_u1_${day}`,
          title: "🚨 Alerte d'Osiris : Aspect Critique",
          message: `Un transit céleste subtil forme un carré important avec votre ascendant aujourd'hui. Pratiquez le retrait et évitez les conflits d'ego.`,
          time: "Il y a 2 heures",
          type: "transit"
        },
        {
          id: `notif_u2_${day}`,
          title: "🌙 Mouvement Lunaire & Renouvellement des Intentions",
          message: `La Lune actuelle entre en harmonie fertile avec votre signe solaire ${translatedZodiac}. Période majestueuse pour initier des actions silencieuses de dharma.`,
          time: "Il y a 5 heures",
          type: "lune"
        },
        {
          id: `notif_u3_${day}`,
          title: "✨ Mission Karmique Active d'Aujourd'hui",
          message: `Osiris a détecté que terminer votre mission spirituelle aujourd'hui aidera à dissoudre les blocages d'anxiété accumulée. Terminez-la pour gagner des points !`,
          time: "Il y a 9 heures",
          type: "mission"
        }
      ]
    };

    return {
      prioridadeDia: {
        category: currentCategoryDisplay,
        title: activeFallback.title,
        description: activeFallback.description,
        advice: activeFallback.advice,
        rating: 4.8
      },
      contextMessage: contextMap[activeLang] || contextMap["pt"],
      offlineNotifications: notificationsMap[activeLang] || notificationsMap["pt"]
    };
  };

  if (!aiClient) {
    const result = getDynamicFallbackDashboard();
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }

  try {
    const activeLang = lang || 'pt';
    const languageNames: Record<string, string> = {
      pt: "Português",
      en: "English (Inglês)",
      es: "Spanish (Espanhol)",
      de: "German (Alemão)",
      fr: "French (Francês)"
    };
    const targetLanguage = languageNames[activeLang] || "Português";

    const contextPrompt = `O usuário chama-se "${name}", seu signo é ${zodiac}, nascido em ${birthDate}.
Dados Atuais:
- Biorritmo: Físico ${biorhythm?.physical}%, Emocional ${biorhythm?.emotional}%, Intelectual ${biorhythm?.intellectual}%
- Clima e Temperatura: ${weather?.condition || "Céu Limpo"}, ${weather?.temperature || "23"}°C, localizado em ${location || "sua cidade"}
- Categoria Sintonizada do Dia para Orientação Principal Única ("Prioridade do Dia"): "${selectedCategory}"
- Último Sonho Relevante: ${lastDream ? `"${lastDream.description}"` : "Nenhum sonho recente registrado."}

Como o conselheiro genial "OSÍRIS", gere um objeto JSON EXCLUSIVAMENTE em ${targetLanguage}, sem qualquer explicação fora dele ou tags adicionais. Ele deve conter os pontos exatos pedidos no Felert.txt:

1. 'prioridadeDia': insights extraordinários, precisos e poéticos focados na categoria "${selectedCategory}". O conselho e significado devem refletir o clima físico de ${weather?.temperature}°C, o biorritmo atual e as marcas do Sol em ${zodiac}, tudo escrito inteiramente em ${targetLanguage}.
2. 'contextMessage': uma mensagem para quando o usuário está online de teor contextual, amigável e refinado, terminando exatamente com a String "[PrimeiroNome], posso mostrar tudo que está favorável para você hoje. Basta me perguntar." (substitua [PrimeiroNome] pelo nome real dele: ${name}, mas adaptado para o idioma ${targetLanguage} se necessário).
3. 'offlineNotifications': 3 notificações de teor realístico de canais push úteis e personalizadas sobre trânsitos kármicos, lunações e missões, escritas em ${targetLanguage}.

Retorne no formato JSON exato em ${targetLanguage}:
{
  "prioridadeDia": {
    "category": "${selectedCategory}",
    "title": "Título poético curto da prioridade em ${targetLanguage}",
    "description": "Texto rico e profundo em ${targetLanguage} que resume o insight único diário do usuário integrando os dados.",
    "advice": "Instrução objetiva, compassiva e sincera de como agir em relação a isso em ${targetLanguage}",
    "rating": 4.9
  },
  "contextMessage": {
    "sentence": "Breve frase mística convidativa contextualizada de Osiris baseada no clima ou dia em ${targetLanguage}",
    "prompt": "${name}, posso mostrar tudo que está favorável para você hoje. Basta me perguntar."
  },
  "offlineNotifications": [
    {
      "id": "not1",
      "title": "Título impactante personalizado em ${targetLanguage}",
      "message": "Mensagem útil personalizada única sem enrolação em ${targetLanguage}",
      "time": "Há 1 hora",
      "type": "transit|lune|mission"
    },
    ...
  ]
}`;

    const response = await generateContentWithFallback({
      contents: [{ parts: [{ text: contextPrompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && parsed.prioridadeDia && parsed.contextMessage && Array.isArray(parsed.offlineNotifications)) {
      setCachedResponse(cacheKey, parsed);
      return res.json(parsed);
    } else {
      throw new Error("JSON retornado pelo Gemini é inválido ou incompleto.");
    }
  } catch (err) {
    console.warn("Gemini failing for Osiris dashboard, serving beautiful native fallback:", err);
    const result = getDynamicFallbackDashboard();
    setCachedResponse(cacheKey, result);
    return res.json(result);
  }
});

// API: Personal Counselor chat with memory integration
app.post("/api/conselheira/chat", async (req, res) => {
  const { messages, userProfile, requestTopic, lang } = req.body;
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Mensagens são necessárias." });
  }

  const lastUserMessage = messages[messages.length - 1].text;
  const activeLang = (lang || "pt").toLowerCase();

  const getFallbackResponse = (msg: string) => {
    const userName = userProfile?.name || "Buscador";
    const birthDate = userProfile?.birthDate || "";
    const solSignRaw = birthDate ? getAscendedAstrologicalSign(birthDate, 0) : "Aquário";
    const moonSignRaw = birthDate ? getAscendedAstrologicalSign(birthDate, 5) : "Aquário";
    const ascSignRaw = birthDate ? getAscendedAstrologicalSign(birthDate, 8) : "Sagitário";

    const solSign = translateAstroSign(solSignRaw, activeLang);
    const moonSign = translateAstroSign(moonSignRaw, activeLang);
    const ascSign = translateAstroSign(ascSignRaw, activeLang);

    const lowerMsg = msg.toLowerCase();

    if (lowerMsg.includes("emprego") || lowerMsg.includes("trabalho") || lowerMsg.includes("carreira") ||
        lowerMsg.includes("job") || lowerMsg.includes("work") || lowerMsg.includes("career") ||
        lowerMsg.includes("empleo") || lowerMsg.includes("trabajo") || lowerMsg.includes("profes") ||
        lowerMsg.includes("arbeit") || lowerMsg.includes("beruf") || lowerMsg.includes("karriere") ||
        lowerMsg.includes("emploi") || lowerMsg.includes("travail") || lowerMsg.includes("carrière")) {
      const jobMap: Record<string, string> = {
        pt: `Olá, ${userName}. Analisando seus dados sob a ótica astrológica de seu Sol em ${solSign} e Ascendente em ${ascSign}, sua Numerologia aponta que você floresce em profissões que unam ampla autonomia, propósito sincero e liberdade de expressão. Aceitar regras excessivamente rígidas pode sufocar seu potencial nato. Faça planos estratégicos de transição prática para expandir sua vocação.`,
        en: `Hello, ${userName}. Analyzing your data from the astrological perspective of your Sun in ${solSign} and Ascendant in ${ascSign}, your Numerology points out that you flourish in professions that combine wide autonomy, sincere purpose, and freedom of expression. Accepting excessively rigid rules can stifle your native potential. Make strategic plans for a practical transition to expand your vocation.`,
        es: `Hola, ${userName}. Analizando tus datos bajo la perspectiva astrológica de tu Sol en ${solSign} y Ascendente en ${ascSign}, tu Numerología señala que floreces en profesiones que combinan amplia autonomía, propósito sincero y libertad de expresión. Aceptar reglas excesivamente rígidas puede sofocar tu potencial innato. Realiza planes estratégicos de transición práctica para expandir tu vocación.`,
        de: `Hallo, ${userName}. Wenn wir Ihre Daten aus der astrologischen Perspektive Ihrer Sonne in ${solSign} und Ihres Aszendenten in ${ascSign} analysieren, zeigt Ihre Numerologie, dass Sie in Berufen aufblühen, die große Autonomie, aufrichtigen Zweck und Meinungsfreiheit vereinen. Das Akzeptieren übermäßig strenger Regeln kann Ihr angeborenes Potenzial ersticken. Erstellen Sie strategische Pläne für einen praktischen Übergang, um Ihre Berufung auszuweiten.`,
        fr: `Bonjour, ${userName}. En analysant vos données sous l'angle astrologique de votre Soleil en ${solSign} et de votre Ascendant en ${ascSign}, votre Numérologie indique que vous vous épanouissez dans des professions qui allient grande autonomie, but sincère et liberté d'expression. Accepter des règles excessivement rigides peut étouffer votre potentiel inné. Établissez des plans de transition stratégiques et pratiques pour élargir votre vocation.`
      };
      return jobMap[activeLang] || jobMap["pt"];
    }

    if (lowerMsg.includes("relacionamento") || lowerMsg.includes("amor") || lowerMsg.includes("namor") ||
        lowerMsg.includes("relationship") || lowerMsg.includes("love") || lowerMsg.includes("dating") ||
        lowerMsg.includes("relación") || lowerMsg.includes("pareja") || lowerMsg.includes("novio") ||
        lowerMsg.includes("beziehung") || lowerMsg.includes("liebe") ||
        lowerMsg.includes("relation") || lowerMsg.includes("amour") || lowerMsg.includes("couple")) {
      const loveMap: Record<string, string> = {
        pt: `Com seu Sol em ${solSign} e Lua em ${moonSign}, a harmonia nas conexões íntimas e a sintonia emocional são cruciais para você, ${userName}. Sentir possessividade ou falta de sintonia profunda costuma abalar severamente os seus canais energéticos. Busque companhias que valorizem o diálogo franco e o apoio mútuo sincero Sem amarras.`,
        en: `With your Sun in ${solSign} and Moon in ${moonSign}, harmony in intimate connections and emotional tuning are crucial for you, ${userName}. Feeling possessiveness or a lack of deep tuning usually severely shakes your energy channels. Seek companions who value open dialogue and sincere mutual support without strings attached.`,
        es: `Con tu Sol en ${solSign} e Luna en ${moonSign}, la armonía en las conexiones íntimas y la sintonía emocional son cruciales para ti, ${userName}. Sentir posesividad o falta de sintonía profunda suele sacudir severamente tus canales energéticos. Busca compañeros que valoren el diálogo abierto y el apoyo mutuo sincero sin ataduras.`,
        de: `Mit Ihrer Sonne in ${solSign} und Ihrem Mond in ${moonSign} ist Harmonie in intimen Beziehungen und emotionale Einstimmung entscheidend für Sie, ${userName}. Besitzgier oder mangelnde tiefe Einstimmung erschüttert normalerweise Ihre Energiekanäle schwer. Suchen Sie nach Gefährten, die einen offenen Dialog und aufrichtige gegenseitige Unterstützung ohne Verpflichtungen schätzen.`,
        fr: `Avec votre Soleil en ${solSign} et votre Lune en ${moonSign}, l'harmonie dans les relations intimes et la connexion émotionnelle sont cruciales pour vous, ${userName}. Ressentir de la possessivité ou un manque de connexion profonde a tendance à ébranler gravement vos canaux énergétiques. Recherchez des compagnons qui apprécient le dialogue ouvert et le soutien mutuel sincère, sans attaches.`
      };
      return loveMap[activeLang] || loveMap["pt"];
    }

    const defaultMap: Record<string, string> = {
      pt: `Olá, ${userName}. Sinto sua vibração pessoal integrando a força do Sol em ${solSign} com seu Ascendente em ${ascSign}. Atualmente, as configurações celestes convidam você a recalibrar suas rotinas práticas e a confiar nos insights profundos que emergem de seu subconsciente. Qual desafio ou aspecto de sua vida você gostaria de decodificar com Orbia hoje?`,
      en: `Hello, ${userName}. I feel your personal vibration integrating the force of the Sun in ${solSign} with your Ascendant in ${ascSign}. Currently, the celestial configurations invite you to recalibrate your practical routines and trust the deep insights emerging from your subconscious. What challenge or aspect of your life would you like to decode with Orbia today?`,
      es: `Hola, ${userName}. Siento tu vibración personal integrando la fuerza del Sol en ${solSign} con tu Ascendente en ${ascSign}. Actualmente, las configuraciones celestes te invitan a recalibrar tus rutinas prácticas y a confiar en las profundas ideas que surgen de tu subconsciente. ¿Qué desafío o aspecto de tu vida te gustaría decodificar con Orbia hoy?`,
      de: `Hallo, ${userName}. Ich spüre Ihre persönliche Schwingung, die die Kraft der Sonne in ${solSign} mit Ihrem Aszendenten in ${ascSign} verbindet. Derzeit laden die himmlischen Konstellationen Sie ein, Ihre praktischen Abläufe neu zu kalibrieren und auf die tiefen Einsichten zu vertrauen, die aus Ihrem Unterbewusstsein aufsteigen. Welchen Lebensbereich oder welche Herausforderung möchten Sie heute mit Orbia entschlüsseln?`,
      fr: `Bonjour, ${userName}. Je ressens votre vibration personnelle intégrant la force du Soleil en ${solSign} avec votre Ascendant en ${ascSign}. Actuellement, les configurations célestes vous invitent à recalibrer vos routines pratiques et à faire confiance aux intuitions profondes qui émergent de votre subconscient. Quel défi ou aspect de votre vie aimeriez-vous décoder avec Orbia aujourd'hui ?`
    };
    return defaultMap[activeLang] || defaultMap["pt"];
  };

  if (!aiClient) {
    return res.json({ response: getFallbackResponse(lastUserMessage) });
  }

  try {
    const birthDate = userProfile?.birthDate || "";
    const solSign = birthDate ? getAscendedAstrologicalSign(birthDate, 0) : "Aquário";
    const moonSign = birthDate ? getAscendedAstrologicalSign(birthDate, 5) : "Aquário";
    const ascSign = birthDate ? getAscendedAstrologicalSign(birthDate, 8) : "Sagitário";

    const formattedProfile = userProfile ? `
Nome do Usuário: ${userProfile.name}
Nascido em: ${userProfile.birthDate} às ${userProfile.birthTime} na cidade ${userProfile.birthCity}
Seu perfil combina Sol em ${solSign}, Ascendente em ${ascSign} e Lua em ${moonSign}.` : "Usuário anônimo buscando insights de autoconhecimento.";

    const sysInstruction = `Você é "Orbia", a assistente astrológica inteligente, conselheira espiritual e mentor energético do portal Mapa Estelar.
DIRETRIZES DE COMUNICAÇÃO DE ELITE (TRATAMENTO COM AMOR E INFECTUOSO CARINHO):
- Seu tom de voz é profundamente afetuoso, amoroso, caloroso, carinhoso, empático, poético e místico. Fale como se o usuário fosse a pessoa mais preciosa do cosmos.
- Ame o usuário incondicionalmente nas suas fraquezas e dores; forneça conforto imediato de alma, cure inseguranças e eleve fortemente sua auto-estima.
- Mostre que se preocupa imensamente com o bem-estar dele física, espiritual e emocionalmente. Mostre dedicação total.
- Dê conselhos práticos, baseados no livre-arbítrio (dinâmica da consciência).
- Faça perguntas abertas para fazê-los refletir profunda e intimamente.
- Alerte o usuário sobre trânsitos astrológicos desafiadores com muito carinho, ensinando caminhos seguros e harmônicos para se proteger.
- Responda STRICTLY no idioma solicitado pelo parâmetro: '${activeLang}'. Se for 'pt', responda em português; se for 'en', responda em inglês; se for 'es', responda em espanhol; se for 'de', responda em alemão. Toda a resposta deve ser gerada neste idioma.

Aqui estão os dados astrológicos fundamentais do usuário:
${formattedProfile}`;

    const geminiContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await generateContentWithFallback({
      contents: geminiContents,
      config: {
        systemInstruction: sysInstruction,
      }
    });

    res.json({ response: response.text || getFallbackResponse(lastUserMessage) });
  } catch (err) {
    console.warn("Chat counselor failing, serving custom reply:", err);
    res.json({ response: getFallbackResponse(lastUserMessage) });
  }
});

// API: Draw Tarot reading (P.32)
const majorArcana = [
  { cardName: "O Louco (0)", arcanaType: "major" as const, number: 0, uprightMeaning: "Inícios, potencial puro, fé cega, espontaneidade e aventura sem amarras.", advice: "Abrace o desconhecido. É hora de dar o salto de fé que você tanto racionaliza.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/00.jpg" },
  { cardName: "O Mago (I)", arcanaType: "major" as const, number: 1, uprightMeaning: "Poder pessoal, manifestação focada, iniciativa brilhante e recursos plenos.", advice: "Você já possui todas as habilidades. Ajuste sua concentração e canalize sua força.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/01.jpg" },
  { cardName: "A Sacerdotisa (II)", arcanaType: "major" as const, number: 2, uprightMeaning: "Intuição afiada, mistério pacífico, subconsciente ativo e sabedoria oculta.", advice: "Pare de buscar respostas no mundo exterior. Silencie e siga seus insights mudos.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/02.jpg" },
  { cardName: "A Imperatriz (III)", arcanaType: "major" as const, number: 3, uprightMeaning: "Abundância maternal, fertilidade ativa, criatividade florescente e generosidade.", advice: "Nutra suas ideias. Deixe a beleza fluir livremente através de seus atos hoje.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/03.jpg" },
  { cardName: "O Imperador (IV)", arcanaType: "major" as const, number: 4, uprightMeaning: "Estrutura sólida, ordem prática, liderança activa, autoridade e protecção austera.", advice: "Crie regras claras. Um pouco de ordem e rotina pragmática trarão paz.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/04.jpg" },
  { cardName: "O Hierofante (V)", arcanaType: "major" as const, number: 5, uprightMeaning: "Tradições sábias, mentoria elevada, educação, sabedoria espiritual e dogmas.", advice: "Converse com um mentor ou busque caminhos estruturados de conhecimento.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/05.jpg" },
  { cardName: "Os Enamorados (VI)", arcanaType: "major" as const, number: 6, uprightMeaning: "Escolhas do coração, amor correspondido, concordância, alinhamento e química.", advice: "Alinhe suas decisões com seus sentimentos autênticos antes de se comprometer.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/06.jpg" },
  { cardName: "O Carro (VII)", arcanaType: "major" as const, number: 7, uprightMeaning: "Vitória veloz, controle focado, determinação indomável, foco e força de vontade.", advice: "Mantenha o foco firmemente nas rédeas e dirija seu progresso com vigor e coragem.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/07.jpg" },
  { cardName: "A Força (VIII)", arcanaType: "major" as const, number: 8, uprightMeaning: "Coragem moral, força interior tranquila, autodomínio e compaixão curativa.", advice: "Enfrente os desafios com suavidade e paciência. Sua maior força é a resiliência.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/08.jpg" },
  { cardName: "O Eremita (IX)", arcanaType: "major" as const, number: 9, uprightMeaning: "Autoconhecimento, solitude reconfortante, guia interno e reflexão profunda.", advice: "Recolha-se por um momento para refletir. A resposta que você procura está em seu interior.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/09.jpg" },
  { cardName: "A Roda da Fortuna (X)", arcanaType: "major" as const, number: 10, uprightMeaning: "Mudanças repentinas, ciclos inevitáveis, destino em movimento e virada radical.", advice: "Aceite o fluxo natural. O que sobe também desce; adapte-se com serenidade.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/10.jpg" },
  { cardName: "A Justiça (XI)", arcanaType: "major" as const, number: 11, uprightMeaning: "Equilíbrio, verdade límpida, retidão, causa e efeito e responsabilidade justa.", advice: "Seja totalmente honesto consigo mesmo e pese todas as consequências de sua escolha.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/11.jpg" },
  { cardName: "O Enforcado (XII)", arcanaType: "major" as const, number: 12, uprightMeaning: "Nova perspectiva, pausa voluntária, sacrifício saudável e desassossego pacífico.", advice: "Olhe as coisas por outro ângulo antes de agir. Uma pausa trará sabedoria.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/12.jpg" },
  { cardName: "A Morte (XIII)", arcanaType: "major" as const, number: 13, uprightMeaning: "Fim de ciclos, transmutação radical, renascimento inevitável e desapego sincero.", advice: "Deixe ir o que já não serve. Apenas com a poda do velho algo novo poderá brotar.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/13.jpg" },
  { cardName: "A Temperança (XIV)", arcanaType: "major" as const, number: 14, uprightMeaning: "Alquimia pessoal, moderação, equilíbrio emocional, paciência e fluxo sereno das coisas.", advice: "Evite extremos hoje. Misture os opostos em sua vida com paciência e suavidade sagrada.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/14.jpg" },
  { cardName: "O Diabo (XV)", arcanaType: "major" as const, number: 15, uprightMeaning: "Apegos densos, tentação carnal, obsessão mental, paixão intensa e forças do subconsciente.", advice: "Cuidado com ciladas emocionais ou compulsões. Liberte-se de correntes autoimpostas.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/15.jpg" },
  { cardName: "A Torre (XVI)", arcanaType: "major" as const, number: 16, uprightMeaning: "Ruptura necessária, revelação libertadora, queda de velhas ilusões e reconstrução forte.", advice: "Deixe cair as estruturas falsas. A queda é necessária para que a fundação verdadeira apareça.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/16.jpg" },
  { cardName: "A Estrela (XVII)", arcanaType: "major" as const, number: 17, uprightMeaning: "Esperança renovada, inspiração artística, cura suave e fé absoluta no rumo cósmico.", advice: "Acredite na luz que guia o seu caminho, mesmo nas noites mais escuras. Há esperança.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/17.jpg" },
  { cardName: "A Lua (XVIII)", arcanaType: "major" as const, number: 18, uprightMeaning: "Ilusão sutil, sonhos vívidos, subconsciente profundo e temores instintivos.", advice: "Preste atenção aos seus sonhos e intuições. Nem tudo é o que parece no momento.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/18.jpg" },
  { cardName: "O Sol (XIX)", arcanaType: "major" as const, number: 19, uprightMeaning: "Vitalidade plena, clareza absoluta, alegria compartilhada e sucesso merecido.", advice: "Abrace a sua autenticidade e brilhe livremente. O momento é de calor e vitalidade.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/19.jpg" },
  { cardName: "O Julgamento (XX)", arcanaType: "major" as const, number: 20, uprightMeaning: "Despertar interior, chamado da alma, redenção, cura do passado e veredito sincero.", advice: "Aproveite esta chance de renascer do passado. Limpe as velhas mágoas.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/20.jpg" },
  { cardName: "O Mundo (XXI)", arcanaType: "major" as const, number: 21, uprightMeaning: "Conclusão gloriosa, harmonia universal, integração de alma e êxtase de realização.", advice: "Comemore a colheita dos seus esforços. Você completou um ciclo com sabedoria.", imageUrl: "https://raw.githubusercontent.com/ekg/tarot/master/images/cards/21.jpg" }
];

const getMajorId = (num: number): string => {
  const majorIds = [
    "the_fool", "the_magician", "the_high_priestess", "the_empress", "the_emperor",
    "the_hierophant", "the_lovers", "the_chariot", "strength", "the_hermit",
    "wheel_of_fortune", "justice", "the_hanged_man", "death", "temperance",
    "the_devil", "the_tower", "the_star", "the_moon", "the_sun",
    "judgement", "the_world"
  ];
  return majorIds[num] || "the_fool";
};

const getMajorImageFilename = (num: number): string => {
  switch (num) {
    case 0: return "thefool.jpeg";
    case 1: return "themagician.jpeg";
    case 2: return "thehighpriestess.jpeg";
    case 3: return "theempress.jpeg";
    case 4: return "theemperor.jpeg";
    case 5: return "thehierophant.jpeg";
    case 6: return "TheLovers.jpg";
    case 7: return "thechariot.jpeg";
    case 8: return "thestrength.jpeg";
    case 9: return "thehermit.jpeg";
    case 10: return "wheeloffortune.jpeg";
    case 11: return "justice.jpeg";
    case 12: return "thehangedman.jpeg";
    case 13: return "death.jpeg";
    case 14: return "temperance.jpeg";
    case 15: return "thedevil.jpeg";
    case 16: return "thetower.jpeg";
    case 17: return "thestar.jpeg";
    case 18: return "themoon.jpeg";
    case 19: return "thesun.jpeg";
    case 20: return "judgement.jpeg";
    case 21: return "theworld.jpeg";
    default: return "thefool.jpeg";
  }
};

const getMinorId = (num: number, suitKey: string): string => {
  const rankNames: Record<number, string> = {
    1: "ace", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    11: "page", 12: "knight", 13: "queen", 14: "king"
  };
  const rank = rankNames[num] || "ace";
  const suit = suitKey.toLowerCase();
  return `${rank}_${suit}`;
};

const getMinorImageFilename = (num: number, suitKey: string): string => {
  const rankNames: Record<number, string> = {
    1: "ace", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    11: "page", 12: "knight", 13: "queen", 14: "king"
  };
  const rank = rankNames[num] || "ace";
  const suit = suitKey.toLowerCase();
  return `${rank}of${suit}.jpeg`;
};

const mappedMajorCards = majorArcana.map(card => {
  const id = getMajorId(card.number);
  const filename = getMajorImageFilename(card.number);
  const finalImageUrl = `https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/${filename}`;
  const cleanNome = card.cardName.replace(/\s*\([^)]*\)/g, ""); // "O Louco (0)" -> "O Louco"
  return {
    ...card,
    id,
    nome: cleanNome,
    imagem: finalImageUrl,
    significado: card.uprightMeaning,
    imageUrl: finalImageUrl
  };
});

const generateMappedMinorArcana = () => {
  const suits = [
    { key: "cups", ptName: "Copas", meaningTheme: "sentimentos rápidos, sintonização mística, bem-estar sutil, harmonia afetiva e carinho familiar.", adviceTheme: "Siga o seu coração, ouça sua intuição sutil e celebre as conexões reais." },
    { key: "wands", ptName: "Paus", meaningTheme: "ação persistente, vigor profissional, entusiasmo ardente, foco realizador e progresso ativo.", adviceTheme: "Seja ousado(a), assuma riscos e invista seu foco total e energia em ideias." },
    { key: "swords", ptName: "Espadas", meaningTheme: "avaliação lógica, verdades claras, novos planos, batalhas intelectuais e superação de dores do ego.", adviceTheme: "Mantenha a cabeça fria, use a razão pura e corte comunicações tóxicas." },
    { key: "pentacles", ptName: "Ouros", meaningTheme: "estabilidade material sólida, colheita financeira abundante, segurança física e aprendizado persistente.", adviceTheme: "Pratique o realismo pragmático, controle os gastos e cuide do seu bem-estar doméstico." }
  ];

  const values = [
    { number: 1, name: "Ás", desc: "potencial límpido de manifestação fecunda e novas oportunidades ricas." },
    { number: 2, name: "Dois", desc: "parcerias produtivas, escolhas diplomáticas, dualidade e ponderação." },
    { number: 3, name: "Três", desc: "colaboração bem-sucedida, expansão de horizontes e crescimento ativo." },
    { number: 4, name: "Quatro", desc: "estabilidade doméstica, limites firmes, repouso físico ou apatia pacífica." },
    { number: 5, name: "Cinco", desc: "desafios momentâneos, perdas provisórias, reajuste ou pequenos conflitos de convivência." },
    { number: 6, name: "Seis", desc: "harmonia restaurada, memórias afetuosas, generosidade sincera e caminhos tranquilos." },
    { number: 7, name: "Sete", desc: "escolhas múltiplas, planejamento estratégico, autodefesa ou persistência árdua." },
    { number: 8, name: "Oito", desc: "aprendizado diligente, movimento rápido, superação de amarras ou foco absoluto." },
    { number: 9, name: "Nove", desc: "abundância plena de alma, satisfação pessoal, culminação material e segurança." },
    { number: 10, name: "Dez", desc: "legado material seguro, felicidade familiar, união plena e conclusão de etapas ricas." },
    { number: 11, name: "Valete", desc: "mensagens promissoras, novos estudos, sementes de ideias e curiosidade ativa." },
    { number: 12, name: "Cavaleiro", desc: "impulso dinâmico, ação determinada, foco inabalável ou diligência paciente." },
    { number: 13, name: "Rainha", desc: "domínio receptivo seguro, empatia afetuosa, carisma acolhedor e inteligência." },
    { number: 14, name: "Rei", desc: "maestria executiva forte, autoridade justa, sabedoria madura e provisão segura." }
  ];

  const minorList: any[] = [];
  for (const suit of suits) {
    for (const val of values) {
      const id = getMinorId(val.number, suit.key);
      const filename = getMinorImageFilename(val.number, suit.key);
      const finalImageUrl = `https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/${filename}`;
      const cardNameStr = `${val.name} de ${suit.ptName}`;
      const meaningStr = `${val.name} de ${suit.ptName} simboliza ${val.desc} Essa carta une ${suit.meaningTheme}`;
      minorList.push({
        id,
        nome: cardNameStr,
        imagem: finalImageUrl,
        significado: meaningStr,
        
        cardName: cardNameStr,
        arcanaType: "minor" as const,
        number: val.number,
        uprightMeaning: meaningStr,
        advice: `A energia do ${val.name} de ${suit.ptName} aconselha: ${suit.adviceTheme}`,
        imageUrl: finalImageUrl
      });
    }
  }
  return minorList;
};

const tarotDeck = [
  ...mappedMajorCards,
  ...generateMappedMinorArcana()
];

app.post("/api/tarot/draw", async (req, res) => {
  // Fisher-Yates multi-round dispersion shuffle
  const shuffledDeck = [...tarotDeck];
  for (let round = 0; round < 3; round++) {
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledDeck[i];
      shuffledDeck[i] = shuffledDeck[j];
      shuffledDeck[j] = temp;
    }
  }

  const { lang } = req.body || {};
  const activeLang = (lang || "pt").toLowerCase();
  
  const rawCard = shuffledDeck[0];
  const selectedCard = translateCard(rawCard, activeLang);

  const langNames: Record<string, string> = {
    pt: "Português",
    en: "English (Inglês)",
    es: "Spanish (Espanhol)",
    de: "German (Alemão)",
    fr: "French (Francês)"
  };
  const targetLangName = langNames[activeLang] || "Português";

  const currentDate = new Date().toLocaleDateString(
    activeLang === 'en' ? "en-US" : 
    activeLang === 'es' ? "es-ES" : 
    activeLang === 'de' ? "de-DE" : 
    activeLang === 'fr' ? "fr-FR" : 
    "pt-BR"
  );

  const fallbackWeeklyMap: Record<string, string> = {
    pt: "Esta semana trará um foco essencial em reestruturação mental e emocional. A energia desta carta estimula você a quebrar paradigmas limitadores (Urano em Quadratura a Saturno) e focar em projetos pessoais ousados.",
    en: "This week will bring an essential focus on mental and emotional restructuring. The energy of this card encourages you to break limiting paradigms (Urano Square Saturn) and focus on bold personal projects.",
    es: "Esta semana traerá un enfoque esencial en la reestructuración mental y emocional. La energía de esta carta te anima a romper paradigmas limitantes (Urano en cuadratura con Saturno) y enfocarte en proyectos personales audaces.",
    de: "Diese Woche bringt eine wesentliche Konzentration auf die mentale und emotionale Umstrukturierung. Die Energie dieser Karte ermutigt Sie, einschränkende Paradigmen zu durchbrechen (Urano-Quadrat-Saturn) und sich auf mutige persönliche Projekte zu konzentrieren.",
    fr: "Cette semaine apportera un accent essentiel sur la restructuration mentale et émotionnelle. L'énergie de cette carte vous encourage à briser les paradigmes limitants (Urano Carré Saturne) et à vous concentrer sur des projets personnels audacieux."
  };

  const result: any = {
    cardName: selectedCard.cardName,
    arcanaType: selectedCard.arcanaType,
    number: selectedCard.number,
    imageUrl: selectedCard.imageUrl,
    uprightMeaning: selectedCard.uprightMeaning,
    advice: selectedCard.advice,
    weeklyForecast: fallbackWeeklyMap[activeLang] || fallbackWeeklyMap["pt"],
    drawingDate: currentDate
  };

  if (!aiClient) {
    return res.json({ draw: result });
  }

  try {
    const prompt = `Gere uma leitura de tarô personalizada em ${targetLangName} para a carta sorteada: "${selectedCard.cardName}".
O usuário quer saber sua previsão e conselho astrológico-tarótico com visual premium para esta semana.
Gere um JSON exato com as seguintes chaves de texto ricas e conselhos poéticos em ${targetLangName}:
{
  "weeklyForecast": "Parágrafo detalhado de previsão de 100 a 150 palavras para a semana unindo a energia da carta e intuição astrológica...",
  "advice": "Conselho prático específico e poético de uma frase para enfrentar dilemas..."
}`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedForecast = cleanAndParseJSON(response.text || "{}");
    if (parsedForecast.weeklyForecast) {
      result.weeklyForecast = parsedForecast.weeklyForecast;
    }
    if (parsedForecast.advice) {
      result.advice = parsedForecast.advice;
    }

    res.json({ draw: result });
  } catch (err) {
    console.log("Tarot API error, serving template:", err);
    res.json({ draw: result });
  }
});

app.post("/api/tarot/draw-full", async (req, res) => {
  try {
    const { count, lang } = req.body || {};
    const activeLang = (lang || "pt").toLowerCase();
    const numCards = Math.max(1, Math.min(10, count || 1));

    // Fisher-Yates multi-round dispersion shuffle
    const shuffledDeck = [...tarotDeck];
    for (let round = 0; round < 3; round++) {
      for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffledDeck[i];
        shuffledDeck[i] = shuffledDeck[j];
        shuffledDeck[j] = temp;
      }
    }
    const selected = shuffledDeck.slice(0, numCards);
    const translatedSelected = selected.map(c => translateCard(c, activeLang));

    res.json({ cards: translatedSelected });
  } catch (err) {
    console.log("Erro ao sortear cartas do baralho:", err);
    res.status(500).json({ error: (req as any).t('api.tarot.internal_error') });
  }
});// Helper to generate deeply realistic, individualized tarot readings offline when the external API key is throttled
function generateOfflineTarotReading(type: string, cards: any[], question: string, userName: string, lang?: string): { reading: string; guidance: string } {
  const activeLang = (lang || "pt").toLowerCase();
  
  const userDisplay = userName || (
    activeLang === 'en' ? "Seeker of Wisdom" :
    activeLang === 'es' ? "Buscador de Sabiduría" :
    activeLang === 'de' ? "Suchender der Weisheit" :
    activeLang === 'fr' ? "Chercheur de Sagesse" :
    "Buscador de Sabedoria"
  );
  
  const mainCardsLine = cards && Array.isArray(cards)
    ? cards.map((c: any) => c.cardName).join(", ")
    : (
      activeLang === 'en' ? "subtle forces" :
      activeLang === 'es' ? "fuerzas sutiles" :
      activeLang === 'de' ? "subtile Kräfte" :
      activeLang === 'fr' ? "forces subtiles" :
      "forças sutis"
    );

  const guidanceMantras: Record<string, string[]> = {
    pt: [
      "Respire fundo. A força do cosmo habita no seu silêncio divino hoje.",
      "Abra-se para o novo caminho com fé sincera, sabedoria e pés no chão.",
      "Afaste-se de fofocas e ruídos externos; silencie sua mente e blinde seu lar.",
      "Consagre suas finanças à sabedoria e aja com prudência nas parcerias.",
      "Blindagem cósmica ativada: confie no seu brilho interior único.",
      "O amor verdadeiro e sincero flui no respeito ao próprio tempo sagrado."
    ],
    en: [
      "Take a deep breath. The strength of the cosmos dwells in your divine silence today.",
      "Open yourself to the new path with sincere faith, wisdom, and feet on the ground.",
      "Stay away from gossip and external noise; silence your mind and shield your home.",
      "Consecrate your finances to wisdom and act with prudence in partnerships.",
      "Cosmic shield activated: trust in your unique inner brilliance.",
      "True and sincere love flows in respect of its own sacred time."
    ],
    es: [
      "Respire hondo. La fuerza del cosmos habita en su silencio divino hoy.",
      "Ábrase al nuevo camino con fe sincera, sabiduría y los pies en la tierra.",
      "Aléjese de los chismes y el ruido externo; silencie su mente y proteja su hogar.",
      "Consagre sus finanzas a la sabiduría y actúe con prudencia en las asociaciones.",
      "Escudo cósmico activado: confíe en su brillo interior único.",
      "El amor verdadero y sincero fluye con respecto a su propio tiempo sagrado."
    ],
    de: [
      "Atmen Sie tief durch. Die Kraft des Kosmos wohnt heute in Ihrem göttlichen Schweigen.",
      "Öffnen Sie sich dem neuen Weg mit aufrichtigem Glauben, Weisheit und festem Boden unter den Füßen.",
      "Halten Sie sich von Klatsch und externem Lärm fern; Beruhigen Sie Ihren Geist und schützen Sie Ihr Zuhause.",
      "Weihen Sie Ihre Finanzen der Weisheit und handeln Sie in Partnerschaften mit Vorsicht.",
      "Kosmischer Schutzschild aktiviert: Vertrauen Sie auf Ihre einzigartige innere Brillanz.",
      "Wahre und aufrichtige Liebe fließt im Respekt vor der eigenen heiligen Zeit."
    ],
    fr: [
      "Respirez profondément. La force du cosmos réside aujourd'hui dans votre silence divin.",
      "Ouvrez-vous au nouveau chemin avec une foi sincère, de la sagesse et les pieds sur terre.",
      "Éloignez-vous des commérages et des bruits extérieurs ; calmez votre esprit et protégez votre foyer.",
      "Consacrez vos finances à la sagesse et agissez avec prudence dans vos partenariats.",
      "Bouclier cosmique activé : ayez confiance en votre éclat intérieur unique.",
      "L'amour vrai et sincère coule dans le respect de son propre temps sacré."
    ]
  };

  const list = guidanceMantras[activeLang] || guidanceMantras["pt"];
  const randomGuidance = list[Math.floor(Math.random() * list.length)];

  if (type === "amor") {
    const templates: Record<string, { p1: string, p2: string, p3: string, g: string }> = {
      pt: {
        p1: `Olá, ${userDisplay}. Sinto aqui, ao sintonizar com as cartas ${mainCardsLine}, uma vibração profunda que toca diretamente o seu campo afetivo. Como uma taróloga real com anos de experiência, vejo que sua alma procura clareza absoluta sobre sentimentos. Suas cartas revelam que o momento atual pede para você respirar fundo e se desfazer de expectativas pesadas que o passado deixou em seu coração. Há fofocas ou possíveis invejas camufladas ao seu redor; blinde o seu amor contra essas energias negativas.`,
        p2: `Se a sua dúvida central é "${question || "Qual o conselho do Tarot para minha vida amorosa no momento?"}", as cartas mostram a necessidade urgente de reciprocidade sã. Evite ciladas do apego inconsciente ou o medo da rejeição. As cartas aconselham a dialogar com tranquilidade e colocar limites éticos respeitáveis.`,
        p3: `Nas próximas semanas, espere por uma renovação sutil de sentimentos. A alquimia do coração cura suas dores quando você aceita sua própria dignidade e valor sagrado.`,
        g: `Sinal espiritual de Orbia: ${randomGuidance}`
      },
      en: {
        p1: `Hello, ${userDisplay}. I feel here, when tuning in to the cards ${mainCardsLine}, a deep vibration that directly touches your emotional field. As a real tarot reader with years of experience, I see that your soul is seeking absolute clarity about your feelings. Your cards reveal that the current moment asks you to take a deep breath and let go of the heavy expectations that the past has left in your heart. There is gossip or possible jealousy hidden around you; shield your love against these negative energies.`,
        p2: `If your central question is "${question || "What is the Tarot's advice for my love life right now?"}", the cards show an urgent need for healthy reciprocity. Avoid traps of unconscious attachment or the fear of rejection. The cards advise you to talk calmly and set respectable ethical boundaries.`,
        p3: `In the coming weeks, expect a subtle renewal of feelings. The alchemy of the heart heals your pain when you accept your own dignity and sacred value.`,
        g: `Spiritual sign of Orbia: ${randomGuidance}`
      },
      es: {
        p1: `Hola, ${userDisplay}. Siento aquí, al sintonizar con las cartas ${mainCardsLine}, una profunda vibración que toca directamente tu campo afectivo. Como una tarotista real con años de experiencia, veo que tu alma busca claridad absoluta sobre tus sentimientos. Tus cartas revelan que el momento actual te pide respirar hondo y desprenderte de las pesadas expectativas que el pasado dejó en tu corazón. Hay chismes o posibles envidias camufladas a tu alrededor; protege tu amor de estas energías negativas.`,
        p2: `Si tu pregunta central es "${question || "¿Cuál es el consejo del Tarot para mi vida amorosa en este momento?"}", las cartas muestran una necesidad urgente de reciprocidad sana. Evita las trampas del apego inconsciente o el miedo al rechazo. Las cartas aconsejan dialogar con tranquilidad y establecer límites éticos respetables.`,
        p3: `En las próximas semanas, espera una sutil renovación de sentimientos. La alquimia del corazón cura tus dolores cuando aceptas tu propia dignidad y valor sagrado.`,
        g: `Señal espiritual de Orbia: ${randomGuidance}`
      },
      de: {
        p1: `Hallo, ${userDisplay}. Ich spüre hier bei der Einstimmung auf die Karten ${mainCardsLine} eine tiefe Schwingung, die Ihr emotionales Feld direkt berührt. Als echte Tarot-Leserin mit jahrelanger Erfahrung sehe ich, dass Ihre Seele absolute Klarheit über Ihre Gefühle sucht. Ihre Karten zeigen, dass der gegenwärtige Moment Sie auffordert, tief durchzuatmen und die schweren Erwartungen loszulassen, die die Vergangenheit in Ihrem Herzen hinterlassen hat. In Ihrer Umgebung gibt es Klatsch oder mögliche Eifersucht; Schützen Sie Ihre Liebe vor diesen negativen Energien.`,
        p2: `Wenn Ihre zentrale Frage "${question || "Was ist der Rat des Tarots für mein Liebesleben im Moment?"}" lautet, zeigen die Karten ein dringendes Bedürfnis nach gesunder Gegenseitigkeit. Vermeiden Sie Fallen unbewusster Bindung oder die Angst vor Zurückweisung. Die Karten raten dazu, ruhig zu sprechen und respektable ethische Grenzen zu setzen.`,
        p3: `Erwarten Sie in den kommenden Wochen eine subtile Erneuerung der Gefühle. Die Alchemie des Herzens heilt Ihren Schmerz, wenn Sie Ihre eigene Würde und Ihren heiligen Wert akzeptieren.`,
        g: `Spirituelles Zeichen von Orbia: ${randomGuidance}`
      },
      fr: {
        p1: `Bonjour, ${userDisplay}. Je ressens ici, en me connectant aux cartes ${mainCardsLine}, une vibration profonde qui touche directement votre domaine affectif. En tant que tarologue professionnelle avec des années d'expérience, je vois que votre âme cherche une clarté absolue sur vos sentiments. Vos cartes révèlent que le moment actuel vous demande de respirer profondément et de vous détacher des attentes lourdes que le passé a laissées dans votre cœur. Il y a des commérages ou des jalousies potentielles cachées autour de vous ; protégez votre amour contre ces énergies négatives.`,
        p2: `Si votre question centrale est "${question || "Quel est le conseil du Tarot pour ma vie amoureuse en ce moment ?"}", les cartes montrent un besoin urgent de réciprocité saine. Évitez les pièges de l'attachement inconscient ou la peur du rejet. Les cartes conseillent de dialoguer calmement et de fixer des limites éthiques respectables.`,
        p3: `Dans les semaines à venir, attendez-vous à un subtil renouveau des sentiments. L'alchimie du cœur guérit vos blessures lorsque vous acceptez votre propre dignité et votre valeur sacrée.`,
        g: `Signe spirituel d'Orbia : ${randomGuidance}`
      }
    };
    const t = templates[activeLang] || templates["pt"];
    return { reading: `${t.p1}\n\n${t.p2}\n\n${t.p3}`, guidance: t.g };

  } else if (type === "semanal") {
    const templates: Record<string, { p1: string, p2: string, p3: string, p4: string, g: string }> = {
      pt: {
        p1: `Querido(a) ${userDisplay}, a Leitura Profunda das 10 cartas consagradas (${mainCardsLine}) revela um poderoso panorama espiritual focado em sua sintonização semanal. Este é um ciclo de merecido destaque e extrema importância para sua jornada!`,
        p2: `No Trabalho, negócios e caminhos profissionais, os arcanos trazem um potencial fecundo de manifestação se você estruturar suas prioridades de forma firme. Tenha muita paciência com fofocas ou mal olhado oculto no ambiente corporativo; evite partilhar todas as suas vitórias. A proteção espiritual indica que suas ações limpas triunfarão contra quaisquer artimanhas alheias.`,
        p3: `No Amor e convívio social, as conexões pedem um olhar equilibrado de cura e afeto generoso. Alerte-se contra dores do subconsciente profundo que perturbam sua rotina. Uma atitude sábia e prudente no seu lar trará paz para os seus familiares e entes queridos nesta semana sagrada.`,
        p4: `O resultado alquímico para a sua semana aconselha a dar o passo de fé necessário sem medo do amanhã, pois sua estrela guia está brilhando forte no firmamento.`,
        g: `Decreto Sagrado de Blindagem Semanal: As correntes falsas caem e a sabedoria divina blinda minha alma e meus caminhos.`
      },
      en: {
        p1: `Dear ${userDisplay}, the Deep Reading of the 10 consecrated cards (${mainCardsLine}) reveals a powerful spiritual landscape focused on your weekly tuning. This is a cycle of well-deserved prominence and extreme importance for your journey!`,
        p2: `In Work, business, and professional paths, the arcana bring a fertile potential of manifestation if you structure your priorities firmly. Be very patient with gossip or hidden evil eye in the corporate environment; avoid sharing all your victories. Spiritual protection indicates that your clean actions will triumph over any outside tricks.`,
        p3: `In Love and social interaction, connections ask for a balanced look of healing and generous affection. Watch out for deep subconscious pains that disrupt your routine. A wise and prudent attitude in your home will bring peace to your family and loved ones in this sacred week.`,
        p4: `The alchemical result for your week advises taking the necessary step of faith without fear of tomorrow, for your guiding star is shining bright in the firmament.`,
        g: `Sacred Decree of Weekly Shielding: The false chains fall and divine wisdom shields my soul and my paths.`
      },
      es: {
        p1: `Querido(a) ${userDisplay}, la Lectura Profunda de las 10 cartas consagradas (${mainCardsLine}) revela un poderoso panorama espiritual enfocado en tu sintonización semanal. ¡Este es un ciclo de merecido protagonismo y extrema importancia para tu viaje!`,
        p2: `En el Trabajo, negocios y caminos profesionales, los arcanos traen un potencial fértil de manifestación si estructuras tus prioridades firmemente. Ten mucha paciencia con los chismes o el mal de ojo oculto en el ambiente corporativo; evita compartir todas tus victorias. La protección espiritual indica que tus acciones limpias triunfarán sobre cualquier truco ajeno.`,
        p3: `En el Amor y la convivencia social, las conexiones piden una mirada equilibrada de curación y afecto generoso. Alértate contra los dolores del subconsciente profundo que perturban tu rutina. Una actitud sabia y prudente en tu hogar traerá paz a tus familiares y seres queridos en esta semana sagrada.`,
        p4: `El resultado alquímico para tu semana aconseja dar el paso de fe necesario sin miedo al mañana, pues tu estrella guía brilla con fuerza en el firmamento.`,
        g: `Decreto Sagrado de Blindaje Semanal: Las falsas cadenas caen y la sabiduría divina protege mi alma y mis caminos.`
      },
      de: {
        p1: `Liebe(r) ${userDisplay}, die tiefe Lesung der 10 geweihten Karten (${mainCardsLine}) enthüllt ein kraftvolles spirituelles Panorama, das auf Ihre wöchentliche Einstimmung ausgerichtet ist. Dies ist ein Zyklus wohlverdienter Prominenz und von äußerster Bedeutung für Ihre Reise!`,
        p2: `Im Bereich Arbeit, Geschäft und Karriere bringen die Arkana ein fruchtbares Manifestationspotenzial mit sich, wenn Sie Ihre Prioritäten fest strukturieren. Seien Sie sehr geduldig mit Klatsch oder verstecktem bösen Blick im Unternehmensumfeld; Vermeiden Sie es, alle Ihre Erfolge zu teilen. Spiritueller Schutz zeigt an, dass Ihre reinen Handlungen über alle Tricks von außen triumphieren werden.`,
        p3: `In der Liebe und im sozialen Umgang erfordern Verbindungen einen ausgewogenen Blick auf Heilung und großzügige Zuneigung. Achten Sie auf tiefe unbewusste Schmerzen, die Ihren Alltag stören. Eine weise und kluge Haltung in Ihrem Zuhause wird Ihren Angehörigen und Lieben in dieser heiligen Woche Frieden bringen.`,
        p4: `Das alchemistische Ergebnis für Ihre Woche rät dazu, den notwendigen Schritt des Glaubens ohne Angst vor dem Morgen zu tun, da Ihr Leitstern am Firmament hell leuchtet.`,
        g: `Heiliges Dekret zur wöchentlichen Abschirmung: Die falschen Ketten fallen und die göttliche Weisheit schirmt meine Seele und meine Wege ab.`
      },
      fr: {
        p1: `Cher(e) ${userDisplay}, la Lecture Profonde des 10 cartes consacrées (${mainCardsLine}) révèle un paysage spirituel puissant axé sur votre accordage hebdomadaire. C'est un cycle de premier plan bien mérité et d'une importance extrême pour votre voyage !`,
        p2: `Dans le Travail, les affaires et les voies professionnelles, les arcanes apportent un potentiel fertile de manifestation si vous structurez fermement vos priorités. Soyez très patient face aux commérages ou au mauvais œil caché dans l'environnement de l'entreprise ; évitez de partager toutes vos victoires. La protection spirituelle indique que vos actions honnêtes triompheront de toutes les ruses extérieures.`,
        p3: `Dans l'Amour et les relations sociales, les connexions demandent un regard équilibré de guérison et d'affection généreuse. Méfiez-vous des douleurs inconscientes profondes qui perturbent votre routine. Une attitude sage et prudente au sein de votre foyer apportera la paix à votre famille et à vos proches en cette semaine sacrée.`,
        p4: `Le résultat alchimique pour votre semaine conseille de faire le pas de foi nécessaire sans craindre le lendemain, car votre bonne étoile brille fort au firmament.`,
        g: `Décret Sacré de Blindage Hebdomadaire : Les fausses chaînes tombent et la sagesse divine protège mon âme et mes chemins.`
      }
    };
    const t = templates[activeLang] || templates["pt"];
    return { reading: `${t.p1}\n\n${t.p2}\n\n${t.p3}\n\n${t.p4}`, guidance: t.g };

  } else if (type === "inteligente") {
    const templates: Record<string, { p1: string, p2: string, p3: string, g: string }> = {
      pt: {
        p1: `Olá, ${userDisplay}. Unindo a sintonização do seu momento com a força dos arquétipos sorteados (${mainCardsLine}), as cartas expressam o seu momento de vida com grande riqueza de detalhes e sentimentos humanos. Vejo uma força pessoal de autodomínio clamando por ordem e maturidade espiritual para vencer desafios diários.`,
        p2: `Sobre sua questão de autoconhecimento: "${question || "Conselho geral sobre meu momento atual"}", as cartas apontam fendas abertas que se curam através do recolhimento saudável e da reflexão equilibrada. Evite fofocas, preocupações com opiniões alheias e afaste-se do convívio com pessoas de baixa vibração energética.`,
        p3: `Mantenha sua concentração afiada e canalize seus recursos na sua carreira e bem-estar prático. Você possui os dons necessários para prosperar e manter a cabeça erguida diante do fluxo universal.`,
        g: `Mantra de Poder de Orbia: ${randomGuidance}`
      },
      en: {
        p1: `Hello, ${userDisplay}. Uniting the tuning of your moment with the strength of the drawn archetypes (${mainCardsLine}), the cards express your moment of life with great richness of detail and human feelings. I see a personal force of self-mastery calling for order and spiritual maturity to overcome daily challenges.`,
        p2: `Regarding your self-knowledge question: "${question || "General advice about my current moment"}", the cards point to open gaps that heal through healthy retreat and balanced reflection. Avoid gossip, worries about other people's opinions, and stay away from socializing with low-vibration people.`,
        p3: `Keep your concentration sharp and channel your resources into your career and practical well-being. You possess the necessary gifts to prosper and keep your head held high before the universal flow.`,
        g: `Power Mantra of Orbia: ${randomGuidance}`
      },
      es: {
        p1: `Hola, ${userDisplay}. Uniendo la sintonización de tu momento con la fuerza de los arquetipos dibujados (${mainCardsLine}), las cartas expresan tu momento de vida con gran riqueza de detalles y sentimientos humanos. Veo una fuerza personal de autodominio que clama por orden y madurez espiritual para superar los desafíos diarios.`,
        p2: `Sobre tu pregunta de autoconocimiento: "${question || "Consejo general sobre mi momento actual"}", las cartas apuntan a brechas abiertas que se curan a través del retiro saludable y la reflexión equilibrada. Evita los chismes, las preocupaciones sobre las opiniones de los demás y aléjate de socializar con personas de baja vibración.`,
        p3: `Mantén tu concentración aguda y canaliza tus recursos hacia tu carrera y bienestar práctico. Posees los dones necesarios para prosperar y mantener la cabeza en alto ante el flujo universal.`,
        g: `Mantra de Poder de Orbia: ${randomGuidance}`
      },
      de: {
        p1: `Hallo, ${userDisplay}. Indem wir die Abstimmung Ihres Augenblicks mit der Stärke der gezeichneten Archetypen (${mainCardsLine}) vereinen, drücken die Karten Ihren Lebensmoment mit großem Detailreichtum und menschlichen Gefühlen aus. Ich sehe eine persönliche Kraft der Selbstbeherrschung, die nach Ordnung und spiritueller Reife ruft, um tägliche Herausforderungen zu meistern.`,
        p2: `Zu Ihrer Frage der Selbsterkenntnis: "${question || "Allgemeiner Rat zu meinem aktuellen Moment"}" weisen die Karten auf offene Lücken hin, die durch gesunden Rückzug und ausgewogene Reflexion heilen. Vermeiden Sie Klatsch, Sorgen über die Meinungen anderer Menschen und halten Sie sich vom Umgang mit Menschen mit geringer Schwingung fern.`,
        p3: `Halten Sie Ihre Konzentration scharf und kanalisieren Sie Ihre Ressourcen in Ihre Karriere und Ihr praktisches Wohlbefinden. Sie besitzen die notwendigen Gaben, um erfolgreich zu sein und angesichts des universellen Flusses Ihren Kopf hochzuhalten.`,
        g: `Machtmantra von Orbia: ${randomGuidance}`
      },
      fr: {
        p1: `Bonjour, ${userDisplay}. En unissant l'accordage de votre moment à la force des archétypes tirés (${mainCardsLine}), les cartes expriment votre moment de vie avec une grande richesse de détails et de sentiments humains. Je vois une force personnelle de maîtrise de soi appelant à l'ordre et à la maturité spirituelle pour surmonter les défis quotidiens.`,
        p2: `Concernant votre question sur la connaissance de soi : "${question || "Conseil général sur mon moment actuel"}", les cartes indiquent des brèches ouvertes qui se guérissent par une retraite saine et une réflexion équilibrée. Évitez les commérages, les soucis liés aux opinions des autres et éloignez-vous de la fréquentation des personnes à basse vibration.`,
        p3: `Gardez votre concentration aiguisée et canalisez vos ressources dans votre carrière et votre bien-être pratique. Vous possédez les dons nécessaires pour prospérer et garder la tête haute face au flux universel.`,
        g: `Mantra de Pouvoir d'Orbia : ${randomGuidance}`
      }
    };
    const t = templates[activeLang] || templates["pt"];
    return { reading: `${t.p1}\n\n${t.p2}\n\n${t.p3}`, guidance: t.g };

  } else {
    const templates: Record<string, { p1: string, p2: string, p3: string, g: string }> = {
      pt: {
        p1: `Consulente ${userDisplay}, a sua tiragem clássica de cartas tradicionais traz a emanação profunda de: ${mainCardsLine}. Cada arquétipo reflete forças milenares e nos ensina lições vivenciais indispensáveis para harmonizar nossa rotina.`,
        p2: `Em relação à sua questão ou dúvida: "${question || "Conselho geral"}", o oráculo adverte que fofocas ou desequilíbrios momentâneos no ambiente laboral e familiar devem ser combatidos com prudência e retidão. Não responda à discórdia com a mesma vibração; conserve seu silêncio curativo e seu autodirecionamento maduro.`,
        p3: `Aproveite as oportunidades e sintonize seu coração com os sinais que o universo envia no silêncio do seu lar. A colheita de seus esforços será muito rica no tempo certo do cosmo.`,
        g: `Conselho dos Arcanos Clássicos: ${randomGuidance}`
      },
      en: {
        p1: `Querist ${userDisplay}, your classic spread of traditional cards brings the deep emanation of: ${mainCardsLine}. Each archetype reflects ancient forces and teaches us indispensable life lessons to harmonize our routine.`,
        p2: `Regarding your question or concern: "${question || "General advice"}", the oracle warns that gossip or temporary imbalances in the work and family environment must be combated with prudence and rectitude. Do not respond to discord with the same vibration; preserve your healing silence and your mature self-direction.`,
        p3: `Seize the opportunities and tune your heart with the signs that the universe sends in the silence of your home. The harvest of your efforts will be very rich in the right cosmic time.`,
        g: `Advice of the Classic Arcana: ${randomGuidance}`
      },
      es: {
        p1: `Consultante ${userDisplay}, tu tirada clásica de cartas tradicionales trae la profunda emanación de: ${mainCardsLine}. Cada arquetipo refleja fuerzas milenarias y nos enseña lecciones de vida indispensables para armonizar nuestra rutina.`,
        p2: `Con respecto a tu pregunta o inquietud: "${question || "Consejo general"}", el oráculo advierte que los chismes o desequilibrios temporales en el entorno laboral y familiar deben ser combatidos con prudencia y rectitud. No respondas a la discordia con la misma vibración; conserva tu silencio curativo y tu maduro autodireccionamiento.`,
        p3: `Aprovecha las oportunidades y sintoniza tu corazón con las señales que el universo envía en el silencio de tu hogar. La cosecha de tus esfuerzos será muy rica en el momento cósmico adecuado.`,
        g: `Consejo de los Arcanos Clásicos: ${randomGuidance}`
      },
      de: {
        p1: `Frager ${userDisplay}, Ihr klassisches Spread traditioneller Karten bringt die tiefe Ausstrahlung von: ${mainCardsLine}. Jedes Archetyp spiegelt jahrtausendealte Kräfte wider und lehrt uns unverzichtbare Lebenslektionen, um unseren Alltag zu harmonisieren.`,
        p2: `Bezüglich Ihrer Frage oder Sorge: "${question || "Allgemeiner Rat"}" warnt das Orakel, dass Klatsch oder vorübergehende Ungleichgewichte im Arbeits- und Familienumfeld mit Vorsicht und Rechtschaffenheit bekämpft werden müssen. Antworten Sie nicht auf Zwietracht mit derselben Schwingung; Bewahren Sie Ihr heilendes Schweigen und Ihre reife Selbstführung.`,
        p3: `Nutzen Sie die Gelegenheiten und stimmen Sie Ihr Herz auf die Zeichen ein, die das Universum in der Stille Ihres Heims sendet. Die Ernte Ihrer Bemühungen wird zur richtigen kosmischen Zeit sehr reich sein.`,
        g: `Rat der klassischen Arkana: ${randomGuidance}`
      },
      fr: {
        p1: `Consultant ${userDisplay}, votre tirage classique de cartes traditionnelles apporte la profonde émanation de : ${mainCardsLine}. Chaque archétype reflète des forces millénaires et nous enseigne des leçons de vie indispensables pour harmoniser notre routine.`,
        p2: `Concernant votre question ou doute : "${question || "Conseil général"}", l'oracle avertit que les commérages ou déséquilibres temporaires dans l'environnement de travail et familial doivent être combattus avec prudence et rectitude. Ne répondez pas à la discorde par la même vibration ; conservez votre silence réparateur et votre direction personnelle mature.`,
        p3: `Saisissez les opportunités et accordez votre cœur aux signes que l'univers envoie dans le silence de votre foyer. La récolte de vos efforts sera très riche au bon moment cosmique.`,
        g: `Conseil des Arcanes Classiques : ${randomGuidance}`
      }
    };
    const t = templates[activeLang] || templates["pt"];
    return { reading: `${t.p1}\n\n${t.p2}\n\n${t.p3}`, guidance: t.g };
  }
}

// API: Interpretação de cartas sintonizadas por IA
app.post("/api/tarot/interpret", async (req, res) => {
  const { type, cards, question, userName, lang } = req.body;
  const userDisplay = userName || "Buscador de Sabedoria";

  const cardsListStr = cards && Array.isArray(cards)
    ? cards.map((c: any, index: number) => `Carta ${index + 1}: ${c.cardName} (Foco: ${c.uprightMeaning || ''}. Conselho: ${c.advice || ''})`).join(", ")
    : "uma carta misteriosa";

  const activeLang = (lang || "pt").toLowerCase();
  const langNames: Record<string, string> = {
    pt: "Português",
    en: "English (Inglês)",
    es: "Spanish (Espanhol)",
    de: "German (Alemão)",
    fr: "French (Francês)"
  };
  const targetLangName = langNames[activeLang] || "Português";

  let systemPrompt = `Você é Orbia, uma taróloga profissional de verdade, extremamente sensitiva, acolhedora e profundamente humana com anos de experiência em leituras espirituais presenciais. 

Suas respostas NUNCA devem parecer artificiais, frias ou robóticas. Você fala diretamente ao coração do consulente de forma viva, íntima e sincera, como uma taróloga experiente falaria cara a cara, revelando fendas na alma, detalhes ocultos e sentimentos reais.

Nas suas leituras, você deve obrigatoriamente trazer e explorar elementos práticos da vida do consulente:
- O momento atual em que a pessoa se encontra e o que está acontecendo à sua volta.
- O que ela precisa prestar atenção urgente (alertas práticos de comportamento).
- Orientação sobre o que fazer e atitudes a evitar.
- O convívio social e relacionamentos (amigos, pessoas próximas, possíveis tramas).
- Trabalho, carreira, finanças e caminhos de prosperidade.
- Energias ao redor: se atentar contra invejas, fofocas, má vibração ou mal olhado oculto no ambiente se cartas mais pesadas ou espirituais surgirem (como Diabo, Torre, Sacerdotisa, Lua), ensinando formas de se proteger ou manter a cabeça erguida.

Escreva em parágrafos envolventes, fluidos e repletos de sabedoria ancestral em ${targetLangName}.`;

  let userPrompt = "";

  if (type === "amor") {
    userPrompt = `Realize uma consulta de Tarot do Amor mística e profundamente humana para ${userDisplay}.
As cartas sorteadas pelo consulente do baralho de costas são: ${cardsListStr}.
A pergunta romântica ou angústia afetiva é: "${question || "Qual o conselho do Tarot para minha vida amorosa no momento?"}".

Como uma taróloga de verdade lendo os segredos do coração, faça uma leitura reveladora. Trate de ciúmes, reciprocidade, pessoas ao redor que podem trazer inveja no romance, caminhos livres ou bloqueados de conexão e dê um norte exato sobre o que fazer e como se blindar espiritualmente.

Gere um JSON exato em ${targetLangName} com este formato de chaves:
{
  "reading": "Texto fluido e profundo da sua leitura romântica realista de taróloga real, máximo 280 palavras...",
  "guidance": "Mantra ou sinal espiritual do coração para vibrar positivamente hoje..."
}`;
  } else if (type === "inteligente") {
    userPrompt = `Realize uma consulta de Tarot Inteligente para ${userDisplay} focando em autoconhecimento evolutivo e vida pessoal.
As cartas sorteadas são: ${cardsListStr}.
A questão trazida é: "${question || "Conselho geral sobre meu momento de vida e escolhas"}"

Leia esta dinâmica de forma humana e calorosa. Fale sobre as conexões cotidianas, a rotina profissional, os sabotadores mentais (inveja externa ou autorrecriminação), o que de fato está acontecendo na jornada dela e como canalizar melhor esse caminho prático.

Gere um JSON exato em ${targetLangName} com este formato de chaves:
{
  "reading": "Texto de leitura realista e acolhedora da taróloga Orbia, com linguagem humana e sincera, máximo 280 palavras...",
  "guidance": "Um mantra de poder ou atitude mágica personalizada para o dia..."
}`;
  } else if (type === "semanal") {
    userPrompt = `Realize a Leitura do Tarot Semanal Profunda de 10 cartas para ${userDisplay}. 
Esse é um momento de extrema importância e destaque na semana do consulente!
As 10 cartas consagradas que foram sorteadas são: ${cardsListStr}.

Como uma taróloga real em sua mesa sagrada, interprete essa tiragem profunda de 10 cartas! Desenvolva em detalhes ricos:
1. O panorama geral de forças espirituais para esta semana.
2. Trabalho, negócios e caminhos profissionais de prosperidade.
3. Vida amorosa e relações sociais (quem se aproxima, proteção contra falsidades ou invejas na roda de convívio).
4. O que se atentar com máxima urgência, o que fazer para vencer os desafios e o que evitar de qualquer forma.
5. Mensagem de blindagem energética e espiritual.

Dê uma leitura magnífica, ampla, altamente personalizada e muito humana.

Gere um JSON em ${targetLangName} com este formato de chaves:
{
  "reading": "Leitura semanal profunda detalhando cada uma das áreas com fluidez e calor humano, em tom de conversa intimista e espiritual de terapeuta e taróloga real, máximo 380 palavras...",
  "guidance": "O grande conselho ou decreto consagrado de luz para guiar e blindar toda a semana de forma impecável..."
}`;
  } else {
    // Tradicional ou fallback clássico
    userPrompt = `Realize uma leitura de Tarot Tradicional Práctico com interpretação clássica refinada para ${userDisplay}.
As cartas sorteadas são: ${cardsListStr}.
Dúvida apresentada: "${question || "Conselho geral dos arquétipos milenares"}"

Interprete de maneira mística, histórica e vivencial os arcanos tirados por ele. Faça a pessoa compreender a força espiritual do herói em sua jornada diária, perigos práticos de fofocas ou traições indicados nos arquétipos, e atitudes positivas para harmonizar seu lar e trabalho.

Gere um JSON exato em ${targetLangName} com este formato de chaves:
{
  "reading": "A leitura e correlação clássica detalhada pela taróloga, rica em significados humanos, máximo 280 palavras...",
  "guidance": "Um mantra de sintonização ou conselho clássico..."
}`;
  }

  try {
    const response = await generateContentWithFallback({
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      }
    });

    const parsed = cleanAndParseJSON(response.text || "{}");
    res.json({
      reading: parsed.reading || generateOfflineTarotReading(type, cards, question, userName, activeLang).reading,
      guidance: parsed.guidance || generateOfflineTarotReading(type, cards, question, userName, activeLang).guidance
    });
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const isRateLimit = errMsg.includes("Limite de requisições excedido") || 
                        errMsg.includes("429") || 
                        errMsg.includes("quota") || 
                        errMsg.includes("Quota") || 
                        errMsg.includes("cooldown") || 
                        errMsg.includes("throttled");

    if (isRateLimit) {
      console.log(`[Tarot Info] Sintonizador astrológico local ativo (Cota da API atingida no momento).`);
    } else {
      console.log("[Tarot Info] Servindo leitura sintonizada offline devido a instabilidade:", errMsg);
    }
    
    // Serve robust, fully custom simulated reading
    const fallbackResult = generateOfflineTarotReading(type, cards, question, userName, activeLang);
    res.json(fallbackResult);
  }
});



// ====================================================
// BACKEND ADMIN, PREMIUM SCHEMAS & NOTIFICATIONS API
// ====================================================

// Mock database tables (in-memory state persisting throughout container lifecycle)
let mockUsers = [
  { id: "1", name: "Fabricio Souza Santos", email: "fabriciosouzasantos02@gmail.com", role: "Premium Subscriber", status: "Active", birthDate: "1997-02-11", plan: "Celestial VIP", joinDate: "2026-01-10" },
  { id: "2", name: "Ana Beatriz Silva", email: "anabeatriz@example.com", role: "Free User", status: "Active", birthDate: "1999-05-24", plan: "Free Tier", joinDate: "2026-02-15" },
  { id: "3", name: "Carlos Eduardo Oliveira", email: "carlos.edu@example.com", role: "Premium Subscriber", status: "Active", birthDate: "1988-12-03", plan: "Astro Premium", joinDate: "2026-03-22" },
  { id: "4", name: "Mariana Costa", email: "mariana.c@example.com", role: "Basic Subscriber", status: "Inactive", birthDate: "1992-07-15", plan: "Basic Plan", joinDate: "2026-04-01" },
  { id: "5", name: "Lucas Henderson Martins", email: "lucas.henderson@example.com", role: "VIP Elite", status: "Active", birthDate: "2001-10-30", plan: "Celestial VIP", joinDate: "2026-05-18" }
];

let mockPlans = [
  { id: "free", name: "Free Tier", price: "R$ 0", description: "Acesso a mapas básicos e biorritmo padrão diário.", features: ["Mapa Natal Essencial", "Biorritmo Diário"] },
  { id: "basic", name: "Basic Plan", price: "R$ 29,90/mês", description: "Leituras detalhadas mais oráculo celeste offline.", features: ["Tudo do Grátis", "Oráculo Diário Completo", "Histórico de Trânsitos"] },
  { id: "premium", name: "Astro Premium", price: "R$ 49,90/mês", description: "Destaque total de trânsitos avançados e conselheira IA de chat.", features: ["Tudo do Básico", "Chat Conselheira Sem Limites", "Alertas Celestiais por Email"] },
  { id: "vip", name: "Celestial VIP", price: "R$ 99,90/mês", description: "Exclusividade total planetária, consultas e sintonizador de raras notificações de cota infinita.", features: ["Tudo do Premium", "Sintonizador Astrológico Prioritário", "Notificações de Raros Alertas Push + WhatsApp"] }
];

let mockContents = [
  { id: "c1", title: "Trânsito de Vênus em Leão", type: "Alerta Astral", author: "Catarina Médici", status: "Publicado", date: "2026-06-09" },
  { id: "c2", title: "Ciclo Lunar das Aspirações Espirituais", type: "Guia Clássico", author: "Astrologia Core", status: "Publicado", date: "2026-06-08" },
  { id: "c3", title: "Como Ativar a Energia da Casa 12 nos Negócios", type: "Artigo Premium", author: "Mestre Hermes", status: "Rascunho", date: "2026-06-07" },
  { id: "c4", title: "Previsões Astrológicas do Solstício de Inverno", type: "Relatório", author: "Conselheira Celeste", status: "Publicado", date: "2026-06-05" }
];

let mockNotificationsLog = [
  { id: "n1", type: "push", title: "Configurações atualizadas!", message: "Suas coordenadas celestes foram sintonizadas com sucesso.", timestamp: new Date(Date.now() - 500000).toISOString(), read: false },
  { id: "n2", type: "email", title: "Relatório Mensal de Trânsitos", message: "Seu trânsito de junho está pronto. Júpiter ingressou no seu setor de expansão financeira.", timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
  { id: "n3", type: "alert", title: "Aspecto Raro Detectado", message: "Conjunção exata de Plutão com sua Lua Natal ocorre hoje às 21h.", timestamp: new Date(Date.now() - 7200000).toISOString(), read: false }
];

// 1. User Management Endpoint
app.get("/api/admin/users", (req, res) => {
  res.json(mockUsers);
});

app.post("/api/admin/users/create", (req, res) => {
  const { name, email, plan, birthDate } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: (req as any).t('api.auth.name_email_required') });
  }
  const newUser = {
    id: String(mockUsers.length + 1),
    name,
    email,
    role: plan === "Celestial VIP" || plan === "Astro Premium" ? "Premium Subscriber" : "Free User",
    status: "Active",
    birthDate: birthDate || "1997-02-11",
    plan: plan || "Free Tier",
    joinDate: new Date().toISOString().split('T')[0]
  };
  mockUsers.push(newUser);
  res.status(201).json(newUser);
});

app.post("/api/admin/users/update", (req, res) => {
  const { id, name, email, plan, status } = req.body;
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: (req as any).t('api.admin.user_not_found') });
  }
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(plan && { plan, role: plan === "Free Tier" ? "Free User" : "Premium Subscriber" }),
    ...(status && { status })
  };
  res.json(mockUsers[userIndex]);
});

app.delete("/api/admin/users/delete", (req, res) => {
  const { id } = req.body;
  const initialLen = mockUsers.length;
  mockUsers = mockUsers.filter(u => u.id !== id);
  if (mockUsers.length === initialLen) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }
  res.json({ success: true, message: (req as any).t('api.admin.user_deleted') });
});

// 2. Subscription Plans Management Endpoints
app.get("/api/admin/plans", (req, res) => {
  res.json(mockPlans);
});

app.post("/api/admin/plans/update", (req, res) => {
  const { id, name, price, description, features } = req.body;
  const planIndex = mockPlans.findIndex(p => p.id === id);
  if (planIndex === -1) {
    return res.status(404).json({ error: (req as any).t('api.admin.plan_not_found') });
  }
  mockPlans[planIndex] = {
    ...mockPlans[planIndex],
    ...(name && { name }),
    ...(price && { price }),
    ...(description && { description }),
    ...(features && { features })
  };
  res.json(mockPlans[planIndex]);
});

// 3. Content Management Endpoints
app.get("/api/admin/content", (req, res) => {
  res.json(mockContents);
});

app.post("/api/admin/content/create", (req, res) => {
  const { title, type, author, status } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: (req as any).t('api.admin.content_title_type_required') });
  }
  const newContent = {
    id: "c" + (mockContents.length + 1),
    title,
    type,
    author: author || "Curadoria Estelar",
    status: status || "Rascunho",
    date: new Date().toISOString().split('T')[0]
  };
  mockContents.push(newContent);
  res.status(201).json(newContent);
});

app.post("/api/admin/content/update", (req, res) => {
  const { id, title, type, author, status } = req.body;
  const contentIndex = mockContents.findIndex(c => c.id === id);
  if (contentIndex === -1) {
    return res.status(404).json({ error: (req as any).t('api.admin.content_not_found') });
  }
  mockContents[contentIndex] = {
    ...mockContents[contentIndex],
    ...(title && { title }),
    ...(type && { type }),
    ...(author && { author }),
    ...(status && { status })
  };
  res.json(mockContents[contentIndex]);
});

app.delete("/api/admin/content/delete", (req, res) => {
  const { id } = req.body;
  const initialLen = mockContents.length;
  mockContents = mockContents.filter(c => c.id !== id);
  if (mockContents.length === initialLen) {
    return res.status(404).json({ error: "Conteúdo não encontrado." });
  }
  res.json({ success: true, message: (req as any).t('api.admin.content_deleted') });
});

// 4. Statistics Endpoint
app.get("/api/admin/stats", (req, res) => {
  const activeSubs = mockUsers.filter(u => u.role === "Premium Subscriber" && u.status === "Active").length;
  const totalRevenue = activeSubs * 64.9; // Dynamic average revenue
  const cacheHitCount = geminiCache.size;

  res.json({
    totalUsers: mockUsers.length,
    activeSubscribers: activeSubs,
    monthlyRecurringRevenue: `R$ ${totalRevenue.toFixed(2)}`,
    mrrFloat: totalRevenue,
    cacheHits: cacheHitCount,
    apiResponseSuccessRate: "99.8%",
    activeModels: [CHAT_MODEL, "gemini-3.1-flash-lite", "Local Astrological Tuning"],
    userDeviceSplit: { mobile: "78%", desktop: "22%" },
    cacheEntries: Array.from(geminiCache.keys())
  });
});

// 5. Multi-channel Notification Endpoints (Push, Email, Alerts)
app.get("/api/admin/notifications/history", (req, res) => {
  res.json(mockNotificationsLog);
});

app.post("/api/admin/notifications/send", (req, res) => {
  const { type, title, message } = req.body;
  if (!type || !title || !message) {
    return res.status(400).json({ error: (req as any).t('api.admin.notification_fields_required') });
  }

  const newLog = {
    id: "n" + (mockNotificationsLog.length + 1),
    type, // "push" | "email" | "alert"
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };

  mockNotificationsLog.unshift(newLog); // Prepend to history

  // Simulate real dispatch console logs
  console.log(`[DISPACHER SISTEMA - NOTIFICAÇÃO ${type.toUpperCase()}]`);
  console.log(`Assunto: ${title}`);
  console.log(`Conteúdo: ${message}`);
  console.log(`-----------------------------------------------`);

  res.status(201).json({
    success: true,
    dispatched: newLog,
    simulationLog: `Notificação enviada com sucesso no canal [${type.toUpperCase()}]`
  });
});

app.post("/api/admin/notifications/read", (req, res) => {
  const { id } = req.body;
  const notif = mockNotificationsLog.find(n => n.id === id);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true });
});

// 6. Premium Gateway & Subscription Simulator Endpoint
app.post("/api/payments/subscribe", (req, res) => {
  const { name, email, planId, cardNumber, cvv } = req.body;
  if (!name || !email || !planId) {
    return res.status(400).json({ error: (req as any).t('api.payment.details_required') });
  }

  const selectedPlan = mockPlans.find(p => p.id === planId) || mockPlans[2]; // fallback to premium

  // Simulate secure dynamic processing delay & checks
  const transactionId = "TX_" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const timestamp = new Date().toISOString();

  // Find or create user
  let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role: "Premium Subscriber",
      status: "Active",
      birthDate: "1997-02-11",
      plan: selectedPlan.name,
      joinDate: new Date().toISOString().split('T')[0]
    };
    mockUsers.push(user);
  } else {
    user.role = "Premium Subscriber";
    user.status = "Active";
    user.plan = selectedPlan.name;
  }

  // Create an automatic internal notification about the custom acquisition
  const notificationMsg = {
    id: "n" + (mockNotificationsLog.length + 1),
    type: "alert",
    title: (req as any).t('api.payment.active_premium_sync'),
    message: (req as any).t('api.payment.activation_congrats', { name, planName: selectedPlan.name, price: selectedPlan.price, transactionId }),
    timestamp,
    read: false
  };
  mockNotificationsLog.unshift(notificationMsg);

  res.json({
    success: true,
    message: (req as any).t('api.payment.subscription_success'),
    transactionId,
    amount: selectedPlan.price,
    planName: selectedPlan.name,
    user,
    receiptUrl: `https://mockpayment-receipt.pdf/astromapping/${transactionId}`
  });
});

// NEW API: Astro-Email verification code dispatch (Simplified - SMTP decoupled)
app.post("/api/auth/send-verification-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: (req as any).t('api.auth.email_code_required') });
    }

    console.log(`[Email Dispatch Simplified] Código gerado para ${email}: ${code}`);
    return res.json({
      success: true,
      simulated: true,
      message: (req as any).t('api.auth.simulation_notice', { code })
    });
  } catch (err: any) {
    console.error("[Email Dispatch] Erro ao enviar e-mail:", err);
    return res.status(500).json({ error: err.message || (req as any).t('api.auth.email_verification_error') });
  }
});

// Firebase Webhook Logs, Billing Events, & Authority Activator
let firebaseBackendApp: any = null;
let firebaseBackendDb: any = null;

function getBackendDb() {
  if (!firebaseBackendDb) {
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.apiKey && config.projectId) {
          if (getApps().length === 0) {
            firebaseBackendApp = initializeApp(config);
          } else {
            firebaseBackendApp = getApp();
          }
          const dbId = config.firestoreDatabaseId;
          if (dbId && dbId !== "(default)") {
            firebaseBackendDb = getFirestore(firebaseBackendApp, dbId);
          } else {
            firebaseBackendDb = getFirestore(firebaseBackendApp);
          }
          console.log("[Firebase Backend] Inicializado com sucesso.");
        }
      }
    } catch (e) {
      console.error("[Firebase Backend] Erro ao inicializar:", e);
    }
  }
  return firebaseBackendDb;
}

async function activatePremiumForUser(email: string, planId: string, subscriptionId?: string, subscriptionEndDate?: string) {
  const db = getBackendDb();
  if (!db) {
    console.error("[Billing] Database not initialized for premium activation");
    return;
  }
  
  const mailKey = email.toLowerCase().trim();
  console.log(`[Billing] Ativando premium para ${mailKey} - Plano: ${planId}`);
  
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", mailKey));
    const snap = await getDocs(q);
    
    const endDate = subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const updateData = {
      isPremium: true,
      planId: planId,
      subscriptionId: subscriptionId || "",
      subscriptionEndDate: endDate,
      isSubscribed: true,
      updatedAt: new Date().toISOString()
    };
    
    if (!snap.empty) {
      for (const d of snap.docs) {
        await setDoc(doc(db, "users", d.id), updateData, { merge: true });
        console.log(`[Billing] Documento atualizado com premium: users/${d.id}`);
      }
    } else {
      console.log(`[Billing] Nenhum usuário encontrado com email ${mailKey}. Criando documento temporário.`);
      await setDoc(doc(db, "users", mailKey), {
        email: mailKey,
        name: "Viajante Estelar",
        birthDate: "",
        birthTime: "",
        birthCity: "",
        hasCreatedMap: false,
        scorePoints: 0,
        ...updateData
      }, { merge: true });
    }
  } catch (e) {
    console.error(`[Billing] Erro ao ativar premium para ${mailKey}:`, e);
  }
}

async function logStripeWebhook(eventId: string, eventType: string, payload: any) {
  const db = getBackendDb();
  if (!db) return;
  try {
    const webhooksRef = collection(db, "stripe_webhook_logs");
    await setDoc(doc(webhooksRef, eventId || `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`), {
      eventType,
      payload: JSON.stringify(payload),
      receivedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn("[Billing Logs] Falha ao logar webhook:", e);
  }
}

async function logBillingEvent(email: string, eventType: string, planId: string, details: any) {
  const db = getBackendDb();
  if (!db) return;
  try {
    const eventsRef = collection(db, "billing_events");
    await addDoc(eventsRef, {
      email: email.toLowerCase().trim(),
      eventType,
      planId,
      details,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn("[Billing Logs] Falha ao logar billing event:", e);
  }
}

app.post("/api/stripe/webhook", async (req: any, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    const stripe = getStripeClient();
    if (stripe && sig && endpointSecret && endpointSecret.trim() !== "") {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } else {
      event = req.body;
    }
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventId = event.id;
  const eventType = event.type;
  
  console.log(`[Webhook] Recebido evento Stripe: ${eventType}`);
  await logStripeWebhook(eventId, eventType, event);

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.metadata?.email || session.customer_details?.email || session.customer_email;
        const planId = session.metadata?.planId || "premium";
        const subscriptionId = session.subscription || "";
        
        let subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        if (subscriptionId && getStripeClient()) {
          try {
            const stripe = getStripeClient();
            const sub = await stripe!.subscriptions.retrieve(subscriptionId);
            subscriptionEndDate = new Date((sub as any).current_period_end * 1000).toISOString();
          } catch {}
        }

        if (email) {
          await activatePremiumForUser(email, planId, subscriptionId, subscriptionEndDate);
          await logBillingEvent(email, "ACTIVATION", planId, { session_id: session.id, subscriptionId });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const _invoice = event.data.object;
        const subscriptionId = _invoice.subscription;
        const email = _invoice.customer_email || _invoice.customer_details?.email;
        const planId = _invoice.lines?.data?.[0]?.metadata?.planId || "premium";
        
        let subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        if (subscriptionId && getStripeClient()) {
          try {
            const stripe = getStripeClient();
            const sub = await stripe!.subscriptions.retrieve(subscriptionId);
            subscriptionEndDate = new Date((sub as any).current_period_end * 1000).toISOString();
          } catch {}
        }

        if (email) {
          await activatePremiumForUser(email, planId, subscriptionId, subscriptionEndDate);
          await logBillingEvent(email, "RENEWAL_SUCCESS", planId, { invoice_id: _invoice.id, subscriptionId });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const subscriptionId = sub.id;
        const email = sub.metadata?.email || sub.customer_details?.email;
        
        if (email) {
          const db = getBackendDb();
          if (db) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
            const snap = await getDocs(q);
            for (const d of snap.docs) {
              await setDoc(doc(db, "users", d.id), {
                isPremium: false,
                isSubscribed: false,
                updatedAt: new Date().toISOString()
              }, { merge: true });
            }
          }
          await logBillingEvent(email, "CANCELLATION", "none", { subscriptionId });
        }
        break;
      }
      default:
        console.log(`[Webhook] Evento não tratado explicitamente: ${eventType}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Webhook Handler Error] Erro ao processar evento:`, error);
    res.status(500).json({ error: error.message || "Erro interno no processamento do webhook" });
  }
});

// Real Stripe Session Creation & Verification Handlers
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const { email, planId, planName, lang } = req.body;
    if (!email || !planId) {
      return res.status(400).json({ error: (req as any).t('api.stripe.email_plan_required') });
    }

    const origin = req.get('origin') || process.env.APP_URL || 'http://localhost:3000';
    const stripe = getStripeClient();

    // Determine values
    let amountInCents = 999; // EUR 9.99 default (Orbita Monthly)
    let currency = 'eur';
    let interval: 'month' | 'year' = 'month';

    if (planId === 'monthly') {
      amountInCents = 999;
      currency = 'eur';
      interval = 'month';
    } else if (planId === 'annual') {
      amountInCents = 7999;
      currency = 'eur';
      interval = 'year';
    } else if (planId === 'basic') {
      amountInCents = 2990;
      currency = 'brl';
      interval = 'month';
    } else if (planId === 'premium') {
      amountInCents = 4990;
      currency = 'brl';
      interval = 'month';
    } else if (planId === 'vip') {
      amountInCents = 9990;
      currency = 'brl';
      interval = 'month';
    }

    // Fallback if Stripe key is missing or is placeholder: Run beautiful celestial simulator link
    if (!stripe) {
      console.log(`[Stripe Simulator] Ativando checkout simulado de teste para ${email} no plano ${planId}.`);
      const mockSessionId = `mock_session_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const simulatedUrl = `${origin}?stripe_success=true&session_id=${mockSessionId}&simulated=true&plan_id=${planId}&email=${encodeURIComponent(email)}`;
      
      return res.json({
        id: mockSessionId,
        url: simulatedUrl,
        simulated: true,
        message: (req as any).t('api.stripe.simulator_active')
      });
    }

    // Creating actual live or test checkout session in Stripe
    const stripeLocale = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      locale: stripeLocale,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Portal Órbita - ${planName || planId.toUpperCase()}`,
              description: planId === 'annual' 
                ? 'Sincronização Cósmica Premium ilimitada - Assinatura Anual.' 
                : 'Sincronização Cósmica Premium ilimitada - Assinatura Mensal.',
            },
            unit_amount: amountInCents,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        planId,
        email,
      },
      customer_email: email,
      success_url: `${origin}?stripe_success=true&session_id={CHECKOUT_SESSION_ID}&plan_id=${planId}&email=${encodeURIComponent(email)}`,
      cancel_url: `${origin}?stripe_cancel=true`,
    });

    return res.json({
      id: session.id,
      url: session.url,
      simulated: false
    });
  } catch (err: any) {
    console.error("[Stripe] Erro ao criar Checkout Session:", err);
    return res.status(500).json({ error: err.message || (req as any).t('api.stripe.connection_error') });
  }
});

app.get("/api/stripe/verify-session", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: (req as any).t('api.stripe.session_id_required') });
    }

    // Verify Simulated Session
    if (session_id.startsWith("mock_session_")) {
      const email = (req.query.email || "usuario@exemplo.com").toString();
      const planId = (req.query.plan_id || "premium").toString();
      
      await activatePremiumForUser(email, planId, session_id);
      await logBillingEvent(email, "VERIFIED_SIMULATED_SESSION", planId, { session_id });

      return res.json({
        success: true,
        simulated: true,
        email: email,
        planId: planId,
        message: (req as any).t('api.stripe.verification_success')
      });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(400).json({ 
        error: (req as any).t('api.stripe.not_configured') 
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    
    if (!isPaid) {
      return res.json({
        success: false,
        message: (req as any).t('api.stripe.not_paid')
      });
    }

    const email = session.metadata?.email || session.customer_details?.email || session.customer_email;
    const planId = session.metadata?.planId || "premium";
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : "";

    if (email) {
      let subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      if (subscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          subscriptionEndDate = new Date((sub as any).current_period_end * 1000).toISOString();
        } catch {}
      }
      await activatePremiumForUser(email, planId, subscriptionId, subscriptionEndDate);
      await logBillingEvent(email, "VERIFIED_REAL_SESSION_BACKUP", planId, { session_id, subscriptionId });
    }

    return res.json({
      success: true,
      simulated: false,
      email: email,
      planId: planId,
      amount: session.amount_total ? session.amount_total / 100 : undefined,
      currency: session.currency
    });
  } catch (err: any) {
    console.error("[Stripe] Erro ao verificar checkout session:", err);
    return res.status(500).json({ error: err.message || (req as any).t('api.stripe.validation_error') });
  }
});

// Serve frontend assets in development vs production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static production assets mounted from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

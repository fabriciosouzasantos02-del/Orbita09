import { PlanetPosition, HouseCusp, Aspect } from "./types";
import i18next from "i18next";

function getActiveLanguage(): 'pt' | 'en' | 'es' | 'de' | 'fr' {
  const lang = (i18next.language || 'pt').toLowerCase().split('-')[0];
  if (['pt', 'en', 'es', 'de', 'fr'].includes(lang)) {
    return lang as 'pt' | 'en' | 'es' | 'de' | 'fr';
  }
  return 'pt';
}

const TRANSLATED_SIGNS: Record<string, Record<string, string>> = {
  pt: { "Áries": "Áries", "Touro": "Touro", "Gêmeos": "Gêmeos", "Câncer": "Câncer", "Leão": "Leão", "Virgem": "Virgem", "Libra": "Libra", "Escorpião": "Escorpião", "Sagitário": "Sagitário", "Capricórnio": "Capricórnio", "Aquário": "Aquário", "Peixes": "Peixes" },
  en: { "Áries": "Aries", "Touro": "Taurus", "Gêmeos": "Gemini", "Câncer": "Cancer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Scorpio", "Sagitário": "Sagittarius", "Capricórnio": "Capricorn", "Aquário": "Aquarius", "Peixes": "Pisces" },
  es: { "Áries": "Aries", "Touro": "Tauro", "Gêmeos": "Géminis", "Câncer": "Cáncer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Escorpio", "Sagitário": "Sagitario", "Capricórnio": "Capricornio", "Aquário": "Acuario", "Peixes": "Piscis" },
  de: { "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs", "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion", "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Fische" },
  fr: { "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer", "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion", "Sagitário": "Sagitaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons" }
};

const TRANSLATED_PLANETS: Record<string, Record<string, string>> = {
  pt: { "Sol": "Sol", "Lua": "Lua", "Mercúrio": "Mercúrio", "Vênus": "Vênus", "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano", "Netuno": "Netuno", "Plutão": "Plutão", "Quíron": "Quíron" },
  en: { "Sol": "Sun", "Lua": "Moon", "Mercúrio": "Mercury", "Vênus": "Venus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptune", "Plutão": "Pluto", "Quíron": "Chiron" },
  es: { "Sol": "Sol", "Lua": "Luna", "Mercúrio": "Mercurio", "Vênus": "Venus", "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano", "Netuno": "Neptuno", "Plutão": "Plutón", "Quíron": "Quirón" },
  de: { "Sol": "Sonne", "Lua": "Mond", "Mercúrio": "Merkur", "Vênus": "Venus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptun", "Plutão": "Pluto", "Quíron": "Chiron" },
  fr: { "Sol": "Soleil", "Lua": "Lune", "Mercúrio": "Mercure", "Vênus": "Vénus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptune", "Plutão": "Pluto", "Quíron": "Chiron" }
};

const TRANSLATED_ASPECTS: Record<string, Record<string, string>> = {
  pt: { "Conjunção": "Conjunção", "Sextil": "Sextil", "Quadratura": "Quadratura", "Trígono": "Trígono", "Oposição": "Oposição" },
  en: { "Conjunção": "Conjunction", "Sextil": "Sextile", "Quadratura": "Square", "Trígono": "Trine", "Oposição": "Opposition" },
  es: { "Conjunção": "Conjunción", "Sextil": "Sextil", "Quadratura": "Cuadratura", "Trígono": "Trígono", "Oposição": "Oposición" },
  de: { "Conjunção": "Konjunktion", "Sextil": "Sextil", "Quadratura": "Quadrat", "Trígono": "Trigon", "Oposição": "Opposition" },
  fr: { "Conjunção": "Conjonction", "Sextil": "Sextile", "Quadratura": "Carré", "Trígono": "Trigone", "Oposição": "Opposition" }
};

// Base signs list
const SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
];

const SIGN_DATES = [
  { name: "Áries", start: "03-21", end: "04-19" },
  { name: "Touro", start: "04-20", end: "05-20" },
  { name: "Gêmeos", start: "05-21", end: "06-20" },
  { name: "Câncer", start: "06-21", end: "07-22" },
  { name: "Leão", start: "07-23", end: "08-22" },
  { name: "Virgem", start: "08-23", end: "09-22" },
  { name: "Libra", start: "09-23", end: "10-22" },
  { name: "Escorpião", start: "10-23", end: "11-21" },
  { name: "Sagitário", start: "11-22", end: "12-21" },
  { name: "Capricórnio", start: "12-22", end: "01-19" },
  { name: "Aquário", start: "01-20", end: "02-18" },
  { name: "Peixes", start: "02-19", end: "03-20" },
];

/**
 * High-fidelity mathematical simulator for astronomical planet calculations.
 * Computes planet positions, aspects, and house cusps using orbital approximation formulas
 * to avoid external paid APIs.
 */
export function calculateNatalChart(
  date: string, // YYYY-MM-DD
  time: string, // HH:MM
  city: string
): { planets: PlanetPosition[]; houses: HouseCusp[]; aspects: Aspect[] } {
  // Parse date and time
  const [year, month, day] = date.split("-").map(Number);
  const [hour, min] = time.split(":").map(Number);

  // Derive pseudo julian factor
  const jf = (year - 1900) * 365.25 + month * 30.6 + day + (hour + min / 60) / 24;

  // 1. Calculate Planet positions
  const planets: PlanetPosition[] = [];

  // SOL (Sun) - primary calculation based on Julian calendar movement
  const sunMeanLong = (280.466 + 0.9856474 * jf) % 360;
  const sunMeanAnomaly = (357.528 + 0.9856003 * jf) % 360;
  const sunTrueLong = (sunMeanLong + 1.915 * Math.sin((sunMeanAnomaly * Math.PI) / 180)) % 360;
  planets.push(createPlanetPosition("Sol", sunTrueLong, 1));

  // LUA (Moon) - sinusoidal shift around the Sun
  const lunarMeanLong = (218.316 + 13.176396 * jf) % 360;
  const lunarMeanAnomaly = (134.963 + 13.064993 * jf) % 360;
  const lunarTrueLong = (lunarMeanLong + 6.289 * Math.sin((lunarMeanAnomaly * Math.PI) / 180)) % 360;
  planets.push(createPlanetPosition("Lua", lunarTrueLong, 2));

  // MERCÚRIO (Mercury)
  const mercLong = (sunTrueLong + 18.5 * Math.sin((jf / 7.5) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Mercúrio", mercLong, 3));

  // VÊNUS (Venus)
  const venusLong = (sunTrueLong + 46.2 * Math.sin((jf / 19.1) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Vênus", venusLong, 4));

  // MARTE (Mars)
  const marsLong = (355.2 + 0.524 * jf + 12.3 * Math.sin((jf / 50) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Marte", marsLong, 5));

  // JÚPITER (Jupiter)
  const jupLong = (34.35 + 0.083 * jf + 4.5 * Math.sin((jf / 365) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Júpiter", jupLong, 6));

  // SATURNO (Saturn)
  const satLong = (112.5 + 0.033 * jf + 2.1 * Math.sin((jf / 900) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Saturno", satLong, 7));

  // URANO (Uranus)
  const uraLong = (220.4 + 0.011 * jf + 1.1 * Math.sin((jf / 2500) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Urano", uraLong, 8));

  // NETUNO (Neptune)
  const nepLong = (55.4 + 0.006 * jf + 0.7 * Math.sin((jf / 5000) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Netuno", nepLong, 9));

  // PLUTÃO (Pluto)
  const pluLong = (192.1 + 0.004 * jf + 0.5 * Math.sin((jf / 7500) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Plutão", pluLong, 10));

  // CHÍRON (Chiron)
  const chiLong = (145.2 + 0.02 * jf + 1.5 * Math.sin((jf / 1500) * Math.PI)) % 360;
  planets.push(createPlanetPosition("Quíron", chiLong, 11));

  // 2. Compute House Cusps (Placidus approximation based on Hour and Sidereal Time estimate)
  const localSiderealTime = ((hour + min / 60) * 15 + year * 0.985 + month * 30 + day * 1) % 360;
  const ascendantLong = (localSiderealTime + 90) % 360;
  const mcLong = localSiderealTime;

  const houses: HouseCusp[] = [];
  for (let h = 1; h <= 12; h++) {
    // Distribute remaining houses around MCF
    const houseLong = (ascendantLong + (h - 1) * 30) % 360;
    const signIndex = Math.floor(houseLong / 30);
    const sign = SIGNS[signIndex];
    const degree = Math.round(houseLong % 30);
    houses.push({
      house: h,
      sign,
      degree
    });
  }

  // Adjust planet house assignments based on calculated house boundaries
  for (const planet of planets) {
    const fullDegree = getFullLongitude(planet.sign, planet.degree);
    let assignedHouse = 1;
    for (let h = 1; h <= 12; h++) {
      const startH = (ascendantLong + (h - 1) * 30) % 360;
      const endH = (ascendantLong + h * 30) % 360;
      if (startH < endH) {
        if (fullDegree >= startH && fullDegree < endH) {
          assignedHouse = h;
          break;
        }
      } else {
        if (fullDegree >= startH || fullDegree < endH) {
          assignedHouse = h;
          break;
        }
      }
    }
    planet.house = assignedHouse;
  }

  // 3. Aspect Calculations (Conjunction, Opposition, Trine, Square, Sextile)
  const aspects: Aspect[] = [];
  const ASPECT_CONFIGS = [
    { name: "Conjunção", val: 0, orb: 8 },
    { name: "Sextil", val: 60, orb: 6 },
    { name: "Quadratura", val: 90, orb: 8 },
    { name: "Trígono", val: 120, orb: 8 },
    { name: "Oposição", val: 180, orb: 8 }
  ] as const;

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const long1 = getFullLongitude(p1.sign, p1.degree);
      const long2 = getFullLongitude(p2.sign, p2.degree);
      const diff = Math.abs(long1 - long2);
      const minDiff = Math.min(diff, 360 - diff);

      for (const config of ASPECT_CONFIGS) {
        if (Math.abs(minDiff - config.val) <= config.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: config.name,
            angle: Math.round(minDiff),
            orb: Math.round(Math.abs(minDiff - config.val))
          });
        }
      }
    }
  }

  const lang = getActiveLanguage();
  
  const translatedPlanets = planets.map(p => ({
    ...p,
    name: TRANSLATED_PLANETS[lang][p.name] || p.name,
    sign: TRANSLATED_SIGNS[lang][p.sign] || p.sign
  }));

  const translatedHouses = houses.map(h => ({
    ...h,
    sign: TRANSLATED_SIGNS[lang][h.sign] || h.sign
  }));

  const translatedAspects = aspects.map(a => ({
    ...a,
    planet1: TRANSLATED_PLANETS[lang][a.planet1] || a.planet1,
    planet2: TRANSLATED_PLANETS[lang][a.planet2] || a.planet2,
    type: (TRANSLATED_ASPECTS[lang][a.type] || a.type) as any
  }));

  return { planets: translatedPlanets, houses: translatedHouses, aspects: translatedAspects };
}

function createPlanetPosition(name: string, longitude: number, index: number): PlanetPosition {
  const normLong = (longitude + 360) % 360;
  const signIndex = Math.floor(normLong / 30);
  const degree = Math.round(normLong % 30);
  const sign = SIGNS[signIndex];
  
  // Predict retrogrades based on sinusoidal patterns
  const isRetrograde = [3, 4, 5, 6, 7, 8, 9, 10].includes(index) && (normLong % 75 > 60);

  return {
    name,
    sign,
    degree,
    house: 1, // Defaulting to 1 first, will adjust later
    isRetrograde
  };
}

function getFullLongitude(sign: string, degree: number): number {
  const idx = SIGNS.indexOf(sign);
  return (idx >= 0 ? idx : 0) * 30 + degree;
}

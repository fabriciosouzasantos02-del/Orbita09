import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AstrologyMap, AstroAstroPosition } from '../types';
import { Orbit, Play, Pause, RotateCcw, Info, Zap, Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';

interface TransitMapProps {
  mapData: AstrologyMap;
}

// Zodiac signs and their degree offsets in the 360 wheeel
const ZODIAC_SIGNS = [
  { name: "Áries", symbol: "♈", element: "fire", color: "#EF4444" },
  { name: "Touro", symbol: "♉", element: "earth", color: "#10B981" },
  { name: "Gêmeos", symbol: "♊", element: "air", color: "#06B6D4" },
  { name: "Câncer", symbol: "♋", element: "water", color: "#6366F1" },
  { name: "Leão", symbol: "♌", element: "fire", color: "#EF4444" },
  { name: "Virgem", symbol: "♍", element: "earth", color: "#10B981" },
  { name: "Libra", symbol: "♎", element: "air", color: "#06B6D4" },
  { name: "Escorpião", symbol: "♏", element: "water", color: "#6366F1" },
  { name: "Sagitário", symbol: "♐", element: "fire", color: "#EF4444" },
  { name: "Capricórnio", symbol: "♑", element: "earth", color: "#10B981" },
  { name: "Aquário", symbol: "♒", element: "air", color: "#06B6D4" },
  { name: "Peixes", symbol: "♓", element: "water", color: "#6366F1" }
];

// Planet orbital configurations and details
interface PlanetConfig {
  name: string;
  label: string;
  baseAngle: number; // approximate base transit angle at reference date
  speed: number;     // speed in degrees per simulation day
  color: string;
  radiusOffset: number; // orbital radius on the d3 visualization canvas
  description: string;
}

const TRANSIT_METADATA: PlanetConfig[] = [
  { name: "Sol", label: "Sol ☀️", baseAngle: 78, speed: 0.98, color: "#F59E0B", radiusOffset: 34, description: "O foco central da vitalidade física e da consciência vigilante." },
  { name: "Lua", label: "Lua 🌙", baseAngle: 332, speed: 13.17, color: "#E2E8F0", radiusOffset: 12, description: "Reflete as flutuações cotidianas das emoções, intuição e receptividade pública." },
  { name: "Mercúrio", label: "Mercúrio ☿", baseAngle: 98, speed: 1.2, color: "#38BDF8", radiusOffset: 20, description: "Regente do raciocínio prático, conexões comerciais e agilidade verbal." },
  { name: "Vênus", label: "Vênus ♀", baseAngle: 62, speed: 1.2, color: "#F472B6", radiusOffset: 27, description: "Atração magnética, acordos estéticos, afetos e valorização material." },
  { name: "Marte", label: "Marte ♂", baseAngle: 192, speed: 0.52, color: "#EF4444", radiusOffset: 41, description: "Energia propulsora, iniciativa de conquista, coragem e impulsão física." },
  { name: "Júpiter", label: "Júpiter ♃", baseAngle: 84, speed: 0.08, color: "#A78BFA", radiusOffset: 50, description: "A grande expansão mental, justiça, síntese filosófica e oportunidades afortunadas." },
  { name: "Saturno", label: "Saturno ♄", baseAngle: 355, speed: 0.03, color: "#F59E0B", radiusOffset: 59, description: "O mestre das formas rígidas, disciplina temporal e maturação de compromissos." },
  { name: "Urano", label: "Urano ♅", baseAngle: 58, speed: 0.011, color: "#22D3EE", radiusOffset: 68, description: "Estopim do progresso tecnológico, intuição disruptiva e inconformismo libertador." },
  { name: "Netuno", label: "Netuno ♆", baseAngle: 358, speed: 0.006, color: "#818CF8", radiusOffset: 77, description: "Dissolução espiritual dos limites, imaginação onírica profunda e sensitividade extrema." },
  { name: "Plutão", label: "Plutão ♇", baseAngle: 304, speed: 0.004, color: "#F43F5E", radiusOffset: 86, description: "Renascimento por expurgação, regeneração invisível e forças magnéticas inevitáveis." }
];

const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Zodiac
    "Áries": "Aries", "Touro": "Taurus", "Gêmeos": "Gemini", "Câncer": "Cancer",
    "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Scorpio",
    "Sagitário": "Sagittarius", "Capricórnio": "Capricorn", "Aquário": "Aquarius", "Peixes": "Pisces",
    // Elements
    "FIRE": "Fire", "EARTH": "Earth", "AIR": "Air", "WATER": "Water",
    // Planets
    "Sol": "Sun", "Lua": "Moon", "Mercúrio": "Mercury", "Vênus": "Venus",
    "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus",
    "Netuno": "Neptune", "Plutão": "Pluto",
    // Labels
    "Sol ☀️": "Sun ☀️", "Lua 🌙": "Moon 🌙", "Mercúrio ☿": "Mercury ☿", "Vênus ♀": "Venus ♀",
    "Marte ♂": "Mars ♂", "Júpiter ♃": "Jupiter ♃", "Saturno ♄": "Saturn ♄", "Urano ♅": "Uranus ♅",
    "Netuno ♆": "Neptune ♆", "Plutão ♇": "Pluto ♇",
    // Descriptions
    "O foco central da vitalidade física e da consciência vigilante.": "The central focus of physical vitality and watchful consciousness.",
    "Reflete as flutuações cotidianas das emoções, intuição e receptividade pública.": "Reflects the daily fluctuations of emotions, intuition, and public receptivity.",
    "Regente do raciocínio prático, conexões comerciais e agilidade verbal.": "Ruler of practical reasoning, business connections, and verbal agility.",
    "Atração magnética, acordos estéticos, afetos e valorização material.": "Magnetic attraction, aesthetic agreements, affection, and material valuation.",
    "Energia propulsora, iniciativa de conquista, coragem e impulsão física.": "Propelling energy, initiative for conquest, courage, and physical drive.",
    "A grande expansão mental, justiça, síntese filosófica e oportunidades afortunadas.": "The great mental expansion, justice, philosophical synthesis, and fortunate opportunities.",
    "O mestre das formas rígidas, disciplina temporal e maturação de compromissos.": "The master of rigid forms, temporal discipline, and maturation of commitments.",
    "Estopim do progresso tecnológico, intuição disruptiva e inconformismo libertador.": "Fuse of technological progress, disruptive intuition, and liberating nonconformism.",
    "Dissolução espiritual dos limites, imaginação onírica profunda e sensitividade extrema.": "Spiritual dissolution of limits, dream-like imagination, and extreme sensitivity.",
    "Renascimento por expurgação, regeneração invisível e forças magnéticas inevitáveis.": "Rebirth by expurgation, invisible regeneration, and inevitable magnetic forces.",
    // Aspects
    "Conjunção": "Conjunction", "Oposição": "Opposition", "Trígono": "Trine", "Quadratura": "Square", "Sextil": "Sextile",
    "Fusão de propósitos celestes e intensidade focalizada.": "Fusion of celestial purposes and focused intensity.",
    "Polarização ou reflexão crítica exigindo diplomacia ativa.": "Polarization or critical reflection requiring active diplomacy.",
    "Fluxo espontâneo que remove entraves com sorte natural.": "Spontaneous flow that removes obstacles with natural luck.",
    "Força transformadora impulsionada sob pressões e atritos.": "Transformative force driven by pressure and friction.",
    "Oportunidades de colaboração que premiam ações conscientes.": "Opportunities for collaboration that reward conscious actions.",
    // UI
    "Alinhamento de Trânsitos em Tempo Real": "Real-Time Transits Alignment",
    "Analise trânsitos rotacionando dinamicamente e cruzando aspectos com suas casas de nascimento.": "Analyze transits by dynamically rotating and crossing aspects with your birth houses.",
    "Pausar Fluxo": "Pause Flow", "Iniciar Fluxo": "Start Flow", "Resetar data oficial (Tempo Real)": "Reset to Real-Time Date",
    "Velocidade:": "Speed:", "LESTE / ASCENDENTE": "EAST / ASCENDANT", "OESTE / DESCENDENTE": "WEST / DESCENDANT",
    "Simulado:": "Simulated:", "dias de trânsito": "transit days",
    "Conjunção (0°)": "Conjunction (0°)", "Oposição (180°)": "Opposition (180°)", "Trígono (120°)": "Trine (120°)",
    "Quadratura (90°)": "Square (90°)", "Sextil (60°)": "Sextile (60°)", "Natal": "Natal", "Trânsito": "Transit",
    "Navegar Órbitas": "Navigate Orbits", "Trânsito Atual ⓣ": "Current Transit ⓣ", "de": "of",
    "Posição Natal ⓝ": "Natal Position ⓝ", "Não mapeado": "Not mapped", "Aspectos Ativos deste planeta": "Active Aspects of this planet",
    "conexões": "connections", "com seu": "with your",
    "Nenhum aspecto maior exato formado no momento com o seu mapa natal. Rotacione o tempo usando a velocidade de simulação para ver novos alinhamentos celestes dinamicamente!": "No exact major aspect formed at the moment with your natal chart. Rotate time using the simulation speed to see new celestial alignments dynamically!",
    "Insight do Alinhamento Ativo": "Active Alignment Insight",
    "O trânsito solar ilumina seu mapa atual estimulando renovações de identidade.": "The solar transit illuminates your current chart stimulating renewals of identity.",
    "Sensibilidade acelerada em oscilações oníricas diárias. Excelente para journaling.": "Accelerated sensitivity in daily dream oscillations. Excellent for journaling.",
    "Aceleração de contatos, excelente para reavaliar correspondências importantes.": "Acceleration of contacts, excellent for re-evaluating important correspondences.",
    "Magnetismo em alta facilitando entendimentos com parcerias e acordos estéticos.": "Magnetism on the rise facilitating understandings with partnerships and aesthetic agreements.",
    "Mantenha o foco ativo para evitar conflitos desnecessários, redirecione o impulso.": "Keep focus active to avoid unnecessary conflicts, redirect impulse.",
    "Trânsitos de planetas geracionais influenciam as estruturas institucionais de sua jornada de longo prazo.": "Transits of generational planets influence the institutional structures of your long-term journey.",
  },
  es: {
    // Zodiac
    "Áries": "Aries", "Touro": "Tauro", "Gêmeos": "Géminis", "Câncer": "Cáncer",
    "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Escorpio",
    "Sagitário": "Sagitario", "Capricórnio": "Capricornio", "Aquário": "Acuario", "Peixes": "Piscis",
    // Elements
    "FIRE": "Fuego", "EARTH": "Tierra", "AIR": "Aire", "WATER": "Agua",
    // Planets
    "Sol": "Sol", "Lua": "Luna", "Mercúrio": "Mercurio", "Vênus": "Venus",
    "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano",
    "Netuno": "Neptuno", "Plutão": "Plutón",
    // Labels
    "Sol ☀️": "Sol ☀️", "Lua 🌙": "Luna 🌙", "Mercúrio ☿": "Mercurio ☿", "Vênus ♀": "Venus ♀",
    "Marte ♂": "Marte ♂", "Júpiter ♃": "Júpiter ♃", "Saturno ♄": "Saturno ♄", "Urano ♅": "Urano ♅",
    "Netuno ♆": "Neptuno ♆", "Plutão ♇": "Plutón ♇",
    // Descriptions
    "O foco central da vitalidade física e da consciência vigilante.": "El foco central de la vitalidad física y la conciencia vigilante.",
    "Reflete as flutuações cotidianas das emoções, intuição e receptividade pública.": "Refleja las fluctuaciones cotidianas de las emociones, la intuición y la receptividad pública.",
    "Regente do raciocínio prático, conexões comerciais e agilidade verbal.": "Regente del razonamiento práctico, conexiones comerciales y agilidad verbal.",
    "Atração magnética, acordos estéticos, afetos e valorização material.": "Atracción magnética, acuerdos estéticos, afectos y valorización material.",
    "Energia propulsora, iniciativa de conquista, coragem e impulsão física.": "Energía propulsora, iniciativa de conquista, coraje e impulso físico.",
    "A grande expansão mental, justiça, síntese filosófica e oportunidades afortunadas.": "La gran expansión mental, la justicia, la síntesis filosófica y las oportunidades afortunadas.",
    "O mestre das formas rígidas, disciplina temporal e maturação de compromissos.": "El maestro de las formas rígidas, la disciplina temporal y la maduración de los compromisos.",
    "Estopim do progresso tecnológico, intuição disruptiva e inconformismo libertador.": "Detonante del progreso tecnológico, intuición disruptiva e inconformismo liberador.",
    "Dissolução espiritual dos limites, imaginação onírica profunda e sensitividade extrema.": "Disolución espiritual de los límites, imaginación onírica profunda y sensibilidad extrema.",
    "Renascimento por expurgação, regeneração invisível e forças magnéticas inevitáveis.": "Renacimiento por expurgación, regeneración invisible y fuerzas magnéticas inevitables.",
    // Aspects
    "Conjunção": "Conjunción", "Oposição": "Oposición", "Trígono": "Trígono", "Quadratura": "Cuadratura", "Sextil": "Sextil",
    "Fusão de propósitos celestes e intensidade focalizada.": "Fusión de propósitos celestes e intensidad enfocada.",
    "Polarização ou reflexão crítica exigindo diplomacia activa.": "Polarización o reflexión crítica que exige diplomacia activa.",
    "Fluxo espontâneo que remove entraves com sorte natural.": "Flujo espontáneo que elimina obstáculos con suerte natural.",
    "Força transformadora impulsionada sob pressões e atritos.": "Fuerza transformadora impulsada bajo presiones y fricciones.",
    "Oportunidades de colaboração que premiam ações conscientes.": "Oportunidades de colaboración que premian acciones conscientes.",
    // UI
    "Alinhamento de Trânsitos em Tempo Real": "Alineación de Tránsitos en Tiempo Real",
    "Analise trânsitos rotacionando dinamicamente e cruzando aspectos com suas casas de nascimento.": "Analice tránsitos rotando dinámicamente y cruzando aspectos con sus cartas de nacimiento.",
    "Pausar Fluxo": "Pausar Flujo", "Iniciar Fluxo": "Iniciar Flujo", "Resetar data oficial (Tempo Real)": "Restablecer a Fecha en Tiempo Real",
    "Velocidade:": "Velocidad:", "LESTE / ASCENDENTE": "ESTE / ASCENDENTE", "OESTE / DESCENDENTE": "OESTE / DESCENDENTE",
    "Simulado:": "Simulado:", "dias de trânsito": "días de tránsito",
    "Conjunção (0°)": "Conjunción (0°)", "Oposição (180°)": "Oposición (180°)", "Trígono (120°)": "Trígono (120°)",
    "Quadratura (90°)": "Cuadratura (90°)", "Sextil (60°)": "Sextil (60°)", "Natal": "Natal", "Trânsito": "Tránsito",
    "Navegar Órbitas": "Navegar Órbitas", "Trânsito Atual ⓣ": "Tránsito Actual ⓣ", "de": "de",
    "Posição Natal ⓝ": "Posición Natal ⓝ", "Não mapeado": "No mapeado", "Aspectos Ativos deste planeta": "Aspectos Activos de este planeta",
    "conexões": "conexiones", "com seu": "con su",
    "Nenhum aspecto maior exato formado no momento com o seu mapa natal. Rotacione o tempo usando a velocidade de simulação para ver novos alinhamentos celestes dinamicamente!": "Ningún aspecto mayor exacto formado en este momento con su carta natal. ¡Rote el tiempo usando la velocidad de simulación para ver nuevas alineaciones celestes dinámicamente!",
    "Insight do Alinhamento Ativo": "Insight del Alineamiento Activo",
    "O trânsito solar ilumina seu mapa atual estimulando renovações de identidade.": "El tránsito solar ilumina su mapa actual estimulando renovaciones de identidad.",
    "Sensibilidade acelerada em oscilações oníricas diárias. Excelente para journaling.": "Sensibilidad acelerada en oscilaciones oníricas diarias. Excelente para journaling.",
    "Aceleração de contatos, excelente para reavaliar correspondências importantes.": "Aceleración de contactos, excelente para reevaluar correspondencias importantes.",
    "Magnetismo em alta facilitando entendimentos com parcerias e acordos estéticos.": "Magnetismo en alza facilitando entendimientos con asociaciones y acuerdos estéticos.",
    "Mantenha o foco ativo para evitar conflitos desnecessários, redirecione o impulso.": "Mantenga el foco activo para evitar conflictos innecesarios, redireccione el impulso.",
    "Trânsitos de planetas geracionais influenciam as estruturas institucionais de sua jornada de longo prazo.": "Los tránsitos de planetas generacionales influyen en las estructuras institucionales de su viaje a largo plazo.",
  },
  de: {
    // Zodiac
    "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs",
    "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion",
    "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Fische",
    // Elements
    "FIRE": "Feuer", "EARTH": "Erde", "AIR": "Luft", "WATER": "Wasser",
    // Planets
    "Sol": "Sonne", "Lua": "Mond", "Mercúrio": "Merkur", "Vênus": "Venus",
    "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus",
    "Netuno": "Neptun", "Plutão": "Pluto",
    // Labels
    "Sol ☀️": "Sonne ☀️", "Lua 🌙": "Mond 🌙", "Mercúrio ☿": "Merkur ☿", "Vênus ♀": "Venus ♀",
    "Marte ♂": "Mars ♂", "Júpiter ♃": "Jupiter ♃", "Saturno ♄": "Saturn ♄", "Urano ♅": "Uranus ♅",
    "Netuno ♆": "Neptun ♆", "Plutão ♇": "Pluto ♇",
    // Descriptions
    "O foco central da vitalidade física e da consciência vigilante.": "Der zentrale Fokus der physischen Vitalität und des wachsamen Bewusstseins.",
    "Reflete as flutuações cotidianas das emoções, intuição e receptividade pública.": "Spiegelt die täglichen Schwankungen von Emotionen, Intuition und öffentlicher Empfänglichkeit wider.",
    "Regente do raciocínio prático, conexões comerciais e agilidade verbal.": "Herrscher über praktisches Denken, geschäftliche Verbindungen und verbale Agilität.",
    "Atração magnética, acordos estéticos, afetos e valorização material.": "Magnetische Anziehungkraft, ästhetische Vereinbarungen, Zuneigung und materielle Bewertung.",
    "Energia propulsora, iniciativa de conquista, coragem e impulsão física.": "Antriebsenergie, Initiative zur Eroberung, Mut und körperlicher Antrieb.",
    "A grande expansão mental, justiça, síntese filosófica e oportunidades afortunadas.": "Die große mentale Expansion, Gerechtigkeit, philosophische Synthese und glückliche Gelegenheiten.",
    "O mestre das formas rígidas, disciplina temporal e maturação de compromissos.": "Der Meister der starren Formen, der zeitlichen Disziplin und des Reifens von Verpflichtungen.",
    "Estopim do progresso tecnológico, intuição disruptiva e inconformismo libertador.": "Zünder des technologischen Fortschritts, disruptive Intuition und befreiende Nonkonformität.",
    "Dissolução espiritual dos limites, imaginação onírica profunda e sensitividade extrema.": "Spirituelle Auflösung von Grenzen, tiefe traumhafte Fantasie und extreme Sensibilität.",
    "Renascimento por expurgação, regeneração invisível e forças magnéticas inevitáveis.": "Wiedergeburt durch Bereinigung, unsichtbare Regeneration und unvermeidliche magnetische Kräfte.",
    // Aspects
    "Conjunção": "Konjunktion", "Oposição": "Opposition", "Trígono": "Trigon", "Quadratura": "Quadrat", "Sextil": "Sextil",
    "Fusão de propósitos celestes e intensidade focalizada.": "Verschmelzung himmlischer Absichten und fokussierter Intensität.",
    "Polarização ou reflexão crítica exigindo diplomacia ativa.": "Polarisierung oder kritische Reflexion, die aktive Diplomatie erfordert.",
    "Fluxo espontâneo que remove entraves com sorte natural.": "Spontaner Fluss, der Hindernisse mit natürlichem Glück beseitigt.",
    "Força transformadora impulsionada sob pressões e atritos.": "Transformative Kraft, angetrieben von Druck und Reibung.",
    "Oportunidades de colaboração que premiam ações conscientes.": "Möglichkeiten zur Zusammenarbeit, die bewusstes Handeln belohnen.",
    // UI
    "Alinhamento de Trânsitos em Tempo Real": "Echtzeit-Transit-Ausrichtung",
    "Analise trânsitos rotacionando dinamicamente e cruzando aspectos com suas casas de nascimento.": "Analysieren Sie Transite, indem Sie Aspekte dynamisch drehen und mit Ihren Geburtshäusern kreuzen.",
    "Pausar Fluxo": "Ablauf pausieren", "Iniciar Fluxo": "Ablauf starten", "Resetar data oficial (Tempo Real)": "Auf Echtzeit-Datum zurücksetzen",
    "Velocidade:": "Geschwindigkeit:", "LESTE / ASCENDENTE": "OSTEN / ASZENDENT", "OESTE / DESCENDENTE": "WESTEN / DESZENDENT",
    "Simulado:": "Simuliert:", "dias de trânsito": "Transittage",
    "Conjunção (0°)": "Konjunktion (0°)", "Oposição (180°)": "Opposition (180°)", "Trígono (120°)": "Trigon (120°)",
    "Quadratura (90°)": "Quadrat (90°)", "Sextil (60°)": "Sextil (60°)", "Natal": "Natal", "Trânsito": "Transit",
    "Navegar Órbitas": "Umlaufbahnen navigieren", "Trânsito Atual ⓣ": "Aktueller Transit ⓣ", "de": "von",
    "Posição Natal ⓝ": "Geburtsposition ⓝ", "Não mapeado": "Nicht abgebildet", "Aspectos Ativos deste planeta": "Aktive Aspekte dieses Planeten",
    "conexões": "Verbindungen", "com seu": "mit Ihrem",
    "Nenhum aspect maior exato formado no momento com o seu mapa natal. Rotacione o tempo usando a velocidade de simulação para ver novos alinhamentos celestes dinamicamente!": "Zurzeit bildet sich kein genauer Hauptaspekt mit Ihrem Geburtshoroskop. Drehen Sie die Zeit mit der Simulationsgeschwindigkeit, um neue himmlische Ausrichtungen dynamisch zu sehen!",
    "Nenhum aspecto maior exato formado no momento com o seu mapa natal. Rotacione o tempo usando a velocidade de simulação para ver novos alinhamentos celestes dinamicamente!": "Zurzeit bildet sich kein genauer Hauptaspekt mit Ihrem Geburtshoroskop. Drehen Sie die Zeit mit der Simulationsgeschwindigkeit, um neue himmlische Ausrichtungen dynamisch zu sehen!",
    "Insight do Alinhamento Ativo": "Erkenntnis der aktiven Ausrichtung",
    "O trânsito solar ilumina seu mapa atual estimulando renovações de identidade.": "Der Sonnen-Transit erleuchtet Ihr aktuelles Horoskop und regt Erneuerungen der Identität an.",
    "Sensibilidade acelerada em oscilações oníricas diárias. Excelente para journaling.": "Beschleunigte Empfindlichkeit bei täglichen Traumschwankungen. Hervorragend geeignet für Journaling.",
    "Aceleração de contatos, excelente para reavaliar correspondências importantes.": "Beschleunigung der Kontakte, hervorragend zur Neubewertung wichtiger Korrespondenz.",
    "Magnetismo em alta facilitando entendimentos com parcerias e acordos estéticos.": "Steigender Magnetismus erleichtert Vereinbarungen bei Partnerschaften und ästhetischen Absprachen.",
    "Mantenha o foco ativo para evitar conflitos desnecessários, redirecione o impulso.": "Halten Sie den Fokus aktiv, um unnötige Konflikte zu vermeiden, leiten Sie den Impuls um.",
    "Trânsitos de planetas geracionais influenciam as estruturas institucionais de sua jornada de longo prazo.": "Transite von Generationenplaneten beeinflussen die institutionellen Strukturen Ihrer langfristigen Reise.",
  },
  fr: {
    // Zodiac
    "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer",
    "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion",
    "Sagitário": "Sagittaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons",
    // Elements
    "FIRE": "Feu", "EARTH": "Terre", "AIR": "Air", "WATER": "Eau",
    // Planets
    "Sol": "Soleil", "Lua": "Lune", "Mercúrio": "Mercure", "Vênus": "Vénus",
    "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturne", "Urano": "Uranus",
    "Netuno": "Neptune", "Plutão": "Pluton",
    // Labels
    "Sol ☀️": "Soleil ☀️", "Lua 🌙": "Lune 🌙", "Mercúrio ☿": "Mercure ☿", "Vênus ♀": "Vénus ♀",
    "Marte ♂": "Mars ♂", "Júpiter ♃": "Jupiter ♃", "Saturno ♄": "Saturne ♄", "Urano ♅": "Uranus ♅",
    "Netuno ♆": "Neptune ♆", "Plutão ♇": "Pluton ♇",
    // Descriptions
    "O foco central da vitalidade física e da consciência vigilante.": "Le foyer central de la vitalité physique et de la conscience vigilante.",
    "Reflete as flutuações cotidianas das emoções, intuição e receptividade pública.": "Reflète les fluctuations quotidiennes des émotions, de l'intuition et de la réceptivité du public.",
    "Regente do raciocínio prático, conexões comerciais e agilidade verbal.": "Régent du raisonnement pratique, des connexions commerciales et de l'agilité verbale.",
    "Atração magnética, acordos estéticos, afetos e valorização material.": "Attraction magnétique, accords esthétiques, affections et valorisation matérielle.",
    "Energia propulsora, iniciativa de conquista, coragem e impulsão física.": "Énergie de propulsion, initiative de conquête, courage et dynamisme physique.",
    "A grande expansão mental, justiça, síntese filosófica e oportunidades afortunadas.": "La grande expansion mentale, la justice, la synthèse philosophique et les opportunités heureuses.",
    "O mestre das formas rígidas, disciplina temporal e maturação de compromissos.": "Le maître des formes rigides, de la discipline temporelle et de la maturation des engagements.",
    "Estopim do progresso tecnológico, intuição disruptiva e inconformismo libertador.": "Déclencheur du progrès technologique, de l'intuition disruptive et de l'anticonformisme libérateur.",
    "Dissolução espiritual dos limites, imaginação onírica profunda e sensitividade extrema.": "Dissolution spirituelle des limites, imagination onirique profonde et sensibilité extrême.",
    "Renascimento por expurgação, regeneração invisível e forças magnéticas inevitáveis.": "Renaissance par expurgation, régénération invisible et forces magnétiques inévitables.",
    // Aspects
    "Conjunção": "Conjonction", "Oposição": "Opposition", "Trígono": "Trine", "Quadratura": "Carré", "Sextil": "Sextile",
    "Fusão de propósitos celestes e intensidade focalizada.": "Fusion d'intentions célestes et d'intensité focalisée.",
    "Polarização ou reflexão crítica exigindo diplomacia ativa.": "Polarisation ou réflexion critique exigeant une diplomatie active.",
    "Fluxo espontâneo que remove entraves com sorte natural.": "Flux spontané qui élimine les obstacles avec une chance naturelle.",
    "Força transformadora impulsionada sob pressões e atritos.": "Force transformatrice entraînée par la pression et la friction.",
    "Oportunidades de colaboração que premiam ações conscientes.": "Opportunités de collaboration qui récompensent les actions conscientes.",
    // UI
    "Alinhamento de Trânsitos em Tempo Real": "Alignement des Transits en Temps Réel",
    "Analise trânsitos rotacionando dinamicamente e cruzando aspectos com suas casas de nascimento.": "Analysez les transits en faisant tourner dynamiquement et en croisant les aspects avec vos maisons de naissance.",
    "Pausar Fluxo": "Pause Flux", "Iniciar Fluxo": "Démarrer Flux", "Resetar data oficial (Tempo Real)": "Réinitialiser à la date en temps réel",
    "Velocidade:": "Vitesse:", "LESTE / ASCENDENTE": "EST / ASCENDANT", "OESTE / DESCENDENTE": "OUEST / DESCENDANT",
    "Simulado:": "Simulé:", "dias de trânsito": "jours de transit",
    "Conjunção (0°)": "Conjonction (0°)", "Oposição (180°)": "Opposition (180°)", "Trígono (120°)": "Trine (120°)",
    "Quadratura (90°)": "Carré (90°)", "Sextil (60°)": "Sextile (60°)", "Natal": "Natal", "Trânsito": "Transit",
    "Navegar Órbitas": "Naviguer les Orbites", "Trânsito Atual ⓣ": "Transit Actuel ⓣ", "de": "de",
    "Posição Natal ⓝ": "Position Natale ⓝ", "Não mapeado": "Non cartographié", "Aspectos Ativos deste planeta": "Aspects Actifs de ce planète",
    "conexões": "connexions", "com seu": "avec votre",
    "Nenhum aspecto maior exato formado no momento com o seu mapa natal. Rotacione o tempo usando a velocidade de simulação para ver novos alinhamentos celestes dinamicamente!": "Aucun aspect majeur exact formé pour le moment avec votre carte natale. Faites pivoter le temps à l'aide de la vitesse de simulation pour voir de nouveaux alignements célestes de manière dynamique !",
    "Insight do Alinhamento Ativo": "Aperçu de l'Alignement Actif",
    "O trânsito solar ilumina seu mapa atual estimulando renovações de identidade.": "Le transit solaire illumine votre carte actuelle stimulant les renouvellements d'identité.",
    "Sensibilidade acelerada em oscilações oníricas diárias. Excelente para journaling.": "Sensibilité accélérée dans les oscillations quotidiennes des rêves. Excellent pour le journaling.",
    "Aceleração de contatos, excelente para reavaliar correspondências importantes.": "Accélération des contacts, excellente pour réévaluer les correspondances importantes.",
    "Magnetismo em alta facilitando entendimentos com parcerias e acordos estéticos.": "Magnétisme en hausse facilitant les ententes de partenariats et les accords esthétiques.",
    "Mantenha o foco ativo para evitar conflitos desnecessários, redirecione o impulso.": "Gardez le focus actif pour éviter les conflits inutiles, redirigez l'élan.",
    "Trânsitos de planetas geracionais influenciam as estruturas institucionais de sua jornada de longo prazo.": "Les transits des planètes générationnelles influencent les structures institutionnelles de votre voyage à long terme.",
  }
};

export default function TransitMap({ mapData }: TransitMapProps) {
  const { t: i18nT, i18n } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const activeL = (i18n.language as string) || 'pt';
    if (activeL !== 'pt') {
      const localDict = LOCAL_TRANSLATIONS[activeL];
      if (localDict && localDict[text]) {
        return localDict[text];
      }
    }
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (i18n.language as Language) || 'pt');
    }
    return res;
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simulation states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simDays, setSimDays] = useState<number>(0);
  const [simSpeed, setSimSpeed] = useState<number>(1); // days added per loop interval
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Sol");
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 420, height: 420 });

  // Update dimensions with ResizeObserver to maintain standard responsive rules
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      const targetSize = Math.max(280, Math.min(460, width));
      setDimensions({ width: targetSize, height: targetSize });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Simulation loop interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimDays((prev) => prev + (simSpeed * 0.1));
    }, 50); // smooth tick representing real progression
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Read natal positions of planets from birth chart
  const getNatalAngle = (planetName: string): number | null => {
    if (!mapData || !mapData.astros || !Array.isArray(mapData.astros)) {
      console.warn("[TransitMap] mapData ou mapData.astros ausente/inválido", mapData);
      return null;
    }
    const matched = mapData.astros.find(
      (a) => a && a.name && (a.name.toLowerCase().includes(planetName.toLowerCase()) || 
             planetName.toLowerCase().includes(a.name.toLowerCase()))
    );
    if (!matched) {
      console.warn(`[TransitMap] Astro natal correspondente para ${planetName} não encontrado.`);
      return null;
    }
    const signIndex = ZODIAC_SIGNS.findIndex((s) => s.name === matched.sign);
    if (signIndex === -1) {
      console.warn(`[TransitMap] Signo '${matched.sign}' não catalogado para ${matched.name}. Mapeamento ignorado.`);
      return null;
    }
    
    let deg = 0;
    try {
      if (typeof matched.degree === 'number') {
        deg = Math.floor(matched.degree);
      } else if (matched.degree !== undefined && matched.degree !== null) {
        const matchDeg = String(matched.degree).match(/^\d+/);
        deg = matchDeg ? parseInt(matchDeg[0], 10) : 0;
      }
    } catch (err) {
      console.error(`[TransitMap] Falhou ao extrair número de grau para ${matched.name}:`, matched.degree, err);
    }

    console.log(`[Diagnostic] TransitMap: ${matched.name} em ${matched.sign} (${signIndex * 30}°), grau parsed: ${deg}, ângulo final: ${(signIndex * 30 + deg) % 360}°`);
    return (signIndex * 30 + deg) % 360;
  };

  // Compute actual transit angle based on current epoch offset
  const getTransitAngle = (planet: PlanetConfig): number => {
    return (planet.baseAngle + simDays * planet.speed) % 360;
  };

  // Convert angular placement directly to a label (Zodiac sign + Degrees)
  const getAstroLabel = (angle: number) => {
    const normalized = (angle % 360 + 360) % 360;
    const index = Math.floor(normalized / 30);
    const sign = ZODIAC_SIGNS[index];
    const degrees = Math.floor(normalized % 30);
    return {
      signName: sign.name,
      signSymbol: sign.symbol,
      degrees: degrees,
      color: sign.color
    };
  };

  // Custom Aspect algorithm with specific astrological tolerances
  const checkAspect = (angle1: number, angle2: number) => {
    const diff = Math.abs(angle1 - angle2) % 360;
    const distance = diff > 180 ? 360 - diff : diff;

    if (Math.abs(distance - 0) <= 8) {
      return { type: "Conjunção", color: "#F59E0B", symbol: "☌", desc: "Fusão de propósitos celestes e intensidade focalizada." };
    }
    if (Math.abs(distance - 180) <= 8) {
      return { type: "Oposição", color: "#EF4444", symbol: "☍", desc: "Polarização ou reflexão crítica exigindo diplomacia ativa." };
    }
    if (Math.abs(distance - 120) <= 8) {
      return { type: "Trígono", color: "#10B981", symbol: "△", desc: "Fluxo espontâneo que remove entraves com sorte natural." };
    }
    if (Math.abs(distance - 90) <= 8) {
      return { type: "Quadratura", color: "#EC4899", symbol: "☐", desc: "Força transformadora impulsionada sob pressões e atritos." };
    }
    if (Math.abs(distance - 60) <= 6) {
      return { type: "Sextil", color: "#06B6D4", symbol: "⚹", desc: "Oportunidades de colaboração que premiam ações conscientes." };
    }
    return null;
  };

  // Generate all active relationships between transits and natal chart
  const getAllActiveAspects = () => {
    const list: any[] = [];
    TRANSIT_METADATA.forEach((transitPlanet) => {
      const tAngle = getTransitAngle(transitPlanet);
      TRANSIT_METADATA.forEach((natalPlanet) => {
        const nAngle = getNatalAngle(natalPlanet.name);
        if (nAngle !== null) {
          const aspect = checkAspect(tAngle, nAngle);
          if (aspect) {
            list.push({
              transit: transitPlanet.name,
              natal: natalPlanet.name,
              type: aspect.type,
              color: aspect.color,
              symbol: aspect.symbol,
              desc: aspect.desc,
              angleTransit: tAngle,
              angleNatal: nAngle,
              transitRadius: transitPlanet.radiusOffset,
              natalRadius: 0 // offset towards internal core
            });
          }
        }
      });
    });
    return list;
  };

  const activeAspects = getAllActiveAspects();
  
  // Isolate aspects of the hovered or selected planet to draw connecting rays
  const getHighlightedAspects = () => {
    const focusPlanet = hoveredPlanet || selectedPlanet;
    if (!focusPlanet) return [];
    return activeAspects.filter(
      (asp) => asp.transit.toLowerCase() === focusPlanet.toLowerCase() ||
               asp.natal.toLowerCase() === focusPlanet.toLowerCase()
    );
  };

  const highlightedAspects = getHighlightedAspects();

  // Draw the astronomical map with D3 inside useEffect
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    const width = dimensions.width;
    const height = dimensions.height;
    const center = width / 2;
    const maxRadius = width / 2 - 25;

    // Ensure stable definitions & filter
    let defs = svg.select("defs");
    if (defs.empty()) {
      defs = svg.append("defs");
      
      const glowFilter = defs.append("filter")
        .attr("id", "astro-glow")
        .attr("x", "-40%")
        .attr("y", "-40%")
        .attr("width", "180%")
        .attr("height", "180%");

      glowFilter.append("feGaussianBlur")
        .attr("stdDeviation", "3.0")
        .attr("result", "blur");

      const feMerge = glowFilter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "blur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    }

    // Coordinate translation: transform angles into polar coordinates
    const polarToCartesian = (degrees: number, r: number) => {
      // Rotate by -90 deg so 0 degrees matches the Ascendant (Left horizontal axis)
      const radians = (degrees - 90) * Math.PI / 180;
      return {
        x: r * Math.cos(radians),
        y: r * Math.sin(radians)
      };
    };

    // Select or append main astrolabe group
    let chartGroup = svg.select<SVGGElement>(".astrolabe-group");
    if (chartGroup.empty()) {
      chartGroup = svg.append("g").attr("class", "astrolabe-group");
    }
    chartGroup.attr("transform", `translate(${center}, ${center})`);

    // Dynamic inner limits separating Natal Core, Aspects Web and Transit Ring
    const transitRingBoundary = maxRadius - 20;
    const aspectInnerBoundary = maxRadius - 100;
    const natalRadius = aspectInnerBoundary - 30;

    // Render outer background rings once
    let bgOuterLine = chartGroup.select(".bg-outer-ring");
    if (bgOuterLine.empty()) {
      bgOuterLine = chartGroup.append("circle")
        .attr("class", "bg-outer-ring fill-slate-950 stroke-slate-800")
        .attr("stroke-width", 2);
    }
    bgOuterLine.attr("r", maxRadius);

    let bgTransitBoundary = chartGroup.select(".bg-transit-boundary");
    if (bgTransitBoundary.empty()) {
      bgTransitBoundary = chartGroup.append("circle")
        .attr("class", "bg-transit-boundary fill-transparent stroke-slate-850")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 4");
    }
    bgTransitBoundary.attr("r", transitRingBoundary);

    let bgAspectBoundary = chartGroup.select(".bg-aspect-boundary");
    if (bgAspectBoundary.empty()) {
      bgAspectBoundary = chartGroup.append("circle")
        .attr("class", "bg-aspect-boundary fill-slate-900/10 stroke-slate-800")
        .attr("stroke-width", 1.5);
    }
    bgAspectBoundary.attr("r", aspectInnerBoundary);

    // Render Zodiac divider lines and symbols dynamically to adapt to ResizeObserver changes
    let zodiacGroup = chartGroup.select(".zodiac-static-group");
    if (zodiacGroup.empty()) {
      zodiacGroup = chartGroup.append("g").attr("class", "zodiac-static-group");
    }

    const zodiacLinesData = ZODIAC_SIGNS.map((sign, idx) => {
      const startAngle = idx * 30;
      const p1 = polarToCartesian(startAngle, maxRadius);
      const p2 = polarToCartesian(startAngle, aspectInnerBoundary);
      return { id: idx, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    });

    const zodiacLines = zodiacGroup.selectAll<SVGLineElement, any>("line")
      .data(zodiacLinesData, d => d.id);

    zodiacLines.exit().remove();
    zodiacLines.enter()
      .append("line")
      .attr("stroke", "rgba(51, 65, 85, 0.35)")
      .attr("stroke-width", 1)
      .merge(zodiacLines)
      .attr("x1", d => d.x1)
      .attr("y1", d => d.y1)
      .attr("x2", d => d.x2)
      .attr("y2", d => d.y2);

    const zodiacTextsData = ZODIAC_SIGNS.map((sign, idx) => {
      const midAngle = idx * 30 + 15;
      const textPos = polarToCartesian(midAngle, maxRadius - 10);
      return { id: idx, name: sign.name, symbol: sign.symbol, color: sign.color, element: sign.element, x: textPos.x, y: textPos.y };
    });

    const zodiacTexts = zodiacGroup.selectAll<SVGTextElement, any>("text")
      .data(zodiacTextsData, d => d.id);

    zodiacTexts.exit().remove();
    const zodiacTextsEnter = zodiacTexts.enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-[12px] font-sans font-bold cursor-default select-none");

    zodiacTextsEnter.append("title");

    const zodiacTextsMerge = zodiacTextsEnter.merge(zodiacTexts);
    zodiacTextsMerge
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("fill", d => d.color)
      .text(d => d.symbol);

    zodiacTextsMerge.select("title")
      .text(d => `${t(d.name)} (${t(d.element.toUpperCase())})`);

    // Prepare Dynamic Transition Variables
    const transitionDuration = isPlaying ? 55 : 370;
    const transitionEase = isPlaying ? d3.easeLinear : d3.easeCubicOut;

    // 1. Data mapping for dynamic aspect connection lines
    const drawRays = highlightedAspects.length > 0 ? highlightedAspects : activeAspects;
    const aspectLinesData = drawRays.map((asp, idx) => {
      const tPlanetConf = TRANSIT_METADATA.find(p => p.name === asp.transit);
      const tRadius = maxRadius - 35 - (tPlanetConf ? tPlanetConf.radiusOffset * 0.25 : 20);
      const pTransit = polarToCartesian(asp.angleTransit, tRadius);
      const pNatal = polarToCartesian(asp.angleNatal, natalRadius);
      const isFocusedRay = highlightedAspects.length > 0;
      return {
        id: `${asp.transit}-${asp.natal}-${idx}`,
        x1: pTransit.x,
        y1: pTransit.y,
        x2: pNatal.x,
        y2: pNatal.y,
        color: asp.color,
        opacity: isFocusedRay ? 0.95 : 0.18,
        width: isFocusedRay ? 2.0 : 0.8,
        style: isFocusedRay ? "none" : "2 2",
        symbol: asp.symbol,
        showGlyph: isFocusedRay
      };
    });

    // Join Aspect Lines
    let aspectsContainer = chartGroup.select(".aspects-container");
    if (aspectsContainer.empty()) {
      aspectsContainer = chartGroup.append("g").attr("class", "aspects-container");
    }

    const aspectLines = aspectsContainer.selectAll<SVGLineElement, any>(".aspect-ray")
      .data(aspectLinesData, d => d.id);

    // Exit
    aspectLines.exit()
      .transition()
      .duration(150)
      .attr("stroke-opacity", 0)
      .remove();

    // Enter
    const aspectLinesEnter = aspectLines.enter()
      .append("line")
      .attr("class", d => d.showGlyph ? "aspect-ray flowing-aspect" : "aspect-ray")
      .attr("x1", d => d.x1)
      .attr("y1", d => d.y1)
      .attr("x2", d => d.x2)
      .attr("y2", d => d.y2)
      .attr("stroke", d => d.color)
      .attr("stroke-opacity", 0)
      .attr("stroke-width", d => d.width)
      .attr("stroke-dasharray", d => d.showGlyph ? null : d.style);

    // Merge and Transition
    aspectLinesEnter.merge(aspectLines)
      .attr("class", d => d.showGlyph ? "aspect-ray flowing-aspect" : "aspect-ray")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attr("x1", d => d.x1)
      .attr("y1", d => d.y1)
      .attr("x2", d => d.x2)
      .attr("y2", d => d.y2)
      .attr("stroke", d => d.color)
      .attr("stroke-opacity", d => d.opacity)
      .attr("stroke-width", d => d.width)
      .attr("stroke-dasharray", d => d.showGlyph ? null : d.style);

    // Aspect glyph badges container
    let badgeContainer = chartGroup.select(".aspect-badges-container");
    if (badgeContainer.empty()) {
      badgeContainer = chartGroup.append("g").attr("class", "aspect-badges-container");
    }

    const aspectBadges = badgeContainer.selectAll<SVGGElement, any>(".aspect-badge-group")
      .data(aspectLinesData.filter(d => d.showGlyph), d => d.id);

    aspectBadges.exit().remove();

    const aspectBadgesEnter = aspectBadges.enter()
      .append("g")
      .attr("class", "aspect-badge-group")
      .attr("opacity", 0);

    aspectBadgesEnter.append("circle")
      .attr("r", 7)
      .attr("fill", "#020617")
      .attr("stroke-width", 1);

    aspectBadgesEnter.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-[8.5px] font-mono font-bold select-none");

    const aspectBadgesMerge = aspectBadgesEnter.merge(aspectBadges);

    aspectBadgesMerge
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attr("opacity", 1)
      .attr("transform", d => `translate(${(d.x1 + d.x2)/2}, ${(d.y1 + d.y2)/2})`);

    aspectBadgesMerge.select("circle")
      .attr("stroke", d => d.color);

    aspectBadgesMerge.select("text")
      .attr("fill", d => d.color)
      .text(d => d.symbol);

    // 2. Data mapping for natal birth planets
    const natalPlanetsData = TRANSIT_METADATA.map((planet) => {
      const nAngle = getNatalAngle(planet.name);
      if (nAngle === null) return null;
      const pos = polarToCartesian(nAngle, natalRadius);
      const isFocused = hoveredPlanet === planet.name || selectedPlanet === planet.name;
      return {
        name: planet.name,
        color: planet.color,
        x: pos.x,
        y: pos.y,
        angle: nAngle,
        isFocused
      };
    }).filter(Boolean) as any[];

    // Join Natal Planets
    let natalContainer = chartGroup.select(".natal-planets-container");
    if (natalContainer.empty()) {
      natalContainer = chartGroup.append("g").attr("class", "natal-planets-container");
    }

    const natalNodes = natalContainer.selectAll<SVGGElement, any>(".natal-node")
      .data(natalPlanetsData, d => d.name);

    natalNodes.exit().remove();

    const natalNodesEnter = natalNodes.enter()
      .append("g")
      .attr("class", "natal-node cursor-pointer")
      .on("click", (event, d) => setSelectedPlanet(d.name))
      .on("mouseover", (event, d) => setHoveredPlanet(d.name))
      .on("mouseleave", () => setHoveredPlanet(null));

    natalNodesEnter.append("circle")
      .attr("class", "natal-core")
      .attr("fill", "#020617")
      .attr("stroke-width", 1.2);

    natalNodesEnter.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "font-mono text-[7px] tracking-tighter select-none");

    const natalNodesMerge = natalNodesEnter.merge(natalNodes);

    natalNodesMerge.select(".natal-core")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.isFocused ? 6.0 : 3.5)
      .attr("stroke", d => d.color)
      .style("filter", d => d.isFocused ? "url(#astro-glow)" : "none");

    natalNodesMerge.select("text")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attr("x", d => polarToCartesian(d.angle, natalRadius - 16).x)
      .attr("y", d => polarToCartesian(d.angle, natalRadius - 16).y)
      .attr("fill", d => d.isFocused ? "#FFF" : "rgba(148, 163, 184, 0.55)")
      .attr("class", d => `font-mono text-[7px] tracking-tighter select-none ${d.isFocused ? 'font-bold' : ''}`)
      .text(d => `${d.name.slice(0, 3).toUpperCase()}ⓝ`);

    // 3. Data mapping for dynamic transit planets
    const transitPlanetsData = TRANSIT_METADATA.map((planet) => {
      const tAngle = getTransitAngle(planet);
      const tRadius = maxRadius - 35 - (planet.radiusOffset * 0.25);
      const pos = polarToCartesian(tAngle, tRadius);
      const isFocused = hoveredPlanet === planet.name || selectedPlanet === planet.name;
      return {
        name: planet.name,
        color: planet.color,
        x: pos.x,
        y: pos.y,
        angle: tAngle,
        radius: tRadius,
        isFocused
      };
    });

    // Render transit orbit tracking tracks dynamically to adapt to ResizeObserver changes
    let transitTracksContainer = chartGroup.select(".transit-tracks-container");
    if (transitTracksContainer.empty()) {
      transitTracksContainer = chartGroup.append("g").attr("class", "transit-tracks-container");
    }

    const transitCircles = transitTracksContainer.selectAll<SVGCircleElement, any>("circle")
      .data(transitPlanetsData, d => d.name);

    transitCircles.exit().remove();
    transitCircles.enter()
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "rgba(51, 65, 85, 0.12)")
      .attr("stroke-width", 0.75)
      .merge(transitCircles)
      .attr("r", d => d.radius);

    // Join Transit Planets
    let transitContainer = chartGroup.select(".transit-planets-container");
    if (transitContainer.empty()) {
      transitContainer = chartGroup.append("g").attr("class", "transit-planets-container");
    }

    const transitNodes = transitContainer.selectAll<SVGGElement, any>(".transit-node")
      .data(transitPlanetsData, d => d.name);

    const transitNodesEnter = transitNodes.enter()
      .append("g")
      .attr("class", "transit-node cursor-pointer")
      .on("click", (event, d) => setSelectedPlanet(d.name))
      .on("pointerdown", (event, d) => setSelectedPlanet(d.name))
      .on("mouseover", (event, d) => setHoveredPlanet(d.name))
      .on("mouseleave", () => setHoveredPlanet(null));

    // Append fading stardust trail circles representing celestial trails
    transitNodesEnter.append("circle")
      .attr("class", "trail-dot-3 fill-none")
      .attr("opacity", 0.15);

    transitNodesEnter.append("circle")
      .attr("class", "trail-dot-2 fill-none")
      .attr("opacity", 0.35);

    transitNodesEnter.append("circle")
      .attr("class", "trail-dot-1 fill-none")
      .attr("opacity", 0.55);

    // Append halo pulse circle
    transitNodesEnter.append("circle")
      .attr("class", "pulse-halo fill-none")
      .attr("r", 9)
      .attr("opacity", 0);

    // Append main core sphere circle
    transitNodesEnter.append("circle")
      .attr("class", "transit-core")
      .attr("stroke", "#020617")
      .attr("stroke-width", 1.5);

    // Append labels text element
    transitNodesEnter.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "font-mono text-[8px] font-semibold select-none");

    const transitNodesMerge = transitNodesEnter.merge(transitNodes);

    // Transition stardust trail 3
    transitNodesMerge.select(".trail-dot-3")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attrTween("cx", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngle3 !== undefined ? element._currentAngle3 : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngle3 = d.angle;
        return function(t) {
          const currentAngle = interpolator(t) - 8;
          return String(polarToCartesian(currentAngle, d.radius).x);
        };
      })
      .attrTween("cy", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngle3 !== undefined ? element._currentAngle3 : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngle3 = d.angle;
        return function(t) {
          const currentAngle = interpolator(t) - 8;
          return String(polarToCartesian(currentAngle, d.radius).y);
        };
      })
      .attr("r", 1.2)
      .attr("fill", d => d.color);

    // Transition stardust trail 2
    transitNodesMerge.select(".trail-dot-2")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attrTween("cx", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngle2 !== undefined ? element._currentAngle2 : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngle2 = d.angle;
        return function(t) {
          const currentAngle = interpolator(t) - 4.5;
          return String(polarToCartesian(currentAngle, d.radius).x);
        };
      })
      .attrTween("cy", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngle2 !== undefined ? element._currentAngle2 : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngle2 = d.angle;
        return function(t) {
          const currentAngle = interpolator(t) - 4.5;
          return String(polarToCartesian(currentAngle, d.radius).y);
        };
      })
      .attr("r", 1.8)
      .attr("fill", d => d.color);

    // Transition stardust trail 1
    transitNodesMerge.select(".trail-dot-1")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attrTween("cx", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngle1 !== undefined ? element._currentAngle1 : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngle1 = d.angle;
        return function(t) {
          const currentAngle = interpolator(t) - 2;
          return String(polarToCartesian(currentAngle, d.radius).x);
        };
      })
      .attrTween("cy", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngle1 !== undefined ? element._currentAngle1 : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngle1 = d.angle;
        return function(t) {
          const currentAngle = interpolator(t) - 2;
          return String(polarToCartesian(currentAngle, d.radius).y);
        };
      })
      .attr("r", 2.5)
      .attr("fill", d => d.color);

    // Transition the outer dynamic pulse ring
    transitNodesMerge.select(".pulse-halo")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attrTween("cx", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngleH !== undefined ? element._currentAngleH : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngleH = d.angle;
        return function(t) {
          const currentAngle = interpolator(t);
          return String(polarToCartesian(currentAngle, d.radius).x);
        };
      })
      .attrTween("cy", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngleH !== undefined ? element._currentAngleH : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngleH = d.angle;
        return function(t) {
          const currentAngle = interpolator(t);
          return String(polarToCartesian(currentAngle, d.radius).y);
        };
      })
      .attr("stroke", d => d.color)
      .attr("stroke-opacity", d => d.isFocused ? 0.35 : 0)
      .attr("fill", d => d.color)
      .attr("fill-opacity", d => d.isFocused ? 0.15 : 0)
      .attr("class", d => d.isFocused ? "pulse-halo fill-none pulse-glowing-halo" : "pulse-halo fill-none");

    // Transition core spheres
    transitNodesMerge.select(".transit-core")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attrTween("cx", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngleC !== undefined ? element._currentAngleC : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngleC = d.angle;
        return function(t) {
          const currentAngle = interpolator(t);
          return String(polarToCartesian(currentAngle, d.radius).x);
        };
      })
      .attrTween("cy", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngleC !== undefined ? element._currentAngleC : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngleC = d.angle;
        return function(t) {
          const currentAngle = interpolator(t);
          return String(polarToCartesian(currentAngle, d.radius).y);
        };
      })
      .attr("r", d => d.isFocused ? 6.5 : 4.5)
      .attr("fill", d => d.color)
      .style("filter", d => d.isFocused ? "url(#astro-glow)" : "none");

    // Transition text labels
    transitNodesMerge.select("text")
      .transition()
      .duration(transitionDuration)
      .ease(transitionEase)
      .attrTween("x", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngleT !== undefined ? element._currentAngleT : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngleT = d.angle;
        return function(t) {
          const currentAngle = interpolator(t);
          return String(polarToCartesian(currentAngle, d.radius + 12).x);
        };
      })
      .attrTween("y", function(d) {
        const element = this as any;
        const prevAngle = element._currentAngleT !== undefined ? element._currentAngleT : d.angle;
        const interpolator = d3.interpolate(prevAngle, d.angle);
        element._currentAngleT = d.angle;
        return function(t) {
          const currentAngle = interpolator(t);
          return String(polarToCartesian(currentAngle, d.radius + 12).y);
        };
      })
      .attr("fill", d => d.isFocused ? "#FFF" : d.color)
      .attr("fill-opacity", d => d.isFocused ? 1 : 0.75)
      .text(d => d.name.slice(0, 3).toUpperCase());

    // Center compass compass rose
    let centerGroup = chartGroup.select(".astrolabe-center-sun");
    if (centerGroup.empty()) {
      centerGroup = chartGroup.append("g").attr("class", "astrolabe-center-sun");
      centerGroup.append("circle")
        .attr("r", 10)
        .attr("class", "fill-slate-950 stroke-amber-500/30")
        .attr("stroke-width", 1.5);

      centerGroup.append("circle")
        .attr("r", 2.5)
        .attr("class", "fill-amber-500");
    }

  }, [dimensions, simDays, hoveredPlanet, selectedPlanet, mapData, isPlaying]);

  // Read current focused planet config
  const activePlanetConf = TRANSIT_METADATA.find(p => p.name === selectedPlanet) || TRANSIT_METADATA[0];
  const activeTransitAngle = getTransitAngle(activePlanetConf);
  const activeNatalAngle = getNatalAngle(selectedPlanet);

  const transitLabelInfo = getAstroLabel(activeTransitAngle);
  const natalLabelInfo = activeNatalAngle !== null ? getAstroLabel(activeNatalAngle) : null;

  // Single dynamic description for the active transit aspect relationship
  const currentTransitAspectRelations = activeAspects.filter(a => a.transit === selectedPlanet);

  return (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-6">
      
      {/* Top Controls Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Orbit className="w-4 h-4 text-rose-450 animate-spin-slow" />
              {t("Alinhamento de Trânsitos em Tempo Real")}
            </h3>
            <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[8px] font-mono text-rose-400 rounded-sm">
              D3 Interactive Map
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            {t("Analise trânsitos rotacionando dinamicamente e cruzando aspectos com suas casas de nascimento.")}
          </p>
        </div>

        {/* Live Simulation controls */}
        <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? t("Pausar Fluxo") : t("Iniciar Fluxo")}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 transition active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-rose-400" />}
          </button>

          <button
            onClick={() => {
              setSimDays(0);
              setIsPlaying(false);
            }}
            title={t("Resetar data oficial (Tempo Real)")}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Speed slider */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[8px] font-mono text-slate-555 uppercase">{t("Velocidade:")}</span>
            <input 
              type="range"
              min="0.1"
              max="15.0"
              step="0.1"
              value={simSpeed}
              onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[9px] font-mono text-rose-400 w-9">{simSpeed.toFixed(1)}d/s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive D3 astrolabe canvas container */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          
          <div ref={containerRef} className="w-full flex justify-center items-center">
            <svg 
              ref={svgRef} 
              width={dimensions.width} 
              height={dimensions.height}
              className="max-w-full select-none"
            />
          </div>

          {/* Compass labels */}
          <div className="flex justify-between w-full max-w-[340px] mt-1 pr-2 text-[8px] font-mono text-slate-600 select-none">
            <span>[E] {t("LESTE / ASCENDENTE")}</span>
            <span>{t("OESTE / DESCENDENTE")} [W]</span>
          </div>

          {/* Days simulated metrics */}
          {simDays !== 0 && (
            <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded border border-rose-500/20 text-[9px] font-mono text-rose-450 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 animate-pulse" />
              <span>{t("Simulado:")} +{Math.round(simDays)} {t("dias de trânsito")}</span>
            </div>
          )}
        </div>

        {/* Right Column: Visual feedback and detailed explanation card */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Legend indicator */}
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-850">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[9px] text-slate-450 font-mono">{t("Conjunção (0°)")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[9px] text-slate-450 font-mono">{t("Oposição (180°)")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-slate-450 font-mono">{t("Trígono (120°)")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              <span className="text-[9px] text-slate-450 font-mono">{t("Quadratura (90°)")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[9px] text-slate-450 font-mono">{t("Sextil (60°)")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span className="text-[9px] text-slate-450 font-mono">ⓝ {t("Natal")} / ⓣ {t("Trânsito")}</span>
            </div>
          </div>

          {/* Quick Planet Select buttons list with fluid layout pill sliding */}
          <div className="bg-slate-950/45 p-1 rounded-2xl border border-slate-850/60">
            <span className="px-2 pb-1 text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">{t("Navegar Órbitas")}</span>
            <div className="flex flex-wrap gap-1">
              {TRANSIT_METADATA.map((p) => {
                const active = selectedPlanet === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlanet(p.name)}
                    className={`relative px-2.5 py-1 rounded-xl text-[9.5px] font-mono transition-all duration-300 cursor-pointer ${
                      active 
                        ? 'text-rose-350 font-extrabold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activePlanetPill"
                        className="absolute inset-0 bg-rose-500/10 border border-rose-500/30 rounded-xl -z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t(p.name)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Details Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPlanet}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="p-5 rounded-3xl bg-slate-950 border border-slate-850/80 space-y-4 shadow-xl relative overflow-hidden"
            >
              
              {/* Decorative radial blur gradient on card */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-15 blur-2xl" 
                   style={{ backgroundColor: activePlanetConf.color }} />

              {/* Title block */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activePlanetConf.color }} />
                    {t(activePlanetConf.label)}
                  </h4>
                  <p className="text-[10px] text-slate-450 italic mt-0.5">{t(activePlanetConf.description)}</p>
                </div>
              </div>

              {/* Position Match block */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-900 relative z-10">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-555 uppercase block">{t("Trânsito Atual ⓣ")}</span>
                  <div className="text-xs font-semibold flex items-center gap-1 text-slate-300">
                    <span style={{ color: transitLabelInfo.color }} className="font-bold">{transitLabelInfo.signSymbol}</span>
                    <span>{transitLabelInfo.degrees}° {t("de")} {t(transitLabelInfo.signName)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-slate-555 uppercase block">{t("Posição Natal ⓝ")}</span>
                  <div className="text-xs font-semibold flex items-center gap-1 text-slate-300">
                    {natalLabelInfo ? (
                      <>
                        <span style={{ color: natalLabelInfo.color }} className="font-bold">{natalLabelInfo.signSymbol}</span>
                        <span>{natalLabelInfo.degrees}° {t("de")} {t(natalLabelInfo.signName)}</span>
                      </>
                    ) : (
                      <span className="text-slate-600 font-mono text-[10px]">{t("Não mapeado")}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aspects block */}
              <div className="space-y-2.5 pt-3 border-t border-slate-900 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-slate-555 uppercase">{t("Aspectos Ativos deste planeta")}</span>
                  <span className="text-[9px] font-mono text-rose-450 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded-sm">
                    {currentTransitAspectRelations.length} {t("conexões")}
                  </span>
                </div>
                
                {currentTransitAspectRelations.length > 0 ? (
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {currentTransitAspectRelations.map((asp, idx) => (
                      <motion.div 
                         key={idx} 
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.18 }}
                        className="p-2 rounded-2xl bg-slate-900/60 border border-slate-850/75 hover:border-slate-800 transition-colors flex items-start gap-2.5"
                      >
                        <span className="text-xs font-bold pt-0.5 shrink-0" style={{ color: asp.color }}>{asp.symbol}</span>
                        <div className="text-[9.5px] leading-relaxed">
                          <strong style={{ color: asp.color }}>{t(asp.type)}</strong> {t("de")} <strong className="text-slate-300"> {t(asp.transit)} ⓣ </strong> {t("com seu")} <strong className="text-slate-300"> {t(asp.natal)} ⓝ </strong>
                          <p className="text-[8.5px] text-slate-450 mt-0.5 leading-normal">{t(asp.desc)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-500 italic bg-slate-900/10 p-2.5 rounded border border-slate-900 leading-normal">
                    {t("Nenhum aspecto maior exato formado no momento com o seu mapa natal. Rotacione o tempo usando a velocidade de simulação para ver novos alinhamentos celestes dinamicamente!")}
                  </div>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Astrology advice according to computed transit alignments */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPlanet + "-advice"}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="p-3.5 bg-gradient-to-r from-rose-950/20 to-transparent border-l-2 border-rose-500/20 rounded-r-xl flex gap-2.5 shadow-sm"
            >
              <Zap className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[8px] font-mono text-rose-450 uppercase font-bold tracking-wider block">{t("Insight do Alinhamento Ativo")}</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  {selectedPlanet === "Sol" && t("O trânsito solar ilumina seu mapa atual estimulando renovações de identidade.")}
                  {selectedPlanet === "Lua" && t("Sensibilidade acelerada em oscilações oníricas diárias. Excelente para journaling.")}
                  {selectedPlanet === "Mercúrio" && t("Aceleração de contatos, excelente para reavaliar correspondências importantes.")}
                  {selectedPlanet === "Vênus" && t("Magnetismo em alta facilitando entendimentos com parcerias e acordos estéticos.")}
                  {selectedPlanet === "Marte" && t("Mantenha o foco ativo para evitar conflitos desnecessários, redirecione o impulso.")}
                  {!["Sol", "Lua", "Mercúrio", "Vênus", "Marte"].includes(selectedPlanet) && t("Trânsitos de planetas geracionais influenciam as estruturas institucionais de sua jornada de longo prazo.")}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}

// Math-based astronomical/astrological calculation engine for high-precision placements
// Using J2000 epoch Keplerian elements, obliquity of ecliptic, sidereal calculations, and lunar perturbations.

export interface AstroPlacement {
  name: string;
  sign: string;
  degree: number;
  minute: number;
  longitude: number;
  extraInfo?: string;
  description: string;
}

export interface AstroHouseCusp {
  number: number;
  sign: string;
  longitude: number;
  planets: string[];
  interpretation: string;
}

export interface AstroAspectDetails {
  planet1: string;
  planet2: string;
  aspectType: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil" | "Quincúncio" | "Semisextil" | "Semicuadratura" | "Sesquiquadratura" | "Biquintil";
  angle: number;
  orb: string;
  intensity: number;
  interpretation: string;
}

export interface CalculatedChart {
  astros: AstroPlacement[];
  houses: AstroHouseCusp[];
  aspects: AstroAspectDetails[];
  distribution: {
    elements: { fire: number; earth: number; air: number; water: number };
    qualities: { cardinal: number; fixed: number; mutable: number };
    polarization: { yang: number; yin: number };
  };
}

const SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
];

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

// Standard Keplerian elements at J2000 for heliocentric solar system
interface KeplerianElements {
  a: number; // semi-major axis (AU)
  e: number; // eccentricity
  i: number; // inclination (degrees)
  L: number; // mean longitude (degrees)
  longPeri: number; // longitude of perihelion (degrees)
  longNode: number; // longitude of ascending node (degrees)
  
  // Rates of change per Julian century
  eRate?: number;
  iRate?: number;
  LRate?: number;
  longPeriRate?: number;
  longNodeRate?: number;
}

const PLANETS_ELEMENTS: Record<string, KeplerianElements> = {
  Mercury: {
    a: 0.387098,
    e: 0.205630, eRate: 0.000020,
    i: 7.0049, iRate: 0.0050,
    L: 252.2508, LRate: 149472.6741,
    longPeri: 77.4564, longPeriRate: 0.1590,
    longNode: 48.3317, longNodeRate: -0.1253
  },
  Venus: {
    a: 0.723332,
    e: 0.006773, eRate: -0.000048,
    i: 3.3947, iRate: 0.0008,
    L: 181.9797, LRate: 58517.8153,
    longPeri: 131.5329, longPeriRate: 0.0020,
    longNode: 76.6807, longNodeRate: -0.2777
  },
  Earth: {
    a: 1.000001,
    e: 0.016708, eRate: -0.000042,
    i: 0.0, iRate: 0.0,
    L: 100.4643, LRate: 36000.7698,
    longPeri: 102.9471, longPeriRate: 0.3232,
    longNode: 0.0, longNodeRate: 0.0
  },
  Mars: {
    a: 1.523662,
    e: 0.093412, eRate: 0.000119,
    i: 1.8506, iRate: -0.0008,
    L: 355.4533, LRate: 19140.3026,
    longPeri: 336.0408, longPeriRate: 0.4439,
    longNode: 49.5785, longNodeRate: -0.2926
  },
  Jupiter: {
    a: 5.203363,
    e: 0.048393, eRate: -0.000129,
    i: 1.3053, iRate: -0.0041,
    L: 34.4044, LRate: 3034.7461,
    longPeri: 14.7538, longPeriRate: 0.1911,
    longNode: 100.5561, longNodeRate: 0.2040
  },
  Saturn: {
    a: 9.537070,
    e: 0.054150, eRate: -0.000368,
    i: 2.4845, iRate: 0.0019,
    L: 49.9443, LRate: 1222.4944,
    longPeri: 92.4319, longPeriRate: -0.4189,
    longNode: 113.7150, longNodeRate: -0.3623
  },
  Uranus: {
    a: 19.19126,
    e: 0.047168, eRate: -0.000191,
    i: 0.7697, iRate: 0.0003,
    L: 313.2322, LRate: 428.4820,
    longPeri: 170.9642, longPeriRate: 1.4080,
    longNode: 74.2299, longNodeRate: -0.0903
  },
  Neptune: {
    a: 30.06896,
    e: 0.008586, eRate: 0.000025,
    i: 1.7692, iRate: 0.0008,
    L: 304.8800, LRate: 218.4595,
    longPeri: 44.9713, longPeriRate: -0.3224,
    longNode: 131.7217, longNodeRate: -0.0059
  },
  Pluto: {
    a: 39.48,
    e: 0.2488,
    i: 17.14,
    L: 238.9288, LRate: 145.2078,
    longPeri: 224.06,
    longNode: 110.30
  },
  Chiron: {
    a: 13.71,
    e: 0.380,
    i: 6.93,
    L: 200.0, LRate: 7.07,
    longPeri: 339.3,
    longNode: 209.4
  }
};

export function getJulianDate(year: number, month: number, day: number, hour: number, minute: number): number {
  let Y = year;
  let M = month;
  let D = day + (hour + minute / 60.0) / 24.0;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  return JD;
}

function solveKepler(M: number, e: number): number {
  const M_rad = M * Math.PI / 180;
  let E = M_rad;
  for (let i = 0; i < 6; i++) {
    E = E - (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
  }
  return E;
}

function getHeliocentricCoordinates(planet: string, T: number) {
  const elem = PLANETS_ELEMENTS[planet] || PLANETS_ELEMENTS.Earth;
  
  const a = elem.a;
  const e = elem.e + (elem.eRate || 0) * T;
  const i = (elem.i + (elem.iRate || 0) * T) * Math.PI / 180;
  const L = (elem.L + (elem.LRate || 0) * T) % 360;
  const longPeri = (elem.longPeri + (elem.longPeriRate || 0) * T) % 360;
  const longNode = (elem.longNode + (elem.longNodeRate || 0) * T) % 360;
  
  const w = (longPeri - longNode + 360) % 360; // Argument of perihelion
  const M = (L - longPeri + 360) % 360; // Mean anomaly
  
  const E = solveKepler(M, e);
  
  // Coordinates in orbital plane
  const x_plane = a * (Math.cos(E) - e);
  const y_plane = a * Math.sqrt(1 - e * e) * Math.sin(E);
  
  // Angle definitions
  const o_rad = longNode * Math.PI / 180;
  const w_rad = w * Math.PI / 180;
  
  // 3D Heliocentric ecliptic coordinates
  const x = x_plane * (Math.cos(w_rad) * Math.cos(o_rad) - Math.sin(w_rad) * Math.sin(o_rad) * Math.cos(i)) - y_plane * (Math.sin(w_rad) * Math.cos(o_rad) + Math.cos(w_rad) * Math.sin(o_rad) * Math.cos(i));
  const y = x_plane * (Math.cos(w_rad) * Math.sin(o_rad) + Math.sin(w_rad) * Math.cos(o_rad) * Math.cos(i)) - y_plane * (Math.sin(w_rad) * Math.sin(o_rad) - Math.cos(w_rad) * Math.cos(o_rad) * Math.cos(i));
  const z = x_plane * (Math.sin(w_rad) * Math.sin(i)) + y_plane * (Math.cos(w_rad) * Math.sin(i));
  
  return { x, y, z };
}

export function calculateGeocentricLongitude(planetName: string, T: number, earthCoords: { x: number; y: number; z: number }): number {
  if (planetName === "Sol") {
    // Geocentric Sun is opposite coordinates of Heliocentric Earth
    const x = -earthCoords.x;
    const y = -earthCoords.y;
    let long = Math.atan2(y, x) * 180 / Math.PI;
    return (long + 360) % 360;
  }
  
  const pCoords = getHeliocentricCoordinates(planetName, T);
  const x_g = pCoords.x - earthCoords.x;
  const y_g = pCoords.y - earthCoords.y;
  let long = Math.atan2(y_g, x_g) * 180 / Math.PI;
  return (long + 360) % 360;
}

export function calculateMoonLongitude(T: number): number {
  // Analytical perturbation formula for Moon geocentric longitude
  const L_prime = (218.316 + 481267.881 * T) % 360;
  const M_prime = (134.963 + 477198.868 * T) % 360; // Lunar Mean Anomaly
  const M_sun = (357.529 + 35999.050 * T) % 360; // Solar Mean Anomaly
  const D = (297.850 + 445267.111 * T) % 360; // Lunar Mean Elongation
  const F = (93.272 + 483202.018 * T) % 360; // Lunar Argument of Latitude
  
  const L_prime_rad = L_prime * Math.PI / 180;
  const M_prime_rad = M_prime * Math.PI / 180;
  const M_sun_rad = M_sun * Math.PI / 180;
  const D_rad = D * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  
  let moonLong = L_prime;
  moonLong += 6.2887 * Math.sin(M_prime_rad);
  moonLong += -1.2740 * Math.sin(M_prime_rad - 2 * D_rad);
  moonLong += 0.6583 * Math.sin(2 * D_rad);
  moonLong += 0.2136 * Math.sin(2 * M_prime_rad);
  moonLong += -0.1851 * Math.sin(M_sun_rad);
  moonLong += -0.1143 * Math.sin(2 * F_rad);
  moonLong += 0.0587 * Math.sin(2 * D_rad - M_prime_rad);
  moonLong += 0.0572 * Math.sin(2 * D_rad - M_sun_rad - M_prime_rad);
  moonLong += 0.0533 * Math.sin(M_prime_rad + 2 * D_rad);
  
  return (moonLong + 360) % 360;
}

export function getZodiacSignInfo(longitude: number) {
  const norm = (longitude + 360) % 360;
  const idx = Math.floor(norm / 30) % 12;
  const sign = SIGNS[idx];
  const totalMin = (norm % 30) * 60;
  const degree = Math.floor(norm % 30);
  const minute = Math.floor(totalMin % 60);
  return { sign, degree, minute, index: idx };
}

// Check if an angle lies in a sector
function isLongBetween(target: number, start: number, end: number): boolean {
  const nTarget = (target - start + 360) % 360;
  const nEnd = (end - start + 360) % 360;
  return nTarget < nEnd;
}

export function performAstroCalculation(
  birthDate: string,
  birthTime: string,
  latitude: number = -23.5505, // SP Default
  longitude: number = -46.6333, // SP Default
  timezoneOffset?: number
): CalculatedChart {
  // Parse birth details
  const [year, month, day] = birthDate.split("-").map(v => parseInt(v, 10));
  let hour = 12;
  let minute = 0;
  if (birthTime && birthTime.includes(":")) {
    const [h, m] = birthTime.split(":").map(v => parseInt(v, 10));
    hour = isNaN(h) ? 12 : h;
    minute = isNaN(m) ? 0 : m;
  }
  
  // Determine standard timezone offset (in hours) if not provided
  const tzOffset = (timezoneOffset !== undefined) ? timezoneOffset : Math.round(longitude / 15);

  // Convert local standard / DST time to UTC precisely, handling day/month/year overflows & underflows
  const utcHour = hour - tzOffset;
  const localJsDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60) + minute, 0));
  
  const finalYear = localJsDate.getUTCFullYear();
  const finalMonth = localJsDate.getUTCMonth() + 1;
  const finalDay = localJsDate.getUTCDate();
  const finalHour = localJsDate.getUTCHours();
  const finalMinute = localJsDate.getUTCMinutes();

  // Compute Julian Dates in UTC
  const JD = getJulianDate(finalYear, finalMonth, finalDay, finalHour, finalMinute);
  const T = (JD - 2451545.0) / 36525.0; // Julian centuries since J2000
  
  // obliquity of ecliptic
  const epsilon = 23.439291 - 0.0130042 * T;
  const eps_rad = epsilon * Math.PI / 180;
  
  // Sidereal Time Calculations
  const gmst = (280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T) % 360;
  const lst = (gmst + longitude + 360) % 360;
  const lst_rad = lst * Math.PI / 180;
  const lat_rad = latitude * Math.PI / 180;
  
  // Midheaven (Meio do Céu - MC) Formula
  let MC = Math.atan2(Math.sin(lst_rad), Math.cos(lst_rad) * Math.cos(eps_rad)) * 180 / Math.PI;
  MC = (MC + 360) % 360;
  const IC = (MC + 180) % 360;
  
  // Ascendente (Asc) Formula
  let Asc = Math.atan2(Math.cos(lst_rad), -Math.sin(lst_rad) * Math.cos(eps_rad) - Math.tan(lat_rad) * Math.sin(eps_rad)) * 180 / Math.PI;
  Asc = (Asc + 360) % 360;
  const Desc = (Asc + 180) % 360;
  
  // Earth coordinates
  const earthCoords = getHeliocentricCoordinates("Earth", T);
  
  // Core planetary geocentric positions
  const rawPlacementsList = [
    { name: "Sol", long: calculateGeocentricLongitude("Sol", T, earthCoords), desc: "O SOL rege sua essência divina, seu brilho exterior e seu ego vital." },
    { name: "Lua", long: calculateMoonLongitude(T), desc: "A LUA coordena suas marés afetivas, reações subconscientes e memórias profundas." },
    { name: "Mercúrio", long: calculateGeocentricLongitude("Mercury", T, earthCoords), desc: "MERCÚRIO rege sua inteligência tática, seu raciocínio matemático e comunicação cotidiana." },
    { name: "Vênus", long: calculateGeocentricLongitude("Venus", T, earthCoords), desc: "VÊNUS espelha sua capacidade de partilha amorosa, estética refinada e abundância financeira." },
    { name: "Marte", long: calculateGeocentricLongitude("Mars", T, earthCoords), desc: "MARTE direciona toda a sua energia impulsionadora, sua coragem e combatividade instintiva." },
    { name: "Júpiter", long: calculateGeocentricLongitude("Jupiter", T, earthCoords), desc: "JÚPITER governa sua expansão pessoal, estudos avançados de sabedoria e golpes de sorte." },
    { name: "Saturno", long: calculateGeocentricLongitude("Saturn", T, earthCoords), desc: "SATURNO estabelece seus limites construtores, testes cármicos de maturidade e autoridade de tempo." },
    { name: "Urano", long: calculateGeocentricLongitude("Uranus", T, earthCoords), desc: "URANO evoca os seus relâmpagos de intuição idealizadora, rebeldia de vanguarda e inovações." },
    { name: "Netuno", long: calculateGeocentricLongitude("Neptune", T, earthCoords), desc: "NETUNO expande sua sensibilidade espiritual mística, criatividade sublime e empatia psíquica." },
    { name: "Plutão", long: calculateGeocentricLongitude("Pluto", T, earthCoords), desc: "PLUTÃO regenera seus poderes ocultos por meio de transmutação psicológica silenciosa." },
    { name: "Quíron", long: calculateGeocentricLongitude("Chiron", T, earthCoords), desc: "QUÍRON pontua suas feridas de alma em cura contínua e sua maestria de terapeuta interno." }
  ];
  
  // Calculated Mean Nodes and Lilith
  const northNodeLong = (125.0445 - 1934.1363 * T + 360) % 360;
  const southNodeLong = (northNodeLong + 180) % 360;
  const lilithLong = (176.6900 + 4069.0137 * T + 360) % 360;
  
  rawPlacementsList.push(
    { name: "Nodo Norte", long: northNodeLong, desc: "O NODO NORTE magnetiza sua bússola de evolução cármica futura nesta existência." },
    { name: "Nodo Sul", long: southNodeLong, desc: "O NODO SUL abriga as suas facilidades inatas e bagagens de vidas passadas confortáveis." },
    { name: "Lilith", long: lilithLong, desc: "LILITH (Lua Negra) revela seus desejos tabus indomados, repressões e forças brutas sagradas." }
  );
  
  // Structural points
  rawPlacementsList.push(
    { name: "Ascendente", long: Asc, desc: "O ASCENDENTE molda sua máscara de personalidade visível, sua vitalidade corporal e começos." },
    { name: "Descendente", long: Desc, desc: "O DESCENDENTE espelha o perfil de parcerias e conexões amorosas que curam sua alma." },
    { name: "Meio do Céu", long: MC, desc: "O MEIO DO CÉU direciona o ápice de sua vocação madura, reputação profissional e legado público." },
    { name: "Fundo do Céu", long: IC, desc: "O FUNDO DO CÉU sintoniza com as raízes de seu clã familiar, privacidade emocional e infância." }
  );
  
  // Mapping to final placements
  const astros: AstroPlacement[] = rawPlacementsList.map(item => {
    const info = getZodiacSignInfo(item.long);
    const minStr = info.minute.toString().padStart(2, "0");
    const dStr = `${info.degree}°${minStr}'`;
    return {
      name: item.name,
      sign: info.sign,
      degree: info.degree,
      minute: info.minute,
      longitude: item.long,
      extraInfo: `${dStr}, decanato ${Math.floor(info.degree / 10) + 1}º`,
      description: item.desc + ` Posicionado perfeitamente em ${info.sign} a uns exatos ${dStr} de arco celestial.`
    };
  });
  
  // Calculate Porphyry Quadrant Houses cusps
  // Quadrant 1 (MC H10 -> Asc H1): width is (Asc - MC) / 3
  const diffQ1 = (Asc - MC + 360) % 360;
  const stepQ1 = diffQ1 / 3;
  
  // Quadrant 2 (Asc H1 -> IC H4): width is (IC - Asc) / 3
  const diffQ2 = (IC - Asc + 360) % 360;
  const stepQ2 = diffQ2 / 3;
  
  const houseCusps: number[] = new Array(13); // 1-indexed for houses
  houseCusps[1] = Asc;
  houseCusps[2] = (Asc + stepQ2) % 360;
  houseCusps[3] = (Asc + 2 * stepQ2) % 360;
  houseCusps[4] = IC;
  houseCusps[5] = (IC + stepQ1) % 360;
  houseCusps[6] = (IC + 2 * stepQ1) % 360;
  houseCusps[7] = Desc;
  houseCusps[8] = (Desc + stepQ2) % 360;
  houseCusps[9] = (Desc + 2 * stepQ2) % 360;
  houseCusps[10] = MC;
  houseCusps[11] = (MC + stepQ1) % 360;
  houseCusps[12] = (MC + 2 * stepQ1) % 360;
  
  const houses: AstroHouseCusp[] = [];
  const houseLabels = [
    "", // index placeholder
    "Casa do Eu Sou: Personalidade, corpo e impacto inicial no mundo.",
    "Casa das Finanças: Recursos materiais, talentos utilitários e valores de vida.",
    "Casa da Mente: Pequenas viagens, comunicação, irmãos e ambiente local.",
    "Casa do Clã: Lar primordial, memórias profundas, base familiar e privacidade.",
    "Casa da Paixão: Criatividade brilhante, conquistas românticas, lazer e filhos.",
    "Casa da Rotina: Trabalho diário, vitalidade da saúde física e presteza organizada.",
    "Casa do Outro: Relações oficiais, amor espelhado, sociedades e contratos.",
    "Cass das Sombras: Grandes mistérios psíquicos, transmutação, heranças e intimidade.",
    "Casa do Saber: Filosofia de vida, viagens de longa distância e sabedorias excelsas.",
    "Casa da Carreira: Posição social máxima, prestígio laboral e o seu grande legado.",
    "Casa dos Ideais: Amigos sinceros, planejamentos coletivos e ativismo social amplo.",
    "Casa do Inconsciente: Limitações carmáticas, doação altruísta e santuário psíquico."
  ];
  
  for (let num = 1; num <= 12; num++) {
    const cusp = houseCusps[num];
    const nextCusp = houseCusps[num === 12 ? 1 : num + 1];
    const cuspInfo = getZodiacSignInfo(cusp);
    
    // Find planets present in this house
    const planetsInHouse: string[] = [];
    rawPlacementsList.forEach(ast => {
      // Avoid adding geometric points like Asc, Desc, MC, IC as planets inside houses
      if (["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(ast.name)) return;
      if (isLongBetween(ast.long, cusp, nextCusp)) {
        planetsInHouse.push(ast.name);
      }
    });
    
    houses.push({
      number: num,
      sign: cuspInfo.sign,
      longitude: cusp,
      planets: planetsInHouse,
      interpretation: `${houseLabels[num]} Cúspide posicionada em ${cuspInfo.sign} (${cuspInfo.degree}°${cuspInfo.minute.toString().padStart(2, "0")}')` + (
        planetsInHouse.length > 0 
          ? ` Planetas presentes ativando esta área: ${planetsInHouse.join(", ")}.` 
          : " Nossos astros celestes não ocupam esta casa diretamente, sendo regida de longe por seu respectivo regente planetário."
      )
    });
  }
  
  // Aspect calculations
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
  
  const aspects: AstroAspectDetails[] = [];
  
  for (let i = 0; i < rawPlacementsList.length; i++) {
    for (let j = i + 1; j < rawPlacementsList.length; j++) {
      const p1 = rawPlacementsList[i];
      const p2 = rawPlacementsList[j];
      
      // Skip aspecting structures with structures
      const p1IsStruct = ["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(p1.name);
      const p2IsStruct = ["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(p2.name);
      if (p1IsStruct && p2IsStruct) continue;
      
      const diff = Math.abs(p1.long - p2.long);
      const shortestDist = Math.min(diff, 360 - diff);
      
      for (const asp of aspectConfig) {
        const currentOrb = Math.abs(shortestDist - asp.angle);
        if (currentOrb <= asp.orb) {
          const intensity = Math.floor((1 - currentOrb / asp.orb) * 100);
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspectType: asp.name,
            angle: asp.angle,
            orb: `${currentOrb.toFixed(2)}°`,
            intensity,
            interpretation: `${p1.name} em ${asp.name} com ${p2.name}: ${asp.interpretation} Operando com intensidade magnética de ${intensity}% e orbe exata de ${currentOrb.toFixed(2)} graus.`
          });
        }
      }
    }
  }
  
  // Elements, Qualities, Polarization Distributions
  let fire = 0, earth = 0, air = 0, water = 0;
  let cardinal = 0, fixed = 0, mutable = 0;
  let yang = 0, yin = 0;
  
  // Calculate distribution based on Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto and Ascendant (the main 11 chart anchors)
  const chartAnchors = ["Sol", "Lua", "Mercúrio", "Vênus", "Marte", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão", "Ascendente"];
  astros.forEach(ast => {
    if (!chartAnchors.includes(ast.name)) return;
    const element = SIGN_ELEMENTS[ast.sign];
    const quality = SIGN_QUALITIES[ast.sign];
    const polarity = SIGN_POLARITIES[ast.sign];
    
    // Weigh Sun, Moon, Ascendant double (weight 2), other planets (weight 1)
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
  
  return {
    astros,
    houses,
    aspects,
    distribution: {
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
    }
  };
}

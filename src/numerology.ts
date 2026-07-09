import { NumerologyData } from "./types";

const PythagoreanGrid: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

function reduceNumber(num: number, keepMaster: boolean = true): number {
  while (num > 9) {
    if (keepMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num).split("").map(Number).reduce((sum, n) => sum + n, 0);
  }
  return num;
}

/**
 * Calculates Pythagorean numerology vectors based on Name and Birth Date.
 */
export function calculateNumerology(name: string, birthDate: string): any {
  // 1. Life Path (Caminho de Vida) - derived from Birth Date (YYYY-MM-DD)
  let year = 1990;
  let month = 1;
  let day = 1;

  if (birthDate.includes("-")) {
    const parts = birthDate.split("-");
    if (parts.length === 3) {
      year = parseInt(parts[0], 10) || 1990;
      month = parseInt(parts[1], 10) || 1;
      day = parseInt(parts[2], 10) || 1;
    }
  } else if (birthDate.includes("/")) {
    const parts = birthDate.split("/");
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        year = parseInt(parts[2], 10) || 1990;
        month = parseInt(parts[1], 10) || 1;
        day = parseInt(parts[0], 10) || 1;
      } else {
        year = parseInt(parts[0], 10) || 1990;
        month = parseInt(parts[1], 10) || 1;
        day = parseInt(parts[2], 10) || 1;
      }
    }
  } else {
    const dateStr = birthDate.replace(/[^0-9]/g, "");
    if (dateStr.length === 8) {
      year = parseInt(dateStr.substring(0, 4), 10) || 1990;
      month = parseInt(dateStr.substring(4, 6), 10) || 1;
      day = parseInt(dateStr.substring(6, 8), 10) || 1;
    }
  }

  const redYear = reduceNumber(year, true);
  const redMonth = reduceNumber(month, true);
  const redDay = reduceNumber(day, true);

  const birthSum = reduceNumber(redYear + redMonth + redDay, true);

  // Sanitize name for letter calculations
  const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");

  let expressionSum = 0;
  let vowelsSum = 0;
  let consonantsSum = 0;

  for (const char of cleanName) {
    const val = PythagoreanGrid[char];
    if (val) {
      expressionSum += val;
      if (["a", "e", "i", "o", "u"].includes(char)) {
        vowelsSum += val;
      } else {
        consonantsSum += val;
      }
    }
  }

  const expression = reduceNumber(expressionSum || 1, true);
  const soulUrge = reduceNumber(vowelsSum || 1, true);
  const personality = reduceNumber(consonantsSum || 1, true);
  
  // Destiny is a synthesis of Expression and Life Path
  const destiny = reduceNumber(expression + birthSum, true);

  const caminhoDeVida = birthSum || 1;
  const expressao = expression || 3;
  const motivacao = soulUrge || 5;
  const personalidade = personality || 7;

  return {
    // NumerologyData fields
    lifePath: caminhoDeVida,
    expression: expressao,
    soulUrge: motivacao,
    personality: personalidade,
    destiny: destiny || 9,
    // NumerologyCycle fields
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

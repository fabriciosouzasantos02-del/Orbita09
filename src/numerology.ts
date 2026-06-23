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
export function calculateNumerology(name: string, birthDate: string): NumerologyData {
  // 1. Life Path (Caminho de Vida) - derived from Birth Date (YYYY-MM-DD)
  const dateStr = birthDate.replace(/[^0-9]/g, "");
  let birthSum = 0;
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6));
    const day = parseInt(dateStr.substring(6, 8));

    const redYear = reduceNumber(year, true);
    const redMonth = reduceNumber(month, true);
    const redDay = reduceNumber(day, true);

    birthSum = reduceNumber(redYear + redMonth + redDay, true);
  } else {
    birthSum = 1; // Fallback
  }

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

  return {
    lifePath: birthSum || 1,
    expression: expression || 3,
    soulUrge: soulUrge || 5,
    personality: personality || 7,
    destiny: destiny || 9
  };
}

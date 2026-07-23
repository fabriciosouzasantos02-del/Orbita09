import { performAstroCalculation } from './src/components/astroMath';

function getRisingSign(dateStr: string, timeStr: string): string {
  if (!dateStr) return "Sagitário";
  const date = new Date(dateStr + "T00:00:00");
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let hour = 12;
  let minute = 0;
  if (timeStr && timeStr.includes(':')) {
    const parts = timeStr.split(':');
    hour = parseInt(parts[0], 10) || 12;
    minute = parseInt(parts[1], 10) || 0;
  }
  
  const daysSinceMarch21 = (month * 30 + day - 80 + 360) % 360;
  const raSun = (daysSinceMarch21 / 360) * 24;
  
  const timeSinceNoon = hour + (minute / 60) - 12;
  const lst = (raSun + timeSinceNoon + 24) % 24;
  
  const signs = [
    "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", 
    "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
  ];
  
  const index = Math.floor((lst + 16.5) % 24 / 2) % 12;
  return signs[index];
}

console.log("getRisingSign('', ''):", getRisingSign('', ''));
console.log("getRisingSign('1990-10-10', '10:00'):", getRisingSign('1990-10-10', '10:00'));
console.log("getRisingSign('invalid-date', 'invalid-time'):", getRisingSign('invalid-date', 'invalid-time'));

const test1 = performAstroCalculation("1990-10-10", "10:00", -23.5505, -46.6333, -3);
console.log("SP 1990-10-10 10:00 ASTROS:", test1.astros.map(a => `${a.name}: ${a.sign} ${a.degree}°`));

const test2 = performAstroCalculation("1995-03-20", "18:30", -23.5505, -46.6333, -3);
console.log("SP 1995-03-20 18:30 ASTROS:", test2.astros.map(a => `${a.name}: ${a.sign} ${a.degree}°`));


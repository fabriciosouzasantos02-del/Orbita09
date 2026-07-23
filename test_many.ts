import { performAstroCalculation } from './src/components/astroMath';

const dates = ["1990-10-10", "1985-05-15", "2000-01-01", "1978-12-25", "1993-07-04", "1997-02-11"];
const times = ["08:00", "12:00", "18:30", "23:45", "03:15", "15:00"];
const locations = [
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "New York", lat: 40.7128, lng: -74.0060 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 }
];

console.log("=== STARTING ASTRO AUDIT ===");
const distribution: Record<string, number> = {};

for (const d of dates) {
  for (const t of times) {
    for (const loc of locations) {
      try {
        const chart = performAstroCalculation(d, t, loc.lat, loc.lng);
        const asc = chart.astros.find(a => a.name === "Ascendente")?.sign || "Unknown";
        distribution[asc] = (distribution[asc] || 0) + 1;
      } catch (err: any) {
        console.error(`Error for ${d} ${t}:`, err.message);
      }
    }
  }
}

console.log("Ascendant distribution across 144 test combinations:");
console.log(distribution);

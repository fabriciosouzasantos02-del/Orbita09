import * as fs from 'fs';
import * as path from 'path';

const serverFile = path.resolve(process.cwd(), 'server.ts');
const content = fs.readFileSync(serverFile, 'utf8');
const lines = content.split('\n');

const endpoints = [
  { name: '/api/compatibility/evaluate', start: 1710, end: 1800 },
  { name: '/api/oraculo/query', start: 1840, end: 1950 },
  { name: '/api/astrology/transits-month', start: 2150, end: 2250 },
  { name: '/api/astrology/moon-tip', start: 2270, end: 2360 },
  { name: '/api/astrology/rare-notifications', start: 2610, end: 2720 },
  { name: '/api/astrology/daily-missions', start: 3160, end: 3260 },
  { name: '/api/osiris/chat', start: 3320, end: 3410 },
  { name: '/api/osiris/dashboard', start: 3810, end: 3910 },
  { name: '/api/conselheira/chat', start: 3950, end: 4050 },
  { name: '/api/tarot/draw', start: 4210, end: 4290 },
  { name: '/api/tarot/interpret', start: 4580, end: 4660 }
];

endpoints.forEach(ep => {
  console.log(`\n=========================================`);
  console.log(`Analyzing: ${ep.name}`);
  console.log(`=========================================`);
  
  // Find lines in the specified range
  const subset = lines.slice(ep.start - 1, ep.end);
  const subsetContent = subset.join('\n');
  
  const hasLang = subsetContent.includes('lang');
  const hasTargetLanguage = subsetContent.includes('targetLanguage') || subsetContent.includes('targetLang') || subsetContent.includes('activeLang');
  
  console.log(`Accepts 'lang': ${hasLang}`);
  console.log(`Uses target language in prompt: ${hasTargetLanguage}`);
  
  // Print lines that contain lang, targetLanguage, or activeLang
  subset.forEach((line, i) => {
    const realLineNum = ep.start + i;
    if (line.includes('lang') || line.includes('target') || line.includes('activeLang') || line.includes('Language')) {
      console.log(`Line ${realLineNum}: ${line.trim()}`);
    }
  });
});

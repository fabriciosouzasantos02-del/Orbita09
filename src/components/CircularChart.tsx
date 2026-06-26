import React from 'react';
import { AstroAstroPosition } from '../types';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';

interface CircularChartProps {
  astros: AstroAstroPosition[];
}

// Zodiac signs and their degree offsets in the 360 wheel
const ZODIAC_SIGNS = [
  { name: "Áries", symbol: "♈", element: "fire" },
  { name: "Touro", symbol: "♉", element: "earth" },
  { name: "Gêmeos", symbol: "♊", element: "air" },
  { name: "Câncer", symbol: "♋", element: "water" },
  { name: "Leão", symbol: "♌", element: "fire" },
  { name: "Virgem", symbol: "♍", element: "earth" },
  { name: "Libra", symbol: "♎", element: "air" },
  { name: "Escorpião", symbol: "♏", element: "water" },
  { name: "Sagitário", symbol: "♐", element: "fire" },
  { name: "Capricórnio", symbol: "♑", element: "earth" },
  { name: "Aquário", symbol: "♒", element: "air" },
  { name: "Peixes", symbol: "♓", element: "water" }
];

export default function CircularChart({ astros }: CircularChartProps) {
  const { t: i18nT, i18n } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (i18n.language as Language) || 'pt');
    }
    return res;
  };

  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 20;
  const innerRadius1 = radius - 30;
  const innerRadius2 = innerRadius1 - 25;
  const innerRadius3 = innerRadius2 - 40;

  // Render sign sectors on wheel
  const getCoordinatesForPercent = (percent: number, r: number) => {
    const x = center + r * Math.cos(2 * Math.PI * percent);
    const y = center + r * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div id="astrological-chart-wheel" className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/70 border border-amber-500/20 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none" />
      <div className="relative w-full max-w-[320px] aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none rotate-[-90deg]">
          {/* Base Background Circles */}
          <circle cx={center} cy={center} r={radius} className="fill-slate-950 stroke-amber-500/30" strokeWidth="2" />
          <circle cx={center} cy={center} r={innerRadius1} className="fill-transparent stroke-rose-500/20" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={center} cy={center} r={innerRadius2} className="fill-slate-900/40 stroke-amber-500/10" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={innerRadius3} className="fill-slate-950 stroke-amber-500/30" strokeWidth="1" />

          {/* Draw Sign segments radiating out */}
          {ZODIAC_SIGNS.map((sign, idx) => {
            const startPercent = idx / 12;
            const endPercent = (idx + 1) / 12;
            const midPercent = (idx + 0.5) / 12;

            const [x1, y1] = getCoordinatesForPercent(startPercent, radius);
            const [x2, y2] = getCoordinatesForPercent(startPercent, innerRadius2);
            
            const [labelX, labelY] = getCoordinatesForPercent(midPercent, radius - 15);

            // Determine element text color
            let color = "fill-amber-500";
            if (sign.element === "fire") color = "fill-rose-400";
            else if (sign.element === "earth") color = "fill-emerald-400";
            else if (sign.element === "air") color = "fill-sky-400";
            else if (sign.element === "water") color = "fill-indigo-400";

            return (
              <g key={sign.name}>
                {/* Sector line */}
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-amber-500/20" strokeWidth="1" />
                {/* Glyph Label */}
                <text
                  x={labelX}
                  y={labelY}
                  transform={`rotate(90, ${labelX}, ${labelY})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`${color} text-xs font-bold font-sans cursor-pointer`}
                >
                  {sign.symbol}
                </text>
              </g>
            );
          })}

          {/* Aspect Lines (connecting core chart indicators) */}
          <path
            d={`M ${center + innerRadius3 * Math.cos(2*Math.PI*22/360)} ${center + innerRadius3 * Math.sin(2*Math.PI*22/360)} L ${center + innerRadius3 * Math.cos(2*Math.PI*102/360)} ${center + innerRadius3 * Math.sin(2*Math.PI*102/360)}`}
            className="stroke-amber-400/50 fill-none"
            strokeWidth="1.5"
          />
          <path
            d={`M ${center + innerRadius3 * Math.cos(2*Math.PI*45/360)} ${center + innerRadius3 * Math.sin(2*Math.PI*45/360)} L ${center + innerRadius3 * Math.cos(2*Math.PI*225/360)} ${center + innerRadius3 * Math.sin(2*Math.PI*225/360)}`}
            className="stroke-rose-500/40 fill-none"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path
            d={`M ${center + innerRadius3 * Math.cos(2*Math.PI*140/360)} ${center + innerRadius3 * Math.sin(2*Math.PI*140/360)} L ${center + innerRadius3 * Math.cos(2*Math.PI*290/360)} ${center + innerRadius3 * Math.sin(2*Math.PI*290/360)}`}
            className="stroke-indigo-400/40 fill-none"
            strokeWidth="1.2"
          />

          {/* Planet Placement Dots & Glyphs dynamically labeled around outer ring */}
          {astros && Array.isArray(astros) && astros.map((ast, i) => {
            if (!ast || !ast.name || !ast.sign) {
              console.warn("[CircularChart] Registro de astro inválido ou herança vazia:", ast);
              return null;
            }
            // Find sign match to align correctly
            const signIndex = ZODIAC_SIGNS.findIndex(s => s.name === ast.sign);
            if (signIndex === -1) {
              console.warn(`[CircularChart] Astro ${ast.name} com signo inválido ou não mapeado: ${ast.sign}`);
              return null;
            }

            let deg = 15;
            try {
              if (typeof ast.degree === 'number') {
                deg = Math.floor(ast.degree);
              } else if (ast.degree !== undefined && ast.degree !== null) {
                const matchDeg = String(ast.degree).match(/^\d+/);
                deg = matchDeg ? parseInt(matchDeg[0], 10) : 15;
              }
            } catch (err) {
              console.error(`[CircularChart] Falha crítica de parser para astro ${ast.name} com graus ${ast.degree}:`, err);
            }

            // Angle placement calculation
            const angleVal = (signIndex * 30) + deg;
            const percent = angleVal / 360;

            const [px, py] = getCoordinatesForPercent(percent, innerRadius2 - 12);
            const [lx, ly] = getCoordinatesForPercent(percent, innerRadius2 - 25);

            // Give distinct color to planets
            let cColor = "fill-amber-300";
            if (ast.name === "Sol") cColor = "fill-yellow-400";
            else if (ast.name === "Lua") cColor = "fill-slate-100";
            else if (ast.name === "Ascendente") cColor = "fill-cyan-400 font-bold";

             return (
              <g key={ast.name} className="cursor-pointer group">
                <circle cx={px} cy={py} r="3" className={`stroke-slate-950 ${cColor}`} strokeWidth="1" />
                <text
                  x={lx}
                  y={ly}
                  transform={`rotate(90, ${lx}, ${ly})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[8px] font-mono leading-none ${cColor}`}
                >
                  {t(ast.name).slice(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}

          <circle cx={center} cy={center} r="6" className="fill-slate-950 stroke-amber-500/80" strokeWidth="2" />
          <circle cx={center} cy={center} r="2" className="fill-amber-500" />
        </svg>
      </div>

      <div className="flex gap-4 mt-2 justify-center flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>{t("Fogo")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t("Terra")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-sky-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>{t("Ar")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>{t("Água")}</span>
        </div>
      </div>
    </div>
  );
}

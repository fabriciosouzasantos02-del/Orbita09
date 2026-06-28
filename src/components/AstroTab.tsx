import React, { useState } from "react";
import { Sparkles, Star, Compass, AlertCircle, RefreshCw, FileText, Globe } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "../translations";
import { NatalChartData, UserProfile } from "../types";
import { useTranslation } from "react-i18next";

interface AstroTabProps {
  userProfile: UserProfile;
  natalChart: NatalChartData;
  lang: Language;
}

export default function AstroTab({ userProfile, natalChart, lang }: AstroTabProps) {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorWord, setErrorWord] = useState<string>("");
  const t = translations[lang];
  const { t: tI18n } = useTranslation();

  const handleGenerateReport = async () => {
    setLoading(true);
    setErrorWord("");
    try {
      const response = await fetch("/api/natal/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userProfile.name,
          birthDate: userProfile.birthDetails.birthDate,
          birthTime: userProfile.birthDetails.birthTime,
          birthCity: userProfile.birthDetails.birthCity,
          chart: natalChart,
          lang,
        }),
      });
      const data = await response.json();
      setReport(data.interpretation || tI18n("Falha ao receber insights."));
    } catch (err: any) {
      setErrorWord(tI18n("Erro ao processar trânsito Celeste natal:") + " " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Safe markdown and tag parser to format AI answers nicely
  const renderFormattedReport = (rawText: string) => {
    if (!rawText) return null;
    return rawText.split("\n").map((line, index) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith("###")) {
        return (
          <h4 key={index} className="text-sm font-bold text-indigo-900 mt-4 mb-2 font-display uppercase tracking-wider">
            {cleanLine.replace("###", "").trim()}
          </h4>
        );
      } else if (cleanLine.startsWith("##")) {
        return (
          <h3 key={index} className="text-base font-bold text-neutral-900 mt-5 mb-2 font-display border-b border-indigo-100 pb-1">
            {cleanLine.replace("##", "").trim()}
          </h3>
        );
      } else if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        // Simple bold parsing inside bullets
        const parts = cleanLine.substring(1).trim().split("**");
        return (
          <li key={index} className="ml-4 list-disc text-xs text-neutral-600 mb-1.5 leading-relaxed">
            {parts.map((p, pidx) => (pidx % 2 === 1 ? <strong key={pidx} className="text-neutral-850 font-bold">{p}</strong> : p))}
          </li>
        );
      } else if (cleanLine) {
        // General text formatting for bold
        const parts = cleanLine.split("**");
        return (
          <p key={index} className="text-xs sm:text-sm text-neutral-600 mb-3 leading-relaxed">
            {parts.map((p, pidx) => (pidx % 2 === 1 ? <strong key={pidx} className="text-neutral-850 font-bold">{p}</strong> : p))}
          </p>
        );
      }
      return <div key={index} className="h-2" />;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Intro descriptor */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-900/10 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h2 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-indigo-400" />
            <span>{t.natalChart}</span>
          </h2>
          <p className="text-indigo-200/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {t.natalDescription}
          </p>
        </div>
        
        {/* Abstract vector decor representing lines */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Grid: Astronomical Coordinates Table */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{tI18n("Planetas e Luminares")}</h3>
            <Star className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="divide-y divide-neutral-100 max-h-[440px] overflow-y-auto pr-1">
            {natalChart.planets.map((planet) => {
              // Map planetary icons
              const icons: Record<string, string> = {
                Sol: "☀️", Lua: "🌙", Mercúrio: "🧪", Vênus: "🌸", Marte: "🔥",
                Júpiter: "⚡", Saturno: "🪐", Urano: "🌀", Netuno: "🔱", Plutão: "🗝️", Quíron: "🌿"
              };
              return (
                <div key={planet.name} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-6 h-6 flex items-center justify-center bg-neutral-50 rounded-lg select-all">
                      {icons[planet.name] || "⭐"}
                    </span>
                    <div>
                      <span className="font-semibold text-neutral-800">{tI18n(planet.name)}</span>
                      {planet.isRetrograde && (
                        <span className="ml-2 px-1 py-0.5 bg-amber-50 text-amber-700 font-bold text-[9px] rounded uppercase tracking-wider">
                          {tI18n("Rx")}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-medium text-neutral-500">
                      {planet.degree}° {tI18n(planet.sign)}
                    </span>
                    <span className="block text-[10px] text-neutral-400 font-medium">
                      {tI18n("Casa")} {planet.house}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Grid: Active Aspects list & House Cusps */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-6 space-y-6">
          
          {/* Active Aspects card list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t.aspectsList}</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                {natalChart.aspects.length} {tI18n("Aspectos")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {natalChart.aspects.map((aspect, idx) => {
                const colorMapByAspect: Record<string, string> = {
                  Conjunção: "bg-indigo-50 text-indigo-700 border-indigo-100",
                  Oposição: "bg-rose-50 text-rose-700 border-rose-100",
                  Quadratura: "bg-amber-50 text-amber-700 border-amber-100",
                  Trígono: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  Sextil: "bg-sky-50 text-sky-700 border-sky-100"
                };
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                      colorMapByAspect[aspect.type] || "bg-neutral-50 text-neutral-600"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1">
                      <span>{tI18n(aspect.planet1)}</span>
                      <span className="font-normal text-[10px] text-neutral-400">({tI18n(aspect.type)})</span>
                      <span>{tI18n(aspect.planet2)}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-medium mt-1">
                      {tI18n("Distância")}: {aspect.angle}° ({tI18n("orbe")}: {aspect.orb}°)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* House System list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t.houseSystem}</h3>
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs">
              {natalChart.houses.slice(0, 12).map((house) => (
                <div key={house.house} className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                  <span className="block text-neutral-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">{tI18n("Casa")} {house.house}</span>
                  <span className="font-semibold text-neutral-800">{tI18n(house.sign)}</span>
                  <span className="block text-[10px] text-neutral-400">{house.degree}°</span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>

      {/* Complete AI Natal Interpretation card panel */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-neutral-900 text-base">{t.deepReport}</h3>
            <p className="text-neutral-500 text-xs">
              {tI18n("Uma imersão literária no seu design existencial analisado pelo Google Gemini AI.")}
            </p>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] shadow"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{t.interpreting}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>{t.generateDeepInterpretation}</span>
              </>
            )}
          </button>
        </div>

        {/* Interpretations body */}
        <div className="bg-neutral-50 rounded-2xl border border-neutral-150 p-5 sm:p-6 min-h-32">
          {report ? (
            <div className="prose prose-sm max-w-none text-neutral-800">
              {renderFormattedReport(report)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400 space-y-2">
              <FileText className="w-10 h-10 text-neutral-300 stroke-[1.5]" />
              <p className="text-xs max-w-sm">
                {tI18n("Nenhum relatório de Inteligência Artificial gerado para esta sessão ainda. Clique no botão acima para sintonizar.")}
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

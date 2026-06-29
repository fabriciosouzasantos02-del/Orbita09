import React, { useState } from "react";
import { Zap, Calendar, Shuffle, CloudSun, AlertTriangle, Eye } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "../translations";
import { NatalChartData } from "../types";
import { useTranslation } from "react-i18next";
import { translateUiText } from "../lib/translations";

interface TransitsTabProps {
  natalChart: NatalChartData;
  lang: Language;
}

export default function TransitsTab({ natalChart, lang }: TransitsTabProps) {
  const t = translations[lang];
  const { t: tI18nRaw } = useTranslation();

  const localTranslations: Record<string, Record<string, string>> = {
    en: {
      "Monitor em Tempo Real": "Real-Time Monitor",
      "Seus Trânsitos Horários e Energias do Dia": "Your Hourly Transits and Daily Energies",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Analysis of how planets float over your natal birth chart.",
      "Sincronizado: Hoje": "Synchronized: Today",
      "Planetas Transitando no Céu": "Planets Transiting in the Sky",
      "em": "in",
      "Pontuações Celestes Planas": "Planar Celestial Scores",
      "Criatividade e Alinhamento": "Creativity and Alignment",
      "Diálogo e Escrita": "Dialogue and Writing",
      "Vontade Física e Esporte": "Physical Will and Sports",
      "Dica do Oráculo:": "Oracle Tip:",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Today the solar flow favors structural review. Excellent period to finish writings and practice internalization without harmful external pressure."
    },
    es: {
      "Monitor em Tempo Real": "Monitor en Tiempo Real",
      "Seus Trânsitos Horários e Energias do Dia": "Tus Tránsitos Horarios y Energías del Día",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Análisis de cómo flotan los planetas sobre tu composición natal de nacimiento.",
      "Sincronizado: Hoje": "Sincronizado: Hoy",
      "Planetas Transitando no Céu": "Planetas Transitando en el Cielo",
      "em": "en",
      "Pontuações Celestes Planas": "Puntajes Celestes Planos",
      "Criatividade e Alinhamento": "Creatividad y Alineación",
      "Diálogo e Escrita": "Diálogo y Escritura",
      "Vontade Física e Esporte": "Voluntad Física y Deporte",
      "Dica do Oráculo:": "Consejo del Oráculo:",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Hoy el flujo solar favorece la revisión estructural. Excelente periodo para finalizar escritos y practicar la interiorización sin presiones externas dañinas."
    },
    de: {
      "Monitor em Tempo Real": "Echtzeit-Monitor",
      "Seus Trânsitos Horários e Energias do Dia": "Deine stündlichen Transite und Tagesenergien",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Analyse, wie die Planeten über Ihre Geburtsradix gleiten.",
      "Sincronizado: Hoje": "Synchronisiert: Heute",
      "Planetas Transitando no Céu": "Transitierende Planeten am Himmel",
      "em": "in",
      "Pontuações Celestes Planas": "Flache himmlische Werte",
      "Criatividade e Alinhamento": "Kreativität und Ausrichtung",
      "Diálogo e Escrita": "Dialog und Schreiben",
      "Vontade Física e Esporte": "Physischer Wille und Sport",
      "Dica do Oráculo:": "Orakel-Tipp:",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Heute begünstigt der solare Fluss die strukturelle Überprüfung. Hervorragende Zeit, um Schriften fertigzustellen und Verinnerlichung ohne schädlichen äußeren Druck zu praktizieren."
    },
    fr: {
      "Monitor em Tempo Real": "Moniteur en Temps Réel",
      "Seus Trânsitos Horários e Energias do Dia": "Vos Transits Horaires et Énergies du Jour",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Analyse de la façon dont les planètes transitent sur votre thème natal de naissance.",
      "Sincronizado: Hoje": "Synchronisé : Aujourd'hui",
      "Planetas Transitando no Céu": "Planètes en Transit dans le Ciel",
      "em": "en",
      "Pontuações Celestes Planas": "Scores Célestes Plans",
      "Criatividade e Alinhamento": "Créativité et Alignement",
      "Diálogo e Escrita": "Dialogue et Écriture",
      "Vontade Física e Esporte": "Volonté Physique et Sport",
      "Dica do Oráculo:": "Conseil de l'Oracle :",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Aujourd'hui, le flux solaire favorise la révision structurelle. Excellente période pour finaliser les écrits et pratiquer l'intériorisation sans pressions extérieures néfastes."
    }
  };

  const tI18n = (text: string) => {
    if (!text) return "";
    
    const targetLang = lang || 'pt';
    if (targetLang !== 'pt' && localTranslations[targetLang] && localTranslations[targetLang][text]) {
      return localTranslations[targetLang][text];
    }

    const res = tI18nRaw(text);
    if (res === text || !res) {
      return translateUiText(text, targetLang);
    }
    return res;
  };

  // Mock list of current transits of this day (moving planets)
  const localizedTransits: Record<string, Array<{ planet: string; sign: string; status: string; influence: string; isRetrograde?: boolean }>> = {
    pt: [
      { planet: "Mercúrio", sign: "Câncer", status: "Direto", influence: "Comunicação focada no acolhimento e escuta íntima." },
      { planet: "Vênus", sign: "Escorpião", status: "Direto", influence: "Período de afetos passionais, profundos e magnetismo elevado." },
      { planet: "Marte", sign: "Leão", status: "Direto", influence: "Ações corajosas, nobres e generosidade competitiva acentuada." },
      { planet: "Júpiter", sign: "Gêmeos", status: "Retrógrado", influence: "Reavaliação interna de ideias e estudos acumulados.", isRetrograde: true },
      { planet: "Saturno", sign: "Peixes", status: "Direto", influence: "Estruturação de limites e responsabilidades espirituais profundas." }
    ],
    en: [
      { planet: "Mercúrio", sign: "Câncer", status: "Direct", influence: "Communication focused on welcoming and intimate listening." },
      { planet: "Vênus", sign: "Escorpião", status: "Direct", influence: "Period of passionate, deep affection and elevated magnetism." },
      { planet: "Marte", sign: "Leão", status: "Direct", influence: "Courageous, noble actions and sharp competitive generosity." },
      { planet: "Júpiter", sign: "Gêmeos", status: "Retrograde", influence: "Internal reevaluation of ideas and accumulated studies.", isRetrograde: true },
      { planet: "Saturno", sign: "Peixes", status: "Direct", influence: "Structuring of limits and deep spiritual responsibilities." }
    ],
    es: [
      { planet: "Mercúrio", sign: "Câncer", status: "Directo", influence: "Comunicación enfocada en la acogida y la escuche íntima." },
      { planet: "Vênus", sign: "Escorpião", status: "Directo", influence: "Periodo de afectos pasionales, profundos y magnetismo elevado." },
      { planet: "Marte", sign: "Leão", status: "Directo", influence: "Acciones valientes, nobles y generosidad competitiva acentuada." },
      { planet: "Júpiter", sign: "Gêmeos", status: "Retrógrado", influence: "Reevaluación interna de ideas y estudios acumulados.", isRetrograde: true },
      { planet: "Saturno", sign: "Peixes", status: "Directo", influence: "Estructuración de límites y profundas responsabilidades espirituales." }
    ],
    de: [
      { planet: "Mercúrio", sign: "Câncer", status: "Direkt", influence: "Kommunikation konzentriert auf Aufnahme und intimes Zuhören." },
      { planet: "Vênus", sign: "Escorpião", status: "Direkt", influence: "Zeit leidenschaftlicher, tiefer Zuneigung und erhöhter Anziehungskraft." },
      { planet: "Marte", sign: "Leão", status: "Direkt", influence: "Mutige, edle Taten und ausgeprägte wettbewerbsorientierte Großzügigkeit." },
      { planet: "Júpiter", sign: "Gêmeos", status: "Rückläufig", influence: "Innere Neubewertung von Ideen und gesammelten Studien.", isRetrograde: true },
      { planet: "Saturno", sign: "Peixes", status: "Direkt", influence: "Strukturierung von Grenzen und tiefen spirituellen Pflichten." }
    ],
    fr: [
      { planet: "Mercúrio", sign: "Câncer", status: "Direct", influence: "Communication axée sur l'accueil et l'écoute intime." },
      { planet: "Vênus", sign: "Escorpião", status: "Direct", influence: "Période d'affections passionnées, profondes et de magnétisme élevé." },
      { planet: "Marte", sign: "Leão", status: "Direct", influence: "Actions courageuses, nobles et générosité compétitive accentuée." },
      { planet: "Júpiter", sign: "Gêmeos", status: "Rétrograde", influence: "Réévaluation interne des idées et des études accumulées.", isRetrograde: true },
      { planet: "Saturno", sign: "Peixes", status: "Direct", influence: "Structuration des limites et des responsabilités spirituelles profondes." }
    ]
  };

  const currentTransits = localizedTransits[lang] || localizedTransits['pt'];

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{tI18n("Monitor em Tempo Real")}</span>
          <h2 className="text-xl font-display font-semibold text-neutral-900 leading-tight">
            {tI18n("Seus Trânsitos Horários e Energias do Dia")}
          </h2>
          <p className="text-neutral-500 text-xs">
            {tI18n("Análise de como os planetas flutuam sobre sua composição natal de nascimento.")}
          </p>
        </div>
        
        <div className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center gap-2 text-xs text-neutral-500">
          <Calendar className="w-4 h-4 text-neutral-450" />
          <span>{tI18n("Sincronizado: Hoje")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Dynamic sky transit card list */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{tI18n("Planetas Transitando no Céu")}</h3>
            <CloudSun className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {currentTransits.map((transit) => (
              <div
                key={transit.planet}
                className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row gap-3 justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-850 text-sm">{tI18n(transit.planet)}</span>
                    <span className="text-xs text-neutral-450">{tI18n("em")}</span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-semibold rounded">
                      {tI18n(transit.sign)}
                    </span>
                    {transit.isRetrograde && (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[9px] rounded uppercase tracking-wider flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>Rx</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    {tI18n(transit.influence)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Natal Aspect Impact Widget */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{tI18n("Pontuações Celestes Planas")}</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-4 py-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-1">
                <span>{tI18n("Criatividade e Alinhamento")}</span>
                <span>85%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-1">
                <span>{tI18n("Diálogo e Escrita")}</span>
                <span>90%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "90%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-1">
                <span>{tI18n("Vontade Física e Esporte")}</span>
                <span>55%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: "55%" }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-55 bg-indigo-50/20 rounded-xl border border-indigo-150/50 text-[11px] text-indigo-850 leading-relaxed">
            <strong>{tI18n("Dica do Oráculo:")}</strong> {tI18n("Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.")}
          </div>
        </section>

      </div>
    </div>
  );
}

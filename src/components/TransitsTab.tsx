import React, { useState } from "react";
import { Zap, Calendar, Shuffle, CloudSun, AlertTriangle, Eye } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "../translations";
import { NatalChartData } from "../types";

interface TransitsTabProps {
  natalChart: NatalChartData;
  lang: Language;
}

export default function TransitsTab({ natalChart, lang }: TransitsTabProps) {
  const t = translations[lang];

  // Mock list of current transits of this day (moving planets)
  const currentTransits = [
    { planet: "Mercúrio", sign: "Câncer", status: "Direto", influence: "Comunicação focada no acolhimento e escuta íntima." },
    { planet: "Vênus", sign: "Escorpião", status: "Direto", influence: "Período de afetos passionais, profundos e magnetismo elevado." },
    { planet: "Marte", sign: "Leão", status: "Direto", influence: "Ações corajosas, nobres e generosidade competitiva acentuada." },
    { planet: "Júpiter", sign: "Gêmeos", status: "Retrógrado", influence: "Reavaliação interna de ideias e estudos acumulados.", isRetrograde: true },
    { planet: "Saturno", sign: "Peixes", status: "Direto", influence: "Estruturação de limites e responsabilidades espirituais profundas." }
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Monitor em Tempo Real</span>
          <h2 className="text-xl font-display font-semibold text-neutral-900 leading-tight">
            Seus Trânsitos Horários e Energias do Dia
          </h2>
          <p className="text-neutral-500 text-xs">
            Análise de como os planetas flutuam sobre sua composição natal de nascimento.
          </p>
        </div>
        
        <div className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center gap-2 text-xs text-neutral-500">
          <Calendar className="w-4 h-4 text-neutral-450" />
          <span>Sincronizado: Hoje</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Dynamic sky transit card list */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Planetas Transitando no Céu</h3>
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
                    <span className="font-semibold text-neutral-850 text-sm">{transit.planet}</span>
                    <span className="text-xs text-neutral-450">em</span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-semibold rounded">
                      {transit.sign}
                    </span>
                    {transit.isRetrograde && (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[9px] rounded uppercase tracking-wider flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>Rx</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    {transit.influence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Natal Aspect Impact Widget */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pontuações Celestes Planas</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-4 py-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-1">
                <span>Criatividade e Alinhamento</span>
                <span>85%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-1">
                <span>Diálogo e Escrita</span>
                <span>90%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "90%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-800 mb-1">
                <span>Vontade Física e Esporte</span>
                <span>55%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: "55%" }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-55 bg-indigo-50/20 rounded-xl border border-indigo-150/50 text-[11px] text-indigo-850 leading-relaxed">
            <strong>Dica do Oráculo:</strong> Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.
          </div>
        </section>

      </div>
    </div>
  );
}

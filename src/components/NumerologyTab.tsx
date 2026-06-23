import React from "react";
import { Layers, HelpCircle, Palette, Binary, ArrowUpRight } from "lucide-react";
import { Language, translations } from "../translations";
import { NumerologyData } from "../types";

interface NumerologyTabProps {
  numerologyData: NumerologyData;
  lang: Language;
}

export default function NumerologyTab({ numerologyData, lang }: NumerologyTabProps) {
  const t = translations[lang];

  // In depth Pythagorean descriptions for numbers 1-9, plus master numbers 11, 22, 33
  const numbersDictionary: Record<number, { title: string; keyword: string; desc: string }> = {
    1: {
      title: "O Pioneiro e Líder",
      keyword: "Independência, Iniciativa, Ambição",
      desc: "Indica originalidade, coragem e o instinto de liderança cósmica primária. Representa o início de novas ideias."
    },
    2: {
      title: "O Diplomata e Pacificador",
      keyword: "Harmonia, Cooperação, Sensibilidade",
      desc: "Excelente capacidade para mediar conflitos, buscar o equilíbrio, expressar sentimentos e harmonizar ambientes."
    },
    3: {
      title: "O Artista e Comunicador",
      keyword: "Criatividade, Sociabilidade, Alegria",
      desc: "Dotado de magnetismo e facilidade para as artes e oratória. Tem a missão de energizar os caminhos sociais alheios."
    },
    4: {
      title: "O Construtor e Organizador",
      keyword: "Estabilidade, Trabalho Duro, Ordem",
      desc: "Representa a solidez e os aspectos práticos da vida mundana. Focado em erguer bases concretas sólidas e eternas."
    },
    5: {
      title: "O Viajante Livre e Dinâmico",
      keyword: "Adaptabilidade, Liberdade, Aventura",
      desc: "Busca constante por novidades. Excelente poder de adaptação às intempéries, com forte espírito de exploração."
    },
    6: {
      title: "O Guardião e Conselheiro",
      keyword: "Harmonia Familiar, Justiça, Apoio",
      desc: "Nascido para nutrir, acolher e orientar. Forte senso de responsabilidade afetiva e inclinação para a cura."
    },
    7: {
      title: "O Buscador e Filósofo",
      keyword: "Intuição, Espiritualidade, Análise",
      desc: "Mente investigativa voltada para desvendar os grandes enigmas espirituais e lógicos do universo visível."
    },
    8: {
      title: "O Realizador e Estrategista",
      keyword: "Poder Material, Abundância, Equilíbrio",
      desc: "Excelente habilidade executiva e comercial, conciliando visões ambiciosas espirituais com realizações terrestres."
    },
    9: {
      title: "O Humanitário Altruísta",
      keyword: "Universalidade, Generosidade, Conclusão",
      desc: "Amor incondicional e altruísmo global. Representa o ápice da jornada evolutiva do espírito humano."
    },
    11: {
      title: "Mestre Instigador e Guia",
      keyword: "Iluminação, Sensibilidade Extrema, Visão",
      desc: "Número Mestre. Conexão profunda com dimensões superiores. Canal natural para passar conhecimentos transformadores."
    },
    22: {
      title: "O Arquiteto Construtor Mestre",
      keyword: "Materialização de Sonhos Globais",
      desc: "Número Meste Máximo. Capacidade de transformar visões abstratas em monumentos úteis para a humanidade inteira."
    }
  };

  const getNumberInfo = (num: number) => {
    return (
      numbersDictionary[num] || {
        title: "Energia Sintética Universal",
        keyword: "Espiritualidade, Equilíbrio, Sincronia",
        desc: "Um vetor vibracional místico idealizado para motivar conexões elevadas com o plano celeste."
      }
    );
  };

  const cardsByRole = [
    { key: "lifePath", label: t.lifePathNum, value: numerologyData.lifePath, color: "border-indigo-100 bg-indigo-50/20 text-indigo-900" },
    { key: "expression", label: t.expressionNum, value: numerologyData.expression, color: "border-emerald-100 bg-emerald-50/20 text-emerald-900" },
    { key: "soulUrge", label: t.soulUrgeNum, value: numerologyData.soulUrge, color: "border-amber-100 bg-amber-50/20 text-amber-900" },
    { key: "personality", label: t.personalityNum, value: numerologyData.personality, color: "border-rose-100 bg-rose-50/20 text-rose-900" },
    { key: "destiny", label: t.destinyNum, value: numerologyData.destiny, color: "border-sky-100 bg-sky-50/20 text-sky-900" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Description header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Binary className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-display font-semibold text-neutral-900">{t.numerologyTitle}</h2>
        </div>
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {t.numerologyDesc}
        </p>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {cardsByRole.map((card) => {
          const info = getNumberInfo(card.value);
          return (
            <div
              key={card.key}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition hover:shadow-md ${card.color}`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                  {card.label}
                </span>
                <span className="text-4xl font-display font-extrabold block">
                  {card.value}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-neutral-800 block">
                  {info.title}
                </span>
                <span className="text-[10px] text-neutral-500 block italic leading-tight">
                  {info.keyword}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded explanations details board */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3">
          Leitura Detalhada de seus Números Força
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardsByRole.slice(0, 4).map((card) => {
            const info = getNumberInfo(card.value);
            return (
              <div key={card.key} className="space-y-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{card.label}</span>
                  <span className="px-2.5 py-0.5 bg-neutral-800 text-white rounded-lg text-xs font-extrabold font-mono">
                    #{card.value}
                  </span>
                </div>
                <h4 className="font-semibold text-neutral-850 text-sm">{info.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {info.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

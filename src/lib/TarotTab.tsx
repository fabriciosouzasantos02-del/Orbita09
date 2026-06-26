import React, { useState } from "react";
import { HelpCircle, RefreshCw, Sparkles, HelpCircle as HelpIcon, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { performTarotReading } from "../tarot";
import { Language, translations } from "../translations";
import { TarotCard } from "../types";
import { useTranslation } from "react-i18next";

interface TarotTabProps {
  lang: Language;
}

export default function TarotTab({ lang }: TarotTabProps) {
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<{ card: TarotCard; isReversed: boolean; position: 'passado' | 'presente' | 'futuro' }[] | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const t = translations[lang];
  const { t: tI18n } = useTranslation();

  const handleDrawCards = () => {
    setIsShuffling(true);
    setInterpretation("");
    setReading(null);

    setTimeout(() => {
      const result = performTarotReading(question);
      setReading(result);
      setIsShuffling(false);
    }, 1000);
  };

  const handleGetInterpretation = async () => {
    if (!reading) return;
    setLoadingAI(true);
    try {
      const response = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          cards: reading,
          lang,
        }),
      });
      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err) {
      console.error(err);
      setInterpretation(tI18n("Erro ao contatar oráculo cósmico."));
    } finally {
      setLoadingAI(false);
    }
  };

  // Sorter helpers for spread layout titles
  const getSpreadName = (pos: 'passado' | 'presente' | 'futuro') => {
    if (pos === 'passado') return t.tarotSpreadPast;
    if (pos === 'presente') return t.tarotSpreadPresent;
    return t.tarotSpreadFuture;
  };

  const parseInterpretationMarkdown = (rawText: string) => {
    if (!rawText) return null;
    return rawText.split("\n").map((line, index) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith("###")) {
        return (
          <h4 key={index} className="text-sm font-bold text-indigo-900 mt-4 mb-1.5 font-display uppercase tracking-wider">
            {cleanLine.replace("###", "").trim()}
          </h4>
        );
      } else if (cleanLine.startsWith("##") || cleanLine.startsWith("#")) {
        return (
          <h3 key={index} className="text-base font-bold text-neutral-900 mt-5 mb-2 font-display border-b border-indigo-100 pb-1">
            {cleanLine.replace(/^##?/, "").trim()}
          </h3>
        );
      } else if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        return (
          <li key={index} className="ml-4 list-disc text-xs text-neutral-600 mb-1.5 leading-relaxed">
            {cleanLine.substring(1).trim()}
          </li>
        );
      } else if (cleanLine) {
        // Parse simple bold **
        const parts = cleanLine.split("**");
        return (
          <p key={index} className="text-xs sm:text-sm text-neutral-600 mb-3 leading-relaxed">
            {parts.map((p, pidx) => (pidx % 2 === 1 ? <strong key={pidx} className="text-neutral-850 font-bold">{p}</strong> : p))}
          </p>
        );
      }
      return <div key={index} className="h-1" />;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Description header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-semibold text-neutral-900">{t.tarotTitle}</h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          {t.tarotDesc}
        </p>
      </div>

      {/* Interactive Draw controls card */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {tI18n("Sua Pergunta ou Afirmação de Foco")}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.tarotPlaceholder}
              className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-neutral-400 font-sans transition"
            />
            <button
              onClick={handleDrawCards}
              disabled={isShuffling}
              className="px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] shadow"
            >
              {isShuffling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{tI18n("Embaralhando arcanos...")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.drawCards}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display drawn cards */}
        <AnimatePresence mode="wait">
          {reading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="pt-6 space-y-8"
            >
              
              {/* Cards Spread grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {reading.map((drawn, index) => (
                  <motion.div
                    key={drawn.card.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex flex-col items-center space-y-3.5 bg-neutral-50/50 p-4 border border-neutral-100 rounded-2xl relative overflow-hidden"
                  >
                    
                    {/* Position Label */}
                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {getSpreadName(drawn.position)}
                    </span>

                    {/* Classic Tarot card visual frame with rotation representation */}
                    <div className="relative w-36 h-56 bg-gradient-to-b from-indigo-900/10 to-indigo-950/25 border-4 border-indigo-900/10 rounded-2xl p-3 flex flex-col justify-between items-center shadow-md select-none transform transition overflow-hidden">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                        Arcano {drawn.card.arcana}
                      </div>
                      
                      <div className={`text-5xl my-4 transition duration-500 ${drawn.isReversed ? "rotate-180" : ""}`}>
                        {drawn.card.imageSym}
                      </div>

                      <div className="w-full text-center">
                        <span className="block text-[10px] text-neutral-400 font-medium">{tI18n("Posição:")}</span>
                        <span className="block text-[10px] font-bold text-neutral-600">
                          {drawn.isReversed ? t.reversedPosition : t.uprightPosition}
                        </span>
                      </div>
                    </div>

                    {/* Text values */}
                    <div className="text-center space-y-1 max-w-xs">
                      <h4 className="font-display font-medium text-neutral-900 text-sm">
                        {drawn.card.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed italic px-1">
                        "{drawn.isReversed ? drawn.card.reversedMeaning : drawn.card.uprightMeaning}"
                      </p>
                    </div>

                  </motion.div>
                ))}
              </div>

              {/* Dynamic AI Interpretation button selector for tarot */}
              <div className="pt-4 border-t border-neutral-200/50 flex flex-col items-center text-center space-y-3">
                <p className="text-xs text-neutral-500 max-w-md">
                  {tI18n("Gostaria que nosso sábio místico unificasse a leitura destas 3 cartas no seu contexto pessoal?")}
                </p>
                <button
                  onClick={handleGetInterpretation}
                  disabled={loadingAI}
                  className="px-6 py-2.5 bg-neutral-900 font-semibold hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow"
                >
                  {loadingAI ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{tI18n("Invocando Oráculo místico...")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>{tI18n("Interpretar Leitura Geral")}</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Tarot interpretation output board */}
        {interpretation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 sm:p-6 bg-indigo-50/20 border border-indigo-100 rounded-2xl mt-4"
          >
            <div className="prose prose-sm font-sans text-neutral-750">
              {parseInterpretationMarkdown(interpretation)}
            </div>
          </motion.div>
        )}

      </section>

    </div>
  );
}

import React, { useState } from "react";
import { Sparkles, Moon, RefreshCw, Feather, PlusCircle, Trash, Notebook, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "../translations";
import { DreamEntry } from "../types";
import { useTranslation } from "react-i18next";

interface DreamsTabProps {
  lang: Language;
}

export default function DreamsTab({ lang }: DreamsTabProps) {
  const [dreams, setDreams] = useState<DreamEntry[]>([
    {
      id: "dream_1",
      title: "Voando sobre um mar azul-marinho",
      content: "Eu flutuava alto, sem asas. O mar abaixo estava calmo e havia uma chave dourada enorme flutuando no horizonte cinza.",
      date: "2026-06-20",
      mood: "peaceful",
      symbols: ["voar", "mar", "chave"],
      aiAnalysis: "Este sonho evoca uma forte sensação de libertação e novos limiares intelectuais (a chave d'ouro). Seu subconsciente indica que você está destrancando velhos limites emocionais para clarear os pensamentos."
    }
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<DreamEntry["mood"]>("peaceful");
  const [symbols, setSymbols] = useState("");
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const t = translations[lang];
  const { t: tI18n } = useTranslation();

  const handleSaveDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newDream: DreamEntry = {
      id: "dream_" + Math.random().toString(36).substr(2, 9),
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      mood,
      symbols: symbols ? symbols.split(",").map(s => s.trim()) : [],
    };

    setDreams([newDream, ...dreams]);
    setTitle("");
    setContent("");
    setSymbols("");
    setMood("peaceful");
  };

  const handleDeleteDream = (id: string) => {
    setDreams(dreams.filter(d => d.id !== id));
  };

  const handleAnalyzeDreamAI = async (dreamId: string) => {
    const target = dreams.find(d => d.id === dreamId);
    if (!target) return;

    setLoadingAI(dreamId);
    try {
      const response = await fetch("/api/dreams/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: target.title,
          content: target.content,
          mood: target.mood,
          symbols: target.symbols,
          lang,
        }),
      });
      const data = await response.json();
      
      // Update targeted dream analysis in list state
      setDreams(dreams.map(d => d.id === dreamId ? { ...d, aiAnalysis: data.interpretation } : d));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(null);
    }
  };

  const getMoodEmojiAndColor = (m: DreamEntry["mood"]) => {
    const maps: Record<DreamEntry["mood"], { emoji: string; text: string; css: string }> = {
      peaceful: { emoji: "🌸", text: t.peaceful, css: "bg-emerald-50 text-emerald-800 border-emerald-100" },
      neutral: { emoji: "😐", text: t.neutral, css: "bg-slate-50 text-slate-800 border-slate-100" },
      lucid: { emoji: "👁️", text: t.lucid, css: "bg-indigo-50 text-indigo-800 border-indigo-100" },
      intense: { emoji: "🌋", text: t.intense, css: "bg-amber-50 text-amber-800 border-amber-105" },
      nightmare: { emoji: "👹", text: t.nightmare, css: "bg-rose-50 text-rose-800 border-rose-100" }
    };
    return maps[m] || maps.neutral;
  };

  return (
    <div className="space-y-6">
      
      {/* Descriptor layout */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-semibold text-neutral-900">{t.dreamsTitle}</h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          {t.dreamsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Grid: Add Dream log Form */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm lg:col-span-5 h-fit">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-4">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-display font-semibold text-neutral-900 text-sm">{tI18n("Registrar Nova Viagem")}</h3>
          </div>

          <form onSubmit={handleSaveDream} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-500">{t.dreamTitleLabel}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tI18n("Ex: O Castelo Celestial de Nuvens")}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-neutral-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-500">{t.dreamContentLabel}</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={tI18n("Eu andava por cordas suspensas sobre a poeira cósmica...")}
                className="w-full h-24 px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-neutral-400 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">{t.dreamMood}</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as DreamEntry["mood"])}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                >
                  <option value="peaceful">{t.peaceful}</option>
                  <option value="neutral">{t.neutral}</option>
                  <option value="lucid">{t.lucid}</option>
                  <option value="intense">{t.intense}</option>
                  <option value="nightmare">{t.nightmare}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">{tI18n("Símbolos-Chave")}</label>
                <input
                  type="text"
                  value={symbols}
                  onChange={(e) => setSymbols(e.target.value)}
                  placeholder={tI18n("Separados por vírgula")}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-neutral-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 font-semibold text-white rounded-xl text-xs sm:text-sm cursor-pointer transition shadow hover:shadow-md"
            >
              {t.saveDream}
            </button>
          </form>
        </section>

        {/* Right Grid: Dream Journal entries view */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Notebook className="w-5 h-5 text-indigo-500" />
            <h3 className="font-display font-semibold text-neutral-900 text-sm">{t.dreamJournal}</h3>
          </div>

          <div className="space-y-5 max-h-[440px] overflow-y-auto pr-1">
            {dreams.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 text-xs">
                {tI18n("Nenhum sonho registrado para esta jornada ainda. Registre no painel esquerdo.")}
              </div>
            ) : (
              dreams.map((dream) => {
                const moodInfo = getMoodEmojiAndColor(dream.mood);
                return (
                  <div
                    key={dream.id}
                    className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/40 relative space-y-3"
                  >
                    
                    {/* Entry Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-medium">{dream.date}</span>
                        <h4 className="font-display font-semibold text-neutral-950 text-sm">{dream.title}</h4>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 border rounded-lg text-[10px] font-bold ${moodInfo.css} flex items-center gap-1`}>
                          <span>{moodInfo.emoji}</span>
                          <span>{moodInfo.text}</span>
                        </span>
                        
                        <button
                          onClick={() => handleDeleteDream(dream.id)}
                          className="p-1 hover:text-rose-600 text-neutral-400 transition cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {dream.content}
                    </p>

                    {/* Symbols pill tag row */}
                    {dream.symbols.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dream.symbols.map(sym => (
                          <span key={sym} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md font-mono text-[10px]">
                            #{sym}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* AI analysis result portal */}
                    {dream.aiAnalysis ? (
                      <div className="mt-2.5 p-3.5 bg-indigo-50/20 border border-indigo-150/40 rounded-xl space-y-1.5">
                        <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1">
                          <Feather className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                          <span>{tI18n("Revelação Arquetípica Integral")}</span>
                        </span>
                        <p className="text-[11px] text-neutral-700 leading-relaxed font-sans">
                          {dream.aiAnalysis}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleAnalyzeDreamAI(dream.id)}
                          disabled={loadingAI === dream.id}
                          className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-lg text-[10px] leading-none cursor-pointer transition flex items-center gap-1.5 active:scale-[0.99]"
                        >
                          {loadingAI === dream.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>{tI18n("Decifrando mistérios...")}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                              <span>{t.analyzeDreamAI}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Sparkles, Moon, RefreshCw, Feather, PlusCircle, Trash, Notebook, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "../translations";
import { DreamEntry } from "../types";
import { useTranslation } from "react-i18next";

interface DreamsTabProps {
  lang: Language;
}

const DEFAULT_DREAMS_BY_LANG: Record<string, DreamEntry[]> = {
  pt: [
    {
      id: "dream_1",
      title: "Voando sobre um mar azul-marinho",
      content: "Eu flutuava alto, sem asas. O mar abaixo estava calmo e havia uma chave dourada enorme flutuando no horizonte cinza.",
      date: "2026-06-20",
      mood: "peaceful",
      symbols: ["voar", "mar", "chave"],
      aiAnalysis: "Este sonho evoca uma forte sensação de libertação e novos limiares intelectuais (a chave d'ouro). Seu subconsciente indica que você está destrancando velhos limites emocionais para clarear os pensamentos."
    }
  ],
  en: [
    {
      id: "dream_1",
      title: "Flying over a deep blue sea",
      content: "I floated high, wingless. The sea below was calm, and there was a huge golden key floating on the grey horizon.",
      date: "2026-06-20",
      mood: "peaceful",
      symbols: ["flying", "sea", "key"],
      aiAnalysis: "This dream evokes a strong sense of liberation and new intellectual thresholds (the golden key). Your subconscious indicates that you are unlocking old emotional boundaries to clear your thoughts."
    }
  ],
  es: [
    {
      id: "dream_1",
      title: "Volando sobre un mar azul marino",
      content: "Flotaba alto, sin alas. El mar de abajo estaba en calma y había una enorme llave dorada flotando en el horizonte gris.",
      date: "2026-06-20",
      mood: "peaceful",
      symbols: ["volar", "mar", "llave"],
      aiAnalysis: "Este sueño evoca una fuerte sensación de liberación y nuevos umbrales intelectuales (la llave de oro). Tu subconsciente indica que estás desbloqueando viejos límites emocionales para despejar tus pensamientos."
    }
  ],
  de: [
    {
      id: "dream_1",
      title: "Über ein tiefblaues Meer fliegen",
      content: "Ich schwebte hoch oben, ohne Flügel. Das Meer darunter war ruhig, und am grauen Horizont schwebte ein riesiger goldener Schlüssel.",
      date: "2026-06-20",
      mood: "peaceful",
      symbols: ["fliegen", "Meer", "Schlüssel"],
      aiAnalysis: "Dieser Traum ruft ein starkes Gefühl der Befreiung und neue intellektuelle Schwellen hervor (der goldene Schlüssel). Ihr Unterbewusstsein signalisiert, dass Sie alte emotionale Grenzen freisetzen, um Ihre Gedanken zu klären."
    }
  ],
  fr: [
    {
      id: "dream_1",
      title: "Voler au-dessus d'une mer bleu marine",
      content: "Je flottais haut, sans ailes. La mer en dessous était calme, et il y avait une immense clé dorée qui flottait à l'horizon gris.",
      date: "2026-06-20",
      mood: "peaceful",
      symbols: ["voler", "mer", "clé"],
      aiAnalysis: "Ce rêve évoque un fort sentiment de libération et de nouveaux seuils intellectuels (la clé d'or). Votre subconscient indique que vous débloquez d'anciennes limites émotionnelles pour clarifier vos pensées."
    }
  ]
};

export default function DreamsTab({ lang }: DreamsTabProps) {
  const [dreams, setDreams] = useState<DreamEntry[]>(() => {
    return DEFAULT_DREAMS_BY_LANG[lang] || DEFAULT_DREAMS_BY_LANG["pt"];
  });

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
                    <div justify-between="true" className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-medium">{dream.date}</span>
                        <h4 className="font-display font-semibold text-neutral-950 text-sm">{tI18n(dream.title)}</h4>
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
                      {tI18n(dream.content)}
                    </p>

                    {/* Symbols pill tag row */}
                    {dream.symbols.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dream.symbols.map(sym => (
                          <span key={sym} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md font-mono text-[10px]">
                            #{tI18n(sym)}
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
                        <div className="text-[11px] text-neutral-700 leading-relaxed font-sans">
                          {typeof dream.aiAnalysis === 'object' && dream.aiAnalysis !== null ? (
                            <div className="space-y-2 text-xs">
                              {dream.aiAnalysis.title && (
                                <p className="font-semibold text-neutral-900 border-b border-neutral-100 pb-1 text-sm">
                                  {dream.aiAnalysis.title}
                                </p>
                              )}
                              {dream.aiAnalysis.mainMeaning && (
                                <p><strong className="text-indigo-950">{tI18n("Significado Principal")}:</strong> {dream.aiAnalysis.mainMeaning}</p>
                              )}
                              {dream.aiAnalysis.psychological && (
                                <p><strong>{tI18n("Psicológico")}:</strong> {dream.aiAnalysis.psychological}</p>
                              )}
                              {dream.aiAnalysis.spiritual && (
                                <p><strong>{tI18n("Espiritual")}:</strong> {dream.aiAnalysis.spiritual}</p>
                              )}
                              {dream.aiAnalysis.oracleAdvice && (
                                <p className="italic text-indigo-700 bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100/50 mt-1">
                                  ★ <strong>{tI18n("Conselho do Oráculo")}:</strong> {dream.aiAnalysis.oracleAdvice}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p>{tI18n(dream.aiAnalysis as unknown as string)}</p>
                          )}
                        </div>
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

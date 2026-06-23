import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, RefreshCw, Compass, Moon, Binary, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "../translations";
import { UserProfile, NatalChartData, Message, Assistant } from "../types";

interface AiAssistantTabProps {
  userProfile: UserProfile;
  natalChart: NatalChartData;
  lang: Language;
}

export default function AiAssistantTab({ userProfile, natalChart, lang }: AiAssistantTabProps) {
  const assistants: Assistant[] = [
    {
      id: "astro_mentor",
      name: "Alistair",
      role: "Mentor Astrológico",
      avatar: "🔮",
      description: "Especialista em trânsitos celestes, mapas natais complexos e caminhos do Sol nas Casas astrológicas."
    },
    {
      id: "numerosophist",
      name: "Pytha",
      role: "Sábio da Numerossofia",
      avatar: "📐",
      description: "Resolve mistérios com a grade de Pitágoras, vetores do Caminho de Vida e destino matemático de nomes."
    },
    {
      id: "dream_analyst",
      name: "Oneiria",
      role: "Tecelã da Noite",
      avatar: "🌙",
      description: "Navegadora de símbolos Jungianos. Desmistifica pesadelos complexos e treina lucidez nos sonhos."
    },
    {
      id: "tarot_guide",
      name: "Arcanum",
      role: "Guia dos Arcanos",
      avatar: "🃏",
      description: "Canalizador das virtudes do Tarot. Ensina lições sobre escolhas cruciais através das polaridades das cartas."
    }
  ];

  const [activeAssistant, setActiveAssistant] = useState<string>("astro_mentor");
  const [messagesByAssistant, setMessagesByAssistant] = useState<Record<string, Message[]>>({
    astro_mentor: [
      { id: "init_1", role: "assistant", content: `Saudações, ${userProfile.name}. Sob o teto estelar de ${userProfile.birthDetails.birthCity}, cada curva do seu trajeto kármico foi desenhada. Como posso guiar seus trânsitos e Sol hoje?`, timestamp: new Date().toLocaleTimeString() }
    ],
    numerosophist: [
      { id: "init_2", role: "assistant", content: "A matemática é o tear silencioso da criação! Diga-me, quer calcular as matrizes do seu nome completo ou decifrar os segredos de um número que te persegue?", timestamp: new Date().toLocaleTimeString() }
    ],
    dream_analyst: [
      { id: "init_3", role: "assistant", content: "As visões noturnas são correspondências secretas do seu eu superior. Que símbolos ou sentimentos intrigaram você durante o descanso profundo hoje?", timestamp: new Date().toLocaleTimeString() }
    ],
    tarot_guide: [
      { id: "init_4", role: "assistant", content: "As polaridades das cartas revelam os espelhos de sua mente profunda. Qual questão crucial de vida ou de carreira colocaremos sobre a mesa hoje?", timestamp: new Date().toLocaleTimeString() }
    ]
  });

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByAssistant, activeAssistant]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setInputValue("");

    const currentHistory = messagesByAssistant[activeAssistant] || [];
    const newUserMessage: Message = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...currentHistory, newUserMessage];
    setMessagesByAssistant({
      ...messagesByAssistant,
      [activeAssistant]: updatedHistory
    });

    setLoading(true);

    try {
      const response = await fetch("/api/chat/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistantId: activeAssistant,
          messages: updatedHistory,
          userProfile,
          chartData: natalChart,
          lang
        }),
      });
      const data = await response.json();

      const newAssistantMessage: Message = {
        id: `msg_asst_${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessagesByAssistant(prev => ({
        ...prev,
        [activeAssistant]: [...(prev[activeAssistant] || []), newAssistantMessage]
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedAssistantObj = assistants.find(a => a.id === activeAssistant)!;
  const currentMessages = messagesByAssistant[activeAssistant] || [];

  return (
    <div className="space-y-6">
      
      {/* Descriptor layout */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-semibold text-neutral-900">{t.aiAssistant}</h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Quatro guias sagrados especializados em astrologia, numerologia, sonhos e tarot sintonizados com sua frequência energética natal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Guia selectors */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-sm md:col-span-4 space-y-3">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block px-1.5 border-b border-neutral-50 pb-2">
            Escolha seu Mentor
          </span>

          <div className="space-y-2">
            {assistants.map((asst) => (
              <button
                key={asst.id}
                onClick={() => setActiveAssistant(asst.id)}
                className={`w-full text-left p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  activeAssistant === asst.id
                    ? "bg-indigo-50/45 border-indigo-200 ring-1 ring-indigo-200/50"
                    : "bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50"
                }`}
              >
                <div className="text-2xl p-1.5 bg-neutral-50/50 rounded-lg select-all border border-neutral-100">
                  {asst.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 text-xs sm:text-sm">{asst.name}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold block">{asst.role}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 mt-4">
            <p className="text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed">
              <strong>Como funciona?</strong> Eles têm pleno discernimento do seu mapa natal de nascimento e data cósmica. Pergunte sem restrições em português, inglês, espanhol ou alemão!
            </p>
          </div>
        </section>

        {/* Right Side: Chat Portal viewport */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl shadow-sm md:col-span-8 flex flex-col justify-between h-[520px] overflow-hidden">
          
          {/* Chat Assistant Header card */}
          <div className="p-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedAssistantObj.avatar}</span>
              <div>
                <span className="font-bold text-neutral-800 text-xs sm:text-sm leading-none block">
                  {selectedAssistantObj.name}
                </span>
                <span className="text-[10px] text-indigo-700 font-bold">
                  {selectedAssistantObj.role}
                </span>
              </div>
            </div>
            
            <span className="text-[10px] text-neutral-400 font-semibold max-w-xs text-right hidden sm:block truncate">
              {selectedAssistantObj.description}
            </span>
          </div>

          {/* Interactive dialogue board viewports */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/25">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm relative space-y-1 shadow-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-none"
                      : "bg-white border border-neutral-150 text-neutral-800 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`block text-[9px] text-right ${msg.role === "user" ? "text-slate-300" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-none p-3.5 text-xs text-neutral-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Sintonizando mentes cósmicas...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Message form input controls bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-neutral-50 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Fale com ${selectedAssistantObj.name}...`}
              className="flex-1 px-4 py-2.5 bg-white border border-neutral-200/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-neutral-400 font-sans transition"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-805 disabled:opacity-50 text-white rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </section>

      </div>
    </div>
  );
}

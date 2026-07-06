import React, { useState, useEffect } from "react";
import { Compass, Moon, Sun, Flame, MessageSquareQuote, RefreshCw, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Language } from "../translations";
import { NatalChartData } from "../types";
import { useTranslation } from "react-i18next";
import { useIdioma } from "../context/IdiomaContext";

interface DashboardTabProps {
  natalChart: NatalChartData;
  lang: Language;
}

const LOCAL_DASHBOARD_TRANSLATIONS: Record<Language, Record<string, string>> = {
  pt: {
    "Sol em": "Sol em",
    "Trânsito de Hoje": "Trânsito de Hoje",
    "Maré Cósmica Semanal": "Maré Cósmica Semanal",
    "Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.": "Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.",
    '"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."': '"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."',
    "de iluminação": "de iluminação",
    "Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.": "Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística."
  },
  en: {
    "Sol em": "Sun in",
    "Trânsito de Hoje": "Today's Transit",
    "Maré Cósmica Semanal": "Weekly Cosmic Tide",
    "Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.": "This week the energies are in a seeding phase. Pluto stabilizes transitions and Neptune invites you to decipher the secrets of your nightly dreams.",
    '"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."': '"The universe does not speak through external words, but through the calm beat of your heart when it falls silent."',
    "de iluminação": "illumination",
    "Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.": "Ideal period to clear old mental burdens and nurture new ideas in a mystical way."
  },
  es: {
    "Sol em": "Sol en",
    "Trânsito de Hoje": "Tránsito de Hoy",
    "Maré Cósmica Semanal": "Marea Cósmica Semanal",
    "Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.": "Esta semana las energías están en fase de siembra. Plutón estabiliza las transiciones y Neptuno te invita a descifrar los secretos de tus sueños nocturnos.",
    '"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."': '"El universo no habla a través de palabras externas, sino a través del latido calmado de tu corazón cuando guarda silencio."',
    "de iluminação": "de iluminación",
    "Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.": "Período ideal para limpiar viejos pesos mentales y nutrir nuevas ideas de forma mística."
  },
  de: {
    "Sol em": "Sonne im",
    "Trânsito de Hoje": "Heutiger Transit",
    "Maré Cósmica Semanal": "Wöchentliche Kosmische Flut",
    "Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.": "Diese Woche befinden sich die Energien in einer Aussaatphase. Pluto stabilisiert Übergänge und Neptun lädt dich ein, die Geheimnisse deiner nächtlichen Träume zu entschlüsseln.",
    '"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."': '"Das Universum spricht nicht durch äußere Worte, sondern durch den ruhigen Schlag deines Herzens, wenn es still wird."',
    "de iluminação": "Beleuchtung",
    "Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.": "Ideale Zeit, um alten mentalen Ballast abzuwerfen und neue Ideen auf mystische Weise zu nähren."
  },
  fr: {
    "Sol em": "Soleil en",
    "Trânsito de Hoje": "Transit d'Aujourd'hui",
    "Maré Cósmica Semanal": "Marée Cosmique Hebdomadaire",
    "Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.": "Cette semaine, les énergies sont dans une phase d'ensemencement. Pluton stabilise les transitions et Neptune vous invite à déchiffrer les secrets de vos rêves nocturnes.",
    '"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."': '"L\'univers ne s\'exprime pas par des mots extérieurs, mais par le battement calme de votre cœur lorsqu\'il fait silence."',
    "de iluminação": "d'illumination",
    "Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.": "Période idéale pour libérer les anciens fardeaux mentaux et nourrir de nouvelles idées de manière mystique."
  }
};

export default function DashboardTab({ natalChart, lang }: DashboardTabProps) {
  const { idioma } = useIdioma();
  const activeLang = idioma || lang || "pt";

  const [moonPhaseInfo, setMoonPhaseInfo] = useState(() => {
    const defaultName = activeLang === "en" ? "New Moon" : activeLang === "es" ? "Luna Nueva" : activeLang === "de" ? "Neumond" : activeLang === "fr" ? "Nouvelle Lune" : "Lua Nova";
    return { name: defaultName, symbol: "🌑", percent: 0 };
  });
  const [activeHoroscope, setActiveHoroscope] = useState<'daily' | 'weekly'>('daily');
  const { t } = useTranslation();

  const tI18n = (text: string) => {
    if (!text) return "";
    const localVal = LOCAL_DASHBOARD_TRANSLATIONS[activeLang || 'pt']?.[text];
    if (localVal) return localVal;
    return t(text);
  };

  // Calculate moon phase mathematically based on current date
  useEffect(() => {
    const knownNewMoon = new Date("2024-01-11T11:57:00Z").getTime();
    const cycleLength = 29.53059 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const diff = (now - knownNewMoon) % cycleLength;
    const phaseAge = diff / (24 * 60 * 60 * 1000); // age in days
    const percent = diff / cycleLength; // 0.0 to 1.0

    let name = "Lua Cheia";
    let symbol = "🌕";

    if (percent < 0.03 || percent > 0.97) {
      name = activeLang === "pt" ? "Lua Nova" : activeLang === "es" ? "Luna Nueva" : activeLang === "de" ? "Neumond" : activeLang === "fr" ? "Nouvelle Lune" : "New Moon";
      symbol = "🌑";
    } else if (percent < 0.22) {
      name = activeLang === "pt" ? "Lua Crescente Minguante" : activeLang === "es" ? "Luna Creciente Menguante" : activeLang === "de" ? "Zunehmender Sichelmond" : activeLang === "fr" ? "Croissant de Lune" : "Waxing Crescent";
      symbol = "🌒";
    } else if (percent < 0.28) {
      name = activeLang === "pt" ? "Quarto Crescente" : activeLang === "es" ? "Cuarto Creciente" : activeLang === "de" ? "Erstes Viertel" : activeLang === "fr" ? "Premier Quartier" : "First Quarter";
      symbol = "🌓";
    } else if (percent < 0.47) {
      name = activeLang === "pt" ? "Lua Gibosa Crescente" : activeLang === "es" ? "Luna Gibosa Creciente" : activeLang === "de" ? "Zunehmender Dreiviertelmond" : activeLang === "fr" ? "Lune Gibbeuse Croissante" : "Waxing Gibbous";
      symbol = "🌔";
    } else if (percent < 0.53) {
      name = activeLang === "pt" ? "Lua Cheia" : activeLang === "es" ? "Luna Llena" : activeLang === "de" ? "Vollmond" : activeLang === "fr" ? "Pleine Lune" : "Full Moon";
      symbol = "🌕";
    } else if (percent < 0.72) {
      name = activeLang === "pt" ? "Lua Gibosa Minguante" : activeLang === "es" ? "Luna Gibosa Menguante" : activeLang === "de" ? "Abnehmender Dreiviertelmond" : activeLang === "fr" ? "Lune Gibbeuse Décroissante" : "Waning Gibbous";
      symbol = "🌖";
    } else if (percent < 0.78) {
      name = activeLang === "pt" ? "Quarto Minguante" : activeLang === "es" ? "Cuarto Menguante" : activeLang === "de" ? "Letztes Viertel" : activeLang === "fr" ? "Dernier Quartier" : "Last Quarter";
      symbol = "🌗";
    } else {
      name = activeLang === "pt" ? "Lua Minguante" : activeLang === "es" ? "Luna Menguante" : activeLang === "de" ? "Abnehmender Sichelmond" : activeLang === "fr" ? "Lune Décroissante" : "Waning Crescent";
      symbol = "🌘";
    }

    setMoonPhaseInfo({ name, symbol, percent: Math.round(percent * 100) });
  }, [activeLang]);

  // Derived Horoscope message based on Sun sign
  const sunSign = natalChart.planets.find(p => p.name === "Sol")?.sign || "Áries";

  const dailyHoroscopes: Record<string, Record<Language, string>> = {
    Áries: {
      pt: "Hoje a energia convida você a iniciar novos empreendimentos. A Lua ativa sua intuição e propicia o diálogo assertivo.",
      en: "Today the cosmic current encourages starting new projects. The Moon heightens your intuition and fosters clear, assertive expression.",
      de: "Heute ermutigt dich die kosmische Strömung, neue Unternehmungen zu starten. Der Mond stärkt deine Intuition.",
      es: "Hoy la corriente cósmica te anima a iniciar nuevos emprendimientos. La luna potencia tu intuición y valentía.",
      fr: "Aujourd'hui, l'énergie vous invite à lancer de nouvelles initiatives. La Lune active votre intuition et favorise un dialogue affirmé."
    },
    Touro: {
      pt: "Momento excelente para organizar finanças e planejar de forma minuciosa suas próximas metas corporais e espirituais.",
      en: "Excellent day to organize finances and meticulously plan your next physiological and spiritual objectives.",
      de: "Hervorragender Tag, um Finanzen zu regeln und deine nächsten Lebensziele feinfühlig zu strukturieren.",
      es: "Día ideal para consolidar tus recursos y planificar detalladamente tus próximas metas materiales y del alma.",
      fr: "Excellent moment pour organiser vos finances et planifier minutieusement vos prochains objectifs physiques et spirituels."
    },
    Gêmeos: {
      pt: "Mercúrio traz claridade e agilidade ao seu plano de estudos. Um diálogo surpresa trará insights para desvendar mistérios do lar.",
      en: "Mercury brings razor-sharp clarity to your thoughts. A surprising conversation today will unlock keys to solve long-standing puzzles.",
      de: "Merkur schenkt dir messerscharfe mentale Klarheit. Ein überraschendes Gespräch bringt bahnbrechende Erkenntnisse.",
      es: "Mercurio trae mucha elocuencia y dinamismo a tus ideas. Una conversación oportuna abrirá horizontes impensados.",
      fr: "Mercure apporte clarté et agilité à vos études. Un dialogue surprise apportera des éclairages pour révéler les mystères du foyer."
    },
    Câncer: {
      pt: "Sua sensibilidade aflora. Permita-se momentos de interiorização e reconexão com seus sonhos primordiais.",
      en: "Your natural emotional sensitivity is amplified. Allow yourself spaces for meditation and journaling your key subconcious dreams.",
      de: "Deine emotionale Tiefe ist heute besonders stark ausgeprägt. Gönne dir meditative Ruhezeiten.",
      es: "Tu receptividad natural se agudiza. Dedícate unos instantes de silencio para repensar tus mayores prioridades.",
      fr: "Votre sensibilité s'épanouit. Accordez-vous des moments d'intériorisation et de reconnexion avec vos rêves primordiaux."
    },
    default: {
      pt: "Seu signo solar está sob excelentes vibrações celestes. Uma quadratura benéfica estimula ações equilibradas e determinação focada.",
      en: "Your solar coordinate sits under beautiful alignments today. This triggers a balanced motivation to solve key personal goals.",
      de: "Dein Sonnenzeichen empfängt heute kraftvolle kosmische Schwingungen. Nutze den Tag für strukturelle Fortschritte.",
      es: "Tu regente natal se halla en óptima armonía. Aprovecha esta influência constructiva para renovar tu fe en el destino.",
      fr: "Votre signe solaire est sous d'excellentes vibrations célestes. Un aspect bénéfique stimule des actions équilibrées et une détermination ciblée."
    }
  };

  const currentHoroscope = dailyHoroscopes[sunSign] || dailyHoroscopes.default;
  const horoscopeText = currentHoroscope[activeLang] || currentHoroscope['en'] || currentHoroscope['pt'];

  // Cosmic Aura Signature data
  const majorTransits: Record<string, Record<Language, { title: string; desc: string }>> = {
    "Áries": {
      pt: { title: "Marte trígono Plutão", desc: "Impulsiona sua liderança natural, liberando coragem para quebrar barreiras cotidianas." },
      en: { title: "Mars trine Pluto", desc: "Drives your natural leadership, releasing courage to break everyday barriers." },
      es: { title: "Marte trígono Plutón", desc: "Impulsa tu liderazgo natural, liberando coraje para romper barreras cotidianas." },
      de: { title: "Mars Trigon Pluto", desc: "Treibt Ihre natürliche Führungsrolle an und setzt Mut frei, um alltägliche Barrieren zu durchbrechen." },
      fr: { title: "Mars trigone Pluton", desc: "Stimule votre leadership naturel, libérant du courage pour briser les barrières quotidiennes." }
    },
    "Touro": {
      pt: { title: "Vênus sextil Saturno", desc: "Foco em atrativos duradouros e consolidação financeira em andamento prático." },
      en: { title: "Venus sextile Saturn", desc: "Focus on lasting attractors and financial consolidation in practical progress." },
      es: { title: "Venus sextil Saturno", desc: "Enfoque en atractivos duraderos y consolidación financiera en marcha práctica." },
      de: { title: "Venus Sextil Saturn", desc: "Fokus auf dauerhafte Attraktoren und finanzielle Konsolidierung im praktischen Fortschritt." },
      fr: { title: "Vénus sextile Saturne", desc: "Accent sur les attraits durables et la consolidation financière dans les progrès pratiques." }
    },
    "Gêmeos": {
      pt: { title: "Mercúrio na Casa 3", desc: "Seus talentos de comunicação e oratória estão com vibração e clareza máximas." },
      en: { title: "Mercury in House 3", desc: "Your communication and speaking talents are at peak vibration and clarity." },
      es: { title: "Mercurio en Casa 3", desc: "Tus talentos de comunicación y oratoria están en máxima vibración y claridad." },
      de: { title: "Merkur in Haus 3", desc: "Ihre Kommunikations- und Sprechtalente befinden sich auf dem Höhepunkt von Schwingung und Klarheit." },
      fr: { title: "Mercure en Maison 3", desc: "Vos talents de communication et d'expression sont à leur apogée de vibration et de clarté." }
    },
    "Câncer": {
      pt: { title: "Lua trígono Netuno", desc: "Sua sensibilidade intuitiva está no pico absoluto, favorecendo revelação de sonhos." },
      en: { title: "Moon trine Neptune", desc: "Your intuitive sensitivity is at its absolute peak, favoring dream revelations." },
      es: { title: "Luna trígono Neptuno", desc: "Tu sensibilidad intuitiva está en su punto máximo, favoreciendo la revelación de sueños." },
      de: { title: "Mond Trigon Neptun", desc: "Ihre intuitive Sensibilität ist auf dem absoluten Höhepunkt, was Traumenthüllungen begünstigt." },
      fr: { title: "Lune trigone Neptune", desc: "Votre sensibilité intuitive est à son apogée absolue, favorisant la révélation des rêves." }
    },
    "Leão": {
      pt: { title: "Sol trígono Júpiter", desc: "Brilho pessoal radiante e amplas oportunidades de reconhecimento de sua aura." },
      en: { title: "Sun trine Jupiter", desc: "Radiant personal brilliance and ample opportunities for aura recognition." },
      es: { title: "Sol trígono Júpiter", desc: "Brillo personal radiante y amplias oportunidades de reconhecimento de tu aura." },
      de: { title: "Sonne Trigon Jupiter", desc: "Strahlender persönlicher Glanz und reichliche Gelegenheiten zur Aura-Erkennung." },
      fr: { title: "Soleil trigone Jupiter", desc: "Éclat personnel radieux et amples opportunités de reconnaissance de votre aura." }
    },
    "Virgem": {
      pt: { title: "Mercúrio trígono Urano", desc: "Sua mente racional está iluminada com insights revolucionários e novas soluções." },
      en: { title: "Mercury trine Uranus", desc: "Your rational mind is illuminated with revolutionary insights and new solutions." },
      es: { title: "Mercurio trígono Urano", desc: "Tu mente racional está iluminada con ideas revolucionarias y nuevas soluciones." },
      de: { title: "Merkur Trigon Uranus", desc: "Ihr rationaler Verstand ist mit revolutionären Einsichten und neuen Lösungen erleuchtet." },
      fr: { title: "Mercure trigone Uranus", desc: "Votre esprit rationnel est illuminé par des idées revolucionnaires et de nouvelles solutions." }
    },
    "Libra": {
      pt: { title: "Vênus trígono Marte", desc: "Sintonia perfeita entre afeto e ação prática, favorecendo seu magnetismo social." },
      en: { title: "Venus trine Mars", desc: "Perfect harmony between affection and practical action, favoring your social magnetism." },
      es: { title: "Venus trígono Marte", desc: "Sintonía perfecta entre afecto y acción práctica, favoreciendo tu magnetismo social." },
      de: { title: "Venus Trigon Mars", desc: "Perfekte Harmonie zwischen Zuneigung und praktischem Handeln, die Ihren sozialen Magnetismus begünstigt." },
      fr: { title: "Vénus trigone Mars", desc: "Parfaite harmonie entre affection et action pratique, favorisant votre magnétisme social." }
    },
    "Escorpião": {
      pt: { title: "Plutão sextil Netuno", desc: "Sua percepção psíquica desvenda intenções invisíveis com clareza incomparável." },
      en: { title: "Pluto sextile Neptune", desc: "Your psychic perception unlocks unseen intentions with unmatched clarity." },
      es: { title: "Plutón sextil Neptuno", desc: "Tu percepción psíquica descifra intenciones invisibles con claridad inigualable." },
      de: { title: "Pluto Sextil Neptun", desc: "Ihre psychische Wahrnehmung entschlüsselt unsichtbare Absichten mit unübertroffener Klarheit." },
      fr: { title: "Pluton sextile Neptune", desc: "Votre perception psychique révèle des intentions invisibles avec une clarté inégale." }
    },
    "Sagitário": {
      pt: { title: "Júpiter na Casa 9", desc: "Sua sede de expansão mental e espiritual abre canais de extrema prosperidade." },
      en: { title: "Jupiter in House 9", desc: "Your thirst for mental and spiritual expansion opens channels of extreme prosperity." },
      es: { title: "Júpiter en Casa 9", desc: "Tu sed de expansión mental y espiritual abre canales de extrema prosperidad." },
      de: { title: "Jupiter in Haus 9", desc: "Ihr Durst nach geistiger und spiritueller Expansion öffnet Kanäle für extremen Wohlstand." },
      fr: { title: "Jupiter en Maison 9", desc: "Votre soif d'expansion mentale et spirituelle ouvre des canaux d'extrême prospérité." }
    },
    "Capricórnio": {
      pt: { title: "Saturno trígono Sol", desc: "Estabilidade de alma e colheita segura de esforços que fortalecem seu destino." },
      en: { title: "Saturn trine Sun", desc: "Soul stability and safe harvest of efforts that strengthen your destiny." },
      es: { title: "Saturno trígono Sol", desc: "Estabilidad del alma y cosecha segura de esfuerzos que fortalecen tu destino." },
      de: { title: "Saturn Trigon Sonne", desc: "Seelische Stabilität und sichere Ernte von Anstrengungen, die Ihr Schicksal stärken." },
      fr: { title: "Saturne trigone Soleil", desc: "Stabilité de l'âme et récolte sûre des efforts qui renforcent votre destin." }
    },
    "Aquário": {
      pt: { title: "Urano sextil Sol", desc: "Libertação de velhas crenças mentais e originalidade em alta voltagem cósmica." },
      en: { title: "Uranus sextile Sun", desc: "Release of old mental beliefs and high cosmic voltage originality." },
      es: { title: "Urano sextil Sol", desc: "Liberación de viejas creencias mentales y originalidad en alta tensión cósmica." },
      de: { title: "Uranus Sextil Sonne", desc: "Befreiung von alten mentalen Überzeugungen und hohe kosmische Spannungs-Originalität." },
      fr: { title: "Uranus sextile Soleil", desc: "Libération des vieilles croyances mentales et originalité en haute tension cosmique." }
    },
    "Peixes": {
      pt: { title: "Netuno trígono Vênus", desc: "Inspiração poética em alta, amor transcendente de alma e elevação de magnetismo." },
      en: { title: "Neptune trine Venus", desc: "High poetic inspiration, transcendent soul love, and elevated aura magnetism." },
      es: { title: "Neptuno trígono Venus", desc: "Alta inspiración poética, amor de alma trascendente y magnetismo elevado." },
      de: { title: "Neptun Trigon Venus", desc: "Hohe poetische Inspiration, transzendente Seelenliebe und erhöhter Aura-Magnetismus." },
      fr: { title: "Neptune trigone Vénus", desc: "Haute inspiration poétique, amour transcendant de l'âme et magnétisme élevé." }
    }
  };

  const activeTransitData = majorTransits[sunSign] || majorTransits.default || majorTransits["Câncer"];
  const localizedTransit = activeTransitData[activeLang] || activeTransitData["en"] || activeTransitData["pt"];

  const headerTitles: Record<Language, string> = {
    pt: "Assinatura de Aura Cósmica",
    en: "Cosmic Aura Signature",
    es: "Firma de Aura Cósmica",
    de: "Kosmische Aura-Signatur",
    fr: "Signature d'Aura Cosmique"
  };

  const headerSubtitles: Record<Language, string> = {
    pt: "Sua vibração existencial decodificada em tempo real",
    en: "Your existential vibration decoded in real-time",
    es: "Tu vibración existencial decodificada en tiempo real",
    de: "Ihre existenzielle Schwingung in Echtzeit decodiert",
    fr: "Votre vibration existentielle décodée en temps réel"
  };

  const moonLabels: Record<Language, string> = {
    pt: "Ciclo Lunar Ativo",
    en: "Active Lunar Cycle",
    es: "Ciclo Lunar Activo",
    de: "Aktiver Mondzyklus",
    fr: "Cycle Lunaire Actif"
  };

  const transitLabels: Record<Language, string> = {
    pt: "Ativação Natal Principal",
    en: "Primary Natal Activation",
    es: "Activación Natal Principal",
    de: "Hauptsächliche Geburtsaktivierung",
    fr: "Activation Natale Principale"
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header Greeting: Cosmic Aura Signature Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-slate-100 rounded-3xl p-6 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/15 border border-indigo-500/25 text-[9px] font-mono text-indigo-400 font-extrabold rounded-lg uppercase tracking-wider">
                ★ Aura Signature
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 font-extrabold rounded-lg uppercase tracking-wider flex items-center gap-1">
                <Sun className="w-2.5 h-2.5 animate-spin-slow" />
                {tI18n("Sol em")} {t(sunSign)}
              </span>
            </div>
            <h2 className="text-2xl font-sans font-black tracking-tight text-slate-50">
              {headerTitles[activeLang] || headerTitles.pt}
            </h2>
            <p className="text-slate-400 text-xs">
              {headerSubtitles[activeLang] || headerSubtitles.pt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Moon Phase Column */}
            <div className="px-4 py-3 bg-slate-900/60 border border-slate-850 rounded-2xl flex items-center gap-3 text-left">
              <span className="text-4xl select-none">{moonPhaseInfo.symbol}</span>
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                  {moonLabels[activeLang] || moonLabels.pt}
                </span>
                <span className="text-xs font-bold text-slate-200 block">
                  {moonPhaseInfo.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {moonPhaseInfo.percent}% {tI18n("de iluminação")}
                </span>
              </div>
            </div>

            {/* Planetary Activation Column */}
            <div className="px-4 py-3 bg-slate-900/60 border border-slate-850 rounded-2xl flex items-center gap-3 text-left max-w-xs">
              <Compass className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  {transitLabels[activeLang] || transitLabels.pt}
                </span>
                <span className="text-xs font-black text-slate-100 block">
                  {localizedTransit.title}
                </span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  {localizedTransit.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Monther Horoscopes (Daily / Weekly) */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveHoroscope('daily')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeHoroscope === 'daily'
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {t("dailyHoroscope")}
              </button>
              <button
                onClick={() => setActiveHoroscope('weekly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeHoroscope === 'weekly'
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {t("weeklyHoroscope")}
              </button>
            </div>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <motion.div
            key={activeHoroscope}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-neutral-55 bg-indigo-50/25 border border-indigo-100/50 rounded-xl space-y-3 leading-relaxed"
          >
            <h3 className="font-semibold text-neutral-800 text-sm">
              {activeHoroscope === 'daily' ? tI18n("Trânsito de Hoje") : tI18n("Maré Cósmica Semanal")}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm">
              {activeHoroscope === 'daily' 
                ? currentHoroscope[activeLang]
                : tI18n("Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.")
              }
            </p>
          </motion.div>

          {/* Daily Advice snippet card */}
          <div className="flex gap-3 items-start p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <MessageSquareQuote className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{t("insightOfTheDay")}</span>
              <p className="italic text-neutral-500 text-xs">
                {tI18n(`"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."`)}
              </p>
            </div>
          </div>
        </section>

        {/* Lunar phase widget */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t("lunarPhase")}</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="text-center py-6 space-y-3">
            <span className="text-7xl block select-none animate-pulse-slow">{moonPhaseInfo.symbol}</span>
            <div>
              <span className="font-display font-bold text-neutral-900 text-lg block">{moonPhaseInfo.name}</span>
              <span className="font-mono text-neutral-400 text-xs tracking-wider">{moonPhaseInfo.percent}% {tI18n("de iluminação")}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100/80 text-[11px] text-neutral-500 leading-relaxed text-center">
            {tI18n("Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.")}
          </div>
        </section>

      </div>
    </div>
  );
}

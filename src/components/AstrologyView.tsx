import React, { useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { AstrologyMap, AstroAstroPosition, UserProfile } from '../types';
import CircularChart from './CircularChart';
import { 
  Orbit, 
  Compass, 
  User, 
  Globe, 
  MessageSquare, 
  Plus, 
  Minus,
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Heart, 
  Briefcase, 
  Activity, 
  Users, 
  Sparkles, 
  Calendar,
  ArrowRight,
  Scale
} from 'lucide-react';

interface AstrologyViewProps {
  mapData: AstrologyMap;
  user: UserProfile;
  onUpdateMainMap: (birthDetails: any) => void;
  readOnly?: boolean;
}

interface ExtraMap {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
}

const AstrologyView = memo(function AstrologyView({ mapData, user, onUpdateMainMap, readOnly = false }: AstrologyViewProps) {
  const { t: i18nT, i18n } = useTranslation();

  const LOCAL_UI_TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
      "Resumo / Trânsitos": "Summary / Transits",
      "Guia de trânsitos contínuos e influências energéticas ativas no seu mapa": "Guide to ongoing transits and active energetic influences in your chart",
      "Resumo Geral": "General Summary",
      "Trânsitos Ativos": "Active Transits",
      "RESUMO DE HOJE": "TODAY'S SUMMARY",
      "Trânsitos de": "Transits of",
      "Buscador": "Seeker",
      "Você tem 8 influências ativas": "You have 8 active influences",
      "De": "From",
      "a": "to",
      "Ver menos": "Show less",
      "Ler mais": "Read more"
    },
    es: {
      "Resumo / Trânsitos": "Resumen / Tránsitos",
      "Guia de trânsitos contínuos e influências energéticas ativas no seu mapa": "Guía de tránsitos continuos e influencias energéticas activas en tu carta",
      "Resumo Geral": "Resumen General",
      "Trânsitos Ativos": "Tránsitos Activos",
      "RESUMO DE HOJE": "RESUMEN DE HOY",
      "Trânsitos de": "Tránsitos de",
      "Buscador": "Buscador",
      "Você tem 8 influências ativas": "Tienes 8 influencias activas",
      "De": "De",
      "a": "a",
      "Ver menos": "Ver menos",
      "Ler mais": "Leer más"
    },
    de: {
      "Resumo / Trânsitos": "Zusammenfassung / Transite",
      "Guia de trânsitos contínuos e influências energéticas ativas no seu mapa": "Leitfaden für laufende Transite und aktive energetische Einflüsse in Ihrem Horoskop",
      "Resumo Geral": "Allgemeine Zusammenfassung",
      "Trânsitos Ativos": "Aktive Transite",
      "RESUMO DE HOJE": "HEUTIGE ZUSAMMENFASSUNG",
      "Trânsitos de": "Transite von",
      "Buscador": "Suchender",
      "Você tem 8 influências ativas": "Sie haben 8 aktive Einflüsse",
      "De": "Vom",
      "a": "bis",
      "Ver menos": "Weniger anzeigen",
      "Ler mais": "Mehr lesen"
    },
    fr: {
      "Resumo / Trânsitos": "Résumé / Transits",
      "Guia de trânsitos contínuos e influências energéticas ativas no seu mapa": "Guide des transits en cours et des influences énergétiques actives dans votre carte",
      "Resumo Geral": "Résumé Général",
      "Trânsitos Ativos": "Transits Actifs",
      "RESUMO DE HOJE": "RÉSUMÉ D'AUJOURD'HUI",
      "Trânsitos de": "Transits de",
      "Buscador": "Chercheur",
      "Você tem 8 influências ativas": "Vous avez 8 influences actives",
      "De": "Du",
      "a": "au",
      "Ver menos": "Voir moins",
      "Ler mais": "En savoir plus"
    }
  };

  const t = (text: string) => {
    if (!text) return "";
    const currentLang = (i18n.language || 'pt').toLowerCase();

    // 1. Regex Match for Astro Position Description
    // "Exibindo posição do astro [Astro] no signo de [Signo] na Casa [Casa]."
    const matchAstro = text.match(/^Exibindo posição do astro (.*?) no signo de (.*?) na Casa (\d+)\.$/);
    if (matchAstro) {
      const pName = matchAstro[1];
      const pSign = matchAstro[2];
      const pHouse = matchAstro[3];

      const transName = t(pName);
      const transSign = t(pSign);

      if (currentLang === 'en') {
        return `Displaying position of the planet ${transName} in the sign of ${transSign} in House ${pHouse}.`;
      } else if (currentLang === 'es') {
        return `Mostrando la posición del astro ${transName} en el signo de ${transSign} en la Casa ${pHouse}.`;
      } else if (currentLang === 'de') {
        return `Anzeige der Position des Gestirns ${transName} im Zeichen ${transSign} im ${pHouse}. Haus.`;
      } else if (currentLang === 'fr') {
        return `Affichage de la position de l'astre ${transName} dans le signe de ${transSign} dans la Maison ${pHouse}.`;
      }
      return `Exibindo posição do astro ${transName} no signo de ${transSign} na Casa ${pHouse}.`;
    }

    // 2. Regex Match for House Cusp Interpretation
    // "A cúspide da Casa [Casa] inicia no signo de [Signo] com graus exatos de [Graus]° de alinhamento Placidus."
    const matchHouse = text.match(/^A cúspide da Casa (\d+) inicia no signo de (.*?) com graus exatos de (.*?)° de alinhamento Placidus\.$/);
    if (matchHouse) {
      const hNum = matchHouse[1];
      const hSign = matchHouse[2];
      const hDegree = matchHouse[3];

      const transSign = t(hSign);

      if (currentLang === 'en') {
        return `The cusp of House ${hNum} begins in the sign of ${transSign} with exact degrees of ${hDegree}° of Placidus alignment.`;
      } else if (currentLang === 'es') {
        return `La cúspide de la Casa ${hNum} comienza en el signo de ${transSign} con grados exactos de ${hDegree}° de alineación Placidus.`;
      } else if (currentLang === 'de') {
        return `Die Spitze des ${hNum}. Hauses beginnt im Zeichen ${transSign} mit exakten Graden von ${hDegree}° der Placidus-Ausrichtung.`;
      } else if (currentLang === 'fr') {
        return `La cuspide de la Maison ${hNum} commence dans le signe de ${transSign} avec des degrés exacts de ${hDegree}° d'alignement Placidus.`;
      }
      return `A cúspide da Casa ${hNum} inicia no signo de ${transSign} com graus exatos de ${hDegree}° de alinhamento Placidus.`;
    }

    // 3. Regex Match for Aspect Interpretation
    // "Conexão celeste dinâmica de [Aspecto] entre [Astro1] e [Astro2]."
    const matchAspect = text.match(/^Conexão celeste dinâmica de (.*?) entre (.*?) e (.*?)\.$/);
    if (matchAspect) {
      const aType = matchAspect[1];
      const p1 = matchAspect[2];
      const p2 = matchAspect[3];

      const transType = t(aType);
      const transP1 = t(p1);
      const transP2 = t(p2);

      if (currentLang === 'en') {
        return `Dynamic celestial connection of ${transType} between ${transP1} and ${transP2}.`;
      } else if (currentLang === 'es') {
        return `Conexión celeste dinámica de ${transType} entre ${transP1} y ${transP2}.`;
      } else if (currentLang === 'de') {
        return `Dynamische himmlische Verbindung von ${transType} zwischen ${transP1} und ${transP2}.`;
      } else if (currentLang === 'fr') {
        return `Connexion céleste dynamique de ${transType} entre ${transP1} et ${transP2}.`;
      }
      return `Conexão celeste dinâmica de ${transType} entre ${transP1} e ${transP2}.`;
    }

    if (LOCAL_UI_TRANSLATIONS[currentLang]?.[text]) {
      return LOCAL_UI_TRANSLATIONS[currentLang][text];
    }
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (i18n.language as Language) || 'pt');
    }
    return res;
  };
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'astros' | 'casas' | 'aspectos' | 'extras'>('geral');
  const [selectedAstro, setSelectedAstro] = useState<AstroAstroPosition | null>(() => mapData?.astros?.[0] || null);
  const [selectedHouse, setSelectedHouse] = useState<number>(1);

  // New States for Resumo/Trânsitos Section
  const [resoTab, setResoTab] = useState<'resumo' | 'transitos'>('resumo');
  const [expandedResoCats, setExpandedResoCats] = useState<Record<string, boolean>>({});
  const [expandedTrans, setExpandedTrans] = useState<Record<number, boolean>>({});

  const solSign = useMemo(() => mapData?.astros?.find(a => a.name === "Sol")?.sign || "Aquário", [mapData]);
  const luaSign = useMemo(() => mapData?.astros?.find(a => a.name === "Lua")?.sign || "Peixes", [mapData]);
  const marteSign = useMemo(() => mapData?.astros?.find(a => a.name === "Marte")?.sign || "Aquário", [mapData]);
  const uranoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Urano")?.sign || "Capricórnio", [mapData]);
  const netunoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Netuno")?.sign || "Capricórnio", [mapData]);
  const plutaoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Plutão")?.sign || "Escorpião", [mapData]);
  const saturnoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Saturno")?.sign || "Peixes", [mapData]);

  // Balança Astrológica dynamic tab and calculations
  const [balancaTab, setBalancaTab] = useState<'signos' | 'casas' | 'planetas'>('signos');

  const balancaData = useMemo(() => {
    // 1. SIGNOS
    const signsList = [
      { name: "Áries", symbol: "♈", element: "Fogo" },
      { name: "Touro", symbol: "♉", element: "Terra" },
      { name: "Gêmeos", symbol: "♊", element: "Ar" },
      { name: "Câncer", symbol: "♋", element: "Água" },
      { name: "Leão", symbol: "♌", element: "Fogo" },
      { name: "Virgem", symbol: "♍", element: "Terra" },
      { name: "Libra", symbol: "♎", element: "Ar" },
      { name: "Escorpião", symbol: "♏", element: "Água" },
      { name: "Sagitário", symbol: "♐", element: "Fogo" },
      { name: "Capricórnio", symbol: "♑", element: "Terra" },
      { name: "Aquário", symbol: "♒", element: "Ar" },
      { name: "Peixes", symbol: "♓", element: "Água" }
    ];

    const signs = signsList.map(s => {
      let force = 10;
      let harmony = 60;
      
      const planetsInSign = mapData?.astros?.filter(a => a.sign === s.name) || [];
      planetsInSign.forEach(p => {
        if (p.name === "Sol" || p.name === "Lua" || p.name === "Ascendente") {
          force += 35;
        } else {
          force += 20;
        }
      });
      
      const planetNamesInSign = planetsInSign.map(p => p.name);
      const aspectsInSign = mapData?.aspects?.filter(asp => 
        planetNamesInSign.includes(asp.planet1) || planetNamesInSign.includes(asp.planet2)
      ) || [];
      
      aspectsInSign.forEach(asp => {
        if (asp.aspectType === "Trígono" || asp.aspectType === "Sextil") {
          harmony += 12;
        } else if (asp.aspectType === "Quadratura" || asp.aspectType === "Oposição") {
          harmony -= 12;
        } else {
          harmony += 5; // Conjunção
        }
      });
      
      return {
        name: s.name,
        symbol: s.symbol,
        subtitle: s.element,
        force: Math.min(100, Math.max(10, force)),
        harmony: Math.min(100, Math.max(10, harmony))
      };
    });

    // 2. CASAS (H1 to H12)
    const houses = (mapData?.houses || []).map(h => {
      let force = 15;
      if ([1, 4, 7, 10].includes(h.number)) force = 40; // Angular
      else if ([2, 5, 8, 11].includes(h.number)) force = 25; // Sucedente
      
      let harmony = 60;
      
      if (h.planet) {
        force += 35;
        const planetAspects = mapData?.aspects?.filter(asp => 
          asp.planet1 === h.planet || asp.planet2 === h.planet
        ) || [];
        planetAspects.forEach(asp => {
          if (asp.aspectType === "Trígono" || asp.aspectType === "Sextil") {
            harmony += 15;
          } else if (asp.aspectType === "Quadratura" || asp.aspectType === "Oposição") {
            harmony -= 15;
          } else {
            harmony += 6;
          }
        });
      }
      
      return {
        name: `Casa ${h.number}`,
        symbol: `H${h.number}`,
        subtitle: h.sign,
        force: Math.min(100, Math.max(10, force)),
        harmony: Math.min(100, Math.max(10, harmony))
      };
    });

    // 3. PLANETAS
    const planetBases: Record<string, { baseForce: number; symbol: string }> = {
      "Sol": { baseForce: 85, symbol: "☉" },
      "Lua": { baseForce: 85, symbol: "☽" },
      "Ascendente": { baseForce: 90, symbol: "Asc" },
      "Mercúrio": { baseForce: 65, symbol: "☿" },
      "Vênus": { baseForce: 70, symbol: "♀" },
      "Marte": { baseForce: 70, symbol: "♂" },
      "Júpiter": { baseForce: 60, symbol: "♃" },
      "Saturno": { baseForce: 55, symbol: "♄" },
      "Urano": { baseForce: 45, symbol: "♅" },
      "Netuno": { baseForce: 45, symbol: "♆" },
      "Plutão": { baseForce: 45, symbol: "♇" },
      "Meio do Céu": { baseForce: 50, symbol: "MC" },
      "Quíron": { baseForce: 40, symbol: "⚷" }
    };

    const planetas = (mapData?.astros || []).map(a => {
      const config = planetBases[a.name] || { baseForce: 50, symbol: "★" };
      let force = config.baseForce;
      let harmony = 60;
      
      const pAspects = mapData?.aspects?.filter(asp => 
        asp.planet1 === a.name || asp.planet2 === a.name
      ) || [];
      
      force += pAspects.length * 4;
      
      pAspects.forEach(asp => {
        if (asp.aspectType === "Trígono" || asp.aspectType === "Sextil") {
          harmony += 12;
        } else if (asp.aspectType === "Quadratura" || asp.aspectType === "Oposição") {
          harmony -= 14;
        } else {
          harmony += 6;
        }
      });
      
      if (a.extraInfo) {
        if (a.extraInfo.includes("domicílio") || a.extraInfo.includes("exaltação")) {
          force += 12;
          harmony += 10;
        } else if (a.extraInfo.includes("exílio") || a.extraInfo.includes("queda")) {
          force -= 8;
          harmony -= 10;
        }
      }
      
      return {
        name: a.name,
        symbol: config.symbol,
        subtitle: a.sign,
        force: Math.min(100, Math.max(10, force)),
        harmony: Math.min(100, Math.max(10, harmony))
      };
    });

    return {
      signos: signs,
      casas: houses,
      planetas: planetas
    };
  }, [mapData]);

  const toggleResoCat = (cat: string) => {
    setExpandedResoCats(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const toggleTransit = (idx: number) => {
    setExpandedTrans(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const activeLanguage = (i18n.language || 'pt').toLowerCase();

  const resoCategories = useMemo(() => {
    const data: Record<string, Array<{ id: string; label: string; description: string }>> = {
      pt: [
        {
          id: "amor",
          label: "Amor e relacionamento",
          description: `As posições planetárias de hoje harmonizam com seu Sol em ${solSign}. É um momento auspicioso para diálogos profundos com seu par ou para cultivar a vulnerabilidade consciente se estiver buscando um novo elo. A tônica é a escuta generosa, permitindo que a sinergia amorosa se amplie.`
        },
        {
          id: "carreira",
          label: "Dinheiro e Carreira",
          description: `Seu Sol em ${solSign} recebe aspectos favoráveis de estabilidade material. Bom para organizar planos, revisar orçamentos de longo prazo e propor parcerias construtivas. O foco no pragmatismo evitará escolhas precipitadas sob impulsividade emocional.`
        },
        {
          id: "saude",
          label: "Saúde e Bem-estar",
          description: `O fluxo vital convida você a reequilibrar seus hábitos diários. Beba mais água purificada, faça alongamentos suaves pela manhã e considere desacelerar um pouco o ritmo mental acelerado. O estresse acumulado pode ser dissolvido com silêncio e repouso de alta qualidade.`
        },
        {
          id: "familia",
          label: "Família e amigos",
          description: `As relações mais próximas ganham calor, acolhimento e escuta ativa sob a configuração celeste corrente. Um gesto carinhoso ou uma conversa sincera e desarmada trará resoluções de pendências antigas. Conecte-se com quem genuinamente apoia sua verdadeira essência.`
        },
        {
          id: "espiritualidade",
          label: "Espiritualidade",
          description: `Seu portal espiritual de hoje está amplamente expandido, estimulado pelos transições em casas astrológicas sutis do seu mapa de nascimento. Excelente momento para rituais pessoais, orações, leitura oracular de tarot ou meditação profunda. Sua intuição estará extremamente aguçada, trazendo respostas nítidas.`
        },
        {
          id: "periodo",
          label: "O seu período atual",
          description: `Você está atravessando um ciclo de profunda maturação pessoal e renascimento. A fusão das forças celestes de trânsito em seu mapa cobra estruturação interna e resiliência espiritual. É hora de desapegar das velhas estruturas que não servem mais e semear os alicerces do seu novo ano zodiacal.`
        }
      ],
      en: [
        {
          id: "amor",
          label: "Love & Relationships",
          description: `Today's planetary positions harmonize with your Sun in ${solSign}. It is an auspicious moment for deep dialogues with your partner or for cultivating conscious vulnerability if you are seeking a new connection. The key is generous listening, allowing love synergy to expand.`
        },
        {
          id: "carreira",
          label: "Money & Career",
          description: `Your Sun in ${solSign} receives favorable aspects of material stability. Good for organizing plans, reviewing long-term budgets, and proposing constructive partnerships. The focus on pragmatism will prevent hasty choices under emotional impulsivity.`
        },
        {
          id: "saude",
          label: "Health & Well-being",
          description: `The vital flow invites you to rebalance your daily habits. Drink more purified water, do gentle stretches in the morning, and consider slowing down your fast mental pace. Accumulated stress can be dissolved with silence and high-quality rest.`
        },
        {
          id: "familia",
          label: "Family & Friends",
          description: `Closer relationships gain warmth, acceptance, and active listening under the current celestial configuration. A warm gesture or a sincere and open conversation will bring resolutions to old pending matters. Connect with those who genuinely support your true essence.`
        },
        {
          id: "espiritualidade",
          label: "Spirituality",
          description: `Your spiritual portal today is widely expanded, stimulated by transitions in subtle astrological houses of your birth chart. Excellent time for personal rituals, prayers, oracle tarot reading, or deep meditation. Your intuition will be extremely sharp, bringing clear answers.`
        },
        {
          id: "periodo",
          label: "Your Current Period",
          description: `You are going through a cycle of deep personal maturation and rebirth. The fusion of celestial transit forces in your chart demands internal structuring and spiritual resilience. It is time to let go of old structures that no longer serve you and sow the foundations of your new zodiac year.`
        }
      ],
      es: [
        {
          id: "amor",
          label: "Amor y relaciones",
          description: `Las posiciones planetarias de hoy armonizan con tu Sol en ${solSign}. Es un momento propicio para diálogos profundos con tu pareja o para cultivar la vulnerabilidad consciente si estás buscando un nuevo vínculo. La clave es la escucha generosa, permitiendo que la sinergia amorosa se amplíe.`
        },
        {
          id: "carreira",
          label: "Dinero y carrera",
          description: `Tu Sol en ${solSign} recibe aspectos favorables de estabilidad material. Bueno para organizar planes, revisar presupuestos a largo plazo y proponer asociaciones constructivas. El enfoque en el pragmatismo evitará elecciones apresuradas bajo impulsividad emocional.`
        },
        {
          id: "saude",
          label: "Salud y bienestar",
          description: `El flujo vital te invita a reequilibrar tus hábitos diarios. Bebe más agua purificada, haz estiramientos suaves por la mañana y considera desacelerar un poco el ritmo mental acelerado. El estrés acumulado se puede disolver con silencio y descanso de alta calidad.`
        },
        {
          id: "familia",
          label: "Familia y amigos",
          description: `Las relaciones más cercanas ganan calidez, acogida y escucha activa bajo la configuración celestial actual. Un gesto cariñoso o una conversa sincera y desarmada traerá resoluciones de asuntos pendientes antiguos. Conéctate con quienes genuinamente apoyan tu verdadera esencia.`
        },
        {
          id: "espiritualidade",
          label: "Espiritualidad",
          description: `Tu portal espiritual de hoy está ampliamente deparado, estimulado por las transiciones en casas astrológicas sutiles de tu carta natal. Excelente momento para rituales personales, oraciones, lectura oracular de tarot o meditación profunda. Tu intuición estará extremadamente aguda, trayendo respuestas claras.`
        },
        {
          id: "periodo",
          label: "Tu período actual",
          description: `Estás atravesando un ciclo de profunda maduración personal y renacimiento. La fusión de las fuerzas celestes de tránsito en tu carta exige estructuración interna y resiliencia espiritual. Es hora de dejar ir las viejas estructuras que ya no sirven y sembrar las bases de tu nuevo año zodiacal.`
        }
      ],
      de: [
        {
          id: "amor",
          label: "Liebe & Beziehungen",
          description: `Die heutigen Planetenkonstellationen harmonieren mit Ihrer Sonne in ${solSign}. Es ist ein günstiger Moment für tiefe Gespräche mit Ihrem Partner oder zur Pflege bewusster Verwundbarkeit, wenn Sie eine neue Verbindung suchen. Der Schlüssel liegt im großzügigen Zuhören, sodass sich die Liebessynergie entfalten kann.`
        },
        {
          id: "carreira",
          label: "Geld & Karriere",
          description: `Ihre Sonne in ${solSign} erhält günstige Aspekte materieller Stabilität. Gut geeignet, um Pläne zu organisieren, langfristige Budgets zu überprüfen und konstruktive Partnerschaften vorzuschlagen. Der Fokus auf Pragmatismus verhindert überstürzte Entscheidungen unter emotionaler Impulsivität.`
        },
        {
          id: "saude",
          label: "Gesundheit & Wohlbefinden",
          description: `Der Lebensfluss lädt Sie ein, Ihre täglichen Gewohnheiten wieder ins Gleichgewicht zu bringen. Trinken Sie mehr gereinigtes Wasser, machen Sie morgens leichte Dehnübungen und verlangsamen Sie Ihr schnelles mentales Tempo. Angesammelter Stress kann durch Stille und hochwertige Erholung abgebaut werden.`
        },
        {
          id: "familia",
          label: "Familie & Freunde",
          description: `Engere Beziehungen gewinnen unter der aktuellen Himmelskonstellation an Wärme, Akzeptanz und aktivem Zuhören. Eine liebevolle Geste oder ein aufrichtiges, offenes Gespräch bringt Klärung bei alten Angelegenheiten. Verbinden Sie sich mit Menschen, die Ihre wahre Essenz aufrichtig unterstützen.`
        },
        {
          id: "espiritualidade",
          label: "Spiritualität",
          description: `Ihr heutiges spirituelles Portal ist weit geöffnet, angeregt durch Transite in subtilen astrologischen Häusern Ihres Geburtshoroskops. Hervorragende Zeit für persönliche Rituale, Gebete, Tarot-Sitzungen oder tiefe Meditation. Ihre Intuition wird extrem scharf sein und klare Antworten bringen.`
        },
        {
          id: "periodo",
          label: "Ihr aktueller Zeitraum",
          description: `Sie durchlaufen einen Zyklus tiefer persönlicher Reifung und Wiedergeburt. Die Verschmelzung der himmlischen Transitkräfte in Ihrem Horoskop erfordert eine innere Strukturierung und spirituelle Widerstandskraft. Es ist an der Zeit, alte Strukturen loszulassen, die Ihnen nicht mehr dienen, und das Fundament für Ihr neues Tierkreisjahr zu legen.`
        }
      ],
      fr: [
        {
          id: "amor",
          label: "Amour & Relations",
          description: `Les positions planétaires d'aujourd'hui s'harmonisent avec votre Soleil en ${solSign}. C'est un moment propice pour des dialogues profonds avec votre partenaire ou pour cultiver une vulnérabilité consciente si vous recherchez une nouvelle relation. L'accent est mis sur l'écoute généreuse, permettant à la synergie amoureuse de se développer.`
        },
        {
          id: "carreira",
          label: "Argent & Carrière",
          description: `Votre Soleil en ${solSign} reçoit des aspects favorables de stabilité matérielle. Idéal pour organiser vos plans, revoir les budgets à l'aide de pragmatisme et proposer des partenariats constructifs. L'accent mis sur le pragmatisme évitera les choix hâtifs sous l'impulsion émotionnelle.`
        },
        {
          id: "saude",
          label: "Santé & Bien-être",
          description: `Le flux vital vous invite à rééquilibrer vos habitudes quotidiennes. Buvez plus d'eau purifiée, faites des étirements doux le matin et pensez à ralentir votre rythme mental effréné. Le stress accumulé peut être dissous par le silence et un repos de haute qualité.`
        },
        {
          id: "familia",
          label: "Famille & Amis",
          description: `Les relations les plus proches gagnent en chaleur, en accueil et en écoute active sous la configuration céleste actuelle. Un geste affectueux ou une conversation sincère et désarmée apportera des résolutions à d'anciens différends. Connectez-vous avec ceux qui soutiennent sincèrement votre véritable essence.`
        },
        {
          id: "espiritualidade",
          label: "Spiritualité",
          description: `Votre portail spirituel d'aujourd'hui est largement élargi, stimulé par les transits dans les maisons astrologiques subtiles de votre carte du ciel. Excellent moment pour des rituels personnels, des prières, une lecture d'oracle de tarot ou une méditation profonde. Votre intuition sera extrêmement aiguisée, apportant des réponses claires.`
        },
        {
          id: "periodo",
          label: "Votre période actuelle",
          description: `Vous traversez un cycle de profonde maturation personnelle et de renaissance. La fusion des forces célestes de transit dans votre carte exige une structuration interne et une résilience spirituelle. Il émet d'anciens concepts qui ne servent plus et sème les fondations de votre nouvelle année zodiacale.`
        }
      ]
    };

    const icons: Record<string, React.ReactNode> = {
      amor: <Heart className="w-4 h-4 text-rose-400" />,
      carreira: <Briefcase className="w-4 h-4 text-emerald-400" />,
      saude: <Activity className="w-4 h-4 text-sky-400" />,
      familia: <Users className="w-4 h-4 text-indigo-400" />,
      espiritualidade: <Sparkles className="w-4 h-4 text-purple-400" />,
      periodo: <Orbit className="w-4 h-4 text-amber-400" />
    };

    const colors: Record<string, string> = {
      amor: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      carreira: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      saude: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      familia: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      espiritualidade: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      periodo: "bg-amber-500/10 border-amber-500/20 text-amber-500"
    };

    const langList = data[activeLanguage] || data.pt;
    return langList.map(item => ({
      ...item,
      icon: icons[item.id],
      colorClass: colors[item.id]
    }));
  }, [solSign, activeLanguage]);

  const getRelativeDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const transitsList = useMemo(() => {
    const data: Record<string, Array<{ title: string; aspect: string; description: string }>> = {
      pt: [
        {
          title: "Abrande os ânimos para não sair dos trilhos",
          aspect: `Marte está aos 19º de Touro (passando pela sua Casa 12), em Quadratura com seu Sol natal aos 22° de ${solSign}`,
          description: "Muita energia acumulada, força de vontade e um desgosto por qualquer tipo de limitação. Abrande um pouco os ânimos para não sair dos trilhos. Permaneça sob controle e canalize essa poderosa impetuosidade física de forma construtiva em seus projetos profissionais."
        },
        {
          title: "Envolva-se com seu lado espiritual",
          aspect: `Marte está aos 19º de Touro (passando pela sua Casa 12), em Trigono a seu Netuno natal aos 21° de ${netunoSign}`,
          description: "Bom momento para se envolver com atividades mais espirituais ou meditativas. Você pode estar se sentindo mais imaginativo e intuitivo. Concentre-se em seu interior e canalize essa inspiração fluida em rituais diários e conexões empáticas."
        },
        {
          title: "Mais vitalidade, coragem e confiança",
          aspect: `Sol está aos 23º de Gêmeos (passando pela sua Casa 2), em Trigono a seu Sol natal aos 22º de ${solSign}`,
          description: "Período de vitalidade e criatividade mais elevadas. Interações com crianças e com quem possui autoridade estão igualmente favorecidos, assim como uma tendência a se sentir confiante e radiante em seus propósitos do dia."
        },
        {
          title: "Transformação, regeneração e mudanças profundas",
          aspect: `Júpiter está aos 26º de Câncer (passando pela sua Casa 3), em Trigono a seu Plutão natal aos 27º de ${plutaoSign}`,
          description: "Trânsito que traz mudanças profundas em termos de regeneração física e espiritual. Durante esse trânsito, podemos entrar em contato com conteúdos que estão em nosso inconsciente, permitindo purgar medos e obter autotransformação e sabedoria terapêutica profunda."
        },
        {
          title: "Reorganização interna e externa",
          aspect: `Urano está aos 02º de Gêmeos (passando pela sua Casa 1), em Quadratura com seu Lua natal aos 04° de ${luaSign}`,
          description: "Durante este período de média ou longa duração, pode haver um aumento do grau de irritabilidade, uma crescente intranquilidade em que as emoções tendem a ficar mais instáveis ou flutuantes. Exercite o ancoramento, liberando o apego ao controle absoluto."
        },
        {
          title: "O valor da liberdade",
          aspect: `Júpiter está aos 26º de Câncer (passando pela sua Casa 3), em Oposição a seu Urano natal aos 23º de ${uranoSign}`,
          description: "Ao longo desse trânsito podem surgir problemas com parceiros e amigos devido às mudanças abruptas que o indivíduo tende a começar a fazer na própria vida. Qualquer tentativa exterior de limitação estimula um ímpeto de revolta libertária e rebeldia criativa."
        },
        {
          title: "Agindo com disciplina",
          aspect: `Saturno está aos 13º de Aries (passando pela sua Casa 11), em Sextil a seu Marte natal aos 11º de ${marteSign}`,
          description: "Um período estabilizador em que a disciplina e a sua saúde tende a ser favorecida. Pode haver diminuição de estados inflamatórios e de modo geral, os efeitos observados trazem maior senso de dever, resiliência física e foco pragmático de longo prazo."
        },
        {
          title: "Ressignificando conceitos",
          aspect: `Urano está aos 02º de Gêmeos (passando pela sua Casa 1), em Quadratura com seu Saturno natal aos 01º de ${saturnoSign}`,
          description: "Este período costuma ser um divisor de águas, pois tudo que de alguma forma te impedia de exercer a sua autonomia sobre a própria vida nos últimos tempos poderá cair por terra, exigindo uma reestruturação realista e libertação de dependências obsoletas."
        }
      ],
      en: [
        {
          title: "Calm your spirits so you don't go off track",
          aspect: `Mars is at 19º of Taurus (transiting your 12th House), in Square with your natal Sun at 22° of ${solSign}`,
          description: "Lots of accumulated energy, willpower, and a distaste for any kind of limitation. Calm your spirits a bit so you don't go off track. Stay in control and channel this powerful physical impetuosity constructively into your professional projects."
        },
        {
          title: "Connect with your spiritual side",
          aspect: `Mars is at 19º of Taurus (transiting your 12th House), in Trine to your natal Neptune at 21° of ${netunoSign}`,
          description: "Good time to engage in more spiritual or meditative activities. You may be feeling more imaginative and intuitive. Focus inward and channel this fluid inspiration into daily rituals and empathetic connections."
        },
        {
          title: "More vitality, courage, and confidence",
          aspect: `Sun is at 23º of Gemini (transiting your 2nd House), in Trine to your natal Sun at 22º of ${solSign}`,
          description: "Period of higher vitality and creativity. Interactions with children and authority figures are equally favored, as well as a tendency to feel confident and radiant in your daily purposes."
        },
        {
          title: "Transformation, regeneration, and deep changes",
          aspect: `Jupiter is at 26º of Cancer (transiting your 3rd House), in Trine to your natal Pluto at 27º of ${plutaoSign}`,
          description: "Transit that brings deep changes in terms of physical and spiritual regeneration. During this transit, we can connect with content in our unconscious, allowing us to purge fears and obtain self-transformation and deep therapeutic wisdom."
        },
        {
          title: "Internal and external reorganization",
          aspect: `Uranus is at 02º of Gemini (transiting your 1st House), in Square with your natal Moon at 04° of ${luaSign}`,
          description: "During this medium or long-term period, there may be an increase in irritability, a growing restlessness where emotions tend to become more unstable or fluctuating. Practice grounding, releasing the attachment to absolute control."
        },
        {
          title: "The value of freedom",
          aspect: `Jupiter is at 26º of Cancer (transiting your 3rd House), in Opposition to your natal Uranus at 23º of ${uranoSign}`,
          description: "During this transit, issues with partners and friends may arise due to the abrupt changes the individual begins to make in their life. Any external attempt at limitation stimulates an impulse of libertarian revolt and creative rebellion."
        },
        {
          title: "Acting with discipline",
          aspect: `Saturn is at 13º of Aries (transiting your 11th House), in Sextile to your natal Mars at 11º of ${marteSign}`,
          description: "A stabilizing period where discipline and health tend to be favored. There may be a decrease in inflammatory states and, overall, the observed effects bring a greater sense of duty, physical resilience, and long-term pragmatic focus."
        },
        {
          title: "Redefining concepts",
          aspect: `Uranus is at 02º of Gemini (transiting your 1st House), in Square with your natal Saturn at 01º of ${saturnoSign}`,
          description: "This period is usually a turning point, because everything that in some way prevented you from exercising your autonomy over your own life in recent times may fall apart, requiring a realistic restructuring and liberation from obsolete dependencies."
        }
      ],
      es: [
        {
          title: "Cálmate para no salirte del camino",
          aspect: `Marte está a los 19º de Tauro (pasando por tu Casa 12), en Cuadratura con tu Sol natal a los 22° de ${solSign}`,
          description: "Mucha energía acumulada, fuerza de voluntad y aversión a cualquier tipo de limitación. Cálmate un poco para no salirte del camino. Mantén el control y canaliza esta poderosa impetuosidad física de forma constructiva en tus proyectos profesionales."
        },
        {
          title: "Conéctate con tu lado espiritual",
          aspect: `Marte está a los 19º de Tauro (pasando por tu Casa 12), en Trígono con tu Neptuno natal a los 21° de ${netunoSign}`,
          description: "Buen momento para involucrarse en actividades más espirituales o meditativas. Es posible que te sientas más imaginativo e intuitivo. Concéntrate en tu interior y canaliza esta inspiración fluida en rituales diarios y conexiones empáticas."
        },
        {
          title: "Más vitalidad, coraje y confianza",
          aspect: `El Sol está a los 23º de Géminis (pasando por tu Casa 2), en Trígono con tu Sol natal a los 22º de ${solSign}`,
          description: "Período de mayor vitalidad y creatividad. Se favorecen las interacciones con niños y personas de autoridad, así como la tendencia a sentirse seguro y radiante en sus propósitos del día."
        },
        {
          title: "Transformación, regeneración y cambios profundos",
          aspect: `Júpiter está a los 26º de Cáncer (pasando por tu Casa 3), en Trígono con tu Plutón natal a los 27º de ${plutaoSign}`,
          description: "Tránsito que trae cambios profundos en términos de regeneración física y espiritual. Durante este tránsito, podemos entrar en contacto con contenidos en nuestro inconsciente, permitiendo purgar miedos y obtener autotransformación y profunda sabiduría terapéutica."
        },
        {
          title: "Reorganización interna y externa",
          aspect: `Urano está a los 02º de Géminis (pasando por tu Casa 1), en Cuadratura con tu Luna natal a los 04° de ${luaSign}`,
          description: "Durante este período de mediana o larga duración, puede haber un aumento en la irritabilidad, una creciente inquietud donde las emociones tienden a volverse más inestables o fluctuantes. Practica el enraizamiento, liberando el apego al control absoluto."
        },
        {
          title: "El valor de la libertad",
          aspect: `Júpiter está a los 26º de Cáncer (pasando por tu Casa 3), en Oposición con tu Urano natal a los 23º de ${uranoSign}`,
          description: "A lo largo de este tránsito, pueden surgir problemas con socios y amigos debido a los cambios abruptos que el individuo comienza a realizar en su vida. Cualquier intento externo de limitación estimula un impulso de revuelta libertaria y rebeldía creativa."
        },
        {
          title: "Actuar con disciplina",
          aspect: `Saturno está a los 13º de Aries (pasando por tu Casa 11), en Sextil con tu Marte natal a los 11º de ${marteSign}`,
          description: "Un período estabilizador donde la disciplina y la salud tienden a verse favorecidas. Puede haber una disminución de los estados inflamatorios y, en general, los efectos observados traen un mayor sentido del deber, resiliencia física y enfoque pragmático a largo prazo."
        },
        {
          title: "Redefiniendo conceptos",
          aspect: `Urano está a los 02º de Géminis (pasando por tu Casa 1), en Cuadratura con tu Saturno natal a los 01º de ${saturnoSign}`,
          description: "Este período suele ser un punto de inflexión, ya que todo lo que de alguna manera te impedía ejercer tu autonomía sobre tu propia vida en los últimos tiempos puede desmoronarse, exigiendo una reestructuración realista y la liberación de dependencias obsoletas."
        }
      ],
      de: [
        {
          title: "Beruhigen Sie Ihre Gemüter, um nicht vom Weg abzukommen",
          aspect: `Mars steht auf 19º Stier (im Transit durch Ihr 12. Haus), im Quadrat zu Ihrer Geburts-Sonne auf 22° in ${solSign}`,
          description: "Viel aufgestaute Energie, Willenskraft und eine Abneigung gegen jegliche Art von Einschränkungen. Beruhigen Sie sich ein wenig, um nicht vom Weg abzukommen. Behalten Sie die Kontrolle und kanalisieren Sie diese kraftvolle körperliche Ungestümheit konstruktiv in Ihre beruflichen Projekte."
        },
        {
          title: "Verbinden Sie sich mit Ihrer spirituellen Seite",
          aspect: `Mars steht auf 19º Stier (im Transit durch Ihr 12. Haus), im Trigon zu Ihrem Geburts-Neptun auf 21° in ${netunoSign}`,
          description: "Gute Zeit für spirituelle oder meditative Aktivitäten. Sie fühlen sich möglicherweise fantasievoller und intuitiver. Richten Sie Ihren Fokus nach innen und kanalisieren Sie diese fließende Inspiration in tägliche Rituale und empathische Verbindungen."
        },
        {
          title: "Mehr Vitalität, Mut und Vertrauen",
          aspect: `Sonne steht auf 23º Zwillinge (im Transit durch Ihr 2. Haus), im Trigon zu Ihrer Geburts-Sonne auf 22º in ${solSign}`,
          description: "Zeit für gesteigerte Vitalität und Kreativität. Interaktionen mit Kindern und Autoritätspersonen werden gleichermaßen begünstigt, ebenso wie die Tendenz, sich in Ihren täglichen Vorhaben zuversichtlich und strahlend zu fühlen."
        },
        {
          title: "Transformation, Regeneration und tiefe Veränderungen",
          aspect: `Jupiter steht auf 26º Krebs (im Transit durch Ihr 3. Haus), im Trigon zu Ihrem Geburts-Pluto auf 27º in ${plutaoSign}`,
          description: "Transit, der tiefgreifende Veränderungen in Bezug auf körperliche und spirituelle Regeneration bringt. Während dieses Transits können wir mit Inhalten in unserem Unterbewusstsein in Kontakt treten, was es uns ermöglicht, Ängste abzubauen und Selbsttransformation sowie tiefe therapeutische Weisheit zu erlangen."
        },
        {
          title: "Innere und äußere Reorganisation",
          aspect: `Uranus steht auf 02º Zwillinge (im Transit durch Ihr 1. Haus), im Quadrat zu Ihrem Geburts-Mond auf 04° in ${luaSign}`,
          description: "Während dieser mittel- oder langfristigen Phase kann es zu erhöhter Reizbarkeit kommen, einer wachsenden Unruhe, bei der die Emotionen instabiler oder schwankender werden. Üben Sie sich in Erdung und lassen Sie das Festhalten an absoluter Kontrolle los."
        },
        {
          title: "Der Wert der Freiheit",
          aspect: `Jupiter steht auf 26º Krebs (im Transit durch Ihr 3. Haus), in Opposition zu Ihrem Geburts-Uranus auf 23º in ${uranoSign}`,
          description: "Während dieses Transits können Probleme mit Partnern und Freunden auftreten, die auf abrupte Veränderungen zurückzuführen sind, die die Person in ihrem Leben vornimmt. Jeder äußere Begrenzungsversuch stimuliert den Drang zu libertärer Revolte und kreativer Rebellion."
        },
        {
          title: "Mit Disziplin handeln",
          aspect: `Saturn steht auf 13º Widder (im Transit durch Ihr 11. Haus), im Sextil zu Ihrem Geburts-Mars auf 11º in ${marteSign}`,
          description: "Eine stabilisierende Phase, in der Disziplin und Gesundheit begünstigt werden. Entzündliche Zustände können abnehmen und insgesamt bringen die beobachteten Effekte ein größeres Pflichtbewusstsein, körperliche Widerstandsfähigkeit und einen langfristigen pragmatischen Fokus."
        },
        {
          title: "Konzepte neu definieren",
          aspect: `Uranus steht auf 02º Zwillinge (im Transit durch Ihr 1. Haus), im Quadrat zu Ihrem Geburts-Saturn auf 01º in ${saturnoSign}`,
          description: "Diese Phase ist meist ein Wendepunkt, da alles, was Sie in letzter Zeit in irgendeiner Weise daran gehindert hat, Ihre Autonomie über Ihr eigenes Leben auszuüben, zusammenbrechen kann, was eine realistische Neustrukturierung und die Befreiung von überholten Abhängigkeiten erfordert."
        }
      ],
      fr: [
        {
          title: "Calmez vos esprits pour ne pas dérailler",
          aspect: `Mars est à 19º du Taureau (passant par votre Maison 12), en Carré avec votre Soleil natal à 22° du ${solSign}`,
          description: "Beaucoup d'énergie accumulée, de volonté et un dégoût pour tout type de limitation. Calmez un peu les esprits pour ne pas dérailler. Gardez le contrôle et canalisez cette puissante impétuosité physique de manière constructive dans vos projets professionnels."
        },
        {
          title: "Connectez-vous avec votre côté spirituel",
          aspect: `Mars est à 19º du Taureau (passant par votre Maison 12), en Trigone avec votre Neptune natal à 21° du ${netunoSign}`,
          description: "Bon moment pour s'engager dans des activités plus spirituelles ou méditatives. Vous vous sentez peut-être plus imaginatif et intuitif. Concentrez-vous sur votre monde intérieur et canalisez cette inspiration fluide dans vos rituels quotidiens et vos connexions empathiques."
        },
        {
          title: "Plus de vitalité, de courage et de confiance",
          aspect: `Le Soleil est à 23º du Gémeaux (passant par votre Maison 2), en Trigone avec votre Soleil natal à 22º du ${solSign}`,
          description: "Période de vitalité et de créativité accrues. Les interactions avec les enfants et les personnes d'autorité sont également favorisées, ainsi qu'une tendance à se sentir confiant et rayonnant dans vos objectifs quotidiens."
        },
        {
          title: "Transformation, régénération et changements profonds",
          aspect: `Jupiter est à 26º du Cancer (passant par votre Maison 3), en Trigone avec votre Pluton natal à 27º du ${plutaoSign}`,
          description: "Transit qui apporte des changements profonds en termes de régénération physique et spirituelle. Durant ce transit, nous pouvons entrer en contact avec des contenus inconscients, permettant d'évacuer les peurs et d'obtenir une autotransformation et une profonde sagesse thérapeutique."
        },
        {
          title: "Réorganisation interne et externe",
          aspect: `Uranus est à 02º du Gémeaux (passant par votre Maison 1), en Carré avec votre Lune natale à 04° du ${luaSign}`,
          description: "Durant cette période de moyenne ou longue durée, il peut y avoir une augmentation de l'irritabilité, une inquiétude croissante où les émotions ont tendance à devenir instables ou fluctuantes. Pratiquez l'ancrage, en libérant l'attachement au contrôle absolu."
        },
        {
          title: "La valeur de la liberté",
          aspect: `Jupiter est à 26º du Cancer (passant par votre Maison 3), en Opposition avec votre Uranus natal à 23º du ${uranoSign}`,
          description: "Tout au long de ce transit, des problèmes avec les partenaires et les amis peuvent survenir en raison des changements abrupts que l'individu commence à opérer dans sa vie. Toute tentative extérieure de limitation stimule un élan de révolte libertaire et de rébellion créative."
        },
        {
          title: "Agir avec discipline",
          aspect: `Saturne est à 13º du Bélier (passant par votre Maison 11), en Sextile avec votre Mars natal à 11º du ${marteSign}`,
          description: "Une période stabilisatrice où la discipline et votre santé ont tendance à être favorisées. Il peut y avoir une diminution des états inflammatoires et, de manière générale, les effets observés apportent un plus grand sens du devoir, une résilience physique et un focus pragmatique à long terme."
        },
        {
          title: "Redéfinir les concepts",
          aspect: `Uranus est à 02º du Gémeaux (passant par votre Maison 1), en Carré avec votre Saturne natal à 01º du ${saturnoSign}`,
          description: "Cette période est généralement un tournant, car tout ce qui vous empêchait d'exercer votre autonomie sur votre propre vie ces derniers temps pourra s'effondrer, exigeant une restructuration réaliste et une libération des dépendances obsolètes."
        }
      ]
    };

    const list = data[activeLanguage] || data.pt;
    return list.map((item, idx) => {
      const originalDates = [
        { start: 0, end: 8 },
        { start: -1, end: 7 },
        { start: -3, end: 2 },
        { start: -14, end: 25 },
        { start: -18, end: 221 },
        { start: -37, end: 6 },
        { start: -60, end: 278 },
        { start: -78, end: 37 }
      ];
      const dates = originalDates[idx] || { start: 0, end: 1 };
      return {
        ...item,
        startDate: getRelativeDate(dates.start),
        endDate: getRelativeDate(dates.end)
      };
    });
  }, [solSign, luaSign, marteSign, saturnoSign, uranoSign, netunoSign, plutaoSign, activeLanguage]);

  // Memoize data configurations to prevent redundant renders during tab changes
  const memoizedAstros = useMemo(() => mapData?.astros || [], [mapData?.astros]);
  const memoizedHouses = useMemo(() => mapData?.houses || [], [mapData?.houses]);
  const memoizedAspects = useMemo(() => mapData?.aspects || [], [mapData?.aspects]);

  // Adjust selected astro if mapData changes
  React.useEffect(() => {
    if (mapData?.astros?.length > 0) {
      setSelectedAstro(mapData.astros[0]);
    }
  }, [mapData]);

  // Extra Maps state 
  const [extraMaps, setExtraMaps] = useState<ExtraMap[]>([]);
  const [showWarning, setShowMainMapWarning] = useState<boolean>(false);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraDate, setNewExtraDate] = useState('');
  const [newExtraTime, setNewExtraTime] = useState('');
  const [newExtraCity, setNewExtraCity] = useState('');

  // Main Map overwrite form state
  const [overwriteDate, setOverwriteDate] = useState(user.birthDate);
  const [overwriteTime, setOverwriteTime] = useState(user.birthTime);
  const [overwriteCity, setOverwriteCity] = useState(user.birthCity);

  const handleCreateExtraMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraName || !newExtraDate) return;
    if (extraMaps.length >= 2) {
      alert(t("Você atingiu o limite de 2 mapas extras permitidos na conta premium."));
      return;
    }
    setExtraMaps([...extraMaps, {
      name: newExtraName,
      birthDate: newExtraDate,
      birthTime: newExtraTime || "12:00",
      birthCity: newExtraCity || "Desconhecida"
    }]);
    setNewExtraName('');
    setNewExtraDate('');
    setNewExtraTime('');
    setNewExtraCity('');
  };

  const handleDeleteExtra = (index: number) => {
    setExtraMaps(extraMaps.filter((_, i) => i !== index));
  };

  const handleOverwriteMainMap = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMainMap({
      birthDate: overwriteDate,
      birthTime: overwriteTime,
      birthCity: overwriteCity
    });
    setShowMainMapWarning(false);
  };

  return (
    <div id="astrology-module" className="space-y-6">
      {/* Astro Tab Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-semibold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20">
              {t("Módulo Astrologia Premium")}
            </span>
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-100">
              {t("Meu Mapa Astral Completo")}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              {t("Calculado sob o sistema")} <span className="text-amber-500/80 font-mono">{t("Placidus")}</span>. {t("Entenda as configurações celestes precisas que moldam sua consciência.")}
            </p>
          </div>
          
          {!readOnly && (
            <button 
              onClick={() => setShowMainMapWarning(!showWarning)}
              className="flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-xl text-xs font-medium text-amber-500 hover:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 hover:bg-amber-500/15 transition-all duration-300 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t("Recalcular Meu Mapa")}</span>
            </button>
          )}
        </div>

        {/* Warning card for overwriting main map */}
        {!readOnly && showWarning && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-red-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-400">{t("Você já possui um mapa principal ativo!")}</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t("Ao recalcular o mapa, o atual será substituído. Se deseja criar mapas de outras pessoas sem afetar o seu, utilize a aba de")} <span className="font-semibold text-amber-500">{t("MAPAS EXTRAS")}</span>.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleOverwriteMainMap} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("DATA DE NASCIMENTO")}</label>
                <input 
                  type="date" 
                  value={overwriteDate} 
                  onChange={(e) => setOverwriteDate(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("HORA (HH:MM)")}</label>
                <input 
                  type="text" 
                  value={overwriteTime} 
                  onChange={(e) => setOverwriteTime(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  placeholder="e.g. 15:30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("CIDADE")}</label>
                <input 
                  type="text" 
                  value={overwriteCity} 
                  onChange={(e) => setOverwriteCity(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  placeholder="e.g. São Paulo"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowMainMapWarning(false)} 
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  {t("Cancelar")}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-slate-100 rounded-lg text-xs font-semibold"
                >
                  {t("Substituir Mapa Atual")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {mapData?.is_dst && (
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-slate-200 text-xs leading-relaxed flex items-start gap-3 shadow-xl animate-in fade-in duration-500">
          <span className="text-lg leading-none shrink-0 select-none">🌟</span>
          <p className="text-slate-300">
            <strong>{t("Nota de Precisão:")}</strong> {t("Identificamos que no dia, hora e local do seu nascimento estava vigorando o Horário de Verão. Plataformas de astrologia mais simples costumam errar o seu Ascendente porque esquecem de descontar essa 1 hora do relógio. Nosso sistema recalculou o céu com base na Hora Solar Real do seu nascimento, garantindo que o seu Ascendente em")} <strong>{t(mapData?.astros?.find(a => a.name === "Ascendente")?.sign || "sua data correspondente")}</strong> {t("esteja 100% correto e astronamicamente preciso!")}
          </p>
        </div>
      )}

      {/* Navigation Subtabs */}
      {/* Scroll indicator for mobile screens */}
      <div className="md:hidden flex items-center justify-between text-[10px] text-amber-500/80 font-mono tracking-wider pb-2 px-1 select-none">
        <span className="text-slate-400">{t("Seções do Mapa")}</span>
        <span className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full text-[9px] animate-pulse">
          {t("Deslize para o lado ⇄")}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('geral')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'geral' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t("Distribuição Energética")}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('astros')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'astros' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>{t("Posição dos Astros")}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('casas')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'casas' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t("Casas Astrológicas")}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('aspectos')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'aspectos' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t("Aspectos Planetários")}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('extras')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'extras' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("Mapas Extras")} ({extraMaps.length}/2)</span>
        </button>
      </div>

      {/* Main Subtab Contents */}
      {activeSubTab === 'geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Wheel Chart section */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <CircularChart astros={mapData.astros} />
            <span className="text-[10px] font-mono text-slate-500 mt-3 text-center uppercase tracking-wide">
              {t("Diagrama do firmamento no nascimento")} ({user.birthCity})
            </span>
          </div>

          {/* Elements, Qualities and polarization sliders */}
          <div className="lg:col-span-3 space-y-6 bg-slate-900/30 p-6 rounded-3xl border border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                {t("1. Distribuição dos Elementos")}
              </h3>
              
              <div className="space-y-3">
                {/* Fire */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-rose-400 font-medium">{t("Fogo (Entusiasmo & Energia)")}</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.fire}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${mapData.distribution.elements.fire}%` }} />
                  </div>
                </div>

                {/* Earth */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-medium">{t("Terra (Praticidade & Conquistas)")}</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.earth}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${mapData.distribution.elements.earth}%` }} />
                  </div>
                </div>

                {/* Air */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-sky-400 font-medium">{t("Ar (Mente, Lógica & Comunicação)")}</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.air}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${mapData.distribution.elements.air}%` }} />
                  </div>
                </div>

                {/* Water */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-indigo-400 font-medium">{t("Água (Sensibilidade & Intuição)")}</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.water}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${mapData.distribution.elements.water}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                {t("2. Qualidades Astrológicas")}
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{t("Cardinal")}</span>
                  <p className="text-lg font-bold text-slate-100 mt-1">{mapData.distribution.qualities.cardinal}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">{t("Iniciativa & Ação")}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{t("Fixo")}</span>
                  <p className="text-lg font-bold text-amber-500 mt-1">{mapData.distribution.qualities.fixed}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">{t("Estabilidade & Foco")}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{t("Mutável")}</span>
                  <p className="text-lg font-bold text-slate-100 mt-1">{mapData.distribution.qualities.mutable}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">{t("Adaptabilidade")}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                {t("3. Polaridade Energética")}
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0 text-right">
                  <span className="text-xs text-amber-500 font-mono font-bold">{mapData.distribution.polarization.yang}%</span>
                  <span className="block text-[9px] text-slate-400">{t("Ativo / Yang")}</span>
                </div>
                
                <div className="flex-1 h-3 rounded-full bg-slate-850 overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: `${mapData.distribution.polarization.yang}%` }} />
                  <div className="h-full bg-slate-400" style={{ width: `${mapData.distribution.polarization.yin}%` }} />
                </div>

                <div className="w-20 shrink-0">
                  <span className="text-xs text-slate-300 font-mono font-bold">{mapData.distribution.polarization.yin}%</span>
                  <span className="block text-[9px] text-slate-400">{t("Reativo / Yin")}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">{t("Potencial de Coexistência:")}</h4>
              <div className="flex flex-wrap gap-2">
                {mapData.personalityTraits.harmonious.slice(0, 5).map(trait => (
                  <span key={trait} className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-sans">
                    {t(trait)}
                  </span>
                ))}
                {mapData.personalityTraits.disharmonious.slice(0, 4).map(trait => (
                  <span key={trait} className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-sans">
                    {t(trait)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: A Balança Astrológica */}
        <div id="balanca-astrologica-section" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mt-6 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xs">
          <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Scale className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-md font-bold text-slate-100 uppercase tracking-wider">{t("A Balança Astrológica")}</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{t("DNA Astral & Pesos de Personalidade")}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2 text-left">
            {t("Este quadro mostra a condição que cada signo, planeta e casa possui em seu mapa astral, sendo parte integrante das informações que você leu acima. Você já se perguntou por quê algumas pessoas atribuem pesos diferentes para os diversos aspectos de sua personalidade ou desprendem mais ou menos energia em uma determinada área da vida? Isso acontece pois como você acompanhou até aqui, há diversas forças em jogo. Todo mapa astral é uma mistura variada de energias que criam uma configuração única, como uma espécie de DNA astral.")}
          </p>

          {/* Categories Selector: SIGNOS / CASAS / PLANETAS */}
          <div className="flex justify-center border-b border-slate-850 pb-3">
            <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-850 gap-1.5 w-full max-w-md">
              <button
                type="button"
                onClick={() => setBalancaTab('signos')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  balancaTab === 'signos'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {t("Signos")}
              </button>
              <button
                type="button"
                onClick={() => setBalancaTab('casas')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  balancaTab === 'casas'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {t("Casas")}
              </button>
              <button
                type="button"
                onClick={() => setBalancaTab('planetas')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  balancaTab === 'planetas'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {t("Planetas")}
              </button>
            </div>
          </div>

          {/* List display with Force vs Harmony */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {balancaData[balancaTab].map((item) => (
              <div 
                key={item.name} 
                className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850/65 flex items-center justify-between gap-4 hover:border-slate-800 transition duration-300"
              >
                {/* Symbol & Name */}
                <div className="flex items-center gap-3 w-[100px] shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-md text-amber-400 font-mono font-black shadow-inner">
                    {item.symbol}
                  </div>
                  <div className="text-left truncate">
                    <span className="text-xs font-bold text-slate-100 block truncate">{t(item.name)}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono block mt-0.5 truncate">{t(item.subtitle)}</span>
                  </div>
                </div>

                {/* Progress bars split side-by-side or stacked cleanly */}
                <div className="flex-1 space-y-2 text-left">
                  {/* Força Indicator */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-mono tracking-wider uppercase">
                      <span className="text-slate-400">{t("Força")}</span>
                      <span className="text-amber-500 font-bold">{item.force}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-1000/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500" 
                        style={{ width: `${item.force}%` }} 
                      />
                    </div>
                  </div>

                  {/* Harmonia Indicator */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-mono tracking-wider uppercase">
                      <span className="text-slate-400">{t("Harmonia")}</span>
                      <span className="text-emerald-400 font-bold">{item.harmony}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-1000/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${item.harmony}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Resumo / Trânsitos */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mt-6 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Calendar className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">{t("Resumo / Trânsitos")}</h3>
                <p className="text-[10px] text-slate-400">{t("Guia de trânsitos contínuos e influências energéticas ativas no seu mapa")}</p>
              </div>
            </div>

            {/* Side-by-side Navigation Tabs */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-850 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setResoTab('resumo')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  resoTab === 'resumo'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t("Resumo Geral")}
              </button>
              <button
                type="button"
                onClick={() => setResoTab('transitos')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  resoTab === 'transitos'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t("Trânsitos Ativos")}
              </button>
            </div>
          </div>

          {/* TAB CONTENT: RESUMO DE HOJE */}
          {resoTab === 'resumo' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">{t("RESUMO DE HOJE")}</h4>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {resoCategories.map((cat) => {
                  const isExpanded = !!expandedResoCats[cat.id];
                  return (
                    <div 
                      key={cat.id} 
                      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                        isExpanded 
                          ? 'bg-slate-950/60 border-amber-500/20 shadow-md' 
                          : 'bg-slate-900/60 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleResoCat(cat.id)}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors font-sans pointer-events-auto"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${cat.colorClass}`}>
                            {cat.icon}
                          </div>
                          <span className="text-xs font-semibold text-slate-100">{t(cat.label)}</span>
                        </div>

                        <div className={`p-1.5 rounded-lg border transition-all ${
                          isExpanded 
                            ? 'bg-amber-500 text-slate-950 border-amber-500' 
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}>
                          {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-slate-300 text-xs border-t border-slate-850/50 bg-slate-950/40 leading-relaxed font-sans animate-in fade-in duration-300">
                          {t(cat.description)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: TRÂNSITOS ATIVOS */}
          {resoTab === 'transitos' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">{t("Trânsitos de")} {user?.name || t("Buscador")}</h4>
                </div>
                <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {t("Você tem 8 influências ativas")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transitsList.map((tr, idx) => {
                  const isExpanded = !!expandedTrans[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`transition-all duration-300 border rounded-2xl overflow-hidden p-4 flex flex-col justify-between ${
                        isExpanded 
                          ? 'bg-slate-950/80 border-amber-500/30 md:col-span-2 shadow-2xl scale-[1.01]' 
                          : 'bg-slate-900 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-amber-500">{t(tr.title)}</h4>
                        <span className="block text-[9.5px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-850 self-start">
                          {t("De")} {tr.startDate} {t("a")} {tr.endDate}
                        </span>
                        <p className="text-[10.5px] font-semibold text-slate-300 leading-tight">
                          {t(tr.aspect)}
                        </p>
                        <p className={`text-xs text-slate-400 leading-relaxed font-sans ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {t(tr.description)}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-850/50 mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleTransit(idx)}
                          className="text-[9.5px] font-bold font-mono uppercase transition-all flex items-center gap-1 hover:text-amber-400 text-amber-500"
                        >
                          <span>{isExpanded ? t("Ver menos") : t("Ler mais")}</span>
                          <ArrowRight className={`w-3 h-3 transform transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      {activeSubTab === 'astros' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rank list of planets */}
          <div className="space-y-2 lg:col-span-1 bg-slate-900/40 p-4 rounded-3xl border border-slate-800 max-h-[460px] overflow-y-auto">
            <h3 className="text-xs font-bold font-mono text-slate-400 px-2 uppercase tracking-wide mb-3">{t("Ranking de Astros")}</h3>
            
            {memoizedAstros.map((ast) => (
              <button
                key={ast.name}
                onClick={() => setSelectedAstro(ast)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  selectedAstro?.name === ast.name
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-md ring-1 ring-amber-500/10'
                    : 'bg-slate-900 border-slate-850 hover:bg-slate-850 hover:border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-amber-500/80">🪐</span>
                  <div>
                    <h4 className="text-xs font-bold">{t(ast.name)}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {t(ast.sign)} {ast.degree !== null && ast.degree !== undefined ? ast.degree : ''}
                      {ast.degree !== null && ast.degree !== undefined && (typeof ast.degree === 'number' || !String(ast.degree).includes('°')) ? '°' : ''}
                    </p>
                  </div>
                </div>

                {ast.extraInfo && (
                  <span className="px-1.5 py-0.5 rounded-sm bg-slate-950 border border-slate-800 text-[8px] font-mono text-slate-500 uppercase">
                    {t(ast.extraInfo.split(',')[0])}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected planet complete interpretation */}
          <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
            {selectedAstro ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {t("Influência Cósmica")}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-1.5">
                      {t(selectedAstro.name)} <span className="text-slate-400 font-medium text-lg">{t("em")} {t(selectedAstro.sign)}</span>
                    </h2>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xl font-bold text-amber-500 font-mono">
                      {selectedAstro.degree !== null && selectedAstro.degree !== undefined ? selectedAstro.degree : ''}
                      {selectedAstro.degree !== null && selectedAstro.degree !== undefined && (typeof selectedAstro.degree === 'number' || !String(selectedAstro.degree).includes('°')) ? '°' : ''}
                    </span>
                    {selectedAstro.extraInfo && (
                      <p className="text-[9px] font-mono text-slate-500 uppercase mt-1">{t(selectedAstro.extraInfo)}</p>
                    )}
                  </div>
                </div>

                <div className="text-slate-300 leading-relaxed text-xs space-y-3 font-sans">
                  <p className="p-4 rounded-2xl bg-slate-950 border border-slate-850/80 text-slate-300 selection:bg-amber-500/30">
                    {t(selectedAstro.description)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <h4 className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-wider mb-2">{t("Comportamento de Alta Vibração")}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {t("Aproveitar a energia de")} {t(selectedAstro.name)} {t("em")} {t(selectedAstro.sign)} {t("significa expressar independência genuína sem necessitar de rebeldia vazia. Busque se autoafirmar por suas conquistas reais e inteligência visionária.")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <Orbit className="w-12 h-12 text-slate-700 animate-spin" />
                <p className="text-xs font-mono mt-4">{t("Selecione um astro ao lado para visualizar a interpretação.")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'casas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* House list selectors */}
          <div className="lg:col-span-4 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
            {memoizedHouses.map((house) => (
              <button
                key={house.number}
                onClick={() => setSelectedHouse(house.number)}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  selectedHouse === house.number
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 shadow-md font-bold'
                    : 'bg-slate-900 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono block">{t("CASA")}</span>
                <span className="text-lg font-bold font-mono">{house.number}</span>
                <span className="text-[8px] font-sans text-slate-500 block truncate leading-none mt-0.5">{t(house.sign)}</span>
              </button>
            ))}
          </div>

          {/* House Details Panel */}
          <div className="lg:col-span-8 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
            {(() => {
              const hs = mapData.houses.find(h => h.number === selectedHouse);
              if (!hs) return null;
              return (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                        {t("Divisão do Espaço Terrestre")}
                      </span>
                      <h2 className="text-xl font-bold text-slate-100 mt-2">
                        {t("Casa Astrológica")} {hs.number} <span className="text-slate-400 font-medium">{t("em")} {t(hs.sign)}</span>
                      </h2>
                    </div>

                    {hs.planet && (
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 rounded-xl">
                        {t("Planeta Ocupante:")} {t(hs.planet)}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed p-4 rounded-xl bg-slate-950/70 border border-slate-850 selection:bg-amber-500/20">
                    {t(hs.interpretation)}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                    <h4 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">{t("Temas Principais desta Casa")}</h4>
                    <ul className="list-disc pl-4 text-[10px] text-slate-500 space-y-1">
                      <li>{t("Interação direta com as áreas terrenas governadas por")} {t(hs.sign)}.</li>
                      <li>{t("Desafios de manifestação material ou social direta.")}</li>
                      {hs.planet && <li>{t("A energia mutadora de")} {t(hs.planet)} {t("traz inquietações cruciais para esta área de sua rotina.")}</li>}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeSubTab === 'aspectos' && (
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">{t("Relações Celestes (Orbes & Aspectos)")}</h3>
            <p className="text-[11px] text-slate-500">{t("Conjunto de ângulos matemáticos formados entre os astros no momento exato do nascimento.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memoizedAspects.map((asp, i) => {
              let aspectColor = "border-sky-500/20 text-sky-400 bg-sky-500/5";
              if (asp.aspectType === "Oposição") aspectColor = "border-rose-500/20 text-rose-400 bg-rose-500/5";
              else if (asp.aspectType === "Quadratura") aspectColor = "border-orange-500/20 text-orange-400 bg-orange-500/5";
              else if (asp.aspectType === "Trígono") aspectColor = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";

              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-850/80 space-y-2 hover:border-slate-800 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{t(asp.planet1)}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wide uppercase ${aspectColor}`}>
                        {t(asp.aspectType)}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{t(asp.planet2)}</span>
                    </div>

                    <span className="text-[9px] font-mono text-slate-500">{t("Orbe:")} {asp.orb}°</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed leading-[1.6]">
                    {t(asp.interpretation)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'extras' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Creation Form */}
          <div className="lg:col-span-5 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">{t("Cadastrar Novo Mapa Extra")}</h3>
              <p className="text-[11px] text-slate-500">{t("Crie o mapa de amigos, companheiros ou familiares importante para você.")}</p>
            </div>

            <form onSubmit={handleCreateExtraMap} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("NOME DA PESSOA")}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Maria Silva"
                  value={newExtraName}
                  onChange={(e) => setNewExtraName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("DATA DE NASCIMENTO")}</label>
                <input 
                  type="date" 
                  required
                  value={newExtraDate}
                  onChange={(e) => setNewExtraDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("HORA (HH:MM)")}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 18:45"
                    value={newExtraTime}
                    onChange={(e) => setNewExtraTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">{t("CIDADE")}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rio de Janeiro"
                    value={newExtraCity}
                    onChange={(e) => setNewExtraCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={extraMaps.length >= 2}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-sans font-bold text-xs uppercase transition-all duration-300"
              >
                {t("Gerar & Adicionar")} {extraMaps.length >= 2 ? t("(Limite Atingido)") : ''}
              </button>
            </form>
          </div>

          {/* List of extras slots */}
          <div className="lg:col-span-7 bg-slate-900/20 p-6 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">{t("Mapas extras cadastrados")}</h3>
            
            {extraMaps.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-650 bg-slate-950/40 rounded-2xl border border-slate-850 border-dashed">
                <Compass className="w-10 h-10 text-slate-800 animate-pulse" />
                <p className="text-[11px] text-slate-500 mt-3 text-center max-w-xs leading-relaxed">
                  {t("Nenhum mapa extra criado ainda. Você pode gerir até 2 mapas adicionais de forma premium.")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {extraMaps.map((map, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-900 border border-slate-850">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded uppercase">
                        {t("Slot")} {idx + 1} / {t("Mapa Secundário")}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200">{map.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {map.birthDate.split('-').reverse().join('/')} {t("às")} {map.birthTime} · {map.birthCity}
                      </p>
                    </div>

                    <div className="flex gap-2">
                       <button
                         onClick={() => {
                           // Instantly calculate/visualize them!
                           onUpdateMainMap(map);
                         }}
                         className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-500 rounded-lg text-[10px] font-semibold transition"
                       >
                         {t("Visualizar Como Principal")}
                       </button>
                       <button
                         onClick={() => handleDeleteExtra(idx)}
                         className="p-1 text-slate-600 hover:text-rose-400 text-xs transition"
                       >
                         {t("Excluir")}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default AstrologyView;

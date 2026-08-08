import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AstrologyMap, AstroAstroPosition, UserProfile, NumerologyCycle } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  Compass, 
  Layers, 
  Zap, 
  Eye, 
  GitCommit, 
  BookOpen, 
  Split, 
  ShieldCheck, 
  Calendar, 
  Target, 
  ArrowUpRight, 
  ChevronRight, 
  Info, 
  CheckCircle, 
  Lightbulb, 
  Activity, 
  Heart, 
  Briefcase, 
  Users, 
  User,
  DollarSign, 
  Smile, 
  Key, 
  Feather, 
  Flame, 
  Lock, 
  X,
  Share2
} from 'lucide-react';

interface InteractiveAstroMapEngineProps {
  mapData: AstrologyMap;
  user: UserProfile;
  numerology?: NumerologyCycle | null;
  activeLanguage?: string;
}

export const InteractiveAstroMapEngine: React.FC<InteractiveAstroMapEngineProps> = ({
  mapData,
  user,
  numerology,
  activeLanguage = 'pt'
}) => {
  const { t, i18n } = useTranslation();
  const lang = (activeLanguage || i18n.language || 'pt').toLowerCase().slice(0, 2);

  // Active view tabs
  const [activeTab, setActiveTab] = useState<
    'camadas' | 'sintese' | 'paradoxos' | 'areas' | 'por_que' | 'cruzamento' | 'grafo' | 'bussola'
  >('camadas');

  // Layer level state (1: Resumo, 2: Entenda, 3: Aprofunde)
  const [depthLevel, setDepthLevel] = useState<1 | 2 | 3>(1);

  // Selected astro or house for 10-layer breakdown
  const [selectedAstro, setSelectedAstro] = useState<AstroAstroPosition | null>(
    mapData?.astros?.[0] || null
  );

  // Evidence Modal state ("Por que o Portal Orbit está me dizendo isso?")
  const [evidenceModalData, setEvidenceModalData] = useState<{
    title: string;
    explanation: string;
    evidenceList: string[];
  } | null>(null);

  // "Toque para entender" Glossary Tooltip Modal state
  const [glossaryModalTerm, setGlossaryModalTerm] = useState<{
    term: string;
    type: string;
    definition: string;
    example: string;
  } | null>(null);

  // Selected Life Area state
  const [selectedLifeArea, setSelectedLifeArea] = useState<string>('identidade');

  // Selected Graph Node for Grafo de Influências
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>('Sol');

  // Extract core positions
  const sol = useMemo(() => mapData?.astros?.find(a => a.name === "Sol"), [mapData]);
  const lua = useMemo(() => mapData?.astros?.find(a => a.name === "Lua"), [mapData]);
  const asc = useMemo(() => mapData?.astros?.find(a => a.name === "Ascendente"), [mapData]);
  const venus = useMemo(() => mapData?.astros?.find(a => a.name === "Vênus"), [mapData]);
  const marte = useMemo(() => mapData?.astros?.find(a => a.name === "Marte"), [mapData]);
  const mercurio = useMemo(() => mapData?.astros?.find(a => a.name === "Mercúrio"), [mapData]);
  const saturno = useMemo(() => mapData?.astros?.find(a => a.name === "Saturno"), [mapData]);

  // Multilingual translations dictionary
  const uiTexts = useMemo(() => {
    const dict: Record<string, Record<string, string>> = {
      pt: {
        title: "Mapa Interativo de Autoconhecimento",
        subtitle: "Compreensão profunda, conexões reais e guia comportamental.",
        tabCamadas: "Mapa em Camadas",
        tabSintese: "Motor de Síntese",
        tabParadoxos: "Paradoxos do Mapa",
        tabAreas: "Áreas da Vida",
        tabPorQue: "Por Que Sou Assim?",
        tabCruzamento: "Astro × Numerologia",
        tabGrafo: "Grafo de Influências",
        tabBussola: "Bússola do Momento",
        level1: "Nível 1: Resumo",
        level2: "Nível 2: Entenda",
        level3: "Nível 3: Aprofunde",
        selectItem: "Selecione um ponto do seu mapa para explorar:",
        layer1: "1. O que é?",
        layer2: "2. O que representa?",
        layer3: "3. Como se manifesta?",
        layer4: "4. Onde impacta?",
        layer5: "5. Potencial construtivo",
        layer6: "6. Desafio potencial",
        layer7: "7. Sinais para reconhecer",
        layer8: "8. Como trabalhar essa energia",
        layer9: "9. O que modifica esta leitura",
        layer10: "10. Conexão com o resto do mapa",
        whyButton: "Por que o Portal Órbita me diz isso?",
        glossaryHelp: "Toque para entender termos técnicos",
        oneSentenceTitle: "Seu Mapa em uma Frase",
        signatureTitle: "Assinatura Principal do Seu Mapa",
        evidenceTitle: "Evidência Interpretativa",
        close: "Fechar",
        noData: "Dados em processamento para este ponto do mapa.",
        fullAnalysisTitle: "Análise Completa de 10 Camadas",
        behavioralDiscoveriesTitle: "Descobertas Comportamentais Personalizadas",
        behavioralDiscoveriesSub: "Perguntas diretas que explicam seus padrões repetitivos conectando o mapa natal com a sua vivência prática.",
        internalContradictionsTitle: "Contradições Internas & Integração Psíquica",
        internalContradictionsSub: "Duas forças do seu mapa que desejam coisas distintas e como harmonizá-las conscientemente.",
        howManifests: "Como isso se manifesta na sua vida",
        yourPotential: "Seu Maior Potencial",
        challengeToWatch: "Desafio a Observar",
        howToWorkArea: "Como Trabalhar Esta Área Construtivamente:",
        mapsMeetTitle: "Onde Seus Dois Mapas se Encontram",
        mapsMeetSub: "Convergências simbólicas entre a sua astronomia natal e a sua equação numerológica pessoal.",
        destinyXSun: "Destino Numerológico (Caminho {num}) × Sol Astrológico",
        soulXMoon: "Número da Alma (Motivação {num}) × Lua Astrológica",
        graphTitle: "Grafo Interativo de Influências",
        graphSub: "Toque nos nós abaixo para descobrir como as forças do seu mapa se conectam em rede.",
        flowOfInfluence: "Fluxo de Influência do {node}:",
        compassTitle: "Bússola do Seu Momento",
        energyFavored: "Energia a Favor:",
        pointOfAttention: "Ponto de Atenção:",
        areaActivated: "Área Mais Ativada Hoje:",
        reflectionQuestion: "Pergunta para Reflexão:",
        recommendedMicroaction: "Microação Recomendada:",
        realDataUsed: "Dados Reais Utilizados:",
        practicalExample: "Exemplo Prático:",
        involvedFactors: "Configurações Envolvidas:",
        practicalAdvice: "Orientação Prática:",
        houseLabel: "Casa",
        inHouse: "na Casa"
      },
      en: {
        title: "Interactive Map of Self-Knowledge",
        subtitle: "Deep understanding, real connections, and behavioral guidance.",
        tabCamadas: "Layered Chart",
        tabSintese: "Synthesis Engine",
        tabParadoxos: "Chart Paradoxes",
        tabAreas: "Life Areas",
        tabPorQue: "Why Am I Like This?",
        tabCruzamento: "Astro × Numerology",
        tabGrafo: "Influence Graph",
        tabBussola: "Moment Compass",
        level1: "Level 1: Summary",
        level2: "Level 2: Understand",
        level3: "Level 3: Deep Dive",
        selectItem: "Select a point on your chart to explore:",
        layer1: "1. What is it?",
        layer2: "2. What does it represent?",
        layer3: "3. How does it manifest?",
        layer4: "4. Where does it impact?",
        layer5: "5. Constructive potential",
        layer6: "6. Potential challenge",
        layer7: "7. Signs to recognize",
        layer8: "8. How to work with this energy",
        layer9: "9. What modifies this reading",
        layer10: "10. Connection to the rest of the chart",
        whyButton: "Why does Portal Orbita tell me this?",
        glossaryHelp: "Tap to understand technical terms",
        oneSentenceTitle: "Your Chart in One Sentence",
        signatureTitle: "Main Signature of Your Chart",
        evidenceTitle: "Interpretive Evidence",
        close: "Close",
        noData: "Data processing for this point.",
        fullAnalysisTitle: "Complete 10-Layer Analysis",
        behavioralDiscoveriesTitle: "Personalized Behavioral Discoveries",
        behavioralDiscoveriesSub: "Direct questions explaining your recurring patterns by connecting your birth chart to real experience.",
        internalContradictionsTitle: "Internal Contradictions & Psychic Integration",
        internalContradictionsSub: "Two forces in your chart desiring different things and how to consciously harmonize them.",
        howManifests: "How this manifests in your life",
        yourPotential: "Your Greatest Potential",
        challengeToWatch: "Challenge to Watch",
        howToWorkArea: "How to Work with This Area Constructively:",
        mapsMeetTitle: "Where Your Two Charts Meet",
        mapsMeetSub: "Symbolic convergences between your natal astronomy and your personal numerological equation.",
        destinyXSun: "Numerological Life Path ({num}) × Astrological Sun",
        soulXMoon: "Soul Urge Number ({num}) × Astrological Moon",
        graphTitle: "Interactive Influence Graph",
        graphSub: "Tap the nodes below to discover how your chart forces connect in a network.",
        flowOfInfluence: "Influence Flow of {node}:",
        compassTitle: "Compass of Your Present Moment",
        energyFavored: "Favored Energy:",
        pointOfAttention: "Point of Attention:",
        areaActivated: "Most Activated Area Today:",
        reflectionQuestion: "Reflection Question:",
        recommendedMicroaction: "Recommended Microaction:",
        realDataUsed: "Real Data Used:",
        practicalExample: "Practical Example:",
        involvedFactors: "Involved Configurations:",
        practicalAdvice: "Practical Guidance:",
        houseLabel: "House",
        inHouse: "in House"
      },
      es: {
        title: "Mapa Interactivo de Autoconocimiento",
        subtitle: "Comprensión profunda, conexiones reales y guía de comportamiento.",
        tabCamadas: "Mapa en Capas",
        tabSintese: "Motor de Síntesis",
        tabParadoxos: "Paradojas del Mapa",
        tabAreas: "Áreas de la Vida",
        tabPorQue: "¿Por Qué Soy Así?",
        tabCruzamento: "Astro × Numerología",
        tabGrafo: "Grafo de Influencias",
        tabBussola: "Brújula del Momento",
        level1: "Nivel 1: Resumen",
        level2: "Nivel 2: Entienda",
        level3: "Nivel 3: Profundice",
        selectItem: "Selecciona un punto de tu mapa para explorar:",
        layer1: "1. ¿Qué es?",
        layer2: "2. ¿Qué representa?",
        layer3: "3. ¿Cómo se manifiesta?",
        layer4: "4. ¿Dónde impacta?",
        layer5: "5. Potencial constructivo",
        layer6: "6. Desafío potencial",
        layer7: "7. Señales para reconocer",
        layer8: "8. Cómo trabajar esta energía",
        layer9: "9. Qué modifica esta lectura",
        layer10: "10. Conexión con el resto del mapa",
        whyButton: "¿Por qué Portal Órbita me dice esto?",
        glossaryHelp: "Toca para entender términos técnicos",
        oneSentenceTitle: "Tu Mapa en una Frase",
        signatureTitle: "Firma Principal de Tu Mapa",
        evidenceTitle: "Evidencia Interpretativa",
        close: "Cerrar",
        noData: "Datos en proceso.",
        fullAnalysisTitle: "Análisis Completo de 10 Capas",
        behavioralDiscoveriesTitle: "Descubrimientos Conductuales Personalizados",
        behavioralDiscoveriesSub: "Preguntas directas que explican tus patrones repetitivos conectando el mapa natal con tu vivencia.",
        internalContradictionsTitle: "Contradicciones Internas e Integración Psíquica",
        internalContradictionsSub: "Dos fuerzas de tu mapa que desean cosas distintas y cómo armonizarlas conscientemente.",
        howManifests: "Cómo se manifiesta esto en tu vida",
        yourPotential: "Tu Mayor Potencial",
        challengeToWatch: "Desafío a Observar",
        howToWorkArea: "Cómo Trabajar Esta Área Constructivamente:",
        mapsMeetTitle: "Donde Se Encuentran Tus Dos Mapas",
        mapsMeetSub: "Convergencias simbólicas entre tu astronomía natal y tu ecuación numerológica personal.",
        destinyXSun: "Destino Numerológico (Camino {num}) × Sol Astrológico",
        soulXMoon: "Número del Alma (Motivación {num}) × Luna Astrológica",
        graphTitle: "Grafo Interactivo de Influencias",
        graphSub: "Toca los nodos a continuación para descubrir cómo se conectan las fuerzas de tu mapa.",
        flowOfInfluence: "Flujo de Influencia de {node}:",
        compassTitle: "Brújula de Tu Momento Presente",
        energyFavored: "Energía a Favor:",
        pointOfAttention: "Punto de Atención:",
        areaActivated: "Área Más Activada Hoy:",
        reflectionQuestion: "Pregunta para Reflexión:",
        recommendedMicroaction: "Microacción Recomendada:",
        realDataUsed: "Datos Reales Utilizados:",
        practicalExample: "Ejemplo Práctico:",
        involvedFactors: "Configuraciones Involucradas:",
        practicalAdvice: "Guía Práctica:",
        houseLabel: "Casa",
        inHouse: "en la Casa"
      },
      de: {
        title: "Interaktive Karte der Selbsterkenntnis",
        subtitle: "Tiefes Verständnis, reale Verbindungen und Verhaltensführung.",
        tabCamadas: "Mehrschichtige Karte",
        tabSintese: "Synthese-Engine",
        tabParadoxos: "Karten-Paradoxa",
        tabAreas: "Lebensbereiche",
        tabPorQue: "Warum bin ich so?",
        tabCruzamento: "Astro × Numerologie",
        tabGrafo: "Einfluss-Graph",
        tabBussola: "Kompass des Moments",
        level1: "Ebene 1: Zusammenfassung",
        level2: "Ebene 2: Verstehen",
        level3: "Ebene 3: Vertiefung",
        selectItem: "Wählen Sie einen Punkt Ihres Horoskops:",
        layer1: "1. Was ist es?",
        layer2: "2. Was repräsentiert es?",
        layer3: "3. Wie manifestiert es sich?",
        layer4: "4. Wo wirkt es sich aus?",
        layer5: "5. Konstruktives Potenzial",
        layer6: "6. Potenzielle Herausforderung",
        layer7: "7. Zeichen zum Erkennen",
        layer8: "8. Wie man mit dieser Energie arbeitet",
        layer9: "9. Was diese Lesung verändert",
        layer10: "10. Verbindung zum Rest der Karte",
        whyButton: "Warum sagt mir Portal Órbita das?",
        glossaryHelp: "Tippen Sie hier, um Begriffe zu verstehen",
        oneSentenceTitle: "Ihr Horoskop in einem Satz",
        signatureTitle: "Hauptsignatur Ihres Horoskops",
        evidenceTitle: "Interpretative Beweise",
        close: "Schließen",
        noData: "Datenverarbeitung.",
        fullAnalysisTitle: "Vollständige 10-Schichten-Analyse",
        behavioralDiscoveriesTitle: "Personalisierte Verhaltenserkenntnisse",
        behavioralDiscoveriesSub: "Direkte Fragen, die Ihre wiederkehrenden Muster erklären, indem sie das Geburtshoroskop mit praktischer Erfahrung verbinden.",
        internalContradictionsTitle: "Innere Widersprüche & Psychische Integration",
        internalContradictionsSub: "Zwei Kräfte in Ihrem Horoskop, die Unterschiedliches wollen, und wie man sie bewusst harmonisiert.",
        howManifests: "Wie sich dies in Ihrem Leben manifestiert",
        yourPotential: "Ihr größtes Potenzial",
        challengeToWatch: "Herausforderung zu beachten",
        howToWorkArea: "Wie Sie konstruktiv mit diesem Bereich arbeiten:",
        mapsMeetTitle: "Wo sich Ihre beiden Horoskope treffen",
        mapsMeetSub: "Symbolische Konvergenzen zwischen Ihrer Geburtssastronomie und Ihrer numerologischen Gleichung.",
        destinyXSun: "Numerologischer Lebensweg ({num}) × Astrologische Sonne",
        soulXMoon: "Seelenzahl ({num}) × Astrologischer Mond",
        graphTitle: "Interaktiver Einfluss-Graph",
        graphSub: "Tippen Sie auf die Knoten unten, um die Vernetzung Ihrer Kräfte zu entdecken.",
        flowOfInfluence: "Einflussfluss von {node}:",
        compassTitle: "Kompass Ihres aktuellen Moments",
        energyFavored: "Begünstigte Energie:",
        pointOfAttention: "Aufmerksamkeitspunkt:",
        areaActivated: "Heute am stärksten aktivierter Bereich:",
        reflectionQuestion: "Frage zur Reflexion:",
        recommendedMicroaction: "Empfohlene Mikro-Aktion:",
        realDataUsed: "Verwendete Realdaten:",
        practicalExample: "Praktisches Beispiel:",
        involvedFactors: "Beteiligte Konfigurationen:",
        practicalAdvice: "Praktische Orientierung:",
        houseLabel: "Haus",
        inHouse: "im Haus"
      },
      fr: {
        title: "Carte Interactive de Connaissance de Soi",
        subtitle: "Compréhension profonde, connexions réelles et guide comportemental.",
        tabCamadas: "Carte en Couches",
        tabSintese: "Moteur de Synthèse",
        tabParadoxos: "Paradoxes de la Carte",
        tabAreas: "Domaines de Vie",
        tabPorQue: "Pourquoi Suis-Je Comme Ça?",
        tabCruzamento: "Astro × Numérologie",
        tabGrafo: "Graphe d'Influences",
        tabBussola: "Boussole du Moment",
        level1: "Niveau 1: Résumé",
        level2: "Niveau 2: Comprendre",
        level3: "Niveau 3: Approfondir",
        selectItem: "Sélectionnez un point de votre thème:",
        layer1: "1. Qu'est-ce que c'est?",
        layer2: "2. Que représente-t-il?",
        layer3: "3. Comment se manifeste-t-il?",
        layer4: "4. Où cela impacte-t-il?",
        layer5: "5. Potentiel constructif",
        layer6: "6. Défi potentiel",
        layer7: "7. Signes pour reconnaître",
        layer8: "8. Comment travailler cette énergie",
        layer9: "9. Ce qui modifie cette lecture",
        layer10: "10. Connexion avec le reste de la carte",
        whyButton: "Pourquoi Portal Órbita me dit-il cela?",
        glossaryHelp: "Appuyez pour comprendre les termes",
        oneSentenceTitle: "Votre Carte en une Phrase",
        signatureTitle: "Signature Principale de Votre Carte",
        evidenceTitle: "Preuve Interprétative",
        close: "Fermer",
        noData: "Données en cours de traitement.",
        fullAnalysisTitle: "Analyse Complète en 10 Couches",
        behavioralDiscoveriesTitle: "Découvertes Comportementales Personnalisées",
        behavioralDiscoveriesSub: "Questions directes expliquant vos schémas récurrents en reliant le thème natal à votre expérience.",
        internalContradictionsTitle: "Contradictions Internes & Intégration Psychique",
        internalContradictionsSub: "Deux forces de votre thème désirant des choses différentes et comment les harmoniser consciemment.",
        howManifests: "Comment cela se manifeste dans votre vie",
        yourPotential: "Votre Plus Grand Potentiel",
        challengeToWatch: "Défi à Observer",
        howToWorkArea: "Comment Travailler Constructivement ce Domaine:",
        mapsMeetTitle: "Où Vos Deux Thèmes se Rencontrent",
        mapsMeetSub: "Convergences symboliques entre votre astronomie natatle et votre équation numérologique.",
        destinyXSun: "Chemin de Vie Numérologique ({num}) × Soleil Astrologique",
        soulXMoon: "Nombre d'Âme ({num}) × Lune Astrologique",
        graphTitle: "Graphe Interactif d'Influences",
        graphSub: "Appuyez sur les nœuds ci-dessous pour découvrir comment vos forces s'interconnectent.",
        flowOfInfluence: "Flux d'Influence de {node}:",
        compassTitle: "Boussole de Votre Moment Présent",
        energyFavored: "Énergie Favorisée:",
        pointOfAttention: "Point d'Attention:",
        areaActivated: "Domaine le Plus Activé Aujourd'hui:",
        reflectionQuestion: "Question pour Réflexion:",
        recommendedMicroaction: "Micro-action Recommandée:",
        realDataUsed: "Données Réelles Utilisées:",
        practicalExample: "Exemple Pratique:",
        involvedFactors: "Configurations Impliquées:",
        practicalAdvice: "Conseil Pratique:",
        houseLabel: "Maison",
        inHouse: "en Maison"
      }
    };
    return dict[lang] || dict['pt'];
  }, [lang]);

  // Glossary Terms Data Dictionary for "Toque para Entender"
  const glossaryTerms = useMemo(() => {
    const terms: Record<string, { term: string; type: string; definition: string; example: string }> = {
      planeta: {
        term: "Planeta (Astro)",
        type: "Função Psicológica",
        definition: lang === 'en' ? "Represents a psychological function, drive, or inner motivation." :
                    lang === 'es' ? "Representa una función psicológica o impulso interno." :
                    lang === 'de' ? "Repräsentiert eine psychologische Funktion oder einen inneren Antrieb." :
                    lang === 'fr' ? "Représente une fonction psychologique ou une motivation intérieure." :
                    "Representa uma função psicológica ou impulso interno da sua consciência.",
        example: lang === 'en' ? "e.g. Venus shows how you relate and value beauty." :
                 "Ex: Vênus mostra como você se conecta emocionalmente e o que valoriza."
      },
      signo: {
        term: "Signo Zodiacal",
        type: "Modo de Expressão",
        definition: lang === 'en' ? "Shows the style or tone in which a planet expresses its energy." :
                    lang === 'es' ? "Muestra el estilo o tono en que se expresa un planeta." :
                    lang === 'de' ? "Zeigt den Stil oder Ton, in dem sich ein Planet ausdrückt." :
                    lang === 'fr' ? "Montre le style dans lequel un planète s'exprime." :
                    "Mostra o estilo, tom e temperamento com que um planeta expressa a sua energia.",
        example: lang === 'en' ? "e.g. Mars in Aries acts with directness and speed." :
                 "Ex: Marte em Áries age de forma direta, corajosa e veloz."
      },
      casa: {
        term: "Casa Astrológica",
        type: "Cenário de Vida",
        definition: lang === 'en' ? "Represents the area of life where the planet manifests its action." :
                    lang === 'es' ? "Representa el área de la vida donde se manifiesta el planeta." :
                    lang === 'de' ? "Stellt den Lebensbereich dar, in dem sich der Planet manifestiert." :
                    lang === 'fr' ? "Représente le domaine de vie où le planète se manifeste." :
                    "Representa o palco concreto ou área da vida onde essa energia vai se manifestar.",
        example: lang === 'en' ? "e.g. 10th House relates to career and public reputation." :
                 "Ex: Casa 10 representa sua carreira, vocação e projeção pública."
      },
      aspecto: {
        term: "Aspecto Planetário",
        type: "Diálogo Cósmico",
        definition: lang === 'en' ? "Shows how two planets talk to each other (harmony or friction)." :
                    lang === 'es' ? "Muestra cómo dos planetas dialogan (armonía o fricción)." :
                    lang === 'de' ? "Zeigt wie zwei Planeten miteinander kommunizieren." :
                    lang === 'fr' ? "Montre comment deux planètes interagissent." :
                    "Mostra o ângulo geométrico e como duas funções psíquicas conversam entre si.",
        example: lang === 'en' ? "e.g. Trine indicates natural talent; Opposition requires balance." :
                 "Ex: Trígono traz fluidez fluida; Quadratura traz dinamismo e necessidade de ajuste."
      },
      transito: {
        term: "Trânsito Astrológico",
        type: "Tempo & Clima Presente",
        definition: lang === 'en' ? "Compares current real-time planet positions against your birth chart." :
                    lang === 'es' ? "Compara las posiciones actuales de los planetas con tu mapa natal." :
                    lang === 'de' ? "Vergleicht aktuelle Planetenpositionen mit Ihrem Geburtshoroskop." :
                    lang === 'fr' ? "Compare les positions actuelles avec votre thème natal." :
                    "Compara a posição real dos planetas hoje no céu com os pontos do seu mapa natal.",
        example: lang === 'en' ? "e.g. Jupiter transiting 2nd House brings financial expansion opportunities." :
                 "Ex: Júpiter em trânsito pela Casa 2 estimula novas fontes de renda e aprendizado."
      }
    };
    return terms;
  }, [lang]);

  // Compute 10-Layer breakdown for current selected astro
  const selectedAstroBreakdown = useMemo(() => {
    if (!selectedAstro) return null;

    const name = selectedAstro.name;
    const sign = selectedAstro.sign;
    const house = selectedAstro.house || 1;
    const userName = user.name || (lang === 'en' ? 'Seeker' : lang === 'es' ? 'Buscador' : lang === 'de' ? 'Suchender' : lang === 'fr' ? 'Chercheur' : 'Sonhador(a)');

    if (lang === 'en') {
      return {
        title: `${name} in ${sign} (House ${house})`,
        layer1_oQueE: `${name} is the symbolic function of your chart associated with ${
          name === 'Sol' ? 'your core essence, vital purpose, and central consciousness' :
          name === 'Lua' ? 'your emotional security, intuition, and affective needs' :
          name === 'Ascendente' ? 'your outer identity, physical presence, and portal into the world' :
          name === 'Mercúrio' ? 'your logical mind, communication style, and learning' :
          name === 'Vênus' ? 'your values, affection, relationships, and attraction' :
          name === 'Marte' ? 'your drive for action, courage, impulse, and boundaries' :
          name === 'Saturno' ? 'your structure, discipline, maturity lessons, and authority' :
          'your personal evolution and spiritual awakening'
        }.`,
        layer2_oQueRepresenta: `In this position, the sign of ${sign} colors the energy of ${name} with qualities of ${
          ['Áries', 'Leão', 'Sagitário'].includes(sign) ? 'fire, initiative, enthusiasm, and spontaneity' :
          ['Touro', 'Virgem', 'Capricórnio'].includes(sign) ? 'earth, pragmatism, constancy, and groundedness' :
          ['Gêmeos', 'Libra', 'Aquário'].includes(sign) ? 'air, intellect, sociability, and flow of ideas' :
          'water, intuition, sensitivity, and emotional depth'
        }.`,
        layer3_comoSeManifesta: `In ${userName}'s daily life, this combination manifests as a tendency to act with ${
          sign === 'Escorpião' ? 'investigative intensity and search for truth without superficiality' :
          sign === 'Peixes' ? 'elevated empathy, vivid imagination, and harmony with the invisible' :
          sign === 'Aquário' ? 'independent thought, originality, and future vision' :
          sign === 'Capricórnio' ? 'focus on sustainable results, responsibility, and self-control' :
          'constant pursuit of authenticity, clarity, and personal growth'
        }.`,
        layer4_ondeImpacta: `The main impact occurs in House ${house}, directly affecting ${
          house === 1 ? 'your self-esteem, physical body, and personal initiative' :
          house === 2 ? 'your financial resources, personal values, and material stability' :
          house === 3 ? 'your communication, intellectual exchanges, and immediate environment' :
          house === 4 ? 'your family roots, intimacy, home, and emotional foundation' :
          house === 5 ? 'your creativity, leisure, authentic expression, and romance' :
          house === 6 ? 'your daily routine, physical health, work, and habits' :
          house === 7 ? 'your mature relationships, formal partnerships, and marriage' :
          house === 8 ? 'your capacity for transformation, deep intimacy, and shared resources' :
          house === 9 ? 'your higher studies, life philosophy, expansion, and long journeys' :
          house === 10 ? 'your career, public vocation, reputation, and major goals' :
          house === 11 ? 'your group projects, friendships, social causes, and community vision' :
          'your subconscious, spirituality, retreat, and inner healing'
        }.`,
        layer5_potencialConstrutivo: `Development of high maturity, pragmatic clarity, and conscious use of ${sign}'s strength to construct goals without dispersion.`,
        layer6_desafioPotencial: `Tendency toward stress responses, such as ${
          ['Escorpião', 'Touro', 'Leão', 'Aquário'].includes(sign) ? 'rigidity or resistance to changing course when needed' :
          'dispersion of focus when trying to embrace multiple stimuli at once'
        }.`,
        layer7_sinaisReconhecer: `Observe when you feel anxiety from losing control of a situation or when you seek temporary isolation to recharge your psychic battery.`,
        layer8_comoTrabalhar: `Practice daily inner listening, set realistic goals broken into steps, and use your intuition as an ally to practical reasoning.`,
        layer9_oQueModifica: `Aspects with Saturn and the luminaries modulate the response speed of this energy in your daily life.`,
        layer10_conexaoMapa: `This position speaks directly with your Sun in ${sol?.sign || 'Aquarius'} and Ascendant in ${asc?.sign || 'Sagittarius'}, weaving an integrated narrative.`,
        evidenceList: [
          `Calculated real position: ${name} in ${sign} at ${selectedAstro.degree || '15°'}`,
          `Placidus House location: House ${house}`,
          `Chart interaction for ${userName}`
        ]
      };
    } else if (lang === 'es') {
      return {
        title: `${name} en ${sign} (Casa ${house})`,
        layer1_oQueE: `${name} es la función simbólica de tu mapa asociada a ${
          name === 'Sol' ? 'tu esencia, propósito vital y conciencia central' :
          name === 'Lua' ? 'tu seguridad emocional, intuición y necesidades afectivas' :
          name === 'Ascendente' ? 'tu identidad exterior, presencia física y portal de entrada al mundo' :
          name === 'Mercúrio' ? 'tu mente lógica, estilo de comunicación y aprendizaje' :
          name === 'Vênus' ? 'tus valores, afecto, relaciones y atracción' :
          name === 'Marte' ? 'tu fuerza de acción, coraje, impulso y límites' :
          name === 'Saturno' ? 'tu estructura, disciplina, lecciones de madurez y autoridad' :
          'tu evolución personal y despertar espiritual'
        }.`,
        layer2_oQueRepresenta: `En esta posición, el signo de ${sign} colorea la energía de ${name} con cualidades de ${
          ['Áries', 'Leão', 'Sagitário'].includes(sign) ? 'fuego, iniciativa, entusiasmo y espontaneidad' :
          ['Touro', 'Virgem', 'Capricórnio'].includes(sign) ? 'tierra, pragmatismo, constancia y pies en la tierra' :
          ['Gêmeos', 'Libra', 'Aquário'].includes(sign) ? 'aire, intelecto, sociabilidad y flujo de ideas' :
          'agua, intuición, sensibilidad y profundidad emocional'
        }.`,
        layer3_comoSeManifesta: `En la cotidianeidad de ${userName}, esta combinación se manifiesta como una tendencia a actuar con ${
          sign === 'Escorpião' ? 'intensidad investigativa y búsqueda de verdad sin superficialidad' :
          sign === 'Peixes' ? 'empatía elevada, imaginación vívida y sintonía con lo invisible' :
          sign === 'Aquário' ? 'pensamiento independiente, originalidad y visión de futuro' :
          sign === 'Capricórnio' ? 'enfoque en resultados sostenibles, responsabilidad y autocontrol' :
          'búsqueda constante de autenticidad, claridad y crecimiento personal'
        }.`,
        layer4_ondeImpacta: `El impacto principal ocurre en la Casa ${house}, afectando directamente ${
          house === 1 ? 'tu autoestima, cuerpo físico e iniciativa personal' :
          house === 2 ? 'tus recursos financieros, valores personales y estabilidad material' :
          house === 3 ? 'tu comunicación, intercambios intelectuales y entorno cercano' :
          house === 4 ? 'tus raíces familiares, intimidad, hogar y base emocional' :
          house === 5 ? 'tu creatividad, ocio, expresión auténtica y romances' :
          house === 6 ? 'tu rutina diaria, salud física, trabajo y hábitos' :
          house === 7 ? 'tus relaciones maduras, asociaciones formales y matrimonio' :
          house === 8 ? 'tu capacidad de transformación, intimidad profunda y recursos compartidos' :
          house === 9 ? 'tus estudios superiores, filosofía de vida, expansión y viajes' :
          house === 10 ? 'tu carrera, vocación pública, reputación y metas mayores' :
          house === 11 ? 'tus proyectos grupales, amistades, causas y visión comunitaria' :
          'tu subconsciente, espiritualidad, retiro y sanación interior'
        }.`,
        layer5_potencialConstrutivo: `Desarrollo de alta madurez, claridad pragmática y uso consciente de la fuerza de ${sign} para edificar metas sin dispersión.`,
        layer6_desafioPotencial: `Tendencia a reaccionar bajo estrés, como ${
          ['Escorpião', 'Touro', 'Leão', 'Aquário'].includes(sign) ? 'rigidez o resistencia a cambiar de rumbo cuando es necesario' :
          'dispersión de enfoque al intentar abarcar múltiples estímulos a la vez'
        }.`,
        layer7_sinaisReconhecer: `Observa cuando sientes ansiedad al perder el control de una situación o cuando buscas aislamiento temporal para recargar tu batería psíquica.`,
        layer8_comoTrabalhar: `Practica la escucha interior diaria, establece metas realistas divididas en etapas y utiliza tu intuición como aliada del razonamiento práctico.`,
        layer9_oQueModifica: `Aspectos con Saturno y los luminares modulan la velocidad de respuesta de esta energía en tu día a día.`,
        layer10_conexaoMapa: `Esta posición dialoga directamente con tu Sol en ${sol?.sign || 'Acuario'} y tu Ascendente en ${asc?.sign || 'Sagitario'}, tejiendo una narrativa integrada.`,
        evidenceList: [
          `Posición real calculada: ${name} en ${sign} en el grado ${selectedAstro.degree || '15°'}`,
          `Ubicación en Casa Placidus: Casa ${house}`,
          `Interacción en el mapa de ${userName}`
        ]
      };
    } else if (lang === 'de') {
      return {
        title: `${name} in ${sign} (Haus ${house})`,
        layer1_oQueE: `${name} ist die symbolische Funktion Ihres Horoskops, verbunden mit ${
          name === 'Sol' ? 'Ihrer Kernessenz, Ihrem Lebenszweck und Ihrem zentralen Bewusstsein' :
          name === 'Lua' ? 'Ihrer emotionalen Sicherheit, Intuition und gefühlsmäßigen Bedürfnissen' :
          name === 'Ascendente' ? 'Ihrer äußeren Identität, physischen Präsenz und dem Tor zur Welt' :
          name === 'Mercúrio' ? 'Ihrem logischen Verstand, Kommunikationsstil und Lernen' :
          name === 'Vênus' ? 'Ihren Werten, Zuneigung, Beziehungen und Anziehung' :
          name === 'Marte' ? 'Ihrer Tatkraft, Ihrem Mut, Impuls und Ihren Grenzen' :
          name === 'Saturno' ? 'Ihrer Struktur, Disziplin, Reifelektionen und Autorität' :
          'Ihrer persönlichen Evolution und spirituellen Erweckung'
        }.`,
        layer2_oQueRepresenta: `In dieser Position färbt das Zeichen ${sign} die Energie von ${name} mit Qualitäten von ${
          ['Áries', 'Leão', 'Sagitário'].includes(sign) ? 'Feuer, Initiative, Enthusiasmus und Spontanität' :
          ['Touro', 'Virgem', 'Capricórnio'].includes(sign) ? 'Erde, Pragmatismus, Beständigkeit und Bodenständigkeit' :
          ['Gêmeos', 'Libra', 'Aquário'].includes(sign) ? 'Luft, Intellekt, Soziabilität und Ideenfluss' :
          'Wasser, Intuition, Sensibilität und emotionaler Tiefe'
        }.`,
        layer3_comoSeManifesta: `Im Alltag von ${userName} manifestiert sich diese Kombination als Tendenz zu ${
          sign === 'Escorpião' ? 'investigativer Intensität und Suche nach Wahrheit ohne Oberflächlichkeit' :
          sign === 'Peixes' ? 'hoher Empathie, lebhafter Vorstellungskraft und Einklang mit dem Unsichtbaren' :
          sign === 'Aquário' ? 'unabhängigem Denken, Originalität und Zukunftsvision' :
          sign === 'Capricórnio' ? 'Fokus auf nachhaltige Ergebnisse, Verantwortung und Selbstkontrolle' :
          'ständigem Streben nach Authentizität, Klarheit und persönlichem Wachstum'
        }.`,
        layer4_ondeImpacta: `Die Hauptwirkung liegt im Haus ${house} und betrifft direkt ${
          house === 1 ? 'Ihr Selbstwertgefühl, Ihren physischen Körper und Ihre persönliche Initiative' :
          house === 2 ? 'Ihre finanziellen Ressourcen, persönlichen Werte und materielle Stabilität' :
          house === 3 ? 'Ihre Kommunikation, den intellektuellen Austausch und Ihr nahes Umfeld' :
          house === 4 ? 'Ihre familiären Wurzeln, Intimität, Ihr Zuhause und Ihre emotionale Basis' :
          house === 5 ? 'Ihre Kreativität, Freizeit, Ihren authentischen Ausdruck und Ihre Romantik' :
          house === 6 ? 'Ihre tägliche Routine, physische Gesundheit, Arbeit und Gewohnheiten' :
          house === 7 ? 'Ihre reifen Beziehungen, formalen Partnerschaften und Ihre Ehe' :
          house === 8 ? 'Ihre Transformationsfähigkeit, tiefe Intimität und gemeinsame Ressourcen' :
          house === 9 ? 'Ihr höheres Studium, Ihre Lebensphilosophie, Expansion und Reisen' :
          house === 10 ? 'Ihre Karriere, öffentliche Berufung, Reputation und großen Ziele' :
          house === 11 ? 'Ihre Gruppenprojekte, Freundschaften, Anliegen und Gemeinschaftsvision' :
          'Ihr Unterbewusstsein, Ihre Spiritualität, Ihren Rückzug und innere Heilung'
        }.`,
        layer5_potencialConstrutivo: `Entwicklung hoher Reife, pragmatischer Klarheit und bewusster Nutzung der Stärke von ${sign}, um Ziele ohne Zerstreuung aufzubauen.`,
        layer6_desafioPotencial: `Neigung zu Stressreaktionen wie ${
          ['Escorpião', 'Touro', 'Leão', 'Aquário'].includes(sign) ? 'Starrheit oder Widerstand gegen Kurswechsel bei Bedarf' :
          'Fokusverlust beim Versuch, mehrere Reize gleichzeitig aufzunehmen'
        }.`,
        layer7_sinaisReconhecer: `Beobachten Sie, wann Sie Unruhe verspüren, wenn Sie die Kontrolle verlieren, oder wann Sie vorübergehende Isolation suchen.`,
        layer8_comoTrabalhar: `Üben Sie tägliches inneres Zuhören, setzen Sie sich realistische Ziele und nutzen Sie Ihre Intuition als Verbündeten des praktischen Verstandes.`,
        layer9_oQueModifica: `Aspekte mit Saturn und den Lichtergestirnen modulieren die Reaktionsgeschwindigkeit dieser Energie.`,
        layer10_conexaoMapa: `Diese Position spricht direkt mit Ihrer Sonne in ${sol?.sign || 'Wassermann'} und Ihrem Aszendenten in ${asc?.sign || 'Schütze'}.`,
        evidenceList: [
          `Berechnete Position: ${name} in ${sign} auf ${selectedAstro.degree || '15°'}`,
          `Lage im Placidus-Haus: Haus ${house}`,
          `Horoskop-Interaktion für ${userName}`
        ]
      };
    } else if (lang === 'fr') {
      return {
        title: `${name} en ${sign} (Maison ${house})`,
        layer1_oQueE: `${name} est la fonction symbolique de votre thème associée à ${
          name === 'Sol' ? 'votre essence, votre objectif vital et votre conscience centrale' :
          name === 'Lua' ? 'votre sécurité émotionnelle, votre intuition et vos besoins affectifs' :
          name === 'Ascendente' ? 'votre identité extérieure, votre présence physique et votre porte d\'entrée dans le monde' :
          name === 'Mercúrio' ? 'votre esprit logique, votre style de communication et votre apprentissage' :
          name === 'Vênus' ? 'vos valeurs, votre affection, vos relations et votre attraction' :
          name === 'Marte' ? 'votre force d\'action, votre courage, vos impulsions et vos limites' :
          name === 'Saturno' ? 'votre structure, votre discipline, vos leçons de maturité et votre autorité' :
          'votre évolution personnelle et votre éveil spirituel'
        }.`,
        layer2_oQueRepresenta: `Dans cette position, le signe de ${sign} colore l'énergie de ${name} avec des qualités de ${
          ['Áries', 'Leão', 'Sagitário'].includes(sign) ? 'feu, initiative, enthousiasme et spontanéité' :
          ['Touro', 'Virgem', 'Capricórnio'].includes(sign) ? 'terre, pragmatisme, constance et réalisme' :
          ['Gêmeos', 'Libra', 'Aquário'].includes(sign) ? 'air, intellect, sociabilité et flux d\'idées' :
          'eau, intuition, sensibilité et profondeur émotionnelle'
        }.`,
        layer3_comoSeManifesta: `Au quotidien pour ${userName}, cette combinaison se manifeste par une tendance à agir avec ${
          sign === 'Escorpião' ? 'intensité investigative et recherche de vérité sans superficialité' :
          sign === 'Peixes' ? 'empathie élevée, imagination vive et harmonie avec l\'invisible' :
          sign === 'Aquário' ? 'pensée indépendante, originalité et vision d\'avenir' :
          sign === 'Capricórnio' ? 'focalisation sur des résultats durables, responsabilité et maîtrise de soi' :
          'recherche constante d\'authenticité, de clarté et de croissance personnelle'
        }.`,
        layer4_ondeImpacta: `L'impact principal se produit en Maison ${house}, affectant directement ${
          house === 1 ? 'votre estime de soi, votre corps physique et votre initiative personnelle' :
          house === 2 ? 'vos ressources financières, vos valeurs personnelles et votre stabilité matérielle' :
          house === 3 ? 'votre communication, vos échanges intellectuels et votre environnement proche' :
          house === 4 ? 'vos racines familiales, votre intimité, votre foyer et votre base émotionnelle' :
          house === 5 ? 'votre créativité, vos loisirs, votre expression authentique et vos romances' :
          house === 6 ? 'votre routine quotidienne, votre santé physique, votre travail et vos habitudes' :
          house === 7 ? 'vos relations mûres, vos partenariats formels et votre mariage' :
          house === 8 ? 'votre capacité de transformation, votre intimité profonde et vos ressources partagées' :
          house === 9 ? 'vos études supérieures, votre philosophie de vie, votre expansion et vos voyages' :
          house === 10 ? 'votre carrière, votre vocation publique, votre réputation et vos grands objectifs' :
          house === 11 ? 'vos projets de groupe, vos amitiés, vos causes et votre vision communautaire' :
          'votre subconscient, votre spiritualité, votre retraite et votre guérison intérieure'
        }.`,
        layer5_potencialConstrutivo: `Développement d'une grande maturité, clarté pragmatique et utilisation consciente de la force de ${sign} pour édifier vos objectifs sans dispersion.`,
        layer6_desafioPotencial: `Tendance à réagir sous stress, comme ${
          ['Escorpião', 'Touro', 'Leão', 'Aquário'].includes(sign) ? 'rigidité ou résistance au changement de cap si nécessaire' :
          'dispersion de la focalisation en essayant d\'embrasser plusieurs stimuli à la fois'
        }.`,
        layer7_sinaisReconhecer: `Observez quand vous ressentez de l'anxiété en perdant le contrôle ou quand vous cherchez un isolement temporaire pour recharger votre batterie psychique.`,
        layer8_comoTrabalhar: `Pratiquez l'écoute intérieure quotidienne, fixez des objectifs réalistes et utilisez votre intuition comme alliée au raisonnement pratique.`,
        layer9_oQueModifica: `Les aspects avec Saturne et les luminaires modulent la vitesse de réponse de cette énergie au quotidien.`,
        layer10_conexaoMapa: `Cette position dialogue directement avec votre Soleil en ${sol?.sign || 'Verseau'} et votre Ascendant en ${asc?.sign || 'Sagittaire'}.`,
        evidenceList: [
          `Position réelle calculée: ${name} en ${sign} au degré ${selectedAstro.degree || '15°'}`,
          `Emplacement en Maison Placidus: Maison ${house}`,
          `Interaction dans le thème de ${userName}`
        ]
      };
    }

    return {
      title: `${name} em ${sign} (Casa ${house})`,
      layer1_oQueE: `${name} é a função simbólica do seu mapa associada a ${
        name === 'Sol' ? 'sua essência, propósito vital e consciência central' :
        name === 'Lua' ? 'sua segurança emocional, intuição e necessidades afetivas' :
        name === 'Ascendente' ? 'sua identidade exterior, presença física e portal de entrada no mundo' :
        name === 'Mercúrio' ? 'sua mente lógica, estilo de comunicação e aprendizado' :
        name === 'Vênus' ? 'seus valores, afeto, relacionamentos e atração' :
        name === 'Marte' ? 'sua força de ação, coragem, impulso e limites' :
        name === 'Saturno' ? 'sua estrutura, disciplina, lições de maturidade e autoridade' :
        'sua evolução pessoal e despertamento espiritual'
      }.`,
      layer2_oQueRepresenta: `Nesta posição, o signo de ${sign} colore a energia de ${name} com qualidades de ${
        ['Áries', 'Leão', 'Sagitário'].includes(sign) ? 'fogo, iniciativa, entusiasmo e espontaneidade' :
        ['Touro', 'Virgem', 'Capricórnio'].includes(sign) ? 'terra, pragmatismo, constância e pé no chão' :
        ['Gêmeos', 'Libra', 'Aquário'].includes(sign) ? 'ar, intelecto, sociabilidade e fluxo de ideias' :
        'água, intuição, sensibilidade e profundidade emocional'
      }.`,
      layer3_comoSeManifesta: `No cotidiano de ${userName}, essa combinação se manifesta como uma tendência a agir com ${
        sign === 'Escorpião' ? 'intensidade investigativa e busca por verdade sem superficialidade' :
        sign === 'Peixes' ? 'empatia elevada, imaginação vívida e sintonia com o invisível' :
        sign === 'Aquário' ? 'independência de pensamento, originalidade e visão de futuro' :
        sign === 'Capricórnio' ? 'foco no resultado sustentável, responsabilidade e autocontrole' :
        'busca constante por autenticidade, clareza e crescimento'
      }.`,
      layer4_ondeImpacta: `O impacto principal ocorre na Casa ${house}, afetando diretamente ${
        house === 1 ? 'sua autoestima, corpo físico e iniciativa pessoal' :
        house === 2 ? 'seus recursos financeiros, valores pessoais e estabilidade material' :
        house === 3 ? 'sua comunicação, trocas intelectuais e relação com o entorno próximo' :
        house === 4 ? 'suas raízes familiares, intimidade, lar e base emocional' :
        house === 5 ? 'sua criatividade, lazer, expressão autêntica e romances' :
        house === 6 ? 'sua rotina diária, saúde física, trabalho e hábitos cotidianos' :
        house === 7 ? 'seus relacionamentos maduros, parcerias formais e casamento' :
        house === 8 ? 'sua capacidade de transformação, intimidade profunda e recursos compartilhados' :
        house === 9 ? 'seus estudos superiores, filosofia de vida, expansão e viagens' :
        house === 10 ? 'sua carreira, vocação pública, reputação e grandes metas' :
        house === 11 ? 'seus projetos de grupo, amizades, causas e visão comunitária' :
        'seu subconsciente, espiritualidade, recolhimento e cura interna'
      }.`,
      layer5_potencialConstrutivo: `Desenvolvimento de alta maturidade, clareza pragmática e uso consciente da força de ${sign} para edificar seus objetivos sem dispersão.`,
      layer6_desafioPotencial: `Tendência a reações sob estresse, como ${
        ['Escorpião', 'Touro', 'Leão', 'Aquário'].includes(sign) ? 'rigidez ou resistência a mudar de rota quando necessário' :
        'dispersão de foco ao tentar abraçar múltiplos estímulos de uma só vez'
      }.`,
      layer7_sinaisReconhecer: `Observe quando você sente ansiedade ao perder o controle de uma situação ou quando busca isolamento temporário para recarregar sua bateria psíquica.`,
      layer8_comoTrabalhar: `Pratique a escuta interior diária, estabeleça metas realistas divididas em etapas e utilize sua intuição como aliada do seu raciocínio prático.`,
      layer9_oQueModifica: `Aspectos com Saturno e os luminares modulam a velocidade de resposta dessa energia no seu dia a dia.`,
      layer10_conexaoMapa: `Esta posição conversa diretamente com seu Sol em ${sol?.sign || 'Aquário'} e seu Ascendente em ${asc?.sign || 'Sagitário'}, tecendo uma narrativa integrada.`,
      evidenceList: [
        `Posição real calculada: ${name} em ${sign} no grau ${selectedAstro.degree || '15°'}`,
        `Localização em Casa Placidus: Casa ${house}`,
        `Interação no Mapa de ${userName}`
      ]
    };
  }, [selectedAstro, user.name, sol, asc, lang]);

  // "Por Que Eu Sou Assim?" Q&A list generated dynamically from chart metrics
  const whyAmILikeThisList = useMemo(() => {
    const name = user.name.split(' ')[0] || (lang === 'en' ? 'You' : lang === 'es' ? 'Tú' : lang === 'de' ? 'Sie' : lang === 'fr' ? 'Vous' : 'Você');
    
    if (lang === 'en') {
      return [
        {
          question: `Why might ${name} need freedom and security at the same time?`,
          shortAnswer: `Because of the contrast between the drive for expansion and the need for stability in your natal chart.`,
          deepAnswer: `Your solar essence brings an innate desire for autonomy, while earth signs or angular houses ask for solid foundations before leaping. This creates a dynamic of seeking a 'safe harbor' that serves as a launchpad, never a cage.`,
          factors: [`Sun in ${sol?.sign || 'Aquarius'}`, `Moon in ${lua?.sign || 'Pisces'}`, `Ascendant in ${asc?.sign || 'Sagittarius'}`],
          advice: `Create flexible routines: keep fixed commitments to health and finances, but leave free time in your weekly schedule for spontaneity.`
        },
        {
          question: `Why do you deeply analyze things before taking a stance?`,
          shortAnswer: `Your mind seeks absolute clarity and coherence before expressing a definitive opinion.`,
          deepAnswer: `With Mercury's energy and reflective aspects in your chart, you have an internal filter that dislikes superficiality. You prefer lucid silence over speaking without foundation.`,
          factors: [`Mercury in ${mercurio?.sign || 'Capricorn'}`, `Saturn in ${saturno?.sign || 'Pisces'}`],
          advice: `Trust your first intuition more without needing to rationally validate every hypothesis before acting.`
        },
        {
          question: `Why do you feel environment emotions with such intensity?`,
          shortAnswer: `Your intuitive sensitivity catches unspoken frequencies before verbal dialogue.`,
          deepAnswer: `The presence of your Moon and Water/Air elements in your chart creates a natural empathetic antenna. You read expressions, voice tones, and emotional atmospheres like an open book.`,
          factors: [`Moon in ${lua?.sign || 'Pisces'}`, `Venus in ${venus?.sign || 'Aquarius'}`],
          advice: `Establish clear psychic boundaries: not all environmental emotions belong to you. Take silent breaks throughout the day.`
        }
      ];
    } else if (lang === 'es') {
      return [
        {
          question: `¿Por qué ${name} puede necesitar libertad y seguridad al mismo tiempo?`,
          shortAnswer: `Debido al contraste entre la búsqueda de expansión y la necesidad de estabilidad en tu mapa natal.`,
          deepAnswer: `Tu esencia solar trae un deseo nato de autonomía, mientras que posicionamientos en signos de tierra o casas angulares piden cimientos sólidos antes de saltar. Esto crea la dinámica de buscar un 'puerto seguro' que sirva de plataforma de lanzamiento, nunca de jaula.`,
          factors: [`Sol en ${sol?.sign || 'Acuario'}`, `Luna en ${lua?.sign || 'Piscis'}`, `Ascendente en ${asc?.sign || 'Sagitario'}`],
          advice: `Crea rutinas flexibles: mantén compromisos fijos con tu salud y finanzas, pero conserva espacio libre en tu agenda semanal para la espontaneidad.`
        },
        {
          question: `¿Por qué analizas profundamente las cosas antes de posicionarte?`,
          shortAnswer: `Tu mente busca claridad absoluta y coherencia antes de expresar una opinión definitiva.`,
          deepAnswer: `Con la energía de Mercurio y los aspectos de reflexión en tu mapa, tienes un filtro interno que detesta la superficialidad. Prefieres el silencio lúcido a hablar sin fundamento.`,
          factors: [`Mercurio en ${mercurio?.sign || 'Capricornio'}`, `Saturno en ${saturno?.sign || 'Piscis'}`],
          advice: `Confía más en tu primera intuición sin necesitar validar racionalmente cada hipótesis antes de actuar.`
        },
        {
          question: `¿Por qué sientes las emociones del entorno con tanta intensidad?`,
          shortAnswer: `Tu sensibilidad intuitiva capta frecuencias no dichas antes del diálogo verbal.`,
          deepAnswer: `La presencia de tu Luna y del elemento Agua/Aire crea una antena empática natural. Lees expresiones, tonos de voz y atmósferas emocionales como un libro abierto.`,
          factors: [`Luna en ${lua?.sign || 'Piscis'}`, `Venus en ${venus?.sign || 'Acuario'}`],
          advice: `Establece límites psíquicos claros: no todas las emociones del ambiente te pertenecen. Haz pausas en silencio a lo largo del día.`
        }
      ];
    } else if (lang === 'de') {
      return [
        {
          question: `Warum braucht ${name} gleichzeitig Freiheit und Sicherheit?`,
          shortAnswer: `Aufgrund des Kontrasts zwischen dem Drang nach Expansion und dem Bedürfnis nach Stabilität in Ihrem Horoskop.`,
          deepAnswer: `Ihre Sonnenessenz bringt ein angeborenes Verlangen nach Autonomie mit sich, während Erdwinkel ein solides Fundament verlangen. Dies schafft eine Dynamik der Suche nach einem 'sicheren Hafen', der als Startrampe dient, nicht als Käfig.`,
          factors: [`Sonne in ${sol?.sign || 'Wassermann'}`, `Mond in ${lua?.sign || 'Fische'}`, `Aszendent in ${asc?.sign || 'Schütze'}`],
          advice: `Schaffen Sie flexible Routinen: Haben Sie feste Verpflichtungen für Gesundheit und Finanzen, aber lassen Sie Freiraum im Wochenplan für Spontanität.`
        },
        {
          question: `Warum analysieren Sie die Dinge tief, bevor Sie Stellung beziehen?`,
          shortAnswer: `Ihr Verstand sucht absolute Klarheit und Kohärenz, bevor er eine endgültige Meinung äußert.`,
          deepAnswer: `Mit Merkurs Energie und Reflexionsaspekten in Ihrem Horoskop haben Sie einen inneren Filter, der Oberflächlichkeit verabscheut. Sie bevorzugen klares Schweigen gegenüber unbegründetem Sprechen.`,
          factors: [`Merkur in ${mercurio?.sign || 'Steinbock'}`, `Saturn in ${saturno?.sign || 'Fische'}`],
          advice: `Vertrauen Sie mehr auf Ihre erste Intuition, ohne jede Hypothese rational validieren zu müssen, bevor Sie handeln.`
        },
        {
          question: `Warum spüren Sie die Emotionen der Umgebung so intensiv?`,
          shortAnswer: `Ihre intuitive Sensibilität erfasst ungesagte Frequenzen vor dem verbalen Dialog.`,
          deepAnswer: `Ihr Mond und die Elemente Wasser/Luft schaffen eine natürliche empathische Antenne. Sie lesen Gesichtsausdrücke, Stimmlagen und emotionale Atmosphären wie ein offenes Buch.`,
          factors: [`Mond in ${lua?.sign || 'Fische'}`, `Venus in ${venus?.sign || 'Wassermann'}`],
          advice: `Setzen Sie klare psychische Grenzen: Nicht alle Emotionen der Umgebung gehören Ihnen. Machen Sie im Laufe des Tages Pausen in Stille.`
        }
      ];
    } else if (lang === 'fr') {
      return [
        {
          question: `Pourquoi ${name} peut-il avoir besoin de liberté et de sécurité en même temps?`,
          shortAnswer: `En raison du contraste entre la recherche d'expansion et le besoin de stabilité dans votre thème natal.`,
          deepAnswer: `Votre essence solaire apporte un désir inné d'autonomie, tandis que les signes de terre ou maisons angulaires demandent des fondations solides avant de sauter. Cela crée une dynamique de recherche d'un 'port d'attache' servant de rampe de lancement, jamais de cage.`,
          factors: [`Soleil en ${sol?.sign || 'Verseau'}`, `Lune en ${lua?.sign || 'Poissons'}`, `Ascendant en ${asc?.sign || 'Sagittaire'}`],
          advice: `Créez des routines flexibles: gardez des engagements fixes pour la santé et les finances, mais préservez de l'espace libre dans votre emploi du temps pour la spontanéité.`
        },
        {
          question: `Pourquoi analysez-vous profondément les choses avant de vous positionner?`,
          shortAnswer: `Votre esprit recherche une clarté absolue et une cohérence avant d'exprimer une opinion définitive.`,
          deepAnswer: `Avec l'énergie de Mercure et les aspects de réflexion dans votre thème, vous avez un filtre interne qui déteste la superficialité. Vous préférez le silence lucide plutôt que de parler sans fondement.`,
          factors: [`Mercure en ${mercurio?.sign || 'Capricorne'}`, `Saturne en ${saturno?.sign || 'Poissons'}`],
          advice: `Faites davantage confiance à votre première intuition sans avoir besoin de valider rationnellement chaque hypothèse avant d'agir.`
        },
        {
          question: `Pourquoi ressentez-vous les émotions environnantes avec tant d'intensité?`,
          shortAnswer: `Votre sensibilité intuitive capte des fréquences non dites avant le dialogue verbal.`,
          deepAnswer: `La présence de votre Lune et de l'élément Eau/Air crée une antenne empathique naturelle. Vous lisez les expressions, tons de voix et atmosphères émotionnelles comme un livre ouvert.`,
          factors: [`Lune en ${lua?.sign || 'Poissons'}`, `Vénus en ${venus?.sign || 'Verseau'}`],
          advice: `Établissez des limites psychiques claires: toutes les émotions environnantes ne vous appartiennent pas. Faites des pauses en silence au cours de la journée.`
        }
      ];
    }

    return [
      {
        question: `Por que ${name} pode precisar de liberdade e segurança ao mesmo tempo?`,
        shortAnswer: `Por causa do contraste entre a busca de expansão e a necessidade de estabilidade no seu mapa natal.`,
        deepAnswer: `Sua essência solar traz um desejo nato de autonomia e voo alto, enquanto posicionamentos em casas angulares ou signos de terra pedem alicerces sólidos antes de dar qualquer salto. Isso cria uma dinâmica de buscar um 'porto seguro' que sirva de plataforma de lançamento, nunca de gaiola.`,
        factors: [`Sol em ${sol?.sign || 'Aquário'}`, `Lua em ${lua?.sign || 'Peixes'}`, `Ascendente em ${asc?.sign || 'Sagitário'}`],
        advice: `Crie rotinas flexíveis: tenha compromissos fixos com sua saúde e finanças, mas mantenha espaço livre na sua agenda semanal para a espontaneidade.`
      },
      {
        question: `Por que você analisa profundamente as coisas antes de se posicionar?`,
        shortAnswer: `Sua mente busca clareza absoluta e coerência antes de expressar uma opinião definitiva.`,
        deepAnswer: `Com a energia de Mercúrio e os aspectos de reflexão no seu mapa, você tem um filtro interno que detesta a superficialidade. Você prefere o silêncio lúcido a falar sem fundamento.`,
        factors: [`Mercúrio em ${mercurio?.sign || 'Capricórnio'}`, `Saturno em ${saturno?.sign || 'Peixes'}`],
        advice: `Confie mais na sua primeira intuição sem precisar validar racionalmente cada hipótese antes de agir.`
      },
      {
        question: `Por que você sente as emoções dos ambientes com tanta intensidade?`,
        shortAnswer: `Sua sensibilidade intuitiva capta frequências não ditas antes do diálogo verbal.`,
        deepAnswer: `A presença da sua Lua e do elemento Água/Ar no seu mapa cria uma antena empática natural. Você lê expressões, tons de voz e atmosferas emocionais como quem lê um livro aberto.`,
        factors: [`Lua em ${lua?.sign || 'Peixes'}`, `Vênus em ${venus?.sign || 'Aquário'}`],
        advice: `Estabeleça limites psíquicos claros: nem todas as emoções do ambiente pertencem a você. Faça pausas em silêncio ao longo do dia.`
      }
    ];
  }, [user.name, sol, lua, asc, mercurio, saturno, venus, lang]);

  // Paradoxes (Internal Contradictions) list
  const paradoxesList = useMemo(() => {
    if (lang === 'en') {
      return [
        {
          title: "The Paradox of Reason vs. Intuition",
          forceA: `Search for Logic & Practicality (Sun in ${sol?.sign || 'Aquarius'})`,
          forceB: `Boundless Sensitivity & Empathy (Moon in ${lua?.sign || 'Pisces'})`,
          whyContradictory: "Part of you wants to analyze facts with scientific impartiality, while another part feels and intuits the answer before logic even forms.",
          integration: "Your logic does not need to invalidate your intuition. Use intuition as a radar to point ways and logic as a compass to structure steps."
        },
        {
          title: "The Paradox of Autonomy vs. Deep Connection",
          forceA: `Independence & Personal Space (Venus/Mars in ${marte?.sign || 'Aquarius'})`,
          forceB: `Need for Loyalty & Belonging (House 4 and Saturn)`,
          whyContradictory: "You want to build solid bonds, but fear feeling your freedom restricted or your individuality suffocated.",
          integration: "Truly healthy relationships do not trap; they function as partnerships between two free minds choosing to walk together."
        }
      ];
    } else if (lang === 'es') {
      return [
        {
          title: "El Paradoja de la Razón vs. Intuición",
          forceA: `Búsqueda de Lógica y Practicidad (Sol en ${sol?.sign || 'Acuario'})`,
          forceB: `Sensibilidad y Empatía Ilimitada (Luna en ${lua?.sign || 'Piscis'})`,
          whyContradictory: "Una parte de ti quiere analizar los hechos con imparcialidad científica, mientras otra parte siente e intuye la respuesta antes de que la lógica se formule.",
          integration: "Tu lógica no necesita anular tu intuición. Usa la intuición como radar para señalar caminos y la lógica como brújula para estructurar pasos."
        },
        {
          title: "El Paradoja de la Autonomía vs. Vínculo Profundo",
          forceA: `Independencia y Espacio Personal (Venus/Marte en ${marte?.sign || 'Acuario'})`,
          forceB: `Necesidad de Lealtad y Pertenencia (Casa 4 y Saturno)`,
          whyContradictory: "Deseas construir lazos sólidos, pero temes sentir tu libertad coartada o tu individualidad sofocada.",
          integration: "Las relaciones verdaderamente saludables no atrapan; funcionan como asociaciones entre dos mentes libres que eligen caminar juntas."
        }
      ];
    } else if (lang === 'de') {
      return [
        {
          title: "Das Paradoxon von Vernunft vs. Intuition",
          forceA: `Suche nach Logik & Praktikabilität (Sonne in ${sol?.sign || 'Wassermann'})`,
          forceB: `Grenzenlose Sensibilität & Empathie (Mond in ${lua?.sign || 'Fische'})`,
          whyContradictory: "Ein Teil von Ihnen möchte Fakten wissenschaftlich unparteiisch analysieren, während ein anderer Teil die Antwort fühlt, bevor sich Logik formt.",
          integration: "Ihre Logik muss Ihre Intuition nicht entkräften. Nutzen Sie Intuition als Radar und Logik als Kompass, um Schritte zu strukturieren."
        },
        {
          title: "Das Paradoxon von Autonomie vs. Tiefe Verbindung",
          forceA: `Unabhängigkeit & Persönlicher Raum (Venus/Mars in ${marte?.sign || 'Wassermann'})`,
          forceB: `Bedürfnis nach Loyalität & Zugehörigkeit (Haus 4 und Saturn)`,
          whyContradictory: "Sie möchten solide Bindungen aufbauen, fürchten aber, dass Ihre Freiheit eingeschränkt oder Ihre Individualität erstickt wird.",
          integration: "Wahrlich gesunde Beziehungen sperren nicht ein; sie funktionieren als Partnerschaften zwischen zwei freien Geisteshaltungen."
        }
      ];
    } else if (lang === 'fr') {
      return [
        {
          title: "Le Paradoxe de la Raison vs. Intuition",
          forceA: `Recherche de Logique & Pragmatisme (Soleil en ${sol?.sign || 'Verseau'})`,
          forceB: `Sensibilité & Empathie Illimitée (Lune en ${lua?.sign || 'Poissons'})`,
          whyContradictory: "Une partie de vous veut analyser les faits avec imparcialité, tandis qu'une autre ressent l'interrogation avant même que la logique ne se formule.",
          integration: "Votre logique n'a pas besoin d'annuler votre intuition. Utilisez l'intuition comme radar et la logique comme boussole pour structurer les étapes."
        },
        {
          title: "Le Paradoxe de l'Autonomie vs. Lien Profond",
          forceA: `Indépendance & Espace Personnel (Vénus/Mars en ${marte?.sign || 'Verseau'})`,
          forceB: `Besoin de Loyauté & Appartenance (Maison 4 et Saturne)`,
          whyContradictory: "Vous désirez construire des liens solides, mais craignez de sentir votre liberté restreinte ou votre individualité étouffée.",
          integration: "Les relations véritablement saines n'enferment pas; elles fonctionnent comme un partenariat entre deux esprits libres."
        }
      ];
    }

    return [
      {
        title: "O Paradoxo da Razão vs. Intuição",
        forceA: `Busca por Lógica e Praticidade (Sol em ${sol?.sign || 'Aquário'})`,
        forceB: `Sensibilidade e Empatia Ilimitada (Lua em ${lua?.sign || 'Peixes'})`,
        whyContradictory: "Uma parte de você quer analisar os fatos com imparcialidade científica, enquanto outra parte sente e intui a resposta antes mesmo da lógica se formular.",
        integration: "Sua lógica não precisa anular sua intuição. Use a intuição como radar para apontar caminhos e a lógica como bússola para estruturar os passos."
      },
      {
        title: "O Paradoxo da Autonomia vs. Vínculo Profundo",
        forceA: `Independência e Espaço Pessoal (Vênus/Marte em ${marte?.sign || 'Aquário'})`,
        forceB: `Necessidade de Lealdade e Pertencimento (Casa 4 e Saturno)`,
        whyContradictory: "Você deseja construir laços sólidos, mas tem pavor de sentir sua liberdade tolhida ou sua individualidade sufocada.",
        integration: "Relacionamentos verdadeiramente saudáveis não prendem; funcionam como parcerias entre duas mentes livres que escolhem caminhar juntas."
      }
    ];
  }, [sol, lua, marte, lang]);

  // Life Areas data list
  const lifeAreasList = useMemo(() => {
    if (lang === 'en') {
      return [
        {
          id: 'identidade',
          name: 'Identity & Self-Esteem',
          icon: User,
          influences: `Sun in ${sol?.sign || 'Aquarius'}, Ascendant in ${asc?.sign || 'Sagittarius'}`,
          manifestation: "Constant pursuit of authenticity, clarity on who you are, and refusal to accept imposed roles.",
          potential: "Natural charisma, originality, clear vision of values, and ability to inspire people.",
          challenge: "Difficulty dealing with criticism from those who do not understand your broader vision.",
          recommendation: "Honor your uniqueness without needing to prove anything to anyone."
        },
        {
          id: 'emocional',
          name: 'Emotions & Security',
          icon: Heart,
          influences: `Moon in ${lua?.sign || 'Pisces'}, Neptune Aspects`,
          manifestation: "Elevated sensitivity, need for periodic retreat for energetic restoration.",
          potential: "Extraordinary empathy, rich imagination, and capacity for healing and welcoming.",
          challenge: "Inadvertent absorption of environmental tensions.",
          recommendation: "Create a sanctuary of peace in your home and cultivate moments of restorative solitude."
        },
        {
          id: 'carreira',
          name: 'Work & Vocation',
          icon: Briefcase,
          influences: `Midheaven, Saturn in ${saturno?.sign || 'Pisces'}`,
          manifestation: "Desire to build something with real purpose and lasting impact beyond mere financial livelihood.",
          potential: "Pragmatism, strategic organizational capacity, and conscious leadership.",
          challenge: "High internal standard and fear of imperfection in projects.",
          recommendation: "Celebrate small daily advances while constructing your long-term vision."
        },
        {
          id: 'amor',
          name: 'Love & Relationships',
          icon: Users,
          influences: `Venus in ${venus?.sign || 'Aquarius'}, Mars in ${marte?.sign || 'Aquarius'}`,
          manifestation: "Search for intellectual companionship, fluid dialogue, and mutual respect for freedom.",
          potential: "Deep loyalty, sincere friendship in relationships, and ability to reinvent passion.",
          challenge: "Resistance to dramatic emotional games or possessiveness.",
          recommendation: "Maintain transparent communication from the first moments of connection."
        }
      ];
    } else if (lang === 'es') {
      return [
        {
          id: 'identidade',
          name: 'Identidad y Autoestima',
          icon: User,
          influences: `Sol en ${sol?.sign || 'Acuario'}, Ascendente en ${asc?.sign || 'Sagitario'}`,
          manifestation: "Búsqueda constante de autenticidad, claridad sobre quién eres y rechazo a aceptar papeles impuestos.",
          potential: "Carisma natural, originalidad, visión clara de valores y capacidad de inspirar.",
          challenge: "Dificultad para lidiar con críticas de quienes no comprenden tu visión amplia.",
          recommendation: "Honra tu singularidad sin tener que demostrar nada a nadie."
        },
        {
          id: 'emocional',
          name: 'Emociones y Seguridad',
          icon: Heart,
          influences: `Luna en ${lua?.sign || 'Piscis'}, Aspectos con Neptuno`,
          manifestation: "Sensibilidad elevada, necesidad de retiro periódico para restauración energética.",
          potential: "Empatía extraordinaria, imaginación rica y capacidad de sanación y acogida.",
          challenge: "Absorción inadvertida de tensiones del ambiente.",
          recommendation: "Crea un santuario de paz en tu hogar y cultiva momentos de soledad restauradora."
        },
        {
          id: 'carreira',
          name: 'Trabajo y Vocación',
          icon: Briefcase,
          influences: `Medio Cielo, Saturno en ${saturno?.sign || 'Piscis'}`,
          manifestation: "Deseo de construir algo con propósito real e impacto duradero más allá del mero sustento.",
          potential: "Pragmatismo, capacidad de organización estratégica y liderazgo consciente.",
          challenge: "Alta exigencia interna y miedo a la imperfección en los proyectos.",
          recommendation: "Celebra los pequeños avances diarios mientras construyes tu visión a largo plazo."
        },
        {
          id: 'amor',
          name: 'Amor y Vínculos',
          icon: Users,
          influences: `Venus en ${venus?.sign || 'Acuario'}, Marte en ${marte?.sign || 'Acuario'}`,
          manifestation: "Búsqueda de compañerismo intelectual, diálogo fluido y respeto mutuo a la libertad.",
          potential: "Lealtad profunda, amistad sincera en la relación y capacidad de reinventar la pasión.",
          challenge: "Resistencia a juegos emocionales dramáticos o posesividad.",
          recommendation: "Mantén la comunicación transparente desde los primeros momentos."
        }
      ];
    } else if (lang === 'de') {
      return [
        {
          id: 'identidade',
          name: 'Identität & Selbstwert',
          icon: User,
          influences: `Sonne in ${sol?.sign || 'Wassermann'}, Aszendent in ${asc?.sign || 'Schütze'}`,
          manifestation: "Ständiges Streben nach Authentizität, Klarheit darüber, wer Sie sind, und Ablehnung aufgedrängter Rollen.",
          potential: "Natürliches Charisma, Originalität, klare Wertevision und Fähigkeit, Menschen zu inspirieren.",
          challenge: "Schwierigkeit im Umgang mit Kritik von Personen, die Ihre weite Vision nicht verstehen.",
          recommendation: "Ehren Sie Ihre Einzigartigkeit, ohne jemandem etwas beweisen zu müssen."
        },
        {
          id: 'emocional',
          name: 'Emotionen & Sicherheit',
          icon: Heart,
          influences: `Mond in ${lua?.sign || 'Fische'}, Neptun-Aspekte`,
          manifestation: "Hohe Sensibilität, Bedürfnis nach regelmäßigem Rückzug zur energetischen Erneuerung.",
          potential: "Außergewöhnliche Empathie, reiche Vorstellungskraft und Heilungsfähigkeit.",
          challenge: "Unbeabsichtigte Aufnahme von Spannungen der Umgebung.",
          recommendation: "Schaffen Sie eine Friedensoase in Ihrem Zuhause und pflegen Sie Momente heilsamer Einsamkeit."
        },
        {
          id: 'carreira',
          name: 'Arbeit & Berufung',
          icon: Briefcase,
          influences: `Medium Coeli, Saturn in ${saturno?.sign || 'Fische'}`,
          manifestation: "Wunsch, etwas mit echtem Zweck und dauerhafter Wirkung über den bloßen Lebensunterhalt hinaus aufzubauen.",
          potential: "Pragmatismus, strategische Organisationsfähigkeit und bewusstes Führungsverhalten.",
          challenge: "Hohe innere Anforderung und Angst vor Unvollkommenheit in Projekten.",
          recommendation: "Feiern Sie kleine tägliche Fortschritte, während Sie Ihre langfristige Vision aufbauen."
        },
        {
          id: 'amor',
          name: 'Liebe & Beziehungen',
          icon: Users,
          influences: `Venus in ${venus?.sign || 'Wassermann'}, Mars in ${marte?.sign || 'Wassermann'}`,
          manifestation: "Suche nach intellektueller Gefährtenschaft, flüssigem Dialog und gegenseitigem Respekt für Freiheit.",
          potential: "Tiefe Loyalität, aufrichtige Freundschaft in der Beziehung und Fähigkeit, Leidenschaft neu zu erfinden.",
          challenge: "Widerstand gegen dramatische gefühlsmäßige Spiele oder Besitzdenken.",
          recommendation: "Pflegen Sie von den ersten Momenten an eine transparente Kommunikation."
        }
      ];
    } else if (lang === 'fr') {
      return [
        {
          id: 'identidade',
          name: 'Identité & Estime de Soi',
          icon: User,
          influences: `Soleil en ${sol?.sign || 'Verseau'}, Ascendant en ${asc?.sign || 'Sagittaire'}`,
          manifestation: "Recherche constante d'authenticité, clarté sur qui vous êtes et refus d'accepter des rôles imposés.",
          potential: "Charisme naturel, originalité, vision claire des valeurs et capacité d'inspirer les personnes.",
          challenge: "Difficulté à gérer les critiques de ceux qui ne comprennent pas votre vision globale.",
          recommendation: "Honorez votre singularité sans avoir besoin de prouver quoi que ce soit à quiconque."
        },
        {
          id: 'emocional',
          name: 'Émotions & Sécurité',
          icon: Heart,
          influences: `Lune en ${lua?.sign || 'Poissons'}, Aspects avec Neptune`,
          manifestation: "Sensibilité élevée, besoin de retraite périodique pour la restauration énergétique.",
          potential: "Empathie extraordinaire, imagination riche et capacité de guérison et d'accueil.",
          challenge: "Absorption par inadvertance des tensions de l'environnement.",
          recommendation: "Créez un sanctuaire de paix dans votre foyer et cultivez des moments de solitude régénérante."
        },
        {
          id: 'carreira',
          name: 'Travail & Vocation',
          icon: Briefcase,
          influences: `Milieu du Ciel, Saturne en ${saturno?.sign || 'Poissons'}`,
          manifestation: "Désir de construire quelque chose avec un véritable objectif et un impact durable au-delà du seul gagne-pain.",
          potential: "Pragmatisme, capacité d'organisation stratégique et leadership conscient.",
          challenge: "Exigence interne élevée et peur de l'imperfection dans les projets.",
          recommendation: "Célébrez les petits progrès quotidiens tout en construisant votre vision à long terme."
        },
        {
          id: 'amor',
          name: 'Amour & Liens',
          icon: Users,
          influences: `Vénus en ${venus?.sign || 'Verseau'}, Mars en ${marte?.sign || 'Verseau'}`,
          manifestation: "Recherche de complicité intellectuelle, dialogue fluide et respect mutuel de la liberté.",
          potential: "Loyauté profonde, amitié sincère dans la relation et capacité à réinventer la passion.",
          challenge: "Résistance aux jeux émotionnels dramatiques ou à la possessivité.",
          recommendation: "Maintenez une communication transparente dès les premiers moments d'approche."
        }
      ];
    }

    return [
      {
        id: 'identidade',
        name: 'Identidade & Autoestima',
        icon: User,
        influences: `Sol em ${sol?.sign || 'Aquário'}, Ascendente em ${asc?.sign || 'Sagitário'}`,
        manifestation: "Busca constante por autenticidade, clareza sobre quem você é e recusa em aceitar papéis impostos.",
        potential: "Carisma natural, originalidade, visão clara de valores e capacidade de inspirar pessoas.",
        challenge: "Dificuldade em lidar com críticas de quem não compreende sua visão ampla.",
        recommendation: "Honre sua singularidade sem precisar provar nada a ninguém."
      },
      {
        id: 'emocional',
        name: 'Emoções & Segurança',
        icon: Heart,
        influences: `Lua em ${lua?.sign || 'Peixes'}, Aspectos com Netuno`,
        manifestation: "Sensibilidade elevada, necessidade de recolhimento periódico para restauração energética.",
        potential: "Empatia extraordinária, imaginação rica e capacidade de cura e acolhimento.",
        challenge: "Absorção inadvertida de tensões do ambiente.",
        recommendation: "Crie um santuário de paz no seu lar e cultive momentos de solitude restauradora."
      },
      {
        id: 'carreira',
        name: 'Trabalho & Vocação',
        icon: Briefcase,
        influences: `Meio do Céu, Saturno em ${saturno?.sign || 'Peixes'}`,
        manifestation: "Desejo de construir algo com propósito real e impacto duradouro, além do mero sustento financeiro.",
        potential: "Pragmatismo, capacidade de organização estratégica e liderança consciente.",
        challenge: "Exigência interna elevada e medo de imperfeição nos projetos.",
        recommendation: "Celebre os pequenos avanços diários enquanto constrói sua visão de longo prazo."
      },
      {
        id: 'amor',
        name: 'Amor & Vínculos',
        icon: Users,
        influences: `Vênus em ${venus?.sign || 'Aquário'}, Marte em ${marte?.sign || 'Aquário'}`,
        manifestation: "Busca por companheirismo intelectual, diálogo fluido e respeito mútuo à liberdade.",
        potential: "Lealdade profunda, amizade sincera no relacionamento e capacidade de reinventar a paixão.",
        challenge: "Resistência a dramáticos jogos emocionais ou possessividade.",
        recommendation: "Mantenha a comunicação transparente desde os primeiros momentos de aproximação."
      }
    ];
  }, [sol, lua, asc, saturno, venus, marte, lang]);

  // Bússola do Momento (Current Moment Guidance)
  const bussolaMomento = useMemo(() => {
    if (lang === 'en') {
      return {
        energiaAFavor: "Mental clarity for strategic planning and resolving long-standing tasks.",
        pontoDeAtencao: "Avoid excessive self-criticism during periods of natural deceleration.",
        areaMaisAtivada: "Communication, new learnings, and alignment of your daily purpose.",
        perguntaParaReflexao: `"What can I simplify today to make room for what truly matters in my life?"`,
        microacao: "Write down your 3 core objectives for the week in a few lines and eliminate one dispensable task."
      };
    } else if (lang === 'es') {
      return {
        energiaAFavor: "Claridad mental para planificación estratégica y resolución de tareas pendientes.",
        pontoDeAtencao: "Evitar la autocrítica excesiva en momentos de desaceleración natural.",
        areaMaisAtivada: "Comunicación, nuevos aprendizajes y alineación de tu propósito diario.",
        perguntaParaReflexao: `"¿Qué puedo simplificar hoy para abrir espacio a lo que realmente me importa?"`,
        microacao: "Escribe en pocas líneas tus 3 objetivos centrales para la semana y elimina una tarea prescindible."
      };
    } else if (lang === 'de') {
      return {
        energiaAFavor: "Geistige Klarheit für strategische Planung und Lösung alter Aufgaben.",
        pontoDeAtencao: "Vermeiden Sie übermäßige Selbstkritik in Phasen natürlicher Verlangsamung.",
        areaMaisAtivada: "Kommunikation, neue Erkenntnisse und Ausrichtung Ihres täglichen Zwecks.",
        perguntaParaReflexao: `"Was kann ich heute vereinfachen, um Raum für das zu schaffen, was in meinem Leben wirklich zählt?"`,
        microacao: "Schreiben Sie in wenigen Zeilen Ihre 3 Hauptziele für die Woche auf und streichen Sie eine entbehrliche Aufgabe."
      };
    } else if (lang === 'fr') {
      return {
        energiaAFavor: "Clarté mentale pour la planification stratégique et la résolution de tâches anciennes.",
        pontoDeAtencao: "Évitez l'autocritique excessive lors des moments de ralentissement naturel.",
        areaMaisAtivada: "Communication, nouveaux apprentissages et alignement de votre objectif quotidien.",
        perguntaParaReflexao: `"Que puis-je simplifier aujourd'hui pour faire de la place à ce qui compte vraiment dans ma vie?"`,
        microacao: "Écrivez en quelques lignes vos 3 objectifs centraux pour la semaine et éliminez une tâche superflu."
      };
    }

    return {
      energiaAFavor: "Clareza mental para planejamento estratégico e resolução de pendências antigas.",
      pontoDeAtencao: "Evitar a autocritica excessiva em momentos de desaceleração natural.",
      areaMaisAtivada: "Comunicação, novos aprendizados e alinhamento do seu propósito diário.",
      perguntaParaReflexao: `"O que eu posso simplificar hoje para abrir espaço para o que realmente importa na minha vida?"`,
      microacao: "Escreva em poucas linhas seus 3 objetivos centrais para a semana e elimine uma tarefa dispensável."
    };
  }, [lang]);

  // "Seu Mapa em Uma Frase"
  const oneSentenceMap = useMemo(() => {
    const name = user.name || (lang === 'en' ? 'You' : lang === 'es' ? 'Tú' : lang === 'de' ? 'Sie' : lang === 'fr' ? 'Vous' : 'Você');
    if (lang === 'en') {
      return `"${name} possesses the brilliant mind of a visionary (Sun in ${sol?.sign || 'Aquarius'}), guided by the intuition of a sensitive soul (Moon in ${lua?.sign || 'Pisces'}), and focused on building achievements with purpose and autonomy."`;
    } else if (lang === 'es') {
      return `"${name} posee la mente brillante de un visionario (Sol en ${sol?.sign || 'Acuario'}), guiado por la intuición de un alma sensible (Luna en ${lua?.sign || 'Piscis'}) y enfocado en edificar logros con propósito y autonomía."`;
    } else if (lang === 'de') {
      return `"${name} besitzt den brillanten Verstand eines Visionärs (Sonne in ${sol?.sign || 'Wassermann'}), geführt von der Intuition einer sensiblen Seele (Mond in ${lua?.sign || 'Fische'}) und darauf fokussiert, Erfolge mit Zweck und Autonomie zu schaffen."`;
    } else if (lang === 'fr') {
      return `"${name} possède l'esprit brillant d'un visionnaire (Soleil en ${sol?.sign || 'Verseau'}), guidé par l'intuition d'une âme sensible (Lune en ${lua?.sign || 'Poissons'}) et axé sur la construction de réalisations autonomes."`;
    }
    return `"${user.name || 'Você'} possui a mente brilhante de um visionário (Sol em ${sol?.sign || 'Aquário'}), guiado pela intuição de uma alma sensível (Lua em ${lua?.sign || 'Peixes'}) e focado em edificar realizações com propósito e autonomia."`;
  }, [user.name, sol, lua, lang]);

  return (
    <div className="w-full space-y-6 bg-slate-950/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-800/80 text-slate-100 shadow-2xl">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              {uiTexts.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {uiTexts.subtitle}
          </p>
        </div>

        {/* Technical Glossary Quick Button */}
        <button
          onClick={() => setGlossaryModalTerm(glossaryTerms.planeta)}
          className="flex items-center gap-2 text-xs bg-slate-800/80 hover:bg-slate-700/90 text-amber-300 px-3 py-2 rounded-xl border border-amber-500/30 transition-all cursor-pointer shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{uiTexts.glossaryHelp}</span>
        </button>
      </div>

      {/* ONE SENTENCE MAP CARD */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-purple-950/30 border border-amber-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <Feather className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400/90 block mb-1">
              {uiTexts.oneSentenceTitle}
            </span>
            <p className="text-sm sm:text-base italic font-serif text-amber-100 leading-relaxed">
              {oneSentenceMap}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('camadas')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'camadas'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          {uiTexts.tabCamadas}
        </button>

        <button
          onClick={() => setActiveTab('por_que')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'por_que'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          {uiTexts.tabPorQue}
        </button>

        <button
          onClick={() => setActiveTab('paradoxos')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'paradoxos'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Split className="w-4 h-4" />
          {uiTexts.tabParadoxos}
        </button>

        <button
          onClick={() => setActiveTab('areas')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'areas'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Target className="w-4 h-4" />
          {uiTexts.tabAreas}
        </button>

        <button
          onClick={() => setActiveTab('cruzamento')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'cruzamento'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          {uiTexts.tabCruzamento}
        </button>

        <button
          onClick={() => setActiveTab('grafo')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'grafo'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          {uiTexts.tabGrafo}
        </button>

        <button
          onClick={() => setActiveTab('bussola')}
          className={`flex items-center gap-2 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'bussola'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          {uiTexts.tabBussola}
        </button>
      </div>

      {/* TAB 1: MAPA EM CAMADAS (10-LAYER DEEP DIVE) */}
      {activeTab === 'camadas' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Depth Selector (Level 1 / 2 / 3) */}
          <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium px-2">
              {lang === 'en' ? 'Depth:' : lang === 'es' ? 'Profundidad:' : lang === 'de' ? 'Tiefe:' : lang === 'fr' ? 'Profondeur:' : 'Profundidade:'}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setDepthLevel(1)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  depthLevel === 1
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {uiTexts.level1}
              </button>
              <button
                onClick={() => setDepthLevel(2)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  depthLevel === 2
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {uiTexts.level2}
              </button>
              <button
                onClick={() => setDepthLevel(3)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  depthLevel === 3
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {uiTexts.level3}
              </button>
            </div>
          </div>

          {/* Points Explorer Selector Pills */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">{uiTexts.selectItem}</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(mapData?.astros || []).map((ast) => (
                <button
                  key={ast.name}
                  onClick={() => setSelectedAstro(ast)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    selectedAstro?.name === ast.name
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{ast.name}</span>
                  <span className="text-slate-500 ml-1">({ast.sign})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 10-LAYER BREAKDOWN CARD */}
          {selectedAstroBreakdown && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    ★
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-amber-200">
                      {selectedAstroBreakdown.title}
                    </h3>
                    <span className="text-xs text-slate-400">{uiTexts.fullAnalysisTitle}</span>
                  </div>
                </div>

                {/* Evidence Button */}
                <button
                  onClick={() =>
                    setEvidenceModalData({
                      title: selectedAstroBreakdown.title,
                      explanation: lang === 'en' ? "This interpretation was built by rigorously correlating the real mathematical data of your birth chart with Placidus position astronomy." :
                                   lang === 'es' ? "Esta interpretación fue construida correlacionando rigurosamente los datos matemáticos reales de tu mapa natal con la astronomía de posición Placidus." :
                                   lang === 'de' ? "Diese Interpretation wurde erstellt, indem die realen mathematischen Daten Ihres Geburtshoroskops mit der Placidus-Positionsastronomie korreliert wurden." :
                                   lang === 'fr' ? "Cette interprétation a été construite en corrélant rigoureusement les données mathématiques réelles de votre thème natal avec l'astronomie de position Placidus." :
                                   "Esta interpretação foi construída correlacionando rigorosamente os dados matemáticos reais do seu mapa natal com a astronomia de posição Placidus.",
                      evidenceList: selectedAstroBreakdown.evidenceList
                    })
                  }
                  className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{uiTexts.whyButton}</span>
                  <span className="sm:hidden">{lang === 'en' ? 'Evidence' : lang === 'es' ? 'Evidencia' : lang === 'de' ? 'Beweis' : lang === 'fr' ? 'Preuve' : 'Evidência'}</span>
                </button>
              </div>

              {/* LEVEL 1: RESUMO */}
              {depthLevel >= 1 && (
                <div className="space-y-3">
                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                      {uiTexts.layer1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedAstroBreakdown.layer1_oQueE}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                      {uiTexts.layer2}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedAstroBreakdown.layer2_oQueRepresenta}
                    </p>
                  </div>
                </div>
              )}

              {/* LEVEL 2: ENTENDA */}
              {depthLevel >= 2 && (
                <div className="space-y-3 pt-2 border-t border-slate-800/60">
                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                      {uiTexts.layer3}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedAstroBreakdown.layer3_comoSeManifesta}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                      {uiTexts.layer4}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedAstroBreakdown.layer4_ondeImpacta}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                        {uiTexts.layer5}
                      </span>
                      <p className="text-xs text-emerald-200 leading-relaxed">
                        {selectedAstroBreakdown.layer5_potencialConstrutivo}
                      </p>
                    </div>

                    <div className="bg-rose-950/20 p-3.5 rounded-xl border border-rose-500/30">
                      <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                        {uiTexts.layer6}
                      </span>
                      <p className="text-xs text-rose-200 leading-relaxed">
                        {selectedAstroBreakdown.layer6_desafioPotencial}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LEVEL 3: APROFUNDE */}
              {depthLevel >= 3 && (
                <div className="space-y-3 pt-2 border-t border-slate-800/60">
                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                      {uiTexts.layer7}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedAstroBreakdown.layer7_sinaisReconhecer}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                      {uiTexts.layer8}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedAstroBreakdown.layer8_comoTrabalhar}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                        {uiTexts.layer9}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedAstroBreakdown.layer9_oQueModifica}
                      </p>
                    </div>

                    <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                        {uiTexts.layer10}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedAstroBreakdown.layer10_conexaoMapa}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POR QUE SOU ASSIM? */}
      {activeTab === 'por_que' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-base font-bold text-amber-300 mb-1">
              {uiTexts.behavioralDiscoveriesTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {uiTexts.behavioralDiscoveriesSub}
            </p>
          </div>

          <div className="space-y-4">
            {whyAmILikeThisList.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 font-bold text-sm">
                    ?
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-amber-200">
                      {item.question}
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-amber-400/90 mt-1">
                      {item.shortAnswer}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
                  {item.deepAnswer}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-medium">{uiTexts.involvedFactors}</span>
                  {item.factors.map((f, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20 font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200 leading-relaxed">
                    <span className="font-semibold">{uiTexts.practicalAdvice}</span> {item.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARADOXOS DO MAPA */}
      {activeTab === 'paradoxos' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-base font-bold text-amber-300 mb-1">
              {uiTexts.internalContradictionsTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {uiTexts.internalContradictionsSub}
            </p>
          </div>

          <div className="space-y-4">
            {paradoxesList.map((paradox, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Split className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm sm:text-base font-bold text-amber-200">
                    {paradox.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-sky-400 block mb-1 uppercase tracking-wider">
                      {lang === 'en' ? 'Force A' : lang === 'es' ? 'Fuerza A' : lang === 'de' ? 'Kraft A' : lang === 'fr' ? 'Force A' : 'Força A'}
                    </span>
                    <p className="text-xs text-slate-300 font-medium">
                      {paradox.forceA}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-purple-400 block mb-1 uppercase tracking-wider">
                      {lang === 'en' ? 'Force B' : lang === 'es' ? 'Fuerza B' : lang === 'de' ? 'Kraft B' : lang === 'fr' ? 'Force B' : 'Força B'}
                    </span>
                    <p className="text-xs text-slate-300 font-medium">
                      {paradox.forceB}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-amber-400 block mb-1">
                    {lang === 'en' ? 'Why do they seem contradictory in daily life?' :
                     lang === 'es' ? '¿Por qué parecen contradictorias en el día a día?' :
                     lang === 'de' ? 'Warum erscheinen sie im Alltag widersprüchlich?' :
                     lang === 'fr' ? 'Pourquoi semblent-elles contradictoires au quotidien?' :
                     'Por que parecem contraditórias no cotidiano?'}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {paradox.whyContradictory}
                  </p>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl">
                  <span className="text-xs font-semibold text-emerald-400 block mb-1">
                    {lang === 'en' ? 'How to Constructively Integrate:' :
                     lang === 'es' ? 'Cómo Integrar Constructivamente:' :
                     lang === 'de' ? 'Wie man konstruktiv integriert:' :
                     lang === 'fr' ? 'Comment Intégrer de Manière Constructive:' :
                     'Como Integrar Construtivamente:'}
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                    {paradox.integration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ÁREAS DA VIDA */}
      {activeTab === 'areas' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {lifeAreasList.map((area) => {
              const IconComp = area.icon;
              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedLifeArea(area.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    selectedLifeArea === area.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-amber-400" />
                  <span>{area.name}</span>
                </button>
              );
            })}
          </div>

          {(() => {
            const currentArea = lifeAreasList.find(a => a.id === selectedLifeArea) || lifeAreasList[0];
            return (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-amber-200">
                    {currentArea.name}
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">
                    {currentArea.influences}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-amber-400 block mb-1 uppercase tracking-wider">
                      {uiTexts.howManifests}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentArea.manifestation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30">
                      <span className="text-xs font-semibold text-emerald-400 block mb-1 uppercase tracking-wider">
                        {uiTexts.yourPotential}
                      </span>
                      <p className="text-xs text-emerald-200 leading-relaxed">
                        {currentArea.potential}
                      </p>
                    </div>

                    <div className="bg-rose-950/20 p-3.5 rounded-xl border border-rose-500/30">
                      <span className="text-xs font-semibold text-rose-400 block mb-1 uppercase tracking-wider">
                        {uiTexts.challengeToWatch}
                      </span>
                      <p className="text-xs text-rose-200 leading-relaxed">
                        {currentArea.challenge}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl">
                    <span className="text-xs font-semibold text-amber-400 block mb-1">
                      {uiTexts.howToWorkArea}
                    </span>
                    <p className="text-xs text-amber-200 leading-relaxed">
                      {currentArea.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: CRUZAMENTO ASTROLOGIA X NUMEROLOGIA */}
      {activeTab === 'cruzamento' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-amber-950/40 border border-purple-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-purple-200">
                {uiTexts.mapsMeetTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {uiTexts.mapsMeetSub}
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">{uiTexts.destinyXSun.replace('{num}', String(numerology?.caminhoDeVida || 7))}</span>
                  <span className="text-slate-400">Sol em {sol?.sign || 'Aquário'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'en' ? "Both your Sun and Life Path converge toward authenticity, innovation, and independent growth." :
                   lang === 'es' ? "Tanto tu Sol como tu Camino de Vida convergen hacia la autenticidad, la innovación y la independencia." :
                   lang === 'de' ? "Sowohl Ihre Sonne als auch Ihr Lebensweg konvergieren in Richtung Authentizität, Innovation und Unabhängigkeit." :
                   lang === 'fr' ? "Votre Soleil et votre Chemin de Vie convergent vers l'authenticité, l'innovation et l'indépendance." :
                   "Tanto o seu Sol quanto o seu Caminho de Vida convergem para a busca por autenticidade, inovação e capacidade de edificar novas perspectivas com autonomia."}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">{uiTexts.soulXMoon.replace('{num}', String(numerology?.motivacao || 9))}</span>
                  <span className="text-slate-400">Lua em {lua?.sign || 'Peixes'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'en' ? "Both readings reinforce deep subtle sensitivity, elevated empathy, and an inner drive to help others." :
                   lang === 'es' ? "Ambas lecturas refuerzan una profunda sensibilidad sutil, empatía elevada e impulso interno de ayuda." :
                   lang === 'de' ? "Beide Lesungen verstärken eine tiefe feine Sensibilität, hohe Empathie und den Drang zu helfen." :
                   lang === 'fr' ? "Les deux lectures renforcent une grande sensibilité, une forte empathie et l'envie d'aider." :
                   "Ambas as leituras reforçam uma sensibilidade sutil profunda, empatia elevada e forte impulso interno para ajudar pessoas e trazer sabedoria."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GRAFO DE INFLUÊNCIAS (INTERACTIVE NETWORK GRAPH) */}
      {activeTab === 'grafo' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-base font-bold text-amber-300 mb-1">
              {uiTexts.graphTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {uiTexts.graphSub}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-4 z-10">
              {['Sol', 'Lua', 'Ascendente', 'Saturno', 'Vênus'].map((nodeName) => (
                <button
                  key={nodeName}
                  onClick={() => setSelectedGraphNode(nodeName)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedGraphNode === nodeName
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-105'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  {nodeName}
                </button>
              ))}
            </div>

            {selectedGraphNode && (
              <div className="mt-6 bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl text-center max-w-md animate-fadeIn">
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  {uiTexts.flowOfInfluence.replace('{node}', selectedGraphNode)}
                </span>
                <p className="text-xs text-slate-300">
                  {selectedGraphNode} → {selectedGraphNode === 'Sol' ? (lang === 'en' ? 'House 11 → Projects & Vocation' : 'Casa 11 → Projetos & Vocação') : selectedGraphNode === 'Lua' ? (lang === 'en' ? 'House 4 → Intimacy & Home' : 'Casa 4 → Intimidade & Lar') : (lang === 'en' ? 'Personal Expression' : 'Expressão Pessoal')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: BÚSSOLA DO MOMENTO */}
      {activeTab === 'bussola' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Compass className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-amber-200">
                {uiTexts.compassTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl">
                <span className="text-xs font-semibold text-emerald-400 block mb-1">
                  {uiTexts.energyFavored}
                </span>
                <p className="text-xs text-emerald-200">{bussolaMomento.energiaAFavor}</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl">
                <span className="text-xs font-semibold text-amber-400 block mb-1">
                  {uiTexts.pointOfAttention}
                </span>
                <p className="text-xs text-amber-200">{bussolaMomento.pontoDeAtencao}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-purple-400 block">{uiTexts.areaActivated}</span>
              <p className="text-xs text-slate-300">{bussolaMomento.areaMaisAtivada}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-amber-400 block">{uiTexts.reflectionQuestion}</span>
              <p className="text-xs sm:text-sm italic text-amber-100">{bussolaMomento.perguntaParaReflexao}</p>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-emerald-300 block">{uiTexts.recommendedMicroaction}</span>
              <p className="text-xs text-emerald-100">{bussolaMomento.microacao}</p>
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE MODAL */}
      {evidenceModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEvidenceModalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-amber-200">
                {uiTexts.evidenceTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {evidenceModalData.explanation}
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                {uiTexts.realDataUsed}
              </span>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-mono">
                {evidenceModalData.evidenceList.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setEvidenceModalData(null)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              {uiTexts.close}
            </button>
          </div>
        </div>
      )}

      {/* GLOSSARY TOOLTIP MODAL */}
      {glossaryModalTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setGlossaryModalTerm(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-amber-200">
                  {glossaryModalTerm.term}
                </h3>
                <span className="text-xs text-amber-400/80 font-mono">
                  {glossaryModalTerm.type}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              {glossaryModalTerm.definition}
            </p>

            <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200">
              <span className="font-semibold">{uiTexts.practicalExample}</span> {glossaryModalTerm.example}
            </div>

            <button
              onClick={() => setGlossaryModalTerm(null)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              {uiTexts.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

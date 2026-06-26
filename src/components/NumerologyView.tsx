import React, { useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { NumerologyCycle } from '../types';
import { 
  Hash, 
  Sparkles, 
  BookOpen, 
  Activity, 
  Calendar, 
  Compass, 
  ChevronRight, 
  Gem, 
  Award, 
  AlertTriangle, 
  Heart, 
  Quote, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface NumerologyViewProps {
  numerology: NumerologyCycle;
  user: {
    name: string;
    birthDate: string;
    [key: string]: any;
  };
  lang?: string;
}

// 1. DATA DICTIONARY FOR VIBRATIONAL NUMEROLOGY ARCHETYPES (1 to 9, plus Master Numbers 11 & 22)
export const numerologyInterpretations: Record<number, {
  name: string;
  archetype: string;
  general: string;
  talents: string;
  challenges: string;
  love: string;
  motto: string;
  color: string;
  element: string;
  harmonicNumbers: number[];
}> = {
  1: {
    name: "Liderança, Originalidade e Iniciativa",
    archetype: "O Pioneiro e Empreendedor",
    general: "A vibração 1 representa a força motriz primordial, o início de toda manifestação e a centelha de pura iniciativa. É o número da autossuficiência, determinação férrea e coragem intelectual para desbravar caminhos onde ninguém antes pisou.",
    talents: "Inovação radical, atitude executiva pioneira, facilidade em assumir posições de comando e liderança, extrema autonomia e resiliência diante de cenários altamente desafiadores.",
    challenges: "Tendência ao autoritarismo, ansiedade imediatista, impaciência severa com ritmos mais cooperativos alheios e uma propensão a agir com egoísmo defensivo sob pressão.",
    love: "Busca relacionamentos que valorizem a individualidade sagrada de ambos. Necessita de admiração recíproca genuína e de um parceiro que estimule sua ambição sem tentar domesticar suas ousadias.",
    motto: "Eu abro caminhos originais com foco e ousadia cósmica.",
    color: "from-amber-500 to-orange-600",
    element: "Fogo Volitivo",
    harmonicNumbers: [3, 5, 9]
  },
  2: {
    name: "Diplomacia, Conexão e Sensibilidade",
    archetype: "O Pacificador e Harmonizador",
    general: "A vibração 2 flui com as marés do acolhimento, da associação e do equilíbrio entre polos. É a inteligência sutil que prefere o diálogo ao conflito, atuando como o elemento de ligação ideal nos bastidores do progresso.",
    talents: "Mediação pacífica de tensões, intuição analítica aguçada para sentimentos ocultos, altruísmo, adaptabilidade social refinada e capacidade de escuta terapêutica.",
    challenges: "Superdependência da validação alheia, hipersensibilidade paralisante às críticas, dificuldade histórica em dizer 'não' e retenção de rancor velado para evitar litígios.",
    love: "Entrega total, carinho indissolúvel e busca obsecada por estabilidade doméstica e fusão mental saudável. Precisa de paz, tranquilidade e trocas românticas constantes.",
    motto: "Eu reconcilio as dualidades e teço harmonia no planeta.",
    color: "from-sky-400 to-blue-600",
    element: "Água Intuitiva",
    harmonicNumbers: [4, 6, 8]
  },
  3: {
    name: "Expressão Social, Arte e Expansão",
    archetype: "O Criador e Comunicador",
    general: "A vibração 3 é a pura abundância expressiva. É o arquétipo do artista da existência, transbordando otimismo, carisma vibrante e facilidade inata para converter experiências de vida em discursos magnéticos de inspiração.",
    talents: "Habilidades com escrita, teatro, marketing e oratória, brilhantismo estético, sociabilidade que rompe barreiras frias e energia lúdica que revitaliza os ambientes em que transita.",
    challenges: "Dispersão crônica de esforços em muitos planos rasos, vaidade pessoal sutil, inconsistência nos prazos mundanos e oscilações entre entusiasmo extremo e tédio existencial.",
    love: "Exige liberdade intelectual e trocas descontraídas. Detesta companhias obsessivas ou sentimentos de posse que restrinjam seu dinamismo de amizades e risos.",
    motto: "Eu manifesto a beleza do universo através da palavra e do ser.",
    color: "from-yellow-400 to-amber-500",
    element: "Ar Mutável",
    harmonicNumbers: [1, 5, 9]
  },
  4: {
    name: "Estrutura, Métodos e Consolidação",
    archetype: "O Construtor Sistemático",
    general: "A vibração 4 denota o alicerce absoluto, o pragmatismo firme e a consistência indispensável. Evoca a força do trabalho honesto focado em resultados tangíveis, o respeito a processos e o amor pela seriedade construtiva.",
    talents: "Organização estratégica, paciência de planejamento, lealdade inabalável fundamentada em ações, senso estrito de dever ético e maestria operacional de contingências.",
    challenges: "Teimosia impenetrável a mudanças bruscas, estresse agudo por workaholismo, rigidez dogmática com desvios criativos e relutância em perdoar erros operacionais.",
    love: "Proteção sólida e estabilidade de longo prazo. Promessas cumpridas valem infinitamente mais do que palavras românticas rasas.",
    motto: "Eu consolido, organizo e ergo as bases firmes do futuro.",
    color: "from-emerald-600 to-teal-800",
    element: "Terra Concreta",
    harmonicNumbers: [2, 6, 8]
  },
  5: {
    name: "Liberdade, Mudança e Magnetismo",
    archetype: "O Viajante e Visionário Livre",
    general: "A vibração 5 pulsa na velocidade da luz do conhecimento direto. Rejeita o confinamento e adora testar hipóteses pela experiência na carne. É o arquétipo do explorador moderno de culturas, ideias e experiências novas.",
    talents: "Adaptabilidade impressionante a mudanças rápidas, instinto comercial brilhante, magnetismo persuasivo cativante e coragem natural de arriscar tudo por reformas benéficas.",
    challenges: "Falta absoluta de disciplina quando entediado, inclinação a excessos de indulgência sensorial, ansiedade motora e horror a compromissos burocráticos rígidos.",
    love: "Parceria pautada no vento da novidade. O parceiro ideal deve ser um companheiro de viagens intelectuais ou geográficas constantes, que ame a flexibilidade e odeie cobranças mesquinhas.",
    motto: "Eu experimento o milagre da vida em movimento irrestrito.",
    color: "from-indigo-500 to-purple-600",
    element: "Éter Dinâmico",
    harmonicNumbers: [1, 3, 7]
  },
  6: {
    name: "Cuidado, Responsabilidade e Equilíbrio",
    archetype: "O Protetor e Conciliador do Lar",
    general: "A vibração 6 ressoa amorosamente com a cura, a família, as artes terapêuticas e a elevação de comunidades. Representa a busca contínua por nutrir, acolher e garantir proteção harmoniosa aos que estão à sua volta.",
    talents: "Terapia de conciliação afetiva, profundo bom gosto estético (design e ambientes), senso aguçado de justiça protetora familiar e facilidade para guiar equipes sob premissas éticas.",
    challenges: "Perfeccionismo exasperado de controle amoroso, tendência ao vitimismo sacrificado de herói e interferência indesejada no destino individual próximo sob desculpa de 'ajuda'.",
    love: "Romantismo clássico, terno e de lealdade plena. Sua maior realização amorosa está em cocriar um porto de refúgio seguro estruturado em beleza material e paz acolhedora.",
    motto: "Eu protejo, curo e semeio harmonia sagrada no ninho da vida.",
    color: "from-rose-500 to-pink-600",
    element: "Água Conectiva",
    harmonicNumbers: [2, 4, 8]
  },
  7: {
    name: "Sabedoria, Investigação e Introspecção",
    archetype: "O Sábio e Investigador Oculto",
    general: "A vibração 7 é o portal de mistério e silêncio analítico. Combina o raciocínio metodológico investigativo com uma intuição mística arrebatadora, preferindo o retiro inteligente à exposição pública volumosa.",
    talents: "Discernimento cirúrgico, facilidade para pesquisas tecnológicas complexas, sensibilidade metafísica refinada, escrita conceitual de alta qualidade e maestria em si mesmo.",
    challenges: "Ceticismo amargo crônico, frieza ou arrogância intelectiva inconsciente, pânico de expor vulnerabilidades íntimas e perigos de isolamento antissocial completo.",
    love: "Busca companheiros com alto estofo mental que saibam discernir o belo sem asfixiar sua vital necessidade existencial de recolhimento isolado.",
    motto: "Eu investigo as profundezas do conhecimento para desvelar a Verdade.",
    color: "from-cyan-500 to-teal-600",
    element: "Mente Abstrata",
    harmonicNumbers: [5, 9, 11]
  },
  8: {
    name: "Justiça, Realização e Poder Material",
    archetype: "O Soberano e Gestor de Recursos",
    general: "A vibração 8 rege o infinito jogo da causa e efeito no plano material. Não se trata apenas de captar lucros, mas sim de canalizar o poder prático e diretivo com ética extrema para construir obras que beneficiem gerações.",
    talents: "Visão macroeconômica extraordinária, poder curativo de gestão profissional de crises, determinação monumental para reconstruir após falências e pulso de organização.",
    challenges: "Fridice pragmática com fraquezas alheias, propensão ao materialismo opressor, mania de controle financeiro absolutista e repressão de manifestações simples de afeto do coração.",
    love: "Apoio incondicional de base executiva. Oferece soluções estruturais maduras, conquistas partilhadas e preza pela mútua robustez socioeconômica profissional do casal.",
    motto: "Eu governo com integridade e transformo energia abstrata em abundância prática.",
    color: "from-amber-600 to-yellow-800",
    element: "Terra Conquistadora",
    harmonicNumbers: [2, 4, 6]
  },
  9: {
    name: "Humanitarismo, Desapego e Sabedoria Integral",
    archetype: "O Filósofo e Benfeitor Universal",
    general: "A vibração 9 encerra a espiral numerológica unindo todas as vibrações anteriores. Ressoa com a compaixão impessoal, amor planetário desapegado, tolerância exemplar e a sabedoria inata das almas antigas preparadas para altos voos.",
    talents: "Luz de inspiração internacionalista, dedicação incondicional a causas sociais amplas, sensibilidade literária ou dramática tocante e forte magnetismo vocacional de conselho espiritual.",
    challenges: "Dramaticidade emocional excessiva em fins inevitáveis de ciclos, utopismo doloroso que descamba em melancolia e negligência de necessidades financeiras pessoais em favor de causas alheias.",
    love: "Amor sublime, poético e sem as amarras egoísticas de ciúmes corriqueiros. Demanda um parceiro que abrace sua dedicação generosa à regeneração existencial das pessoas.",
    motto: "Eu integro a totalidade cósmica com amor incondicional e altruísmo.",
    color: "from-violet-600 to-fuchsia-700",
    element: "Éter Sublime",
    harmonicNumbers: [1, 3, 7]
  },
  11: {
    name: "Clarividência Intuitiva e Iluminação",
    archetype: "O Mensageiro e Canalizador Cósmico",
    general: "Como Número Mestre, a vibração 11 canaliza correntes intuitivas de alta frequência direta do plano sutil. Representa um farol de liderança espiritual e intelectual que desafia velhos paradigmas e traz inspiração disruptiva que cura mentes.",
    talents: "Intuição profética inabalável, carisma telepático de condução grupal, idealismo revolucionário visionário e percepções metafísicas imediatas.",
    challenges: "Ansiedade neurofisiológica aguda pela sobrecarga vibratória, medo difuso do desamparo das massas, vulnerabilidade a insônias e perfeccionismo místico utópico.",
    love: "Casamento de almas em níveis elevados. O enlace deve ser ancorado em propósitos ideológicos comuns para não se fragmentar nas flutuações de altíssima tensão íntima cotidiana.",
    motto: "Eu sirvo de antena para o sagrado emanado pelas constelações.",
    color: "from-blue-500 via-indigo-600 to-violet-600",
    element: "Luz Mental Radiante",
    harmonicNumbers: [7, 9, 22]
  },
  22: {
    name: "Arquitetura Prática da Nova Era",
    archetype: "O Criador Mestre e Edificador Cósmico",
    general: "O maior Número Mestre ativo da manifestação. A vibração 22 detém o poder de concretizar visões utópicas espantosas em escala global e coletiva. Une o idealismo sublime às estruturas sólidas da engenharia prática.",
    talents: "Liderança de projetos de infraestrutura massiva ou reformas sociais profundas, autodisciplina indômita e capacidade intelectual de orquestrar milhares de variações sincronizadas.",
    challenges: "Exigência de autodespenho psicologicamente asfixiante, autossabotagem em rotinas de pouco escopo, autoritarismo velado e tendência a ignorar as necessidades físicas íntimas.",
    love: "Precura relações que funcionem como cooperativas de alta potência construtiva. Sonha em erguer impérios, cidades, comunidades ou grandes obras de caridade compartilhadas com quem ama.",
    motto: "Eu materializo os mais sublimes sonhos humanitários em tijolos perpétuos de evolução.",
    color: "from-emerald-500 via-teal-600 to-amber-600",
    element: "Terra Tridimensional Elevada",
    harmonicNumbers: [4, 8, 11]
  }
};

const NumerologyView = memo(function NumerologyView({ numerology, user, lang }: NumerologyViewProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (lang as Language) || 'pt');
    }
    return res;
  };

  const userName = user.name;
  const userBirthDate = user.birthDate || "1990-01-01";

  // Safe validation & parsing helper
  const getSafeNum = (val: any): number => {
    const num = Number(val);
    if (!isNaN(num) && (num in numerologyInterpretations)) return num;
    // Fast numerical reduction fallback
    try {
      let test = parseInt(String(val).replace(/\D/g, ''));
      if (test > 9 && test !== 11 && test !== 22) {
        test = test.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
      }
      if (test in numerologyInterpretations) return test;
    } catch {}
    return 7; // Universal standard placeholder
  };

  const cVidaNum = useMemo(() => getSafeNum(numerology.caminhoDeVida), [numerology.caminhoDeVida]);
  const expressaoNum = useMemo(() => getSafeNum(numerology.expressao), [numerology.expressao]);
  const motivacaoNum = useMemo(() => getSafeNum(numerology.motivacao), [numerology.motivacao]);
  const personalidadeNum = useMemo(() => getSafeNum(numerology.personalidade), [numerology.personalidade]);

  // States
  const [selectedAspect, setSelectedAspect] = useState<'cVida' | 'expressao' | 'motivacao' | 'personalidade' | 'ciclos'>('cVida');
  const [simulationStep, setSimulationStep] = useState<number | null>(null);
  const [simHistory, setSimHistory] = useState<string[]>([]);
  const [schumannResult, setSchumannResult] = useState<{
    frequency: number;
    coherence: number;
    alignment: string;
    diagnosis: string;
    harmonic: string;
    description: string;
  } | null>(null);

  // Active aspect metadata
  const activeAspectData = useMemo(() => {
    switch (selectedAspect) {
      case 'cVida':
        return {
          title: "Caminho de Vida (Destino)",
          num: cVidaNum,
          desc: "Representa a lição principal da sua encarnação, os rumos que o destino vai inevitavelmente colocar em sua jornada para forçar seu aprendizado essencial humano.",
          icon: Compass,
          colorClass: "border-amber-500/40 text-amber-500 bg-amber-500/10",
          themeColor: "amber"
        };
      case 'expressao':
        return {
          title: "Expressão (Talentos Inatos)",
          num: expressaoNum,
          desc: "O conjunto de competências espirituais e técnicas naturais que você já trouxe consigo. É a sua forma automática de reagir ao mundo e criar canais de prosperidade intelectual.",
          icon: Sparkles,
          colorClass: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
          themeColor: "cyan"
        };
      case 'motivacao':
        return {
          title: "Motivação (Anseio da Alma)",
          num: motivacaoNum,
          desc: "Contorna as suas motivações subjacentes mais intocáveis. É o seu combustível espiritual silencioso: o que você verdadeiramente deseja realizar no plano afetivo e existencial profundo.",
          icon: BookOpen,
          colorClass: "border-rose-500/40 text-rose-400 bg-rose-500/10",
          themeColor: "rose"
        };
      case 'personalidade':
        return {
          title: "Personalidade (Imagem Social)",
          num: personalidadeNum,
          desc: "O avatar social, o filtro ou máscara positiva de entrada que as pessoas notam em você no primeiro contato profissional e civil antes de acessarem as esferas mais secretas da sua alma.",
          icon: Activity,
          colorClass: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
          themeColor: "emerald"
        };
      default:
        return {
          title: "Grandes Ciclos de Evolução",
          num: cVidaNum,
          desc: "As grandes etapas da sua cronologia terrena divididas sob o relógio oculto das três grandes fases energéticas.",
          icon: Calendar,
          colorClass: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
          themeColor: "indigo"
        };
    }
  }, [selectedAspect, cVidaNum, expressaoNum, motivacaoNum, personalidadeNum]);

  // Create highly dynamic, personalized explanations to solve "não pode ter informação fixa"
  const selectedInterpret = useMemo(() => {
    const base = numerologyInterpretations[activeAspectData.num];
    if (!base) return null;
    
    const firstName = userName.split(' ')[0] || "Buscador";
    const formattedBirthDate = userBirthDate.split('-').reverse().join('/');
    
    return {
      ...base,
      general: `Especialmente analisado para você, ${firstName}, nascido(a) em ${formattedBirthDate}, esta vibração atua como uma âncora energética fundamental na sua estrutura inconsciente. ${base.general} No seu cenário de vida atual, sua assinatura vibracional indica que você canaliza de forma otimizada esta força de expressão nos seus rumos evolucionários.`,
      talents: `Em seu nome de nascença, "${userName}", os talentos espirituais de vibração ${activeAspectData.num} refletem-se em ${base.talents.toLowerCase()} Isto capacita você, ${firstName}, a agir com maestria de propósitos e inteligência nas suas escolhas existenciais.`,
      challenges: `Como arquétipo ativo no seu biocampo pessoal, o seu principal desafio de transformação reside em transcender e evitar o apego a ${base.challenges.toLowerCase()} Sob as energias do seu momento evolutivo, atente para estas tendências para obter o seu equilíbrio evolutivo.`,
      love: `Nas afinidades afetivas e amorosas de ${firstName}, a vibração ${activeAspectData.num} aponta que ${base.love.substring(0, 1).toLowerCase()}${base.love.substring(1)} O diálogo harmônico e a preservação de sua autonomia individual geram as melhores conexões de alma.`,
    };
  }, [activeAspectData.num, userName, userBirthDate]);

  // Real, personalized Schumann Resonance calculations based on Name + Birth Date
  const calculateSchumann = () => {
    const nameSum = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dateDigits = userBirthDate.replace(/\D/g, '').split('').map(Number);
    const dateSum = dateDigits.reduce((acc, d) => acc + d, 0);

    // Dynamic Earth Schumann base: 7.83 Hz with custom deterministic offset
    const freqOffset = ((nameSum + dateSum) % 113) / 100;
    const personalFreq = parseFloat((7.83 + freqOffset).toFixed(2));

    // Coherence: 85% to 99%
    const coherence = 85 + ((nameSum * dateSum) % 15);

    let alignment = "Ondas Alfa (Inovação, Calmaria e Absorção Intelectiva)";
    if (personalFreq < 8.2) {
      alignment = "Ondas Alfa-Teta (Forte Conexão Intuitiva, Regeneração Orgânica)";
    } else if (personalFreq >= 8.5) {
      alignment = "Ondas Alfa-Beta (Foco Ativo, Clareza de Propósitos, Praticidade)";
    }

    const harmonic = `${(personalFreq / 7.83).toFixed(2)}x (Multiplicador de Fase)`;
    const firstName = userName.split(' ')[0] || "Buscador";

    const diagnosis = `Após analisar a assinatura de nascença registrada de ${userName}, o portal quântico correlacionou as forças vibracionais de seu Caminho de Vida (${cVidaNum}) e sua Expressão (${expressaoNum}) com os campos eletromagnéticos ionosféricos terrestres. O alinhamento com seu biocampo atingiu uma Coerência de Fase de incomparáveis ${coherence}%, oscilando na banda de ${personalFreq} Hz. Para você, ${firstName}, esta ressonância exata atua de forma direta ativando as qualidades do arquétipo de vibração ${activeAspectData.num}, ampliando sua clareza de mente.`;

    const description = `Sua vibração principal (${activeAspectData.num}) flui idealmente em canais harmônicos que encontram estabilidade nas pulsações geomagnéticas de ${personalFreq} Hz. Sintonizar-se com frequências solfeggio correlatadas ampliará consideravelmente sua resiliência mental e foco nas próximas 48 horas.`;

    return {
      frequency: personalFreq,
      coherence,
      alignment,
      diagnosis,
      harmonic,
      description
    };
  };

  const runVibrationalCheck = () => {
    setSchumannResult(null);
    const list = [
      "Iniciando varredura espectral do biocampo vibracional...",
      `Sincronizando coordenadas planetárias sob a data de nascimento (${userBirthDate.split('-').reverse().join('/')})...`,
      `Decodificando ondas cerebrais de ${userName.split(' ')[0]} com o pulso geomagnético terrestre...`,
      "Sintonia quântica concluída com sucesso! Gerando diagnóstico personalizado real..."
    ];
    
    setSimulationStep(0);
    setSimHistory([]);
    let current = 0;
    
    const interval = setInterval(() => {
      setSimHistory(prev => [...prev, list[current]]);
      setSimulationStep(current + 1);
      current++;
      if (current >= list.length) {
        clearInterval(interval);
        const result = calculateSchumann();
        setSchumannResult(result);
      }
    }, 800);
  };

  return (
    <div id="numerology-module" className="space-y-6">
      {/* 1. Header Premium Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono font-semibold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 animate-pulse">
              Módulo Pro Premium Ativo
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20">
              Análise Vibracional Completa
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-100 mt-2 flex items-center gap-2">
            <Gem className="w-6 h-6 text-amber-400" />
            Análise Numerológica Vibracional
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
            Seu projeto quântico decodificado. O nome e a data de nascimento funcionam como uma assinatura de frequências eternas. Explore as 5 principais camadas do seu mapa numerológico cabalístico.
          </p>
        </div>
      </div>

      {/* 2. Interactive Navigation Panels */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Caminho de vida */}
        <button 
          id="tab-caminho-vida"
          onClick={() => { setSelectedAspect('cVida'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'cVida' 
              ? 'bg-slate-900/90 border-amber-500 shadow-lg shadow-amber-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'cVida' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <Compass className={`w-5 h-5 mb-2 ${selectedAspect === 'cVida' ? 'text-amber-500' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Caminho de Vida</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{cVidaNum}</span>
            <span className="text-[10px] text-amber-500/70 font-sans font-medium truncate">
              {numerologyInterpretations[cVidaNum]?.archetype.split(' e ')[0]}
            </span>
          </div>
        </button>

        {/* Expressão */}
        <button 
          id="tab-expressao"
          onClick={() => { setSelectedAspect('expressao'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'expressao' 
              ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'expressao' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          )}
          <Sparkles className={`w-5 h-5 mb-2 ${selectedAspect === 'expressao' ? 'text-cyan-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Expressão</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{expressaoNum}</span>
            <span className="text-[10px] text-cyan-400/70 font-sans font-medium truncate">
              {numerologyInterpretations[expressaoNum]?.archetype.split(' e ')[0]}
            </span>
          </div>
        </button>

        {/* Motivação */}
        <button 
          id="tab-motivacao"
          onClick={() => { setSelectedAspect('motivacao'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'motivacao' 
              ? 'bg-slate-900/90 border-rose-500 shadow-lg shadow-rose-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'motivacao' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          )}
          <BookOpen className={`w-5 h-5 mb-2 ${selectedAspect === 'motivacao' ? 'text-rose-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Motivação</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{motivacaoNum}</span>
            <span className="text-[10px] text-rose-400/70 font-sans font-medium truncate">
              {numerologyInterpretations[motivacaoNum]?.archetype.split(' e ')[0]}
            </span>
          </div>
        </button>

        {/* Personalidade */}
        <button 
          id="tab-personalidade"
          onClick={() => { setSelectedAspect('personalidade'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'personalidade' 
              ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'personalidade' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
          <Activity className={`w-5 h-5 mb-2 ${selectedAspect === 'personalidade' ? 'text-emerald-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Personalidade</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{personalidadeNum}</span>
            <span className="text-[10px] text-emerald-400/70 font-sans font-medium truncate">
              {numerologyInterpretations[personalidadeNum]?.archetype.split(' e ')[0]}
            </span>
          </div>
        </button>

        {/* Grandes Ciclos */}
        <button 
          id="tab-ciclos"
          onClick={() => { setSelectedAspect('ciclos'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all col-span-2 md:col-span-1 relative ${
            selectedAspect === 'ciclos' 
              ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'ciclos' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          )}
          <Calendar className={`w-5 h-5 mb-2 ${selectedAspect === 'ciclos' ? 'text-indigo-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Ciclos de Vida</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">3</span>
            <span className="text-[10px] text-indigo-400/70 font-sans font-medium truncate">Grandes Eras</span>
          </div>
        </button>
      </div>

      {/* 3. Detailed Display Box */}
      {selectedAspect !== 'ciclos' && selectedInterpret ? (
        <div id="aspect-analysis-panel" className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 text-left animate-in fade-in duration-300 relative">
          
          <div className="pb-4 border-b border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg border ${activeAspectData.colorClass}`}>
                  {React.createElement(activeAspectData.icon, { className: "w-4 h-4" })}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{activeAspectData.title}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-100 mt-1 flex items-center gap-2">
                Vibração {activeAspectData.num} - {selectedInterpret.name}
              </h2>
              <p className="text-[11px] text-slate-400 max-w-2xl mt-0.5">
                {activeAspectData.desc}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-850">
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Arquétipo Vibracional</span>
                <span className="text-xs font-semibold text-amber-500 mt-0.5 block">{selectedInterpret.archetype}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-amber-500/10 to-amber-600/20 border border-amber-500/30 flex items-center justify-center font-mono text-lg font-black text-amber-400">
                {activeAspectData.num}
              </div>
            </div>
          </div>

          {/* Bento layout for interpretation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* General Overview & Mantra (Left column) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Essência Vibracional Cabalística
                </h3>
                <p className="text-slate-300 text-[12px] leading-relaxed">
                  {selectedInterpret.general}
                </p>
              </div>

              {/* Mantra Quote */}
              <div className="bg-slate-900 border border-slate-850/50 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute -bottom-1 right-2 opacity-[0.04]">
                  <Quote className="w-32 h-32 text-white" />
                </div>
                <div className="relative">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Mantra / Afirmação de Poder</span>
                  <p className="text-md font-sans italic text-slate-200 tracking-tight leading-relaxed">
                    "{selectedInterpret.motto}"
                  </p>
                </div>
              </div>

              {/* Action Simulation Widget */}
              <div className="bg-linear-to-br from-slate-950/90 to-slate-900 p-5 rounded-2xl border border-amber-500/10 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Ressonância Quântica de {userName}</h4>
                  <p className="text-[10px] text-slate-500">
                    Avalie o acoplamento do seu biocampo com a Frequência de Schumann terrestre neste momento preciso.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={runVibrationalCheck}
                    disabled={simulationStep !== null && simulationStep < 4}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    {simulationStep !== null && simulationStep < 4 ? "Sintonizando..." : "Calcular Sintonia Schumann"}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {simulationStep !== null && (
                  <div className="space-y-3 pt-4 border-t border-slate-850/60 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Activity Feed during simulation */}
                    <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                      {simHistory.map((h, i) => (
                        <p key={i} className="text-[10.5px] font-mono text-slate-300 flex items-start gap-1.5 leading-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </p>
                      ))}
                      {simulationStep < 4 && (
                        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-mono mt-1.5 animate-pulse">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          <span>Harmonizando canais geomagnéticos...</span>
                        </div>
                      )}
                    </div>

                    {/* Highly Polished Custom Results card, visible ONLY upon completion */}
                    {simulationStep >= 4 && schumannResult && (
                      <div className="bg-slate-950 p-4.5 rounded-2xl border border-amber-500/20 space-y-4 shadow-inner mt-2 animate-in zoom-in-95 duration-300 text-left">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-bold text-slate-200">RELATÓRIO QUÂNTICO REAL</span>
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wide">
                            CONECTADO
                          </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">Frequência Schumann Pessoal</span>
                            <span className="text-sm font-black font-mono text-amber-400 mt-0.5 block">{schumannResult.frequency} Hz</span>
                          </div>
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">Coerência de Fase</span>
                            <span className="text-sm font-black font-mono text-emerald-400 mt-0.5 block">{schumannResult.coherence}%</span>
                          </div>
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 col-span-2">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">Alinhamento Cerebral Estimado</span>
                            <span className="text-[11px] font-semibold text-slate-200 mt-0.5 block">{schumannResult.alignment}</span>
                          </div>
                        </div>

                        {/* Visual Coherence Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-slate-400">
                            <span>COERÊNCIA GEO-ELÉTRICA</span>
                            <span>{schumannResult.coherence}% / 100%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-1000" 
                              style={{ width: `${schumannResult.coherence}%` }} 
                            />
                          </div>
                        </div>

                        {/* Detailed Diagnostic Text */}
                        <div className="text-[11.5px] text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-850/45 border-dashed">
                          <p>{schumannResult.diagnosis}</p>
                          <p className="mt-2 text-slate-400 text-[10.5px] italic border-t border-slate-900 pt-1.5">{schumannResult.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Talents, Challenges, Love (Right column) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Talents Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 block">Talentos & Vocação Cósmica</span>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  {selectedInterpret.talents}
                </p>
              </div>

              {/* Shadow Box */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500 block">Desafios & Sombra Pragmática</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {selectedInterpret.challenges}
                </p>
              </div>

              {/* Love Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-[9px] uppercase font-mono tracking-widest text-rose-400 block">No Amor e Afinidades</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {selectedInterpret.love}
                </p>
              </div>

              {/* Technical indicators */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Fogo da Vibração</span>
                  <span className="text-slate-300 font-medium">{selectedInterpret.element}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[9px] uppercase">Frequências Amigas</span>
                  <span className="text-amber-500 font-mono font-bold">{selectedInterpret.harmonicNumbers.join(' • ')}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Fallback General Advice and cabalistic synthesis */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-slate-400 leading-relaxed">
            <strong>Conselho Cabalístico Geral:</strong> Ative a vibração mestra {cVidaNum} no seu dia a dia cooperando de forma integral, mas exercendo sua independência no momento das escolhas éticas. A combinação entre sua Expressão {expressaoNum} e seu Caminho {cVidaNum} sugere uma vida altamente estruturada que alcançará pleno amadurecimento após os 28 anos.
          </div>

        </div>
      ) : selectedAspect === 'ciclos' ? (
        <div id="cycles-analysis-panel" className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 text-left animate-in fade-in duration-300">
          
          <div className="pb-4 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg border border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Grandes Ciclos de Evolução</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 mt-1">
              Guia de Transição Chronos
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              A numerologia divide sua passagem na terra em três grandes fases temporais, cada qual regida por um tom harmônico de evolução.
            </p>
          </div>

          {/* Interactive Timeline layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Step-by-step Timeline cards */}
            <div className="lg:col-span-7 space-y-4">
              {numerology.ciclos && numerology.ciclos.length > 0 ? (
                numerology.ciclos.map((cicloStr, index) => {
                  const parts = cicloStr.split(':');
                  const title = parts[0]?.trim() || `Ciclo ${index + 1}`;
                  const description = parts.slice(1).join(':').trim();
                  
                  // Extract cycle number if present in text (like "Vibração 6" or similar)
                  const match = description.match(/Vibração\s+(\d+)/i);
                  const cycleNum = match ? parseInt(match[1]) : null;
                  const cycleInterpret = cycleNum ? numerologyInterpretations[cycleNum] : null;

                  return (
                    <div 
                      key={index} 
                      className={`p-5 rounded-2xl border transition-all ${
                        index === 1 
                          ? 'bg-slate-950/80 border-indigo-500/30 shadow-md' 
                          : 'bg-slate-900/60 border-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{title}</h3>
                          </div>
                          <p className="text-[12px] text-slate-200 leading-relaxed font-sans">
                            {description}
                          </p>
                        </div>

                        {cycleNum && (
                          <div className="shrink-0 w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                            <span className="text-[7px] text-indigo-400 font-mono font-bold leading-none uppercase">Vibra</span>
                            <span className="text-base font-black text-slate-200 font-mono leading-none mt-1">{cycleNum}</span>
                          </div>
                        )}
                      </div>

                      {cycleInterpret && (
                        <div className="mt-4 pt-3 border-t border-slate-850/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-400">
                          <div>
                            <span className="font-semibold text-slate-300 block">Foco Vibracional do Ciclo:</span>
                            <span className="italic">"{cycleInterpret.motto}"</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-300 block">Instrução Essencial:</span>
                            <span>{cycleInterpret.general.substring(0, 100)}...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-850 text-center text-slate-500">
                  Sem informações estruturadas de ciclos.
                </div>
              )}
            </div>

            {/* Sidebar with Chronological Guidelines */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-400 block">Sintonizando as Transições</span>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-200">Qual a importância dos anos de transição?</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      As idades de **28 anos** e **56 anos** servem como grandes portais de repactuação kármica. Durante as transições, você pode sentir reorientações vocacionais dramáticas ou súbito interesse em redefinir seus laços familiares e intelectuais.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-200">Como harmonizar ciclos opostos?</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Se o seu Ciclo Formativo tem uma vibração diferente do seu Ciclo Produtivo, equilibre-as atuando em projetos extras que utilizem suas aptidões adormecidas nos finais de semana ou investindo em educação terapêutica complementar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informative advice lock */}
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de Consolidação:</strong> Seus trânsitos anuais integrados ao Calendário Cabalístico estão sincronizados com sua carta de tarô de trânsito. Consulte o Módulo de Tarô e Trânsitos Planetários para leituras de ciclos anuais completos.
                </span>
              </div>

            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
});

export default NumerologyView;

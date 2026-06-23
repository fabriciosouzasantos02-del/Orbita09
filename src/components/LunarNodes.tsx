import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Info, 
  Grid, 
  Home, 
  Zap, 
  Check, 
  RefreshCw, 
  Award, 
  Target, 
  ArrowRight,
  TrendingUp,
  Fingerprint
} from 'lucide-react';

interface LunarNodesProps {
  userName?: string;
  mapData?: any; // AstrologyMap
}

type NodeSubTab = 'introducao' | 'significado' | 'insights' | 'signos' | 'casas' | 'conjuncoes' | 'dicas';

// Constants representing the Nodes information for each sign declared outside component for high performance and clean structure
const nodeSignsData: Record<string, {
  southNode: string;
  description: string;
  lesson: string;
  avoid: string;
  embrace: string;
}> = {
  'Áries': {
    southNode: 'Libra',
    description: 'Caminho de autoafirmação e coragem pessoal, saindo da dependência absoluta e da necessidade constante de agradar os outros.',
    lesson: 'Aprender a dizer não e defender sua individualidade, sem medo do conflito construtivo.',
    avoid: 'Indecisão, anulação pessoal para manter a paz vazia e codependência.',
    embrace: 'Iniciativa pessoal, autonomia mental e a coragem de ser pioneiro.'
  },
  'Touro': {
    southNode: 'Escorpião',
    description: 'Caminho de autossuficiência, estabilidade e pacificação material, saindo das crises emocionais cíclicas e do apego ao caos alheio.',
    lesson: 'Desenvolver valores sólidos e paz de espírito nas coisas simples da vida.',
    avoid: 'Paranoia, obsessão por transformações dramáticas, vinganças sutis e pânico do abandono.',
    embrace: 'Construção constante, serenidade interior, gratidão física e tranquilidade.'
  },
  'Gêmeos': {
    southNode: 'Sagitário',
    description: 'Caminho do aprendizado prático, da mente aberta e do diálogo cotidiano, saindo do dogmatismo intelectual e de verdades absolutas.',
    lesson: 'Escutar o ambiente ao redor e comunicar-se de forma leve e humilde.',
    avoid: 'Soberba intelectual, fanatismo ideológico e dispersão irresponsável no estrangeiro.',
    embrace: 'Curiosidade infantil, trocas de ideias locais, flexibilidade e leitura atenta.'
  },
  'Câncer': {
    southNode: 'Capricórnio',
    description: 'Caminho de acolhimento emocional, nutrição íntima e sensibilidade, saindo da frieza rígida do status ou cobranças profissionais.',
    lesson: 'Reconhecer suas fragilidades, amar o seu lar e cultivar seu mundo interior.',
    avoid: 'Controlar tudo pela via financeira, repressão do choro e ambição fria desumanizante.',
    embrace: 'Vulnerabilidade sincera, acolhimento dos sentimentos e proteção à família.'
  },
  'Leão': {
    southNode: 'Aquário',
    description: 'Caminho da expressão criativa individual, brilho nos palcos e liderança expressiva, saindo do anonimato dos grupos e friezas coletivas.',
    lesson: 'Assumir o centro de sua própria vida com generosidade e calor humano.',
    avoid: 'Se esconder no meio de multidões, alienação emocional e rebeldia sem propósito real.',
    embrace: 'Confiança na própria arte, carisma alegre e aplauso sincero aos outros.'
  },
  'Virgem': {
    southNode: 'Peixes',
    description: 'Caminho da praticidade diária, organização consciente e serviço útil, saindo do escapismo, da fantasia caótica e de sacrifícios vagos.',
    lesson: 'Ancorar-se na rotina, cuidar da saúde biológica e organizar suas frentes de vida.',
    avoid: 'Vitimizar-se, ilusão mística desregrada e procrastinação por medo de falhar.',
    embrace: 'Atenção aos detalhes práticos, disciplina diária sadia e discernimento racional.'
  },
  'Libra': {
    southNode: 'Áries',
    description: 'Caminho da diplomacia, parcerias justas e convivência pacífica, saindo do individualismo agressivo e da impulsividade impaciente.',
    lesson: 'Enxergar o ponto de vista do outro e cooperar com harmonia e elegância artística.',
    avoid: 'Competitividade amarga, irritação com as necessidades alheias e egoísmo bruto.',
    embrace: 'Escuta ativa, mediação de conflitos, justiça social e relações harmoniosas.'
  },
  'Escorpião': {
    southNode: 'Touro',
    description: 'Caminho de regeneração inconsciente, desapego material e intimidade sagrada, saindo do acúmulo possessivo e da inércia material.',
    lesson: 'Encarar crises como renovações cósmicas de alma e confiar na intuição oculta.',
    avoid: 'Preguiça de lidar com a sombra própria, teimosia material e possessividade extrema.',
    embrace: 'Psicologia sutil, espiritualidade corajosa, magnetismo íntimo e entrega.'
  },
  'Sagitário': {
    southNode: 'Gêmeos',
    description: 'Caminho da sabedoria superior, filosofia expandida e fé inspiradora, saindo do excesso de detalhes informativos vazios e fofocas locais.',
    lesson: 'Buscar o sentido maior das coisas e confiar em um propósito de vida integrado.',
    avoid: 'Meticulosidade excessiva, superficialidade, tagarelice fútil e dualidades mentais.',
    embrace: 'Estudos superiores, espiritualidade expansiva, voos altos e otimismo real.'
  },
  'Capricórnio': {
    southNode: 'Câncer',
    description: 'Caminho da autoridade pessoal, responsabilidade social e maturidade prática, saindo da infantilidade, chantagens de afeto e dependência emocional.',
    lesson: 'Edificar sua carreira com base no esforço próprio e estabilizar as bases reais de vida.',
    avoid: 'Chantagens emocionais, vitimização do passado e medo de assumir compromissos adultos.',
    embrace: 'Liderança firme, paciência de longo prazo, mérito pessoal e solidez.'
  },
  'Aquário': {
    southNode: 'Leão',
    description: 'Caminho de cooperação humanitária, visão de vanguarda e partilha social, saindo do orgulho egocêntrico e da ânsia constante de atenção pessoal.',
    lesson: 'Colocar sua inteligência sutil a serviço das transformações coletivas.',
    avoid: 'Orgulho ferido por falta de curtidas ou aplausos, arrogância e individualismo cego.',
    embrace: 'Amizades libertadoras, causas humanitárias, ideais de futuro e fraternidade.'
  },
  'Peixes': {
    southNode: 'Virgem',
    description: 'Caminho de entrega espiritual, amor universal e compaixão cósmica, saindo do ceticismo excessivo, estresse por controle de detalhes e perfeccionismo autodestrutivo.',
    lesson: 'Saber fluir no mistério espiritual e confiar no plano sutil divino.',
    avoid: 'Julgamento neurótico de pequenas falhas, hipocondria, crítica ácida e apego excessivo a regras rígidas.',
    embrace: 'Intuição, artes místicas, meditação, perdão absoluto e flexibilidade amorosa.'
  }
};

// Node information per house
const nodeHousesData: Record<number, {
  southHouse: number;
  description: string;
  lesson: string;
  avoid: string;
  embrace: string;
}> = {
  1: {
    southHouse: 7,
    description: 'Sua evolução foca no autoconhecimento profundo e tomada de decisões autônomas, saindo do hábito de delegar ao parceiro(a) as rédeas de sua própria vida.',
    lesson: 'Aprender quem você realmente é despido de rótulos sociais ou expectativas alheias.',
    avoid: 'Anular sua vontade própria em casamentos ou sociedades para evitar o descontentamento.',
    embrace: 'Liderança pessoal autêntica, investir em si próprio e agir com ousadia.'
  },
  2: {
    southHouse: 8,
    description: 'Sua evolução direciona-se para a sua própria independência financeira e autoestima física, saindo da dependência dos recursos de outrem ou crises existenciais e sexuais cíclicas.',
    lesson: 'Aprender o valor real dos seus talentos materiais e garantir sua própria estabilidade de vida.',
    avoid: 'Herdar dependências ou submeter-se a jogos de poder em troca de apoio material ou heranças.',
    embrace: 'Trabalhar focado em seus próprios propósitos, poupança prudente e valorização física.'
  },
  3: {
    southHouse: 9,
    description: 'Sua evolução reside em aplicar o conhecimento prático em sua comunidade local, dialogando com as pessoas reais à sua volta, saindo de dogmas acadêmicos ou sonhos distantes flutuantes.',
    lesson: 'Comunicar-se de modo simples, dar aulas, escrever e escutar com empatia o vizinho.',
    avoid: 'Viver em uma torre de marfim espiritual/filosófica arrogante que não se conecta ao cotidiano.',
    embrace: 'Escrita, mídias locais, cursos rápidos, curiosidade com o que está à mão.'
  },
  4: {
    southHouse: 10,
    description: 'Sua evolução chama você para recolher-se no aconchego do lar e na intimidade familiar, nutrindo suas fundações emocionais de alma, saindo do foco obsessivo em status público e carreiras corporativas vazias.',
    lesson: 'Integrar os sentimentos profundos do seu clã familiar primário e dar sustentabilidade íntima a si.',
    avoid: 'Fugir das mágoas do lar trabalhando em excesso apenas para angariar aplausos de estranhos.',
    embrace: 'Cuidado com a sua casa, conexões com pais ou filhos e recolhimento regenerador.'
  },
  5: {
    southHouse: 11,
    description: 'Sua evolução convida à sua expressão lúdica, aos romances sadios, diversões criativas e conexão íntima com crianças/projetos próprios, saindo do distanciamento impessoal de amizades platônicas ou grupos virtuais frios.',
    lesson: 'Permitir-se brilhar livremente no amor e descobrir hobbies de profunda paixão.',
    avoid: 'Diluir seu magnetismo pessoal em causas coletivas para não enfrentar suas inseguranças afetivas.',
    embrace: 'Teatro, hobbies artísticos, paixão declarada, atenção especial a quem você ama de perto.'
  },
  6: {
    southHouse: 12,
    description: 'Sua evolução demanda manter a atenção no plano físico diário, no cuidado do seu corpo de carne, nos animais, na alimentação e disciplinas estruturadas, saindo do escapismo fantasioso e da reclusão de alma.',
    lesson: 'Cultivar hábitos regeneradores visíveis e praticar a caridade útil organizada.',
    avoid: 'Culpa inconsciente inexplicável, autoengano em fantasias espirituais e bagunças biológicas.',
    embrace: 'Ginástica sadia, arrumação doméstica contínua, check-ups e assistência no mundo real.'
  },
  7: {
    southHouse: 1,
    description: 'Sua evolução aponta firmemente para parcerias conscientes, tolerância e cooperação ativa, saindo do egoísmo impulsivo, impaciência e agressividade contra quem divide a jornada com você.',
    lesson: 'Aprender que dividir as conquistas e entender as dores do outro é o grande motor da felicidade.',
    avoid: 'Competir sem necessidade íntima com parceiros e agir com autossuficiência rude.',
    embrace: 'Diálogos de conciliação, casamento ético sadio, sociedades sinceras e escuta.'
  },
  8: {
    southHouse: 2,
    description: 'Sua evolução é psicológica e mística profunda: trata-se de desapegar do controle de bens acumulados para regenerar seus valores através da fusão profunda com o outro de forma autêntica.',
    lesson: 'Encontrar a estabilidade invisível na confiança e na sabedoria do renascimento material.',
    avoid: 'Apegar-se neuroticamente a posses materiais ou reprimir a energia íntima de fusão.',
    embrace: 'Terapia de alma, investimento conjunto ético, investigação do ocultismo e cura espiritual.'
  },
  9: {
    southHouse: 3,
    description: 'Sua evolução pede vôos mais altos da mente: buscar o sentido maior das coisas, viajar a horizontes amplos, sintonizar-se com ideais éticos superiores, saindo das distrações passageiras ou discussões fúteis do dia a dia.',
    lesson: 'Expandir a consciência integrando um otimismo espiritual luminoso na sua visão.',
    avoid: 'Vício em fofocas e superficialidades que dividem a atenção sem construir sabedoria real.',
    embrace: 'Turismo de alma, estudos superiores, publicação de livros, filosofia expansiva viva.'
  },
  10: {
    southHouse: 4,
    description: 'Sua evolução clama pela independência madura, pela fundação de sua autoridade profissional pública e liderança reconhecida, saindo das chantagens emocionais ou aconchegos infantis do lar de ontem.',
    lesson: 'Tomar posse de seu papel como o mestre de seu destino público e zelar por seu merecido status.',
    avoid: 'Esconder-se em coitadismos do passado ou culpar a família por não arriscar-se na carreira.',
    embrace: 'Carreira ética destacada, metas de longo prazo, administração resiliente.'
  },
  11: {
    southHouse: 5,
    description: 'Sua evolução pede fraternidade ativa: conectar-se a grupos que pensam inovação, trabalhar em prol de causas libertadoras do futuro humano, saindo do anseio dramático de o seu ego ser idolatrado.',
    lesson: 'Compartilhar conquistas, amparar minorias e desenhar pontes de progresso coletivo.',
    avoid: 'Arrogância infantil, vaidade exacerbada e dependência exagerada de elogios alheios.',
    embrace: 'Engajamento comunitário, cooperativas, projetos inovadores e amizades diversas.'
  },
  12: {
    southHouse: 6,
    description: 'Sua evolução convida à conexão mística absoluta, meditações silenciosas, retiro artístico regenerador e entrega humilde ao plano divino, saindo da escravidão das listas mentais, estressores corporais ou hipocondrias.',
    lesson: 'Compreender que há uma ordem maior e que o controle pessoal absoluto é uma mera ilusão sutil.',
    avoid: 'Pânico neurótico com micróbios ou pequenas desorganizações da mesa corporal cotidiana.',
    embrace: 'Artes terapêuticas, retiros espirituais, silêncio mental e compaixão cósmica profunda.'
  }
};

export default function LunarNodes({ userName = 'Buscador de Sabedoria', mapData }: LunarNodesProps) {
  const [activeSubTab, setActiveSubTab] = useState<NodeSubTab>('introducao');

  // Find users exact North Node sign and house from actual calculations
  const realNorthNodeSign = mapData?.astros?.find((a: any) => a.name === "Nodo Norte" || a.name === "Nódulo Norte")?.sign || "Aquário";
  
  let realNorthNodeHouse = 11;
  if (mapData?.houses) {
    const found = mapData.houses.find((h: any) => h.planet?.includes("Nodo Norte") || h.planet?.includes("Nódulo Norte"));
    if (found) {
      realNorthNodeHouse = found.number;
    }
  }

  const realSouthNodeSign = nodeSignsData[realNorthNodeSign]?.southNode || "Leão";
  const realSouthNodeHouse = nodeHousesData[realNorthNodeHouse]?.southHouse || 5;

  // Set selectors states which default to the user's correct natal positions
  const [selectedNorthNodeSign, setSelectedNorthNodeSign] = useState<string>(realNorthNodeSign);
  const [selectedNorthNodeHouse, setSelectedNorthNodeHouse] = useState<number>(realNorthNodeHouse);

  // Sync state when mapData loads
  React.useEffect(() => {
    if (realNorthNodeSign) {
      setSelectedNorthNodeSign(realNorthNodeSign);
    }
    if (realNorthNodeHouse) {
      setSelectedNorthNodeHouse(realNorthNodeHouse);
    }
  }, [realNorthNodeSign, realNorthNodeHouse]);

  const isMatchedWithNatal = selectedNorthNodeSign === realNorthNodeSign && selectedNorthNodeHouse === realNorthNodeHouse;

  // Scan aspects in mapData involving Nodes to make Conjunções entirely real
  const nodeAspects = mapData?.aspects?.filter((asp: any) => 
    asp.planet1 === "Nodo Norte" || asp.planet2 === "Nodo Norte" ||
    asp.planet1 === "Nodo Sul" || asp.planet2 === "Nodo Sul" ||
    asp.planet1 === "Nódulo Norte" || asp.planet2 === "Nódulo Norte" ||
    asp.planet1 === "Nódulo Sul" || asp.planet2 === "Nódulo Sul"
  ) || [];

  return (
    <div id="lunar-nodes-system" className="space-y-6 text-left">
      
      {/* Title Header with Purple Galaxy Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-indigo-950/40 via-slate-950 to-slate-950 p-6 md:p-8 border border-slate-805">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-2 text-left">
            <span className="px-2.5 py-1 bg-indigo-550/10 border border-indigo-400/20 text-indigo-400 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 w-fit">
              <Fingerprint className="w-3.5 h-3.5 animate-spin-pulse" />
              EIXO SAGRADO • O CAMINHO DA ALMA
            </span>
            <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight text-white uppercase">
              NODOS LUNARES - SUA EVOLUÇÃO PESSOAL
            </h2>
            <p className="text-slate-350 text-[11.5px] font-sans max-w-3xl leading-relaxed">
              Devemos reconhecer e manter equilibrado o nosso eixo nodal para que a nossa evolução na atual existência seja constante e o nosso senso de propósito se mantenha sempre energizado.
            </p>
          </div>

          <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 text-right shrink-0">
            <span className="text-[8px] font-mono text-slate-500 block">SINTONIZADO</span>
            <span className="text-xs font-mono font-bold text-indigo-400">{realNorthNodeSign} • C{realNorthNodeHouse}</span>
          </div>
        </div>

        {/* Sub-Tabs Grid containing the 7 elements as requested */}
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 mt-6 pt-4 border-t border-slate-900 z-10 relative">
          
          <button
            onClick={() => setActiveSubTab('introducao')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'introducao' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Introdução
          </button>

          <button
            onClick={() => setActiveSubTab('significado')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'significado' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Significado
          </button>

          <button
            onClick={() => setActiveSubTab('insights')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'insights' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Insights
          </button>

          <button
            onClick={() => setActiveSubTab('signos')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'signos' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Signos
          </button>

          <button
            onClick={() => setActiveSubTab('casas')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'casas' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Casas
          </button>

          <button
            onClick={() => setActiveSubTab('conjuncoes')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'conjuncoes' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Conjunções
          </button>

          <button
            onClick={() => setActiveSubTab('dicas')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'dicas' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            Reflexões
          </button>

        </div>
      </div>

      {/* Interactive Sub-tab Panel Container with Framer Motion transitions */}
      <div className="bg-slate-900/45 p-6 rounded-3xl border border-slate-805 min-h-[320px] transition-all">
        <AnimatePresence mode="wait">
          
          {/* ========================================= */}
          {/* INTRODUÇÃO TAB */}
          {/* ========================================= */}
          {activeSubTab === 'introducao' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                
                {/* Personalized axis alert banner */}
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-left">
                  <span className="text-[9px] font-mono uppercase text-indigo-400 block tracking-widest mb-1.5">Eixo Sagrado Calculado de {userName}</span>
                  <p className="text-slate-200 leading-relaxed">
                    Olá, <strong>{userName}</strong>! Com base no sintonizador de efemérides reais do seu nascimento, identificamos que o seu <strong>Nodo Norte (Cabeça do Dragão)</strong> está posicionado em <strong>{realNorthNodeSign}</strong> na <strong>Casa {realNorthNodeHouse}</strong>. Em oposição perfeita, o seu <strong>Nodo Sul (Cauda do Dragão)</strong> está localizado em <strong>{realSouthNodeSign}</strong> na <strong>Casa {realSouthNodeHouse}</strong>.
                  </p>
                </div>

                <div className="flex gap-3 items-start pt-2">
                  <Compass className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">O que é o Eixo Nodal?</h3>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      A análise do Eixo Nodal, ou seja, da posição dos nodos lunares norte e sul (também chamados de cabeça e cauda do dragão) no momento do seu nascimento, identifica os pontos que devem ser sempre lembrados, aprimorados e equilibrados em sua jornada de vida atual. O objetivo é reconhecer o potencial do nodo norte e os beneficios do nodo sul, saindo um pouco da cauda em direção à cabeça do dragão.
                    </p>
                  </div>
                </div>

                {/* Big numbers beautiful layout for the 3 types of people requested */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-[11.5px] font-bold font-mono text-indigo-300 uppercase tracking-widest block">
                    Geralmente existem 3 tipos de pessoas no manejo das energias nodais:
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Person Type 1 */}
                    <div className="p-4 bg-slate-950/90 border border-slate-850 rounded-2xl relative overflow-hidden group hover:border-indigo-500/20 transition">
                      <div className="absolute top-2 right-3 font-mono text-3xl font-black text-indigo-550/15 group-hover:text-indigo-400/10 transition leading-none select-none">
                        1
                      </div>
                      <div className="space-y-1.5 relative z-10">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-black flex items-center justify-center">
                          1
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                          As que oscilam entre as influências dos nodos em períodos específicos, sem que tenham qualquer noção ou controle sobre essa condição.
                        </p>
                      </div>
                    </div>

                    {/* Person Type 2 */}
                    <div className="p-4 bg-slate-950/90 border border-slate-850 rounded-2xl relative overflow-hidden group hover:border-indigo-500/20 transition">
                      <div className="absolute top-2 right-3 font-mono text-3xl font-black text-indigo-550/15 group-hover:text-indigo-400/10 transition leading-none select-none">
                        2
                      </div>
                      <div className="space-y-1.5 relative z-10">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-black flex items-center justify-center">
                          2
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                          As que projetam as necessidades dos Nodo Norte nos outros e acabam sendo atraídas por pessoas e situações que simbolizam as qualidades opostas.
                        </p>
                      </div>
                    </div>

                    {/* Person Type 3 */}
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition">
                      <div className="absolute top-2 right-3 font-mono text-3xl font-black text-indigo-400/15 group-hover:text-indigo-400/10 transition leading-none select-none">
                        3
                      </div>
                      <div className="space-y-1.5 relative z-10">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-black flex items-center justify-center">
                          3
                        </span>
                        <p className="text-[11px] leading-relaxed text-indigo-200 font-sans font-semibold">
                          As que conseguiram compreender as propostas dos nodos e sentem-se livres para expressar suas potencialidades em direção ao equilíbrio.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================= */}
          {/* SIGNIFICADO TAB */}
          {/* ========================================= */}
          {activeSubTab === 'significado' && (
            <motion.div
              key="significado"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-slate-300 leading-relaxed">
                Para o mapa de <strong>{userName}</strong>, o portal evolutivo se abre ao integrar as virtudes do signo de <strong>{realNorthNodeSign}</strong> (como <em>{nodeSignsData[realNorthNodeSign]?.embrace}</em>) e transcender os excessos acomodados do signo de <strong>{realSouthNodeSign}</strong> (como <em>{nodeSignsData[realNorthNodeSign]?.avoid}</em>).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* North Node: Portal back to Head of the Dragon */}
                <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3 relative">
                  <div className="absolute top-3 right-3 text-2xl filter drop-shadow">🐉</div>
                  <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block w-fit">
                    Nodo Norte • Cabeça do Dragão (Rahu)
                  </span>
                  <h4 className="text-sm font-black font-sans text-white uppercase">Seu Caminho de Destino em {realNorthNodeSign} (Casa {realNorthNodeHouse})</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Representa o território inexplorado, os aprendizados que você veio desenvolver nesta vida e a direção exata que destrava o seu senso de realização cósmica. Em <strong>{realNorthNodeSign}</strong>, {nodeSignsData[realNorthNodeSign]?.description || "representa sua direção de brilho futuro."}
                  </p>
                  <ul className="text-[11px] text-indigo-305 space-y-1 font-mono pt-2">
                    <li>· Destrava em você: {nodeSignsData[realNorthNodeSign]?.embrace}</li>
                    <li>· Símbolo: Direção norte cósmica das águias ascendentes.</li>
                  </ul>
                </div>

                {/* South Node: Baggage back to Tail of the Dragon */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 relative">
                  <div className="absolute top-3 right-3 text-2xl opacity-60">🦂</div>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block w-fit">
                    Nodo Sul • Cauda do Dragão (Ketu)
                  </span>
                  <h4 className="text-sm font-black font-sans text-white uppercase">Sua Bagagem em {realSouthNodeSign} (Casa {realSouthNodeHouse})</h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    Simboliza os dons inatos, as facilidades extraordinárias e a "zona de conforto" onde temos o hábito antigo de nos esconder perante a pressão. Em <strong>{realSouthNodeSign}</strong>, {nodeSignsData[realSouthNodeSign]?.description || "abriga suas facilidades."}
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 font-mono pt-2">
                    <li>· Evitar excesso de decolagem: {nodeSignsData[realNorthNodeSign]?.avoid}</li>
                    <li>· Benefício: Força interna instintiva e inteligência consolidada.</li>
                  </ul>
                </div>

              </div>
            </motion.div>
          )}

          {/* ========================================= */}
          {/* INSIGHTS TAB (Personalized & Interactive selector) */}
          {/* ========================================= */}
          {activeSubTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase text-indigo-400 block tracking-widest">SINTONIZADOR PERSONALIZADO INTERATIVO</span>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                  Descubra os Segredos do seu Eixo Nodal
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Utilize o sintonizador abaixo para simular as posições do seu Nodo Norte no Mapa Astrológico Natal. Por padrão, ele está sintonizado com seus dados de nascimento reais.
                </p>
              </div>

              {/* Input Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase text-indigo-305 block">Seu Signo do Nodo Norte:</label>
                    <button 
                      onClick={() => setSelectedNorthNodeSign(realNorthNodeSign)}
                      className="text-[9px] font-mono text-indigo-405 hover:underline"
                    >
                      Resetar para Natal
                    </button>
                  </div>
                  <select 
                    value={selectedNorthNodeSign}
                    onChange={(e) => setSelectedNorthNodeSign(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  >
                    {Object.keys(nodeSignsData).map(sig => (
                      <option key={sig} value={sig}>{sig} (Nodo Sul em {nodeSignsData[sig].southNode})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase text-indigo-305 block">Casa Astrológica do Território:</label>
                    <button 
                      onClick={() => setSelectedNorthNodeHouse(realNorthNodeHouse)}
                      className="text-[9px] font-mono text-indigo-405 hover:underline"
                    >
                      Resetar para Natal
                    </button>
                  </div>
                  <select
                    value={selectedNorthNodeHouse}
                    onChange={(e) => setSelectedNorthNodeHouse(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                      <option key={c} value={c}>Casa {c} (Nodo Sul na Casa {nodeHousesData[c].southHouse})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live readout display of selected axis */}
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-slate-900">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono text-indigo-400 block uppercase">EIXO SELECIONADO ATALHO</span>
                      {isMatchedWithNatal && (
                        <span className="text-[8px] font-mono bg-amber-500/10 border border-amber-550/30 text-amber-500 px-1.5 py-0.5 rounded-full uppercase">
                          ★ Sintonizado com seu Mapa Real
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black font-serif text-white tracking-widest uppercase">
                      Nodo Norte em {selectedNorthNodeSign} na Casa {selectedNorthNodeHouse}
                    </h4>
                  </div>
                  <div className="px-2.5 py-1 bg-slate-950 rounded-full border border-slate-850 text-[9px] font-mono text-slate-400">
                    Oposição: Nodo Sul em {nodeSignsData[selectedNorthNodeSign].southNode} na Casa {nodeHousesData[selectedNorthNodeHouse].southHouse}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1 text-slate-350 leading-relaxed">
                    <strong className="text-white block text-[11px] uppercase tracking-wide">Caminho do Signo ({selectedNorthNodeSign}):</strong>
                    <p>{nodeSignsData[selectedNorthNodeSign].description}</p>
                    <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono">
                      <span className="text-emerald-450"><strong className="text-emerald-500">✓ Integrar:</strong> {nodeSignsData[selectedNorthNodeSign].embrace}</span>
                      <span className="text-red-400/80"><strong className="text-red-500">✗ Evitar:</strong> {nodeSignsData[selectedNorthNodeSign].avoid}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-350 leading-relaxed border-t md:border-t-0 md:border-l border-slate-900 pt-3 md:pt-0 md:pl-4">
                    <strong className="text-white block text-[11px] uppercase tracking-wide">Desafio do Território (Casa {selectedNorthNodeHouse}):</strong>
                    <p>{nodeHousesData[selectedNorthNodeHouse].description}</p>
                    <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono">
                      <span className="text-emerald-450"><strong className="text-emerald-500">✓ Território de Ação:</strong> {nodeHousesData[selectedNorthNodeHouse].embrace}</span>
                      <span className="text-red-400/80"><strong className="text-red-400">✗ Antigos Fugas:</strong> {nodeHousesData[selectedNorthNodeHouse].avoid}</span>
                    </div>
                  </div>
                </div>

                {/* Advice summary */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-xs text-indigo-300 font-sans italic flex gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <strong>Sua Chave Mestra de Evolução:</strong> {nodeSignsData[selectedNorthNodeSign].lesson} Além de {nodeHousesData[selectedNorthNodeHouse].lesson}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================= */}
          {/* SIGNOS TAB (Centered and centered first on user's axes) */}
          {/* ========================================= */}
          {activeSubTab === 'signos' && (
            <motion.div
              key="signos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">Os 12 Eixos Nodais nos Signos</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Veja em destaque o eixo ativo de sua alma e consulte o caminho dos demais signos.</p>
              </div>

              {/* Highlight user's axis first */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/20">
                    ★ SEU EIXO DE ALMA NOS SIGNOS
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                    Eixo de Propósito Ativo
                  </span>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  Nodo Norte em {realNorthNodeSign} ➔ Nodo Sul em {realSouthNodeSign}
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed">{nodeSignsData[realNorthNodeSign]?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] border-t border-indigo-500/20">
                  <div>
                    <span className="text-emerald-450 font-bold font-mono">✓ LIÇÃO CENTRAL DA SUA ALMA:</span>
                    <p className="text-slate-305 mt-0.5">{nodeSignsData[realNorthNodeSign]?.lesson}</p>
                    <span className="text-emerald-450 font-bold font-mono mt-1.5 block">✓ INTEGRAR NO COTIDIANO:</span>
                    <p className="text-slate-305 mt-0.5">{nodeSignsData[realNorthNodeSign]?.embrace}</p>
                  </div>
                  <div>
                    <span className="text-red-400 font-bold font-mono">✗ COMPORTAMENTO A EVITAR / TRANSFORMAR:</span>
                    <p className="text-slate-305 mt-0.5">{nodeSignsData[realNorthNodeSign]?.avoid}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable list of other eixos */}
              <div className="space-y-3.5 text-xs">
                <span className="text-[9px] font-mono uppercase text-slate-550 block tracking-widest">Outros Eixos Nodais para Consulta</span>
                <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1">
                  {Object.keys(nodeSignsData).filter(n => n !== realNorthNodeSign).map((north) => {
                    const data = nodeSignsData[north];
                    return (
                      <div key={north} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 hover:border-slate-800 transition text-left flex flex-col gap-2">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                            <Target className="w-3.5 h-3.5 text-slate-500" />
                            Nodo Norte em {north} ➔ Nodo Sul em {data.southNode}
                          </span>
                        </div>
                        <p className="text-slate-350 leading-relaxed font-sans">{data.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-900/60 font-sans">
                          <div className="text-slate-400">
                            <strong className="text-emerald-450 block font-mono">✓ LIÇÃO EVOLUTIVA:</strong>
                            <span>{data.lesson}</span>
                          </div>
                          <div className="text-slate-400">
                            <strong className="text-red-400/90 block font-mono">✗ COMPORTAMENTO A EVITAR:</strong>
                            <span>{data.avoid}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================= */}
          {/* CASAS TAB */}
          {/* ========================================= */}
          {activeSubTab === 'casas' && (
            <motion.div
              key="casas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">Os Eixos Nodais nas Casas Astrológicas</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">As Casas indicam o território prático da vida onde esse aprendizado de alma acontece.</p>
              </div>

              {/* Highlight user's axis */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/20">
                    ★ SEU TERRITÓRIO EVOLUTIVO (CASA)
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                    Casa Ativa
                  </span>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  Nodo Norte na Casa {realNorthNodeHouse} ➔ Nodo Sul na Casa {realSouthNodeHouse}
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed">{nodeHousesData[realNorthNodeHouse]?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] border-t border-indigo-500/20">
                  <div>
                    <span className="text-emerald-450 font-bold font-mono">✓ DESAFIO NO TERRITÓRIO DA CASA:</span>
                    <p className="text-slate-305 mt-0.5">{nodeHousesData[realNorthNodeHouse]?.lesson}</p>
                    <span className="text-emerald-450 font-bold font-mono mt-1.5 block">✓ ATITUDE A ABRAÇAR:</span>
                    <p className="text-slate-305 mt-0.5">{nodeHousesData[realNorthNodeHouse]?.embrace}</p>
                  </div>
                  <div>
                    <span className="text-red-400 font-bold font-mono">✗ ANTIGAS FUGAS A EVITAR:</span>
                    <p className="text-slate-305 mt-0.5">{nodeHousesData[realNorthNodeHouse]?.avoid}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <span className="text-[9px] font-mono uppercase text-slate-550 block tracking-widest">Outras Casas para Consulta</span>
                <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].filter(c => c !== realNorthNodeHouse).map((chouse) => {
                    const data = nodeHousesData[chouse];
                    return (
                      <div key={chouse} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 hover:border-slate-800 transition text-left flex flex-col gap-2">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                            <Home className="w-3.5 h-3.5 text-slate-500" />
                            Nodo Norte na Casa {chouse} ➔ Nodo Sul na Casa {data.southHouse}
                          </span>
                        </div>
                        <p className="text-slate-350 leading-relaxed font-sans">{data.description}</p>
                        <div className="font-mono text-[11px] pt-1.5 border-t border-slate-900 flex flex-col sm:flex-row justify-between gap-1.5 text-slate-400">
                          <span><strong className="text-emerald-505">Abraçar:</strong> {data.embrace}</span>
                          <span><strong className="text-red-400">Evitar:</strong> {data.avoid}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================= */}
          {/* CONJUNÇÕES TAB */}
          {/* ========================================= */}
          {activeSubTab === 'conjuncoes' && (
            <motion.div
              key="conjuncoes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">Conjunções Planetárias no Eixo Nodal</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Aspectos de forte relevância real entre os planetas do seu mapa e os seus Nodos Lunares de evolução.</p>
              </div>

              {nodeAspects.length > 0 ? (
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                    ✓ ASPECTOS E CONJUNÇÕES REAIS DETECTADAS EM SEU MAPA
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nodeAspects.map((asp: any, i: number) => (
                      <div key={i} className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-indigo-950">
                          <strong className="text-white font-mono text-xs">{asp.planet1} {asp.aspectType} {asp.planet2}</strong>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-[9px] font-mono text-indigo-200 uppercase">Orbe: {asp.orb}</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans">{asp.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-slate-400 space-y-2 text-left">
                    <span className="text-lg">🌌</span>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      Não detectamos conjunções ou aspectos exatos (menor que 5° de orbe) envolvendo os seus Nodos Lunares com os demais planetas pessoais em seu mapa de nascimento. Isso indica que seu eixo de evolução opera livre de interferências dinâmicas diretas, focando puramente nas diretrizes fundamentais de seu signo de <strong>{realNorthNodeSign}</strong> e da Casa <strong>{realNorthNodeHouse}</strong>.
                    </p>
                  </div>

                  <span className="text-[9.5px] font-mono uppercase text-slate-500 block tracking-widest pt-2">Exemplos Comuns de Conjunções Relevantes:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    
                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">☀️</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">Sol conjunto ao Nodo Norte</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        Indica que o seu propósito de brilho, vitalidade de ego e sua profissão central estão intrinsecamente amarrados à sua missão de decolagem de alma nesta existência. Símbolo de guias.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🌙</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">Lua conjunta ao Nodo Sul</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        Facilidade psíquica extraordinária, memórias sentimentais riquíssimas e uma sensibilidade caridosa inata. O perigo é mimar o próprio subconsciente por meio de carências do passado.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🪐</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">Saturno conjunto ao Nodo Norte</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        Cobrança por maturidade. A sabedoria do Nodo Norte virá após muita disciplina, estruturação ética de longo prazo e comprometimento sério com a caminhada material.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">⚡</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">Urano ou Plutão conjuntos</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        Rupturas místicas extraordinárias na forma como você encara as transformações. Você passa por mortes simbólicas constantes de ego para renovar integralmente suas estruturas de vida.
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================= */}
          {/* DICAS E REFLEXÕES TAB */}
          {/* ========================================= */}
          {activeSubTab === 'dicas' && (
            <motion.div
              key="dicas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">Dicas Práticas de Alinhamento Astrológico</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Conselhos valiosos sintonizados com o seu Nodo Norte para o seu cotidiano.</p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-350 leading-relaxed font-sans">
                
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/10 flex gap-3">
                  <span className="text-cyan-400 text-lg">✦</span>
                  <div className="space-y-1">
                    <strong className="text-slate-200 block text-xs">Meditação Direcionada para {realNorthNodeSign}</strong>
                    <p>
                      Em instantes de extrema indecisão ou pressa, feche os olhos e respire profundamente, direcionando sua atenção mental para o territory da sua <strong>Casa {realNorthNodeHouse}</strong>. O Nodo Norte pede o passo de fé corajoso sintonizado nas virtudes de {realNorthNodeSign}. Seu caminho demanda integrar ativamente: <em>{nodeSignsData[realNorthNodeSign]?.embrace}</em>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/10 flex gap-3">
                  <span className="text-indigo-400 text-lg">✦</span>
                  <div className="space-y-1">
                    <strong className="text-slate-200 block text-xs">Mapeie seu Eixo na Mesa de Trabalho</strong>
                    <p>
                      Escreva em um pequeno papel qual o seu Nodo Norte ativo (<strong>{realNorthNodeSign} na Casa {realNorthNodeHouse}</strong>). Ter esse lembrete visual evoca o seu foco racional no dia a dia para que você recuse reações automáticas de fuga na cauda (<strong>{realSouthNodeSign} na Casa {realSouthNodeHouse}</strong>) e assuma a nobreza de sua missão.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/10 flex gap-3">
                  <span className="text-amber-400 text-lg">✦</span>
                  <div className="space-y-1">
                    <strong className="text-slate-200 block text-xs">A Integração de Bagagens</strong>
                    <p>
                      A evolução pessoal saudável não se trata de aniquilar os seus dotes inatos de <strong>{realSouthNodeSign}</strong>, mas sim de canalizá-los de forma equilibrada como a base estável de onde você alça voo consciente rumo ao castelo de <strong>{realNorthNodeSign}</strong> com maturidade máxima.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}

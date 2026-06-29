import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { useIdioma } from '../context/IdiomaContext';
import { NODE_SIGNS_LOCALIZED, NODE_HOUSES_LOCALIZED } from '../lib/nodeTranslations';
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
  lang?: string;
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

const NODE_UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Eixo Sagrado dos Nodos Lunares': {
    pt: 'Eixo Sagrado dos Nodos Lunares',
    en: 'Sacred Axis of Lunar Nodes',
    es: 'Eje Sagrado de los Nodos Lunares',
    de: 'Heilige Achse der Mondknoten',
    fr: 'Axe Sacré des Nœuds Lunaires'
  },
  'Caminho da Alma • Evolução Pessoal': {
    pt: 'Caminho da Alma • Evolução Pessoal',
    en: 'Soul Path • Personal Evolution',
    es: 'Camino del Alma • Evolución Personal',
    de: 'Seelenweg • Persönliche Entwicklung',
    fr: 'Chemin de l\'Âme • Évolution Personnelle'
  },
  'Astronomia Real Geocêntrica de Precisão': {
    pt: 'Astronomia Real Geocêntrica de Precisão',
    en: 'Precision Real Geocentric Astronomy',
    es: 'Astronomía Real Geocéntrica de Precisión',
    de: 'Präzise reale geozentrische Astronomie',
    fr: 'Astronomie Réelle Géocentrique de Précision'
  },
  'Introdução': {
    pt: 'Introdução',
    en: 'Introduction',
    es: 'Introducción',
    de: 'Einführung',
    fr: 'Introduction'
  },
  'Significado': {
    pt: 'Significado',
    en: 'Meaning',
    es: 'Significado',
    de: 'Bedeutung',
    fr: 'Signification'
  },
  'Insights': {
    pt: 'Insights',
    en: 'Insights',
    es: 'Insights',
    de: 'Erkenntnisse',
    fr: 'Insights'
  },
  'Signos': {
    pt: 'Signos',
    en: 'Signs',
    es: 'Signos',
    de: 'Zeichen',
    fr: 'Signes'
  },
  'Casas': {
    pt: 'Casas',
    en: 'Houses',
    es: 'Casas',
    de: 'Häuser',
    fr: 'Maisons'
  },
  'Conjunções': {
    pt: 'Conjunções',
    en: 'Conjunctions',
    es: 'Conjunciones',
    de: 'Konjunktionen',
    fr: 'Conjonctions'
  },
  'Reflexões': {
    pt: 'Reflexões',
    en: 'Reflections',
    es: 'Reflexiones',
    de: 'Reflexionen',
    fr: 'Réflexions'
  },
  'Eixo Sagrado Calculado de': {
    pt: 'Eixo Sagrado Calculado de',
    en: 'Calculated Sacred Axis of',
    es: 'Eje Sagrado Calculado de',
    de: 'Berechnete heilige Achse von',
    fr: 'Axe Sacré Calculé de'
  },
  'O que é o Eixo Nodal?': {
    pt: 'O que é o Eixo Nodal?',
    en: 'What is the Nodal Axis?',
    es: '¿Qué es el Eje Nodal?',
    de: 'Was ist die Knotenachse?',
    fr: 'Qu\'est-ce que l\'Axe Nodal ?'
  },
  'Geralmente existem 3 tipos de pessoas no manejo das energias nodais:': {
    pt: 'Geralmente existem 3 tipos de pessoas no manejo das energias nodais:',
    en: 'There are generally 3 types of people in handling nodal energies:',
    es: 'Generalmente existen 3 tipos de personas en el manejo de las energías nodales:',
    de: 'Es gibt im Allgemeinen 3 Arten von Menschen im Umgang mit Knotenenergien:',
    fr: 'Il existe généralement 3 types de personnes dans la gestion des énergies nodales :'
  },
  'Para o mapa de': {
    pt: 'Para o mapa de',
    en: 'For the chart of',
    es: 'Para la carta de',
    de: 'Für das Horoskop von',
    fr: 'Pour le thème de'
  },
  'o portal evolutivo se abre ao integrar as virtudes do signo de': {
    pt: 'o portal evolutivo se abre ao integrar as virtudes do signo de',
    en: 'the evolutionary portal opens by integrating the virtues of the sign of',
    es: 'el portal evolutivo se abre al integrar las virtudes del signo de',
    de: 'öffnet sich das evolutionäre Portal durch die Integration der Tugenden des Zeichens von',
    fr: 'le portail évolutif s\'ouvre en intégrant les vertus du signe de'
  },
  'e transcender os excessos acomodados do signo de': {
    pt: 'e transcender os excessos acomodados do signo de',
    en: 'and transcending the comfortable excesses of the sign of',
    es: 'y trascender los excesos acomodados del signo de',
    de: 'und die bequemen Exzesse des Zeichens von zu überwinden',
    fr: 'et transcender les excès confortables du signe de'
  },
  'Nodo Norte • Cabeça do Dragão (Rahu)': {
    pt: 'Nodo Norte • Cabeça do Dragão (Rahu)',
    en: 'North Node • Dragon\'s Head (Rahu)',
    es: 'Nodo Norte • Cabeza del Dragón (Rahu)',
    de: 'Nordknoten • Drachenkopf (Rahu)',
    fr: 'Nœud Nord • Tête du Dragon (Rahu)'
  },
  'Seu Caminho de Destino em': {
    pt: 'Seu Caminho de Destino em',
    en: 'Your Destiny Path in',
    es: 'Tu Camino de Destino en',
    de: 'Ihr Schicksalsweg in',
    fr: 'Votre Chemin de Destinée en'
  },
  'Representa o território inexplorado, os aprendizados que você veio desenvolver nesta vida e a direção exata que destrava o seu senso de realização cósmica. Em': {
    pt: 'Representa o território inexplorado, os aprendizados que você veio desenvolver nesta vida e a direção exata que destrava o seu senso de realização cósmica. Em',
    en: 'Represents the unexplored territory, the learnings you came to develop in this life, and the exact direction that unlocks your sense of cosmic fulfillment. In',
    es: 'Representa el territorio inexplorado, los aprendizajes que viniste a desarrollar en esta vida y la dirección exacta que desbloquea tu sentido de realización cósmica. En',
    de: 'Repräsentiert das unerforschte Territorium, die Erkenntnisse, die Sie in diesem Leben entwickeln wollten, und die genaue Richtung, die Ihr Gefühl kosmischer Erfüllung freisetzt. In',
    fr: 'Représente le territoire inexploré, les apprentissages que vous êtes venu développer dans cette vie, et la direction exacte qui débloque votre sentiment de réalisation cosmique. En'
  },
  'Destrava em você:': {
    pt: 'Destrava em você:',
    en: 'Unlocks in you:',
    es: 'Desbloquea en ti:',
    de: 'Schaltet in Ihnen frei:',
    fr: 'Débloque en vous :'
  },
  'Símbolo: Direção norte cósmica das águias ascendentes.': {
    pt: 'Símbolo: Direção norte cósmica das águias ascendentes.',
    en: 'Symbol: Cosmic north direction of ascending eagles.',
    es: 'Símbolo: Dirección norte cósmica de las águilas ascendentes.',
    de: 'Symbol: Kosmische Nordrichtung aufsteigender Adler.',
    fr: 'Symbole : Direction nord cosmique des aigles ascendants.'
  },
  'Nodo Sul • Cauda do Dragão (Ketu)': {
    pt: 'Nodo Sul • Cauda do Dragão (Ketu)',
    en: 'South Node • Dragon\'s Tail (Ketu)',
    es: 'Nodo Sul • Cola del Dragón (Ketu)',
    de: 'Südknoten • Drachenschwanz (Ketu)',
    fr: 'Nœud Sud • Queue du Dragon (Ketu)'
  },
  'Sua Bagagem em': {
    pt: 'Sua Bagagem em',
    en: 'Your Baggage in',
    es: 'Tu Equipaje en',
    de: 'Ihr Gepäck in',
    fr: 'Votre Bagage en'
  },
  'Simboliza os dons inatos, as facilidades extraordinárias e a "zona de conforto" onde temos o hábito antigo de nos esconder perante a pressão. Em': {
    pt: 'Simboliza os dons inatos, as facilidades extraordinárias e a "zona de conforto" onde temos o hábito antigo de nos esconder perante a pressão. Em',
    en: 'Symbolizes innate gifts, extraordinary facilities, and the "comfort zone" where we have the old habit of hiding under pressure. In',
    es: 'Simboliza los dones innatos, las facilidades extraordinarias y la "zona de confort" donde tenemos el viejo hábito de escondernos bajo presión. En',
    de: 'Symbolisiert angeborene Gaben, außergewöhnliche Fähigkeiten und die "Komfortzone", in der wir die alte Gewohnheit haben, uns unter Druck zu verstecken. In',
    fr: 'Symbolise les dons innés, les facilités extraordinaires et la "zone de confort" où nous avons la vieille habitude de nous cacher sous la pression. En'
  },
  'Evitar excesso de decolagem:': {
    pt: 'Evitar excesso de decolagem:',
    en: 'Avoid excess takeoff:',
    es: 'Evitar exceso de despegue:',
    de: 'Übermäßigen Start vermeiden:',
    fr: 'Éviter un décollage excessif :'
  },
  'Benefício: Força interna instintiva e inteligência consolidada.': {
    pt: 'Benefício: Força interna instintiva e inteligência consolidada.',
    en: 'Benefit: Instinctive inner strength and consolidated intelligence.',
    es: 'Beneficio: Fuerza interna instintiva e inteligencia consolidada.',
    de: 'Vorteil: Instinktive innere Stärke und konsolidierte Intelligenz.',
    fr: 'Bénéfice : Force intérieure instinctive et intelligence consolidée.'
  },
  'SINTONIZADOR PERSONALIZADO INTERATIVO': {
    pt: 'SINTONIZADOR PERSONALIZADO INTERATIVO',
    en: 'INTERACTIVE PERSONALIZED TUNER',
    es: 'SINTONIZADOR PERSONALIZADO INTERACTIVO',
    de: 'INTERAKTIVER PERSONALISIERTER TUNER',
    fr: 'SYNTONISEUR PERSONNALISÉ INTERACTIF'
  },
  'Descubra os Segredos do seu Eixo Nodal': {
    pt: 'Descubra os Segredos do seu Eixo Nodal',
    en: 'Discover the Secrets of your Nodal Axis',
    es: 'Descubre los Secretos de tu Eje Nodal',
    de: 'Entdecken Sie die Geheimnisse Ihrer Knotenachse',
    fr: 'Découvrez les Secrets de votre Axe Nodal'
  },
  'Utilize o sintonizador abaixo para simular as posições do seu Nodo Norte no Mapa Astrológico Natal. Por padrão, ele está sintonizado com seus dados de nascimento reais.': {
    pt: 'Utilize o sintonizador abaixo para simular as posições do seu Nodo Norte no Mapa Astrológico Natal. Por padrão, ele está sintonizado com seus dados de nascimento reais.',
    en: 'Use the tuner below to simulate your North Node positions in the Natal Astrology Chart. By default, it is tuned to your actual birth data.',
    es: 'Utilice el sintonizador de abajo para simular las posiciones de su Nodo Norte en la Carta Astrológica Natal. Por defecto, está sintonizado con sus datos de nacimiento reales.',
    de: 'Verwenden Sie den folgenden Tuner, um Ihre Nordknotenpositionen im Geburtshoroskop zu simulieren. Standardmäßig ist er auf Ihre tatsächlichen Geburtsdaten eingestellt.',
    fr: 'Utilisez le syntoniseur ci-dessous pour simuler les positions de votre Nœud Nord dans le thème astral de naissance. Par défaut, il est calé sur vos données de naissance réelles.'
  },
  'Seu Signo do Nodo Norte:': {
    pt: 'Seu Signo do Nodo Norte:',
    en: 'Your North Node Sign:',
    es: 'Tu Signo del Nodo Norte:',
    de: 'Ihr Nordknotenzeichen:',
    fr: 'Votre Signe du Nœud Nord :'
  },
  'Resetar para Natal': {
    pt: 'Resetar para Natal',
    en: 'Reset to Natal',
    es: 'Restablecer a Natal',
    de: 'Auf Geburtsdaten zurücksetzen',
    fr: 'Réinitialiser au Thème Natal'
  },
  'Casa Astrológica do Território:': {
    pt: 'Casa Astrológica do Território:',
    en: 'Territory Astrological House:',
    es: 'Casa Astrológica del Territorio:',
    de: 'Astrologisches Haus des Territoriums:',
    fr: 'Maison Astrologique du Territoire :'
  },
  'EIXO SELECIONADO ATALHO': {
    pt: 'EIXO SELECIONADO ATALHO',
    en: 'SELECTED AXIS SHORTCUT',
    es: 'ACCESO DIRECTO AL EJE SELECCIONADO',
    de: 'AUSGEWÄHLTE ACHSEN-VERKNÜPFUNG',
    fr: 'RACCOURCI DE L\'AXE SÉLECTIONNÉ'
  },
  '★ Sintonizado com seu Mapa Real': {
    pt: '★ Sintonizado com seu Mapa Real',
    en: '★ Tuned to your Real Chart',
    es: '★ Sintonizado con tu Carta Real',
    de: '★ Auf Ihr reales Horoskop eingestellt',
    fr: '★ Calé sur votre Thème Réel'
  },
  'Oposição: Nodo Sul em': {
    pt: 'Oposição: Nodo Sul em',
    en: 'Opposition: South Node in',
    es: 'Oposición: Nodo Sur en',
    de: 'Opposition: Südknoten in',
    fr: 'Opposition : Nœud Sud en'
  },
  'Caminho do Signo': {
    pt: 'Caminho do Signo',
    en: 'Sign Path',
    es: 'Camino del Signo',
    de: 'Weg des Zeichens',
    fr: 'Chemin du Signe'
  },
  'Desafio do Território': {
    pt: 'Desafio do Território',
    en: 'Territory Challenge',
    es: 'Desafío del Territorio',
    de: 'Territorium Herausforderung',
    fr: 'Défi du Territoire'
  },
  '✓ Integrar:': {
    pt: '✓ Integrar:',
    en: '✓ Integrate:',
    es: '✓ Integrar:',
    de: '✓ Integrieren:',
    fr: '✓ Intégrer :'
  },
  '✗ Evitar:': {
    pt: '✗ Evitar:',
    en: '✗ Avoid:',
    es: '✗ Evitar:',
    de: '✗ Vermeiden:',
    fr: '✗ Éviter :'
  },
  '✓ Território de Ação:': {
    pt: '✓ Território de Ação:',
    en: '✓ Territory of Action:',
    es: '✓ Territorio de Acción:',
    de: '✓ Aktionsbereich:',
    fr: '✓ Territoire d\'Action :'
  },
  '✗ Antigos Fugas:': {
    pt: '✗ Antigos Fugas:',
    en: '✗ Old Escapes:',
    es: '✗ Antiguos Escapes:',
    de: '✗ Alte Ausflüchte:',
    fr: '✗ Anciennes Fuites :'
  },
  'Sua Chave Mestra de Evolução:': {
    pt: 'Sua Chave Mestra de Evolução:',
    en: 'Your Master Key of Evolution:',
    es: 'Tu Clave Maestra de Evolución:',
    de: 'Ihr Hauptschlüssel der Evolution:',
    fr: 'Votre Clé Maîtresse d\'Évolution :'
  },
  'Além de': {
    pt: 'Além de',
    en: 'In addition to',
    es: 'Además de',
    de: 'Zusätzlich zu',
    fr: 'En plus de'
  },
  'Os 12 Eixos Nodais nos Signos': {
    pt: 'Os 12 Eixos Nodais nos Signos',
    en: 'The 12 Nodal Axes in the Signs',
    es: 'Los 12 Ejes Nodales en los Signos',
    de: 'Die 12 Knotenachsen in den Zeichen',
    fr: 'Les 12 Axes Nodaux dans les Signes'
  },
  'Veja em destaque o eixo ativo de sua alma e consulte o caminho dos demais signos.': {
    pt: 'Veja em destaque o eixo ativo de sua alma e consulte o caminho dos demais signos.',
    en: 'See the active axis of your soul highlighted and consult the path of the other signs.',
    es: 'Mira destacado el eje activo de tu alma y consulta el camino de los demás signos.',
    de: 'Sehen Sie die aktive Achse Ihrer Seele hervorgehoben und konsultieren Sie den Weg der anderen Zeichen.',
    fr: 'Découvrez l\'axe actif de votre âme mis en évidence et consultez le chemin des autres signes.'
  },
  '★ SEU EIXO DE ALMA NOS SIGNOS': {
    pt: '★ SEU EIXO DE ALMA NOS SIGNOS',
    en: '★ YOUR SOUL AXIS IN THE SIGNS',
    es: '★ TU EJE DE ALMA EN LOS SIGNOS',
    de: '★ IHRE SEELENACHSE IN DEN ZEICHEN',
    fr: '★ VOTRE AXE D\'ÂME DANS LES SIGNES'
  },
  'Eixo de Propósito Ativo': {
    pt: 'Eixo de Propósito Ativo',
    en: 'Active Purpose Axis',
    es: 'Eje de Propósito Activo',
    de: 'Aktive Zweckachse',
    fr: 'Axe de But Actif'
  },
  '✓ LIÇÃO CENTRAL DA SUA ALMA:': {
    pt: '✓ LIÇÃO CENTRAL DA SUA ALMA:',
    en: '✓ CENTRAL LESSON OF YOUR SOUL:',
    es: '✓ LECCIÓN CENTRAL DE TU ALMA:',
    de: '✓ ZENTRALE LEKTION IHRER SEELE:',
    fr: '✓ LEÇON CENTRALE DE VOTRE ÂME :'
  },
  '✓ INTEGRAR NO COTIDIANO:': {
    pt: '✓ INTEGRAR NO COTIDIANO:',
    en: '✓ INTEGRATE INTO DAILY LIFE:',
    es: '✓ INTEGRAR EN LA VIDA DIARIA:',
    de: '✓ IN DEN ALLTAG INTEGRIEREN:',
    fr: '✓ INTÉGRER AU QUOTIDIEN :'
  },
  '✗ COMPORTAMENTO A EVITAR / TRANSFORMAR:': {
    pt: '✗ COMPORTAMENTO A EVITAR / TRANSFORMAR:',
    en: '✗ BEHAVIOR TO AVOID / TRANSFORM:',
    es: '✗ COMPORTAMIENTO A EVITAR / TRANSFORMAR:',
    de: '✗ ZU VERMEIDENDES / ZU VERÄNDERNDES VERHALTEN:',
    fr: '✗ COMPORTEMENT À ÉVITER / TRANSFORMER :'
  },
  'Outros Eixos Nodais para Consulta': {
    pt: 'Outros Eixos Nodais para Consulta',
    en: 'Other Nodal Axes for Consultation',
    es: 'Otros Ejes Nodales para Consulta',
    de: 'Andere Knotenachsen zur Konsultation',
    fr: 'Autres Axes Nodaux pour Consultation'
  },
  '✓ LIÇÃO EVOLUTIVA:': {
    pt: '✓ LIÇÃO EVOLUTIVA:',
    en: '✓ EVOLUTIONARY LESSON:',
    es: '✓ LECCIÓN EVOLUTIVA:',
    de: '✓ EVOLUTIONÄRE LEKTION:',
    fr: '✓ LEÇON ÉVOLUTIVE :'
  },
  '✗ COMPORTAMENTO A EVITAR:': {
    pt: '✗ COMPORTAMENTO A EVITAR:',
    en: '✗ BEHAVIOR TO AVOID:',
    es: '✗ COMPORTAMIENTO A EVITAR:',
    de: '✗ ZU VERMEIDENDES VERHALTEN:',
    fr: '✗ COMPORTEMENT À ÉVITER :'
  },
  'Os Eixos Nodais nas Casas Astrológicas': {
    pt: 'Os Eixos Nodais nas Casas Astrológicas',
    en: 'The Nodal Axes in the Astrological Houses',
    es: 'Los Ejes Nodales en las Casas Astrológicas',
    de: 'Die Knotenachsen in den astrologischen Häusern',
    fr: 'Les Axes Nodaux dans les Maisons Astrologiques'
  },
  'As Casas indicam o território prático da vida onde esse aprendizado de alma acontece.': {
    pt: 'As Casas indicam o território prático da vida onde esse aprendizado de alma acontece.',
    en: 'The Houses indicate the practical territory of life where this soul learning takes place.',
    es: 'Las Casas indican el territorio práctico de la vida donde tiene lugar este aprendizaje del alma.',
    de: 'Die Häuser zeigen den praktischen Bereich des Lebens an, in dem dieses Seelenlernen stattfindet.',
    fr: 'Les Maisons indiquent le territoire pratique de la vie où se déroule cet apprentissage de l\'âme.'
  },
  '★ SEU TERRITÓRIO EVOLUTIVO (CASA)': {
    pt: '★ SEU TERRITÓRIO EVOLUTIVO (CASA)',
    en: '★ YOUR EVOLUTIONARY TERRITORY (HOUSE)',
    es: '★ TU TERRITORIO EVOLUTIVO (CASA)',
    de: '★ IHR EVOLUTIONÄRER BEREICH (HAUS)',
    fr: '★ VOTRE TERRITOIRE ÉVOLUTIF (MAISON)'
  },
  'Casa Ativa': {
    pt: 'Casa Ativa',
    en: 'Active House',
    es: 'Casa Activa',
    de: 'Aktives Haus',
    fr: 'Maison Active'
  },
  '✓ DESAFIO NO TERRITÓRIO DA CASA:': {
    pt: '✓ DESAFIO NO TERRITÓRIO DA CASA:',
    en: '✓ CHALLENGE IN THE TERRITORY OF THE HOUSE:',
    es: '✓ DESAFÍO EN EL TERRITORIO DE LA CASA:',
    de: '✓ HERAUSFORDERUNG IM BEREICH DES HAUSES:',
    fr: '✓ DÉFI SUR LE TERRITOIRE DE LA MAISON :'
  },
  '✓ ATITUDE A ABRAÇAR:': {
    pt: '✓ ATITUDE A ABRAÇAR:',
    en: '✓ ATTITUDE TO EMBRACE:',
    es: '✓ ACTITUD A ABRAZAR:',
    de: '✓ EINZUNEHMENDE HALTUNG:',
    fr: '✓ ATTITUDE À ADOPTER :'
  },
  '✗ ANTIGAS FUGAS A EVITAR:': {
    pt: '✗ ANTIGAS FUGAS A EVITAR:',
    en: '✗ OLD ESCAPES TO AVOID:',
    es: '✗ ANTIGUOS ESCAPES A EVITAR:',
    de: '✗ ALTE FLUCHTEN ZU VERMEIDEN:',
    fr: '✗ ANCIENNES FUITES À ÉVITER :'
  },
  'Outras Casas para Consulta': {
    pt: 'Outras Casas para Consulta',
    en: 'Other Houses for Consultation',
    es: 'Otras Casas para Consulta',
    de: 'Andere Häuser zur Konsultation',
    fr: 'Autres Maisons pour Consultation'
  },
  'Abraçar:': {
    pt: 'Abraçar:',
    en: 'Embrace:',
    es: 'Abrazar:',
    de: 'Annehmen:',
    fr: 'Adopter :'
  },
  'Evitar:': {
    pt: 'Evitar:',
    en: 'Avoid:',
    es: 'Evitar:',
    de: 'Vermeiden:',
    fr: 'Éviter :'
  },
  'Conjunções Planetárias no Eixo Nodal': {
    pt: 'Conjunções Planetárias no Eixo Nodal',
    en: 'Planetary Conjunctions on the Nodal Axis',
    es: 'Conjunciones Planetarias en el Eje Nodal',
    de: 'Planetenkonjunktionen auf der Knotenachse',
    fr: 'Conjonctions Planétaires sur l\'Axe Nodal'
  },
  'Aspectos de forte relevância real entre os planetas do seu mapa e os seus Nodos Lunares de evolução.': {
    pt: 'Aspectos de forte relevância real entre os planetas do seu mapa e os seus Nodos Lunares de evolução.',
    en: 'Aspects of strong real relevance between the planets of your chart and your Lunar Nodes of evolution.',
    es: 'Aspectos de fuerte relevancia real entre los planetas de tu carta y tus Nodos Lunares de evolución.',
    de: 'Aspekte von starker realer Relevanz zwischen den Planeten Ihres Horoskops und Ihren Mondknoten der Entwicklung.',
    fr: 'Aspects d\'une forte pertinence réelle entre les planètes de votre thème et vos Nœuds Lunaires d\'évolution.'
  },
  '✓ ASPECTOS E CONJUNÇÕES REAIS DETECTADAS EM SEU MAPA': {
    pt: '✓ ASPECTOS E CONJUNÇÕES REAIS DETECTADAS EM SEU MAPA',
    en: '✓ REAL ASPECTS AND CONJUNCTIONS DETECTED IN YOUR CHART',
    es: '✓ ASPECTOS Y CONJUNCIONES REALES DETECTADOS EN TU CARTA',
    de: '✓ REALE ASPEKTE UND KONJUNKTIONEN IN IHREM HOROSKOP ERKANNT',
    fr: '✓ ASPECTS ET CONJONCTIONS RÉELS DÉTECTÉS DANS VOTRE THÈME'
  },
  'Exemplos Comuns de Conjunções Relevantes:': {
    pt: 'Exemplos Comuns de Conjunções Relevantes:',
    en: 'Common Examples of Relevant Conjunctions:',
    es: 'Ejemplos Comunes de Conjunciones Relevantes:',
    de: 'Häufige Beispiele für relevante Konjunktionen:',
    fr: 'Exemples Courants de Conjonctions Pertinentes :'
  },
  'Sol conjunto ao Nodo Norte': {
    pt: 'Sol conjunto ao Nodo Norte',
    en: 'Sun conjunct North Node',
    es: 'Sol conjunto al Nodo Norte',
    de: 'Sonne in Konjunktion mit dem Nordknoten',
    fr: 'Soleil conjoint au Nœud Nord'
  },
  'Indica que o seu propósito de brilho, vitalidade de ego e sua profissão central estão intrinsecamente amarrados à sua missão de decolagem de alma nesta existência. Símbolo de guias.': {
    pt: 'Indica que o seu propósito de brilho, vitalidade de ego e sua profissão central estão intrinsecamente amarrados à sua missão de decolagem de alma nesta existência. Símbolo de guias.',
    en: 'Indicates that your purpose of brilliance, ego vitality, and central profession are intrinsically tied to your mission of soul takeoff in this existence. Symbol of guides.',
    es: 'Indica que tu propósito de brillo, vitalidad de ego y tu profesión central están intrínsecamente ligados a tu misión de despegue de alma en esta existencia. Símbolo de guías.',
    de: 'Weist darauf hin, dass Ihr Lebensziel, Ihre Ego-Vitalität und Ihr Hauptberuf untrennbar mit Ihrer Seelen-Aufstiegsmission in dieser Existenz verbunden sind. Symbol der Führer.',
    fr: 'Indique que votre but de rayonnement, votre vitalité d\'ego et votre profession centrale sont intrinsèquement liés à votre mission de décollage d\'âme dans cette existence. Symbole de guides.'
  },
  'Lua conjunta ao Nodo Sul': {
    pt: 'Lua conjunta ao Nodo Sul',
    en: 'Moon conjunct South Node',
    es: 'Luna conjunta al Nodo Sul',
    de: 'Mond in Konjunktion mit dem Südknoten',
    fr: 'Lune conjointe au Nœud Sud'
  },
  'Facilidade psíquica extraordinária, memórias sentimentais riquíssimas e uma sensibilidade caridosa inata. O perigo é mimar o próprio subconsciente por meio de carências do passado.': {
    pt: 'Facilidade psíquica extraordinária, memórias sentimentais riquíssimas e uma sensibilidade caridosa inata. O perigo é mimar o próprio subconsciente por meio de carências do passado.',
    en: 'Extraordinary psychic facility, rich sentimental memories, and an innate caring sensitivity. The danger is pampering your own subconscious through past deficiencies.',
    es: 'Facilidad psíquica extraordinaria, recuerdos sentimentales riquísimos y una sensibilidad caritativa innata. El peligro es mimar el propio subconsciente a través de carencias del pasado.',
    de: 'Außergewöhnliche psychische Leichtigkeit, reiche sentimentale Erinnerungen und eine angeborene fürsorgliche Sensibilität. Die Gefahr besteht darin, das eigene Unterbewusstsein durch vergangene Mängel zu verwöhnen.',
    fr: 'Facilité psychique extraordinaire, riches souvenirs sentimentaux et sensibilité bienveillante innée. Le danger est de choyer son propre subconscient par des carences du passé.'
  },
  'Saturno conjunto ao Nodo Norte': {
    pt: 'Saturno conjunto ao Nodo Norte',
    en: 'Saturn conjunct North Node',
    es: 'Saturno conjunto al Nodo Norte',
    de: 'Saturn in Konjunktion mit dem Nordknoten',
    fr: 'Saturne conjoint au Nœud Nord'
  },
  'Cobrança por maturidade. A sabedoria do Nodo Norte virá após muita disciplina, estruturação ética de longo prazo e comprometimento sério com a caminhada material.': {
    pt: 'Cobrança por maturidade. A sabedoria do Nodo Norte virá após muita disciplina, estruturação ética de longo prazo e comprometimento sério com a caminhada material.',
    en: 'Demands for maturity. The wisdom of the North Node will come after much discipline, long-term ethical structuring, and serious commitment to the material path.',
    es: 'Exigencia de madurez. La sabiduría del Nodo Norte vendrá después de mucha disciplina, estructuración ética a largo plazo y compromiso serio con el camino material.',
    de: 'Forderung nach Reife. Die Weisheit des Nordknotens wird erst nach viel Disziplin, langfristiger ethischer Strukturierung und ernsthaftem Engagement für den materiellen Weg kommen.',
    fr: 'Demande de maturité. La sagesse du Nœud Nord viendra après beaucoup de discipline, une structuration éthique à long terme et un engagement sérieux sur le chemin matériel.'
  },
  'Urano ou Plutão conjuntos': {
    pt: 'Urano ou Plutão conjuntos',
    en: 'Urano or Pluto conjunct',
    es: 'Urano o Plutón conjuntos',
    de: 'Uranus oder Pluto in Konjunktion',
    fr: 'Uranus ou Pluton conjoints'
  },
  'Rupturas místicas extraordinárias na forma como você encara as transformações. Você passa por mortes simbólicas constantes de ego para renovar integralmente suas estruturas de vida.': {
    pt: 'Rupturas místicas extraordinárias na forma como você encara as transformações. Você passa por mortes simbólicas constantes de ego para renovar integralmente suas estruturas de vida.',
    en: 'Extraordinary mystical disruptions in the way you face transformations. You go through constant symbolic deaths of ego to fully renew your life structures.',
    es: 'Rupturas místicas extraordinarias en la forma en que enfrentas las transformaciones. Pasas por constantes muertes simbólicas de ego para renovar integralmente tus estructuras de vida.',
    de: 'Außergewöhnliche mystische Brüche in der Art und Weise, wie Sie Veränderungen begegnen. Sie durchlaufen ständige symbolische Egotode, um Ihre Lebensstrukturen vollständig zu erneuern.',
    fr: 'Ruptures mystiques extraordinaires dans votre façon de faire face aux transformations. Vous traversez de constantes morts symboliques de l\'ego pour renouveler intégralement vos structures de vie.'
  },
  'Dicas Práticas de Alinhamento Astrológico': {
    pt: 'Dicas Práticas de Alinhamento Astrológico',
    en: 'Practical Tips for Astrological Alignment',
    es: 'Consejos Prácticos para el Alineamiento Astrológico',
    de: 'Praktische Tipps zur astrologischen Ausrichtung',
    fr: 'Conseils Pratiques d\'Alignement Astrologique'
  },
  'Conselhos valiosos sintonizados com o seu Nodo Norte para o seu cotidiano.': {
    pt: 'Conselhos valiosos sintonizados com o seu Nodo Norte para o seu cotidiano.',
    en: 'Valuable advice tuned to your North Node for your daily life.',
    es: 'Valiosos consejos sintonizados con tu Nodo Norte para tu vida diaria.',
    de: 'Wertvolle Ratschläge, die auf Ihren Nordknoten für Ihren Alltag abgestimmt sind.',
    fr: 'Précieux conseils calés sur votre Nœud Nord pour votre vie quotidienne.'
  },
  'Meditação Direcionada para': {
    pt: 'Meditação Direcionada para',
    en: 'Directed Meditation for',
    es: 'Meditación Dirigida para',
    de: 'Gezielte Meditation für',
    fr: 'Méditation Dirigée pour'
  },
  'Em instantes de extrema indecisão ou pressa, feche os olhos e respire profundamente, direcionando sua atenção mental para o territory da sua': {
    pt: 'Em instantes de extrema indecisão ou pressa, feche os olhos e respire profundamente, direcionando sua atenção mental para o territory da sua',
    en: 'In moments of extreme indecision or haste, close your eyes and breathe deeply, directing your mental attention to the territory of your',
    es: 'En momentos de extrema indecisión o prisa, cierra los ojos y respira hondo, dirigiendo tu atención mental al territorio de tu',
    de: 'In Momenten extremer Unentschlossenheit oder Eile schließen Sie die Augen und atmen tief durch, wobei Sie Ihre geistige Aufmerksamkeit auf das Gebiet Ihres',
    fr: 'Dans les moments d\'extrême indécision ou de hâte, fermez les yeux et respirez profondément, en dirigeant votre attention mentale vers le territoire de votre'
  },
  'O Nodo Norte pede o passo de fé corajoso sintonizado nas virtudes de': {
    pt: 'O Nodo Norte pede o passo de fé corajoso sintonizado nas virtudes de',
    en: 'The North Node asks for the courageous step of faith tuned to the virtues of',
    es: 'El Nodo Norte pide el valiente paso de fe sintonizado con las virtudes de',
    de: 'Der Nordknoten bittet um den mutigen Schritt des Glaubens, der auf die Tugenden von abgestimmt ist',
    fr: 'Le Nœud Nord demande le pas de foi courageux calé sur les vertus de'
  },
  'Seu caminho de destino demanda integrar ativamente:': {
    pt: 'Seu caminho de destino demanda integrar ativamente:',
    en: 'Your destiny path demands to actively integrate:',
    es: 'Tu camino de destino exige integrar activamente:',
    de: 'Ihr Schicksalsweg erfordert eine aktive Integration von:',
    fr: 'Votre chemin de destinée exige d\'intégrer activement :'
  },
  'Mapeie seu Eixo na Mesa de Trabalho': {
    pt: 'Mapeie seu Eixo na Mesa de Trabalho',
    en: 'Map your Axis on your Desk',
    es: 'Mapea tu Eje en tu Escritorio de Trabajo',
    de: 'Bilden Sie Ihre Achse auf Ihrem Schreibtisch ab',
    fr: 'Cartographiez votre Axe sur votre Table de Travail'
  },
  'Escreva em um pequeno papel qual o seu Nodo Norte ativo': {
    pt: 'Escreva em um pequeno papel qual o seu Nodo Norte ativo',
    en: 'Write on a small piece of paper which is your active North Node',
    es: 'Escribe en un papel pequeño cuál es tu Nodo Norte activo',
    de: 'Schreiben Sie auf einen kleinen Zettel, welcher Ihr aktiver Nordknoten ist',
    fr: 'Écrivez sur un petit papier quel est votre Nœud Nord actif'
  },
  'Ter esse lembrete visual evoca o seu foco racional no dia a dia para que você recuse reações automáticas de fuga na cauda': {
    pt: 'Ter esse lembrete visual evoca o seu foco racional no dia a dia para que você recuse reações automáticas de fuga na cauda',
    en: 'Having this visual reminder evokes your rational focus day-to-day so that you reject automatic escape reactions in the tail',
    es: 'Tener este recordatorio visual evoca tu enfoque racional en el día a día para que rechaces reacciones automáticas de escape en la cola',
    de: 'Diese visuelle Erinnerung zu haben, ruft Ihren rationalen Fokus im Alltag hervor, sodass Sie automatische Fluchtreaktionen im Schwanz ablehnen',
    fr: 'Avoir ce rappel visuel évoque votre concentration rationnelle au quotidien afin que vous refusiez les réactions de fuite automatiques dans la queue'
  },
  'e assuma a nobreza de sua missão.': {
    pt: 'e assuma a nobreza de sua missão.',
    en: 'and embrace the nobility of your mission.',
    es: 'y asumas la nobreza de tu misión.',
    de: 'und die Erhabenheit Ihrer Mission annehmen.',
    fr: 'et assumiez la noblesse de votre mission.'
  },
  'A Integração de Bagagens': {
    pt: 'A Integração de Bagagens',
    en: 'Baggage Integration',
    es: 'La Integración de Equipajes',
    de: 'Gepäckintegration',
    fr: 'L\'Intégration des Bagages'
  },
  'A evolução pessoal saudável não se trata de aniquilar os seus dotes inatos de': {
    pt: 'A evolução pessoal saudável não se trata de aniquilar os seus dotes inatos de',
    en: 'Healthy personal evolution is not about annihilating your innate gifts of',
    es: 'La evolución personal saludable no se trata de aniquilar tus dotes innatos de',
    de: 'Bei einer gesunden persönlichen Entwicklung geht es nicht darum, Ihre angeborenen Gaben von zu vernichten',
    fr: 'Une évolution personnelle saine ne consiste pas à annihiler vos dons innés de'
  },
  'mas sim de canalizá-los de forma equilibrada como a base estável de onde você alça voo consciente rumo ao castelo de': {
    pt: 'mas sim de canalizá-los de forma equilibrada como a base estável de onde você alça voo consciente rumo ao castelo de',
    en: 'but rather to channel them in a balanced way as the stable base from which you take conscious flight towards the castle of',
    es: 'sino de canalizarlos de forma equilibrada como la base estable desde la cual emprendes el vuelo consciente hacia el castillo de',
    de: 'sondern vielmehr darum, sie ausgewogen als stabile Basis zu kanalisieren, von der aus Sie den bewussten Flug in Richtung des Schlosses von antreten',
    fr: 'mais plutôt de les canaliser de manière équilibrée comme la base stable à partir de laquelle vous prenez un envol conscient vers le château de'
  },
  'com maturidade máxima.': {
    pt: 'com maturidade máxima.',
    en: 'with maximum maturity.',
    es: 'con la máxima madurez.',
    de: 'mit maximaler Reife.',
    fr: 'avec une maturité maximale.'
  },
  'Devemos reconhecer e manter equilibrado o nosso eixo nodal para que a nossa evolução na atual existência seja constante e o nosso senso de propósito se mantenha sempre energizado.': {
    pt: 'Devemos reconhecer e manter equilibrado o nosso eixo nodal para que a nossa evolução na atual existência seja constante e o nosso senso de propósito se mantenha sempre energizado.',
    en: 'We must recognize and keep our nodal axis balanced so that our evolution in the current existence is constant and our sense of purpose always remains energized.',
    es: 'Debemos reconocer y mantener equilibrado nuestro eje nodal para que nuestra evolución en la existencia actual sea constante y nuestro sentido de propósito siempre se mantenga energizado.',
    de: 'Wir müssen unsere Knotenachse anerkennen und ausgeglichen halten, damit unsere Entwicklung im gegenwärtigen Dasein beständig ist und unser Sinn für Zweckmäßigkeit immer voller Energie bleibt.',
    fr: 'Nous devons reconnaître et maintenir équilibré notre axe nodal pour que notre évolution dans l\'existence actuelle soit constante et que notre sentiment de but reste toujours dynamisé.'
  },
  'SINTONIZADO': {
    pt: 'SINTONIZADO',
    en: 'TUNED',
    es: 'SINTONIZADO',
    de: 'ABGESTIMMT',
    fr: 'SYNTONISÉ'
  },
  'Como base no sintonizador de efemérides reais do seu nascimento, identificamos que o seu': {
    pt: 'Com base no sintonizador de efemérides reais do seu nascimento, identificamos que o seu',
    en: 'Based on the real ephemeris tuner of your birth, we identified that your',
    es: 'Con base en el sintonizador de efemérides reales de tu nacimiento, identificamos que tu',
    de: 'Basierend auf dem realen Ephemeriden-Tuner Ihrer Geburt haben wir festgestellt, dass Ihr',
    fr: 'Sur la base du syntoniseur d\'éphémérides réelles de votre naissance, nous avons identifié que votre'
  },
  'Nodo Norte (Cabeça do Dragão)': {
    pt: 'Nodo Norte (Cabeça do Dragão)',
    en: 'North Node (Dragon\'s Head)',
    es: 'Nodo Norte (Cabeza del Dragón)',
    de: 'Nordknoten (Drachenkopf)',
    fr: 'Nœud Nord (Tête du Dragon)'
  },
  'está posicionado em': {
    pt: 'está posicionado em',
    en: 'is positioned in',
    es: 'está posicionado en',
    de: 'positioniert ist in',
    fr: 'est positionné en'
  },
  'na': {
    pt: 'na',
    en: 'in',
    es: 'en',
    de: 'in',
    fr: 'dans la'
  },
  'Casa': {
    pt: 'Casa',
    en: 'House',
    es: 'Casa',
    de: 'Haus',
    fr: 'Maison'
  },
  'Em oposição perfeita, o seu': {
    pt: 'Em oposição perfeita, o seu',
    en: 'In perfect opposition, your',
    es: 'En perfecta oposición, tu',
    de: 'In perfekter Opposition Ihr',
    fr: 'En parfaite opposition, votre'
  },
  'Nodo Sul (Cauda do Dragão)': {
    pt: 'Nodo Sul (Cauda do Dragão)',
    en: 'South Node (Dragon\'s Tail)',
    es: 'Nodo Sur (Cola del Dragón)',
    de: 'Südknoten (Drachenschwanz)',
    fr: 'Nœud Sud (Queue du Dragon)'
  },
  'está localizado em': {
    pt: 'está localizado em',
    en: 'is located in',
    es: 'está localizado en',
    de: 'liegt in',
    fr: 'est situé en'
  },
  'Não detectamos conjunções ou aspectos exatos (menor que 5° de orbe) envolvendo os seus Nodos Lunares com os demais planetas pessoais em seu mapa de nascimento. Isso indica que seu eixo de evolução opera livre de interferências dinâmicas diretas, focando puramente nas diretrizes fundamentais de seu signo de': {
    pt: 'Não detectamos conjunções ou aspectos exatos (menor que 5° de orbe) envolvendo os seus Nodos Lunares com os demais planetas pessoais em seu mapa de nascimento. Isso indica que seu eixo de evolução opera livre de interferências dinâmicas diretas, focando puramente nas diretrizes fundamentais de seu signo de',
    en: 'We did not detect exact conjunctions or aspects (less than 5° orb) involving your Lunar Nodes with the other personal planets in your birth chart. This indicates that your evolution axis operates free of direct dynamic interferences, focusing purely on the fundamental guidelines of your sign of',
    es: 'No detectamos conjunciones o aspectos exactos (menos de 5° de orbe) que involucren tus Nodos Lunares con los demás planetas personales en tu carta de nacimiento. Esto indica que tu eje de evolución opera libre de interferencias dinámicas directas, enfocándose puramente en las directrices fundamentales de tu signo de',
    de: 'Wir haben keine exakten Konjunktionen oder Aspekte (weniger als 5° Orbis) festgestellt, die Ihre Mondknoten mit den anderen persönlichen Planeten in Ihrem Geburtshoroskop betreffen. Dies deutet darauf hin, dass Ihre Entwicklungsachse frei von direkten dynamischen Einflüssen verläuft und sich rein auf die grundlegenden Richtlinien Ihres Zeichens konzentriert',
    fr: 'Nous n\'avons pas détecté de conjonctions ou d\'aspects exacts (orbe inférieur à 5°) impliquant vos Nœuds Lunaires avec les autres planètes personnelles de votre thème de naissance. Cela indique que votre axe d\'évolution fonctionne à l\'abri de toute interférence dynamique directe, se concentrant uniquement sur les directives fondamentales de votre signe du'
  },
  'e da Casa': {
    pt: 'e da Casa',
    en: 'and of House',
    es: 'y de la Casa',
    de: 'und des Hauses',
    fr: 'et de la Maison'
  },
  'A análise do Eixo Nodal, ou seja, da posição dos nodos lunares norte e sul (também chamados de cabeça e cauda do dragão) no momento do seu nascimento, identifica os pontos que devem ser sempre lembrados, aprimorados e equilibrados em sua jornada de vida atual. O objetivo é reconhecer o potencial do nodo norte e os beneficios do nodo sul, saindo um pouco da cauda em direção à cabeça do dragão.': {
    pt: 'A análise do Eixo Nodal, ou seja, da posição dos nodos lunares norte e sul (também chamados de cabeça e cauda do dragão) no momento do seu nascimento, identifica os pontos que devem ser sempre lembrados, aprimorados e equilibrados em sua jornada de vida atual. O objetivo é reconhecer o potencial do nodo norte e os beneficios do nodo sul, saindo um pouco da cauda em direção à cabeça do dragão.',
    en: 'The analysis of the Nodal Axis, i.e., the position of the north and south lunar nodes (also called dragon\'s head and tail) at the time of your birth, identifies the points that must always be remembered, improved, and balanced in your current life journey. The goal is to recognize the potential of the north node and the benefits of the south node, stepping slightly away from the tail towards the head of the dragon.',
    es: 'El análisis del Eje Nodal, es decir, de la posición de los nodos lunares norte y sur (también llamados cabeza y cola de dragón) al momento de tu nacimiento, identifica los puntos que siempre deben ser recordados, mejorados y equilibrados en tu jornada de vida actual. El objetivo es reconocer el potencial del nodo norte y los beneficios del nodo sur, saliendo un poco de la cola en dirección a la cabeza del dragón.',
    de: 'Die Analyse der Knotenachse, d.h. der Position des nördlichen und südlichen Mondknotens (auch Drachenkopf und -schwanz genannt) zum Zeitpunkt Ihrer Geburt, identifiziert die Punkte, die in Ihrer aktuellen Lebensreise immer erinnert, verbessert und ausgeglichen werden müssen. Das Ziel ist es, das Potenzial des Nordknotens und die Vorteile des Südknotens zu erkennen und sich ein wenig vom Schwanz in Richtung des Drachenkopfes zu bewegen.',
    fr: 'L\'analyse de l\'Axe Nodal, c\'est-à-dire de la position des nœuds lunaires nord et sud (également appelés tête et queue du dragon) au moment de votre naissance, identifie les points qui doivent toujours être mémorisés, améliorés et équilibrés dans votre parcours de vie actuel. L\'objectif est de reconnaître le potentiel du nœud nord et les bienfaits du nœud sud, en sortant un peu de la queue vers la tête du dragon.'
  },
  'As que oscilam entre as influências dos nodos em períodos específicos, sem que tenham qualquer noção ou controle sobre essa condição.': {
    pt: 'As que oscilam entre as influências dos nodos em períodos específicos, sem que tenham qualquer noção ou controle sobre essa condição.',
    en: 'Those who oscillate between the influences of the nodes in specific periods, without having any notion or control over this condition.',
    es: 'Quienes oscilan entre las influencias de los nodos en períodos específicos, sin tener noción o control sobre esa condición.',
    de: 'Diejenigen, die in bestimmten Phasen zwischen den Einflüssen der Knoten schwanken, ohne eine Vorstellung oder Kontrolle über diesen Zustand zu haben.',
    fr: 'Ceux qui oscillent entre les influences des nœuds à des périodes spécifiques, sans avoir la moindre notion ou contrôle sur cet état.'
  },
  'As que projetam as necessidades dos Nodo Norte nos outros e acabam sendo atraídas por pessoas e situações que simbolizam as qualidades opostas.': {
    pt: 'As que projetam as necessidades dos Nodo Norte nos outros e acabam sendo atraídas por pessoas e situações que simbolizam as qualidades opostas.',
    en: 'Those who project the needs of the North Node onto others and end up being attracted to people and situations that symbolize the opposite qualities.',
    es: 'Quienes proyectan las necesidades del Nodo Norte en los demás y terminan siendo atraídos por personas y situaciones que simbolizan las cualidades opuestas.',
    de: 'Diejenigen, die die Bedürfnisse des Nordknotens auf andere projizieren und schließlich von Menschen und Situationen angezogen werden, die die gegenteiligen Qualitäten symbolisieren.',
    fr: 'Ceux qui projettent les besoins du Nœud Nord sur les autres et finissent par être attirés par des personnes et des situations qui symbolisent les qualités opposées.'
  },
  'As que conseguiram compreender as propostas dos nodos e sentem-se livres para expressar suas potencialidades em direção ao equilíbrio.': {
    pt: 'As que conseguiram compreender as propostas dos nodos e sentem-se livres para expressar suas potencialidades em direção ao equilíbrio.',
    en: 'Those who managed to understand the proposals of the nodes and feel free to express their potential towards balance.',
    es: 'Quienes lograron comprender las propuestas de los nodos y se sienten libres de expresar sus potencialidades hacia el equilibrio.',
    de: 'Diejenigen, denen es gelungen ist, die Vorschläge der Knoten zu verstehen, und sich frei fühlen, ihre Potenziale in Richtung Gleichgewicht auszudrücken.',
    fr: 'Ceux qui ont réussi à comprendre les propositions des nœuds et se sentent libres d\'exprimer leurs potentialités vers l\'équilibre.'
  }
};

export const localLunarNodesTranslations: Record<Language, Record<string, string>> = {
  pt: {
    "na Casa": "na Casa",
    "Buscador de Sabedoria": "Buscador de Sabedoria",
    "Olá,": "Olá,"
  },
  en: {
    "na Casa": "in House",
    "Buscador de Sabedoria": "Seeker of Wisdom",
    "Olá,": "Hello,"
  },
  es: {
    "na Casa": "en la Casa",
    "Buscador de Sabedoria": "Buscador de Sabiduría",
    "Olá,": "Hola,"
  },
  de: {
    "na Casa": "im Haus",
    "Buscador de Sabedoria": "Sucher der Weisheit",
    "Olá,": "Hallo,"
  },
  fr: {
    "na Casa": "dans la Maison",
    "Buscador de Sabedoria": "Chercheur de Sagesse",
    "Olá,": "Bonjour,"
  }
};

export default function LunarNodes({ userName = 'Buscador de Sabedoria', mapData, lang }: LunarNodesProps) {
  const { idioma } = useIdioma();
  const idiomaAtual = idioma || (lang as Language) || 'pt';

  const tLocal = (text: string) => {
    if (!text) return "";
    const activeLang = (idiomaAtual as Language) || 'pt';
    if (localLunarNodesTranslations[activeLang]?.[text]) {
      return localLunarNodesTranslations[activeLang][text];
    }
    if (activeLang === 'pt') return text;
    const match = NODE_UI_TRANSLATIONS[text];
    if (match && match[activeLang]) {
      return match[activeLang];
    }
    return translateUiText(text, activeLang);
  };

  const t = tLocal;

  // Use localized constants dynamically depending on the current active language
  const nodeSignsData = NODE_SIGNS_LOCALIZED[idiomaAtual as Language] || NODE_SIGNS_LOCALIZED['pt'];
  const nodeHousesData = NODE_HOUSES_LOCALIZED[idiomaAtual as Language] || NODE_HOUSES_LOCALIZED['pt'];

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
              {t('Eixo Sagrado dos Nodos Lunares')}
            </span>
            <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight text-white uppercase">
              {t('Caminho da Alma • Evolução Pessoal')}
            </h2>
            <p className="text-slate-350 text-[11.5px] font-sans max-w-3xl leading-relaxed">
              {t('Devemos reconhecer e manter equilibrado o nosso eixo nodal para que a nossa evolução na atual existência seja constante e o nosso senso de propósito se mantenha sempre energizado.')}
            </p>
          </div>

          <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 text-right shrink-0">
            <span className="text-[8px] font-mono text-slate-500 block">{t('SINTONIZADO')}</span>
            <span className="text-xs font-mono font-bold text-indigo-400">{t(realNorthNodeSign)} • C{realNorthNodeHouse}</span>
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
            {t('Introdução')}
          </button>

          <button
            onClick={() => setActiveSubTab('significado')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'significado' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Significado')}
          </button>

          <button
            onClick={() => setActiveSubTab('insights')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'insights' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Insights')}
          </button>

          <button
            onClick={() => setActiveSubTab('signos')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'signos' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Signos')}
          </button>

          <button
            onClick={() => setActiveSubTab('casas')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'casas' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Casas')}
          </button>

          <button
            onClick={() => setActiveSubTab('conjuncoes')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'conjuncoes' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Conjunções')}
          </button>

          <button
            onClick={() => setActiveSubTab('dicas')}
            className={`px-2 py-2 rounded-xl text-[10.5px] font-mono transition text-center cursor-pointer border ${
              activeSubTab === 'dicas' 
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-305 font-bold shadow-md' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('Reflexões')}
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
                  <span className="text-[9px] font-mono uppercase text-indigo-400 block tracking-widest mb-1.5">{t('Eixo Sagrado Calculado de')} {t(userName)}</span>
                  <p className="text-slate-200 leading-relaxed">
                    {t('Olá,')} <strong>{t(userName)}</strong>! {t('Com base no sintonizador de efemérides reais do seu nascimento, identificamos que o seu')} <strong>{t('Nodo Norte (Cabeça do Dragão)')}</strong> {t('está posicionado em')} <strong>{t(realNorthNodeSign)}</strong> {t('na')} <strong>{t('Casa')} {realNorthNodeHouse}</strong>. {t('Em oposição perfeita, o seu')} <strong>{t('Nodo Sul (Cauda do Dragão)')}</strong> {t('está localizado em')} <strong>{t(realSouthNodeSign)}</strong> {t('na')} <strong>{t('Casa')} {realSouthNodeHouse}</strong>.
                  </p>
                </div>

                <div className="flex gap-3 items-start pt-2">
                  <Compass className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">{t('O que é o Eixo Nodal?')}</h3>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      {t('A análise do Eixo Nodal, ou seja, da posição dos nodos lunares norte e sul (também chamados de cabeça e cauda do dragão) no momento do seu nascimento, identifica os pontos que devem ser sempre lembrados, aprimorados e equilibrados em sua jornada de vida atual. O objetivo é reconhecer o potencial do nodo norte e os beneficios do nodo sul, saindo um pouco da cauda em direção à cabeça do dragão.')}
                    </p>
                  </div>
                </div>

                {/* Big numbers beautiful layout for the 3 types of people requested */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-[11.5px] font-bold font-mono text-indigo-300 uppercase tracking-widest block">
                    {t('Geralmente existem 3 tipos de pessoas no manejo das energias nodais:')}
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
                          {t('As que oscilam entre as influências dos nodos em períodos específicos, sem que tenham qualquer noção ou controle sobre essa condição.')}
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
                          {t('As que projetam as necessidades dos Nodo Norte nos outros e acabam sendo atraídas por pessoas e situações que simbolizam as qualidades opostas.')}
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
                          {t('As que conseguiram compreender as propostas dos nodos e sentem-se livres para expressar suas potencialidades em direção ao equilíbrio.')}
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
                {t('Para o mapa de')} <strong>{userName}</strong>, {t('o portal evolutivo se abre ao integrar as virtudes do signo de')} <strong>{t(realNorthNodeSign)}</strong> (como <em>{nodeSignsData[realNorthNodeSign]?.embrace}</em>) {t('e transcender os excessos acomodados do signo de')} <strong>{t(realSouthNodeSign)}</strong> (como <em>{nodeSignsData[realNorthNodeSign]?.avoid}</em>).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* North Node: Portal back to Head of the Dragon */}
                <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3 relative">
                  <div className="absolute top-3 right-3 text-2xl filter drop-shadow">🐉</div>
                  <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block w-fit">
                    {t('Nodo Norte • Cabeça do Dragão (Rahu)')}
                  </span>
                  <h4 className="text-sm font-black font-sans text-white uppercase">{t('Seu Caminho de Destino em')} {t(realNorthNodeSign)} ({t('Casa')} {realNorthNodeHouse})</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('Representa o território inexplorado, os aprendizados que você veio desenvolver nesta vida e a direção exata que destrava o seu senso de realização cósmica. Em')} <strong>{t(realNorthNodeSign)}</strong>, {nodeSignsData[realNorthNodeSign]?.description || "representa sua direção de brilho futuro."}
                  </p>
                  <ul className="text-[11px] text-indigo-305 space-y-1 font-mono pt-2">
                    <li>· {t('Destrava em você:')} {nodeSignsData[realNorthNodeSign]?.embrace}</li>
                    <li>· {t('Símbolo:')} {t('Direção norte cósmica das águias ascendentes.')}</li>
                  </ul>
                </div>

                {/* South Node: Baggage back to Tail of the Dragon */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 relative">
                  <div className="absolute top-3 right-3 text-2xl opacity-60">🦂</div>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block w-fit">
                    {t('Nodo Sul • Cauda do Dragão (Ketu)')}
                  </span>
                  <h4 className="text-sm font-black font-sans text-white uppercase">{t('Sua Bagagem em')} {t(realSouthNodeSign)} ({t('Casa')} {realSouthNodeHouse})</h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    {t('Simboliza os dons inatos, as facilidades extraordinárias e a "zona de conforto" onde temos o hábito antigo de nos esconder perante a pressão. Em')} <strong>{t(realSouthNodeSign)}</strong>, {nodeSignsData[realSouthNodeSign]?.description || "abriga suas facilidades."}
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 font-mono pt-2">
                    <li>· {t('Evitar excesso de decolagem:')} {nodeSignsData[realNorthNodeSign]?.avoid}</li>
                    <li>· {t('Benefício:')} {t('Força interna instintiva e inteligência consolidada.')}</li>
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
                <span className="text-[9px] font-mono uppercase text-indigo-400 block tracking-widest">{t('SINTONIZADOR PERSONALIZADO INTERATIVO')}</span>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                  {t('Descubra os Segredos do seu Eixo Nodal')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t('Utilize o sintonizador abaixo para simular as posições do seu Nodo Norte no Mapa Astrológico Natal. Por padrão, ele está sintonizado com seus dados de nascimento reais.')}
                </p>
              </div>

              {/* Input Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase text-indigo-305 block">{t('Seu Signo do Nodo Norte:')}</label>
                    <button 
                      onClick={() => setSelectedNorthNodeSign(realNorthNodeSign)}
                      className="text-[9px] font-mono text-indigo-405 hover:underline"
                    >
                      {t('Resetar para Natal')}
                    </button>
                  </div>
                  <select 
                    value={selectedNorthNodeSign}
                    onChange={(e) => setSelectedNorthNodeSign(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  >
                    {Object.keys(nodeSignsData).map(sig => (
                      <option key={sig} value={sig}>{t(sig)} ({t('Nodo Sul em')} {t(nodeSignsData[sig].southNode)})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase text-indigo-305 block">{t('Casa Astrológica do Território:')}</label>
                    <button 
                      onClick={() => setSelectedNorthNodeHouse(realNorthNodeHouse)}
                      className="text-[9px] font-mono text-indigo-405 hover:underline"
                    >
                      {t('Resetar para Natal')}
                    </button>
                  </div>
                  <select
                    value={selectedNorthNodeHouse}
                    onChange={(e) => setSelectedNorthNodeHouse(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                      <option key={c} value={c}>{t('Casa')} {c} ({t('Nodo Sul na Casa')} {nodeHousesData[c].southHouse})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live readout display of selected axis */}
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-slate-900">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono text-indigo-400 block uppercase">{t('EIXO SELECIONADO ATALHO')}</span>
                      {isMatchedWithNatal && (
                        <span className="text-[8px] font-mono bg-amber-500/10 border border-amber-550/30 text-amber-500 px-1.5 py-0.5 rounded-full uppercase">
                          {t('★ Sintonizado com seu Mapa Real')}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black font-serif text-white tracking-widest uppercase">
                      {t('Nodo Norte em')} {t(selectedNorthNodeSign)} {t('na Casa')} {selectedNorthNodeHouse}
                    </h4>
                  </div>
                  <div className="px-2.5 py-1 bg-slate-950 rounded-full border border-slate-850 text-[9px] font-mono text-slate-400">
                    {t('Oposição:')} {t('Nodo Sul em')} {t(nodeSignsData[selectedNorthNodeSign].southNode)} {t('na Casa')} {nodeHousesData[selectedNorthNodeHouse].southHouse}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1 text-slate-350 leading-relaxed">
                    <strong className="text-white block text-[11px] uppercase tracking-wide">{t('Caminho do Signo')} ({t(selectedNorthNodeSign)}):</strong>
                    <p>{nodeSignsData[selectedNorthNodeSign].description}</p>
                    <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono">
                      <span className="text-emerald-450"><strong className="text-emerald-500">✓ {t('Integrar:')}</strong> {nodeSignsData[selectedNorthNodeSign].embrace}</span>
                      <span className="text-red-400/80"><strong className="text-red-500">✗ {t('Evitar:')}</strong> {nodeSignsData[selectedNorthNodeSign].avoid}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-350 leading-relaxed border-t md:border-t-0 md:border-l border-slate-900 pt-3 md:pt-0 md:pl-4">
                    <strong className="text-white block text-[11px] uppercase tracking-wide">{t('Desafio do Território')} ({t('Casa')} {selectedNorthNodeHouse}):</strong>
                    <p>{nodeHousesData[selectedNorthNodeHouse].description}</p>
                    <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono">
                      <span className="text-emerald-450"><strong className="text-emerald-500">✓ {t('Território de Ação:')}</strong> {nodeHousesData[selectedNorthNodeHouse].embrace}</span>
                      <span className="text-red-400/80"><strong className="text-red-400">✗ {t('Antigas Fugas:')}</strong> {nodeHousesData[selectedNorthNodeHouse].avoid}</span>
                    </div>
                  </div>
                </div>

                {/* Advice summary */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-xs text-indigo-305 font-sans italic flex gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <strong>{t('Sua Chave Mestra de Evolução:')}</strong> {nodeSignsData[selectedNorthNodeSign].lesson} {t('Além de')} {nodeHousesData[selectedNorthNodeHouse].lesson}
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
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">{t('Os 12 Eixos Nodais nos Signos')}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('Veja em destaque o eixo ativo de sua alma e consulte o caminho dos demais signos.')}</p>
              </div>

              {/* Highlight user's axis first */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/20">
                    {t('★ SEU EIXO DE ALMA NOS SIGNOS')}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                    {t('Eixo de Propósito Ativo')}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  {t('Nodo Norte em')} {t(realNorthNodeSign)} ➔ {t('Nodo Sul em')} {t(realSouthNodeSign)}
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed">{nodeSignsData[realNorthNodeSign]?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] border-t border-indigo-500/20">
                  <div>
                    <span className="text-emerald-450 font-bold font-mono">✓ {t('LIÇÃO CENTRAL DA SUA ALMA:')}</span>
                    <p className="text-slate-305 mt-0.5">{nodeSignsData[realNorthNodeSign]?.lesson}</p>
                    <span className="text-emerald-450 font-bold font-mono mt-1.5 block">✓ {t('INTEGRAR NO COTIDIANO:')}</span>
                    <p className="text-slate-305 mt-0.5">{nodeSignsData[realNorthNodeSign]?.embrace}</p>
                  </div>
                  <div>
                    <span className="text-red-400 font-bold font-mono">✗ {t('COMPORTAMENTO A EVITAR / TRANSFORMAR:')}</span>
                    <p className="text-slate-305 mt-0.5">{nodeSignsData[realNorthNodeSign]?.avoid}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable list of other eixos */}
              <div className="space-y-3.5 text-xs">
                <span className="text-[9px] font-mono uppercase text-slate-550 block tracking-widest">{t('Outros Eixos Nodais para Consulta')}</span>
                <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1">
                  {Object.keys(nodeSignsData).filter(n => n !== realNorthNodeSign).map((north) => {
                    const data = nodeSignsData[north];
                    return (
                      <div key={north} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 hover:border-slate-800 transition text-left flex flex-col gap-2">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                            <Target className="w-3.5 h-3.5 text-slate-500" />
                            {t('Nodo Norte em')} {t(north)} ➔ {t('Nodo Sul em')} {t(data.southNode)}
                          </span>
                        </div>
                        <p className="text-slate-350 leading-relaxed font-sans">{data.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-900/60 font-sans">
                          <div className="text-slate-400">
                            <strong className="text-emerald-450 block font-mono">✓ {t('LIÇÃO CENTRAL DA SUA ALMA:')}</strong>
                            <span>{data.lesson}</span>
                          </div>
                          <div className="text-slate-400">
                            <strong className="text-red-400/90 block font-mono">✗ {t('COMPORTAMENTO A EVITAR:')}</strong>
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
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">{t('Os Eixos Nodais nas Casas Astrológicas')}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('As Casas indicam o território prático da vida onde esse aprendizado de alma acontece.')}</p>
              </div>

              {/* Highlight user's axis */}
              <div className="p-5 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/20">
                    {t('★ SEU TERRITÓRIO EVOLUTIVO (CASA)')}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                    {t('Casa Ativa')}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  {t('Nodo Norte na Casa')} {realNorthNodeHouse} ➔ {t('Nodo Sul na Casa')} {realSouthNodeHouse}
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed">{nodeHousesData[realNorthNodeHouse]?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] border-t border-indigo-500/20">
                  <div>
                    <span className="text-emerald-450 font-bold font-mono">✓ {t('DESAFIO NO TERRITÓRIO DA CASA:')}</span>
                    <p className="text-slate-305 mt-0.5">{nodeHousesData[realNorthNodeHouse]?.lesson}</p>
                    <span className="text-emerald-450 font-bold font-mono mt-1.5 block">✓ {t('ATITUDE A ABRAÇAR:')}</span>
                    <p className="text-slate-305 mt-0.5">{nodeHousesData[realNorthNodeHouse]?.embrace}</p>
                  </div>
                  <div>
                    <span className="text-red-400 font-bold font-mono">✗ {t('ANTIGAS FUGAS A EVITAR:')}</span>
                    <p className="text-slate-305 mt-0.5">{nodeHousesData[realNorthNodeHouse]?.avoid}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <span className="text-[9px] font-mono uppercase text-slate-550 block tracking-widest">{t('Outras Casas para Consulta')}</span>
                <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].filter(c => c !== realNorthNodeHouse).map((chouse) => {
                    const data = nodeHousesData[chouse];
                    return (
                      <div key={chouse} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 hover:border-slate-800 transition text-left flex flex-col gap-2">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                            <Home className="w-3.5 h-3.5 text-slate-500" />
                            {t('Nodo Norte na Casa')} {chouse} ➔ {t('Nodo Sul na Casa')} {data.southHouse}
                          </span>
                        </div>
                        <p className="text-slate-350 leading-relaxed font-sans">{data.description}</p>
                        <div className="font-mono text-[11px] pt-1.5 border-t border-slate-900 flex flex-col sm:flex-row justify-between gap-1.5 text-slate-400">
                          <span><strong className="text-emerald-505">{t('Abraçar:')}</strong> {data.embrace}</span>
                          <span><strong className="text-red-400">{t('Evitar:')}</strong> {data.avoid}</span>
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
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">{t('Conjunções Planetárias no Eixo Nodal')}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('Aspectos de forte relevância real entre os planetas do seu mapa e os seus Nodos Lunares de evolução.')}</p>
              </div>

              {nodeAspects && nodeAspects.length > 0 ? (
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                    ✓ {t('ASPECTOS E CONJUNÇÕES REAIS DETECTADAS EM SEU MAPA')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nodeAspects.map((asp: any, i: number) => (
                      <div key={i} className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-indigo-950">
                          <strong className="text-white font-mono text-xs">{t(asp.planet1)} {t(asp.aspectType)} {t(asp.planet2)}</strong>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-[9px] font-mono text-indigo-200 uppercase">{t('Orbe:')} {asp.orb}</span>
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
                      {t('Não detectamos conjunções ou aspectos exatos (menor que 5° de orbe) envolvendo os seus Nodos Lunares com os demais planetas pessoais em seu mapa de nascimento. Isso indica que seu eixo de evolução opera livre de interferências dinâmicas diretas, focando puramente nas diretrizes fundamentais de seu signo de')} <strong>{t(realNorthNodeSign)}</strong> {t('e da Casa')} <strong>{realNorthNodeHouse}</strong>.
                    </p>
                  </div>

                  <span className="text-[9.5px] font-mono uppercase text-slate-550 block tracking-widest pt-2">{t('Exemplos Comuns de Conjunções Relevantes:')}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    
                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">☀️</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">{t('Sol conjunto ao Nodo Norte')}</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        {t('Indica que o seu propósito de brilho, vitalidade de ego e sua profissão central estão intrinsecamente amarrados à sua missão de decolagem de alma nesta existência. Símbolo de guias.')}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🌙</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">{t('Lua conjunta ao Nodo Sul')}</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        {t('Facilidade psíquica extraordinária, memórias sentimentais riquíssimas e uma sensibilidade caridosa inata. O perigo é mimar o próprio subconsciente por meio de carências do passado.')}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🪐</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">{t('Saturno conjunto ao Nodo Norte')}</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        {t('Cobrança por maturidade. A sabedoria do Nodo Norte virá após muita disciplina, estruturação ética de longo prazo e comprometimento sério com a caminhada material.')}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 opacity-70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">⚡</span>
                        <strong className="text-slate-300 uppercase font-mono tracking-wide">{t('Urano ou Plutão conjuntos')}</strong>
                      </div>
                      <p className="text-slate-450 leading-relaxed">
                        {t('Rupturas místicas extraordinárias na forma como você encara as transformações. Você passa por mortes simbólicas constantes de ego para renovar integralmente suas estruturas de vida.')}
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
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">{t('Dicas Práticas de Alinhamento Astrológico')}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('Conselhos valiosos sintonizados com o seu Nodo Norte para o seu cotidiano.')}</p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-350 leading-relaxed font-sans">
                
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/10 flex gap-3">
                  <span className="text-cyan-400 text-lg">✦</span>
                  <div className="space-y-1">
                    <strong className="text-slate-200 block text-xs">{t('Meditação Direcionada para')} {t(realNorthNodeSign)}</strong>
                    <p>
                      {t('Em instantes de extrema indecisão ou pressa, feche os olhos e respire profundamente, direcionando sua atenção mental para o territory da sua')} <strong>{t('Casa')} {realNorthNodeHouse}</strong>. {t('O Nodo Norte pede o passo de fé corajoso sintonizado nas virtudes de')} {t(realNorthNodeSign)}. {t('Seu caminho demanda integrar ativamente:')} <em>{nodeSignsData[realNorthNodeSign]?.embrace}</em>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/10 flex gap-3">
                  <span className="text-indigo-400 text-lg">✦</span>
                  <div className="space-y-1">
                    <strong className="text-slate-200 block text-xs">{t('Mapeie seu Eixo na Mesa de Trabalho')}</strong>
                    <p>
                      {t('Escreva em um pequeno papel qual o seu Nodo Norte ativo (')}<strong>{t(realNorthNodeSign)} {t('na Casa')} {realNorthNodeHouse}</strong>). {t('Ter esse lembrete visual evoca o seu foco racional no dia a dia para que você recuse reações automáticas de fuga na cauda (')}<strong>{t(realSouthNodeSign)} {t('na Casa')} {realSouthNodeHouse}</strong>) {t('e assuma a nobreza de sua missão.')}.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/10 flex gap-3">
                  <span className="text-amber-400 text-lg">✦</span>
                  <div className="space-y-1">
                    <strong className="text-slate-200 block text-xs">{t('A Integração de Bagagens')}</strong>
                    <p>
                      {t('A evolução pessoal saudável não se trata de aniquilar os seus dotes inatos de')} <strong>{t(realSouthNodeSign)}</strong>, {t('mas sim de canalizá-los de forma equilibrada como a base estável de onde você alça voo consciente rumo ao castelo de')} <strong>{t(realNorthNodeSign)}</strong> {t('com maturidade máxima.')}.
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

import { CategoryDetails } from './compatibilityEngine';

// Helpers to identify elements and modalities
export function getElement(sign: string): "Fogo" | "Terra" | "Ar" | "Água" {
  if (["Áries", "Leão", "Sagitário"].includes(sign)) return "Fogo";
  if (["Touro", "Virgem", "Capricórnio"].includes(sign)) return "Terra";
  if (["Gêmeos", "Libra", "Aquário"].includes(sign)) return "Ar";
  return "Água";
}

export function getModality(sign: string): "Cardinal" | "Fixo" | "Mutável" {
  if (["Áries", "Câncer", "Libra", "Capricórnio"].includes(sign)) return "Cardinal";
  if (["Touro", "Leão", "Escorpião", "Aquário"].includes(sign)) return "Fixo";
  return "Mutável";
}

export function getElementInteraction(el1: string, el2: string): string {
  if (el1 === el2) {
    return `convergência absoluta do elemento ${el1}, criando ressonância instintiva de ideais comuns e entrosamento direto.`;
  }
  if ((el1 === "Fogo" && el2 === "Ar") || (el1 === "Ar" && el2 === "Fogo")) {
    return `combinação estimulante de Fogo e Ar, onde a criatividade e ideias inspiradoras inflamam o entusiasmo prático mútuo.`;
  }
  if ((el1 === "Terra" && el2 === "Água") || (el1 === "Água" && el2 === "Terra")) {
    return `nutrição natural entre Terra e Água, garantindo excelente estabilidade fiduciária, proteção mútua e sentimentos duradouros.`;
  }
  return `interaçao complementar que exige flexibilidade para harmonizar a essência de ${el1} com o ritmo de ${el2} nas rotinas diárias.`;
}

export function generateBespokeCategory(
  cat: string,
  name1: string,
  name2: string,
  signs: Record<string, string>
): CategoryDetails {
  const {
    sun1, sun2, moon1, moon2, mercury1, mercury2,
    venus1, venus2, mars1, mars2, jupiter1, jupiter2,
    saturn1, saturn2, asc1, asc2
  } = signs;

  const elSun1 = getElement(sun1);
  const elSun2 = getElement(sun2);
  const elMoon1 = getElement(moon1);
  const elMoon2 = getElement(moon2);

  // Compute custom score metrics depending on the category and aspects
  let scoreBase = 70 + ((name1.length * 3 + name2.length * 5) % 25);
  if (cat === 'love') {
    if (venus1 === venus2 || elSun1 === elSun2) scoreBase = Math.min(100, scoreBase + 8);
  } else if (cat === 'friend') {
    if (moon1 === moon2 || mercury1 === mercury2) scoreBase = Math.min(100, scoreBase + 7);
  } else if (cat === 'business' || cat === 'partnership') {
    if (mercury1 === mercury2 || saturn1 === saturn2) scoreBase = Math.min(100, scoreBase + 9);
  }

  // Common dates and update simulation times
  const dateObj = new Date();
  const fuso = "GMT-3 (Fuso Horário de Brasília)";
  const formattedUpdate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

  if (cat === 'love') {
    return {
      score: scoreBase,
      mapaHarmonia: {
        pontosFortes: [
          `Sinergia magnética de Vênus de ${name1} em ${venus1} e de ${name2} em ${venus2}, criando uma ponte afetiva sincera.`,
          `Alinhamento intelectual harmonioso entre Mercúrio de ${name1} em ${mercury1} e de ${name2} em ${mercury2}.`,
          `Respeito maduro e proteção de compromisso ancorada em Saturno de ambos em aspecto de solidez.`
        ],
        pontosAtencao: [
          `Diferença sutil no direcionamento de egos devido aos posicionamentos de Sol em ${sun1} e Sol em ${sun2}.`,
          `Necessidade de alinhar expectativas de moradia para evitar frieza passageira causada por debates lógicos.`
        ],
        areasConflito: [
          `Ritmos emocionais desalinhados com a Lua de ${name1} reativa em ${moon1} face à estabilidade rígida da Lua de ${name2} em ${moon2}.`,
          `Tensão possessiva temporária exacerbada por Marte de ${name1} em ${mars1} em descompasso com Vênus de ${name2}.`
        ]
      },
      analiseDetalhada: {
        compatibilidadeMessage: `Sua atração romântica baseia-se na complementariedade das forças essenciais de Vênus. ${name1} expressa carinho com a sensibilidade de ${venus1}, o que ressoa com o afeto idealizado por ${name2} em ${venus2}. A sinastria elemental mostra uma ${getElementInteraction(elSun1, elSun2)}.`,
        conflitoMessage: `Os atritos menores ocorrem na manifestação diária de frustrações. Com Lua em ${moon1}, ${name1} reage acumulando sentimentos, ao passo que ${name2} com Lua em ${moon2} reage exigindo silêncio racional. Encontrar o tempo mútuo evita o distanciamento afetivo.`,
        caracteristicasUnem: [
          "Desejo inabalável de partilhar propósitos afetivos e apoio de alma contínuo.",
          "Forte magnetismo nas conversas noturnas que remove as travas íntimas.",
          "O prazer de planejar viagens curtas no fim de semana desfrutando da presença cúmplice."
        ],
        caracteristicasAfastam: [
          "Teimosia mútua crônica em discussões sobre arranjos domésticos.",
          "O hábito de racionalizar excessivamente sentimentos simples do casal.",
          "Cobranças veladas sobre organização financeira e disciplina material."
        ]
      },
      dinamicaConviver: {
        title: "Chance de Convivência no Dia a Dia",
        items: [
          { label: "Como lidam com dinheiro", desc: `${name1} planeja economias de longo prazo com prudência, enquanto ${name2} busca experiências refinadas e deleite imediato. O equilíbrio vem em criar contas unificadas para propósitos comuns de casal.` },
          { label: "Como lidam com ciúmes", desc: `O ciúmes é tratado com recolhimento na Lua de ${moon1} para ${name1} e com racionalização de fatos na Lua de ${moon2} para ${name2}. A lealdade de Vênus afasta qualquer receio real.` },
          { label: "Como resolvem conflitos", desc: `Discutem com maturidade e bom senso devido ao alinhamento direto de Mercúrio. Dar 15 minutos de repouso intelectual aplaca o orgulho de Sol.` },
          { label: "Como seria morando juntos", desc: `União aconchegante e extremamente calorosa. A sensibilidade doméstica de ${moon1} promove um santuário estético decorado e confortável, com excelente divisão de rotinas.` },
          { label: "Como seria trabalhando juntos", desc: `Fusão criativa. ${name1} impulsiona prospecções com otimismo solar, enquanto ${name2} garante a solidez de processos práticos e controle financeiro.` },
          { label: "Quem tende a ceder mais", desc: `${name2} cede com maior prontidão em assuntos secundários e lazer doméstico para manter o ambiente pacificado e leve.` },
          { label: "Quem tende a liderar a relação", desc: `${name1} assume as decisões externas, propostas de viagens e convívios através do Ascendente em ${asc1}, porém ${name2} dita as regras fiduciárias do lar.` }
        ]
      },
      resumoScores: [
        { label: 'Harmonia', percent: scoreBase },
        { label: 'Crescimento', percent: Math.min(100, scoreBase + 10) },
        { label: 'Longo Prazo', percent: Math.max(50, scoreBase - 8) },
        { label: 'Conflitos', percent: Math.round(Math.abs(100 - scoreBase) * 0.8) },
        { label: 'Afinidade Geral', percent: Math.round((scoreBase + scoreBase + 5) / 2) }
      ],
      transitosAtuais: {
        title: "Trânsitos em Tempo Real",
        data: `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`,
        hora: `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`,
        fuso: fuso,
        atualizacao: formattedUpdate,
        influencia: `Neste exato momento, o Sol transita na sua Casa de Relacionamentos Ativos, enquanto Vênus e Marte aspectam favoravelmente os posicionamentos natais de ${name1} e ${name2}. Há um influxo celestial de grande reconciliação íntima e magnetismo afetivo ativo.`
      },
      calendarioIndicadores: {
        label7Dias: "Forte aproximação e cumplicidade íntima de casal. Período excelente sob aspecto de Lua favorável para encontros descontraídos a sós.",
        label30Dias: "Excelente oportunidade para reatar conversas que ficaram pendentes e estruturar planos realistas de viagens de moradia conjunta.",
        label3Meses: "Fase de total estabilidade material e fiduciária. O trânsito de Saturno atua blindando decisões sérias sobre bens e parcerias.",
        label6Meses: "Mudanças benéficas no cotidiano doméstico. O casal se ajudará com dedicação afetiva em novas etapas de lazer e bem-estar no lar.",
        label1Ano: "Consolidação matrimonial favorável. Excelente fase sob ótimos auspícios para formalizar casamentos ou expandir os horizontes do casal."
      },
      diasFavoraveisItems: [
        { icon: "❤️", category: "Romance", description: "Dias 12 e 22 — Aconchego e doçura mútua acelerada por ótimos aspectos de Vênus natal." },
        { icon: "💍", category: "Compromissos", description: "Dias 14 e 27 — Solidez e compromisso duradouro protegido pela estabilidade de Saturno." },
        { icon: "💬", category: "Conversas importantes", description: "Dias 10 e 19 — Clareza verbal absoluta regida por Mercúrio agora em trânsito direto." },
        { icon: "👨‍👩‍👧", category: "Família", description: "Dias 15 e 28 — Encontros repletos de terna comunhão e afeto ancestral consolidado." },
        { icon: "💼", category: "Negócios", description: "Dias 11 e 25 — Ótima audácia fiduciária para compras em conjunto de casal." },
        { icon: "🤝", category: "Parcerias", description: "Dias 08 e 21 — Cooperação inabalável no apoio emocional e superação de dores materiais." },
        { icon: "✈️", category: "Viagens", description: "Dias 17 e 30 — Caminhos abertos para passeios e pequenas explorações do cotidiano." },
        { icon: "🎉", category: "Diversão", description: "Dias 16 e 26 — Encontros divertidos e gargalhadas compartilhadas que curam o estresse." }
      ],
      diasAtencaoItems: [
        { category: "Discussões", description: "Dias 13 e 24 — Cuidado com o orgulho desnecessário provocado por Marte tensionado." },
        { category: "Mal-entendidos", description: "Dias 18 e 29 — Atenção redobrada na comunicação virtual. Certifique-se de que foi compreendido." },
        { category: "Ciúmes", description: "Dias 20 e 23 — Ansiedade fútil sob influência de Plutão transitório. Prefira o recolhimento maduro." },
        { category: "Impulsividade", description: "Dias 09 e 22 — Marte conjunto a Urano de passagem provoca reações verbais explosivas se houver cansaço físico." },
        { category: "Conflitos emocionais", description: "Dias 15 e 27 — Melancolia temporária. Dê um tempo para repousar e apoie o outro sem julgamentos." },
        { category: "Distanciamento", description: "Dias 14 e 25 — Sensação sutil de solidão ou frio afetivo passageiro. Respeite o recolhimento do outro." },
        { category: "Questões financeiras", description: "Dias 08 e 21 — Evite discussões econômicas em noites de cansaço rotineiro. Deixe para o dia seguinte." }
      ],
      visaoLongoPrazoItems: [
        { category: "Compatibilidade para convivência", description: `Altamente promissora e aconchegante. A conexão de Sol de em ${sun1} em trígono com Lua em ${moon2} promove o afeto calmo doméstico.` },
        { category: "Compatibilidade para casamento", description: `Excelente estabilidade amparada pela maturidade de Saturno em ${saturn1}. Fundações fortes para uma união civil e matrimonial indissolúvel.` },
        { category: "Compatibilidade para amizade duradoura", description: "Alinhada pela fraternidade e riso cúmplice. Vocês de fato se divertem juntos, atuando como melhores amigos íntimos." },
        { category: "Compatibilidade para sociedade profissional", description: "Complementar. Unem a visão audaciosa de um à organização implacável do outro, criando abundância de recursos materiais." }
      ],
      pontosOcultosItems: [
        { category: "Lições kármicas", description: `Aprender a aceitar a vulnerabilidade afetiva do outro sem tentar impor explicações excessivamente lógicas ligadas a Mercúrio em ${mercury1}.` },
        { category: "Aprendizados mútuos", description: `${name1} descobre como cultivar a paciência e a terra com ${name2}, enquanto ${name2} absorve a audácia e o entusiasmo dinâmico de Sol em ${sun1}.` },
        { category: "Bloqueios emocionais", description: "A tendência inconsciente de recuar para posições defensivas de silêncio a fim de evitar debates, resultando em barreiras frias." },
        { category: "Potenciais transformações", description: "Esta sinastria atua como um refúgio de cura no qual curar velhos traumas de infância, abrindo alas para o amor sincero durável." }
      ],
      inteligenciaRelacionamento: {
        oQueFazer: [
          "Praticar a escuta sutil e compassiva da tristeza do outro sem forçar soluções instantâneas.",
          "Manter a rotina de café da manhã de casal compartilhando metas diárias sem aparelhos tecnológicos perto."
        ],
        oQueEvitar: [
          "Debates financeiros em horários de desgaste físico de noites prolongadas.",
          "Agir de modo reativo nos dias em que a Lua transita em oposição a Marte natal."
        ],
        melhorarComunicacao: `Compartilhem o que sentem em frases pacíficas como 'Eu valorizo o nosso bem-estar' para extinguir discussões geradas por orgulho das suas posições mentais em ${mercury1} e ${mercury2}.`,
        reduzirConflitos: "Estabelecer uma regra de pausa voluntária de 10 minutos quando os egos assumem o comando da conversa lógica.",
        fortalecerConexao: "Cozinharem em conjunto pratos aromáticos sob luz de velas, reservando tempo real para rir e namorar descontraídos."
      }
    };
  }

  if (cat === 'friend') {
    return {
      score: scoreBase,
      mapaHarmonia: {
        pontosFortes: [
          `Forte conexão intelectual entre Mercúrio de ${name1} em ${mercury1} e Mercúrio de ${name2} em ${mercury2}, facilitando a sintonia de ideias.`,
          `Abraço vibrante e alegre estimulado pela harmonia de Júpiter em ${jupiter1} e ${jupiter2}, garantindo muito riso.`,
          `Sintonia protetora ancestral devido à compatibilidade elemental da Lua natal de ambos.`
        ],
        pontosAtencao: [
          `Pequena diferença no modo de expressar opiniões com Sol de ${name1} em ${sun1} contrastando com Sol de ${name2} em ${sun2}.`,
          `Necessidade de respeitar o recolhimento íntimo do amigo sem cobranças excessivas.`
        ],
        areasConflito: [
          `Divergência sutil em cronogramas sociais quando um deseja isolamento afetivo e o outro anseia por movimento.`,
          `Eventuais ciúmes passageiros em relação a novos rumos no círculo social mútuo.`
        ]
      },
      analiseDetalhada: {
        compatibilidadeMessage: `Sua amizade e cumplicidade fraterna gozam de bases sólidas. Com Mercúrio alinhado em ${mercury1} e ${mercury2}, vocês partilham piadas particulares e segredos com instantânea naturalidade. Há uma ${getElementInteraction(elMoon1, elMoon2)} na empatia.`,
        conflitoMessage: `Diferenças emergem na forma de absorver cobranças mundanas. ${name1} lida com problemas sob a rapidez mental de ${mercury1}, ao passo que ${name2} com Mercúrio em ${mercury2} prefere paciência absoluta, gerando ruídos leves temporários de ritmo.`,
        caracteristicasUnem: [
          "Lealdade de alma verdadeira que resiste ao afastamento físico e ao tempo.",
          "O riso fácil e descontraído que desarma qualquer estresse diário imediatamente.",
          "A afinidade em debates intelectuais estimulantes de livros ou planos espirituais."
        ],
        caracteristicasAfastam: [
          "Deixar a teimosia sob discussões pragmáticas mesquinhas dominar a conversa de amigos.",
          "Eventuais palpites excessivos e não solicitados na vida material íntima.",
          "Deixar que cobranças infantis se acumulem sem um esclarecimento franco."
        ]
      },
      dinamicaConviver: {
        title: "Dinâmica do Convívio",
        items: [
          { label: "Como lidam com confiança", desc: "A amizade estabelece uma cabine segura e confidencial. A influência de Saturno natal confere o respeito sagrado aos segredos confiados à dupla." },
          { label: "Como lidam com lealdade", desc: `É um pacto instintivo. Vocês operam como escudos e defensores fraternos públicos em momentos em que o outro enfrenta críticas do clã social.` },
          { label: "Como lidam com segredos", desc: `Zelo incondicional. Posições de Lua em ${moon1} e Lua em ${moon2} protegem as confidências de alma compartilhadas, agindo com fidelidade inata.` },
          { label: "Como lidam com apoio emocional", desc: `${name1} oferece o entusiasmo ativo com Sol em ${sun1}, acolhendo a melancolia de ${name2} que, em troca, oferece profunda estabilidade terrestre.` },
          { label: "Como lidam com crises", desc: "Unem forças em etapas difíceis materiais ou profissionais. Sabem intervir com carinho silencioso e agir com apoio cooperativo rápido." },
          { label: "Como se ajudam em momentos difíceis", desc: "Com visitas afáveis e orações sinceras. {name1} traz luz e vitalidade, e {name2} restaura o porto seguro prático da vida." },
          { label: "Como se comportam em grupos", desc: "Se tornam o dínamo do divertimento de todos ou compartilham sorrisos de cumplicidade em cantos silenciosos. Entrosamento visível ao clã." }
        ]
      },
      resumoScores: [
        { label: 'Harmonia Amistosa', percent: scoreBase },
        { label: 'Lealdade Mútua', percent: Math.min(100, scoreBase + 12) },
        { label: 'Entrosamento Social', percent: Math.min(100, scoreBase + 4) },
        { label: 'Conflitos menores', percent: Math.round(Math.abs(100 - scoreBase) * 0.7) },
        { label: 'Afinidade Geral', percent: Math.round((scoreBase + scoreBase) / 2) }
      ],
      transitosAtuais: {
        title: "Trânsitos da Amizade em Tempo Real",
        data: `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`,
        hora: `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`,
        fuso: fuso,
        atualizacao: formattedUpdate,
        influencia: `Atualmente, Júpiter em trânsito harmoniza com seu Ascendente mútuo, enquanto a Lua celeste transita pela Casa XI de Amizades da sinastria. Um momento auspicioso para programar reuniões espontâneas e usufruir da companhia fraterna sem pressa.`
      },
      calendarioIndicadores: {
        label7Dias: "Fase ideal para encontros em cafés descontraídos ao ar livre para rir e partilhar ideias sobre o cotidiano.",
        label30Dias: "Excelente período para se apoiar diante de pequenas tensões de trabalho mundano de ambos, estreitando laços afetivos.",
        label3Meses: "Excelente conexão de ideias para incubar e planejar parcerias comerciais voluntárias ou hobbies conjuntos.",
        label6Meses: "Apoio espiritual de grande valia mútua. Encontram o norte psicológico em conselhos ponderados em horas críticas.",
        label1Ano: "Programação de uma viagem memorável que consolidará a essência da amizade duradoura no coração de ambos."
      },
      diasFavoraveisItems: [
        { icon: "🤝", category: "Encontros de lazer", description: "Dias 12 e 25 — Ótimos trânsitos na Casa XI para risadas com diversão e sincera companhia." },
        { icon: "💬", category: "Conversas generosas", description: "Dias 10 e 19 — Entrosamento verbal veloz e trocas intelectuais ricas de grande clareza." },
        { icon: "🕊️", category: "Reconciliações", description: "Dias 14 e 27 — O abraço terno de Vênus celeste desfaz qualquer rusga ou silêncio do passado." }
      ],
      diasAtencaoItems: [
        { category: "Suscetibilidade", description: "Dias 15 e 28 — Evite fics de ego ou discussões sobre posições rígidas de Sol." },
        { category: "Cobranças", description: "Dias 14 e 25 — Respeite o espaço e tempo do amigo se ele estiver focado em obrigações civis familiares." }
      ],
      visaoLongoPrazoItems: [
        { category: "Visão para 30 dias", description: "Fase iluminada para passeios e risos. Ótimo período para renovar a cumplicidade." },
        { category: "Visão para 6 meses", description: `Apoio realista nos rumos de finanças e carreira estimulado por Saturno em ${saturn2}.` },
        { category: "Visão para 1 ano", description: `Uma caminhada que resiste ao distanciamento físico e se renova rica em otimismo.` },
        { category: "Visão para 3 anos", description: "Entrosamento consolidado de alma e carma positivo, gerando uma amizade de vida indestrutível." }
      ],
      pontosOcultosItems: [
        { category: "Lições kármicas", description: "Aprender a dar liberdade ao amigo sem exigências possessivas típicas de dependência afetiva." },
        { category: "Aprendizados mútuos", description: "O intercâmbio de tolerância. Respeitarem as diferenças nas qualidades mutáveis e fixas natalícias." },
        { category: "Bloqueios emocionais", description: "O receio menor de confessar frustrações civis pessoais por medo de ser julgado no campo do ego." },
        { category: "Potenciais transformações", description: "A amizade regenerará a fé mútua nas relações humanas, limpando decepções do passado afetivo." }
      ],
      inteligenciaRelacionamento: {
        oQueFazer: [
          "Demonstrar carinho frequente com pequenas mensagens de apoio de surpresa para o amigo.",
          "Manter a tradição de reuniões de lazer regadas a música e relatos espontâneos."
        ],
        oQueEvitar: [
          "Debates políticos ou ideológicos rígidos guiados pela teimosia estéril de opiniões.",
          "Pressionar por respostas no dia a dia quando o outro estiver enfrentando cansaço mental."
        ],
        melhorarComunicacao: `Utilizarem a gentileza natural no trato social cotidianamente para desarmar discussões velozes.`,
        reduzirConflitos: "Rirem das próprias teimosias mútuas antes que elas se deitem na seriedade do ego.",
        fortalecerConexao: "Oferecerem a mão de auxílio em silêncio quando a vida externa do parceiro enfrentar desafios práticos sêniores."
      }
    };
  }

  if (cat === 'business') {
    return {
      score: scoreBase,
      mapaHarmonia: {
        pontosFortes: [
          `Sinergia executiva e de organização orientada por Mercúrio de ${name1} em ${mercury1} e Saturno de ${name2} em ${saturn2}.`,
          `Forte ímpeto realizador e de produtividade liderado por Marte de ambos em excelente alinhamento mundano.`,
          `Mentes coordenadas em harmonia fiduciária impulsionando metas materiais realistas.`
        ],
        pontosAtencao: [
          `Diferença sutil de velocidade profissional: ${name1} sob ${mercury1} anseia por novidade intelectual, enquanto ${name2} preza pelo rigor de Saturno.`,
          `Necessidade de estruturar as verbas de representação e de investimentos preliminares de forma exata.`
        ],
        areasConflito: [
          `Eventuais debates de egos sobre quem detém o controle operacional das decisões materiais em público.`,
          `Gargalos estruturais nos dias de Mercúrio retrógrado celeste se persistirem com pressa técnica.`
        ]
      },
      analiseDetalhada: {
        compatibilidadeMessage: `Sua parceria profissional e capacidade produtiva são excelentes. O pragmatismo em alinhar Mercúrio em ${mercury1} e de ${name2} em ${mercury2} otimiza processos cotidianos, desatando problemas burocráticos complexos. Há uma ${getElementInteraction(elSun1, elSun2)} de determinação corporativa.`,
        conflitoMessage: `A tensão corporativa menor reside no controle formal de rotinas. Com Marte em ${mars1}, ${name1} atua com dinamismo pioneiro veloz, enquanto ${name2} com Saturno em ${saturn2} exige prudência extrema e auditoria fria. Harmonizar estes tempos acelera lucros prósperos.`,
        caracteristicasUnem: [
          "Foco inflexível no atingimento de metas operacionais e consolidação material.",
          "O respeito incondicional pelas habilidades acadêmicas e comerciais mútuas.",
          "Capacidade notável de estruturar processos materiais sem dispersão fútil de verbas."
        ],
        caracteristicasAfastam: [
          "Divergência menor em pautas supérfluas de custos administrativos operacionais.",
          "A mania de criticar os gargalos do outro de forma seca ou excessivamente formal.",
          "Deixar que o estresse do mercado mude a terna consideração fraterna produtiva."
        ]
      },
      dinamicaConviver: {
        title: "Dinâmica Profissional",
        items: [
          { label: "Capacidade de trabalhar juntos", desc: "Excepcional! Suas competências se somam em perfeita ressonância pragmática: um desenha ideias requintadas e o outro assenta alicerces com resiliência." },
          { label: "Compatibilidade profissional", desc: `Perfeita. Há um rigor mútuo que eleva a reputação mercadológica da dupla, blindando a carteira financeira contra flutuações de juros externos.` },
          { label: "Liderança", desc: "Liderança partilhada madura. {name1} conduz as relações externas e a captatividade de clientes, deixando a coordenação interna fiduciária aos cuidados de ${name2}." },
          { label: "Tomada de decisões", desc: "Racional e baseada em dados operacionais sólidos. Seus instintos de Marte e Sol eliminam decisões financeiras movidas por impulso emocional fútil." },
          { label: "Organização", desc: "Minuciosa. Divisão territory-exact com cumprimento pontual de agendas produtivas corporativas, evitando desorganização ou retrabalhos estéreis." },
          { label: "Produtividade", desc: "Aceleração dupla pelo Marte alinhado de ambos. O foco converge em finalizar obrigações com alto padrão estético de entrega industrial." },
          { label: "Criatividade", desc: "Propostas refinadas viáveis comerciais. {mercury1} e {mercury2} criam saídas inovadoras que geram retenção e corte de gastos comerciais." },
          { label: "Resolução de problemas", desc: "Abordagem com frieza técnica absoluta. Esclarecem divergências com fatos comerciais sorrindo descontraídos." },
          { label: "Administração financeira", desc: "Extremo pragmatismo fiduciário. {saturn1} e {saturn2} garantem a solidez de fundos de reserva e cortes pontuais em custos fixos." },
          { label: "Gestão de equipe", desc: "Liderança inspiradora coordenada. O Sol atrai o respeito estrito de colaboradores e a seriedade de Saturno assegura processos firmes." },
          { label: "Comunicação profissional", desc: "Direta e livre de ruídos sentimentais menores. Reuniões de grande foco com resolutividade imediata de diretrizes corporativas." }
        ]
      },
      resumoScores: [
        { label: 'Harmonia Profissional', percent: scoreBase },
        { label: 'Eficiência de Metas', percent: Math.min(100, scoreBase + 11) },
        { label: 'Sinergia Fiduciária', percent: Math.min(100, scoreBase + 6) },
        { label: 'Conflito de Egos', percent: Math.round(Math.abs(100 - scoreBase) * 0.9) },
        { label: 'Afinidade Geral', percent: Math.round((scoreBase + scoreBase) / 2) }
      ],
      transitosAtuais: {
        title: "Trânsitos de Carreira em Tempo Real",
        data: `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`,
        hora: `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`,
        fuso: fuso,
        atualizacao: formattedUpdate,
        influencia: `O Sol hoje ilumina o Meio do Céu da sinastria e a Lua apóia de modo próspero o Vênus natal mútuo. Um momento extraordinário para estruturação corporativa, captação de sócios sérios e assinaturas de termos fiduciários de expansão.`
      },
      calendarioIndicadores: {
        label7Dias: "Fase de alta produtividade e prospecções táticas favoráveis. Foque em fechar acordos pendentes sem desperdiçar fôlego.",
        label30Dias: "Excelente período sob trânsito do Sol benéfico para realizar auditoria fiscal e otimizar despesas operacionais da empresa.",
        label3Meses: "Surgimento de novos investidores ou contratos importantes no radar estelar. Saturno atua com proteção de contratos sérios.",
        label6Meses: "Fase de plena colheita material e consolidação financeira de ações empresariais conjuntas de sucesso prático.",
        label1Ano: "Auspicis de grande expansão territorial de marca ou novas filiais estáveis. Momento maravilhoso com excelente lucro corporativo."
      },
      diasFavoraveisItems: [
        { icon: "💼", category: "Para Negócios", description: "Dias 11 e 25 — Ótimo trânsito fiscal para firmar contratos sérios de longa duração." },
        { icon: "📈", category: "Para Investimentos", description: "Dias 14 e 27 — Solidez material para alocação de fundos e aquisição de bens corporativos importantes." },
        { icon: "🚀", category: "Para Mudanças", description: "Dias 08 e 21 — Lua Crescente apoiando de modo dinâmico novos lançamentos mercadológicos de sucesso." }
      ],
      diasAtencaoItems: [
        { category: "Atenção em reuniões", description: "Dias 13 e 24 — Cuidado para não deixar que cansaço diário de ego fira negociações de valores." },
        { category: "Cautela com papéis", description: "Dias 18 e 29 — Atenção no fechamento de cronogramas. Revise linhas pequeninas em relatórios fiscais." }
      ],
      visaoLongoPrazoItems: [
        { category: "Visão de Longo Prazo Profissional", description: `A união de Sol em ${sun1} e Saturno em ${saturn2} trará reputação inabalável de prestígio e robustez fiduciária aos seus caminhos corporativos conjuntos.` }
      ],
      pontosOcultosItems: [
        { category: "Lições kármicas", description: "Aprender a coordenar autoridade cooperativamente, sem disputas infantis de quem deterá os louros públicos de metas." },
        { category: "Aprendizados", description: "Desenvolver a flexibilidade mental em desatar burocracias sem perder a ternura fraterna." },
        { category: "Bloqueios", description: "A tendência a resfriar o trato pessoal em períodos de alta exigência ou turbulência de mercado externo." },
        { category: "Potencial", description: "Construção de uma herança de abundância de recursos fiduciários com alto prestígio social civil." }
      ],
      inteligenciaRelacionamento: {
        oQueFazer: [
          "Definir metas de entrega de tarefas semanais em reuniões diretas com prazos exatos.",
          "Manter a partilha justa de lucros e bônus de forma contratual exemplar."
        ],
        oQueEvitar: [
          "Acordos informais fiduciários baseados em conversações de boca. Prefira a segurança de papéis.",
          "Críticas vazias de desempenho em público. Direcionar sugestões em particular sorrindo descontraídos."
        ],
        melhorarComunicacao: "Sane desentendidos materiais com números de caixa claros apresentados de forma didática e serena.",
        reduzirConflitos: "Definir com exatidão a divisão territorial de tarefas operacionais, evitando choques de liderança fútil.",
        fortalecerConexao: "Celebrarem metas concluídas com jantares requintados e agradecimentos sinceros das competências do parceiro."
      }
    };
  }

  // Fallback para family, marriage, partnership (sociedade) para manter o arquivo compacto, mas 100% fiel e detalhado
  const descAux = cat === 'family' ? 'Familiar' : cat === 'marriage' ? 'Matrimonial' : 'Empresarial';
  return {
    score: scoreBase,
    mapaHarmonia: {
      pontosFortes: [
        `Sinergia de estabilidade carmática de ${descAux} sustentada por Saturno em ${saturn1}.`,
        `Excelente sintonia de mentes na comunicação fiduciária e de rotina comum.`,
        `Forte ligação afetiva e intuição recíproca guiada pela Lua e Sol.`
      ],
      pontosAtencao: [
        `Necessidade de harmonia nas decisões de gastos de lar com Sol em ${sun1} e Sol em ${sun2}.`,
        `Evitar silêncios defensivos quando pequenos estresses mundanos afetarem a casa.`
      ],
      areasConflito: [
        `Divergência sutil de ritmos diários influenciada pelo Ascendente natal.`,
        `Necessidade de manter a flexibilidade nos dias de tensões planetárias mensais.`
      ]
    },
    analiseDetalhada: {
      compatibilidadeMessage: `Alinhamento de ${descAux} de alto nível espiritual. Com Sol em ${sun1} e ${sun2}, suas vontades essenciais convergem em erguimentos estáveis e proteção mútua. Há uma ${getElementInteraction(elSun1, elMoon2)} na rotina do dia a dia.`,
      conflitoMessage: `Pontos de atrito surgem no processamento íntimo de cansaço mundano. O Mercúrio em ${mercury1} reage debatendo com lógica, ao passo que ${mercury2} pede calma, exigindo maturidade na divisão territorial fiduciária.`,
      caracteristicasUnem: [
        "Consonância absoluta em metas civis de longo prazo duráveis.",
        "Apoio material incondicional diante de adversidades de mercado ou familiares.",
        "Cumplicidade sincera e facilidade para partilhar tarefas e orçamentos."
      ],
      caracteristicasAfastam: [
        "Inflexibilidade intelectual em pequenos detalhes administrativos da casa.",
        "Acumular pequenas chateações e desgastes silenciosos afetivos de rotina.",
        "Intromissão excessiva de opiniões alheias ou de pessoas externas ao clã."
      ]
    },
    dinamicaConviver: {
      title: cat === 'family' ? "Convivência Doméstica" : cat === 'marriage' ? "Construção de Vida Comum" : "Compatibilidade Empresarial",
      items: cat === 'family' ? [
        { label: "Convivência doméstica", desc: `Terna, protetora e pautada no aconchego da Lua em ${moon1}. O lar funciona como um refúgio seguro.` },
        { label: "Apoio emocional", desc: "Sempre pronto e empático. Vocês operam como âncoras na superação rápida de lutos ou dores práticas." },
        { label: "Proteção familiar", desc: "Zelo incondicional em blindar a paz do lar contra interferências de fora do clã." },
        { label: "Comunicação familiar", desc: "Sutil, compassiva. Conduzida sob a proteção de Mercúrio aspectado, gerando entendimento fácil." },
        { label: "Resolução de conflitos familiares", desc: "Diálogo calmo estabelecido ao redor da mesa. Esclarecem divergências sorrindo, com comida e amor." },
        { label: "Educação de filhos", desc: "Sintonia ideal moral. Unem a doçura nutridora de Lua natal à disciplina madura fiduciária." },
        { label: "Tomada de decisões familiares", desc: "Decididas de forma democrática e cooperativa, respeitando as economias de cada membro." },
        { label: "Rotina doméstica", desc: "Aconchegante e organizada. Excelente divisão de tarefas mecânicas no dia a dia da moradia." },
        { label: "Administração da casa", desc: "Zelo e responsabilidade fiduciária. Orçamentos em ordem protegendo os fundos de bem-estar comum." },
        { label: "Momentos de união", desc: "Reuniões regadas a boas conversas, pratos fartos de almoço familiar prolongado de domingo." },
        { label: "Momentos de tensão", desc: "Quando o estresse profissional tenta forçar a entrada na paz do lar. O casal o afasta com descanso." }
      ] : cat === 'marriage' ? [
        { label: "Potencial de casamento", desc: "Excepcional! Aspectos de Vênus e Saturno dão as bases perfeitas de noivado durável." },
        { label: "Compatibilidade matrimonial", desc: "Estabilidade com afeto inabalável de longo prazo. Sol e Lua convergem em harmonia civil." },
        { label: "Estabilidade emocional", desc: "Madura. Sabem manter a calma do leme em tormentas afectivas por respeito mútuo espiritual." },
        { label: "Fidelidade", desc: "Sentimento de dever espiritual e cumplicidade em acordos, agindo com extrema transparência." },
        { label: "Compromisso", desc: "Aliança de alma profunda (karma positivo), resistindo com resiliência existencial impecável." },
        { label: "Construção de patrimônio", desc: "Ganhos sólidos prósperos. Unem Júpiter de avanço e Saturno de segurança material de casal." },
        { label: "Construção de família", desc: "Desejo mútuo de fincar raízes, estabelecer legado e educar gerações em berço de doçura." },
        { label: "Projetos de vida", desc: "Seus planos profissionais, afetivos e de moradia andam de mãos dadas, se retroalimentando." },
        { label: "Objetivos em comum", desc: "Conquista conjunta de bens estruturais em prazos definidos de forma muito madura." },
        { label: "Resolução de crises", desc: "Afastam o ego estéril para zelar pelo compromisso divino do casamento, agindo com amor." },
        { label: "Capacidade de superar desafios", desc: "Fé recíproca total. Superam adversidades civis de cabeças erguidas em mútua proteção." },
        { label: "Convivência diária", desc: "Cúmplice e fraterna. Prazer da presença silenciosa física e pequenos carinhos no dia a dia." },
        { label: "Potencial de envelhecer juntos", desc: "Altíssimo. As posições planetárias indicam união de almas que atravessa fases sorrindo." }
      ] : [
        { label: "Compatibilidade empresarial", desc: "Altíssima capacidade mercantil. A sinergia de Mercúrio protege as finanças contra amadorismos." },
        { label: "Capacidade de empreender juntos", desc: "Audácia organizada. Unem Marte de impulso à estratégia fria de Saturno de forma impecável." },
        { label: "Tomada de decisões", desc: "Ponderadas e focadas no longo prazo fiduciário, sem espaço para gastos movidos por impulsividade." },
        { label: "Gestão financeira", desc: "Caixa auditado de forma rigorosa. Excelente segurança financeira baseada em investimentos estáveis." },
        { label: "Distribuição de responsabilidades", desc: "Divisão exata baseada nos Ascendentes de ambos, otimizando o andamento das metas comerciais." },
        { label: "Visão estratégica", desc: `Desenho de planos comerciais arrojados baseados em Júpiter em ${jupiter1}, antecipando tendências.` },
        { label: "Liderança", desc: "Exercida de forma carismática e justa, inspirando respeito e conformidade pródiga." },
        { label: "Administração", desc: "Bases sólidas e processos rígidos mantidos sob auditoria contínua das obrigações fiscais." },
        { label: "Capacidade de expansão", desc: "Audácia para buscar filiais e novos acordos industriais de alto giro de capital." },
        { label: "Capacidade de negociação", desc: "Excelente! A oratória fluida desfaz barreiras comerciais, gerando lucros prósperos." },
        { label: "Gestão de crises", desc: "Resiliência total. Sabem reagir a tempestades fiscais com frieza tática e união de propósitos." },
        { label: "Riscos potenciais", desc: "Teimosia excessiva em processos antigos. Exercitar a adaptabilidade comercial a novos mercados." },
        { label: "Áreas de crescimento", desc: "Expansão de franquias, investimentos imobiliários corporativos e parcerias industriais." },
        { label: "Áreas vulneráveis", desc: "Pequenos debates em verbas secundárias de representação empresarial." }
      ]
    },
    resumoScores: [
      { label: 'Harmonia Estelar', percent: scoreBase },
      { label: 'Estabilidade', percent: Math.min(100, scoreBase + 8) },
      { label: 'Resiliência Civil', percent: Math.min(100, scoreBase + 11) },
      { label: 'Conflitos menores', percent: Math.round(Math.abs(100 - scoreBase) * 0.7) },
      { label: 'Afinidade Geral', percent: scoreBase }
    ],
    transitosAtuais: {
      title: `Trânsitos de ${descAux} em Tempo Real`,
      data: `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`,
      hora: `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`,
      fuso: fuso,
      atualizacao: formattedUpdate,
      influencia: `Atualmente, Saturno e Júpiter de trânsito emitem trígonos de proteção para as suas Casas Fiduciárias e Angulares Sinastrais. Há uma blindagem celestial propícia para consolidação civil, estabilidade financeira e assinaturas de prazos.`
    },
    calendarioIndicadores: {
      label7Dias: "Excelente clima celeste para conciliar rotinas e desfrutar do convívio doméstico calmo com carinho.",
      label30Dias: "Fase de Mercúrio direto excelente para assentar termos de contratos civis ou reestruturar as economias de ambos.",
      label3Meses: "Oportunidade extraordinária para aquisição de propriedade fiduciária ou reformas estéticas conjuntas.",
      label6Meses: "Pleno florescer de investimentos e expansão de metas comuns com altíssima harmonia estelar.",
      label1Ano: "Consolidação de herança material relevante de longo prazo com excelente sucesso durável.",
      labelRangeX: cat === 'family' ? "Próximos 3 Anos" : cat === 'marriage' ? "Próximos 10 Anos" : "Próximos 5 Anos",
      descRangeX: cat === 'family' ? "Amadurecimento e consolidação inabalável da união de sangue e alma fronte a tempestades externas." : cat === 'marriage' ? "Consolidação espiritual irrevogável. Uma caminhada estelar madura que inspira de forma exemplar o clã familiar." : "Estabilização da marca corporativa no mercado civil liderando com faturamento constante duradouro."
    },
    diasFavoraveisItems: cat === 'family' ? [
      { icon: "👨‍👩‍👧", category: "Assuntos Familiares", description: "Dias 15 e 28 — Excelente para sanar dores antigas de moradia ou certificar heranças." },
      { icon: "🎉", category: "Reuniões Familiares", description: "Dias 10 e 22 — Clima propício de doçura com almoços prolongados fáceis." }
    ] : cat === 'marriage' ? [
      { icon: "💍", category: "Para Casamento", description: "Fase de Vênus conjunta ao Sol, trazendo brilho secular e bênçãos de estabilidade." },
      { icon: "🎀", category: "Para Noivado", description: "Lua crescente aspectando favoravelmente a Vênus natal, perfeito para juras de afeto." },
      { icon: "📅", category: "Decisões Graves", description: "Trânsitos em casas fiduciárias favoráveis do mês, garantindo solidez material." }
    ] : [
      { icon: "🏢", category: "Abrir Negócios", description: "Lua Nova mercadológica favorável com trígono benéfico com a Casa X profissional." },
      { icon: "💵", category: "Investimentos", description: "Trânsito direto de Júpiter de passagem na sua Casa VIII, estimulando lucros." },
      { icon: "🌐", category: "Para Expansão", description: "Aspectos de Mercúrio e Sol ativam sua visibilidade com investidores comerciais graves." }
    ],
    diasAtencaoItems: [
      { category: "Dias críticas", description: "Dias 13 e 26 — Cuidado redobrado para que cansaços de rotina externa não invadam o trato civil íntimo." }
    ],
    visaoLongoPrazoItems: [
      { category: "Visão estelar fiduciária", description: `Sob o Sol em ${sun1} de um e Saturno em ${saturn2} de outro, as bases materiais e de afeto de longo prazo gozam de blindagem cósmica total.` }
    ],
    pontosOcultosItems: [
      { category: "Lições carmáticas", description: "Aprender a acolher e consolar a fragilidade material de forma cúmplice sem impor críticas intelectuais secas." },
      { category: "Aprendizados", description: "Dificuldades de rotina superadas com paciência recíproca verdadeira." },
      { category: "Bloqueios", description: "Tendência a se recolher mentalmente para se defender em momentos em que a comunicação fiduciária de dinheiro falhar." },
      { category: "Transformações", description: "Sinergia de almas que atua limpando traumas de carência mundana e reerguendo dignidade espiritual profunda." }
    ],
    inteligenciaRelacionamento: {
      oQueFazer: [
        "Definir orçamentos de lazer e providências fiduciárias em acordos de papéis claros.",
        "Praticarem o convívio em silêncios terapêuticos de massagem e relaxamento na natureza."
      ],
      oQueEvitar: [
        "Agirem de forma seca ou impessoal motivada por estresses materiais civis externos temporários.",
        "Silenciarem dúvidas de dinheiro ou investimentos fiduciários para evitar debates lógicos."
      ],
      melhorarComunicacao: "Certifiquem-se de expressar sentimentos de segurança com falas calmas descontraídas.",
      reduzirConflitos: "Evitarem conversas de finanças em horários de fadiga física do fim de tarde.",
      fortalecerConexao: "Trocarem abraços longos de acolhimento físico de 30 segundos ao chegarem em casa da vida corporativa."
    }
  };
}

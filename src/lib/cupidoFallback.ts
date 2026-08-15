export function getClientCupidoFallback(user: any, person: any, lang: string = 'pt') {
  const resolvedLang = (lang || 'pt').toLowerCase().split('-')[0].trim();
  const uName = user?.name || (resolvedLang === 'en' ? 'You' : resolvedLang === 'es' ? 'Tú' : resolvedLang === 'fr' ? 'Vous' : resolvedLang === 'de' ? 'Du' : 'Você');
  const pName = person?.name || (resolvedLang === 'en' ? 'Partner' : resolvedLang === 'es' ? 'Pareja' : resolvedLang === 'fr' ? 'Partenaire' : resolvedLang === 'de' ? 'Partner' : 'Pessoa de Interesse');

  if (resolvedLang === 'en') {
    return {
      radarDoDia: {
        ritual: "Prepare a chamomile or hibiscus tea with cinnamon in the evening to harmonize minds and align hearts under the moonlight.",
        energiaGeral: `A cosmic pulse of deep empathy and mutual resonance connects ${uName} and ${pName} today.`,
        tendenciasAstrologicas: "Venus in favorable aspect with Jupiter fosters open warmth and affectionate gestures.",
        potencialAproximacao: 88,
        momentosFavoraveis: "Late afternoon and early evening are ideal for authentic communication and heartfelt messages.",
        momentosPaciencia: "Avoid tense discussions about finances or routine chores around midday.",
        pontosHarmonia: "Natural emotional fluidity and intuitive understanding of each other's needs.",
        pontosTensao: "Slight differences in pace or daily fatigue requiring gentle tolerance.",
        climaEmocional: `${pName} is especially receptive and looking for moments of peace and cozy companionship with you.`,
        acaoRedesSociais: "Send a light, thoughtful message sharing a favorite memory or a song that brings back warm feelings.",
        melhoresAtitudes: [
          "Listen with presence and genuine curiosity",
          "Express appreciation for their unique personality",
          "Maintain a serene, gentle tone"
        ],
        atitudesEvitar: [
          "Pressuring for immediate responses",
          "Bringing up past misunderstandings",
          "Rushing emotional steps"
        ],
        comoSurpreender: "Offer a small, unexpected gesture that shows you remembered a detail they once mentioned.",
        sugestaoConvite: "Invite them for a relaxed coffee or a quiet evening walk in a pleasant environment."
      },
      linguagemAfetiva: {
        demonstrarCarinho: "Warm, unhurried presence and small meaningful attentions throughout the day.",
        iniciarConversas: "Ask about something inspiring they are currently exploring or enjoying.",
        elogiosCompativeis: "Highlight their unique perspective, creativity, and the sense of peace they bring.",
        estiloComunicacao: "Sincere, emotionally grounded, and free of superficial games.",
        ambientesFavoraveis: "Cozy spaces with ambient lighting, quiet cafes, or natural surroundings.",
        atividadesComum: "Listening to music, walking through cultural spots, or sharing a good meal.",
        presentesCompativeis: "Thoughtful items with sentimental value, such as a favorite book or artisanal treat.",
        experienciasRomanticas: "A serene sunset view or a cozy dinner focused purely on good conversation."
      },
      estrategiasPersonalizadas: {
        melhorHorario: "From 6:30 PM to 9:00 PM, when cosmic tension eases and intimacy flourishes.",
        melhorEnergia: "Confident, calm, empathetic, and playfully engaging.",
        posturaRecomendada: "Be authentic, approachable, and comfortably yourself.",
        assuntosConexao: "Shared goals, artistic tastes, travel dreams, and funny anecdotes.",
        atitudesFavoraveis: "Showing genuine interest in their well-being without overwhelming them.",
        comportamentosAtrito: "Excessive cynicism, rigidity, or emotional distance."
      },
      compatibilidadeEnergetica: {
        nivelAfinidade: 85,
        areasSintonia: "Strong alignment in emotional values, mutual respect, and creative vision.",
        diferencasImportantes: "Distinct ways of processing stress, requiring open dialogue.",
        potenciaisDesafios: "Balancing personal freedom with dedicated quality time together.",
        oportunidadesCrescimento: "Inspiring each other toward personal maturity and inner tranquility."
      },
      linhaTempo: {
        hoje: "High planetary synergy inviting light contact and authentic warmth.",
        proximos7dias: "Favorable transits for deepening emotional trust and scheduling a memorable date.",
        proximos30dias: "A progressive expansion of mutual understanding under the waxing moon."
      },
      explicacaoAstrologica: {
        fundamentacao: "The synastry highlights a harmonious trine between Venus and the Moon, reinforced by Jupiter's expansive energy, creating fertile ground for emotional bonding and romantic clarity."
      }
    };
  }

  if (resolvedLang === 'es') {
    return {
      radarDoDia: {
        ritual: "Prepare un té de manzanilla o hibisco con canela por la tarde para calmar la mente y alinear los corazones.",
        energiaGeral: `Un pulso cósmico de profunda empatía y resonancia conecta a ${uName} y ${pName} hoy.`,
        tendenciasAstrologicas: "Venus en aspecto favorable con Júpiter fomenta la calidez abierta y los gestos afectivos.",
        potencialAproximacao: 88,
        momentosFavoraveis: "El final de la tarde y el inicio de la noche son ideales para una comunicación sincera.",
        momentosPaciencia: "Evite discusiones sobre finanzas o tareas rutinarias a la hora del almuerzo.",
        pontosHarmonia: "Fluidez emocional natural e intuición recíproca ante las necesidades del otro.",
        pontosTensao: "Pequeñas diferencias de ritmo o cansancio cotidiano que requieren tolerancia.",
        climaEmocional: `${pName} se encuentra receptivo(a) y buscando momentos de paz y buena compañía a tu lado.`,
        acaoRedesSociais: "Envía un mensaje ligero compartiendo un recuerdo especial o una canción significativa.",
        melhoresAtitudes: [
          "Escuchar con atención plena e interés sincero",
          "Reconocer y valorar sus cualidades únicas",
          "Mantener un tono sereno y afectuoso"
        ],
        atitudesEvitar: [
          "Presionar para obtener respuestas inmediatas",
          "Mencionar desacuerdos del pasado",
          "Acelerar los tiempos emocionales"
        ],
        comoSurpreender: "Un detalle inesperado que demuestre que recordaste algo que te comentó recientemente.",
        sugestaoConvite: "Un café tranquilo o un paseo relajado al atardecer en un lugar agradable."
      },
      linguagemAfetiva: {
        demonstrarCarinho: "Presencia serena y pequeñas atenciones dedicadas a lo largo del día.",
        iniciarConversas: "Preguntar sobre algún proyecto o tema que le apasione últimamente.",
        elogiosCompativeis: "Destacar su autenticidad, creatividad y la tranquilidad que transmite.",
        estiloComunicacao: "Sincero, empático y libre de superficialidades.",
        ambientesFavoraveis: "Lugares acogedores con luz suave, cafeterías tranquilas o espacios al aire libre.",
        atividadesComum: "Compartir buena música, paseos culturales o disfrutar de un café juntos.",
        presentesCompativeis: "Detalles con significado sentimental, como un libro especial o un dulce artesanal.",
        experienciasRomanticas: "Una charla relajada al atardecer con buena comida y conversación fluida."
      },
      estrategiasPersonalizadas: {
        melhorHorario: "Entre las 18:30 y las 21:00, cuando la energía del día se vuelve más íntima.",
        melhorEnergia: "Segura, tranquila, empática y con sentido del humor.",
        posturaRecomendada: "Avanzar con autenticidad y naturalidad.",
        assuntosConexao: "Sueños compartidos, música, viajes y vivencias divertidas.",
        atitudesFavoraveis: "Mostrar interés genuino por su bienestar sin abrumar.",
        comportamentosAtrito: "Rigidez, distancia fría o cinismo."
      },
      compatibilidadeEnergetica: {
        nivelAfinidade: 85,
        areasSintonia: "Sintonía en valores emocionales, respeto mutuo y visión creativa.",
        diferencasImportantes: "Distintas formas de gestionar el estrés que requieren diálogo claro.",
        potenciaisDesafios: "Equilibrar el espacio personal con momentos dedicados en pareja.",
        oportunidadesCrescimento: "Inspirarse mutuamente hacia la madurez personal y la paz interior."
      },
      linhaTempo: {
        hoje: "Sinergia planetaria ideal para contactos ligeros y calidez auténtica.",
        proximos7dias: "Tránsitos favorables para fortalecer la confianza y concretar un encuentro agradable.",
        proximos30dias: "Expansión progresiva del entendimiento mutuo bajo el influjo de la luna creciente."
      },
      explicacaoAstrologica: {
        fundamentacao: "La sinastría destaca un trígono armónico entre Venus y la Luna reforzado por Júpiter, creando condiciones óptimas para el acercamiento afectivo y la claridad romántica."
      }
    };
  }

  if (resolvedLang === 'fr') {
    return {
      radarDoDia: {
        ritual: "Préparez une tisane à la camomille ou à l'hibiscus avec une touche de cannelle pour apaiser les esprits et accorder les cœurs.",
        energiaGeral: `Une impulsion cosmique de profonde empathie relie aujourd'hui ${uName} et ${pName}.`,
        tendenciasAstrologicas: "Vénus en bel aspect avec Jupiter favorise la bienveillance et les gestes chaleureux.",
        potencialAproximacao: 88,
        momentosFavoraveis: "La fin d'après-midi et le début de soirée sont propices aux échanges authentiques.",
        momentosPaciencia: "Évitez d'aborder des sujets matériels ou administratifs au milieu de la journée.",
        pontosHarmonia: "Fluidité émotionnelle naturelle et compréhension intuitive des besoins de l'autre.",
        pontosTensao: "Légères différences de rythme ou fatigue passagère nécessitant de la patience.",
        climaEmocional: `${pName} est particulièrement réceptif(ve) et recherche un moment de calme et de complicité avec vous.`,
        acaoRedesSociais: "Envoyez un message délicat en partageant un souvenir joyeux ou un morceau de musique évocateur.",
        melhoresAtitudes: [
          "Écouter avec attention et curiosité sincère",
          "Valoriser sa personnalité et ses attentions",
          "Garder une attitude douce et sereine"
        ],
        atitudesEvitar: [
          "Insister pour obtenir une réponse rapide",
          "Rappeler de vieux désaccords",
          "Bousculer les étapes émotionnelles"
        ],
        comoSurpreender: "Une attention inattendue montrant que vous avez retenu un détail partagé lors d'une discussion.",
        sugestaoConvite: "Un café paisible ou une promenade tranquille en fin de journée."
      },
      linguagemAfetiva: {
        demonstrarCarinho: "Une présence bienveillante et de délicates attentions au fil de la journée.",
        iniciarConversas: "Demander des nouvelles d'un sujet passionnant qui l'occupe actuellement.",
        elogiosCompativeis: "Souligner son authenticité, son sens esthétique et la sérénité qu'il/elle dégage.",
        estiloComunicacao: "Sincère, chaleureux et dépourvu de faux-semblants.",
        ambientesFavoraveis: "Endroits intimes à la lumière douce, salons de thé calmes ou cadres naturels.",
        atividadesComum: "Partager de la musique, flâner dans un lieu culturel ou savourar un bon repas.",
        presentesCompativeis: "Objets ayant une valeur sentimentale, comme un livre marquant ou une douceur artisanale.",
        experienciasRomanticas: "Un coucher de soleil serein accompagné d'une conversation enrichissante."
      },
      estrategiasPersonalizadas: {
        melhorHorario: "Entre 18h30 et 21h00, lorsque l'atmosphère devient plus intime.",
        melhorEnergia: "Confiante, calme, empathique et chaleureuse.",
        posturaRecomendada: "Rester naturel(le) et accessible.",
        assuntosConexao: "Projets d'avenir, musique, voyages et anecdotes amusantes.",
        atitudesFavoraveis: "Témoigner d'un intérêt réel sans être envahissant(e).",
        comportamentosAtrito: "Distance froide, rigidité ou cynisme."
      },
      compatibilidadeEnergetica: {
        nivelAfinidade: 85,
        areasSintonia: "Harmonie sur les valeurs émotionnelles, le respect mutuel et l'élan créatif.",
        diferencasImportantes: "Manières distinctes de gérer le stress appelant un dialogue ouvert.",
        potenciaisDesafios: "Concilier espace personnel et moments de complicité partagée.",
        oportunidadesCrescimento: "S'inspirer mutuellement vers une plus grande maturité et paix intérieure."
      },
      linhaTempo: {
        hoje: "Belle synergie céleste invitant à des échanges doux et authentiques.",
        proximos7dias: "Transits favorables pour renforcer la confiance et organiser un rendez-vous agréable.",
        proximos30dias: "Progression constante de la complicité au rythme de la lune montante."
      },
      explicacaoAstrologica: {
        fundamentacao: "La synastrie met en lumière un trigone harmonieux entre Vénus et la Lune soutenu par Jupiter, créant un climat idéal pour le rapprochement affectif."
      }
    };
  }

  if (resolvedLang === 'de') {
    return {
      radarDoDia: {
        ritual: "Bereiten Sie abends einen Kamillentee oder Hibiskustee mit Zimt zu, um Geist und Herz sanft einzustimmen.",
        energiaGeral: `Eine kosmische Welle tiefer Empathie verbindet ${uName} und ${pName} am heutigen Tag.`,
        tendenciasAstrologicas: "Venus im harmonischen Aspekt zu Jupiter fördert offene Herzlichkeit und liebevolle Gesten.",
        potencialAproximacao: 88,
        momentosFavoraveis: "Der späte Nachmittag und frühe Abend sind besonders günstig für ehrliche Gespräche.",
        momentosPaciencia: "Vermeiden Sie stressige Diskussionen über Finanzen oder Alltagssorgen um die Mittagszeit.",
        pontosHarmonia: "Natürliche emotionale Leichtigkeit und gegenseitiges Gespür für die Bedürfnisse des anderen.",
        pontosTensao: "Kleine Unterscheide im Tempo oder Alltagsmüdigkeit, die Geduld erfordern.",
        climaEmocional: `${pName} ist heute besonders empfänglich und wünscht sich ruhige, gemütliche Momente an Ihrer Seite.`,
        acaoRedesSociais: "Senden Sie eine leichte Nachricht und teilen Sie eine schöne Erinnerung oder ein passendes Lied.",
        melhoresAtitudes: [
          "Aufmerksam und mit ehrlichem Interesse zuhören",
          "Die besonderen Qualitäten des anderen wertschätzen",
          "Einen ruhigen und liebevollen Ton bewahren"
        ],
        atitudesEvitar: [
          "Druck bezüglich schneller Antworten ausüben",
          "Alte Missverständnisse aufgreifen",
          "Emotionale Schritte überstürzen"
        ],
        comoSurpreender: "Eine kleine unerwartete Aufmerksamkeit, die zeigt, dass Sie sich an ein Detail erinnert haben.",
        sugestaoConvite: "Ein gemütlicher Kaffee oder ein entspannter Spaziergang in angenehmer Atmosphäre."
      },
      linguagemAfetiva: {
        demonstrarCarinho: "Ruhige Präsenz und kleine liebevolle Aufmerksamkeiten über den Tag verteilt.",
        iniciarConversas: "Nach einem Thema fragen, das den anderen derzeit inspiriert oder beschäftigt.",
        elogiosCompativeis: "Echtheit, Kreativität und die entspannte Ausstrahlung betonen.",
        estiloComunicacao: "Ehrlich, einfühlsam und frei von Aufgesetztheit.",
        ambientesFavoraveis: "Gemütliche Orte mit sanftem Licht, ruhige Cafés oder Naturräume.",
        atividadesComum: "Gute Musik hören, Kultur genießen oder entspannt zusammen essen.",
        presentesCompativeis: "Aufmerksamkeiten mit persönlichem Wert, wie ein schönes Buch oder etwas Handgemachtes.",
        experienciasRomanticas: "Ein entspannter Sonnenuntergang bei gutem Essen und fließenden Gesprächen."
      },
      estrategiasPersonalizadas: {
        melhorHorario: "Zwischen 18:30 und 21:00 Uhr, wenn die Tageshektik nachlässt.",
        melhorEnergia: "Selbstbewusst, gelassen, einfühlsam und humorvoll.",
        posturaRecomendada: "Authentisch und aufgeschlossen bleiben.",
        assuntosConexao: "Gemeinsame Ziele, Musik, Reisen und humorvolle Anekdoten.",
        atitudesFavoraveis: "Ehrliches Interesse zeigen, ohne aufdringlich zu wirken.",
        comportamentosAtrito: "Kühle Distanz, Starrheit oder Zynismus."
      },
      compatibilidadeEnergetica: {
        nivelAfinidade: 85,
        areasSintonia: "Starke Übereinstimmung in Werten, gegenseitigem Respekt und kreativer Energie.",
        diferencasImportantes: "Unterschiedliche Methoden zur Stressbewältigung, die offenes Gespräch erfordern.",
        potenciaisDesafios: "Die Balance zwischen persönlichem Freiraum und gemeinsamer Zeit finden.",
        oportunidadesCrescimento: "Gegenseitige Inspiration zu persönlicher Reife und innerem Frieden."
      },
      linhaTempo: {
        hoje: "Hervorragende kosmische Synergie für leichte Kontaktaufnahme und echte Wärme.",
        proximos7dias: "Günstige Transite für die Vertiefung des Vertrauens und ein schönes Treffen.",
        proximos30dias: "Kontinuierlicher Zuwachs an Nähe im Rhythmus des zunehmenden Mondes."
      },
      explicacaoAstrologica: {
        fundamentacao: "Die Synastrie zeigt ein harmonisches Trigon zwischen Venus und Mond, unterstützt von Jupiter, was ein ideales Klima für emotionale Annäherung schafft."
      }
    };
  }

  // Default: Portuguese (pt)
  return {
    radarDoDia: {
      ritual: "Prepare um chá de camomila ou hibisco com canela para acalmar os ânimos e sintonizar os corações à noite.",
      energiaGeral: `Energia cósmica de profunda compreensão mútua entre ${uName} e ${pName}. O alinhamento lunar convida à escuta atenta.`,
      tendenciasAstrologicas: "Vênus em bom aspecto com Júpiter estimula a afetividade generosa e o carinho espontâneo.",
      potencialAproximacao: 88,
      momentosFavoraveis: "O período do final da tarde e início da noite será especialmente harmonioso para trocar mensagens e compartilhar ideias.",
      momentosPaciencia: "Evite debater assuntos de planejamento de longo prazo ou finanças durante o horário do almoço.",
      pontosHarmonia: "Comunicação fluida e alinhamento terno entre as necessidades emocionais de ambos.",
      pontosTensao: "Pequenas divergências de ritmo ou pressões externas do dia a dia afetando a paciência.",
      climaEmocional: `${pName} está mais receptivo(a) e com desejo de compartilhar momentos de paz e aconchego ao seu lado.`,
      acaoRedesSociais: "Envie uma mensagem leve e descontraída, compartilhando uma lembrança feliz ou uma música que lembre vocês.",
      melhoresAtitudes: [
        "Escutar com atenção plena e curiosidade genuína",
        "Elogiar a presença e as qualidades de quem você ama",
        "Manter um tom de voz calmo e acolhedor"
      ],
      atitudesEvitar: [
        "Pressionar por respostas ou definições imediatas",
        "Trazer à tona pequenas divergências do passado",
        "Apressar o ritmo natural do diálogo"
      ],
      comoSurpreender: "Ofereça um pequeno gesto inesperado que mostre que você se lembrou de algo que a pessoa comentou recentemente.",
      sugestaoConvite: "Convide para um café tranquilo ou uma caminhada leve ao entardecer em um lugar agradável."
    },
    linguagemAfetiva: {
      demonstrarCarinho: "Presença tranquila e gestos de cuidado atencioso ao longo do dia.",
      iniciarConversas: "Pergunte sobre algo empolgante que a pessoa esteja descobrindo ou vivenciando recentemente.",
      elogiosCompativeis: "Elogie a autenticidade, o bom gosto e a paz que a pessoa transmite.",
      estiloComunicacao: "Sincera, afetuosa e livre de jogos ou ambiguidades.",
      ambientesFavoraveis: "Locais aconchegantes com iluminação suave, cafés tranquilos ou contato com a natureza.",
      atividadesComum: "Ouvir boa música, passear por feirinhas ou pontos culturais e saborear uma boa refeição juntos.",
      presentesCompativeis: "Itens com significado afetivo, como um livro especial ou um doce artesanal.",
      experienciasRomanticas: "Um pôr do sol relaxante acompanhado de boa conversa e comida gostosa."
    },
    estrategiasPersonalizadas: {
      melhorHorario: "Entre 18h30 e 21h00, quando as tensões do dia diminuem e a intimidade floresce.",
      melhorEnergia: "Confiante, serena, empática e levemente bem-humorada.",
      posturaRecomendada: "Avançar com naturalidade, sem pressa e sendo verdadeiramente você.",
      assuntosConexao: "Projetos de vida, música, viagens e recordações divertidas.",
      atitudesFavoraveis: "Demonstrar interesse sincero pelo bem-estar da pessoa sem invadir seu espaço.",
      comportamentosAtrito: "Frieza distante, postura defensiva ou ironia excessiva."
    },
    compatibilidadeEnergetica: {
      nivelAfinidade: 85,
      areasSintonia: "Sintonia nos valores afetivos, no respeito mútuo e na sensibilidade criativa.",
      diferencasImportantes: "Formas distintas de lidar com o estresse do dia a dia, exigindo diálogo claro.",
      potenciaisDesafios: "Conciliar a necessidade de espaço individual com o tempo dedicado à relação.",
      oportunidadesCrescimento: "Inspirarem-se mutuamente para o amadurecimento pessoal e a paz de espírito."
    },
    linhaTempo: {
      hoje: "Sinergia astrológica muito positiva para reaproximações e trocas afetuosas.",
      proximos7dias: "Trânsitos favoráveis para fortalecer a confiança e agendar um encontro especial.",
      proximos30dias: "Expansão gradual da cumplicidade no ritmo da lua crescente."
    },
    explicacaoAstrologica: {
      fundamentacao: "A sinastria destaca um trígono harmônico entre Vênus e a Lua, amplificado por Júpiter, favorecendo a empatia, o magnetismo afetivo e a clareza nas intenções de amor."
    }
  };
}

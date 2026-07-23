export interface CategoryConfig {
  strength: string[];
  attention: string[];
  conflito: string[];
  compatibilidadeMessage: string;
  conflitoMessage: string;
  caracteristicasUnem: string[];
  caracteristicasAfastam: string[];
  title: string;
  routineLabel: string;
  routineDesc: string;
  label7Dias: string;
  label30Dias: string;
  label3Meses: string;
  label6Meses: string;
  label1Ano: string;
  dFavoraveisItems: { icon: string; category: string; description: string }[];
  dAtencaoItems: { category: string; description: string }[];
  vLongoPrazoItems: { category: string; description: string }[];
  pOcultosItems: { category: string; description: string }[];
  oQueFazer: string[];
  oQueEvitar: string[];
  melhorarComunicacao: string;
  reduzirConflitos: string;
  fortalecerConexao: string;
  influencia: string;
}

export function getCategoryConfig(
  cat: string,
  lang: 'pt' | 'en' | 'es' | 'de' | 'fr',
  name1: string,
  name2: string,
  tSun1: string,
  tSun2: string,
  tMoon1: string,
  tMoon2: string,
  tMercury1: string,
  tMercury2: string,
  tVenus1: string,
  tVenus2: string,
  tMars1: string,
  tMars2: string,
  tSaturn1: string,
  tSaturn2: string,
  tAsc1: string
): CategoryConfig {
  if (cat === 'friend') {
    return {
      title: {
        pt: "Dinâmica da Amizade e Convívio",
        en: "Friendship and Social Dynamics",
        es: "Dinámica de la Amistad y Convivencia",
        de: "Freundschafts- und Sozialdynamik",
        fr: "Dynamique de l'Amitié et de la Cohabitation"
      }[lang],
      strength: {
        pt: [`Sintonia espontânea de amizade entre Mercúrio de ${name1} em ${tMercury1} e Mercúrio de ${name2} em ${tMercury2}, favorecendo ótimas conversas.`, `Afinidade em atividades sociais sob o compasso harmonioso do Sol em ${tSun1}.`],
        en: [`Spontaneous friendship harmony between Mercury of ${name1} in ${tMercury1} and Mercury of ${name2} in ${tMercury2}, favoring great conversations.`, `Affinity in social activities under the harmonious rhythm of Sun in ${tSun1}.`],
        es: [`Sintonía espontánea de amistad entre Mercurio de ${name1} en ${tMercury1} y Mercurio de ${name2} en ${tMercury2}, favoreciendo grandes conversaciones.`, `Afinidad en actividades sociales bajo el compás armonioso del Sol en ${tSun1}.`],
        de: [`Spontane Freundschaftsharmonie zwischen Merkur von ${name1} in ${tMercury1} und Merkur von ${name2} in ${tMercury2}, was tolle Gespräche begünstigt.`, `Affinität bei sozialen Aktivitäten unter dem harmonischen Rhythmus der Sonne in ${tSun1}.`],
        fr: [`Harmonie spontanée d'amitié entre Mercure de ${name1} en ${tMercury1} et Mercure de ${name2} en ${tMercury2}, favorisant d'excellentes conversations.`, `Affinité dans les activités sociales sous le rythme harmonieux du Soleil en ${tSun1}.`]
      }[lang],
      attention: {
        pt: [`Cuidado para não projetar expectativas excessivas de presença contínua.`, `Pequenos ruídos de comunicação devido a julgamentos precipitados.`],
        en: [`Be careful not to project excessive expectations of continuous presence.`, `Small communication noises due to hasty judgments.`],
        es: [`Cuidado de no proyectar expectativas excesivas de presencia continua.`, `Pequeños ruidos de comunicación debido a juicios precipitados.`],
        de: [`Achten Sie darauf, keine übermäßigen Erwartungen an eine ständige Präsenz zu projizieren.`, `Kleine Kommunikationsstörungen durch voreilige Urteile.`],
        fr: [`Attention à ne pas projeter d'attentes excessive de présence continue.`, `Petits bruits de communication dus à des jugements hâtifs.`]
      }[lang],
      conflito: {
        pt: [`Disputas de opinião estimuladas por Marte de ${name1} em ${tMars1} em divergência com ${name2}.`, `Teimosia sutil e orgulho mental temporário.`],
        en: [`Disputes of opinion stimulated by Mars of ${name1} in ${tMars1} in divergence with ${name2}.`, `Subtle stubbornness and temporary mental pride.`],
        es: [`Disputas de opinión estimuladas por Marte de ${name1} en ${tMars1} en divergencia con ${name2}.`, `Obstinación sutil y orgullo mental temporal.`],
        de: [`Meinungsverschiedenheiten, angeregt durch Mars von ${name1} in ${tMars1} im Widerspruch zu ${name2}.`, `Subtile Sturheit und vorübergehender geistiger Stolz.`],
        fr: [`Disputes d'opinion stimulées par Mars de ${name1} en ${tMars1} en divergence avec ${name2}.`, `Obstination subtile et orgueil mental temporaire.`]
      }[lang],
      compatibilidadeMessage: {
        pt: `Sua amizade é abençoada por uma forte ressonância intelectual e lealdade fraternal. Vocês encontram facilidade para desabafar, compartilhar visões de mundo e rir juntos.`,
        en: `Your friendship is blessed by a strong intellectual resonance and brotherly loyalty. You find it easy to vent, share world views, and laugh together.`,
        es: `Su amistad está bendecida por una fuerte resonancia intelectual y lealtad fraternal. Les resulta fácil desahogarse, compartir visiones del mundo y reír juntos.`,
        de: `Ihre Freundschaft ist gesegnet mit einer starken intellektuellen Resonanz und brüderlichen Loyalität. Es fällt Ihnen leicht, sich auszusprechen, Weltansichten zu teilen und gemeinsam zu lachen.`,
        fr: `Votre amitié est bénie par une forte résonance intellectuelle et une loyauté fraternelle. Vous trouvez facile de vous confier, de partager des visions du monde et de rire ensemble.`
      }[lang],
      conflitoMessage: {
        pt: `Os atritos eventuais acontecem por orgulho mental ou mal-entendidos cotidianos. Evitar julgamentos precipitados preserva o carinho.`,
        en: `Occasional friction occurs due to mental pride or daily misunderstandings. Avoiding hasty judgments preserves affection.`,
        es: `Las fricciones eventuales ocurren por orgullo mental o malentendidos cotidianos. Evitar juicios precipitados preserva el cariño.`,
        de: `Gelegentliche Reibungen entstehen durch geistigen Stolz oder alltägliche Missverständnisse. Das Vermeiden voreiliger Urteile bewahrt die Zuneigung.`,
        fr: `Les frictions éventuelles surviennent en raison d'un orgueil mental ou de malentendus quotidiens. Éviter les jugements hâtifs préserve l'affection.`
      }[lang],
      caracteristicasUnem: {
        pt: ["Incentivo mútuo para o crescimento pessoal.", "Conversas intermináveis cheias de risadas e cumplicidade."],
        en: ["Mutual encouragement for personal growth.", "Endless conversations filled with laughter and complicity."],
        es: ["Incentivo mutuo para el crecimiento personal.", "Conversaciones interminables llenas de risas y complicidad."],
        de: ["Gegenseitige Ermutigung zu persönlichem Wachstum.", "Endlose Gespräche voller Lachen und Komplizenschaft."],
        fr: ["Encouragement mutuel pour la croissance personnelle.", "Conversations interminables pleines de rires et de complicité."]
      }[lang],
      caracteristicasAfastam: {
        pt: ["Falta de tempo na rotina para se verem.", "Disputas de ego ou debates de opinião inflexíveis."],
        en: ["Lack of time in the routine to see each other.", "Ego disputes or inflexible debates of opinion."],
        es: ["Falta de tiempo en la rutina para verse.", "Disputas de ego o debates de opinión inflexibles."],
        de: ["Mangel an Zeit im Alltag, um sich zu sehen.", "Ego-Konflikte oder unnachgiebige Debatten."],
        fr: ["Manque de temps dans la routine pour se voir.", "Disputes d'égo ou débats d'opinion inflexibles."]
      }[lang],
      routineLabel: { pt: "Lazer", en: "Leisure", es: "Ocio", de: "Freizeit", fr: "Loisir" }[lang],
      routineDesc: {
        pt: `Respeito mútuo ao espaço individual de cada um guiado pelo Ascendente em ${tAsc1}.`,
        en: `Mutual respect for each other's individual space guided by the Ascendant in ${tAsc1}.`,
        es: `Respeto mutuo al espacio individual de cada uno guiado por el Ascendente en ${tAsc1}.`,
        de: `Gegenseitiger Respekt für den individuellen Freiraum, geleitet vom Aszendenten in ${tAsc1}.`,
        fr: `Respect mutuel de l'espace individuel de chacun guidé par l'Ascendant en ${tAsc1}.`
      }[lang],
      label7Dias: {
        pt: "Excelente clima para planejar encontros descontraídos ou saídas com amigos.",
        en: "Excellent atmosphere for planning relaxed gatherings or outings with friends.",
        es: "Excelente ambiente para planificar encuentros relajados o salidas com amigos.",
        de: "Hervorragende Atmosphäre für die Planung entspannter Treffen oder Ausflüge mit Freunden.",
        fr: "Excellente ambiance pour planifier des rencontres décontractées ou des sorties entre amis."
      }[lang],
      label30Dias: {
        pt: "Excelente momento para retomar contato com aquele amigo que não vê há tempos.",
        en: "Excellent time to get back in touch with that friend you haven't seen in a while.",
        es: "Excelente momento para retomar el contacto con ese amigo que no ves hace tiempo.",
        de: "Hervorragende Zeit, um wieder Kontakt mit dem Freund aufzunehmen, den Sie lange nicht gesehen haben.",
        fr: "Excellent moment pour reprendre contact avec cet ami que vous n'avez pas vu depuis longtemps."
      }[lang],
      label3Meses: {
        pt: "Fortalecimento do laço de confiança e confidências profundas.",
        en: "Strengthening of the bond of trust and deep confidences.",
        es: "Fortalecimiento del lazo de confianza y confidencias profundas.",
        de: "Stärkung des Vertrauensbündnisses und tiefe Vertraulichkeiten.",
        fr: "Renforcement du lien de confiance et confidences profondes."
      }[lang],
      label6Meses: {
        pt: "Fase oportuna para planejar viagens em grupo ou projetos compartilhados.",
        en: "Opportune phase for planning group trips or shared projects.",
        es: "Fase oportuna para planificar viajes en grupo o proyectos compartidos.",
        de: "Günstige Phase für die Planung von Gruppenreisen oder gemeinsamen Projekten.",
        fr: "Phase opportune pour planifier des voyages de groupe ou des projets partagés."
      }[lang],
      label1Ano: {
        pt: "Amizade consolidada que se firma como uma parceria para a vida toda.",
        en: "Consolidated friendship that stands as a lifelong partnership.",
        es: "Amistad consolidada que se establece como una asociación de por vida.",
        de: "Gefestigte Freundschaft, die sich als lebenslange Partnerschaft etabliert.",
        fr: "Amitié consolidée qui s'affirme comme un partenariat pour la vie toute."
      }[lang],
      dFavoraveisItems: {
        pt: [
          { icon: "💬", category: "Conversas", description: "Sintonia mental em debates saudáveis regidos por Mercúrio." },
          { icon: "🍻", category: "Lazer", description: "Encontros felizes cheios de risadas compartilhadas." }
        ],
        en: [
          { icon: "💬", category: "Conversations", description: "Mental harmony in healthy debates ruled by Mercury." },
          { icon: "🍻", category: "Leisure", description: "Happy meetings filled with shared laughter." }
        ],
        es: [
          { icon: "💬", category: "Conversaciones", description: "Sintonía mental en debates saludables regidos por Mercurio." },
          { icon: "🍻", category: "Ocio", description: "Encuentros felices llenos de risas compartidas." }
        ],
        de: [
          { icon: "💬", category: "Gespräche", description: "Geistige Harmonie in gesunden, von Merkur regierten Debatten." },
          { icon: "🍻", category: "Freizeit", description: "Fröhliche Treffen voller gemeinsamem Lachen." }
        ],
        fr: [
          { icon: "💬", category: "Conversations", description: "Harmonie mentale lors de débats sains régis par Mercure." },
          { icon: "🍻", category: "Loisir", description: "Rencontres joyeuses pleines de rires partagés." }
        ]
      }[lang],
      dAtencaoItems: {
        pt: [{ category: "Divergências", description: "Cuidado com discussões causadas por vaidade ou competição boba." }],
        en: [{ category: "Disagreements", description: "Beware of discussions caused by vanity or silly competition." }],
        es: [{ category: "Divergencias", description: "Cuidado con las discusiones causadas por vanidad o competencia tonta." }],
        de: [{ category: "Unstimmigkeiten", description: "Vorsicht vor Diskussionen, die durch Eitelkeit oder alberne Konkurrenz entstehen." }],
        fr: [{ category: "Divergences", description: "Attention aux discussions causées par la vanité ou une rivalité idiote." }]
      }[lang],
      vLongoPrazoItems: {
        pt: [{ category: "Cumplicidade", description: `Amizade profunda ancorada em Sol em ${tSun1} e Lua em ${tMoon2}.` }],
        en: [{ category: "Complicity", description: `Deep friendship anchored in Sun in ${tSun1} and Moon in ${tMoon2}.` }],
        es: [{ category: "Complicidad", description: `Amistad profunda anclada en el Sol en ${tSun1} y la Luna en ${tMoon2}.` }],
        de: [{ category: "Komplizenschaft", description: `Tiefgehende Freundschaft, verankert in der Sonne in ${tSun1} und dem Mond in ${tMoon2}.` }],
        fr: [{ category: "Complicité", description: `Amitié profonde ancrée dans le Soleil en ${tSun1} et la Lune en ${tMoon2}.` }]
      }[lang],
      pOcultosItems: {
        pt: [{ category: "Lealdade", description: "Aprender a apoiar o outro sem cobrar presença constante." }],
        en: [{ category: "Loyalty", description: "Learn to support each other without demanding constant presence." }],
        es: [{ category: "Lealtad", description: "Aprender a apoyar al otro sin exigir presencia constante." }],
        de: [{ category: "Loyalität", description: "Lernen Sie, sich gegenseitig zu unterstützen, ohne ständige Präsenz zu fordern." }],
        fr: [{ category: "Loyauté", description: "Apprendre à soutenir l'autre sans exiger une présence constante." }]
      }[lang],
      oQueFazer: {
        pt: ["Planejar momentos para rir e descontrair.", "Ouvir com empatia as escolhas alheias."],
        en: ["Plan moments to laugh and relax.", "Listen with empathy to each other's choices."],
        es: ["Planificar momentos para reír y relajarse.", "Escuchar con empatía las elecciones de los demás."],
        de: ["Planen Sie Momente zum Lachen und Entspannen.", "Hören Sie sich die Entscheidungen des anderen empathisch an."],
        fr: ["Planifier des moments pour rire et se détendre.", "Écouter avec empathie les choix de l'autre."]
      }[lang],
      oQueEvitar: {
        pt: ["Debates inflexíveis de opinião em público.", "Deixar de responder mensagens por desleixo."],
        en: ["Inflexible debates of opinion in public.", "Failing to answer messages out of carelessness."],
        es: ["Debates inflexibles de opinión en público.", "No responder mensajes por descuido."],
        de: ["Unnachgiebige Debatten in der Öffentlichkeit.", "Das Nichtbeantworten von Nachrichten aus Nachlässigkeit."],
        fr: ["Débats d'opinion inflexibles en public.", "Ne pas répondre aux messages par négligence."]
      }[lang],
      melhorarComunicacao: {
        pt: "Fale com sinceridade e humor para desarmar qualquer conflito.",
        en: "Speak with sincerity and humor to disarm any conflict.",
        es: "Hable con sinceridad y humor para desarmar cualquier conflicto.",
        de: "Sprechen Sie mit Aufrichtigkeit und Humor, um jeden Konflikt zu entschärfen.",
        fr: "Parlez avec sincérité et humour pour désarmer tout conflit."
      }[lang],
      reduzirConflitos: {
        pt: "Evitar competir com as conquistas pessoais do amigo.",
        en: "Avoid competing with your friend's personal achievements.",
        es: "Evitar competir con los logros personales del amigo.",
        de: "Vermeiden Sie es, mit den persönlichen Leistungen des Freundes zu konkurrieren.",
        fr: "Éviter d'entrer en compétition avec les réussites personnelles de votre ami."
      }[lang],
      fortalecerConexao: {
        pt: "Celebrar e elogiar o sucesso do outro de coração aberto.",
        en: "Celebrate and praise each other's success with an open heart.",
        es: "Celebrar y elogiar el éxito del otro con el corazón abierto.",
        de: "Feiern und loben Sie den Erfolg des anderen mit offenem Herzen.",
        fr: "Célébrer et féliciter le succès de l'autre à cœur ouvert."
      }[lang],
      influencia: {
        pt: `Neste momento, trânsitos favoráveis de Saturno em ${tSaturn1} atuam blindando decisões de longo prazo e organizando caminhos prósperos.`,
        en: `At this moment, favorable transits of Saturn in ${tSaturn1} act to shield long-term decisions and organize prosperous paths.`,
        es: `En este momento, tránsitos favorables de Saturno en ${tSaturn1} actúan protegiendo decisiones de largo plazo y organizando caminos prósperos.`,
        de: `In diesem Moment wirken günstige Transite des Saturns in ${tSaturn1}, um langfristige Entscheidungen zu schützen und wohlhabende Wege zu organisieren.`,
        fr: `En ce moment, des transits favorables de Saturne en ${tSaturn1} agissent pour protéger les décisions à long terme et organiser des voies prospères.`
      }[lang]
    };
  } else if (cat === 'business') {
    return {
      title: {
        pt: "Sinergia Profissional e de Carreira",
        en: "Professional and Career Synergy",
        es: "Sinergia Profesional y de Carrera",
        de: "Berufliche und Karriere-Synergie",
        fr: "Synergie Professionnelle et de Carrière"
      }[lang],
      strength: {
        pt: [`Sinergia de metas materiais coordenada por Mercúrio de ${name1} em ${tMercury1} e Saturno de ${name2} em ${tSaturn2}.`, `Foco em resultados e organização eficiente.`],
        en: [`Material goals synergy coordinated by Mercury of ${name1} in ${tMercury1} and Saturn of ${name2} in ${tSaturn2}.`, `Focus on results and efficient organization.`],
        es: [`Sinergia de metas materiales coordinada por Mercurio de ${name1} en ${tMercury1} y Saturno de ${name2} em ${tSaturn2}.`, `Enfoque en resultados y organización eficiente.`],
        de: [`Synergie materieller Ziele, koordiniert durch Merkur von ${name1} in ${tMercury1} und Saturn von ${name2} in ${tSaturn2}.`, `Fokus auf Ergebnisse und effiziente Organisation.`],
        fr: [`Synergie des objectifs matériels coordonnée par Mercure de ${name1} en ${tMercury1} et Saturne de ${name2} en ${tSaturn2}.`, `Focus sur les résultats et organisation efficace.`]
      }[lang],
      attention: {
        pt: [`Divergência em ritmos operacionais e formas de gerenciar prazos sob Sol em ${tSun1} e Sol em ${tSun2}.`, `Cuidado com cobranças excessivas de performance.`],
        en: [`Divergence in operational rhythms and ways of managing deadlines under Sun in ${tSun1} and Sun in ${tSun2}.`, `Beware of excessive performance demands.`],
        es: [`Divergencia en ritmos operativos y formas de gestionar plazos bajo el Sol en ${tSun1} y el Sol en ${tSun2}.`, `Cuidado con las exigencias excesivas de rendimiento.`],
        de: [`Unterschiede im Arbeitstempo und bei der Fristenverwaltung unter Sonne in ${tSun1} und Sonne in ${tSun2}.`, `Vorsicht vor übermäßigen Leistungsanforderungen.`],
        fr: [`Divergence dans les rythmes opérationnels et les méthodes de gestion des délais sous le Soleil en ${tSun1} et le Soleil en ${tSun2}.`, `Attention aux exigences excessives de performance.`]
      }[lang],
      conflito: {
        pt: [`Tensão de liderança ou disputas de ego estimuladas por Marte de ${name1} em ${tMars1}.`, `Dificuldade em aceitar métodos alheios de trabalho.`],
        en: [`Leadership tension or ego disputes stimulated by Mars of ${name1} in ${tMars1}.`, `Difficulty in accepting others' working methods.`],
        es: [`Tensión de liderazgo o disputas de ego estimuladas por Marte de ${name1} en ${tMars1}.`, `Dificultad para aceptar métodos de trabajo ajenos.`],
        de: [`Führungsspannungen oder Ego-Konflikte, angeregt durch Mars von ${name1} in ${tMars1}.`, `Schwierigkeiten, die Arbeitsmethoden des anderen zu akzeptieren.`],
        fr: [`Tension de leadership ou conflits d'égo stimulés par Mars de ${name1} en ${tMars1}.`, `Difficulté à accepter les méthodes de travail de l'autre.`]
      }[lang],
      compatibilidadeMessage: {
        pt: `A vossa cooperação profissional possui excelente bases táticas e determinação. Há um potencial notável para gerar resultados financeiros estáveis e organização de tarefas.`,
        en: `Your professional cooperation has excellent tactical bases and determination. There is remarkable potential to generate stable financial results and task organization.`,
        es: `Su cooperación profesional presenta excelentes bases tácticas y determinación. Existe un potencial notable para generar resultados financieros estables y organización de tareas.`,
        de: `Ihre berufliche Zusammenarbeit weist hervorragende taktische Grundlagen und Entschlossenheit auf. Es besteht ein bemerkenswertes Potenzial für stabile finanzielle Ergebnisse und Aufgabenorganisation.`,
        fr: `Votre coopération professionnelle possède d'excellentes bases tactiques et de la détermination. Il existe un potentiel remarquable pour générer des résultats financiers stables et une organisation des tâches.`
      }[lang],
      conflitoMessage: {
        pt: `O conflito ocorre quando o ego profissional ou a centralização excessiva de tarefas impede a delegação inteligente de funções cotidianas.`,
        en: `Conflict occurs when professional ego or excessive centralization of tasks prevents intelligent delegation of daily functions.`,
        es: `El conflicto ocurre cuando el ego profesional o la centralización excesiva de tareas impide la delegación inteligente de funciones cotidianas.`,
        de: `Konflikte entstehen, wenn das berufliche Ego oder eine übermäßige Zentralisierung von Aufgaben eine intelligente Delegation alltäglicher Funktionen verhindert.`,
        fr: `Le conflit survient lorsque l'égo professionnel ou une centralisation excessive des tâches empêche une délégation intelligente des fonctions quotidiennes.`
      }[lang],
      caracteristicasUnem: {
        pt: ["Compromisso com a excelência técnica e cumprimento de metas.", "Complementaridade entre a visão tática e a execução pragmática."],
        en: ["Commitment to technical excellence and goal achievement.", "Complementarity between tactical vision and pragmatic execution."],
        es: ["Compromiso con la excelencia técnica y el cumplimiento de metas.", "Complementariedad entre la visión táctica y la ejecución pragmática."],
        de: ["Verpflichtung zu technischer Exzellenz und Zielerreichung.", "Komplementarität zwischen taktischer Vision und pragmatischer Umsetzung."],
        fr: ["Engagement envers l'excellence technique et la réalisation des objectifs.", "Complémentarité entre la vision tactique et l'exécution pragmatique."]
      }[lang],
      caracteristicasAfastam: {
        pt: ["Teimosia em debates burocráticos ou burocracia excessiva.", "Falta de clareza na divisão territorial de tarefas corporativas."],
        en: ["Stubbornness in bureaucratic debates or excessive bureaucracy.", "Lack of clarity in the territorial division of corporate tasks."],
        es: ["Obstinación en debates burocráticos o burocracia excesiva.", "Falta de claridad en la división territorial de tareas corporativas."],
        de: ["Sturheit bei bürokratischen Debatten oder übermäßige Bürokratie.", "Mangel an Klarheit bei der territorialen Aufteilung von Unternehmensaufgaben."],
        fr: ["Obstination dans les débats bureaucratiques ou bureaucratie excessive.", "Manque de clarté dans la répartition des tâches de l'entreprise."]
      }[lang],
      routineLabel: { pt: "Trabalho", en: "Work", es: "Trabajo", de: "Arbeit", fr: "Travail" }[lang],
      routineDesc: {
        pt: `Foco em produtividade e excelência corporativa guiado pelo Ascendente em ${tAsc1}.`,
        en: `Focus on productivity and corporate excellence guided by the Ascendant in ${tAsc1}.`,
        es: `Enfoque en la productividad y la excelencia corporativa guiado por el Ascendente en ${tAsc1}.`,
        de: `Fokus auf Produktivität und unternehmerische Exzellenz, geleitet vom Aszendenten in ${tAsc1}.`,
        fr: `Focus sur la productivité et l'excellence d'entreprise guidé par l'Ascendant en ${tAsc1}.`
      }[lang],
      label7Dias: {
        pt: "Fase de alta produtividade. Excelente clima para despachar tarefas pendentes.",
        en: "High productivity phase. Excellent atmosphere to sort out pending tasks.",
        es: "Fase de alta productividad. Excelente ambiente para despachar tareas pendientes.",
        de: "Hochproduktive Phase. Hervorragende Atmosphäre, um ausstehende Aufgaben zu erledigen.",
        fr: "Phase de productivité élevée. Excellente ambiance pour régler les tâches en attente."
      }[lang],
      label30Dias: {
        pt: "Excelente período para reuniões de alinhamento estratégico e revisão de fluxos.",
        en: "Excellent period for strategic alignment meetings and workflow reviews.",
        es: "Excelente período para reuniones de alineación estratégica y revisión de flujos.",
        de: "Hervorragende Zeit für strategische Abstimmungsgespräche und Workflow-Prüfungen.",
        fr: "Excellente période pour les réunions d'alignement stratégique et la révision des flux."
      }[lang],
      label3Meses: {
        pt: "Fase oportuna para assinaturas de contratos importantes ou renovação de termos.",
        en: "Opportune phase for important contract signatures or term renewals.",
        es: "Fase oportuna para firmas de contratos importantes o renovación de términos.",
        de: "Günstige Phase für wichtige Vertragsunterzeichnungen oder Fristverlängerungen.",
        fr: "Phase opportune pour les signatures de contrats importants ou le renouvellement des termes."
      }[lang],
      label6Meses: {
        pt: "Plena colheita fiduciária e consolidação de ações conjuntas de carreira.",
        en: "Full financial harvest and consolidation of joint career actions.",
        es: "Plena cosecha financiera y consolidación de acciones conjuntas de carrera.",
        de: "Volle finanzielle Ernte und Festigung gemeinsamer Karriereaktionen.",
        fr: "Plein retour financier et consolidation des actions professionnelles conjointes."
      }[lang],
      label1Ano: {
        pt: "Grandes auspícios para consolidar o faturamento e crescimento a longo prazo.",
        en: "Great auspices to consolidate revenue and long-term growth.",
        es: "Grandes auspicios para consolidar la facturación y el crecimiento a largo plazo.",
        de: "Großartige Vorzeichen zur Festigung von Umsatz und langfristigem Wachstum.",
        fr: "Grands auspices pour consolider le chiffre d'affaires et la croissance à long terme."
      }[lang],
      dFavoraveisItems: {
        pt: [
          { icon: "💼", category: "Negócios", description: "Foco tático e solidez de papéis comerciais regidos por Saturno." },
          { icon: "📊", category: "Estratégia", description: "Excelente para planejar os próximos passos de faturamento." }
        ],
        en: [
          { icon: "💼", category: "Business", description: "Tactical focus and stability of commercial papers ruled by Saturn." },
          { icon: "📊", category: "Strategy", description: "Excellent for planning the next steps of revenue." }
        ],
        es: [
          { icon: "💼", category: "Negocios", description: "Enfoque táctico y solidez de documentos comerciales regidos por Saturno." },
          { icon: "📊", category: "Estrategia", description: "Excelente para planificar los próximos pasos de facturación." }
        ],
        de: [
          { icon: "💼", category: "Geschäft", description: "Taktischer Fokus und Stabilität von Handelspapieren, regiert von Saturn." },
          { icon: "📊", category: "Strategie", description: "Hervorragend zur Planung der nächsten Umsatzschritte." }
        ],
        fr: [
          { icon: "💼", category: "Affaires", description: "Focus tactique et solidité des documents commerciaux régis par Saturne." },
          { icon: "📊", category: "Stratégie", description: "Excellent pour planifier les prochaines étapes de chiffre d'affaires." }
        ]
      }[lang],
      dAtencaoItems: {
        pt: [{ category: "Prazos", description: "Evite atrasos operacionais por falta de foco ou dispersão tática." }],
        en: [{ category: "Deadlines", description: "Avoid operational delays due to lack of focus or tactical dispersion." }],
        es: [{ category: "Plazos", description: "Evite retrasos operativos por falta de enfoque o dispersión táctica." }],
        de: [{ category: "Fristen", description: "Vermeiden Sie operative Verzögerungen durch mangelnden Fokus oder taktische Zerstreuung." }],
        fr: [{ category: "Délais", description: "Évitez les retards opérationnels dus à un manque de concentration ou à une dispersion tactique." }]
      }[lang],
      vLongoPrazoItems: {
        pt: [{ category: "Estabilidade", description: `Base comercial guiada pela solidez de Saturno em ${tSaturn1}.` }],
        en: [{ category: "Stability", description: `Business base guided by Saturn's stability in ${tSaturn1}.` }],
        es: [{ category: "Estabilidad", description: `Base comercial guiada por la solidez de Saturno en ${tSaturn1}.` }],
        de: [{ category: "Stabilität", description: `Geschäftsbasis, geleitet von der Stabilität Saturns in ${tSaturn1}.` }],
        fr: [{ category: "Stabilité", description: `Base commerciale guidée par la solidité de Saturne en ${tSaturn1}.` }]
      }[lang],
      pOcultosItems: {
        pt: [{ category: "Organização", description: "Manter processos muito claros e tarefas bem distribuídas." }],
        en: [{ category: "Organization", description: "Keep very clear processes and well-distributed tasks." }],
        es: [{ category: "Organización", description: "Mantener procesos muy claros y tareas bien distribuidas." }],
        de: [{ category: "Organisation", description: "Halten Sie sehr klare Prozesse und gut verteilte Aufgaben ein." }],
        fr: [{ category: "Organisation", description: "Maintenir des processus très clairs et des tâches bien réparties." }]
      }[lang],
      oQueFazer: {
        pt: ["Definir metas semanais com prazos exatos.", "Manter termos contratuais claros e transparentes."],
        en: ["Define weekly goals with exact deadlines.", "Maintain clear and transparent contractual terms."],
        es: ["Definir metas semanales con plazos exactos.", "Mantener términos contractuales claros y transparentes."],
        de: ["Wöchentliche Ziele mit genauen Fristen definieren.", "Klare und transparente Vertragsbedingungen einhalten."],
        fr: ["Définir des objectifs hebdomadaires avec des délais précis.", "Maintenir des termes contractuels clairs et transparents."]
      }[lang],
      oQueEvitar: {
        pt: ["Decisões profissionais baseadas em cansaço emocional.", "Críticas excessivas de desempenho em reuniões públicas."],
        en: ["Professional decisions based on emotional fatigue.", "Excessive performance criticism in public meetings."],
        es: ["Decisiones profesionales basadas en cansancio emocional.", "Críticas excesivas de desempeño en reuniones públicas."],
        de: ["Berufliche Entscheidungen basierend auf emotionaler Erschöpfung.", "Übermäßige Leistungskritik in öffentlichen Treffen."],
        fr: ["Décisions professionnelles basées sur la fatigue émotionnelle.", "Critiques excessives de performance lors de réunions publiques."]
      }[lang],
      melhorarComunicacao: {
        pt: "Apresente dados e fatos de forma clara, didática e serena.",
        en: "Present data and facts clearly, didactically, and calmly.",
        es: "Apresente dados de forma clara, didática e serena.",
        de: "Präsentieren Sie Daten und Fakten klar, didaktisch und ruhig.",
        fr: "Présentez les données et les faits de manière claire, didactique et sereine."
      }[lang],
      reduzirConflitos: {
        pt: "Fazer divisão exata de responsabilidades operacionais táticas.",
        en: "Make exact division of tactical operational responsibilities.",
        es: "Realizar una división exacta de las responsabilidades operativas tácticas.",
        de: "Genaue Aufteilung der taktischen operativen Aufgaben vornehmen.",
        fr: "Faire une répartition précise des tâches pour éviter les conflits."
      }[lang],
      fortalecerConexao: {
        pt: "Celebrar marcos contratuais atingidos com gratidão profissional.",
        en: "Celebrate completed contract milestones with professional gratitude.",
        es: "Celebrar hitos contractuales alcanzados con gratitud profesional.",
        de: "Erreichte vertragliche Meilensteine mit professioneller Dankbarkeit feiern.",
        fr: "Célébrer les étapes contractuelles franchies avec une gratitude professionnelle."
      }[lang],
      influencia: {
        pt: `Neste momento, trânsitos favoráveis de Saturno em ${tSaturn1} atuam blindando decisões de longo prazo e organizando caminhos prósperos.`,
        en: `At this moment, favorable transits of Saturn in ${tSaturn1} act to shield long-term decisions and organize prosperous paths.`,
        es: `En este momento, tránsitos favorables de Saturno em ${tSaturn1} actúan protegiendo decisões de longo prazo e organizando caminhos prósperos.`,
        de: `In diesem Moment wirken günstige Transite des Saturns in ${tSaturn1}, um langfristige Entscheidungen zu schützen und wohlhabende Wege zu organisieren.`,
        fr: `En ce moment, des transits favorables de Saturne en ${tSaturn1} agissent pour protéger les décisions de long terme.`
      }[lang]
    };
  } else if (cat === 'marriage') {
    return {
      title: {
        pt: "Construção de Vida Comum e Matrimônio",
        en: "Life Build and Matrimonial Union",
        es: "Construcción de Vida Común y Matrimonio",
        de: "Gemeinsamer Lebensaufbau und Ehebund",
        fr: "Construction de Vie Commune et Mariage"
      }[lang],
      strength: {
        pt: [`Ligação afetiva profunda e compromisso guiados por Vênus de ${name1} em ${tVenus1} e Saturno de ${name2} em ${tSaturn2}.`, `Sintonia íntima e partilha de metas sincera.`],
        en: [`Deep emotional connection and commitment guided by Venus of ${name1} in ${tVenus1} and Saturn of ${name2} in ${tSaturn2}.`, `Intimate harmony and sincere sharing of goals.`],
        es: [`Conexión afectiva profunda y compromiso guiados por Venus de ${name1} en ${tVenus1} y Saturno de ${name2} en ${tSaturn2}.`, `Compartir íntimo y sincero de metas.`],
        de: [`Tiefe emotionale Bindung und Verpflichtung, geleitet von Venus von ${name1} in ${tVenus1} und Saturn von ${name2} in ${tSaturn2}.`, `Intimes Einvernehmen und aufrichtiges Teilen von Zielen.`],
        fr: [`Lien affectif profond et engagement guidés par Vénus de ${name1} en ${tVenus1} et Saturne de ${name2} en ${tSaturn2}.`, `Harmonie intime et partage sincère des objectifs.`]
      }[lang],
      attention: {
        pt: [`Necessidade de equilibrar o espaço individual de cada cônjuge sob Sol em ${tSun1} e Sol em ${tSun2}.`, `Evitar discussões financeiras agressivas por detalhes.`],
        en: [`Need to balance each spouse's individual space under Sun in ${tSun1} and Sun in ${tSun2}.`, `Avoid aggressive financial discussions over details.`],
        es: [`Necesidad de equilibrar el espacio individual de cada cónyuge bajo el Sol en ${tSun1} y el Sol en ${tSun2}.`, `Evitar discusiones financieras agresivas por detalles.`],
        de: [`Notwendigkeit, den individuellen Freiraum jedes Ehepartners unter Sonne in ${tSun1} und Sonne in ${tSun2} auszubalancieren.`, `Vermeiden Sie aggressive finanzielle Diskussionen über Details.`],
        fr: [`Besoin d'équilibrer l'espace individuel de chaque conjoint sous le Soleil en ${tSun1} et le Soleil en ${tSun2}.`, `Éviter les discussions financières agressives pour des détails.`]
      }[lang],
      conflito: {
        pt: [`Atritos menores sobre finanças ou rotinas na Lua de ${name1} em ${tMoon1} e Lua de ${name2} em ${tMoon2}.`, `Monotonia cotidiana se não houver renovação do afeto.`],
        en: [`Minor friction over finances or routines in Moon of ${name1} in ${tMoon1} and Moon of ${name2} in ${tMoon2}.`, `Daily monotony if there is no renewal of affection.`],
        es: [`Fricciones menores sobre finanzas o rutinas en la Luna de ${name1} en ${tMoon1} y la Luna de ${name2} en ${tMoon2}.`, `Monotonía cotidiana si no hay renovación del afecto.`],
        de: [`Kleinere Reibungen über Finanzen oder Alltag im Mond von ${name1} in ${tMoon1} und Mond von ${name2} in ${tMoon2}.`, `Alltägliche Monotonie, wenn die Zuneigung nicht erneuert wird.`],
        fr: [`Frictions mineures sur les finances ou les routines sous la Lune de ${name1} en ${tMoon1} et la Lune de ${name2} en ${tMoon2}.`, `Monotonie quotidienne s'il n'y a pas de renouvellement de l'affection.`]
      }[lang],
      compatibilidadeMessage: {
        pt: `Esta aliança matrimonial é dotada de grande estabilidade celestial e respeito duradouro. Há uma busca mútua por um futuro seguro e cumplicidade contínua.`,
        en: `This matrimonial alliance is endowed with great celestial stability and lasting respect. There is a mutual search for a secure future and continuous complicity.`,
        es: `Esta alianza matrimonial está dotada de una gran estabilidad celestial y respeto duradero. Hay una búsqueda mutua de un futuro seguro y complicidad continua.`,
        de: `Dieser Ehebund ist mit großer himmlischer Stabilität und dauerhaftem Respekt gesegnet. Es besteht das gegenseitige Streben nach einer sicheren Zukunft und kontinuierlicher Komplizenschaft.`,
        fr: `Cette alliance matrimoniale est dotée d'une grande stabilité céleste et d'un respect durable. Il y a une recherche mutuelle d'un avenir sûr et d'une complicité continue.`
      }[lang],
      conflitoMessage: {
        pt: `Os atritos matrimoniais vêm da monotonia da rotina ou da falta de renovação no romantismo cotidiano. Conversem com tom doce e carinho ativo.`,
        en: `Matrimonial friction comes from the monotony of routine or lack of renewal in daily romance. Speak with sweet tone and active affection.`,
        es: `Las fricciones matrimoniales provienen de la monotonía de la rutina o de la falta de renovación en el romance cotidiano. Hablen con tono dulce y cariño activo.`,
        de: `Ehestreitigkeiten entstehen durch die Monotonie des Alltags oder mangelnde Erneuerung der täglichen Romantik. Sprechen Sie mit süßem Ton und aktiver Zuneigung.`,
        fr: `Les frictions conjugales proviennent de la monotonie de la routine ou du manque de renouvellement dans le romantisme quotidien. Parlez avec un ton doux et une affection active.`
      }[lang],
      caracteristicasUnem: {
        pt: ["Desejo mútuo de construir um patrimônio e um lar duradouros.", "Cumplicidade profunda e apoio nos momentos de cansaço ou dúvida."],
        en: ["Mutual desire to build lasting assets and a home.", "Deep complicity and support during moments of fatigue or doubt."],
        es: ["Deseo mutuo de construir un patrimonio y un hogar duraderos.", "Complicidad profunda y apoyo en momentos de cansancio o duda."],
        de: ["Gegenseitiges Bestreben, dauerhaftes Vermögen und ein Heim aufzubauen.", "Tiefe Komplizenschaft und Unterstützung in Momenten der Müdigkeit oder des Zweifels."],
        fr: ["Désir mutuel de bâtir un patrimoine et un foyer durables.", "Complicité profonde et soutien dans les moments de fatigue ou de doute."]
      }[lang],
      caracteristicasAfastam: {
        pt: ["Esfriamento passageiro pelo acúmulo excessivo de obrigações externas.", "Cobranças ocultas sobre disciplina fiduciária e gastos domésticos."],
        en: ["Temporary cooling due to excessive accumulation of external obligations.", "Hidden demands regarding financial discipline and household spending."],
        es: ["Enfriamiento temporal por la acumulación excesiva de obligaciones externas.", "Exigencias ocultas sobre disciplina financiera y gastos domésticos."],
        de: ["Vorübergehende Abkühlung durch übermäßige Anhäufung externer Verpflichtungen.", "Verdeckte Forderungen bezüglich finanzieller Disziplin und Haushaltsausgaben."],
        fr: ["Refroidissement passager dû à l'accumulation excessive d'obligations externes.", "Exigences cachées concernant la discipline financière et les dépenses ménagères."]
      }[lang],
      routineLabel: { pt: "Convivência", en: "Cohabitation", es: "Convivencia", de: "Zusammenleben", fr: "Cohabitation" }[lang],
      routineDesc: {
        pt: `Planejamento de longo prazo e estabilidade patrimonial sob Sol em ${tSun1} e Lua em ${tMoon2}.`,
        en: `Long-term planning and asset stability under Sun in ${tSun1} and Moon in ${tMoon2}.`,
        es: `Planificación a largo plazo y estabilidad patrimonial bajo el Sol en ${tSun1} y la Luna en ${tMoon2}.`,
        de: `Langfristige Planung und Vermögensstabilität unter Sonne in ${tSun1} und Mond in ${tMoon2}.`,
        fr: `Planification à l'échelle d'une vie et stabilité patrimoniale sous le Soleil en ${tSun1} et la Lune en ${tMoon2}.`
      }[lang],
      label7Dias: {
        pt: "Momentos especiais para renovar o afeto íntimo e planejar jantares românticos.",
        en: "Special moments to renew intimate affection and plan romantic dinners.",
        es: "Momentos especiales para renovar el afecto íntimo y planificar cenas románticas.",
        de: "Besondere Momente, um die intime Zuneigung zu erneuern und romantische Abendessen zu planen.",
        fr: "Moments spéciaux pour renouveler l'affection intime et planifier des dîners romantiques."
      }[lang],
      label30Dias: {
        pt: "Excelente fase para alinhar as despesas mensais e estabelecer metas em conjunto.",
        en: "Excellent phase to align monthly expenses and establish goals together.",
        es: "Excelente fase para alinear los gastos mensuales y establecer metas juntos.",
        de: "Hervorragende Phase, um die monatlichen Ausgaben abzustimmen und gemeinsam Ziele festzulegen.",
        fr: "Excellente phase pour aligner les dépenses mensuelles et établir des objectifs ensemble."
      }[lang],
      label3Meses: {
        pt: "Amadurecimento da convivência sob ótimos auspícios de estabilidade doméstica.",
        en: "Maturing of cohabitation under excellent auspices of domestic stability.",
        es: "Maduración de la convivencia bajo excelentes auspicios de estabilidad doméstica.",
        de: "Reifung des Zusammenlebens unter hervorragenden Vorzeichen häuslicher Stabilität.",
        fr: "Approfondissement de la cohabitation sous d'excellents auspices de stabilité domestique."
      }[lang],
      label6Meses: {
        pt: "Fase oportuna para reformas na moradia ou investimentos matrimoniais de peso.",
        en: "Opportune phase for home renovations or major matrimonial investments.",
        es: "Fase oportuna para reformas en el hogar o inversiones matrimoniales de peso.",
        de: "Günstige Phase für Hausrenovierungen oder größere eheliche Investitionen.",
        fr: "Phase opportune pour des rénovations dans le foyer ou des investissements conjugaux importants."
      }[lang],
      label1Ano: {
        pt: "Consolidação de uma vida matrimonial estável, próspera e protegida de influências externas.",
        en: "Consolidation of a stable, prosperous matrimonial life protected from external influences.",
        es: "Consolidación de una vida matrimonial estable, próspera y protegida de influencias externas.",
        de: "Festigung eines stabilen, wohlhabenden Ehelebens, geschützt vor äußeren Einflüssen.",
        fr: "Consolidation d'une vie conjugale stable, prospère et protégée des influences extérieures."
      }[lang],
      dFavoraveisItems: {
        pt: [
          { icon: "💍", category: "Compromisso", description: "Solidez duradoura regida pela maturidade de Saturno." },
          { icon: "❤️", category: "Romance", description: "Aconchego e doçura mútua protegidos pela estrela de Vênus." }
        ],
        en: [
          { icon: "💍", category: "Commitment", description: "Long-lasting stability ruled by Saturn's maturity." },
          { icon: "❤️", category: "Romance", description: "Warmth and mutual sweetness protected by the star of Venus." }
        ],
        es: [
          { icon: "💍", category: "Compromiso", description: "Solidez duradera regida por la madurez de Saturno." },
          { icon: "❤️", category: "Romance", description: "Cálido y dulce afecto mutuo protegido por la estrella de Venus." }
        ],
        de: [
          { icon: "💍", category: "Verpflichtung", description: "Lang anhaltende Stabilität, regiert von Saturns Reife." },
          { icon: "❤️", category: "Romantik", description: "Wärme und gegenseitige Süße, geschützt vom Stern der Venus." }
        ],
        fr: [
          { icon: "💍", category: "Engagement", description: "Solidité durable régie par la maturité de Saturne." },
          { icon: "❤️", category: "Romance", description: "Chaleur et douceur mutuelles protégées par l'étoile de Vénus." }
        ]
      }[lang],
      dAtencaoItems: {
        pt: [{ category: "Monotonia", description: "Cuidado para não deixar que as rotinas cansativas apaguem o brilho do afeto." }],
        en: [{ category: "Monotony", description: "Take care not to let tiring routines fade the glow of affection." }],
        es: [{ category: "Monotonía", description: "Cuidado de no dejar que las rutinas agotadoras apaguen el brillo del afecto." }],
        de: [{ category: "Monotonie", description: "Achten Sie darauf, dass anstrengende Routinen den Glanz der Zuneigung nicht verblassen lassen." }],
        fr: [{ category: "Monotonie", description: "Attention à ne pas laisser les routines fatigantes éteindre l'éclat de l'affection." }]
      }[lang],
      vLongoPrazoItems: {
        pt: [{ category: "União", description: `Aliança matrimonial forte sob o brilho do Sol em ${tSun1} e Lua em ${tMoon2}.` }],
        en: [{ category: "Union", description: `Strong matrimonial alliance under the glow of Sun in ${tSun1} and Moon in ${tMoon2}.` }],
        es: [{ category: "Unión", description: `Alianza matrimonial fuerte bajo el brillo del Sol en ${tSun1} y la Luna en ${tMoon2}.` }],
        de: [{ category: "Einheit", description: `Starke eheliche Allianz unter dem Glanz der Sonne in ${tSun1} und dem Mond in ${tMoon2}.` }],
        fr: [{ category: "Union", description: `Alliance conjugale forte sous l'éclat du Soleil en ${tSun1} et de la Lune en ${tMoon2}.` }]
      }[lang],
      pOcultosItems: {
        pt: [{ category: "Cumplicidade", description: "Manter o diálogo focado no afeto e na escuta mútua." }],
        en: [{ category: "Complicity", description: "Keep dialogue focused on affection and mutual listening." }],
        es: [{ category: "Complicidad", description: "Mantener el diálogo centrado en el afecto y la escucha mutua." }],
        de: [{ category: "Komplizenschaft", description: "Halten Sie den Dialog auf Zuneigung und gegenseitiges Zuhören konzentriert." }],
        fr: [{ category: "Complicité", description: "Maintenir le dialogue centré sur l'affection et l'écoute mutuelle." }]
      }[lang],
      oQueFazer: {
        pt: ["Reservar tempo semanal para encontros românticos a sós.", "Planejar despesas e orçamentos de forma transparente."],
        en: ["Set aside weekly time for romantic dates alone.", "Plan expenses and budgets transparently."],
        es: ["Reservar tiempo semanal para citas románticas a solas.", "Planificar gastos y presupuestos de forma transparente."],
        de: ["Sich wöchentlich Zeit für romantische Verabredungen zu zweit nehmen.", "Ausgaben und Budgets transparent planen."],
        fr: ["Réserver du temps chaque semaine pour des rendez-vous romantiques à deux.", "Planifier les dépenses et les budgets de manière transparente."]
      }[lang],
      oQueEvitar: {
        pt: ["Discutir sobre orçamentos ou tarefas tarde da noite.", "Agir com teimosia excessiva em pequenos arranjos domésticos."],
        en: ["Discussing budgets or tasks late at night.", "Acting with excessive stubbornness in small domestic arrangements."],
        es: ["Discutir sobre presupuestos o tareas tarde en la noche.", "Actuar con terquedad excesiva en pequeños arreglos domésticos."],
        de: ["Spät in der Nacht über Budgets oder Aufgaben diskutieren.", "Mit übermäßiger Sturheit bei kleinen häuslichen Vereinbarungen handeln."],
        fr: ["Discuter des budgets ou des tâches tard dans la nuit.", "Agir avec une obstination excessive dans les petits arrangements domestiques."]
      }[lang],
      melhorarComunicacao: {
        pt: "Fale com tom doce e acolhedor para desarmar as tensões da rotina diária.",
        en: "Speak with a sweet and welcoming tone to disarm the tensions of the daily routine.",
        es: "Hable con un tono dulce y acogedor para desarmar las tensiones de la rutina diaria.",
        de: "Sprechen Sie mit einem süßen und einladenden Ton, um die Spannungen des Alltags zu entschärfen.",
        fr: "Parlez avec un ton doux et accueillant pour désarmer les tensions du quotidien."
      }[lang],
      reduzirConflitos: {
        pt: "Fazer uma pausa de 5 minutos antes de responder em discussões exaltadas.",
        en: "Take a 5-minute break before responding in heated discussions.",
        es: "Hacer una pausa de 5 minutos antes de responder en discusiones acaloradas.",
        de: "Machen Sie eine 5-minütige Pause, bevor Sie in hitzigen Diskussionen antworten.",
        fr: "Faire une pause de 5 minutes avant de répondre lors de discussions animées."
      }[lang],
      fortalecerConexao: {
        pt: "Elogiar o parceiro e expressar gratidão pelas pequenas atitudes cotidianas.",
        en: "Praise your partner and express gratitude for small daily actions.",
        es: "Elogiar a la pareja y expresar gratitud por las pequeñas acciones cotidianas.",
        de: "Loben Sie Ihren Partner und drücken Sie Dankbarkeit für kleine alltägliche Handlungen aus.",
        fr: "Féliciter votre partenaire et exprimer votre gratitude pour les petites attentions du quotidien."
      }[lang],
      influencia: {
        pt: `Neste momento, trânsitos favoráveis de Saturno em ${tSaturn1} atuam blindando decisões de longo prazo e organizando caminhos prósperos.`,
        en: `At this moment, favorable transits of Saturn in ${tSaturn1} act to shield long-term decisions and organize prosperous paths.`,
        es: `En este momento, tránsitos favorables de Saturno en ${tSaturn1} actúan protegiendo decisiones de largo plazo y organizando caminos prósperos.`,
        de: `In diesem Moment wirken günstige Transite des Saturns in ${tSaturn1}, um langfristige Entscheidungen zu schützen und wohlhabende Wege zu organisieren.`,
        fr: `En ce moment, des transits favorables de Saturne en ${tSaturn1} agissent pour protéger les décisions de long terme.`
      }[lang]
    };
  } else if (cat === 'partnership') {
    return {
      title: {
        pt: "Aliança de Negócios e Sociedade",
        en: "Business Alliance and Partnership",
        es: "Alianza de Negocios y Sociedad",
        de: "Geschäftsallianz und Partnerschaft",
        fr: "Alliance Commerciale et Société"
      }[lang],
      strength: {
        pt: [`Alinhamento estratégico impecável entre Mercúrio de ${name1} em ${tMercury1} e Saturno de ${name2} em ${tSaturn2}, gerando segurança jurídica.`, `Foco tático rigoroso e divisão inteligente de metas.`],
        en: [`Impeccable strategic alignment between Mercury of ${name1} in ${tMercury1} and Saturn of ${name2} in ${tSaturn2}, generating legal security.`, `Rigorous tactical focus and intelligent goal division.`],
        es: [`Alineación estratégica impecable entre Mercurio de ${name1} en ${tMercury1} y Saturno de ${name2} en ${tSaturn2}, generando seguridad jurídica.`, `Enfoque táctico riguroso y división inteligente de metas.`],
        de: [`Makellose strategische Ausrichtung zwischen Merkur von ${name1} in ${tMercury1} und Saturn von ${name2} in ${tSaturn2}, was Rechtssicherheit schafft.`, `Strenger taktischer Fokus und intelligente Aufgabenverteilung.`],
        fr: [`Alignement stratégique impeccable entre Mercure de ${name1} en ${tMercury1} et Saturne de ${name2} en ${tSaturn2}, créant une sécurité juridique.`, `Focus tactique rigoureux et répartition intelligente des objectifs.`]
      }[lang],
      attention: {
        pt: [`Necessidade de documentar todas as decisões de negócios para evitar ruídos contratuais sob Sol em ${tSun1} e Sol em ${tSun2}.`, `Cuidado para não agir com pressa em investimentos de risco.`],
        en: [`Need to document all business decisions to avoid contractual noises under Sun in ${tSun1} and Sun in ${tSun2}.`, `Take care not to act in haste on risky investments.`],
        es: [`Necesidad de documentar todas las decisiones comerciales para evitar ruidos contractuales bajo el Sol en ${tSun1} y el Sol en ${tSun2}.`, `Cuidado de no actuar con prisa en inversiones de riesgo.`],
        de: [`Notwendigkeit, alle geschäftlichen Entscheidungen zu dokumentieren, um vertragliche Störungen unter Sonne in ${tSun1} und Sonne in ${tSun2} zu vermeiden.`, `Vermeiden Sie voreiliges Handeln bei riskanten Investitionen.`],
        fr: [`Besoin de documenter toutes les décisions commerciales pour éviter des malentendus contractuels sous le Soleil en ${tSun1} et le Soleil en ${tSun2}.`, `Attention à ne pas agir à la hâte dans des investissements à risque.`]
      }[lang],
      conflito: {
        pt: [`Divergência sobre o rumo dos investimentos regulada por Marte de ${name1} em ${tMars1} e Marte de ${name2} em ${tMars2}.`, `Cuidado com discussões societárias acaloradas sobre detalhes operacionais.`],
        en: [`Divergence on the direction of investments regulated by Mars of ${name1} in ${tMars1} and Mars of ${name2} in ${tMars2}.`, `Beware of heated corporate discussions over operational details.`],
        es: [`Divergencia sobre el rumbo de las inversiones regulada por Marte de ${name1} en ${tMars1} y Marte de ${name2} en ${tMars2}.`, `Cuidado con discusiones societarias acaloradas sobre detalles operativos.`],
        de: [`Abweichungen bezüglich der Richtung von Investitionen, geregelt durch Mars von ${name1} in ${tMars1} und Mars von ${name2} in ${tMars2}.`, `Vorsicht vor hitzigen gesellschaftsrechtlichen Diskussionen über operative Details.`],
        fr: [`Divergences concernant l'orientation des investissements régulées par Mars de ${name1} en ${tMars1} et Mars de ${name2} en ${tMars2}.`, `Attention aux discussions de société animées sur les détails opérationnels.`]
      }[lang],
      compatibilidadeMessage: {
        pt: `A sociedade empresarial entre vocês apresenta bases muito promissoras de confiança e responsabilidade comercial compartilhada. Cada sócio traz uma competência tática vital para o negócio.`,
        en: `The business partnership between you has very promising bases of trust and shared commercial responsibility. Each partner brings a vital tactical competence to the business.`,
        es: `La alianza comercial entre ustedes presenta bases muy prometedoras de confianza y responsabilidad empresarial compartida. Cada socio aporta una competencia táctica vital para el negocio.`,
        de: `Die geschäftliche Partnerschaft zwischen Ihnen weist vielversprechende Grundlagen des Vertrauens und der gemeinsamen geschäftlichen Verantwortung auf. Jeder Partner bringt eine lebenswichtige taktische Kompetenz in das Unternehmen ein.`,
        fr: `Le partenariat commercial entre vous présente des bases très prometteuses de confiance et de responsabilité partagée. Chaque associé apporte une compétence tactique essentielle à l'entreprise.`
      }[lang],
      conflitoMessage: {
        pt: `Os atritos em sociedades surgem se houver falta de transparência financeira ou se as responsabilidades ficarem mal delimitadas no cotidiano operacional.`,
        en: `Friction in partnerships arises if there is a lack of financial transparency or if responsibilities are poorly defined in the daily operational routine.`,
        es: `Las fricciones en sociedades surgen si hay falta de transparencia financiera o si las responsabilidades quedan mal delimitadas en el cotidiano operativo.`,
        de: `Reibungen in Partnerschaften entstehen, wenn es an finanzieller Transparenz mangelt oder die Aufgaben im operativen Alltag schlecht abgegrenzt sind.`,
        fr: `Les frictions entre associés surviennent s'il y a un manque de transparence financière ou si les responsabilités sont mal délimitées dans le quotidien opérationnel.`
      }[lang],
      caracteristicasUnem: {
        pt: ["Confiança mútua inabalável na gestão e guarda de recursos.", "Alinhamento ético e clareza absoluta na divisão societária de lucros."],
        en: ["Unshakable mutual trust in the management and safekeeping of resources.", "Ethical alignment and absolute clarity in the corporate division of profits."],
        es: ["Confianza mutua inquebrantable en la gestión y custodia de recursos.", "Alineación ética y claridad absoluta en la división societaria de beneficios."],
        de: ["Unerschütterliches gegenseitiges Vertrauen bei der Verwaltung und Aufbewahrung von Ressourcen.", "Ethische Ausrichtung und absolute Klarheit bei der gesellschaftsrechtlichen Gewinnverteilung."],
        fr: ["Confiance mutuelle inébranlable dans la gestion et la conservation des ressources.", "Alignement éthique et clarté absolue dans la répartition des bénéfices."]
      }[lang],
      caracteristicasAfastam: {
        pt: ["Falta de clareza contratual em pequenos gastos ou retiradas financeiras.", "Choque de autoridade ao definir estratégias principais de crescimento."],
        en: ["Lack of contractual clarity in small expenses or financial withdrawals.", "Clash of authority when defining main growth strategies."],
        es: ["Falta de claridad contractual en pequeños gastos o retiros financieros.", "Choque de autoridad al definir estrategias principales de crecimiento."],
        de: ["Mangelnde vertragliche Klarheit bei kleinen Ausgaben oder finanziellen Entnahmen.", "Autoritätskonflikt bei der Festlegung der Hauptwachstumsstrategien."],
        fr: ["Manque de clarté contractuelle dans les petites dépenses ou les retraits financiers.", "Conflit d'autorité lors de la définition des principales stratégies de croissance."]
      }[lang],
      routineLabel: { pt: "Sociedade", en: "Partnership", es: "Sociedad", de: "Partnerschaft", fr: "Société" }[lang],
      routineDesc: {
        pt: `Gestão fiduciária coordenada e táticas de mercado guiadas pelo Ascendente em ${tAsc1}.`,
        en: `Coordinated financial management and market tactics guided by the Ascendant in ${tAsc1}.`,
        es: `Gestión financiera coordinada y tácticas de mercado guiadas por el Ascendente en ${tAsc1}.`,
        de: `Koordinierte finanzielle Führung und Markt-Taktiken, geleitet vom Aszendenten in ${tAsc1}.`,
        fr: `Gestion financière coordonnée et tactiques de marché guidées par l'Ascendant en ${tAsc1}.`
      }[lang],
      label7Dias: {
        pt: "Ideal para estruturar o planejamento de caixa semanal com rigor tático.",
        en: "Ideal for structuring the weekly cash planning with tactical rigor.",
        es: "Ideal para estructurar la planificación de caja semanal con rigor táctico.",
        de: "Ideal, um die wöchentliche Liquiditätsplanung mit taktischer Strenge zu strukturieren.",
        fr: "Idéal pour structurer la planification de trésorerie hebdomadaire avec rigueur tactique."
      }[lang],
      label30Dias: {
        pt: "Momento excelente para auditoria tática e conferência detalhada de balanços.",
        en: "Excellent time for tactical auditing and detailed balance sheet review.",
        es: "Excelente momento para auditoría táctica y revisión detallada de balances.",
        de: "Hervorragende Zeit für taktische Audits und detaillierte Bilanzprüfungen.",
        fr: "Excellent moment pour l'audit tactique et la vérification détaillée des bilans."
      }[lang],
      label3Meses: {
        pt: "Fase de formalização de parcerias e acordos comerciais estratégicos.",
        en: "Phase of formalizing partnerships and strategic business agreements.",
        es: "Fase de formalización de asociaciones y acuerdos comerciales estratégicos.",
        de: "Phase der Formalisierung von Partnerschaften und strategischen Geschäftsabkommen.",
        fr: "Phase de formalisation de partenariats et d'accords commerciaux stratégiques."
      }[lang],
      label6Meses: {
        pt: "Retorno fiduciário promissor sobre investimentos societários iniciais.",
        en: "Promising financial return on initial corporate investments.",
        es: "Retorno financiero prometedor de las inversiones societarias iniciales.",
        de: "Vielversprechende finanzielle Rendite auf anfängliche Gesellschaftsinvestitionen.",
        fr: "Retour financier prometteur sur les investissements initiaux de société."
      }[lang],
      label1Ano: {
        pt: "Balanço societário anual demonstrando solidez comercial de alta reputação.",
        en: "Annual corporate balance sheet demonstrating highly reputable commercial solidity.",
        es: "Balance empresarial anual que muestra solidez comercial de alta reputación.",
        de: "Jährliche Gesellschaftsbilanz, die geschäftliche Solidität von hohem Ansehen zeigt.",
        fr: "Bilan annuel d'associés démontrant une solidité commerciale de grande réputation."
      }[lang],
      dFavoraveisItems: {
        pt: [
          { icon: "🤝", category: "Aliança", description: "Excelente clareza para acordos societários sob Saturno." },
          { icon: "📊", category: "Auditoria", description: "Excelente clima para conferir relatórios de rendimento fiduciário." }
        ],
        en: [
          { icon: "🤝", category: "Alliance", description: "Excellent clarity for corporate agreements under Saturn." },
          { icon: "📊", category: "Auditing", description: "Excellent atmosphere for checking financial yield reports." }
        ],
        es: [
          { icon: "🤝", category: "Alianza", description: "Excelente claridad para acuerdos societarios bajo Saturno." },
          { icon: "📊", category: "Auditoría", description: "Excelente ambiente para revisar informes de rendimiento financiero." }
        ],
        de: [
          { icon: "🤝", category: "Allianz", description: "Hervorragende Klarheit für Gesellschaftsverträge unter Saturn." },
          { icon: "📊", category: "Prüfung", description: "Hervorragendes Klima zur Prüfung von Berichten über finanzielle Erträge." }
        ],
        fr: [
          { icon: "🤝", category: "Alliance", description: "Excellente clarté pour les accords d'associés sous Saturne." },
          { icon: "📊", category: "Audit", description: "Excellent climat pour vérifier les rapports de rendement financier." }
        ]
      }[lang],
      dAtencaoItems: {
        pt: [{ category: "Transparência", description: "Assegure que todas as decisões de investimentos fiquem documentadas." }],
        en: [{ category: "Transparency", description: "Ensure that all investment decisions are documented." }],
        es: [{ category: "Transparencia", description: "Asegure que todas las decisiones de inversión queden documentadas." }],
        de: [{ category: "Transparenz", description: "Stellen Sie sicher, dass alle Investitionsentscheidungen dokumentiert werden." }],
        fr: [{ category: "Transparence", description: "Assurez-vous que toutes les décisions d'investissement soient documentées." }]
      }[lang],
      vLongoPrazoItems: {
        pt: [{ category: "Sociedade", description: `Aliança forte guiada pelo Ascendente em ${tAsc1}.` }],
        en: [{ category: "Partnership", description: `Strong alliance guided by the Ascendant in ${tAsc1}.` }],
        es: [{ category: "Sociedad", description: `Alianza fuerte guiada por el Ascendente em ${tAsc1}.` }],
        de: [{ category: "Partnerschaft", description: `Starke Allianz, geleitet vom Aszendenten in ${tAsc1}.` }],
        fr: [{ category: "Société", description: `Alliance forte guidée par l'Ascendant en ${tAsc1}.` }]
      }[lang],
      pOcultosItems: {
        pt: [{ category: "Segurança", description: "Formalizar decisões societárias por escrito de forma transparente." }],
        en: [{ category: "Security", description: "Formalize corporate decisions in writing transparently." }],
        es: [{ category: "Seguridad", description: "Formalizar decisiones societarias por escrito de forma transparente." }],
        de: [{ category: "Sicherheit", description: "Formalisieren Sie Gesellschaftsentscheidungen schriftlich auf transparente Weise." }],
        fr: [{ category: "Sécurité", description: "Formaliser les décisions d'associés par écrit de manière transparente." }]
      }[lang],
      oQueFazer: {
        pt: ["Manter reuniões de balanço mensais organizadas.", "Delimitar as atribuições de cada sócio com clareza."],
        en: ["Maintain organized monthly balance meetings.", "Delimit each partner's duties with clarity."],
        es: ["Mantener reuniones de balance mensuales organizadas.", "Delimitar las atribuciones de cada socio con claridad."],
        de: ["Organisierte monatliche Bilanztreffen pflegen.", "Die Aufgaben jedes Partners klar abgrenzen."],
        fr: ["Maintenir des réunions de bilan mensuelles organisées.", "Délimiter les attributions de chaque associé avec clarté."]
      }[lang],
      oQueEvitar: {
        pt: ["Retiradas fiduciárias sem o devido consenso prévio.", "Misturar questões pessoais com decisões de diretoria."],
        en: ["Financial withdrawals without proper prior consensus.", "Mixing personal matters with board decisions."],
        es: ["Retiros financieros sin el debido consenso previo.", "Mezclar asuntos personales con decisiones de directorio."],
        de: ["Finanzielle Entnahmen ohne angemessenen vorherigen Konsens.", "Persönliche Angelegenheiten mit Vorstandsentscheidungen vermischen."],
        fr: ["Retraits financiers sans consensus préalable approprié.", "Mélanger des questions personnelles avec les décisions du conseil."]
      }[lang],
      melhorarComunicacao: {
        pt: "Apresente argumentos societários embasados em dados financeiros.",
        en: "Present corporate arguments based on financial data.",
        es: "Presente argumentos societarios basados en datos financieros.",
        de: "Präsentieren Sie gesellschaftsrechtliche Argumente basierend auf Finanzdaten.",
        fr: "Présentez des arguments de société basés sur des données financières."
      }[lang],
      reduzirConflitos: {
        pt: "Formalizar acordos societários por escrito em termos claros.",
        en: "Formalize corporate agreements in writing in clear terms.",
        es: "Formalizar acuerdos societarios por escrito en términos claros.",
        de: "Formalisieren Sie Gesellschaftsvereinbarungen schriftlich in klaren Begriffen.",
        fr: "Formaliser les accords d'associés par écrit en termes clairs."
      }[lang],
      fortalecerConexao: {
        pt: "Reconhecer e valorizar a dedicação técnica do seu parceiro comercial.",
        en: "Recognize and value your business partner's technical dedication.",
        es: "Reconocer y valorar la dedicación técnica de su socio comercial.",
        de: "Anerkennen und schätzen Sie das technische Engagement Ihres Geschäftspartners.",
        fr: "Reconnaître et valoriser l'engagement technique de votre partenaire commercial."
      }[lang],
      influencia: {
        pt: `Neste momento, trânsitos favoráveis de Saturno em ${tSaturn1} atuam blindando decisões de longo prazo e organizando caminhos prósperos.`,
        en: `At this moment, favorable transits of Saturn in ${tSaturn1} act to shield long-term decisions and organize prosperous paths.`,
        es: `En este momento, tránsitos favorables de Saturno en ${tSaturn1} actúan protegiendo decisões de longo prazo e organizando caminhos prósperos.`,
        de: `In diesem Moment wirken günstige Transite des Saturns in ${tSaturn1}, um langfristige Entscheidungen zu schützen und wohlhabende Wege zu organisieren.`,
        fr: `En ce moment, des transits favorables de Saturne en ${tSaturn1} agissent pour protéger les decisões.`
      }[lang]
    };
  } else {
    // default/family category
    return {
      title: {
        pt: "Harmonia e Convivência Familiar",
        en: "Harmony and Family Cohabitation",
        es: "Armonía y Convivencia Familiar",
        de: "Harmonie und familiäres Zusammenleben",
        fr: "Harmonie et Cohabitation Familiale"
      }[lang],
      strength: {
        pt: [`Conexão ancestral protetora e carinho guiado pela Lua de ${name1} em ${tMoon1} e de ${name2} em ${tMoon2}.`, `Apoio incondicional em momentos de necessidade.`],
        en: [`Protective ancestral connection and affection guided by Moon of ${name1} in ${tMoon1} and of ${name2} in ${tMoon2}.`, `Unconditional support in times of need.`],
        es: [`Conexión ancestral protectora y cariño guiado por la Luna de ${name1} en ${tMoon1} y de ${name2} en ${tMoon2}.`, `Apoyo incondicional en momentos de necesidad.`],
        de: [`Schützende überlieferte Verbindung und Zuneigung, geleitet vom Mond von ${name1} in ${tMoon1} und von ${name2} in ${tMoon2}.`, `Bedingungslose Unterstützung in Zeiten der Not.`],
        fr: [`Connexion ancestrale protectrice et affection guidées par la Lune de ${name1} en ${tMoon1} et de ${name2} en ${tMoon2}.`, `Soutien inconditionnel en cas de besoin.`]
      }[lang],
      attention: {
        pt: [`Suscetibilidade emocional ou excesso de cobranças informais sob Sol em ${tSun1} e Sol em ${tSun2}.`, `Cuidado para não alimentar silêncios ressentidos.`],
        en: [`Emotional susceptibility or excess of informal demands under Sun in ${tSun1} and Sun in ${tSun2}.`, `Beware of nurturing resentful silences.`],
        es: [`Susceptibilidad emocional o exceso de exigencias informales bajo el Sol en ${tSun1} y el Sol en ${tSun2}.`, `Cuidado de no alimentar silencios resentidos.`],
        de: [`Emotionale Empfindlichkeit oder übermäßige informelle Forderungen unter Sonne in ${tSun1} und Sonne in ${tSun2}.`, `Vorsicht vor nachtragendem Schweigen.`],
        fr: [`Sensibilité émotionnelle ou excès d'exigences informelles sous le Soleil en ${tSun1} et le Soleil en ${tSun2}.`, `Attention à ne pas nourrir de silences rancuniers.`]
      }[lang],
      conflito: {
        pt: [`Choques na rotina de casa ou intromissão em decisões pessoais regulados por Marte de ${name1} em ${tMars1}.`, `Divergência sutil sobre arranjos domésticos.`],
        en: [`Clashes in the home routine or interference in personal decisions regulated by Mars of ${name1} in ${tMars1}.`, `Subtle divergence over domestic arrangements.`],
        es: [`Choques en la rutina del hogar o intromisión en decisiones personales regulados por Marte de ${name1} en ${tMars1}.`, `Divergencia sutil sobre arreglos domésticos.`],
        de: [`Zusammenstöße im Alltag oder Einmischung in persönliche Entscheidungen, geregelt durch Mars von ${name1} in ${tMars1}.`, `Subtile Meinungsverschiedenheiten über häusliche Vorkehrungen.`],
        fr: [`Heurts dans la routine de la maison ou ingérence dans les décisions personnelles régulés par Mars de ${name1} en ${tMars1}.`, `Divergence subtile sur les arrangements domestiques.`]
      }[lang],
      compatibilidadeMessage: {
        pt: `Sua dinâmica familiar é fundamentada no acolhimento mútuo e na construção de um lar seguro. A presença um do outro traz conforto e sentimento de pertencimento.`,
        en: `Your family dynamic is based on mutual welcoming and building a safe home. Each other's presence brings comfort and a sense of belonging.`,
        es: `Su dinámica familiar se fundamenta en la acogida mutua y la construcción de un hogar seguro. La presencia mutua aporta consuelo y pertenencia.`,
        de: `Ihre Familiendynamik basiert auf gegenseitiger Aufnahme und dem Aufbau eines sicheren Heims. Die gegenseitige Gegenwart bringt Trost und Zugehörigkeit.`,
        fr: `Votre dynamique familiale repose sur l'accueil mutuel et la construction d'un foyer sûr. La présence mutuelle apporte réconfort et sentiment d'appartenance.`
      }[lang],
      conflitoMessage: {
        pt: `Discussões familiares surgem por pequenas divergências em costumes diários ou intromissão em assuntos de escolha pessoal.`,
        en: `Family discussions arise from small differences in daily customs or interference in matters of personal choice.`,
        es: `Las discusiones familiares surgen por pequeñas divergencias en costumbres diarias o intromisión en asuntos de elección personal.`,
        de: `Familiäre Diskussionen entstehen durch kleine Unterschiede im Alltag oder Einmischung in Angelegenheiten der persönlichen Wahl.`,
        fr: `Les discussions familiales surviennent en raison de petites divergences dans les coutumes quotidiennes ou d'une ingérence dans les choix personnels.`
      }[lang],
      caracteristicasUnem: {
        pt: ["Forte senso de responsabilidade mútua e apoio em crises.", "Apreço compartilhado por reuniões de família e tradições comuns."],
        en: ["Strong sense of mutual responsibility and support in crises.", "Shared appreciation for family gatherings and common traditions."],
        es: ["Fuerte sentido de responsabilidad mutua y apoyo en momentos de crisis.", "Aprecio compartido por reuniones familiares y tradiciones comunes."],
        de: ["Starkes Gefühl gegenseitiger Verantwortung und Unterstützung in Krisen.", "Gemeinsame Wertschätzung für Familientreffen und gemeinsame Traditionen."],
        fr: ["Fort sentiment de responsabilité mutuelle et soutien en cas de crise.", "Appréciation partagée des réunions de famille et des traditions communes."]
      }[lang],
      caracteristicasAfastam: {
        pt: ["Cobranças excessivas baseadas em expectativas familiares antigas.", "Disputas por privacidade ou espaço pessoal dentro do lar."],
        en: ["Excessive demands based on old family expectations.", "Disputes over privacy or personal space within the home."],
        es: ["Exigencias excesivas basadas en antiguas expectativas familiares.", "Disputas por privacidad o espacio personal dentro del hogar."],
        de: ["Übermäßige Forderungen basierend auf alten Familienerwartungen.", "Streitigkeiten über Privatsphäre oder persönlichen Raum im Heim."],
        fr: ["Exigences collectives basées sur d'anciennes attentes familiales.", "Disputes pour la vie privée ou l'espace personnel au sein du foyer."]
      }[lang],
      routineLabel: { pt: "Família", en: "Family", es: "Familia", de: "Familie", fr: "Famille" }[lang],
      routineDesc: {
        pt: `Cuidado compartilhado e bem-estar do lar baseado no Ascendente em ${tAsc1}.`,
        en: `Shared care and home well-being based on the Ascendant in ${tAsc1}.`,
        es: `Cuidado compartido y bienestar del hogar basado en el Ascendente en ${tAsc1}.`,
        de: `Gemeinsame Fürsorge und Wohlbefinden im Heim, basierend auf dem Aszendenten in ${tAsc1}.`,
        fr: `Soin partagé et bien-être du foyer basés sur l'Ascendant en ${tAsc1}.`
      }[lang],
      label7Dias: {
        pt: "Excelente clima para reuniões calorosas ou jantares calmos com familiares.",
        en: "Excellent atmosphere for warm gatherings or quiet dinners with family members.",
        es: "Excelente ambiente para reuniones cálidas o cenas tranquilas con familiares.",
        de: "Hervorragende Atmosphäre für herzliche Treffen oder ruhige Abendessen mit Familienmitgliedern.",
        fr: "Excellente ambiance pour des réunions chaleureuses ou des dîners calmes avec les membres de la famille."
      }[lang],
      label30Dias: {
        pt: "Ideal para organizar o lar e arrumar pendências domésticas simples.",
        en: "Ideal to organize the home and sort out simple domestic tasks.",
        es: "Ideal para organizar el hogar y resolver tareas domésticas sencillas.",
        de: "Ideal, um das Heim zu organisieren und einfache häusliche Dinge zu regeln.",
        fr: "Idéal pour organiser le foyer et régler les tâches ménagères simples."
      }[lang],
      label3Meses: {
        pt: "Fase de fortalecimento dos laços afetivos e suporte mútuo em decisões difíceis.",
        en: "Phase of strengthening emotional bonds and mutual support in hard decisions.",
        es: "Fase de fortalecimiento de los lazos afectivos y apoyo mutuo en decisiones difíciles.",
        de: "Phase der Stärkung emotionaler Bindungen und gegenseitiger Unterstützung bei schwierigen Entscheidungen.",
        fr: "Phase de renforcement des liens affectifs et de soutien mutuel dans les décisions difficiles."
      }[lang],
      label6Meses: {
        pt: "Melhorias estruturais na moradia ou celebrações familiares em destaque.",
        en: "Structural improvements in the home or family celebrations in focus.",
        es: "Mejoras estructurales en el hogar o celebraciones familiares destacadas.",
        de: "Strukturelle Verbesserungen im Heim oder Familienfeiern im Fokus.",
        fr: "Améliorations structurelles du foyer ou célébrations familiales à l'honneur."
      }[lang],
      label1Ano: {
        pt: "Sólida harmonia familiar, promovendo paz e união profunda no lar.",
        en: "Solid family harmony, promoting peace and deep unity in the home.",
        es: "Sólida armonía familiar, promoviendo paz y unión profunda en el hogar.",
        de: "Solide familiäre Harmonie, die Frieden und tiefe Einheit im Heim fördert.",
        fr: "Solide harmonie familiale, favorisant la paix et une union profonde au sein du foyer."
      }[lang],
      dFavoraveisItems: {
        pt: [
          { icon: "🏠", category: "Harmonia", description: "Conforto doméstico regido pelo afeto familiar da Lua." },
          { icon: "🍲", category: "União", description: "Almoços e encontros acolhedores sob excelente aspecto." }
        ],
        en: [
          { icon: "🏠", category: "Harmony", description: "Domestic comfort ruled by the family affection of the Moon." },
          { icon: "🍲", category: "Union", description: "Warm lunches and gatherings under an excellent aspect." }
        ],
        es: [
          { icon: "🏠", category: "Armonía", description: "Confort doméstico regido por el afecto familiar de la Luna." },
          { icon: "🍲", category: "Unión", description: "Almuerzos y encuentros acogedores bajo un excelente aspecto." }
        ],
        de: [
          { icon: "🏠", category: "Harmonie", description: "Häuslicher Komfort, regiert von der familiären Zuneigung des Mondes." },
          { icon: "🍲", category: "Gemeinschaft", description: "Gemütliche Mittagessen und Treffen unter hervorragenden Aspekten." }
        ],
        fr: [
          { icon: "🏠", category: "Harmonie", description: "Confort de vie domestique régi par l'affection de la Lune." },
          { icon: "🍲", category: "Union", description: "Repas chaleureux et rencontres sous d'excellents auspices." }
        ]
      }[lang],
      dAtencaoItems: {
        pt: [{ category: "Cobranças", description: "Evite reviver mágoas passadas ou discussões por costumes antigos." }],
        en: [{ category: "Demands", description: "Avoid reviving past grievances or discussions over old customs." }],
        es: [{ category: "Exigencias", description: "Evite revivir agravios pasados o discusiones por costumbres antiguas." }],
        de: [{ category: "Forderungen", description: "Vermeiden Sie es, vergangene Kränkungen oder Diskussionen über alte Bräuche wieder aufleben zu lassen." }],
        fr: [{ category: "Exigences", description: "Évitez de raviver de vieux griefs ou des discussions sur des coutumes anciennes." }]
      }[lang],
      vLongoPrazoItems: {
        pt: [{ category: "Acolhimento", description: `Laços de alma estáveis guiados por Lua em ${tMoon1} e Lua em ${tMoon2}.` }],
        en: [{ category: "Welcoming", description: `Stable soul bonds guided by Moon in ${tMoon1} and Moon in ${tMoon2}.` }],
        es: [{ category: "Acogida", description: `Lazos de alma estables guiados por la Luna en ${tMoon1} y la Luna en ${tMoon2}.` }],
        de: [{ category: "Geborgenheit", description: `Stabile Seelenbindungen, geleitet vom Mond in ${tMoon1} und Mond in ${tMoon2}.` }],
        fr: [{ category: "Accueil", description: `Liens d'âme stables guidés par la Lune en ${tMoon1} et la Lune en ${tMoon2}.` }]
      }[lang],
      pOcultosItems: {
        pt: [{ category: "Pertencimento", description: "Cultivar o respeito ao espaço individual de cada familiar." }],
        en: [{ category: "Belonging", description: "Cultivate respect for each family member's individual space." }],
        es: [{ category: "Pertenencia", description: "Cultivar el respeto al espacio individual de cada familiar." }],
        de: [{ category: "Zugehörigkeit", description: "Kultivieren Sie Respekt für den individuellen Raum jedes Familienmitglieds." }],
        fr: [{ category: "Appartenance", description: "Cultiver le respect de l'espace individuel de chaque membre de la famille." }]
      }[lang],
      oQueFazer: {
        pt: ["Praticar refeições compartilhadas com boa conversa.", "Ajudar nas tarefas cotidianas sem precisar de pedidos."],
        en: ["Practice shared meals with good conversation.", "Help with daily chores without being asked."],
        es: ["Practicar comidas compartidas con buena conversación.", "Ayudar en las tareas cotidianas sin necesidad de peticiones."],
        de: ["Gemeinsame Mahlzeiten mit guten Gesprächen pflegen.", "Helfen Sie bei alltäglichen Aufgaben, ohne darum gebeten zu werden."],
        fr: ["Partager des repas conviviaux avec de bonnes discussions.", "Aider aux tâches quotidiennes sans qu'on vous le demande."]
      }[lang],
      oQueEvitar: {
        pt: ["Trazer discussões de trabalho para o ambiente do lar.", "Impor opiniões pessoais na vida de outros parentes."],
        en: ["Bringing work discussions into the home environment.", "Imposing personal opinions on the lives of other relatives."],
        es: ["Traer discusiones de trabajo al ambiente del hogar.", "Imponer opiniones personales en la vida de otros familiares."],
        de: ["Berufliche Diskussionen in die häusliche Umgebung bringen.", "Anderen Verwandten persönliche Meinungen aufzwingen."],
        fr: ["Apporter des discussions de travail dans l'environnement familial.", "Imposer des opinions personnelles dans la vie des autres parents."]
      }[lang],
      melhorarComunicacao: {
        pt: "Expresse carinho e escuta ativa de forma contínua no lar.",
        en: "Express affection and active listening continuously at home.",
        es: "Exprese cariño y escucha activa de forma continua en el hogar.",
        de: "Drücken Sie Zuneigung und aktives Zuhören im Heim kontinuierlich aus.",
        fr: "Exprimez de l'affection et une écoute active en continu au foyer."
      }[lang],
      reduzirConflitos: {
        pt: "Dar espaço para que cada um se expresse sem julgamento prévio.",
        en: "Give space for everyone to express themselves without prior judgment.",
        es: "Dar espacio para que cada uno se exprese sin juzgamiento previo.",
        de: "Geben Sie jedem Raum, sich ohne vorheriges Urteil auszudrücken.",
        fr: "Donner de l'espace pour que chacun s'exprime sans jugement préalable."
      }[lang],
      fortalecerConexao: {
        pt: "Criar momentos de lazer familiar totalmente sem telas ou celulares.",
        en: "Create family leisure moments completely screen and phone-free.",
        es: "Criar momentos de lazer familiar totalmente sem telas ou celulares.",
        de: "Schaffen Sie Freizeitbündnisse in der Familie völlig ohne Bildschirme oder Handys.",
        fr: "Créer des moments de loisirs familiaux totalement sans écrans ni téléphones."
      }[lang],
      influencia: {
        pt: `Neste momento, trânsitos favoráveis de Saturno em ${tSaturn1} atuam blindando decisões de longo prazo e organizando caminhos prósperos.`,
        en: `At this moment, favorable transits of Saturn in ${tSaturn1} act to shield long-term decisions and organize prosperous paths.`,
        es: `En este momento, tránsitos favorables de Saturno en ${tSaturn1} actúan protegiendo decisiones de largo plazo y organizando caminos prósperos.`,
        de: `In diesem Moment wirken günstige Transite des Saturns in ${tSaturn1}, um langfristige Entscheidungen zu schützen und wohlhabende Wege zu organisieren.`,
        fr: `En ce moment, des transits favorables de Saturne en ${tSaturn1} agissent pour protéger les decisões.`
      }[lang]
    };
  }
}

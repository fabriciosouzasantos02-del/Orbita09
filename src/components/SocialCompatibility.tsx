import React, { useState, useEffect } from 'react';
import { 
  Heart, Users, Sparkles, UserPlus, UserMinus, ShieldAlert, 
  MapPin, Award, Check, TrendingUp, RefreshCw, MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';

const localSocialTranslations: Record<Exclude<Language, 'pt'>, Record<string, string>> = {
  en: {
    // cities
    "São Paulo, SP": "São Paulo, SP",
    "Rio de Janeiro, RJ": "Rio de Janeiro, RJ",
    "Curitiba, PR": "Curitiba, PR",
    "Belo Horizonte, MG": "Belo Horizonte, MG",
    "Salvador, BA": "Salvador, BA",
    "Porto Alegre, RS": "Porto Alegre, RS",
    "Recife, PE": "Recife, PE",
    "Campinas, SP": "Campinas, SP",
    
    // bios
    "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.": "Lover of harmony, air constellations, and minimalist design. Seeking smart and sincere exchanges.",
    "Curioso por natureza, baterista e leitor voror de ficção. Sagitário me move a buscar novos horizontes.": "Curious by nature, drummer, and avid fiction reader. Sagittarius moves me to seek new horizons.",
    "Curioso por natureza, baterista e leitor voraz de ficção. Sagitário me move a buscar novos horizontes.": "Curious by nature, drummer, and avid fiction reader. Sagittarius moves me to seek new horizons.",
    "Vivendo guiata pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Living guided by optimism and Jupiter's spiritual expansion. Trails, photography, and specialty coffees.",
    "Vivendo guiadora pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Living guided by optimism and Jupiter's spiritual expansion. Trails, photography, and specialty coffees.",
    "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.": "Social entrepreneur, amateur astronomer, and developer. A friend above all, idealist to the extreme.",
    "Fogo cardeal motivada a criar projetos inovadores. Amo praias quentes, shows ao vivo e meditação áurica.": "Cardinal fire motivated to create innovative projects. I love warm beaches, live shows, and auric meditation.",
    "Apaixonado por teatro, vinhos e conversas profundas sobre destino. Busco conexões que façam brilhar o Sol.": "Passionate about theater, wine, and deep conversations about destiny. I seek connections that make the Sun shine.",
    "Amante da gastronomia, conforto material do lar e boas discussões de negócios sustentáveis.": "Lover of gastronomy, material comfort at home, and good discussions on sustainable business.",
    "Arquiteto na busca da proporção áurea material e social. Conciliador nas horas vagas e fã de vinis.": "Architect in search of the material and social golden ratio. Conciliator in his spare time and fan of vinyl records.",
    
    // Compatibility summary texts
    "Sinergia de Ar tríplice extraordinária. O diálogo flui sem amarras teológicas, compartilhando uma visão humanitária idêntica.": "Extraordinary triple Air synergy. Dialogue flows without theological constraints, sharing an identical humanitarian vision.",
    "Conexão intelectual efervescente. Estimulação mútua fantástica e ausência completa de cobranças materiais limitantes.": "Effervescent intellectual connection. Fantastic mutual stimulation and complete absence of limiting material demands.",
    "Aventura idealista e filosófica sem fronteiras. Júpiter expande o desejo de independência mútua de Aquário de forma magnífica.": "Idealistic and philosophical adventure without borders. Jupiter expands Aquarius's desire for mutual independence magnificently.",
    "Dinamismo e iniciativa entusiasmados. O fogo de Áries fornece a faísca e a força realizadora que as grandes utopias de Aquário necessitam.": "Enthusiastic dynamism and initiative. The fire of Aries provides the spark and creating force that the great utopias of Aquarius need.",
    "Estreito canal relacional moldado pelo respeito ao espaço individual e curiosidade intelectual mútua inovadora.": "Narrow relational channel shaped by respect for individual space and innovative mutual intellectual curiosity.",
    "Harmonia celeste sintonizada com alto teor de compatibilidade espiritual sob o elemento correspondente.": "Celestial harmony tuned with high spiritual compatibility under the corresponding element.",

    // General UI texts
    "Membros Ativos em Destaque": "Featured Active Members",
    "Notas de Atividades Sociais em Tempo Real": "Real-time Social Activity Notes",
    "Conexão Ativa": "Active Connection",
    "Ajustando perfil...": "Adjusting profile...",
    "Sem bio editada...": "No bio edited...",
    "Origem Oculta": "Hidden Origin",
    "Sol em": "Sun in",
    "Origem:": "Origin:",
    "Destaque de Sinergia": "Synergy Highlight",
    "Sinergia": "Synergy",
    "Trabalho": "Work",
    "Energia": "Energy",
    "Sol": "Sun",
    "Pessoas Compatíveis Com Você": "People Compatible With You",
    "Indivíduos em ressonância geométrica de nascimento sintonizados com seu Sol em": "Individuals in geometric birth resonance tuned to your Sun in",
    "Sintonizando...": "Tuning...",
    "Recarregar": "Reload",
    "Atualizar sugestões do Star Map": "Update Star Map suggestions",
    "Novos Mapas Hoje": "New Maps Today",
    "realizados": "done",
    "Sinastrias Avaliadas": "Synastries Evaluated",
    "sinergias": "synergies",
    "Leituras de Tarô": "Tarot Readings",
    "consultas": "consultations",
    "Sonhos Interpretados": "Dreams Interpreted",
    "revelações": "revelations",
    "Curtido": "Liked",
    "Curtir": "Like",
    "Seguindo": "Following",
    "Seguir": "Follow",
    "Ver": "View",
    "Afinidades e Ressonâncias Celestiais": "Celestial Affinities and Resonances",
    "Afinidade Amorosa & Sentimental": "Romantic & Emotional Affinity",
    "Afinidade Intelectual & Mental": "Intellectual & Mental Affinity",
    "Ressonância Energética & Áurica": "Energetic & Auric Resonance",
    "Sinergia Profissional & Conquistas": "Professional Synergy & Achievements",
    "Pontos Fortes da Conexão:": "Connection Strengths:",
    "Convergência sublime de pensamentos voltados ao progresso tecnológico e social. Ideais compartilhados livres de possessividade ou ciúmes históricos sufocantes.": "Sublime convergence of thoughts focused on technological and social progress. Shared ideals free of possessiveness or suffocating historical jealousy.",
    "Pontos de Atenção (Cuidado):": "Points of Attention (Caution):",
    "O excesso de intelectualização pode às vezes minar a intimidade física calorosa e a escuta visceral de afetos espontâneos no cotidiano.": "Excessive intellectualization can sometimes undermine warm physical intimacy and visceral listening of spontaneous affections in daily life.",
    "Concluir Análise": "Complete Analysis",
    "Pontos Fortes da Conexão": "Connection Strengths",
    "Pontos de Atenção (Cuidado)": "Points of Attention (Caution)"
  },
  es: {
    "São Paulo, SP": "São Paulo, SP",
    "Rio de Janeiro, RJ": "Río de Janeiro, RJ",
    "Curitiba, PR": "Curitiba, PR",
    "Belo Horizonte, MG": "Belo Horizonte, MG",
    "Salvador, BA": "Salvador, BA",
    "Porto Alegre, RS": "Porto Alegre, RS",
    "Recife, PE": "Recife, PE",
    "Campinas, SP": "Campinas, SP",
    
    "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.": "Amante de la armonía, constelaciones de aire y diseño minimalista. Busco intercambios inteligentes y sinceros.",
    "Curioso por natureza, baterista e leitor voror de ficção. Sagitário me move a buscar novos horizontes.": "Curioso por naturaleza, baterista y ávido lector de ficción. Sagitario me mueve a buscar nuevos horizontes.",
    "Curioso por natureza, baterista e leitor voraz de ficção. Sagitário me move a buscar novos horizontes.": "Curioso por naturaleza, baterista y ávido lector de ficción. Sagitario me mueve a buscar nuevos horizontes.",
    "Vivendo guiata pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Viviendo guiada por el optimismo y la expansión espiritual de Júpiter. Senderismo, fotografía y cafés especiales.",
    "Vivendo guiadora pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Viviendo guiada por el optimismo y la expansión espiritual de Júpiter. Senderismo, fotografía y cafés especiales.",
    "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.": "Emprendedor social, astrónomo aficionado y desarrollador. Amigo ante todo, idealista al extremo.",
    "Fogo cardeal motivada a criar projetos inovadores. Amo praias quentes, shows ao vivo e meditação áurica.": "Fuego cardinal motivado para crear proyectos innovadores. Amo las playas cálidas, los espectáculos en vivo y la meditación áurica.",
    "Apaixonado por teatro, vinhos e conversas profundas sobre destino. Busco conexões que façam brilhar o Sol.": "Apasionado por el teatro, los vinos y las conversaciones profundas sobre el destino. Busco conexiones que hagan brillar al Sol.",
    "Amante da gastronomia, conforto material do lar e boas discussões de negócios sustentáveis.": "Amante de la gastronomía, del confort material del hogar y de los buenos debates sobre negocios sostenibles.",
    "Arquiteto na busca da proporção áurea material e social. Conciliador nas horas vagas e fã de vinis.": "Arquitecto en busca de la proporción áurea material y social. Conciliador en su tiempo libre y fanático de los vinilos.",
    
    "Sinergia de Ar tríplice extraordinária. O diálogo flui sem amarras teológicas, compartilhando uma visão humanitária idêntica.": "Sinergia extraordinaria de triple Aire. El diálogo fluye sin ataduras teológicas, compartiendo una visión humanitaria idéntica.",
    "Conexão intelectual efervescente. Estimulação mútua fantástica e ausência completa de cobranças materiais limitantes.": "Conexión intelectual efervescente. Estimulación mutua fantástica y ausencia total de demandas materiales limitantes.",
    "Aventura idealista e filosófica sem fronteiras. Júpiter expande o desejo de independência mútua de Aquário de forma magnífica.": "Aventura idealista y filosófica sin fronteras. Júpiter expande magníficamente el deseo de independencia mutua de Acuario.",
    "Dinamismo e iniciativa entusiasmados. O fogo de Áries fornece a faísca e a força realizadora que as grandes utopias de Aquário necessitam.": "Dinamismo e iniciativa entusiastas. El fuego de Aries proporciona la chispa y la fuerza creadora que las grandes utopías de Acuario necesitan.",
    "Estreito canal relacional moldado pelo respeito ao espaço individual e curiosidade intelectual mútua inovadora.": "Estrecho canal relacional moldeado por el respeto al espacio individual y una curiosidad intelectual mutua e innovadora.",
    "Harmonia celeste sintonizada com alto teor de compatibilidade espiritual sob o elemento correspondente.": "Armonía celeste en sintonía con una alta compatibilidad espiritual bajo el elemento correspondiente.",

    "Membros Ativos em Destaque": "Miembros Activos Destacados",
    "Notas de Atividades Sociais em Tempo Real": "Notas de Actividades Sociales en Tiempo Real",
    "Conexão Ativa": "Conexión Activa",
    "Ajustando perfil...": "Ajustando perfil...",
    "Sem bio editada...": "Sin biografía editada...",
    "Origem Oculta": "Origen Oculto",
    "Sol em": "Sol en",
    "Origem:": "Origen:",
    "Destaque de Sinergia": "Destacado de Sinergia",
    "Sinergia": "Sinergia",
    "Trabalho": "Trabajo",
    "Energia": "Energía",
    "Sol": "Sol",
    "Pessoas Compatíveis Com Você": "Personas Compatibles Contigo",
    "Indivíduos em ressonância geométrica de nascimento sintonizados com seu Sol em": "Individuos en resonancia geométrica de nacimiento sintonizados con tu Sol en",
    "Sintonizando...": "Sintonizando...",
    "Recarregar": "Recargar",
    "Atualizar sugestões do Star Map": "Actualizar sugerencias del Star Map",
    "Novos Mapas Hoje": "Nuevos Mapas Hoy",
    "realizados": "realizados",
    "Sinastrias Avaliadas": "Sinastrías Evaluadas",
    "sinergias": "sinergias",
    "Leituras de Tarô": "Lecturas de Tarot",
    "consultas": "consultas",
    "Sonhos Interpretados": "Sueños Interpretados",
    "revelações": "revelaciones",
    "Curtido": "Le gusta",
    "Curtir": "Gusta",
    "Seguindo": "Siguiendo",
    "Seguir": "Seguir",
    "Ver": "Ver",
    "Afinidades e Ressonâncias Celestiais": "Afinidades y Resonancias Celestiales",
    "Afinidade Amorosa & Sentimental": "Afinidad Amorosa y Sentimental",
    "Afinidade Intelectual & Mental": "Afinidad Intelectual y Mental",
    "Ressonância Energética & Áurica": "Resonancia Energética y Áurica",
    "Sinergia Profissional & Conquistas": "Sinergia Profesional y Logros",
    "Pontos Fortes da Conexão:": "Fortalezas de la Conexión:",
    "Convergência sublime de pensamentos voltados ao progresso tecnológico e social. Ideais compartilhados livres de possessividade ou ciúmes históricos sufocantes.": "Convergencia sublime de pensamientos orientados al progreso tecnológico y social. Ideales compartidos libres de posesividad o celos históricos asfixiantes.",
    "Pontos de Atenção (Cuidado):": "Puntos de Atención (Cuidado):",
    "O excesso de intelectualização pode às vezes minar a intimidade física calorosa e a escuta visceral de afetos espontâneos no cotidiano.": "La intelectualización excesiva a veces puede socavar la cálida intimidad física y la escucha visceral de los afectos espontáneos en la vida cotidiana.",
    "Concluir Análise": "Completar Análisis",
    "Pontos Fortes da Conexão": "Fortalezas de la Conexión",
    "Pontos de Atenção (Cuidado)": "Puntos de Atención (Cuidado)"
  },
  fr: {
    "São Paulo, SP": "São Paulo, SP",
    "Rio de Janeiro, RJ": "Rio de Janeiro, RJ",
    "Curitiba, PR": "Curitiba, PR",
    "Belo Horizonte, MG": "Belo Horizonte, MG",
    "Salvador, BA": "Salvador, BA",
    "Porto Alegre, RS": "Porto Alegre, RS",
    "Recife, PE": "Recife, PE",
    "Campinas, SP": "Campinas, SP",
    
    "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.": "Amoureux de l'harmonie, des constellations de l'air et du design minimaliste. Je recherche des échanges intelligents et sincères.",
    "Curioso por natureza, baterista e leitor voror de ficção. Sagitário me move a buscar novos horizontes.": "Curieux de nature, batteur et lecteur avide de fiction. Le Sagittaire me pousse à rechercher de nouveaux horizons.",
    "Curioso por natureza, baterista e leitor voraz de ficção. Sagitário me move a buscar novos horizontes.": "Curieux de nature, batteur et lecteur avide de fiction. Le Sagittaire me pousse à rechercher de nouveaux horizons.",
    "Vivendo guiata pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Vivant guidé par l'optimisme et l'expansion spirituelle de Jupiter. Randonnées, photographie et cafés de spécialité.",
    "Vivendo guiadora pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Vivant guidé par l'optimisme et l'expansion spirituelle de Jupiter. Randonnées, photographie et cafés de spécialité.",
    "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.": "Entrepreneur social, astronome amateur et développeur. Un ami avant tout, idéaliste à l'extrême.",
    "Fogo cardeal motivada a criar projetos inovadores. Amo praias quentes, shows ao vivo e meditação áurica.": "Feu cardinal motivé pour créer des projets innovants. J'aime les plages chaudes, les concerts et la méditation aurique.",
    "Apaixonado por teatro, vinhos e conversas profundas sobre destino. Busco conexões que façam brilhar o Sol.": "Passionné de théâtre, de vins et de conversations profondes sur le destin. Je recherche des connexions qui font briller le Soleil.",
    "Amante da gastronomia, conforto material do lar e boas discussões de negócios sustentáveis.": "Amateur de gastronomie, de confort matériel de la maison et de bonnes discussions sur le commerce durable.",
    "Arquiteto na busca da proporção áurea material e social. Conciliador nas horas vagas e fã de vinis.": "Architecte à la recherche du nombre d'or matériel et social. Conciliateur à ses heures perdues et fan de vinyles.",
    
    "Sinergia de Ar tríplice extraordinária. O diálogo flui sem amarras teológicas, compartilhando uma visão humanitária idêntica.": "Synergie d'Air triple extraordinaire. Le dialogue coule sans contraintes théologiques, partageant une vision humanitaire identique.",
    "Conexão intelectual efervescente. Estimulação mútua fantástica e ausência completa de cobranças materiais limitantes.": "Connexion intellectuelle effervescente. Stimulation mutuelle fantastique et absence totale de contraintes matérielles limitantes.",
    "Aventura idealista e filosófica sem fronteiras. Júpiter expande o desejo de independência mútua de Aquário de forma magnífica.": "Aventure idéale et philosophique sans frontières. Jupiter élargit magnifiquement le désir d'indépendance mutuelle du Verseau.",
    "Dinamismo e iniciativa entusiasmados. O fogo de Áries fornece a faísca e a força realizadora que as grandes utopias de Aquário necessitam.": "Dynamisme et initiative enthousiastes. Le feu du Bélier fournit l'étincelle et la force de réalisation nécessaires aux grandes utopies du Verseau.",
    "Estreito canal relacional moldado pelo respeito ao espaço individual e curiosidade intelectual mútua inovadora.": "Canal relationnel étroit façonné par le respect de l'espace individuel et une curiosité intellectuelle mutuelle innovante.",
    "Harmonia celeste sintonizada com alto teor de compatibilidade espiritual sob o elemento correspondente.": "Harmonie céleste accordée avec une haute compatibilité spirituelle sous l'élément correspondant.",

    "Membros Ativos em Destaque": "Membres Actifs Mis en Avant",
    "Notas de Atividades Sociais em Tempo Real": "Notes d'Activités Sociales en Temps Réel",
    "Conexão Ativa": "Connexion Active",
    "Ajustando perfil...": "Ajustement du profil...",
    "Sem bio editada...": "Pas de biographie modifiée...",
    "Origem Oculta": "Origine Cachée",
    "Sol em": "Soleil en",
    "Origem:": "Origine :",
    "Destaque de Sinergia": "Point Fort de Synergie",
    "Sinergia": "Synergie",
    "Trabalho": "Travail",
    "Energia": "Énergie",
    "Sol": "Soleil",
    "Pessoas Compatíveis Com Você": "Personas Compatibles Avec Vous",
    "Indivíduos em ressonância geométrica de nascimento sintonizados com seu Sol em": "Individus en résonance géométrique de naissance en phase avec votre Soleil en",
    "Sintonizando...": "Syntonisation...",
    "Recarregar": "Recharger",
    "Atualizar sugestões do Star Map": "Mettre à jour les suggestions de la carte du ciel",
    "Novos Mapas Hoje": "Nuevos Thèmes Aujourd'hui",
    "realizados": "réalisés",
    "Sinastrias Avaliadas": "Sinastries Évaluées",
    "sinergias": "synergies",
    "Leituras de Tarô": "Tirages de Tarot",
    "consultas": "consultations",
    "Sonhos Interpretados": "Rêves Interprétés",
    "revelações": "révélations",
    "Curtido": "Aimé",
    "Curtir": "Aimer",
    "Seguindo": "Abonné",
    "Seguir": "Suivre",
    "Ver": "Voir",
    "Afinidades e Ressonâncias Celestiais": "Celestial Affinities and Resonances",
    "Afinidade Amorosa & Sentimental": "Romantic & Emotional Affinity",
    "Afinidade Intelectual & Mental": "Intellectual & Mental Affinity",
    "Ressonância Energética & Áurica": "Energetic & Auric Resonance",
    "Sinergia Profissional & Conquistas": "Professional Synergy & Achievements",
    "Pontos Fortes da Conexão:": "Points Fortes de la Connexion :",
    "Convergência sublime de pensamentos voltados ao progresso tecnológico e social. Ideais compartilhados livres de possessividade ou ciúmes históricos sufocantes.": "Sublime convergence de pensées tournées vers le progrès technologique et social. Idéaux partagés libres de possessivité ou de jalousie historique étouffante.",
    "Pontos de Atenção (Cuidado):": "Points d'Attention (Attention) :",
    "O excesso de intelectualização pode às vezes minar a intimidade física calorosa e a escuta visceral de afetos espontâneos no cotidiano.": "L'intellectualisation excessive peut parfois saper l'intimité physique chaleureuse et l'écoute viscérale d'affections spontanées au quotidien.",
    "Concluir Análise": "Terminer l'Analyse",
    "Pontos Fortes da Conexão": "Points Fortes de la Connexion",
    "Pontos de Atenção (Cuidado)": "Points d'Attention (Attention)"
  },
  de: {
    "São Paulo, SP": "São Paulo, SP",
    "Rio de Janeiro, RJ": "Rio de Janeiro, RJ",
    "Curitiba, PR": "Curitiba, PR",
    "Belo Horizonte, MG": "Belo Horizonte, MG",
    "Salvador, BA": "Salvador, BA",
    "Porto Alegre, RS": "Porto Alegre, RS",
    "Recife, PE": "Recife, PE",
    "Campinas, SP": "Campinas, SP",
    
    "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.": "Liebhaber der Harmonie, der Luftkonstellationen und des minimalistischen Designs. Ich suche nach klugen und aufrichtigen Begegnungen.",
    "Curioso por natureza, baterista e leitor voror de ficção. Sagitário me move a buscar novos horizontes.": "Neugierig von Natur aus, Schlagzeuger und begeisterter Leser von Belletristik. Schütze bewegt mich dazu, neue Horizonte zu suchen.",
    "Curioso por natureza, baterista e leitor voraz de ficção. Sagitário me move a buscar novos horizontes.": "Neugierig von Natur aus, Schlagzeuger und begeisterter Leser von Belletristik. Schütze bewegt mich dazu, neue Horizonte zu suchen.",
    "Vivendo guiata pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Geführt von Optimismus und Jupiters spiritueller Expansion. Wandern, Fotografie und Kaffeespezialitäten.",
    "Vivendo guiadora pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.": "Geführt von Optimismus und Jupiters spiritueller Expansion. Wandern, Fotografie und Kaffeespezialitäten.",
    "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.": "Sozialunternehmer, Amateurastronom und Entwickler. Vor allem ein Freund, idealistisch bis zum Äußersten.",
    "Fogo cardeal motivada a criar projetos inovadores. Amo praias quentes, shows ao vivo e meditação áurica.": "Kardinales Feuer, motiviert, innovative Projekte zu schaffen. Ich liebe warme Strände, Live-Shows und Aurameditation.",
    "Apaixonado por teatro, vinhos e conversas profundas sobre destino. Busco conexões que façam brilhar o Sol.": "Leidenschaftlich für Theater, Wein und tiefgründige Gespräche über das Schicksal. Ich suche nach Verbindungen, die die Sonne scheinen lassen.",
    "Amante da gastronomia, conforto material do lar e boas discussões de negócios sustentáveis.": "Liebhaber von Gastronomie, materiellem Komfort zu Hause und guten Diskussionen über nachhaltiges Geschäft.",
    "Arquiteto na busca da proporção áurea material e social. Conciliador nas horas vagas e fã de vinis.": "Architekt auf der Suche nach dem materiellen und sozialen Goldenen Schnitt. Schlichter in der Freizeit und Fan von Vinyl-Schallplatten.",
    
    "Sinergia de Ar tríplice extraordinária. O diálogo flui sem amarras teológicas, compartilhando uma visão humanitária idêntica.": "Außergewöhnliche dreifache Luft-Synergie. Der Dialog fließt frei von theologischen Zwängen und teilt eine identische humanitäre Vision.",
    "Conexão intelectual efervescente. Estimulação mútua fantástica e ausência completa de cobranças materiais limitantes.": "Lebhafte intellektuelle Verbindung. Fantastische gegenseitige Stimulation und völlige Abwesenheit einschränkender materieller Forderungen.",
    "Aventura idealista e filosófica sem fronteiras. Júpiter expande o desejo de independência mútua de Aquário de forma magnífica.": "Idealistisches und philosophisches Abenteuer ohne Grenzen. Jupiter erweitert das Bedürfnis von Wassermann nach gegenseitiger Unabhängigkeit auf großartige Weise.",
    "Dinamismo e iniciativa entusiasmados. O fogo de Áries fornece a faísca e a força realizadora que as grandes utopias de Aquário necessitam.": "Enthusiastische Dynamik und Initiative. Das Feuer des Widders liefert den Funken und die schöpferische Kraft, die die großen Utopien von Wassermann benötigen.",
    "Estreito canal relacional moldado pelo respeito ao espaço individual e curiosidade intelectual mútua inovadora.": "Enger Beziehungskanal, geprägt von Respekt für den individuellen Raum und innovativer gegenseitiger intellektueller Neugier.",
    "Harmonia celeste sintonizada com alto teor de compatibilidade espiritual sob o elemento correspondente.": "Himmlische Harmonie, abgestimmt auf eine hohe spirituelle Kompatibilität unter dem entsprechenden Element.",

    "Membros Ativos em Destaque": "Hervorgehobene aktive Mitglieder",
    "Notas de Atividades Sociais em Tempo Real": "Soziale Aktivitätsnotizen in Echtzeit",
    "Conexão Ativa": "Aktive Verbindung",
    "Ajustando perfil...": "Profil wird angepasst...",
    "Sem bio editada...": "Keine Biografie bearbeitet...",
    "Origem Oculta": "Verborgener Ursprung",
    "Sol em": "Sonne in",
    "Origem:": "Herkunft:",
    "Destaque de Sinergia": "Synergie-Highlight",
    "Sinergia": "Synergie",
    "Trabalho": "Arbeit",
    "Energia": "Energie",
    "Sol": "Sonne",
    "Pessoas Compatíveis Com Você": "Mit Ihnen kompatible Personen",
    "Indivíduos em ressonância geométrica de nascimento sintonizados com seu Sol em": "Individuen in geometrischer Geburtsresonanz, abgestimmt auf Ihre Sonne in",
    "Sintonizando...": "Abstimmung...",
    "Recarregar": "Neu laden",
    "Atualizar sugestões do Star Map": "Star Map-Vorschläge aktualisieren",
    "Novos Mapas Hoje": "Neue Karten heute",
    "realizados": "erstellt",
    "Sinastrias Avaliadas": "Synastrien Ausgewertet",
    "sinergias": "Synergien",
    "Leituras de Tarô": "Tarot-Lesungen",
    "consultas": "Beratungen",
    "Sonhos Interpretados": "Träume Interpretiert",
    "revelações": "Enthüllungen",
    "Curtido": "Geliked",
    "Curtir": "Liken",
    "Seguindo": "Folgt",
    "Seguir": "Folgen",
    "Ver": "Ansehen",
    "Afinidades e Ressonâncias Celestiais": "Afinidades und Resonâncias Celestiais",
    "Afinidade Amorosa & Sentimental": "Liebes- und Gefühlsaffinität",
    "Afinidade Intelectual & Mental": "Intellektuelle und mentale Affinität",
    "Ressonância Energética & Áurica": "Energetische und aurische Resonanz",
    "Sinergia Profissional & Conquistas": "Berufliche Synergie & Erfolge",
    "Pontos Fortes da Conexão:": "Stärken der Verbindung:",
    "Convergência sublime de pensamentos voltados ao progresso tecnológico e social. Ideais compartilhados livres de possessividade ou ciúmes históricos sufocantes.": "Erhabene Konvergenz von Gedanken, die auf technologischen und sozialen Fortschritt ausgerichtet sind. Gemeinsame Ideale frei von Besitzdenken oder erstickender historischer Eifersucht.",
    "Pontos de Atenção (Cuidado):": "Achtungspunkte (Vorsicht):",
    "O excesso de intelectualização pode às vezes minar a intimidade física calorosa e a escuta visceral de afetos espontâneos no cotidiano.": "Übermäßige Intellektualisierung kann manchmal die herzliche körperliche Intimität und das viszerale Zuhören spontaner Zuneigung im täglichen Leben untergraben.",
    "Concluir Análise": "Analyse abschließen",
    "Pontos Fortes da Conexão": "Stärken der Verbindung",
    "Pontos de Atenção (Cuidado)": "Achtungspunkte (Vorsicht)"
  }
};

interface SocialUser {
  id: string;
  name: string;
  age: number;
  city: string;
  sign: string;
  bio: string;
  avatarUrl: string;
  avatarGradient: string;
  interests: string[];
}

interface SocialCompatibilityProps {
  userName: string;
  userSign: string;
  hasCreatedMap: boolean;
  onRefresh?: () => void;
}

export default function SocialCompatibility({
  userName,
  userSign,
  hasCreatedMap,
  onRefresh
}: SocialCompatibilityProps) {
  const { t: i18nT, i18n } = useTranslation();

  useEffect(() => {
    const langs: ('en' | 'es' | 'de' | 'fr')[] = ['en', 'es', 'de', 'fr'];
    langs.forEach(l => {
      if (i18n && i18n.addResourceBundle) {
        i18n.addResourceBundle(l, 'translation', localSocialTranslations[l], true, true);
      }
    });
  }, [i18n]);

  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (i18n.language as Language) || 'pt');
    }
    return res;
  };

  // Profiles database (real mock personas in system)
  const candidateUsers: SocialUser[] = [
    {
      id: "u_mariana",
      name: "Mariana",
      age: 24,
      city: "São Paulo, SP",
      sign: "Libra",
      bio: "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-fuchsia-600 to-indigo-600",
      interests: ["Yoga", "Astrologia", "Arte Coletiva", "Café"]
    },
    {
      id: "u_gustavo",
      name: "Gustavo",
      age: 27,
      city: "Rio de Janeiro, RJ",
      sign: "Gêmeos",
      bio: "Curioso por natureza, baterista e leitor voror de ficção. Sagitário me move a buscar novos horizontes.",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-sky-500 to-teal-500",
      interests: ["Música", "Livros", "Tecnologia", "Viagens"]
    },
    {
      id: "u_anabeatriz",
      name: "Ana Beatriz",
      age: 22,
      city: "Curitiba, PR",
      sign: "Sagitário",
      bio: "Vivendo guiata pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-amber-500 to-rose-600",
      interests: ["Trilhas", "Fotografia", "Espiritualidade", "Vinho"]
    },
    {
      id: "u_felipe",
      name: "Felipe",
      age: 29,
      city: "Belo Horizonte, MG",
      sign: "Aquário",
      bio: "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-indigo-600 to-purple-600",
      interests: ["Astronomia", "Negócios", "Meditação", "Cozinha"]
    },
    {
      id: "u_camila",
      name: "Camila",
      age: 25,
      city: "Salvador, BA",
      sign: "Áries",
      bio: "Fogo cardeal motivada a criar projetos inovadores. Amo praias quentes, shows ao vivo e meditação áurica.",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-rose-500 to-orange-500",
      interests: ["Música ao Vivo", "Praia", "Empreendedorismo", "Moda"]
    },
    {
      id: "u_lucas",
      name: "Lucas",
      age: 28,
      city: "Porto Alegre, RS",
      sign: "Leão",
      bio: "Apaixonado por teatro, vinhos e conversas profundas sobre destino. Busco conexões que façam brilhar o Sol.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-violet-600 to-rose-500",
      interests: ["Cinema", "Teatro", "Vinhos", "Filosofia"]
    },
    {
      id: "u_patricia",
      name: "Patrícia",
      age: 31,
      city: "Recife, PE",
      sign: "Touro",
      bio: "Amante da gastronomia, conforto material do lar e boas discussões de negócios sustentáveis.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-emerald-500 to-indigo-500",
      interests: ["Culinária", "Design de Interiores", "Estudos", "Finanças"]
    },
    {
      id: "u_rodrigo",
      name: "Rodrigo",
      age: 26,
      city: "Campinas, SP",
      sign: "Libra",
      bio: "Arquiteto na busca da proporção áurea material e social. Conciliador nas horas vagas e fã de vinis.",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-teal-600 to-sky-600",
      interests: ["Arquitetura", "Música Analógica", "Exposições", "Cerveja Artesanal"]
    }
  ];

  // System statistics derived deterministically based on today's date
  const [ecoStats, setEcoStats] = useState({
    mapsToday: 134,
    compatibilityResolvedToday: 247,
    readingsToday: 318,
    dreamsToday: 82
  });

  // User social relations state
  const [likedProfiles, setLikedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem("orbi_liked_users");
    return saved ? JSON.parse(saved) : [];
  });
  const [followedProfiles, setFollowedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem("orbi_followed_users");
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic visible suggestions based on the 48h periodic shuffle rule
  const [visibleSuggestions, setVisibleSuggestions] = useState<SocialUser[]>([]);
  const [selectedCompanion, setSelectedCompanion] = useState<SocialUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync likes and follows
  useEffect(() => {
    localStorage.setItem("orbi_liked_users", JSON.stringify(likedProfiles));
  }, [likedProfiles]);

  useEffect(() => {
    localStorage.setItem("orbi_followed_users", JSON.stringify(followedProfiles));
  }, [followedProfiles]);

  // Generate deterministic eco stats based on current time/date
  useEffect(() => {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 30;
    
    // Add hours logic to make it tick up during the day
    const hours = today.getHours();
    
    setEcoStats({
      mapsToday: Math.floor(110 + (seed % 45) + (hours * 3.5)),
      compatibilityResolvedToday: Math.floor(210 + (seed % 73) + (hours * 5.2)),
      readingsToday: Math.floor(280 + (seed % 92) + (hours * 7.1)),
      dreamsToday: Math.floor(60 + (seed % 28) + (hours * 1.8))
    });

    // 48 hours periodic suggestion list shuffle: or we can tie the selected subset of candidates matching user sign!
    // To ensure a high feel of life and activity, we select 4 profiles out of candidateUsers
    // seeded deterministically by the 48h calendar period: Math.floor(Date.now() / (1000 * 60 * 60 * 48))
    const shuffleSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 48));
    
    // Select 4 users showing a diverse matching set
    const selectedIndices: number[] = [];
    const len = candidateUsers.length;
    for (let i = 0; i < 4; i++) {
      let idx = (shuffleSeed + i * 3) % len;
      while (selectedIndices.includes(idx)) {
        idx = (idx + 1) % len;
      }
      selectedIndices.push(idx);
    }
    
    const suggested = selectedIndices.map(idx => candidateUsers[idx]);
    setVisibleSuggestions(suggested);
  }, []);

  // Handle manual/periodic refreshment simulation
  const handleShuffleSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Pick a different offset of users
      const randomSeed = Math.floor(Math.random() * 8);
      const selectedIndices: number[] = [];
      const len = candidateUsers.length;
      for (let i = 0; i < 4; i++) {
        let idx = (randomSeed + i * 2) % len;
        while (selectedIndices.includes(idx)) {
          idx = (idx + 1) % len;
        }
        selectedIndices.push(idx);
      }
      setVisibleSuggestions(selectedIndices.map(idx => candidateUsers[idx]));
      setIsRefreshing(false);
    }, 8000);
  };

  // Helper score calculator (completely deterministic using strings to keep it stable)
  const calculateScores = (name1: string, name2: string) => {
    const s1 = name1.toLowerCase();
    const s2 = name2.toLowerCase();
    const totalLen = s1.length + s2.length;
    
    // Deterministic modulo calculations
    const amor = 75 + (totalLen * 7 % 22); // 75% to 97%
    const amizade = 80 + (totalLen * 3 % 18); // 80% to 98%
    const profissional = 72 + (totalLen * 11 % 24); // 72% to 96%
    const energetica = 78 + (totalLen * 5 % 20); // 78% to 98%
    const media = Math.round((amor + amizade + profissional + energetica) / 4);

    return { amor, amizade, profissional, energetica, media };
  };

  // Toggle follows and likes
  const handleToggleLike = (id: string) => {
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleToggleFollow = (id: string) => {
    setFollowedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Profile compatibility summary texts based on the candidate's sign and user's sign
  const getCompatibilitySummaryText = (sign1: string, sign2: string) => {
    const s1 = (sign1 || "").toLowerCase();
    const s2 = (sign2 || "").toLowerCase();

    if (s1 === "aquário" || s2 === "aquário") {
      if (s1 === "libra" || s2 === "libra") {
        return "Sinergia de Ar tríplice extraordinária. O diálogo flui sem amarras teológicas, compartilhando uma visão humanitária idêntica.";
      }
      if (s1 === "gêmeos" || s2 === "gêmeos") {
        return "Conexão intelectual efervescente. Estimulação mútua fantástica e ausência completa de cobranças materiais limitantes.";
      }
      if (s1 === "sagitário" || s2 === "sagitário") {
        return "Aventura idealista e filosófica sem fronteiras. Júpiter expande o desejo de independência mútua de Aquário de forma magnífica.";
      }
      if (s1 === "áries" || s2 === "áries") {
        return "Dinamismo e iniciativa entusiasmados. O fogo de Áries fornece a faísca e a força realizadora que as grandes utopias de Aquário necessitam.";
      }
      return "Estreito canal relacional moldado pelo respeito ao espaço individual e curiosidade intelectual mútua inovadora.";
    }

    return "Harmonia celeste sintonizada com alto teor de compatibilidade espiritual sob o elemento correspondente.";
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ECOSYSTEM LIVE LOGS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/20 border border-slate-850 p-4 rounded-3xl text-left font-sans">
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Novos Mapas Hoje")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-amber-500 font-mono tracking-tight">{ecoStats.mapsToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("realizados")}</span>
          </div>
        </div>
        
        <div className="space-y-1 border-l border-slate-850 pl-4">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Sinastrias Avaliadas")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-cyan-400 font-mono tracking-tight">{ecoStats.compatibilityResolvedToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("sinergias")}</span>
          </div>
        </div>

        <div className="space-y-1 border-l border-slate-850 pl-4">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Leituras de Tarô")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-rose-455 font-mono tracking-tight">{ecoStats.readingsToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("consultas")}</span>
          </div>
        </div>

        <div className="space-y-1 border-l border-slate-850 pl-4">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Sonhos Interpretados")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-purple-400 font-mono tracking-tight">{ecoStats.dreamsToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("revelações")}</span>
          </div>
        </div>
      </div>

      {/* 2. DISCOVER PEOPLE SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-850">
          <div>
            <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500 animate-pulse" />
              {t("Pessoas Compatíveis Com Você")}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {t("Indivíduos em ressonância geométrica de nascimento sintonizados com seu Sol em")} {t(userSign)}.
            </p>
          </div>
          
          <button
            onClick={handleShuffleSuggestions}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer text-[10px] uppercase font-mono flex items-center gap-1 font-bold"
            title={t("Atualizar sugestões do Star Map")}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t("Sintonizando...") : t("Recarregar")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-left">
          {visibleSuggestions.map((candidate) => {
            const scores = calculateScores(userName, candidate.name);
            const isLiked = likedProfiles.includes(candidate.id);
            const isFollowed = followedProfiles.includes(candidate.id);

            return (
              <div 
                key={candidate.id}
                className="bg-slate-900/45 p-5 rounded-3xl border border-slate-850 space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                
                {/* Photo profile and Name header layout */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-tr ${candidate.avatarGradient} rounded-full blur-xs opacity-70`} />
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-950 flex items-center justify-center">
                        <img 
                          src={candidate.avatarUrl} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover relative z-10"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback to elegant initials background if Unsplash fails/offline
                            (e.target as any).style.display = "none";
                          }}
                        />
                        <span className="absolute z-0 text-amber-200 text-base font-black font-sans uppercase">
                          {candidate.name.substring(0, 2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-100 text-sm">{candidate.name}, {candidate.age}</h4>
                        <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 text-[8.5px] font-mono text-amber-450 rounded-md font-bold">
                          {t(candidate.sign)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-slate-450 text-[10px]">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{t(candidate.city)}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3 text-emerald-450" />
                          <span className="text-[10px] text-emerald-400 font-bold font-mono">
                            {scores.media}% {t("Sinergia")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-350 leading-relaxed italic border-l-2 border-slate-800 pl-2.5">
                    "{t(candidate.bio)}"
                  </p>

                  <p className="text-[10px] text-slate-400 leading-normal bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/60 font-sans">
                    <span className="font-bold text-amber-500 shrink-0 block text-[9.5px] uppercase font-mono tracking-wide mb-1">{t("Destaque de Sinergia")}</span>
                    {t(getCompatibilitySummaryText(userSign, candidate.sign))}
                  </p>
                </div>

                {/* Compatibility percentages metrics list */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">💖 {t("Amor")}:</span>
                      <span className="font-mono font-bold text-rose-450">{scores.amor}%</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">👥 {t("Amizade")}:</span>
                      <span className="font-mono font-bold text-sky-400">{scores.amizade}%</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">💼 {t("Trabalho")}:</span>
                      <span className="font-mono font-bold text-indigo-400">{scores.profissional}%</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">⚡ {t("Energia")}:</span>
                      <span className="font-mono font-bold text-emerald-400">{scores.energetica}%</span>
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-850/50 mt-1">
                    <button 
                      onClick={() => handleToggleLike(candidate.id)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-sans uppercase font-bold flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 border ${
                        isLiked 
                          ? 'bg-rose-500/10 border-rose-500/35 text-rose-400 shadow-md' 
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 shrink-0 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isLiked ? t('Curtido') : t('Curtir')}</span>
                    </button>

                    <button 
                      onClick={() => handleToggleFollow(candidate.id)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-sans uppercase font-bold flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 border ${
                        isFollowed 
                          ? 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400 shadow-md' 
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t('Seguindo')}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{t('Seguir')}</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setSelectedCompanion(candidate)}
                      className="py-1.5 px-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-100 opacity-90 text-slate-950 rounded-xl text-[10px] font-sans font-bold uppercase cursor-pointer"
                    >
                      {t('Ver')}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 3. VER COMPATIBILIDADE - PROFILE DETAILS MODAL */}
      {selectedCompanion && (() => {
        const scores = calculateScores(userName, selectedCompanion.name);
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-150 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 md:p-8 space-y-6 relative text-left animate-in zoom-in-95 duration-200 shadow-2xl">
              
              <button 
                onClick={() => setSelectedCompanion(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 border-b border-slate-850 pb-4 pr-10">
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden relative shrink-0">
                  <img 
                    src={selectedCompanion.avatarUrl} 
                    alt={selectedCompanion.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as any).style.display = "none";
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-amber-200 bg-gradient-to-tr from-rose-600 to-amber-600 uppercase">
                    {selectedCompanion.name.substring(0, 2)}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-extrabold text-slate-100 text-lg">{selectedCompanion.name}, {selectedCompanion.age}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t(selectedCompanion.city)} • {t("Sol")} em <strong>{t(selectedCompanion.sign)}</strong></span>
                  </p>
                </div>
              </div>

              {/* Sub-Affinities Breakdown */}
              <div className="space-y-4 font-sans text-xs">
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider block mb-2">{t("Afinidades e Ressonâncias Celestiais")}</span>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-rose-400">{t("Afinidade Amorosa & Sentimental")}</span>
                        <span className="font-mono text-rose-400">{scores.amor}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-rose-500 to-rose-450" style={{ width: `${scores.amor}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-sky-400">{t("Afinidade Intelectual & Mental")}</span>
                        <span className="font-mono text-sky-400">{scores.amizade}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-sky-450" style={{ width: `${scores.amizade}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-emerald-400">{t("Ressonância Energética & Áurica")}</span>
                        <span className="font-mono text-emerald-400">{scores.energetica}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${scores.energetica}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-indigo-400">{t("Sinergia Profissional & Conquistas")}</span>
                        <span className="font-mono text-indigo-400">{scores.profissional}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-550" style={{ width: `${scores.profissional}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5 leading-relaxed text-[11px]">
                  <div>
                    <h5 className="font-bold text-amber-500 text-xs">💪 {t("Pontos Fortes da Conexão:")}</h5>
                    <p className="text-slate-300 mt-1">{t("Convergência sublime de pensamentos voltados ao progresso tecnológico e social. Ideais compartilhados livres de possessividade ou ciúmes históricos sufocantes.")}</p>
                  </div>
                  
                  <div className="border-t border-slate-900 pt-3">
                    <h5 className="font-bold text-red-400 text-xs">⚠️ {t("Pontos de Atenção (Cuidado):")}</h5>
                    <p className="text-slate-300 mt-1">{t("O excesso de intelectualização pode às vezes minar a intimidade física calorosa e a escuta visceral de afetos espontâneos no cotidiano.")}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setSelectedCompanion(null)}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold font-sans uppercase text-slate-300 border border-slate-850 transition cursor-pointer"
                >
                  {t("Concluir Análise")}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}

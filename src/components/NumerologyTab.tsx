import React from "react";
import { Layers, HelpCircle, Palette, Binary, ArrowUpRight } from "lucide-react";
import { Language, translations } from "../translations";
import { NumerologyData } from "../types";
import { useTranslation } from "react-i18next";
import { translateUiText } from "../lib/translations";
import { useIdioma } from "../context/IdiomaContext";

interface NumerologyTabProps {
  numerologyData: NumerologyData;
  lang: Language;
}

const localTabTranslations: Record<Language, Record<string, string>> = {
  pt: {
    "Leitura Detalhada de seus Números Força": "Leitura Detalhada de seus Números Força"
  },
  en: {
    "Leitura Detalhada de seus Números Força": "Detailed Reading of Your Power Numbers"
  },
  es: {
    "Leitura Detalhada de seus Números Força": "Lectura Detallada de sus Números de Fuerza"
  },
  de: {
    "Leitura Detalhada de seus Números Força": "Detaillierte Lesung Ihrer Kraftzahlen"
  },
  fr: {
    "Leitura Detalhada de seus Números Força": "Lecture Détaillée de vos Nombres de Force"
  }
};

export default function NumerologyTab({ numerologyData, lang }: NumerologyTabProps) {
  const { idioma } = useIdioma();
  const activeLang = idioma || lang || 'pt';
  const t = translations[activeLang];
  const { t: tI18nRaw } = useTranslation();

  const tI18n = (text: string) => {
    if (!text) return "";
    if (localTabTranslations[activeLang]?.[text]) {
      return localTabTranslations[activeLang][text];
    }
    const res = tI18nRaw(text);
    if (res === text || !res) {
      return translateUiText(text, activeLang);
    }
    return res;
  };

  // In depth Pythagorean descriptions for numbers 1-9, plus master numbers 11, 22, 33 localized by language
  const localizedDictionaries: Record<Language, Record<number, { title: string; keyword: string; desc: string }>> = {
    pt: {
      1: {
        title: "O Pioneiro e Líder",
        keyword: "Independência, Iniciativa, Ambição",
        desc: "Indica originalidade, coragem e o instinto de liderança cósmica primária. Representa o início de novas ideias."
      },
      2: {
        title: "O Diplomata e Pacificador",
        keyword: "Harmonia, Cooperação, Sensibilidade",
        desc: "Excelente capacidade para mediar conflitos, buscar o equilíbrio, expressar sentimentos e harmonizar ambientes."
      },
      3: {
        title: "O Artista e Comunicador",
        keyword: "Criatividade, Sociabilidade, Alegria",
        desc: "Dotado de magnetismo e facilidade para as artes e oratória. Tem a missão de energizar os caminhos sociais alheios."
      },
      4: {
        title: "O Construtor e Organizador",
        keyword: "Estabilidade, Trabalho Duro, Ordem",
        desc: "Representa a solidez e os aspectos práticos da vida mundana. Focado em erguer bases concretas sólidas e eternas."
      },
      5: {
        title: "O Viajante Livre e Dinâmico",
        keyword: "Adaptabilidade, Liberdade, Aventura",
        desc: "Busca constante por novidades. Excelente poder de adaptação às intempéries, com forte espírito de exploração."
      },
      6: {
        title: "O Guardião e Conselheiro",
        keyword: "Harmonia Familiar, Justiça, Apoio",
        desc: "Nascido para nutrir, acolher e orientar. Forte senso de responsabilidade afetiva e inclinação para a cura."
      },
      7: {
        title: "O Buscador e Filósofo",
        keyword: "Intuição, Espiritualidade, Análise",
        desc: "Mente investigativa voltada para desvendar os grandes enigmas espirituais e lógicos do universo visível."
      },
      8: {
        title: "O Realizador e Estrategista",
        keyword: "Poder Material, Abundância, Equilíbrio",
        desc: "Excelente habilidade executiva e comercial, conciliando visões ambiciosas espirituais com realizações terrestres."
      },
      9: {
        title: "O Humanitário Altruísta",
        keyword: "Universalidade, Generosidade, Conclusão",
        desc: "Amor incondicional e altruísmo global. Representa o ápice da jornada evolutiva do espírito humano."
      },
      11: {
        title: "Mestre Instigador e Guia",
        keyword: "Iluminação, Sensibilidade Extrema, Visão",
        desc: "Número Mestre. Conexão profunda com dimensões superiores. Canal natural para passar conhecimentos transformadores."
      },
      22: {
        title: "O Arquiteto Construtor Mestre",
        keyword: "Materialização de Sonhos Globais",
        desc: "Número Mestre Máximo. Capacidade de transformar visões abstratas em monumentos úteis para a humanidade inteira."
      }
    },
    en: {
      1: {
        title: "The Pioneer and Leader",
        keyword: "Independence, Initiative, Ambition",
        desc: "Indicates originality, courage, and primary cosmic leadership instinct. Represents the beginning of new ideas."
      },
      2: {
        title: "The Diplomat and Peacemaker",
        keyword: "Harmony, Cooperation, Sensitivity",
        desc: "Excellent capacity to mediate conflicts, seek balance, express feelings, and harmonize environments."
      },
      3: {
        title: "The Artist and Communicator",
        keyword: "Creativity, Sociability, Joy",
        desc: "Endowed with magnetism and ease for arts and public speaking. Has the mission of energizing others' social paths."
      },
      4: {
        title: "The Builder and Organizer",
        keyword: "Stability, Hard Work, Order",
        desc: "Represents solidity and the practical aspects of mundane life. Focused on building solid, eternal foundations."
      },
      5: {
        title: "The Free and Dynamic Traveler",
        keyword: "Adaptability, Freedom, Adventure",
        desc: "Constant search for novelty. Excellent power of adaptation to storms, with a strong spirit of exploration."
      },
      6: {
        title: "The Guardian and Advisor",
        keyword: "Family Harmony, Justice, Support",
        desc: "Born to nurture, welcome, and guide. Strong sense of affective responsibility and inclination to healing."
      },
      7: {
        title: "The Seeker and Philosopher",
        keyword: "Intuition, Spirituality, Analysis",
        desc: "Investigative mind geared towards uncovering the great spiritual and logical enigmas of the visible universe."
      },
      8: {
        title: "The Achiever and Strategist",
        keyword: "Material Power, Abundance, Balance",
        desc: "Excellent executive and commercial ability, reconciling ambitious spiritual visions with earthly accomplishments."
      },
      9: {
        title: "The Altruistic Humanitarian",
        keyword: "Universality, Generosity, Completion",
        desc: "Unconditional love and global altruism. Represents the pinnacle of the human spirit's evolutionary journey."
      },
      11: {
        title: "Master Instigator and Guide",
        keyword: "Illumination, Extreme Sensitivity, Vision",
        desc: "Master Number. Deep connection with higher dimensions. Natural channel for passing on transformative knowledge."
      },
      22: {
        title: "The Master Builder Architect",
        keyword: "Materialization of Global Dreams",
        desc: "Ultimate Master Number. Ability to transform abstract visions into useful monuments for all of humanity."
      }
    },
    es: {
      1: {
        title: "El Pionero y Líder",
        keyword: "Independencia, Iniciativa, Ambición",
        desc: "Indica originalidad, valentía y el instinto primario de liderazgo cósmico. Representa el inicio de nuevas ideas."
      },
      2: {
        title: "El Diplomático y Pacifista",
        keyword: "Armonía, Cooperación, Sensibilidad",
        desc: "Excelente capacidad para mediar conflictos, buscar el equilibrio, expresar sentimientos y armonizar ambientes."
      },
      3: {
        title: "El Artista y Comunicador",
        keyword: "Creatividad, Sociabilidad, Alegría",
        desc: "Dotado de magnetismo y facilidad para las artes y la oratoria. Tiene la misión de dinamizar los caminos sociales de los demás."
      },
      4: {
        title: "El Constructor y Organizador",
        keyword: "Estabilidad, Trabajo Duro, Orden",
        desc: "Representa la solidez y los aspectos prácticos de la vida mundana. Enfocado en construir bases concretas y duraderas."
      },
      5: {
        title: "El Viajero Libre y Dinámico",
        keyword: "Adaptabilidad, Libertad, Aventura",
        desc: "Búsqueda constante de novedades. Excelente poder de adaptación a los cambios, con un fuerte espíritu de exploración."
      },
      6: {
        title: "El Guardián y Consejero",
        keyword: "Armonía Familiar, Justicia, Apoyo",
        desc: "Nacido para nutrir, acoger y guiar. Fuerte sentido de responsabilidad afectiva e inclinación hacia la curación."
      },
      7: {
        title: "El Buscador y Filósofo",
        keyword: "Intuición, Espiritualidad, Análisis",
        desc: "Mente investigativa orientada a desentrañar los grandes enigmas espirituales y lógicos del universo visible."
      },
      8: {
        title: "El Realizador y Estratega",
        keyword: "Poder Material, Abundancia, Equilibrio",
        desc: "Excelente habilidad ejecutiva y comercial, conciliando visiones espirituales ambiciosas con logros terrenales."
      },
      9: {
        title: "El Humanitario Altruista",
        keyword: "Universalidad, Generosidad, Conclusión",
        desc: "Amor incondicional y altruismo global. Representa la cumbre del viaje evolutivo del espíritu humano."
      },
      11: {
        title: "Maestro Instigador y Guía",
        keyword: "Iluminación, Sensibilidad Extrema, Visión",
        desc: "Número Maestro. Conexión profunda con dimensiones superiores. Canal natural para transmitir conocimientos transformadores."
      },
      22: {
        title: "El Maestro Constructor Arquitecto",
        keyword: "Materialización de Sueños Globales",
        desc: "Número Maestro Máximo. Capacidad de transformar visiones abstractas en monumentos útiles para toda la humanidad."
      }
    },
    de: {
      1: {
        title: "Der Pionier und Anführer",
        keyword: "Unabhängigkeit, Initiative, Ehrgeiz",
        desc: "Zeigt Originalität, Mut und den primären kosmischen Führungsinstinkt. Steht für den Beginn neuer Ideen."
      },
      2: {
        title: "Der Diplomat und Friedensstifter",
        keyword: "Harmonie, Kooperation, Sensibilität",
        desc: "Hervorragende Fähigkeit, Konflikte zu schlichten, das Gleichgewicht zu suchen, Gefühle auszudrücken und Umgebungen zu harmonisieren."
      },
      3: {
        title: "Der Künstler und Kommunikator",
        keyword: "Kreativität, Geselligkeit, Freude",
        desc: "Ausgestattet mit Magnetismus und Leichtigkeit für Kunst und Redekunst. Hat die Mission, die sozialen Wege anderer zu energetisieren."
      },
      4: {
        title: "Der Baumeister und Organisator",
        keyword: "Stabilität, Harte Arbeit, Ordnung",
        desc: "Repräsentiert Solidität und die praktischen Aspekte des irdischen Lebens. Fokussiert auf den Aufbau stabiler, ewiger Fundamente."
      },
      5: {
        title: "Der freie und dynamische Reisende",
        keyword: "Anpassungsfähigkeit, Freiheit, Abenteuer",
        desc: "Ständige Suche nach Neuem. Ausgezeichnete Anpassungsfähigkeit an Stürme, mit einem starken Entdeckergeist."
      },
      6: {
        title: "Der Hüter und Berater",
        keyword: "Familiäre Harmonie, Gerechtigkeit, Unterstützung",
        desc: "Geboren, um zu nähren, willkommen zu heißen und zu führen. Starkes Gefühl der emotionalen Verantwortung und Neigung zur Heilung."
      },
      7: {
        title: "Der Suchende und Philosoph",
        keyword: "Intuition, Spiritualität, Analyse",
        desc: "Investigativer Geist, der darauf ausgerichtet ist, die großen spirituellen und logischen Rätsel des sichtbaren Universums zu entschlüsseln."
      },
      8: {
        title: "Der Macher und Strateger",
        keyword: "Materielle Macht, Fülle, Gleichgewicht",
        desc: "Hervorragende exekutive und kommerzielle Fähigkeiten, die ehrgeizige spirituelle Visionen mit irdischen Errungenschaften in Einklang bringen."
      },
      9: {
        title: "Der altruistische Humanist",
        keyword: "Universalität, Großzügigkeit, Vollendung",
        desc: "Bedingungslose Liebe und globaler Altruismus. Repräsentiert den Höhepunkt der evolutionären Reise des menschlichen Geistes."
      },
      11: {
        title: "Meister-Anstifter und Führer",
        keyword: "Erleuchtung, extreme Sensibilität, Vision",
        desc: "Meisterzahl. Tiefe Verbindung zu höheren Dimensionen. Natürlicher Kanal zur Weitergabe transformativen Wissens."
      },
      22: {
        title: "Der Meister-Baumeister-Architekt",
        keyword: "Materialisierung globaler Träume",
        desc: "Höchste Meisterzahl. Fähigkeit, abstrakte Visionen in nützliche Monumente für die gesamte Menschheit zu verwandeln."
      }
    },
    fr: {
      1: {
        title: "Le Pionnier et Leader",
        keyword: "Indépendance, Initiative, Ambition",
        desc: "Indique l'originalité, le courage et l'instinct primaire de leadership cosmique. Représente le début de nouvelles idées."
      },
      2: {
        title: "Le Diplomate et Pacificateur",
        keyword: "Harmonie, Coopération, Sensibilité",
        desc: "Excellente capacité à arbitrer les conflits, rechercher l'équilibre, exprimer des sentiments et harmoniser les environnements."
      },
      3: {
        title: "L'Artiste et Communicateur",
        keyword: "Créativité, Sociabilité, Joie",
        desc: "Doté de magnétisme et de facilité pour les arts et l'art oratoire. A pour mission de dynamiser les parcours sociaux des autres."
      },
      4: {
        title: "Le Bâtisseur et Organisateur",
        keyword: "Stabilité, Travail Acharné, Ordre",
        desc: "Représente la solidité et les aspects pratiques de la vie mondaine. Axé sur la construction de bases concrètes et durables."
      },
      5: {
        title: "Le Voyageur Libre et Dynamique",
        keyword: "Adaptabilité, Liberté, Aventure",
        desc: "Recherche constante de nouveauté. Excellent pouvoir d'adaptation aux tempêtes, avec un fort esprit d'exploration."
      },
      6: {
        title: "Le Gardien et Conseiller",
        keyword: "Harmonie Familiale, Justice, Soutien",
        desc: "Né pour nourrir, accueillir et guider. Fort sens de la responsabilité affective et penchant pour la guérison."
      },
      7: {
        title: "Le Chercheur et Philosophe",
        keyword: "Intuition, Spiritualité, Analyse",
        desc: "Esprit d'investigation orienté vers la découverte des grands énigmes spirituelles et logiques de l'univers visible."
      },
      8: {
        title: "Le Réalisateur et Stratège",
        keyword: "Pouvoir Matériel, Abondance, Équilibre",
        desc: "Excellentes capacités exécutives et commerciales, conciliant visions spirituelles ambitieuses et réalisations terrestres."
      },
      9: {
        title: "L'Humanitaire Altruiste",
        keyword: "Universalité, Générosité, Achèvement",
        desc: "Amour inconditionnel et altruisme global. Représente le summum du voyage évolutif de l'esprit humain."
      },
      11: {
        title: "Maître Instigateur et Guide",
        keyword: "Illumination, Sensibilité Extrême, Vision",
        desc: "Nombre Maître. Connexion profonde avec les dimensions supérieures. Canal naturel pour transmettre des connaissances transformatrices."
      },
      22: {
        title: "Le Maître Bâtisseur Architecte",
        keyword: "Matérialisation de Rêves Globaux",
        desc: "Nombre Maître Ultime. Capacité à transformer des visions abstraites en monuments utiles pour l'humanité entière."
      }
    }
  };

  const getNumberInfo = (num: number) => {
    const activeLang = lang || 'pt';
    const dict = localizedDictionaries[activeLang] || localizedDictionaries['pt'];
    const raw = dict[num] || {
      pt: {
        title: "Energia Sintética Universal",
        keyword: "Espiritualidade, Equilíbrio, Sincronia",
        desc: "Um vetor vibracional místico idealizado para motivar conexões elevadas com o plano celeste."
      },
      en: {
        title: "Universal Synthetic Energy",
        keyword: "Spirituality, Balance, Synchronicity",
        desc: "A mystical vibrational vector designed to motivate high connections with the celestial plane."
      },
      es: {
        title: "Energía Sintética Universal",
        keyword: "Espiritualidad, Equilibrio, Sincronía",
        desc: "Un vector vibracional místico idealizado para motivar conexiones elevadas con el plano celeste."
      },
      de: {
        title: "Universelle synthetische Energie",
        keyword: "Spiritualität, Gleichgewicht, Synchronität",
        desc: "Ein mystischer Schwingungsvektor, der entwickelt wurde, um hohe Verbindungen mit der himmlischen Ebene zu motivieren."
      },
      fr: {
        title: "Énergie Synthétique Universelle",
        keyword: "Spiritualité, Équilibre, Synchronicité",
        desc: "Un vecteur vibratoire mystique conçu pour motiver des connexions élevées avec le plan céleste."
      }
    }[activeLang as Language] || {
      title: "Energia Sintética Universal",
      keyword: "Espiritualidade, Equilíbrio, Sincronia",
      desc: "Um vetor vibracional místico idealizado para motivar conexões elevadas com o plano celeste."
    };
    return {
      title: raw.title,
      keyword: raw.keyword,
      desc: raw.desc
    };
  };

  const cardsByRole = [
    { key: "lifePath", label: t.lifePathNum, value: numerologyData.lifePath, color: "border-indigo-100 bg-indigo-50/20 text-indigo-900" },
    { key: "expression", label: t.expressionNum, value: numerologyData.expression, color: "border-emerald-100 bg-emerald-50/20 text-emerald-900" },
    { key: "soulUrge", label: t.soulUrgeNum, value: numerologyData.soulUrge, color: "border-amber-100 bg-amber-50/20 text-amber-900" },
    { key: "personality", label: t.personalityNum, value: numerologyData.personality, color: "border-rose-100 bg-rose-50/20 text-rose-900" },
    { key: "destiny", label: t.destinyNum, value: numerologyData.destiny, color: "border-sky-100 bg-sky-50/20 text-sky-900" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Description header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Binary className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-display font-semibold text-neutral-900">{t.numerologyTitle}</h2>
        </div>
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {t.numerologyDesc}
        </p>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {cardsByRole.map((card) => {
          const info = getNumberInfo(card.value);
          return (
            <div
              key={card.key}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition hover:shadow-md ${card.color}`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                  {card.label}
                </span>
                <span className="text-4xl font-display font-extrabold block">
                  {card.value}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-neutral-800 block">
                  {info.title}
                </span>
                <span className="text-[10px] text-neutral-500 block italic leading-tight">
                  {info.keyword}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded explanations details board */}
      <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3">
          {tI18n("Leitura Detalhada de seus Números Força")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardsByRole.slice(0, 4).map((card) => {
            const info = getNumberInfo(card.value);
            return (
              <div key={card.key} className="space-y-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{card.label}</span>
                  <span className="px-2.5 py-0.5 bg-neutral-800 text-white rounded-lg text-xs font-extrabold font-mono">
                    #{card.value}
                  </span>
                </div>
                <h4 className="font-semibold text-neutral-850 text-sm">{info.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {info.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

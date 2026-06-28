// Beautiful, highly-polished mystical celestial avatars encoded as clean SVGs
// O Firestore salva apenas o identificador (ex: 'avatar_sol') e o frontend converte na URI local.

import i18next from 'i18next';

function getActiveLanguage(): 'pt' | 'en' | 'es' | 'de' | 'fr' {
  const lang = (i18next.language || 'pt').toLowerCase().split('-')[0];
  if (['pt', 'en', 'es', 'de', 'fr'].includes(lang)) {
    return lang as 'pt' | 'en' | 'es' | 'de' | 'fr';
  }
  return 'pt';
}

export interface AvatarOption {
  id: string;
  name: string;
  description: string;
  category: string;
  svg: string;
}

const AVATAR_TEMPLATES: Record<string, { name: string; description: string; category: AvatarOption["category"]; svg: string }> = {
  avatar_sol: {
    name: "Sol Místico",
    description: "O astro rei da consciência, brilho pessoal, vitalidade e essência de sua jornada estelar.",
    category: "Astrologia",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="solGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="60%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#b45309" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Starry dust in background -->
      <circle cx="30" cy="40" r="1" fill="#fff" opacity="0.6"/>
      <circle cx="90" cy="80" r="1.5" fill="#fff" opacity="0.8"/>
      <circle cx="25" cy="85" r="1" fill="#fff" opacity="0.3"/>
      <circle cx="95" cy="35" r="1" fill="#fff" opacity="0.4"/>
      <!-- Sun rays -->
      <g stroke="#f59e0b" stroke-width="2" stroke-linecap="round" opacity="0.85">
        <line x1="60" y1="20" x2="60" y2="10" />
        <line x1="60" y1="100" x2="60" y2="110" />
        <line x1="20" y1="60" x2="10" y2="60" />
        <line x1="100" y1="60" x2="110" y2="60" />
        <!-- Diagonal rays -->
        <line x1="32" y1="32" x2="24" y2="24" />
        <line x1="88" y1="88" x2="96" y2="96" />
        <line x1="32" y1="88" x2="24" y2="96" />
        <line x1="88" y1="32" x2="96" y2="24" />
      </g>
      <!-- Sun body -->
      <circle cx="60" cy="60" r="22" fill="url(#solGrad)" />
      <!-- Mystical sun face detailing (sacred art) -->
      <path d="M48 56 C 52 54, 56 58, 56 56" fill="none" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M72 56 C 68 54, 64 58, 64 56" fill="none" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M54 68 C 57 71, 63 71, 66 68" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      <path d="M60 58 L58 63 L62 63 Z" fill="#78350f" />
    </svg>`
  },
  avatar_lua: {
    name: "Lua Crescente",
    description: "Soberana das emoções inconscientes, intuição, sonhos profundos e marés psíquicas.",
    category: "Astrologia",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="luaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="50%" stop-color="#93c5fd" />
          <stop offset="100%" stop-color="#1e40af" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Starry dust -->
      <circle cx="45" cy="30" r="1" fill="#fff" opacity="0.6"/>
      <circle cx="35" cy="85" r="1.5" fill="#fff" opacity="0.8"/>
      <circle cx="85" cy="80" r="1" fill="#fff" opacity="0.3"/>
      <!-- Glowing crescent moon -->
      <path d="M75 32 C 45 32, 38 60, 38 78 C 38 90, 48 98, 55 98 C 40 92, 44 64, 64 50 C 74 42, 83 45, 75 32 Z" fill="url(#luaGrad)" />
      <!-- Magic stars kissing the moon -->
      <path d="M85 45 L87 50 L92 50 L88 53 L90 58 L85 55 L80 58 L82 53 L78 50 L83 50 Z" fill="#fbbf24" opacity="0.95" transform="scale(0.8) translate(15, 12)"/>
      <path d="M85 45 L87 50 L92 50 L88 53 L90 58 L85 55 L80 58 L82 53 L78 50 L83 50 Z" fill="#38bdf8" opacity="0.75" transform="scale(0.5) translate(45, 60)"/>
    </svg>`
  },
  avatar_olho: {
    name: "Olho da Providência",
    description: "Símbolo ancestral da visão espiritual, discernimento cósmico e o desvelar do véu do invisível.",
    category: "Misticismo",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="olhoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#c084fc" stop-opacity="0.3" />
          <stop offset="90%" stop-color="#0f172a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <circle cx="60" cy="60" r="40" fill="url(#olhoGlow)" />
      <!-- Starburst vectors in center -->
      <g stroke="#c084fc" stroke-width="1" opacity="0.4">
        <line x1="60" y1="25" x2="60" y2="95"/>
        <line x1="25" y1="60" x2="95" y2="60"/>
      </g>
      <!-- Mystical Triangle -->
      <polygon points="60,34 92,86 28,86" fill="none" stroke="#fb7185" stroke-width="2" stroke-linejoin="round" />
      <!-- The Eye -->
      <path d="M40 60 Q60 42 80 60 Q60 78 40 60 Z" fill="#1e1b4b" stroke="#f3f4f6" stroke-width="2" />
      <circle cx="60" cy="60" r="8" fill="#38bdf8" stroke="#1e293b" stroke-width="2" />
      <circle cx="60" cy="60" r="3" fill="#ffffff" />
      <!-- Eyelash marks -->
      <line x1="60" y1="44" x2="60" y2="40" stroke="#f3f4f6" stroke-width="2"/>
      <line x1="47" y1="47" x2="43" y2="43" stroke="#f3f4f6" stroke-width="2"/>
      <line x1="73" y1="47" x2="77" y2="43" stroke="#f3f4f6" stroke-width="2"/>
    </svg>`
  },
  avatar_saturno: {
    name: "Saturno Astral",
    description: "Guardião do tempo primordial, disciplina cármica, limites estruturais e a maestria da alma.",
    category: "Astrologia",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="satGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Star background -->
      <circle cx="85" cy="35" r="1.5" fill="#fef08a" opacity="0.8"/>
      <circle cx="35" cy="85" r="1" fill="#fff" opacity="0.5"/>
      <circle cx="28" cy="32" r="1" fill="#fff" opacity="0.3"/>
      <!-- Behind Ring Part -->
      <g clip-path="url(#planetClip)">
        <circle cx="60" cy="60" r="18" fill="url(#satGrad)" />
      </g>
      <!-- Saturn's Rings -->
      <ellipse cx="60" cy="60" rx="42" ry="10" fill="none" stroke="#fef08a" stroke-width="5" transform="rotate(-15, 60, 60)" opacity="0.95" />
      <ellipse cx="60" cy="60" rx="36" ry="7" fill="none" stroke="#f59e0b" stroke-width="1.5" transform="rotate(-15, 60, 60)" opacity="0.8" />
      <!-- Front Planet Body (overlapping) -->
      <path d="M 60 78 A 18 18 0 0 0 60 42 A 18 18 0 0 0 60 78" fill="url(#satGrad)" />
    </svg>`
  },
  avatar_estrela: {
    name: "Estrela Guia",
    description: "A bússola mística do destino, trazendo sabedoria sideral e guiando seus passos escuros.",
    category: "Cosmos",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Geometry circles -->
      <circle cx="60" cy="60" r="32" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="2,2" />
      <circle cx="60" cy="60" r="22" fill="none" stroke="#475569" stroke-width="1" />
      <!-- Compass markings -->
      <line x1="60" y1="20" x2="60" y2="100" stroke="#1e293b" stroke-width="1"/>
      <line x1="20" y1="60" x2="100" y2="60" stroke="#1e293b" stroke-width="1"/>
      <!-- The Eight Pointed Star -->
      <path d="M60 22 L65 48 L91 48 L70 61 L78 86 L60 70 L42 86 L50 61 L29 48 L55 48 Z" fill="#fef08a" stroke="#eab308" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- Inner star accent -->
      <path d="M60 38 L62 52 L76 52 L65 58 L69 72 L60 64 L51 72 L55 58 L44 52 L58 52 Z" fill="#ffffff" />
      <!-- Core magical sparkle -->
      <circle cx="60" cy="57" r="2" fill="#eab308" />
    </svg>`
  },
  avatar_oraculo: {
    name: "Cálice de Luz",
    description: "Receptáculo místico das poções psíquicas, transmutação e das revelações oníricas de Morfeu.",
    category: "Misticismo",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="chalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fcd34d" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Bubbles of dream smoke -->
      <path d="M50 48 Q40 34 50 24 T65 20 T70 34" fill="none" stroke="#a5b4fc" stroke-width="2" stroke-linecap="round" opacity="0.5" stroke-dasharray="2,2"/>
      <circle cx="56" cy="32" r="3" fill="#a5b4fc" opacity="0.6"/>
      <circle cx="68" cy="25" r="2" fill="#818cf8" opacity="0.4"/>
      <circle cx="44" cy="22" r="1.5" fill="#c084fc" opacity="0.5"/>
      <!-- The Chalice (Cálice) -->
      <!-- Bowl -->
      <path d="M38 48 C38 72, 82 72, 82 48 Z" fill="url(#chalGrad)" />
      <ellipse cx="60" cy="48" rx="22" ry="4" fill="#fef08a" stroke="#92400e" stroke-width="1"/>
      <!-- Stem -->
      <rect x="57" y="66" width="6" height="18" fill="url(#chalGrad)" />
      <!-- Base -->
      <path d="M46 84 C48 84, 52 88, 60 88 C68 88, 72 84, 74 84 Z" fill="url(#chalGrad)" />
      <!-- Gem icon on the chalice -->
      <polygon points="60,56 64,61 60,66 56,61" fill="#fb7185" />
    </svg>`
  },
  avatar_nebulosa: {
    name: "Nebulosa Sagrada",
    description: "O berçário divino dos mistérios cósmicos, pó estelar inteligente carregado de cura.",
    category: "Cosmos",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <radialGradient id="nebGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ec4899" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Nebulosa background bloom -->
      <circle cx="60" cy="60" r="40" fill="url(#nebGlow)" />
      <!-- Overlapping spirals -->
      <path d="M60 60 Q80 40 50 24 T80 72" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
      <path d="M60 60 Q40 80 70 96 T40 48" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
      <!-- Micro-stars sparkles -->
      <circle cx="52" cy="45" r="1.5" fill="#fff" />
      <circle cx="68" cy="74" r="1.5" fill="#fff" />
      <polygon points="40,70 42,72 40,74 38,72" fill="#fff" />
      <polygon points="80,40 82,42 80,44 78,42" fill="#fff" />
    </svg>`
  },
  avatar_cometa: {
    name: "Voo do Cometa",
    description: "O mensageiro veloz do espaço infinito, que corta o destino trazendo sorte e revoluções.",
    category: "Cosmos",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="cometGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="1" />
          <stop offset="40%" stop-color="#ec4899" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#0b0f19" stroke="#1e293b" stroke-width="3" />
      <circle cx="60" cy="60" r="48" fill="#0f172a" />
      <!-- Starry trail background -->
      <circle cx="35" cy="35" r="1.2" fill="#fff" opacity="0.3"/>
      <circle cx="85" cy="85" r="1" fill="#fff" opacity="0.7"/>
      <!-- Comet Trail (cauda do cometa) -->
      <path d="M25 95 L95 25 L88 40 L25 95" fill="url(#cometGrad)" opacity="0.9" />
      <line x1="90" y1="30" x2="35" y2="85" stroke="#f472b6" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,4" />
      <!-- Glowing Comet Head (Cabeça) -->
      <circle cx="90" cy="30" r="6" fill="#e0f2fe" />
      <circle cx="90" cy="30" r="10" fill="#38bdf8" opacity="0.4" />
      <!-- Magic bursts -->
      <circle cx="65" cy="55" r="1.5" fill="#f1f5f9" />
      <circle cx="48" cy="72" r="1" fill="#f1f5f9" opacity="0.7"/>
    </svg>`
  }
};

const AVATAR_TRANSLATIONS: Record<string, Record<'pt' | 'en' | 'es' | 'de' | 'fr', { name: string; description: string; category: string }>> = {
  avatar_sol: {
    pt: { name: "Sol Místico", description: "O astro rei da consciência, brilho pessoal, vitalidade e essência de sua jornada estelar.", category: "Astrologia" },
    en: { name: "Mystical Sun", description: "The ruling star of consciousness, personal brilliance, vitality, and the essence of your stellar journey.", category: "Astrology" },
    es: { name: "Sol Místico", description: "El astro rey de la conciencia, brillo personal, vitalidad y esencia de tu viaje estelar.", category: "Astrología" },
    de: { name: "Mystische Sonne", description: "Der Herrscherstern des Bewusstseins, des persönlichen Glanzes, der Vitalität und der Essenz Ihrer stellaren Reise.", category: "Astrologie" },
    fr: { name: "Soleil Mystique", description: "L'astre roi de la conscience, de l'éclat personnel, de la vitalité et de l'essence de votre voyage stellaire.", category: "Astrologie" }
  },
  avatar_lua: {
    pt: { name: "Lua Crescente", description: "Soberana das emoções inconscientes, intuição, sonhos profundos e marés psíquicas.", category: "Astrologia" },
    en: { name: "Crescent Moon", description: "Sovereign of subconscious emotions, intuition, deep dreams, and psychic tides.", category: "Astrology" },
    es: { name: "Luna Creciente", description: "Soberana de las emociones subconscientes, intuición, sueños profundos y mareas psíquicas.", category: "Astrología" },
    de: { name: "Sichelmond", description: "Herrscher über unterbewusste Emotionen, Intuition, tiefe Träume und psychische Gezeiten.", category: "Astrologie" },
    fr: { name: "Croissant de Lune", description: "Souveraine des émotions subconscientes, de l'intuition, des rêves profonds et des marées psychiques.", category: "Astrologie" }
  },
  avatar_olho: {
    pt: { name: "Olho da Providência", description: "Símbolo ancestral da visão espiritual, discernimento cósmico e o desvelar do véu do invisível.", category: "Misticismo" },
    en: { name: "Eye of Providence", description: "Ancestral symbol of spiritual vision, cosmic discernment, and the unveiling of the invisible.", category: "Mysticism" },
    es: { name: "Ojo de la Providencia", description: "Símbolo ancestral de la visión espiritual, discernimiento cósmico y la revelación de lo invisible.", category: "Misticismo" },
    de: { name: "Auge der Vorsehung", description: "Ahnen-Symbol für spirituelle Vision, kosmische Einsicht und die Enthüllung des Unsichtbaren.", category: "Mystizismus" },
    fr: { name: "Œil de la Providence", description: "Symbole ancestral de la vision spirituelle, du discernement cosmique et du dévoilement de l'invisible.", category: "Mysticisme" }
  },
  avatar_saturno: {
    pt: { name: "Saturno Astral", description: "Guardião do tempo primordial, disciplina cármica, limites estruturais e a maestria da alma.", category: "Astrologia" },
    en: { name: "Astral Saturn", description: "Guardian of primordial time, karmic discipline, structural boundaries, and soul mastery.", category: "Astrology" },
    es: { name: "Saturno Astral", description: "Guardián del tempo primordial, disciplina kármica, límites estructurales y maestría del alma.", category: "Astrología" },
    de: { name: "Astraler Saturn", description: "Wächter der Urzeit, karmischen Disziplin, baulichen Grenzen und Meisterschaft der Seele.", category: "Astrologie" },
    fr: { name: "Saturne Astral", description: "Gardien du temps primordial, de la discipline karmique, des limites structurelles et de la maîtrise de l'âme.", category: "Astrologie" }
  },
  avatar_estrela: {
    pt: { name: "Estrela Guia", description: "A bússola mística do destino, trazendo sabedoria sideral e guiando seus passos escuros.", category: "Cosmos" },
    en: { name: "Guiding Star", description: "The mystical compass of destiny, bringing sidereal wisdom and guiding your dark steps.", category: "Cosmos" },
    es: { name: "Estrella Guía", description: "La brújula mística del destino, que trae sabiduría sideral y guía tus pasos oscuros.", category: "Cosmos" },
    de: { name: "Leitstern", description: "Der mystische Kompass des Schicksals, der siderische Weisheit bringt und Ihre dunklen Schritte leitet.", category: "Kosmos" },
    fr: { name: "Étoile Guide", description: "La boussole mystique du destin, apportant une sagesse sidérale et guidant vos pas sombres.", category: "Cosmos" }
  },
  avatar_oraculo: {
    pt: { name: "Cálice de Luz", description: "Receptáculo místico das poções psíquicas, transmutação e das revelações oníricas de Morfeu.", category: "Misticismo" },
    en: { name: "Chalice of Light", description: "Mystical vessel of psychic potions, transmutation, and the dream revelations of Morpheus.", category: "Mysticism" },
    es: { name: "Cáliz de Luz", description: "Receptáculo místico de pociones psíquicas, transmutación y revelaciones oníricas de Morfeo.", category: "Misticismo" },
    de: { name: "Kelch des Lichts", description: "Mystisches Gefäß für psychische Tränke, Transmutation und die Traumoffenbarungen von Morpheus.", category: "Mystizismus" },
    fr: { name: "Calice de Lumière", description: "Récipient mystique de potions psychiques, de transmutation et des révélations oniriques de Morphée.", category: "Mysticisme" }
  },
  avatar_nebulosa: {
    pt: { name: "Nebulosa Sagrada", description: "O berçário divino dos mistérios cósmicos, pó estelar inteligente carregado de cura.", category: "Cosmos" },
    en: { name: "Sacred Nebula", description: "The divine nursery of cosmic mysteries, intelligent stardust loaded with healing.", category: "Cosmos" },
    es: { name: "Nebulosa Sagrada", description: "El vivero divino de misterios cósmicos, polvo estelar inteligente cargado de curación.", category: "Cosmos" },
    de: { name: "Heiliger Nebel", description: "Die göttliche Wiege kosmischer Geheimnisse, intelligenter Sternenstaub voller Heilung.", category: "Kosmos" },
    fr: { name: "Nébuleuse Sacrée", description: "La pépinière divine des mystères cosmiques, poussière d'étoiles intelligente chargée de guérison.", category: "Cosmos" }
  },
  avatar_cometa: {
    pt: { name: "Voo do Cometa", description: "O mensageiro veloz do espaço infinito, que corta o destino trazendo sorte e revoluções.", category: "Cosmos" },
    en: { name: "Comet Flight", description: "The swift messenger of infinite space, cutting through destiny, bringing luck and revolutions.", category: "Cosmos" },
    es: { name: "Vuelo del Cometa", description: "El veloz mensajero del espacio infinito, que corta el destino trayendo suerte y revoluciones.", category: "Cosmos" },
    de: { name: "Kometenflug", description: "Der schnelle Bote des unendlichen Raums, der das Schicksal durchbricht und Glück und Revolutionen bringt.", category: "Kosmos" },
    fr: { name: "Vol de Comète", description: "Le messager rapide de l'espace infini, traversant le destin, apportant chance et révolutions.", category: "Cosmos" }
  }
};

export function getAvatarsList(): AvatarOption[] {
  const lang = getActiveLanguage();
  return Object.entries(AVATAR_TEMPLATES).map(([id, item]) => {
    const translation = AVATAR_TRANSLATIONS[id]?.[lang] || AVATAR_TRANSLATIONS[id]?.['pt'] || item;
    return {
      id,
      ...item,
      name: translation.name,
      description: translation.description,
      category: translation.category
    };
  });
}

export function getAvatarUrl(avatarIdOrUrl: string | undefined): string {
  if (!avatarIdOrUrl) {
    // Default to Moon avatar
    const defaultSvg = AVATAR_TEMPLATES.avatar_lua.svg;
    return `data:image/svg+xml;utf8,${encodeURIComponent(defaultSvg)}`;
  }

  // If it's a standard URL or pre-existing base64 data, return it directly
  if (avatarIdOrUrl.startsWith("http") || avatarIdOrUrl.startsWith("data:")) {
    return avatarIdOrUrl;
  }

  // If it matches one of our templates
  if (AVATAR_TEMPLATES[avatarIdOrUrl]) {
    const svg = AVATAR_TEMPLATES[avatarIdOrUrl].svg;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // If someone passed an unindexed string but starts with custom avatar prefix, default
  if (avatarIdOrUrl.startsWith("avatar_")) {
    const defaultSvg = AVATAR_TEMPLATES.avatar_lua.svg;
    return `data:image/svg+xml;utf8,${encodeURIComponent(defaultSvg)}`;
  }

  // Fallback to the string itself (maybe base64 or other URL type)
  return avatarIdOrUrl;
}

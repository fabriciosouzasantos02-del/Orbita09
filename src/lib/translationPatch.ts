export function applyTranslationPatches(translations: Record<string, Record<string, string>>) {
  if (!translations) return;

  const patches: Record<string, Record<string, string>> = {
    en: {
      "Abrir Dica Lunar Rápida": "Open Quick Lunar Tip",
      "Sussurro Lunar Diário": "Daily Lunar Whisper",
      "Minimizar dica": "Minimize tip",
      "Foco Conectado": "Connected Focus",
      "Sintonizar Freqüência": "Tune Frequency",
      "+150 Pontos Ativados": "+150 Points Activated",
      "Venerar Lua (+150 pts)": "Venerate Moon (+150 pts)",
      "Monitor em Tempo Real": "Real-Time Monitor",
      "Seus Trânsitos Horários e Energias do Dia": "Your Hourly Transits and Energies of the Day",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Analysis of how planets flow over your natal birth chart.",
      "Sincronizado: Hoje": "Synchronized: Today",
      "Planetas Transitando no Céu": "Planets Transiting in the Sky",
      "Pontuações Celestes Planas": "Celestial Plane Scores",
      "Criatividade e Alinhamento": "Creativity and Alignment",
      "Diálogo e Escrita": "Dialogue and Writing",
      "Vontade Física e Esporte": "Physical Will and Sports",
      "Dica do Oráculo:": "Oracle Tip:",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Today the solar flow favors structural review. Great period to finalize writings and practice inner reflection without harmful external pressures."
    },
    es: {
      "Abrir Dica Lunar Rápida": "Abrir Consejo Lunar Rápido",
      "Sussurro Lunar Diário": "Susurro Lunar Diario",
      "Minimizar dica": "Minimizar consejo",
      "Foco Conectado": "Enfoque Conectado",
      "Sintonizar Freqüência": "Sintonizar Frecuencia",
      "+150 Pontos Ativados": "+150 Puntos Activados",
      "Venerar Lua (+150 pts)": "Venerar Luna (+150 pts)",
      "Monitor em Tempo Real": "Monitor en Tiempo Real",
      "Seus Trânsitos Horários e Energias do Dia": "Tus Tránsitos Horarios y Energías del Día",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Análisis de cómo los planetas fluyen sobre tu composición natal de nacimiento.",
      "Sincronizado: Hoje": "Sincronizado: Hoy",
      "Planetas Transitando no Céu": "Planetas Transitando en el Cielo",
      "Pontuações Celestes Planas": "Puntuaciones Celestes Planas",
      "Criatividade e Alinhamento": "Creatividad y Alineación",
      "Diálogo e Escrita": "Diálogo y Escritura",
      "Vontade Física e Esporte": "Voluntad Física y Deporte",
      "Dica do Oráculo:": "Consejo del Oráculo:",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Hoy el flujo solar favorece la revisión estructural. Gran período para finalizar escritos y practicar la introspección sin presiones externas nocivas."
    },
    de: {
      "Abrir Dica Lunar Rápida": "Schnellen Mond-Tipp öffnen",
      "Sussurro Lunar Diário": "Tägliches Mondflüstern",
      "Minimizar dica": "Tipp minimieren",
      "Foco Conectado": "Verbundener Fokus",
      "Sintonizar Freqüência": "Frequenz abstimmen",
      "+150 Pontos Ativados": "+150 Punkte aktiviert",
      "Venerar Lua (+150 pts)": "Mond verehren (+150 Pkt)",
      "Monitor em Tempo Real": "Echtzeit-Monitor",
      "Seus Trânsitos Horários e Energias do Dia": "Ihre stündlichen Transite und Tagesenergien",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Analyse, wie die Planeten über Ihr Geburtshoroskop fließen.",
      "Sincronizado: Hoje": "Synchronisiert: Heute",
      "Planetas Transitando no Céu": "Planeten transitierten am Himmel",
      "Pontuações Celestes Planas": "Himmlische Ebenenwerte",
      "Criatividade e Alinhamento": "Kreativität und Ausrichtung",
      "Diálogo e Escrita": "Dialog und Schreiben",
      "Vontade Física e Esporte": "Körperlicher Wille und Sport",
      "Dica do Oráculo:": "Orakel-Tipp:",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Heute begünstigt der Sonnenfluss strukturelle Überprüfungen. Hervorragende Zeit, um Schriften fertigzustellen und innere Einkehr ohne schädlichen äußeren Druck zu üben."
    },
    fr: {
      "Abrir Dica Lunar Rápida": "Ouvrir le Conseil Lunaire Rapide",
      "Sussurro Lunar Diário": "Chuchotement Lunaire Quotidien",
      "Minimizar dica": "Réduire le conseil",
      "Foco Conectado": "Focus Connecté",
      "Sintonizar Freqüência": "Accorder la Fréquence",
      "+150 Pontos Ativados": "+150 Points Activés",
      "Venerar Lua (+150 pts)": "Vénérer la Lune (+150 pts)",
      "Monitor em Tempo Real": "Moniteur en Temps Réel",
      "Seus Trânsitos Horários e Energias do Dia": "Vos Transits Horaires et Énergies du Jour",
      "Análise de como os planetas flutuam sobre sua composição natal de nascimento.": "Analyse de la façon dont les planètes transitent sur votre thème natal de naissance.",
      "Sincronizado: Hoje": "Synchronisé : Aujourd'hui",
      "Planetas Transitando no Céu": "Planètes Transitaires dans le Ciel",
      "Pontuações Celestes Planas": "Scores Célestes Plans",
      "Criatividade e Alinhamento": "Créativité et Alignement",
      "Diálogo e Escrita": "Dialogue et Écriture",
      "Vontade Física e Esporte": "Volunté Physique et Sport",
      "Dica do Oráculo:": "Conseil de l'Oracle :",
      "Hoje o fluxo solar favorece a revisão estrutural. Ótimo período para finalizar escritos e praticar interiorizações sem pressões externas deletérias.": "Aujourd'hui, le flux solaire favorise la révision structurelle. Excellente période pour finaliser des écrits et pratiquer l'introspection sans pressions extérieures nuisibles."
    }
  };

  const languages = ['pt', 'en', 'es', 'de', 'fr'];
  for (const lang of ['en', 'es', 'de', 'fr']) {
    if (translations[lang] && patches[lang]) {
      Object.assign(translations[lang], patches[lang]);
    }
  }

  // Ensure 100% key parity
  const ptKeys = Object.keys(translations.pt || {});
  for (const lang of languages) {
    if (!translations[lang]) translations[lang] = {};
    for (const key of ptKeys) {
      if (!translations[lang][key]) {
        translations[lang][key] = (patches[lang] && patches[lang][key]) || translations.pt[key] || key;
      }
    }
  }
}

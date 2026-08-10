import { Language } from './types';

/**
 * Final parity patch for the fixed Transits/Biorhythm UI.
 * These exact source strings are used as legacy i18next keys by the current
 * interface. Every supported language must contain them or validate-i18n
 * intentionally fails the production build.
 */
export const vercelBuildFixTranslations: Record<Language, Record<string, string>> = {
  pt: {
    'O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.': 'O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.',
    'Sua vibração abundante orientada para August 2026.': 'Sua vibração abundante orientada para Agosto de 2026.',
    'Mapa dos Próximos 30 Dias (Calendário de Trânsitos)': 'Mapa dos Próximos 30 Dias (Calendário de Trânsitos)',
    'Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.': 'Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.',
    'Trânsito de Casa Astrológica': 'Trânsito de Casa Astrológica',
    'Relação de Aspectos': 'Relação de Aspectos'
  },
  en: {
    'O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.': 'Biorhythm helps you synchronize your daily efficiency peaks across the 7 spheres of life experience. Scroll down or navigate sideways to analyze your complete 15-day chart and the corresponding timer for physical, emotional, and spiritual phase transitions.',
    'Sua vibração abundante orientada para August 2026.': 'Your abundant vibration for August 2026.',
    'Mapa dos Próximos 30 Dias (Calendário de Trânsitos)': 'Next 30 Days Map (Transit Calendar)',
    'Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.': 'Select a day to analyze transits, aspects, and exclusive energies in real time.',
    'Trânsito de Casa Astrológica': 'Astrological House Transit',
    'Relação de Aspectos': 'Aspect Relationship'
  },
  es: {
    'O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.': 'El biorritmo te ayuda a sincronizar tus picos diarios de eficiencia en las 7 esferas de la experiencia vital. Desplázate hacia abajo o navega lateralmente para analizar en detalle tu gráfico completo de 15 días y el temporizador correspondiente de las transiciones de las fases física, emocional y espiritual.',
    'Sua vibração abundante orientada para August 2026.': 'Tu vibración abundante orientada hacia agosto de 2026.',
    'Mapa dos Próximos 30 Dias (Calendário de Trânsitos)': 'Mapa de los Próximos 30 Días (Calendario de Tránsitos)',
    'Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.': 'Selecciona un día para analizar los tránsitos, aspectos y energías exclusivas en tiempo real.',
    'Trânsito de Casa Astrológica': 'Tránsito de Casa Astrológica',
    'Relação de Aspectos': 'Relación de Aspectos'
  },
  de: {
    'O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.': 'Der Biorhythmus hilft dir, deine täglichen Leistungsspitzen in den 7 Sphären der Lebenserfahrung zu synchronisieren. Scrolle nach unten oder navigiere seitlich, um dein vollständiges 15-Tage-Diagramm und den entsprechenden Timer für die Übergänge der körperlichen, emotionalen und spirituellen Phasen detailliert zu analysieren.',
    'Sua vibração abundante orientada para August 2026.': 'Deine auf August 2026 ausgerichtete Fülle-Vibration.',
    'Mapa dos Próximos 30 Dias (Calendário de Trânsitos)': 'Karte der nächsten 30 Tage (Transitkalender)',
    'Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.': 'Wähle einen Tag aus, um Transite, Aspekte und exklusive Energien in Echtzeit zu analysieren.',
    'Trânsito de Casa Astrológica': 'Transit durch ein astrologisches Haus',
    'Relação de Aspectos': 'Aspektbeziehung'
  },
  fr: {
    'O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.': 'Le biorythme vous aide à synchroniser vos pics d’efficacité quotidiens dans les 7 sphères de l’expérience de vie. Faites défiler vers le bas ou naviguez latéralement pour analyser en détail votre graphique complet sur 15 jours et le minuteur correspondant aux transitions des phases physique, émotionnelle et spirituelle.',
    'Sua vibração abundante orientada para August 2026.': 'Votre vibration d’abondance orientée vers août 2026.',
    'Mapa dos Próximos 30 Dias (Calendário de Trânsitos)': 'Carte des 30 prochains jours (calendrier des transits)',
    'Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.': 'Sélectionnez un jour pour analyser les transits, les aspects et les énergies exclusives en temps réel.',
    'Trânsito de Casa Astrológica': 'Transit d’une maison astrologique',
    'Relação de Aspectos': 'Relation des aspects'
  }
};

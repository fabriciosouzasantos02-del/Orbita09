import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../lib/i18n';

// 5. Definir o tipo para os idiomas suportados (pt, en, es, de, fr)
export type Idioma = 'pt' | 'en' | 'es' | 'de' | 'fr';

// 5. Objeto de dicionário de tradução fortemente tipado com TypeScript
export interface TraducaoSchema {
  // Títulos e Subtítulos do aplicativo
  appName: string;
  appSubtitle: string;
  welcomeBuscador: string;
  userArea: string;
  
  // Menus e Abas
  birthChart: string;
  dreams: string;
  premium: string;
  settings: string;
  transits: string;
  missions: string;
  tarot: string;
  constellations: string;
  planetsOrbia: string;

  // Botões
  saveMap: string;
  btnSave: string;
  btnCancel: string;
  btnShareApp: string;
  btnUpgrade: string;
  btnBack: string;

  // Modais, mensagens e configurações
  languageSelectLabel: string;
  successSave: string;
  confirmDeleteTitle: string;
  confirmDeleteBody: string;
}

// Dicionário com todas as chaves e suas respectivas traduções por idioma
export const dicionario: Record<Idioma, TraducaoSchema> = {
  pt: {
    appName: 'PORTAL ÓRBITA',
    appSubtitle: 'PLATAFORMA PREMIUM DE ASTROLOGIA PERSONALIZADA',
    welcomeBuscador: 'Seja bem-vindo, Buscador!',
    userArea: 'Área do Usuário',
    birthChart: 'Mapa Astral',
    dreams: 'Sonhos',
    premium: 'Premium',
    settings: 'Configurações',
    transits: 'Trânsitos',
    missions: 'Missões',
    tarot: 'Tarot Cósmico',
    constellations: 'Constelações',
    planetsOrbia: 'Planetas & Orbia',
    saveMap: 'Salvar Mapa',
    btnSave: 'Salvar Configurações',
    btnCancel: 'Cancelar',
    btnShareApp: 'Compartilhar Aplicativo',
    btnUpgrade: 'Continuar Minha Jornada',
    btnBack: 'Voltar ao Portal',
    languageSelectLabel: 'Idioma da Plataforma',
    successSave: 'Configurações salvas com sucesso!',
    confirmDeleteTitle: 'Confirmar Exclusão',
    confirmDeleteBody: 'Tem certeza de que deseja prosseguir com esta ação?'
  },
  en: {
    appName: 'ORBITA PORTAL',
    appSubtitle: 'PREMIUM PERSONALIZED ASTROLOGY PLATFORM',
    welcomeBuscador: 'Welcome, Seeker!',
    userArea: 'User Area',
    birthChart: 'Birth Chart',
    dreams: 'Dreams',
    premium: 'Premium',
    settings: 'Settings',
    transits: 'Transits',
    missions: 'Missions',
    tarot: 'Cosmic Tarot',
    constellations: 'Constellations',
    planetsOrbia: 'Planets & Orbia',
    saveMap: 'Save Chart',
    btnSave: 'Save Settings',
    btnCancel: 'Cancel',
    btnShareApp: 'Share Application',
    btnUpgrade: 'Continue My Journey',
    btnBack: 'Back to Portal',
    languageSelectLabel: 'Platform Language',
    successSave: 'Settings saved successfully!',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteBody: 'Are you sure you want to proceed with this action?'
  },
  es: {
    appName: 'PORTAL ÓRBITA',
    appSubtitle: 'PLATAFORMA PREMIUM DE ASTROLOGÍA PERSONALIZADA',
    welcomeBuscador: '¡Bienvenido, Buscador!',
    userArea: 'Área del Usuario',
    birthChart: 'Carta Natal',
    dreams: 'Sueños',
    premium: 'Premium',
    settings: 'Configuraciones',
    transits: 'Tránsitos',
    missions: 'Misiones',
    tarot: 'Tarot Cósmico',
    constellations: 'Constelaciones',
    planetsOrbia: 'Planetas y Orbia',
    saveMap: 'Guardar Mapa',
    btnSave: 'Guardar Configuraciones',
    btnCancel: 'Cancelar',
    btnShareApp: 'Compartir Aplicación',
    btnUpgrade: 'Continuar Mi Viaje',
    btnBack: 'Volver al Portal',
    languageSelectLabel: 'Idioma de la Plataforma',
    successSave: '¡Configuraciones guardadas con éxito!',
    confirmDeleteTitle: 'Confirmar Eliminación',
    confirmDeleteBody: '¿Está seguro de que desea continuar con esta acción?'
  },
  de: {
    appName: 'ORBITA PORTAL',
    appSubtitle: 'PREMIUM PLATTFORM FÜR PERSONALISIERTE ASTROLOGIE',
    welcomeBuscador: 'Willkommen, Suchender!',
    userArea: 'Benutzerbereich',
    birthChart: 'Geburtshoroskop',
    dreams: 'Träume',
    premium: 'Premium',
    settings: 'Einstellungen',
    transits: 'Transite',
    missions: 'Missionen',
    tarot: 'Kosmisches Tarot',
    constellations: 'Konstellationen',
    planetsOrbia: 'Planeten & Orbia',
    saveMap: 'Horoskop Speichern',
    btnSave: 'Einstellungen Speichern',
    btnCancel: 'Abbrechen',
    btnShareApp: 'App Teilen',
    btnUpgrade: 'Meine Reise Fortsetzen',
    btnBack: 'Zurück zum Portal',
    languageSelectLabel: 'Platttformsprache',
    successSave: 'Einstellungen erfolgreich gespeichert!',
    confirmDeleteTitle: 'Löschen Bestätigen',
    confirmDeleteBody: 'Sind Sie sicher, dass Sie mit dieser Aktion fortfahren möchten?'
  },
  fr: {
    appName: 'PORTAIL ORBITA',
    appSubtitle: 'PLATEFORME D\'ASTROLOGIE PERSONNALISÉE HAUT DE GAMME',
    welcomeBuscador: 'Bienvenue, Chercheur !',
    userArea: 'Espace Utilisateur',
    birthChart: 'Carte du Ciel',
    dreams: 'Rêves',
    premium: 'Premium',
    settings: 'Paramètres',
    transits: 'Transits',
    missions: 'Missions',
    tarot: 'Tarot Cosmique',
    constellations: 'Constellations',
    planetsOrbia: 'Planètes & Orbia',
    saveMap: 'Enregistrer la Carte',
    btnSave: 'Enregistrer les Paramètres',
    btnCancel: 'Annuler',
    btnShareApp: 'Partager l\'Application',
    btnUpgrade: 'Continuer Mon Voyage',
    btnBack: 'Retour au Portail',
    languageSelectLabel: 'Langue de la Plateforme',
    successSave: 'Paramètres enregistrés avec succès !',
    confirmDeleteTitle: 'Confirmer la Suppression',
    confirmDeleteBody: 'Êtes-vous sûr de vouloir poursuivre cette action ?'
  }
};

// 1. Criar o IdiomaContext
interface IdiomaContextType {
  idioma: Idioma;
  mudarIdioma: (novoIdioma: Idioma) => void;
  t: (chave: keyof TraducaoSchema) => string;
}

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

interface IdiomaProviderProps {
  children: ReactNode;
}

export function IdiomaProvider({ children }: IdiomaProviderProps) {
  // 3. Inicialização com leitura do localStorage
  const [idioma, setIdioma] = useState<Idioma>(() => {
    const salvo = localStorage.getItem('orbi_preferred_language');
    if (salvo && ['pt', 'en', 'es', 'de', 'fr'].includes(salvo)) {
      return salvo as Idioma;
    }
    return 'pt'; // Retorna padrão temporariamente; o useEffect cuidará do navigator se necessário
  });

  // 2. Na inicialização do app (useEffect), ler navigator.language se não houver escolha salva
  useEffect(() => {
    const salvo = localStorage.getItem('orbi_preferred_language');
    let detectado: Idioma = 'pt';
    if (salvo && ['pt', 'en', 'es', 'de', 'fr'].includes(salvo)) {
      detectado = salvo as Idioma;
    } else if (typeof navigator !== 'undefined') {
      const sysLang = navigator.language.toLowerCase();
      if (sysLang.startsWith('de')) detectado = 'de';
      else if (sysLang.startsWith('es')) detectado = 'es';
      else if (sysLang.startsWith('fr')) detectado = 'fr';
      else if (sysLang.startsWith('en')) detectado = 'en';
      localStorage.setItem('orbi_preferred_language', detectado);
    }
    setIdioma(detectado);
    i18n.changeLanguage(detectado);
  }, []);

  // 4. Fornecer a função mudarIdioma que atualiza o estado instantaneamente
  const mudarIdioma = (novoIdioma: Idioma) => {
    setIdioma(novoIdioma);
    localStorage.setItem('orbi_preferred_language', novoIdioma);
    i18n.changeLanguage(novoIdioma);

    // Invalidação de Cache ao mudar o idioma (Regra 7)
    try {
      Object.keys(localStorage).forEach(key => {
        if (
          key.startsWith('orbi_natal_chart_') ||
          key.startsWith('orbi_transit_') ||
          key.startsWith('orbi_daily_insight_') ||
          key.startsWith('orbi_weekly_insight_') ||
          key.startsWith('orbi_missions_') ||
          key.startsWith('orbi_numerology_') ||
          key.startsWith('orbi_prosperity_') ||
          key.startsWith('orbi_biorhythm_') ||
          key.startsWith('orbi_lunarnodes_') ||
          key.startsWith('tarot_saved_') ||
          key.startsWith('tarot_last_draw_') ||
          key.includes('_insight_') ||
          key === 'orbi_map_data' ||
          key === 'orbi_numerology_data'
        ) {
          localStorage.removeItem(key);
        }
      });
      // Despachar evento global para notificar todos os componentes e helpers ativos de que o idioma mudou
      window.dispatchEvent(new Event('orbi_language_changed'));
    } catch (e) {
      console.error('Erro ao invalidar caches de idioma:', e);
    }
  };

  // Função helper de tradução rápida utilizando o dicionário fortemente tipado
  const t = (chave: keyof TraducaoSchema): string => {
    return dicionario[idioma][chave] || dicionario['pt'][chave] || chave;
  };

  return (
    <IdiomaContext.Provider value={{ idioma, mudarIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  );
}

// Hook personalizado para consumir o contexto
export function useIdioma() {
  const context = useContext(IdiomaContext);
  if (context === undefined) {
    throw new Error('useIdioma deve ser usado dentro de um IdiomaProvider');
  }
  return context;
}

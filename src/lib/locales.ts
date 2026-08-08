// src/lib/locales.ts
// Central locale dictionary and configuration for all 5 supported languages in Portal Órbita (PT, EN, ES, DE, FR)

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'de' | 'fr';

export interface LocaleStrings {
  general_settings: string;
  settings_desc: string;
  control_panel: string;
  edit_coords: string;
  birth_date: string;
  birth_time: string;
  birth_city: string;
  changes_count: string;
  limit_reached: string;
  changes_remaining: string;
  lang_sovereignty: string;
  preferred_lang: string;
  lang_desc: string;
  accessibility: string;
  high_contrast: string;
  contrast_desc: string;
  delete_account_title: string;
  delete_account_btn: string;
  delete_account_desc: string;
  logout_btn: string;
  points_label: string;
  trial_badge: string;
  calculating_placidus: string;
  area_usuario: string;
  meu_mapa: string;
  criar_meu_mapa: string;
  mapas_extras: string;
  alerts_and_notifs: string;
  daily_notifs: string;
  daily_notifs_desc: string;
  sms_reminders: string;
  sms_reminders_desc: string;
  performance_storage: string;
  clear_cache: string;
  clear_cache_desc: string;
  clear_cache_btn: string;
  support_team: string;
  logout_app_btn: string;
  delete_acc_btn: string;
  delete_confirm_title: string;
  delete_confirm_desc: string;
  delete_confirm_yes: string;
  delete_confirm_cancel: string;
  delete_account_error: string;
  delete_account_success: string;
  delete_account_pwd_error: string;
  manage_subscription_btn: string;
  no_subscription_title: string;
  no_subscription_desc: string;
  subscription_details: string;
  sub_status: string;
  sub_plan: string;
  sub_next_billing: string;
  sub_last_payment: string;
  sub_price: string;
  open_stripe_portal: string;
  close_btn: string;
  loading: string;
  error_loading: string;
  
  // Premium conversion modal strings
  premium_upgrade_title: string;
  premium_upgrade_desc: string;
  subscribe_now: string;
  premium_feature_locked: string;
  payment_error: string;
  stripe_redirect_error: string;
  
  // Installation & PWA guide modal strings
  pwa_install_error: string;
  
  [key: string]: string;
}

export const localLangDict: Record<SupportedLanguage, Record<string, string>> = {
  pt: {
    general_settings: "Configurações Gerais",
    settings_desc: "Gerencie suas coordenadas, sintonizações premium e preferências.",
    control_panel: "Painel de Controle",
    edit_coords: "Editar Coordenadas Celestes",
    birth_date: "DATA DE NASCIMENTO",
    birth_time: "HORA COMPLETA",
    birth_city: "CIDADE CODIFICADA",
    changes_count: "Alterações do Mapa Principal:",
    limit_reached: "⚠️ Limite vitalício atingido. Não é mais possível alterar as coordenadas celestes do seu Mapa Principal.",
    changes_remaining: "Você possui {count} alterações restantes para o Mapa Principal.",
    lang_sovereignty: "Soberania de Idiomas",
    preferred_lang: "Idioma Predileto",
    lang_desc: "Traduções automáticas aplicadas em relatórios avançados de IA.",
    accessibility: "Acessibilidade",
    high_contrast: "Modo de Alto Contraste",
    contrast_desc: "Aumenta o contraste de textos, botões e bordas para garantir melhor visibilidade.",
    delete_account_title: "Exclusão Definitiva",
    delete_account_btn: "Apagar Conta do Portal",
    delete_account_desc: "A remoção de registros apaga permanentemente todos os relatórios, mapas e históricos criptografados no banco de dados.",
    logout_btn: "Sair do Portal",
    points_label: "Pontos",
    trial_badge: "Acesso Premium Ativo",
    calculating_placidus: "Calculando Placidus em tempo real...",
    area_usuario: "Área do Usuário",
    meu_mapa: "Meu Mapa",
    criar_meu_mapa: "Criar Meu Mapa",
    mapas_extras: "Mapas Extras",
    menu_map: "Mapa Estelar",
    menu_stars: "Constelações",
    menu_planets: "Planetas",
    menu_tarot: "Tarô",
    menu_settings: "Configurações",
    alerts_and_notifs: "Alertas e Notificações",
    daily_notifs: "Notificações Diárias Push",
    daily_notifs_desc: "Receber alertas de trânsitos e biorritmo de manhã no celular.",
    sms_reminders: "SMS Astro-Reminders",
    sms_reminders_desc: "Alertas urgentes de trânsitos tensos (Mercúrio Retrógrado).",
    performance_storage: "Desempenho e Armazenamento",
    clear_cache: "Limpar Cache do Sistema",
    clear_cache_desc: "Apaga os arquivos temporários e caches de desempenho de relatórios. Não afeta seus mapas nem sua conta de acesso.",
    clear_cache_btn: "Limpar Cache",
    support_team: "Em caso de dúvidas, faça contato com a equipe de suporte pelo canal de integridade celestial do portal.",
    logout_app_btn: "Sair do Aplicativo",
    delete_acc_btn: "Excluir Minha Conta",
    delete_confirm_title: "Excluir sua conta?",
    delete_confirm_desc: "Você deseja excluir sua conta? Ao excluir sua conta todos os seus dados mapas registros estatísticas serão excluídos da plataforma.",
    delete_confirm_yes: "Sim, quero excluir",
    delete_confirm_cancel: "Cancelar",
    delete_account_error: "Erro ao excluir conta. Verifique suas credenciais e tente novamente.",
    delete_account_success: "Sua conta foi excluída com sucesso do Portal Órbita.",
    delete_account_pwd_error: "É necessário confirmar sua senha para excluir a conta com segurança.",
    manage_subscription_btn: "Gerenciar Assinatura",
    no_subscription_title: "Sem Assinatura Ativa",
    no_subscription_desc: "Você não possui uma assinatura ativa no Portal Órbita. Assine o plano Premium para acessar todas as sintonias celestes!",
    subscription_details: "Detalhes da Assinatura",
    sub_status: "Status",
    sub_plan: "Plano",
    sub_next_billing: "Próxima Cobrança",
    sub_last_payment: "Último Pagamento",
    sub_price: "Valor",
    open_stripe_portal: "Abrir Portal da Assinatura",
    close_btn: "Fechar",
    loading: "Carregando...",
    error_loading: "Erro ao carregar informações da assinatura.",
    
    premium_upgrade_title: "Sintonização Premium Órbita",
    premium_upgrade_desc: "Desbloqueie acesso ilimitado aos relatórios de inteligência artificial, trânsitos diários e mapas adicionais.",
    subscribe_now: "Assinar Agora",
    premium_feature_locked: "Recurso reservado a assinantes Premium.",
    payment_error: "Erro ao processar pagamento no servidor. Tente novamente em instantes.",
    stripe_redirect_error: "Falha no redirecionamento para o checkout seguro.",
    
    pwa_install_error: "Navegador não suporta instalação PWA direta ou o aplicativo já está instalado."
  },
  en: {
    general_settings: "General Settings",
    settings_desc: "Manage your coordinates, premium subscription and preferences.",
    control_panel: "Control Panel",
    edit_coords: "Edit Celestial Coordinates",
    birth_date: "DATE OF BIRTH",
    birth_time: "FULL TIME",
    birth_city: "ENCODED CITY",
    changes_count: "Main Chart Changes:",
    limit_reached: "⚠️ Lifetime limit reached. It is no longer possible to change the celestial coordinates of your Main Chart.",
    changes_remaining: "You have {count} changes remaining for the Main Chart.",
    lang_sovereignty: "Language Sovereignty",
    preferred_lang: "Preferred Language",
    lang_desc: "Automatic translations applied in advanced AI reports.",
    accessibility: "Accessibility",
    high_contrast: "High Contrast Mode",
    contrast_desc: "Increases text, button, and border contrast for better visibility.",
    delete_account_title: "Definitive Deletion",
    delete_account_btn: "Delete Portal Account",
    delete_account_desc: "Removing your record permanently deletes all encrypted reports, charts, and histories from the database.",
    logout_btn: "Log Out of Portal",
    points_label: "Points",
    trial_badge: "Premium Access Active",
    calculating_placidus: "Calculating Placidus in real time...",
    area_usuario: "User Dashboard",
    meu_mapa: "My Chart",
    criar_meu_mapa: "Create Chart",
    mapas_extras: "Extra Charts",
    alerts_and_notifs: "Alertas & Notifications",
    daily_notifs: "Daily Push Notifications",
    daily_notifs_desc: "Receive transit and biorhythm alerts in the morning.",
    sms_reminders: "Interactive Astro-Reminders",
    sms_reminders_desc: "Urgent alerts for challenging transits (Mercury Retrograde).",
    performance_storage: "Performance & Storage",
    clear_cache: "Clear System Cache",
    clear_cache_desc: "Deletes temporary files and cached report metrics. Does not affect your charts or account integrity.",
    clear_cache_btn: "Clear Cache",
    support_team: "In case of structural questions, contact the support team via the portal integrations line.",
    logout_app_btn: "Sign Out of App",
    delete_acc_btn: "Delete My Account",
    delete_confirm_title: "Delete your account?",
    delete_confirm_desc: "Are you sure you want to delete your account? All your charts, reports, and historic portal logs will be permanently erased.",
    delete_confirm_yes: "Yes, delete account",
    delete_confirm_cancel: "Cancel",
    delete_account_error: "Error deleting account. Please check your credentials and try again.",
    delete_account_success: "Your account has been successfully deleted from Portal Órbita.",
    delete_account_pwd_error: "Password confirmation is required to securely delete your account.",
    manage_subscription_btn: "Manage Subscription",
    no_subscription_title: "No Active Subscription",
    no_subscription_desc: "You do not have an active subscription to Portal Órbita. Subscribe to the Premium plan to access all celestial tunings!",
    subscription_details: "Subscription Details",
    sub_status: "Status",
    sub_plan: "Plan",
    sub_next_billing: "Next Billing",
    sub_last_payment: "Last Payment",
    sub_price: "Price",
    open_stripe_portal: "Open Subscription Portal",
    close_btn: "Close",
    loading: "Loading...",
    error_loading: "Error loading subscription details.",
    
    premium_upgrade_title: "Órbita Premium Tuning",
    premium_upgrade_desc: "Unlock unlimited access to AI intelligence reports, daily transits, and extra natal charts.",
    subscribe_now: "Subscribe Now",
    premium_feature_locked: "Feature reserved for Premium subscribers.",
    payment_error: "Error processing payment on server. Please try again shortly.",
    stripe_redirect_error: "Failed to redirect to secure checkout.",
    pwa_install_error: "Browser does not support direct PWA installation or app is already installed.",
    menu_map: "Star Map",
    menu_stars: "Constellations",
    menu_planets: "Planets",
    menu_tarot: "Tarot",
    menu_settings: "Settings"
  },
  es: {
    general_settings: "Configuración General",
    settings_desc: "Administre sus coordenadas, suscripciones premium y preferencias.",
    control_panel: "Panel de Control",
    edit_coords: "Editar Coordenadas Celestes",
    birth_date: "FECHA DE NACIMIENTO",
    birth_time: "HORA COMPLETA",
    birth_city: "CIUDAD CODIFICADA",
    changes_count: "Cambios en la Carta Principal:",
    limit_reached: "⚠️ Se alcanzó el límite de por vida. Ya no es posible cambiar las coordenadas celestes de su Carta Principal.",
    changes_remaining: "Tiene {count} cambios restantes para la Carta Principal.",
    lang_sovereignty: "Soberanía de Idiomas",
    preferred_lang: "Idioma Predileto",
    lang_desc: "Traducciones automáticas aplicadas en informes avanzados de IA.",
    accessibility: "Accesibilidad",
    high_contrast: "Modo de Alto Contraste",
    contrast_desc: "Aumenta el contraste de textos, botones y bordes para garantizar una mejor visibilidad.",
    delete_account_title: "Remoción Definitiva",
    delete_account_btn: "Eliminar Cuenta del Portal",
    delete_account_desc: "La eliminación de registros borra permanentemente todos los informes, cartas e historiales encriptados en la base de datos.",
    logout_btn: "Cerrar Sesión",
    points_label: "Puntos",
    trial_badge: "Acceso Premium Activo",
    calculating_placidus: "Calculando Plácidus en tiempo real...",
    area_usuario: "Área de Usuario",
    meu_mapa: "Mi Carta",
    criar_meu_mapa: "Calcular Carta",
    mapas_extras: "Cartas Extras",
    menu_map: "Mapa Estelar",
    menu_stars: "Constelaciones",
    menu_planets: "Planetas",
    menu_tarot: "Tarot",
    menu_settings: "Ajustes",
    alerts_and_notifs: "Alertas y Notificaciones",
    daily_notifs: "Notificaciones Diarias Push",
    daily_notifs_desc: "Recibir alertas de tránsitos y biorritmo por la mañana.",
    sms_reminders: "SMS Astro-Reminders",
    sms_reminders_desc: "Alertas urgentes de tránsitos tensos (Mercurio Retrógrado).",
    performance_storage: "Rendimiento y Almacenamiento",
    clear_cache: "Limpiar Caché del Sistema",
    clear_cache_desc: "Borra archivos temporales y caché de rendimiento. No afecta sus mapas ni su cuenta.",
    clear_cache_btn: "Limpiar Caché",
    support_team: "En caso de dudas, contacte al soporte a través de la línea de integridad del portal.",
    logout_app_btn: "Cerrar Sesión del App",
    delete_acc_btn: "Excluir Mi Cuenta",
    delete_confirm_title: "¿Eliminar su cuenta?",
    delete_confirm_desc: "¿Desea eliminar su cuenta? Al hacerlo, todos sus datos, mapas e historiales serán borrados para siempre.",
    delete_confirm_yes: "Sí, quiero eliminar",
    delete_confirm_cancel: "Cancelar",
    delete_account_error: "Error al eliminar la cuenta. Por favor verifique sus credenciales e intente nuevamente.",
    delete_account_success: "Su cuenta fue eliminada con éxito de Portal Órbita.",
    delete_account_pwd_error: "Es necesario confirmar su contraseña para eliminar la cuenta con seguridad.",
    manage_subscription_btn: "Gestionar Suscripción",
    no_subscription_title: "Sin Suscripción Activa",
    no_subscription_desc: "No tienes una suscripción activa a Portal Órbita. ¡Suscríbete al plan Premium para acceder a todas las sintonías celestiales!",
    subscription_details: "Detalles de la Suscripción",
    sub_status: "Estado",
    sub_plan: "Plan",
    sub_next_billing: "Próximo Cobro",
    sub_last_payment: "Último Pago",
    sub_price: "Precio",
    open_stripe_portal: "Abrir Portal de Suscripción",
    close_btn: "Cerrar",
    loading: "Cargando...",
    error_loading: "Error al cargar los detalles de la suscripción.",
    
    premium_upgrade_title: "Sintonización Premium Órbita",
    premium_upgrade_desc: "Desbloquee acceso ilimitado a informes de IA, tránsitos diarios y cartas extra.",
    subscribe_now: "Suscribirse Ahora",
    premium_feature_locked: "Función reservada a suscriptores Premium.",
    payment_error: "Error al procesar el pago. Intente nuevamente en unos instantes.",
    stripe_redirect_error: "Error al redirigir al checkout seguro.",
    
    pwa_install_error: "El navegador no admite la instalación directa de PWA o la app ya está instalada."
  },
  de: {
    general_settings: "Allgemeine Einstellungen",
    settings_desc: "Verwalten Sie Ihre Koordinaten, Premium-Abonnements und Einstellungen.",
    control_panel: "Systemsteuerung",
    edit_coords: "Himmelskoordinaten bearbeiten",
    birth_date: "GEBURTSDATUM",
    birth_time: "UHRZEIT",
    birth_city: "GEBURTSORT",
    changes_count: "Änderungen am Hauptdiagramm:",
    limit_reached: "⚠️ Lebenslanges Limit erreicht. Es ist nicht mehr möglich, die Himmelskoordinaten Ihres Hauptdiagramms zu ändern.",
    changes_remaining: "Sie haben noch {count} Änderungen für das Hauptdiagramm übrig.",
    lang_sovereignty: "Souveränität der Sprachen",
    preferred_lang: "Bevorzugte Sprache",
    lang_desc: "Automatische Übersetzungen in fortgeschrittenen KI-Berichten.",
    accessibility: "Barrierefreiheit",
    high_contrast: "Hoher Kontrastmodus",
    contrast_desc: "Erhöht den Kontrast von Texten, Schaltflächen und Rändern für eine bessere Sichtbarkeit.",
    delete_account_title: "Endgültige Löschung",
    delete_account_btn: "Portal-Konto löschen",
    delete_account_desc: "Das Entfernen von Datensätzen löscht dauerhaft alle verschlüsselten Berichte, Diagramme und Verläufe in der Datenbank.",
    logout_btn: "Vom Portal abmelden",
    points_label: "Punkte",
    trial_badge: "Premium-Zugang Aktiv",
    calculating_placidus: "Berechnung von Placidus in Echtzeit...",
    area_usuario: "Benutzerkonto",
    meu_mapa: "Mein Horoskop",
    criar_meu_mapa: "Horoskop Erstellen",
    mapas_extras: "Zusatzhoroskope",
    menu_map: "Sternenkarte",
    menu_stars: "Konstellationen",
    menu_planets: "Planeten",
    menu_tarot: "Tarot",
    menu_settings: "Einstellungen",
    alerts_and_notifs: "Benachrichtigungen & Alarme",
    daily_notifs: "Tägliche Push-Benachrichtigungen",
    daily_notifs_desc: "Erhalten Sie Himmels- und Biorhythmus-Meldungen am Morgen.",
    sms_reminders: "Dringende Kosmische Alarme",
    sms_reminders_desc: "Dringende Benachrichtigungen bei rückläufigem Merkur.",
    performance_storage: "Systemleistung & Speicher",
    clear_cache: "Systemcache löschen",
    clear_cache_desc: "Löscht temporäre Daten und Berichtscaches. Keine Auswirkung auf Ihre Horoskope.",
    clear_cache_btn: "Cache löschen",
    support_team: "Bei Fragen kontaktieren Sie den Support über den offiziellen Portal-Kanal.",
    logout_app_btn: "App abmelden",
    delete_acc_btn: "Konto löschen",
    delete_confirm_title: "Konto unwiderruflich löschen?",
    delete_confirm_desc: "Möchten Sie Ihr Konto wirklich löschen? Alle Berichte und gespeicherten Horoskope werden dauerhaft entfernt.",
    delete_confirm_yes: "Ja, jetzt löschen",
    delete_confirm_cancel: "Abbrechen",
    delete_account_error: "Fehler beim Löschen des Kontos. Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
    delete_account_success: "Ihr Konto wurde erfolgreich aus Portal Órbita gelöscht.",
    delete_account_pwd_error: "Zur sicheren Löschung Ihres Kontos ist eine Passwortbestätigung erforderlich.",
    manage_subscription_btn: "Abonnement verwalten",
    no_subscription_title: "Kein aktives Abonnement",
    no_subscription_desc: "Sie haben kein aktives Abonnement für Portal Órbita. Abonnieren Sie den Premium-Plan, um auf alle himmlischen Abstimmungen zuzugreifen!",
    subscription_details: "Abonnement-Details",
    sub_status: "Status",
    sub_plan: "Plan",
    sub_next_billing: "Nächste Abrechnung",
    sub_last_payment: "Letzte Zahlung",
    sub_price: "Preis",
    open_stripe_portal: "Abonnement-Portal öffnen",
    close_btn: "Schließen",
    loading: "Wird geladen...",
    error_loading: "Fehler beim Laden der Abonnementdetails.",
    
    premium_upgrade_title: "Órbita Premium Abstimmung",
    premium_upgrade_desc: "Schalten Sie unbegrenzten Zugriff auf KI-Berichte, tägliche Transite und Zusatzhoroskope frei.",
    subscribe_now: "Jetzt abonnieren",
    premium_feature_locked: "Funktion für Premium-Abonnenten reserviert.",
    payment_error: "Fehler bei der Zahlungsabwicklung auf dem Server. Bitte versuchen Sie es in Kürze erneut.",
    stripe_redirect_error: "Weiterleitung zum sicheren Checkout fehlgeschlagen.",
    
    pwa_install_error: "Browser unterstützt die direkte PWA-Installation nicht oder App ist bereits installiert."
  },
  fr: {
    general_settings: "Paramètres Généraux",
    settings_desc: "Gérez vos coordonnées, abonnements premium et préférences.",
    control_panel: "Panneau de Contrôle",
    edit_coords: "Modifier les Coordonnées Célestes",
    birth_date: "DATE DE NAISSANCE",
    birth_time: "HEURE DE NAISSANCE",
    birth_city: "VILLE CODIFIÉE",
    changes_count: "Changements de Carte Principale :",
    limit_reached: "⚠️ Limite à vie atteinte. Il n'est plus possible de modifier les coordonnées célestes de votre Carte Principale.",
    changes_remaining: "Il vous reste {count} modifications possibles pour la Carte Principale.",
    lang_sovereignty: "Souveraineté Linguistique",
    preferred_lang: "Langue Préférée",
    lang_desc: "Traductions automatiques appliquées aux rapports d'IA avancés.",
    accessibility: "Accessibilité",
    high_contrast: "Mode Contraste Élevé",
    contrast_desc: "Augmente le contraste des textes, boutons et bordures pour assurer une meilleure visibilité.",
    delete_account_title: "Suppression Définitive",
    delete_account_btn: "Supprimer le Compte",
    delete_account_desc: "La suppression de votre enregistrement efface définitivement tous les rapports de calcul, cartes et historiques de la base de données.",
    logout_btn: "Déconnexion du Portal",
    points_label: "Points",
    trial_badge: "Accès Premium Actif",
    calculating_placidus: "Calcul de Placidus en temps réel...",
    area_usuario: "Espace Utilisateur",
    meu_mapa: "Mon Thème",
    criar_meu_mapa: "Créer Ma Carte",
    mapas_extras: "Thèmes Additionnels",
    menu_map: "Carte Céleste",
    menu_stars: "Constellations",
    menu_planets: "Planètes",
    menu_tarot: "Tarot",
    menu_settings: "Paramètres",
    alerts_and_notifs: "Alertes et Notifications",
    daily_notifs: "Notifications Flash Quotidiennes",
    daily_notifs_desc: "Recevoir des alertes de transits et de biorythme le matin.",
    sms_reminders: "Alerte Astro-Reminders",
    sms_reminders_desc: "Alertes urgentes concernant les transits difficiles (Mercure Rétrograde).",
    performance_storage: "Performance et Stockage",
    clear_cache: "Effacer le Cache Système",
    clear_cache_desc: "Efface les fichiers temporaires et les caches de performance des rapports. N'affecte pas vos thèmes.",
    clear_cache_btn: "Vider le Cache",
    support_team: "Pour toute question, contactez le support via le canal céleste officiel.",
    logout_app_btn: "Se Déconnecter de l'App",
    delete_acc_btn: "Supprimer Mon Compte",
    delete_confirm_title: "Supprimer votre compte ?",
    delete_confirm_desc: "Voulez-vous supprimer votre compte ? Toutes vos données, cartes et historiques seront définitivement effacés.",
    delete_confirm_yes: "Oui, supprimer",
    delete_confirm_cancel: "Annuler",
    delete_account_error: "Erreur lors de la suppression du compte. Veuillez vérifier vos identifiants et réessayer.",
    delete_account_success: "Votre compte a été supprimé avec succès de Portal Órbita.",
    delete_account_pwd_error: "La confirmation du mot de passe est requise pour supprimer votre compte en toute sécurité.",
    manage_subscription_btn: "Gérer l'Abonnement",
    no_subscription_title: "Aucun Abonnement Actif",
    no_subscription_desc: "Vous n'avez pas d'abonnement actif à Portal Órbita. Abonnez-vous au forfait Premium pour accéder à tous les réglages célestes !",
    subscription_details: "Détails de l'Abonnement",
    sub_status: "Statut",
    sub_plan: "Forfait",
    sub_next_billing: "Prochaine Facturation",
    sub_last_payment: "Dernier Paiement",
    sub_price: "Prix",
    open_stripe_portal: "Ouvrir le Portail d'Abonnement",
    close_btn: "Fermer",
    loading: "Chargement...",
    error_loading: "Erreur lors du chargement des détails de l'abonnement.",
    
    premium_upgrade_title: "Accordement Premium Órbita",
    premium_upgrade_desc: "Débloquez un accès illimité aux rapports d'intelligence artificielle, aux transits quotidiens et aux cartes thématiques.",
    subscribe_now: "S'abonner Maintenant",
    premium_feature_locked: "Fonctionnalité réservée aux abonnés Premium.",
    payment_error: "Erreur lors du traitement du paiement sur le serveur. Veuillez réessayer sous peu.",
    stripe_redirect_error: "Échec de la redirection vers le paiement sécurisé.",
    
    pwa_install_error: "Le navigateur ne prend pas en charge l'installation directe de la PWA ou l'application est déjà installée."
  }
};

export const pwaGuideTranslations: Record<SupportedLanguage, {
  title: string;
  subtitle: string;
  detectedDevice: string;
  tiktokTitle: string;
  tiktokDesc: string;
  tiktokStep1: string;
  tiktokStep2: string;
  tiktokStep3: string;
  copyLinkBtn: string;
  copyLinkSuccess: string;
  iosTitle: string;
  iosStep1: string;
  iosStep2: string;
  iosStep3: string;
  androidTitle: string;
  androidStep1: string;
  androidStep2: string;
  desktopTitle: string;
  desktopStep1: string;
  desktopStep2: string;
  generalNote: string;
  closeBtn: string;
}> = {
  pt: {
    title: "Como Instalar o Aplicativo",
    subtitle: "Instale o Portal Órbita em seu celular ou computador para uma experiência nativa de alta velocidade e offline.",
    detectedDevice: "Dispositivo Detectado",
    tiktokTitle: "🎵 Acessando pelo TikTok / Rede Social?",
    tiktokDesc: "O navegador interno do TikTok e do Instagram bloqueia a instalação direta de aplicativos (PWA). Para instalar com 1 clique:",
    tiktokStep1: "1. Toque nos 3 pontinhos (⋮) ou no ícone de opções no canto da tela do TikTok.",
    tiktokStep2: "2. Selecione 'Abrir no Navegador' (ou 'Abrir no Chrome / Safari').",
    tiktokStep3: "3. No navegador oficial, toque no botão 'Instalar Aplicativo' e a caixa de instalação surgirá!",
    copyLinkBtn: "Copiar Link do Aplicativo",
    copyLinkSuccess: "Link copiado! Cole no Google Chrome ou Safari.",
    iosTitle: "📱 No iPhone ou iPad (Safari)",
    iosStep1: "1. Toque no ícone de Compartilhar (aquele quadrado com uma seta para cima ↑ na barra inferior).",
    iosStep2: "2. Role a lista para baixo e toque em 'Adicionar à Tela de Início' (Add to Home Screen).",
    iosStep3: "3. Confirme clicando em 'Adicionar' no canto superior direito. Pronto!",
    androidTitle: "🤖 No Android (Google Chrome)",
    androidStep1: "1. Toque no ícone de três pontinhos (⋮) no canto superior direito do seu navegador.",
    androidStep2: "2. Toque em 'Instalar aplicativo' ou 'Adicionar à tela inicial' e confirme.",
    desktopTitle: "💻 No Computador (Chrome / Edge / Opera)",
    desktopStep1: "1. Clique no ícone de instalação (um monitor com uma seta para baixo ou o ícone '+') localizado no lado direito da barra de endereços do navegador.",
    desktopStep2: "2. Clique em 'Instalar' na caixa de diálogo que surgir para criar o atalho em sua área de trabalho.",
    generalNote: "Nota: A tecnologia PWA permite usar o Portal Órbita como um aplicativo real, consumindo menos bateria, inicializando instantaneamente e sem necessidade de baixar um arquivo APK pesado das lojas corporativas.",
    closeBtn: "Fechar Guia de Instalação"
  },
  en: {
    title: "How to Install the Application",
    subtitle: "Install Portal Órbita on your mobile phone or computer for a high-speed, native, and offline experience.",
    detectedDevice: "Detected Device",
    tiktokTitle: "🎵 Accessing via TikTok / Social Media?",
    tiktokDesc: "TikTok's and Instagram's in-app browsers block direct app installation (PWA). To install in 1 click:",
    tiktokStep1: "1. Tap the 3 dots (⋮) or options icon in the corner of TikTok's screen.",
    tiktokStep2: "2. Select 'Open in Browser' (or 'Open in Chrome / Safari').",
    tiktokStep3: "3. In the official browser, tap 'Install App' and the prompt will appear!",
    copyLinkBtn: "Copy App Link",
    copyLinkSuccess: "Link copied! Paste in Chrome or Safari.",
    iosTitle: "📱 On iPhone or iPad (Safari)",
    iosStep1: "1. Tap the Share icon (the square with an up arrow ↑ at the bottom bar).",
    iosStep2: "2. Scroll down the list and tap 'Add to Home Screen'.",
    iosStep3: "3. Confirm by clicking 'Add' in the top right corner. All done!",
    androidTitle: "🤖 On Android (Google Chrome)",
    androidStep1: "1. Tap the three-dot icon (⋮) in the top-right corner of your browser.",
    androidStep2: "2. Tap 'Install app' or 'Add to Home screen' and confirm.",
    desktopTitle: "💻 On Computer (Chrome / Edge / Opera)",
    desktopStep1: "1. Click the install icon (a monitor with a down arrow or a '+' icon) located on the right side of the browser's address bar.",
    desktopStep2: "2. Click 'Install' in the dialog box that appears to create the shortcut on your desktop.",
    generalNote: "Note: PWA technology allows you to use Portal Órbita like a real application, consuming less battery, starting instantly, and without the need to download a heavy APK file from corporate stores.",
    closeBtn: "Close Installation Guide"
  },
  es: {
    title: "Cómo Instalar la Aplicación",
    subtitle: "Instala Portal Órbita en tu teléfono móvil o computadora para una experiencia nativa offline de alta velocidad.",
    detectedDevice: "Dispositivo Detectado",
    tiktokTitle: "🎵 ¿Accediendo desde TikTok / Redes Sociales?",
    tiktokDesc: "El navegador interno de TikTok e Instagram bloquea la instalación directa de aplicaciones (PWA). Para instalar en 1 clic:",
    tiktokStep1: "1. Toca los 3 puntos (⋮) o el ícono de opciones en la esquina de la pantalla de TikTok.",
    tiktokStep2: "2. Selecciona 'Abrir en el navegador' (o 'Abrir en Chrome / Safari').",
    tiktokStep3: "3. En el navegador oficial, toca 'Instalar aplicación' y ¡aparecerá la ventana de instalación!",
    copyLinkBtn: "Copiar Enlace de la App",
    copyLinkSuccess: "¡Enlace copiado! Pégalo en Chrome o Safari.",
    iosTitle: "📱 En iPhone o iPad (Safari)",
    iosStep1: "1. Toca el ícono de Compartir (el cuadrado con una flecha hacia arriba ↑ en la barra inferior).",
    iosStep2: "2. Desplázate hacia abajo en la lista y toca 'Agregar a la pantalla de inicio' (Add to Home Screen).",
    iosStep3: "3. Confirma haciendo clic en 'Agregar' en la esquina superior derecha. ¡Listo!",
    androidTitle: "🤖 En Android (Google Chrome)",
    androidStep1: "1. Toca el ícono de tres puntos (⋮) en la esquina superior derecha de tu navegador.",
    androidStep2: "2. Toca 'Instalar aplicación' o 'Agregar a la pantalla principal' y confirma.",
    desktopTitle: "💻 En Computadora (Chrome / Edge / Opera)",
    desktopStep1: "1. Haz clic en el ícono de instalación (un monitor con una flecha hacia abajo o el ícono '+') ubicado en el lado derecho de la barra de direcciones del navegador.",
    desktopStep2: "2. Haz clic en 'Instalar' en el cuadro de diálogo que aparece para crear el acceso directo en tu escritorio.",
    generalNote: "Nota: La tecnología PWA te permite usar Portal Órbita como una aplicación real, consumiendo menos batería, iniciando instantáneamente y sin necesidad de descargar un archivo APK pesado de las tiendas corporativas.",
    closeBtn: "Cerrar Guía de Instalación"
  },
  de: {
    title: "So installieren Sie die Anwendung",
    subtitle: "Installieren Sie Portal Órbita auf Ihrem Mobiltelefon oder Computer für ein schnelles, natives Offline-Erlebnis.",
    detectedDevice: "Erkanntes Gerät",
    tiktokTitle: "🎵 Zugriff über TikTok / Soziale Medien?",
    tiktokDesc: "Der interne Browser von TikTok und Instagram blockiert die direkte Installation von Apps (PWA). Zur Installation mit 1 Klick:",
    tiktokStep1: "1. Tippen Sie auf die 3 Punkte (⋮) oder das Optionen-Symbol in der Ecke des TikTok-Bildschirms.",
    tiktokStep2: "2. Wählen Sie 'Im Browser öffnen' (oder 'In Chrome / Safari öffnen').",
    tiktokStep3: "3. Tippen Sie im offiziellen Browser auf 'App installieren', und das Installationsfenster erscheint!",
    copyLinkBtn: "App-Link kopieren",
    copyLinkSuccess: "Link kopiert! In Chrome oder Safari einfügen.",
    iosTitle: "📱 Auf dem iPhone oder iPad (Safari)",
    iosStep1: "1. Tippen Sie auf das Teilen-Symbol (das Quadrat mit einem Pfeil nach oben ↑ in der Fußleiste).",
    iosStep2: "2. Scrollen Sie nach unten und tippen Sie auf 'Zum Home-Bildschirm' (Add to Home Screen).",
    iosStep3: "3. Bestätigen Sie, indem Sie oben rechts auf 'Hinzufügen' klicken. Fertig!",
    androidTitle: "🤖 Auf Android (Google Chrome)",
    androidStep1: "1. Tippen Sie auf das Drei-Punkte-Symbol (⋮) oben rechts in Ihrem Browser.",
    androidStep2: "2. Tippen Sie auf 'App installieren' oder 'Zum Startbildschirm hinzufügen' und bestätigen Sie.",
    desktopTitle: "💻 Auf dem Computer (Chrome / Edge / Opera)",
    desktopStep1: "1. Klicken Sie auf das Installationssymbol (ein Monitor mit einem Pfeil nach unten oder das '+'-Symbol) auf der rechten Seite der Adressleiste des Browsers.",
    desktopStep2: "2. Klicken Sie im angezeigten Dialogfeld auf 'Installieren', um die Verknüpfung auf Ihrem Desktop zu erstellen.",
    generalNote: "Hinweis: Die PWA-Technologie ermöglicht es Ihnen, Portal Órbita wie eine echte Anwendung zu nutzen, was weniger Akku verbraucht, sofort startet und den Download einer schweren APK-Datei überflüssig macht.",
    closeBtn: "Installationsanleitung schließen"
  },
  fr: {
    title: "Comment Installer l'Application",
    subtitle: "Installez Portal Órbita sur votre téléphone portable ou votre ordinateur pour une expérience native, rapide et hors ligne.",
    detectedDevice: "Appareil Détecté",
    tiktokTitle: "🎵 Accès via TikTok / Réseaux Sociaux ?",
    tiktokDesc: "Le navigateur intégré de TikTok et d'Instagram bloque l'installation directe d'applications (PWA). Pour installer en 1 clic :",
    tiktokStep1: "1. Appuyez sur les 3 points (⋮) ou l'icône d'options dans le coin de l'écran TikTok.",
    tiktokStep2: "2. Sélectionnez 'Ouvrir dans le navigateur' (ou 'Ouvrir dans Chrome / Safari').",
    tiktokStep3: "3. Dans le navigateur officiel, appuyez sur 'Installer l'application' et la fenêtre apparaîtra !",
    copyLinkBtn: "Copier le lien de l'application",
    copyLinkSuccess: "Lien copié ! Collez-le dans Chrome ou Safari.",
    iosTitle: "📱 Sur iPhone ou iPad (Safari)",
    iosStep1: "1. Appuyez sur l'icône de partage (le carré avec une flèche vers le haut ↑ dans la barre inférieure).",
    iosStep2: "2. Faites défiler la liste vers le bas et appuyez sur 'Sur l'écran d'accueil' (Add to Home Screen).",
    iosStep3: "3. Confirmez en cliquant sur 'Ajouter' dans le coin supérieur droit. C'est fait !",
    androidTitle: "🤖 Sur Android (Google Chrome)",
    androidStep1: "1. Appuyez sur l'icône à trois points (⋮) dans le coin supérieur droit de votre navigateur.",
    androidStep2: "2. Appuyez sur 'Installer l'application' ou 'Ajouter à l'écran d'accueil' et confirmez.",
    desktopTitle: "💻 Sur Ordinateur (Chrome / Edge / Opera)",
    desktopStep1: "1. Cliquez sur l'icône d'installation (un écran avec une flèche vers le haut ou l'icône '+') située à droite de la barre d'adresse du navigateur.",
    desktopStep2: "2. Cliquez sur 'Installer' dans la boîte de dialogue qui s'affiche pour créer le raccourci sur votre bureau.",
    generalNote: "Remarque : La technologie PWA vous permet d'utiliser Portal Órbita comme une véritable application, consommant moins de batterie, démarrant instantanément et sans avoir besoin de télécharger un fichier APK lourd depuis les magasins d'applications.",
    closeBtn: "Fermer le guide d'installation"
  }
};

export function getLocaleDict(lang: string = 'pt'): Record<string, string> {
  const l = (lang && localLangDict[lang as SupportedLanguage]) ? (lang as SupportedLanguage) : 'pt';
  return localLangDict[l] || localLangDict.pt;
}

/**
 * Get string translation from localLangDict with fallback to 'pt'
 */
export function getLocalText(key: string, lang: string = 'pt', vars?: Record<string, string | number>): string {
  const currentLang = (lang && localLangDict[lang as SupportedLanguage]) ? (lang as SupportedLanguage) : 'pt';
  let text = localLangDict[currentLang]?.[key] || localLangDict.pt?.[key] || key;

  if (vars) {
    Object.entries(vars).forEach(([vKey, vVal]) => {
      text = text.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(vVal));
    });
  }

  return text;
}

/**
 * Utility that scans the DOM for elements with pending translation attributes
 * ([data-i18n-key], [data-i18n-placeholder], [data-i18n-title], or [data-i18n-alt])
 * and replaces their content/attributes with localized translations for the current language.
 */
export function scanAndTranslateDOM(lang: string = 'pt', translateFn?: (key: string) => string) {
  if (typeof document === 'undefined') return;
  const currentLang = (lang && localLangDict[lang as SupportedLanguage]) ? (lang as SupportedLanguage) : 'pt';
  const resolve = (key: string) => {
    if (translateFn) return translateFn(key);
    return getLocalText(key, currentLang);
  };

  const keyElements = document.querySelectorAll('[data-i18n-key]');
  keyElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-key');
    if (key) {
      const translated = resolve(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    }
  });

  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = resolve(key);
      if (translated && translated !== key) {
        (el as HTMLInputElement).placeholder = translated;
      }
    }
  });

  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      const translated = resolve(key);
      if (translated && translated !== key) {
        el.setAttribute('title', translated);
      }
    }
  });
}

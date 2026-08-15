import { Language } from './types';

export const serverTranslations: Record<Language, Record<string, string>> = {
  pt: {
    'api.auth.name_email_required': 'Nome e Email são obrigatórios.',
    'api.auth.email_code_required': 'E-mail e código de verificação são obrigatórios.',
    'api.auth.email_verification_error': 'Erro interno ao processar e-mail de confirmação.',
    'api.auth.simulation_notice': 'Ative sua conta preferencialmente usando o sistema de verificação de e-mail oficial do Firebase. Código do simulador estelar: {code}',
    
    'api.astrology.name_required': 'Nome é obrigatório na sintonização astral.',
    'api.astrology.internal_error': 'Erro interno no cálculo astrológico. Verifique os dados fornecidos.',
    'api.astrology.rare_notifications_error': 'Erro interno ao buscar notificações raras.',
    
    'api.dreams.content_required': 'Descrição do sonho é obrigatória.',
    
    'api.compatibility.both_names_required': 'Ambos os nomes são necessários.',
    
    'api.oraculo.question_required': 'Pergunta do oráculo é obrigatória.',
    
    'api.osiris.messages_required': 'Mensagens são necessárias.',
    
    'api.tarot.internal_error': 'Erro interno ao sortear cartas de tarot.',
    
    'api.admin.user_not_found': 'Usuário não encontrado.',
    'api.admin.user_deleted': 'Usuário deletado.',
    'api.admin.plan_not_found': 'Plano não encontrado.',
    'api.admin.content_title_type_required': 'Título e Tipo de conteúdo são obrigatórios.',
    'api.admin.content_not_found': 'Conteúdo não encontrado.',
    'api.admin.content_deleted': 'Conteúdo excluído.',
    'api.admin.notification_fields_required': 'Tipo, Título e Mensagem são obrigatórios.',
    
    'api.payment.details_required': 'Nome, Email e ID do plano são necessários para prosseguir.',
    'api.payment.subscription_success': 'Assinatura processada com sucesso!',
    'api.payment.active_premium_sync': 'Assinatura Sincronizada',
    'api.payment.activation_congrats': 'Parabéns {name}! Seu plano [{planName}] no valor de {price} foi aprovado com a Transação ID {transactionId}.',
    
    'api.stripe.email_plan_required': 'Email e ID do Plano são obrigatórios para gerar o Stripe Checkout.',
    'api.stripe.connection_error': 'Erro interno ao conectar ao Stripe.',
    'api.stripe.session_id_required': 'O parâmetro session_id é obrigatório.',
    'api.stripe.validation_error': 'Erro interno ao validar sessões de pagamento.',
    'api.stripe.simulator_active': 'Stripe em Modo Simulado Ativo (Sua chave STRIPE_SECRET_KEY não foi configurada)',
    'api.stripe.not_configured': 'Stripe não configurado no backend. Não é possível verificar transações reais.',
    'api.stripe.not_paid': 'O pagamento desta transação ainda não consta como concluído.',
    'api.stripe.verification_success': 'Verificação sintonizada com sucesso (Modo Simulado).'
  },
  en: {
    'api.auth.name_email_required': 'Name and email are required.',
    'api.auth.email_code_required': 'Email and verification code are required.',
    'api.auth.email_verification_error': 'Internal error processing confirmation email.',
    'api.auth.simulation_notice': 'Activate your account preferably using the official Firebase email verification system. Stellar simulator code: {code}',
    
    'api.astrology.name_required': 'Name is required for astral tuning.',
    'api.astrology.internal_error': 'Internal error in astrological calculation. Please verify the provided data.',
    'api.astrology.rare_notifications_error': 'Internal error fetching rare notifications.',
    
    'api.dreams.content_required': 'Dream description is required.',
    
    'api.compatibility.both_names_required': 'Both names are required.',
    
    'api.oraculo.question_required': 'Oracle question is required.',
    
    'api.osiris.messages_required': 'Messages are required.',
    
    'api.tarot.internal_error': 'Internal error drawing tarot cards.',
    
    'api.admin.user_not_found': 'User not found.',
    'api.admin.user_deleted': 'User deleted.',
    'api.admin.plan_not_found': 'Plan not found.',
    'api.admin.content_title_type_required': 'Title and content type are required.',
    'api.admin.content_not_found': 'Content not found.',
    'api.admin.content_deleted': 'Content deleted.',
    'api.admin.notification_fields_required': 'Type, title, and message are required.',
    
    'api.payment.details_required': 'Name, email, and plan ID are required to proceed.',
    'api.payment.subscription_success': 'Subscription processed successfully!',
    'api.payment.active_premium_sync': 'Subscription Synchronized',
    'api.payment.activation_congrats': 'Congratulations {name}! Your plan [{planName}] valued at {price} was approved with Transaction ID {transactionId}.',
    
    'api.stripe.email_plan_required': 'Email and Plan ID are required to generate the Stripe Checkout.',
    'api.stripe.connection_error': 'Internal error connecting to Stripe.',
    'api.stripe.session_id_required': 'The session_id parameter is required.',
    'api.stripe.validation_error': 'Internal error validating payment sessions.',
    'api.stripe.simulator_active': 'Stripe in Active Simulated Mode (Your STRIPE_SECRET_KEY is not configured)',
    'api.stripe.not_configured': 'Stripe not configured on the backend. Real transactions cannot be verified.',
    'api.stripe.not_paid': 'Payment for this transaction is not yet completed.',
    'api.stripe.verification_success': 'Verification tuned successfully (Simulated Mode).'
  },
  es: {
    'api.auth.name_email_required': 'El nombre y el correo electrónico son obligatorios.',
    'api.auth.email_code_required': 'El correo electrónico y el código de verificación son obligatorios.',
    'api.auth.email_verification_error': 'Error interno al procesar el correo electrónico de confirmación.',
    'api.auth.simulation_notice': 'Active de preferencia su cuenta usando el sistema oficial de verificación de correo de Firebase. Código del simulador estelar: {code}',
    
    'api.astrology.name_required': 'El nombre es obligatorio para la sintonización astral.',
    'api.astrology.internal_error': 'Error interno en el cálculo astrológico. Por favor verifique los datos proporcionados.',
    'api.astrology.rare_notifications_error': 'Error interno al buscar notificaciones raras.',
    
    'api.dreams.content_required': 'La descripción del sueño es obligatoria.',
    
    'api.compatibility.both_names_required': 'Ambos nombres son obligatorios.',
    
    'api.oraculo.question_required': 'La pregunta del oráculo es obligatoria.',
    
    'api.osiris.messages_required': 'Los mensajes son obligatorios.',
    
    'api.tarot.internal_error': 'Error interno al sacar cartas de tarot.',
    
    'api.admin.user_not_found': 'Usuario no encontrado.',
    'api.admin.user_deleted': 'Usuario eliminado.',
    'api.admin.plan_not_found': 'Plan no encontrado.',
    'api.admin.content_title_type_required': 'El título y el tipo de contenido son obligatorios.',
    'api.admin.content_not_found': 'Contenido no encontrado.',
    'api.admin.content_deleted': 'Contenido eliminado.',
    'api.admin.notification_fields_required': 'El tipo, el título y el mensaje son obligatorios.',
    
    'api.payment.details_required': 'El nombre, el correo electrónico y el ID del plan son necesarios para continuar.',
    'api.payment.subscription_success': '¡Suscripción procesada con éxito!',
    'api.payment.active_premium_sync': 'Suscripción Sincronizada',
    'api.payment.activation_congrats': '¡Felicidades {name}! Su plan [{planName}] valorado en {price} fue aprobado con el ID de Transacción {transactionId}.',
    
    'api.stripe.email_plan_required': 'El correo electrónico y el ID del plan son obligatorios para generar el Stripe Checkout.',
    'api.stripe.connection_error': 'Error interno al conectar con Stripe.',
    'api.stripe.session_id_required': 'El parámetro session_id es obligatorio.',
    'api.stripe.validation_error': 'Error interno al validar las sesiones de pago.',
    'api.stripe.simulator_active': 'Stripe en Modo Simulado Activo (Su clave STRIPE_SECRET_KEY no está configurada)',
    'api.stripe.not_configured': 'Stripe no configurado en el backend. No se pueden verificar transacciones reales.',
    'api.stripe.not_paid': 'El pago de esta transacción aún no figura como completado.',
    'api.stripe.verification_success': 'Verificación sintonizada con éxito (Modo Simulado).'
  },
  de: {
    'api.auth.name_email_required': 'Name und E-Mail sind erforderlich.',
    'api.auth.email_code_required': 'E-Mail und Bestätigungscode sind erforderlich.',
    'api.auth.email_verification_error': 'Interner Fehler beim Verarbeiten der Bestätigungs-E-Mail.',
    'api.auth.simulation_notice': 'Aktivieren Sie Ihr Konto vorzugsweise mit dem offiziellen Firebase-E-Mail-Verifizierungssystem. Sternensimulator-Code: {code}',
    
    'api.astrology.name_required': 'Der Name ist für die astrologische Abstimmung erforderlich.',
    'api.astrology.internal_error': 'Interner Fehler bei der astrologischen Berechnung. Bitte überprüfen Sie die angegebenen Daten.',
    'api.astrology.rare_notifications_error': 'Interner Fehler beim Abrufen seltener Benachrichtigungen.',
    
    'api.dreams.content_required': 'Traumbeschreibung ist erforderlich.',
    
    'api.compatibility.both_names_required': 'Beide Namen sind erforderlich.',
    
    'api.oraculo.question_required': 'Orakelfrage ist erforderlich.',
    
    'api.osiris.messages_required': 'Nachrichten sind erforderlich.',
    
    'api.tarot.internal_error': 'Interner Fehler beim Ziehen von Tarotkarten.',
    
    'api.admin.user_not_found': 'Benutzer nicht gefunden.',
    'api.admin.user_deleted': 'Benutzer gelöscht.',
    'api.admin.plan_not_found': 'Plan nicht gefunden.',
    'api.admin.content_title_type_required': 'Titel und Inhaltstyp sind erforderlich.',
    'api.admin.content_not_found': 'Inhalt nicht gefunden.',
    'api.admin.content_deleted': 'Inhalt gelöscht.',
    'api.admin.notification_fields_required': 'Typ, Titel und Nachricht sind erforderlich.',
    
    'api.payment.details_required': 'Name, E-Mail und Plan-ID sind erforderlich, um fortzufahren.',
    'api.payment.subscription_success': 'Abonnement erfolgreich verarbeitet!',
    'api.payment.active_premium_sync': 'Abonnement synchronisiert',
    'api.payment.activation_congrats': 'Herzlichen Glückwunsch {name}! Ihr Plan [{planName}] im Wert von {price} wurde mit der Transaktions-ID {transactionId} genehmigt.',
    
    'api.stripe.email_plan_required': 'E-Mail und Plan-ID sind erforderlich, um den Stripe Checkout zu erstellen.',
    'api.stripe.connection_error': 'Interner Fehler beim Verbinden mit Stripe.',
    'api.stripe.session_id_required': 'Der Parameter session_id ist erforderlich.',
    'api.stripe.validation_error': 'Interner Fehler beim Überprüfen der Zahlungssitzungen.',
    'api.stripe.simulator_active': 'Stripe im aktiven Simulationsmodus (Ihr STRIPE_SECRET_KEY ist nicht konfiguriert)',
    'api.stripe.not_configured': 'Stripe nicht im Backend konfiguriert. Reale Transaktionen können nicht überprüft werden.',
    'api.stripe.not_paid': 'Die Zahlung für diese Transaktion ist noch nicht abgeschlossen.',
    'api.stripe.verification_success': 'Verifizierung erfolgreich abgestimmt (Simulationsmodus).'
  },
  fr: {
    'api.auth.name_email_required': "Le nom et l'adresse e-mail sont obligatoires.",
    'api.auth.email_code_required': "L'e-mail et le code de vérification sont obligatoires.",
    'api.auth.email_verification_error': "Erreur interne lors du traitement de l'e-mail de confirmation.",
    'api.auth.simulation_notice': "Activez de préférence votre compte à l'aide du système officiel de vérification d'e-mail de Firebase. Code du simulateur stellaire : {code}",
    
    'api.astrology.name_required': "Le nom est obligatoire pour l'harmonisation astrale.",
    'api.astrology.internal_error': "Erreur interne dans le calcul astrologique. Veuillez vérifier les données fournies.",
    'api.astrology.rare_notifications_error': "Erreur interne lors de la récupération des notifications rares.",
    
    'api.dreams.content_required': "La description du rêve est obligatoire.",
    
    'api.compatibility.both_names_required': "Les deux noms sont obligatoires.",
    
    'api.oraculo.question_required': "La question de l'oracle est obligatoire.",
    
    'api.osiris.messages_required': "Les messages sont requis.",
    
    'api.tarot.internal_error': "Erreur interne lors du tirage des cartes de tarot.",
    
    'api.admin.user_not_found': "Utilisateur non trouvé.",
    'api.admin.user_deleted': "Utilisateur supprimé.",
    'api.admin.plan_not_found': "Plan non trouvé.",
    'api.admin.content_title_type_required': "Le titre et le type de contenu sont obligatoires.",
    'api.admin.content_not_found': "Contenu non trouvé.",
    'api.admin.content_deleted': "Contenu supprimé.",
    'api.admin.notification_fields_required': "Le type, le titre et le message sont obligatoires.",
    
    'api.payment.details_required': "Le nom, l'e-mail et l'ID du plan sont requis pour continuer.",
    'api.payment.subscription_success': "Abonnement traité avec succès !",
    'api.payment.active_premium_sync': "Abonnement synchronisé",
    'api.payment.activation_congrats': "Félicitations {name} ! Votre forfait [{planName}] d'une valeur de {price} a été approuvé avec l'ID de transaction {transactionId}.",
    
    'api.stripe.email_plan_required': "L'e-mail et l'ID du forfait sont requis pour générer le Stripe Checkout.",
    'api.stripe.connection_error': "Erreur interne lors de la connexion à Stripe.",
    'api.stripe.session_id_required': "Le paramètre session_id est obligatoire.",
    'api.stripe.validation_error': "Erreur interne de validation des sessions de paiement.",
    'api.stripe.simulator_active': "Stripe en mode simulé actif (Votre clé STRIPE_SECRET_KEY n'est pas configurée)",
    'api.stripe.not_configured': "Stripe non configuré sur le backend. Impossible de vérifier les réelles transactions.",
    'api.stripe.not_paid': "Le paiement de cette transaction n'est pas encore finalisé.",
    'api.stripe.verification_success': "Vérification effectuée avec succès (mode simulé)."
  }
};

import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  // CORS handling
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { nome, email, motivo, lang } = req.body || {};

    if (!nome || !email || !motivo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campos obrigatórios ausentes: nome, email e motivo são necessários.' 
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY não configurada no ambiente.');
      return res.status(500).json({
        success: false,
        error: 'Erro de configuração do servidor de e-mail (chave ausente).'
      });
    }
    const resend = new Resend(apiKey);

    const supportRecipient = 'unterstutzung.service@gmail.com';
    const sender = 'Portal Orbita <onboarding@resend.dev>';

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #334155;">
          <h2 style="color: #f59e0b; font-size: 20px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
            🌌 Portal Órbita - Novo Chamado de Suporte
          </h2>
        </div>

        <div style="padding: 20px 0; font-size: 14px; line-height: 1.6; color: #e2e8f0;">
          <p style="margin: 8px 0;"><strong style="color: #f59e0b;">Nome do Usuário:</strong> ${nome}</p>
          <p style="margin: 8px 0;"><strong style="color: #f59e0b;">E-mail do Usuário:</strong> ${email}</p>
          <p style="margin: 8px 0;"><strong style="color: #f59e0b;">Idioma do Usuário:</strong> ${lang || 'pt'}</p>
          <p style="margin: 8px 0;"><strong style="color: #f59e0b;">Data/Hora:</strong> ${new Date().toISOString()}</p>
          
          <div style="margin-top: 20px; padding: 16px; background-color: #1e293b; border-left: 4px solid #f59e0b; border-radius: 8px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #f8fafc;">Mensagem / Motivo do Contato:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #cbd5e1;">${motivo}</p>
          </div>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #334155; font-size: 11px; color: #64748b;">
          Mensagem enviada automaticamente pelo formulário de contato do Portal Órbita via Resend API.
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [supportRecipient],
      subject: `[Suporte Portal Órbita] Mensagem de ${nome}`,
      html: htmlContent,
      replyTo: email,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      return res.status(500).json({ success: false, error: error.message || 'Erro ao enviar e-mail via Resend.' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso ao suporte!',
      id: data?.id || `ORB-TKT-${Date.now()}`
    });

  } catch (err: any) {
    console.error('[API Enviar Exception]:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Erro interno ao processar a solicitação de suporte.' 
    });
  }
}

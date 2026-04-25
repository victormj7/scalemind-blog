const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'

// Ideias de boas-vindas — rotacionadas para variedade
const WELCOME_IDEAS = [
  {
    nome:     'ChecklistPro',
    descricao: 'Templates e checklists profissionais para autônomos do seu nicho.',
    potencial: 'R$ 500 a R$ 2.000/mês',
    como:      'Crie 5 templates no Canva ou Notion e venda no Gumroad por R$ 47 cada.',
  },
  {
    nome:     'AgendaBot',
    descricao: 'Confirmação automática de agendamentos via WhatsApp para pequenos negócios.',
    potencial: 'R$ 800 a R$ 3.000/mês',
    como:      'Configure com Make + Twilio e cobre R$ 97/mês por cliente.',
  },
  {
    nome:     'RelatórioFácil',
    descricao: 'Gerador automático de relatórios profissionais em PDF para prestadores de serviço.',
    potencial: 'R$ 600 a R$ 2.500/mês',
    como:      'Use Typeform + Make + Google Slides. Cobre R$ 67/mês por usuário.',
  },
  {
    nome:     'MentorIA',
    descricao: 'Chatbot especializado que responde dúvidas do seu nicho 24h por dia.',
    potencial: 'R$ 500 a R$ 2.000/mês',
    como:      'Configure no Typebot com as 50 perguntas mais comuns. Cobre R$ 37/mês.',
  },
]

function getRandomIdea() {
  return WELCOME_IDEAS[Math.floor(Math.random() * WELCOME_IDEAS.length)]
}

export function buildWelcomeEmail(): { subject: string; html: string; text: string } {
  const idea = getRandomIdea()

  const subject = '🚀 Sua primeira ideia para ganhar dinheiro já chegou'

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0284c7,#7c3aed);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">ScaleMind</p>
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:26px;font-weight:800;line-height:1.3;">
                Bem-vindo! 🚀<br>Sua primeira ideia chegou
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;">
              <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                Olá! Você acabou de entrar no <strong>ScaleMind</strong> — o lugar onde ideias de negócios viram renda real.
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Aqui vai uma ideia que você pode começar <strong>hoje mesmo</strong>:
              </p>

              <!-- Ideia -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 4px;color:#16a34a;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">💡 Ideia do dia</p>
                    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:800;">${idea.nome}</h2>
                    <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">${idea.descricao}</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#dcfce7;border-radius:8px;padding:12px 16px;">
                          <p style="margin:0;color:#15803d;font-size:13px;font-weight:700;">💰 Potencial: ${idea.potencial}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:16px 0 0;color:#374151;font-size:13px;line-height:1.6;">
                      <strong>Como começar:</strong> ${idea.como}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Quer mais ideias como essa, personalizadas para o seu nicho?
              </p>

              <!-- CTAs -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${SITE_URL}/ferramentas/gerador-microsaas"
                      style="display:inline-block;background:linear-gradient(135deg,#0284c7,#7c3aed);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
                      🚀 Gerar mais ideias grátis
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}/upgrade"
                      style="display:inline-block;background:#f9fafb;border:2px solid #e5e7eb;color:#374151;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">
                      💎 Desbloquear ideias completas — R$ 9,90/mês
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;text-align:center;">
                Sem spam. Só ideias que podem gerar renda.<br>
                <a href="${SITE_URL}" style="color:#0284c7;text-decoration:none;">scalemind.com.br</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">
                © 2026 ScaleMind · Você recebeu este email porque se cadastrou em nosso site.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
Bem-vindo ao ScaleMind! 🚀

Aqui vai uma ideia que você pode começar hoje:

💡 ${idea.nome}
${idea.descricao}

💰 Potencial: ${idea.potencial}
Como começar: ${idea.como}

Quer mais ideias personalizadas?
→ Gerador gratuito: ${SITE_URL}/ferramentas/gerador-microsaas
→ Plano Premium: ${SITE_URL}/upgrade

Sem spam. Só ideias que podem gerar renda.
ScaleMind
  `.trim()

  return { subject, html, text }
}

export function buildNewPostEmail(post: {
  title: string
  summary: string
  link: string
}): { subject: string; html: string; text: string } {
  const subject = `📝 Novo post: ${post.title}`

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:linear-gradient(135deg,#0284c7,#7c3aed);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">ScaleMind</p>
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;font-weight:800;line-height:1.3;">Novo post publicado 📝</h1>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:32px;">
              <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:800;">${post.title}</h2>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">${post.summary}</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${post.link}"
                      style="display:inline-block;background:linear-gradient(135deg,#0284c7,#7c3aed);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
                      Ler artigo completo →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}/ferramentas/gerador-microsaas"
                      style="display:inline-block;background:#f9fafb;border:2px solid #e5e7eb;color:#374151;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">
                      🚀 Gerar ideia de MicroSaaS grátis
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;text-align:center;">
                Você recebeu este email porque se cadastrou no ScaleMind.<br>
                <a href="${SITE_URL}" style="color:#0284c7;text-decoration:none;">scalemind.com.br</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f3f4f6;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">© 2026 ScaleMind</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
Novo post no ScaleMind: ${post.title}

${post.summary}

Ler artigo: ${post.link}

Gerar ideia de MicroSaaS grátis: ${SITE_URL}/ferramentas/gerador-microsaas

ScaleMind · ${SITE_URL}
  `.trim()

  return { subject, html, text }
}

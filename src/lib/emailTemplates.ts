const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emailShell(title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="background:linear-gradient(135deg,#0284c7,#7c3aed);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">ScaleMind</p>
        <h1 style="margin:10px 0 0;color:#fff;font-size:22px;font-weight:800;line-height:1.3;">${title}</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">${preheader}</p>
      </td></tr>
      <tr><td style="background:#fff;padding:32px;">${body}</td></tr>
      <tr><td style="background:#f3f4f6;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:11px;">© 2026 ScaleMind · <a href="${SITE_URL}" style="color:#0284c7;text-decoration:none;">scalemind.com.br</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`.trim()
}

function ctaBtn(label: string, href: string, secondary = false): string {
  return secondary
    ? `<a href="${href}" style="display:inline-block;background:#f9fafb;border:2px solid #e5e7eb;color:#374151;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">${label}</a>`
    : `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#0284c7,#7c3aed);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">${label}</a>`
}

// ─── Email de boas-vindas (newsletter) ────────────────────────────────────────

const WELCOME_IDEAS = [
  {
    nome:      'ChecklistPro',
    descricao: 'Templates e checklists profissionais para autônomos do seu nicho.',
    potencial: 'R$ 500 a R$ 2.000/mês',
    como:      'Crie 5 templates no Canva ou Notion e venda no Gumroad por R$ 47 cada.',
  },
  {
    nome:      'AgendaBot',
    descricao: 'Confirmação automática de agendamentos via WhatsApp para pequenos negócios.',
    potencial: 'R$ 800 a R$ 3.000/mês',
    como:      'Configure com Make + Twilio e cobre R$ 97/mês por cliente.',
  },
  {
    nome:      'RelatórioFácil',
    descricao: 'Gerador automático de relatórios profissionais em PDF para prestadores de serviço.',
    potencial: 'R$ 600 a R$ 2.500/mês',
    como:      'Use Typeform + Make + Google Slides. Cobre R$ 67/mês por usuário.',
  },
  {
    nome:      'MentorIA',
    descricao: 'Chatbot especializado que responde dúvidas do seu nicho 24h por dia.',
    potencial: 'R$ 500 a R$ 2.000/mês',
    como:      'Configure no Typebot com as 50 perguntas mais comuns. Cobre R$ 37/mês.',
  },
]

function getRandomIdea() {
  return WELCOME_IDEAS[Math.floor(Math.random() * WELCOME_IDEAS.length)]
}

export function buildWelcomeEmail(): { subject: string; html: string; text: string } {
  const idea    = getRandomIdea()
  const subject = '🚀 Sua primeira ideia para ganhar dinheiro já chegou'
  const body = `
    <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">Olá! Você acabou de entrar no <strong>ScaleMind</strong> — o lugar onde ideias de negócios viram renda real.</p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">Aqui vai uma ideia que você pode começar <strong>hoje mesmo</strong>:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:24px;">
      <p style="margin:0 0 4px;color:#16a34a;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">💡 Ideia do dia</p>
      <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:800;">${idea.nome}</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">${idea.descricao}</p>
      <p style="margin:0 0 12px;background:#dcfce7;border-radius:8px;padding:12px 16px;color:#15803d;font-size:13px;font-weight:700;">💰 Potencial: ${idea.potencial}</p>
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.6;"><strong>Como começar:</strong> ${idea.como}</p>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr><td align="center" style="padding-bottom:12px;">
      ${ctaBtn('🚀 Gerar mais ideias grátis', `${SITE_URL}/ferramentas/gerador-microsaas`)}
    </td></tr></table>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0;">
    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">Sem spam. Só ideias que podem gerar renda.</p>
  `
  const text = `Bem-vindo ao ScaleMind!\n\n💡 ${idea.nome}\n${idea.descricao}\n\n💰 Potencial: ${idea.potencial}\nComo começar: ${idea.como}\n\n→ ${SITE_URL}/ferramentas/gerador-microsaas\n\nScaleMind`
  return { subject, html: emailShell('Bem-vindo! 🚀 Sua primeira ideia chegou', 'Comece a ganhar dinheiro hoje', body), text }
}

export function buildNewPostEmail(post: { title: string; summary: string; link: string }): { subject: string; html: string; text: string } {
  const subject = `📝 Novo post: ${post.title}`
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:800;">${post.title}</h2>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">${post.summary}</p>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:12px;">
      ${ctaBtn('Ler artigo completo →', post.link)}
    </td></tr><tr><td align="center">
      ${ctaBtn('🚀 Gerar ideia de MicroSaaS grátis', `${SITE_URL}/ferramentas/gerador-microsaas`, true)}
    </td></tr></table>
  `
  const text = `Novo post no ScaleMind: ${post.title}\n\n${post.summary}\n\nLer artigo: ${post.link}\n\nScaleMind · ${SITE_URL}`
  return { subject, html: emailShell('Novo post publicado 📝', post.title, body), text }
}

// ─── Sequência de onboarding ──────────────────────────────────────────────────

export function buildSequenceD0(): { subject: string; html: string; text: string } {
  const subject = '💡 Você gerou uma ideia — comece por aqui'
  const body = `
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">Você acabou de dar o primeiro passo. A maioria das pessoas para aqui — você não precisa ser uma delas.</p>
    <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">Sua ideia está salva. Agora o próximo passo é simples: <strong>volte ao copiloto e aprofunde um aspecto dela.</strong></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px;">
      <p style="margin:0 0 8px;color:#16a34a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">✅ Sua missão hoje</p>
      <p style="margin:0;color:#111827;font-size:15px;line-height:1.6;">Abra sua ideia salva e clique em <strong>"🎯 Conseguir o 1º cliente"</strong> no copiloto. Leva 2 minutos.</p>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td align="center">
      ${ctaBtn('🚀 Abrir minha ideia agora', `${SITE_URL}/ferramentas/gerador-microsaas`)}
    </td></tr></table>
    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">Amanhã você recebe o próximo passo.</p>
  `
  const text = `Você gerou uma ideia — comece por aqui\n\nSua missão: abra sua ideia e clique em "Conseguir o 1º cliente" no copiloto.\n\n→ ${SITE_URL}/ferramentas/gerador-microsaas\n\nScaleMind`
  return { subject, html: emailShell(subject, 'Seu próximo passo está aqui', body), text }
}

export function buildSequenceD1(): { subject: string; html: string; text: string } {
  const subject = '🧪 Você já validou sua ideia?'
  const body = `
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">A maioria das pessoas passa meses construindo algo que ninguém quer. Existe um jeito melhor.</p>
    <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;"><strong>Validar em 7 dias</strong> significa descobrir se alguém pagaria pela sua ideia <em>antes</em> de construir qualquer coisa.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:2px solid #fde68a;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px;">
      <p style="margin:0 0 12px;color:#92400e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚡ Método rápido de validação</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;">1. Escreva 1 frase descrevendo o problema que você resolve</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;">2. Poste em 3 grupos do Facebook ou WhatsApp do seu nicho</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;">3. Pergunte: <em>"Você pagaria R$ X por isso?"</em></p>
      <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;">4. Se 3 pessoas disserem sim → sua ideia tem mercado</p>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td align="center">
      ${ctaBtn('🧪 Ver como validar minha ideia', `${SITE_URL}/ferramentas/gerador-microsaas`)}
    </td></tr></table>
    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">Em 2 dias: como conseguir seu primeiro cliente pagante.</p>
  `
  const text = `Você já validou sua ideia?\n\nMétodo: poste em 3 grupos do seu nicho e pergunte se pagariam. 3 "sins" = mercado validado.\n\n→ ${SITE_URL}/ferramentas/gerador-microsaas\n\nScaleMind`
  return { subject, html: emailShell(subject, 'Não construa antes de validar', body), text }
}

export function buildSequenceD3(): { subject: string; html: string; text: string } {
  const subject = '🎯 Como conseguir seu primeiro cliente'
  const body = `
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">O primeiro cliente é o mais difícil. Mas existe um atalho que quase ninguém usa.</p>
    <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;"><strong>Não espere o cliente chegar até você.</strong> Vá até onde ele já está.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px;">
      <p style="margin:0 0 12px;color:#1d4ed8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🎯 Onde encontrar seu primeiro cliente</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;"><strong>Grupos do Facebook</strong> — procure grupos do seu nicho com +10k membros</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;"><strong>LinkedIn</strong> — conecte com 10 pessoas do perfil ideal por dia</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;"><strong>WhatsApp</strong> — liste 20 contatos que se encaixam no público-alvo</p>
      <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;"><strong>Oferta inicial</strong> — ofereça grátis para os 2 primeiros em troca de feedback</p>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td align="center">
      ${ctaBtn('🎯 Ver estratégia completa no copiloto', `${SITE_URL}/ferramentas/gerador-microsaas`)}
    </td></tr></table>
    <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">Em 2 dias: os erros que fazem ideias falharem.</p>
  `
  const text = `Como conseguir seu primeiro cliente\n\nVá até grupos do Facebook, LinkedIn e WhatsApp do seu nicho. Ofereça grátis para os 2 primeiros em troca de feedback.\n\n→ ${SITE_URL}/ferramentas/gerador-microsaas\n\nScaleMind`
  return { subject, html: emailShell(subject, 'O atalho que quase ninguém usa', body), text }
}

export function buildSequenceD5(): { subject: string; html: string; text: string } {
  const subject = '⚠️ Erros que fazem ideias falharem'
  const body = `
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;">Depois de acompanhar centenas de empreendedores, os mesmos erros aparecem sempre.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff1f2;border:2px solid #fecdd3;border-radius:12px;margin-bottom:24px;"><tr><td style="padding:20px;">
      <p style="margin:0 0 12px;color:#be123c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">⚠️ Os 4 erros mais comuns</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;">❌ <strong>Construir antes de validar</strong> — meses de trabalho sem um cliente</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;">❌ <strong>Preço muito baixo</strong> — barato demais passa insegurança</p>
      <p style="margin:0 0 8px;color:#111827;font-size:14px;line-height:1.6;">❌ <strong>Tentar atender todo mundo</strong> — nicho específico converte mais</p>
      <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;">❌ <strong>Desistir cedo demais</strong> — a maioria desiste na semana 3</p>
    </td></tr></table>
    <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">Sua ideia ainda está te esperando. O copiloto pode te ajudar a evitar cada um desses erros.</p>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:12px;">
      ${ctaBtn('🚀 Voltar ao copiloto agora', `${SITE_URL}/ferramentas/gerador-microsaas`)}
    </td></tr><tr><td align="center">
      ${ctaBtn('📚 Ler artigos sobre execução', `${SITE_URL}/blog`, true)}
    </td></tr></table>
  `
  const text = `Erros que fazem ideias falharem\n\n1. Construir antes de validar\n2. Preço muito baixo\n3. Tentar atender todo mundo\n4. Desistir cedo demais\n\nSua ideia ainda está te esperando.\n→ ${SITE_URL}/ferramentas/gerador-microsaas\n\nScaleMind`
  return { subject, html: emailShell(subject, 'Evite esses antes de começar', body), text }
}

export const SEQUENCE: Record<number, () => { subject: string; html: string; text: string }> = {
  0: buildSequenceD0,
  1: buildSequenceD1,
  3: buildSequenceD3,
  5: buildSequenceD5,
}

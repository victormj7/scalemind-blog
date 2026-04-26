# ScaleMind — Documentação Completa (Handoff)

> Última atualização: abril 2026  
> Stack: Next.js 15 · React 19 · Tailwind CSS · Vercel · Stripe · Resend · OpenAI

---

## 1. Visão Geral do Projeto

### O que é o ScaleMind

O ScaleMind é uma plataforma com dois produtos integrados:

1. **Blog de conteúdo** — artigos sobre IA, automação, MicroSaaS e renda online. Objetivo: gerar tráfego orgânico pelo Google e monetizar com Google AdSense.

2. **Gerador de ideias de negócio com IA** — ferramenta que recebe o perfil do usuário (área, nível, objetivo, tempo disponível) e gera uma ideia personalizada de MicroSaaS com modelo de negócio, potencial de receita e passo a passo.

### Como ganha dinheiro

- **Google AdSense** — anúncios nos artigos do blog (espaços reservados, aguardando aprovação)
- **Plano Premium R$ 9,90/mês** — desbloqueia conteúdo completo da ideia gerada (monetização, validação, IA, automação)
- **Stripe** — processa pagamentos recorrentes

### Público-alvo

Brasileiros iniciantes que querem criar renda online com IA e automação, sem necessariamente saber programar. Perfil: 25-40 anos, CLT ou autônomo, quer renda extra ou negócio próprio.

### Funil completo

```
Google (SEO) → Blog → Gerador de ideias → Limite gratuito → Paywall → Stripe → Premium
                                                    ↓
                                          Captura de e-mail (waitlist)
```

---

## 2. Arquitetura do Sistema

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Deploy | Vercel (deploy automático via GitHub push) |
| IA | OpenAI GPT-4o-mini |
| Pagamentos | Stripe (checkout + webhook) |
| E-mail | Resend (boas-vindas automático) |
| Storage | Memória (Map) — sem banco de dados real |

### Estrutura de pastas

```
scalemind-blog/
├── content/posts/          ← Artigos do blog em MDX
├── src/
│   ├── app/
│   │   ├── page.tsx        ← Home
│   │   ├── blog/           ← Listagem e posts individuais
│   │   ├── ferramentas/
│   │   │   └── gerador-microsaas/  ← O produto principal
│   │   ├── upgrade/        ← Página de planos
│   │   ├── success/        ← Pós-pagamento
│   │   └── api/
│   │       ├── generate-idea/  ← API principal do gerador
│   │       ├── stripe/         ← Checkout + Webhook
│   │       ├── newsletter/     ← Captura de e-mail
│   │       ├── waitlist/       ← Lista de espera
│   │       └── track/          ← Tracking de eventos
│   ├── components/
│   │   ├── HeroSection.tsx     ← Hero animado da home
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NewsletterForm.tsx
│   │   └── ui/
│   │       ├── PostCard.tsx
│   │       ├── CtaBox.tsx
│   │       └── AdBanner.tsx
│   ├── lib/
│   │   ├── posts.ts        ← Lê os MDX e sanitiza datas
│   │   ├── rateLimiter.ts  ← Rate limiting com TTL
│   │   ├── premiumStore.ts ← Usuários premium em memória
│   │   ├── ideas.ts        ← Banco de ideias fallback
│   │   ├── emailTemplates.ts ← Template do e-mail de boas-vindas
│   │   └── utils.ts        ← formatDate, categoryColor
│   └── types/
│       ├── post.ts         ← Tipos do blog
│       └── generator.ts    ← Tipos do gerador (UserProfile, Ideia, ApiResponse)
```

---

## 3. MicroSaaS — O Produto Principal

### Como funciona o gerador

O usuário preenche 4 perguntas:
1. Área de interesse (texto livre)
2. Nível técnico (iniciante / intermediário / avançado)
3. Objetivo (renda extra / criar negócio / escalar)
4. Tempo disponível (pouco / médio / total)

Esses dados são enviados para `POST /api/generate-idea`. A API tenta gerar com OpenAI. Se falhar, usa o fallback local.

### Fluxo completo do usuário

```
Formulário preenchido
    ↓
POST /api/generate-idea
    ↓
Verifica se é premium (header x-user-email)
    ↓
Verifica rate limit por IP (ideaLimiter)
    ↓
Tenta OpenAI → se falhar → usa fallback local
    ↓
Retorna JSON com preview (gratuito) + dados completos
    ↓
Frontend exibe preview + blur no conteúdo premium
    ↓
Usuário atinge limite (3/dia) → UpgradeWall
    ↓
Usuário clica em upgrade → /upgrade → Stripe Checkout
    ↓
Pagamento confirmado → webhook → premiumStore.addPremiumUser(email)
    ↓
Usuário volta → localStorage marca como premium → conteúdo desbloqueado
```

### Sistema de limite (rate limiting)

Arquivo: `src/lib/rateLimiter.ts`

Usa uma classe `RateLimiter` com `Map` em memória e TTL de 24h. Instância singleton `ideaLimiter` com limite de 3 usos por IP por dia.

**Problema crítico:** o Map é em memória. A cada deploy na Vercel, o contador reseta. Usuários podem burlar esperando um deploy ou usando VPN.

**Solução futura:** substituir por Upstash Redis. A interface já está preparada — basta trocar a implementação interna do `RateLimiter` sem mudar nada no resto do código.

### Lógica de fallback (sem API key)

Arquivo: `src/app/api/generate-idea/route.ts` — função `gerarFallback()`

Tem 3 ideias pré-escritas, uma por objetivo (renda-extra, criar-negocio, escalar). O nome e o problema são personalizados dinamicamente com a área que o usuário digitou.

Se `OPENAI_API_KEY` não estiver configurada na Vercel, 100% das ideias vêm do fallback.

---

## 4. Frontend

### Componente principal: GeradorClient

Arquivo: `src/app/ferramentas/gerador-microsaas/GeradorClient.tsx`

É um Client Component (`'use client'`) com os seguintes estados:

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `step` | `'form' \| 'result'` | Qual tela mostrar |
| `loading` | boolean | Spinner durante geração |
| `response` | ApiResponse | Resultado da API |
| `usage` | objeto | Quantas ideias usou hoje |
| `isPremium` | boolean | Se tem plano pago |
| `profile` | UserProfile | Dados do formulário |

### Como o premium é detectado no frontend

No `useEffect` inicial, lê `localStorage.getItem('scalemind_premium')`. Se for `'true'`, marca como premium e define `usage.remaining = 999`.

O e-mail do usuário premium fica em `localStorage.getItem('scalemind_premium_email')` e é enviado no header `x-user-email` de cada requisição.

### Sistema de blur (paywall visual)

Componente `PremiumBlur` dentro do `GeradorClient.tsx`.

O conteúdo premium (monetização, validação, IA, automação) é renderizado normalmente no HTML mas com `blur-sm` e `pointer-events-none`. Por cima há um overlay branco com o CTA de upgrade.

**Problema de segurança:** qualquer pessoa com DevTools consegue ver o conteúdo borrado. Isso é aceitável na fase de validação — o objetivo é conversão, não segurança real. Para corrigir no futuro: a API deve retornar `null` nos campos premium para usuários free.

---

## 5. Backend

### Rota principal: POST /api/generate-idea

Arquivo: `src/app/api/generate-idea/route.ts`

**Fluxo:**
1. Extrai IP do header `x-forwarded-for`
2. Verifica se é premium via `x-user-email` → `isUserPremium(email)`
3. Se free: verifica `ideaLimiter.check(ip)` — retorna 429 se excedeu
4. Valida e sanitiza o body (area, level, objective, time)
5. Incrementa contador se free
6. Chama `gerarComIA(profile)` — timeout de 10s
7. Se falhar: chama `gerarFallback(profile)`
8. Retorna `ApiResponse` com `{ success, fallback, source, isPremium, data, usage }`

### Chamada à OpenAI

Modelo: `gpt-4o-mini` (mais barato, suficiente para o caso de uso)

Usa duas mensagens:
- `system`: define o personagem da IA (especialista em MicroSaaS brasileiro)
- `user`: injeta o perfil do usuário e pede JSON no formato exato

`response_format: { type: 'json_object' }` força retorno JSON puro sem texto extra.

Timeout de 10 segundos via `AbortSignal.timeout(10000)`.

### Estrutura da resposta JSON

```typescript
interface ApiResponse {
  success:   boolean
  fallback:  boolean      // true = usou ideia local
  source:    'ai' | 'local'
  isPremium: boolean
  data: {
    nome, descricao, problema, publico,
    monetizacao, receita, passos[],
    validacao, ia, automacao,
    iniciante, programador, dificuldade
  }
  usage: { used, limit, remaining }
}
```

---

## 6. Banco de Dados / Storage

### Estado atual: tudo em memória

| Dado | Onde fica | Problema |
|------|-----------|---------|
| Rate limit por IP | `Map` em `rateLimiter.ts` | Reseta a cada deploy |
| Usuários premium | `Set` em `premiumStore.ts` | Reseta a cada deploy |
| Lista de espera (waitlist) | `Map` em `/api/waitlist/route.ts` | Reseta a cada deploy |
| Tracking de eventos | Array em `/api/track/route.ts` | Reseta a cada deploy |
| Uso do dia (frontend) | `localStorage` do browser | Persiste no browser, não no servidor |

### Evolução recomendada: Supabase

Quando tiver os primeiros pagantes, migrar para Supabase (gratuito até 500MB):

```sql
-- Usuários premium
create table subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  plan       text not null default 'free',
  stripe_id  text,
  created_at timestamptz default now()
);

-- Lista de espera
create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  source     text,
  created_at timestamptz default now()
);

-- Tracking
create table events (
  id         uuid primary key default gen_random_uuid(),
  event      text not null,
  ip         text,
  data       jsonb,
  created_at timestamptz default now()
);
```

---

## 7. Monetização

### Modelo freemium

- **Grátis:** 3 ideias/dia, preview com nome, problema e público
- **Premium R$ 9,90/mês:** ideias ilimitadas + conteúdo completo (monetização, validação, IA, automação, passo a passo)

### Fluxo de pagamento (Stripe)

1. Usuário clica em "Assinar" na `/upgrade`
2. Frontend chama `POST /api/stripe/checkout` com o e-mail
3. API cria sessão de checkout no Stripe e retorna a URL
4. Usuário é redirecionado para o checkout do Stripe
5. Após pagamento: Stripe redireciona para `/success`
6. Stripe envia webhook para `POST /api/stripe/webhook`
7. Webhook chama `addPremiumUser(email)` no `premiumStore`
8. Página `/success` salva `scalemind_premium=true` no localStorage

### Variáveis de ambiente necessárias (Stripe)

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Problema atual do paywall

O conteúdo premium é enviado pela API para todos os usuários — o blur é apenas CSS. Qualquer pessoa com DevTools vê tudo. Para corrigir: a API deve retornar `null` nos campos premium quando `isPremium = false`.

---

## 8. Captura de Leads

### Waitlist

Rota: `POST /api/waitlist`

Salva e-mails em memória com deduplicação. Retorna a posição na fila.

Fontes rastreadas: `premium_blur`, `upgrade_wall`, `newsletter_home`.

### Newsletter

Rota: `POST /api/newsletter`

Salva o e-mail e envia automaticamente um e-mail de boas-vindas via Resend com uma ideia de negócio aleatória.

### Variáveis de ambiente (Resend)

```
RESEND_API_KEY=re_...
FROM_EMAIL=ScaleMind <onboarding@resend.dev>
```

### Problema atual

Não há sequência de e-mails após o cadastro. O usuário recebe apenas o e-mail de boas-vindas e depois não recebe mais nada. Isso desperdiça leads quentes.

**Solução futura:** criar sequência de 3 e-mails no Resend ou Brevo:
- E-mail 1 (imediato): boas-vindas + ideia bônus
- E-mail 3 (dia 3): case de sucesso
- E-mail 7 (dia 7): oferta do Premium

---

## 9. SEO e Blog

### Como o blog funciona

Artigos em MDX em `content/posts/`. Cada arquivo tem frontmatter com `title`, `description`, `date`, `category`, `image`, `featured`.

O arquivo `src/lib/posts.ts` lê os MDX com `gray-matter` e expõe funções: `getAllPosts()`, `getPostBySlug()`, `getFeaturedPosts()`, `getRecentPosts()`.

**Correção de datas:** a função `sanitizeDate()` em `posts.ts` garante que datas futuras sejam substituídas pela data atual automaticamente. Isso evita que artigos apareçam com datas no futuro.

### Estratégia de conteúdo

O blog tem ~31 artigos organizados em clusters:

- **Cluster principal:** "Como ganhar dinheiro com IA" (artigo pilar + satélites)
- **Cluster de ação:** pessoas comuns, renda extra, habilidades, validação
- **Cluster técnico:** automação, no-code, ferramentas, MicroSaaS

Todos os artigos têm CTA para o gerador de ideias no meio e no final.

### Linkagem interna

Artigos se linkam entre si formando uma estrutura de cluster. O artigo pilar (`guia-definitivo-ganhar-dinheiro-ia-2026`) é o centro que recebe links de todos os satélites.

---

## 10. UX e Conversão

### Hero da home

Componente: `src/components/HeroSection.tsx`

Animação CSS pura (zero JavaScript):
- Gradient animado no fundo (`hero-animated-bg`)
- 3 orbs flutuantes com blur (`hero-orb`)
- Grid de pontos sutil (`hero-grid`)
- Botão com efeito de brilho no hover (`btn-glow`)

Depoimentos simulados de 3 usuários para prova social.

### Tabela de planos

Na home, há uma comparação visual Grátis vs Premium com lista de features e botões de CTA.

### Problemas de conversão identificados

- Prova social é simulada — quando tiver usuários reais, substituir por depoimentos reais
- O contador "847 ideias geradas" é fixo no código — quando tiver tracking real, tornar dinâmico
- O blur do premium é contornável via DevTools

---

## 11. Tracking

### Estado atual

Rota: `POST /api/track`

Salva eventos em array em memória (máximo 1.000). Agrega contadores por tipo de evento. Calcula taxa de conversão (`upgrade_click / limit_reached`).

Eventos rastreados:
- `idea_generated` — quando gera uma ideia
- `upgrade_click` — quando clica em upgrade (com origem: `premium_blur` ou `upgrade_wall`)
- `limit_reached` — quando atinge o limite
- `waitlist_signup` — quando entra na lista de espera

### Como ver os dados

```bash
curl -H "x-api-key: scalemind-api-2025-secreto" \
  https://scalemind-blog.vercel.app/api/track
```

### Problema

Dados somem a cada deploy. Para analytics real, migrar para Supabase ou PostHog.

---

## 12. Problemas Atuais (Críticos)

| Problema | Impacto | Solução |
|----------|---------|---------|
| Rate limit em memória | Reseta a cada deploy, fácil de burlar | Upstash Redis |
| Usuários premium em memória | Perde assinantes após deploy | Supabase |
| Paywall é só CSS blur | Conteúdo visível no DevTools | API retornar null para free |
| Sem sequência de e-mails | Leads esfriando sem nutrição | Resend/Brevo automação |
| Tracking em memória | Perde dados a cada deploy | Supabase ou PostHog |
| OpenAI pode não estar ativa | Ideias repetitivas do fallback | Verificar OPENAI_API_KEY na Vercel |
| Datas futuras nos MDX | Prejudica credibilidade e SEO | Já corrigido via sanitizeDate() |

---

## 13. Roadmap

### Fase 1 — Validação (agora)
- Divulgar o gerador para 100+ pessoas
- Coletar e-mails na waitlist
- Verificar taxa de conversão no `/api/track`
- Meta: 20+ e-mails na lista de espera

### Fase 2 — Primeiros pagantes (mês 1-2)
- Ativar OpenAI na Vercel (adicionar créditos)
- Migrar rate limit para Upstash Redis
- Criar sequência de e-mails no Resend
- Meta: 10 assinantes pagantes

### Fase 3 — Produto real (mês 2-3)
- Migrar storage para Supabase
- Corrigir paywall (API retornar null para free)
- Adicionar autenticação (Supabase Auth)
- Meta: 50 assinantes = R$ 495/mês

### Fase 4 — Escala (mês 4+)
- Google AdSense aprovado
- SEO gerando tráfego orgânico consistente
- Sequência de e-mails automatizada
- Meta: 200 assinantes = R$ 1.980/mês

---

## 14. Decisões Técnicas Importantes

### Por que Next.js App Router?

Permite ter frontend e backend no mesmo projeto sem servidor separado. Reduz custo e complexidade. Deploy automático na Vercel com zero configuração.

### Por que sem banco de dados agora?

O projeto está em fase de validação. Adicionar banco antes de ter usuários pagantes é overengineering. O Map em memória é suficiente para validar se o produto tem demanda.

### Por que o blur é CSS e não proteção real?

Na fase de validação, o objetivo é conversão, não segurança. O blur cria curiosidade e incentiva o upgrade. Quando tiver pagantes reais, a API deve ser atualizada para não enviar dados premium.

### O que NÃO mudar sem cuidado

- `src/app/layout.tsx` — qualquer mudança aqui pode causar hydration mismatch e quebrar o site inteiro
- `src/lib/posts.ts` — a função `sanitizeDate` é crítica para evitar datas futuras
- `src/middleware.ts` — rate limiting global das APIs
- Variáveis de ambiente na Vercel — especialmente `STRIPE_WEBHOOK_SECRET`

---

## 15. Instruções para o Próximo Desenvolvedor

### Por onde começar

1. Clone o repositório e rode `npm install`
2. Copie `.env.local` e preencha as variáveis (peça ao responsável anterior)
3. Rode `npm run dev` e acesse `http://localhost:3000`
4. Teste o gerador em `/ferramentas/gerador-microsaas`

### Variáveis de ambiente necessárias

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://scalemind-blog.vercel.app

# OpenAI (necessário para ideias com IA)
OPENAI_API_KEY=sk-...

# Stripe (necessário para pagamentos)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (necessário para e-mails)
RESEND_API_KEY=re_...
FROM_EMAIL=ScaleMind <onboarding@resend.dev>

# API interna (para criar posts via Make)
API_KEY=scalemind-api-2025-secreto
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=victormj7
GITHUB_REPO=scalemind-blog
```

### Como fazer deploy

```bash
git add .
git commit -m "descrição da mudança"
git push
# Vercel detecta automaticamente e publica em 1-2 minutos
```

### O que priorizar primeiro

1. Verificar se `OPENAI_API_KEY` está ativa (testar no gerador — deve aparecer badge "✨ Gerado com IA")
2. Migrar rate limit para Upstash Redis (evita reset a cada deploy)
3. Criar sequência de e-mails no Resend (nutrir leads capturados)
4. Corrigir paywall (API retornar null para campos premium quando free)

### O que NÃO mexer ainda

- Não adicionar autenticação antes de ter 50+ usuários pagantes
- Não integrar banco de dados antes de validar demanda
- Não reescrever o layout.tsx (risco de hydration mismatch)
- Não mudar a estrutura de pastas do App Router sem necessidade

### Como ver métricas

```bash
# Tracking de eventos
curl -H "x-api-key: scalemind-api-2025-secreto" \
  https://scalemind-blog.vercel.app/api/track

# Lista de e-mails capturados
curl -H "x-api-key: scalemind-api-2025-secreto" \
  https://scalemind-blog.vercel.app/api/waitlist
```

### Como criar um novo artigo

Crie um arquivo `.mdx` em `content/posts/` com o frontmatter:

```mdx
---
title: "Título do artigo"
description: "Descrição SEO (até 160 chars)"
date: "2026-04-26"
category: "MicroSaaS"
image: "https://images.unsplash.com/photo-XXXXX?w=1200&q=80"
featured: false
---

Conteúdo em Markdown aqui...
```

Faça `git push` e a Vercel publica automaticamente.

---

*Documentação gerada em abril 2026. Projeto em fase de validação — MVP funcional, sem banco de dados real.*

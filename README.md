# ScaleMind Blog

Blog profissional sobre MicroSaaS, Automação, Finanças Digitais e Renda Online.

**Stack**: Next.js 14 (App Router) · React · Tailwind CSS · File-based CMS

---

## 🚀 Rodando localmente

### Pré-requisitos
- Node.js 18+ → https://nodejs.org
- npm ou yarn

### Instalação

```bash
# 1. Clone ou entre na pasta do projeto
cd scalemind-blog

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Edite o arquivo .env.local com seus dados reais

# 4. Rode o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

---

## ✍️ Como adicionar novos posts

1. Crie um arquivo `.mdx` em `/content/posts/`
2. Use o seguinte frontmatter:

```mdx
---
title: "Título do seu artigo"
description: "Descrição SEO com 150-160 caracteres"
date: "2024-08-01"
category: "MicroSaaS"
image: "https://images.unsplash.com/photo-XXXXX?w=1200&q=80"
featured: false
---

## Seu conteúdo aqui

Escreva em Markdown normal...
```

3. O slug da URL será gerado automaticamente a partir do nome do arquivo.
   - Arquivo: `meu-novo-post.mdx` → URL: `/blog/meu-novo-post`

4. Categorias disponíveis: `MicroSaaS` | `Automação` | `Finanças` | `Renda Online`

5. Salve o arquivo — o post aparece automaticamente no blog.

---

## 🌐 Deploy na Vercel

### Opção 1: Via GitHub (recomendado)

```bash
# 1. Crie um repositório no GitHub e faça push
git init
git add .
git commit -m "feat: initial blog setup"
git remote add origin https://github.com/SEU_USUARIO/scalemind-blog.git
git push -u origin main

# 2. Acesse https://vercel.com
# 3. Clique em "New Project" → importe o repositório
# 4. Configure as variáveis de ambiente (mesmo conteúdo do .env.local)
# 5. Clique em Deploy
```

### Opção 2: Via Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## 🔗 Conectar domínio próprio

1. Acesse seu projeto na Vercel → Settings → Domains
2. Adicione seu domínio (ex: scalemind.blog)
3. No painel do seu registrador de domínio, adicione:
   - **Tipo A**: `@` → IP fornecido pela Vercel
   - **CNAME**: `www` → `cname.vercel-dns.com`
4. Aguarde propagação (até 48h, geralmente menos de 1h)

---

## 🔍 Google Search Console

1. Acesse https://search.google.com/search-console
2. Clique em "Adicionar propriedade" → insira seu domínio
3. Escolha verificação por **HTML tag** ou **DNS**
4. Para HTML tag: adicione a meta tag no `layout.tsx`:
   ```tsx
   // Em src/app/layout.tsx, dentro de metadata:
   verification: {
     google: 'SEU_CODIGO_DE_VERIFICACAO',
   }
   ```
5. Após verificação, envie o sitemap:
   - URL do sitemap: `https://seudominio.com/sitemap.xml`

---

## 💰 Google AdSense

### Passo a passo para aprovação:

1. **Pré-requisitos** (antes de aplicar):
   - Site com domínio próprio (não subdomínio gratuito)
   - Pelo menos 20-30 artigos de qualidade
   - Política de Privacidade publicada (`/politica-privacidade`)
   - Site indexado no Google (use o Search Console)

2. **Aplicar**:
   - Acesse https://adsense.google.com
   - Clique em "Começar"
   - Insira a URL do seu site
   - Aguarde aprovação (7-14 dias)

3. **Após aprovação**:
   - Copie seu Publisher ID (formato: `ca-pub-XXXXXXXXXXXXXXXX`)
   - Cole no `.env.local`: `NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX`
   - Crie unidades de anúncio no painel do AdSense
   - Substitua os `slotIds` em `src/components/ui/AdBanner.tsx`

4. **Slots de anúncio configurados**:
   - `top` → Banner no topo das páginas
   - `mid-content` → Dentro do artigo (maior CTR)
   - `sidebar` → Barra lateral do post
   - `footer` → Rodapé do site

---

## 📂 Estrutura do projeto

```
scalemind-blog/
├── content/
│   └── posts/              ← Seus artigos em MDX
├── public/
│   └── images/             ← Imagens locais
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── [slug]/     ← Página de post individual (SSG)
│   │   │   └── page.tsx    ← Listagem do blog
│   │   ├── sobre/
│   │   ├── contato/
│   │   ├── politica-privacidade/
│   │   ├── layout.tsx      ← Layout raiz + metadata global
│   │   ├── page.tsx        ← Home
│   │   ├── sitemap.ts      ← Sitemap dinâmico
│   │   └── robots.ts       ← Robots.txt
│   ├── components/
│   │   ├── ui/
│   │   │   ├── AdBanner.tsx        ← Slots do AdSense
│   │   │   ├── CategoryBadge.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   └── PostCard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── posts.ts        ← Engine do CMS (getAllPosts, getPostBySlug...)
│   │   └── utils.ts        ← Formatação de datas e cores
│   └── types/
│       └── post.ts         ← Tipagem central
└── .env.local              ← Variáveis de ambiente
```

---

## 🔮 Roadmap de evolução

### Fase 2 — Crescimento (mês 2-3)
- [ ] Integrar Mailchimp/Brevo para newsletter real
- [ ] Adicionar busca de artigos
- [ ] Implementar paginação no blog
- [ ] Adicionar Google Analytics

### Fase 3 — Monetização avançada (mês 4-6)
- [ ] Área de membros com Clerk ou NextAuth
- [ ] Conteúdo premium exclusivo para assinantes
- [ ] Integração com Stripe para assinaturas

### Fase 4 — MicroSaaS (mês 6+)
- [ ] Lançar ferramenta SaaS integrada ao blog
- [ ] API própria para dados e automações
- [ ] Dashboard de usuários

---

## 🎨 Identidade ScaleMind

**Nome**: ScaleMind — "Mente que escala"  
**Conceito**: Tecnologia + Estratégia + Crescimento  
**Cores primárias**: Sky Blue (#0ea5e9) + Violet (#8b5cf6)  
**Tom de voz**: Direto, prático, sem enrolação  
**Público**: Empreendedores digitais, 25-40 anos, Brasil

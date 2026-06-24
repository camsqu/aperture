# Aperture Science — Cloudflare SE Demo

A mock enterprise website for **Aperture Science** (aperturescience.xyz) used to
demonstrate the Cloudflare platform end-to-end. Built with **Next.js (App Router)**
and deployed to **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

> "We do what we must, because we can."

## Stack

- **Next.js 15** (App Router, React 19, Tailwind v4)
- **Cloudflare Workers** runtime via OpenNext adapter
- **Wrangler** for config/deploy

## Feature map

Each route is designed to demonstrate a Cloudflare feature. Some are pure app code,
others are *trigger surfaces* for behavior configured in the Cloudflare dashboard.

| Route | Demonstrates | Where configured |
| --- | --- | --- |
| `/` | Hero / landing, video bg | App |
| `/about` | Company lore | App |
| `/ai` | AI overview hub | App |
| `/ai` chat widget | **Workers AI** (Llama 3.3) + **AI Gateway** streaming chat | App + `AI` binding + dashboard gateway |
| `/ai/search` | **AI Search (AutoRAG)** RAG over Aperture lore | App + `AI_SEARCH` binding + dashboard instance |
| `/waf` | **WAF** block / challenge / log, **AI bot mitigation / AI Labyrinth** | Dashboard rules; app provides links |
| `/login` | **Turnstile** | App + Turnstile keys |
| `/ssl` | **SSL/TLS** edge info | App (surfaces `request.cf`) |
| `/rl` | **Rate Limiting** | Dashboard rule; app provides trigger |
| `/lb` | **Load Balancing** origin info | Dashboard pool; app surfaces origin |
| `robots.txt` / `llms.txt` | **AI Crawl Control** / Pay Per Crawl | Static + dashboard |
| on-prem (`index.html`) | DNS to GCP origin via `onprem.aperturescience.xyz` | DNS |

## Cloudflare bindings

Defined in `wrangler.jsonc` (typed in `cloudflare-env.d.ts` via `npm run cf-typegen`):

- `AI` — Workers AI + AI Gateway
- `AI_SEARCH` — AI Search (AutoRAG) namespace
- `LORE` (R2) — source documents for AI Search
- `KV` — feature flags / announcement banner
- `DB` (D1) — "Apply to Test" signups
- Turnstile site/secret keys

## Local development

```bash
npm install
npm run dev        # Next dev server (bindings via initOpenNextCloudflareForDev)
```

Preview in the actual Workers runtime:

```bash
npm run preview    # opennextjs-cloudflare build && preview
```

## Deploy

```bash
npm run deploy     # opennextjs-cloudflare build && deploy
npm run cf-typegen # regenerate binding types after editing wrangler.jsonc
```

## Dashboard checklist

See `DASHBOARD.md` for the one-time Cloudflare dashboard setup (AI Gateway,
AI Search instance, R2 bucket, KV namespace, D1 database, Turnstile widget,
WAF / Rate Limiting / Load Balancing / AI Crawl Control rules).

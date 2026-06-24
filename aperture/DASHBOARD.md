# Cloudflare Dashboard Checklist

One-time setup for resources that can't be created from code (or that need
dashboard configuration) to light up every demo on this site.

Account: **Squireframe** (`9f961ae1db7e2288181247e40a4fba11`)

## Already provisioned (done via tooling)

These were created automatically and are wired into `wrangler.jsonc`:

- **KV namespace** `aperture-kv` (`55ef3bc36ba94468af4b40496404b479`) — binding `KV`.
  Seeded key `announcement` (powers the site-wide banner).
- **D1 database** `aperture-db` (`83149ccf-e523-4b2d-bf86-179ec971ecba`) — binding `DB`.
  Table `test_subjects` created (powers `/apply`).
- **R2 bucket** `aperture-lore` — binding `LORE`. Uploaded: `company-history.md`,
  `products.md`, `safety.md`.

## To do in the dashboard

### 1. AI Gateway (chatbot analytics/caching)
- AI → AI Gateway → create gateway named **`aperture`** (or let it auto-create on first
  chat). The chat route already passes `gateway.id = "aperture"`.

### 2. AI Search / AutoRAG (powers `/ai/search`)
- AI → AI Search → **Create** an instance named **`aperture-lore`**.
- Data source: the **`aperture-lore`** R2 bucket.
- Pick an embedding model + a generation model; (optionally attach the `aperture`
  AI Gateway for provider keys/observability).
- Index the bucket. Once indexing finishes, `/ai/search` returns grounded answers.

### 3. Turnstile (powers `/login`)
- Turnstile → add a widget for `aperturescience.xyz`.
- Put the **site key** in `wrangler.jsonc` → `vars.TURNSTILE_SITE_KEY`.
- Set the **secret**: `wrangler secret put TURNSTILE_SECRET_KEY`.
- (Defaults use Cloudflare's always-pass test keys, so login works before this.)

### 4. WAF + bot controls (powers `/waf`)
- WAF → custom rules for the trigger paths: `/block-page` (Block), `/challenge/managed`
  (Managed Challenge), `/challenge/js` (JS Challenge), `/log` (Log).
- Bot Management / AI Crawl Control → enable **Block AI bots** and **AI Labyrinth**
  for `/ai-bots`.

### 5. Rate Limiting (powers `/rl`)
- Security → Rate limiting rules → add a rule on `/api/ping`
  (e.g. > 10 requests / 10s → Block / 429). The page sends 30 rapid requests.

### 6. Load Balancing (powers `/lb`)
- Traffic → Load Balancing → create a pool with two origins: this Worker and
  `onprem.aperturescience.xyz`. Add a health monitor + steering policy.

### 7. AI Crawl Control (powers robots.txt / llms.txt story)
- AI Crawl Control → enable, manage robots.txt, review AI Audit analytics.
- Optionally enroll in **Pay Per Crawl** (beta) to monetize AI crawler access.

## Deploy

```bash
export CLOUDFLARE_ACCOUNT_ID=9f961ae1db7e2288181247e40a4fba11
npm run deploy
```

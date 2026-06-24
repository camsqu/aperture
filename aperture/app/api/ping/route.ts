export const dynamic = "force-dynamic";

// Lightweight endpoint used by the /rl page to demonstrate Rate Limiting.
// Attach a Cloudflare Rate Limiting rule to /api/ping in the dashboard; once the
// threshold is exceeded, Cloudflare returns 429 before the request reaches this Worker.
export async function GET() {
  return Response.json({ ok: true, ts: Date.now() });
}

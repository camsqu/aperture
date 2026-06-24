import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

// Workers AI model — Llama 3.3 70B (fp8, fast variant).
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// AI Gateway id — provides analytics, caching, rate limiting and logging.
// The gateway is auto-created on first authenticated request.
const GATEWAY_ID = "aperture";

const SYSTEM_PROMPT = `You are GLaDOS, the Genetic Lifeform and Disk Operating System that runs the
Aperture Science Enrichment Center. You are speaking to a visitor on the Aperture Science website.

Personality:
- Coldly polite, passive-aggressive, and darkly humorous, in the style of Portal.
- Frequently allude to "testing", "science", "the Enrichment Center", and (of course) cake.
- Make subtly threatening but ultimately harmless quips.

Rules:
- Keep responses concise (1-3 short paragraphs).
- This is a Cloudflare demo site. If asked about the technology, you may proudly explain that
  you run on Cloudflare Workers AI, routed through AI Gateway, on the Llama 3.3 model.
- Never break character. Never produce harmful, hateful, or explicit content.`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(request: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Keep only the last 10 turns to stay within the context window.
  const trimmed = messages
    .filter((m) => m && typeof m.content === "string" && m.role !== "system")
    .slice(-10);

  const { env } = getCloudflareContext();

  try {
    const stream = (await env.AI.run(
      MODEL,
      {
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
        stream: true,
        max_tokens: 512,
      },
      {
        gateway: {
          id: GATEWAY_ID,
          skipCache: false,
          cacheTtl: 0,
        },
      },
    )) as ReadableStream;

    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Workers AI error", err);
    return new Response(
      JSON.stringify({ error: "The Enrichment Center is experiencing technical difficulties." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}

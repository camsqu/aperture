import { getCloudflareContext } from "@opennextjs/cloudflare";

// Server component: reads the announcement string from Workers KV.
// Falls back to a default if the key is unset or KV is unavailable (e.g. plain `next build`).
export default async function Banner() {
  let message =
    "The Enrichment Center reminds you: cake will be served upon test completion.";

  try {
    const { env } = getCloudflareContext();
    const stored = await env.KV.get("announcement");
    if (stored) message = stored;
  } catch {
    /* KV unavailable — use default */
  }

  if (!message) return null;

  // Rendered inside the <nav> (which is fixed). `top-full` anchors this bar to the
  // bottom edge of the navbar regardless of the navbar's height, so it never hides behind it.
  return (
    <div className="absolute left-0 right-0 top-full z-40 bg-orange-600/90 px-4 py-1.5 text-center text-xs font-medium text-white backdrop-blur-sm">
      {message}
    </div>
  );
}

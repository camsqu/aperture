import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

// Name of the AI Search (AutoRAG) instance created in the dashboard,
// indexing the `aperture-lore` R2 bucket. See DASHBOARD.md.
const INSTANCE = "aperture-lore";

export async function POST(request: Request) {
  let query = "";
  try {
    const body = (await request.json()) as { query?: string };
    query = (body.query ?? "").trim();
  } catch {
    /* fall through */
  }

  if (!query) {
    return Response.json({ error: "Provide a query." }, { status: 400 });
  }

  const { env } = getCloudflareContext();

  try {
    // RAG: AI Search retrieves relevant chunks from the indexed lore and
    // generates a grounded answer in one call.
    const result = await (env.AI as unknown as {
      autorag: (name: string) => {
        aiSearch: (opts: { query: string }) => Promise<{
          response: string;
          data?: Array<{ filename?: string; file_id?: string }>;
        }>;
      };
    })
      .autorag(INSTANCE)
      .aiSearch({ query });

    const sources = Array.from(
      new Set((result.data ?? []).map((d) => d.filename || d.file_id).filter(Boolean)),
    );

    return Response.json({ answer: result.response, sources });
  } catch (err) {
    console.error("AI Search error", err);
    return Response.json(
      {
        error:
          "AI Search is not configured yet. Create an AI Search instance named '" +
          INSTANCE +
          "' over the aperture-lore R2 bucket (see DASHBOARD.md).",
      },
      { status: 503 },
    );
  }
}

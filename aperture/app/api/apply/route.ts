import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let name = "";
  let reason = "";
  try {
    const body = (await request.json()) as { name?: string; reason?: string };
    name = (body.name ?? "").trim().slice(0, 80);
    reason = (body.reason ?? "").trim().slice(0, 280);
  } catch {
    /* fall through */
  }

  if (!name) {
    return Response.json({ success: false, error: "Name is required." }, { status: 400 });
  }

  try {
    const { env } = getCloudflareContext();
    await env.DB.prepare("INSERT INTO test_subjects (name, reason) VALUES (?, ?)")
      .bind(name, reason || null)
      .run();
    return Response.json({ success: true });
  } catch (err) {
    console.error("D1 insert error", err);
    return Response.json({ success: false, error: "Could not record application." }, { status: 500 });
  }
}

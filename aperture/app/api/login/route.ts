import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

// Cloudflare Turnstile "always passes" test secret — used as a safe default
// for local/dev. Set the real secret with: wrangler secret put TURNSTILE_SECRET_KEY
const TEST_SECRET = "1x0000000000000000000000000000000AA";

export async function POST(request: Request) {
  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token ?? "";
  } catch {
    /* fall through */
  }

  if (!token) {
    return Response.json({ success: false, error: "Missing Turnstile token." }, { status: 400 });
  }

  const { env, cf } = getCloudflareContext();
  const secret =
    (env as unknown as { TURNSTILE_SECRET_KEY?: string }).TURNSTILE_SECRET_KEY || TEST_SECRET;

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  const ip = (cf as { clientIp?: string } | undefined)?.clientIp;
  if (ip) form.append("remoteip", ip);

  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  const outcome = (await verify.json()) as { success: boolean; "error-codes"?: string[] };

  if (!outcome.success) {
    return Response.json(
      { success: false, error: "Verification failed.", codes: outcome["error-codes"] },
      { status: 403 },
    );
  }

  return Response.json({
    success: true,
    message: "Identity confirmed. Welcome back, test subject.",
  });
}

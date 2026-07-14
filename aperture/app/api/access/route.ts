import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ACCESS_JWT_HEADER, runValidationSteps } from "../../lib/access";

export const dynamic = "force-dynamic";

// Programmatic view of Cloudflare Access JWT validation for the current request.
// Returns the ordered validation steps plus the verified identity (if any).
export async function GET(request: Request) {
  const jwt = request.headers.get(ACCESS_JWT_HEADER);

  let teamDomain = "";
  let aud = "";
  try {
    const env = getCloudflareContext().env as unknown as {
      TEAM_DOMAIN?: string;
      POLICY_AUD?: string;
    };
    teamDomain = env.TEAM_DOMAIN ?? "";
    aud = env.POLICY_AUD ?? "";
  } catch {
    /* not on Workers (plain build) */
  }

  const { steps, identity } = await runValidationSteps(jwt, teamDomain, aud);

  return NextResponse.json(
    {
      valid: Boolean(identity),
      header: ACCESS_JWT_HEADER,
      tokenPresent: Boolean(jwt),
      identity: identity
        ? {
            sub: identity.sub,
            email: identity.email,
            iss: identity.iss,
            aud: identity.aud,
            groups: identity.groups,
            country: identity.country,
          }
        : null,
      steps,
    },
    {
      status: identity ? 200 : 401,
      headers: { "cache-control": "no-store" },
    },
  );
}

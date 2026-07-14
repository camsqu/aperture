import { createRemoteJWKSet, jwtVerify, decodeJwt, decodeProtectedHeader, type JWTPayload } from "jose";

// The header Cloudflare Access injects on requests it forwards to the origin
// once a visitor has authenticated. Validate THIS at the origin.
export const ACCESS_JWT_HEADER = "cf-access-jwt-assertion";
// Access also drops this cookie; the header is the canonical thing to verify.
export const ACCESS_COOKIE = "CF_Authorization";

export type AccessIdentity = {
  sub: string;
  email?: string;
  iss: string;
  aud: string | string[];
  groups?: string[];
  identity_nonce?: string;
  country?: string;
  raw: JWTPayload;
};

// Cache JWKS per team domain at module scope so it survives across requests
// within the same isolate. `createRemoteJWKSet` handles its own caching/refresh.
const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJwks(teamDomain: string) {
  const key = teamDomain.toLowerCase();
  let jwks = jwksCache.get(key);
  if (!jwks) {
    const url = new URL(`https://${teamDomain}/cdn-cgi/access/certs`);
    jwks = createRemoteJWKSet(url);
    jwksCache.set(key, jwks);
  }
  return jwks;
}

function isConfigured(teamDomain: string, expectedAud: string) {
  return Boolean(
    teamDomain &&
      !teamDomain.includes("REPLACE") &&
      expectedAud &&
      !expectedAud.includes("REPLACE"),
  );
}

/**
 * Verifies a `Cf-Access-Jwt-Assertion` header value against the team's JWKS.
 *
 * - `teamDomain` looks like `your-team.cloudflareaccess.com`
 * - `expectedAud` is the AUD from the Access Application protecting this route.
 *   In the dashboard: Zero Trust → Access → Applications → (your app) → Overview
 *   → Application Audience (AUD) Tag.
 */
export async function verifyAccessJwt(
  jwt: string,
  teamDomain: string,
  expectedAud: string,
): Promise<AccessIdentity> {
  if (!teamDomain || teamDomain.includes("REPLACE")) {
    throw new Error("TEAM_DOMAIN is not configured");
  }
  if (!expectedAud || expectedAud.includes("REPLACE")) {
    throw new Error("POLICY_AUD is not configured");
  }

  const jwks = getJwks(teamDomain);
  const { payload } = await jwtVerify(jwt, jwks, {
    issuer: `https://${teamDomain}`,
    audience: expectedAud,
  });

  if (!payload.sub) {
    throw new Error("JWT missing `sub` claim");
  }

  return {
    sub: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    iss: payload.iss ?? `https://${teamDomain}`,
    aud: payload.aud as string | string[],
    groups: Array.isArray((payload as Record<string, unknown>).groups)
      ? ((payload as Record<string, unknown>).groups as string[])
      : undefined,
    identity_nonce:
      typeof (payload as Record<string, unknown>).identity_nonce === "string"
        ? ((payload as Record<string, unknown>).identity_nonce as string)
        : undefined,
    country:
      typeof (payload as Record<string, unknown>).country === "string"
        ? ((payload as Record<string, unknown>).country as string)
        : undefined,
    raw: payload,
  };
}

// ---------------------------------------------------------------------------
// Teaching helpers — decode WITHOUT verifying, purely to visualise a JWT's
// structure (header + payload) on the demo page. Never trust these values for
// authorization; that's what verifyAccessJwt (signature check) is for.
// ---------------------------------------------------------------------------

export type DecodedJwt = {
  header: Record<string, unknown>;
  payload: JWTPayload;
};

export function decodeJwtForDisplay(jwt: string): DecodedJwt | null {
  try {
    return {
      header: decodeProtectedHeader(jwt) as Record<string, unknown>,
      payload: decodeJwt(jwt),
    };
  } catch {
    return null;
  }
}

export type ValidationStep = {
  step: string;
  ok: boolean | null; // null = skipped / not applicable
  detail: string;
};

/**
 * Produces an ordered, human-readable breakdown of every check that goes into
 * validating an Access JWT. Drives the "how validation works" UI. It runs the
 * real cryptographic verification via `verifyAccessJwt` for the signature step.
 */
export async function runValidationSteps(
  jwt: string | null,
  teamDomain: string,
  expectedAud: string,
): Promise<{ steps: ValidationStep[]; identity: AccessIdentity | null }> {
  const steps: ValidationStep[] = [];

  // 1. Header present
  if (!jwt) {
    steps.push({
      step: "Cf-Access-Jwt-Assertion header present",
      ok: false,
      detail:
        "No Access JWT on this request. This route isn't behind an Access application, or you reached it directly without authenticating.",
    });
    return { steps, identity: null };
  }
  steps.push({
    step: "Cf-Access-Jwt-Assertion header present",
    ok: true,
    detail: `Token received (${jwt.length} chars, 3 dot-separated segments).`,
  });

  // 2. Decodes into header + payload
  const decoded = decodeJwtForDisplay(jwt);
  if (!decoded) {
    steps.push({
      step: "Token decodes as a JWT",
      ok: false,
      detail: "Value is not a well-formed JWT (expected header.payload.signature).",
    });
    return { steps, identity: null };
  }
  steps.push({
    step: "Token decodes as a JWT",
    ok: true,
    detail: `alg=${decoded.header.alg ?? "?"}, kid=${
      typeof decoded.header.kid === "string" ? decoded.header.kid.slice(0, 12) + "…" : "?"
    }`,
  });

  // Config gate — can't verify without team domain + AUD.
  if (!isConfigured(teamDomain, expectedAud)) {
    steps.push({
      step: "TEAM_DOMAIN & POLICY_AUD configured",
      ok: false,
      detail:
        "Set TEAM_DOMAIN and POLICY_AUD in wrangler.jsonc to run signature/issuer/audience verification.",
    });
    return { steps, identity: null };
  }

  // 3-6. Signature (against JWKS) + issuer + audience + expiry, done by jose.
  try {
    const identity = await verifyAccessJwt(jwt, teamDomain, expectedAud);
    steps.push({
      step: "Signature valid against team JWKS",
      ok: true,
      detail: `Public key fetched from https://${teamDomain}/cdn-cgi/access/certs and signature verified.`,
    });
    steps.push({
      step: "Issuer matches your team",
      ok: true,
      detail: `iss = ${identity.iss}`,
    });
    steps.push({
      step: "Audience matches this app's AUD tag",
      ok: true,
      detail: `aud = ${Array.isArray(identity.aud) ? identity.aud.join(", ") : identity.aud}`,
    });
    const exp = decoded.payload.exp;
    steps.push({
      step: "Token not expired",
      ok: true,
      detail: exp ? `exp = ${new Date(exp * 1000).toISOString()}` : "exp claim present.",
    });
    steps.push({
      step: "Identity established",
      ok: true,
      detail: identity.email ? `email = ${identity.email}` : `sub = ${identity.sub}`,
    });
    return { steps, identity };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // jose error codes surface which specific check failed.
    steps.push({
      step: "Signature / issuer / audience / expiry verification",
      ok: false,
      detail: message,
    });
    return { steps, identity: null };
  }
}

import Link from "next/link";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { IdentificationIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import {
  ACCESS_JWT_HEADER,
  decodeJwtForDisplay,
  runValidationSteps,
} from "../lib/access";
import { ValidationSteps, DecodedToken } from "../components/AccessJwt";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cloudflare Access · Aperture Science" };

const STEPS = [
  {
    n: 1,
    title: "Access guards the route",
    body: "A self-hosted Access application sits in front of a hostname + path in Zero Trust. Unauthenticated visitors never reach the origin.",
  },
  {
    n: 2,
    title: "The visitor authenticates",
    body: "Cloudflare redirects to your identity provider (Okta, Google, GitHub, one-time PIN…). On success, Access mints a short-lived, signed JWT.",
  },
  {
    n: 3,
    title: "Access forwards the JWT",
    body: "Every allowed request arrives at the origin with a Cf-Access-Jwt-Assertion header (and a CF_Authorization cookie).",
  },
  {
    n: 4,
    title: "The origin validates it",
    body: "The Worker fetches the team's public keys (JWKS), verifies the signature, then checks issuer, audience (AUD tag) and expiry before trusting the claims.",
  },
];

export default async function AccessPage() {
  const h = await headers();
  const jwt = h.get(ACCESS_JWT_HEADER);

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

  const { steps } = await runValidationSteps(jwt, teamDomain, aud);
  const decoded = jwt ? decodeJwtForDisplay(jwt) : null;

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <IdentificationIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">Cloudflare Access</h1>
        </div>
        <p className="mt-4 text-gray-400">
          Cloudflare Access is Zero Trust identity in front of any app — no VPN. Once a
          visitor authenticates, Access hands the origin a signed{" "}
          <code className="text-orange-400">JWT</code> in the{" "}
          <code className="text-orange-400">Cf-Access-Jwt-Assertion</code> header. The origin&apos;s
          job is to <b>validate that JWT</b>. Here&apos;s how it works.
        </p>

        {/* Flow */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                  {s.n}
                </span>
                <h3 className="font-semibold text-gray-100">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Live validation of THIS request */}
        <h2 className="mt-12 text-2xl font-bold tracking-tight">Validating this request</h2>
        <p className="mt-2 text-gray-400">
          These are the exact checks the Worker runs against your current request, in order:
        </p>
        <ValidationSteps steps={steps} />

        {decoded && (
          <>
            <h2 className="mt-12 text-2xl font-bold tracking-tight">The decoded token</h2>
            <p className="mt-2 text-gray-400">
              A JWT is just base64url-encoded JSON. Anyone can <i>read</i> it — which is why the
              signature check above is what actually makes it trustworthy.
            </p>
            <DecodedToken decoded={decoded} />
          </>
        )}

        {/* CTA to the gated route */}
        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center gap-2">
            <LockClosedIcon className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">See it end-to-end</h3>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            This page is public, so unless it&apos;s behind Access you&apos;ll see &quot;no JWT&quot;
            above. The protected demo below is guarded by a real Access application — opening it
            forces an identity-provider login, then shows the cryptographically <b>verified</b>{" "}
            claims.
          </p>
          <Link
            href="/access/protected"
            className="mt-4 inline-block rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500"
          >
            Open the protected demo →
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Programmatic check available at{" "}
          <Link href="/api/access" className="text-orange-400 underline">
            /api/access
          </Link>{" "}
          (JSON). Values show &quot;no JWT&quot; in local dev / when the route isn&apos;t behind
          Access.
        </p>
      </div>
    </div>
  );
}

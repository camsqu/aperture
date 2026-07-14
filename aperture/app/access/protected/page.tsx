import Link from "next/link";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";
import {
  ACCESS_JWT_HEADER,
  decodeJwtForDisplay,
  runValidationSteps,
} from "../../lib/access";
import { ValidationSteps, ClaimsGrid, DecodedToken } from "../../components/AccessJwt";

export const dynamic = "force-dynamic";
export const metadata = { title: "Access · Protected · Aperture Science" };

export default async function ProtectedPage() {
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

  const { steps, identity } = await runValidationSteps(jwt, teamDomain, aud);
  const decoded = jwt ? decodeJwtForDisplay(jwt) : null;
  const verified = Boolean(identity);

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          {verified ? (
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
          ) : (
            <ShieldExclamationIcon className="h-8 w-8 text-orange-500" />
          )}
          <h1 className="text-4xl font-bold tracking-tight">Protected area</h1>
        </div>

        <span
          className={
            "mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide " +
            (verified ? "bg-green-600/20 text-green-300" : "bg-orange-600/20 text-orange-300")
          }
        >
          {verified ? "Identity verified by Cloudflare Access" : "Not verified"}
        </span>

        <p className="mt-4 text-gray-400">
          {verified ? (
            <>
              Cloudflare Access authenticated you and forwarded a signed JWT. The Worker verified its
              signature against the team JWKS and confirmed the issuer, audience and expiry — so the
              claims below are <b>trustworthy</b>.
            </>
          ) : (
            <>
              This route is meant to sit behind a Cloudflare Access application. If you&apos;re seeing
              this without a verified identity, either Access isn&apos;t protecting{" "}
              <code className="text-orange-400">/access/protected</code> yet, or{" "}
              <code className="text-orange-400">TEAM_DOMAIN</code> /{" "}
              <code className="text-orange-400">POLICY_AUD</code> aren&apos;t configured. See the
              steps below.
            </>
          )}
        </p>

        {verified && decoded && <ClaimsGrid decoded={decoded} />}

        <h2 className="mt-12 text-2xl font-bold tracking-tight">Validation steps</h2>
        <ValidationSteps steps={steps} />

        {decoded && (
          <>
            <h2 className="mt-12 text-2xl font-bold tracking-tight">Raw token</h2>
            <DecodedToken decoded={decoded} />
          </>
        )}

        <div className="mt-10 flex gap-3">
          <Link
            href="/access"
            className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500"
          >
            Back to Access overview
          </Link>
          <Link
            href="/"
            className="rounded-full border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

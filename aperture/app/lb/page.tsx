import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";
export const metadata = { title: "Load Balancing · Aperture Science" };

export default async function LoadBalancingPage() {
  let cf: Record<string, unknown> = {};
  try {
    const ctx = getCloudflareContext();
    cf = (ctx.cf as unknown as Record<string, unknown>) ?? {};
  } catch {
    /* plain build */
  }

  const colo = String(cf.colo ?? "—");
  const country = String(cf.country ?? "—");

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <ArrowsPointingOutIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">Load Balancing</h1>
        </div>
        <p className="mt-4 text-gray-400">
          Cloudflare Load Balancing distributes traffic across origin pools with health checks and
          steering policies (geo, dynamic latency, proximity). Your request entered the Cloudflare
          network here:
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500">Edge data center</p>
            <p className="mt-2 text-2xl font-mono text-orange-300">{colo}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500">Country</p>
            <p className="mt-2 text-2xl font-mono text-orange-300">{country}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-sm leading-relaxed text-gray-400">
          <p>
            In this demo, the Aperture origins are a Cloudflare Worker (this site) and the on-prem
            facility at <code className="text-orange-400">onprem.aperturescience.xyz</code>. A Load
            Balancer can steer between them and fail over automatically if a pool becomes unhealthy.
            Pools, monitors, and steering are configured in the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

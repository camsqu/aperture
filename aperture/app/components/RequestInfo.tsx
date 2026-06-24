import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers, cookies } from "next/headers";

// Surfaces live Cloudflare edge data available to the origin after a request
// passes (or is logged by) the WAF. Most of this comes from `request.cf` and
// Cloudflare-added headers; `cf_clearance` indicates a passed challenge.
export default async function RequestInfo() {
  const h = await headers();
  const c = await cookies();

  let cf: Record<string, unknown> = {};
  try {
    cf = (getCloudflareContext().cf as unknown as Record<string, unknown>) ?? {};
  } catch {
    /* not on Workers */
  }

  const bm = (cf.botManagement as Record<string, unknown>) ?? {};
  const ua = h.get("user-agent") ?? "—";

  type Stat = { label: string; value: string; wide?: boolean };
  const stats: Stat[] = [
    { label: "CF-Ray", value: h.get("cf-ray") ?? "—" },
    { label: "Edge data center", value: String(cf.colo ?? "—") },
    { label: "Country", value: String(cf.country ?? "—") },
    { label: "HTTP protocol", value: String(cf.httpProtocol ?? "—") },
    { label: "TLS", value: String(cf.tlsVersion ?? "—") },
    { label: "Bot score", value: bm.score !== undefined ? String(bm.score) : "n/a" },
    { label: "Verified bot", value: bm.verifiedBot !== undefined ? String(bm.verifiedBot) : "—" },
    {
      label: "Challenge clearance",
      value: c.get("cf_clearance") ? "cf_clearance present" : "none",
    },
    {
      label: "ASN / Network",
      value: cf.asn ? `AS${cf.asn} ${cf.asOrganization ?? ""}`.trim() : "—",
      wide: true,
    },
    { label: "User agent", value: ua, wide: true },
  ];

  return (
    <div className="mt-8 rounded-xl border border-gray-800 bg-black/40 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Live request data (from Cloudflare&apos;s edge)
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={
              "rounded-lg border border-gray-800 bg-gray-900/50 p-3 " +
              (s.wide ? "col-span-2 sm:col-span-3" : "")
            }
          >
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
              {s.label}
            </dt>
            <dd className="mt-1 break-words font-mono text-sm text-gray-100">{s.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}

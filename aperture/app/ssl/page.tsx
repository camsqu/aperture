import { getCloudflareContext } from "@opennextjs/cloudflare";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";
export const metadata = { title: "SSL/TLS · Aperture Science" };

export default async function SslPage() {
  let cf: Record<string, unknown> = {};
  try {
    const ctx = getCloudflareContext();
    cf = (ctx.cf as unknown as Record<string, unknown>) ?? {};
  } catch {
    /* not running on Workers (plain build) */
  }

  const rows: Array<[string, string]> = [
    ["TLS version", String(cf.tlsVersion ?? "—")],
    ["Cipher suite", String(cf.tlsCipher ?? "—")],
    ["HTTP protocol", String(cf.httpProtocol ?? "—")],
    ["Edge data center (colo)", String(cf.colo ?? "—")],
    ["Country", String(cf.country ?? "—")],
    ["Client TCP RTT (ms)", String(cf.clientTcpRtt ?? "—")],
  ];

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <LockClosedIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">SSL/TLS</h1>
        </div>
        <p className="mt-4 text-gray-400">
          Every request to Aperture Science is terminated at Cloudflare&apos;s edge with a managed
          certificate. Below are the live TLS properties of <b>your</b> current connection, read
          from <code className="text-orange-400">request.cf</code> on the Worker.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? "bg-gray-900/40" : "bg-gray-900/70"}>
                  <td className="px-5 py-3 font-medium text-gray-300">{k}</td>
                  <td className="px-5 py-3 font-mono text-orange-300">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Values show &quot;—&quot; in a non-Workers build. Deploy and reload over HTTPS to see live
          data.
        </p>
      </div>
    </div>
  );
}

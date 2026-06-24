import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Apply to Test · Aperture Science" };

type Subject = { id: number; name: string; reason: string | null; created_at: string };

export default async function ApplyPage() {
  let subjects: Subject[] = [];
  let dbReady = true;
  try {
    const { env } = getCloudflareContext();
    const { results } = await env.DB.prepare(
      "SELECT id, name, reason, created_at FROM test_subjects ORDER BY id DESC LIMIT 25",
    ).all<Subject>();
    subjects = results ?? [];
  } catch {
    dbReady = false;
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <ClipboardDocumentListIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">Apply to Test</h1>
        </div>
        <p className="mt-4 text-gray-400">
          Volunteer applications are stored in <b>Cloudflare D1</b> — a serverless SQL database at
          the edge. Submit below; your entry is written to D1 and appears in the registry instantly.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
          <ApplyForm />
        </div>

        <h2 className="mt-12 text-xl font-semibold">Volunteer Registry</h2>
        {!dbReady ? (
          <p className="mt-4 text-sm text-amber-400">
            D1 is unavailable in this environment. Deploy or run the Workers preview to enable it.
          </p>
        ) : subjects.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No volunteers yet. Be the first.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {subjects.map((s) => (
              <li key={s.id} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-gray-100">{s.name}</span>
                  <span className="text-xs text-gray-500">{s.created_at}</span>
                </div>
                {s.reason && <p className="mt-1 text-sm text-gray-400">{s.reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

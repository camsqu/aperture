"use client";

import { useState, FormEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SAMPLES = [
  "Who founded Aperture Science?",
  "What is the Weighted Companion Cube?",
  "Is the cake real?",
];

export default function AiSearchPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(q: string) {
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = (await res.json()) as { answer?: string; sources?: string[]; error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setAnswer(data.answer || "");
        setSources(data.sources || []);
      }
    } catch {
      setError("Network error talking to AI Search.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) run(q);
  }

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">AI Search</h1>
        </div>
        <p className="mt-4 text-gray-400">
          Retrieval-augmented generation over the Aperture lore archive (stored in R2, indexed by
          Cloudflare AI Search). Answers are grounded in the indexed documents.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Aperture Science…"
            className="flex-1 rounded-full border border-gray-700 bg-gray-900 px-5 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-full bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-40"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                run(s);
              }}
              className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-orange-500 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-amber-700/50 bg-amber-950/40 p-5 text-sm text-amber-200">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="whitespace-pre-wrap leading-relaxed text-gray-100">{answer}</p>
            {sources.length > 0 && (
              <div className="mt-4 border-t border-gray-800 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Sources
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sources.map((s) => (
                    <li
                      key={s}
                      className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

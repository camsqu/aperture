"use client";

import { useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

type Result = { n: number; status: number; ok: boolean };

export default function RateLimitPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);

  async function hammer() {
    setRunning(true);
    setResults([]);
    const out: Result[] = [];
    for (let n = 1; n <= 30; n++) {
      try {
        const res = await fetch("/api/ping", { cache: "no-store" });
        out.push({ n, status: res.status, ok: res.ok });
      } catch {
        out.push({ n, status: 0, ok: false });
      }
      setResults([...out]);
      await new Promise((r) => setTimeout(r, 120));
    }
    setRunning(false);
  }

  const blocked = results.filter((r) => r.status === 429).length;

  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <ClockIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">Rate Limiting</h1>
        </div>
        <p className="mt-4 text-gray-400">
          This sends 30 rapid requests to <code className="text-orange-400">/api/ping</code>. With a
          Cloudflare Rate Limiting rule attached to that path, requests over the threshold are
          answered with <b>HTTP 429</b> at the edge — protecting the origin.
        </p>

        <button
          onClick={hammer}
          disabled={running}
          className="mt-6 rounded-full bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
        >
          {running ? "Sending…" : "Send 30 requests"}
        </button>

        {results.length > 0 && (
          <p className="mt-4 text-sm text-gray-400">
            {results.length} sent · <span className="text-amber-400">{blocked} rate-limited (429)</span>
          </p>
        )}

        <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {results.map((r) => (
            <div
              key={r.n}
              title={`#${r.n}: ${r.status}`}
              className={
                "flex h-10 items-center justify-center rounded-lg text-xs font-mono " +
                (r.status === 429
                  ? "bg-amber-600/80 text-white"
                  : r.ok
                    ? "bg-green-700/70 text-white"
                    : "bg-gray-700 text-gray-300")
              }
            >
              {r.status || "ERR"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

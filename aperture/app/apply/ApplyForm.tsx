"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ApplyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, reason }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        setStatus("ok");
        setName("");
        setReason("");
        router.refresh();
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError("Network error.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
      />
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why do you want to be a test subject? (optional)"
        rows={3}
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading" || !name.trim()}
        className="rounded-full bg-orange-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Submit application"}
      </button>
      {status === "ok" && (
        <p className="text-sm text-green-400">Application recorded. Please report to Test Chamber 01.</p>
      )}
      {status === "error" && <p className="text-sm text-amber-400">{error}</p>}
    </form>
  );
}

"use client";

import Script from "next/script";
import { useState, useRef, useEffect, FormEvent } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void; theme?: string },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

export default function LoginForm({ siteKey }: { siteKey: string }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "loading">("idle");
  const [message, setMessage] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  function renderWidget() {
    if (window.turnstile && widgetRef.current && !widgetId.current) {
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
      });
    }
  }

  useEffect(() => {
    renderWidget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("Please complete the Turnstile challenge first.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json()) as { success: boolean; message?: string; error?: string };
      if (data.success) {
        setStatus("ok");
        setMessage(data.message || "Verified.");
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed.");
        window.turnstile?.reset(widgetId.current);
        setToken("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400">Test Subject ID</label>
          <input
            type="text"
            defaultValue="subject@aperture.xyz"
            className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400">Passphrase</label>
          <input
            type="password"
            defaultValue="thecakeisalie"
            className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div ref={widgetRef} className="min-h-[65px]" />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-orange-600 py-2.5 font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
        >
          {status === "loading" ? "Verifying…" : "Enter the Enrichment Center"}
        </button>

        {message && (
          <p
            className={
              "text-sm " + (status === "ok" ? "text-green-400" : "text-amber-400")
            }
          >
            {message}
          </p>
        )}
      </form>
    </>
  );
}

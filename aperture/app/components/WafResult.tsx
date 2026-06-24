import Link from "next/link";
import { ReactNode } from "react";

type Accent = "amber" | "yellow" | "green" | "purple" | "red";

// Static class strings (Tailwind can't see dynamically-built names).
const ACCENTS: Record<Accent, { badge: string; glow: string }> = {
  amber: {
    badge: "bg-amber-600/20 text-amber-300",
    glow: "ring-1 ring-amber-500/60 shadow-[0_0_45px_-8px_rgba(245,158,11,0.75)]",
  },
  yellow: {
    badge: "bg-yellow-600/20 text-yellow-300",
    glow: "ring-1 ring-yellow-500/60 shadow-[0_0_45px_-8px_rgba(234,179,8,0.75)]",
  },
  green: {
    badge: "bg-green-600/20 text-green-300",
    glow: "ring-1 ring-green-500/60 shadow-[0_0_45px_-8px_rgba(34,197,94,0.75)]",
  },
  purple: {
    badge: "bg-purple-600/20 text-purple-300",
    glow: "ring-1 ring-purple-500/60 shadow-[0_0_45px_-8px_rgba(168,85,247,0.8)]",
  },
  red: {
    badge: "bg-red-600/20 text-red-300",
    glow: "ring-1 ring-red-500/60 shadow-[0_0_45px_-8px_rgba(239,68,68,0.8)]",
  },
};

export default function WafResult({
  accent,
  badge,
  title,
  children,
}: {
  accent: Accent;
  badge: string;
  title: string;
  children: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 pt-28 pb-16 text-gray-100">
      <div
        className={`w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-900/60 p-8 ${a.glow}`}
      >
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${a.badge}`}
        >
          {badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-4 space-y-3 text-gray-400">{children}</div>
        <div className="mt-8 flex gap-3">
          <Link
            href="/waf"
            className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500"
          >
            Back to WAF
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

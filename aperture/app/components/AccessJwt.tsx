import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import type { DecodedJwt, ValidationStep } from "../lib/access";

// Renders the step-by-step "how validation works" breakdown.
export function ValidationSteps({ steps }: { steps: ValidationStep[] }) {
  return (
    <ol className="mt-4 space-y-2">
      {steps.map((s, i) => {
        const Icon = s.ok === true ? CheckCircleIcon : s.ok === false ? XCircleIcon : MinusCircleIcon;
        const color = s.ok === true ? "text-green-400" : s.ok === false ? "text-red-400" : "text-gray-500";
        return (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3"
          >
            <Icon className={`mt-0.5 h-5 w-5 flex-none ${color}`} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-100">{s.step}</p>
              <p className="mt-0.5 break-words font-mono text-xs text-gray-400">{s.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// Renders the decoded JWT header + payload (structure view — NOT trusted).
export function DecodedToken({ decoded }: { decoded: DecodedJwt }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Header
        </p>
        <pre className="overflow-x-auto font-mono text-xs text-orange-300">
          {JSON.stringify(decoded.header, null, 2)}
        </pre>
      </div>
      <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Payload (claims)
        </p>
        <pre className="overflow-x-auto font-mono text-xs text-orange-300">
          {JSON.stringify(decoded.payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Key identity claims in a friendly grid.
export function ClaimsGrid({ decoded }: { decoded: DecodedJwt }) {
  const p = decoded.payload as Record<string, unknown>;
  const fmt = (v: unknown) =>
    v === undefined || v === null
      ? "—"
      : Array.isArray(v)
        ? v.join(", ") || "—"
        : typeof v === "number"
          ? String(v)
          : String(v);
  const exp = typeof p.exp === "number" ? new Date(p.exp * 1000).toISOString() : "—";
  const iat = typeof p.iat === "number" ? new Date(p.iat * 1000).toISOString() : "—";

  const rows: Array<{ label: string; value: string; wide?: boolean }> = [
    { label: "Email", value: fmt(p.email) },
    { label: "Country", value: fmt(p.country) },
    { label: "Subject (sub)", value: fmt(p.sub), wide: true },
    { label: "Issuer (iss)", value: fmt(p.iss), wide: true },
    { label: "Audience (aud)", value: fmt(p.aud), wide: true },
    { label: "Groups", value: fmt(p.groups), wide: true },
    { label: "Issued at (iat)", value: iat },
    { label: "Expires (exp)", value: exp },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {rows.map((r) => (
        <div
          key={r.label}
          className={
            "rounded-lg border border-gray-800 bg-gray-900/50 p-3 " +
            (r.wide ? "col-span-2 sm:col-span-3" : "")
          }
        >
          <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
            {r.label}
          </dt>
          <dd className="mt-1 break-words font-mono text-sm text-gray-100">{r.value}</dd>
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Cloudflare AI · Aperture Science",
  description: "Workers AI, AI Gateway, AI Search, and AI Crawl Control at Aperture Science.",
};

const features = [
  {
    name: "Workers AI",
    icon: BoltIcon,
    desc: "GLaDOS runs on Llama 3.3 via Cloudflare Workers AI — serverless GPU inference on the global network. Try the chat widget in the bottom-right corner.",
  },
  {
    name: "AI Gateway",
    icon: SparklesIcon,
    desc: "Every model call is routed through AI Gateway for analytics, caching, rate limiting, and request logging — observability for AI traffic.",
  },
  {
    name: "AI Search (AutoRAG)",
    icon: MagnifyingGlassIcon,
    desc: "Retrieval-augmented generation over the Aperture lore archive stored in R2. Ask grounded questions and get cited answers.",
    href: "/ai/search",
    cta: "Try AI Search",
  },
  {
    name: "AI Crawl Control",
    icon: ShieldExclamationIcon,
    desc: "Manage how AI crawlers access the facility: a managed robots.txt, an llms.txt manifest, AI Audit analytics, and Pay Per Crawl.",
  },
];

export default function AiPage() {
  return (
    <div className="min-h-screen bg-gray-950 px-6 pt-28 pb-24 text-gray-100 sm:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Cloudflare AI</h1>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          The Enrichment Center is powered end-to-end by Cloudflare&apos;s AI platform. Below is
          how each piece fits together — all running on Workers.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.name}
              className="flex flex-col rounded-2xl border border-gray-800 bg-gray-900/60 p-6"
            >
              <f.icon className="h-8 w-8 text-orange-500" />
              <h2 className="mt-4 text-xl font-semibold">{f.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{f.desc}</p>
              {f.href && (
                <Link
                  href={f.href}
                  className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500"
                >
                  {f.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
          <ChatBubbleLeftRightIcon className="h-6 w-6 flex-none text-orange-500" />
          <p className="text-sm text-gray-400">
            Want to talk to the facility&apos;s AI? Open the chat widget in the bottom-right corner
            and ask GLaDOS anything.
          </p>
        </div>
      </div>
    </div>
  );
}

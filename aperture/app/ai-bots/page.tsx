import WafResult from "../components/WafResult";
import RequestInfo from "../components/RequestInfo";

export const dynamic = "force-dynamic";
export const metadata = { title: "AI Bot Controls · Aperture Science" };

export default function AiBotsPage() {
  return (
    <WafResult
      accent="purple"
      badge="AI Crawl Control"
      title="You reached the AI bot zone — as a human."
    >
      <p>
        This path is governed by Cloudflare&apos;s <b>AI bot controls</b>. Verified AI crawlers
        (GPTBot, ClaudeBot, CCBot and friends) can be <b>blocked</b> outright, or diverted into
        <b> AI Labyrinth</b> — a maze of convincing, AI-generated decoy pages that wastes a
        scraper&apos;s time and compute while revealing its behavior.
      </p>
      <p>
        With <b>Pay Per Crawl</b>, you can instead require crawlers to pay for access to your
        content. Real visitors like you pass straight through to this page.
      </p>
      <RequestInfo />
    </WafResult>
  );
}

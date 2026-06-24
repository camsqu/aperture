import WafResult from "../components/WafResult";
import RequestInfo from "../components/RequestInfo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Block · Aperture Science" };

export default function BlockPage() {
  return (
    <WafResult
      accent="red"
      badge="Block"
      title="If you can read this, the Block rule is off."
    >
      <p>
        This path is the trigger for a WAF <b>Block</b> action. When the rule is enabled, Cloudflare
        stops the request at the edge and serves a block response — this origin page is never
        reached.
      </p>
      <p>
        Seeing this page means the blocking rule is currently disabled or not matching. Enable a
        Block rule for <code className="text-orange-400">/block-page</code> to see the edge response
        instead.
      </p>
      <RequestInfo />
    </WafResult>
  );
}

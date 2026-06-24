import WafResult from "../../components/WafResult";
import RequestInfo from "../../components/RequestInfo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Managed Challenge Passed · Aperture Science" };

export default function ManagedChallengePage() {
  return (
    <WafResult
      accent="amber"
      badge="Managed Challenge"
      title="You passed the Managed Challenge."
    >
      <p>
        Cloudflare just ran a <b>Managed Challenge</b> — it automatically chose the right
        verification (a non-interactive check, or an interactive one if needed) to confirm you are
        human, without a traditional CAPTCHA.
      </p>
      <p>
        Because you cleared it, your request reached this origin page. Bots that fail are stopped at
        the edge. The Enrichment Center commends your humanity. Probably.
      </p>
      <RequestInfo />
    </WafResult>
  );
}

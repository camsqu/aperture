import WafResult from "../components/WafResult";
import RequestInfo from "../components/RequestInfo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Logged · Aperture Science" };

export default function LogPage() {
  return (
    <WafResult
      accent="green"
      badge="Log"
      title="This request was logged (no action taken)."
    >
      <p>
        The <b>Log</b> action lets a WAF rule record a match without blocking or challenging the
        request. It&apos;s ideal for testing a new rule&apos;s impact before enforcing it.
      </p>
      <p>
        Your visit was quietly noted in Security Events and you were allowed straight through. We
        are always watching. For science.
      </p>
      <RequestInfo />
    </WafResult>
  );
}

import WafResult from "../../components/WafResult";
import RequestInfo from "../../components/RequestInfo";

export const dynamic = "force-dynamic";
export const metadata = { title: "JS Challenge Passed · Aperture Science" };

export default function JsChallengePage() {
  return (
    <WafResult
      accent="yellow"
      badge="JS Challenge"
      title="You passed the JavaScript Challenge."
    >
      <p>
        Cloudflare issued a <b>JS Challenge</b> — a non-interactive test your browser solved
        automatically by running a small piece of JavaScript. No clicking required.
      </p>
      <p>
        Headless scrapers and simple bots that can&apos;t execute JavaScript never make it this far.
        You, however, are clearly a model test subject.
      </p>
      <RequestInfo />
    </WafResult>
  );
}

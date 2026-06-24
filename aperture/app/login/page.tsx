import { getCloudflareContext } from "@opennextjs/cloudflare";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Login · Aperture Science" };

// Turnstile "always passes" test site key — overridden by the TURNSTILE_SITE_KEY var.
const TEST_SITE_KEY = "1x00000000000000000000AA";

export default async function LoginPage() {
  let siteKey = TEST_SITE_KEY;
  try {
    const { env } = getCloudflareContext();
    siteKey = (env as unknown as { TURNSTILE_SITE_KEY?: string }).TURNSTILE_SITE_KEY || TEST_SITE_KEY;
  } catch {
    /* use test key */
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 pt-24 pb-16 text-gray-100">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <LockClosedIcon className="h-7 w-7 text-orange-500" />
          <h1 className="text-2xl font-bold">Secure Access</h1>
        </div>
        <p className="mb-6 text-sm text-gray-400">
          Protected by <b>Cloudflare Turnstile</b> — a privacy-preserving CAPTCHA alternative that
          confirms you are human without the puzzles.
        </p>
        <LoginForm siteKey={siteKey} />
      </div>
    </div>
  );
}

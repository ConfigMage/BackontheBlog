import { redirect } from "next/navigation";
import { isAuthenticated, setAuthenticated, validatePassword } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";

  const password = formData.get("password") as string;

  if (validatePassword(password)) {
    await setAuthenticated();
    redirect("/");
  }

  redirect("/login?error=1");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-terminal-surface border border-terminal-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-terminal-text mb-2">
              BackontheBlog
            </h1>
            <p className="text-terminal-muted text-sm">
              Enter password to continue
            </p>
          </div>

          <form action={loginAction} className="space-y-6">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoFocus
                placeholder="Password"
                className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md px-4 py-3 focus:border-terminal-accent focus:outline-none font-mono"
                aria-describedby={hasError ? "error-message" : undefined}
              />
            </div>

            {hasError && (
              <p
                id="error-message"
                className="text-red-400 text-sm text-center"
                role="alert"
              >
                Incorrect password. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-terminal-accent text-terminal-bg font-medium py-3 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-terminal-accent focus:ring-offset-2 focus:ring-offset-terminal-bg"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

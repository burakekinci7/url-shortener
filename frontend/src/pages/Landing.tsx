import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { UrlShortenerForm } from "../components/features/UrlShortenerForm";
import { useAuthStore } from "../lib/auth-store";

export function Landing() {
  const token = useAuthStore((s) => s.token);
  const isAuthed = !!token;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Shorten URLs.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Track Clicks.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-gray-600 sm:text-lg">
              A fast, minimal URL shortener with built-in analytics. Free to start —
              no account needed.
            </p>

            {isAuthed && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            <div className="mx-auto mt-10 max-w-2xl">
              <UrlShortenerForm />
            </div>
          </div>
        </section>

        <section className="border-y border-gray-100 bg-white py-16">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Fast"
              body="Sub-millisecond redirects backed by an indexed lookup. No middleware tax."
            />
            <Feature
              icon={<Shield className="h-5 w-5" />}
              title="Secure"
              body="JWT-protected dashboard, BCrypt-hashed passwords, and HTTPS everywhere."
            />
            <Feature
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analytics"
              body="See clicks by day, device, and country. Know what's working."
            />
          </div>
        </section>

        {!isAuthed && (
          <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Want to keep your links?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-gray-600">
                Sign up to track clicks, manage your URLs, and unlock analytics for every link.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
                >
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                >
                  Login
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:mx-0">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{body}</p>
    </div>
  );
}

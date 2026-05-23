import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { UrlShortenerForm } from "../components/features/UrlShortenerForm";
import { UrlList } from "../components/features/UrlList";
import { extractErrorMessage, listUrls } from "../lib/api";
import type { ShortUrl } from "../types";
import toast from "react-hot-toast";

export function Dashboard() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = useCallback(async () => {
    try {
      const data = await listUrls();
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setUrls(sorted);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not load your links"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUrls();
  }, [fetchUrls]);

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Create new link
            </h2>
            <div className="mt-4">
              <UrlShortenerForm compact onCreated={() => void fetchUrls()} />
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your links</h2>
              <span className="text-sm text-gray-500">
                {urls.length} {urls.length === 1 ? "link" : "links"}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            ) : (
              <UrlList urls={urls} onChanged={() => void fetchUrls()} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

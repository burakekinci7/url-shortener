import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import {
  CountryChart,
  DailyClicksChart,
  DeviceChart,
} from "../components/features/StatsCharts";
import { extractErrorMessage, getUrlStats } from "../lib/api";
import type { UrlStats } from "../types";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export function StatsDetail() {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const data = await getUrlStats(id);
        if (active) setStats(data);
      } catch (err) {
        toast.error(extractErrorMessage(err, "Could not load stats"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>

          {loading ? (
            <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
          ) : !stats ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
              We couldn't load stats for this link.
            </div>
          ) : (
            <>
              <header className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  /{stats.shortCode}
                </h1>
                <a
                  href={stats.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {stats.originalUrl}
                </a>
              </header>

              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Total clicks" value={stats.totalClicks.toLocaleString()} />
                <Metric label="Created" value={formatDate(stats.createdAt)} />
                <Metric label="Last clicked" value={formatDate(stats.lastClickedAt)} />
                <Metric
                  label="Status"
                  value={stats.totalClicks > 0 ? "Active" : "Awaiting clicks"}
                />
              </section>

              <section className="mt-8 space-y-6">
                <DailyClicksChart data={stats.clicksByDay ?? []} />
                <div className="grid gap-6 lg:grid-cols-2">
                  <DeviceChart data={stats.clicksByDevice ?? []} />
                  <CountryChart data={stats.clicksByCountry ?? []} />
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

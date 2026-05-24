import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AppWindow,
  ArrowLeft,
  Building2,
  Globe,
  Link2,
  Monitor,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { DailyClicksChart } from "../components/features/StatsCharts";
import { StatBreakdown } from "../components/features/StatBreakdown";
import { extractErrorMessage, getUrlStats } from "../lib/api";
import { formatCompact } from "../lib/format";
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

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
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
    setLoading(true);
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
            <StatsSkeleton />
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
                <Metric
                  label="Total clicks"
                  value={formatCompact(stats.totalClicks)}
                  hint={
                    stats.totalClicks >= 1000
                      ? stats.totalClicks.toLocaleString()
                      : undefined
                  }
                />
                <Metric label="Created" value={formatDate(stats.createdAt)} />
                <Metric label="Last clicked" value={formatDate(stats.lastClickedAt)} />
                <Metric
                  label="Status"
                  value={stats.totalClicks > 0 ? "Active" : "Awaiting clicks"}
                />
              </section>

              {/* Row 1 — full width line chart */}
              <section className="mt-8">
                <DailyClicksChart data={stats.clicksByDay ?? []} />
              </section>

              {/* Row 2 — Browser + OS */}
              <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatBreakdown
                  title="Browser"
                  icon={AppWindow}
                  chartType="pie"
                  data={stats.clicksByBrowser ?? []}
                />
                <StatBreakdown
                  title="Operating system"
                  icon={Monitor}
                  chartType="pie"
                  data={stats.clicksByOs ?? []}
                />
              </section>

              {/* Row 3 — Device + Referrer */}
              <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatBreakdown
                  title="Device type"
                  icon={Smartphone}
                  chartType="pie"
                  data={stats.clicksByDevice ?? []}
                />
                <StatBreakdown
                  title="Referrer sources"
                  icon={Link2}
                  chartType="bar"
                  data={stats.clicksByReferrer ?? []}
                />
              </section>

              {/* Row 4 — Country + City */}
              <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatBreakdown
                  title="Top countries"
                  icon={Globe}
                  chartType="bar"
                  data={stats.clicksByCountry ?? []}
                />
                <StatBreakdown
                  title="Top cities"
                  icon={Building2}
                  chartType="bar"
                  data={stats.clicksByCity ?? []}
                />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200/70 ${className}`} />;
}

function SkeletonCard({ height = "h-72" }: { height?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className={`mt-4 w-full ${height}`} />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading stats">
      <div className="mb-8">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="mt-2 h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="mt-3 h-7 w-24" />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <SkeletonCard height="h-64" />
      </div>

      {[0, 1, 2].map((row) => (
        <div key={row} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <SkeletonCard height="h-56" />
          <SkeletonCard height="h-56" />
        </div>
      ))}
    </div>
  );
}

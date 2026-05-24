import { Activity } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ClicksByDay } from "../../types";
import { formatCompact } from "../../lib/format";

export function DailyClicksChart({ data }: { data: ClicksByDay[] }) {
  const safe = Array.isArray(data) ? data : [];
  const isEmpty = safe.length === 0;

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
        <Activity className="h-4 w-4 text-indigo-600" />
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-700">
          Daily clicks
        </h3>
      </header>
      <div className="p-5">
        {isEmpty ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-200 bg-gray-50/60">
            <Activity className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500">No data yet</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safe} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v);
                    return isNaN(d.getTime())
                      ? v
                      : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(v: number) => formatCompact(v)}
                />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString(), "Clicks"]}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

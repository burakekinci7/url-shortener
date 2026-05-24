import type { LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabeledCount } from "../../types";
import { formatCompact } from "../../lib/format";

export const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
];

interface Props {
  title: string;
  icon: LucideIcon;
  data: LabeledCount[];
  chartType: "pie" | "bar";
  emptyMessage?: string;
  /** Limit bars to top N (sorted by count desc). Default: 10. */
  topN?: number;
}

function truncateLabel(s: string, max = 24): string {
  if (!s) return "Unknown";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export function StatBreakdown({
  title,
  icon: Icon,
  data,
  chartType,
  emptyMessage = "No data yet",
  topN = 10,
}: Props) {
  const safe = Array.isArray(data) ? data : [];
  const isEmpty = safe.length === 0 || safe.every((d) => !d.count);

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
        <Icon className="h-4 w-4 text-indigo-600" />
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-700">
          {title}
        </h3>
      </header>

      <div className="p-5">
        {isEmpty ? (
          <EmptyChart icon={Icon} message={emptyMessage} />
        ) : chartType === "pie" ? (
          <PieView data={safe} />
        ) : (
          <BarView data={safe} topN={topN} />
        )}
      </div>
    </section>
  );
}

function EmptyChart({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-200 bg-gray-50/60">
      <Icon className="h-6 w-6 text-gray-400" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function PieView({ data }: { data: LabeledCount[] }) {
  // Recharts uses `name` for legend/tooltip labels.
  const chartData = data.map((d) => ({
    name: d.label || "Unknown",
    value: d.count,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            label={({ percent }) =>
              percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ""
            }
            labelLine={false}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [Number(value).toLocaleString(), "Clicks"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function BarView({ data, topN }: { data: LabeledCount[]; topN: number }) {
  const sorted = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
    .map((d) => ({
      label: truncateLabel(d.label),
      fullLabel: d.label || "Unknown",
      count: d.count,
    }));

  // Reserve horizontal space for labels so longer ones don't clip.
  const longest = sorted.reduce((m, d) => Math.max(m, d.label.length), 0);
  const yAxisWidth = Math.min(160, Math.max(70, longest * 7));

  return (
    <div style={{ height: Math.max(240, sorted.length * 32 + 40) }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 5, right: 24, left: 0, bottom: 5 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={(v: number) => formatCompact(v)}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={yAxisWidth}
            tick={{ fontSize: 12, fill: "#374151" }}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "rgba(99, 102, 241, 0.06)" }}
            formatter={(value) => [Number(value).toLocaleString(), "Clicks"]}
            labelFormatter={(_, payload) => {
              const item = payload?.[0]?.payload as
                | { fullLabel?: string }
                | undefined;
              return item?.fullLabel ?? "";
            }}
          />
          <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

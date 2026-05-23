import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ClicksByCountry,
  ClicksByDay,
  ClicksByDevice,
} from "../../types";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50">
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

export function DailyClicksChart({ data }: { data: ClicksByDay[] }) {
  return (
    <ChartCard title="Daily clicks">
      {data.length === 0 ? (
        <EmptyState label="No data yet" />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip />
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
    </ChartCard>
  );
}

export function DeviceChart({ data }: { data: ClicksByDevice[] }) {
  return (
    <ChartCard title="Device breakdown">
      {data.length === 0 ? (
        <EmptyState label="No data yet" />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={85}
                label
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

export function CountryChart({ data }: { data: ClicksByCountry[] }) {
  return (
    <ChartCard title="Top countries">
      {data.length === 0 ? (
        <EmptyState label="No data yet" />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
              <XAxis dataKey="country" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

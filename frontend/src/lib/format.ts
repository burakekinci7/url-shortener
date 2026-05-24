export function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs < 1000) return n.toString();
  if (abs < 1_000_000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
  if (abs < 1_000_000_000) return (n / 1_000_000).toFixed(1) + "M";
  return (n / 1_000_000_000).toFixed(1) + "B";
}

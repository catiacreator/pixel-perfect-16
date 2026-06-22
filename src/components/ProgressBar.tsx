export default function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <div className="h-2 bg-success rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-muted whitespace-nowrap">
        {done}/{total} · {pct}%
      </span>
    </div>
  );
}

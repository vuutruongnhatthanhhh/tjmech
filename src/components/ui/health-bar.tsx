import { healthColor } from "@/lib/status";

export default function HealthBar({
  score,
  showLabel = true,
}: {
  score: number;
  showLabel?: boolean;
}) {
  const color = healthColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full max-w-28 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums text-slate-400">
          {score}%
        </span>
      )}
    </div>
  );
}

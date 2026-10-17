import { STATUS_STYLES } from "@/lib/status";
import type { MachineStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function StatusBadge({
  status,
  size = "md",
  pulse = false,
}: {
  status: MachineStatus;
  size?: "sm" | "md";
  pulse?: boolean;
}) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        s.bg,
        s.text,
        s.ring,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          s.dot,
          pulse && status === "running" && "status-dot-live"
        )}
      />
      {s.label}
    </span>
  );
}

import type { MachineStatus } from "./types";

export const STATUS_STYLES: Record<
  MachineStatus,
  { label: string; bg: string; text: string; dot: string; ring: string }
> = {
  running: {
    label: "Đang chạy",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/25",
  },
  idle: {
    label: "Chờ việc",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    dot: "bg-slate-400",
    ring: "ring-slate-500/25",
  },
  maintenance: {
    label: "Bảo trì",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
    ring: "ring-amber-500/25",
  },
  error: {
    label: "Lỗi / Hỏng",
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
    ring: "ring-red-500/25",
  },
  offline: {
    label: "Ngừng hoạt động",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    dot: "bg-zinc-500",
    ring: "ring-zinc-500/25",
  },
};

export function healthColor(score: number): string {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
}

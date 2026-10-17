"use client";

import Avatar from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import HealthBar from "@/components/ui/health-bar";
import StatusBadge from "@/components/ui/status-badge";
import { MACHINES, getEmployeeById } from "@/lib/data";
import { MACHINE_TYPE_ICON } from "@/lib/machine-icon";
import type { MachineStatus, MachineType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const TYPES = Array.from(new Set(MACHINES.map((m) => m.type))) as MachineType[];
const STATUSES: { value: MachineStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "running", label: "Đang chạy" },
  { value: "idle", label: "Chờ việc" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "error", label: "Lỗi / Hỏng" },
  { value: "offline", label: "Ngừng hoạt động" },
];

export default function MachinesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<MachineStatus | "all">("all");
  const [type, setType] = useState<MachineType | "all">("all");

  const filtered = useMemo(() => {
    return MACHINES.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (type !== "all" && m.type !== type) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const operator = getEmployeeById(m.operatorId)?.name ?? "";
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.code.toLowerCase().includes(q) &&
          !operator.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [query, status, type]);

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Tìm theo tên, mã máy, người vận hành..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as MachineType | "all")}
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Tất cả loại máy</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                status === s.value
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-slate-700 bg-slate-800/40 text-slate-400 hover:bg-slate-800"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      <p className="text-xs text-slate-500">
        Hiển thị {filtered.length} / {MACHINES.length} máy
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((m) => {
          const Icon = MACHINE_TYPE_ICON[m.type];
          const operator = getEmployeeById(m.operatorId);
          return (
            <Link key={m.id} href={`/may/${m.id}`}>
              <Card className="h-full p-4 transition-shadow hover:shadow-md hover:shadow-black/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-100">
                        {m.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {m.code} · Khu {m.zone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <StatusBadge status={m.status} size="sm" pulse />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Sức khỏe</span>
                  <HealthBar score={m.healthScore} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                  {operator ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={operator.name} color={operator.avatarColor} size="sm" />
                      <span className="text-xs text-slate-300">{operator.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Chưa phân công</span>
                  )}
                  <span className="text-[11px] font-medium text-slate-500">
                    {m.type}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-slate-500">
          Không tìm thấy máy phù hợp với bộ lọc.
        </div>
      )}
    </div>
  );
}

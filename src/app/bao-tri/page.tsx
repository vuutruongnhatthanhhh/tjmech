import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { MACHINES, getEmployeeById } from "@/lib/data";
import { MACHINE_TYPE_ICON } from "@/lib/machine-icon";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertTriangle, CalendarClock, History } from "lucide-react";
import Link from "next/link";

function daysUntil(dateStr: string): number {
  const today = new Date("2026-10-17");
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function MaintenancePage() {
  const inProgress = MACHINES.flatMap((m) =>
    m.maintenanceHistory
      .filter((h) => h.status === "Đang xử lý")
      .map((h) => ({ ...h, machine: m }))
  );

  const upcoming = [...MACHINES].sort(
    (a, b) => daysUntil(a.nextMaintenanceDate) - daysUntil(b.nextMaintenanceDate)
  );

  const allHistory = MACHINES.flatMap((m) =>
    m.maintenanceHistory.map((h) => ({ ...h, machine: m }))
  )
    .filter((h) => h.status === "Hoàn thành")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" /> Đang xử lý ({inProgress.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {inProgress.length === 0 ? (
            <p className="text-sm text-slate-500">
              Không có sự cố hoặc công việc bảo trì đang xử lý.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {inProgress.map((h) => {
                const Icon = MACHINE_TYPE_ICON[h.machine.type];
                return (
                  <Link
                    key={h.id}
                    href={`/may/${h.machine.id}`}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-slate-800/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200">
                        {h.machine.name}{" "}
                        <span className="text-xs text-slate-500">
                          ({h.machine.code})
                        </span>
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {h.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                      {h.type}
                    </span>
                    <StatusBadge status={h.machine.status} size="sm" />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-indigo-400" /> Lịch bảo trì theo máy
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="pb-2 font-medium">Máy</th>
                  <th className="pb-2 font-medium">Khu</th>
                  <th className="pb-2 font-medium">Bảo trì gần nhất</th>
                  <th className="pb-2 font-medium">Bảo trì kế tiếp</th>
                  <th className="pb-2 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {upcoming.map((m) => {
                  const days = daysUntil(m.nextMaintenanceDate);
                  const overdue = days < 0;
                  const soon = days >= 0 && days <= 7;
                  return (
                    <tr key={m.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5">
                        <Link
                          href={`/may/${m.id}`}
                          className="font-medium text-slate-200 hover:text-indigo-400"
                        >
                          {m.name}
                        </Link>
                        <span className="ml-1.5 text-xs text-slate-500">
                          {m.code}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">{m.zone}</td>
                      <td className="py-2.5 text-slate-400">
                        {formatDate(m.lastMaintenanceDate)}
                      </td>
                      <td className="py-2.5 text-slate-400">
                        {formatDate(m.nextMaintenanceDate)}
                      </td>
                      <td className="py-2.5">
                        {overdue ? (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                            Quá hạn {Math.abs(days)} ngày
                          </span>
                        ) : soon ? (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                            Còn {days} ngày
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                            Còn {days} ngày
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" /> Lịch sử bảo trì đã hoàn thành
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {allHistory.slice(0, 10).map((h) => (
              <div key={h.id} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300">
                    <Link
                      href={`/may/${h.machine.id}`}
                      className="font-semibold text-slate-100 hover:text-indigo-400"
                    >
                      {h.machine.name}
                    </Link>{" "}
                    — {h.description}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatDate(h.date)} · {h.type} · KTV{" "}
                    {getEmployeeById(h.technicianId)?.name} ·{" "}
                    {formatCurrency(h.cost)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

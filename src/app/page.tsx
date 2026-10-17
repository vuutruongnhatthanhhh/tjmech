import Avatar from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HealthBar from "@/components/ui/health-bar";
import StatusBadge from "@/components/ui/status-badge";
import { EMPLOYEES, MACHINES, ZONES, getEmployeeById } from "@/lib/data";
import { MACHINE_TYPE_ICON } from "@/lib/machine-icon";
import { formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  Factory,
  Gauge,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const total = MACHINES.length;
  const running = MACHINES.filter((m) => m.status === "running").length;
  const maintenance = MACHINES.filter((m) => m.status === "maintenance").length;
  const error = MACHINES.filter((m) => m.status === "error").length;
  const avgHealth = Math.round(
    MACHINES.reduce((sum, m) => sum + m.healthScore, 0) / total
  );

  const attention = [...MACHINES]
    .filter((m) => m.status === "error" || m.status === "maintenance" || m.healthScore < 65)
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 5);

  const recentMaintenance = MACHINES.flatMap((m) =>
    m.maintenanceHistory.map((h) => ({ ...h, machine: m }))
  )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);

  const zoneStats = ZONES.map((zone) => {
    const zoneMachines = MACHINES.filter((m) => m.zone === zone.id);
    return {
      zone,
      count: zoneMachines.length,
      running: zoneMachines.filter((m) => m.status === "running").length,
    };
  });

  const onShift = EMPLOYEES.filter((e) => e.shift === "Ca sáng").slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Factory}
          label="Tổng số máy"
          value={String(total)}
          hint={`${ZONES.length} khu vực sản xuất`}
          accent="indigo"
        />
        <StatCard
          icon={TrendingUp}
          label="Đang chạy"
          value={String(running)}
          hint={`${Math.round((running / total) * 100)}% công suất hoạt động`}
          accent="emerald"
        />
        <StatCard
          icon={Wrench}
          label="Đang bảo trì"
          value={String(maintenance)}
          hint="Có kỹ thuật viên đang xử lý"
          accent="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Lỗi / sự cố"
          value={String(error)}
          hint="Cần xử lý ưu tiên"
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tình trạng theo khu vực</CardTitle>
              <Link
                href="/so-do"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                Xem sơ đồ nhà máy →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {zoneStats.map(({ zone, count, running }) => (
                  <div
                    key={zone.id}
                    className="rounded-xl border border-slate-800 bg-slate-800/40 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <p className="text-xs font-semibold text-slate-300">
                        Khu {zone.id}
                      </p>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-100">
                      {count}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {running} đang chạy
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Máy cần chú ý</CardTitle>
              <Link
                href="/may"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                Xem tất cả →
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="divide-y divide-slate-800">
                {attention.map((m) => {
                  const Icon = MACHINE_TYPE_ICON[m.type];
                  return (
                    <Link
                      key={m.id}
                      href={`/may/${m.id}`}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-slate-800/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">
                          {m.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {m.code} · Khu {m.zone}
                        </p>
                      </div>
                      <HealthBar score={m.healthScore} />
                      <StatusBadge status={m.status} size="sm" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động bảo trì gần đây</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {recentMaintenance.map((h) => (
                  <div key={h.id} className="flex gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                      <Wrench className="h-4 w-4" />
                    </div>
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
                        {getEmployeeById(h.technicianId)?.name}
                      </p>
                    </div>
                    <span
                      className={
                        h.status === "Hoàn thành"
                          ? "shrink-0 text-xs font-medium text-emerald-400"
                          : "shrink-0 text-xs font-medium text-amber-400"
                      }
                    >
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số sức khỏe trung bình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Gauge className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-100">
                    {avgHealth}%
                  </p>
                  <p className="text-xs text-slate-500">
                    Trung bình toàn bộ {total} máy
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {MACHINES.slice()
                  .sort((a, b) => b.healthScore - a.healthScore)
                  .slice(0, 4)
                  .map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-3">
                      <p className="truncate text-xs text-slate-400">{m.name}</p>
                      <HealthBar score={m.healthScore} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nhân sự ca sáng</CardTitle>
              <Link
                href="/nhan-vien"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                Tất cả →
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {onShift.map((e) => (
                  <Link
                    key={e.id}
                    href={`/nhan-vien/${e.id}`}
                    className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-slate-800/40"
                  >
                    <Avatar name={e.name} color={e.avatarColor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {e.name}
                      </p>
                      <p className="text-xs text-slate-500">{e.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  accent: "indigo" | "emerald" | "amber" | "red";
}) {
  const accentMap = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentMap[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-100">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </Card>
  );
}

import Avatar from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HealthBar from "@/components/ui/health-bar";
import StatusBadge from "@/components/ui/status-badge";
import { MACHINES, getEmployeeById } from "@/lib/data";
import { MACHINE_TYPE_ICON } from "@/lib/machine-icon";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Gauge,
  MapPin,
  Package,
  Phone,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return MACHINES.map((m) => ({ id: m.id }));
}

export default async function MachineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machine = MACHINES.find((m) => m.id === id);
  if (!machine) notFound();

  const Icon = MACHINE_TYPE_ICON[machine.type];
  const operator = getEmployeeById(machine.operatorId);

  return (
    <div className="space-y-6">
      <Link
        href="/may"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách máy
      </Link>

      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{machine.name}</h2>
              <p className="text-sm text-slate-500">
                {machine.code} · {machine.manufacturer} {machine.model}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={machine.status} pulse />
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
                  <MapPin className="h-3 w-3" /> Khu {machine.zone}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
                  {machine.type}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3 sm:min-w-56">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-indigo-400 shadow-sm">
              <Gauge className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-slate-500">Chỉ số sức khỏe</p>
              <HealthBar score={machine.healthScore} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <InfoRow label="Số serial" value={machine.serialNumber} />
              <InfoRow label="Ngày mua" value={formatDate(machine.purchaseDate)} />
              <InfoRow label="Công suất" value={machine.power} />
              <InfoRow label="Khả năng gia công" value={machine.capacity} />
              <InfoRow label="Kích thước" value={machine.dimensions} />
              <InfoRow
                label="Số giờ hoạt động"
                value={`${formatNumber(machine.runningHours)} giờ`}
              />
              <InfoRow
                label="Bảo trì gần nhất"
                value={formatDate(machine.lastMaintenanceDate)}
              />
              <InfoRow
                label="Bảo trì kế tiếp"
                value={formatDate(machine.nextMaintenanceDate)}
              />
            </CardContent>
            {machine.notes && (
              <div className="mx-5 mb-5 rounded-lg bg-indigo-500/10 p-3 text-sm text-indigo-300">
                {machine.notes}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử bảo trì</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-5">
                {machine.maintenanceHistory.map((h, idx) => (
                  <div key={h.id} className="relative flex gap-4 pl-1">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                        <Wrench className="h-4 w-4" />
                      </div>
                      {idx !== machine.maintenanceHistory.length - 1 && (
                        <div className="my-1 w-px flex-1 bg-slate-800" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-200">
                          {h.type}
                        </p>
                        <span
                          className={
                            h.status === "Hoàn thành"
                              ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"
                              : "rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400"
                          }
                        >
                          {h.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {h.description}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(h.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {h.durationHours} giờ
                        </span>
                        <span>KTV {getEmployeeById(h.technicianId)?.name}</span>
                        {h.cost > 0 && <span>{formatCurrency(h.cost)}</span>}
                      </div>
                      {h.partsUsed.length > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          Linh kiện dùng: {h.partsUsed.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linh kiện liên quan</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500">
                      <th className="pb-2 font-medium">Linh kiện</th>
                      <th className="pb-2 font-medium">Mã</th>
                      <th className="pb-2 font-medium">Tồn kho</th>
                      <th className="pb-2 font-medium">Tình trạng</th>
                      <th className="pb-2 font-medium">Thay gần nhất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {machine.parts.map((p) => (
                      <tr key={p.id}>
                        <td className="flex items-center gap-2 py-2.5 font-medium text-slate-300">
                          <Package className="h-3.5 w-3.5 text-slate-600" />
                          {p.name}
                        </td>
                        <td className="py-2.5 text-slate-500">{p.code}</td>
                        <td className="py-2.5 text-slate-500">
                          {p.stock} {p.unit}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={
                              p.condition === "Tốt"
                                ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400"
                                : p.condition === "Cần thay"
                                  ? "rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400"
                                  : "rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400"
                            }
                          >
                            {p.condition}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500">
                          {formatDate(p.lastReplaced)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Người đứng máy</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {operator ? (
                <Link
                  href={`/nhan-vien/${operator.id}`}
                  className="block rounded-xl border border-slate-800 p-3 hover:border-indigo-500/40 hover:bg-indigo-500/5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={operator.name} color={operator.avatarColor} size="lg" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {operator.name}
                      </p>
                      <p className="text-xs text-slate-500">{operator.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> {operator.phone}
                    </p>
                    <p>{operator.shift}</p>
                    <p>{operator.experienceYears} năm kinh nghiệm</p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-slate-500">
                  Chưa phân công người vận hành cho máy này.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vị trí trong nhà máy</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-300">
                Khu <span className="font-semibold">{machine.zone}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Toạ độ sơ đồ: x={machine.position.x}%, y={machine.position.y}%
              </p>
              <Link
                href="/so-do"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                <MapPin className="h-3.5 w-3.5" /> Xem trên sơ đồ nhà máy
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-300">{value}</p>
    </div>
  );
}

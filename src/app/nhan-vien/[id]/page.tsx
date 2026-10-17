import Avatar from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HealthBar from "@/components/ui/health-bar";
import StatusBadge from "@/components/ui/status-badge";
import { EMPLOYEES, getMachinesByOperator } from "@/lib/data";
import { MACHINE_TYPE_ICON } from "@/lib/machine-icon";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Award, Calendar, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return EMPLOYEES.map((e) => ({ id: e.id }));
}

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = EMPLOYEES.find((e) => e.id === id);
  if (!employee) notFound();

  const machines = getMachinesByOperator(employee.id);

  return (
    <div className="space-y-6">
      <Link
        href="/nhan-vien"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách nhân viên
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={employee.name} color={employee.avatarColor} size="lg" className="h-20 w-20 text-2xl" />
            <h2 className="mt-3 text-lg font-bold text-slate-100">
              {employee.name}
            </h2>
            <p className="text-sm text-slate-500">{employee.role}</p>
            <span className="mt-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
              {employee.shift}
            </span>
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="h-4 w-4 text-slate-500" /> {employee.phone}
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="h-4 w-4 text-slate-500" /> Vào làm{" "}
              {formatDate(employee.joinedDate)} · {employee.experienceYears} năm KN
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Award className="h-3.5 w-3.5" /> Chứng chỉ / kỹ năng
            </p>
            <div className="flex flex-wrap gap-1.5">
              {employee.certifications.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-400"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Máy phụ trách ({machines.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {machines.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nhân viên này hiện chưa được phân công đứng máy.
                </p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {machines.map((m) => {
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import Avatar from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { EMPLOYEES, getMachinesByOperator } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Phone } from "lucide-react";
import Link from "next/link";

export default function EmployeesPage() {
  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        {EMPLOYEES.length} nhân sự · Vận hành & kỹ thuật
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EMPLOYEES.map((e) => {
          const machines = getMachinesByOperator(e.id);
          return (
            <Link key={e.id} href={`/nhan-vien/${e.id}`}>
              <Card className="h-full p-4 transition-shadow hover:shadow-md hover:shadow-black/30">
                <div className="flex items-center gap-3">
                  <Avatar name={e.name} color={e.avatarColor} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">
                      {e.name}
                    </p>
                    <p className="text-xs text-slate-500">{e.role}</p>
                    <span className="mt-1 inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                      {e.shift}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3" /> {e.phone}
                  </p>
                  <p>{e.experienceYears} năm kinh nghiệm · Vào làm {formatDate(e.joinedDate)}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {machines.length > 0 ? (
                    machines.map((m) => (
                      <span
                        key={m.id}
                        className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-400"
                      >
                        {m.code}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Chưa phụ trách máy nào
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

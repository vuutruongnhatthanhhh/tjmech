"use client";

import { cn } from "@/lib/utils";
import {
  Factory,
  LayoutDashboard,
  Map,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/so-do", label: "Sơ đồ nhà máy", icon: Map },
  { href: "/may", label: "Danh sách máy", icon: Factory },
  { href: "/bao-tri", label: "Bảo trì", icon: Wrench },
  { href: "/nhan-vien", label: "Nhân viên", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-500/30">
          <Factory className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-slate-100">
            TJMech
          </p>
          <p className="text-[11px] font-medium leading-tight text-slate-500">
            Quản lý sản xuất
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  active ? "text-indigo-400" : "text-slate-500"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-slate-800/50 p-4">
        <p className="text-xs font-semibold text-slate-300">
          Nhà máy Tân Á — Khu công nghiệp Tân Bình
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          18 máy · 4 khu vực · 12 nhân sự vận hành & kỹ thuật
        </p>
      </div>
    </aside>
  );
}

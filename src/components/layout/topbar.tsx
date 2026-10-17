"use client";

import Avatar from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Tổng quan",
    subtitle: "Tình trạng sản xuất theo thời gian thực",
  },
  "/so-do": {
    title: "Sơ đồ nhà máy",
    subtitle: "Kéo thả để sắp xếp vị trí máy trong xưởng",
  },
  "/may": {
    title: "Danh sách máy",
    subtitle: "Toàn bộ thiết bị đang quản lý",
  },
  "/bao-tri": {
    title: "Bảo trì thiết bị",
    subtitle: "Lịch bảo trì định kỳ và sự cố đang xử lý",
  },
  "/nhan-vien": {
    title: "Nhân viên",
    subtitle: "Danh sách vận hành & kỹ thuật viên",
  },
};

function resolveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/may/"))
    return { title: "Chi tiết máy", subtitle: "Thông tin vận hành & bảo trì" };
  if (pathname.startsWith("/nhan-vien/"))
    return { title: "Hồ sơ nhân viên", subtitle: "Thông tin & máy phụ trách" };
  return { title: "TJMech", subtitle: "" };
}

export default function Topbar() {
  const pathname = usePathname();
  const { title, subtitle } = resolveTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm máy, nhân viên..."
            className="w-56 rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900" />
        </button>

        <div className="h-8 w-px bg-slate-800" />

        <div className="flex items-center gap-2.5">
          <Avatar name="Nguyễn Văn Long" color="#6366f1" size="sm" />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-slate-200">
              Nguyễn Văn Long
            </p>
            <p className="text-[11px] text-slate-500">Tổ trưởng sản xuất</p>
          </div>
        </div>
      </div>
    </header>
  );
}

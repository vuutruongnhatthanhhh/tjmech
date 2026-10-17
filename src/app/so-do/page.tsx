"use client";

import Avatar from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HealthBar from "@/components/ui/health-bar";
import StatusBadge from "@/components/ui/status-badge";
import { MACHINES, ZONES, getEmployeeById } from "@/lib/data";
import { MACHINE_TYPE_ICON } from "@/lib/machine-icon";
import { STATUS_STYLES } from "@/lib/status";
import type { Machine } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Move, Phone, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "tjmech-floor-positions";

type Position = { x: number; y: number };
type PositionMap = Record<string, Position>;

function defaultPositions(): PositionMap {
  const map: PositionMap = {};
  for (const m of MACHINES) map[m.id] = { ...m.position };
  return map;
}

const ZONE_BOX: Record<string, { left: string; top: string; width: string; height: string }> = {
  A: { left: "2%", top: "4%", width: "47%", height: "46%" },
  B: { left: "51%", top: "4%", width: "47%", height: "46%" },
  C: { left: "2%", top: "52%", width: "47%", height: "46%" },
  D: { left: "51%", top: "52%", width: "47%", height: "46%" },
};

export default function FactoryMapPage() {
  const [positions, setPositions] = useState<PositionMap>(defaultPositions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      // One-time hydration of persisted layout from localStorage; the
      // default (server-rendered) positions must stay as the first paint
      // to avoid a hydration mismatch, so this can only happen post-mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPositions({ ...defaultPositions(), ...saved });
    } catch {
      // ignore invalid cache
    }
  }, []);

  useEffect(() => {
    if (!draggingId) return;
    const activeId = draggingId;

    function handleMove(e: PointerEvent) {
      const floor = floorRef.current;
      if (!floor) return;
      const rect = floor.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      movedRef.current = true;
      setPositions((prev) => ({
        ...prev,
        [activeId]: {
          x: Math.min(97, Math.max(2, x)),
          y: Math.min(95, Math.max(3, y)),
        },
      }));
    }

    function handleUp() {
      setDraggingId((id) => {
        if (id) {
          setPositions((prev) => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
            return prev;
          });
        }
        return null;
      });
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [draggingId]);

  const selected = MACHINES.find((m) => m.id === selectedId) ?? null;

  function resetLayout() {
    const fresh = defaultPositions();
    setPositions(fresh);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Move className="h-3.5 w-3.5" />
            Kéo biểu tượng máy để sắp xếp lại vị trí trong xưởng
          </div>
          <button
            onClick={resetLayout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Khôi phục bố cục mặc định
          </button>
        </div>

        <div
          ref={floorRef}
          className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60"
        >
          {ZONES.map((zone) => (
            <div
              key={zone.id}
              className="absolute rounded-lg border-2 border-dashed"
              style={{
                ...ZONE_BOX[zone.id],
                borderColor: zone.color + "4d",
                backgroundColor: zone.color + "0f",
              }}
            >
              <span
                className="absolute left-2 top-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={{ color: zone.color, backgroundColor: zone.color + "22" }}
              >
                {zone.name}
              </span>
            </div>
          ))}

          {MACHINES.map((m) => {
            const pos = positions[m.id] ?? m.position;
            const Icon = MACHINE_TYPE_ICON[m.type];
            const s = STATUS_STYLES[m.status];
            const isSelected = selectedId === m.id;
            return (
              <button
                key={m.id}
                onPointerDown={(e) => {
                  e.preventDefault();
                  movedRef.current = false;
                  setDraggingId(m.id);
                }}
                onClick={() => {
                  if (!movedRef.current) setSelectedId(m.id);
                }}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className={cn(
                  "group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1",
                  draggingId === m.id ? "z-20 cursor-grabbing" : "z-10 cursor-grab"
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border-2 bg-slate-800 shadow-sm shadow-black/30 transition-transform group-hover:scale-105",
                    isSelected
                      ? "border-indigo-400 ring-4 ring-indigo-500/20"
                      : "border-slate-700"
                  )}
                >
                  <Icon className="h-5 w-5 text-slate-300" />
                  <span
                    className={cn(
                      "absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-slate-900",
                      s.dot
                    )}
                  />
                </div>
                <span className="rounded-md bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 shadow-sm">
                  {m.code}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {Object.entries(STATUS_STYLES).map(([key, s]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={cn("h-2 w-2 rounded-full", s.dot)} />
              {s.label}
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {selected ? (
          <MachineDetailPanel machine={selected} onClose={() => setSelectedId(null)} />
        ) : (
          <Card className="flex h-full min-h-72 flex-col items-center justify-center p-8 text-center">
            <MapPin className="h-8 w-8 text-slate-700" />
            <p className="mt-3 text-sm font-medium text-slate-400">
              Chọn một máy trên sơ đồ
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Nhấn vào biểu tượng máy để xem người đứng máy và chi tiết thiết bị.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function MachineDetailPanel({
  machine,
  onClose,
}: {
  machine: Machine;
  onClose: () => void;
}) {
  const operator = getEmployeeById(machine.operatorId);
  const Icon = MACHINE_TYPE_ICON[machine.type];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin máy</CardTitle>
        <button
          onClick={onClose}
          className="text-xs font-medium text-slate-500 hover:text-slate-300"
        >
          Đóng
        </button>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">
              {machine.name}
            </p>
            <p className="text-xs text-slate-500">
              {machine.code} · Khu {machine.zone}
            </p>
          </div>
        </div>

        <StatusBadge status={machine.status} pulse />

        <div>
          <p className="mb-1 text-[11px] text-slate-500">Sức khỏe thiết bị</p>
          <HealthBar score={machine.healthScore} />
        </div>

        <div className="border-t border-slate-800 pt-3">
          <p className="mb-2 text-[11px] text-slate-500">Người đứng máy</p>
          {operator ? (
            <div className="flex items-center gap-3">
              <Avatar name={operator.name} color={operator.avatarColor} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">
                  {operator.name}
                </p>
                <p className="text-xs text-slate-500">
                  {operator.role} · {operator.shift}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Chưa phân công</p>
          )}
          {operator && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <Phone className="h-3 w-3" /> {operator.phone}
            </p>
          )}
        </div>

        <Link
          href={`/may/${machine.id}`}
          className="block w-full rounded-lg bg-indigo-600 py-2 text-center text-sm font-medium text-white hover:bg-indigo-500"
        >
          Xem chi tiết đầy đủ
        </Link>
      </CardContent>
    </Card>
  );
}

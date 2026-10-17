export type MachineType =
  | "Máy phay"
  | "Máy tiện"
  | "Máy hàn"
  | "Máy cắt"
  | "Máy khoan"
  | "Máy dập"
  | "Máy mài"
  | "Robot hàn";

export type MachineStatus =
  | "running"
  | "idle"
  | "maintenance"
  | "error"
  | "offline";

export const MACHINE_STATUS_LABEL: Record<MachineStatus, string> = {
  running: "Đang chạy",
  idle: "Chờ việc",
  maintenance: "Bảo trì",
  error: "Lỗi / Hỏng",
  offline: "Ngừng hoạt động",
};

export interface Employee {
  id: string;
  name: string;
  avatarColor: string;
  role: "Vận hành máy" | "Kỹ thuật viên" | "Giám sát ca" | "Tổ trưởng";
  shift: "Ca sáng" | "Ca chiều" | "Ca đêm";
  phone: string;
  experienceYears: number;
  joinedDate: string;
  certifications: string[];
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: "Định kỳ" | "Sửa chữa" | "Đột xuất" | "Kiểm định";
  technicianId: string;
  description: string;
  partsUsed: string[];
  durationHours: number;
  cost: number;
  status: "Hoàn thành" | "Đang xử lý";
}

export interface MachinePart {
  id: string;
  name: string;
  code: string;
  stock: number;
  unit: string;
  condition: "Tốt" | "Cần thay" | "Đã thay gần đây";
  lastReplaced: string;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  type: MachineType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  status: MachineStatus;
  healthScore: number;
  zone: "A" | "B" | "C" | "D";
  position: { x: number; y: number };
  operatorId: string | null;
  power: string;
  capacity: string;
  dimensions: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  runningHours: number;
  notes: string;
  parts: MachinePart[];
  maintenanceHistory: MaintenanceRecord[];
}

export interface FactoryZoneDef {
  id: "A" | "B" | "C" | "D";
  name: string;
  color: string;
}

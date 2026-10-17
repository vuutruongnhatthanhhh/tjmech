import { EMPLOYEES, MACHINES, ZONES, getEmployeeById } from "./data";
import { STATUS_STYLES } from "./status";
import type { Employee } from "./types";

export const SUGGESTED_QUESTIONS = [
  "Có bao nhiêu máy đang hoạt động?",
  "Máy nào đang gặp sự cố?",
  "Ai đang vận hành máy PHA-01?",
  "Lịch bảo trì sắp tới có gì cần chú ý?",
  "Chỉ số sức khỏe trung bình của các máy?",
  "Khu nào có nhiều máy nhất?",
];

const DIACRITIC_MARKS = /[̀-ͯ]/g;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(DIACRITIC_MARKS, "");
}

function daysUntil(dateStr: string): number {
  const today = new Date("2026-10-17");
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function mostExperienced(): Employee {
  return [...EMPLOYEES].sort((a, b) => b.experienceYears - a.experienceYears)[0];
}

export function answerQuestion(rawQuery: string): string {
  const q = normalize(rawQuery);

  const codeMatch = rawQuery.toUpperCase().match(/[A-Z]{3}-\d{2}/);
  if (codeMatch) {
    const machine = MACHINES.find((m) => m.code === codeMatch[0]);
    if (machine) {
      const operator = getEmployeeById(machine.operatorId);
      const statusLabel = STATUS_STYLES[machine.status].label;
      const operatorText = operator
        ? `do ${operator.name} (${operator.role}, ${operator.shift}) đứng máy`
        : "hiện chưa được phân công người vận hành";
      return `${machine.name} (${machine.code}) đang ở trạng thái "${statusLabel}", chỉ số sức khỏe ${machine.healthScore}%, đặt tại Khu ${machine.zone}, ${operatorText}.`;
    }
    return `Em không tìm thấy máy mã ${codeMatch[0]} trong hệ thống. Anh kiểm tra lại giúp em nhé (ví dụ PHA-01, HAN-02, CAT-01...).`;
  }

  if (q.includes("xin chao") || q.includes("hello") || /\bhi\b/.test(q)) {
    return "Chào anh! Em là trợ lý TJMech, có thể giúp anh tra cứu nhanh tình trạng máy, người vận hành, hoặc lịch bảo trì. Anh cứ hỏi em nhé.";
  }

  if (q.includes("cam on") || q.includes("thanks") || q.includes("thank you")) {
    return "Dạ không có gì, em luôn sẵn sàng hỗ trợ anh!";
  }

  if (q.includes("lich bao tri") || q.includes("sap toi") || q.includes("sap den han")) {
    const overdue = MACHINES.filter((m) => daysUntil(m.nextMaintenanceDate) < 0);
    const soon = MACHINES.filter((m) => {
      const d = daysUntil(m.nextMaintenanceDate);
      return d >= 0 && d <= 7;
    });
    const parts: string[] = [];
    if (overdue.length > 0) {
      parts.push(
        `${overdue.length} máy đã quá hạn bảo trì: ${overdue.map((m) => m.code).join(", ")}`
      );
    }
    if (soon.length > 0) {
      parts.push(
        `${soon.length} máy sắp đến hạn trong 7 ngày tới: ${soon.map((m) => m.code).join(", ")}`
      );
    }
    if (parts.length === 0) {
      return "Hiện không có máy nào quá hạn hoặc sắp đến hạn bảo trì trong 7 ngày tới.";
    }
    return parts.join(". ") + ".";
  }

  if (q.includes("loi") || q.includes("hong") || q.includes("su co")) {
    const errorMachines = MACHINES.filter((m) => m.status === "error");
    if (errorMachines.length === 0) return "Hiện không có máy nào đang gặp lỗi hoặc hỏng. 🎉";
    return `Hiện có ${errorMachines.length} máy đang gặp sự cố: ${errorMachines
      .map((m) => `${m.name} (${m.code})`)
      .join(", ")}.`;
  }

  if (q.includes("bao tri") && (q.includes("may nao") || q.includes("dang"))) {
    const maintMachines = MACHINES.filter((m) => m.status === "maintenance");
    if (maintMachines.length === 0) return "Hiện không có máy nào đang được bảo trì.";
    return `Đang bảo trì ${maintMachines.length} máy: ${maintMachines
      .map((m) => `${m.name} (${m.code})`)
      .join(", ")}.`;
  }

  if (q.includes("suc khoe trung binh") || (q.includes("suc khoe") && q.includes("trung binh"))) {
    const avg = Math.round(
      MACHINES.reduce((sum, m) => sum + m.healthScore, 0) / MACHINES.length
    );
    const worst = [...MACHINES].sort((a, b) => a.healthScore - b.healthScore)[0];
    return `Chỉ số sức khỏe trung bình của ${MACHINES.length} máy là ${avg}%. Máy cần chú ý nhất hiện tại là ${worst.name} (${worst.code}) với ${worst.healthScore}%.`;
  }

  if (q.includes("khu nao") && (q.includes("nhieu may") || q.includes("nhieu nhat"))) {
    const stats = ZONES.map((zone) => ({
      zone,
      count: MACHINES.filter((m) => m.zone === zone.id).length,
    })).sort((a, b) => b.count - a.count);
    const top = stats[0];
    return `${top.zone.name} có nhiều máy nhất với ${top.count} máy. Phân bố các khu: ${stats
      .map((s) => `Khu ${s.zone.id} (${s.count})`)
      .join(", ")}.`;
  }

  if (
    q.includes("bao nhieu may") ||
    q.includes("tong so may") ||
    q.includes("so luong may") ||
    (q.includes("may") && q.includes("hoat dong") && q.includes("bao nhieu"))
  ) {
    const running = MACHINES.filter((m) => m.status === "running").length;
    const idle = MACHINES.filter((m) => m.status === "idle").length;
    const maintenance = MACHINES.filter((m) => m.status === "maintenance").length;
    const error = MACHINES.filter((m) => m.status === "error").length;
    const offline = MACHINES.filter((m) => m.status === "offline").length;
    return `Nhà máy hiện có ${MACHINES.length} máy: ${running} đang chạy, ${idle} chờ việc, ${maintenance} đang bảo trì, ${error} lỗi/hỏng, ${offline} ngừng hoạt động.`;
  }

  if (q.includes("nhan vien") && q.includes("kinh nghiem")) {
    const top = mostExperienced();
    return `${top.name} là nhân viên có kinh nghiệm lâu năm nhất, với ${top.experienceYears} năm, hiện giữ vai trò ${top.role} ở ${top.shift}.`;
  }

  if (q.includes("ca dem") || q.includes("ca sang") || q.includes("ca chieu")) {
    const shift = q.includes("ca dem")
      ? "Ca đêm"
      : q.includes("ca sang")
        ? "Ca sáng"
        : "Ca chiều";
    const list = EMPLOYEES.filter((e) => e.shift === shift);
    return `${shift} có ${list.length} nhân sự: ${list.map((e) => e.name).join(", ")}.`;
  }

  if (q.includes("van hanh") || q.includes("dung may")) {
    return "Anh cho em biết mã máy cụ thể (ví dụ PHA-01, HAN-02, CAT-03...) để em tra ai đang đứng máy đó nhé.";
  }

  return "Em chưa có dữ liệu chính xác cho câu hỏi này. Anh có thể hỏi em về: số lượng/tình trạng máy, người vận hành theo mã máy, lịch bảo trì, sức khỏe thiết bị, hoặc nhân sự theo ca.";
}

export function formatGreeting(): string {
  return `Chào anh! Em là trợ lý ảo của TJMech. Hiện nhà máy có ${MACHINES.length} máy và ${EMPLOYEES.length} nhân sự đang hoạt động. Anh muốn hỏi gì nào?`;
}

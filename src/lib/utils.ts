import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value === 0) return "—";
  return value.toLocaleString("vi-VN") + "đ";
}

export function formatDate(value: string): string {
  const d = new Date(value);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("vi-VN");
}

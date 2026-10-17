import {
  Bot,
  CircleDot,
  Cog,
  Drill,
  Flame,
  Hammer,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { MachineType } from "./types";

export const MACHINE_TYPE_ICON: Record<MachineType, LucideIcon> = {
  "Máy phay": Cog,
  "Máy tiện": CircleDot,
  "Máy hàn": Flame,
  "Máy cắt": Scissors,
  "Máy khoan": Drill,
  "Máy dập": Hammer,
  "Máy mài": Sparkles,
  "Robot hàn": Bot,
};

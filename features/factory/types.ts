export type FactoryStage = "preparation" | "running" | "checkpoint" | "completed";

export type FactoryPhase =
  | "ready"
  | "necessary-labor"
  | "checkpoint"
  | "surplus-labor"
  | "complete";

export type CheckpointAnswer = "already_appeared" | "not_yet_appeared";

export interface FactoryConfig {
  totalHours: number;
  necessaryHours: number;
  cottonTotal: number;
  depreciationTotal: number;
  laborPowerValue: number;
  newValueTotal: number;
  // Aliases for compatibility
  cottonValue?: number;
  machineDepreciation?: number;
}

export interface FactorySetup {
  cottonReady: boolean;
  machineReady: boolean;
  laborHired: boolean;
}

export interface FactoryIssue {
  code:
    | "invalid-number"
    | "invalid-hours"
    | "inconsistent-necessary-hours"
    | "resource-not-ready"
    | "hour-out-of-range";
  field: string;
  message: string;
}

export interface FactorySnapshot {
  hour: number;
  cottonUsed: number;
  machineDepreciation: number;
  constantCapital: number; // c = cottonUsed + machineDepreciation
  variableCapital: number; // v = laborPowerValue
  newValue: number; // (v + m) = (newValueTotal / totalHours) * hour
  surplusValue: number; // m = max(0, newValue - variableCapital)
  productValue: number; // G = constantCapital + newValue
  isNecessaryLabor: boolean; // hour <= necessaryHours
  isSurplusLabor: boolean; // hour > necessaryHours
  progressPercent: number; // 0 to 100%

  // Extended M5 properties
  phase: FactoryPhase;
  isCheckpoint: boolean;
  isComplete: boolean;
  capitalAdvancedTotal: number; // Tổng vốn ứng trước ban đầu = c_total + v (121 USD)
  capitalUsedThroughHour: number; // Vốn đã chuyển vào sản phẩm tại mốc giờ
  cottonTransferred: number; // Đồng nghĩa với cottonUsed
  machineTransferred: number; // Đồng nghĩa với machineDepreciation
  transferredValue: number; // Đồng nghĩa với constantCapital
  illustrativeFullInputValue: number; // Số minh họa toàn bộ đầu vào cả ca + m (như frame Figma 63:11686)
  isInterpolated: boolean; // True nếu là mốc trung gian
}

export interface FactoryResult {
  constantCapital: number; // c = 106 USD
  variableCapital: number; // v = 15 USD
  surplusValue: number; // m = 15 USD
  newValue: number; // v + m = 30 USD
  productValue: number; // G = c + v + m = 136 USD
  capitalAdvancedTotal: number; // c + v = 121 USD
  necessaryHours: number; // 4 giờ
  surplusHours: number; // 4 giờ
  rateOfSurplusValue: number; // m' = (m / v) * 100 = 100%
  checkpoint: FactorySnapshot;
  completion: FactorySnapshot;
}

export const DEFAULT_FACTORY_CONFIG: Readonly<FactoryConfig> = Object.freeze({
  totalHours: 8,
  necessaryHours: 4,
  cottonTotal: 100,
  depreciationTotal: 6,
  laborPowerValue: 15,
  newValueTotal: 30,
  cottonValue: 100,
  machineDepreciation: 6,
});

export const TEXTBOOK_FACTORY_CONFIG = DEFAULT_FACTORY_CONFIG;

export const EMPTY_FACTORY_SETUP: Readonly<FactorySetup> = Object.freeze({
  cottonReady: false,
  machineReady: false,
  laborHired: false,
});

export interface FactoryResourceItem {
  id: "cotton" | "machine" | "labor";
  title: string;
  role: string;
  value: number;
  unit: string;
  category: "c" | "v";
  categoryLabel: string;
  icon: string;
  description: string;
}

export const FACTORY_RESOURCES: FactoryResourceItem[] = [
  {
    id: "cotton",
    title: "BÔNG NGUYÊN LIỆU",
    role: "Vai trò riêng trong cấu thành giá trị.",
    value: 100,
    unit: "USD",
    category: "c",
    categoryLabel: "Tư bản bất biến (c)",
    icon: "diamond",
    description:
      "50 kg bông trị giá 50 USD trong 4 giờ đầu, thêm 50 kg trị giá 50 USD trong 4 giờ sau. Giá trị được bảo toàn và chuyển dịch nguyên vẹn vào sợi.",
  },
  {
    id: "machine",
    title: "HAO MÒN MÁY MÓC",
    role: "Vai trò riêng trong cấu thành giá trị.",
    value: 6,
    unit: "USD",
    category: "c",
    categoryLabel: "Tư bản bất biến (c)",
    icon: "gear",
    description:
      "Máy kéo sợi hao mòn 3 USD mỗi 4 giờ, tổng cộng 6 USD trong 8 giờ. Giá trị chuyển dần vào sản phẩm qua lao động cụ thể.",
  },
  {
    id: "labor",
    title: "SỨC LAO ĐỘNG",
    role: "Vai trò riêng trong cấu thành giá trị.",
    value: 15,
    unit: "USD",
    category: "v",
    categoryLabel: "Tư bản khả biến (v)",
    icon: "worker",
    description:
      "Nhà tư bản mua sức lao động trong 8 giờ với giá 15 USD (bằng giá trị tư liệu sinh hoạt nuôi sống công nhân trong ngày).",
  },
];

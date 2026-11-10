export type FactoryStage = "preparation" | "running" | "checkpoint" | "completed";

export type CheckpointAnswer = "already_appeared" | "not_yet_appeared";

export interface FactoryConfig {
  totalHours: number;
  necessaryHours: number;
  cottonTotal: number;
  depreciationTotal: number;
  laborPowerValue: number;
  newValueTotal: number;
}

export interface FactorySnapshot {
  hour: number;
  cottonUsed: number;
  machineDepreciation: number;
  constantCapital: number; // c = cottonUsed + machineDepreciation
  variableCapital: number; // v = laborPowerValue (15 USD)
  newValue: number; // (v + m) = (newValueTotal / totalHours) * hour
  surplusValue: number; // m = max(0, newValue - variableCapital)
  productValue: number; // G = constantCapital + newValue
  isNecessaryLabor: boolean; // hour <= necessaryHours
  isSurplusLabor: boolean; // hour > necessaryHours
  progressPercent: number; // 0 to 100%
}

export const DEFAULT_FACTORY_CONFIG: FactoryConfig = {
  totalHours: 8,
  necessaryHours: 4,
  cottonTotal: 100,
  depreciationTotal: 6,
  laborPowerValue: 15,
  newValueTotal: 30,
};

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

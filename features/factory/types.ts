/** Values for one production shift, in USD unless the name says hours. */
export interface FactoryConfig {
  totalHours: number;
  necessaryHours: number;
  cottonValue: number;
  machineDepreciation: number;
  laborPowerValue: number;
  newValueTotal: number;
  /** Alternate field names used by the factory UI implementation. */
  cottonTotal?: number;
  depreciationTotal?: number;
}

export type FactoryStage = "preparation" | "running" | "checkpoint" | "completed";
export type CheckpointAnswer = "already_appeared" | "not_yet_appeared";

/** The three resources shown on the preparation screen. */
export interface FactorySetup {
  cottonReady: boolean;
  machineReady: boolean;
  laborHired: boolean;
}

export type FactoryPhase = "ready" | "necessary-labor" | "checkpoint" | "surplus-labor" | "complete";

export interface FactorySnapshot {
  hour: number;
  phase: FactoryPhase;
  isCheckpoint: boolean;
  isComplete: boolean;
  /** Capital committed to the entire shift, even at hour zero. */
  capitalAdvancedTotal: number;
  /** Value already used by the output produced through this hour. */
  capitalUsedThroughHour: number;
  cottonTransferred: number;
  machineTransferred: number;
  /** Constant capital transferred into output through this hour. */
  transferredValue: number;
  /** Value newly created by labor through this hour. */
  newValue: number;
  /** Portion of new value that has reproduced the cost of labor power. */
  variableCapital: number;
  surplusValue: number;
  /** Value of the output already produced, not a full-shift projection. */
  productValue: number;
  /** Full-shift c + full-shift v + surplus accrued so far; an illustration only. */
  illustrativeFullInputValue: number;
  /** Intermediate hours are linearly interpolated for the animation. */
  isInterpolated: boolean;
  /** Display aliases consumed by the additional factory UI components. */
  cottonUsed: number;
  machineDepreciation: number;
  constantCapital: number;
  isNecessaryLabor: boolean;
  isSurplusLabor: boolean;
  progressPercent: number;
}

export interface FactoryResult {
  constantCapital: number;
  variableCapital: number;
  surplusValue: number;
  newValue: number;
  productValue: number;
  capitalAdvancedTotal: number;
  necessaryHours: number;
  surplusHours: number;
  checkpoint: FactorySnapshot;
  completion: FactorySnapshot;
  rateOfSurplusValue: number;
}

export type FactoryIssueCode =
  | "invalid-number"
  | "invalid-hours"
  | "inconsistent-necessary-hours"
  | "resource-not-ready"
  | "hour-out-of-range";

export interface FactoryIssue {
  code: FactoryIssueCode;
  field: keyof FactoryConfig | keyof FactorySetup | "hour";
  message: string;
}
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

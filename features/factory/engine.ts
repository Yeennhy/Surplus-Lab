import type {
  FactoryConfig,
  FactoryIssue,
  FactoryPhase,
  FactoryResult,
  FactorySetup,
  FactorySnapshot,
} from "./types";

/** The textbook's eight-hour yarn-production example. */
export const TEXTBOOK_FACTORY_CONFIG: Readonly<FactoryConfig> = Object.freeze({
  totalHours: 8,
  necessaryHours: 4,
  cottonValue: 100,
  machineDepreciation: 6,
  laborPowerValue: 15,
  newValueTotal: 30,
});

export const EMPTY_FACTORY_SETUP: Readonly<FactorySetup> = Object.freeze({
  cottonReady: false,
  machineReady: false,
  laborHired: false,
});

export class FactoryInputError extends Error {
  readonly issues: FactoryIssue[];

  constructor(issues: FactoryIssue[]) {
    super(issues.map((issue) => issue.message).join("; "));
    this.name = "FactoryInputError";
    this.issues = issues;
  }
}

const MONEY_FIELDS = [
  "cottonValue",
  "machineDepreciation",
  "laborPowerValue",
  "newValueTotal",
] as const;

/** Returns every invalid field so the preparation screen can show useful feedback. */
export function validateFactoryConfig(config: FactoryConfig): FactoryIssue[] {
  const issues: FactoryIssue[] = [];

  for (const field of MONEY_FIELDS) {
    if (!Number.isFinite(config[field]) || config[field] < 0) {
      issues.push({
        code: "invalid-number",
        field,
        message: `${field} phải là số hữu hạn không âm.`,
      });
    }
  }

  if (!Number.isFinite(config.totalHours) || config.totalHours <= 0) {
    issues.push({
      code: "invalid-hours",
      field: "totalHours",
      message: "totalHours phải là số hữu hạn lớn hơn 0.",
    });
  }

  if (
    !Number.isFinite(config.necessaryHours) ||
    config.necessaryHours < 0 ||
    config.necessaryHours > config.totalHours
  ) {
    issues.push({
      code: "invalid-hours",
      field: "necessaryHours",
      message: "necessaryHours phải nằm trong khoảng từ 0 đến totalHours.",
    });
  }

  if (issues.length === 0) {
    // At the necessary-hour checkpoint, labor must have recreated exactly v.
    const newValueAtCheckpoint =
      (config.newValueTotal * config.necessaryHours) / config.totalHours;
    const tolerance = 1e-9 * Math.max(1, config.newValueTotal, config.laborPowerValue);
    if (Math.abs(newValueAtCheckpoint - config.laborPowerValue) > tolerance) {
      issues.push({
        code: "inconsistent-necessary-hours",
        field: "necessaryHours",
        message: "Giá trị mới ở giờ tất yếu phải bằng giá trị sức lao động.",
      });
    }
  }

  return issues;
}

export function validateFactorySetup(setup: FactorySetup): FactoryIssue[] {
  const issues: FactoryIssue[] = [];
  const resources: Array<[keyof FactorySetup, string]> = [
    ["cottonReady", "Cần chuẩn bị bông."],
    ["machineReady", "Cần chuẩn bị máy kéo sợi."],
    ["laborHired", "Cần thuê sức lao động."],
  ];

  for (const [field, message] of resources) {
    if (setup[field] !== true) {
      issues.push({ code: "resource-not-ready", field, message });
    }
  }

  return issues;
}

/** Validates all inputs and returns the hour-zero state to start a shift. */
export function startFactory(config: FactoryConfig, setup: FactorySetup): FactorySnapshot {
  const issues = [...validateFactoryConfig(config), ...validateFactorySetup(setup)];
  if (issues.length > 0) throw new FactoryInputError(issues);
  return getFactorySnapshot(config, 0);
}

/** A pure calculation: the UI owns its clock, pause, resume and restart. */
export function getFactorySnapshot(config: FactoryConfig, hour: number): FactorySnapshot {
  const issues = validateFactoryConfig(config);
  if (!Number.isFinite(hour) || hour < 0 || hour > config.totalHours) {
    issues.push({
      code: "hour-out-of-range",
      field: "hour",
      message: "Giờ mô phỏng phải nằm trong khoảng của ca sản xuất.",
    });
  }
  if (issues.length > 0) throw new FactoryInputError(issues);

  const progress = hour / config.totalHours;
  const cottonTransferred = config.cottonValue * progress;
  const machineTransferred = config.machineDepreciation * progress;
  const transferredValue = cottonTransferred + machineTransferred;
  const newValue = config.newValueTotal * progress;
  const variableCapital = Math.min(newValue, config.laborPowerValue);
  const surplusValue = Math.max(0, newValue - config.laborPowerValue);
  const isCheckpoint = hour === config.necessaryHours && hour !== 0 && hour !== config.totalHours;
  const isComplete = hour === config.totalHours;

  let phase: FactoryPhase;
  if (hour === 0) phase = "ready";
  else if (isComplete) phase = "complete";
  else if (isCheckpoint) phase = "checkpoint";
  else if (hour < config.necessaryHours) phase = "necessary-labor";
  else phase = "surplus-labor";

  const capitalAdvancedTotal =
    config.cottonValue + config.machineDepreciation + config.laborPowerValue;

  return {
    hour,
    phase,
    isCheckpoint,
    isComplete,
    capitalAdvancedTotal,
    capitalUsedThroughHour: transferredValue + variableCapital,
    cottonTransferred,
    machineTransferred,
    transferredValue,
    newValue,
    variableCapital,
    surplusValue,
    productValue: transferredValue + newValue,
    illustrativeFullInputValue: capitalAdvancedTotal + surplusValue,
    isInterpolated: hour !== 0 && !isCheckpoint && !isComplete,
  };
}

export function getFactoryResult(config: FactoryConfig): FactoryResult {
  const checkpoint = getFactorySnapshot(config, config.necessaryHours);
  const completion = getFactorySnapshot(config, config.totalHours);
  return {
    constantCapital: completion.transferredValue,
    variableCapital: config.laborPowerValue,
    surplusValue: completion.surplusValue,
    newValue: completion.newValue,
    productValue: completion.productValue,
    capitalAdvancedTotal: completion.capitalAdvancedTotal,
    necessaryHours: config.necessaryHours,
    surplusHours: config.totalHours - config.necessaryHours,
    checkpoint,
    completion,
  };
}

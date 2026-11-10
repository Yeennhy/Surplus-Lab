import {
  DEFAULT_FACTORY_CONFIG,
  EMPTY_FACTORY_SETUP,
  FactoryConfig,
  FactoryIssue,
  FactoryPhase,
  FactoryResult,
  FactorySetup,
  FactorySnapshot,
  TEXTBOOK_FACTORY_CONFIG,
} from "./types";

export {
  DEFAULT_FACTORY_CONFIG,
  EMPTY_FACTORY_SETUP,
  TEXTBOOK_FACTORY_CONFIG,
};

export class FactoryInputError extends Error {
  readonly issues: FactoryIssue[];

  constructor(issues: FactoryIssue[]) {
    super(issues.map((i) => i.message).join("; "));
    this.name = "FactoryInputError";
    this.issues = issues;
  }
}

/**
 * Chuẩn hóa cấu hình nhà máy để hỗ trợ linh hoạt cả hai quy ước đặt tên:
 * `cottonTotal` / `cottonValue` và `depreciationTotal` / `machineDepreciation`.
 */
export function normalizeFactoryConfig(config: Partial<FactoryConfig> = {}): FactoryConfig {
  const cotton = config.cottonTotal ?? config.cottonValue ?? DEFAULT_FACTORY_CONFIG.cottonTotal;
  const depreciation = config.depreciationTotal ?? config.machineDepreciation ?? DEFAULT_FACTORY_CONFIG.depreciationTotal;

  return {
    totalHours: config.totalHours ?? DEFAULT_FACTORY_CONFIG.totalHours,
    necessaryHours: config.necessaryHours ?? DEFAULT_FACTORY_CONFIG.necessaryHours,
    cottonTotal: cotton,
    depreciationTotal: depreciation,
    cottonValue: cotton,
    machineDepreciation: depreciation,
    laborPowerValue: config.laborPowerValue ?? DEFAULT_FACTORY_CONFIG.laborPowerValue,
    newValueTotal: config.newValueTotal ?? DEFAULT_FACTORY_CONFIG.newValueTotal,
  };
}

/**
 * Kiểm tra tính hợp lệ của tham số kinh tế và kỹ thuật.
 * Bắt lỗi số âm, NaN, Infinity, giờ không hợp lệ hoặc quan hệ bất cân xứng giữa giờ tất yếu và giá trị sức lao động.
 */
export function validateFactoryConfig(rawConfig: FactoryConfig): FactoryIssue[] {
  const issues: FactoryIssue[] = [];
  const config = normalizeFactoryConfig(rawConfig);

  const numericFields: Array<keyof FactoryConfig> = [
    "cottonTotal",
    "depreciationTotal",
    "laborPowerValue",
    "newValueTotal",
  ];

  for (const field of numericFields) {
    const val = config[field];
    if (typeof val !== "number" || !Number.isFinite(val) || val < 0) {
      issues.push({
        code: "invalid-number",
        field,
        message: `${String(field)} phải là số hữu hạn không âm.`,
      });
    }
  }

  if (typeof config.totalHours !== "number" || !Number.isFinite(config.totalHours) || config.totalHours <= 0) {
    issues.push({
      code: "invalid-hours",
      field: "totalHours",
      message: "totalHours phải là số hữu hạn lớn hơn 0.",
    });
  }

  if (
    typeof config.necessaryHours !== "number" ||
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
    // Kiểm tra tính nhất quán: Ở mốc giờ tất yếu, giá trị mới tạo ra phải bù đắp giá trị sức lao động (v)
    const newValueAtCheckpoint = (config.newValueTotal * config.necessaryHours) / config.totalHours;
    const tolerance = 1e-6 * Math.max(1, config.newValueTotal, config.laborPowerValue);
    if (Math.abs(newValueAtCheckpoint - config.laborPowerValue) > tolerance) {
      issues.push({
        code: "inconsistent-necessary-hours",
        field: "necessaryHours",
        message: "Giá trị mới tại thời điểm tất yếu phải tương đương giá trị sức lao động (v).",
      });
    }
  }

  return issues;
}

/**
 * Kiểm tra các điều kiện tư liệu và nhân lực trước khi bắt đầu ca sản xuất.
 */
export function validateFactorySetup(setup: FactorySetup): FactoryIssue[] {
  const issues: FactoryIssue[] = [];
  const resources: Array<[keyof FactorySetup, string]> = [
    ["cottonReady", "Cần chuẩn bị bông nguyên liệu (100 USD)."],
    ["machineReady", "Cần kiểm tra và chuẩn bị máy kéo sợi (6 USD hao mòn)."],
    ["laborHired", "Cần ký hợp đồng thuê sức lao động (15 USD)."],
  ];

  for (const [field, message] of resources) {
    if (setup[field] !== true) {
      issues.push({ code: "resource-not-ready", field, message });
    }
  }

  return issues;
}

/**
 * Làm tròn số tới chữ số thập phân chỉ định (mặc định 2 chữ số) để tránh sai số số thực JS.
 */
function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Tính toán trạng thái xưởng sản xuất theo số giờ đã trôi qua.
 * Dựa trên ví dụ kéo sợi mẫu trong Giáo trình Kinh tế chính trị Mác - Lênin (trang 77-85):
 * - Giờ 0: c = 0, v = 0 (vốn ứng trước 121), giá trị mới = 0, m = 0, G = 0.
 * - Giờ 4: bông 50 USD, hao mòn 3 USD (c = 53 USD), giá trị mới 15 USD, m = 0 USD, G = 68 USD.
 * - Giờ 8: bông 100 USD, hao mòn 6 USD (c = 106 USD), giá trị mới 30 USD, m = 15 USD, G = 136 USD.
 */
export function calculateFactorySnapshot(
  hour: number,
  rawConfig: FactoryConfig = DEFAULT_FACTORY_CONFIG
): FactorySnapshot {
  const config = normalizeFactoryConfig(rawConfig);
  const clampedHour = Math.max(0, Math.min(hour, config.totalHours));
  const progressRatio = config.totalHours > 0 ? clampedHour / config.totalHours : 0;

  // c: Tư bản bất biến (bông + hao mòn máy móc) chuyển dần vào sản phẩm qua lao động cụ thể
  const cottonUsed = round(config.cottonTotal * progressRatio);
  const machineDepreciation = round(config.depreciationTotal * progressRatio);
  const constantCapital = round(cottonUsed + machineDepreciation);

  // Giá trị mới do lao động trừu tượng tạo ra: tỉ lệ thuận với thời gian làm việc
  const newValue = round(config.newValueTotal * progressRatio);

  // v: Giá trị sức lao động đã được tái tạo trong sản phẩm đến thời điểm xét
  // Tại giờ 0 = 0; tăng dần và đạt đủ 15 USD tại giờ tất yếu (4h)
  const variableCapitalRecreated = clampedHour === 0 ? 0 : Math.min(newValue, config.laborPowerValue);

  // m: Giá trị thặng dư chỉ bắt đầu sinh ra sau khi vượt qua thời gian lao động tất yếu
  const surplusValue = Math.max(0, round(newValue - config.laborPowerValue));

  // G = c + (v + m) = constantCapital + newValue
  const productValue = round(constantCapital + newValue);

  // Các cờ trạng thái logic
  const isCheckpoint = clampedHour === config.necessaryHours && clampedHour > 0 && clampedHour < config.totalHours;
  const isComplete = clampedHour >= config.totalHours;
  const isNecessaryLabor = clampedHour <= config.necessaryHours;
  const isSurplusLabor = clampedHour > config.necessaryHours;

  let phase: FactoryPhase;
  if (clampedHour === 0) {
    phase = "ready";
  } else if (isComplete) {
    phase = "complete";
  } else if (isCheckpoint) {
    phase = "checkpoint";
  } else if (isNecessaryLabor) {
    phase = "necessary-labor";
  } else {
    phase = "surplus-labor";
  }

  // Tổng vốn ứng trước ban đầu của nhà tư bản
  const capitalAdvancedTotal = round(config.cottonTotal + config.depreciationTotal + config.laborPowerValue);

  // Vốn đã kết tinh vào sản phẩm tại giờ đó
  const capitalUsedThroughHour = round(constantCapital + variableCapitalRecreated);

  // Minh họa toàn bộ đầu vào cả ca + thặng dư (khớp với frame Figma 63:11686 tại mốc giờ trung gian)
  const illustrativeFullInputValue = round(capitalAdvancedTotal + surplusValue);

  return {
    hour: clampedHour,
    cottonUsed,
    machineDepreciation,
    constantCapital,
    // Ở mốc sau 0h, giao diện hiển thị v = 15 USD đại diện cho sức lao động đã thỏa thuận
    variableCapital: clampedHour === 0 ? 0 : config.laborPowerValue,
    newValue,
    surplusValue,
    productValue,
    isNecessaryLabor,
    isSurplusLabor,
    progressPercent: progressRatio * 100,

    phase,
    isCheckpoint,
    isComplete,
    capitalAdvancedTotal,
    capitalUsedThroughHour,
    cottonTransferred: cottonUsed,
    machineTransferred: machineDepreciation,
    transferredValue: constantCapital,
    illustrativeFullInputValue,
    isInterpolated: clampedHour !== 0 && !isCheckpoint && !isComplete,
  };
}

/**
 * Hàm nạp cấu hình và trả về snapshot giờ 0 sau khi kiểm tra setup & config.
 */
export function startFactory(
  rawConfig: FactoryConfig = DEFAULT_FACTORY_CONFIG,
  setup: FactorySetup = { cottonReady: true, machineReady: true, laborHired: true }
): FactorySnapshot {
  const config = normalizeFactoryConfig(rawConfig);
  const issues = [...validateFactoryConfig(config), ...validateFactorySetup(setup)];
  if (issues.length > 0) {
    throw new FactoryInputError(issues);
  }
  return calculateFactorySnapshot(0, config);
}

/**
 * Tính toán kết quả tổng kết toàn ca sản xuất (8 giờ).
 */
export function calculateFactoryResult(
  rawConfig: FactoryConfig = DEFAULT_FACTORY_CONFIG
): FactoryResult {
  const config = normalizeFactoryConfig(rawConfig);
  const issues = validateFactoryConfig(config);
  if (issues.length > 0) {
    throw new FactoryInputError(issues);
  }

  const checkpoint = calculateFactorySnapshot(config.necessaryHours, config);
  const completion = calculateFactorySnapshot(config.totalHours, config);

  const rateOfSurplusValue =
    config.laborPowerValue > 0
      ? round((completion.surplusValue / config.laborPowerValue) * 100)
      : 0;

  return {
    constantCapital: completion.constantCapital,
    variableCapital: config.laborPowerValue,
    surplusValue: completion.surplusValue,
    newValue: completion.newValue,
    productValue: completion.productValue,
    capitalAdvancedTotal: completion.capitalAdvancedTotal,
    necessaryHours: config.necessaryHours,
    surplusHours: config.totalHours - config.necessaryHours,
    rateOfSurplusValue,
    checkpoint,
    completion,
  };
}

/**
 * Tương thích với API getFactorySnapshot(config, hour) hoặc getFactorySnapshot(hour, config).
 */
export function getFactorySnapshot(
  first: FactoryConfig | number,
  second?: number | FactoryConfig
): FactorySnapshot {
  if (typeof first === "number") {
    return calculateFactorySnapshot(first, second as FactoryConfig | undefined);
  }
  const config = first;
  const hour = typeof second === "number" ? second : 0;
  const issues = validateFactoryConfig(config);
  if (!Number.isFinite(hour) || hour < 0 || hour > config.totalHours) {
    issues.push({
      code: "hour-out-of-range",
      field: "hour",
      message: "Giờ mô phỏng phải nằm trong khoảng của ca sản xuất.",
    });
  }
  if (issues.length > 0) {
    throw new FactoryInputError(issues);
  }
  return calculateFactorySnapshot(hour, config);
}

export const getFactoryResult = calculateFactoryResult;

import {
  SandboxComparison,
  SandboxConfig,
  SandboxResult,
  TEXTBOOK_SANDBOX_CONFIG,
} from "./types";

export { TEXTBOOK_SANDBOX_CONFIG } from "./types";

function round(val: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}

export function validateSandboxConfig(config: SandboxConfig): string[] {
  const errors: string[] = [];

  if (typeof config.totalHours !== "number" || !Number.isFinite(config.totalHours) || config.totalHours <= 0) {
    errors.push("Tổng thời gian làm việc phải là số dương lớn hơn 0.");
  }

  if (
    typeof config.necessaryHours !== "number" ||
    !Number.isFinite(config.necessaryHours) ||
    config.necessaryHours < 0 ||
    config.necessaryHours > config.totalHours
  ) {
    errors.push("Thời gian lao động tất yếu phải nằm trong khoảng từ 0 đến tổng số giờ.");
  }

  if (typeof config.hourlyValueRate !== "number" || !Number.isFinite(config.hourlyValueRate) || config.hourlyValueRate < 0) {
    errors.push("Tốc độ tạo giá trị mới mỗi giờ phải là số không âm.");
  }

  if (typeof config.cottonValue !== "number" || !Number.isFinite(config.cottonValue) || config.cottonValue < 0) {
    errors.push("Giá trị bông nguyên liệu phải là số không âm.");
  }

  if (
    typeof config.machineDepreciation !== "number" ||
    !Number.isFinite(config.machineDepreciation) ||
    config.machineDepreciation < 0
  ) {
    errors.push("Hao mòn máy móc phải là số không âm.");
  }

  return errors;
}

export function calculateSandbox(config: SandboxConfig): SandboxResult {
  const errors = validateSandboxConfig(config);
  if (errors.length > 0) {
    throw new Error(`Cấu hình Sandbox không hợp lệ: ${errors.join("; ")}`);
  }

  const {
    totalHours,
    necessaryHours,
    hourlyValueRate,
    cottonValue,
    machineDepreciation,
  } = config;

  const surplusHours = Math.max(0, round(totalHours - necessaryHours));
  const constantCapital = round(cottonValue + machineDepreciation);
  const variableCapital = round(
    config.laborPowerValue !== undefined
      ? config.laborPowerValue
      : necessaryHours * hourlyValueRate
  );

  const newValue = round(totalHours * hourlyValueRate);
  const surplusValue = Math.max(0, round(surplusHours * hourlyValueRate));
  const productValue = round(constantCapital + newValue);
  const capitalAdvancedTotal = round(constantCapital + variableCapital);

  const rateOfSurplusValue =
    variableCapital > 0 ? round((surplusValue / variableCapital) * 100) : 0;

  const organicCompositionRatio =
    variableCapital > 0 ? round(constantCapital / variableCapital) : 0;

  return {
    totalHours,
    necessaryHours,
    surplusHours,
    constantCapital,
    variableCapital,
    surplusValue,
    newValue,
    productValue,
    capitalAdvancedTotal,
    rateOfSurplusValue,
    organicCompositionRatio,
  };
}

export function compareSandbox(config: SandboxConfig): SandboxComparison {
  const current = calculateSandbox(config);
  const textbook = calculateSandbox(TEXTBOOK_SANDBOX_CONFIG);

  return {
    current,
    textbook,
    diffConstantCapital: round(current.constantCapital - textbook.constantCapital),
    diffVariableCapital: round(current.variableCapital - textbook.variableCapital),
    diffSurplusValue: round(current.surplusValue - textbook.surplusValue),
    diffProductValue: round(current.productValue - textbook.productValue),
    diffRateOfSurplusValue: round(
      current.rateOfSurplusValue - textbook.rateOfSurplusValue
    ),
  };
}

export function resetSandboxConfig(): SandboxConfig {
  return { ...TEXTBOOK_SANDBOX_CONFIG };
}

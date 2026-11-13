export interface SandboxConfig {
  totalHours: number;
  necessaryHours: number;
  hourlyValueRate: number; // Tốc độ tạo giá trị mới mỗi giờ (USD/giờ, mặc định 3.75)
  cottonValue: number; // Tư bản bất biến bông (USD)
  machineDepreciation: number; // Tư bản bất biến máy móc (USD)
  laborPowerValue?: number; // Tư bản khả biến (USD, nếu bỏ trống sẽ = necessaryHours * hourlyValueRate)
}

export interface SandboxResult {
  totalHours: number;
  necessaryHours: number;
  surplusHours: number;
  constantCapital: number; // c = cotton + machine
  variableCapital: number; // v
  surplusValue: number; // m
  newValue: number; // v + m
  productValue: number; // G = c + v + m
  capitalAdvancedTotal: number; // c + v
  rateOfSurplusValue: number; // m' = (m / v) * 100 (%)
  organicCompositionRatio: number; // c / v
}

export interface SandboxComparison {
  current: SandboxResult;
  textbook: SandboxResult;
  diffConstantCapital: number;
  diffVariableCapital: number;
  diffSurplusValue: number;
  diffProductValue: number;
  diffRateOfSurplusValue: number;
}

export const TEXTBOOK_SANDBOX_CONFIG: Readonly<SandboxConfig> = Object.freeze({
  totalHours: 8,
  necessaryHours: 4,
  hourlyValueRate: 3.75,
  cottonValue: 100,
  machineDepreciation: 6,
  laborPowerValue: 15,
});

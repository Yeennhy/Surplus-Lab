import {
  DEFAULT_FACTORY_CONFIG,
  FactoryConfig,
  FactorySnapshot,
} from "./types";

export { DEFAULT_FACTORY_CONFIG } from "./types";

/**
 * Tính toán trạng thái xưởng sản xuất theo số giờ đã trôi qua.
 * Dựa trên ví dụ kéo sợi mẫu trong Giáo trình Kinh tế chính trị Mác - Lênin (trang 77-85):
 * - Giờ 0: c = 0, v = 15 (ứng trước), giá trị mới = 0, m = 0, G = 0.
 * - Giờ 4: bông 50 USD, hao mòn 3 USD (c = 53 USD), giá trị mới 15 USD, m = 0 USD, G = 68 USD.
 * - Giờ 8: bông 100 USD, hao mòn 6 USD (c = 106 USD), giá trị mới 30 USD, m = 15 USD, G = 136 USD.
 */
export function calculateFactorySnapshot(
  hour: number,
  config: FactoryConfig = DEFAULT_FACTORY_CONFIG
): FactorySnapshot {
  const clampedHour = Math.max(0, Math.min(hour, config.totalHours));
  const ratio = clampedHour / config.totalHours;

  // c: Bông (100 USD) và hao mòn máy móc (6 USD) chuyển dần theo tiến độ kéo sợi
  const cottonUsed = Math.round(config.cottonTotal * ratio * 10) / 10;
  const machineDepreciation =
    Math.round(config.depreciationTotal * ratio * 10) / 10;
  const constantCapital =
    Math.round((cottonUsed + machineDepreciation) * 10) / 10;

  // v: Tư bản khả biến (mua sức lao động) trả cố định 15 USD cho cả ngày
  const variableCapital = config.laborPowerValue;

  // Giá trị mới do lao động trừu tượng tạo ra: 3.75 USD/giờ -> 15 USD tại 4h, 30 USD tại 8h
  const newValue =
    Math.round(((config.newValueTotal * clampedHour) / config.totalHours) * 10) /
    10;

  // m: Giá trị thặng dư chỉ sinh ra khi vượt qua thời gian lao động tất yếu (4 giờ)
  const surplusValue = Math.max(
    0,
    Math.round((newValue - variableCapital) * 10) / 10
  );

  // G = c + (v + m) = constantCapital + newValue
  const productValue = Math.round((constantCapital + newValue) * 10) / 10;

  return {
    hour: clampedHour,
    cottonUsed,
    machineDepreciation,
    constantCapital,
    variableCapital,
    newValue,
    surplusValue,
    productValue,
    isNecessaryLabor: clampedHour <= config.necessaryHours,
    isSurplusLabor: clampedHour > config.necessaryHours,
    progressPercent: (clampedHour / config.totalHours) * 100,
  };
}

export interface LaborScenario {
  id: "a" | "b" | "c";
  title: string;
  description: string;
  freeToSellLabor: boolean;
  lacksProductionMeans: boolean;
}

export const LABOR_SCENARIOS: readonly LaborScenario[] = [
  {
    id: "a",
    title: "Người sản xuất độc lập",
    description: "Tự do, có đủ tư liệu sản xuất.",
    freeToSellLabor: true,
    lacksProductionMeans: false,
  },
  {
    id: "b",
    title: "Người lao động làm thuê",
    description: "Tự do, thiếu tư liệu sản xuất.",
    freeToSellLabor: true,
    lacksProductionMeans: true,
  },
  {
    id: "c",
    title: "Người không tự do",
    description: "Không được tự quyết định bán sức lao động.",
    freeToSellLabor: false,
    lacksProductionMeans: true,
  },
] as const;

export interface LaborEvaluation {
  qualifies: boolean;
  firstConditionMet: boolean;
  secondConditionMet: boolean;
  explanation: string;
}

export function evaluateLaborScenario(scenario: LaborScenario): LaborEvaluation {
  const qualifies = scenario.freeToSellLabor && scenario.lacksProductionMeans;
  return {
    qualifies,
    firstConditionMet: scenario.freeToSellLabor,
    secondConditionMet: scenario.lacksProductionMeans,
    explanation: !scenario.freeToSellLabor
      ? "Người này chưa có quyền tự do quyết định việc bán sức lao động của mình."
      : !scenario.lacksProductionMeans
        ? "Người này có đủ tư liệu để tự sản xuất, nên không buộc phải bán sức lao động."
        : "Người này vừa tự do về thân thể, vừa thiếu tư liệu sản xuất cần thiết; cả hai điều kiện cùng được đáp ứng.",
  };
}

export const LABOR_POWER_VALUE_PARTS = [
  "Tư liệu sinh hoạt cần thiết để duy trì và tái sản xuất sức lao động",
  "Chi phí đào tạo, học tập và hình thành kỹ năng nghề nghiệp",
  "Tư liệu sinh hoạt cần thiết để nuôi con của người lao động",
] as const;

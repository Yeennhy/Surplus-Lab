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

export type LaborCondition = "freeToSellLabor" | "lacksProductionMeans";
export type EvidenceGrid = Partial<Record<LaborScenario["id"], Partial<Record<LaborCondition, boolean>>>>;

export function evaluateEvidenceGrid(grid: EvidenceGrid) {
  const missing: Array<{ id: LaborScenario["id"]; condition: LaborCondition }> = [];
  const wrong: Array<{ id: LaborScenario["id"]; condition: LaborCondition }> = [];
  for (const scenario of LABOR_SCENARIOS) {
    for (const condition of ["freeToSellLabor", "lacksProductionMeans"] as const) {
      const answer = grid[scenario.id]?.[condition];
      if (answer === undefined) missing.push({ id: scenario.id, condition });
      else if (answer !== scenario[condition]) wrong.push({ id: scenario.id, condition });
    }
  }
  return { complete: missing.length === 0, correct: missing.length === 0 && wrong.length === 0, missing, wrong };
}

export type LaborValuePiece = "living" | "training" | "children" | "cotton" | "machine";
export const LABOR_VALUE_PIECES: ReadonlyArray<{ id: LaborValuePiece; label: string; explanation: string }> = [
  { id: "living", label: "Sinh hoạt cần thiết", explanation: "Duy trì và tái sản xuất sức lao động." },
  { id: "training", label: "Học tập, đào tạo", explanation: "Hình thành kỹ năng làm việc." },
  { id: "children", label: "Nuôi con của người lao động", explanation: "Tái sản xuất thế hệ lao động tiếp theo." },
  { id: "cotton", label: "Bông nguyên liệu", explanation: "Vật liệu cần thiết cho quy trình kéo sợi." },
  { id: "machine", label: "Máy kéo sợi", explanation: "Thiết bị vận hành trong dây chuyền sản xuất." },
];

export function evaluateLaborValueFile(pieces: readonly LaborValuePiece[]) {
  const required: LaborValuePiece[] = ["living", "training", "children"];
  return {
    correct: required.every((id) => pieces.includes(id)) && pieces.length === required.length,
    missing: required.filter((id) => !pieces.includes(id)),
    decoys: pieces.filter((id) => !required.includes(id)),
  };
}

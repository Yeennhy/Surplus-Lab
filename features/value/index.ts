import type { FactoryResult } from "../factory/types";

export type ValueGroup = "c" | "v" | "m";
export type ValueItemId = "cotton" | "machine" | "labor" | "surplus";
export type ValuePlacements = Partial<Record<ValueItemId, ValueGroup>>;

export interface ValueItem {
  id: ValueItemId;
  label: string;
  amount: number;
  group: ValueGroup;
  asset: string;
  glyph: string;
  explanation: string;
}

export function getValueItems(result: FactoryResult): readonly ValueItem[] {
  return [
    {
      id: "cotton",
      label: "Bông nguyên liệu",
      amount: result.completion.cottonTransferred,
      group: "c",
      asset: "/assets/resource-cotton.svg",
      glyph: "❖",
      explanation: "Giá trị bông được bảo toàn và chuyển vào sợi; bông thuộc tư bản bất biến c.",
    },
    {
      id: "machine",
      label: "Hao mòn máy",
      amount: result.completion.machineTransferred,
      group: "c",
      asset: "/assets/resource-spinning-machine.svg",
      glyph: "⚙",
      explanation: "Phần hao mòn máy móc chuyển giá trị cũ vào sản phẩm; nó thuộc c.",
    },
    {
      id: "labor",
      label: "Sức lao động",
      amount: result.variableCapital,
      group: "v",
      asset: "/assets/labor-wage-worker.svg",
      glyph: "♟",
      explanation: "Tiền mua sức lao động là tư bản khả biến v; lao động tạo ra giá trị mới.",
    },
    {
      id: "surplus",
      label: "Giá trị thặng dư",
      amount: result.surplusValue,
      group: "m",
      asset: "/assets/resource-surplus.svg",
      glyph: "✦",
      explanation: "m là phần giá trị mới vượt quá v, không phải tư bản ứng trước.",
    },
  ];
}

export interface ValueEvaluation {
  complete: boolean;
  correct: boolean;
  wrongItems: ValueItemId[];
  missingItems: ValueItemId[];
}

export function evaluateValuePlacements(
  items: readonly ValueItem[],
  placements: ValuePlacements,
): ValueEvaluation {
  const wrongItems = items.filter((item) => placements[item.id] && placements[item.id] !== item.group).map((item) => item.id);
  const missingItems = items.filter((item) => !placements[item.id]).map((item) => item.id);
  return {
    complete: missingItems.length === 0,
    correct: wrongItems.length === 0 && missingItems.length === 0,
    wrongItems,
    missingItems,
  };
}

export type ValueEvidenceId = "batches" | "machine-invoice" | "contract" | "second-half";
export const VALUE_EVIDENCE: ReadonlyArray<{ id: ValueEvidenceId; title: string; detail: string }> = [
  { id: "batches", title: "Hai phiếu bông", detail: "50 + 50 USD bông đi vào hai mẻ." },
  { id: "machine-invoice", title: "Sổ hao mòn máy", detail: "3 + 3 USD giá trị cũ chuyển vào sợi." },
  { id: "contract", title: "Hợp đồng 8 giờ", detail: "15 USD mua sức lao động một lần cho cả ca." },
  { id: "second-half", title: "Mốc giờ 4–8", detail: "15 USD mới tiếp tục hình thành sau khi v đã được bù." },
];
export const ITEM_EVIDENCE: Readonly<Record<ValueItemId, ValueEvidenceId>> = {
  cotton: "batches", machine: "machine-invoice", labor: "contract", surplus: "second-half",
};

export function evaluateValueEvidence(answers: Partial<Record<ValueItemId, ValueEvidenceId>>) {
  const wrong = (Object.keys(ITEM_EVIDENCE) as ValueItemId[]).filter((id) => answers[id] !== ITEM_EVIDENCE[id]);
  return { correct: wrong.length === 0, wrong };
}

export function calculatePlacedLedger(items: readonly ValueItem[], placements: ValuePlacements) {
  const totals: Record<ValueGroup, number> = { c: 0, v: 0, m: 0 };
  for (const item of items) {
    const group = placements[item.id];
    if (group) totals[group] += item.amount;
  }
  return { ...totals, capitalAdvanced: totals.c + totals.v, productValue: totals.c + totals.v + totals.m };
}

export type AuditClaimId = "machine" | "wage" | "advance";
export const AUDIT_CLAIM_EVIDENCE: Readonly<Record<AuditClaimId, ValueEvidenceId>> = {
  machine: "machine-invoice", wage: "contract", advance: "second-half",
};
export function evaluateAuditEvidence(answers: Partial<Record<AuditClaimId, ValueEvidenceId>>) {
  const wrong = (Object.keys(AUDIT_CLAIM_EVIDENCE) as AuditClaimId[]).filter((id) => answers[id] !== AUDIT_CLAIM_EVIDENCE[id]);
  return { correct: wrong.length === 0, wrong };
}

export type ProofStep = "old-transfer" | "new-labor" | "surplus-after-v";
export function evaluateProofChain(steps: readonly ProofStep[]) {
  const expected: ProofStep[] = ["old-transfer", "new-labor", "surplus-after-v"];
  return { correct: steps.length === 3 && steps.every((step, index) => step === expected[index]), expected };
}

export * from "./types";
export * from "./constants";
export * from "./engine";

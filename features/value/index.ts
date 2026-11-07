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
      asset: "/assets/figma/value-cotton-icon.svg",
      glyph: "❖",
      explanation: "Giá trị bông được bảo toàn và chuyển vào sợi; bông thuộc tư bản bất biến c.",
    },
    {
      id: "machine",
      label: "Hao mòn máy",
      amount: result.completion.machineTransferred,
      group: "c",
      asset: "/assets/figma/value-machine-icon.svg",
      glyph: "⚙",
      explanation: "Phần hao mòn máy móc chuyển giá trị cũ vào sản phẩm; nó thuộc c.",
    },
    {
      id: "labor",
      label: "Sức lao động",
      amount: result.variableCapital,
      group: "v",
      asset: "/assets/figma/value-labor-icon.svg",
      glyph: "♟",
      explanation: "Tiền mua sức lao động là tư bản khả biến v; lao động tạo ra giá trị mới.",
    },
    {
      id: "surplus",
      label: "Giá trị thặng dư",
      amount: result.surplusValue,
      group: "m",
      asset: "/assets/figma/value-surplus-icon.svg",
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

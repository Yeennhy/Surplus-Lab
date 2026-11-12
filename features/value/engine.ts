import {
  TEXTBOOK_NUMBERS,
  VALUE_CARDS,
  CATEGORY_ZONES,
  CAPITAL_COMPARISON,
} from "./constants";
import type {
  CapitalCategory,
  CardFeedback,
  Chapter4State,
  Chapter4Result,
  FormulaValidationResult,
  ValueCard,
} from "./types";

export function createInitialState(): Chapter4State {
  return {
    currentStep: "intro",
    placements: {},
    completed: false,
    score: 0,
    mistakes: 0,
  };
}

export function getValueCards(): ValueCard[] {
  return VALUE_CARDS;
}

export function getCategoryZones() {
  return CATEGORY_ZONES;
}

export function getCapitalComparison() {
  return CAPITAL_COMPARISON;
}

export function getTextbookNumbers() {
  return TEXTBOOK_NUMBERS;
}

/**
 * Validates a single card placement
 */
export function evaluatePlacement(
  cardId: string,
  assignedCategory: CapitalCategory
): CardFeedback {
  const card = VALUE_CARDS.find((c) => c.id === cardId);
  if (!card) {
    throw new Error(`Card not found: ${cardId}`);
  }

  const isCorrect = assignedCategory === card.correctCategory;

  // CRITICAL ACCEPTANCE CHECK: m must NOT be treated as advance capital
  const isMisclassifiedAdvanceCapital =
    card.id === "card_surplus" && (assignedCategory === "c" || assignedCategory === "v");

  let message = "";
  if (isCorrect) {
    message = `Chính xác! ${card.explanation}`;
  } else if (isMisclassifiedAdvanceCapital) {
    message =
      "CHÚ Ý ĐẶC BIỆT: Bạn vừa xếp Giá trị thặng dư (m) vào tư bản ứng trước! Giá trị thặng dư KHÔNG PHẢI tư bản do nhà tư bản bỏ ra ban đầu, mà là phần giá trị mới dôi ra do người công nhân làm thêm không công trong 4 giờ lao động thặng dư.";
  } else {
    message = `Chưa đúng. ${card.name} không thuộc nhóm ${assignedCategory.toUpperCase()}. Hãy xem xét lại: ${
      card.isAdvanceCapital
        ? "Đây là một khoản tư bản ứng trước của nhà tư bản."
        : "Đây là phần giá trị mới dôi ra được tạo ra trong quá trình sản xuất."
    }`;
  }

  return {
    cardId,
    isCorrect,
    assignedCategory,
    correctCategory: card.correctCategory,
    message,
    isMisclassifiedAdvanceCapital,
  };
}

/**
 * Validates all card placements
 */
export function validateAllPlacements(
  placements: Record<string, CapitalCategory>
): {
  isAllPlaced: boolean;
  isAllCorrect: boolean;
  feedbacks: CardFeedback[];
  correctCount: number;
} {
  const feedbacks: CardFeedback[] = [];
  let correctCount = 0;

  for (const card of VALUE_CARDS) {
    const assigned = placements[card.id];
    if (assigned) {
      const fb = evaluatePlacement(card.id, assigned);
      feedbacks.push(fb);
      if (fb.isCorrect) correctCount += 1;
    }
  }

  const isAllPlaced = Object.keys(placements).length === VALUE_CARDS.length;
  const isAllCorrect = isAllPlaced && correctCount === VALUE_CARDS.length;

  return {
    isAllPlaced,
    isAllCorrect,
    feedbacks,
    correctCount,
  };
}

/**
 * Computes current totals in each zone
 */
export function calculateZoneTotals(
  placements: Record<string, CapitalCategory>
): Record<CapitalCategory, { totalUSD: number; cardCount: number }> {
  const totals: Record<CapitalCategory, { totalUSD: number; cardCount: number }> = {
    c: { totalUSD: 0, cardCount: 0 },
    v: { totalUSD: 0, cardCount: 0 },
    m: { totalUSD: 0, cardCount: 0 },
  };

  for (const [cardId, cat] of Object.entries(placements)) {
    const card = VALUE_CARDS.find((c) => c.id === cardId);
    if (card && totals[cat]) {
      totals[cat].totalUSD += card.valueUSD;
      totals[cat].cardCount += 1;
    }
  }

  return totals;
}

/**
 * Validates the formula input G = c + (v + m)
 */
export function validateFormula(
  cVal: number,
  vVal: number,
  mVal: number
): FormulaValidationResult {
  const cCorrect = cVal === TEXTBOOK_NUMBERS.C_TOTAL_USD;
  const vCorrect = vVal === TEXTBOOK_NUMBERS.V_TOTAL_USD;
  const mCorrect = mVal === TEXTBOOK_NUMBERS.M_TOTAL_USD;
  const totalG = cVal + vVal + mVal;
  const sumCorrect = totalG === TEXTBOOK_NUMBERS.TOTAL_PRODUCT_VALUE_G_USD;
  const isFullyCorrect = cCorrect && vCorrect && mCorrect && sumCorrect;

  let message = "";
  if (isFullyCorrect) {
    message = `Chính xác hoàn toàn! G = ${cVal} + (${vVal} + ${mVal}) = ${totalG} USD. Toàn bộ cơ cấu giá trị sản phẩm sợi đã được xác lập đúng theo giáo trình.`;
  } else {
    const errors: string[] = [];
    if (!cCorrect) {
      errors.push(`Tư bản bất biến c phải là 100 (bông) + 6 (khấu hao máy) = 106 USD`);
    }
    if (!vCorrect) {
      errors.push(`Tư bản khả biến v là tiền công mua sức lao động = 15 USD`);
    }
    if (!mCorrect) {
      errors.push(`Giá trị thặng dư m là 15 USD`);
    }
    message = errors.join(". ");
  }

  return {
    cCorrect,
    vCorrect,
    mCorrect,
    sumCorrect,
    totalG,
    isFullyCorrect,
    message,
  };
}

/**
 * Generates final result for Chapter 4
 */
export function generateResult(state: Chapter4State): Chapter4Result {
  const maxScore = 100;
  const penaltyPerMistake = 10;
  const score = Math.max(0, maxScore - state.mistakes * penaltyPerMistake);

  let stars: 1 | 2 | 3 = 1;
  if (score >= 90) {
    stars = 3;
  } else if (score >= 60) {
    stars = 2;
  }

  const passed = score >= 60;

  const keyInsights = [
    "Tư bản bất biến (c = 106 USD): Giá trị tư liệu sản xuất được bảo toàn và chuyển dịch nguyên vẹn vào sợi nhờ lao động cụ thể của công nhân.",
    "Tư bản khả biến (v = 15 USD): Tiền công mua sức lao động. Khi tiêu dùng, sức lao động tạo ra giá trị mới (v + m = 30 USD), biến đổi về lượng.",
    "Giá trị thặng dư (m = 15 USD): KHÔNG PHẢI tư bản ứng trước, mà là kết quả của 4 giờ lao động thặng dư không công.",
    "Công thức giá trị hàng hóa: G = c + (v + m) = 106 + 30 = 136 USD.",
  ];

  return {
    score,
    stars,
    passed,
    cValue: TEXTBOOK_NUMBERS.C_TOTAL_USD,
    vValue: TEXTBOOK_NUMBERS.V_TOTAL_USD,
    mValue: TEXTBOOK_NUMBERS.M_TOTAL_USD,
    totalG: TEXTBOOK_NUMBERS.TOTAL_PRODUCT_VALUE_G_USD,
    badgeTitle:
      stars === 3
        ? "Bậc thầy Cơ cấu Giá trị (G = c + v + m)"
        : stars === 2
        ? "Kế toán viên Kinh tế Chính trị"
        : "Học viên Thực tập",
    keyInsights,
  };
}

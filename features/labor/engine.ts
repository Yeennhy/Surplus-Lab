import {
  LABOR_CONDITIONS,
  LABOR_SCENARIOS,
  ATTRIBUTE_QUIZ_QUESTIONS,
  VALUE_COMPONENTS,
  VALUE_COMPONENT_MATCHING_ITEMS,
} from "./constants";
import type {
  Chapter2State,
  Chapter2Result,
  ScenarioAnswer,
  ScenarioEvaluationResult,
  ValueComponentId,
  ValueComponentAnswer,
} from "./types";

export function createInitialState(): Chapter2State {
  return {
    currentStep: "intro",
    currentScenarioIndex: 0,
    scenarioAnswers: [],
    attributeQuizAnswers: {},
    valueComponentAnswers: [],
    completed: false,
    score: 0,
  };
}

export function getConditions() {
  return LABOR_CONDITIONS;
}

export function getScenarios() {
  return LABOR_SCENARIOS;
}

export function getScenarioById(id: string) {
  return LABOR_SCENARIOS.find((s) => s.id === id);
}

export function getAttributeQuestions() {
  return ATTRIBUTE_QUIZ_QUESTIONS;
}

export function getValueComponents() {
  return VALUE_COMPONENTS;
}

export function getValueMatchingItems() {
  return VALUE_COMPONENT_MATCHING_ITEMS;
}

/**
 * Evaluates a single scenario answer against historical reality
 */
export function evaluateScenario(
  scenarioId: string,
  userSaidFree: boolean,
  userSaidLacksMeans: boolean,
  userSaidIsCommodity: boolean
): ScenarioEvaluationResult {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }

  const condition1Correct = userSaidFree === scenario.hasPersonalFreedom;
  const condition2Correct = userSaidLacksMeans === scenario.lacksMeansOfProduction;
  const commodityConclusionCorrect = userSaidIsCommodity === scenario.isCommodity;

  const isCorrect = condition1Correct && condition2Correct && commodityConclusionCorrect;

  let feedback = "";
  if (isCorrect) {
    feedback = `Chính xác! ${scenario.overallExplanation}`;
  } else {
    const errorDetails: string[] = [];
    if (!condition1Correct) {
      errorDetails.push(
        `Điều kiện 1 (Tự do thân thể): ${scenario.freedomExplanation}`
      );
    }
    if (!condition2Correct) {
      errorDetails.push(
        `Điều kiện 2 (Không có tư liệu sản xuất): ${scenario.meansExplanation}`
      );
    }
    if (!commodityConclusionCorrect) {
      errorDetails.push(
        `Kết luận hàng hóa: Sức lao động ${
          scenario.isCommodity
            ? "LÀ hàng hóa vì đồng thời thỏa mãn cả hai điều kiện."
            : "KHÔNG PHẢI hàng hóa vì không thỏa mãn đủ cả hai điều kiện đồng thời."
        }`
      );
    }
    feedback = `Chưa chính xác! ${errorDetails.join(" • ")}`;
  }

  return {
    scenarioId,
    isCorrect,
    condition1Correct,
    condition2Correct,
    commodityConclusionCorrect,
    feedback,
  };
}

/**
 * Evaluates the quiz questions about the two attributes of labor power
 */
export function evaluateAttributeQuestions(
  userAnswers: Record<string, number>
): {
  score: number;
  total: number;
  results: Record<string, boolean>;
} {
  const questions = ATTRIBUTE_QUIZ_QUESTIONS;
  let correctCount = 0;
  const results: Record<string, boolean> = {};

  for (const q of questions) {
    const chosenIndex = userAnswers[q.id];
    const isCorrect = chosenIndex === q.correctOptionIndex;
    results[q.id] = isCorrect;
    if (isCorrect) {
      correctCount += 1;
    }
  }

  return {
    score: correctCount,
    total: questions.length,
    results,
  };
}

/**
 * Evaluates matching items for the 3 components of labor power value
 */
export function evaluateValueMatching(
  answers: Record<string, ValueComponentId>
): {
  score: number;
  total: number;
  results: Record<string, boolean>;
} {
  const items = VALUE_COMPONENT_MATCHING_ITEMS;
  let correctCount = 0;
  const results: Record<string, boolean> = {};

  for (const item of items) {
    const userChoice = answers[item.id];
    const isCorrect = userChoice === item.correctComponentId;
    results[item.id] = isCorrect;
    if (isCorrect) {
      correctCount += 1;
    }
  }

  return {
    score: correctCount,
    total: items.length,
    results,
  };
}

/**
 * Calculates final score and generates pedagogical summary
 */
export function getChapter2Result(
  scenarioAnswers: ScenarioAnswer[],
  attributeQuizAnswers: Record<string, number>,
  valueMatches: Record<string, ValueComponentId>
): Chapter2Result {
  // 1. Scenario score (weight: 40%)
  let scenarioCorrect = 0;
  for (const ans of scenarioAnswers) {
    const evalRes = evaluateScenario(
      ans.scenarioId,
      ans.userSaidFree,
      ans.userSaidLacksMeans,
      ans.userSaidIsCommodity
    );
    if (evalRes.isCorrect) scenarioCorrect += 1;
  }
  const totalScenarios = Math.max(1, scenarioAnswers.length);
  const scenarioPct = (scenarioCorrect / totalScenarios) * 40;

  // 2. Attribute score (weight: 30%)
  const attrRes = evaluateAttributeQuestions(attributeQuizAnswers);
  const attrPct = (attrRes.score / attrRes.total) * 30;

  // 3. Value Component score (weight: 30%)
  const valueRes = evaluateValueMatching(valueMatches);
  const valuePct = (valueRes.score / valueRes.total) * 30;

  const totalScore = Math.round(scenarioPct + attrPct + valuePct);

  let stars: 1 | 2 | 3 = 1;
  if (totalScore >= 85) {
    stars = 3;
  } else if (totalScore >= 60) {
    stars = 2;
  }

  const passed = totalScore >= 60;

  const keyInsights = [
    "Sức lao động chỉ trở thành hàng hóa khi người lao động ĐỒNG THỜI được tự do thân thể và bị tước đoạt tư liệu sản xuất.",
    "Giá trị của hàng hóa sức lao động gồm 3 bộ phận: tư liệu sinh hoạt cho bản thân, chi phí đào tạo nghề, và chi phí nuôi con cái (thế hệ kế cận).",
    "Giá trị sử dụng đặc biệt: Trong quá trình sử dụng, sức lao động tạo ra giá trị mới (v + m) lớn hơn giá trị của chính nó – đây là nguồn gốc duy nhất của giá trị thặng dư.",
  ];

  return {
    score: totalScore,
    totalQuestions: totalScenarios + attrRes.total + valueRes.total,
    stars,
    passed,
    scenarioScore: scenarioCorrect,
    attributeScore: attrRes.score,
    valueCompScore: valueRes.score,
    badgeTitle:
      stars === 3
        ? "Chuyên gia Kinh tế Chính trị Xuất sắc"
        : stars === 2
        ? "Nhà Phân tích Lao động Đạt chuẩn"
        : "Người Học Việc Nỗ lực",
    keyInsights,
  };
}

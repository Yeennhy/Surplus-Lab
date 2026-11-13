import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const requireTs = createRequire(import.meta.url);

requireTs.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const {
  evaluateScenario,
  evaluateAttributeQuestions,
  evaluateValueMatching,
  getChapter2Result,
  getConditions,
  getScenarios,
  getValueComponents,
} = requireTs("../backend/domain/labor/engine.ts");

const {
  TEXTBOOK_NUMBERS,
} = requireTs("../backend/domain/value/constants.ts");

const {
  evaluatePlacement,
  validateAllPlacements,
  calculateZoneTotals,
  validateFormula,
  generateResult,
} = requireTs("../backend/domain/value/engine.ts");

// ==========================================
// TEST SUITE: M6 - CHAPTER 2 (LABOR POWER)
// ==========================================

test("M6.Ch2 - 1. Conditions: Exactly two historical conditions are defined", () => {
  const conditions = getConditions();
  assert.equal(conditions.length, 2);
  assert.equal(conditions[0].id, "personal_freedom");
  assert.equal(conditions[1].id, "lacks_means_of_production");
});

test("M6.Ch2 - 2. Scenarios: At least 3 scenarios provided with rich historical context", () => {
  const scenarios = getScenarios();
  assert.ok(scenarios.length >= 3, "Must have at least 3 scenarios");
  assert.ok(scenarios.some((s) => s.id === "scenario_factory_worker"));
  assert.ok(scenarios.some((s) => s.id === "scenario_roman_slave"));
  assert.ok(scenarios.some((s) => s.id === "scenario_independent_farmer"));
});

test("M6.Ch2 - 3. Scenario Evaluation: Factory worker satisfies both conditions", () => {
  const result = evaluateScenario("scenario_factory_worker", true, true, true);
  assert.equal(result.isCorrect, true);
  assert.equal(result.condition1Correct, true);
  assert.equal(result.condition2Correct, true);
  assert.equal(result.commodityConclusionCorrect, true);
});

test("M6.Ch2 - 4. Scenario Evaluation: Roman slave lacks personal freedom", () => {
  // Correct evaluation
  const resultCorrect = evaluateScenario("scenario_roman_slave", false, true, false);
  assert.equal(resultCorrect.isCorrect, true);
  assert.equal(resultCorrect.condition1Correct, true);

  // Incorrect evaluation where user incorrectly said slave is personally free
  const resultWrong = evaluateScenario("scenario_roman_slave", true, true, true);
  assert.equal(resultWrong.isCorrect, false);
  assert.ok(resultWrong.feedback.includes("Tự do thân thể"));
});

test("M6.Ch2 - 5. Scenario Evaluation: Independent farmer owns means of production", () => {
  const result = evaluateScenario("scenario_independent_farmer", true, false, false);
  assert.equal(result.isCorrect, true);
  assert.equal(result.condition2Correct, true);
  assert.equal(result.commodityConclusionCorrect, true);
});

test("M6.Ch2 - 6. Attributes: Evaluates value vs use value understanding", () => {
  const allCorrectAnswers = {
    attr_q1: 1, // Socially necessary labor time
    attr_q2: 2, // Creates greater value than itself
    attr_q3: 0, // Moral and historical element
    attr_q4: 0, // 15 USD in first 4 hours
  };
  const evalRes = evaluateAttributeQuestions(allCorrectAnswers);
  assert.equal(evalRes.score, 4);
  assert.equal(evalRes.total, 4);
});

test("M6.Ch2 - 7. Value Components: Exactly 3 components defined and verified", () => {
  const components = getValueComponents();
  assert.equal(components.length, 3);
  assert.ok(components.some((c) => c.id === "living_costs"));
  assert.ok(components.some((c) => c.id === "training_costs"));
  assert.ok(components.some((c) => c.id === "child_rearing"));

  const matches = {
    match_1: "living_costs",
    match_2: "training_costs",
    match_3: "child_rearing",
    match_4: "living_costs",
    match_5: "training_costs",
  };
  const matchRes = evaluateValueMatching(matches);
  assert.equal(matchRes.score, 5);
  assert.equal(matchRes.total, 5);
});

test("M6.Ch2 - 8. Chapter 2 Result: Calculates score, stars and badge title", () => {
  const answers = [
    { scenarioId: "scenario_factory_worker", userSaidFree: true, userSaidLacksMeans: true, userSaidIsCommodity: true },
    { scenarioId: "scenario_roman_slave", userSaidFree: false, userSaidLacksMeans: true, userSaidIsCommodity: false },
    { scenarioId: "scenario_independent_farmer", userSaidFree: true, userSaidLacksMeans: false, userSaidIsCommodity: false },
  ];
  const attrAnswers = { attr_q1: 1, attr_q2: 2, attr_q3: 0, attr_q4: 0 };
  const matches = {
    match_1: "living_costs",
    match_2: "training_costs",
    match_3: "child_rearing",
    match_4: "living_costs",
    match_5: "training_costs",
  };

  const finalRes = getChapter2Result(answers, attrAnswers, matches);
  assert.equal(finalRes.score, 100);
  assert.equal(finalRes.stars, 3);
  assert.equal(finalRes.passed, true);
  assert.ok(finalRes.keyInsights.length >= 3);
});

// ==========================================
// TEST SUITE: M6 - CHAPTER 4 (ANATOMY OF VALUE)
// ==========================================

test("M6.Ch4 - 1. Invariants: Textbook numbers match exactly (c=106, v=15, m=15, G=136)", () => {
  assert.equal(TEXTBOOK_NUMBERS.COTTON_USD, 100);
  assert.equal(TEXTBOOK_NUMBERS.MACHINE_DEPRECIATION_USD, 6);
  assert.equal(TEXTBOOK_NUMBERS.C_TOTAL_USD, 106);
  assert.equal(TEXTBOOK_NUMBERS.V_TOTAL_USD, 15);
  assert.equal(TEXTBOOK_NUMBERS.M_TOTAL_USD, 15);
  assert.equal(TEXTBOOK_NUMBERS.ADVANCE_CAPITAL_USD, 121);
  assert.equal(TEXTBOOK_NUMBERS.TOTAL_PRODUCT_VALUE_G_USD, 136);
});

test("M6.Ch4 - 2. Classification: Constant capital c (cotton and machine depreciation)", () => {
  const cottonFeedback = evaluatePlacement("card_cotton", "c");
  assert.equal(cottonFeedback.isCorrect, true);

  const machineFeedback = evaluatePlacement("card_machine", "c");
  assert.equal(machineFeedback.isCorrect, true);
});

test("M6.Ch4 - 3. Classification: Variable capital v (labor power)", () => {
  const laborFeedback = evaluatePlacement("card_labor", "v");
  assert.equal(laborFeedback.isCorrect, true);
});

test("M6.Ch4 - 4. CRITICAL ACCEPTANCE: m is NOT advance capital, warns on misclassification", () => {
  // Correct placement of m
  const surplusCorrect = evaluatePlacement("card_surplus", "m");
  assert.equal(surplusCorrect.isCorrect, true);
  assert.equal(surplusCorrect.isMisclassifiedAdvanceCapital, false);

  // Placing m into constant capital (c) or variable capital (v) MUST trigger warning
  const surplusIntoC = evaluatePlacement("card_surplus", "c");
  assert.equal(surplusIntoC.isCorrect, false);
  assert.equal(surplusIntoC.isMisclassifiedAdvanceCapital, true);
  assert.ok(surplusIntoC.message.includes("KHÔNG PHẢI tư bản do nhà tư bản bỏ ra ban đầu"));

  const surplusIntoV = evaluatePlacement("card_surplus", "v");
  assert.equal(surplusIntoV.isCorrect, false);
  assert.equal(surplusIntoV.isMisclassifiedAdvanceCapital, true);
});

test("M6.Ch4 - 5. Validation: Validates all 4 cards placed and zone totals", () => {
  const placements = {
    card_cotton: "c",
    card_machine: "c",
    card_labor: "v",
    card_surplus: "m",
  };
  const valRes = validateAllPlacements(placements);
  assert.equal(valRes.isAllPlaced, true);
  assert.equal(valRes.isAllCorrect, true);
  assert.equal(valRes.correctCount, 4);

  const totals = calculateZoneTotals(placements);
  assert.equal(totals.c.totalUSD, 106);
  assert.equal(totals.c.cardCount, 2);
  assert.equal(totals.v.totalUSD, 15);
  assert.equal(totals.v.cardCount, 1);
  assert.equal(totals.m.totalUSD, 15);
  assert.equal(totals.m.cardCount, 1);
});

test("M6.Ch4 - 6. Formula: Validates G = c + (v + m) = 106 + 30 = 136", () => {
  const correctFormula = validateFormula(106, 15, 15);
  assert.equal(correctFormula.isFullyCorrect, true);
  assert.equal(correctFormula.totalG, 136);

  const incorrectFormula = validateFormula(100, 15, 15);
  assert.equal(incorrectFormula.isFullyCorrect, false);
  assert.equal(incorrectFormula.cCorrect, false);
});

test("M6.Ch4 - 7. Result: Generates 3-star result with key takeaways", () => {
  const result = generateResult({
    currentStep: "summary",
    placements: {},
    completed: true,
    score: 100,
    mistakes: 0,
  });

  assert.equal(result.score, 100);
  assert.equal(result.stars, 3);
  assert.equal(result.passed, true);
  assert.equal(result.totalG, 136);
  assert.ok(result.keyInsights.some((ins) => ins.includes("G = c + (v + m) = 106 + 30 = 136 USD")));
});

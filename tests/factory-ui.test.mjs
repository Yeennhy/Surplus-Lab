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
  EMPTY_FACTORY_SETUP,
  FactoryInputError,
  TEXTBOOK_FACTORY_CONFIG,
  calculateFactoryResult,
  calculateFactorySnapshot,
  getFactorySnapshot,
  startFactory,
  validateFactoryConfig,
  validateFactorySetup,
} = requireTs("../backend/domain/factory/engine.ts");

const {
  TEXTBOOK_SANDBOX_CONFIG,
  calculateSandbox,
  compareSandbox,
  resetSandboxConfig,
  validateSandboxConfig,
} = requireTs("../backend/domain/sandbox/engine.ts");

const readySetup = { cottonReady: true, machineReady: true, laborHired: true };

test("1. Setup requires all 3 resources (cotton, machine, labor)", () => {
  const issues = validateFactorySetup(EMPTY_FACTORY_SETUP);
  assert.equal(issues.length, 3);
  assert.deepEqual(validateFactorySetup(readySetup), []);

  assert.throws(
    () => startFactory(TEXTBOOK_FACTORY_CONFIG, { ...readySetup, laborHired: false }),
    (error) =>
      error instanceof FactoryInputError &&
      error.issues.some((issue) => issue.field === "laborHired")
  );

  const startSnapshot = startFactory(TEXTBOOK_FACTORY_CONFIG, readySetup);
  assert.equal(startSnapshot.productValue, 0);
  assert.equal(startSnapshot.phase, "ready");
});

test("2. Hour 0 snapshot: 121 USD committed, no product value yet", () => {
  const state = calculateFactorySnapshot(0, TEXTBOOK_FACTORY_CONFIG);
  assert.equal(state.capitalAdvancedTotal, 121);
  assert.equal(state.capitalUsedThroughHour, 0);
  assert.equal(state.newValue, 0);
  assert.equal(state.variableCapital, 0);
  assert.equal(state.constantCapital, 0);
  assert.equal(state.surplusValue, 0);
  assert.equal(state.productValue, 0);
  assert.equal(state.phase, "ready");
  assert.equal(state.isCheckpoint, false);
  assert.equal(state.isComplete, false);
});

test("3. Hour 4 checkpoint: reproduces labor power (v = 15 USD), surplus value m = 0", () => {
  const state = calculateFactorySnapshot(4, TEXTBOOK_FACTORY_CONFIG);
  assert.equal(state.cottonUsed, 50);
  assert.equal(state.machineDepreciation, 3);
  assert.equal(state.constantCapital, 53);
  assert.equal(state.newValue, 15);
  assert.equal(state.variableCapital, 15);
  assert.equal(state.surplusValue, 0);
  assert.equal(state.productValue, 68);
  assert.equal(state.capitalUsedThroughHour, 68);
  assert.equal(state.phase, "checkpoint");
  assert.equal(state.isCheckpoint, true);
  assert.equal(state.isNecessaryLabor, true);
  assert.equal(state.isSurplusLabor, false);
});

test("4. Hour 8 completion: G = 136 USD, c = 106 USD, v = 15 USD, m = 15 USD", () => {
  const result = calculateFactoryResult(TEXTBOOK_FACTORY_CONFIG);
  assert.equal(result.constantCapital, 106);
  assert.equal(result.variableCapital, 15);
  assert.equal(result.newValue, 30);
  assert.equal(result.surplusValue, 15);
  assert.equal(result.productValue, 136);
  assert.equal(result.capitalAdvancedTotal, 121);
  assert.equal(result.necessaryHours, 4);
  assert.equal(result.surplusHours, 4);
  assert.equal(result.rateOfSurplusValue, 100);
  assert.equal(result.completion.phase, "complete");
  assert.equal(result.completion.isComplete, true);
});

test("5. Intermediate hours (e.g. 6h) distinguish actual accrued output from Figma illustration", () => {
  const state = calculateFactorySnapshot(6, TEXTBOOK_FACTORY_CONFIG);
  assert.equal(state.constantCapital, 79.5);
  assert.equal(state.newValue, 22.5);
  assert.equal(state.surplusValue, 7.5);
  assert.equal(state.productValue, 102);
  assert.equal(state.illustrativeFullInputValue, 128.5); // Frame Figma 63:11686
  assert.equal(state.phase, "surplus-labor");
  assert.equal(state.isInterpolated, true);
});

test("6. Economic invariants hold at all hours [0, 8]", () => {
  let prevProductValue = -1;
  for (let hour = 0; hour <= 8; hour += 0.25) {
    const state = calculateFactorySnapshot(hour, TEXTBOOK_FACTORY_CONFIG);
    // G = c + newValue
    assert.ok(Math.abs(state.productValue - (state.constantCapital + state.newValue)) < 1e-6);
    // c = cottonUsed + machineDepreciation
    assert.ok(Math.abs(state.constantCapital - (state.cottonUsed + state.machineDepreciation)) < 1e-6);
    // m >= 0
    assert.ok(state.surplusValue >= 0);
    // Monotonic growth of product value
    assert.ok(state.productValue >= prevProductValue);
    prevProductValue = state.productValue;
  }
});

test("7. Validation rejects negative values, NaN, and invalid hours", () => {
  const invalid = {
    ...TEXTBOOK_FACTORY_CONFIG,
    cottonTotal: -10,
    depreciationTotal: Number.NaN,
    laborPowerValue: Number.POSITIVE_INFINITY,
    totalHours: 0,
  };
  const issues = validateFactoryConfig(invalid);
  assert.ok(issues.some((i) => i.field === "cottonTotal"));
  assert.ok(issues.some((i) => i.field === "depreciationTotal"));
  assert.ok(issues.some((i) => i.field === "totalHours"));

  // Check necessaryHours > totalHours
  assert.ok(
    validateFactoryConfig({ ...TEXTBOOK_FACTORY_CONFIG, necessaryHours: 10 }).some(
      (i) => i.field === "necessaryHours"
    )
  );

  // Throws on getFactorySnapshot when hour is out of range
  assert.throws(() => getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, -1), FactoryInputError);
  assert.throws(() => getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 10), FactoryInputError);
});

test("8. Sandbox engine: calculates custom parameters, comparisons, and presets", () => {
  // Baseline textbook preset
  const baseResult = calculateSandbox(TEXTBOOK_SANDBOX_CONFIG);
  assert.equal(baseResult.constantCapital, 106);
  assert.equal(baseResult.variableCapital, 15);
  assert.equal(baseResult.surplusValue, 15);
  assert.equal(baseResult.productValue, 136);
  assert.equal(baseResult.rateOfSurplusValue, 100);

  // Extended workday scenario (10 hours, 4h necessary -> 6h surplus)
  const extendedResult = calculateSandbox({
    ...TEXTBOOK_SANDBOX_CONFIG,
    totalHours: 10,
  });
  assert.equal(extendedResult.surplusHours, 6);
  assert.equal(extendedResult.surplusValue, 22.5); // 6 * 3.75
  assert.equal(extendedResult.newValue, 37.5); // 10 * 3.75
  assert.equal(extendedResult.rateOfSurplusValue, 150); // (22.5 / 15) * 100%

  // Comparison
  const comparison = compareSandbox({
    ...TEXTBOOK_SANDBOX_CONFIG,
    totalHours: 10,
  });
  assert.equal(comparison.diffSurplusValue, 7.5);
  assert.equal(comparison.diffRateOfSurplusValue, 50);

  // Validation
  const errors = validateSandboxConfig({
    ...TEXTBOOK_SANDBOX_CONFIG,
    necessaryHours: 12,
    totalHours: 8,
  });
  assert.ok(errors.length > 0);

  // Reset
  const resetConfig = resetSandboxConfig();
  assert.deepEqual(resetConfig, TEXTBOOK_SANDBOX_CONFIG);
});

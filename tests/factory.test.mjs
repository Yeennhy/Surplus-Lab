import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const requireTs = createRequire(import.meta.url);

// TypeScript is already a dev dependency. This small hook keeps tests working
// on the project's Node 20 baseline without adding another runtime package.
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
  getFactoryResult,
  getFactorySnapshot,
  startFactory,
  validateFactoryConfig,
  validateFactorySetup,
} = requireTs("../features/factory/engine.ts");

const readySetup = { cottonReady: true, machineReady: true, laborHired: true };

test("textbook setup requires all three resources", () => {
  assert.equal(validateFactorySetup(EMPTY_FACTORY_SETUP).length, 3);
  assert.deepEqual(validateFactorySetup(readySetup), []);
  assert.throws(
    () => startFactory(TEXTBOOK_FACTORY_CONFIG, { ...readySetup, laborHired: false }),
    (error) =>
      error instanceof FactoryInputError &&
      error.issues.some((issue) => issue.field === "laborHired"),
  );
  assert.equal(startFactory(TEXTBOOK_FACTORY_CONFIG, readySetup).productValue, 0);
});

test("hour zero has 121 USD committed but no output", () => {
  const state = getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 0);
  assert.equal(state.capitalAdvancedTotal, 121);
  assert.equal(state.capitalUsedThroughHour, 0);
  assert.equal(state.newValue, 0);
  assert.equal(state.variableCapital, 0);
  assert.equal(state.productValue, 0);
  assert.equal(state.phase, "ready");
});

test("hour four reproduces labor power without surplus", () => {
  const state = getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 4);
  assert.equal(state.cottonTransferred, 50);
  assert.equal(state.machineTransferred, 3);
  assert.equal(state.transferredValue, 53);
  assert.equal(state.newValue, 15);
  assert.equal(state.variableCapital, 15);
  assert.equal(state.surplusValue, 0);
  assert.equal(state.productValue, 68);
  assert.equal(state.capitalUsedThroughHour, 68);
  assert.equal(state.phase, "checkpoint");
  assert.equal(state.isCheckpoint, true);
  assert.equal(state.isInterpolated, false);
});

test("hour eight completes the textbook result without paying labor twice", () => {
  const result = getFactoryResult(TEXTBOOK_FACTORY_CONFIG);
  assert.equal(result.constantCapital, 106);
  assert.equal(result.variableCapital, 15);
  assert.equal(result.newValue, 30);
  assert.equal(result.surplusValue, 15);
  assert.equal(result.productValue, 136);
  assert.equal(result.capitalAdvancedTotal, 121);
  assert.equal(result.necessaryHours, 4);
  assert.equal(result.surplusHours, 4);
  assert.equal(result.completion.capitalUsedThroughHour, 121);
  assert.equal(result.completion.phase, "complete");
  assert.equal(result.completion.isComplete, true);
});

test("intermediate-hour numbers distinguish actual output from the Figma illustration", () => {
  const state = getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 6);
  assert.equal(state.transferredValue, 79.5);
  assert.equal(state.newValue, 22.5);
  assert.equal(state.surplusValue, 7.5);
  assert.equal(state.productValue, 102);
  assert.equal(state.illustrativeFullInputValue, 128.5);
  assert.equal(state.phase, "surplus-labor");
  assert.equal(state.isInterpolated, true);
});

test("all valid hours preserve value identities and never mutate the preset", () => {
  const original = { ...TEXTBOOK_FACTORY_CONFIG };
  let previousProductValue = -1;
  for (let hour = 0; hour <= 8; hour += 0.25) {
    const state = getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, hour);
    assert.ok(Math.abs(state.transferredValue - state.cottonTransferred - state.machineTransferred) < 1e-9);
    assert.ok(Math.abs(state.newValue - state.variableCapital - state.surplusValue) < 1e-9);
    assert.ok(Math.abs(state.productValue - state.transferredValue - state.newValue) < 1e-9);
    assert.ok(state.productValue >= previousProductValue);
    assert.ok(state.surplusValue >= 0);
    previousProductValue = state.productValue;
  }
  assert.deepEqual(TEXTBOOK_FACTORY_CONFIG, original);
  assert.deepEqual(getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 3), getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, 3));
});

test("invalid money, hours and inconsistent checkpoints are rejected", () => {
  const invalid = {
    ...TEXTBOOK_FACTORY_CONFIG,
    cottonValue: -1,
    machineDepreciation: Number.NaN,
    laborPowerValue: Number.POSITIVE_INFINITY,
    totalHours: 0,
  };
  const issues = validateFactoryConfig(invalid);
  assert.deepEqual(
    new Set(issues.map((issue) => issue.field)),
    new Set(["cottonValue", "machineDepreciation", "laborPowerValue", "totalHours", "necessaryHours"]),
  );
  assert.ok(validateFactoryConfig({ ...TEXTBOOK_FACTORY_CONFIG, necessaryHours: 9 }).length > 0);
  assert.ok(validateFactoryConfig({ ...TEXTBOOK_FACTORY_CONFIG, laborPowerValue: 14 }).some(
    (issue) => issue.code === "inconsistent-necessary-hours",
  ));
  for (const hour of [-1, 9, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => getFactorySnapshot(TEXTBOOK_FACTORY_CONFIG, hour), FactoryInputError);
  }
});

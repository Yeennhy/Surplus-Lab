import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const requireTs = createRequire(import.meta.url);
requireTs.extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const { LABOR_SCENARIOS, LABOR_POWER_VALUE_PARTS, evaluateLaborScenario } =
  requireTs("../features/labor/index.ts");
const { getValueItems, evaluateValuePlacements } = requireTs("../features/value/index.ts");
const { TEXTBOOK_FACTORY_CONFIG, getFactoryResult } = requireTs("../features/factory/engine.ts");

test("only the employed worker satisfies both labor-power conditions", () => {
  assert.equal(LABOR_SCENARIOS.length, 3);
  assert.deepEqual(LABOR_SCENARIOS.map((scenario) => evaluateLaborScenario(scenario).qualifies), [false, true, false]);
  assert.equal(LABOR_POWER_VALUE_PARTS.length, 3);
  assert.equal(evaluateLaborScenario(LABOR_SCENARIOS[0]).secondConditionMet, false);
  assert.equal(evaluateLaborScenario(LABOR_SCENARIOS[2]).firstConditionMet, false);
});

test("cotton and machine belong to c, labor to v, and surplus to m", () => {
  const items = getValueItems(getFactoryResult(TEXTBOOK_FACTORY_CONFIG));
  assert.deepEqual(items.map((item) => [item.id, item.group, item.amount]), [
    ["cotton", "c", 100],
    ["machine", "c", 6],
    ["labor", "v", 15],
    ["surplus", "m", 15],
  ]);
  assert.equal(evaluateValuePlacements(items, { cotton: "c", machine: "c", labor: "v", surplus: "m" }).correct, true);
  const wrong = evaluateValuePlacements(items, { cotton: "c", machine: "v", labor: "v", surplus: "c" });
  assert.deepEqual(wrong.wrongItems, ["machine", "surplus"]);
  assert.equal(wrong.complete, true);
  const partial = evaluateValuePlacements(items, { cotton: "c" });
  assert.equal(partial.complete, false);
  assert.deepEqual(partial.missingItems, ["machine", "labor", "surplus"]);
});

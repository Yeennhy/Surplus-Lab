import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const requireTs = createRequire(import.meta.url);
requireTs.extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }, fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const labor = requireTs("../backend/domain/labor/index.ts");
const factory = requireTs("../backend/domain/factory/gameplay.ts");
const value = requireTs("../backend/domain/value/index.ts");
const engine = requireTs("../backend/domain/factory/engine.ts");

test("chapter 2 requires both conditions and retains a precise contradiction", () => {
  const correct = {
    a: { freeToSellLabor: true, lacksProductionMeans: false },
    b: { freeToSellLabor: true, lacksProductionMeans: true },
    c: { freeToSellLabor: false, lacksProductionMeans: true },
  };
  assert.equal(labor.evaluateEvidenceGrid(correct).correct, true);
  const mistaken = { ...correct, a: { ...correct.a, lacksProductionMeans: true } };
  assert.deepEqual(labor.evaluateEvidenceGrid(mistaken).wrong, [{ id: "a", condition: "lacksProductionMeans" }]);
  assert.equal(labor.evaluateEvidenceGrid({ b: correct.b }).complete, false);
  assert.deepEqual(labor.evaluateLaborValueFile(["living", "training", "children"]).correct, true);
  assert.deepEqual(labor.evaluateLaborValueFile(["living", "training", "machine"]).decoys, ["machine"]);
});

test("chapter 3 uses one 8-hour contract across two 4-hour batches", () => {
  const first = { cotton: 50, depreciation: 3, laborCharge: 15 };
  const second = { cotton: 50, depreciation: 3, laborCharge: 0 };
  assert.deepEqual(factory.validateBatchPlan(first, 1), []);
  assert.deepEqual(factory.validateBatchPlan(second, 2), []);
  assert.deepEqual(factory.validateBatchPlan({ ...second, laborCharge: 15 }, 2).map((issue) => issue.code), ["duplicate-wage"]);
  assert.deepEqual(factory.validateBatchPlan({ ...first, cotton: 0 }, 1).map((issue) => issue.code), ["cotton"]);
  const ledger = factory.getShiftLedger();
  assert.deepEqual(ledger.batches.map((batch) => [batch.productValue, batch.laborCharge, batch.surplusAtEnd]), [[68, 15, 0], [68, 0, 15]]);
  assert.deepEqual(ledger.totals, { c: 106, v: 15, m: 15, capitalAdvanced: 121, productValue: 136 });
});

test("trial run diagnoses the first physically blocked station", () => {
  const empty = { openedCotton: false, fiberToRollers: false, rollersToWorker: false, workerToSpool: false };
  assert.equal(factory.diagnoseLine(empty).station, "opener");
  assert.equal(factory.diagnoseLine({ ...empty, openedCotton: true }).station, "rollers");
  assert.equal(factory.diagnoseLine({ ...empty, openedCotton: true, fiberToRollers: true }).station, "worker");
  assert.equal(factory.diagnoseLine({ ...empty, openedCotton: true, fiberToRollers: true, rollersToWorker: true }).station, "spool");
  assert.equal(factory.diagnoseLine({ openedCotton: true, fiberToRollers: true, rollersToWorker: true, workerToSpool: true }), null);
  const plan = { cotton: 50, depreciation: 3, laborCharge: 15 };
  const blocked = factory.simulateBatch(plan, { ...empty, openedCotton: true, fiberToRollers: true }, 1);
  assert.deepEqual(blocked.events.map((event) => event.type), ["COTTON_ALLOCATED", "FIBERS_SPLIT", "MACHINE_SPINNING", "LINE_BLOCKED"]);
  const finished = factory.simulateBatch(plan, { openedCotton: true, fiberToRollers: true, rollersToWorker: true, workerToSpool: true }, 1);
  assert.equal(finished.ready, true);
  assert.equal(finished.events.at(-1).type, "TRIAL_PASSED");
});

test("chapter 4 needs source evidence, a balanced ledger, audit proof and an ordered conclusion", () => {
  const result = engine.getFactoryResult(engine.TEXTBOOK_FACTORY_CONFIG);
  const items = value.getValueItems(result);
  assert.equal(value.evaluateValueEvidence({ cotton: "batches", machine: "machine-invoice", labor: "contract", surplus: "second-half" }).correct, true);
  assert.deepEqual(value.evaluateValueEvidence({ cotton: "batches", machine: "contract", labor: "contract", surplus: "second-half" }).wrong, ["machine"]);
  const placed = value.calculatePlacedLedger(items, { cotton: "c", machine: "c", labor: "v", surplus: "m" });
  assert.deepEqual(placed, { c: 106, v: 15, m: 15, capitalAdvanced: 121, productValue: 136 });
  assert.equal(value.evaluateAuditEvidence({ machine: "machine-invoice", wage: "contract", advance: "second-half" }).correct, true);
  assert.deepEqual(value.evaluateAuditEvidence({ machine: "contract", wage: "contract", advance: "second-half" }).wrong, ["machine"]);
  assert.equal(value.evaluateProofChain(["old-transfer", "new-labor", "surplus-after-v"]).correct, true);
  assert.equal(value.evaluateProofChain(["new-labor", "old-transfer", "surplus-after-v"]).correct, false);
});

import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const requireTs = createRequire(import.meta.url);
requireTs.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  module._compile(output.outputText, filename);
};
const { createMarket, DEFAULT_MARKET_CONFIG, getMarketTotals, runMarketTicks } = requireTs("../backend/domain/market/engine.ts");

test("100-bot market conserves money, goods, and reference value across changing prices", () => {
  const initial = createMarket();
  const totals = getMarketTotals(initial);
  let state = initial;
  for (const margin of [-0.5, 0, 0.5]) {
    state = runMarketTicks(state, { ...DEFAULT_MARKET_CONFIG, tradeProbability: 1, priceMargin: margin }, 60);
    assert.deepEqual(getMarketTotals(state), totals);
    assert.ok(state.bots.every((bot) => bot.money >= 0 && bot.inventory.essential >= 0 && bot.inventory["non-essential"] >= 0));
  }
  assert.equal(initial.tradeCount, 0);
  assert.ok(state.tradeCount > 0);
  assert.ok(state.transactionHistory.length <= 12);
});

test("market is reproducible, can pause with zero ticks, and validates controls", () => {
  const a = createMarket(DEFAULT_MARKET_CONFIG, 42);
  const b = createMarket(DEFAULT_MARKET_CONFIG, 42);
  assert.deepEqual(runMarketTicks(a, DEFAULT_MARKET_CONFIG, 5), runMarketTicks(b, DEFAULT_MARKET_CONFIG, 5));
  assert.deepEqual(runMarketTicks(a, DEFAULT_MARKET_CONFIG, 0), a);
  assert.throws(() => runMarketTicks(a, { ...DEFAULT_MARKET_CONFIG, tradeProbability: 1.1 }), RangeError);
  assert.throws(() => runMarketTicks(a, { ...DEFAULT_MARKET_CONFIG, priceMargin: -0.6 }), RangeError);
  assert.throws(() => createMarket({ ...DEFAULT_MARKET_CONFIG, botCount: 1 }), RangeError);
});

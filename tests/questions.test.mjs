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

const { questions } = requireTs("../backend/content/questions.ts");

test("ngân hàng thử thách đủ rộng và mọi câu có đáp án, lời giải hợp lệ", () => {
  assert.ok(questions.length >= 40);
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
  assert.ok(questions.some((question) => question.type === "numeric"));
  assert.ok(questions.some((question) => question.type === "choice"));
  for (const question of questions) {
    assert.ok(question.prompt.length > 30, question.id);
    assert.ok(question.explanation.length >= 2, question.id);
    if (question.type === "choice") {
      assert.equal(question.choices.length, 4, question.id);
      assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4, question.id);
      assert.ok(question.choices.some((choice) => choice.id === question.correctAnswer), question.id);
    } else {
      assert.ok(Number.isFinite(question.correctAnswer), question.id);
    }
  }
});

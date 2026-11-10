"use client";

import { useState } from "react";
import type { LaborScenario, ScenarioAnswer } from "@/features/labor/types";
import { evaluateScenario } from "@/features/labor/engine";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ScenarioInteractiveProps {
  scenarios: LaborScenario[];
  currentIndex?: number;
  onAnswerSubmitted: (answer: ScenarioAnswer) => void;
  onFinishAllScenarios: () => void;
}

export function ScenarioInteractive({
  scenarios,
  onAnswerSubmitted,
  onFinishAllScenarios,
}: ScenarioInteractiveProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<
    Record<
      string,
      {
        userSaidFree?: boolean;
        userSaidLacksMeans?: boolean;
        userSaidIsCommodity?: boolean;
        evaluated?: boolean;
      }
    >
  >({});

  const currentScenario = scenarios[selectedIdx] || scenarios[0];
  const currentAnswer = answers[currentScenario.id] || {};

  const handleToggleFree = (val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: {
        ...prev[currentScenario.id],
        userSaidFree: val,
        evaluated: false,
      },
    }));
  };

  const handleToggleMeans = (val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: {
        ...prev[currentScenario.id],
        userSaidLacksMeans: val,
        evaluated: false,
      },
    }));
  };

  const handleToggleCommodity = (val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: {
        ...prev[currentScenario.id],
        userSaidIsCommodity: val,
        evaluated: false,
      },
    }));
  };

  const handleCheck = () => {
    if (
      currentAnswer.userSaidFree === undefined ||
      currentAnswer.userSaidLacksMeans === undefined ||
      currentAnswer.userSaidIsCommodity === undefined
    ) {
      alert("Vui lòng trả lời đủ cả 3 câu hỏi trước khi kiểm tra!");
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: {
        ...prev[currentScenario.id],
        evaluated: true,
      },
    }));

    onAnswerSubmitted({
      scenarioId: currentScenario.id,
      userSaidFree: currentAnswer.userSaidFree,
      userSaidLacksMeans: currentAnswer.userSaidLacksMeans,
      userSaidIsCommodity: currentAnswer.userSaidIsCommodity,
    });
  };

  const evalResult =
    currentAnswer.evaluated &&
    currentAnswer.userSaidFree !== undefined &&
    currentAnswer.userSaidLacksMeans !== undefined &&
    currentAnswer.userSaidIsCommodity !== undefined
      ? evaluateScenario(
          currentScenario.id,
          currentAnswer.userSaidFree,
          currentAnswer.userSaidLacksMeans,
          currentAnswer.userSaidIsCommodity
        )
      : null;

  const totalAnswered = Object.values(answers).filter((a) => a.evaluated).length;
  const isAllAnswered = totalAnswered >= 3;

  return (
    <div className="space-y-8">
      {/* Scenario Navigation Carousel Cards (Matching Figma Screen 05) */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <span className="rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase">
              Thử nghiệm thực tế
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2c1e13] mt-2">
              Khảo sát các trường hợp lịch sử
            </h2>
          </div>
          <div className="font-serif text-xs font-bold text-[#7a6448]">
            Đã hoàn thành: {totalAnswered} / {scenarios.length} nhân vật (Yêu cầu ≥ 3)
          </div>
        </div>

        {/* 3 Character Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {scenarios.slice(0, 3).map((sc, idx) => {
            const isSelected = selectedIdx === idx;
            const isDone = answers[sc.id]?.evaluated;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedIdx(idx)}
                className={cn(
                  "relative flex flex-col items-center rounded-2xl border-2 p-5 text-center transition-all cursor-pointer shadow-sm",
                  isSelected
                    ? "border-[#541f1a] bg-[#fff9eb] ring-2 ring-[#d4a359]"
                    : "border-[#c8b79b] bg-[#fbf5e6] hover:bg-[#fff9eb] hover:border-[#8a7253]"
                )}
              >
                {isDone && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2d4d3a] text-white text-[10px] font-bold">
                    ✓
                  </span>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8a7253] bg-[#f7eed7] text-3xl shadow-inner mb-3">
                  {sc.character.avatarIcon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#2c1e13]">
                  {sc.character.name}
                </h3>
                <span className="text-xs text-[#8c352d] font-semibold mt-0.5">
                  {sc.character.role}
                </span>
                <span className="text-[11px] text-[#7a6448] mt-1">
                  {sc.character.era}
                </span>

                <div className="mt-4 w-full">
                  <span
                    className={cn(
                      "inline-block w-full rounded-lg border px-3 py-1.5 font-serif text-xs font-bold tracking-wider uppercase transition",
                      isSelected
                        ? "border-[#541f1a] bg-[#802f28] text-white"
                        : "border-[#8a7253] bg-[#e6d8ba] text-[#4a3826]"
                    )}
                  >
                    {isSelected ? "Đang khảo sát" : "Chọn nhân vật"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Character Detail & Interactive Questions */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row gap-6 items-start border-b border-[#e2d5bd] pb-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-[#8a7253] bg-[#f7eed7] text-4xl shadow-inner">
            {currentScenario.character.avatarIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-2xl font-bold text-[#2c1e13]">
                {currentScenario.character.name}
              </h3>
              <span className="rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2 py-0.5 font-serif text-xs font-bold text-[#4a3826]">
                {currentScenario.character.role}
              </span>
              <span className="text-xs text-[#7a6448]">
                📍 {currentScenario.character.location} ({currentScenario.character.era})
              </span>
            </div>
            <p className="mt-2 text-sm text-[#4a3826] leading-relaxed">
              {currentScenario.story}
            </p>
          </div>
        </div>

        {/* 3 Questions */}
        <div className="mt-6 space-y-6">
          {/* Question 1 */}
          <div className="rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-serif text-xs font-bold text-[#7a6448] uppercase">
                  Điều kiện 1
                </span>
                <p className="font-serif text-sm font-bold text-[#2c1e13]">
                  Nhân vật này có được tự do về thân thể không?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFree(true)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-1.5 font-serif text-xs font-bold transition",
                    currentAnswer.userSaidFree === true
                      ? "border-[#1c3326] bg-[#2d4d3a] text-white"
                      : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                  )}
                >
                  Có tự do
                </button>
                <button
                  onClick={() => handleToggleFree(false)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-1.5 font-serif text-xs font-bold transition",
                    currentAnswer.userSaidFree === false
                      ? "border-[#541f1a] bg-[#802f28] text-white"
                      : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                  )}
                >
                  Không tự do
                </button>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-serif text-xs font-bold text-[#7a6448] uppercase">
                  Điều kiện 2
                </span>
                <p className="font-serif text-sm font-bold text-[#2c1e13]">
                  Nhân vật này có bị thiếu (tước đoạt) tư liệu sản xuất không?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleMeans(true)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-1.5 font-serif text-xs font-bold transition",
                    currentAnswer.userSaidLacksMeans === true
                      ? "border-[#1c3326] bg-[#2d4d3a] text-white"
                      : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                  )}
                >
                  Có (Bị thiếu / Không có)
                </button>
                <button
                  onClick={() => handleToggleMeans(false)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-1.5 font-serif text-xs font-bold transition",
                    currentAnswer.userSaidLacksMeans === false
                      ? "border-[#541f1a] bg-[#802f28] text-white"
                      : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                  )}
                >
                  Không (Đã có đủ TLSX)
                </button>
              </div>
            </div>
          </div>

          {/* Question 3 */}
          <div className="rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-serif text-xs font-bold text-[#7a6448] uppercase">
                  Kết luận tổng hợp
                </span>
                <p className="font-serif text-sm font-bold text-[#2c1e13]">
                  Sức lao động của nhân vật này CÓ PHẢI là hàng hóa không?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleCommodity(true)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-1.5 font-serif text-xs font-bold transition",
                    currentAnswer.userSaidIsCommodity === true
                      ? "border-[#1c3326] bg-[#2d4d3a] text-white"
                      : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                  )}
                >
                  Là Hàng hóa
                </button>
                <button
                  onClick={() => handleToggleCommodity(false)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-1.5 font-serif text-xs font-bold transition",
                    currentAnswer.userSaidIsCommodity === false
                      ? "border-[#541f1a] bg-[#802f28] text-white"
                      : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                  )}
                >
                  Không phải Hàng hóa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Button onClick={handleCheck} size="md">
            Kiểm tra đáp án
          </Button>

          {isAllAnswered && (
            <Button
              onClick={onFinishAllScenarios}
              variant="success"
              size="md"
            >
              Chuyển sang Hai thuộc tính sức lao động →
            </Button>
          )}
        </div>

        {/* Feedback Section */}
        {evalResult && (
          <div
            className={cn(
              "mt-6 rounded-xl border-2 p-5 text-sm transition-all",
              evalResult.isCorrect
                ? "border-[#1c3326] bg-[#eef6f0] text-[#1c3326]"
                : "border-[#541f1a] bg-[#fdf2f1] text-[#541f1a]"
            )}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-base mb-2">
              <span>{evalResult.isCorrect ? "🎉" : "💡"}</span>
              <span>{evalResult.isCorrect ? "Đánh giá chính xác!" : "Cần lưu ý:"}</span>
            </div>
            <p className="leading-relaxed">{evalResult.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

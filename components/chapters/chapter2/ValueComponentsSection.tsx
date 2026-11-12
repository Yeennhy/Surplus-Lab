"use client";

import { useState } from "react";
import {
  VALUE_COMPONENTS,
  VALUE_COMPONENT_MATCHING_ITEMS,
} from "@/features/labor/constants";
import { evaluateValueMatching } from "@/features/labor/engine";
import type {
  ValueComponentId,
  ValueComponentAnswer,
} from "@/features/labor/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ValueComponentsSectionProps {
  onComplete: (answers: ValueComponentAnswer[]) => void;
}

export function ValueComponentsSection({ onComplete }: ValueComponentsSectionProps) {
  const [selectedMatches, setSelectedMatches] = useState<
    Record<string, ValueComponentId>
  >({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleMatch = (itemId: string, compId: ValueComponentId) => {
    if (submitted) return;
    setSelectedMatches((prev) => ({
      ...prev,
      [itemId]: compId,
    }));
  };

  const isAllAnswered =
    Object.keys(selectedMatches).length === VALUE_COMPONENT_MATCHING_ITEMS.length;

  const evalResult = submitted ? evaluateValueMatching(selectedMatches) : null;

  const handleSubmit = () => {
    if (!isAllAnswered) {
      alert("Vui lòng phân loại đủ cả 5 khoản chi phí!");
      return;
    }
    setSubmitted(true);
  };

  const handleProceed = () => {
    const answers: ValueComponentAnswer[] = Object.entries(selectedMatches).map(
      ([itemId, componentId]) => ({ itemId, componentId })
    );
    onComplete(answers);
  };

  return (
    <div className="space-y-8">
      {/* 3 Value Component Cards (Matching Figma Screen 14) */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-sm">
        <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase mb-3">
          Cơ cấu giá trị
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2c1e13] mb-3">
          Ba bộ phận cấu thành giá trị hàng hóa sức lao động
        </h2>
        <p className="text-sm text-[#4a3826] leading-relaxed">
          Theo quy luật giá trị và nguyên tắc trao đổi ngang giá, tiền công của
          người lao động phải đủ bù đắp giá trị của ba bộ phận tư liệu sinh hoạt sau:
        </p>

        {/* 3 Components Grid */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {VALUE_COMPONENTS.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col justify-between rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-5 shadow-xs transition hover:border-[#8a7253]"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#8a7253] bg-[#f7eed7] text-2xl shadow-inner">
                    {comp.colorScheme.icon}
                  </div>
                  <div>
                    <span className="font-serif text-[11px] font-bold text-[#8c352d] uppercase">
                      Bộ phận {comp.badgeNumber}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#2c1e13]">
                      {comp.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#4a3826] leading-relaxed">
                  {comp.description}
                </p>

                <div className="mt-3 border-t border-[#e2d5bd] pt-2 space-y-1">
                  <span className="text-[11px] font-serif font-bold text-[#7a6448] uppercase">
                    Ví dụ thực tế:
                  </span>
                  <ul className="text-[11px] text-[#5c4632] space-y-0.5 pl-3 list-disc">
                    {comp.examples.slice(0, 3).map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded border border-[#d4a359]/30 bg-[#f7eed7] p-2 text-[11px] text-[#6e543c] italic leading-tight">
                {comp.socialSignificance}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Matching Challenge */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <span className="rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase">
              Thực hành phân loại
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2c1e13] mt-1">
              Ghép các khoản chi phí vào đúng bộ phận giá trị
            </h3>
          </div>
          {submitted && evalResult && (
            <div className="rounded-lg border-2 border-[#8a7253] bg-[#f7eed7] px-4 py-1.5 font-serif text-sm font-bold text-[#2c1e13]">
              Kết quả: {evalResult.score} / {evalResult.total} mục chính xác
            </div>
          )}
        </div>

        <div className="space-y-4 mt-6">
          {VALUE_COMPONENT_MATCHING_ITEMS.map((item, idx) => {
            const currentChoice = selectedMatches[item.id];
            const isCorrect =
              submitted && evalResult?.results[item.id] === true;
            const isWrong =
              submitted && evalResult?.results[item.id] === false;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border-2 p-4 transition-all",
                  isCorrect
                    ? "border-[#1c3326] bg-[#f0f6f2]"
                    : isWrong
                    ? "border-[#541f1a] bg-[#fbf0ef]"
                    : "border-[#c8b79b] bg-[#fdf8ed]"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8a7253] bg-[#802f28] font-serif text-xs font-bold text-white mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-serif text-sm font-bold text-[#2c1e13]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#7a6448] mt-0.5 italic">
                        Gợi ý: {item.hint}
                      </p>
                    </div>
                  </div>

                  {/* 3 Choice Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {VALUE_COMPONENTS.map((comp) => {
                      const isChosen = currentChoice === comp.id;
                      const isActualAnswer = item.correctComponentId === comp.id;

                      return (
                        <button
                          key={comp.id}
                          disabled={submitted}
                          onClick={() => handleMatch(item.id, comp.id)}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-xs font-serif font-bold transition",
                            submitted
                              ? isActualAnswer
                                ? "border-[#1c3326] bg-[#2d4d3a] text-white"
                                : isChosen
                                ? "border-[#541f1a] bg-[#802f28] text-white"
                                : "border-[#e2d5bd] bg-white/60 text-[#7a6448]"
                              : isChosen
                              ? "border-[#541f1a] bg-[#802f28] text-white shadow-xs"
                              : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                          )}
                        >
                          <span className="mr-1">{comp.colorScheme.icon}</span>
                          <span>Bộ phận {comp.badgeNumber}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          {!submitted ? (
            <Button onClick={handleSubmit} size="lg">
              Xác nhận phân loại
            </Button>
          ) : (
            <Button onClick={handleProceed} variant="success" size="lg">
              Xem bảng tổng kết chương 2 →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

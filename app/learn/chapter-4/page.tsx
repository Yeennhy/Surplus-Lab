"use client";

import { useState } from "react";
import Link from "next/link";
import { FactoryHud } from "@/components/factory/factory-hud";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/chapters/chapter4/StepIndicator";
import { CardClassificationGame } from "@/components/chapters/chapter4/CardClassificationGame";
import { FormulaBuilder } from "@/components/chapters/chapter4/FormulaBuilder";
import { ComparisonSection } from "@/components/chapters/chapter4/ComparisonSection";
import { Chapter4Summary } from "@/components/chapters/chapter4/Chapter4Summary";
import {
  createInitialState,
  generateResult,
} from "@/features/value/engine";
import type { Chapter4State, Chapter4Step } from "@/features/value/types";

export default function Chapter4Page() {
  const [currentStep, setCurrentStep] = useState<Chapter4Step>("intro");
  const [engineState, setEngineState] = useState<Chapter4State>(createInitialState());
  const [mistakes, setMistakes] = useState(0);

  const handleStepClick = (target: Chapter4Step) => {
    setCurrentStep(target);
  };

  const handleClassificationAllCorrect = (mistakesCount: number) => {
    setMistakes(mistakesCount);
    setEngineState((prev) => ({
      ...prev,
      score: Math.max(0, 60 - mistakesCount * 5),
      mistakes: mistakesCount,
    }));
    setCurrentStep("formula");
  };

  const handleFormulaComplete = () => {
    setEngineState((prev) => ({
      ...prev,
      score: Math.min(100, prev.score + 40),
      completed: true,
    }));
    setCurrentStep("comparison");
  };

  const handleComparisonComplete = () => {
    setCurrentStep("summary");
  };

  const handleRestart = () => {
    setEngineState(createInitialState());
    setMistakes(0);
    setCurrentStep("intro");
  };

  // Generate final result
  const finalResult = generateResult({
    ...engineState,
    mistakes,
    completed: true,
    score: Math.max(0, 100 - mistakes * 5),
  });

  return (
    <div className="min-h-screen bg-[#1c2420] text-[#f4ebcb] selection:bg-[#8c3e36] selection:text-white font-sans">
      {/* Top HUD */}
      <FactoryHud
        capitalUSD={121}
        missionNumber="04"
        chapterTitle="Chương 4: Cơ cấu Giá trị (c + v + m)"
        badgeCount={3}
      />

      {/* Main Container - unified max-w-6xl for optimal readability and width */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#3b2f24] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded border border-[#6b583f] bg-[#222b26] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#decbb0] transition hover:bg-[#344238] hover:text-white no-underline"
          >
            <span>←</span> Quay lại Lộ trình
          </Link>
          <Link
            href="/learn/chapter-3"
            className="inline-flex items-center gap-1 text-xs text-[#a89678] transition hover:text-[#f4ebcb] no-underline"
          >
            ← Đối chiếu Nhà máy sợi (Chương 3)
          </Link>
        </div>

        {/* Chapter Header */}
        <div className="mb-8 border-b border-[#3b2f24] pb-6">
          <div className="inline-block rounded-md border border-[#8a7253] bg-[#222b26] px-3 py-1 text-xs font-bold tracking-wider text-[#d4a359] uppercase mb-2">
            Nhiệm vụ 04: Anatomy of Value
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#f5ebd7]">
            Cơ cấu Giá trị Hàng hóa: G = c + (v + m)
          </h1>
          <p className="mt-2 text-base text-[#cfbf9e] leading-relaxed">
            Phân loại tư bản bất biến (c), tư bản khả biến (v), giá trị thặng dư (m) và hoàn thiện công thức giá trị hàng hóa G = c + (v + m) = 136 USD.
          </p>
        </div>

        {/* Unified Parchment Stage Window */}
        <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fcf3dc] p-5 sm:p-10 text-[#241a10] shadow-2xl">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />

          {/* Step Content */}
          <div className="mt-8">
            {currentStep === "intro" && (
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#8a7253] bg-[#f7eed7] text-xl font-extrabold text-[#782f28] shadow-inner">
                      G
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-[#2c1e13]">
                        Giải phẫu cơ cấu giá trị sản phẩm
                      </h2>
                      <p className="text-xs text-[#7a6448]">
                        Đối chiếu ví dụ Nhà máy sợi Chương 3 theo Giáo trình KTCT Mác – Lênin
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#4a3826] leading-relaxed">
                    Sau ca làm việc 8 giờ ở Chương 3, nhà máy kéo sợi thu được 100 kg sợi với tổng giá trị <strong>136 USD</strong>, trong khi tư bản ứng trước ban đầu là <strong>121 USD</strong>. Khoản chênh lệch <strong>15 USD</strong> từ đâu mà ra?
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3 mt-6">
                    <div className="rounded-xl border-2 border-[#d4a359] bg-[#fff9eb] p-4 text-center">
                      <div className="text-xs font-bold text-[#b8860b] uppercase">Tư bản bất biến (c)</div>
                      <div className="text-2xl font-extrabold text-[#5c3e1e] mt-1">106 USD</div>
                      <p className="text-xs text-[#7a6448] mt-1">100 USD bông + 6 USD hao mòn máy. Giá trị được bảo toàn chuyển dịch.</p>
                    </div>

                    <div className="rounded-xl border-2 border-[#3d5a80] bg-[#eef4f8] p-4 text-center">
                      <div className="text-xs font-bold text-[#3d5a80] uppercase">Tư bản khả biến (v)</div>
                      <div className="text-2xl font-extrabold text-[#1d3557] mt-1">15 USD</div>
                      <p className="text-xs text-[#7a6448] mt-1">Tiền công mua sức lao động. Sáng tạo ra 30 USD giá trị mới.</p>
                    </div>

                    <div className="rounded-xl border-2 border-[#802f28] bg-[#fbf0ef] p-4 text-center">
                      <div className="text-xs font-bold text-[#802f28] uppercase">Giá trị thặng dư (m)</div>
                      <div className="text-2xl font-extrabold text-[#802f28] mt-1">15 USD</div>
                      <p className="text-xs text-[#802f28] font-bold mt-1">Dôi ra ngoài tư bản ứng trước do 4 giờ lao động thặng dư.</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={() => setCurrentStep("classify")}
                      size="lg"
                    >
                      Bắt đầu phân loại 4 thẻ giá trị →
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "classify" && (
              <CardClassificationGame
                onAllCorrect={handleClassificationAllCorrect}
              />
            )}

            {currentStep === "formula" && (
              <FormulaBuilder onComplete={handleFormulaComplete} />
            )}

            {currentStep === "comparison" && (
              <ComparisonSection onContinue={handleComparisonComplete} />
            )}

            {currentStep === "summary" && (
              <Chapter4Summary result={finalResult} onRestart={handleRestart} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

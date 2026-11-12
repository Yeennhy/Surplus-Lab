"use client";

import { useState } from "react";
import Link from "next/link";
import { FactoryHud } from "@/components/factory/factory-hud";
import { StepIndicator } from "@/components/chapters/chapter2/StepIndicator";
import { ConditionCard } from "@/components/chapters/chapter2/ConditionCard";
import { ScenarioInteractive } from "@/components/chapters/chapter2/ScenarioInteractive";
import { AttributesSection } from "@/components/chapters/chapter2/AttributesSection";
import { ValueComponentsSection } from "@/components/chapters/chapter2/ValueComponentsSection";
import { Chapter2Summary } from "@/components/chapters/chapter2/Chapter2Summary";
import {
  createInitialState,
  getScenarios,
  getChapter2Result,
} from "@/features/labor/engine";
import type {
  Chapter2State,
  ScenarioAnswer,
  ValueComponentAnswer,
  ValueComponentId,
} from "@/features/labor/types";

export default function Chapter2Page() {
  const scenarios = getScenarios();
  const [state, setState] = useState<Chapter2State>(createInitialState());
  const [attributeQuizAnswers, setAttributeQuizAnswers] = useState<Record<string, number>>({});
  const [valueCompMatches, setValueCompMatches] = useState<Record<string, ValueComponentId>>({});

  const handleStepClick = (targetStep: Chapter2State["currentStep"]) => {
    setState((prev) => ({ ...prev, currentStep: targetStep }));
  };

  const handleScenarioAnswer = (answer: ScenarioAnswer) => {
    setState((prev) => {
      const existing = prev.scenarioAnswers.filter(
        (a) => a.scenarioId !== answer.scenarioId
      );
      return {
        ...prev,
        scenarioAnswers: [...existing, answer],
        currentScenarioIndex: prev.currentScenarioIndex + 1,
      };
    });
  };

  const handleFinishScenarios = () => {
    setState((prev) => ({
      ...prev,
      currentStep: "attributes",
    }));
  };

  const handleAttributesComplete = (passed: boolean) => {
    setAttributeQuizAnswers({
      attr_q1: 1,
      attr_q2: 2,
      attr_q3: 0,
      attr_q4: 0,
    });
    setState((prev) => ({
      ...prev,
      attributeQuizCompleted: passed,
      currentStep: "value_components",
    }));
  };

  const handleValueComponentsComplete = (answers: ValueComponentAnswer[]) => {
    const record: Record<string, ValueComponentId> = {};
    answers.forEach((a, i) => {
      record[`match_${i + 1}`] = a.componentId;
    });
    setValueCompMatches(record);

    setState((prev) => ({
      ...prev,
      valueComponentAnswers: answers,
      currentStep: "summary",
    }));
  };

  const handleRestart = () => {
    setState(createInitialState());
    setAttributeQuizAnswers({});
    setValueCompMatches({});
  };

  // Calculate final result
  const finalResult = getChapter2Result(
    state.scenarioAnswers,
    attributeQuizAnswers,
    valueCompMatches
  );

  return (
    <div className="min-h-screen bg-[#1c2420] text-[#f4ebcb] selection:bg-[#8c3e36] selection:text-white">
      {/* Top HUD */}
      <FactoryHud
        capitalUSD={121}
        missionNumber="02"
        chapterTitle="Chương 2: Hàng hóa Sức lao động"
        badgeCount={1}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#3b2f24] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded border border-[#6b583f] bg-[#222b26] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#decbb0] transition hover:bg-[#344238] hover:text-white"
          >
            <span>←</span> Quay lại Lộ trình
          </Link>
          <div className="text-xs text-[#a89678]">
            Đối chiếu Giáo trình Kinh tế chính trị Mác – Lênin (Tr. 80–82)
          </div>
        </div>

        {/* Chapter Header */}
        <div className="mb-8 border-b border-[#3b2f24] pb-6">
          <div className="inline-block rounded-md border border-[#8a7253] bg-[#222b26] px-3 py-1 font-serif text-xs font-bold tracking-wider text-[#d4a359] uppercase mb-2">
            Nhiệm vụ 02: The Special Commodity
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide text-[#f5ebd7]">
            Hàng hóa Sức lao động
          </h1>
          <p className="mt-2 text-base text-[#cfbf9e]">
            Khám phá hàng hóa sức lao động – chìa khóa mở giải quyết mâu thuẫn trong công thức chung của tư bản T - H - T&apos;.
          </p>
        </div>

        {/* Parchment Stage Window */}
        <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fcf3dc] p-4 sm:p-8 text-[#241a10] shadow-2xl">
          {/* Step Indicator */}
          <StepIndicator
            currentStep={state.currentStep}
            onStepClick={handleStepClick}
          />

          {/* Step Content */}
          <div className="mt-8">
            {state.currentStep === "intro" && (
              <ConditionCard
                onContinue={() =>
                  setState((prev) => ({ ...prev, currentStep: "scenarios" }))
                }
              />
            )}

            {state.currentStep === "scenarios" && (
              <ScenarioInteractive
                scenarios={scenarios}
                currentIndex={state.currentScenarioIndex}
                onAnswerSubmitted={handleScenarioAnswer}
                onFinishAllScenarios={handleFinishScenarios}
              />
            )}

            {state.currentStep === "attributes" && (
              <AttributesSection onComplete={handleAttributesComplete} />
            )}

            {state.currentStep === "value_components" && (
              <ValueComponentsSection onComplete={handleValueComponentsComplete} />
            )}

            {state.currentStep === "summary" && (
              <Chapter2Summary result={finalResult} onRestart={handleRestart} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

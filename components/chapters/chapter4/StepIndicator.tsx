"use client";

import type { Chapter4Step } from "@/features/value/types";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: Chapter4Step;
  onStepClick: (step: Chapter4Step) => void;
}

const STEPS: { id: Chapter4Step; label: string; number: string }[] = [
  { id: "intro", label: "Căn bản", number: "01" },
  { id: "classify", label: "Phân loại tư bản", number: "02" },
  { id: "formula", label: "Công thức G", number: "03" },
  { id: "comparison", label: "So sánh 2 cách chia", number: "04" },
  { id: "summary", label: "Tổng kết", number: "05" },
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-b border-[#c8b79b] pb-4">
      {STEPS.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isPast = idx < currentIndex;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-serif text-xs font-bold tracking-wider transition-all",
              isActive
                ? "border-2 border-[#541f1a] bg-[#802f28] text-white shadow-md"
                : isPast
                ? "border border-[#8a7253] bg-[#e6d8ba] text-[#4a3826] hover:bg-[#dcd0b0]"
                : "border border-[#c8b79b] bg-transparent text-[#7a6448] hover:bg-[#ede1c7]"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[10px]",
                isActive
                  ? "bg-[#d4a359] text-[#1c2420]"
                  : isPast
                  ? "bg-[#8a7253] text-white"
                  : "bg-[#c8b79b] text-[#2c1e13]"
              )}
            >
              {isPast ? "✓" : step.number}
            </span>
            <span>{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

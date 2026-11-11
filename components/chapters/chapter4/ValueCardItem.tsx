"use client";

import type { ValueCard } from "@/features/value/types";
import { cn } from "@/lib/utils";

interface ValueCardItemProps {
  card: ValueCard;
  isSelected?: boolean;
  isAssigned?: boolean;
  assignedCategoryLabel?: string;
  onClick?: () => void;
  onRemove?: () => void;
}

export function ValueCardItem({
  card,
  isSelected,
  isAssigned,
  assignedCategoryLabel,
  onClick,
  onRemove,
}: ValueCardItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-between rounded-xl border-2 p-3.5 text-center transition-all cursor-pointer shadow-xs select-none font-sans",
        isSelected
          ? "border-[#541f1a] bg-[#fff9eb] ring-2 ring-[#d4a359] scale-102"
          : isAssigned
          ? "border-[#8a7253] bg-[#f7eed7] opacity-90"
          : "border-[#c8b79b] bg-[#fdf8ed] hover:border-[#8a7253] hover:bg-[#fff9eb]"
      )}
    >
      {/* Top Value Badge */}
      <div className="flex w-full items-center justify-between gap-1 mb-2">
        <span className="rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2 py-0.5 text-[11px] font-bold text-[#4a3826]">
          {card.valueUSD} USD
        </span>
        {isAssigned && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#802f28] text-white text-[10px] hover:bg-[#a33327]"
            title="Gỡ khỏi nhóm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Emblem Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#8a7253] bg-[#fff9eb] text-xl font-bold text-[#4a3826] shadow-inner mb-2">
        {card.icon}
      </div>

      {/* Card Name */}
      <h4 className="text-xs sm:text-sm font-bold text-[#2c1e13] leading-snug">
        {card.name}
      </h4>

      {/* Assigned status badge */}
      {isAssigned && assignedCategoryLabel && (
        <span className="mt-2 inline-block rounded border border-[#8a7253] bg-[#e6d8ba] px-2 py-0.5 text-[10px] font-bold text-[#4a3826]">
          Thuộc {assignedCategoryLabel}
        </span>
      )}
    </div>
  );
}

"use client";

import type { CategoryZone as CategoryZoneType, ValueCard } from "@/features/value/types";
import { ValueCardItem } from "./ValueCardItem";
import { cn } from "@/lib/utils";

interface CategoryZoneProps {
  zone: CategoryZoneType;
  assignedCards: ValueCard[];
  isActive?: boolean;
  onZoneClick?: () => void;
  onRemoveCard: (cardId: string) => void;
}

export function CategoryZone({
  zone,
  assignedCards,
  isActive,
  onZoneClick,
  onRemoveCard,
}: CategoryZoneProps) {
  const currentTotalUSD = assignedCards.reduce((sum, c) => sum + c.valueUSD, 0);

  return (
    <div
      onClick={onZoneClick}
      className={cn(
        "flex flex-col justify-between rounded-2xl border-2 p-5 transition-all shadow-sm font-sans",
        isActive
          ? "border-[#541f1a] bg-[#fff9eb] ring-2 ring-[#d4a359]"
          : "border-[#8a7253] bg-[#fbf5e6] hover:bg-[#fff9eb]"
      )}
    >
      <div>
        {/* Zone Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#e2d5bd] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#541f1a] bg-[#802f28] text-base font-extrabold text-white shadow-xs">
              {zone.symbol}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#2c1e13]">
                {zone.title}
              </h3>
              <p className="text-[11px] text-[#7a6448]">{zone.subtitle}</p>
            </div>
          </div>

          {/* Current total */}
          <div className="text-right">
            <span className="text-xs font-bold text-[#8c352d]">
              {currentTotalUSD} USD
            </span>
            <div className="text-[10px] text-[#7a6448]">
              Mục tiêu: {zone.totalExpectedUSD} USD
            </div>
          </div>
        </div>

        {/* Assigned Cards in this Zone */}
        {assignedCards.length === 0 ? (
          <div className="flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-[#c8b79b] bg-[#fdf8ed] text-center p-4">
            <span className="text-xs text-[#7a6448] italic">
              Nhấp chọn thẻ bên trên để thả vào nhóm ({zone.symbol})
            </span>
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
            {assignedCards.map((card) => (
              <ValueCardItem
                key={card.id}
                card={card}
                isAssigned={true}
                onRemove={() => onRemoveCard(card.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-2 border-t border-[#e2d5bd] flex items-center justify-between text-[11px] text-[#5c4632]">
        <span>
          Số thẻ hiện tại: <strong>{assignedCards.length}</strong>
        </span>
        {zone.category === "m" && (
          <span className="font-bold text-[#802f28]">
            Lưu ý: Không ứng trước
          </span>
        )}
      </div>
    </div>
  );
}

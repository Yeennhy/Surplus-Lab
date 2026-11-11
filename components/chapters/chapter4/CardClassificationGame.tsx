"use client";

import { useState } from "react";
import {
  VALUE_CARDS,
  CATEGORY_ZONES,
} from "@/features/value/constants";
import {
  validateAllPlacements,
} from "@/features/value/engine";
import type { CapitalCategory, CardFeedback } from "@/features/value/types";
import { ValueCardItem } from "./ValueCardItem";
import { CategoryZone } from "./CategoryZone";
import { Button } from "@/components/ui/Button";

interface CardClassificationGameProps {
  onAllCorrect: (mistakes: number) => void;
}

export function CardClassificationGame({ onAllCorrect }: CardClassificationGameProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, CapitalCategory>>({});
  const [feedbacks, setFeedbacks] = useState<CardFeedback[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  // Cards not yet assigned
  const unassignedCards = VALUE_CARDS.filter((c) => !placements[c.id]);

  const handleCardClick = (cardId: string) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
    }
  };

  const handleAssignToZone = (category: CapitalCategory) => {
    if (!selectedCardId) return;

    setPlacements((prev) => ({
      ...prev,
      [selectedCardId]: category,
    }));
    setSelectedCardId(null);
    setHasChecked(false);
  };

  const handleRemoveCard = (cardId: string) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
    setHasChecked(false);
  };

  const handleCheck = () => {
    const valResult = validateAllPlacements(placements);
    setFeedbacks(valResult.feedbacks);
    setHasChecked(true);

    if (!valResult.isAllCorrect) {
      setMistakes((prev) => prev + 1);
    }
  };

  const handleProceed = () => {
    onAllCorrect(mistakes);
  };

  const isAllCardsPlaced =
    Object.keys(placements).length === VALUE_CARDS.length;

  const isAllCorrect =
    isAllCardsPlaced &&
    feedbacks.length === VALUE_CARDS.length &&
    feedbacks.every((f) => f.isCorrect);

  const misclassifiedSurplus = feedbacks.find(
    (f) => f.isMisclassifiedAdvanceCapital
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Introduction Card */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-sm">
        <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 text-xs font-bold tracking-wider text-[#4a3826] uppercase mb-3">
          Nhiệm vụ phân loại
        </div>
        <h2 className="text-2xl font-bold text-[#2c1e13] mb-2">
          Phân loại 4 yếu tố giá trị trong nhà máy sợi
        </h2>
        <p className="text-sm text-[#4a3826] leading-relaxed">
          Nhà tư bản ứng trước <strong>121 USD</strong> tư bản (100 USD bông + 6 USD khấu hao máy + 15 USD sức lao động). Sau 8 giờ, sản phẩm sợi có giá trị <strong>136 USD</strong>, dôi ra <strong>15 USD</strong> giá trị thặng dư. Hãy xếp 4 tấm thẻ vào đúng nhóm bản chất kinh tế của chúng!
        </p>

        {/* Unassigned Cards Palette */}
        <div className="mt-6 border-t border-[#e2d5bd] pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#7a6448] uppercase">
              Thẻ chưa phân loại ({unassignedCards.length})
            </span>
            {selectedCardId && (
              <span className="text-xs font-bold text-[#802f28] animate-pulse">
                Chọn một trong 3 nhóm bên dưới để xếp thẻ vào
              </span>
            )}
          </div>

          {unassignedCards.length === 0 ? (
            <div className="rounded-xl border border-[#2d4d3a]/30 bg-[#f0f6f2] p-4 text-center text-xs font-bold text-[#1c3326]">
              ✓ Tất cả 4 thẻ đã được xếp vào các nhóm. Hãy nhấn &quot;Kiểm tra phân loại&quot; bên dưới!
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {unassignedCards.map((card) => (
                <ValueCardItem
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onClick={() => handleCardClick(card.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 Drop Zones Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {CATEGORY_ZONES.map((zone) => {
          const cardsInZone = VALUE_CARDS.filter(
            (c) => placements[c.id] === zone.category
          );
          return (
            <CategoryZone
              key={zone.category}
              zone={zone}
              assignedCards={cardsInZone}
              isActive={!!selectedCardId}
              onZoneClick={() => handleAssignToZone(zone.category)}
              onRemoveCard={handleRemoveCard}
            />
          );
        })}
      </div>

      {/* Misclassification Warning */}
      {misclassifiedSurplus && (
        <div className="rounded-2xl border-3 border-[#802f28] bg-[#fbf0ef] p-6 shadow-md text-sm text-[#541f1a]">
          <div className="flex items-center gap-2 text-base font-extrabold text-[#802f28] mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#802f28] text-white text-xs font-bold">!</span>
            <span>CẢNH BÁO LÝ LUẬN CỐT LÕI (TIÊU CHÍ NGHIỆM THU):</span>
          </div>
          <p className="leading-relaxed">
            {misclassifiedSurplus.message}
          </p>
        </div>
      )}

      {/* Feedback List */}
      {hasChecked && !isAllCorrect && !misclassifiedSurplus && (
        <div className="rounded-2xl border-2 border-[#541f1a] bg-[#fdf2f1] p-5 text-xs text-[#541f1a] space-y-2">
          <div className="font-bold text-sm">Một số thẻ chưa được xếp đúng nhóm:</div>
          <ul className="list-disc pl-5 space-y-1">
            {feedbacks
              .filter((f) => !f.isCorrect)
              .map((f, i) => (
                <li key={i}>{f.message}</li>
              ))}
          </ul>
        </div>
      )}

      {/* Success Notification with Highlighted Numbers */}
      {isAllCorrect && (
        <div className="rounded-2xl border-2 border-[#1c3326] bg-[#f0f6f2] p-6 text-sm text-[#1c3326]">
          <div className="flex items-center gap-2 font-bold text-base mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1c3326] text-white text-xs font-bold">✓</span>
            <span>Phân loại hoàn toàn chính xác theo cấu thành giá trị:</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mt-3">
            <div className="rounded-xl border border-[#d4a359] bg-[#fff9eb] p-3 text-center">
              <span className="text-xs font-bold text-[#b8860b] uppercase block">Tư bản bất biến</span>
              <span className="inline-block mt-1.5 rounded-md bg-[#d4a359]/25 px-3 py-1 text-base font-extrabold text-[#5c3e1e]">
                c = 106 USD
              </span>
              <p className="text-[11px] text-[#7a6448] mt-1.5">100 USD bông + 6 USD hao mòn máy</p>
            </div>

            <div className="rounded-xl border border-[#3d5a80] bg-[#eef4f8] p-3 text-center">
              <span className="text-xs font-bold text-[#3d5a80] uppercase block">Tư bản khả biến</span>
              <span className="inline-block mt-1.5 rounded-md bg-[#3d5a80]/25 px-3 py-1 text-base font-extrabold text-[#1d3557]">
                v = 15 USD
              </span>
              <p className="text-[11px] text-[#7a6448] mt-1.5">Giá trị sức lao động</p>
            </div>

            <div className="rounded-xl border border-[#802f28] bg-[#fbf0ef] p-3 text-center">
              <span className="text-xs font-bold text-[#802f28] uppercase block">Giá trị thặng dư</span>
              <span className="inline-block mt-1.5 rounded-md bg-[#802f28]/25 px-3 py-1 text-base font-extrabold text-[#802f28]">
                m = 15 USD
              </span>
              <p className="text-[11px] text-[#802f28] font-bold mt-1.5">Dôi ra ngoài tư bản ứng trước 121 USD</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#e2d5bd]">
        <div className="text-xs text-[#7a6448]">
          Số lỗi đã ghi nhận: <strong>{mistakes}</strong>
        </div>

        <div className="flex items-center gap-3">
          {!isAllCorrect ? (
            <Button
              onClick={handleCheck}
              disabled={!isAllCardsPlaced}
              size="lg"
            >
              Kiểm tra phân loại
            </Button>
          ) : (
            <Button onClick={handleProceed} variant="success" size="lg">
              Xây dựng công thức G = c + (v + m) →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

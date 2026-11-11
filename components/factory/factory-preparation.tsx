"use client";

import { useState } from "react";
import { FACTORY_RESOURCES, FactoryResourceItem } from "@/features/factory/types";

interface FactoryPreparationProps {
  onStartShift: () => void;
}

export function FactoryPreparation({ onStartShift }: FactoryPreparationProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const totalAdvance = FACTORY_RESOURCES.reduce(
    (sum: number, item: FactoryResourceItem) => sum + item.value,
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center font-sans">
      {/* Antique Parchment Main Card */}
      <div className="w-full rounded-2xl border-4 border-[#82674c] bg-[#fbf6e5] p-6 shadow-2xl sm:p-10">
        {/* Card Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#9b8265] bg-[#eedebd] px-3.5 py-1 text-xs font-bold tracking-wider text-[#634a31] uppercase">
            Giai đoạn 1 • Chuẩn bị tài nguyên
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-wide text-[#2e2014] sm:text-4xl md:text-5xl">
            CHUẨN BỊ MỘT CA SẢN XUẤT
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[#614e3b] leading-relaxed">
            Để vận hành xưởng kéo sợi, nhà tư bản phải ứng trước tiền để mua ba
            yếu tố đầu vào. Khám phá vai trò của từng yếu tố trong việc hình
            thành giá trị.
          </p>
        </div>

        {/* 3 Resource Cards - items-start ensures only the clicked card grows */}
        <div className="mt-8 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {FACTORY_RESOURCES.map((item: FactoryResourceItem) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(isSelected ? null : item.id)}
                className={`group relative flex cursor-pointer flex-col items-center rounded-xl border-2 p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isSelected
                    ? "border-[#8c3e36] bg-[#f5ecd2] shadow-lg ring-2 ring-[#8c3e36]/30"
                    : "border-[#c4b192] bg-[#f4ebcb] hover:border-[#967957]"
                }`}
              >
                {/* Category Pill Tag */}
                <div className="mb-2">
                  <span
                    className={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      item.category === "c"
                        ? "bg-[#254558]/10 text-[#254558]"
                        : "bg-[#8c3e36]/10 text-[#8c3e36]"
                    }`}
                  >
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold tracking-wide text-[#2c1d10]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#735e47] italic">{item.role}</p>

                {/* Circular Visual Emblem */}
                <div className="my-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#b59e7e] bg-[#e7d8b5] shadow-inner transition-transform group-hover:scale-105">
                  {item.id === "cotton" && (
                    <span className="font-bold text-sm text-[#735431] tracking-wider uppercase">
                      BÔNG
                    </span>
                  )}
                  {item.id === "machine" && (
                    <span className="font-bold text-sm text-[#355163] tracking-wider uppercase">
                      MÁY
                    </span>
                  )}
                  {item.id === "labor" && (
                    <span className="font-bold text-sm text-[#7a2e26] tracking-wider uppercase">
                      L.ĐỘNG
                    </span>
                  )}
                </div>

                {/* Value Display */}
                <div className="w-full border-t border-[#d8c7aa] pt-3">
                  <span className="text-3xl font-extrabold text-[#782f28]">
                    {item.value} {item.unit}
                  </span>
                </div>

                {/* Expanded explanation - isolated inside this card */}
                {isSelected && (
                  <div className="mt-4 w-full rounded-lg bg-[#e8dac1] p-3 text-left text-xs text-[#3d2f21] animate-fadeIn">
                    <p className="leading-relaxed">{item.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Item Detail Banner if any */}
        {selectedId && (
          <div className="mt-6 rounded-xl border border-[#9b8263] bg-[#eadebf] p-3 text-center text-xs font-medium text-[#483724] animate-fadeIn">
            Nhấp lại vào thẻ để thu gọn. Nhấn nút bên dưới để bắt đầu ca làm việc 8 giờ.
          </div>
        )}

        {/* Total Advanced Capital Banner */}
        <div className="mt-8 rounded-xl border-2 border-[#947e63] bg-[#eedebd] p-4 text-center shadow-inner">
          <p className="text-xs font-bold tracking-wider text-[#57422d] uppercase">
            TỔNG TƯ BẢN ỨNG TRƯỚC (T) = 100 USD (Bông) + 6 USD (Máy) + 15 USD (Sức lao động)
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#6d2721] sm:text-3xl">
            = {totalAdvance} USD
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onStartShift}
            className="group relative flex items-center gap-3 rounded-xl border-2 border-[#541f1a] bg-[#802f28] px-8 py-3.5 text-base font-bold tracking-wider text-[#fcf3dc] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#943830] hover:shadow-xl active:translate-y-0.5"
          >
            <span>BẮT ĐẦU CA 8 GIỜ</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

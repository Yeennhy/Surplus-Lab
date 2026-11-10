"use client";

import { useState } from "react";
import { validateFormula } from "@/features/value/engine";
import type { FormulaValidationResult } from "@/features/value/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FormulaBuilderProps {
  onComplete: () => void;
}

export function FormulaBuilder({ onComplete }: FormulaBuilderProps) {
  const [cVal, setCVal] = useState<string>("106");
  const [vVal, setVVal] = useState<string>("15");
  const [mVal, setMVal] = useState<string>("15");
  const [result, setResult] = useState<FormulaValidationResult | null>(null);

  const numC = parseFloat(cVal) || 0;
  const numV = parseFloat(vVal) || 0;
  const numM = parseFloat(mVal) || 0;
  const totalG = numC + numV + numM;

  const handleValidate = () => {
    const res = validateFormula(numC, numV, numM);
    setResult(res);
  };

  return (
    <div className="space-y-8">
      {/* Formula Presentation (Matching Figma Screen 13) */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-10 shadow-sm text-center">
        <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase mb-3">
          Công thức giá trị hàng hóa
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2c1e13] mb-4">
          Cơ cấu giá trị hàng hóa: G = c + (v + m)
        </h2>
        <p className="max-w-2xl mx-auto text-sm text-[#4a3826] leading-relaxed">
          C. Mác phân tích giá trị của mọi hàng hóa thành hai bộ phận: <strong>Giá trị cũ (c)</strong> được chuyển dịch vào sản phẩm và <strong>Giá trị mới (v + m)</strong> do sức lao động sống của công nhân tạo ra.
        </p>

        {/* Big Visual Equation Box (Matching Figma Screen 13) */}
        <div className="mt-8 rounded-2xl border-2 border-[#8a7253] bg-[#fbf5e6] p-6 sm:p-8 shadow-inner">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-serif text-xl sm:text-2xl font-extrabold text-[#2c1e13]">
            {/* G */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-[#7a6448] uppercase">Tổng giá trị (G)</span>
              <div className="mt-1 flex h-14 min-w-[5rem] items-center justify-center rounded-xl border-2 border-[#8a7253] bg-[#fdf8ed] px-4 text-[#8c352d] shadow-sm">
                ${totalG}
              </div>
            </div>

            <span className="text-3xl font-light text-[#8a7253] pt-5">=</span>

            {/* c block */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#b8860b] uppercase">Tư bản bất biến (c)</span>
              <div className="mt-1 flex h-14 w-28 items-center justify-center rounded-xl border-2 border-[#d4a359] bg-[#fff9eb] p-1 shadow-sm">
                <input
                  type="number"
                  value={cVal}
                  onChange={(e) => setCVal(e.target.value)}
                  className="w-full text-center font-serif text-xl font-bold text-[#5c3e1e] focus:outline-none"
                  placeholder="c"
                />
              </div>
              <span className="text-[10px] text-[#7a6448] mt-1">Bông ($100) + Máy ($6)</span>
            </div>

            <span className="text-3xl font-light text-[#8a7253] pt-5">+</span>

            <span className="text-3xl font-light text-[#8a7253] pt-5">(</span>

            {/* v block */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#3d5a80] uppercase">Tư bản khả biến (v)</span>
              <div className="mt-1 flex h-14 w-24 items-center justify-center rounded-xl border-2 border-[#3d5a80] bg-[#eef4f8] p-1 shadow-sm">
                <input
                  type="number"
                  value={vVal}
                  onChange={(e) => setVVal(e.target.value)}
                  className="w-full text-center font-serif text-xl font-bold text-[#1d3557] focus:outline-none"
                  placeholder="v"
                />
              </div>
              <span className="text-[10px] text-[#7a6448] mt-1">Tiền lương ($15)</span>
            </div>

            <span className="text-3xl font-light text-[#8a7253] pt-5">+</span>

            {/* m block */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#802f28] uppercase">Giá trị thặng dư (m)</span>
              <div className="mt-1 flex h-14 w-24 items-center justify-center rounded-xl border-2 border-[#802f28] bg-[#fbf0ef] p-1 shadow-sm">
                <input
                  type="number"
                  value={mVal}
                  onChange={(e) => setMVal(e.target.value)}
                  className="w-full text-center font-serif text-xl font-bold text-[#802f28] focus:outline-none"
                  placeholder="m"
                />
              </div>
              <span className="text-[10px] text-[#802f28] font-bold mt-1">Lao động dôi ra ($15)</span>
            </div>

            <span className="text-3xl font-light text-[#8a7253] pt-5">)</span>
          </div>
        </div>

        {/* Breakdown Explanation */}
        <div className="grid gap-4 sm:grid-cols-2 mt-6 text-left">
          <div className="rounded-xl border border-[#d4a359] bg-[#fff9eb] p-4">
            <h4 className="font-serif text-sm font-bold text-[#5c3e1e] flex items-center gap-1.5">
              <span>🌾</span> Giá trị cũ tái hiện: c = 106 USD
            </h4>
            <p className="mt-1 text-xs text-[#4a3826] leading-relaxed">
              Lao động cụ thể của công nhân bảo toàn giá trị của 100 kg bông ($100) và hao mòn máy ($6) chuyển vào sợi mới mà không làm tăng lượng giá trị của chúng.
            </p>
          </div>

          <div className="rounded-xl border border-[#802f28] bg-[#fff9eb] p-4">
            <h4 className="font-serif text-sm font-bold text-[#802f28] flex items-center gap-1.5">
              <span>⚡</span> Giá trị mới sáng tạo: v + m = 30 USD
            </h4>
            <p className="mt-1 text-xs text-[#4a3826] leading-relaxed">
              Lao động trừu tượng của công nhân tạo ra toàn bộ 30 USD giá trị mới: 15 USD (v) bù đắp giá trị sức lao động đã bán, và 15 USD (m) là giá trị thặng dư thuộc về nhà tư bản.
            </p>
          </div>
        </div>

        {/* Validation Result Notice */}
        {result && (
          <div
            className={cn(
              "mt-6 rounded-xl border-2 p-5 text-sm transition-all text-left",
              result.isFullyCorrect
                ? "border-[#1c3326] bg-[#f0f6f2] text-[#1c3326]"
                : "border-[#541f1a] bg-[#fdf2f1] text-[#541f1a]"
            )}
          >
            <div className="flex items-center gap-2 font-serif font-bold text-base mb-1">
              <span>{result.isFullyCorrect ? "🎉" : "💡"}</span>
              <span>{result.isFullyCorrect ? "Công thức xác lập chính xác!" : "Điều chỉnh lại số liệu:"}</span>
            </div>
            <p className="leading-relaxed">{result.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          {!result?.isFullyCorrect ? (
            <Button onClick={handleValidate} size="lg">
              Xác thực công thức
            </Button>
          ) : (
            <Button onClick={onComplete} variant="success" size="lg">
              So sánh 2 cách phân chia tư bản →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

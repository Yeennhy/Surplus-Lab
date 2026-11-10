"use client";

import { useState } from "react";
import { CheckpointAnswer } from "@/features/factory/types";

interface CheckpointModalProps {
  onContinue: () => void;
}

export function CheckpointModal({ onContinue }: CheckpointModalProps) {
  const [selectedAnswer, setSelectedAnswer] =
    useState<CheckpointAnswer | null>(null);

  const isCorrect = selectedAnswer === "not_yet_appeared";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl border-4 border-[#82674c] bg-[#fbf6e5] p-6 shadow-2xl sm:p-10">
        {/* Header Badge */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#8a443e] bg-[#f2dedb] px-3.5 py-1 text-xs font-bold tracking-wider text-[#732721] uppercase">
            Điểm dừng quyết định • Giờ thứ 4
          </span>
          <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-wide text-[#2e1f12] sm:text-4xl">
            DỪNG Ở GIỜ THỨ TƯ
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#66513c] sm:text-base">
            Người công nhân đã tạo ra <strong>15 USD giá trị mới</strong>, đúng
            bằng giá trị sức lao động đã bán cho nhà tư bản.
          </p>
        </div>

        {/* Question Box */}
        <div className="mt-6 rounded-xl border-2 border-[#b59e7e] bg-[#eedebd] p-4 text-center shadow-inner">
          <h3 className="font-serif text-lg font-bold tracking-wide text-[#2b1c10] sm:text-xl">
            CÂU HỎI: GIÁ TRỊ THẶNG DƯ ĐÃ XUẤT HIỆN CHƯA?
          </h3>
        </div>

        {/* 2 Answer Options */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Option A: ĐÃ XUẤT HIỆN */}
          <button
            onClick={() => setSelectedAnswer("already_appeared")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
              selectedAnswer === "already_appeared"
                ? "border-[#8c3e36] bg-[#f5dcd8] ring-2 ring-[#8c3e36]/40"
                : "border-[#c7b494] bg-[#f4ebcb] hover:border-[#8c3e36]"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8c3e36] text-3xl text-white shadow">
              ✕
            </div>
            <span className="mt-4 font-serif text-lg font-bold tracking-wider text-[#3d2716] uppercase">
              ĐÃ XUẤT HIỆN
            </span>
          </button>

          {/* Option B: CHƯA XUẤT HIỆN */}
          <button
            onClick={() => setSelectedAnswer("not_yet_appeared")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
              selectedAnswer === "not_yet_appeared"
                ? "border-[#256345] bg-[#dcf0e5] ring-2 ring-[#256345]/40"
                : "border-[#c7b494] bg-[#f4ebcb] hover:border-[#256345]"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#256345] text-3xl text-white shadow">
              ✓
            </div>
            <span className="mt-4 font-serif text-lg font-bold tracking-wider text-[#3d2716] uppercase">
              CHƯA XUẤT HIỆN
            </span>
          </button>
        </div>

        {/* Feedback Section */}
        {selectedAnswer !== null && (
          <div
            className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed animate-fadeIn ${
              isCorrect
                ? "border-[#256345] bg-[#e3f5eb] text-[#14472d]"
                : "border-[#8c3e36] bg-[#fce8e6] text-[#631e18]"
            }`}
          >
            {isCorrect ? (
              <p>
                <strong>🎉 CHÍNH XÁC!</strong> Trong 4 giờ đầu, người công nhân
                mới chỉ tái sản xuất ra lượng giá trị tương đương giá trị sức lao
                động mà nhà tư bản đã mua (15 USD). Đây là{" "}
                <strong>thời gian lao động tất yếu</strong>. Do đó giá trị thặng
                dư <strong>m = 0 USD</strong>.
              </p>
            ) : (
              <p>
                <strong>⚠️ CHƯA CHÍNH XÁC.</strong> Sau 4 giờ: Nhà tư bản đã chi
                50 USD bông + 3 USD hao mòn + 15 USD tiền công = 68 USD. Giá trị
                số sợi tạo ra cũng đúng bằng 68 USD. Lấy 68 – 68 ={" "}
                <strong>0 USD</strong>. Chưa có giá trị thặng dư nào xuất hiện!
              </p>
            )}
            <p className="mt-2 text-xs italic opacity-90">
              Nhà tư bản đã mua sức lao động cho cả ngày 8 giờ. Vì vậy, quá
              trình sản xuất sẽ tiếp tục 4 giờ tiếp theo!
            </p>
          </div>
        )}

        {/* Hint text if unselected */}
        {selectedAnswer === null && (
          <p className="mt-5 text-center text-xs italic text-[#705b45]">
            Gợi ý: 4 giờ đầu là thời gian lao động tất yếu.
          </p>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 rounded-xl border-2 border-[#541f1a] bg-[#802f28] px-8 py-3.5 font-serif text-base font-bold tracking-wider text-white shadow-lg transition hover:bg-[#96372f] hover:shadow-xl"
          >
            <span>TIẾP TỤC CA SẢN XUẤT</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}


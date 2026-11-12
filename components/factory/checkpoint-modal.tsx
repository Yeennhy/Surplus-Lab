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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-3xl rounded-2xl border-4 border-[#82674c] bg-[#fbf6e5] p-6 shadow-2xl sm:p-10">
        {/* Header Badge */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#8a443e] bg-[#f2dedb] px-3.5 py-1 text-xs font-bold tracking-wider text-[#732721] uppercase">
            Điểm dừng kiểm tra • Giờ thứ 4
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-wide text-[#2e1f12] sm:text-3xl">
            DỪNG Ở GIỜ THỨ TƯ
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#66513c] sm:text-base">
            Người công nhân đã tạo ra <strong>15 USD giá trị mới</strong>, đúng
            bằng giá trị sức lao động đã bán cho nhà tư bản.
          </p>
        </div>

        {/* Question Box */}
        <div className="mt-6 rounded-xl border-2 border-[#b59e7e] bg-[#eedebd] p-4 text-center shadow-inner">
          <h3 className="text-base font-bold tracking-wide text-[#2b1c10] sm:text-lg">
            CÂU HỎI: GIÁ TRỊ THẶNG DƯ ĐÃ XUẤT HIỆN CHƯA?
          </h3>
        </div>

        {/* 2 Answer Options - Neutral styling, no pre-highlighting of right/wrong */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Option A: ĐÃ XUẤT HIỆN */}
          <button
            onClick={() => setSelectedAnswer("already_appeared")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${selectedAnswer === "already_appeared"
              ? "border-[#8c3e36] bg-[#f5ecd2] ring-2 ring-[#8c3e36]/30 shadow-md"
              : "border-[#c7b494] bg-[#f4ebcb] hover:border-[#8c3e36]"
              }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8a7253] bg-[#eedebd] text-xl font-extrabold text-[#4a3826] shadow-sm">
              A
            </div>
            <span className="mt-3 text-base font-bold tracking-wider text-[#3d2716] uppercase">
              ĐÃ XUẤT HIỆN
            </span>
          </button>

          {/* Option B: CHƯA XUẤT HIỆN */}
          <button
            onClick={() => setSelectedAnswer("not_yet_appeared")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${selectedAnswer === "not_yet_appeared"
              ? "border-[#8c3e36] bg-[#f5ecd2] ring-2 ring-[#8c3e36]/30 shadow-md"
              : "border-[#c7b494] bg-[#f4ebcb] hover:border-[#8c3e36]"
              }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8a7253] bg-[#eedebd] text-xl font-extrabold text-[#4a3826] shadow-sm">
              B
            </div>
            <span className="mt-3 text-base font-bold tracking-wider text-[#3d2716] uppercase">
              CHƯA XUẤT HIỆN
            </span>
          </button>
        </div>

        {/* Result & Explanation Section - Only displayed after user selects an answer */}
        {selectedAnswer !== null && (
          <div className="mt-6 rounded-xl border-2 border-[#b59e7e] bg-[#eedebd] p-5 text-sm leading-relaxed text-[#2c1e10] animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2 font-bold text-base mb-2">
              <span className="rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#2c1e10] text-[#eedebd]">
                Kết quả giải thích
              </span>
              <span>
                {isCorrect
                  ? "Chính xác: Giá trị thặng dư chưa xuất hiện (m = 0 USD)"
                  : "Chưa chính xác: Giá trị thặng dư chưa xuất hiện (m = 0 USD)"}
              </span>
            </div>
            <p className="text-sm text-[#423120]">
              Trong 4 giờ đầu, người công nhân mới chỉ hoàn trả lại lượng giá trị tương đương giá trị sức lao động mà nhà tư bản đã mua (15 USD). Đây là <strong>thời gian lao động tất yếu</strong>.
            </p>
            <p className="mt-2 text-sm text-[#423120]">
              Nhà tư bản đã chi ra 68 USD (50 USD bông + 3 USD hao mòn + 15 USD tiền lương) và thu về lượng sợi có giá trị đúng bằng 68 USD (chênh lệch 68 – 68 = <strong>0 USD</strong>).
            </p>
            <p className="mt-2 text-xs italic text-[#634e38]">
              Giá trị thặng dư (m) chỉ bắt đầu hình thành từ giờ thứ 5 trở đi khi bước sang thời gian lao động thặng dư. Hãy nhấn nút bên dưới để tiếp tục ca sản xuất!
            </p>
          </div>
        )}

        {/* Prompt before selection */}
        {selectedAnswer === null && (
          <p className="mt-5 text-center text-xs font-medium text-[#705b45]">
            Vui lòng chọn một trong hai phương án trên để xem kết quả phân tích.
          </p>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onContinue}
            disabled={selectedAnswer === null}
            className={`flex items-center gap-2 rounded-xl border-2 px-8 py-3.5 text-base font-bold tracking-wider transition shadow-lg ${selectedAnswer !== null
              ? "border-[#541f1a] bg-[#802f28] text-white hover:bg-[#96372f] hover:shadow-xl cursor-pointer"
              : "border-[#a3947f] bg-[#c7baa7] text-[#5e5345] cursor-not-allowed opacity-60"
              }`}
          >
            <span>TIẾP TỤC CA SẢN XUẤT</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

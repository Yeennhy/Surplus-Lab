"use client";

import Link from "next/link";
import type { Chapter4Result } from "@/features/value/types";

interface Chapter4SummaryProps {
  result: Chapter4Result;
  onRestart: () => void;
}

export function Chapter4Summary({ result, onRestart }: Chapter4SummaryProps) {
  return (
    <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-10 shadow-xl text-center space-y-8 font-sans">
      {/* Header Badge */}
      <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-4 py-1 text-xs font-bold tracking-wider text-[#4a3826] uppercase">
        Nhiệm vụ 04 Hoàn thành
      </div>

      {/* Golden Medal Badge */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#b8860b] bg-gradient-to-b from-[#ffd700] via-[#e6b800] to-[#b8860b] shadow-xl">
          <span className="font-extrabold text-3xl text-[#523910]">★</span>
          <div className="absolute -bottom-2 rounded-full border border-[#8a7253] bg-[#802f28] px-3 py-0.5 text-[11px] font-bold text-white shadow">
            {result.stars === 3 ? "XUẤT SẮC" : result.stars === 2 ? "ĐẠT CHUẨN" : "CỐ GẮNG"}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2c1e13] mt-5">
          {result.badgeTitle}
        </h2>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mt-2 text-2xl text-[#d4a359]">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < result.stars ? "opacity-100" : "opacity-30"}>
              ★
            </span>
          ))}
        </div>

        <div className="mt-2 text-base font-bold text-[#8c352d]">
          Điểm số: {result.score} / 100 điểm
        </div>
      </div>

      {/* Numerical Invariant Confirmation without redundant $ symbols */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 text-left">
        <div className="rounded-xl border-2 border-[#d4a359] bg-[#fff9eb] p-3 text-center">
          <span className="text-[11px] font-bold text-[#b8860b] uppercase block">Tư bản bất biến (c)</span>
          <p className="text-2xl font-extrabold text-[#5c3e1e] mt-1">{result.cValue} USD</p>
          <span className="text-[10px] text-[#7a6448]">Bông (100) + Máy (6)</span>
        </div>

        <div className="rounded-xl border-2 border-[#3d5a80] bg-[#eef4f8] p-3 text-center">
          <span className="text-[11px] font-bold text-[#3d5a80] uppercase block">Tư bản khả biến (v)</span>
          <p className="text-2xl font-extrabold text-[#1d3557] mt-1">{result.vValue} USD</p>
          <span className="text-[10px] text-[#7a6448]">Sức lao động</span>
        </div>

        <div className="rounded-xl border-2 border-[#802f28] bg-[#fbf0ef] p-3 text-center">
          <span className="text-[11px] font-bold text-[#802f28] uppercase block">Giá trị thặng dư (m)</span>
          <p className="text-2xl font-extrabold text-[#802f28] mt-1">{result.mValue} USD</p>
          <span className="text-[10px] text-[#802f28] font-bold">Không ứng trước</span>
        </div>

        <div className="rounded-xl border-2 border-[#1c3326] bg-[#f0f6f2] p-3 text-center">
          <span className="text-[11px] font-bold text-[#1c3326] uppercase block">Tổng giá trị (G)</span>
          <p className="text-2xl font-extrabold text-[#1c3326] mt-1">{result.totalG} USD</p>
          <span className="text-[10px] text-[#1c3326] font-bold">c + (v + m)</span>
        </div>
      </div>

      {/* Key Insights List without unnecessary emojis */}
      <div className="rounded-xl border-2 border-[#8a7253] bg-[#fbf5e6] p-6 text-left">
        <h3 className="text-base font-bold text-[#2c1e13] mb-3">
          Kết luận cốt lõi Chương 4:
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-[#4a3826] list-disc pl-5 leading-relaxed">
          {result.keyInsights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Next Step Navigation */}
      <div className="flex items-center justify-center flex-wrap gap-4 pt-4 border-t border-[#e2d5bd]">
        <button
          onClick={onRestart}
          className="rounded-xl border border-[#8a7253] bg-[#e6d8ba] px-6 py-3 text-sm font-bold text-[#4a3826] transition hover:bg-[#dcd0b0]"
        >
          Làm lại Chương 4
        </button>

        <Link
          href="/challenge"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1c3326] bg-[#1c3326] px-8 py-3 text-sm font-bold !text-white no-underline shadow-md transition hover:bg-[#254534]"
        >
          <span>Tiến vào Thử thách Quiz cuối khóa</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

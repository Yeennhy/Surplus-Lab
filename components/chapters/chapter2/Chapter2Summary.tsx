"use client";

import Link from "next/link";
import type { Chapter2Result } from "@/features/labor/types";
import { Button } from "@/components/ui/Button";

interface Chapter2SummaryProps {
  result: Chapter2Result;
  onRestart: () => void;
}

export function Chapter2Summary({ result, onRestart }: Chapter2SummaryProps) {
  return (
    <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-10 shadow-xl text-center space-y-8">
      {/* Header Badge */}
      <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-4 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase">
        Nhiệm vụ 02 Hoàn thành
      </div>

      {/* Golden Medal (Matching Figma Screen 16) */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#b8860b] bg-gradient-to-b from-[#ffd700] via-[#e6b800] to-[#b8860b] text-5xl shadow-2xl">
          <span className="drop-shadow-md">🏆</span>
          <div className="absolute -bottom-2 rounded-full border border-[#8a7253] bg-[#802f28] px-3 py-0.5 font-serif text-[11px] font-bold text-white shadow">
            {result.stars === 3 ? "XUẤT SẮC" : result.stars === 2 ? "ĐẠT CHUẨN" : "CỐ GẮNG"}
          </div>
        </div>

        <h2 className="font-serif text-3xl font-extrabold text-[#2c1e13] mt-5">
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

        <div className="mt-2 font-serif text-lg font-bold text-[#8c352d]">
          Tổng điểm: {result.score} / 100 điểm
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid gap-4 sm:grid-cols-3 text-left">
        <div className="rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-4 text-center">
          <span className="font-serif text-xs font-bold text-[#7a6448] uppercase">
            Tình huống lịch sử
          </span>
          <p className="font-serif text-2xl font-extrabold text-[#2c1e13] mt-1">
            {result.scenarioScore} Đúng
          </p>
          <span className="text-xs text-[#5c4632]">Đánh giá 2 điều kiện đồng thời</span>
        </div>

        <div className="rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-4 text-center">
          <span className="font-serif text-xs font-bold text-[#7a6448] uppercase">
            Hai thuộc tính
          </span>
          <p className="font-serif text-2xl font-extrabold text-[#2c1e13] mt-1">
            {result.attributeScore} / 4
          </p>
          <span className="text-xs text-[#5c4632]">Giá trị & Giá trị sử dụng</span>
        </div>

        <div className="rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-4 text-center">
          <span className="font-serif text-xs font-bold text-[#7a6448] uppercase">
            Ba bộ phận giá trị
          </span>
          <p className="font-serif text-2xl font-extrabold text-[#2c1e13] mt-1">
            {result.valueCompScore} / 5
          </p>
          <span className="text-xs text-[#5c4632]">Cơ cấu giá trị sức lao động</span>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="rounded-xl border-2 border-[#8a7253] bg-[#fbf5e6] p-6 text-left">
        <h3 className="font-serif text-base font-bold text-[#2c1e13] mb-3 flex items-center gap-2">
          <span>📜</span> Kết luận lý luận cốt lõi:
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-[#4a3826] list-disc pl-5 leading-relaxed">
          {result.keyInsights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#e2d5bd]">
        <Button onClick={onRestart} variant="secondary" size="lg">
          Chơi lại Chương 2
        </Button>

        <Link href="/learn/chapter-3">
          <Button variant="success" size="lg">
            Tiếp tục: Chương 3 (Nhà máy sợi) →
          </Button>
        </Link>
      </div>
    </div>
  );
}

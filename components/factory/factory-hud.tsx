"use client";

import Link from "next/link";

interface FactoryHudProps {
  capitalUSD?: number;
  missionNumber?: string;
  chapterTitle?: string;
  badgeCount?: number;
  onOpenLog?: () => void;
}

export function FactoryHud({
  capitalUSD = 121,
  missionNumber = "03",
  chapterTitle = "Chương 3: Giá trị thặng dư",
  badgeCount = 2,
  onOpenLog,
}: FactoryHudProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#3d2f22] bg-[#161d19] px-4 py-2.5 text-[#e5dac1] shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 font-sans">
        {/* Brand & Chapter */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-105 !text-[#f5ebd7] no-underline"
            title="Về Bản đồ hành trình"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8a7253] bg-[#222b26] text-base font-bold text-[#d4a359]">
              SL
            </span>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-wider text-[#f5ebd7]">
                SURPLUS LAB
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#a89678] uppercase">
                {chapterTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Status Pills */}
        <div className="hidden items-center gap-2 sm:flex md:gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[#7a6448] bg-[#222b26] px-3.5 py-1 text-xs font-semibold text-[#f0e3cc]">
            <span className="text-[#d4a359] font-bold">USD</span>
            <span>TƯ BẢN {capitalUSD} USD</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#7a6448] bg-[#222b26] px-3.5 py-1 text-xs font-semibold text-[#f0e3cc]">
            <span className="text-[#d4a359] font-bold">#</span>
            <span>NHIỆM VỤ {missionNumber}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#7a6448] bg-[#222b26] px-3.5 py-1 text-xs font-semibold text-[#f0e3cc]">
            <span className="text-[#d4a359] font-bold">★</span>
            <span>{String(badgeCount).padStart(2, "0")} HUY HIỆU</span>
          </div>
        </div>

        {/* Right Menu Action */}
        <div className="flex items-center gap-2">
          {onOpenLog && (
            <button
              onClick={onOpenLog}
              className="flex items-center gap-1.5 rounded border border-[#6b583f] bg-[#26312a] px-3 py-1 text-xs font-medium text-[#decbb0] transition hover:bg-[#344238] hover:text-[#fff]"
            >
              <span>NHẬT KÝ</span>
            </button>
          )}

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded border border-[#8a423b] bg-[#6e2b26] px-3.5 py-1 text-xs font-bold !text-white no-underline transition hover:bg-[#86352f]"
          >
            <span>←</span>
            <span>LỘ TRÌNH</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

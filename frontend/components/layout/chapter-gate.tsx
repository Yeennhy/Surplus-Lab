"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CHAPTER_COMPLETED_EVENT, readCompletedChapters } from "@/backend/domain/progress/events";

export function ChapterGate({ chapter, children }: { chapter: 2 | 3 | 4 | 5; children: ReactNode }) {
  const [completed, setCompleted] = useState<number[] | null>(null);

  useEffect(() => {
    const refresh = () => setCompleted(readCompletedChapters());
    refresh();
    window.addEventListener(CHAPTER_COMPLETED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHAPTER_COMPLETED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (completed === null) return <main className="grid min-h-screen place-items-center bg-[#183126] p-6 text-[#f7e9bc]">Đang đọc tiến độ học…</main>;
  const required = Array.from({ length: chapter - 1 }, (_, index) => index + 1);
  const missing = required.find((id) => !completed.includes(id));
  if (!missing) return <>{children}</>;

  return <main className="grid min-h-screen place-items-center bg-[#183126] p-5 text-[#392719]">
    <section className="w-full max-w-xl rounded-xl border-4 border-[#9b7046] bg-[#f8eabd] p-7 text-center shadow-2xl sm:p-10">
      <span aria-hidden="true" className="text-5xl">🔒</span>
      <p className="mt-4 text-xs font-extrabold uppercase tracking-[.18em] text-[#865c37]">Chặng chưa mở</p>
      <h1 className="mt-2 text-3xl font-extrabold">Hoàn thành Chương {missing} trước nhé</h1>
      <p className="mt-4">Lộ trình mở lần lượt qua bốn chương. Sau khi hoàn thành cả bốn, thử thách cuối sẽ xuất hiện.</p>
      <Link className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-[#315e43] px-6 py-3 font-bold text-white!" href="/">Về bản đồ · Chương {missing} đang chờ →</Link>
      <p className="mt-5"><Link href="/">Xem bản đồ hành trình</Link></p>
    </section>
  </main>;
}

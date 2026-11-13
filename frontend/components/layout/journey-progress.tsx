"use client";

import { useEffect, useState } from "react";
import { CHAPTER_COMPLETED_EVENT } from "@/backend/domain/progress/events";

function readCompleted(): number[] {
  try {
    const value = JSON.parse(window.localStorage.getItem("surplus-lab-completed-v1") ?? "[]");
    return Array.isArray(value) ? value.filter((item) => Number.isInteger(item) && item >= 1 && item <= 4) : [];
  } catch {
    return [];
  }
}

export function JourneyProgress({ chapter }: { chapter: number }) {
  const [completed, setCompleted] = useState<number[]>([]);
  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    refresh();
    window.addEventListener(CHAPTER_COMPLETED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHAPTER_COMPLETED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return completed.includes(chapter) ? <span aria-label={`Đã hoàn thành chương ${chapter}`}>Đã hoàn thành ✓</span> : null;
}

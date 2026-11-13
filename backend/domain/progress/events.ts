/** M1 can listen for this event to update the in-session Campaign progress. */
export const CHAPTER_COMPLETED_EVENT = "surplus-lab:chapter-completed";

export function readCompletedChapters(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem("surplus-lab-completed-v1") ?? "[]");
    return Array.isArray(value) ? value.filter((item) => Number.isInteger(item) && item >= 1 && item <= 4) : [];
  } catch {
    return [];
  }
}

export function emitChapterCompleted(chapter: 1 | 2 | 3 | 4): void {
  if (typeof window === "undefined") return;
  try {
    const completed = readCompletedChapters();
    window.localStorage.setItem("surplus-lab-completed-v1", JSON.stringify([...new Set([...completed, chapter])]));
  } catch {
    // The chapter remains playable when browser storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(CHAPTER_COMPLETED_EVENT, { detail: { chapter } }));
}

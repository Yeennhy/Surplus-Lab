/** M1 can listen for this event to update the in-session Campaign progress. */
export const CHAPTER_COMPLETED_EVENT = "surplus-lab:chapter-completed";

export function emitChapterCompleted(chapter: 2 | 3 | 4): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHAPTER_COMPLETED_EVENT, { detail: { chapter } }));
}

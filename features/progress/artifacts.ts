import type { ShiftLedger } from "../factory/gameplay";

const KEY = "surplus-lab-chapters-2-4-v1";
const DRAFT_PREFIX = "surplus-lab-chapter-draft-v1-";

export interface ChapterArtifacts {
  contract?: { workerId: "b"; value: number; hours: number };
  ledger?: ShiftLedger;
}

export function readChapterArtifacts(): ChapterArtifacts {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as ChapterArtifacts;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function saveChapterArtifacts(patch: ChapterArtifacts): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...readChapterArtifacts(), ...patch }));
  } catch {
    // Storage may be disabled; gameplay remains available for the current page.
  }
}

export function readChapterDraft<T>(chapter: 2 | 3 | 4): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${DRAFT_PREFIX}${chapter}`);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

export function saveChapterDraft<T>(chapter: 2 | 3 | 4, draft: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${DRAFT_PREFIX}${chapter}`, JSON.stringify(draft));
  } catch {
    // Storage is optional; the current in-memory game continues to work.
  }
}

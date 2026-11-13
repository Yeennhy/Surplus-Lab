import { ValueChapter } from "@/frontend/components/chapters/chapter-4/value-chapter";
import { ChapterGate } from "@/frontend/components/layout/chapter-gate";

export default function Page() {
  return <ChapterGate chapter={4}><ValueChapter /></ChapterGate>;
}

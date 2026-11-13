import { LaborChapter } from "@/frontend/components/chapters/chapter-2/labor-chapter";
import { ChapterGate } from "@/frontend/components/layout/chapter-gate";

export default function Page() {
  return <ChapterGate chapter={2}><LaborChapter /></ChapterGate>;
}

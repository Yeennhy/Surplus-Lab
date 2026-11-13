import { FactoryChapter } from "@/frontend/components/chapters/chapter-3/factory-chapter";
import { ChapterGate } from "@/frontend/components/layout/chapter-gate";

export default function Page() {
  return <ChapterGate chapter={3}><FactoryChapter /></ChapterGate>;
}

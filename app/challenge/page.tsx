import { QuizScreen } from "@/frontend/components/quiz/quiz-screen";
import { ChapterGate } from "@/frontend/components/layout/chapter-gate";

export default function Page() {
	return <ChapterGate chapter={5}><QuizScreen /></ChapterGate>;
}

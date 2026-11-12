"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { questions } from "@/content/questions";
import type { Question, QuizResult } from "@/features/quiz/types";

type QuizPhase = "question" | "feedback" | "results";
const QUIZ_QUESTION_COUNT = 10;

function selectRandomQuestions(source: Question[], count: number): Question[] {
  const shuffled = [...source];

  for (let index = 0; index < count; index += 1) {
    const swapIndex = index + Math.floor(Math.random() * (shuffled.length - index));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

function isCorrectAnswer(question: Question, answer: string): boolean {
  if (question.type === "choice") {
    return answer === question.correctAnswer;
  }

  const numericAnswer = Number(answer.trim().replace(",", "."));
  const tolerance = question.tolerance ?? 0;
  return Number.isFinite(numericAnswer) && Math.abs(numericAnswer - question.correctAnswer) <= tolerance;
}

function getCorrectAnswerLabel(question: Question): string {
  if (question.type === "choice") {
    const choice = question.choices.find((item) => item.id === question.correctAnswer);
    return choice ? `${choice.id}. ${choice.text}` : question.correctAnswer;
  }

  return `${question.correctAnswer}${question.unit ? ` ${question.unit}` : ""}`;
}

function getSelectedAnswerLabel(question: Question, answer: string): string {
  if (question.type === "choice") {
    const choice = question.choices.find((item) => item.id === answer);
    return choice ? `${choice.id}. ${choice.text}` : answer;
  }

  return `${answer}${question.unit ? ` ${question.unit}` : ""}`;
}

export function QuizScreen({ onComplete }: { onComplete?: (result: QuizResult) => void }) {
  const [quizQuestions, setQuizQuestions] = useState(() => questions.slice(0, QUIZ_QUESTION_COUNT));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [numericAnswer, setNumericAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [answerWasCorrect, setAnswerWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("question");
  const question = quizQuestions[questionIndex];

  useEffect(() => {
    setQuizQuestions(selectRandomQuestions(questions, QUIZ_QUESTION_COUNT));
  }, []);

  function submitAnswer() {
    const answer = question.type === "choice" ? selectedChoice : numericAnswer.trim();
    if (!answer) return;

    const correct = isCorrectAnswer(question, answer);
    setSubmittedAnswer(answer);
    setAnswerWasCorrect(correct);
    if (correct) setScore((currentScore) => currentScore + 1);
    setPhase("feedback");
  }

  function retryQuestion() {
    setSelectedChoice("");
    setNumericAnswer("");
    setSubmittedAnswer("");
    setPhase("question");
  }

  function advanceQuestion() {
    if (questionIndex === quizQuestions.length - 1) {
      onComplete?.({
        score,
        total: quizQuestions.length,
        percentage: Math.round((score / quizQuestions.length) * 100),
      });
      setPhase("results");
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedChoice("");
    setNumericAnswer("");
    setSubmittedAnswer("");
    setPhase("question");
  }

  function restartQuiz() {
    setQuizQuestions(selectRandomQuestions(questions, QUIZ_QUESTION_COUNT));
    setQuestionIndex(0);
    setSelectedChoice("");
    setNumericAnswer("");
    setSubmittedAnswer("");
    setAnswerWasCorrect(false);
    setScore(0);
    setPhase("question");
  }

  const progress = ((questionIndex + 1) / quizQuestions.length) * 100;

  return (
    <main className="min-h-screen bg-[#183126] px-3 py-5 text-[#392719] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl overflow-hidden border-[5px] border-[#704a2e] bg-[#f7e9bc] shadow-[0_0_0_2px_#b58a54,0_18px_50px_rgba(0,0,0,0.3)]">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 bg-[#211b17] px-5 py-3 text-[#f5e9c9] sm:px-8">
          <Link href="/" className="font-serif text-lg font-bold tracking-wide text-[#f5e9c9]!">◉ SURPLUS LAB</Link>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider sm:gap-3">
            <span className="rounded border border-[#99724e] bg-[#684a32] px-4 py-2">Chương 5</span>
            <span className="rounded border border-[#99724e] bg-[#684a32] px-4 py-2">Tư bản 121 USD</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">≡ Nhật ký</span>
        </header>

        <section className="m-3 border-[5px] border-[#9b7046] bg-[#f8eabd] p-4 shadow-[inset_0_0_0_2px_#fff3d3] sm:m-6 sm:p-8 lg:m-10 lg:px-14 lg:py-10">
          {phase === "question" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b5b39]">Thử thách kiến thức</p>
                  <h1 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                    Câu [{String(questionIndex + 1).padStart(2, "0")}/{String(quizQuestions.length).padStart(2, "0")}]
                  </h1>
                </div>
                <div className="min-w-36 text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6b5135]">Điểm</p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#276342]">{score} / {quizQuestions.length}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="shrink-0 rounded bg-[#6b4a31] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#fff1ce]">
                  Câu {questionIndex + 1} / {quizQuestions.length}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#ddc99b]" aria-label={`Tiến độ ${questionIndex + 1} trên ${quizQuestions.length}`}>
                  <div className="h-full rounded-full bg-[#397350] transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <fieldset className="mt-5 rounded-md border border-[#bca174] bg-[#e1cda0] p-5 sm:p-7">
                <legend className="sr-only">Câu hỏi {questionIndex + 1}</legend>
                <p className="font-serif text-lg font-bold leading-relaxed sm:text-xl">{question.prompt}</p>
                {question.type === "choice" ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {question.choices.map((choice) => {
                      const isSelected = selectedChoice === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedChoice(choice.id)}
                          className={`flex min-h-20 items-start gap-4 rounded-md border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#276342] ${isSelected ? "border-[#276342] bg-[#d2ddc7]" : "border-[#c6ad7d] bg-[#e7d5ad] hover:bg-[#efdfbb]"}`}
                        >
                          <span className={`grid size-8 shrink-0 place-items-center rounded text-xs font-black text-[#fff1ce] ${isSelected ? "bg-[#276342]" : "bg-[#765137]"}`}>
                            {choice.id}
                          </span>
                          <span className="pt-1 text-sm font-semibold leading-relaxed">{choice.text}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <label className="mt-6 block max-w-sm text-sm font-bold">
                    Nhập đáp án{question.unit ? ` (${question.unit})` : ""}
                    <input
                      type="number"
                      inputMode="decimal"
                      value={numericAnswer}
                      onChange={(event) => setNumericAnswer(event.target.value)}
                      className="mt-2 min-h-12 w-full rounded border border-[#a8895d] bg-[#f7edcf] px-4 text-lg font-bold outline-none focus:border-[#276342] focus:ring-2 focus:ring-[#276342]/30"
                    />
                  </label>
                )}
              </fieldset>

              <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
                <Link href="/learn/chapter-4" className="inline-flex min-h-11 items-center justify-center rounded bg-[#765137] px-6 text-sm font-bold uppercase tracking-wide text-[#fff1ce]! hover:bg-[#62432e]">
                  Quay lại
                </Link>
                <button
                  type="button"
                  onClick={submitAnswer}
                  disabled={question.type === "choice" ? !selectedChoice : !numericAnswer.trim()}
                  className="inline-flex min-h-12 items-center justify-center rounded bg-[#954c3b] px-7 text-sm font-bold uppercase tracking-wide text-[#fff4d8] hover:bg-[#7c3d30] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Nộp đáp án <span aria-hidden="true" className="ml-2">→</span>
                </button>
              </div>
            </>
          )}

          {phase === "feedback" && (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b5b39]">Phản hồi đáp án</p>
              <h1 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{answerWasCorrect ? "Chính xác" : "Chưa chính xác"}</h1>
              <p className="mt-2 text-sm text-[#725e43]">{answerWasCorrect ? "Đáp án đúng. Cùng xem lại cách giải." : "Đọc lời giải rồi thử lại hoặc chuyển sang câu tiếp theo."}</p>

              <section className="mt-7 rounded-md border border-[#bca174] bg-[#e1cda0] p-5 sm:p-7" aria-label="Đối chiếu đáp án">
                <h2 className="font-serif text-lg font-bold">{question.prompt}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded bg-[#994c3c] px-4 py-3 text-sm font-bold text-[#fff1ce]">
                    <span className="block text-[10px] uppercase tracking-widest opacity-80">Đã chọn</span>
                    <span className="mt-1 block leading-relaxed">{getSelectedAnswerLabel(question, submittedAnswer)}</span>
                  </div>
                  <div className="rounded bg-[#34704e] px-4 py-3 text-sm font-bold text-[#fff1ce]">
                    <span className="block text-[10px] uppercase tracking-widest opacity-80">Đáp án</span>
                    <span className="mt-1 block leading-relaxed">{getCorrectAnswerLabel(question)}</span>
                  </div>
                </div>
              </section>

              <section className="mt-4 rounded-md border border-[#bca174] bg-[#e1cda0] p-5 sm:p-7">
                <h2 className="font-serif text-lg font-bold uppercase">Hướng dẫn giải chi tiết</h2>
                <ol className="mt-4 space-y-3">
                  {question.explanation.map((step, index) => (
                    <li key={`${question.id}-step-${index}`} className="flex gap-3 text-sm leading-relaxed">
                      <span className="font-bold text-[#80603c]">Bước {index + 1}:</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                {!answerWasCorrect && (
                  <button type="button" onClick={retryQuestion} className="min-h-12 rounded bg-[#765137] px-8 text-sm font-bold uppercase tracking-wide text-[#fff1ce] hover:bg-[#62432e]">
                    Thử lại
                  </button>
                )}
                <button type="button" onClick={advanceQuestion} className="min-h-12 rounded bg-[#34704e] px-8 text-sm font-bold uppercase tracking-wide text-[#fff1ce] hover:bg-[#285c3e]">
                  {questionIndex === quizQuestions.length - 1 ? "Xem kết quả" : "Câu tiếp theo →"}
                </button>
              </div>
            </>
          )}

          {phase === "results" && (
            <div className="mx-auto max-w-2xl py-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b5b39]">Thử thách hoàn tất</p>
              <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Kết quả của bạn</h1>
              <p className="mt-6 font-serif text-6xl font-bold text-[#276342]">{score}<span className="text-3xl text-[#765137]"> / {quizQuestions.length}</span></p>
              <p className="mt-4 text-base leading-relaxed">
                {score === quizQuestions.length ? "Xuất sắc. Bạn đã nắm vững các khái niệm chính." : "Hãy xem lại các lời giải và thử thách bản thân thêm lần nữa."}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={restartQuiz} className="min-h-12 rounded bg-[#954c3b] px-8 text-sm font-bold uppercase tracking-wide text-[#fff4d8] hover:bg-[#7c3d30]">
                  Làm lại
                </button>
                <Link href="/learn/chapter-4" className="inline-flex min-h-12 items-center justify-center rounded bg-[#765137] px-8 text-sm font-bold uppercase tracking-wide text-[#fff1ce]! hover:bg-[#62432e]">
                  Về chương 4
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
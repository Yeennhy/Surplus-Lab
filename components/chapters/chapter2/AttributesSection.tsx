"use client";

import { useState } from "react";
import { ATTRIBUTE_QUIZ_QUESTIONS } from "@/features/labor/constants";
import { evaluateAttributeQuestions } from "@/features/labor/engine";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AttributesSectionProps {
  onComplete: (passed: boolean) => void;
}

export function AttributesSection({ onComplete }: AttributesSectionProps) {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const evalResult = submitted ? evaluateAttributeQuestions(userAnswers) : null;
  const isAllAnswered =
    Object.keys(userAnswers).length === ATTRIBUTE_QUIZ_QUESTIONS.length;

  const handleSubmit = () => {
    if (!isAllAnswered) {
      alert("Vui lòng trả lời đủ cả 4 câu hỏi!");
      return;
    }
    setSubmitted(true);
  };

  const handleProceed = () => {
    const passed = (evalResult?.score || 0) >= 3;
    onComplete(passed);
  };

  return (
    <div className="space-y-8">
      {/* Dual Attribute Presentation (Matching Figma Screen 08 & 11) */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-sm">
        <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase mb-3">
          Hai thuộc tính
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2c1e13] mb-3">
          Hai thuộc tính của hàng hóa sức lao động
        </h2>
        <p className="text-sm text-[#4a3826] leading-relaxed">
          Cũng như mọi hàng hóa khác, sức lao động có <strong>Giá trị</strong> và{" "}
          <strong>Giá trị sử dụng</strong>. Nhưng điểm độc đáo mang tính cách mạng
          của học thuyết Mác nằm ở thuộc tính <em>Giá trị sử dụng đặc biệt</em>.
        </p>

        {/* Dual Cards */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Attribute 1: Value */}
          <div className="rounded-xl border-2 border-[#1c3326] bg-[#f0f6f2] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1c3326] bg-[#2d4d3a] text-white text-2xl shadow-md">
                  ⚖️
                </div>
                <div>
                  <span className="font-serif text-xs font-bold text-[#2d4d3a] uppercase">
                    Thuộc tính 1
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1c3326]">
                    Giá trị của sức lao động
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#263c2e] leading-relaxed">
                <p>
                  Được quyết định bởi <strong>thời gian lao động xã hội cần thiết</strong>{" "}
                  để sản xuất và tái sản xuất ra sức lao động.
                </p>
                <p>
                  Vì sức lao động tồn tại trong con người sống, nên giá trị của nó được
                  đo lường gián tiếp bằng <strong>giá trị các tư liệu sinh hoạt</strong>{" "}
                  cần thiết để nuôi sống người lao động, gia đình họ và chi phí đào tạo.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#2d4d3a]/30 bg-white/70 p-3 text-xs font-serif font-semibold text-[#1c3326]">
              📌 Mang yếu tố tinh thần và lịch sử (khác hàng hóa vật thể thông thường).
            </div>
          </div>

          {/* Attribute 2: Use Value */}
          <div className="rounded-xl border-2 border-[#541f1a] bg-[#fbf0ef] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#541f1a] bg-[#802f28] text-white text-2xl shadow-md">
                  ✨
                </div>
                <div>
                  <span className="font-serif text-xs font-bold text-[#802f28] uppercase">
                    Thuộc tính 2 (Đặc biệt)
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#541f1a]">
                    Giá trị sử dụng đặc biệt
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#4a221f] leading-relaxed">
                <p>
                  Thể hiện trong quá trình người mua <strong>tiêu dùng (sử dụng)</strong>{" "}
                  sức lao động trong quá trình sản xuất.
                </p>
                <p>
                  <strong>Tính chất siêu việt:</strong> Khi được tiêu dùng, nó có khả
                  năng tạo ra một lượng giá trị mới <em>LỚN HƠN</em> giá trị của bản
                  thân nó. Phần dôi ra chính là <strong>giá trị thặng dư (m)</strong>!
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[#802f28]/30 bg-white/70 p-3 text-xs font-serif font-semibold text-[#802f28]">
              🔑 Chìa khóa giải quyết mâu thuẫn công thức chung T - H - T&apos;.
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quiz (Matching Figma Screen 15) */}
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <span className="rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase">
              Kiểm tra nhanh
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2c1e13] mt-1">
              Thấu hiểu hai thuộc tính
            </h3>
          </div>
          {submitted && evalResult && (
            <div className="rounded-lg border-2 border-[#8a7253] bg-[#f7eed7] px-4 py-1.5 font-serif text-sm font-bold text-[#2c1e13]">
              Điểm: {evalResult.score} / {evalResult.total} câu đúng
            </div>
          )}
        </div>

        <div className="space-y-6">
          {ATTRIBUTE_QUIZ_QUESTIONS.map((q, qIdx) => {
            const isUserCorrect =
              submitted && evalResult?.results[q.id] === true;
            const isUserWrong =
              submitted && evalResult?.results[q.id] === false;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-xl border-2 p-5 transition",
                  isUserCorrect
                    ? "border-[#1c3326] bg-[#f0f6f2]"
                    : isUserWrong
                    ? "border-[#541f1a] bg-[#fbf0ef]"
                    : "border-[#c8b79b] bg-[#fdf8ed]"
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#8a7253] bg-[#802f28] font-serif text-xs font-bold text-white">
                    {qIdx + 1}
                  </span>
                  <p className="font-serif text-sm font-bold text-[#2c1e13]">
                    {q.question}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 mt-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    const isCorrectAnswer = q.correctOptionIndex === optIdx;

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={cn(
                          "flex items-start gap-2.5 rounded-lg border-2 p-3 text-left text-xs transition",
                          submitted
                            ? isCorrectAnswer
                              ? "border-[#1c3326] bg-[#2d4d3a] text-white font-bold"
                              : isSelected
                              ? "border-[#541f1a] bg-[#802f28] text-white font-bold"
                              : "border-[#e2d5bd] bg-white/70 text-[#7a6448]"
                            : isSelected
                            ? "border-[#541f1a] bg-[#fff9eb] ring-2 ring-[#d4a359] text-[#2c1e13] font-bold"
                            : "border-[#c8b79b] bg-white text-[#4a3826] hover:bg-[#f7eed7]"
                        )}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-serif">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-3 rounded-md bg-white/80 p-2.5 text-xs text-[#4a3826] border border-[#d4a359]/40 leading-relaxed">
                    <strong>Giải thích:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          {!submitted ? (
            <Button onClick={handleSubmit} size="lg">
              Kiểm tra đáp án
            </Button>
          ) : (
            <Button onClick={handleProceed} variant="success" size="lg">
              Chuyển sang Ba bộ phận cấu thành giá trị →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

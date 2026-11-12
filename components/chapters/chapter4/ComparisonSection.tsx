"use client";

import { CAPITAL_COMPARISON } from "@/features/value/constants";
import { Button } from "@/components/ui/Button";

interface ComparisonSectionProps {
  onContinue: () => void;
}

export function ComparisonSection({ onContinue }: ComparisonSectionProps) {
  return (
    <div className="space-y-8 font-sans">
      <div className="rounded-2xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 sm:p-8 shadow-sm">
        <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 text-xs font-bold tracking-wider text-[#4a3826] uppercase mb-3">
          Mở rộng lý thuyết
        </div>
        <h2 className="text-2xl font-bold text-[#2c1e13] mb-3">
          So sánh: Tư bản (c / v) vs. Tư bản Cố định / Lưu động
        </h2>
        <p className="text-sm text-[#4a3826] leading-relaxed">
          Nhiều người học thường nhầm lẫn giữa hai cặp phân chia này. Bảng đối chiếu dưới đây làm rõ sự khác biệt căn bản về mục đích nghiên cứu và căn cứ phân chia:
        </p>

        {/* Comparison Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border-2 border-[#8a7253] bg-[#fbf5e6] shadow-inner">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-[#8a7253] bg-[#222b26] text-[#f5ebd7]">
                <th className="p-3.5 sm:p-4 font-bold uppercase tracking-wider w-1/4">
                  Tiêu chí
                </th>
                <th className="p-3.5 sm:p-4 font-bold uppercase tracking-wider border-l border-[#3b2f24] w-3/8 text-[#d4a359]">
                  Tư bản Bất biến (c) / Khả biến (v)
                </th>
                <th className="p-3.5 sm:p-4 font-bold uppercase tracking-wider border-l border-[#3b2f24] w-3/8 text-[#e5dac1]">
                  Tư bản Cố định / Lưu động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2d5bd]">
              {CAPITAL_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#fff9eb] transition">
                  <td className="p-3.5 sm:p-4 font-bold text-[#2c1e13]">
                    {row.criterion}
                  </td>
                  <td className="p-3.5 sm:p-4 border-l border-[#e2d5bd] text-[#3b2d1d] whitespace-pre-line leading-relaxed">
                    {row.constantVsVariable}
                  </td>
                  <td className="p-3.5 sm:p-4 border-l border-[#e2d5bd] text-[#4a3826] whitespace-pre-line leading-relaxed">
                    {row.fixedVsCirculating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Takeaway Box */}
        <div className="mt-6 rounded-xl border-2 border-[#1c3326] bg-[#f0f6f2] p-5 text-xs sm:text-sm text-[#1c3326] leading-relaxed">
          <div className="font-bold text-base mb-1">
            Kết luận quan trọng của C. Mác:
          </div>
          Phân chia thành <strong>tư bản bất biến (c)</strong> và <strong>tư bản khả biến (v)</strong> là phát kiến riêng của C. Mác, vạch trần nguồn gốc thực sự của giá trị thặng dư là do sức lao động của giai cấp công nhân tạo ra, bác bỏ quan điểm cho rằng máy móc tự sinh ra lợi nhuận.
        </div>

        {/* Next Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={onContinue} variant="success" size="lg">
            Hoàn tất và xem Bảng tổng kết Chương 4 →
          </Button>
        </div>
      </div>
    </div>
  );
}

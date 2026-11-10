"use client";

import { Button } from "@/components/ui/Button";
import { LABOR_CONDITIONS } from "@/features/labor/constants";

interface ConditionCardProps {
  onContinue: () => void;
}

export function ConditionCard({ onContinue }: ConditionCardProps) {
  return (
    <div className="space-y-8">
      {/* Distinction section */}
      <div className="rounded-xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 shadow-sm">
        <div className="inline-block rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase mb-3">
          Khái niệm căn bản
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2c1e13] mb-3">
          Phân biệt: Sức lao động và Lao động
        </h2>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="rounded-lg border-2 border-[#d4a359] bg-[#fbf4e2] p-5 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#5c3e1e] flex items-center gap-2">
              <span className="text-xl">⚡</span> Sức lao động (Khả năng)
            </h3>
            <p className="mt-2 text-sm text-[#3b2d1d] leading-relaxed">
              Là <strong>toàn bộ thể lực và trí lực</strong> tồn tại trong một con người sống, được người đó vận dụng mỗi khi sản xuất ra một giá trị sử dụng nào đó.
            </p>
            <p className="mt-2 text-xs font-serif font-bold text-[#8c352d]">
              → Tồn tại dưới dạng tiềm năng trong con người đang sống.
            </p>
          </div>

          <div className="rounded-lg border-2 border-[#3d5a80] bg-[#eef4f8] p-5 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#1d3557] flex items-center gap-2">
              <span className="text-xl">🔨</span> Lao động (Quá trình)
            </h3>
            <p className="mt-2 text-sm text-[#3b2d1d] leading-relaxed">
              Là <strong>quá trình tiêu dùng</strong> hay vận dụng sức lao động vào thực tế sản xuất. Lao động là hành vi thực tế, kết hợp sức lao động với tư liệu sản xuất.
            </p>
            <p className="mt-2 text-xs font-serif font-bold text-[#1d3557]">
              → Không thể mua bán cái chưa diễn ra. Hàng hóa là <em>sức lao động</em>!
            </p>
          </div>
        </div>
      </div>

      {/* The Two Conditions */}
      <div className="rounded-xl border-2 border-[#8a7253] bg-[#fff9eb] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <span className="rounded-md border border-[#8a7253] bg-[#e6d8ba] px-2.5 py-1 font-serif text-xs font-bold tracking-wider text-[#4a3826] uppercase">
              Điều kiện lịch sử
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2c1e13] mt-2">
              Hai điều kiện để sức lao động trở thành hàng hóa
            </h2>
          </div>
          <span className="inline-flex items-center rounded-full border-2 border-[#802f28] bg-[#fbf0ef] px-3.5 py-1 text-xs font-serif font-bold text-[#802f28]">
            ⚠️ Bắt buộc phải có đồng thời cả 2 điều kiện
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {LABOR_CONDITIONS.map((cond) => (
            <div
              key={cond.id}
              className="flex flex-col justify-between rounded-xl border-2 border-[#c8b79b] bg-[#fdf8ed] p-5 shadow-xs transition hover:border-[#8a7253]"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#8a7253] bg-[#802f28] font-serif text-xs font-bold text-white">
                    {cond.number}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#2c1e13]">
                    {cond.title}
                  </h3>
                </div>
                <p className="text-sm text-[#4a3826] mt-2 leading-relaxed">
                  {cond.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-[#e2d5bd] pt-3">
                  <span className="text-xs font-serif font-bold tracking-wider text-[#7a6448] uppercase">
                    Hệ quả pháp lý & kinh tế:
                  </span>
                  <ul className="text-xs text-[#5c4632] space-y-1 pl-4 list-disc">
                    {cond.implications.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[#d4a359]/40 bg-[#f7eed7] p-3 text-xs text-[#6e543c] italic">
                {cond.historicalContext}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onContinue} size="lg">
            Khảo sát các tình huống nhân vật →
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { FactorySnapshot } from "@/features/factory/types";

interface FactoryNotebookProps {
  snapshot: FactorySnapshot;
}

export function FactoryNotebook({ snapshot }: FactoryNotebookProps) {
  const {
    hour,
    constantCapital,
    variableCapital,
    newValue,
    surplusValue,
    productValue,
  } = snapshot;

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl border-2 border-[#826a4c] bg-[#fbf6e5] p-5 shadow-lg">
      <div>
        {/* Notebook Header */}
        <div className="border-b-2 border-[#b59e7e] pb-3 text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#7a6448] uppercase">
            Hạch toán kinh tế
          </span>
          <h2 className="font-serif text-xl font-extrabold tracking-wide text-[#2b1c10] sm:text-2xl">
            SỔ TAY CA SẢN XUẤT
          </h2>
          <p className="mt-0.5 text-xs text-[#6e5840]">
            Mốc thời gian: <strong className="text-[#8c3e36]">{hour} giờ</strong> / 8 giờ
          </p>
        </div>

        {/* Notebook Entries matching Figma Frame 43:2298 */}
        <div className="mt-4 space-y-4">
          {/* 1. Tư bản bất biến (c) */}
          <div className="rounded-lg bg-[#f3ebd3] p-3 transition-colors hover:bg-[#ede3c5]">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-bold tracking-wider text-[#4d3b2a] uppercase">
                TƯ BẢN BẤT BIẾN (c)
              </span>
              <span className="rounded bg-[#254558]/10 px-2 py-0.5 text-[10px] font-semibold text-[#254558]">
                Bông + Hao mòn
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-extrabold text-[#233f50] sm:text-3xl">
                {constantCapital} USD
              </span>
              <span className="text-xs text-[#665543]">
                ({snapshot.cottonUsed} bông + {snapshot.machineDepreciation} máy)
              </span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#dfceb3]" />

          {/* 2. Giá trị sức lao động (v) */}
          <div className="rounded-lg bg-[#f3ebd3] p-3 transition-colors hover:bg-[#ede3c5]">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-bold tracking-wider text-[#4d3b2a] uppercase">
                GIÁ TRỊ SỨC LAO ĐỘNG (v)
              </span>
              <span className="rounded bg-[#8c3e36]/10 px-2 py-0.5 text-[10px] font-semibold text-[#8c3e36]">
                Tư bản khả biến
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-extrabold text-[#782923] sm:text-3xl">
                {variableCapital} USD
              </span>
              <span className="text-xs text-[#665543]">Cố định 8h</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#dfceb3]" />

          {/* 3. Giá trị mới (v + m) */}
          <div className="rounded-lg bg-[#f3ebd3] p-3 transition-colors hover:bg-[#ede3c5]">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-bold tracking-wider text-[#4d3b2a] uppercase">
                GIÁ TRỊ MỚI (v + m)
              </span>
              <span className="rounded bg-[#d4a359]/20 px-2 py-0.5 text-[10px] font-semibold text-[#664917]">
                Do lao động tạo ra
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-serif text-2xl font-extrabold text-[#2e2013] sm:text-3xl">
                {newValue} USD
              </span>
              <span className="text-xs text-[#665543]">3.75 USD / giờ</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#dfceb3]" />

          {/* 4. Giá trị thặng dư (m) */}
          <div
            className={`rounded-lg p-3 transition-all ${
              surplusValue > 0
                ? "border border-[#8c3e36] bg-[#f7e2df]"
                : "bg-[#f3ebd3]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-bold tracking-wider text-[#4d3b2a] uppercase">
                GIÁ TRỊ THẶNG DƯ (m)
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  surplusValue > 0
                    ? "bg-[#8c3e36] text-white"
                    : "bg-[#7a6448]/20 text-[#614a30]"
                }`}
              >
                {surplusValue > 0 ? "ĐÃ XUẤT HIỆN" : "CHƯA XUẤT HIỆN"}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span
                className={`font-serif text-2xl font-extrabold sm:text-3xl ${
                  surplusValue > 0 ? "text-[#8c3e36]" : "text-[#705c47]"
                }`}
              >
                {surplusValue} USD
              </span>
              <span className="text-xs text-[#665543]">
                {hour <= 4 ? "m = 0 USD trong 4h đầu" : "Lao động dôi ra"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar: Product Value G = c + (v + m) */}
      <div className="mt-4 rounded-lg border-2 border-[#b89f7f] bg-[#eedebd] p-3 text-center shadow-inner">
        <span className="text-[11px] font-bold text-[#5c442c] uppercase">
          TỔNG GIÁ TRỊ HÀNG HÓA SỢI (G)
        </span>
        <div className="mt-0.5 font-serif text-xl font-extrabold text-[#241a10]">
          G = c + (v + m) ={" "}
          <span className="text-[#8c3e36]">{productValue} USD</span>
        </div>
        <p className="mt-0.5 text-[10px] text-[#6e5840]">
          {hour === 4 && "Tại 4h: 53c + 15v + 0m = 68 USD (chưa có thặng dư)"}
          {hour === 8 && "Tại 8h: 106c + 15v + 15m = 136 USD (m = 15 USD)"}
          {hour !== 4 && hour !== 8 && `Tiến trình: ${hour}/8 giờ`}
        </p>
      </div>
    </div>
  );
}

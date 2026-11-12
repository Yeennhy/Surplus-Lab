"use client";

import Link from "next/link";
import { FactorySnapshot } from "@/features/factory/types";

interface FactoryReportProps {
  snapshot: FactorySnapshot;
  onReplay: () => void;
}

export function FactoryReport({ snapshot, onReplay }: FactoryReportProps) {
  const capitalAdvanced =
    Math.round(
      (snapshot.cottonUsed +
        snapshot.machineDepreciation +
        snapshot.variableCapital) *
        10
    ) / 10;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center font-sans">
      <div className="w-full rounded-2xl border-4 border-[#82674c] bg-[#fbf6e5] p-6 shadow-2xl sm:p-10">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-[#2b593f] bg-[#daf0e3] px-3.5 py-1 text-xs font-bold tracking-wider text-[#1e4a31] uppercase">
            Hoàn thành ca • Đạt tiêu chuẩn nghiệm thu
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-wide text-[#2e1f12] sm:text-4xl md:text-5xl">
            BÁO CÁO HOÀN THÀNH CA SẢN XUẤT
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#66513c] sm:text-base">
            Sau 8 giờ lao động, số bông đã được kéo thành sợi hoàn chỉnh. Hãy
            quan sát kết cấu giá trị của sản phẩm mới được tạo ra.
          </p>
        </div>

        {/* 4 Metric Cards matching Frame 44:3861 */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {/* 1. Tư bản bất biến */}
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-[#b59e7e] bg-[#f4ebcb] p-5 text-center shadow-sm">
            <span className="text-xs font-bold tracking-wider text-[#523d29] uppercase">
              TƯ BẢN BẤT BIẾN (c)
            </span>
            <span className="mt-2 text-3xl font-extrabold text-[#233f50] sm:text-4xl">
              {snapshot.constantCapital} USD
            </span>
            <span className="mt-1 text-[11px] text-[#705c47]">
              {snapshot.cottonUsed} Bông + {snapshot.machineDepreciation} Máy
            </span>
          </div>

          {/* 2. Tư bản khả biến */}
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-[#b59e7e] bg-[#f4ebcb] p-5 text-center shadow-sm">
            <span className="text-xs font-bold tracking-wider text-[#523d29] uppercase">
              TƯ BẢN KHẢ BIẾN (v)
            </span>
            <span className="mt-2 text-3xl font-extrabold text-[#782923] sm:text-4xl">
              {snapshot.variableCapital} USD
            </span>
            <span className="mt-1 text-[11px] text-[#705c47]">
              Giá trị sức lao động
            </span>
          </div>

          {/* 3. Giá trị mới */}
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-[#b59e7e] bg-[#f4ebcb] p-5 text-center shadow-sm">
            <span className="text-xs font-bold tracking-wider text-[#523d29] uppercase">
              GIÁ TRỊ MỚI (v + m)
            </span>
            <span className="mt-2 text-3xl font-extrabold text-[#2e2013] sm:text-4xl">
              {snapshot.newValue} USD
            </span>
            <span className="mt-1 text-[11px] text-[#705c47]">
              Tạo ra trong 8 giờ
            </span>
          </div>

          {/* 4. Thặng dư */}
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-[#8c3e36] bg-[#fce8e6] p-5 text-center shadow-sm">
            <span className="text-xs font-bold tracking-wider text-[#732721] uppercase">
              THẶNG DƯ (m)
            </span>
            <span className="mt-2 text-3xl font-extrabold text-[#8c3e36] sm:text-4xl">
              {snapshot.surplusValue} USD
            </span>
            <span className="mt-1 text-[11px] text-[#80312a]">
              4h dôi ra ngoài v
            </span>
          </div>
        </div>

        {/* Product Value Formula Banner */}
        <div className="mt-8 rounded-xl border-2 border-[#9e876a] bg-[#eedebd] p-6 text-center shadow-inner">
          <h3 className="text-lg font-bold tracking-wide text-[#382717] sm:text-xl">
            GIÁ TRỊ SẢN PHẨM: G = c + (v + m)
          </h3>
          <p className="mt-2 text-2xl font-extrabold text-[#6d2721] sm:text-3xl">
            {snapshot.productValue} USD = {snapshot.constantCapital} USD + ({snapshot.variableCapital} USD + {snapshot.surplusValue} USD)
          </p>
          <div className="mx-auto mt-4 max-w-2xl text-left text-xs text-[#52402e] sm:text-sm">
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Tư bản ứng trước ban đầu:</strong> {snapshot.cottonUsed} bông + {snapshot.machineDepreciation} hao mòn
                + {snapshot.variableCapital} sức lao động = <strong>{capitalAdvanced} USD</strong>.
              </li>
              <li>
                <strong>Tổng giá trị hàng hóa thu được:</strong>{" "}
                <strong>{snapshot.productValue} USD</strong>.
              </li>
              <li>
                <strong>Phần chênh lệch dôi ra (ΔT = m):</strong> {snapshot.productValue} – {capitalAdvanced} ={" "}
                <strong>{snapshot.surplusValue} USD</strong> chính là <em>giá trị thặng dư</em> do lao
                động thặng dư của người công nhân tạo ra!
              </li>
            </ul>
          </div>
        </div>

        {/* Badge & Achievement Banner */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-[#235738] bg-[#d7f0e0] px-6 py-2 text-sm font-bold text-[#14472d] shadow-sm">
            <span className="font-bold">★</span>
            <span>NHÀ VẬN HÀNH XƯỞNG SỢI</span>
          </div>
        </div>

        {/* Action Navigation Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onReplay}
            className="flex items-center gap-2 rounded-xl border-2 border-[#80694e] bg-[#eedebd] px-6 py-3.5 text-base font-bold tracking-wider text-[#402e1c] shadow transition hover:bg-[#e4d2ae]"
          >
            <span>↺</span>
            <span>XEM LẠI CA SẢN XUẤT</span>
          </button>

          <Link
            href="/learn/chapter-4"
            className="group flex items-center gap-2 rounded-xl border-2 border-[#541f1a] bg-[#802f28] px-8 py-3.5 text-base font-bold tracking-wider !text-white no-underline shadow-lg transition hover:bg-[#96372f] hover:shadow-xl"
          >
            <span>GIẢI PHẪU GIÁ TRỊ</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

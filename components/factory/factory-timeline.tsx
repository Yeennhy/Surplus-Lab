"use client";

import { useRef, useState, useCallback } from "react";

interface FactoryTimelineProps {
  currentHour: number;
  totalHours?: number;
  isRunning: boolean;
  speed: number;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (hour: number) => void;
}

export function FactoryTimeline({
  currentHour,
  totalHours = 8,
  isRunning,
  speed,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onSeek,
}: FactoryTimelineProps) {
  const necessaryLimit = 4;
  const progressRatio = Math.max(0, Math.min(1, currentHour / totalHours));
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateHourFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetHour = Math.round(ratio * totalHours * 10) / 10;
      onSeek(targetHour);
    },
    [totalHours, onSeek]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    calculateHourFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    calculateHourFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div className="w-full rounded-xl border-2 border-[#826a4c] bg-[#fbf6e5] p-5 shadow-lg font-sans">
      {/* Header and Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfceb3] pb-3">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#7a6448] uppercase">
            Đồng hồ kiểm soát ca sản xuất
          </span>
          <h3 className="text-lg font-extrabold tracking-wide text-[#2e1d0f] sm:text-xl">
            TIẾN TRÌNH 8 GIỜ LAO ĐỘNG
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            disabled={currentHour >= totalHours}
            className={`flex items-center gap-1.5 rounded-lg border-2 px-4 py-2 text-sm font-bold tracking-wider transition-all duration-150 ${
              currentHour >= totalHours
                ? "cursor-not-allowed border-[#a3947f] bg-[#c7baa7] text-[#5e5345]"
                : isRunning
                ? "border-[#663b15] bg-[#9c5a21] text-white hover:bg-[#b56926]"
                : "border-[#4a1c18] bg-[#7a2c26] text-white hover:bg-[#8f362f]"
            }`}
          >
            <span>{isRunning ? "TẠM DỪNG" : "BẮT ĐẦU"}</span>
          </button>

          {/* Step backward (-1h) */}
          <button
            onClick={onStepBackward}
            disabled={isRunning || currentHour <= 0}
            className="rounded-lg border border-[#8a7253] bg-[#ebdcb8] px-3 py-2 text-xs font-bold text-[#422e1b] transition hover:bg-[#decba2] disabled:cursor-not-allowed disabled:opacity-50"
            title="Lùi 1 giờ"
          >
            -1 GIỜ
          </button>

          {/* Step forward (+1h) */}
          <button
            onClick={onStepForward}
            disabled={isRunning || currentHour >= totalHours}
            className="rounded-lg border border-[#8a7253] bg-[#ebdcb8] px-3 py-2 text-xs font-bold text-[#422e1b] transition hover:bg-[#decba2] disabled:cursor-not-allowed disabled:opacity-50"
            title="Tiến thêm 1 giờ"
          >
            +1 GIỜ
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-[#8a7253] bg-[#ebdcb8] px-3 py-2 text-xs font-bold text-[#422e1b] transition hover:bg-[#decba2]"
            title="Đặt lại từ 0 giờ"
          >
            <span>ĐẶT LẠI</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center rounded-lg border border-[#9b8263] bg-[#ebdcb8] p-0.5">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                  speed === s
                    ? "bg-[#6e2b26] text-white"
                    : "text-[#5e4730] hover:bg-[#dfcfab]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Segmented Timeline Bar with Dragging */}
      <div className="mt-5 px-2">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative flex h-8 w-full cursor-pointer items-center select-none touch-none"
        >
          {/* Background Track with 2 Segments */}
          <div className="relative flex h-5 w-full overflow-hidden rounded-full border-2 border-[#543b22] bg-[#c4b192] shadow-inner">
            {/* Segment 1: Necessary Labor (0-4h) - Dark teal/slate */}
            <div
              className="relative h-full w-1/2 border-r-2 border-[#543b22] bg-[#254558]"
              title="4 giờ đầu: Thời gian lao động tất yếu"
            >
              <div
                className="h-full bg-[#3c6c87] transition-all duration-75"
                style={{
                  width: `${Math.min(100, (currentHour / necessaryLimit) * 100)}%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-[#e6f2f7] uppercase pointer-events-none">
                Lao động tất yếu (0h – 4h)
              </span>
            </div>

            {/* Segment 2: Surplus Labor (4-8h) - Brick red/crimson */}
            <div
              className="relative h-full w-1/2 bg-[#54211d]"
              title="4 giờ sau: Thời gian lao động thặng dư"
            >
              <div
                className="h-full bg-[#8c3e36] transition-all duration-75"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      ((currentHour - necessaryLimit) / (totalHours - necessaryLimit)) *
                        100
                    )
                  )}%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-[#fae6e4] uppercase pointer-events-none">
                Lao động thặng dư (4h – 8h)
              </span>
            </div>
          </div>

          {/* Interactive Knob / Thumb */}
          <div
            className={`absolute z-10 -ml-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#3b2715] bg-[#d4a359] shadow-md transition-transform ${
              isDragging ? "scale-125 bg-[#e0b573]" : "hover:scale-110"
            }`}
            style={{
              left: `${progressRatio * 100}%`,
            }}
          >
            <span className="text-[11px] font-extrabold text-[#382310]">
              {Math.round(currentHour * 10) / 10}h
            </span>
          </div>
        </div>

        {/* Milestone Tick Marks */}
        <div className="mt-2 flex justify-between text-xs font-bold text-[#5c4630]">
          <button
            onClick={() => onSeek(0)}
            className="cursor-pointer transition hover:text-[#8c3e36]"
          >
            0H (Khởi đầu)
          </button>
          <button
            onClick={() => onSeek(4)}
            className="cursor-pointer text-center text-[#8c3e36] transition hover:scale-105"
          >
            4H ★ (Kiểm tra m = 0)
          </button>
          <button
            onClick={() => onSeek(8)}
            className="cursor-pointer transition hover:text-[#8c3e36]"
          >
            8H (Hoàn thành m = 15 USD)
          </button>
        </div>
      </div>
    </div>
  );
}

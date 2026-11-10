"use client";

interface FactoryTimelineProps {
  currentHour: number;
  totalHours?: number;
  isRunning: boolean;
  speed: number;
  onTogglePlay: () => void;
  onStepForward: () => void;
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
  onReset,
  onSpeedChange,
  onSeek,
}: FactoryTimelineProps) {
  const necessaryLimit = 4;
  const progressRatio = currentHour / totalHours;

  return (
    <div className="w-full rounded-xl border-2 border-[#826a4c] bg-[#fbf6e5] p-5 shadow-lg">
      {/* Header and Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfceb3] pb-3">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#7a6448] uppercase">
            Đồng hồ kiểm soát ca sản xuất
          </span>
          <h3 className="font-serif text-lg font-bold tracking-wide text-[#2e1d0f] sm:text-xl">
            TIẾN TRÌNH 8 GIỜ LAO ĐỘNG
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            disabled={currentHour >= totalHours}
            className={`flex items-center gap-1.5 rounded-lg border-2 px-4 py-2 font-serif text-sm font-bold tracking-wider transition-all duration-150 ${
              currentHour >= totalHours
                ? "cursor-not-allowed border-[#a3947f] bg-[#c7baa7] text-[#5e5345]"
                : isRunning
                ? "border-[#663b15] bg-[#9c5a21] text-white hover:bg-[#b56926]"
                : "border-[#4a1c18] bg-[#7a2c26] text-white hover:bg-[#8f362f]"
            }`}
          >
            <span>{isRunning ? "⏸ TẠM DỪNG" : "▶ BẮT ĐẦU"}</span>
          </button>

          {/* Step forward (+1h) */}
          <button
            onClick={onStepForward}
            disabled={isRunning || currentHour >= totalHours}
            className="rounded-lg border border-[#8a7253] bg-[#ebdcb8] px-3 py-2 text-xs font-semibold text-[#422e1b] transition hover:bg-[#decba2] disabled:cursor-not-allowed disabled:opacity-50"
            title="Tiến thêm 1 giờ"
          >
            +1 GIỜ
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-[#8a7253] bg-[#ebdcb8] px-3 py-2 text-xs font-semibold text-[#422e1b] transition hover:bg-[#decba2]"
            title="Đặt lại từ 0 giờ"
          >
            <span>↺</span>
            <span>ĐẶT LẠI</span>
          </button>

          {/* Speed selector */}
          <div className="flex items-center rounded-lg border border-[#9b8263] bg-[#ebdcb8] p-0.5">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`rounded px-2 py-1 text-xs font-bold transition ${
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

      {/* Segmented Timeline Bar matching Frame 43:2298 */}
      <div className="mt-5 px-2">
        <div className="relative flex h-8 w-full items-center">
          {/* Background Track with 2 Segments */}
          <div className="relative flex h-5 w-full overflow-hidden rounded-full border-2 border-[#543b22] bg-[#c4b192] shadow-inner">
            {/* Segment 1: Necessary Labor (0-4h) - Dark teal/slate */}
            <div
              className="relative h-full w-1/2 border-r-2 border-[#543b22] bg-[#254558]"
              title="4 giờ đầu: Thời gian lao động tất yếu"
            >
              {/* Fill layer */}
              <div
                className="h-full bg-[#3c6c87] transition-all duration-150"
                style={{
                  width: `${Math.min(100, (currentHour / necessaryLimit) * 100)}%`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-[#e6f2f7] uppercase select-none">
                Lao động tất yếu (0h – 4h)
              </span>
            </div>

            {/* Segment 2: Surplus Labor (4-8h) - Brick red/crimson */}
            <div
              className="relative h-full w-1/2 bg-[#54211d]"
              title="4 giờ sau: Thời gian lao động thặng dư"
            >
              {/* Fill layer */}
              <div
                className="h-full bg-[#8c3e36] transition-all duration-150"
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
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-wider text-[#fae6e4] uppercase select-none">
                Lao động thặng dư (4h – 8h)
              </span>
            </div>
          </div>

          {/* Interactive Knob / Thumb */}
          <div
            className="absolute z-10 -ml-4 flex h-8 w-8 cursor-grab items-center justify-center rounded-full border-2 border-[#3b2715] bg-[#d4a359] shadow-md transition-all active:cursor-grabbing hover:scale-110"
            style={{
              left: `${Math.min(100, progressRatio * 100)}%`,
            }}
          >
            <span className="font-serif text-xs font-bold text-[#382310]">
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
            4H ★ (Điểm kiểm tra m = 0)
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


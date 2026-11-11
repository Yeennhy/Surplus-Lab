"use client";

import { FactorySnapshot } from "@/features/factory/types";

interface FactoryScene2DProps {
  snapshot: FactorySnapshot;
  isRunning: boolean;
}

export function FactoryScene2D({ snapshot, isRunning }: FactoryScene2DProps) {
  const { hour, isNecessaryLabor } = snapshot;

  // Số lượng ống sợi thành phẩm dựa trên giờ (tối đa 4 ống hoàn thành ở 8h)
  const yarnSpoolsCount = Math.min(4, Math.floor((hour / 8) * 4) + 1);
  const yarnFillRatio = Math.max(0.05, hour / 8);

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-xl border-2 border-[#826a4c] bg-[#ebdcb8] p-4 shadow-inner md:p-6 font-sans">
      {/* Inline styles for custom spinning and conveyor belt movement */}
      <style jsx>{`
        @keyframes conveyorCotton {
          0% {
            transform: translateX(0px);
            opacity: 0.2;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(75px);
            opacity: 0.2;
          }
        }
        @keyframes yarnFlow {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .conveyor-tuft-1 {
          animation: conveyorCotton 1.2s linear infinite;
        }
        .conveyor-tuft-2 {
          animation: conveyorCotton 1.2s linear infinite;
          animation-delay: 0.6s;
        }
        .yarn-animated {
          animation: yarnFlow 0.8s linear infinite;
        }
      `}</style>

      {/* Scene Header & Status Indicator */}
      <div className="flex items-center justify-between border-b border-[#c4ae8c] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold tracking-wider text-[#3d2c1b] uppercase">
            XƯỞNG KÉO SỢI 2D
          </span>
          <span className="text-xs font-semibold text-[#70563b]">
            ({hour} / 8 giờ lao động)
          </span>
        </div>

        {/* Live operational state pill */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              isRunning ? "animate-ping bg-emerald-500" : "bg-amber-600"
            }`}
          />
          <span
            className={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              isRunning
                ? "bg-emerald-900/15 text-emerald-900"
                : "bg-amber-900/15 text-amber-900"
            }`}
          >
            {isRunning ? "ĐANG VẬN HÀNH" : "TẠM DỪNG"}
          </span>
        </div>
      </div>

      {/* 2D SVG Illustration */}
      <div className="relative my-4 flex h-64 w-full items-center justify-center sm:h-72">
        <svg
          viewBox="0 0 760 300"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="woodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c59863" />
              <stop offset="100%" stopColor="#966d3e" />
            </linearGradient>
            <linearGradient id="machineMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a37b51" />
              <stop offset="50%" stopColor="#be9668" />
              <stop offset="100%" stopColor="#7e5a35" />
            </linearGradient>
            <linearGradient id="cottonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ded7c5" />
            </linearGradient>
            <linearGradient id="yarnGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8c281" />
              <stop offset="50%" stopColor="#fffaea" />
              <stop offset="100%" stopColor="#cca15e" />
            </linearGradient>
          </defs>

          {/* Background Industrial Wall Grid */}
          <line
            x1="20"
            y1="230"
            x2="740"
            y2="230"
            stroke="#967d5d"
            strokeWidth="3"
          />
          <line
            x1="20"
            y1="80"
            x2="740"
            y2="80"
            stroke="#c8b598"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Overhead Ceiling Mount Supports */}
          <rect x="330" y="40" width="8" height="40" fill="#715538" />
          <rect x="440" y="40" width="8" height="40" fill="#715538" />
          <line
            x1="300"
            y1="40"
            x2="470"
            y2="40"
            stroke="#5c432a"
            strokeWidth="4"
          />

          {/* ================= STATION 1: KHO BÔNG (COTTON HOPPER) ================= */}
          <g transform="translate(60, 90)">
            <rect
              x="0"
              y="30"
              width="140"
              height="110"
              rx="6"
              fill="url(#woodGradient)"
              stroke="#6b4c2b"
              strokeWidth="3"
            />
            <line
              x1="10"
              y1="65"
              x2="130"
              y2="65"
              stroke="#54391e"
              strokeWidth="2"
            />
            <line
              x1="10"
              y1="95"
              x2="130"
              y2="95"
              stroke="#54391e"
              strokeWidth="2"
            />

            {/* Cotton Puffs on top */}
            <circle cx="25" cy="22" r="22" fill="url(#cottonGradient)" />
            <circle cx="55" cy="14" r="26" fill="url(#cottonGradient)" />
            <circle cx="90" cy="18" r="24" fill="url(#cottonGradient)" />
            <circle cx="118" cy="24" r="20" fill="url(#cottonGradient)" />
            <circle cx="70" cy="28" r="20" fill="#f7f2e4" />

            {/* Label */}
            <rect
              x="15"
              y="110"
              width="110"
              height="20"
              rx="4"
              fill="#523920"
            />
            <text
              x="70"
              y="124"
              textAnchor="middle"
              fill="#f5e9d3"
              fontSize="10"
              fontWeight="bold"
            >
              100 USD BÔNG
            </text>
          </g>

          {/* Conveyor Belt 1 (Cotton -> Spinning Machine) */}
          <line
            x1="200"
            y1="170"
            x2="280"
            y2="170"
            stroke="#45311e"
            strokeWidth="6"
          />

          {/* Rapid Cotton Transportation Tufts */}
          <g transform="translate(200, 162)">
            {isRunning ? (
              <>
                <g className="conveyor-tuft-1">
                  <circle cx="5" cy="0" r="7" fill="#ffffff" opacity="0.95" />
                  <circle cx="9" cy="-2" r="5" fill="#f5ecd5" opacity="0.8" />
                </g>
                <g className="conveyor-tuft-2">
                  <circle cx="5" cy="0" r="7" fill="#ffffff" opacity="0.95" />
                  <circle cx="9" cy="-2" r="5" fill="#f5ecd5" opacity="0.8" />
                </g>
              </>
            ) : (
              <circle cx="35" cy="0" r="7" fill="#ffffff" opacity="0.8" />
            )}
          </g>

          {/* ================= STATION 2: MÁY KÉO SỢI (SPINNING MACHINE) ================= */}
          <g transform="translate(280, 70)">
            {/* Machine Main Body Frame */}
            <rect
              x="0"
              y="10"
              width="200"
              height="150"
              rx="8"
              fill="url(#machineMetal)"
              stroke="#523922"
              strokeWidth="3"
            />

            {/* Rivets */}
            <circle cx="12" cy="22" r="3" fill="#3f2b18" />
            <circle cx="188" cy="22" r="3" fill="#3f2b18" />
            <circle cx="12" cy="148" r="3" fill="#3f2b18" />
            <circle cx="188" cy="148" r="3" fill="#3f2b18" />

            {/* Machine Nameplate */}
            <rect
              x="45"
              y="20"
              width="110"
              height="20"
              rx="3"
              fill="#3a2717"
            />
            <text
              x="100"
              y="34"
              textAnchor="middle"
              fill="#f7ebd2"
              fontSize="10"
              fontWeight="bold"
            >
              MÁY KÉO SỢI
            </text>

            {/* Drive Belt Loop connecting the two flywheels */}
            <rect
              x="35"
              y="55"
              width="130"
              height="60"
              rx="30"
              fill="none"
              stroke="#2c1a0e"
              strokeWidth="5"
            />

            {/* Left Pulley Flywheel - rotates in place around its exact center (0,0) */}
            <g transform="translate(65, 85)">
              <g>
                {isRunning && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="#deb887"
                  stroke="#4a311b"
                  strokeWidth="3.5"
                />
                <circle cx="0" cy="0" r="9" fill="#4a311b" />
                <circle cx="0" cy="0" r="4" fill="#deb887" />
                {/* 4 Spokes */}
                <line x1="-28" y1="0" x2="28" y2="0" stroke="#4a311b" strokeWidth="2.5" />
                <line x1="0" y1="-28" x2="0" y2="28" stroke="#4a311b" strokeWidth="2.5" />
                <line x1="-20" y1="-20" x2="20" y2="20" stroke="#4a311b" strokeWidth="1.5" />
                <line x1="-20" y1="20" x2="20" y2="-20" stroke="#4a311b" strokeWidth="1.5" />
              </g>
            </g>

            {/* Right Pulley Flywheel - rotates in place around its exact center (0,0) */}
            <g transform="translate(135, 85)">
              <g>
                {isRunning && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="#deb887"
                  stroke="#4a311b"
                  strokeWidth="3.5"
                />
                <circle cx="0" cy="0" r="9" fill="#4a311b" />
                <circle cx="0" cy="0" r="4" fill="#deb887" />
                {/* 4 Spokes */}
                <line x1="-28" y1="0" x2="28" y2="0" stroke="#4a311b" strokeWidth="2.5" />
                <line x1="0" y1="-28" x2="0" y2="28" stroke="#4a311b" strokeWidth="2.5" />
                <line x1="-20" y1="-20" x2="20" y2="20" stroke="#4a311b" strokeWidth="1.5" />
                <line x1="-20" y1="20" x2="20" y2="-20" stroke="#4a311b" strokeWidth="1.5" />
              </g>
            </g>

            {/* Steam Outlet on top of machine */}
            {isRunning && (
              <g className="animate-bounce" style={{ animationDuration: "1.5s" }}>
                <circle cx="100" cy="-5" r="6" fill="#ffffff" opacity="0.6" />
                <circle cx="106" cy="-14" r="8" fill="#ffffff" opacity="0.4" />
              </g>
            )}

            {/* Depreciation Badge */}
            <rect
              x="30"
              y="126"
              width="140"
              height="18"
              rx="3"
              fill="#263945"
            />
            <text
              x="100"
              y="139"
              textAnchor="middle"
              fill="#e2eff8"
              fontSize="9"
              fontWeight="bold"
            >
              HAO MÒN: {snapshot.machineDepreciation} / 6 USD
            </text>
          </g>

          {/* Conveyor Belt 2 (Spinning Machine -> Yarn Spools) */}
          <line
            x1="480"
            y1="170"
            x2="560"
            y2="170"
            stroke="#45311e"
            strokeWidth="6"
          />
          {/* Animated Yarn Thread running across */}
          <line
            x1="480"
            y1="168"
            x2="560"
            y2="168"
            stroke="#e8c281"
            strokeWidth="3"
            strokeDasharray={isRunning ? "8 4" : "none"}
            className={isRunning ? "yarn-animated" : ""}
          />

          {/* ================= STATION 3: SỢI THÀNH PHẨM (FINISHED YARN) ================= */}
          <g transform="translate(560, 90)">
            <rect
              x="0"
              y="30"
              width="140"
              height="110"
              rx="6"
              fill="url(#woodGradient)"
              stroke="#6b4c2b"
              strokeWidth="3"
            />

            {/* 4 Bobbin Spindles */}
            {[0, 1, 2, 3].map((index) => {
              const xPos = 20 + index * 28;
              const isFilled = index < yarnSpoolsCount;
              return (
                <g key={index} transform={`translate(${xPos}, 45)`}>
                  <line
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="55"
                    stroke="#422e1b"
                    strokeWidth="3"
                  />
                  <rect
                    x="2"
                    y={10 + (1 - yarnFillRatio) * 15}
                    width="16"
                    height={Math.max(6, 35 * (isFilled ? yarnFillRatio : 0.2))}
                    rx="4"
                    fill={isFilled ? "url(#yarnGradient)" : "#826c54"}
                    stroke="#594027"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Label */}
            <rect
              x="15"
              y="110"
              width="110"
              height="20"
              rx="4"
              fill="#523920"
            />
            <text
              x="70"
              y="124"
              textAnchor="middle"
              fill="#f5e9d3"
              fontSize="10"
              fontWeight="bold"
            >
              SỢI THÀNH PHẨM
            </text>
          </g>

          {/* Station Floor Labels */}
          <g transform="translate(0, 260)">
            <text
              x="130"
              y="0"
              textAnchor="middle"
              fill="#543c24"
              fontSize="12"
              fontWeight="bold"
            >
              KHO BÔNG
            </text>
            <text
              x="380"
              y="0"
              textAnchor="middle"
              fill="#543c24"
              fontSize="12"
              fontWeight="bold"
            >
              MÁY KÉO SỢI
            </text>
            <text
              x="630"
              y="0"
              textAnchor="middle"
              fill="#543c24"
              fontSize="12"
              fontWeight="bold"
            >
              SỢI THÀNH PHẨM
            </text>
          </g>
        </svg>
      </div>

      {/* Labor Phase Banner Indicator */}
      <div
        className={`mt-2 flex items-center justify-between rounded-lg border px-4 py-2 text-xs font-semibold ${
          isNecessaryLabor
            ? "border-[#2b4c5e] bg-[#dbeaf0] text-[#1e3b4a]"
            : "border-[#8a3c34] bg-[#f7e3e1] text-[#70241e]"
        }`}
      >
        <span>
          {isNecessaryLabor
            ? "Giai đoạn 1 (0h–4h): THỜI GIAN LAO ĐỘNG TẤT YẾU"
            : "Giai đoạn 2 (4h–8h): THỜI GIAN LAO ĐỘNG THẶNG DƯ"}
        </span>
        <span className="font-normal italic">
          {isNecessaryLabor
            ? "Bù đắp giá trị sức lao động (15 USD)"
            : "Tạo ra giá trị thặng dư m cho nhà tư bản!"}
        </span>
      </div>
    </div>
  );
}

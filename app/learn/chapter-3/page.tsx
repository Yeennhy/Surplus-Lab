"use client";

import { useState, useEffect } from "react";
import { FactoryHud } from "@/components/factory/factory-hud";
import { FactoryPreparation } from "@/components/factory/factory-preparation";
import { FactoryScene2D } from "@/components/factory/factory-scene-2d";
import { FactoryNotebook } from "@/components/factory/factory-notebook";
import { FactoryTimeline } from "@/components/factory/factory-timeline";
import { CheckpointModal } from "@/components/factory/checkpoint-modal";
import { FactoryReport } from "@/components/factory/factory-report";
import {
  calculateFactorySnapshot,
  DEFAULT_FACTORY_CONFIG,
} from "@/features/factory/engine";
import { FactoryStage } from "@/features/factory/types";

export default function Chapter3Page() {
  const [stage, setStage] = useState<FactoryStage>("preparation");
  const [hour, setHour] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [showCheckpoint, setShowCheckpoint] = useState<boolean>(false);
  const [hasPausedAt4, setHasPausedAt4] = useState<boolean>(false);

  const snapshot = calculateFactorySnapshot(hour, DEFAULT_FACTORY_CONFIG);

  // Simulation timer loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalTime = Math.max(50, 250 / speed);
    const stepHours = 0.1; // mỗi nhịp tăng 0.1 giờ để animation mượt mà

    const timer = setInterval(() => {
      setHour((prevHour) => {
        const nextHour = Math.round((prevHour + stepHours) * 10) / 10;

        // Tự động dừng tại 4.0 giờ để hỏi người học (Mốc kiểm tra)
        if (nextHour >= 4 && prevHour < 4 && !hasPausedAt4) {
          setIsRunning(false);
          setShowCheckpoint(true);
          setHasPausedAt4(true);
          return 4;
        }

        // Tự động dừng tại 8.0 giờ (Hoàn thành ca sản xuất)
        if (nextHour >= 8) {
          setIsRunning(false);
          setStage("completed");
          return 8;
        }

        return nextHour;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRunning, speed, hasPausedAt4]);

  // Handlers
  const handleStartShift = () => {
    setStage("running");
    setHour(0);
    setHasPausedAt4(false);
    setIsRunning(true);
  };

  const handleTogglePlay = () => {
    if (hour >= 8) {
      setHour(0);
      setHasPausedAt4(false);
      setIsRunning(true);
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleStepForward = () => {
    if (hour >= 8) return;
    const nextHour = Math.min(8, Math.round((hour + 1) * 10) / 10);
    if (nextHour >= 4 && hour < 4 && !hasPausedAt4) {
      setHour(4);
      setIsRunning(false);
      setShowCheckpoint(true);
      setHasPausedAt4(true);
    } else if (nextHour >= 8) {
      setHour(8);
      setIsRunning(false);
      setStage("completed");
    } else {
      setHour(nextHour);
    }
  };

  const handleStepBackward = () => {
    if (hour <= 0) return;
    setIsRunning(false);
    const prevHour = Math.max(0, Math.round((hour - 1) * 10) / 10);
    setHour(prevHour);
  };

  const handleReset = () => {
    setIsRunning(false);
    setHour(0);
    setHasPausedAt4(false);
    setShowCheckpoint(false);
  };

  const handleSeek = (targetHour: number) => {
    setIsRunning(false);
    const clamped = Math.max(0, Math.min(8, targetHour));
    setHour(clamped);
    if (clamped === 4 && !hasPausedAt4) {
      setShowCheckpoint(true);
      setHasPausedAt4(true);
    } else if (clamped === 8) {
      setStage("completed");
    }
  };

  const handleContinueAfterCheckpoint = () => {
    setShowCheckpoint(false);
    setIsRunning(true);
  };

  const handleReplay = () => {
    setStage("preparation");
    setHour(0);
    setIsRunning(false);
    setHasPausedAt4(false);
    setShowCheckpoint(false);
  };

  return (
    <div className="min-h-screen bg-[#1c2420] text-[#f4ebcb] selection:bg-[#8c3e36] selection:text-white">
      {/* Top HUD */}
      <FactoryHud
        capitalUSD={121}
        missionNumber="03"
        badgeCount={2}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        {/* Navigation Breadcrumb / Tab Switcher */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#3b2f24] pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#b39b7d] uppercase">
            <span>Chương 3</span>
            <span>•</span>
            <span className="text-[#f5ebd7]">
              {stage === "preparation" && "01. Chuẩn bị ca sản xuất"}
              {stage === "running" && "02. Vận hành xưởng kéo sợi"}
              {stage === "completed" && "03. Báo cáo hoàn thành ca"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsRunning(false);
                setStage("preparation");
              }}
              className={`rounded px-3 py-1 text-xs font-bold transition ${stage === "preparation"
                ? "bg-[#8c3e36] text-white"
                : "bg-[#28352e] text-[#cfbea6] hover:bg-[#34443b]"
                }`}
            >
              1. Chuẩn bị
            </button>
            <button
              onClick={() => {
                setStage("running");
              }}
              className={`rounded px-3 py-1 text-xs font-bold transition ${stage === "running"
                ? "bg-[#8c3e36] text-white"
                : "bg-[#28352e] text-[#cfbea6] hover:bg-[#34443b]"
                }`}
            >
              2. Vận hành
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setHour(8);
                setStage("completed");
              }}
              className={`rounded px-3 py-1 text-xs font-bold transition ${stage === "completed"
                ? "bg-[#8c3e36] text-white"
                : "bg-[#28352e] text-[#cfbea6] hover:bg-[#34443b]"
                }`}
            >
              3. Báo cáo
            </button>
          </div>
        </div>

        {/* View Mode Switching */}
        {stage === "preparation" && (
          <FactoryPreparation onStartShift={handleStartShift} />
        )}

        {stage === "running" && (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            {/* Top Grid: 2D Scene (Left) + Notebook (Right) matching Frame 43:2298 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <FactoryScene2D snapshot={snapshot} isRunning={isRunning} />
              </div>
              <div className="lg:col-span-4">
                <FactoryNotebook snapshot={snapshot} />
              </div>
            </div>

            {/* Bottom Timeline Control Bar matching Frame 43:2298 */}
            <FactoryTimeline
              currentHour={hour}
              totalHours={8}
              isRunning={isRunning}
              speed={speed}
              onTogglePlay={handleTogglePlay}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onSeek={handleSeek}
            />
          </div>
        )}

        {stage === "completed" && (
          <FactoryReport snapshot={snapshot} onReplay={handleReplay} />
        )}

        {/* Checkpoint Modal at 4h matching Frame 44:3500 */}
        {showCheckpoint && (
          <CheckpointModal onContinue={handleContinueAfterCheckpoint} />
        )}
      </main>
    </div>
  );
}

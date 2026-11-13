"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell, gameStyles } from "@/frontend/components/chapters/game-shell";
import {
  TEXTBOOK_FACTORY_CONFIG,
  getFactoryResult,
  getFactorySnapshot,
  startFactory,
  validateFactorySetup,
  getShiftLedger,
  simulateBatch,
  validateBatchPlan,
  type BatchPlan,
  type LineConfiguration,
  type ProductionEvent,
  type FactorySetup,
} from "@/backend/domain/factory";
import { readChapterArtifacts, readChapterDraft, saveChapterArtifacts, saveChapterDraft } from "@/backend/domain/progress/artifacts";
import { emitChapterCompleted } from "@/backend/domain/progress/events";
import { ProductionScene } from "./production-scene";
import styles from "./factory-chapter.module.css";

type FactoryStage = "setup" | "ready" | "batch1" | "operate" | "running" | "paused" | "mission" | "checkpoint" | "stopReport" | "question" | "batch2" | "audit" | "result";
type Hotspot = "cotton" | "machine" | "labor";
type Decoy = "yarn" | "surplus";
type ResultView = "timeline" | "breakdown";

const config = TEXTBOOK_FACTORY_CONFIG;
const result = getFactoryResult(config);
const auditSnapshot = getFactorySnapshot(config, 6);
const ledger = getShiftLedger(config);
const lineSteps: Array<{ key: keyof LineConfiguration; label: string; hint: string }> = [
  { key: "openedCotton", label: "MỞ VÀ TÁCH XƠ BÔNG", hint: "Bông trong kho phải được tách thành nhiều dải xơ." },
  { key: "fiberToRollers", label: "DẪN XƠ VÀO CON LĂN", hint: "Máy có thể quay rỗng nếu thiếu dải xơ." },
  { key: "rollersToWorker", label: "CHUYỂN SỢI TỚI CÔNG NHÂN", hint: "Sợi kéo ra cần được người lao động gia công." },
  { key: "workerToSpool", label: "ĐƯA SỢI VÀO CUỘN", hint: "Chỉ sau bước này mới có thành phẩm." },
];
const resources: Array<{ key: keyof FactorySetup; title: string; amount: string; icon: string; note: string }> = [
  { key: "cottonReady", title: "BÔNG NGUYÊN LIỆU", amount: "100 USD", icon: "/assets/resource-cotton.svg", note: "Vật liệu được kéo thành sợi." },
  { key: "machineReady", title: "MÁY KÉO SỢI", amount: "6 USD hao mòn", icon: "/assets/resource-spinning-machine.svg", note: "Tư liệu vận hành trong cả ca." },
  { key: "laborHired", title: "SỨC LAO ĐỘNG", amount: "15 USD", icon: "/assets/labor-wage-worker.svg", note: "Người công nhân vận hành máy." },
];
const distractors: Array<{ key: Decoy; title: string; amount: string; icon: string; explanation: string }> = [
  { key: "yarn", title: "SỢI THÀNH PHẨM", amount: "CHƯA CÓ", icon: "/assets/resource-yarn.svg", explanation: "Sợi là kết quả của ca sản xuất, không thể lấy từ kho đầu vào." },
  { key: "surplus", title: "GIÁ TRỊ THẶNG DƯ", amount: "CHƯA CÓ", icon: "/assets/resource-surplus.svg", explanation: "m chỉ xuất hiện khi lao động tạo giá trị mới vượt quá v." },
];

const hotspotInfo: Record<Hotspot, { title: string; type: string; text: string }> = {
  cotton: { title: "KHO BÔNG", type: "TƯ BẢN BẤT BIẾN (c)", text: "100 USD giá trị bông được bảo toàn và chuyển dần vào sợi; bản thân bông không tạo ra giá trị mới." },
  machine: { title: "MÁY KÉO SỢI", type: "TƯ BẢN BẤT BIẾN (c)", text: "6 USD hao mòn máy móc được chuyển vào sản phẩm trong cả ca sản xuất." },
  labor: { title: "SỨC LAO ĐỘNG", type: "TƯ BẢN KHẢ BIẾN (v)", text: "Lao động cụ thể tách bông, kéo sợi và chuyển giá trị bông, máy vào sản phẩm. Cùng lúc, lao động trừu tượng tạo 30 USD giá trị mới sau 8 giờ: 15 USD bù đắp (v), 15 USD là (m)." },
};
const missionOptions: Array<{ key: Hotspot; title: string; icon: string; clue: string }> = [
  { key: "cotton", title: "KHO BÔNG", icon: "/assets/resource-cotton.svg", clue: "Nguyên liệu đi vào máy" },
  { key: "machine", title: "MÁY KÉO SỢI", icon: "/assets/resource-spinning-machine.svg", clue: "Máy quay và hao mòn" },
  { key: "labor", title: "NGƯỜI CÔNG NHÂN", icon: "/assets/labor-wage-worker.svg", clue: "Vận hành dây chuyền" },
];

function money(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value)} USD`;
}

export function FactoryChapter() {
  const [stage, setStage] = useState<FactoryStage>("setup");
  const [setup, setSetup] = useState<FactorySetup>({ cottonReady: false, machineReady: false, laborHired: false });
  const [selectedDecoys, setSelectedDecoys] = useState<Record<Decoy, boolean>>({ yarn: false, surplus: false });
  const [hour, setHour] = useState(0);
  const [passedCheckpoint, setPassedCheckpoint] = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [missionChoice, setMissionChoice] = useState<Hotspot | null>(null);
  const [missionStep, setMissionStep] = useState<"old" | "new">("old");
  const [missionOldSources, setMissionOldSources] = useState<Hotspot[]>([]);
  const [operationStep, setOperationStep] = useState(0);
  const [operationFeedback, setOperationFeedback] = useState("Dây chuyền đang tự động kết nối các trạm.");
  const [line, setLine] = useState<LineConfiguration>({ openedCotton: false, fiberToRollers: false, rollersToWorker: false, workerToSpool: false });
  const [lineTrialPassed, setLineTrialPassed] = useState(false);
  const [operationEvents, setOperationEvents] = useState<ProductionEvent[]>([]);
  const [batch1Plan, setBatch1Plan] = useState<BatchPlan>({ cotton: 0, depreciation: 0, laborCharge: 0 });
  const [batch2Plan, setBatch2Plan] = useState<BatchPlan>({ cotton: 0, depreciation: 0, laborCharge: 15 });
  const [batchFeedback, setBatchFeedback] = useState("");
  const [speed, setSpeed] = useState<1 | 4>(1);
  const [seenBatches, setSeenBatches] = useState<Array<1 | 2>>([]);
  const [sampleContract, setSampleContract] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [auditSurplusChoice, setAuditSurplusChoice] = useState<number | null>(null);
  const [auditProductChoice, setAuditProductChoice] = useState<number | null>(null);
  const [auditFeedback, setAuditFeedback] = useState("");
  const [checkpointAnswer, setCheckpointAnswer] = useState<"yes" | "no" | null>(null);
  const [checkpointPrediction, setCheckpointPrediction] = useState<number | null>(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [resultView, setResultView] = useState<ResultView>("timeline");
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  const [matchSource, setMatchSource] = useState<string | null>(null);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [matchFeedback, setMatchFeedback] = useState("");
  const [paintVerified, setPaintVerified] = useState(false);
  const matchComplete = matchPairs.c === "c" && matchPairs.v === "v" && matchPairs.m === "m";
  const hourRef = useRef(0);
  const snapshot = getFactorySnapshot(config, hour);
  const readyToStart = validateFactorySetup(setup).length === 0 && !selectedDecoys.yarn && !selectedDecoys.surplus;
  const selectedCount = Object.values(setup).filter(Boolean).length + Object.values(selectedDecoys).filter(Boolean).length;

  const playClickSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      void ctx.resume();
    } catch {}
  }, [soundOn]);

  const playSuccessSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.02;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + 0.3 + i * 0.1);
      });
      void ctx.resume();
    } catch {}
  }, [soundOn]);

  useEffect(() => { setSampleContract(!readChapterArtifacts().contract); }, []);

  useEffect(() => {
    if (stage !== "operate" || lineTrialPassed) return;
    let step = 0;
    const keys: (keyof LineConfiguration)[] = ["openedCotton", "fiberToRollers", "rollersToWorker", "workerToSpool"];
    const timer = window.setInterval(() => {
      if (step < keys.length) {
        const key = keys[step];
        setLine((prev) => ({ ...prev, [key]: true }));
        setOperationStep(step + 1);
        step++;
        if (step === 1) setOperationFeedback("🌿 Bông đang được tách thành xơ mịn...");
        else if (step === 2) setOperationFeedback("⚙ Xơ bông đang đi qua con lăn kéo sợi...");
        else if (step === 3) setOperationFeedback("👷 Công nhân đang gia công sợi...");
      } else {
        window.clearInterval(timer);
        const automaticLine: LineConfiguration = { openedCotton: true, fiberToRollers: true, rollersToWorker: true, workerToSpool: true };
        const trial = simulateBatch(batch1Plan, automaticLine, 1, config);
        setOperationEvents(trial.events);
        setLineTrialPassed(trial.ready);
        setOperationFeedback("");
      }
    }, 800);
    return () => window.clearInterval(timer);
  }, [stage, lineTrialPassed, batch1Plan]);

  useEffect(() => {
    const saved = readChapterDraft<{
      stage: FactoryStage; setup: FactorySetup; selectedDecoys: Record<Decoy, boolean>;
      hour: number; passedCheckpoint: boolean; missionDone: boolean; auditDone: boolean;
      line: LineConfiguration; lineTrialPassed: boolean; batch1Plan: BatchPlan; batch2Plan: BatchPlan;
      checkpointAnswer: "yes" | "no" | null; checkpointPrediction?: number | null; seenBatches: Array<1 | 2>; matchPairs?: Record<string, string>; paintVerified?: boolean;
    }>(3);
    const stages: FactoryStage[] = ["setup", "ready", "batch1", "operate", "running", "paused", "mission", "checkpoint", "stopReport", "question", "batch2", "audit", "result"];
    if (saved && stages.includes(saved.stage) && Number.isFinite(saved.hour) && saved.hour >= 0 && saved.hour <= 8) {
      setStage(saved.stage === "running" ? "paused" : saved.stage);
      setHour(saved.hour);
      hourRef.current = saved.hour;
      if (saved.setup) setSetup(saved.setup);
      if (saved.selectedDecoys) setSelectedDecoys(saved.selectedDecoys);
      if (saved.line) {
        setLine(saved.line);
        const firstGap = lineSteps.findIndex((step) => !saved.line[step.key]);
        setOperationStep(firstGap === -1 ? lineSteps.length : firstGap);
      }
      if (saved.lineTrialPassed && saved.line && saved.batch1Plan) {
        const trial = simulateBatch(saved.batch1Plan, saved.line, 1, config);
        setLineTrialPassed(trial.ready);
        setOperationEvents(trial.events);
        setOperationFeedback(trial.events.at(-1)?.message ?? "Dây chuyền sẵn sàng.");
      }
      if (saved.batch1Plan) setBatch1Plan(saved.batch1Plan);
      if (saved.batch2Plan) setBatch2Plan(saved.batch2Plan);
      setPassedCheckpoint(Boolean(saved.passedCheckpoint));
      setMissionDone(Boolean(saved.missionDone));
      setAuditDone(Boolean(saved.auditDone));
      setCheckpointAnswer(saved.checkpointAnswer ?? null);
      if ([0, 15, 30].includes(saved.checkpointPrediction ?? -1)) setCheckpointPrediction(saved.checkpointPrediction ?? null);
      if (Array.isArray(saved.seenBatches)) setSeenBatches(saved.seenBatches.filter((batch) => batch === 1 || batch === 2));
      if (saved.matchPairs && typeof saved.matchPairs === "object") setMatchPairs(saved.matchPairs);
      if (saved.paintVerified) setPaintVerified(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveChapterDraft(3, { stage, setup, selectedDecoys, hour, passedCheckpoint, missionDone, auditDone, line, lineTrialPassed, batch1Plan, batch2Plan, checkpointAnswer, checkpointPrediction, seenBatches, matchPairs, paintVerified });
  }, [hydrated, stage, setup, selectedDecoys, hour, passedCheckpoint, missionDone, auditDone, line, lineTrialPassed, batch1Plan, batch2Plan, checkpointAnswer, checkpointPrediction, seenBatches, matchPairs, paintVerified]);

  useEffect(() => {
    if (stage !== "running") return;
    const timer = window.setInterval(() => {
      const limit = passedCheckpoint ? config.totalHours : config.necessaryHours;
      const nextHour = Math.min(limit, hourRef.current + 0.25);
      hourRef.current = nextHour;
      setHour(nextHour);
      if (nextHour >= config.totalHours) {
        setSeenBatches((current) => current.includes(2) ? current : [...current, 2]);
        setStage("result");
        saveChapterArtifacts({ ledger });
        playSuccessSound();
      } else if (nextHour >= config.necessaryHours && !passedCheckpoint) {
        setSeenBatches((current) => current.includes(1) ? current : [...current, 1]);
        setStage("checkpoint");
        playSuccessSound();
      }
    }, 1800 / speed);
    return () => window.clearInterval(timer);
  }, [stage, passedCheckpoint, speed, playSuccessSound]);

  useEffect(() => {
    if (!soundOn || stage !== "running") return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const volume = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 92;
    filter.type = "lowpass";
    filter.frequency.value = 240;
    volume.gain.value = 0.008;
    oscillator.connect(filter);
    filter.connect(volume);
    volume.connect(context.destination);
    oscillator.start();
    void context.resume();
    const rhythm = window.setInterval(() => {
      const now = context.currentTime;
      volume.gain.cancelScheduledValues(now);
      volume.gain.setValueAtTime(0.008, now);
      volume.gain.linearRampToValueAtTime(0.021, now + 0.08);
      volume.gain.linearRampToValueAtTime(0.008, now + 0.35);
    }, 660);
    return () => {
      window.clearInterval(rhythm);
      oscillator.stop();
      void context.close();
    };
  }, [soundOn, stage]);

  function toggleResource(key: keyof FactorySetup) {
    playClickSound();
    setSetup((current) => ({ ...current, [key]: !current[key] }));
  }

  function prepareShift() {
    if (!readyToStart) return;
    startFactory(config, setup);
    hourRef.current = 0;
    setHour(0);
    setStage("ready");
  }

  function restartShift() {
    hourRef.current = 0;
    setHour(0);
    setPassedCheckpoint(false);
    setMissionDone(false);
    setMissionChoice(null);
    setMissionStep("old");
    setMissionOldSources([]);
    setOperationStep(0);
    setOperationFeedback("Dây chuyền đang tự động kết nối các trạm.");
    setLine({ openedCotton: false, fiberToRollers: false, rollersToWorker: false, workerToSpool: false });
    setLineTrialPassed(false);
    setOperationEvents([]);
    setBatch1Plan({ cotton: 0, depreciation: 0, laborCharge: 0 });
    setBatch2Plan({ cotton: 0, depreciation: 0, laborCharge: 15 });
    setBatchFeedback("");
    setSpeed(1);
    setAuditDone(false);
    setAuditSurplusChoice(null);
    setAuditProductChoice(null);
    setAuditFeedback("");
    setCheckpointAnswer(null);
    setCheckpointPrediction(null);
    setAnswerDialogOpen(false);
    setSelectedHotspot(null);
    setResultView("timeline");
    setBadgeExpanded(false);
    setMatchSource(null);
    setMatchPairs({});
    setMatchFeedback("");
    setPaintVerified(false);
    setStage("ready");
  }

  function inspect(target: Hotspot) {
    playClickSound();
    setSelectedHotspot(target);
    if (stage === "running") setStage("paused");
  }

  function checkBatch(number: 1 | 2) {
    const plan = number === 1 ? batch1Plan : batch2Plan;
    const issues = validateBatchPlan(plan, number, config);
    setBatchFeedback(issues.map((issue) => issue.message).join(" "));
    if (issues.length === 0) setStage(number === 1 ? "operate" : "running");
  }

  function skipSeenBatch() {
    if (hour < 4 && seenBatches.includes(1)) {
      hourRef.current = 4;
      setHour(4);
      setStage("checkpoint");
    } else if (hour >= 4 && seenBatches.includes(2)) {
      hourRef.current = 8;
      setHour(8);
      saveChapterArtifacts({ ledger });
      setStage("result");
    }
  }

  function checkAudit() {
    if (auditSurplusChoice === null || auditProductChoice === null) return;
    const surplusCorrect = auditSurplusChoice === auditSnapshot.surplusValue;
    const productCorrect = auditProductChoice === auditSnapshot.productValue;
    if (surplusCorrect && productCorrect) {
      setAuditDone(true);
      setAuditFeedback(`Chính xác. Sau giờ thứ 4, lao động tiếp tục tạo ${money(auditSnapshot.surplusValue)} vượt quá (v). Giá trị sợi lúc này là ${money(auditSnapshot.productValue)}.`);
      return;
    }
    setAuditFeedback(`${surplusCorrect ? "Giá trị thặng dư đã đúng." : "Tính (m) bằng giá trị mới trừ 15 USD giá trị sức lao động (v)."} ${productCorrect ? "Giá trị sợi đã đúng." : "Tính (G) bằng giá trị cũ đã chuyển cộng toàn bộ giá trị mới tại giờ thứ 6."}`);
  }

  function answerCheckpoint(answer: "yes" | "no") {
    setCheckpointAnswer(answer);
    setAnswerDialogOpen(true);
  }

  function closeAnswerDialog() {
    setAnswerDialogOpen(false);
    if (checkpointAnswer === "yes") setCheckpointAnswer(null);
  }

  return (
    <GameShell chapter={3} progress={(hour / config.totalHours) * 100}>
      {stage === "setup" && (
        <>
          <h1 className={gameStyles.heading}>KHO VẬT TƯ TRƯỚC CA SẢN XUẤT</h1>
          <p className={gameStyles.lede}>Chọn đúng ba đầu vào để bắt đầu ca kéo sợi. Hai thẻ còn lại chỉ xuất hiện <strong>sau</strong> quá trình sản xuất.</p>
          <div className={styles.setupBrief}><span className={styles.briefIcon} aria-hidden="true">◈</span><div><strong>THỬ THÁCH KHO VẬT TƯ</strong><p>Nhìn vào từng thẻ: cái gì phải có trước khi máy chạy, cái gì chỉ có khi ca đã kết thúc?</p></div><b>{selectedCount}/3 ĐÃ CHỌN</b></div>
          <div className={styles.setupGrid}>
            {resources.map((resource) => (
              <button
                key={resource.key}
                className={`${gameStyles.cardButton} ${styles.resourceCard} ${setup[resource.key] ? styles.resourceReady : ""}`}
                type="button"
                aria-pressed={setup[resource.key]}
                onClick={() => toggleResource(resource.key)}
              >
                <span className={styles.resourceIcon}><Image src={resource.icon} alt="" width={220} height={160} /></span>
                <strong>{resource.title}</strong>
                <small>{resource.note}</small>
                <b>{resource.amount}</b>
                <span className={`${styles.resourceStatus} ${setup[resource.key] ? styles.statusReady : ""}`}>
                  {setup[resource.key] ? "✓ ĐÃ CHỌN" : "＋ CHỌN CHO CA SẢN XUẤT"}
                </span>
              </button>
            ))}
            {distractors.map((item) => (
              <button key={item.key} type="button" aria-pressed={selectedDecoys[item.key]} className={`${gameStyles.cardButton} ${styles.resourceCard} ${styles.decoyCard} ${selectedDecoys[item.key] ? styles.decoySelected : ""}`} onClick={() => setSelectedDecoys((current) => ({ ...current, [item.key]: !current[item.key] }))}>
                <span className={styles.resourceIcon}><Image src={item.icon} alt="" width={220} height={160} /></span>
                <strong>{item.title}</strong><small>{selectedDecoys[item.key] ? item.explanation : "Cần có trước khi sản xuất?"}</small><b>{item.amount}</b>
                <span className={`${styles.resourceStatus} ${selectedDecoys[item.key] ? styles.decoyStatus : ""}`}>{selectedDecoys[item.key] ? "× KHÔNG PHẢI ĐẦU VÀO" : "＋ CHỌN CHO CA SẢN XUẤT"}</span>
              </button>
            ))}
          </div>
          <div className={`${gameStyles.panel} ${styles.setupFooter}`}>
            <div>
              <h2 className={gameStyles.sectionTitle}>TƯ BẢN ỨNG TRƯỚC · {money(result.capitalAdvancedTotal)}</h2>
              <p className={gameStyles.sectionText}>Chỉ ứng trước thứ cần thiết để sản xuất. Thành phẩm và m chỉ có sau quá trình lao động.</p>
              {!readyToStart && selectedCount > 0 && <p className={styles.setupWarning} aria-live="polite">{validateFactorySetup(setup).map((issue) => issue.message).join(" ")} {(selectedDecoys.yarn || selectedDecoys.surplus) && "Bỏ các thẻ chỉ xuất hiện sau sản xuất để khởi động."}</p>}
            </div>
            <button className={`${gameStyles.button} ${styles.startButton}`} type="button" disabled={!readyToStart} onClick={prepareShift}><span className={styles.gearIcon} aria-hidden="true">⚙</span> KHỞI ĐỘNG NHÀ MÁY <span aria-hidden="true">→</span></button>
          </div>
        </>
      )}

      {stage === "ready" && (
        <>
          <h1 className={gameStyles.heading}>0 GIỜ — NHÀ MÁY VỪA KHỞI ĐỘNG</h1>
          <p className={gameStyles.lede}>Bông, máy và sức lao động đã đến xưởng. Hãy đọc trạng thái đầu ca rồi cấp vật tư cho mẻ thứ nhất.</p>
          <section className={`${gameStyles.panel} ${styles.readyDashboard}`}>
            <div className={styles.readyDashboardHead}><span className={styles.readyLiveDot} aria-hidden="true"/><div><small>NHẬT KÝ XƯỞNG · 00:00 / 08:00</small><h2>DÂY CHUYỀN ĐANG CHỜ PHIẾU MẺ 01</h2></div></div>
            <ProductionScene compact running={false} progress={0} operationStep={0} selected={null} transferredValue="0 USD" newValue="0 USD" onInspect={inspect} />
            <div className={styles.readyFacts}><div><small>TƯ BẢN ĐÃ ỨNG TRƯỚC</small><strong>{money(snapshot.capitalAdvancedTotal)}</strong><span>Bông + máy + hợp đồng lao động</span></div><div><small>GIÁ TRỊ MỚI</small><strong>0 USD</strong><span>Chỉ xuất hiện khi ca sản xuất chạy</span></div><div><small>THÀNH PHẨM</small><strong>0 CUỘN</strong><span>Hãy lập phiếu để cấp nguyên liệu</span></div></div>
            {selectedHotspot && <p className={styles.readyStationNote} role="status"><strong>{hotspotInfo[selectedHotspot].title}</strong> · {hotspotInfo[selectedHotspot].text}</p>}
          </section>
          <section className={styles.readyPrediction}><div><small>DỰ ĐOÁN TRƯỚC KHI CHẠY</small><h2>Nếu 4 giờ đầu tạo 15 USD giá trị mới, phần dôi ra (m) lúc ấy là bao nhiêu?</h2><p>Lưu dự đoán của bạn; so với sổ thực tế ở mốc 4 giờ.</p></div><div role="group" aria-label="Dự đoán giá trị thặng dư ở giờ thứ tư">{[0,15,30].map((value)=><button key={value} type="button" aria-pressed={checkpointPrediction===value} onClick={()=>setCheckpointPrediction(value)}>{value} USD</button>)}</div></section>
          {sampleContract && <p className={`${gameStyles.note} ${styles.readyNote}`}>Đang dùng hợp đồng mẫu vì bạn mở trực tiếp chương 3.</p>}
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={() => setStage("batch1")}>LẬP PHIẾU MẺ 1 →</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("setup")}>CHUẨN BỊ LẠI</button>
          </div>
        </>
      )}

      {(stage === "batch1" || stage === "batch2") && (
        <>
          <h1 className={gameStyles.heading}>PHIẾU SẢN XUẤT · MẺ {stage === "batch1" ? "01" : "02"}</h1>
          <p className={gameStyles.lede}>{stage === "batch1" ? "Cấp vật tư cho bốn giờ đầu. Hợp đồng sức lao động 15 USD có hiệu lực cả ca 8 giờ." : "Cuộn sợi thứ nhất đã trị giá 68 USD nhưng m vẫn bằng 0. Cấp vật tư cho bốn giờ tiếp theo; hợp đồng cũ còn hiệu lực."}</p>
          <BatchPlanner number={stage === "batch1" ? 1 : 2} plan={stage === "batch1" ? batch1Plan : batch2Plan} onChange={(plan) => { if (stage === "batch1") setBatch1Plan(plan); else setBatch2Plan(plan); setBatchFeedback(""); }} />
          {batchFeedback && <p className={styles.batchIssue} role="status">{batchFeedback}</p>}
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={() => checkBatch(stage === "batch1" ? 1 : 2)}>{stage === "batch1" ? "KIỂM TRA PHIẾU VÀ CHẠY THỬ →" : "KIỂM TRA PHIẾU VÀ CHẠY MẺ 2 →"}</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => { setBatchFeedback(""); setStage(stage === "batch1" ? "ready" : "checkpoint"); }}>← XEM LẠI</button>
          </div>
        </>
      )}

      {stage === "operate" && (
        <>
          <h1 className={gameStyles.heading}>CHUẨN BỊ DÂY CHUYỀN</h1>
          <p className={gameStyles.lede}>Dây chuyền đang tự động nối các trạm. Khi hoàn tất, bạn có thể bắt đầu ca sản xuất.</p>
          <section className={`${gameStyles.panel} ${styles.operationPanel}`}>
            <ProductionScene compact running={lineTrialPassed} progress={0.12} operationStep={operationStep} selected={null} transferredValue="0 USD" newValue="0 USD" onInspect={inspect} />
            <div className={styles.progressSteps} role="list" aria-label="Các bước dây chuyền">
              {[
                { num: "01", label: "TÁCH XƠ BÔNG", icon: "🌿" },
                { num: "02", label: "KÉO SỢI", icon: "⚙" },
                { num: "03", label: "CÔNG NHÂN HOÀN THIỆN", icon: "👷" },
              ].map((step, i) => (
                <div key={step.num} className={`${styles.progressStep} ${operationStep > i ? styles.progressStepDone : operationStep === i ? styles.progressStepActive : ""}`} role="listitem">
                  <span className={styles.progressStepIcon} aria-hidden="true">{operationStep > i ? "✓" : step.icon}</span>
                  <div><strong>{step.num} · {step.label}</strong><small>{operationStep > i ? "ĐÃ SẴN SÀNG" : operationStep === i ? "ĐANG KẾT NỐI..." : "CHỜ"}</small></div>
                </div>
              ))}
            </div>
            {!lineTrialPassed && operationFeedback && <p className={styles.operationFeedback} role="status"><span aria-hidden="true">⚙</span>{operationFeedback}</p>}
            {operationEvents.length > 0 && (
              <div className={styles.operationEventsList}>
                {operationEvents.map((evt, idx) => (
                  <span key={idx} className={styles.eventItem}>✓ {evt.message}</span>
                ))}
              </div>
            )}
          </section>
          <div className={gameStyles.buttonRow}><button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={!lineTrialPassed} onClick={() => setStage("running")}>▶ BẮT ĐẦU CA · DÂY CHUYỀN TỰ ĐỘNG</button><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => { setLineTrialPassed(false); setOperationEvents([]); setStage("batch1"); }}>← SỬA PHIẾU MẺ 1</button></div>
        </>
      )}

      {(stage === "running" || stage === "paused") && (
        <>
          <h1 className={gameStyles.heading}>{stage === "running" ? "NHÀ MÁY ĐANG VẬN HÀNH" : "NHÀ MÁY ĐÃ TẠM DỪNG"}</h1>
          <p className={gameStyles.lede}>Quan sát dòng bông đi qua máy kéo sợi. Chọn một trạm để dừng ca và điều tra vai trò của nó.</p>
          <div className={styles.factoryToolbar}>
            <span className={styles.liveBadge}><i aria-hidden="true" />{stage === "running" ? "XƯỞNG ĐANG HOẠT ĐỘNG" : "CA ĐÃ TẠM DỪNG"}</span>
             <span>MẺ {hour < 4 ? "01" : "02"} · {speed === 4 ? "TUA NHANH" : "NHỊP THƯỜNG"}</span>
            <button type="button" className={styles.soundButton} aria-pressed={soundOn} onClick={() => setSoundOn((current) => !current)}>{soundOn ? "♫ TẮT ÂM THANH XƯỞNG" : "♫ BẬT ÂM THANH XƯỞNG"}</button>
            <button type="button" className={styles.soundButton} aria-pressed={speed === 4} onClick={() => setSpeed((current) => current === 1 ? 4 : 1)}>{speed === 4 ? "▶ NHỊP THƯỜNG" : "▶▶ TUA NHANH"}</button>
            {hour >= 2 && hour < 4 && !missionDone && <button type="button" className={styles.soundButton} onClick={() => setStage("mission")}>🔎 ĐIỀU TRA HAI DÒNG GIÁ TRỊ</button>}
            {hour >= 6 && hour < 8 && !auditDone && <button type="button" className={styles.soundButton} onClick={() => setStage("audit")}>▤ SOI SỔ GIỜ THỨ SÁU</button>}
            {seenBatches.includes(hour < 4 ? 1 : 2) && <button type="button" className={styles.soundButton} onClick={skipSeenBatch}>⏭ BỎ QUA ĐOẠN ĐÃ XEM</button>}
          </div>
          <div className={styles.learningStrip}><span aria-hidden="true">⌛</span><p><strong>{hour < 4 ? "0–4 GIỜ · ĐANG BÙ ĐẮP (v)" : "4–8 GIỜ · GIÁ TRỊ MỚI DÔI RA (m)"}</strong>{hour < 4 ? " Theo dõi đến khi giá trị mới đạt 15 USD." : " Quan sát phần tăng thêm sau mốc 4 giờ."}</p></div>
          <div className={styles.runningGrid}>
            <section className={`${gameStyles.panel} ${styles.productionScene}`}>
              <div className={styles.sceneHeading}>
                <div><h2 className={gameStyles.sectionTitle}>DÂY CHUYỀN KÉO SỢI</h2><p className={gameStyles.sectionText}>Chạm vào từng trạm để xem giá trị nào được chuyển hoặc tạo mới.</p></div>
                <span className={`${styles.machineStatus} ${stage === "running" ? styles.machineRunning : ""}`}>{stage === "running" ? "● MÁY ĐANG CHẠY" : "Ⅱ MÁY TẠM DỪNG"}</span>
              </div>
              <ProductionScene running={stage === "running"} progress={hour <= 4 ? hour / 4 : (hour - 4) / 4} selected={selectedHotspot} transferredValue={money(snapshot.transferredValue)} newValue={money(snapshot.newValue)} onInspect={inspect} />
              <div className={styles.sceneFootnote}>Nhấn vào một trạm để tạm dừng và xem lời giải thích. Âm thanh chỉ phát khi bạn bật.</div>
            </section>
            <section className={`${gameStyles.panel} ${styles.metricPanel}`}>
              <div className={styles.metricHeader}><span aria-hidden="true">◉</span><div><h2 className={gameStyles.sectionTitle}>ĐỒNG HỒ GIÁ TRỊ</h2><p>Giờ {moneyHour(hour)} / 8</p></div></div>
              <div className={styles.runningValues}><Metric label="GIÁ TRỊ CŨ CHUYỂN VÀO (c)" value={money(snapshot.transferredValue)} /><span aria-hidden="true">＋</span><Metric label="GIÁ TRỊ MỚI DO LAO ĐỘNG" value={money(snapshot.newValue)} /><span aria-hidden="true">＝</span><Metric label="GIÁ TRỊ SỢI HIỆN CÓ" value={money(snapshot.productValue)} /></div>
              <div className={styles.runningInsight}><small>{hour < 4 ? "ĐANG BÙ ĐẮP GIÁ TRỊ SỨC LAO ĐỘNG" : "SAU KHI ĐÃ BÙ ĐẮP 15 USD"}</small><strong>{hour < 4 ? `${moneyHour(Math.min(snapshot.newValue, result.variableCapital))} / 15 USD` : `m = ${money(snapshot.surplusValue)}`}</strong><p>{hour < 4 ? "Giá trị mới tăng dần; chưa có phần vượt quá giá trị sức lao động." : "Phần giá trị mới vượt 15 USD của hợp đồng trở thành giá trị thặng dư."}</p></div>
            </section>
          </div>
          {selectedHotspot && (
            <aside className={`${gameStyles.panel} ${styles.inspectPanel}`} aria-live="polite">
              <div><strong>{hotspotInfo[selectedHotspot].title} · {hotspotInfo[selectedHotspot].type}</strong><p>{hotspotInfo[selectedHotspot].text}</p></div>
              <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setSelectedHotspot(null)}>ĐÓNG THÔNG TIN</button>
            </aside>
          )}
          <div className={`${gameStyles.panel} ${styles.timelineControls}`}>
            <strong>GIỜ THỨ {moneyHour(hour)} / 8</strong>
            <progress max={config.totalHours} value={hour} aria-label="Tiến độ ca sản xuất" />
            <button className={gameStyles.button} type="button" onClick={() => { setSelectedHotspot(null); setStage(stage === "running" ? "paused" : "running"); }}>
              {stage === "running" ? "⏸ TẠM DỪNG" : "▶ TIẾP TỤC"}
            </button>
          </div>
          {stage === "paused" && <div className={gameStyles.buttonRow}><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={restartShift}>↺ CHẠY LẠI CA</button></div>}
        </>
      )}

      {stage === "mission" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>ĐIỀU TRA HAI DÒNG GIÁ TRỊ</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Sợi đang thành hình. Hãy lần theo giá trị cũ được chuyển vào và giá trị mới được tạo ra.</p>
          <section className={`${gameStyles.panel} ${styles.missionPanel}`}>
            <div className={styles.missionProgress}><span className={missionStep === "old" ? styles.missionProgressActive : ""}>01 · GIÁ TRỊ CŨ (c)</span><span className={missionStep === "new" ? styles.missionProgressActive : ""}>02 · GIÁ TRỊ MỚI (v + m)</span></div>
            <div className={styles.missionHeader}><span aria-hidden="true">{missionStep === "old" ? "01" : "02"}</span><div><small>ĐIỀU TRA TÙY CHỌN · GIỜ {moneyHour(hour)}</small><h2>{missionStep === "old" ? "Chọn hai nguồn giá trị đã có trước ca" : "Ai tạo phần giá trị chưa có trước ca?"}</h2><p>{missionStep === "old" ? "Trước khi xưởng chạy, những thứ nào đã mang giá trị và sẽ hao đi hoặc biến đổi trong sản phẩm?" : "Hãy so sánh trạm chỉ chuyển giá trị có sẵn với hoạt động tạo ra giá trị chưa tồn tại trước ca."}</p></div></div>
            <div className={styles.missionOptions} role="group" aria-label={missionStep === "old" ? "Chọn hai nguồn giá trị cũ" : "Chọn nguồn tạo giá trị mới"}>
              {missionOptions.map((option) => {
                const picked = missionStep === "old" ? missionOldSources.includes(option.key) : missionChoice === option.key;
                const valid = missionStep === "old" ? option.key !== "labor" : option.key === "labor";
                return <button key={option.key} type="button" className={`${styles.missionOption} ${picked ? valid ? styles.missionCorrect : styles.missionWrong : ""}`} aria-pressed={picked} onClick={() => missionStep === "old" ? setMissionOldSources((current) => current.includes(option.key) ? current.filter((key) => key !== option.key) : [...current, option.key]) : setMissionChoice(option.key)}><Image src={option.icon} alt="" width={150} height={102} /><strong>{option.title}</strong><small>{option.clue}</small></button>;
              })}
            </div>
            {missionStep === "old" && missionOldSources.length > 0 && <div className={`${styles.missionFeedback} ${missionOldSources.length === 2 && !missionOldSources.includes("labor") ? styles.missionFeedbackCorrect : ""}`} role="status"><span aria-hidden="true">{missionOldSources.includes("labor") ? "↻" : "✓"}</span><p>{missionOldSources.includes("labor") ? "Công nhân thực hiện việc chuyển giá trị, nhưng nguồn giá trị đã có trước ca là bông và máy. Hãy chọn đúng hai tư liệu sản xuất." : missionOldSources.length === 2 ? "Đúng: bông và phần hao mòn máy mang giá trị cũ vào sợi. Lao động cụ thể bảo toàn và chuyển giá trị ấy." : "Đúng một nguồn. Còn một tư liệu sản xuất nữa cũng chuyển giá trị cũ vào sợi."}</p></div>}
            {missionStep === "new" && missionChoice && <div className={`${styles.missionFeedback} ${missionChoice === "labor" ? styles.missionFeedbackCorrect : ""}`} role="status"><span aria-hidden="true">{missionChoice === "labor" ? "✓" : "↻"}</span><p><strong>{missionChoice === "labor" ? "Đúng, lao động của công nhân tạo giá trị mới." : "Tư liệu sản xuất chỉ chuyển giá trị cũ."}</strong> {missionChoice === "labor" ? "Cùng quá trình kéo sợi, lao động trừu tượng tạo 30 USD giá trị mới sau 8 giờ: 15 USD bù (v), 15 USD là (m)." : hotspotInfo[missionChoice].text}</p></div>}
          </section>
          <div className={gameStyles.buttonRow}><button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={missionStep === "old" ? missionOldSources.length !== 2 || missionOldSources.includes("labor") : missionChoice !== "labor"} onClick={() => { if (missionStep === "old") { setMissionStep("new"); } else { setMissionDone(true); setStage("running"); } }}>{missionStep === "old" ? "XÁC NHẬN GIÁ TRỊ CŨ →" : "▶ ĐÃ HIỂU · CHO MÁY CHẠY TIẾP"}</button><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("running")}>ĐỂ SAU · VỀ DÂY CHUYỀN</button></div>
        </>
      )}

      {stage === "checkpoint" && (
        <>
          <h1 className={gameStyles.heading}>DỪNG MÁY ĐỂ KIỂM TRA</h1>
          <p className={gameStyles.lede}>Tạm dừng ở nửa ca. Đọc số liệu rồi tự xác định giá trị thặng dư đã xuất hiện hay chưa.</p>
          <div className={styles.checkpointHero}><span className={styles.checkpointStop} aria-hidden="true">Ⅱ</span><div><small>MỐC QUAN TRỌNG · CA 8 GIỜ</small><strong>04:00</strong><span>GIÁ TRỊ MỚI ĐÃ BẰNG GIÁ TRỊ SỨC LAO ĐỘNG?</span></div><div className={styles.checkpointClock} aria-label="Đã qua 4 trong 8 giờ"><span>0 GIỜ</span><span className={styles.clockRail}><i /></span><span>8 GIỜ</span></div></div>
          <div className={styles.checkpointGrid}>
            <section className={`${gameStyles.panel} ${styles.checkpointScene}`}>
              <div className={styles.checkpointSceneHeader}><span>◉ CẢNH XƯỞNG TẠI MỐC 4 GIỜ</span><b>ĐÃ TẠM DỪNG</b></div>
              <div className={styles.checkpointArtwork}><ProductionScene compact running={false} selected={null} transferredValue={money(snapshot.transferredValue)} newValue={money(snapshot.newValue)} onInspect={inspect} /><span className={styles.pauseStamp}>Ⅱ<br /><small>ĐỌC SỐ LIỆU</small></span></div>
              <p className={styles.checkpointSceneNote}>Bông đã thành xơ, qua máy kéo sợi và được công nhân gia công. Hãy tách phần giá trị cũ ra khỏi giá trị mới trong cuộn sợi này.</p>
            </section>
            <section className={`${gameStyles.panel} ${styles.checkpointMetrics}`}>
              <h2 className={gameStyles.sectionTitle}>BẢNG GIÁ TRỊ · 04:00</h2>
              <p className={gameStyles.sectionText}>Từ 68 USD giá trị sợi, phân biệt phần được chuyển vào với phần mới tạo.</p>
              <Metric label="SỢI ĐÃ LÀM RA" value={money(snapshot.productValue)} />
              <Metric label="BÔNG + HAO MÒN MÁY" value={money(snapshot.transferredValue)} />
              <Metric label="GIÁ TRỊ MỚI" value={money(snapshot.newValue)} />
              <Metric label="GIÁ TRỊ SỨC LAO ĐỘNG (v) CẢ CA" value={money(result.variableCapital)} />
              <div className={styles.checkpointMetricFooter}>ĐÃ ĐI QUA <strong>4 / 8 GIỜ</strong></div>
            </section>
          </div>
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={() => setStage("question")}>▶ TRẢ LỜI CÂU HỎI</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("stopReport")}>NẾU DỪNG CA TẠI ĐÂY?</button>
            <button className={gameStyles.button} type="button" onClick={restartShift}>↺ CHẠY LẠI CA</button>
          </div>
        </>
      )}

      {stage === "stopReport" && <>
        <h1 className={gameStyles.heading}>THỬ GIẢ THUYẾT: DỪNG SAU 4 GIỜ</h1>
        <p className={gameStyles.lede}>Bạn có một cuộn sợi, nhưng chưa hoàn thành hợp đồng 8 giờ. Báo cáo này chỉ là nhánh giả định; quay lại mốc 4 giờ để tiếp tục cùng ca.</p>
        <div className={styles.stopBranch}><Image src="/assets/resource-yarn.svg" alt="Một cuộn sợi sau bốn giờ" width={170} height={140} /><div><small>GIÁ TRỊ SỢI ĐÃ LÀM RA</small><strong>{money(ledger.batches[0].productValue)}</strong><p>Giá trị cũ: {money(ledger.batches[0].oldValue)} · Giá trị mới: {money(ledger.batches[0].newValue)}. Giá trị mới vừa bù v = {money(ledger.contract.laborPowerValue)}, nên <b>m = 0</b>.</p></div></div>
        <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" onClick={() => setStage("checkpoint")}>← QUAY VỀ MỐC 4 GIỜ</button></div>
      </>}

      {stage === "question" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>DỪNG Ở GIỜ THỨ TƯ</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Sợi đã làm ra trị giá {money(snapshot.productValue)}; bông và hao mòn máy chuyển vào {money(snapshot.transferredValue)}. Giá trị sức lao động (v) của cả ca là {money(result.variableCapital)}.</p>
          {checkpointPrediction !== null && <p className={styles.predictionRecall}>DỰ ĐOÁN ĐẦU CA: <strong>m = {money(checkpointPrediction)}</strong>. Đối chiếu với đồng hồ giá trị rồi đưa ra kết luận cuối cùng.</p>}
          <section className={`${gameStyles.panel} ${styles.questionPanel}`}>
            <h2 className={gameStyles.sectionTitle}>CÂU HỎI: GIÁ TRỊ THẶNG DƯ ĐÃ XUẤT HIỆN CHƯA?</h2>
            <div className={styles.answerRow}>
              <button className={checkpointAnswer === "yes" ? styles.wrongAnswer : ""} type="button" aria-pressed={checkpointAnswer === "yes"} onClick={() => answerCheckpoint("yes")}><span>A</span> ĐÃ XUẤT HIỆN</button>
              <button type="button" aria-pressed={checkpointAnswer === "no"} onClick={() => answerCheckpoint("no")}><span>B</span> CHƯA XUẤT HIỆN</button>
            </div>
            {checkpointAnswer === "no" && !answerDialogOpen && <p className={styles.answerFeedback} aria-live="polite">✓ Chính xác: 15 USD giá trị mới vừa đủ bù đắp v, nên m = 0.</p>}
            <p className={styles.questionHint}>So sánh giá trị mới với v = 15 USD trước khi chọn.</p>
          </section>
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={checkpointAnswer !== "no" || answerDialogOpen} onClick={() => { setPassedCheckpoint(true); setBatchFeedback(""); setStage("batch2"); }}>LẬP PHIẾU MẺ 2 →</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("checkpoint")}>← XEM BẢNG GIÁ TRỊ</button>
          </div>
          {answerDialogOpen && checkpointAnswer && <div className={styles.explanationOverlay} role="presentation"><div className={`${styles.explanationDialog} ${checkpointAnswer === "no" ? styles.dialogCorrect : ""}`} role="dialog" aria-modal="true" aria-labelledby="checkpoint-explanation-title" onKeyDown={(event) => { if (event.key === "Escape") closeAnswerDialog(); }}><span className={styles.dialogIcon} aria-hidden="true">{checkpointAnswer === "no" ? "✓" : "!"}</span><p className={styles.dialogEyebrow}>{checkpointAnswer === "no" ? "CHÍNH XÁC · BẠN ĐÃ HIỂU MỐC 4 GIỜ" : "CÂU TRẢ LỜI CHƯA ĐÚNG"}</p><h2 id="checkpoint-explanation-title">{checkpointAnswer === "no" ? "Vì sao chưa có giá trị thặng dư?" : "Ở giờ thứ 4, m vẫn bằng 0"}</h2><div className={styles.dialogEquation}><span>Giá trị mới<br /><strong>15 USD</strong></span><span>−</span><span>Giá trị sức lao động (v)<br /><strong>15 USD</strong></span><span>=</span><span>Thặng dư (m)<br /><strong>0 USD</strong></span></div><p>Bốn giờ đầu là <b>thời gian lao động tất yếu</b>: người công nhân tạo đúng 15 USD để bù đắp v. Phần giá trị vượt quá v chỉ xuất hiện khi ca tiếp tục từ sau mốc này.</p><button autoFocus className={`${gameStyles.button} ${checkpointAnswer === "no" ? gameStyles.buttonGreen : ""}`} type="button" onClick={closeAnswerDialog}>{checkpointAnswer === "no" ? "ĐÃ HIỂU · XEM TIẾP" : "ĐÃ HIỂU · THỬ LẠI"}</button></div></div>}
        </>
      )}

      {stage === "audit" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>GIỜ THỨ SÁU: GIẢI MÃ CUỘN SỢI</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Trạm đào sâu tùy chọn. Giả sử tốc độ sản xuất đều trong ca. Sau mốc 4 giờ, hãy tính phần giá trị thặng dư và giá trị sợi đã làm ra.</p>
          <section className={`${gameStyles.panel} ${styles.auditPanel}`}>
            <div className={styles.auditHeader}><span aria-hidden="true">06:00</span><div><small>CA SẢN XUẤT · 6 / 8 GIỜ</small><h2>Hai phép tính để đọc sổ giờ thứ sáu</h2><p>Giá trị cũ đã chuyển: <strong>{money(auditSnapshot.transferredValue)}</strong> · Giá trị mới: <strong>{money(auditSnapshot.newValue)}</strong> · Sức lao động (v) cả ca: <strong>{money(result.variableCapital)}</strong></p></div></div>
            <div className={styles.auditGrid}>
              <div className={styles.auditQuestion}><h3>01 · Giá trị thặng dư (m) đến giờ này?</h3><p>Lấy giá trị mới trừ phần bù đắp sức lao động (v).</p><div className={styles.auditChoices}>{[auditSnapshot.surplusValue, result.variableCapital, auditSnapshot.newValue].map((amount) => <button key={amount} type="button" data-audit-m={amount} disabled={auditDone} aria-pressed={auditSurplusChoice === amount} onClick={() => { setAuditSurplusChoice(amount); setAuditFeedback(""); }}><strong>{money(amount)}</strong></button>)}</div></div>
              <div className={styles.auditQuestion}><h3>02 · Giá trị sợi (G) đã làm ra?</h3><p>Cộng phần giá trị cũ đã chuyển với toàn bộ giá trị mới.</p><div className={styles.auditChoices}>{[auditSnapshot.transferredValue + result.variableCapital, auditSnapshot.productValue, result.capitalAdvancedTotal].map((amount) => <button key={amount} type="button" data-audit-g={amount} disabled={auditDone} aria-pressed={auditProductChoice === amount} onClick={() => { setAuditProductChoice(amount); setAuditFeedback(""); }}><strong>{money(amount)}</strong></button>)}</div></div>
            </div>
            {auditFeedback && <p className={`${styles.auditFeedback} ${auditDone ? styles.auditCorrect : ""}`} role="status">{auditFeedback}</p>}
          </section>
          <div className={gameStyles.buttonRow}>{auditDone ? <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={() => setStage("running")}>▶ ĐÚNG RỒI · TIẾP TỤC SẢN XUẤT</button> : <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={auditSurplusChoice === null || auditProductChoice === null} onClick={checkAudit}>KIỂM TRA HAI PHÉP TÍNH →</button>}<button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("running")}>ĐỂ SAU · VỀ DÂY CHUYỀN</button></div>
        </>
      )}

      {stage === "result" && (
        <>
          <h1 className={gameStyles.heading}>HOÀN THÀNH MỘT CA SẢN XUẤT</h1>
          <p className={gameStyles.lede}>Tám giờ kéo sợi đã kết thúc. Xem phần giá trị nào được chuyển vào sợi và phần nào do lao động tạo mới.</p>
          <div className={styles.resultHero}><span className={styles.resultSpark} aria-hidden="true">✦</span><div><small>CA SẢN XUẤT 08:00 / 08:00 · HOÀN THÀNH</small><strong>{money(result.productValue)}</strong><p>Giá trị của sợi sau một ca sản xuất</p></div><Image src="/assets/resource-yarn.svg" alt="Các cuộn sợi thành phẩm" width={205} height={150} /></div>
          <div className={styles.batchEquation} aria-label="Giá trị hai mẻ cộng thành giá trị cả ca">
            {ledger.batches.map((batch, index) => <div className={styles.batchEquationPart} key={batch.number}>{index > 0 && <span className={styles.batchOperator} aria-hidden="true">＋</span>}<article className={styles.batchReceiptCard}><small>MẺ 0{batch.number} · {batch.fromHour}–{batch.toHour} GIỜ</small><div><Image src="/assets/resource-yarn.svg" alt="Cuộn sợi thành phẩm" width={85} height={70} /><strong>{money(batch.productValue)}</strong></div><span><b>{money(batch.cotton + batch.depreciation)}</b> giá trị cũ ＋ <b>{money(batch.newValue)}</b> giá trị mới</span><em>{batch.number === 1 ? "4 giờ đầu · vừa bù giá trị sức lao động" : "4 giờ sau · tạo phần dôi ra"}</em></article></div>)}
            <span className={styles.batchOperator} aria-hidden="true">＝</span><article className={`${styles.batchReceiptCard} ${styles.totalReceiptCard}`}><small>SỔ TỔNG CA · 08:00</small><strong>{money(ledger.totals.productValue)}</strong><span>Giá trị hai cuộn sợi</span><div className={styles.totalReceiptRule}><span>Ứng trước (c + v)</span><b>{money(ledger.totals.capitalAdvanced)}</b></div><div className={styles.totalReceiptRule}><span>Giá trị dôi ra (m)</span><b>{money(ledger.totals.m)}</b></div></article>
          </div>
          <section className={`${gameStyles.panel} ${styles.resultPanel}`}>
            <div className={styles.resultPanelHeading}><div><h2 className={gameStyles.sectionTitle}>GIẢI PHẪU CA SẢN XUẤT</h2><p>Chọn cách xem để đối chiếu thời gian lao động với giá trị tạo ra.</p></div><div className={styles.resultTabs} role="group" aria-label="Cách xem kết quả"><button type="button" aria-pressed={resultView === "timeline"} onClick={() => setResultView("timeline")}>◷ THEO THỜI GIAN</button><button type="button" aria-pressed={resultView === "breakdown"} onClick={() => setResultView("breakdown")}>▥ THEO GIÁ TRỊ</button></div></div>
            {resultView === "timeline" ? <div className={styles.resultTimeline}><div className={styles.timelineHalf}><span>00:00 → 04:00</span><strong>15 USD</strong><b>LAO ĐỘNG TẤT YẾU</b><p>Giá trị mới vừa đủ bù đắp sức lao động (v).</p></div><div className={`${styles.timelineHalf} ${styles.timelineSurplus}`}><span>04:00 → 08:00</span><strong>＋ 15 USD</strong><b>LAO ĐỘNG THẶNG DƯ</b><p>Giá trị mới dôi ra hình thành giá trị thặng dư (m).</p></div></div> : <div className={gameStyles.fourColumns}><ResultCard label="c" value={result.constantCapital} caption="Giá trị cũ chuyển vào" /><ResultCard label="v" value={result.variableCapital} caption="Bù sức lao động" /><ResultCard label="m" value={result.surplusValue} caption="Giá trị thặng dư" /><ResultCard label="G" value={result.productValue} caption="Giá trị sợi" /></div>}
            <p className={styles.resultFormula}>G = c + (v + m) = {result.constantCapital} + ({result.variableCapital} + {result.surplusValue}) = {result.productValue} USD</p>
          </section>
          <section className={styles.matchMission} aria-labelledby="factory-match-title">
            <div className={styles.matchIntro}><span>THỬ THÁCH CUỐI CA · TÔ MÀU SỔ GIÁ TRỊ</span><h2 id="factory-match-title">Tô ba nguồn bằng đúng màu giá trị</h2><p>Chọn một màu bút ở dưới, rồi tô lên nguồn tương ứng. Bạn có thể đổi màu trước khi kiểm tra.</p></div>
            <div className={styles.inkLegend} aria-label="Chú giải ba màu giá trị"><span><b>c</b> Giá trị cũ chuyển vào sợi</span><span><b>v</b> Bù đắp sức lao động</span><span><b>m</b> Giá trị thặng dư</span></div>
            <div className={styles.paintBoard} aria-label="Ba nguồn cần tô màu">{[["c","Bông và hao mòn máy","Tư liệu sản xuất"],["v","Phần giá trị bù sức lao động","Bốn giờ đầu"],["m","Bốn giờ lao động sau","Phần dôi ra"]].map(([id,label,caption]) => <button key={id} type="button" className={styles.paintCard} data-ink={matchPairs[id] ?? ""} aria-label={`${label}. ${matchPairs[id] ? `Đã tô màu ${matchPairs[id]}` : "Chưa tô màu"}`} onClick={() => { if (!matchSource) { setMatchFeedback("Hãy chọn một trong ba màu bút ở dưới trước."); return; } setMatchPairs((current) => ({ ...current, [id]: matchSource })); setPaintVerified(false); setMatchFeedback(""); }}><small>{caption}</small><strong>{label}</strong><span>{matchPairs[id] ? `MÀU ${matchPairs[id].toUpperCase()}` : "CHẠM ĐỂ TÔ"}</span></button>)}</div>
            <div className={styles.inkPalette} role="group" aria-label="Chọn màu bút">{[["c","MÀU GIÁ TRỊ CŨ"],["v","MÀU BÙ ĐẮP"],["m","MÀU THẶNG DƯ"]].map(([id,label]) => <button key={id} type="button" data-ink={id} aria-pressed={matchSource === id} onClick={() => { setMatchSource(id); setMatchFeedback(""); }}><span aria-hidden="true">{id}</span>{label}</button>)}</div>
            <div className={styles.matchStatus} role="status"><strong>{Object.keys(matchPairs).length}/3 NGUỒN ĐÃ TÔ</strong><span>{paintVerified ? "Chính xác! c là giá trị cũ; lao động tạo giá trị mới gồm v và m." : matchFeedback || "Chọn màu bút rồi chạm vào một nguồn phía trên."}</span></div>
            <button className={styles.paintCheck} type="button" disabled={Object.keys(matchPairs).length !== 3 || paintVerified} onClick={() => { if (matchComplete) { setPaintVerified(true); setMatchFeedback(""); emitChapterCompleted(3); } else { setMatchFeedback("Có màu chưa khớp. Gợi ý: bông và máy chỉ chuyển giá trị đã có; phần dôi ra xuất hiện sau khi bù sức lao động."); } }}>{paintVerified ? "ĐÃ XÁC NHẬN BA MÀU" : "KIỂM TRA BẢNG MÀU →"}</button>
          </section>
          {matchComplete && paintVerified && <section className={`${gameStyles.panel} ${styles.rewardPanel}`}>
            <button className={styles.rewardBadge} type="button" aria-expanded={badgeExpanded} onClick={() => setBadgeExpanded((current) => !current)}><span className={styles.badgeStar} aria-hidden="true">✦</span><span><small>HUY HIỆU ĐÃ MỞ KHÓA</small><strong>NHÀ ĐIỀU TRA GIÁ TRỊ</strong><em>{badgeExpanded ? "THU GỌN LỜI GIẢI ↑" : "CHẠM ĐỂ XEM VÌ SAO BẠN ĐẠT ĐƯỢC →"}</em></span></button>
            {badgeExpanded && <p className={styles.badgeExplanation}>Bạn đã nhận ra 4 giờ đầu bù đắp v và 4 giờ sau tạo ra m. Bông và máy chỉ chuyển giá trị cũ vào sợi; sức lao động là nguồn của giá trị mới.</p>}
            <div className={styles.rewardActions}>
              <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={restartShift}>↺ CHẠY LẠI CA</button>
              <Link className={gameStyles.button} href="/">VỀ BẢN ĐỒ · MỞ CHẶNG 4 →</Link>
            </div>
          </section>}
        </>
      )}
    </GameShell>
  );
}

function moneyHour(hour: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(hour);
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className={styles.metric}><span>{label}</span><strong>{value}</strong></div>;
}

function ResultCard({ label, value, caption }: { label: string; value: number; caption: string }) {
  return <div className={styles.resultCard}><span>{label}</span><strong>{money(value)}</strong><small>{caption}</small></div>;
}

function BatchPlanner({ number, plan, onChange }: { number: 1 | 2; plan: BatchPlan; onChange: (plan: BatchPlan) => void }) {
  const rows: Array<{ key: keyof BatchPlan; label: string; choices: number[]; note: string }> = [
    { key: "cotton", label: "BÔNG NGUYÊN LIỆU", choices: [0, 50, 100], note: "Ca 8 giờ có 2 mẻ tương đương; cả ca dự trù 100 USD bông." },
    { key: "depreciation", label: "HAO MÒN MÁY", choices: [0, 3, 6], note: "Cả ca máy chuyển 6 USD giá trị; hai mẻ dùng máy như nhau." },
    { key: "laborCharge", label: "TIỀN MUA SỨC LAO ĐỘNG (v)", choices: [0, 15], note: number === 1 ? "Hợp đồng 8 giờ được ký trước khi vào ca." : "Có cần trả thêm cho cùng hợp đồng 8 giờ?" },
  ];
  return <div className={styles.batchPlanner}>
    <section className={styles.batchReceipt}><span>PHIẾU MẺ 0{number} · {number === 1 ? "00:00–04:00" : "04:00–08:00"}</span><h2>QUYẾT ĐỊNH CẤP VẬT TƯ</h2><p>Chọn lượng cho từng dòng. Phiếu sai sẽ chỉ ra đúng khoản cần sửa; mẻ đã hoàn tất được giữ nguyên.</p>
      {rows.map((row) => <div className={styles.batchRow} key={row.key}><div><strong>{row.label}</strong><small>{row.note}</small></div><div role="group" aria-label={row.label}>{row.choices.map((value) => <button key={value} type="button" aria-pressed={plan[row.key] === value} onClick={() => onChange({ ...plan, [row.key]: value })}>{money(value)}</button>)}</div></div>)}
    </section>
    <aside className={styles.batchPreview}><small>DỰ TRÙ CHO MẺ NÀY</small><h2>{money(plan.cotton + plan.depreciation + plan.laborCharge)}</h2><p>Đây là phiếu đầu vào, chưa phải giá trị sợi thành phẩm. Tiền mua sức lao động là vốn ứng trước của <b>cả ca</b>, không phải một dòng phải lặp ở hai mẻ.</p><div><span>ĐÃ CHỌN</span><strong>Bông {money(plan.cotton)}</strong><strong>Hao mòn {money(plan.depreciation)}</strong><strong>Hợp đồng {money(plan.laborCharge)}</strong></div></aside>
  </div>;
}

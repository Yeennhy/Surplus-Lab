"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GameShell, gameStyles } from "@/components/chapters/game-shell";
import {
  TEXTBOOK_FACTORY_CONFIG,
  getFactoryResult,
  getFactorySnapshot,
  startFactory,
  validateFactorySetup,
  type FactorySetup,
} from "@/features/factory";
import { emitChapterCompleted } from "@/features/progress/events";
import styles from "./factory-chapter.module.css";

type FactoryStage = "setup" | "ready" | "running" | "paused" | "mission" | "checkpoint" | "question" | "result";
type Hotspot = "cotton" | "machine" | "labor";
type Decoy = "yarn" | "surplus";
type ResultView = "timeline" | "breakdown";

const config = TEXTBOOK_FACTORY_CONFIG;
const result = getFactoryResult(config);
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
  labor: { title: "SỨC LAO ĐỘNG", type: "TƯ BẢN KHẢ BIẾN (v)", text: "Sức lao động trị giá 15 USD tạo ra 30 USD giá trị mới sau 8 giờ: 15 USD bù đắp v và 15 USD là m." },
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
  const [checkpointAnswer, setCheckpointAnswer] = useState<"yes" | "no" | null>(null);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [showCheckpointExplanation, setShowCheckpointExplanation] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [resultView, setResultView] = useState<ResultView>("timeline");
  const [badgeExpanded, setBadgeExpanded] = useState(false);
  const hourRef = useRef(0);
  const snapshot = getFactorySnapshot(config, hour);
  const readyToStart = validateFactorySetup(setup).length === 0 && !selectedDecoys.yarn && !selectedDecoys.surplus;
  const selectedCount = Object.values(setup).filter(Boolean).length + Object.values(selectedDecoys).filter(Boolean).length;

  useEffect(() => {
    if (stage !== "running") return;
    const timer = window.setInterval(() => {
      const limit = passedCheckpoint ? config.totalHours : missionDone ? config.necessaryHours : 2;
      const nextHour = Math.min(limit, hourRef.current + 0.125);
      hourRef.current = nextHour;
      setHour(nextHour);
      if (nextHour >= config.totalHours) {
        setStage("result");
        emitChapterCompleted(3);
      } else if (nextHour >= 2 && !missionDone) {
        setStage("mission");
      } else if (nextHour >= config.necessaryHours && !passedCheckpoint) {
        setStage("checkpoint");
        setShowCheckpointExplanation(true);
      }
    }, 375);
    return () => window.clearInterval(timer);
  }, [stage, passedCheckpoint, missionDone]);

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
    setCheckpointAnswer(null);
    setAnswerDialogOpen(false);
    setShowCheckpointExplanation(false);
    setSelectedHotspot(null);
    setResultView("timeline");
    setBadgeExpanded(false);
    setStage("ready");
  }

  function inspect(target: Hotspot) {
    setSelectedHotspot(target);
    if (stage === "running") setStage("paused");
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
          <p className={gameStyles.lede}>Lao động và tư liệu sản xuất đã sẵn sàng để bắt đầu tạo ra hàng hóa.</p>
          <section className={`${gameStyles.panel} ${styles.readyScene}`}>
            <h2 className={gameStyles.sectionTitle}>CẢNH XƯỞNG SỢI</h2>
            <p className={gameStyles.sectionText}>Kho bông → máy kéo sợi → thành phẩm.</p>
            <Image src="/assets/figma/textile-mill.svg" alt="Minh họa xưởng kéo sợi" width={520} height={355} />
          </section>
          <p className={`${gameStyles.note} ${styles.readyNote}`}>ĐÃ ỨNG {money(snapshot.capitalAdvancedTotal)}; CHƯA CÓ THÀNH PHẨM; GIÁ TRỊ MỚI = 0.</p>
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={() => setStage("running")}>▶ CHO MÁY CHẠY</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("setup")}>CHUẨN BỊ LẠI</button>
          </div>
        </>
      )}

      {(stage === "running" || stage === "paused") && (
        <>
          <h1 className={gameStyles.heading}>{stage === "running" ? "NHÀ MÁY ĐANG VẬN HÀNH" : "NHÀ MÁY ĐÃ TẠM DỪNG"}</h1>
          <p className={gameStyles.lede}>Quan sát dòng bông đi qua máy kéo sợi. Chọn một trạm để dừng ca và điều tra vai trò của nó.</p>
          <div className={styles.factoryToolbar}>
            <span className={styles.liveBadge}><i aria-hidden="true" />{stage === "running" ? "XƯỞNG ĐANG HOẠT ĐỘNG" : "CA ĐÃ TẠM DỪNG"}</span>
            <span>01 GIỜ MÔ PHỎNG = 03 GIÂY</span>
            <button type="button" className={styles.soundButton} aria-pressed={soundOn} onClick={() => setSoundOn((current) => !current)}>{soundOn ? "♫ TẮT ÂM THANH XƯỞNG" : "♫ BẬT ÂM THANH XƯỞNG"}</button>
          </div>
          <div className={styles.learningStrip}><span aria-hidden="true">⌛</span><p><strong>{hour < 4 ? "0–4 GIỜ · LAO ĐỘNG TẤT YẾU" : "4–8 GIỜ · LAO ĐỘNG THẶNG DƯ"}</strong>{hour < 4 ? " Giá trị mới đang bù đắp 15 USD tiền mua sức lao động (v)." : " Khi v đã được bù đắp, giá trị mới tiếp tục tăng và tạo ra m."}</p></div>
          <div className={styles.runningGrid}>
            <section className={`${gameStyles.panel} ${styles.productionScene}`}>
              <div className={styles.sceneHeading}>
                <div><h2 className={gameStyles.sectionTitle}>DÂY CHUYỀN KÉO SỢI</h2><p className={gameStyles.sectionText}>Chạm vào từng trạm để xem giá trị nào được chuyển hoặc tạo mới.</p></div>
                <span className={`${styles.machineStatus} ${stage === "running" ? styles.machineRunning : ""}`}>{stage === "running" ? "● MÁY ĐANG CHẠY" : "Ⅱ MÁY TẠM DỪNG"}</span>
              </div>
              <div className={`${styles.productionLine} ${stage === "running" ? styles.productionLineActive : ""}`}>
                <div className={styles.threadTrack} aria-hidden="true" />
                <span className={styles.cottonTransfer} aria-hidden="true">☁</span>
                <span className={styles.yarnTransfer} aria-hidden="true">━━━━</span>
                <button type="button" className={`${styles.station} ${selectedHotspot === "cotton" ? styles.stationSelected : ""}`} aria-pressed={selectedHotspot === "cotton"} onClick={() => inspect("cotton")}><span className={styles.stationNumber}>01 · NGUYÊN LIỆU</span><span className={styles.stationVisual}><Image src="/assets/resource-cotton.svg" alt="" width={170} height={124} /><span className={styles.cottonPuff} aria-hidden="true">☁</span></span><strong>KHO BÔNG</strong><small>100 USD giá trị cũ →</small></button>
                <button type="button" className={`${styles.station} ${styles.machineStation} ${selectedHotspot === "machine" ? styles.stationSelected : ""}`} aria-pressed={selectedHotspot === "machine"} onClick={() => inspect("machine")}><span className={styles.stationNumber}>02 · TƯ LIỆU</span><span className={styles.stationVisual}><Image src="/assets/resource-spinning-machine.svg" alt="" width={170} height={124} /><span className={styles.smallRotor} aria-hidden="true">✳</span><span className={styles.largeRotor} aria-hidden="true">✳</span><span className={styles.spinningThread} aria-hidden="true" /></span><strong>MÁY KÉO SỢI</strong><small>6 USD hao mòn →</small></button>
                <button type="button" className={`${styles.station} ${styles.workerStation} ${selectedHotspot === "labor" ? styles.stationSelected : ""}`} aria-pressed={selectedHotspot === "labor"} onClick={() => inspect("labor")}><span className={styles.stationNumber}>03 · LAO ĐỘNG</span><span className={styles.stationVisual}><Image src="/assets/labor-wage-worker.svg" alt="" width={170} height={124} /><svg className={styles.workerMotion} viewBox="0 0 240 190" aria-hidden="true"><g className={styles.workerArm}><path d="M88 141 Q65 125 41 111" fill="none" stroke="#385b6b" strokeWidth="15" strokeLinecap="round" /><circle cx="38" cy="108" r="9" fill="#bb8869" /></g></svg><span className={styles.workerTask} aria-hidden="true">↗</span></span><strong>NGƯỜI CÔNG NHÂN</strong><small>Tạo mới {money(snapshot.newValue)}</small></button>
                <div className={styles.materialRail} aria-label="Bông đi vào máy kéo sợi, công nhân vận hành, sợi thành phẩm đi ra"><Image src="/assets/resource-cotton.svg" alt="" width={64} height={46} /><div className={styles.materialTrack}><span className={styles.rawMaterial} aria-hidden="true">☁</span><span className={styles.rawMaterial} aria-hidden="true">☁</span><span className={styles.processingGear} aria-hidden="true">⚙</span><span className={styles.finishedThread} aria-hidden="true">━━━━</span><span className={styles.finishedThread} aria-hidden="true">━━━━</span></div><Image src="/assets/resource-yarn.svg" alt="" width={64} height={46} /></div>
              </div>
              <div className={styles.outputBelt}><span className={styles.beltArrow} aria-hidden="true">➜ ➜ ➜</span><Image src="/assets/resource-yarn.svg" alt="" width={74} height={54} /><div><strong>SỢI THÀNH PHẨM</strong><small>Giá trị được tạo đến lúc này: {money(snapshot.productValue)}</small></div></div>
              <div className={styles.sceneFootnote}>Nhấn vào một trạm để tạm dừng và xem lời giải thích. Âm thanh chỉ phát khi bạn bật.</div>
            </section>
            <section className={`${gameStyles.panel} ${styles.metricPanel}`}>
              <div className={styles.metricHeader}><span aria-hidden="true">◉</span><div><h2 className={gameStyles.sectionTitle}>ĐỒNG HỒ GIÁ TRỊ</h2><p>Giờ {moneyHour(hour)} / 8</p></div></div>
              <Metric label="Giá trị cũ (c) cả ca" value={money(result.constantCapital)} />
              <Metric label="Sức lao động (v)" value={money(result.variableCapital)} />
              <Metric label="Thặng dư (m) đã tạo" value={money(snapshot.surplusValue)} />
              <Metric label="Giá trị (G) minh họa cả ca" value={money(snapshot.illustrativeFullInputValue)} />
              <p className={styles.actualValue}>Sản phẩm đã tạo đến giờ này: <strong>{money(snapshot.productValue)}</strong></p>
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
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>TRẠM KIỂM TRA ĐẦU CA</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Hai giờ đầu đã trôi qua. Sợi đang được tạo ra, nhưng giá trị mới đến từ đâu?</p>
          <section className={`${gameStyles.panel} ${styles.missionPanel}`}>
            <div className={styles.missionHeader}><span aria-hidden="true">Ⅱ</span><div><small>NHIỆM VỤ TẠI 02:00 / 08:00</small><h2>Chọn trạm tạo ra giá trị mới</h2><p>Bông và máy mang giá trị sẵn có vào sợi. Hãy tìm nguồn tạo ra phần giá trị chưa có trước ca.</p></div></div>
            <div className={styles.missionOptions} role="group" aria-label="Chọn trạm tạo giá trị mới">
              {missionOptions.map((option) => <button key={option.key} type="button" className={`${styles.missionOption} ${missionChoice === option.key ? option.key === "labor" ? styles.missionCorrect : styles.missionWrong : ""}`} aria-pressed={missionChoice === option.key} onClick={() => setMissionChoice(option.key)}><Image src={option.icon} alt="" width={150} height={102} /><strong>{option.title}</strong><small>{option.clue}</small></button>)}
            </div>
            {missionChoice && <div className={`${styles.missionFeedback} ${missionChoice === "labor" ? styles.missionFeedbackCorrect : ""}`} role="status"><span aria-hidden="true">{missionChoice === "labor" ? "✓" : "↻"}</span><p><strong>{missionChoice === "labor" ? "Đúng rồi, sức lao động tạo giá trị mới." : "Hãy nhìn vai trò của trạm này."}</strong> {missionChoice === "labor" ? "Trong 8 giờ, lao động tạo 30 USD giá trị mới; 15 USD đầu bù đắp (v), 15 USD sau trở thành (m)." : hotspotInfo[missionChoice].text}</p></div>}
          </section>
          <div className={gameStyles.buttonRow}><button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={missionChoice !== "labor"} onClick={() => { setMissionDone(true); setStage("running"); }}>▶ ĐÃ HIỂU · CHO MÁY CHẠY TIẾP</button></div>
        </>
      )}

      {stage === "checkpoint" && (
        <>
          <h1 className={gameStyles.heading}>DỪNG MÁY ĐỂ KIỂM TRA</h1>
          <p className={gameStyles.lede}>Ca sản xuất tạm dừng đúng lúc giá trị sức lao động được bù đắp. Hãy nhìn vào con số trước khi quyết định.</p>
          <div className={styles.checkpointHero}><span className={styles.checkpointStop} aria-hidden="true">Ⅱ</span><div><small>MỐC QUAN TRỌNG · CA 8 GIỜ</small><strong>04:00</strong><span>LAO ĐỘNG TẤT YẾU ĐÃ HOÀN TẤT</span></div><div className={styles.checkpointClock} aria-label="Đã qua 4 trong 8 giờ"><span>0 GIỜ</span><span className={styles.clockRail}><i /></span><span>8 GIỜ</span></div></div>
          <div className={styles.checkpointGrid}>
            <section className={`${gameStyles.panel} ${styles.checkpointScene}`}>
              <div className={styles.checkpointSceneHeader}><span>◉ CẢNH XƯỞNG TẠI MỐC 4 GIỜ</span><b>ĐÃ TẠM DỪNG</b></div>
              <div className={styles.checkpointArtwork}><Image src="/assets/figma/textile-mill.svg" alt="Xưởng sợi ở mốc 4 giờ" width={520} height={355} /><span className={styles.pauseStamp}>Ⅱ<br /><small>ĐỌC SỐ LIỆU</small></span></div>
            </section>
            <section className={`${gameStyles.panel} ${styles.checkpointMetrics}`}>
              <h2 className={gameStyles.sectionTitle}>BẢNG GIÁ TRỊ · 04:00</h2>
              <p className={gameStyles.sectionText}>Hai con số quyết định câu trả lời.</p>
              <Metric label="GIÁ TRỊ MỚI" value={money(snapshot.newValue)} />
              <Metric label="THẶNG DƯ" value={money(snapshot.surplusValue)} />
              <div className={styles.checkpointMetricFooter}>ĐÃ ĐI QUA <strong>4 / 8 GIỜ</strong></div>
            </section>
          </div>
          {showCheckpointExplanation && <div className={styles.checkpointNote}><div className={styles.checkpointNoteHeading}><span aria-hidden="true">✦</span><div><small>ĐỌC MỐC 4 GIỜ</small><strong>VỪA ĐỦ BÙ ĐẮP, CHƯA CÓ THẶNG DƯ</strong></div></div><div className={styles.checkpointEquation}><span><small>GIÁ TRỊ MỚI</small><b>15 USD</b></span><em>−</em><span><small>GIÁ TRỊ SỨC LAO ĐỘNG (v)</small><b>15 USD</b></span><em>=</em><span><small>GIÁ TRỊ THẶNG DƯ (m)</small><b>0 USD</b></span></div><p>Bốn giờ đầu là <b>lao động tất yếu</b>: giá trị mới vừa bằng v. Giá trị thặng dư chỉ xuất hiện khi lao động tiếp tục tạo ra phần dôi ra.</p></div>}
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={() => setStage("question")}>▶ TIẾP TỤC</button>
            <button className={gameStyles.button} type="button" onClick={restartShift}>↺ CHẠY LẠI CA</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setShowCheckpointExplanation((current) => !current)}>{showCheckpointExplanation ? "ẨN GIẢI THÍCH" : "XEM GIẢI THÍCH"}</button>
          </div>
        </>
      )}

      {stage === "question" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>DỪNG Ở GIỜ THỨ TƯ</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Người công nhân đã tạo ra {money(snapshot.newValue)} giá trị mới, đúng bằng giá trị sức lao động.</p>
          <section className={`${gameStyles.panel} ${styles.questionPanel}`}>
            <h2 className={gameStyles.sectionTitle}>CÂU HỎI: GIÁ TRỊ THẶNG DƯ ĐÃ XUẤT HIỆN CHƯA?</h2>
            <div className={styles.answerRow}>
              <button className={checkpointAnswer === "yes" ? styles.wrongAnswer : ""} type="button" aria-pressed={checkpointAnswer === "yes"} onClick={() => answerCheckpoint("yes")}><span>×</span> ĐÃ XUẤT HIỆN</button>
              <button type="button" aria-pressed={checkpointAnswer === "no"} onClick={() => answerCheckpoint("no")}><span>✓</span> CHƯA XUẤT HIỆN</button>
            </div>
            {checkpointAnswer === "no" && !answerDialogOpen && <p className={styles.answerFeedback} aria-live="polite">✓ Chính xác: 15 USD giá trị mới vừa đủ bù đắp v, nên m = 0.</p>}
            <p className={styles.questionHint}>So sánh giá trị mới với v = 15 USD trước khi chọn.</p>
          </section>
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={checkpointAnswer !== "no" || answerDialogOpen} onClick={() => { setPassedCheckpoint(true); setStage("running"); }}>TIẾP TỤC CA SẢN XUẤT →</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("checkpoint")}>← XEM BẢNG GIÁ TRỊ</button>
          </div>
          {answerDialogOpen && checkpointAnswer && <div className={styles.explanationOverlay} role="presentation"><div className={`${styles.explanationDialog} ${checkpointAnswer === "no" ? styles.dialogCorrect : ""}`} role="dialog" aria-modal="true" aria-labelledby="checkpoint-explanation-title" onKeyDown={(event) => { if (event.key === "Escape") closeAnswerDialog(); }}><span className={styles.dialogIcon} aria-hidden="true">{checkpointAnswer === "no" ? "✓" : "!"}</span><p className={styles.dialogEyebrow}>{checkpointAnswer === "no" ? "CHÍNH XÁC · BẠN ĐÃ HIỂU MỐC 4 GIỜ" : "CÂU TRẢ LỜI CHƯA ĐÚNG"}</p><h2 id="checkpoint-explanation-title">{checkpointAnswer === "no" ? "Vì sao chưa có giá trị thặng dư?" : "Ở giờ thứ 4, m vẫn bằng 0"}</h2><div className={styles.dialogEquation}><span>Giá trị mới<br /><strong>15 USD</strong></span><span>−</span><span>Giá trị sức lao động (v)<br /><strong>15 USD</strong></span><span>=</span><span>Thặng dư (m)<br /><strong>0 USD</strong></span></div><p>Bốn giờ đầu là <b>thời gian lao động tất yếu</b>: người công nhân tạo đúng 15 USD để bù đắp v. Phần giá trị vượt quá v chỉ xuất hiện khi ca tiếp tục từ sau mốc này.</p><button autoFocus className={`${gameStyles.button} ${checkpointAnswer === "no" ? gameStyles.buttonGreen : ""}`} type="button" onClick={closeAnswerDialog}>{checkpointAnswer === "no" ? "ĐÃ HIỂU · XEM TIẾP" : "ĐÃ HIỂU · THỬ LẠI"}</button></div></div>}
        </>
      )}

      {stage === "result" && (
        <>
          <h1 className={gameStyles.heading}>HOÀN THÀNH MỘT CA SẢN XUẤT</h1>
          <p className={gameStyles.lede}>Tám giờ kéo sợi đã kết thúc. Xem phần giá trị nào được chuyển vào sợi và phần nào do lao động tạo mới.</p>
          <div className={styles.resultHero}><span className={styles.resultSpark} aria-hidden="true">✦</span><div><small>CA SẢN XUẤT 08:00 / 08:00 · HOÀN THÀNH</small><strong>{money(result.productValue)}</strong><p>Giá trị của sợi sau một ca sản xuất</p></div><Image src="/assets/resource-yarn.svg" alt="Các cuộn sợi thành phẩm" width={205} height={150} /></div>
          <section className={`${gameStyles.panel} ${styles.resultPanel}`}>
            <div className={styles.resultPanelHeading}><div><h2 className={gameStyles.sectionTitle}>GIẢI PHẪU CA SẢN XUẤT</h2><p>Chọn cách xem để đối chiếu thời gian lao động với giá trị tạo ra.</p></div><div className={styles.resultTabs} role="group" aria-label="Cách xem kết quả"><button type="button" aria-pressed={resultView === "timeline"} onClick={() => setResultView("timeline")}>◷ THEO THỜI GIAN</button><button type="button" aria-pressed={resultView === "breakdown"} onClick={() => setResultView("breakdown")}>▥ THEO GIÁ TRỊ</button></div></div>
            {resultView === "timeline" ? <div className={styles.resultTimeline}><div className={styles.timelineHalf}><span>00:00 → 04:00</span><strong>15 USD</strong><b>LAO ĐỘNG TẤT YẾU</b><p>Giá trị mới vừa đủ bù đắp sức lao động (v).</p></div><div className={`${styles.timelineHalf} ${styles.timelineSurplus}`}><span>04:00 → 08:00</span><strong>＋ 15 USD</strong><b>LAO ĐỘNG THẶNG DƯ</b><p>Giá trị mới dôi ra hình thành giá trị thặng dư (m).</p></div></div> : <div className={gameStyles.fourColumns}><ResultCard label="c" value={result.constantCapital} caption="Giá trị cũ chuyển vào" /><ResultCard label="v" value={result.variableCapital} caption="Bù sức lao động" /><ResultCard label="m" value={result.surplusValue} caption="Giá trị thặng dư" /><ResultCard label="G" value={result.productValue} caption="Giá trị sợi" /></div>}
            <p className={styles.resultFormula}>G = c + (v + m) = {result.constantCapital} + ({result.variableCapital} + {result.surplusValue}) = {result.productValue} USD</p>
          </section>
          <section className={`${gameStyles.panel} ${styles.rewardPanel}`}>
            <button className={styles.rewardBadge} type="button" aria-expanded={badgeExpanded} onClick={() => setBadgeExpanded((current) => !current)}><span className={styles.badgeStar} aria-hidden="true">✦</span><span><small>HUY HIỆU ĐÃ MỞ KHÓA</small><strong>NHÀ ĐIỀU TRA GIÁ TRỊ</strong><em>{badgeExpanded ? "THU GỌN LỜI GIẢI ↑" : "CHẠM ĐỂ XEM VÌ SAO BẠN ĐẠT ĐƯỢC →"}</em></span></button>
            {badgeExpanded && <p className={styles.badgeExplanation}>Bạn đã nhận ra 4 giờ đầu bù đắp v và 4 giờ sau tạo ra m. Bông và máy chỉ chuyển giá trị cũ vào sợi; sức lao động là nguồn của giá trị mới.</p>}
            <div className={styles.rewardActions}>
              <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={restartShift}>↺ CHẠY LẠI CA</button>
              <Link className={gameStyles.button} href="/learn/chapter-4">CHƯƠNG TIẾP THEO →</Link>
            </div>
          </section>
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

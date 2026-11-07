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

type FactoryStage = "setup" | "ready" | "running" | "paused" | "checkpoint" | "question" | "result";
type Hotspot = "cotton" | "machine" | "labor";

const config = TEXTBOOK_FACTORY_CONFIG;
const result = getFactoryResult(config);
const resources: Array<{ key: keyof FactorySetup; title: string; amount: string; icon: string; glyph: string }> = [
  { key: "cottonReady", title: "BÔNG NGUYÊN LIỆU", amount: "100 USD", icon: "/assets/figma/factory-cotton-icon.svg", glyph: "❖" },
  { key: "machineReady", title: "MÁY KÉO SỢI", amount: "6 USD hao mòn", icon: "/assets/figma/factory-machine-icon.svg", glyph: "⚙" },
  { key: "laborHired", title: "SỨC LAO ĐỘNG", amount: "15 USD", icon: "/assets/figma/factory-labor-icon.svg", glyph: "♟" },
];

const hotspotInfo: Record<Hotspot, { title: string; type: string; text: string }> = {
  cotton: { title: "KHO BÔNG", type: "TƯ BẢN BẤT BIẾN · c", text: "100 USD giá trị bông được bảo toàn và chuyển dần vào sợi; bản thân bông không tạo ra giá trị mới." },
  machine: { title: "MÁY KÉO SỢI", type: "TƯ BẢN BẤT BIẾN · c", text: "6 USD hao mòn máy móc được chuyển vào sản phẩm trong cả ca sản xuất." },
  labor: { title: "SỨC LAO ĐỘNG", type: "TƯ BẢN KHẢ BIẾN · v", text: "Sức lao động trị giá 15 USD tạo ra 30 USD giá trị mới sau 8 giờ: 15 USD bù đắp v và 15 USD là m." },
};

function money(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value)} USD`;
}

export function FactoryChapter() {
  const [stage, setStage] = useState<FactoryStage>("setup");
  const [setup, setSetup] = useState<FactorySetup>({ cottonReady: true, machineReady: true, laborHired: false });
  const [hour, setHour] = useState(0);
  const [passedCheckpoint, setPassedCheckpoint] = useState(false);
  const [checkpointAnswer, setCheckpointAnswer] = useState<"yes" | "no" | null>(null);
  const [showCheckpointExplanation, setShowCheckpointExplanation] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const hourRef = useRef(0);
  const snapshot = getFactorySnapshot(config, hour);
  const readyToStart = validateFactorySetup(setup).length === 0;

  useEffect(() => {
    if (stage !== "running") return;
    const timer = window.setInterval(() => {
      const limit = passedCheckpoint ? config.totalHours : config.necessaryHours;
      const nextHour = Math.min(limit, hourRef.current + 0.125);
      hourRef.current = nextHour;
      setHour(nextHour);
      if (nextHour >= config.totalHours) {
        setStage("result");
        emitChapterCompleted(3);
      } else if (nextHour >= config.necessaryHours && !passedCheckpoint) {
        setStage("checkpoint");
      }
    }, 125);
    return () => window.clearInterval(timer);
  }, [stage, passedCheckpoint]);

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
    setCheckpointAnswer(null);
    setShowCheckpointExplanation(false);
    setSelectedHotspot(null);
    setStage("ready");
  }

  function inspect(target: Hotspot) {
    setSelectedHotspot(target);
    if (stage === "running") setStage("paused");
  }

  return (
    <GameShell chapter={3} progress={(hour / config.totalHours) * 100}>
      {stage === "setup" && (
        <>
          <h1 className={gameStyles.heading}>KHO VẬT TƯ TRƯỚC CA SẢN XUẤT</h1>
          <p className={gameStyles.lede}>Bấm vào từng thẻ để chuẩn bị bông, máy móc và sức lao động.</p>
          <div className={gameStyles.cardGrid}>
            {resources.map((resource) => (
              <button
                key={resource.key}
                className={`${gameStyles.cardButton} ${styles.resourceCard} ${setup[resource.key] ? styles.resourceReady : ""}`}
                type="button"
                aria-pressed={setup[resource.key]}
                onClick={() => toggleResource(resource.key)}
              >
                <strong>{resource.title}</strong>
                <small>Nhấn để chuẩn bị trước khi vận hành.</small>
                <span className={styles.resourceIcon}>
                  <Image src={resource.icon} alt="" width={110} height={110} />
                  <span aria-hidden="true">{resource.glyph}</span>
                </span>
                <b>{resource.amount}</b>
                <span className={`${styles.resourceStatus} ${setup[resource.key] ? styles.statusReady : ""}`}>
                  {setup[resource.key] ? "✓ ĐÃ CHUẨN BỊ" : resource.key === "laborHired" ? "＋ CHƯA THUÊ" : "＋ CHƯA CHUẨN BỊ"}
                </span>
              </button>
            ))}
          </div>
          <div className={`${gameStyles.panel} ${styles.setupFooter}`}>
            <div>
              <h2 className={gameStyles.sectionTitle}>TƯ BẢN ỨNG TRƯỚC · {money(result.capitalAdvancedTotal)}</h2>
              <p className={gameStyles.sectionText}>Điều kiện bắt đầu: đầy đủ bông, máy móc và sức lao động.</p>
              {!readyToStart && <p className={styles.setupWarning} aria-live="polite">{validateFactorySetup(setup).map((issue) => issue.message).join(" ")}</p>}
            </div>
            <button className={gameStyles.button} type="button" disabled={!readyToStart} onClick={prepareShift}>▶ KHỞI ĐỘNG NHÀ MÁY</button>
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
          <p className={gameStyles.lede}>Dữ liệu thay đổi theo giờ; chọn bông, máy hoặc sức lao động để xem chú giải.</p>
          <div className={styles.runningGrid}>
            <section className={`${gameStyles.panel} ${styles.productionScene}`}>
              <div className={styles.sceneHeading}>
                <div><h2 className={gameStyles.sectionTitle}>XƯỞNG SỢI 2D · {stage === "running" ? "ĐANG CHẠY" : "TẠM DỪNG"}</h2><p className={gameStyles.sectionText}>Các khu vực có thể chọn để xem thành phần giá trị.</p></div>
                <span className={`${styles.machineStatus} ${stage === "running" ? styles.machineRunning : ""}`}>{stage === "running" ? "● MÁY ĐANG CHẠY" : "Ⅱ MÁY TẠM DỪNG"}</span>
              </div>
              <div className={`${styles.millVisual} ${stage === "running" ? styles.millRunning : ""}`}>
                <Image src="/assets/figma/textile-mill.svg" alt="Minh họa xưởng kéo sợi" width={520} height={355} />
              </div>
              <div className={styles.hotspotRow}>
                <button type="button" onClick={() => inspect("cotton")}>❖ KHO BÔNG</button>
                <button type="button" onClick={() => inspect("machine")}>⚙ MÁY MÓC</button>
                <button type="button" onClick={() => inspect("labor")}>♟ LAO ĐỘNG</button>
              </div>
            </section>
            <section className={`${gameStyles.panel} ${styles.metricPanel}`}>
              <h2 className={gameStyles.sectionTitle}>GIÁ TRỊ</h2>
              <p className={gameStyles.sectionText}>Minh họa với tư liệu của cả ca.</p>
              <Metric label="c" value={money(result.constantCapital)} />
              <Metric label="v" value={money(result.variableCapital)} />
              <Metric label="m" value={money(snapshot.surplusValue)} />
              <Metric label="G" value={money(snapshot.illustrativeFullInputValue)} />
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

      {stage === "checkpoint" && (
        <>
          <h1 className={gameStyles.heading}>DỪNG MÁY ĐỂ KIỂM TRA</h1>
          <p className={gameStyles.lede}>Mô phỏng đang dừng tại giờ thứ 4, chỉ số được giữ nguyên.</p>
          <div className={styles.checkpointGrid}>
            <section className={`${gameStyles.panel} ${styles.checkpointScene}`}>
              <h2 className={gameStyles.sectionTitle}>CÔNG ĐOẠN HIỆN TẠI</h2>
              <p className={gameStyles.sectionText}>Chuyển từ lao động tất yếu sang lao động thặng dư.</p>
              <Image src="/assets/figma/textile-mill.svg" alt="Xưởng sợi ở mốc 4 giờ" width={520} height={355} />
            </section>
            <section className={`${gameStyles.panel} ${styles.checkpointMetrics}`}>
              <h2 className={gameStyles.sectionTitle}>BẢNG GIÁ TRỊ</h2>
              <p className={gameStyles.sectionText}>Thời gian hiện tại: 04:00 / 08:00</p>
              <Metric label="GIÁ TRỊ MỚI" value={money(snapshot.newValue)} />
              <Metric label="THẶNG DƯ" value={money(snapshot.surplusValue)} />
              <Metric label="THỜI GIAN TẤT YẾU" value="4 giờ" />
            </section>
          </div>
          {showCheckpointExplanation && <p className={`${gameStyles.note} ${styles.checkpointNote}`}>Bốn giờ đầu là thời gian lao động tất yếu: 15 USD giá trị mới vừa đủ bù đắp sức lao động, nên m = 0.</p>}
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" onClick={() => setStage("question")}>▶ TIẾP TỤC</button>
            <button className={gameStyles.button} type="button" onClick={restartShift}>↺ CHẠY LẠI CA</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setShowCheckpointExplanation((current) => !current)}>XEM GIẢI THÍCH</button>
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
              <button type="button" aria-pressed={checkpointAnswer === "yes"} onClick={() => setCheckpointAnswer("yes")}><span>×</span> ĐÃ XUẤT HIỆN</button>
              <button type="button" aria-pressed={checkpointAnswer === "no"} onClick={() => setCheckpointAnswer("no")}><span>✓</span> CHƯA XUẤT HIỆN</button>
            </div>
            {(checkpointAnswer || showCheckpointExplanation) && <p className={styles.answerFeedback} aria-live="polite">{checkpointAnswer === "no" ? "✓ Chính xác. Bốn giờ đầu chỉ tạo đủ giá trị để bù đắp sức lao động; m = 0." : "Bốn giờ đầu là thời gian lao động tất yếu. Giá trị mới mới bằng v, nên m chưa xuất hiện."}</p>}
            <p className={styles.questionHint}>Gợi ý: 4 giờ đầu là thời gian lao động tất yếu.</p>
          </section>
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonGreen}`} type="button" disabled={!checkpointAnswer} onClick={() => { setPassedCheckpoint(true); setStage("running"); }}>TIẾP TỤC CA SẢN XUẤT →</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("checkpoint")}>← XEM BẢNG GIÁ TRỊ</button>
          </div>
        </>
      )}

      {stage === "result" && (
        <>
          <h1 className={gameStyles.heading}>HOÀN THÀNH MỘT CA SẢN XUẤT</h1>
          <p className={gameStyles.lede}>Bảng tổng hợp và phần thưởng trước khi bước sang trò chơi c/v/m.</p>
          <section className={`${gameStyles.panel} ${styles.resultPanel}`}>
            <h2 className={gameStyles.sectionTitle}>KẾT QUẢ SAU 8 GIỜ</h2>
            <p className={gameStyles.sectionText}>Giá trị mới vượt quá giá trị sức lao động trong quá trình sản xuất.</p>
            <div className={gameStyles.fourColumns}>
              <ResultCard label="c" value={result.constantCapital} />
              <ResultCard label="v" value={result.variableCapital} />
              <ResultCard label="m" value={result.surplusValue} />
              <ResultCard label="G" value={result.productValue} />
            </div>
            <p className={styles.resultFormula}>G = c + (v + m) = {result.constantCapital} + ({result.variableCapital} + {result.surplusValue}) = {result.productValue} USD</p>
          </section>
          <section className={`${gameStyles.panel} ${styles.rewardPanel}`}>
            <h2 className={gameStyles.sectionTitle}>NHIỆM VỤ HOÀN THÀNH · HUY HIỆU ĐƯỢC MỞ KHÓA</h2>
            <p className={gameStyles.sectionText}>Bạn đã phân biệt lao động tất yếu và lao động thặng dư.</p>
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

function ResultCard({ label, value }: { label: string; value: number }) {
  return <div className={styles.resultCard}><span>{label}</span><strong>{money(value)}</strong></div>;
}

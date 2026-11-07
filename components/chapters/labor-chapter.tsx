"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GameShell, gameStyles } from "./game-shell";
import { LABOR_POWER_VALUE_PARTS, LABOR_SCENARIOS, evaluateLaborScenario } from "@/features/labor";
import { emitChapterCompleted } from "@/features/progress/events";
import styles from "./labor-chapter.module.css";

type Stage = "select" | "feedback" | "conditions" | "properties";

export function LaborChapter() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedId, setSelectedId] = useState<(typeof LABOR_SCENARIOS)[number]["id"] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const selected = LABOR_SCENARIOS.find((scenario) => scenario.id === selectedId);
  const evaluation = selected ? evaluateLaborScenario(selected) : null;

  function confirmSelection() {
    if (!selected || !evaluation) return;
    setStage(evaluation.qualifies ? "conditions" : "feedback");
  }

  return (
    <GameShell chapter={2}>
      {stage === "select" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>HÀNG HÓA ĐẶC BIỆT</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>
            Tìm người đáp ứng cả hai điều kiện để sức lao động trở thành hàng hóa.
          </p>
          <div className={gameStyles.cardGrid}>
            {LABOR_SCENARIOS.map((scenario) => (
              <button
                className={`${gameStyles.cardButton} ${styles.personCard} ${selectedId === scenario.id ? gameStyles.selected : ""}`}
                key={scenario.id}
                type="button"
                aria-pressed={selectedId === scenario.id}
                onClick={() => setSelectedId(scenario.id)}
              >
                <Image className={styles.personImage} src="/assets/figma/worker-portrait.svg" alt="" width={216} height={187} />
                <strong>{scenario.id.toUpperCase()} · {scenario.title}</strong>
                <span>{scenario.description}</span>
              </button>
            ))}
          </div>
          {showHint && <p className={`${gameStyles.note} ${styles.hint}`}>Cần đồng thời: tự do về thân thể và không có đủ tư liệu sản xuất để tự tổ chức sản xuất.</p>}
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" disabled={!selectedId} onClick={confirmSelection}>
              XÁC NHẬN LỰA CHỌN
            </button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setShowHint((value) => !value)}>
              {showHint ? "ẨN GỢI Ý" : "XEM GỢI Ý"}
            </button>
          </div>
        </>
      )}

      {stage === "feedback" && evaluation && selected && (
        <>
          <h1 className={gameStyles.heading}>ĐIỀU TRA NHÂN VẬT</h1>
          <p className={gameStyles.lede}>Phản hồi sau khi lựa chọn nhân vật chưa đủ điều kiện trở thành người bán sức lao động.</p>
          <section className={`${gameStyles.panel} ${styles.feedbackPanel}`} aria-live="polite">
            <h2 className={`${gameStyles.sectionTitle} ${gameStyles.error}`}>LỰA CHỌN CHƯA PHÙ HỢP</h2>
            <p>Nhân vật đã chọn: <strong>{selected.title}</strong></p>
            <div className={gameStyles.twoColumns}>
              <ConditionCard index="I" title="TỰ DO VỀ THÂN THỂ" met={evaluation.firstConditionMet} description="Có quyền tự quyết định bán sức lao động." />
              <ConditionCard index="II" title="THIẾU TƯ LIỆU SẢN XUẤT" met={evaluation.secondConditionMet} description="Không có đủ tư liệu để tự tổ chức sản xuất." />
            </div>
            <p className={styles.explanation}>{evaluation.explanation}</p>
          </section>
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={() => { setSelectedId(null); setStage("select"); }}>CHỌN LẠI NHÂN VẬT</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => { setShowHint(true); setStage("select"); }}>XEM GỢI Ý</button>
          </div>
        </>
      )}

      {stage === "conditions" && evaluation && (
        <>
          <h1 className={gameStyles.heading}>ĐIỀU TRA SỨC LAO ĐỘNG</h1>
          <p className={gameStyles.lede}>Người lao động làm thuê đáp ứng đồng thời hai điều kiện.</p>
          <div className={gameStyles.twoColumns}>
            <ConditionCard index="I" title="TỰ DO VỀ THÂN THỂ" met description="Có quyền bán sức lao động và thỏa thuận việc làm." />
            <ConditionCard index="II" title="THIẾU TƯ LIỆU SẢN XUẤT" met description="Cần bán sức lao động để sinh sống." />
          </div>
          <p className={`${gameStyles.note} ${styles.conditionNote}`}>Giá trị sử dụng đặc biệt: khi được sử dụng, sức lao động có thể tạo ra giá trị mới lớn hơn giá trị của chính nó.</p>
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={() => setStage("properties")}>TÌM HIỂU HAI THUỘC TÍNH →</button>
          </div>
        </>
      )}

      {stage === "properties" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>VÌ SAO SỨC LAO ĐỘNG ĐẶC BIỆT?</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>So sánh hai thuộc tính của hàng hóa sức lao động.</p>
          <div className={gameStyles.twoColumns}>
            <section className={`${gameStyles.panel} ${styles.propertyCard}`}>
              <h2>GIÁ TRỊ CỦA SỨC LAO ĐỘNG</h2>
              <p>Giá trị những tư liệu cần thiết để sản xuất và tái sản xuất sức lao động, gồm:</p>
              <ol>{LABOR_POWER_VALUE_PARTS.map((part) => <li key={part}>{part}</li>)}</ol>
              <div className={styles.propertyIcon}>
                <Image src="/assets/figma/labor-value-icon.svg" alt="" width={96} height={96} />
                <span>v</span>
              </div>
            </section>
            <section className={`${gameStyles.panel} ${styles.propertyCard}`}>
              <h2>GIÁ TRỊ SỬ DỤNG</h2>
              <p>Khi sử dụng sức lao động, người lao động tạo giá trị mới lớn hơn giá trị sức lao động.</p>
              <p>Trong ca sợi: 15 USD bù đắp v, 15 USD còn lại là giá trị thặng dư m.</p>
              <div className={styles.propertyIcon}>
                <Image src="/assets/figma/labor-use-icon.svg" alt="" width={96} height={96} />
                <span>v + m</span>
              </div>
            </section>
          </div>
          <p className={`${gameStyles.note} ${styles.conditionNote}`}>TỪ ĐÂY: Vào nhà máy để theo dõi giá trị mới xuất hiện trong thời gian lao động.</p>
          <div className={gameStyles.buttonRow}>
            <Link className={gameStyles.button} href="/learn/chapter-3" onClick={() => emitChapterCompleted(2)}>ĐẾN NHÀ MÁY →</Link>
          </div>
        </>
      )}
    </GameShell>
  );
}

function ConditionCard({ index, title, met, description }: { index: string; title: string; met: boolean; description: string }) {
  return (
    <div className={`${gameStyles.panel} ${styles.conditionCard}`}>
      <div className={styles.conditionNumber}>{index}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <strong className={met ? gameStyles.success : gameStyles.error}>{met ? "✓ ĐẠT" : "× CHƯA ĐẠT"}</strong>
    </div>
  );
}

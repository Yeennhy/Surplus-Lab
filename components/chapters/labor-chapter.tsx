"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GameShell, gameStyles } from "./game-shell";
import { LABOR_POWER_VALUE_PARTS, LABOR_SCENARIOS, evaluateLaborScenario } from "@/features/labor";
import { emitChapterCompleted } from "@/features/progress/events";
import styles from "./labor-chapter.module.css";

type Stage = "select" | "feedback" | "conditions" | "properties";
const scenarioArt = {
  a: "/assets/labor-independent.svg",
  b: "/assets/labor-wage-worker.svg",
  c: "/assets/labor-unfree.svg",
} as const;

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
                <span className={styles.portraitFrame}>
                  <Image className={styles.personImage} src={scenarioArt[scenario.id]} alt="" width={240} height={190} />
                  <span className={styles.personNumber}>HỒ SƠ {scenario.id.toUpperCase()}</span>
                </span>
                <strong>{scenario.title}</strong>
                <span className={styles.personDescription}>{scenario.description}</span>
                <span className={styles.personAction}>{selectedId === scenario.id ? "✓ ĐÃ CHỌN ĐỂ ĐIỀU TRA" : "CHẠM ĐỂ ĐIỀU TRA →"}</span>
              </button>
            ))}
          </div>
          {showHint && <aside className={styles.hint} role="note"><span className={styles.bulbIcon} aria-hidden="true"><Image src="/assets/hint-lightbulb.svg" alt="" width={47} height={47} /></span><div><strong>MANH MỐI TỪ NGỌN ĐÈN</strong><p>Hãy kiểm tra <b>cả hai</b> ô: người đó có quyền tự quyết việc làm, và không có đủ tư liệu để tự sản xuất.</p></div></aside>}
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
            <div className={styles.feedbackPerson}><Image src={scenarioArt[selected.id]} alt="" width={100} height={80} /><p>Hồ sơ đang xét<br /><strong>{selected.title}</strong></p></div>
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
          <div className={styles.investigationHeader}><span className={styles.investigationSeal}>02/02</span><div><h1 className={gameStyles.heading}>ĐIỀU TRA SỨC LAO ĐỘNG</h1><p>Hai bằng chứng cùng xuất hiện ở người lao động làm thuê.</p></div></div>
          <div className={styles.investigationLead}><Image src={scenarioArt.b} alt="Người công nhân làm thuê" width={140} height={111} /><div><span>NHÂN VẬT ĐÃ XÁC MINH</span><strong>Người lao động làm thuê</strong><p>Tự do về thân thể nhưng thiếu tư liệu sản xuất: sức lao động có thể trở thành hàng hóa.</p></div></div>
          <div className={`${gameStyles.twoColumns} ${styles.conditionGrid}`}>
            <ConditionCard index="I" title="TỰ DO VỀ THÂN THỂ" met description="Có quyền bán sức lao động và thỏa thuận việc làm." />
            <ConditionCard index="II" title="THIẾU TƯ LIỆU SẢN XUẤT" met description="Cần bán sức lao động để sinh sống." />
          </div>
          <p className={styles.investigationConclusion}><span aria-hidden="true">✦</span><strong>KẾT LUẬN:</strong> Khi được sử dụng, sức lao động có thể tạo ra giá trị mới <b>lớn hơn giá trị của chính nó</b>.</p>
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={() => setStage("properties")}>TÌM HIỂU HAI THUỘC TÍNH →</button>
          </div>
        </>
      )}

      {stage === "properties" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>VÌ SAO SỨC LAO ĐỘNG ĐẶC BIỆT?</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Một hàng hóa, hai mặt cần phân biệt. Theo dõi dòng giá trị trong một ca kéo sợi.</p>
          <div className={`${gameStyles.twoColumns} ${styles.propertyGrid}`}>
            <section className={`${gameStyles.panel} ${styles.propertyCard} ${styles.propertyValue}`}>
              <div className={styles.propertyTop}><span className={styles.propertyIndex}>01 · GIÁ TRỊ</span><span className={styles.propertySymbol}>v</span></div>
              <h2>GIÁ TRỊ CỦA SỨC LAO ĐỘNG</h2>
              <p>Được quyết định bởi giá trị tư liệu cần thiết để <mark>duy trì và tái sản xuất</mark> sức lao động:</p>
              <ol>{LABOR_POWER_VALUE_PARTS.map((part) => <li key={part}>{part}</li>)}</ol>
              <div className={styles.propertyEquation}>Trong ca sợi <strong>v = 15 USD</strong></div>
            </section>
            <section className={`${gameStyles.panel} ${styles.propertyCard} ${styles.propertyUse}`}>
              <div className={styles.propertyTop}><span className={styles.propertyIndex}>02 · GIÁ TRỊ SỬ DỤNG</span><span className={styles.propertySymbol}>v + m</span></div>
              <h2>KHẢ NĂNG TẠO GIÁ TRỊ MỚI</h2>
              <p>Khi được sử dụng trong sản xuất, lao động tạo ra <mark>giá trị mới lớn hơn v</mark>.</p>
              <div className={styles.valueFlow}><span><small>4 GIỜ ĐẦU</small><b>15 USD</b><em>Bù đắp v</em></span><span aria-hidden="true">＋</span><span><small>4 GIỜ SAU</small><b>15 USD</b><em>Thặng dư m</em></span></div>
              <div className={styles.propertyEquation}>Giá trị mới <strong>v + m = 30 USD</strong></div>
            </section>
          </div>
          <p className={styles.propertyTakeaway}><span aria-hidden="true">✦</span><span><strong>ĐIỂM ĐẶC BIỆT</strong> Giá trị sử dụng của sức lao động là nguồn tạo ra giá trị mới; phần vượt quá v trở thành m.</span></p>
          <div className={gameStyles.buttonRow}>
            <Link className={`${gameStyles.button} ${styles.journeyButton}`} href="/learn/chapter-3" onClick={() => emitChapterCompleted(2)}><span className={styles.truckIcon} aria-hidden="true"><svg viewBox="0 0 54 32" fill="none"><path d="M3 7h29v19H3zM32 13h10l8 8v5H32z" fill="#e6bf78" stroke="#fff4d6" strokeWidth="2"/><path d="M36 15h5l5 5H36z" fill="#9fc4bc"/><circle cx="13" cy="27" r="4" fill="#443225" stroke="#fff4d6" strokeWidth="2"/><circle cx="41" cy="27" r="4" fill="#443225" stroke="#fff4d6" strokeWidth="2"/></svg></span>ĐẾN NHÀ MÁY <span aria-hidden="true">→</span></Link>
          </div>
        </>
      )}
    </GameShell>
  );
}

function ConditionCard({ index, title, met, description }: { index: string; title: string; met: boolean; description: string }) {
  return (
    <div className={`${gameStyles.panel} ${styles.conditionCard} ${met ? styles.conditionMet : styles.conditionMissing}`}>
      <div className={styles.conditionNumber}>{index === "I" ? "✦" : "▥"}</div>
      <span className={styles.conditionIndex}>ĐIỀU KIỆN {index}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <strong className={met ? gameStyles.success : gameStyles.error}>{met ? "✓ ĐẠT" : "× CHƯA ĐẠT"}</strong>
    </div>
  );
}

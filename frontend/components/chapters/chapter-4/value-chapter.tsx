"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type DragEvent } from "react";
import { GameShell, gameStyles } from "@/frontend/components/chapters/game-shell";
import { TEXTBOOK_FACTORY_CONFIG, getFactoryResult, getShiftLedger, type ShiftLedger } from "@/backend/domain/factory";
import { readChapterArtifacts, readChapterDraft, saveChapterDraft } from "@/backend/domain/progress/artifacts";
import { emitChapterCompleted } from "@/backend/domain/progress/events";
import { AUDIT_CLAIM_EVIDENCE, ITEM_EVIDENCE, VALUE_EVIDENCE, calculatePlacedLedger, evaluateAuditEvidence, evaluateProofChain, evaluateValueEvidence, evaluateValuePlacements, getValueItems, type AuditClaimId, type ProofStep, type ValueEvidenceId, type ValueGroup, type ValueItem, type ValueItemId, type ValuePlacements } from "@/backend/domain/value";
import styles from "./value-chapter.module.css";

type Stage = "evidence" | "theory" | "classify" | "feedback" | "ledger" | "verify" | "proof" | "success";
type ClaimId = AuditClaimId;
const result = getFactoryResult(TEXTBOOK_FACTORY_CONFIG);
const items = getValueItems(result);
const groups: Array<{ key: ValueGroup; title: string; detail: string }> = [
  { key: "c", title: "TƯ BẢN BẤT BIẾN", detail: "Giá trị cũ chuyển vào sản phẩm" },
  { key: "v", title: "TƯ BẢN KHẢ BIẾN", detail: "Tiền mua sức lao động" },
  { key: "m", title: "GIÁ TRỊ THẶNG DƯ", detail: "Phần giá trị mới dôi ra" },
];
const theoryInsights: Record<ValueGroup, { heading: string; description: string }> = {
  c: { heading: "Giá trị cũ được chuyển vào (c)", description: "Bông 100 USD và hao mòn máy 6 USD đã có giá trị trước ca; chúng chuyển 106 USD vào sợi." },
  v: { heading: "Giá trị sức lao động (v)", description: "15 USD ứng trước để mua sức lao động. Khi được sử dụng, lao động tạo ra giá trị mới." },
  m: { heading: "Phần giá trị mới dôi ra (m)", description: "Sau khi bù đắp v, lao động tiếp tục tạo 15 USD thặng dư. m không phải tư bản đã ứng trước." },
};
const ledgerClaims: Array<{ id: ClaimId; text: string; explanation: string }> = [
  { id: "machine", text: "Máy hao mòn 6 USD nên tự tạo thêm 6 USD giá trị mới.", explanation: "Hao mòn chỉ chuyển giá trị cũ. Dùng sổ máy để chứng minh." },
  { id: "wage", text: "Mẻ thứ hai phải trả thêm 15 USD cho cùng hợp đồng lao động.", explanation: "Hợp đồng có hiệu lực 8 giờ. Dùng hợp đồng làm chứng cứ." },
  { id: "advance", text: "121 USD tư bản ứng trước đã bao gồm 15 USD giá trị thặng dư.", explanation: "m xuất hiện sau mốc 4 giờ, không có trong hóa đơn ứng trước." },
];
const proofOptions: Array<{ id: ProofStep; text: string }> = [
  { id: "surplus-after-v", text: "15 USD bù v; 15 USD còn lại là m." },
  { id: "old-transfer", text: "Bông và máy chuyển 106 USD giá trị cũ vào sợi." },
  { id: "new-labor", text: "Lao động tạo 30 USD giá trị mới trong 8 giờ." },
];

export function ValueChapter() {
  const [stage, setStage] = useState<Stage>("evidence");
  const [shiftLedger, setShiftLedger] = useState<ShiftLedger>(() => getShiftLedger());
  const [sampleLedger, setSampleLedger] = useState(false);
  const [evidenceAnswers, setEvidenceAnswers] = useState<Partial<Record<ValueItemId, ValueEvidenceId>>>({});
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [auditEvidence, setAuditEvidence] = useState<Partial<Record<ClaimId, ValueEvidenceId>>>({});
  const [proof, setProof] = useState<ProofStep[]>([]);
  const [proofChecked, setProofChecked] = useState(false);
  const [advanceAnswer, setAdvanceAnswer] = useState<number | null>(null);
  const [productAnswer, setProductAnswer] = useState<number | null>(null);
  const [ledgerChecked, setLedgerChecked] = useState(false);
  const [reviewView, setReviewView] = useState<"batch" | "time" | "source">("batch");
  const [hydrated, setHydrated] = useState(false);
  const [placements, setPlacements] = useState<ValuePlacements>({});
  const [selectedItem, setSelectedItem] = useState<ValueItemId | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<ValueGroup | "pool" | null>(null);
  const [message, setMessage] = useState("");
  const [theoryFocus, setTheoryFocus] = useState<ValueGroup>("c");
  const [claimChecked, setClaimChecked] = useState(false);
  const [focusedEvidence, setFocusedEvidence] = useState<ValueEvidenceId>("batches");
  const evaluation = evaluateValuePlacements(items, placements);
  const availableItems = items.filter((item) => !placements[item.id]);
  const placedLedger = calculatePlacedLedger(items, placements);
  const evidenceResult = evaluateValueEvidence(evidenceAnswers);
  const auditResult = evaluateAuditEvidence(auditEvidence);

  useEffect(() => {
    const saved = readChapterArtifacts().ledger;
    if (saved?.batches?.length === 2 && saved.totals?.productValue === result.productValue) setShiftLedger(saved);
    else setSampleLedger(true);
    const draft = readChapterDraft<{
      stage: Stage; evidenceAnswers: Partial<Record<ValueItemId, ValueEvidenceId>>;
      placements: ValuePlacements; auditEvidence: Partial<Record<ClaimId, ValueEvidenceId>>;
      proof: ProofStep[]; advanceAnswer: number | null; productAnswer: number | null;
    }>(4);
    const stages: Stage[] = ["evidence", "theory", "classify", "feedback", "ledger", "verify", "proof", "success"];
    if (draft && stages.includes(draft.stage)) {
      setStage(draft.stage);
      if (draft.evidenceAnswers) setEvidenceAnswers(draft.evidenceAnswers);
      if (draft.placements) setPlacements(draft.placements);
      if (draft.auditEvidence) setAuditEvidence(draft.auditEvidence);
      if (Array.isArray(draft.proof)) setProof(draft.proof);
      if (typeof draft.advanceAnswer === "number") setAdvanceAnswer(draft.advanceAnswer);
      if (typeof draft.productAnswer === "number") setProductAnswer(draft.productAnswer);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveChapterDraft(4, { stage, evidenceAnswers, placements, auditEvidence, proof, advanceAnswer, productAnswer });
  }, [hydrated, stage, evidenceAnswers, placements, auditEvidence, proof, advanceAnswer, productAnswer]);

  function place(itemId: ValueItemId, group: ValueGroup) {
    setPlacements((current) => ({ ...current, [itemId]: group }));
    setSelectedItem(null);
    setMessage("");
  }

  function removePlacement(itemId: ValueItemId) {
    setPlacements((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    setSelectedItem(null);
    setMessage("");
  }

  function handleDrop(event: DragEvent<HTMLElement>, group: ValueGroup | "pool") {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain") as ValueItemId;
    setActiveDropZone(null);
    if (!items.some((item) => item.id === itemId)) return;
    if (group === "pool") removePlacement(itemId);
    else place(itemId, group);
  }

  function allowDrop(event: DragEvent<HTMLElement>, zone: ValueGroup | "pool") {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setActiveDropZone(zone);
  }

  function checkPlacements() {
    if (!evaluation.complete) {
      setMessage(`Còn ${evaluation.missingItems.length} thẻ chưa được phân loại.`);
      return;
    }
    if (!evaluation.correct) {
      setStage("feedback");
      return;
    }
    setStage("ledger");
  }

  function verifyClaims() {
    setClaimChecked(true);
    if (auditResult.correct) setStage("proof");
  }

  function finishProof() {
    setProofChecked(true);
    if (!evaluateProofChain(proof).correct) return;
    setStage("success");
    emitChapterCompleted(4);
  }

  function replayAudit() {
    setStage("evidence");
    setEvidenceAnswers({});
    setEvidenceChecked(false);
    setPlacements({});
    setSelectedItem(null);
    setAuditEvidence({});
    setClaimChecked(false);
    setProof([]);
    setProofChecked(false);
    setAdvanceAnswer(null);
    setProductAnswer(null);
    setLedgerChecked(false);
    setReviewView("batch");
  }

  function retryWrongItems() {
    setPlacements((current) => {
      const next = { ...current };
      for (const id of evaluation.wrongItems) delete next[id];
      return next;
    });
    setMessage("Chọn lại những thẻ chưa đúng. Các thẻ đúng được giữ nguyên.");
    setStage("classify");
  }

  return (
    <GameShell chapter={4}>
      {stage === "evidence" && (
        <>
          <h1 className={gameStyles.heading}>HỒ SƠ KIỂM TOÁN HAI MẺ SỢI</h1>
          <p className={gameStyles.lede}>Truy nguồn bốn khoản giá trị trước khi phân loại. Mỗi khoản cần một chứng cứ từ hợp đồng hoặc dây chuyền.</p>
          {sampleLedger && <p className={styles.sampleNote}>Bạn mở trực tiếp chương 4: đang dùng sổ mẫu của ca 8 giờ. Chơi chương 3 để mang sổ của mình sang.</p>}
          <div className={styles.batchEvidence}>
            {shiftLedger.batches.map((batch) => <article key={batch.number}><small>MẺ 0{batch.number} · {batch.fromHour}–{batch.toHour} GIỜ</small><Image src="/assets/resource-yarn.svg" alt="Cuộn sợi" width={105} height={90} /><strong>{batch.productValue} USD SỢI</strong><span>{batch.cotton} bông + {batch.depreciation} hao mòn + {batch.newValue} giá trị mới</span><b>{batch.number === 1 ? "m = 0" : "m = 15"}</b></article>)}
            <article className={styles.contractEvidence}><small>HỢP ĐỒNG CẢ CA</small><Image src="/assets/labor-wage-worker.svg" alt="Người lao động" width={105} height={90} /><strong>{shiftLedger.contract.laborPowerValue} USD / {shiftLedger.contract.hours} GIỜ</strong><span>Chỉ ứng trước một lần.</span></article>
          </div>
          <h2 className={gameStyles.sectionTitle}>GẮN CHỨNG CỨ CHO TỪNG KHOẢN</h2>
          <div className={styles.evidenceRows}>{items.map((item) => <div key={item.id} className={`${styles.evidenceRow} ${evidenceChecked && evidenceAnswers[item.id] !== ITEM_EVIDENCE[item.id] ? styles.evidenceWrong : ""}`}>
            <Image src={item.asset} alt="" width={70} height={60} /><div><strong>{item.label} · {item.amount} USD</strong><small>{evidenceChecked && evidenceAnswers[item.id] !== ITEM_EVIDENCE[item.id] ? item.explanation : "Khoản này xuất phát từ chứng cứ nào?"}</small></div>
            <select aria-label={`Chứng cứ cho ${item.label}`} value={evidenceAnswers[item.id] ?? ""} onChange={(event) => { setEvidenceAnswers((current) => ({ ...current, [item.id]: event.target.value as ValueEvidenceId })); setEvidenceChecked(false); }}><option value="">Chọn chứng cứ</option>{VALUE_EVIDENCE.map((evidence) => <option key={evidence.id} value={evidence.id}>{evidence.title}</option>)}</select>
          </div>)}</div>
          {evidenceChecked && !evidenceResult.correct && <p className={styles.sampleNote} role="status">Có {evidenceResult.wrong.length} khoản chưa gắn đúng nguồn. Giữ chứng cứ đúng và sửa các dòng được đánh dấu.</p>}
          <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" onClick={() => { setEvidenceChecked(true); if (evidenceResult.correct) setStage("classify"); }}>KIỂM TRA NGUỒN →</button><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("theory")}>XEM SỔ LÝ THUYẾT</button></div>
        </>
      )}
      {stage === "theory" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>TƯ BẢN BẤT BIẾN VÀ TƯ BẢN KHẢ BIẾN</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Theo dõi 121 USD ứng trước và xem bộ phận nào tạo ra giá trị mới.</p>
          <div className={`${gameStyles.twoColumns} ${styles.theoryGrid}`}>
            <section className={`${gameStyles.panel} ${styles.theoryCard} ${styles.theoryConstant}`}>
              <div className={styles.theoryCardTop}><span className={styles.theorySymbol}>c</span><span>GIÁ TRỊ CŨ · CHUYỂN VÀO SỢI</span></div>
              <h2>TƯ BẢN BẤT BIẾN</h2>
              <p>Bông nguyên liệu và hao mòn máy <mark>chuyển giá trị có sẵn</mark> vào sản phẩm. Bản thân tư liệu sản xuất không tạo giá trị mới.</p>
              <div className={styles.theoryDetail}><span>BÔNG <b>100 USD</b></span><span>＋</span><span>HAO MÒN MÁY <b>6 USD</b></span></div>
              <strong>c = {result.constantCapital} USD</strong>
            </section>
            <section className={`${gameStyles.panel} ${styles.theoryCard} ${styles.theoryVariable}`}>
              <div className={styles.theoryCardTop}><span className={styles.theorySymbol}>v</span><span>SỨC LAO ĐỘNG · TẠO GIÁ TRỊ MỚI</span></div>
              <h2>TƯ BẢN KHẢ BIẾN</h2>
              <p>15 USD mua sức lao động. Trong 8 giờ, lao động tạo <mark>30 USD giá trị mới</mark>: 15 USD bù v và 15 USD thành m.</p>
              <div className={styles.theoryDetail}><span>BÙ ĐẮP v <b>15 USD</b></span><span>＋</span><span>THẶNG DƯ m <b>15 USD</b></span></div>
              <strong>v = {result.variableCapital} USD</strong>
            </section>
          </div>
          <div className={styles.formulaWorkbench}><div className={styles.formulaWorkbenchHeader}><span>CHẠM VÀO TỪNG PHẦN ĐỂ ĐỌC DÒNG GIÁ TRỊ</span><strong>G = c + (v + m)</strong></div><div className={styles.formulaParts}><button type="button" aria-pressed={theoryFocus === "c"} onClick={() => setTheoryFocus("c")}><small>GIÁ TRỊ CŨ (c)</small><b>c = {result.constantCapital} USD</b></button><span aria-hidden="true">＋</span><button type="button" aria-pressed={theoryFocus === "v"} onClick={() => setTheoryFocus("v")}><small>BÙ ĐẮP LAO ĐỘNG (v)</small><b>v = {result.variableCapital} USD</b></button><span aria-hidden="true">＋</span><button type="button" aria-pressed={theoryFocus === "m"} onClick={() => setTheoryFocus("m")}><small>PHẦN DÔI RA (m)</small><b>m = {result.surplusValue} USD</b></button></div><div className={styles.formulaInsight} aria-live="polite"><span aria-hidden="true">✦</span><div><strong>{theoryInsights[theoryFocus].heading}</strong><p>{theoryInsights[theoryFocus].description}</p></div></div></div>
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={() => setStage(evidenceResult.correct ? "classify" : "evidence")}>← TRỞ LẠI HỒ SƠ KIỂM TOÁN</button>
          </div>
          <p className={`${gameStyles.note} ${styles.formulaNote}`}>GIÁ TRỊ SẢN PHẨM G = c + (v + m) = {result.constantCapital} + ({result.variableCapital} + {result.surplusValue}) = {result.productValue} USD.</p>
        </>
      )}

      {stage === "ledger" && (
        <>
          <h1 className={gameStyles.heading}>CÂN HAI CUỐN SỔ GIÁ TRỊ</h1>
          <p className={gameStyles.lede}>Bạn đã phân nguồn. Dùng c, v, m vừa xếp để xác định vốn ứng trước và giá trị của hai cuộn sợi. Hai tổng này khác nhau vì m chỉ xuất hiện trong sản xuất.</p>
          <div className={styles.ledgerScale} aria-hidden="true"><span>CÁI ĐÃ ỨNG TRƯỚC</span><div><i style={{width:`${placedLedger.c / placedLedger.productValue * 100}%`}}/><i style={{width:`${placedLedger.v / placedLedger.productValue * 100}%`}}/><i style={{width:`${placedLedger.m / placedLedger.productValue * 100}%`}}/></div><span>GIÁ TRỊ SỢI SAU CA</span></div>
          <div className={styles.ledgerBoard}>
            <section><small>SỔ NGUỒN ĐÃ PHÂN</small><h2>c {placedLedger.c} + v {placedLedger.v} + m {placedLedger.m}</h2><p>Giá trị cũ {placedLedger.c} USD được chuyển vào sợi; lao động tạo {placedLedger.v + placedLedger.m} USD mới.</p><button type="button" onClick={() => setStage("classify")}>↩ SỬA PHÂN LOẠI</button></section>
            <section><small>VỐN ỨNG TRƯỚC · c + v</small><h2>{advanceAnswer === null ? "?" : `${advanceAnswer} USD`}</h2><div>{[106, 121, 136].map((value) => <button key={value} type="button" aria-pressed={advanceAnswer === value} onClick={() => { setAdvanceAnswer(value); setLedgerChecked(false); }}>{value} USD</button>)}</div><p>Không cộng m vào khoản đã chi trước ca.</p></section>
            <section><small>GIÁ TRỊ SỢI · c + v + m</small><h2>{productAnswer === null ? "?" : `${productAnswer} USD`}</h2><div>{[121, 136, 151].map((value) => <button key={value} type="button" aria-pressed={productAnswer === value} onClick={() => { setProductAnswer(value); setLedgerChecked(false); }}>{value} USD</button>)}</div><p>Hai cuộn sợi của hai mẻ, mỗi cuộn 68 USD.</p></section>
          </div>
          {ledgerChecked && <p className={styles.ledgerFeedback} role="status">{advanceAnswer !== shiftLedger.totals.capitalAdvanced ? "Sổ ứng trước chỉ có c + v; m chưa có trước khi sản xuất. " : "Sổ ứng trước đã đúng. "}{productAnswer !== shiftLedger.totals.productValue ? "Giá trị sợi bằng c + toàn bộ giá trị mới (v + m)." : "Giá trị sợi đã đúng."}</p>}
          <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" onClick={() => { setLedgerChecked(true); if (advanceAnswer === placedLedger.capitalAdvanced && productAnswer === placedLedger.productValue && evaluation.correct) setStage("verify"); }}>CHỐT SỔ VÀ KIỂM TOÁN →</button></div>
        </>
      )}

      {stage === "classify" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>PHÂN LOẠI GIÁ TRỊ HÀNG HÓA</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Kéo thẻ sang đúng vai trò trong G = c + (v + m), hoặc chọn thẻ rồi chọn vùng bằng bàn phím.</p>
          <div
            className={`${styles.itemPool} ${activeDropZone === "pool" ? styles.dropActive : ""}`}
            data-value-pool
            onDragOver={(event) => allowDrop(event, "pool")}
            onDragLeave={() => setActiveDropZone(null)}
            onDrop={(event) => handleDrop(event, "pool")}
            aria-label="Các thẻ chưa phân loại; kéo thẻ về đây để bỏ lựa chọn"
          >
            {availableItems.length > 0 ? (
              <div className={gameStyles.fourColumns}>
                {availableItems.map((item) => (
                  <ValueCard key={item.id} item={item} selected={selectedItem === item.id} onSelect={setSelectedItem} onDragStart={() => {}} onDragEnd={() => setActiveDropZone(null)} />
                ))}
              </div>
            ) : <p className={styles.emptyPool}>Tất cả thẻ đã được kéo vào khu vực phân loại. Có thể kéo thẻ trở lại đây để đổi lựa chọn.</p>}
          </div>
          {selectedItem && placements[selectedItem] && <button className={styles.returnButton} type="button" onClick={() => removePlacement(selectedItem)}>↩ ĐƯA THẺ ĐÃ CHỌN VỀ HÀNG TRÊN</button>}
          <h2 className={`${gameStyles.sectionTitle} ${styles.zoneTitle}`}>KHU VỰC PHÂN LOẠI</h2>
          <div className={styles.zoneGrid}>
            {groups.map((group) => {
              const placedItems = items.filter((item) => placements[item.id] === group.key);
              const placedValue = placedItems.reduce((total, item) => total + item.amount, 0);
              return (
                <div
                  key={group.key}
                  className={`${styles.zone} ${styles[`zone${group.key.toUpperCase()}`]} ${activeDropZone === group.key ? styles.dropActive : ""}`}
                  onDragOver={(event) => allowDrop(event, group.key)}
                  onDragLeave={() => setActiveDropZone(null)}
                  onDrop={(event) => handleDrop(event, group.key)}
                  data-value-group={group.key}
                  role="group"
                  aria-label={`${group.key} — ${group.title}`}
                >
                  <div className={styles.zoneHeader}><span className={styles.zoneSymbol}>{group.key}</span><div><small>KHU VỰC {group.key.toUpperCase()}</small><strong>{group.title}</strong><span>{group.detail}</span></div></div>
                  <div className={styles.zoneSummary}><span>{placedItems.length} THẺ ĐÃ ĐẶT</span><b>{placedValue} USD</b></div>
                  <div className={styles.placedCards}>
                    {placedItems.map((item) => (
                      <ValueCard key={item.id} item={item} compact selected={selectedItem === item.id} onSelect={setSelectedItem} onDragStart={() => {}} onDragEnd={() => setActiveDropZone(null)} />
                    ))}
                  </div>
                  <button
                    className={styles.zoneTarget}
                    type="button"
                    onClick={() => selectedItem && place(selectedItem, group.key)}
                    aria-label={`${group.key} — ${group.title}; ${selectedItem ? `đặt ${items.find((item) => item.id === selectedItem)?.label}` : "chọn thẻ trước"}`}
                  >
                    {selectedItem ? `＋ ĐẶT THẺ VÀO ${group.key.toUpperCase()}` : `＋ THẢ THẺ VÀO VÙNG ${group.key.toUpperCase()}`}
                  </button>
                </div>
              );
            })}
          </div>
          {message && <p className={`${gameStyles.note} ${styles.message}`} role="status">{message}</p>}
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={checkPlacements}>KIỂM TRA PHÂN LOẠI →</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => { setPlacements({}); setSelectedItem(null); setMessage(""); }}>ĐẶT LẠI THẺ</button>
          </div>
        </>
      )}

      {stage === "feedback" && (
        <>
          <h1 className={gameStyles.heading}>KIỂM TRA KẾT QUẢ PHÂN LOẠI</h1>
          <p className={gameStyles.lede}>Phản hồi khi vật phẩm được đặt vào nhóm chưa phù hợp.</p>
          <section className={`${gameStyles.panel} ${styles.feedbackPanel}`} aria-live="polite">
            <h2 className={`${gameStyles.sectionTitle} ${gameStyles.error}`}>CẦN KIỂM TRA LẠI</h2>
            <p>Một số thẻ đã đặt nhầm. Bạn có thể thử lại mà không mất các thẻ đúng.</p>
            {evaluation.wrongItems.map((id) => {
              const item = items.find((entry) => entry.id === id);
              if (!item) return null;
              return <div className={styles.wrongItem} key={id}><strong>{item.label} · đã chọn {placements[id]?.toUpperCase()}</strong><p>{item.explanation}</p></div>;
            })}
          </section>
          <div className={gameStyles.buttonRow}>
            <button className={gameStyles.button} type="button" onClick={retryWrongItems}>THỬ LẠI</button>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setStage("theory")}>XEM LÝ THUYẾT</button>
          </div>
        </>
      )}

      {stage === "verify" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>KIỂM TOÁN BÁO CÁO NHÀ MÁY</h1>
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Ba dòng trong báo cáo đều chứa sai lầm. Chọn chứng cứ có thể bác bỏ từng dòng; chỉ đánh dấu “Sai” sẽ không đủ để ký kiểm toán.</p>
          <div className={styles.verifyHeader}><span aria-hidden="true">▤</span><div><small>HỒ SƠ CA SẢN XUẤT · {Object.values(auditEvidence).filter(Boolean).length}/3 CHỨNG CỨ ĐÃ GẮN</small><strong>{shiftLedger.totals.capitalAdvanced} USD ứng trước → {shiftLedger.totals.productValue} USD giá trị sợi</strong><p>Chứng cứ phải đến từ chính hợp đồng, phiếu mẻ hoặc quá trình lao động.</p></div></div>
          <div className={styles.claimGrid}>
            {ledgerClaims.map((claim, index) => {
              const wrong = claimChecked && auditEvidence[claim.id] !== AUDIT_CLAIM_EVIDENCE[claim.id];
              return <section className={`${styles.claimCard} ${wrong ? styles.claimWrong : ""} ${auditEvidence[claim.id] ? styles.claimHasEvidence : ""}`} key={claim.id} data-claim-id={claim.id}><small>DÒNG BÁO CÁO 0{index + 1}</small><h2>{claim.text}</h2><label className={styles.auditSelect}>GẮN CHỨNG CỨ PHẢN BIỆN<select value={auditEvidence[claim.id] ?? ""} onChange={(event) => { setAuditEvidence((current) => ({ ...current, [claim.id]: event.target.value as ValueEvidenceId })); setClaimChecked(false); }}><option value="">Chọn chứng cứ</option>{VALUE_EVIDENCE.map((evidence) => <option key={evidence.id} value={evidence.id}>{evidence.title}</option>)}</select></label>{wrong && <p role="status">{claim.explanation}</p>}</section>;
            })}
          </div>
          <section className={styles.auditEvidenceDesk}><div><small>NGĂN CHỨNG TỪ · MỞ TỪNG TÀI LIỆU ĐỂ ĐỐI CHIẾU</small><div role="group" aria-label="Ngăn chứng từ">{VALUE_EVIDENCE.map((evidence,index)=><button key={evidence.id} type="button" aria-pressed={focusedEvidence===evidence.id} onClick={()=>setFocusedEvidence(evidence.id)}><span>0{index+1}</span>{evidence.title}</button>)}</div></div><p aria-live="polite"><strong>{VALUE_EVIDENCE.find((evidence)=>evidence.id===focusedEvidence)?.title}</strong>{VALUE_EVIDENCE.find((evidence)=>evidence.id===focusedEvidence)?.detail}</p></section>
          <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" onClick={verifyClaims}>KIỂM TRA CHỨNG CỨ →</button></div>
        </>
      )}

      {stage === "proof" && (
        <>
          <h1 className={gameStyles.heading}>BẢO VỆ KẾT LUẬN CUỐI CA</h1>
          <p className={gameStyles.lede}>Đặt ba mắt xích lập luận theo đúng thứ tự để giải thích 136 USD của hai cuộn sợi. Chọn từng câu bên dưới; nhấn câu đã đặt để đưa về bàn.</p>
          <div className={styles.proofProgress}><span>CHUỖI LẬP LUẬN · {proof.length}/3 MẮT XÍCH</span><div><i style={{width:`${proof.length/3*100}%`}}/></div></div>
          <div className={styles.proofDesk}>
            <section><small>BA MẮT XÍCH · LẬP LUẬN CỦA BẠN</small><ol>{proof.map((step) => <li key={step}><button type="button" onClick={() => { setProof((current) => current.filter((entry) => entry !== step)); setProofChecked(false); }}>{proofOptions.find((option) => option.id === step)?.text} ↩</button></li>)}{Array.from({length:3-proof.length},(_,index)=><li className={styles.proofEmpty} key={`empty-${index}`}>MẮT XÍCH {proof.length+index+1} · CHỜ CHỨNG CỨ</li>)}</ol></section>
            <section><small>CHỨNG CỨ CẦN SẮP</small>{proofOptions.filter((option) => !proof.includes(option.id)).map((option) => <button key={option.id} type="button" onClick={() => { setProof((current) => [...current, option.id]); setProofChecked(false); }}>＋ {option.text}</button>)}</section>
          </div>
          {proofChecked && !evaluateProofChain(proof).correct && <p className={styles.ledgerFeedback} role="status">Chuỗi chưa đúng. Hãy bắt đầu từ cũ chuyển vào, sau đó xác định giá trị mới, cuối cùng mới tách v và m.</p>}
          <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" disabled={proof.length !== 3} onClick={finishProof}>KÝ BÁO CÁO GIÁ TRỊ →</button><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => { setProof([]); setProofChecked(false); }}>SẮP LẠI</button></div>
        </>
      )}

      {stage === "success" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>MẬT MÃ GIÁ TRỊ ĐÃ ĐƯỢC GIẢI</h1>
          <div className={styles.successPanel}>
            <span className={styles.successMedal} aria-hidden="true">✦</span>
            <p>✓ ĐÃ TRUY NGUỒN, CÂN SỔ VÀ BẢO VỆ KẾT LUẬN</p>
            <h2>G = c + (v + m)</h2>
            <div className={styles.successEquation}><span><small>GIÁ TRỊ SẢN PHẨM</small><b>{result.productValue} USD</b></span><span aria-hidden="true">=</span><span><small>GIÁ TRỊ CŨ</small><b>{result.constantCapital}</b></span><span aria-hidden="true">＋</span><span><small>GIÁ TRỊ MỚI</small><b>{result.variableCapital} + {result.surplusValue}</b></span></div>
            <div className={styles.valueBar} aria-label={`c ${result.constantCapital} USD, v ${result.variableCapital} USD, m ${result.surplusValue} USD`}><span style={{ width: `${result.constantCapital / result.productValue * 100}%` }}>c</span><span style={{ width: `${result.variableCapital / result.productValue * 100}%` }}>v</span><span style={{ width: `${result.surplusValue / result.productValue * 100}%` }}>m</span></div>
          </div>
          <div className={gameStyles.cardGrid}>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><span className={styles.successCardIcon}>◈</span><small>GIÁ TRỊ CŨ CHUYỂN VÀO</small><strong>c = {result.constantCapital} USD</strong><span>Bông + hao mòn máy</span></div>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><span className={styles.successCardIcon}>✧</span><small>GIÁ TRỊ SỨC LAO ĐỘNG</small><strong>v = {result.variableCapital} USD</strong><span>Bốn giờ đầu bù đắp v</span></div>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><span className={styles.successCardIcon}>✦</span><small>GIÁ TRỊ THẶNG DƯ MỚI</small><strong>m = {result.surplusValue} USD</strong><span>Bốn giờ sau tạo ra m</span></div>
          </div>
          <section className={styles.reviewPanel}>
            <div className={styles.reviewTabs} role="group" aria-label="Góc nhìn báo cáo giá trị"><button type="button" aria-pressed={reviewView === "batch"} onClick={() => setReviewView("batch")}>THEO MẺ</button><button type="button" aria-pressed={reviewView === "time"} onClick={() => setReviewView("time")}>THEO THỜI GIAN</button><button type="button" aria-pressed={reviewView === "source"} onClick={() => setReviewView("source")}>THEO NGUỒN</button></div>
            {reviewView === "batch" && <div className={styles.reviewCards}>{shiftLedger.batches.map((batch) => <article key={batch.number}><small>MẺ 0{batch.number} · {batch.fromHour}–{batch.toHour} GIỜ</small><strong>{batch.productValue} USD sợi</strong><p>{batch.cotton} bông + {batch.depreciation} hao mòn + {batch.newValue} mới.</p></article>)}</div>}
            {reviewView === "time" && <div className={styles.reviewCards}><article><small>SAU 4 GIỜ</small><strong>m = 0 USD</strong><p>15 USD mới vừa bù giá trị sức lao động.</p></article><article><small>SAU 8 GIỜ</small><strong>m = 15 USD</strong><p>15 USD mới tiếp theo vượt quá v.</p></article></div>}
            {reviewView === "source" && <div className={styles.reviewCards}><article><small>GIÁ TRỊ CŨ</small><strong>c = {shiftLedger.totals.c} USD</strong><p>Bông và hao mòn máy chuyển vào sợi.</p></article><article><small>GIÁ TRỊ MỚI</small><strong>v + m = {shiftLedger.totals.v + shiftLedger.totals.m} USD</strong><p>Lao động tạo ra trong toàn ca.</p></article></div>}
          </section>
          <details className={styles.successTakeaway} open><summary><span className={styles.takeawayIcon} aria-hidden="true">✦</span><span><small>GHI NHỚ SAU KHI GIẢI MẬT MÃ</small><strong>GIÁ TRỊ THẶNG DƯ ĐẾN TỪ ĐÂU?</strong></span><span aria-hidden="true">⌄</span></summary><div className={styles.takeawayBody}><div><small>LAO ĐỘNG TẠO MỚI</small><b>30 USD</b></div><span aria-hidden="true">−</span><div><small>BÙ ĐẮP v</small><b>15 USD</b></div><span aria-hidden="true">=</span><div><small>GIÁ TRỊ THẶNG DƯ m</small><b>15 USD</b></div></div><p>m là phần giá trị mới do lao động thặng dư tạo ra. Nó <b>không nằm trong 121 USD tư bản ứng trước</b>.</p></details>
          <div className={gameStyles.buttonRow}>
            <button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={replayAudit}>↺ KIỂM TOÁN LẠI</button>
            <Link className={gameStyles.button} href="/">VỀ BẢN ĐỒ · MỞ THỬ THÁCH CUỐI →</Link>
          </div>
        </>
      )}
    </GameShell>
  );
}

function ValueCard({ item, compact = false, selected, onSelect, onDragStart, onDragEnd }: {
  item: ValueItem;
  compact?: boolean;
  selected: boolean;
  onSelect: (id: ValueItemId) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <button
      data-value-item={item.id}
      type="button"
      draggable
      onDragStart={(event) => {
        onDragStart();
        event.dataTransfer.setData("text/plain", item.id);
        event.dataTransfer.effectAllowed = "move";
        const icon = event.currentTarget.querySelector("img");
        if (icon) event.dataTransfer.setDragImage(icon, 60, 48);
      }}
      onDragEnd={onDragEnd}
      aria-pressed={selected}
      className={`${gameStyles.cardButton} ${styles.itemCard} ${compact ? styles.placedCard : ""} ${selected ? gameStyles.selected : ""}`}
      onClick={() => onSelect(item.id)}
    >
      <span className={styles.itemIcon}><Image src={item.asset} alt="" width={150} height={108} /></span>
      <span className={styles.cardText}><strong>{item.amount} USD</strong><small>{item.label.toUpperCase()}</small></span>
    </button>
  );
}

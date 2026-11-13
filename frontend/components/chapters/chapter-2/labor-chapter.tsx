"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GameShell, gameStyles } from "@/frontend/components/chapters/game-shell";
import {
  LABOR_SCENARIOS, LABOR_VALUE_PIECES, evaluateEvidenceGrid, evaluateLaborScenario, evaluateLaborValueFile,
  type EvidenceGrid, type LaborCondition, type LaborScenario, type LaborValuePiece,
} from "@/backend/domain/labor";
import { readChapterDraft, saveChapterArtifacts, saveChapterDraft } from "@/backend/domain/progress/artifacts";
import { emitChapterCompleted } from "@/backend/domain/progress/events";
import styles from "./labor-game.module.css";

type Stage = "investigate" | "value" | "contract" | "complete";
type CandidateId = LaborScenario["id"];
const art: Record<CandidateId, string> = {
  a: "/assets/labor-independent.svg", b: "/assets/labor-wage-worker.svg", c: "/assets/labor-unfree.svg",
};
const stories: Record<CandidateId, { intro: string; freedom: string; means: string }> = {
  a: { intro: "Một người đang tự tổ chức việc sản xuất của mình.", freedom: "Tự quyết định nhận hay không nhận việc làm thuê.", means: "Có xưởng và công cụ đủ để tự sản xuất." },
  b: { intro: "Một người muốn nhận công việc trong xưởng sợi.", freedom: "Có quyền tự ký hợp đồng bán sức lao động.", means: "Không có đủ tư liệu để tự tổ chức sản xuất." },
  c: { intro: "Một người đang bị ràng buộc quyền quyết định việc làm.", freedom: "Không được tự mình quyết định bán sức lao động.", means: "Không có tư liệu sản xuất cần thiết." },
};
const conditions: Array<{ id: LaborCondition; short: string; description: string }> = [
  { id: "freeToSellLabor", short: "TỰ DO", description: "Có quyền tự bán sức lao động?" },
  { id: "lacksProductionMeans", short: "THIẾU TƯ LIỆU", description: "Không đủ tư liệu tự sản xuất?" },
];
const conditionLabels: Record<LaborCondition, string> = {
  freeToSellLabor: "Tự do?",
  lacksProductionMeans: "Thiếu tư liệu?",
};

const CONFETTI_COLORS = ["#e6bf78", "#4b7956", "#a45a3f", "#9fc4bc", "#d3a14e", "#8e3f35", "#f7e8c3", "#3d6653"];

function ConfettiEffect() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 97}%`,
    delay: `${(i % 8) * 0.18}s`,
    duration: `${1.5 + (i % 5) * 0.35}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 5 + i % 6,
  }));
  return <div className={styles.confettiContainer}>{particles.map(p => (
    <div key={p.id} className={styles.confetti} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, backgroundColor: p.color, width: p.size, height: p.size }} />
  ))}</div>;
}

export function LaborChapter() {
  const [stage, setStage] = useState<Stage>("investigate");
  const [active, setActive] = useState<CandidateId>("a");
  const [inspected, setInspected] = useState<CandidateId[]>([]);
  const [grid, setGrid] = useState<EvidenceGrid>({});
  const [nominee, setNominee] = useState<CandidateId | null>(null);
  const [gridChecked, setGridChecked] = useState(false);
  const [pieces, setPieces] = useState<LaborValuePiece[]>([]);
  const [valueSpread, setValueSpread] = useState(false);
  const [valueChecked, setValueChecked] = useState(false);
  const [clause, setClause] = useState<"shift" | "half" | "product" | null>(null);
  const [prediction, setPrediction] = useState<"factory" | "contract" | null>(null);
  const [contractChecked, setContractChecked] = useState(false);
  const [hints, setHints] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const gridResult = evaluateEvidenceGrid(grid);
  const valueResult = evaluateLaborValueFile(pieces);

  useEffect(() => {
    const saved = readChapterDraft<{ stage: Stage; active: CandidateId; inspected: CandidateId[]; grid: EvidenceGrid; nominee: CandidateId | null; pieces: LaborValuePiece[]; clause: typeof clause; prediction: typeof prediction; hints: number }>(2);
    if (saved && ["investigate", "value", "contract", "complete"].includes(saved.stage)) {
      setStage(saved.stage);
      if (["a", "b", "c"].includes(saved.active)) setActive(saved.active);
      if (Array.isArray(saved.inspected)) setInspected(saved.inspected);
      if (saved.grid && typeof saved.grid === "object") setGrid(saved.grid);
      if (saved.nominee && ["a", "b", "c"].includes(saved.nominee)) setNominee(saved.nominee);
      if (Array.isArray(saved.pieces)) { setPieces(saved.pieces); if (saved.pieces.length) setValueSpread(true); }
      setClause(saved.clause ?? null);
      setPrediction(saved.prediction ?? null);
      if (Number.isInteger(saved.hints)) setHints(saved.hints);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveChapterDraft(2, { stage, active, inspected, grid, nominee, pieces, clause, prediction, hints });
  }, [hydrated, stage, active, inspected, grid, nominee, pieces, clause, prediction, hints]);

  function playLaborClick() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 750;
      gain.gain.value = 0.025;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
      void ctx.resume();
    } catch {}
  }

  function playLaborSuccess() {
    try {
      const ctx = new AudioContext();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.value = 0.03;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + i * 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + 0.35 + i * 0.08);
      });
      void ctx.resume();
    } catch {}
  }

  function inspect(id: CandidateId) {
    playLaborClick();
    setActive(id);
    setInspected((current) => current.includes(id) ? current : [...current, id]);
  }

  function answer(id: CandidateId, condition: LaborCondition, value: boolean) {
    playLaborClick();
    setActive(id);
    setInspected((current) => current.includes(id) ? current : [...current, id]);
    setGrid((current) => ({ ...current, [id]: { ...current[id], [condition]: value } }));
    setGridChecked(false);
  }

  function checkGrid() {
    setGridChecked(true);
    const candidate = LABOR_SCENARIOS.find((person) => person.id === nominee);
    if (gridResult.correct && candidate && evaluateLaborScenario(candidate).qualifies) {
      playLaborSuccess();
      setStage("value");
    }
  }

  function explainCondition(person: LaborScenario, condition: LaborCondition): string {
    if (condition === "freeToSellLabor") return person.freeToSellLabor
      ? `${person.title}: người này có quyền tự quyết định bán sức lao động của mình, nên đạt điều kiện tự do về thân thể.`
      : `${person.title}: người này không được tự quyết định bán sức lao động, nên chưa đạt điều kiện tự do về thân thể.`;
    return person.lacksProductionMeans
      ? `${person.title}: người này không có đủ tư liệu để tự tổ chức sản xuất, nên cần bán sức lao động.`
      : `${person.title}: người này có đủ xưởng và công cụ để tự sản xuất, nên chưa thuộc trường hợp phải bán sức lao động vì thiếu tư liệu.`;
  }

  function togglePiece(id: LaborValuePiece) {
    playLaborClick();
    setPieces((current) => current.includes(id) ? current.filter((piece) => piece !== id) : [...current, id]);
    setValueChecked(false);
  }

  function signContract() {
    setContractChecked(true);
    if (clause !== "shift" || prediction !== "factory") return;
    playLaborSuccess();
    saveChapterArtifacts({ contract: { workerId: "b", value: 15, hours: 8 } });
    emitChapterCompleted(2);
    setStage("complete");
  }

  function replayInvestigation() {
    setStage("investigate");
    setActive("a");
    setInspected([]);
    setGrid({});
    setNominee(null);
    setGridChecked(false);
    setPieces([]);
    setValueSpread(false);
    setValueChecked(false);
    setClause(null);
    setPrediction(null);
    setContractChecked(false);
    setHints(0);
  }

  function isConditionWrong(personId: CandidateId, conditionId: LaborCondition): boolean {
    if (!gridChecked) return false;
    const choice = grid[personId]?.[conditionId];
    const person = LABOR_SCENARIOS.find(p => p.id === personId);
    return choice !== undefined && person !== undefined && choice !== person[conditionId];
  }

  const pieceIcons: Record<LaborValuePiece, string> = {
    living: "/assets/labor-living.svg", training: "/assets/labor-training.svg", children: "/assets/labor-family.svg", cotton: "/assets/resource-cotton.svg", machine: "/assets/resource-spinning-machine.svg",
  };

  return <GameShell chapter={2}>
    <div className={styles.questBar}><span><span className={styles.questBarIcon} aria-hidden="true">✨</span>HỒ SƠ 01 · NGƯỜI LAO ĐỘNG</span><span>{stage === "investigate" ? "01 / 03 · ĐIỀU TRA" : stage === "value" ? "02 / 03 · GIÁ TRỊ" : stage === "contract" ? "03 / 03 · HỢP ĐỒNG" : "✅ ĐÃ KÝ HỢP ĐỒNG"}</span></div>

    {stage === "investigate" && <>
      <h1 className={gameStyles.heading}>AI CÓ THỂ BÁN SỨC LAO ĐỘNG?</h1>
      <p className={gameStyles.lede}>Mở cả ba hồ sơ, kiểm chứng hai điều kiện cho từng người rồi nộp kết luận. Một điều kiện đúng vẫn chưa đủ.</p>
      <div className={styles.investigateBrief}><span className={styles.briefNumber}>02</span><div><strong>HAI ĐIỀU KIỆN PHẢI CÙNG XUẤT HIỆN</strong><p>Người lao động tự quyết định bán sức lao động và không đủ tư liệu để tự sản xuất. Đọc chứng cứ rồi đánh dấu từng hồ sơ.</p></div><span className={styles.briefProgress}>{Object.values(grid).reduce((count, row) => count + Number(row?.freeToSellLabor !== undefined) + Number(row?.lacksProductionMeans !== undefined), 0)} / 6 Ô ĐÃ ĐÁNH GIÁ</span></div>
      <div className={styles.dossierLayout}>
        <div className={styles.candidateList}>
          {LABOR_SCENARIOS.map((person) => (
            <div
              key={person.id}
              className={`${styles.candidateCard} ${active === person.id ? styles.candidateActive : ""}`}
            >
              <button type="button" className={styles.candidateMain} onClick={() => inspect(person.id)} aria-label={`Mở hồ sơ ${person.title}`}>
                <Image src={art[person.id]} alt={`Minh họa ${person.title.toLowerCase()}`} width={120} height={95} className={styles.candidateThumb} />
                <div className={styles.candidateBio}>
                  <small>HỒ SƠ {person.id.toUpperCase()}</small>
                  <strong>{person.title}</strong>
                  <em>{stories[person.id].intro}</em>
                </div>
              </button>
              <div className={styles.candidateInlineConditions}>
                {conditions.map((condition) => {
                  const choice = grid[person.id]?.[condition.id];
                  const wrong = isConditionWrong(person.id, condition.id);
                  return (
                    <div className={styles.conditionRow} key={condition.id}>
                      <span className={styles.conditionLabel}>{conditionLabels[condition.id]}</span>
                      <div className={styles.conditionButtons}>
                        <button
                          type="button"
                          aria-pressed={choice === true}
                          className={wrong && choice === true ? styles.wrongAnswer : ""}
                          onClick={(e) => { e.stopPropagation(); answer(person.id, condition.id, true); }}
                        >
                          {choice === true ? "✓ " : ""}ĐẠT
                        </button>
                        <button
                          type="button"
                          aria-pressed={choice === false}
                          className={wrong && choice === false ? styles.wrongAnswer : ""}
                          onClick={(e) => { e.stopPropagation(); answer(person.id, condition.id, false); }}
                        >
                          {choice === false ? "✗ " : ""}CHƯA ĐẠT
                        </button>
                      </div>
                      {wrong && <small className={styles.wrongHint}>{condition.id === "freeToSellLabor" ? stories[person.id].freedom : stories[person.id].means}</small>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <section className={styles.evidenceDesk} aria-live="polite">
          <span className={styles.seal}>✦ CHỨNG CỨ HỒ SƠ {active.toUpperCase()}</span>
          <h2>{LABOR_SCENARIOS.find((person) => person.id === active)?.title}</h2>
          <div className={styles.evidenceCards}>
            <div><small><span className={styles.evidenceIcon} aria-hidden="true">01</span>QUYỀN QUYẾT ĐỊNH</small><p>{stories[active].freedom}</p></div>
            <div><small><span className={styles.evidenceIcon} aria-hidden="true">02</span>TƯ LIỆU SẢN XUẤT</small><p>{stories[active].means}</p></div>
          </div>
          <p className={styles.evidenceNote}>Đối chiếu hai chứng cứ với hai điều kiện ở hồ sơ đang mở.</p>
        </section>
      </div>
      <section className={styles.nomination}><strong>QUYẾT ĐỊNH CUỐI HỒ SƠ · CHỌN NGƯỜI ĐẠT CẢ HAI ĐIỀU KIỆN</strong><div>{LABOR_SCENARIOS.map((person) => <button key={person.id} type="button" aria-pressed={nominee === person.id} onClick={() => { setNominee(person.id); setGridChecked(false); }}><Image src={art[person.id]} alt="" width={38} height={32} />{person.id.toUpperCase()} · {person.title}</button>)}</div></section>
      {gridChecked && (!gridResult.correct || nominee !== "b") && <section className={styles.explanationPanel} role="status"><small>ĐỐI CHIẾU VỚI GIÁO TRÌNH · HÀNG HÓA SỨC LAO ĐỘNG</small><h2>Vì sao kết luận chưa đúng?</h2><p>Sức lao động chỉ trở thành hàng hóa khi người lao động <strong>đồng thời tự do bán sức lao động</strong> và <strong>không có đủ tư liệu để tự sản xuất</strong>.</p><ul>{LABOR_SCENARIOS.flatMap((person) => conditions.filter((condition) => grid[person.id]?.[condition.id] !== person[condition.id]).map((condition) => <li key={`${person.id}-${condition.id}`}>{explainCondition(person, condition.id)}</li>))}{nominee !== "b" && <li>Hồ sơ được đề cử chưa hội đủ cả hai điều kiện. Người lao động làm thuê ở hồ sơ B có quyền ký hợp đồng và thiếu tư liệu sản xuất.</li>}</ul><button type="button" onClick={() => { playLaborSuccess(); setStage("value"); }}>Đã hiểu · Tiếp tục lập hồ sơ giá trị →</button></section>}
      {hints > 0 && <aside className={styles.hint}><Image src="/assets/hint-lightbulb.svg" alt="" width={43} height={43} /><p>{hints === 1 ? "Câu hỏi: người này có thể tự quyết định bán sức lao động không? Hãy tìm một hồ sơ mà câu trả lời cho cả hai điều kiện không mâu thuẫn." : "Câu hỏi tiếp theo: hồ sơ nào cho thấy người lao động không đủ tư liệu để tự sản xuất? Đừng chọn chỉ vì nhân vật đang nhận lương."}</p></aside>}
      <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" onClick={checkGrid}>NỘP BẢNG SUY LUẬN →</button><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={() => setHints((count) => Math.min(count + 1, 2))}>💡 GỢI Ý {hints}/2</button></div>
    </>}

    {stage === "value" && <>
      <h1 className={gameStyles.heading}>LẬP HỒ SƠ GIÁ TRỊ SỨC LAO ĐỘNG</h1>
      <p className={gameStyles.lede}>Người lao động làm thuê đã đạt cả hai điều kiện. Chọn những nhu cầu cần thiết để duy trì và tái sản xuất sức lao động; loại vật tư của nhà máy.</p>
      <section className={styles.valueLaunch}><span>THỬ THÁCH · 03 MẢNH HỒ SƠ</span><h2>Những khoản nào tạo nên giá trị sức lao động?</h2><p>Đọc câu hỏi, nhấn mở để năm thẻ bật ra. Chọn đúng ba thẻ gắn với việc duy trì và tái sản xuất sức lao động.</p>{!valueSpread && <button type="button" onClick={() => setValueSpread(true)}>MỞ NĂM MẢNH HỒ SƠ ↗</button>}</section>
      {valueSpread && <>
      <div className={styles.valueWorkbench}>
        <div className={styles.pieceGrid}>{LABOR_VALUE_PIECES.map((piece, index) => <button key={piece.id} className={`${styles.piece} ${styles.scatterPiece}`} style={{ animationDelay: `${index * 80}ms` }} type="button" aria-pressed={pieces.includes(piece.id)} onClick={() => togglePiece(piece.id)}><Image src={pieceIcons[piece.id]} alt="" width={68} height={62} /><strong>{piece.label}</strong><small>{piece.explanation}</small></button>)}</div>
        <aside className={styles.fileBox}><small>HỒ SƠ ĐANG LẬP · {pieces.length} MỤC ĐÃ CHỌN</small><h2>GIÁ TRỊ SỨC LAO ĐỘNG</h2>{pieces.length ? <ul>{pieces.map((piece) => <li key={piece}><Image src={pieceIcons[piece]} alt="" width={34} height={31} />{LABOR_VALUE_PIECES.find((item) => item.id === piece)?.label}</li>)}</ul> : <div className={styles.fileChecklist}><p>Chọn các mảnh hồ sơ ở bên trái.</p><span>01 · NHU CẦU CẦN THIẾT</span><span>02 · NHU CẦU CẦN THIẾT</span><span>03 · NHU CẦU CẦN THIẾT</span></div>}<strong>Giá trị của ca trong ví dụ: 15 USD</strong></aside>
      </div>
      {valueChecked && !valueResult.correct && (
        <p className={styles.feedback} role="status">
          💡 <strong>Gợi ý suy luận:</strong> Giá trị sức lao động được quyết định bởi lượng lao động xã hội cần thiết để sản xuất và tái sản xuất ra sức lao động (thông qua giá trị các tư liệu sinh hoạt nuôi sống con người lao động). Các vật tư dùng cho quá trình sản xuất của xưởng sợi không thuộc về giá trị người lao động. Hãy tự đối chiếu 3 nhóm nhu cầu này!
        </p>
      )}
      <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" disabled={pieces.length !== 3} onClick={() => { setValueChecked(true); if (valueResult.correct) { playLaborSuccess(); setStage("contract"); } }}>KIỂM TRA 3 MẢNH ĐÃ CHỌN →</button></div>
      </>}
    </>}

    {stage === "contract" && <>
      <h1 className={gameStyles.heading}>KÝ HỢP ĐỒNG CHO CA KÉO SỢI</h1>
      <p className={gameStyles.lede}>15 USD là giá trị sức lao động trong ví dụ. Hãy xác định hợp đồng mua gì và dự đoán giá trị sử dụng của nó sẽ bộc lộ ở đâu.</p>
      <div className={styles.contractHero}>
        <div>
          <span className={styles.heroBadge}>⚡ ĐIỀU KHOẢN THEN CHỐT</span>
          <h2>15 USD · CA 8 GIỜ</h2>
          <span>Nhà tư bản ứng trước tiền mua sức lao động một lần cho toàn bộ thời gian của ca</span>
        </div>
      </div>
      <div className={styles.contractGrid}>
        <section className={styles.contractCard}>
          <small><span className={styles.contractCardIcon} aria-hidden="true">📋</span>ĐIỀU KHOẢN 01 · PHẠM VI HỢP ĐỒNG</small>
          <h2 className={styles.sectionAccent}>Hợp đồng nào phản ánh đúng bản chất?</h2>
          {(([
            ["shift", "Mua sức lao động để sử dụng trong cả ca 8 giờ · 15 USD"],
            ["half", "Trả 15 USD cho mỗi 4 giờ của cùng ca"],
            ["product", "Mua sẵn cuộn sợi thành phẩm giá 15 USD"],
          ] as const)).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={clause === id ? styles.contractSelected : ""}
              aria-pressed={clause === id}
              onClick={() => { setClause(id); setContractChecked(false); }}
            >
              <strong>{label}</strong>
            </button>
          ))}
        </section>
        <section className={styles.contractCard}>
          <small><span className={styles.contractCardIcon} aria-hidden="true">🔮</span>GIẢ THUYẾT 02 · GIÁ TRỊ SỬ DỤNG ĐẶC BIỆT</small>
          <h2 className={styles.sectionAccent}>Khả năng tạo giá trị mới bộc lộ ở đâu?</h2>
          <button
            type="button"
            className={prediction === "factory" ? styles.contractSelected : ""}
            aria-pressed={prediction === "factory"}
            onClick={() => { setPrediction("factory"); setContractChecked(false); }}
          >
            <strong>Trong quá trình người lao động làm việc tại nhà máy</strong>
          </button>
          <button
            type="button"
            className={prediction === "contract" ? styles.contractSelected : ""}
            aria-pressed={prediction === "contract"}
            onClick={() => { setPrediction("contract"); setContractChecked(false); }}
          >
            <strong>Ngay khi ký giấy tờ, trước khi sản xuất</strong>
          </button>
        </section>
      </div>
      {contractChecked && (clause !== "shift" || prediction !== "factory") && <p className={styles.feedback} role="status">Hãy xem hợp đồng mua <strong>năng lực lao động trong thời gian đã thỏa thuận</strong> hay mua sản phẩm đã làm ra. Sau khi ký, đã có lao động nào diễn ra để tạo giá trị mới chưa?</p>}
      <div className={styles.contractDecision} aria-live="polite"><span>01 · {clause ? "ĐÃ CHỌN ĐIỀU KHOẢN" : "CHƯA CHỌN ĐIỀU KHOẢN"}</span><span>02 · {prediction ? "ĐÃ ĐẶT GIẢ THUYẾT" : "CHƯA ĐẶT GIẢ THUYẾT"}</span>{contractChecked && clause === "shift" && prediction === "factory" && <strong>Hợp đồng ngang giá; giá trị sử dụng được kiểm tra trong sản xuất.</strong>}</div>
      <div className={gameStyles.buttonRow}><button className={gameStyles.button} type="button" onClick={signContract}>KÝ VÀ ĐƯA HỒ SƠ ĐẾN XƯỞNG →</button></div>
    </>}

    {stage === "complete" && <>
      <h1 className={gameStyles.heading}>HỒ SƠ ĐÃ ĐƯỢC XÁC MINH</h1>
      <div className={styles.completionCelebrate}>
        <ConfettiEffect />
        <Image src="/assets/labor-ready-worker.svg" alt="Công nhân làm thuê giang tay nâng hai cuộn sợi, hào hứng bắt đầu ca làm việc" width={225} height={245} className={styles.readyWorker} />
        <div>
          <small>HỢP ĐỒNG 8 GIỜ · 15 USD</small>
          <h2>Người lao động làm thuê</h2>
          <p>Hai điều kiện cùng được chứng minh. Giá trị sức lao động gồm sinh hoạt, đào tạo và nuôi con. Tiếp theo, hãy kiểm tra trong nhà máy liệu 8 giờ lao động tạo ra bao nhiêu giá trị mới.</p>
          <span className={styles.readyBadge}>SẴN SÀNG BƯỚC VÀO CA 8 GIỜ</span>
        </div>
      </div>
      <div className={styles.verifiedFacts}><div><span>01</span><strong>TỰ DO KÝ HỢP ĐỒNG</strong><small>Đạt điều kiện thứ nhất</small></div><div><span>02</span><strong>THIẾU TƯ LIỆU SẢN XUẤT</strong><small>Đạt điều kiện thứ hai</small></div><div><span>03</span><strong>15 USD / CA 8 GIỜ</strong><small>Hồ sơ giá trị đã xác minh</small></div></div>
      <div className={gameStyles.buttonRow}><Link className={`${gameStyles.button} ${styles.journeyButton}`} href="/"><span className={styles.truckSmoke} aria-hidden="true">···</span><span className={styles.truck} aria-hidden="true"><svg viewBox="0 0 54 32" fill="none"><path d="M3 7h29v19H3zM32 13h10l8 8v5H32z" fill="#e6bf78" stroke="#fff4d6" strokeWidth="2"/><path d="M36 15h5l5 5H36z" fill="#9fc4bc"/><circle cx="13" cy="27" r="4" fill="#443225" stroke="#fff4d6" strokeWidth="2"/><circle cx="41" cy="27" r="4" fill="#443225" stroke="#fff4d6" strokeWidth="2"/></svg></span>VỀ BẢN ĐỒ · MỞ CHẶNG 3 →</Link><button className={`${gameStyles.button} ${gameStyles.buttonBrown}`} type="button" onClick={replayInvestigation}>↺ ĐIỀU TRA LẠI</button></div>
    </>}
  </GameShell>;
}

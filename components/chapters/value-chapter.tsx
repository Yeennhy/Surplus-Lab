"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type DragEvent } from "react";
import { GameShell, gameStyles } from "./game-shell";
import { TEXTBOOK_FACTORY_CONFIG, getFactoryResult } from "@/features/factory";
import { emitChapterCompleted } from "@/features/progress/events";
import { evaluateValuePlacements, getValueItems, type ValueGroup, type ValueItem, type ValueItemId, type ValuePlacements } from "@/features/value";
import styles from "./value-chapter.module.css";

type Stage = "theory" | "classify" | "feedback" | "success";
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

export function ValueChapter() {
  const [stage, setStage] = useState<Stage>("theory");
  const [placements, setPlacements] = useState<ValuePlacements>({});
  const [selectedItem, setSelectedItem] = useState<ValueItemId | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<ValueGroup | "pool" | null>(null);
  const [draggingFromZone, setDraggingFromZone] = useState(false);
  const [message, setMessage] = useState("");
  const [theoryFocus, setTheoryFocus] = useState<ValueGroup>("c");
  const evaluation = evaluateValuePlacements(items, placements);
  const availableItems = items.filter((item) => !placements[item.id]);

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
    setStage("success");
    emitChapterCompleted(4);
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
            <button className={gameStyles.button} type="button" onClick={() => setStage("classify")}>MỞ TRÒ CHƠI PHÂN LOẠI →</button>
          </div>
          <p className={`${gameStyles.note} ${styles.formulaNote}`}>GIÁ TRỊ SẢN PHẨM G = c + (v + m) = {result.constantCapital} + ({result.variableCapital} + {result.surplusValue}) = {result.productValue} USD.</p>
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
            onDrop={(event) => { handleDrop(event, "pool"); setDraggingFromZone(false); }}
            aria-label="Các thẻ chưa phân loại; kéo thẻ về đây để bỏ lựa chọn"
          >
            {availableItems.length > 0 ? (
              <div className={gameStyles.fourColumns}>
                {availableItems.map((item) => (
                  <ValueCard key={item.id} item={item} selected={selectedItem === item.id} onSelect={setSelectedItem} onDragStart={() => {}} onDragEnd={() => setActiveDropZone(null)} />
                ))}
              </div>
            ) : <p className={styles.emptyPool}>Tất cả thẻ đã được kéo vào khu vực phân loại. Có thể kéo thẻ trở lại đây để đổi lựa chọn.</p>}
            {draggingFromZone && <div className={styles.poolDropTarget} aria-hidden="true">THẢ ĐỂ ĐƯA THẺ VỀ HÀNG TRÊN</div>}
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
                      <ValueCard key={item.id} item={item} compact selected={selectedItem === item.id} onSelect={setSelectedItem} onDragStart={() => setDraggingFromZone(true)} onDragEnd={() => { setActiveDropZone(null); setDraggingFromZone(false); }} />
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

      {stage === "success" && (
        <>
          <h1 className={`${gameStyles.heading} ${gameStyles.headingCentered}`}>MẬT MÃ GIÁ TRỊ ĐÃ ĐƯỢC GIẢI</h1>
          <div className={styles.successPanel}>
            <span className={styles.successMedal} aria-hidden="true">✦</span>
            <p>✓ BẠN ĐÃ PHÂN LOẠI ĐÚNG CẢ BỐN THẺ</p>
            <h2>G = c + (v + m)</h2>
            <div className={styles.successEquation}><span><small>GIÁ TRỊ SẢN PHẨM</small><b>{result.productValue} USD</b></span><span aria-hidden="true">=</span><span><small>GIÁ TRỊ CŨ</small><b>{result.constantCapital}</b></span><span aria-hidden="true">＋</span><span><small>GIÁ TRỊ MỚI</small><b>{result.variableCapital} + {result.surplusValue}</b></span></div>
            <div className={styles.valueBar} aria-label={`c ${result.constantCapital} USD, v ${result.variableCapital} USD, m ${result.surplusValue} USD`}><span style={{ width: `${result.constantCapital / result.productValue * 100}%` }}>c</span><span style={{ width: `${result.variableCapital / result.productValue * 100}%` }}>v</span><span style={{ width: `${result.surplusValue / result.productValue * 100}%` }}>m</span></div>
          </div>
          <div className={gameStyles.cardGrid}>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><span className={styles.successCardIcon}>◈</span><small>GIÁ TRỊ CŨ CHUYỂN VÀO</small><strong>c = {result.constantCapital} USD</strong><span>Bông + hao mòn máy</span></div>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><span className={styles.successCardIcon}>✧</span><small>GIÁ TRỊ SỨC LAO ĐỘNG</small><strong>v = {result.variableCapital} USD</strong><span>Bốn giờ đầu bù đắp v</span></div>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><span className={styles.successCardIcon}>✦</span><small>GIÁ TRỊ THẶNG DƯ MỚI</small><strong>m = {result.surplusValue} USD</strong><span>Bốn giờ sau tạo ra m</span></div>
          </div>
          <details className={styles.successTakeaway} open><summary><span className={styles.takeawayIcon} aria-hidden="true">✦</span><span><small>GHI NHỚ SAU KHI GIẢI MẬT MÃ</small><strong>GIÁ TRỊ THẶNG DƯ ĐẾN TỪ ĐÂU?</strong></span><span aria-hidden="true">⌄</span></summary><div className={styles.takeawayBody}><div><small>LAO ĐỘNG TẠO MỚI</small><b>30 USD</b></div><span aria-hidden="true">−</span><div><small>BÙ ĐẮP v</small><b>15 USD</b></div><span aria-hidden="true">=</span><div><small>GIÁ TRỊ THẶNG DƯ m</small><b>15 USD</b></div></div><p>m là phần giá trị mới do lao động thặng dư tạo ra. Nó <b>không nằm trong 121 USD tư bản ứng trước</b>.</p></details>
          <div className={gameStyles.buttonRow}>
            <Link className={gameStyles.button} href="/challenge">BƯỚC VÀO THỬ THÁCH CUỐI →</Link>
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

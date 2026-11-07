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

export function ValueChapter() {
  const [stage, setStage] = useState<Stage>("theory");
  const [placements, setPlacements] = useState<ValuePlacements>({});
  const [selectedItem, setSelectedItem] = useState<ValueItemId | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<ValueGroup | "pool" | null>(null);
  const [draggingFromZone, setDraggingFromZone] = useState(false);
  const [message, setMessage] = useState("");
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
          <p className={`${gameStyles.lede} ${gameStyles.ledeCentered}`}>Giải thích vai trò khác nhau của tư liệu sản xuất và sức lao động.</p>
          <div className={gameStyles.twoColumns}>
            <section className={`${gameStyles.panel} ${styles.theoryCard}`}>
              <h2>c — TƯ BẢN BẤT BIẾN</h2>
              <p>Giá trị bông và hao mòn máy móc được bảo toàn, chuyển vào sản phẩm; tư liệu sản xuất không tự tạo giá trị mới.</p>
              <strong>c = {result.constantCapital} USD</strong>
            </section>
            <section className={`${gameStyles.panel} ${styles.theoryCard}`}>
              <h2>v — TƯ BẢN KHẢ BIẾN</h2>
              <p>Bộ phận tư bản mua sức lao động. Khi được sử dụng, lao động tạo giá trị mới lớn hơn giá trị sức lao động.</p>
              <strong>v = {result.variableCapital} USD</strong>
            </section>
          </div>
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
                  <strong>{group.key} · {group.title}</strong>
                  <span>{group.detail}</span>
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
                    {selectedItem ? `＋ ĐẶT THẺ VÀO ${group.key}` : "＋ THẢ THẺ VÀO ĐÂY"}
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
            <p>✓ THÀNH CÔNG</p>
            <h2>G = c + (v + m)</h2>
            <strong>{result.productValue} = {result.constantCapital} + ({result.variableCapital} + {result.surplusValue})</strong>
          </div>
          <div className={gameStyles.cardGrid}>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><strong>c = {result.constantCapital} USD</strong><span>GIÁ TRỊ CŨ</span></div>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><strong>v = {result.variableCapital} USD</strong><span>SỨC LAO ĐỘNG</span></div>
            <div className={`${gameStyles.panel} ${styles.successCard}`}><strong>m = {result.surplusValue} USD</strong><span>GIÁ TRỊ THẶNG DƯ</span></div>
          </div>
          <p className={`${gameStyles.note} ${styles.formulaNote}`}>m là giá trị mới do lao động thặng dư tạo ra, không phải một loại tư bản đã ứng trước.</p>
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
        if (icon) event.dataTransfer.setDragImage(icon, 46, 46);
      }}
      onDragEnd={onDragEnd}
      aria-pressed={selected}
      className={`${gameStyles.cardButton} ${styles.itemCard} ${compact ? styles.placedCard : ""} ${selected ? gameStyles.selected : ""}`}
      onClick={() => onSelect(item.id)}
    >
      <span className={styles.itemIcon}><Image src={item.asset} alt="" width={93} height={93} /><span aria-hidden="true">{item.glyph}</span></span>
      <span className={styles.cardText}><strong>{item.amount} USD</strong><small>{item.label.toUpperCase()}</small></span>
    </button>
  );
}

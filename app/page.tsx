"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { chapters } from "@/backend/content/chapters";
import { CHAPTER_COMPLETED_EVENT, readCompletedChapters } from "@/backend/domain/progress/events";
import styles from "./home.module.css";

const landmarks = ["◇", "♟", "⚙", "✦"];
const locations = ["PHIÊN CHỢ", "HỒ SƠ LAO ĐỘNG", "XƯỞNG KÉO SỢI", "SỔ GIÁ TRỊ"];

export default function Home() {
  const [completed, setCompleted] = useState<number[]>([]);
  useEffect(() => {
    const refresh = () => setCompleted(readCompletedChapters());
    refresh();
    window.addEventListener(CHAPTER_COMPLETED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHAPTER_COMPLETED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const allDone = chapters.every((chapter) => completed.includes(chapter.id));
  const current = chapters.find((chapter) => !completed.includes(chapter.id));

  return <main className={styles.page}>
    <div className={styles.inner}>
      <header className={styles.header}><Link href="/" className={styles.brand}>⚙ XƯỞNG GIÁ TRỊ</Link><nav aria-label="Tiện ích hành trình"><Link href="/reference">Sổ tay kiến thức</Link><span>{completed.length}/4 chương đã hoàn thành</span></nav></header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}><span className={styles.eyebrow}>HÀNH TRÌNH KHÁM PHÁ GIÁ TRỊ THẶNG DƯ</span><h1>Từ phiên chợ đến xưởng sợi</h1><p>Đi qua bốn chặng để tìm hiểu vì sao lưu thông không tạo ra giá trị mới, sức lao động có gì đặc biệt và giá trị thặng dư hình thành trong sản xuất ra sao.</p><span className={styles.heroGuide}>{allDone ? "↓ Cổng thử thách đã sáng ở cuối bản đồ" : "↓ Chọn chặng đang sáng trên bản đồ để bắt đầu"}</span></div>
        <div className={styles.heroStamp} aria-hidden="true"><span>04</span><small>CHẶNG KHÁM PHÁ</small></div>
      </section>
      <section className={styles.journey} aria-labelledby="journey-title">
        <div className={styles.journeyHeading}><div><span className={styles.eyebrow}>BẢN ĐỒ NHIỆM VỤ</span><h2 id="journey-title">Con đường đến thử thách</h2></div><p>{allDone ? "Bốn chặng đã hoàn tất. Cổng thử thách đã mở!" : `Chặng ${current?.id} đã sáng. Chạm vào trạm để đi tiếp.`}</p></div>
        <div className={styles.map}>
          <svg className={styles.road} viewBox="0 0 940 920" preserveAspectRatio="none" aria-hidden="true"><path d="M200 115 C790 145 790 250 715 330 S120 380 205 545 S780 610 720 770 S520 850 490 915" /></svg>
          <ol className={styles.stops}>{chapters.map((chapter, index) => {
            const done = completed.includes(chapter.id);
            const unlocked = chapters.slice(0, index).every((earlier) => completed.includes(earlier.id));
            const content = <><span className={styles.mapIcon} aria-hidden="true">{landmarks[index]}</span><span className={styles.stopBody}><span className={styles.stopIndex}>CHẶNG {String(chapter.id).padStart(2, "0")} · {locations[index]}</span><strong>{chapter.title}</strong><span className={styles.stopSummary}>{chapter.summary}</span><span className={styles.stopAction}>{done ? "Xem lại chặng" : unlocked ? "Vào nhiệm vụ" : `Hoàn thành Chương ${index} để mở`} <span aria-hidden="true">{unlocked ? "↗" : "○"}</span></span></span></>;
            return <li key={chapter.id} className={`${styles.stop} ${unlocked ? styles.unlocked : styles.locked} ${done ? styles.done : ""}`}><span className={styles.pin} aria-hidden="true">{done ? "✓" : unlocked ? landmarks[index] : "·"}</span>{unlocked ? <Link className={styles.stopLink} href={chapter.href} aria-label={`${done ? "Xem lại" : "Bắt đầu"} ${chapter.title}`}>{content}</Link> : <div className={styles.stopLink} aria-disabled="true">{content}</div>}</li>;
          })}</ol>
          <div className={`${styles.finish} ${allDone ? styles.finishOpen : ""}`}><span aria-hidden="true">✦</span><div><small>ĐÍCH ĐẾN</small><strong>Thử thách cuối</strong><p>10 câu hỏi chọn ngẫu nhiên từ ngân hàng kiến thức.</p>{allDone ? <Link href="/challenge">Vào thử thách →</Link> : <span>Hoàn thành cả bốn chương để mở khóa</span>}</div></div>
        </div>
      </section>
    </div>
  </main>;
}

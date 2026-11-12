import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./game-shell.module.css";

interface GameShellProps {
  chapter: 2 | 3 | 4;
  children: ReactNode;
  progress?: number;
}

export function GameShell({ chapter, children, progress }: GameShellProps) {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Surplus Lab — về bản đồ nhiệm vụ">
          <span aria-hidden="true">⚙</span> SURPLUS LAB
        </Link>
        <div className={styles.statuses} aria-label="Trạng thái nhiệm vụ">
          <span>NHIỆM VỤ {chapter}</span>
          <span>{chapter === 2 ? "HỒ SƠ SỨC LAO ĐỘNG" : "VỐN ỨNG TRƯỚC 121 USD"}</span>
          {chapter === 3 ? <span>TIẾN ĐỘ CA · {Math.round(progress ?? 0)}%</span> : <span>{chapter === 2 ? "HỢP ĐỒNG 8 GIỜ" : "KIỂM TOÁN HAI MẺ SỢI"}</span>}
        </div>
        <details className={styles.journal}>
          <summary>☰ NHẬT KÝ</summary>
          <nav aria-label="Chuyển chương">
            <Link href="/">Bản đồ nhiệm vụ</Link>
            <Link href="/learn/chapter-2">Sức lao động</Link>
            <Link href="/learn/chapter-3">Xưởng sợi</Link>
            <Link href="/learn/chapter-4">Giá trị hàng hóa</Link>
          </nav>
        </details>
      </header>
      <main className={styles.board}>
        <Image className={`${styles.corner} ${styles.topLeft}`} src="/assets/figma/portrait-halo.svg" alt="" width={10} height={10} />
        <Image className={`${styles.corner} ${styles.topRight}`} src="/assets/figma/portrait-halo.svg" alt="" width={10} height={10} />
        <Image className={`${styles.corner} ${styles.bottomLeft}`} src="/assets/figma/portrait-halo.svg" alt="" width={10} height={10} />
        <Image className={`${styles.corner} ${styles.bottomRight}`} src="/assets/figma/portrait-halo.svg" alt="" width={10} height={10} />
        {children}
      </main>
    </div>
  );
}

export { styles as gameStyles };

import Link from "next/link";
import { textbookSource } from "@/backend/content/references";
import styles from "./reference.module.css";

const entries = [
  { title: "Tư bản", text: "Giá trị được ứng ra nhằm mang lại giá trị thặng dư; công thức vận động chung là T – H – T'.", chapter: 1 },
  { title: "Hàng hóa sức lao động", text: "Khả năng lao động của người tự do về thân thể nhưng không đủ tư liệu để tự sản xuất. Khi được sử dụng, nó có thể tạo giá trị mới lớn hơn giá trị bản thân.", chapter: 2 },
  { title: "Lao động tất yếu", text: "Phần thời gian người lao động tạo ra giá trị mới tương đương giá trị sức lao động v.", chapter: 3 },
  { title: "Lao động thặng dư", text: "Phần thời gian làm việc tiếp sau lao động tất yếu; tạo ra giá trị thặng dư m.", chapter: 3 },
  { title: "Tư bản bất biến · c", text: "Giá trị tư liệu sản xuất đã tiêu dùng được bảo tồn và chuyển vào sản phẩm; trong ví dụ gồm bông và hao mòn máy.", chapter: 4 },
  { title: "Tư bản khả biến · v", text: "Khoản ứng ra để mua sức lao động. Việc sử dụng sức lao động tạo ra giá trị mới v + m.", chapter: 4 },
];

export default function Page() {
  return <main className={styles.page}><header className={styles.topbar}><Link href="/">⚙ XƯỞNG GIÁ TRỊ</Link><span>SỔ TAY KINH TẾ</span><Link href="/">← Bản đồ</Link></header><section className={styles.board}><h1>Thư viện kiến thức</h1><p className={styles.lede}>Sáu khái niệm dùng xuyên suốt hành trình. Mở lại chương tương ứng để xem cách chúng xuất hiện trong mô phỏng.</p><div className={styles.grid}>{entries.map((entry) => <article key={entry.title}><small>CHƯƠNG {entry.chapter}</small><h2>{entry.title}</h2><p>{entry.text}</p><Link href={`/learn/chapter-${entry.chapter}`}>Đến chương {entry.chapter} →</Link></article>)}</div><p className={styles.source}>Nguồn nội dung: {textbookSource.title}, {textbookSource.author} ({textbookSource.year}), trích lược tại <span>{textbookSource.localExtract}</span>.</p><Link className={styles.back} href="/">Quay về bản đồ hành trình →</Link></section></main>;
}

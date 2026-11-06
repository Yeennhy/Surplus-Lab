import Link from "next/link";

export function ChapterShell({ title, summary, next }: { title: string; summary: string; next: string }) {
  return <main className="mx-auto max-w-4xl px-6 py-16"><Link href="/">← Lộ trình</Link><h1 className="mt-8 text-4xl font-bold">{title}</h1><p className="mt-4 text-lg">{summary}</p><p className="mt-12 rounded-lg border border-amber-400 bg-amber-50 p-5">Khung chương đã sẵn sàng. Nội dung tương tác sẽ được triển khai theo tiến độ 6 ngày.</p><Link className="mt-8 inline-block" href={next}>Tiếp tục →</Link></main>;
}

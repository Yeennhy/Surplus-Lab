import Link from "next/link";
import { chapters } from "@/content/chapters";

export default function Home() {
  return <main className="mx-auto max-w-5xl px-6 py-16">
    <p className="text-sm font-semibold uppercase tracking-widest">Interactive Educational Web Game</p>
    <h1 className="mt-3 text-5xl font-bold">Surplus Lab</h1>
    <p className="mt-3 text-xl">The Factory of Value</p>
    <p className="mt-8 max-w-2xl">Khám phá sự vận động của tư bản và sự hình thành giá trị thặng dư qua bốn chương tương tác.</p>
    <Link className="mt-8 inline-block rounded bg-green-800 px-5 py-3 text-white" href="/learn/chapter-1">Bắt đầu học</Link>
    <h2 className="mt-14 text-2xl font-semibold">Lộ trình</h2>
    <ol className="mt-5 grid gap-4 md:grid-cols-2">{chapters.map((chapter) => <li key={chapter.href} className="rounded-lg border border-green-900/20 bg-white p-5"><Link className="font-semibold" href={chapter.href}>{chapter.title}</Link><p className="mt-2 text-sm">{chapter.summary}</p></li>)}</ol>
    <Link className="mt-8 inline-block" href="/challenge">Final Challenge →</Link>
  </main>;
}

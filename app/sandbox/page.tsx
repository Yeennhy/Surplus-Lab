"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { compareSandbox, resetSandboxConfig } from "@/backend/domain/sandbox/engine";
import type { SandboxConfig, SandboxResult } from "@/backend/domain/sandbox/types";
import styles from "./sandbox.module.css";

const display = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
const controls: Array<{ key: "totalHours" | "necessaryHours" | "hourlyValueRate" | "cottonValue" | "machineDepreciation"; label: string; min: number; max: number; step: number; unit: string }> = [
  { key: "totalHours", label: "Thời gian làm việc", min: 4, max: 12, step: 1, unit: "giờ" },
  { key: "necessaryHours", label: "Lao động tất yếu", min: 1, max: 12, step: 1, unit: "giờ" },
  { key: "hourlyValueRate", label: "Giá trị mới mỗi giờ", min: 1, max: 8, step: .25, unit: "USD/giờ" },
  { key: "cottonValue", label: "Giá trị bông", min: 20, max: 160, step: 5, unit: "USD" },
  { key: "machineDepreciation", label: "Hao mòn máy", min: 0, max: 20, step: 1, unit: "USD" },
];

function Scenario({ title, result }: { title: string; result: SandboxResult }) {
  return <article className={styles.scenario}><h2>{title}</h2><dl><div><dt>c · Giá trị tư liệu sản xuất</dt><dd>{display(result.constantCapital)} USD</dd></div><div><dt>v · Giá trị sức lao động</dt><dd>{display(result.variableCapital)} USD</dd></div><div><dt>m · Giá trị thặng dư</dt><dd>{display(result.surplusValue)} USD</dd></div><div><dt>G · Giá trị sản phẩm</dt><dd>{display(result.productValue)} USD</dd></div></dl><div className={styles.valueBar} aria-label={`c ${result.constantCapital}, v ${result.variableCapital}, m ${result.surplusValue}`}><span style={{ flex: result.constantCapital }} /><span style={{ flex: result.variableCapital }} /><span style={{ flex: result.surplusValue || .01 }} /></div></article>;
}

function SandboxContent() {
  const [config, setConfig] = useState<SandboxConfig>(() => ({ ...resetSandboxConfig(), laborPowerValue: undefined }));
  const [hasQuizResult, setHasQuizResult] = useState(false);
  useEffect(() => {
    try { setHasQuizResult(Boolean(window.sessionStorage.getItem("surplus-lab-quiz-result-v1"))); } catch {}
  }, []);
  const comparison = compareSandbox(config);
  function update(key: typeof controls[number]["key"], value: number) {
    setConfig((current) => ({ ...current, [key]: value, necessaryHours: key === "totalHours" ? Math.min(current.necessaryHours, value) : key === "necessaryHours" ? Math.min(value, current.totalHours) : current.necessaryHours }));
  }
  return <main className={styles.page}><header className={styles.topbar}><Link href="/">⚙ XƯỞNG GIÁ TRỊ</Link><span>KHU THỬ NGHIỆM KINH TẾ</span><nav aria-label="Điều hướng khu thử nghiệm"><Link href="/">← Về bản đồ</Link><Link href={hasQuizResult ? "/challenge?ket-qua=1" : "/challenge"}>{hasQuizResult ? "Về kết quả ↗" : "Thử thách cuối ↗"}</Link></nav></header><div className={styles.board}><div className={styles.heading}><h1>Thay đổi một biến, quan sát cả ca</h1><p>Thử các giả định rồi đối chiếu với ví dụ 8 giờ trong giáo trình. Số liệu ở đây chỉ minh họa quan hệ giữa c, v và m trong mô hình học tập.</p></div><div className={styles.layout}><section className={styles.controls}><h2>Bàn điều khiển</h2>{controls.map((control) => <label key={control.key}><span>{control.label}<strong>{display(config[control.key])} {control.unit}</strong></span><input type="range" min={control.min} max={control.key === "necessaryHours" ? config.totalHours : control.max} step={control.step} value={config[control.key]} onChange={(event) => update(control.key, Number(event.target.value))} /></label>)}<button type="button" onClick={() => setConfig({ ...resetSandboxConfig(), laborPowerValue: undefined })}>↺ Về ví dụ giáo trình</button></section><div className={styles.results}><div className={styles.scenarios}><Scenario title="Ví dụ giáo trình" result={comparison.textbook} /><Scenario title="Kịch bản đang thử" result={comparison.current} /></div><section className={styles.insight}><h2>Điều thay đổi trong kịch bản này</h2><div><strong>{comparison.diffProductValue >= 0 ? "+" : ""}{display(comparison.diffProductValue)} USD</strong><span>chênh lệch giá trị sản phẩm so với ví dụ giáo trình</span></div><p>{comparison.current.surplusHours} giờ lao động thặng dư tạo {display(comparison.current.surplusValue)} USD m. Giá trị mới là {display(comparison.current.newValue)} USD; c chỉ chuyển giá trị đã có vào sản phẩm.</p></section></div></div></div></main>;
}

export default function Page() { return <SandboxContent />; }

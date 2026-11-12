import styles from "./factory-chapter.module.css";

type Station = "cotton" | "machine" | "labor";

interface ProductionSceneProps {
  running: boolean;
  selected: Station | null;
  transferredValue: string;
  newValue: string;
  onInspect: (station: Station) => void;
  compact?: boolean;
  operationStep?: number;
  progress?: number;
}

export function ProductionScene({ running, selected, transferredValue, newValue, onInspect, compact = false, operationStep, progress = 1 }: ProductionSceneProps) {
  const fill = Math.max(0, Math.min(1, progress));
  return (
    <div className={`${styles.processStage} ${running ? styles.processActive : styles.processStill} ${operationStep === undefined ? "" : styles[`processStep${operationStep}`]}`}>
      <div className={styles.processViewport}>
        <svg className={styles.processArt} viewBox="0 0 1000 360" role="img" aria-label={operationStep === undefined ? "Bông được tách thành xơ, đi qua máy kéo sợi đang quay; công nhân điều khiển máy và cuộn sợi thành phẩm" : `Dây chuyền đã nối ${operationStep} trên 4 trạm: tách xơ, kéo sợi, công nhân gia công, quấn cuộn`}>
          <defs>
            <linearGradient id="factory-wall" x2="0" y2="1"><stop stopColor="#426759" /><stop offset="1" stopColor="#173e39" /></linearGradient>
            <linearGradient id="factory-floor" x2="0" y2="1"><stop stopColor="#79583c" /><stop offset="1" stopColor="#4a392d" /></linearGradient>
            <linearGradient id="factory-machine" x2="1" y2="1"><stop stopColor="#6d9c9b" /><stop offset="1" stopColor="#275762" /></linearGradient>
            <linearGradient id="factory-thread" x2="0" y2="1"><stop stopColor="#fff6d6" /><stop offset="1" stopColor="#d7b97b" /></linearGradient>
            <clipPath id="factory-spool-fill"><rect x="867" y={281 - fill * 96} width="65" height={fill * 96} /></clipPath>
          </defs>
          <rect width="1000" height="360" fill="url(#factory-wall)" />
          <path d="M0 38h1000M0 93h1000" stroke="#76937b" strokeWidth="5" opacity=".22" />
          <path d="M44 0v98m199-98v98m198-98v98m198-98v98m198-98v98" stroke="#86a08a" strokeWidth="8" opacity=".2" />
          <rect x="0" y="290" width="1000" height="70" fill="url(#factory-floor)" />
          <path d="M0 292h1000" stroke="#cfa568" strokeWidth="7" />
          <path d="M0 328h1000" stroke="#9b754e" strokeWidth="3" opacity=".55" />

          <g className={styles.cottonBin}>
            <ellipse cx="123" cy="294" rx="107" ry="15" fill="#132f2d" opacity=".4" />
            <path d="M42 202h160l17 77H23z" fill="#bd8c55" stroke="#e3bd80" strokeWidth="7" strokeLinejoin="round" />
            <path d="M54 213l15 62m32-62 6 62m31-62-1 62m30-62-7 62m31-62-14 62" stroke="#825e3e" strokeWidth="6" />
            <path d="M45 212c-13-18-6-38 16-41 8-26 43-30 56-10 21-25 52-19 64 8 25-3 37 25 20 43z" fill="#fff5d8" stroke="#d4c5a5" strokeWidth="6" />
            <path d="M77 206c-12-15-8-34 1-42m53 42c-8-16-5-29 7-39m30 37c9-13 12-26 7-39" fill="none" stroke="#e1d4b9" strokeWidth="5" strokeLinecap="round" />
            <path d="M51 235h142m-130 25h124" stroke="#ead1a3" strokeWidth="5" />
          </g>

          <g className={styles.fiberTuft}><circle cx="205" cy="177" r="10" fill="#fff4d5" /><circle cx="217" cy="171" r="11" fill="#fff4d5" /><circle cx="228" cy="180" r="9" fill="#fff4d5" /></g>
          <g className={styles.fiberTuftLate}><circle cx="205" cy="196" r="9" fill="#fff4d5" /><circle cx="216" cy="191" r="10" fill="#fff4d5" /><circle cx="227" cy="199" r="8" fill="#fff4d5" /></g>
          <g className={styles.fiberRibbons} fill="none" stroke="#f9ebc9" strokeWidth="4" strokeLinecap="round">
            <path d="M207 183C255 159 284 178 332 157" /><path d="M209 192C257 171 286 190 332 174" />
            <path d="M210 201C255 188 287 203 332 190" /><path d="M209 211C252 208 285 216 332 207" />
          </g>
          <path className={styles.fiberGuide} d="M225 220C265 222 294 214 331 213" fill="none" stroke="#d5b777" strokeWidth="5" strokeDasharray="8 8" />

          <g className={styles.machineBody}>
            <ellipse cx="478" cy="296" rx="180" ry="15" fill="#132f2d" opacity=".45" />
            <path d="M320 111h313v170H320z" fill="url(#factory-machine)" stroke="#153e48" strokeWidth="9" />
            <path d="M335 127h282v39H335z" fill="#a3c3b0" />
            <path d="M332 206h297" stroke="#122f3b" strokeWidth="8" />
            <path d="M337 255h285" stroke="#1c4245" strokeWidth="7" />
            <path d="M318 281h320v12H318z" fill="#936a46" stroke="#573f30" strokeWidth="5" />
            <path d="M351 79v82m52-82v82m52-82v82m52-82v82m52-82v82m52-82v82" stroke="#f1dcaa" strokeWidth="5" />
            <path d="M337 74h28v24h-28zm52 0h28v24h-28zm52 0h28v24h-28zm52 0h28v24h-28zm52 0h28v24h-28zm52 0h28v24h-28z" fill="#d3a66c" stroke="#684936" strokeWidth="4" />
            <g className={styles.leftRoller}><circle cx="399" cy="222" r="37" fill="#d5a66c" stroke="#694a37" strokeWidth="7" /><path d="M399 190v64m-32-32h64m-54-22 45 44m-45 0 45-44" stroke="#8c643f" strokeWidth="5" /><circle cx="399" cy="222" r="9" fill="#70513d" /></g>
            <g className={styles.rightRoller}><circle cx="544" cy="222" r="46" fill="#d5a66c" stroke="#694a37" strokeWidth="8" /><path d="M544 182v80m-40-40h80m-68-28 56 56m-56 0 56-56" stroke="#8c643f" strokeWidth="6" /><circle cx="544" cy="222" r="11" fill="#70513d" /></g>
            <g className={styles.shuttle}><rect x="445" y="165" width="63" height="17" rx="6" fill="#dfbb7c" /><circle cx="456" cy="174" r="6" fill="#654733" /><circle cx="496" cy="174" r="6" fill="#654733" /></g>
          </g>
          <path className={styles.finishedFiber} d="M623 185C667 174 695 179 740 195c35 13 75 12 119-3" fill="none" stroke="url(#factory-thread)" strokeWidth="8" strokeLinecap="round" />
          <path className={styles.finishedFiberFine} d="M624 199C670 188 696 198 740 209c42 10 78 8 119-2" fill="none" stroke="#f8ebc4" strokeWidth="3" strokeLinecap="round" />

          <g className={styles.workerBody}>
            <ellipse cx="746" cy="299" rx="98" ry="12" fill="#132f2d" opacity=".35" />
            <path d="M687 280c2-56 17-85 62-85s62 28 64 85" fill="#315f70" stroke="#193d49" strokeWidth="7" />
            <path d="M729 184h39l-6 28-14 13-13-13z" fill="#c48c68" />
            <ellipse cx="749" cy="148" rx="34" ry="43" fill="#c48c68" />
            <path d="M715 142q3-44 36-45 33 2 35 45l-19-10-37-1z" fill="#49392e" />
            <path d="M704 127q10-45 46-46 37 1 49 46l-11 14h-72z" fill="#3c7180" stroke="#1b4652" strokeWidth="6" />
            <path d="M729 153h7m25 0h7" stroke="#4b2e27" strokeWidth="4" strokeLinecap="round" />
            <path d="M741 174q9 7 18 0" fill="none" stroke="#80503d" strokeWidth="3" />
            <path d="M739 205l10 13 11-13" fill="none" stroke="#f2e3ba" strokeWidth="5" />
            <g className={styles.workerOperatingArm}><path d="M703 233Q666 228 635 194" fill="none" stroke="#315f70" strokeWidth="22" strokeLinecap="round" /><circle cx="633" cy="191" r="13" fill="#c48c68" /></g>
            <g className={styles.workerFinishingArm}><path d="M798 239Q828 234 861 205" fill="none" stroke="#315f70" strokeWidth="21" strokeLinecap="round" /><circle cx="862" cy="203" r="12" fill="#c48c68" /></g>
          </g>

          <g className={styles.finishedSpool}>
            <ellipse cx="902" cy="290" rx="75" ry="11" fill="#132f2d" opacity=".3" />
            <path d="M870 177h56l-8 103h-40z" fill="#e3c18a" stroke="#8c6746" strokeWidth="5" />
            <path d="M865 174h66m-60 107h54" stroke="#6b4f39" strokeWidth="8" strokeLinecap="round" />
            <path clipPath="url(#factory-spool-fill)" d="M875 194h48m-46 19h45m-42 19h40m-39 19h36" stroke="#b58e61" strokeWidth="5" />
            <path d="M924 191q41 12 39 43-2 28-40 32" fill="none" stroke="#f2d6a2" strokeWidth="6" />
          </g>
          <g className={styles.processSparks} fill="#f4ce81"><circle cx="656" cy="156" r="5" /><circle cx="681" cy="140" r="3" /><circle cx="854" cy="165" r="4" /></g>
        </svg>
        <div className={styles.sceneLegend} aria-hidden="true"><span>01 · TÁCH XƠ BÔNG</span><span>02 · KÉO SỢI</span><span>03 · CÔNG NHÂN HOÀN THIỆN</span></div>
      </div>
      {!compact && <p className={styles.processScrollHint}>Vuốt ngang để theo dõi bông → máy kéo sợi → công nhân.</p>}
      {!compact && <>
      <div className={styles.processStations} role="group" aria-label="Điều tra các trạm của dây chuyền">
        <button type="button" aria-pressed={selected === "cotton"} onClick={() => onInspect("cotton")}><b>01</b><span>TÁCH XƠ BÔNG<small>Giá trị cũ từ bông</small></span></button>
        <button type="button" aria-pressed={selected === "machine"} onClick={() => onInspect("machine")}><b>02</b><span>MÁY KÉO SỢI<small>Hao mòn được chuyển vào</small></span></button>
        <button type="button" aria-pressed={selected === "labor"} onClick={() => onInspect("labor")}><b>03</b><span>CÔNG NHÂN GIA CÔNG<small>Lao động tạo giá trị mới</small></span></button>
      </div>
      <div className={styles.valueStreams} aria-live="polite">
        <div><small>DÒNG GIÁ TRỊ CŨ (c)</small><strong>{transferredValue}</strong><span>Bông và hao mòn máy chuyển vào sợi qua lao động cụ thể.</span></div>
        <div><small>DÒNG GIÁ TRỊ MỚI (v + m)</small><strong>{newValue}</strong><span>Do lao động của công nhân tạo ra trong cùng quá trình.</span></div>
      </div>
      </>}
    </div>
  );
}

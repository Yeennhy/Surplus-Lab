"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createMarket, DEFAULT_MARKET_CONFIG, getMarketTotals, runMarketTicks } from "@/backend/domain/market/engine";
import { emitChapterCompleted } from "@/backend/domain/progress/events";
import { GameShell } from "@/frontend/components/chapters/game-shell";
import type { MarketConfig } from "@/backend/domain/market/types";
import styles from "./market-chapter.module.css";

const number = (value: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
const REQUIRED_TICKS = 8;

export function MarketChapter() {
  const [config, setConfig] = useState<MarketConfig>({ ...DEFAULT_MARKET_CONFIG, priceMargin: .2 });
  const [market, setMarket] = useState(() => createMarket());
  const [running, setRunning] = useState(false);
  const [selectedBot, setSelectedBot] = useState("B001");
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [wealthHistory, setWealthHistory] = useState<number[]>([220]);
  const totals = getMarketTotals(market);
  const bot = market.bots.find((item) => item.id === selectedBot) ?? market.bots[0];
  const hasSimulated = market.simulationTick >= REQUIRED_TICKS;
  const recentTrade = market.transactionHistory.at(-1);
  const tradedThisTick = market.transactionHistory.filter((trade) => trade.timestamp === market.simulationTick);
  const movingValue = tradedThisTick.reduce((sum, trade) => sum + trade.price, 0);
  const botWealth = bot.money + bot.inventory.essential * 10 + bot.inventory["non-essential"] * 20;
  const buckets = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const item of market.bots) {
      const wealth = item.money + item.inventory.essential * 10 + item.inventory["non-essential"] * 20;
      counts[wealth < 216 ? 0 : wealth < 220 ? 1 : wealth === 220 ? 2 : wealth < 225 ? 3 : 4] += 1;
    }
    return counts;
  }, [market]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setMarket((current) => runMarketTicks(current, config)), 700 / config.simulationSpeed);
    return () => window.clearInterval(timer);
  }, [running, config]);

  useEffect(() => {
    if (market.simulationTick >= REQUIRED_TICKS) setRunning(false);
  }, [market.simulationTick]);

  useEffect(() => {
    if (market.simulationTick === 0) return;
    setWealthHistory((current) => [...current.slice(-17), botWealth]);
  }, [market, selectedBot, botWealth]);

  useEffect(() => {
    if (answered === "correct" && hasSimulated) emitChapterCompleted(1);
  }, [answered, hasSimulated]);

  function reset() {
    setRunning(false);
    setMarket(createMarket());
    setSelectedBot("B001");
    setAnswered(null);
    setWealthHistory([220]);
  }

  function answer(correct: boolean) {
    setAnswered(correct ? "correct" : "wrong");
  }

  function selectBot(id: string) {
    const next = market.bots.find((item) => item.id === id);
    if (!next) return;
    setSelectedBot(id);
    setWealthHistory([next.money + next.inventory.essential * 10 + next.inventory["non-essential"] * 20]);
  }

  return <GameShell chapter={1}>
    <div className={styles.page}>
      <h1>Thị trường 100 bot</h1>
      <p className={styles.lead}>Điều hành một thị trường đóng. Giá mở đầu cao hơn giá tham chiếu 20% để thấy bot nào được lợi, bot nào chịu thiệt. Quan sát {REQUIRED_TICKS} lượt rồi tự rút ra điều gì vẫn được giữ nguyên.</p>
      <div className={styles.runStatus} aria-live="polite"><span className={running ? styles.liveDot : styles.idleDot} /><strong>{running ? "100 bot đang giao dịch" : hasSimulated ? "Đã đủ dữ liệu để kết luận" : "Thị trường chờ vận hành"}</strong><span>Lượt {Math.min(market.simulationTick, REQUIRED_TICKS)}/{REQUIRED_TICKS}</span><div className={styles.runTrack}><span style={{ width: `${Math.min(100, market.simulationTick / REQUIRED_TICKS * 100)}%` }} /></div></div>

      <section className={styles.controls} aria-label="Điều khiển mô phỏng">
        <label>Xác suất giao dịch <strong>{Math.round(config.tradeProbability * 100)}%</strong>
          <input type="range" min="0" max="100" step="5" value={config.tradeProbability * 100} onChange={(event) => setConfig((current) => ({ ...current, tradeProbability: Number(event.target.value) / 100 }))} />
        </label>
        <label>Giá so với giá tham chiếu <strong>{config.priceMargin > 0 ? "+" : ""}{Math.round(config.priceMargin * 100)}%</strong>
          <input type="range" min="-50" max="50" step="5" value={config.priceMargin * 100} onChange={(event) => setConfig((current) => ({ ...current, priceMargin: Number(event.target.value) / 100 }))} />
        </label>
        <label>Tốc độ <strong>{config.simulationSpeed}×</strong>
          <input type="range" min="1" max="4" step="1" value={config.simulationSpeed} onChange={(event) => setConfig((current) => ({ ...current, simulationSpeed: Number(event.target.value) }))} />
        </label>
        <div className={styles.actions}>
          <button type="button" onClick={() => setRunning((value) => !value)} disabled={hasSimulated}>{running ? "Tạm dừng" : hasSimulated ? "Đã chạy đủ lượt" : "Chạy mô phỏng"}</button>
          <button type="button" onClick={() => setMarket((current) => runMarketTicks(current, config))} disabled={running || hasSimulated}>Chạy 1 lượt</button>
          <button type="button" onClick={() => { setRunning(false); setShowResetConfirm(true); }}>Đặt lại</button>
        </div>
      </section>

      <section className={styles.marketFloor} aria-label="Bản đồ 100 bot giao dịch"><div className={styles.floorHeading}><div><small>SÀN GIAO DỊCH · TRỰC TIẾP</small><h2>100 bot đang trao đổi hàng và tiền</h2></div><span>{recentTrade ? `${recentTrade.sellerId} → ${recentTrade.buyerId} · ${number(recentTrade.price)} USD` : "Đang chờ giao dịch đầu tiên"}</span></div><div className={styles.liveBoard} aria-live="polite"><div><small>PHIÊN HIỆN TẠI</small><strong>{market.simulationTick} / {REQUIRED_TICKS}</strong></div><div><small>GIAO DỊCH VỪA DIỄN RA</small><strong>{tradedThisTick.length} lượt</strong></div><div><small>TIỀN ĐÃ CHUYỂN TAY</small><strong>{number(movingValue)} USD</strong></div><div><small>GIÁ TRỊ HÀNG CẢ SÀN</small><strong>{number(totals.referenceValue)} USD</strong></div></div><div className={styles.floorActivity}><span className={styles.activityPulse} />{running ? "Bot đang ghép lệnh mua và bán…" : market.simulationTick ? "Tạm dừng để theo dõi bot hoặc chạy lượt tiếp theo." : "Nhấn “Chạy mô phỏng” để các bot bắt đầu trao đổi."}</div><div className={styles.botGrid}>{market.bots.map((item) => <button key={item.id} type="button" title={`${item.id}: ${number(item.money)} USD`} aria-label={`Theo dõi bot ${item.id}, còn ${number(item.money)} USD`} aria-pressed={selectedBot === item.id} onClick={() => selectBot(item.id)} className={`${styles.botDot} ${tradedThisTick.some((trade) => trade.sellerId === item.id) ? styles.seller : ""} ${tradedThisTick.some((trade) => trade.buyerId === item.id) ? styles.buyer : ""} ${selectedBot === item.id ? styles.selected : ""}`} style={{ opacity: Math.max(.45, Math.min(1, item.money / 130)) }}><span>{item.id.slice(1)}</span></button>)}</div><p>Cam: vừa bán · vàng sáng: vừa mua · viền trắng: bot bạn đang theo dõi. Chọn bot để xem tiền và hàng thay đổi.</p></section>

      <section aria-label="Số liệu toàn thị trường" className={styles.metrics} aria-live="polite">
        <div><small>Lượt mô phỏng</small><strong>{number(market.simulationTick)}</strong></div>
        <div><small>Giao dịch thành công</small><strong>{number(market.tradeCount)}</strong></div>
        <div><small>Tổng tiền</small><strong>{number(totals.money)} USD</strong></div>
        <div><small>Giá trị hàng tham chiếu</small><strong>{number(totals.referenceValue)} USD</strong></div>
      </section>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>Tiền và hàng được chuyển giữa các bot</h2>
          <p>Cả hệ thống vẫn có <strong>{number(totals.essential)} hàng thiết yếu</strong> và <strong>{number(totals.nonEssential)} hàng không thiết yếu</strong>. Giá giao dịch đổi được lợi ích của từng bot, còn tổng giá trị hàng tính theo giá tham chiếu không đổi.</p>
          <div className={styles.chart} role="img" aria-label={`Phân bố tài sản tham chiếu của 100 bot: ${buckets.join(", ")} bot ở năm nhóm tăng dần`}>
            {buckets.map((count, index) => <div key={index}><b>{count}</b><span style={{ height: `${Math.max(4, Math.min(125, count * 2))}px` }} /><small>{["<216", "216–219", "220", "221–224", "≥225"][index]}</small></div>)}
          </div>
          <p className={styles.caption}>Số bot theo tài sản tham chiếu · USD</p>
        </section>
        <section className={styles.panel}>
          <h2>Theo dõi một bot</h2>
          <label className={styles.botSelect}>Chọn bot
            <select value={selectedBot} onChange={(event) => selectBot(event.target.value)}>{market.bots.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select>
          </label>
          <dl className={styles.botStats}><div><dt>Tiền</dt><dd>{number(bot.money)} USD</dd></div><div><dt>Hàng thiết yếu</dt><dd>{bot.inventory.essential}</dd></div><div><dt>Hàng không thiết yếu</dt><dd>{bot.inventory["non-essential"]}</dd></div></dl>
          <div className={styles.wealth}><small>TÀI SẢN BOT {selectedBot}</small><strong>{number(botWealth)} USD</strong><span>{botWealth >= 220 ? "+" : ""}{number(botWealth - 220)} USD so với ban đầu</span><div className={styles.wealthLine} role="img" aria-label="Diễn biến tài sản của bot đã chọn">{wealthHistory.map((value, index) => <i key={index} style={{ height: `${Math.max(12, Math.min(96, 50 + (value - 220) * 3))}%` }} />)}</div></div>
          <h3>Giao dịch gần đây</h3>
          {market.transactionHistory.length === 0 ? <p>Chạy một lượt để xem các giao dịch.</p> : <ol className={styles.trades}>{[...market.transactionHistory].reverse().slice(0, 5).map((trade, index) => <li key={`${trade.timestamp}-${index}`}>{trade.sellerId} → {trade.buyerId}: {trade.commodityId === "essential" ? "hàng thiết yếu" : "hàng không thiết yếu"}, {number(trade.price)} USD</li>)}</ol>}
        </section>
      </div>

      {hasSimulated && answered !== "correct" && <div className={styles.transition} role="dialog" aria-modal="true" aria-labelledby="market-question-title"><section className={`${styles.lesson} ${styles.lessonReady}`}>
        <span className={styles.lessonKicker}>NHIỆM VỤ KẾT LUẬN · ĐÃ MỞ</span>
        <div className={styles.questionEmblem} aria-hidden="true">?</div><h2 id="market-question-title">Tám lượt đã kết thúc. Bạn rút ra điều gì?</h2>
        <p><strong>H – T – H</strong> hướng đến giá trị sử dụng. <strong>T – H – T&apos;</strong> hướng đến số tiền lớn hơn ban đầu. Nếu một bot bán cao hơn giá tham chiếu, khoản chênh lệch là tiền chuyển từ bot mua sang bot bán.</p>
        <fieldset><legend>Trong thị trường đóng này, bán hàng cao hơn giá tham chiếu có tự tạo thêm giá trị cho toàn xã hội không?</legend>
          <button type="button" onClick={() => answer(false)} aria-pressed={answered === "wrong"}>Có, vì người bán thu nhiều tiền hơn</button>
          <button type="button" onClick={() => answer(true)}>Không, vì tiền và hàng chỉ chuyển chủ sở hữu</button>
        </fieldset>
        {answered === "wrong" && <p className={styles.wrong} role="status">Gợi ý: hãy đối chiếu tổng tiền và giá trị hàng tham chiếu trước và sau giao dịch.</p>}
      </section></div>}
      {answered === "correct" && hasSimulated && <div className={styles.transition} role="dialog" aria-modal="true" aria-labelledby="market-complete-title"><div className={styles.transitionCard}><div className={styles.routeScene} aria-hidden="true"><span className={styles.routeMarket}>◈<small>PHIÊN CHỢ</small></span><span className={styles.routeVehicle}>🚴</span><span className={styles.routeFactory}>♟<small>HỒ SƠ</small></span></div><small>CHẶNG 01 HOÀN THÀNH · BẢN ĐỒ ĐÃ CẬP NHẬT</small><h2 id="market-complete-title">Đường đến hồ sơ lao động đã sáng</h2><p>Tiền và hàng đổi chủ, nhưng giá trị tham chiếu toàn thị trường không tăng. Trở về bản đồ và chọn chặng 2 để tìm hàng hóa có khả năng tạo giá trị mới.</p><Link className={styles.next} href="/">Mở bản đồ hành trình →</Link></div></div>}
      {showResetConfirm && <div className={styles.transition} role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><div className={styles.transitionCard}><small>ĐẶT LẠI THÍ NGHIỆM</small><h2 id="reset-title">Bắt đầu lại thị trường?</h2><p id="reset-description">Số lượt và giao dịch hiện tại sẽ trở về ban đầu. Tiến độ chương đã hoàn thành vẫn được giữ.</p><div className={styles.confirmActions}><button type="button" autoFocus onClick={() => setShowResetConfirm(false)}>Tiếp tục quan sát</button><button type="button" onClick={() => { reset(); setShowResetConfirm(false); }}>Đặt lại thị trường</button></div></div></div>}
    </div>
  </GameShell>;
}

import type { Bot, CommodityId, MarketConfig, MarketState, Trade } from "./types";

export const DEFAULT_MARKET_CONFIG: MarketConfig = {
  botCount: 100,
  tradeProbability: 0.65,
  priceMargin: 0,
  simulationSpeed: 1,
};

const COMMODITIES = [
  { id: "essential" as const, name: "Hàng thiết yếu", category: "essential" as const, referenceValue: 10 },
  { id: "non-essential" as const, name: "Hàng không thiết yếu", category: "non-essential" as const, referenceValue: 20 },
];

function nextRandom(seed: number): [number, number] {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}

export function createMarket(config: MarketConfig = DEFAULT_MARKET_CONFIG, seed = 2026): MarketState {
  if (!Number.isInteger(config.botCount) || config.botCount < 2 || config.botCount > 1000) throw new RangeError("botCount must be between 2 and 1000");
  const bots: Bot[] = Array.from({ length: config.botCount }, (_, index) => ({
    id: `B${String(index + 1).padStart(3, "0")}`,
    money: 100,
    inventory: { essential: 6, "non-essential": 3 },
  }));
  return { bots, commodities: COMMODITIES, tradeCount: 0, transactionHistory: [], simulationTick: 0, randomSeed: seed >>> 0 };
}

export function getMarketTotals(state: MarketState) {
  const money = state.bots.reduce((sum, bot) => sum + bot.money, 0);
  const essential = state.bots.reduce((sum, bot) => sum + bot.inventory.essential, 0);
  const nonEssential = state.bots.reduce((sum, bot) => sum + bot.inventory["non-essential"], 0);
  return { money, essential, nonEssential, referenceValue: essential * 10 + nonEssential * 20 };
}

export function runMarketTicks(state: MarketState, config: MarketConfig, ticks = 1): MarketState {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > 100) throw new RangeError("ticks must be between 0 and 100");
  if (!Number.isFinite(config.tradeProbability) || config.tradeProbability < 0 || config.tradeProbability > 1) throw new RangeError("tradeProbability must be between 0 and 1");
  if (!Number.isFinite(config.priceMargin) || config.priceMargin < -0.5 || config.priceMargin > 0.5) throw new RangeError("priceMargin must be between -0.5 and 0.5");
  const bots = state.bots.map((bot) => ({ ...bot, inventory: { ...bot.inventory } }));
  const history: Trade[] = [...state.transactionHistory];
  let seed = state.randomSeed;
  let tradeCount = state.tradeCount;
  const draw = () => { const [value, next] = nextRandom(seed); seed = next; return value; };

  for (let tick = 0; tick < ticks; tick += 1) {
    for (let attempt = 0; attempt < Math.ceil(bots.length / 2); attempt += 1) {
      if (draw() > config.tradeProbability) continue;
      const sellerIndex = Math.floor(draw() * bots.length);
      const buyerOffset = 1 + Math.floor(draw() * (bots.length - 1));
      const buyerIndex = (sellerIndex + buyerOffset) % bots.length;
      const commodityId: CommodityId = draw() < 0.7 ? "essential" : "non-essential";
      const reference = commodityId === "essential" ? 10 : 20;
      const price = Math.round(reference * (1 + config.priceMargin) * 100) / 100;
      const seller = bots[sellerIndex];
      const buyer = bots[buyerIndex];
      if (seller.inventory[commodityId] < 1 || buyer.money < price) continue;
      seller.inventory[commodityId] -= 1;
      buyer.inventory[commodityId] += 1;
      seller.money = Math.round((seller.money + price) * 100) / 100;
      buyer.money = Math.round((buyer.money - price) * 100) / 100;
      tradeCount += 1;
      history.push({ sellerId: seller.id, buyerId: buyer.id, commodityId, quantity: 1, price, timestamp: state.simulationTick + tick + 1 });
    }
  }
  return { ...state, bots, tradeCount, transactionHistory: history.slice(-12), simulationTick: state.simulationTick + ticks, randomSeed: seed };
}

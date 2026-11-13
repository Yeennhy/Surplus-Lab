export type CommodityId = "essential" | "non-essential";
export interface Commodity { id: CommodityId; name: string; category: CommodityId; referenceValue: number }
export interface Bot { id: string; money: number; inventory: Record<CommodityId, number> }
export interface Trade { sellerId: string; buyerId: string; commodityId: CommodityId; quantity: number; price: number; timestamp: number }
export interface MarketConfig { botCount: number; tradeProbability: number; priceMargin: number; simulationSpeed: number }
export interface MarketState { bots: Bot[]; commodities: Commodity[]; tradeCount: number; transactionHistory: Trade[]; simulationTick: number; randomSeed: number }

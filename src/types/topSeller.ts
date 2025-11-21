export interface ChannelMix {
  marketplace: number;
  distribution: number;
  retail: number;
}

export interface RegionalBreakdownEntry {
  region: string;
  percentage: number;
}

export interface TopSellerInsight {
  period: string;
  generatedAt: string;
  topSeller: {
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
    averageOrderValue: number;
    growthRatePct: number;
    channelMix: ChannelMix;
  };
  customerSignals: string[];
  regionalBreakdown: RegionalBreakdownEntry[];
  nextActions: string[];
}

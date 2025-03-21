'use client'

import { cn } from "@/lib/utils"

interface MarketInfoProps {
  symbol: string
}

export default function MarketInfo({ symbol }: MarketInfoProps) {
  // 模拟数据，实际应该从API获取
  const marketData = {
    lastPrice: '43521.23',
    priceChange: '+2.35',
    priceChangePercent: '+5.42',
    high24h: '44123.45',
    low24h: '41234.56',
    volume24h: '1234.56',
    amount24h: '53654321.23',
  }

  const isPositive = !marketData.priceChange.startsWith('-')

  return (
    <div className="space-y-4">
      {/* 交易对信息 */}
      <div className="flex items-baseline gap-4">
        <h2 className="text-xl font-bold">{symbol}</h2>
        <div className={cn(
          "text-lg font-medium",
          isPositive ? "text-green-500" : "text-red-500"
        )}>
          {marketData.lastPrice}
        </div>
        <div className={cn(
          "text-sm",
          isPositive ? "text-green-500" : "text-red-500"
        )}>
          {marketData.priceChange} ({marketData.priceChangePercent}%)
        </div>
      </div>

      {/* 24小时行情数据 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">24h最高</div>
          <div>{marketData.high24h}</div>
        </div>
        <div>
          <div className="text-muted-foreground">24h最低</div>
          <div>{marketData.low24h}</div>
        </div>
        <div>
          <div className="text-muted-foreground">24h成交量(BTC)</div>
          <div>{marketData.volume24h}</div>
        </div>
        <div>
          <div className="text-muted-foreground">24h成交额(USDT)</div>
          <div>{marketData.amount24h}</div>
        </div>
      </div>
    </div>
  )
} 
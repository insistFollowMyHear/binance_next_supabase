'use client'

interface RecentTradesProps {
  symbol: string
}

interface Trade {
  price: string
  amount: string
  time: string
  type: 'buy' | 'sell'
}

export default function RecentTrades({ symbol }: RecentTradesProps) {
  // 模拟数据，实际应该从API获取
  const trades: Trade[] = [
    { price: '43523.65', amount: '0.125', time: '12:30:25', type: 'buy' },
    { price: '43524.12', amount: '0.231', time: '12:30:20', type: 'sell' },
    { price: '43523.98', amount: '0.442', time: '12:30:15', type: 'buy' },
    { price: '43524.45', amount: '0.553', time: '12:30:10', type: 'sell' },
    { price: '43523.45', amount: '0.664', time: '12:30:05', type: 'buy' },
    { price: '43524.89', amount: '0.125', time: '12:30:00', type: 'sell' },
    { price: '43523.12', amount: '0.231', time: '12:29:55', type: 'buy' },
    { price: '43524.12', amount: '0.442', time: '12:29:50', type: 'sell' },
    { price: '43523.98', amount: '0.553', time: '12:29:45', type: 'buy' },
    { price: '43524.45', amount: '0.664', time: '12:29:40', type: 'sell' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-medium">最近成交</h3>
      
      {/* 表头 */}
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div>价格(USDT)</div>
        <div className="text-right">数量(BTC)</div>
        <div className="text-right">时间</div>
      </div>

      {/* 成交列表 */}
      <div className="space-y-1">
        {trades.map((trade, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 text-xs hover:bg-muted/50"
          >
            <div className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
              {trade.price}
            </div>
            <div className="text-right">{trade.amount}</div>
            <div className="text-right">{trade.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 
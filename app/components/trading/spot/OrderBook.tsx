'use client'

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
// import { getBinanceDepth } from "@/app/services/binance"

interface OrderBookProps {
  symbol: string
}

interface OrderBookItem {
  price: string
  amount: string
  total: string
  percentage: number
}

export default function OrderBook({ symbol }: OrderBookProps) {

  // 模拟数据，实际应该从API获取
  const asks: OrderBookItem[] = [
    { price: '43525.12', amount: '0.125', total: '5440.64', percentage: 20 },
    { price: '43524.89', amount: '0.231', total: '10054.25', percentage: 40 },
    { price: '43524.45', amount: '0.442', total: '19237.81', percentage: 60 },
    { price: '43524.12', amount: '0.553', total: '24068.84', percentage: 80 },
    { price: '43523.98', amount: '0.664', total: '28899.92', percentage: 100 },
  ].reverse()

  const bids: OrderBookItem[] = [
    { price: '43523.45', amount: '0.125', total: '5440.43', percentage: 20 },
    { price: '43523.12', amount: '0.231', total: '10053.84', percentage: 40 },
    { price: '43522.98', amount: '0.442', total: '19237.16', percentage: 60 },
    { price: '43522.45', amount: '0.553', total: '24067.91', percentage: 80 },
    { price: '43522.12', amount: '0.664', total: '28898.69', percentage: 100 },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-medium">订单簿</h3>
      
      {/* 表头 */}
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div>价格(USDT)</div>
        <div className="text-right">数量(BTC)</div>
        <div className="text-right">累计(BTC)</div>
      </div>

      {/* 卖单 */}
      <div className="space-y-1">
        {asks.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 text-xs relative"
          >
            <div className="absolute inset-0 bg-red-500/10" style={{ width: `${order.percentage}%` }} />
            <div className="relative text-red-500">{order.price}</div>
            <div className="relative text-right">{order.amount}</div>
            <div className="relative text-right">{order.total}</div>
          </div>
        ))}
      </div>

      {/* 最新价格 */}
      <div className="text-lg font-medium text-center py-2">
        43523.65 USDT
      </div>

      {/* 买单 */}
      <div className="space-y-1">
        {bids.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 text-xs relative"
          >
            <div className="absolute inset-0 bg-green-500/10" style={{ width: `${order.percentage}%` }} />
            <div className="relative text-green-500">{order.price}</div>
            <div className="relative text-right">{order.amount}</div>
            <div className="relative text-right">{order.total}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 
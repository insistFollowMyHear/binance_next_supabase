'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import OrderForm from "@/app/components/trading/spot/OrderForm"
import MarketInfo from "@/app/components/trading/spot/MarketInfo"
import OrderBook from "@/app/components/trading/spot/OrderBook"
import RecentTrades from "@/app/components/trading/spot/RecentTrades"
import OrderHistory from "@/app/components/trading/spot/OrderHistory"
import { useAppSelector } from "@/lib/redux/hooks"
import { redirect } from "next/navigation"
export default function SpotTradingPage() {
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn)
  if (!isLoggedIn) {
    redirect('/sign-in')
  }

  const [symbol, setSymbol] = useState('BTC/USDT')
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit')

  return (
    // 版心宽度调整
    <div className="w-full max-w-screen-xl mx-auto p-4 md:p-10">
      {/* 订单簿和最近成交 和 行情信息和交易表单 一栏*/}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-3">
          <div className="space-y-4">
            <Card className="p-4">
              <OrderBook symbol={symbol} />
            </Card>
            <Card className="p-4 md:hidden">
              <RecentTrades symbol={symbol} />
            </Card>
          </div>
        </div>
        <div className="md:col-span-3 space-y-4">
          <Card className="p-4">
            <MarketInfo symbol={symbol} />
          </Card>
          <Card className="p-4">
            <Tabs value={orderType} onValueChange={(value: any) => setOrderType(value as 'limit' | 'market')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="limit">限价交易</TabsTrigger>
                <TabsTrigger value="market">市价交易</TabsTrigger>
              </TabsList>
              <TabsContent value="limit">
                <OrderForm type="limit" symbol={symbol} />
              </TabsContent>
              <TabsContent value="market">
                <OrderForm type="market" symbol={symbol} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      {/* 订单历史 一栏*/}
      <div className="pt-4">
        <Card className="p-4">
          <OrderHistory symbol={symbol} />
        </Card>
      </div>
    </div>
  )
} 
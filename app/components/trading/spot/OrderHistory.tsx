'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderHistoryProps {
  symbol: string
}

interface Order {
  id: string
  symbol: string
  type: 'limit' | 'market'
  side: 'buy' | 'sell'
  price: string
  amount: string
  filled: string
  status: 'open' | 'filled' | 'canceled'
  time: string
}

export default function OrderHistory({ symbol }: OrderHistoryProps) {
  // 模拟数据，实际应该从API获取
  const openOrders: Order[] = [
    {
      id: '1234567',
      symbol: 'BTC/USDT',
      type: 'limit',
      side: 'buy',
      price: '43523.65',
      amount: '0.125',
      filled: '0.000',
      status: 'open',
      time: '2024-03-20 12:30:25',
    },
    {
      id: '1234568',
      symbol: 'BTC/USDT',
      type: 'limit',
      side: 'sell',
      price: '43524.12',
      amount: '0.231',
      filled: '0.100',
      status: 'open',
      time: '2024-03-20 12:30:20',
    },
  ]

  const orderHistory: Order[] = [
    {
      id: '1234565',
      symbol: 'BTC/USDT',
      type: 'market',
      side: 'buy',
      price: '43523.98',
      amount: '0.442',
      filled: '0.442',
      status: 'filled',
      time: '2024-03-20 12:29:15',
    },
    {
      id: '1234566',
      symbol: 'BTC/USDT',
      type: 'limit',
      side: 'sell',
      price: '43524.45',
      amount: '0.553',
      filled: '0.000',
      status: 'canceled',
      time: '2024-03-20 12:29:10',
    },
  ]

  const OrderTable = ({ orders }: { orders: Order[] }) => (
    <div className="space-y-2">
      {/* 桌面端表头 */}
      <div className="hidden md:grid md:grid-cols-7 gap-2 text-xs text-muted-foreground">
        <div>时间</div>
        <div>交易对</div>
        <div>类型</div>
        <div className="text-right">价格</div>
        <div className="text-right">数量</div>
        <div className="text-right">已成交</div>
        <div className="text-right">状态</div>
      </div>
      <div className="space-y-1">
        {orders.map((order) => (
          <div key={order.id}>
            {/* 桌面端布局 */}
            <div className="hidden md:grid md:grid-cols-7 gap-2 text-xs hover:bg-muted/50 py-2">
              <div>{order.time}</div>
              <div>{order.symbol}</div>
              <div className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                {order.side === 'buy' ? '买入' : '卖出'} {order.type === 'limit' ? '限价' : '市价'}
              </div>
              <div className="text-right">{order.price}</div>
              <div className="text-right">{order.amount}</div>
              <div className="text-right">{order.filled}</div>
              <div className="text-right">
                {order.status === 'open' ? '进行中' : order.status === 'filled' ? '已完成' : '已取消'}
              </div>
            </div>
            
            {/* 移动端布局 */}
            <div className="md:hidden p-3 space-y-2 border-b hover:bg-muted/50">
              <div className="flex justify-between items-center">
                <div className={`text-sm ${order.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {order.side === 'buy' ? '买入' : '卖出'} {order.type === 'limit' ? '限价' : '市价'}
                </div>
                <div className="text-xs text-muted-foreground">{order.time}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground text-xs">价格</div>
                <div className="text-right">{order.price}</div>
                
                <div className="text-muted-foreground text-xs">数量</div>
                <div className="text-right">{order.amount}</div>
                
                <div className="text-muted-foreground text-xs">已成交</div>
                <div className="text-right">{order.filled}</div>
                
                <div className="text-muted-foreground text-xs">状态</div>
                <div className="text-right">
                  {order.status === 'open' ? '进行中' : order.status === 'filled' ? '已完成' : '已取消'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <h3 className="font-medium">订单</h3>
      
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open">当前委托</TabsTrigger>
          <TabsTrigger value="history">历史委托</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <OrderTable orders={openOrders} />
        </TabsContent>
        <TabsContent value="history">
          <OrderTable orders={orderHistory} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 
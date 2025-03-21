'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OrderFormProps {
  type: 'limit' | 'market'
  symbol: string
}

export default function OrderForm({ type, symbol }: OrderFormProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [total, setTotal] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现下单逻辑
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 买卖切换 */}
      <div className="flex rounded-lg overflow-hidden">
        <Button
          type="button"
          variant={side === 'buy' ? 'default' : 'outline'}
          onClick={() => setSide('buy')}
          className={cn(
            'flex-1 rounded-none',
            side === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''
          )}
        >
          买入
        </Button>
        <Button
          type="button"
          variant={side === 'sell' ? 'default' : 'outline'}
          onClick={() => setSide('sell')}
          className={cn(
            'flex-1 rounded-none',
            side === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''
          )}
        >
          卖出
        </Button>
      </div>

      {/* 价格输入 */}
      {type === 'limit' && (
        <div className="space-y-2">
          <Label>价格</Label>
          <div className="relative">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="输入价格"
              className="pr-16"
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              USDT
            </div>
          </div>
        </div>
      )}

      {/* 数量输入 */}
      <div className="space-y-2">
        <Label>数量</Label>
        <div className="relative">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="输入数量"
            className="pr-16"
          />
          <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            BTC
          </div>
        </div>
      </div>

      {/* 总额 */}
      {type === 'limit' && (
        <div className="space-y-2">
          <Label>总额</Label>
          <div className="relative">
            <Input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="输入总额"
              className="pr-16"
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              USDT
            </div>
          </div>
        </div>
      )}

      {/* 百分比选择器 */}
      <div className="grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((percent) => (
          <Button
            key={percent}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: 实现百分比选择逻辑
            }}
          >
            {percent}%
          </Button>
        ))}
      </div>

      {/* 提交按钮 */}
      <Button
        type="submit"
        className={cn(
          'w-full',
          side === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        )}
      >
        {side === 'buy' ? '买入' : '卖出'} {symbol.split('USDT')[0]}
      </Button>
    </form>
  )
} 
'use client'

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface OrderBookProps {
  symbol: string;
}

interface DepthData {
  bids: string[][];
  asks: string[][];
  lastUpdateId: number;
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const [depthData, setDepthData] = useState<DepthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 将交易对格式从 BTC/USDT 转换为 BTCUSDT
  const formatSymbol = (symbol: string) => {
    return symbol.replace('/', '');
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchOrderBookData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const formattedSymbol = formatSymbol(symbol);
        const response = await fetch(`/api/spot/depth?symbol=${formattedSymbol}&limit=10`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order book data');
        }
        
        const data = await response.json();
        
        if (isMounted) {
          if (data.success && data.data) {
            setDepthData(data.data);
          } else {
            setError(data.error || 'Unknown error occurred');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Failed to fetch data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchOrderBookData();
    
    // 每5秒刷新一次数据
    const intervalId = setInterval(fetchOrderBookData, 3000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [symbol]);

  // 格式化价格显示，保留适当的小数位
  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 格式化数量显示
  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    });
  };

  if (isLoading && !depthData) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">错误: {error}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {/* 卖单 (Asks) - 从高到低显示 */}
        <div>
          <h4 className="text-md font-medium mb-2 text-red-500">卖单</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">价格</TableHead>
                <TableHead className="text-right">数量</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depthData?.asks.slice().reverse().map((ask, index) => (
                <TableRow key={`ask-${index}`}>
                  <TableCell className="text-right text-red-500">{formatPrice(ask[0])}</TableCell>
                  <TableCell className="text-right">{formatAmount(ask[1])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* 买单 (Bids) - 从高到低显示 */}
        <div>
          <h4 className="text-md font-medium mb-2 text-green-500">买单</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">价格</TableHead>
                <TableHead className="text-right">数量</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depthData?.bids.map((bid, index) => (
                <TableRow key={`bid-${index}`}>
                  <TableCell className="text-right text-green-500">{formatPrice(bid[0])}</TableCell>
                  <TableCell className="text-right">{formatAmount(bid[1])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 
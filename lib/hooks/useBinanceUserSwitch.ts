'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setBinanceUser } from '@/lib/redux/slices/userSlice';

export function useBinanceUserSwitch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const switchBinanceUser = async (binanceUserId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/update-binance-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ binanceUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '切换用户失败');
      }

      // 更新 Redux 状态
      dispatch(setBinanceUser(data.binanceUserId));
      
      // 刷新页面以获取新的用户设置
      window.location.reload();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '切换用户失败';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    switchBinanceUser,
    isLoading,
    error,
  };
} 
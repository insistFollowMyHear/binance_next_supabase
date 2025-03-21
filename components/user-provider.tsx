'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setUser, setBinanceUser } from '@/lib/redux/slices/userSlice';

export function UserProvider({ 
  user, 
  binanceUser 
}: { 
  user: any; 
  binanceUser?: string | null;
}) {
  const dispatch = useAppDispatch();

  // 组件挂载时将用户信息存储到 Redux
  useEffect(() => {
    if (user) {
      dispatch(setUser({
        id: user.id,
        email: user.email,
        isLoggedIn: true,
      }));
    }

    if (binanceUser) {
      dispatch(setBinanceUser(binanceUser));
    }
  }, [dispatch, user, binanceUser]);

  // 这个组件不渲染任何内容，只是更新 Redux 状态
  return null;
} 
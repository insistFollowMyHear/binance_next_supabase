import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import Binance from 'node-binance-api';

export interface BinanceUser {
  id: string;
  api_key: string;
  secret_key: string;
  nickname: string | null;
  avatar_url: string | null;
}

export async function getBinanceUser(userId: string): Promise<BinanceUser | null> {
  const supabase = await createClient();
  
  // 首先获取用户当前选中的币安账户ID
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('current_binance_user_id')
    .eq('user_id', userId)
    .single();

  // 如果没有选中的账户，获取最新绑定的账户
  const query = supabase
    .from('binance_users')
    .select('id, api_key, secret_key, nickname, avatar_url')
    .eq('user_id', userId);

  if (preferences?.current_binance_user_id) {
    // 如果有选中的账户，就获取该账户
    query.eq('id', preferences.current_binance_user_id);
  } else {
    // 否则获取最新绑定的账户
    query.order('created_at', { ascending: false });
  }

  const { data: binanceUser, error } = await query.single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching binance user:', error);
    return null;
  }

  return binanceUser;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getBinanceUserInfo(userInfo: BinanceUser) {
  if (!userInfo || !userInfo.api_key || !userInfo.secret_key) {
    console.error('Missing required API credentials');
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: userInfo.api_key,
        apiSecret: userInfo.secret_key
      }),
      mode: 'cors'
    });

    const data = await response.json();
    
    if (!data.success) {
      console.error('Error from Binance API:', data.error);
      return null;
    }

    // 处理账户数据
    const accountData = data.data;
    const spotAssets = accountData.balances
      .filter((balance: any) => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0)
      .map((balance: any) => ({
        coin: balance.asset,
        balance: (parseFloat(balance.free) + parseFloat(balance.locked)).toString(),
        value: 0, // 这个需要额外调用价格API来计算
        price: 0, // 需要额外调用价格API
        change24h: 0, // 需要额外调用24小时价格变化API
        priceAlert: { high: 0, low: 0 } // 这个可能需要从你的数据库中获取
      }));

    return {
      success: true,
      data: {
        currencies: mockData.currencies, // 保持原有的货币列表
        spotAssets,
        accountInfo: {
          makerCommission: accountData.makerCommission,
          takerCommission: accountData.takerCommission,
          buyerCommission: accountData.buyerCommission,
          sellerCommission: accountData.sellerCommission,
          canTrade: accountData.canTrade,
          canWithdraw: accountData.canWithdraw,
          canDeposit: accountData.canDeposit,
        },
        usdtFutures: mockData.usdtFutures // 如果需要期货数据，需要调用不同的API
      }
    };
  } catch (error) {
    console.error('Error in getBinanceUserInfo:', error);
    return null;
  }
}

export async function getBinanceDepth() {
  const user: any = await getCurrentUser();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spot/depth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey: user.api_key,
      apiSecret: user.secret_key,
      symbol: 'BTCUSDT',
      limit: '20'
    })
  })
  const data = await response.json();
  return data;
}

// Mock data for the trading dashboard
export const mockData = {
  currencies: [
    { id: "USD", name: "US Dollar", symbol: "$" },
    { id: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { id: "EUR", name: "Euro", symbol: "€" },
  ],
  spotAssets: [
    { 
      coin: "BTC",
      balance: "2.5643",
      value: 112876.32,
      priceAlert: { high: 45000, low: 38000 },
      price: 43987.65,
      change24h: 2.34
    },
    { 
      coin: "ETH",
      balance: "15.3267",
      value: 43987.65,
      priceAlert: { high: 2800, low: 2200 },
      price: 2456.78,
      change24h: -1.23
    },
    { 
      coin: "BNB",
      balance: "156.4589",
      value: 54321.89,
      priceAlert: { high: 320, low: 280 },
      price: 312.45,
      change24h: 0.89
    }
  ],
  usdtFutures: {
    totalEquity: 256789.43,
    availableBalance: 123456.78,
    marginBalance: 98765.43,
    unrealizedPnL: 12345.67,
    positions: [
      {
        symbol: "BTCUSDT",
        side: "LONG",
        size: "2.5",
        entryPrice: 42000,
        markPrice: 43987.65,
        pnl: 4969.125,
        roe: 11.83,
        margin: 42000,
        leverage: "10x"
      },
      {
        symbol: "ETHUSDT",
        side: "SHORT",
        size: "25",
        entryPrice: 2500,
        markPrice: 2456.78,
        pnl: 1080.5,
        roe: 4.32,
        margin: 25000,
        leverage: "20x"
      }
    ]
  }
}; 
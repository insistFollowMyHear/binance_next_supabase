import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

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
import { createClient } from "@/utils/supabase/server";

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
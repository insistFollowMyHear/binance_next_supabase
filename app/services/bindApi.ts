import { createClient } from "@/utils/supabase/server";

export interface BinanceApiKeys {
  apiKey: string;
  secretKey: string;
  nickname?: string;
  avatarUrl?: string;
}

export async function saveBinanceApiKeys(userId: string, keys: BinanceApiKeys) {
  const supabase = await createClient();
  
  // 开始事务
  const { data: binanceUser, error: upsertError } = await supabase
    .from('binance_users')
    .insert({
      user_id: userId,
      api_key: keys.apiKey,
      secret_key: keys.secretKey,
      nickname: keys.nickname || null,
      avatar_url: keys.avatarUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (upsertError) {
    console.error('Error saving binance user:', upsertError);
    throw new Error("保存失败，请重试");
  }

  // 检查是否存在用户偏好记录
  const { data: existingPref } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', userId)
    .single();

  // 如果不存在，创建新的用户偏好记录
  if (!existingPref) {
    const { error: prefError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        current_binance_user_id: binanceUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (prefError) {
      console.error('Error creating user preferences:', prefError);
      // 不抛出错误，因为币安账户已经成功保存
    }
  }

  return binanceUser;
}

export async function getBinanceApiKeys(userId: string) {
  const supabase = await createClient();
  
  const { data: binanceUsers, error } = await supabase
    .from('binance_users')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching binance users:', error);
    throw new Error("获取币安账户失败，请重试");
  }

  return binanceUsers;
}

export async function getCurrentBinanceUser(userId: string) {
  const supabase = await createClient();
  
  // 获取当前选中的币安账户ID
  const { data: userPref, error: prefError } = await supabase
    .from('user_preferences')
    .select('current_binance_user_id')
    .eq('user_id', userId)
    .single();

  if (prefError) {
    console.error('Error fetching user preferences:', prefError);
    return null;
  }

  if (!userPref?.current_binance_user_id) {
    return null;
  }

  // 获取币安账户详情
  const { data: binanceUser, error: userError } = await supabase
    .from('binance_users')
    .select('*')
    .eq('id', userPref.current_binance_user_id)
    .single();

  if (userError) {
    console.error('Error fetching binance user:', userError);
    return null;
  }

  return binanceUser;
}

export async function switchBinanceUser(userId: string, binanceUserId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      current_binance_user_id: binanceUserId,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error switching binance user:', error);
    throw new Error("切换账户失败，请重试");
  }
}

export async function unbindBinanceUser(userId: string, binanceUserId: string) {
  const supabase = await createClient();
  
  // 开始事务
  const { error: deleteError } = await supabase
    .from('binance_users')
    .delete()
    .eq('id', binanceUserId)
    .eq('user_id', userId);

  if (deleteError) {
    console.error('Error deleting binance user:', deleteError);
    throw new Error("解绑失败，请重试");
  }

  // 获取用户的所有币安账户
  const { data: remainingUsers, error: fetchError } = await supabase
    .from('binance_users')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching remaining users:', fetchError);
    throw new Error("解绑后更新偏好失败，请刷新页面");
  }

  // 更新用户偏好
  const { error: updateError } = await supabase
    .from('user_preferences')
    .update({
      current_binance_user_id: remainingUsers?.[0]?.id || null,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating user preferences:', updateError);
    // 不抛出错误，因为解绑已经成功
  }
} 
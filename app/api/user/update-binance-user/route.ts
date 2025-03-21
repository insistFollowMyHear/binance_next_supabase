import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  try {
    const { binanceUserId } = await request.json();
    
    if (!binanceUserId) {
      return NextResponse.json({ error: 'Binance user ID is required' }, { status: 400 });
    }

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 验证 binanceUserId 是否属于当前用户
    const { data: binanceUser, error: verifyError } = await supabase
      .from('binance_users')
      .select('id')
      .eq('id', binanceUserId)
      .eq('user_id', user.id)
      .single();

    if (verifyError || !binanceUser) {
      return NextResponse.json({ error: 'Invalid Binance account' }, { status: 400 });
    }

    // 检查用户偏好是否已存在
    const { data: existingPref, error: checkError } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let updateError;
    if (existingPref) {
      // 更新现有记录
      const { error } = await supabase
        .from('user_preferences')
        .update({
          current_binance_user_id: binanceUserId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      updateError = error;
    } else {
      // 创建新记录
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          current_binance_user_id: binanceUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      updateError = error;
    }

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    return NextResponse.json({ success: true, binanceUserId });
  } catch (error) {
    console.error('Error in update binance user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
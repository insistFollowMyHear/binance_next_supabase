import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 获取当前登录用户
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 获取URL参数
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol') || 'BTCUSDT';
    const limit = url.searchParams.get('limit') || '10';

    // 获取用户当前选中的币安账户
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('current_binance_user_id')
      .eq('user_id', session.user.id)
      .single();

    // 查询币安账户信息
    const { data: binanceUser } = await supabase
      .from('binance_users')
      .select('api_key, secret_key')
      .eq('id', preferences?.current_binance_user_id || '')
      .eq('user_id', session.user.id)
      .single();

    if (!binanceUser) {
      return NextResponse.json({ success: false, error: 'No Binance account found' }, { status: 404 });
    }

    // 调用外部API获取深度信息
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spot/depth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: binanceUser.api_key,
        apiSecret: binanceUser.secret_key,
        symbol,
        limit
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching depth data:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 
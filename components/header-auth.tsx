import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import UserMenu from "./user-menu";

async function getBinanceUsers(userId: string) {
  const supabase = await createClient();
  
  // 获取当前选中的币安账户ID
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('current_binance_user_id')
    .eq('user_id', userId)
    .single();

  // 获取所有币安账户
  const { data: binanceUsers, error } = await supabase
    .from('binance_users')
    .select('id, nickname, avatar_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching binance users:', error);
    return null;
  }

  return {
    users: binanceUsers,
    currentUserId: preferences?.current_binance_user_id || binanceUsers?.[0]?.id
  };
}

export default async function HeaderAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">登录</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">注册</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">登录</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">注册</Link>
        </Button>
      </div>
    );
  }

  // 获取用户绑定的币安账户信息
  const binanceData = await getBinanceUsers(user.id);

  return (
    <UserMenu 
      user={user} 
      binanceUsers={binanceData?.users || []} 
      currentBinanceUserId={binanceData?.currentUserId || null} 
    />
  );
}

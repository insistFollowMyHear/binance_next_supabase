import { signOutAction, switchBinanceUserAction, unbindBinanceUserAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Key, LogOut } from "lucide-react";
import UnbindButton from "@/app/components/unbind-button";

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

export default async function AuthButton() {
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
  const currentUser = binanceData?.users?.find(u => u.id === binanceData.currentUserId);

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-8 w-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatar_url || ''} />
              <AvatarFallback>
                {(currentUser?.nickname || user.email || '').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[150px] truncate">
              {currentUser?.nickname || user.email}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          
          {/* 币安账户列表 */}
          {binanceData?.users && binanceData.users.length > 0 ? (
            <>
              <DropdownMenuLabel className="text-xs text-gray-500">账户</DropdownMenuLabel>
              {binanceData.users.map((binanceUser) => (
                <div key={binanceUser.id} className="flex items-center px-2">
                  <form action={switchBinanceUserAction} className="flex-1">
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="binanceUserId" value={binanceUser.id} />
                    <DropdownMenuItem asChild>
                      <button type="submit" className="flex items-center gap-2 w-full">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={binanceUser.avatar_url || ''} />
                          <AvatarFallback>
                            {(binanceUser.nickname || '').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate">{binanceUser.nickname}</span>
                        {binanceUser.id === binanceData.currentUserId && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </button>
                    </DropdownMenuItem>
                  </form>
                  <UnbindButton
                    userId={user.id}
                    binanceUserId={binanceUser.id}
                    nickname={binanceUser.nickname || '未命名账户'}
                  />
                </div>
              ))}
              <DropdownMenuSeparator />
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 绑定币安API按钮 */}
      <Button asChild size="sm" variant="outline" className="gap-2">
        <Link href="/bind-api">
          <Key className="h-4 w-4" />
          <span>绑定API</span>
        </Link>
      </Button>

      {/* 退出登录按钮 */}
      <form action={signOutAction}>
        <Button type="submit" size="sm" variant="ghost" className="text-red-600 hover:text-red-700 gap-2">
          <LogOut className="h-4 w-4" />
          <span>退出</span>
        </Button>
      </form>
    </div>
  );
}

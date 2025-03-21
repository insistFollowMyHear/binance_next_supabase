'use client';

import { useAppSelector } from "@/lib/redux/hooks";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Key, LogOut } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import BinanceUserSwitcher from "./binance-user-switcher";
import UnbindButton from "@/app/components/unbind-button";

interface UserMenuProps {
  user: any;
  binanceUsers: Array<{
    id: string;
    nickname: string | null;
    avatar_url: string | null;
  }>;
  currentBinanceUserId: string | null;
}

export default function UserMenu({ user, binanceUsers, currentBinanceUserId }: UserMenuProps) {
  const currentUser = binanceUsers?.find(u => u.id === currentBinanceUserId);
  // 从Redux中获取更新后的当前币安用户ID
  const binanceUserIdFromRedux = useAppSelector(state => state.user.binanceUserId);
  
  // 如果Redux中有值，优先使用Redux中的值
  const effectiveCurrentUserId = binanceUserIdFromRedux || currentBinanceUserId;
  const effectiveCurrentUser = binanceUsers?.find(u => u.id === effectiveCurrentUserId) || currentUser;

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-8 w-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={effectiveCurrentUser?.avatar_url || ''} />
              <AvatarFallback>
                {(effectiveCurrentUser?.nickname || user.email || '').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[150px] truncate">
              {effectiveCurrentUser?.nickname || user.email}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          
          {/* 币安账户列表 */}
          {binanceUsers && binanceUsers.length > 0 ? (
            <>
              <DropdownMenuLabel className="text-xs text-gray-500">账户</DropdownMenuLabel>
              {binanceUsers.map((binanceUser) => (
                <div key={binanceUser.id} className="flex items-center px-2">
                  <div className="flex-1">
                    <BinanceUserSwitcher
                      userId={user.id}
                      binanceUser={binanceUser}
                      isCurrentUser={binanceUser.id === effectiveCurrentUserId}
                    />
                  </div>
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
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useBinanceUserSwitch } from "@/lib/hooks/useBinanceUserSwitch";
import { useAppSelector } from "@/lib/redux/hooks";
import { useState } from "react";

interface BinanceUserSwitcherProps {
  userId: string;
  binanceUser: {
    id: string;
    nickname: string | null;
    avatar_url: string | null;
  };
  isCurrentUser: boolean;
}

export default function BinanceUserSwitcher({ 
  userId, 
  binanceUser, 
  isCurrentUser 
}: BinanceUserSwitcherProps) {
  const [isPending, setIsPending] = useState(false);
  const { switchBinanceUser } = useBinanceUserSwitch();
  
  const handleSwitch = async () => {
    if (isCurrentUser) return; // 如果已经是当前用户，无需切换
    
    setIsPending(true);
    try {
      await switchBinanceUser(binanceUser.id);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenuItem 
      asChild 
      disabled={isPending || isCurrentUser}
      className={isCurrentUser ? 'bg-accent/50' : ''}
    >
      <button 
        type="button" 
        className="flex items-center gap-2 w-full" 
        onClick={handleSwitch}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src={binanceUser.avatar_url || ''} />
          <AvatarFallback>
            {(binanceUser.nickname || '').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="flex-1 truncate">
          {binanceUser.nickname || '未命名账户'}
          {isPending && ' (切换中...)'}
        </span>
        {isCurrentUser && (
          <div className="w-2 h-2 rounded-full bg-green-500" />
        )}
      </button>
    </DropdownMenuItem>
  );
} 
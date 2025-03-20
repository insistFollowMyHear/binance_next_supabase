"use client";

import { unbindBinanceUserAction } from "@/app/actions";
import { UnbindDialog } from "./unbind-dialog";

interface UnbindButtonProps {
  userId: string;
  binanceUserId: string;
  nickname: string;
}

export default function UnbindButton({ userId, binanceUserId, nickname }: UnbindButtonProps) {
  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('binanceUserId', binanceUserId);
    await unbindBinanceUserAction(formData);
  };

  return (
    <UnbindDialog 
      nickname={nickname} 
      onConfirm={handleConfirm}
    />
  );
} 
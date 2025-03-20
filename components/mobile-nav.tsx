'use client'

import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import Link from "next/link"
import { Key, LogOut } from "lucide-react"
import { signOutAction } from "@/app/actions"

interface MobileNavProps {
  isLoggedIn: boolean
}

export function MobileNav({ isLoggedIn }: MobileNavProps) {
  if (!isLoggedIn) {
    return (
      <div className="flex md:hidden gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">登录</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">注册</Link>
        </Button>
      </div>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>菜单</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          {/* 交易菜单 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">交易</h4>
            <div className="pl-2">
              <Link href="/spot" className="block py-2">
                现货交易
              </Link>
            </div>
          </div>

          {/* 合约菜单 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">合约</h4>
            <div className="pl-2 space-y-2">
              <Link href="/futures/usdt" className="block py-2">
                U本位合约
              </Link>
              <Link href="/futures/coin" className="block py-2">
                币本位合约
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/bind-api" className="flex items-center gap-2 py-2">
              <Key className="h-4 w-4" />
              <span>绑定API</span>
            </Link>
          </div>

          <form action={signOutAction}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 gap-2">
              <LogOut className="h-4 w-4" />
              <span>退出</span>
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 
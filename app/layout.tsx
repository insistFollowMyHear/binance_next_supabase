import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MobileNav } from "@/components/mobile-nav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              { isLoggedIn &&
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center">
                      <Link href="/" className="text-xl font-bold">币安</Link>
                      {/* 桌面端导航菜单 */}
                      <div className="hidden md:block">
                        <NavigationMenu>
                          <NavigationMenuList>
                            {/* 交易菜单 */}
                            <NavigationMenuItem>
                              <NavigationMenuTrigger>交易</NavigationMenuTrigger>
                              <NavigationMenuContent>
                                <ul className="w-[200px] p-2">
                                  <li>
                                    <Link href="/spot" legacyBehavior passHref>
                                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        现货交易
                                      </NavigationMenuLink>
                                    </Link>
                                  </li>
                                </ul>
                              </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* 合约菜单 */}
                            <NavigationMenuItem>
                              <NavigationMenuTrigger>合约</NavigationMenuTrigger>
                              <NavigationMenuContent>
                                <ul className="w-[200px] p-2 space-y-2">
                                  <li>
                                    <Link href="/futures/usdt" legacyBehavior passHref>
                                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        U本位合约
                                      </NavigationMenuLink>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/futures/coin" legacyBehavior passHref>
                                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        币本位合约
                                      </NavigationMenuLink>
                                    </Link>
                                  </li>
                                </ul>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenu>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* 移动端导航菜单 */}
                      <MobileNav isLoggedIn={isLoggedIn} />
                      {/* 桌面端用户菜单 */}
                      <div className="hidden md:block">
                        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                      </div>
                    </div>
                  </div>
                </nav>
              }
              <div className="w-full flex flex-col gap-20">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

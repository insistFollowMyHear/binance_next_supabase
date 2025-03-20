import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SmtpMessage } from "../smtp-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            币安
          </h1>
          <p className="text-muted-foreground text-sm">
            专业的加密资产管理平台
          </p>
        </div>

        {/* Signup Form Section */}
        <div className="backdrop-blur-sm bg-card/30 border border-primary/10 rounded-2xl p-8 shadow-xl shadow-primary/5">
          <form className="flex flex-col gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                注册
              </h2>
              <p className="text-sm text-center text-muted-foreground">
                已有账户？{" "}
                <Link 
                  className="text-primary hover:text-primary/80 transition-colors font-medium" 
                  href="/sign-in"
                >
                  登录
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-sm font-medium text-foreground/90"
                >
                  邮箱
                </Label>
                <Input 
                  name="email" 
                  placeholder="you@example.com" 
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-medium text-foreground/90"
                >
                  密码
                </Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="您的密码"
                  minLength={6}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <SubmitButton 
              formAction={signUpAction} 
              pendingText="注册中..."
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground transition-all duration-300"
            >
              注册
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>
      </div>
      
      <div className="w-full flex-1 flex items-center justify-center p-4">
        <SmtpMessage />
      </div>
    </div>
  );
}

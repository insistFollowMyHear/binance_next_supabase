import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/services/binance";
import { saveBinanceApiKeys } from "@/app/services/bindApi";
import { uploadAvatar } from "@/app/services/storage";
import AvatarUpload from "@/app/components/avatar-upload";

export default async function BindAPI() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  async function bindAPI(formData: FormData) {
    "use server";
    console.log("1. BindAPI");
    
    const apiKey = formData.get("apiKey") as string;
    const secretKey = formData.get("secretKey") as string;
    const nickname = formData.get("nickname") as string;
    // const avatarFile = formData.get("avatar") as File | null;
    // 通过 ref 获取 AvatarUpload 组件的文件
    const avatarFile = formData.get("avatar") as File | null;
    
    if (!apiKey || !secretKey) {
      throw new Error("API Key 和 Secret Key 都是必填的");
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("用户未登录");
    }

    // 处理头像上传
    let avatarUrl: string | undefined = undefined;
    if (avatarFile && avatarFile.size > 0) {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(avatarFile.type)) {
        throw new Error("头像必须是 JPG、PNG 或 GIF 格式");
      }

      // 验证文件大小（最大 2MB）
      if (avatarFile.size > 2 * 1024 * 1024) {
        throw new Error("头像文件大小不能超过 2MB");
      }

      const uploadedUrl = await uploadAvatar(currentUser.id, avatarFile);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      }
    }

    await saveBinanceApiKeys(currentUser.id, { 
      apiKey, 
      secretKey,
      nickname: nickname || undefined,
      avatarUrl
    });
    
    revalidatePath("/");
    redirect("/");
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">绑定币安 API</h1>
        <p className="mt-2 text-gray-600">请输入您的币安 API Key 和 Secret Key</p>
      </div>

      <form action={bindAPI} className="space-y-6 bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-lg">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              头像
            </label>
            <AvatarUpload />
          </div>

          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              昵称
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="请输入您的昵称（选填）"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="text"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="请输入您的 API Key"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
              Secret Key
            </label>
            <input
              id="secretKey"
              name="secretKey"
              type="password"
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="请输入您的 Secret Key"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                     text-white font-medium rounded-lg shadow-md hover:shadow-lg
                     transition-all duration-300"
          >
            确认绑定
          </button>
        </div>
      </form>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2">如何获取 API Key？</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>登录您的币安账户</li>
          <li>进入 API Management 页面</li>
          <li>点击 Create API</li>
          <li>完成安全验证</li>
          <li>保存好您的 API Key 和 Secret Key</li>
        </ol>
      </div>
    </div>
  );
} 
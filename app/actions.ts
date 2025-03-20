"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "邮箱和密码是必填的",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "请检查您的邮箱，点击验证链接完成注册",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function switchBinanceUserAction(formData: FormData) {
  "use server";
  
  const userId = formData.get("userId") as string;
  const binanceUserId = formData.get("binanceUserId") as string;
  
  if (!userId || !binanceUserId) {
    throw new Error("无效的用户ID");
  }

  const supabase = await createClient();

  try {
    // 首先验证 binanceUserId 是否属于该用户
    const { data: binanceUser, error: verifyError } = await supabase
      .from('binance_users')
      .select('id')
      .eq('id', binanceUserId)
      .eq('user_id', userId)
      .single();

    if (verifyError || !binanceUser) {
      console.error('Error verifying binance user:', verifyError);
      throw new Error("无效的币安账户");
    }

    // 检查用户偏好是否已存在
    const { data: existingPref, error: checkError } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking user preferences:', checkError);
      throw new Error("检查用户偏好时出错");
    }

    let error;
    if (existingPref) {
      // 更新现有记录
      const { error: updateError } = await supabase
        .from('user_preferences')
        .update({
          current_binance_user_id: binanceUserId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      error = updateError;
    } else {
      // 创建新记录
      const { error: insertError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          current_binance_user_id: binanceUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      error = insertError;
    }

    if (error) {
      console.error('Error updating user preferences:', error);
      throw new Error("更新用户偏好时出错");
    }

    revalidatePath("/");
  } catch (error) {
    console.error('Error in switchBinanceUserAction:', error);
    throw error instanceof Error ? error : new Error("切换用户时出错");
  }
}

export async function unbindBinanceUserAction(formData: FormData) {
  "use server";
  
  const userId = formData.get("userId") as string;
  const binanceUserId = formData.get("binanceUserId") as string;
  
  if (!userId || !binanceUserId) {
    throw new Error("无效的用户ID");
  }

  const supabase = await createClient();

  try {
    // 首先验证 binanceUserId 是否属于该用户
    const { data: binanceUser, error: verifyError } = await supabase
      .from('binance_users')
      .select('id')
      .eq('id', binanceUserId)
      .eq('user_id', userId)
      .single();

    if (verifyError || !binanceUser) {
      console.error('Error verifying binance user:', verifyError);
      throw new Error("无效的币安账户");
    }

    // 检查这是否是当前选中的账户
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('current_binance_user_id')
      .eq('user_id', userId)
      .single();

    const isCurrentUser = preferences?.current_binance_user_id === binanceUserId;

    // 删除币安账户
    const { error: deleteError } = await supabase
      .from('binance_users')
      .delete()
      .eq('id', binanceUserId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting binance user:', deleteError);
      throw new Error("删除账户失败");
    }

    // 获取用户剩余的币安账户数量
    const { data: remainingAccounts, error: countError } = await supabase
      .from('binance_users')
      .select('id')
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting remaining accounts:', countError);
      throw new Error("检查剩余账户失败");
    }

    // 如果没有剩余账户，删除用户偏好
    if (remainingAccounts.length === 0) {
      const { error: prefDeleteError } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', userId);

      if (prefDeleteError) {
        console.error('Error deleting user preferences:', prefDeleteError);
        throw new Error("删除用户偏好失败");
      }
    }
    // 如果删除的是当前选中的账户且还有其他账户，更新用户偏好
    else if (isCurrentUser) {
      // 更新用户偏好到最新的账户
      const { error: updateError } = await supabase
        .from('user_preferences')
        .update({
          current_binance_user_id: remainingAccounts[0].id,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating user preferences:', updateError);
        throw new Error("更新用户偏好失败");
      }
    }

    revalidatePath("/");
  } catch (error) {
    console.error('Error in unbindBinanceUserAction:', error);
    throw error instanceof Error ? error : new Error("解绑账户时出错");
  }
}

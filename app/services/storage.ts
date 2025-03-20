import { createClient } from "@/utils/supabase/server";

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const supabase = await createClient();
  
  // 生成唯一的文件名
  const fileExt = file.name.split('.').pop();
  // 使用 userId 作为文件夹名
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  // 上传文件到 binance 桶
  const { data, error } = await supabase
    .storage
    .from('binance')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  // 获取公共URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('binance')
    .getPublicUrl(fileName);

  return publicUrl;
} 
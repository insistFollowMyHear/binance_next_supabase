"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";

export default function AvatarUpload() {
  const [preview, setPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);

      // 更新隐藏的文件输入
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (document.getElementById('avatar-input')) {
        (document.getElementById('avatar-input') as HTMLInputElement).files = dataTransfer.files;
      }
    }
  };

  return (
    <div className="mt-1 flex flex-col items-center gap-4">
      <div 
        className="relative group cursor-pointer" 
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
        {/* 这是真正的表单输入，用于提交数据 */}
        <input
          id="avatar-input"
          name="avatar"
          type="file"
          className="hidden"
        />
        <Avatar className="h-24 w-24 ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all duration-300">
          <AvatarImage src={preview} />
          <AvatarFallback className="text-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors duration-300">
            上传
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
          点击上传
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center">
        支持 JPG、PNG、GIF<br />
        最大 2MB
      </div>
    </div>
  );
} 
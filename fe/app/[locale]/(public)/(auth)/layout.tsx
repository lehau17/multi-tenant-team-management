import Image from 'next/image'
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // 1. relative: Để làm điểm neo cho ảnh background
    // 2. min-h-screen: Đảm bảo layout cao ít nhất bằng màn hình thiết bị
    // 3. flex items-center justify-center: Căn giữa cái Form vào trung tâm
    <section className="relative w-full min-h-screen flex items-center justify-center bg-background">

      {/* Ảnh nền */}
      <Image
        alt='Background Image'
        src="/hinh-nen-auth.png"
        fill // Tự động tràn đầy section cha
        className='object-cover opacity-90' // object-cover để không méo ảnh
        priority // Ưu tiên load ảnh này ngay lập tức (thay cho loading="eager")
      />



      {/* Nội dung chính (Form) */}
      {/* z-10: Đưa nội dung nổi lên trên ảnh */}
      {/* relative: Bắt buộc phải có để z-index hoạt động */}
      <main className="relative z-10 w-full max-w-md p-4">
        {children}
      </main>

    </section>
  )
}

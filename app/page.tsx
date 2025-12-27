'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 检查是否已登录
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (token) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-zinc-400 text-lg">加载中...</div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // 检查是否已登录
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [mounted])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    setIsLoggedIn(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/dashboard', label: '首页' },
    { href: '/user', label: '用户中心' },
    { href: '/projects', label: '项目库' },
    { href: '/recommend', label: '智能推荐' },
    { href: '/history', label: '推荐记录' },
  ]

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xl">
              IA
            </div>
            <span className="text-xl font-semibold text-zinc-100">InvestAI</span>
          </Link>

          {/* Navigation Links */}
          {isLoggedIn && (
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              >
                退出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

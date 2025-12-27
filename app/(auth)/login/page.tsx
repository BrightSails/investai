'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 加载记住的用户名
  useEffect(() => {
    if (!mounted) return
    
    const remembered = localStorage.getItem('rememberedUsername')
    if (remembered) {
      setUsername(remembered)
      setRememberMe(true)
    }
  }, [mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      
      // 添加超时保护（15秒）
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '操作失败')
      }

      if (data.success) {
        login(data.user, data.token)
        
        // 记住我功能
        if (typeof window !== 'undefined') {
          if (rememberMe && isLogin) {
            localStorage.setItem('rememberedUsername', username)
          } else {
            localStorage.removeItem('rememberedUsername')
          }
        }
        
        router.push('/dashboard')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('❌ 服务器响应超时，请检查 Vercel KV 数据库配置')
      } else {
        setError(err instanceof Error ? err.message : '操作失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-950 font-bold text-2xl mb-4">
            IA
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">InvestAI</h1>
          <p className="text-zinc-400">智能投资推荐系统</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          {/* 切换按钮 */}
          <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
                placeholder={isLogin ? '请输入用户名' : '3-20个字符，仅限字母数字下划线'}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
                placeholder={isLogin ? '请输入密码' : '至少6个字符'}
                required
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 记住我 & 忘记密码 */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-zinc-950 border border-zinc-800 rounded cursor-pointer accent-zinc-100"
                  />
                  <span className="text-zinc-400">记住我</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  忘记密码？
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {isLogin ? '首次使用？' : '已有账号？'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="ml-1 text-zinc-300 hover:text-zinc-100 font-medium"
            >
              {isLogin ? '立即注册' : '去登录'}
            </button>
          </p>
        </div>
      </div>

      {/* 忘记密码模态框 */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 max-w-md w-full">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">忘记密码</h2>
            <p className="text-zinc-400 mb-6">
              目前系统暂不支持密码重置功能。请联系管理员或使用其他账号登录。
            </p>
            <p className="text-sm text-zinc-500 mb-6">
              提示：您可以重新注册一个新账号继续使用系统。
            </p>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

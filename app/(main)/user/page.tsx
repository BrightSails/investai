'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'

interface ProfileData {
  riskPreference: string
  investmentAmount: number
  investmentPeriod: string
  investmentGoal: string
}

export default function UserCenterPage() {
  const { user, token, updateUser, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profile, setProfile] = useState<ProfileData>({
    riskPreference: '稳健',
    investmentAmount: 0,
    investmentPeriod: '1-3年',
    investmentGoal: '稳健收益',
  })

  // 认证检查
  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login')
    }
  }, [isLoading, token, router])

  // 加载用户画像
  useEffect(() => {
    if (user?.profile) {
      setProfile({
        riskPreference: user.profile.riskPreference,
        investmentAmount: user.profile.investmentAmount,
        investmentPeriod: user.profile.investmentPeriod,
        investmentGoal: user.profile.investmentGoal,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '保存失败')
      }

      if (data.success) {
        setSuccess('保存成功！')
        setIsEditing(false)
        // 更新用户信息
        if (user) {
          updateUser({
            ...user,
            profile: data.profile,
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="mx-auto max-w-5xl">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">用户中心</h1>
          <p className="mt-2 text-zinc-400">管理您的账户信息和投资画像</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：个人信息展示 */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">个人信息</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">用户名</span>
                <span className="text-zinc-100 font-medium">{user.username}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">风险偏好</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.riskPreference === '保守' 
                    ? 'bg-blue-950 text-blue-300' 
                    : profile.riskPreference === '稳健'
                    ? 'bg-green-950 text-green-300'
                    : 'bg-red-950 text-red-300'
                }`}>
                  {profile.riskPreference || '未设置'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">投资金额</span>
                <span className="text-zinc-100 font-medium">
                  {profile.investmentAmount > 0 
                    ? `¥${profile.investmentAmount.toLocaleString()}` 
                    : '未设置'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-400">投资期限</span>
                <span className="text-zinc-100 font-medium">
                  {profile.investmentPeriod || '未设置'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-zinc-400">投资目标</span>
                <span className="text-zinc-100 font-medium">
                  {profile.investmentGoal || '未设置'}
                </span>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
              >
                编辑投资画像
              </button>
            )}
          </div>

          {/* 右侧：投资画像编辑器 */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">投资画像编辑</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 风险偏好 */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  风险偏好 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['保守', '稳健', '激进'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setProfile({ ...profile, riskPreference: option })}
                      disabled={!isEditing}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        profile.riskPreference === option
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 投资金额 */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-zinc-300 mb-2">
                  投资金额（元） <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  value={profile.investmentAmount}
                  onChange={(e) => setProfile({ ...profile, investmentAmount: Number(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="请输入投资金额"
                  min="0"
                  required
                />
              </div>

              {/* 投资期限 */}
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-zinc-300 mb-2">
                  投资期限 <span className="text-red-400">*</span>
                </label>
                <select
                  id="period"
                  value={profile.investmentPeriod}
                  onChange={(e) => setProfile({ ...profile, investmentPeriod: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="1年以内">1年以内</option>
                  <option value="1-3年">1-3年</option>
                  <option value="3-5年">3-5年</option>
                  <option value="5年以上">5年以上</option>
                </select>
              </div>

              {/* 投资目标 */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-zinc-300 mb-2">
                  投资目标 <span className="text-red-400">*</span>
                </label>
                <select
                  id="goal"
                  value={profile.investmentGoal}
                  onChange={(e) => setProfile({ ...profile, investmentGoal: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="保本增值">保本增值</option>
                  <option value="稳健收益">稳健收益</option>
                  <option value="高收益增长">高收益增长</option>
                </select>
              </div>

              {/* 消息提示 */}
              {error && (
                <div className="bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-950/50 border border-green-900 text-green-300 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* 操作按钮 */}
              {isEditing && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '保存中...' : '保存信息'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setError('')
                      setSuccess('')
                      // 恢复原始数据
                      if (user?.profile) {
                        setProfile({
                          riskPreference: user.profile.riskPreference,
                          investmentAmount: user.profile.investmentAmount,
                          investmentPeriod: user.profile.investmentPeriod,
                          investmentGoal: user.profile.investmentGoal,
                        })
                      }
                    }}
                    className="flex-1 py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                  >
                    取消
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    hasProfile: false,
    projectCount: 0,
    recommendationCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router])

  const loadStats = async () => {
    try {
      // 检查画像
      const profileRes = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const profileData = await profileRes.json()

      // 获取项目数量
      const projectsRes = await fetch('/api/projects')
      const projectsData = await projectsRes.json()

      // 获取推荐数量
      const historyRes = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const historyData = await historyRes.json()

      setStats({
        hasProfile: !!profileData.profile,
        projectCount: projectsData.projects?.length || 0,
        recommendationCount: historyData.recommendations?.length || 0,
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">加载中...</div>
      </div>
    )
  }

  const features = [
    {
      icon: '👤',
      title: '用户中心',
      description: '管理您的投资画像，设置风险偏好、投资金额、期限和目标',
      href: '/user',
      status: stats.hasProfile ? '已完善' : '待完善',
      statusColor: stats.hasProfile ? 'text-green-400' : 'text-yellow-400',
    },
    {
      icon: '📊',
      title: '项目库',
      description: '浏览和管理投资项目，查看风险等级、预期收益率和投资门槛',
      href: '/projects',
      status: `${stats.projectCount} 个项目`,
      statusColor: 'text-blue-400',
    },
    {
      icon: '🤖',
      title: '智能推荐',
      description: '基于AI的个性化投资配置方案，根据您的画像智能匹配项目',
      href: '/recommend',
      status: stats.hasProfile ? '可用' : '需要画像',
      statusColor: stats.hasProfile ? 'text-green-400' : 'text-zinc-500',
    },
    {
      icon: '📜',
      title: '推荐记录',
      description: '查看历史推荐方案，追踪您的投资决策记录',
      href: '/history',
      status: `${stats.recommendationCount} 条记录`,
      statusColor: 'text-purple-400',
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 欢迎区域 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            欢迎回来，{user?.username || '用户'}！👋
          </h1>
          <p className="text-xl text-zinc-400">
            InvestAI - 您的智能投资推荐助手
          </p>
        </div>

        {/* 快速统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-zinc-400 text-sm mb-2">投资画像</div>
            <div className={`text-3xl font-bold ${stats.hasProfile ? 'text-green-400' : 'text-yellow-400'}`}>
              {stats.hasProfile ? '已完善' : '待完善'}
            </div>
            {!stats.hasProfile && (
              <Link 
                href="/user"
                className="text-sm text-zinc-500 hover:text-zinc-300 mt-2 inline-block"
              >
                立即完善 →
              </Link>
            )}
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-zinc-400 text-sm mb-2">项目库</div>
            <div className="text-3xl font-bold text-blue-400">
              {stats.projectCount}
            </div>
            <div className="text-sm text-zinc-500 mt-2">个投资项目</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="text-zinc-400 text-sm mb-2">推荐记录</div>
            <div className="text-3xl font-bold text-purple-400">
              {stats.recommendationCount}
            </div>
            <div className="text-sm text-zinc-500 mt-2">条历史记录</div>
          </div>
        </div>

        {/* 功能模块卡片 */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">功能模块</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{feature.icon}</div>
                  <div className={`text-sm font-medium ${feature.statusColor}`}>
                    {feature.status}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 text-zinc-500 group-hover:text-zinc-300 transition-colors text-sm">
                  进入模块 →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 快速操作提示 */}
        {!stats.hasProfile && (
          <div className="mt-12 bg-yellow-950/30 border border-yellow-900/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">
                  快速开始
                </h3>
                <p className="text-yellow-200/80 mb-4">
                  为了获得更精准的投资推荐，建议您先完善投资画像信息
                </p>
                <Link
                  href="/user"
                  className="inline-block px-6 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                >
                  立即完善画像
                </Link>
              </div>
            </div>
          </div>
        )}

        {stats.hasProfile && stats.projectCount > 0 && (
          <div className="mt-12 bg-green-950/30 border border-green-900/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-2">
                  准备就绪！
                </h3>
                <p className="text-green-200/80 mb-4">
                  您的投资画像已完善，项目库有 {stats.projectCount} 个项目，现在可以生成智能推荐了
                </p>
                <Link
                  href="/recommend"
                  className="inline-block px-6 py-2 bg-green-400 text-zinc-950 rounded-lg font-medium hover:bg-green-300 transition-colors"
                >
                  生成智能推荐
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'

interface ProjectAllocation {
  projectId: number
  projectName: string
  allocationType: string
  allocationRatio: number
  expectedReturnContribution: number
  riskWarning: string
}

interface Recommendation {
  id: number
  userId: number
  overallExpectedReturn: number
  overallRiskLevel: number
  matchScore: number
  projectAllocations: ProjectAllocation[]
  reasoning: string
  createdAt: string
}

export default function HistoryPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)
  
  // 筛选条件
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }

    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router])

  // 应用筛选条件
  useEffect(() => {
    let filtered = [...recommendations]

    // 按时间段筛选
    if (startDate) {
      filtered = filtered.filter(rec => {
        const recDate = new Date(rec.createdAt)
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        return recDate >= start
      })
    }

    if (endDate) {
      filtered = filtered.filter(rec => {
        const recDate = new Date(rec.createdAt)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return recDate <= end
      })
    }

    // 按推荐时间倒序排列
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredRecommendations(filtered)
  }, [recommendations, startDate, endDate])

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getRiskLevelStars = (level: number) => {
    const colors = ['', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-orange-400', 'text-red-400']
    return (
      <span className={colors[level] || 'text-zinc-400'}>
        {'★'.repeat(level)}{'☆'.repeat(5 - level)}
      </span>
    )
  }

  const getRiskLevelText = (level: number) => {
    if (level <= 2) return '低风险'
    if (level === 3) return '中风险'
    if (level === 4) return '中高风险'
    return '高风险'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">推荐记录</h1>
          <p className="text-zinc-400">查看您的历史投资推荐方案</p>
        </div>

        {/* 筛选栏 */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                开始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                结束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              重置筛选
            </button>
          </div>

          {/* 筛选结果统计 */}
          <div className="mt-4 text-sm text-zinc-400">
            共找到 <span className="text-zinc-100 font-semibold">{filteredRecommendations.length}</span> 条推荐记录
          </div>
        </div>

        {/* 空状态 */}
        {filteredRecommendations.length === 0 && (
          <div className="bg-zinc-900 rounded-xl p-12 border border-zinc-800 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">
              {recommendations.length === 0 ? '暂无推荐记录' : '没有符合条件的记录'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {recommendations.length === 0 
                ? '您还没有生成过投资推荐方案' 
                : '请调整筛选条件重试'}
            </p>
            {recommendations.length === 0 && (
              <button
                onClick={() => router.push('/recommend')}
                className="px-6 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              >
                生成推荐方案
              </button>
            )}
          </div>
        )}

        {/* 推荐记录表格 */}
        {filteredRecommendations.length > 0 && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-zinc-300">
                      推荐时间
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-zinc-300">
                      综合预期收益率
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-zinc-300">
                      整体风险等级
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-zinc-300">
                      适配度
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-zinc-300">
                      配置项目数
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-zinc-300">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecommendations.map((rec, index) => (
                    <tr
                      key={rec.id}
                      className={`border-b border-zinc-800 hover:bg-zinc-800 transition-colors ${
                        index === filteredRecommendations.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-sm text-zinc-100">
                        <div className="font-medium">{formatDateShort(rec.createdAt)}</div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {new Date(rec.createdAt).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="text-green-400 font-semibold text-base">
                          {rec.overallExpectedReturn.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getRiskLevelStars(rec.overallRiskLevel)}
                          </span>
                          <span className="text-zinc-400 text-xs">
                            {getRiskLevelText(rec.overallRiskLevel)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="text-blue-400 font-semibold">
                          {rec.matchScore}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-zinc-100">
                        {rec.projectAllocations.length} 个
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedRecommendation(rec)}
                          className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 详情模态框 */}
        {selectedRecommendation && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800">
              {/* 模态框头部 */}
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 mb-1">推荐方案详情</h2>
                  <p className="text-sm text-zinc-500">
                    生成时间：{formatDate(selectedRecommendation.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className="text-zinc-400 hover:text-zinc-100 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 配置总览 */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-4">📊 配置总览</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-950 rounded-lg p-5 border border-zinc-800">
                      <div className="text-sm text-zinc-400 mb-2">综合预期收益率</div>
                      <div className="text-3xl font-bold text-green-400">
                        {selectedRecommendation.overallExpectedReturn.toFixed(2)}%
                      </div>
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-5 border border-zinc-800">
                      <div className="text-sm text-zinc-400 mb-2">整体风险等级</div>
                      <div className="text-3xl font-bold">
                        {getRiskLevelStars(selectedRecommendation.overallRiskLevel)}
                      </div>
                      <div className="text-sm text-zinc-500 mt-1">
                        {getRiskLevelText(selectedRecommendation.overallRiskLevel)}
                      </div>
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-5 border border-zinc-800">
                      <div className="text-sm text-zinc-400 mb-2">适配度评分</div>
                      <div className="text-3xl font-bold text-blue-400">
                        {selectedRecommendation.matchScore}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 推荐理由 */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-4">💡 推荐理由</h3>
                  <div className="bg-zinc-950 rounded-lg p-5 border border-zinc-800">
                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedRecommendation.reasoning}
                    </p>
                  </div>
                </div>

                {/* 项目配置列表 */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-4">
                    📈 项目配置列表（共 {selectedRecommendation.projectAllocations.length} 个项目）
                  </h3>
                  <div className="space-y-4">
                    {selectedRecommendation.projectAllocations.map((allocation, index) => (
                      <div
                        key={index}
                        className="bg-zinc-950 rounded-lg p-5 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-zinc-100">
                                {allocation.projectName}
                              </h4>
                              <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                                {allocation.allocationType}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold text-zinc-100">
                              {allocation.allocationRatio}%
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">配置比例</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">📈 预期收益贡献</div>
                            <div className="text-base font-semibold text-green-400">
                              +{allocation.expectedReturnContribution.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">⚠️ 风险提示</div>
                            <div className="text-sm text-zinc-300">
                              {allocation.riskWarning}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 关闭按钮 */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setSelectedRecommendation(null)}
                    className="px-8 py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

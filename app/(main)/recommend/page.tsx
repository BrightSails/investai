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

interface RecommendationResult {
  overallExpectedReturn: number
  overallRiskLevel: number
  matchScore: number
  projectAllocations: ProjectAllocation[]
  reasoning: string
}

export default function RecommendPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('https://api.openai.com/v1/chat/completions')
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const checkProfile = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      setHasProfile(!!data.profile)
    } catch (err) {
      console.error('检查画像失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('请先设置 OpenAI API Key')
      setShowApiSettings(true)
      return
    }

    setGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          apiKey,
          apiUrl,
          saveToHistory: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成推荐失败')
      }

      setRecommendation(data.recommendation)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成推荐失败')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!recommendation) return

    setGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          apiKey,
          apiUrl,
          saveToHistory: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '保存失败')
      }

      alert('✅ 推荐方案已保存到历史记录！')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setGenerating(false)
    }
  }

  const getRiskLevelColor = (level: number) => {
    if (level <= 2) return 'text-green-400'
    if (level === 3) return 'text-yellow-400'
    return 'text-red-400'
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
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">智能推荐</h1>
          <p className="text-zinc-400">基于您的投资画像，AI 为您生成个性化投资配置方案</p>
        </div>

        {/* 未完善画像提示 */}
        {!hasProfile && (
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">请先完善投资画像</h2>
            <p className="text-zinc-400 mb-6">
              为了生成更精准的投资推荐，请先前往用户中心完善您的投资画像信息
            </p>
            <button
              onClick={() => router.push('/user')}
              className="px-6 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              前往用户中心
            </button>
          </div>
        )}

        {/* 已完善画像 - 生成推荐区域 */}
        {hasProfile && (
          <>
            {/* API 设置 */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-100">API 设置</h2>
                <button
                  onClick={() => setShowApiSettings(!showApiSettings)}
                  className="text-sm text-zinc-400 hover:text-zinc-100"
                >
                  {showApiSettings ? '隐藏' : '显示'}
                </button>
              </div>

              {showApiSettings && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      OpenAI API Key *
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      API URL（可选）
                    </label>
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://api.openai.com/v1/chat/completions"
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    />
                    <p className="mt-2 text-sm text-zinc-500">
                      支持 OpenAI 兼容格式的 API（如国内中转服务）
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 生成按钮 */}
            {!recommendation && (
              <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-4">生成您的投资推荐</h2>
                <p className="text-zinc-400 mb-6">
                  AI 将根据您的风险偏好、投资金额、期限和目标，从项目库中为您推荐最优配置方案
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="px-8 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? '生成中...' : '生成我的投资推荐'}
                </button>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* 推荐结果 */}
            {recommendation && (
              <div className="space-y-6">
                {/* 配置总览 */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-bold text-zinc-100 mb-6">配置总览</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-zinc-950 rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">综合预期收益率</div>
                      <div className="text-2xl font-bold text-green-400">
                        {recommendation.overallExpectedReturn.toFixed(2)}%
                      </div>
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">整体风险等级</div>
                      <div className={`text-2xl font-bold ${getRiskLevelColor(recommendation.overallRiskLevel)}`}>
                        {'★'.repeat(recommendation.overallRiskLevel)}{'☆'.repeat(5 - recommendation.overallRiskLevel)}
                      </div>
                      <div className={`text-sm ${getRiskLevelColor(recommendation.overallRiskLevel)}`}>
                        {getRiskLevelText(recommendation.overallRiskLevel)}
                      </div>
                    </div>

                    <div className="bg-zinc-950 rounded-lg p-4">
                      <div className="text-sm text-zinc-400 mb-1">适配度</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {recommendation.matchScore}%
                      </div>
                      <div className="text-sm text-zinc-500">匹配您的需求</div>
                    </div>
                  </div>

                  {/* 推荐理由 */}
                  <div className="bg-zinc-950 rounded-lg p-4">
                    <div className="text-sm font-medium text-zinc-300 mb-2">推荐理由</div>
                    <div className="text-zinc-400 text-sm leading-relaxed">
                      {recommendation.reasoning}
                    </div>
                  </div>
                </div>

                {/* 项目配置列表 */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-bold text-zinc-100 mb-6">项目配置列表</h2>
                  
                  <div className="space-y-4">
                    {recommendation.projectAllocations.map((allocation, index) => (
                      <div
                        key={index}
                        className="bg-zinc-950 rounded-lg p-4 hover:bg-zinc-900 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-lg font-semibold text-zinc-100 mb-1">
                              {allocation.projectName}
                            </div>
                            <div className="text-sm text-zinc-500">
                              {allocation.allocationType}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-zinc-100">
                              {allocation.allocationRatio}%
                            </div>
                            <div className="text-sm text-zinc-500">配置比例</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">预期收益贡献</div>
                            <div className="text-sm font-medium text-green-400">
                              +{allocation.expectedReturnContribution.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">风险提示</div>
                            <div className="text-sm text-zinc-400">
                              {allocation.riskWarning}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={generating}
                    className="flex-1 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {generating ? '保存中...' : '保存推荐方案'}
                  </button>
                  <button
                    onClick={() => {
                      setRecommendation(null)
                      handleGenerate()
                    }}
                    disabled={generating}
                    className="flex-1 py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    重新生成推荐
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

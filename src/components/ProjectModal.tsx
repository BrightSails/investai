'use client'

import { useState, useEffect } from 'react'

interface Project {
  id?: number
  name: string
  type: string
  riskLevel: number
  expectedReturn: number
  investmentThreshold: number
  description?: string
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (project: Omit<Project, 'id'>) => void
  project?: Project | null
  loading?: boolean
}

export default function ProjectModal({ isOpen, onClose, onSubmit, project, loading }: ProjectModalProps) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    type: '基金',
    riskLevel: 3,
    expectedReturn: 0,
    investmentThreshold: 0,
    description: '',
  })

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        type: project.type,
        riskLevel: project.riskLevel,
        expectedReturn: project.expectedReturn,
        investmentThreshold: project.investmentThreshold,
        description: project.description || '',
      })
    } else {
      setFormData({
        name: '',
        type: '基金',
        riskLevel: 3,
        expectedReturn: 0,
        investmentThreshold: 0,
        description: '',
      })
    }
  }, [project, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  const riskLevels = [
    { value: 1, label: '★ 低风险' },
    { value: 2, label: '★★ 中低风险' },
    { value: 3, label: '★★★ 中风险' },
    { value: 4, label: '★★★★ 中高风险' },
    { value: 5, label: '★★★★★ 高风险' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">
          {project ? '编辑投资项目' : '添加投资项目'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 项目名称 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              项目名称 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              placeholder="例如：国债、指数基金"
              required
            />
          </div>

          {/* 项目类型 */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-zinc-300 mb-2">
              项目类型 <span className="text-red-400">*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              required
            >
              <option value="债券">债券</option>
              <option value="基金">基金</option>
              <option value="股票">股票</option>
              <option value="理财产品">理财产品</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {/* 风险等级 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              风险等级 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {riskLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, riskLevel: level.value })}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.riskLevel === level.value
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-100 border border-zinc-800'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 预期收益率 */}
            <div>
              <label htmlFor="expectedReturn" className="block text-sm font-medium text-zinc-300 mb-2">
                预期收益率（%） <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="expectedReturn"
                step="0.1"
                value={formData.expectedReturn}
                onChange={(e) => setFormData({ ...formData, expectedReturn: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                placeholder="例如：3.5"
                min="0"
                max="100"
                required
              />
            </div>

            {/* 投资门槛 */}
            <div>
              <label htmlFor="investmentThreshold" className="block text-sm font-medium text-zinc-300 mb-2">
                投资门槛（元） <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="investmentThreshold"
                value={formData.investmentThreshold}
                onChange={(e) => setFormData({ ...formData, investmentThreshold: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                placeholder="例如：10000"
                min="0"
                required
              />
            </div>
          </div>

          {/* 项目描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
              项目描述（可选）
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
              placeholder="简要描述项目特点..."
              rows={3}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : project ? '保存修改' : '添加项目'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

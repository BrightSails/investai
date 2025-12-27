'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectModal from '@/src/components/ProjectModal'
import ConfirmDialog from '@/src/components/ConfirmDialog'

interface Project {
  id: number
  name: string
  type: string
  riskLevel: number
  expectedReturn: number
  investmentThreshold: number
  description?: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 筛选条件
  const [filterType, setFilterType] = useState('all')
  const [filterRiskLevel, setFilterRiskLevel] = useState(0)
  const [filterMaxThreshold, setFilterMaxThreshold] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // 应用筛选
  useEffect(() => {
    let filtered = [...projects]

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType)
    }

    if (filterRiskLevel > 0) {
      filtered = filtered.filter(p => p.riskLevel === filterRiskLevel)
    }

    if (filterMaxThreshold) {
      const threshold = parseFloat(filterMaxThreshold)
      filtered = filtered.filter(p => p.investmentThreshold <= threshold)
    }

    setFilteredProjects(filtered)
  }, [projects, filterType, filterRiskLevel, filterMaxThreshold])

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setProjects(data.projects)
      }
    } catch (err) {
      console.error('加载项目失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (projectData: Omit<Project, 'id'>) => {
    setActionLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '添加失败')
      }

      setSuccess('项目添加成功！')
      setModalOpen(false)
      loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateProject = async (projectData: Omit<Project, 'id'>) => {
    if (!editingProject) return

    setActionLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '更新失败')
      }

      setSuccess('项目更新成功！')
      setModalOpen(false)
      setEditingProject(null)
      loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!deletingProjectId) return

    setActionLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/projects/${deletingProjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '删除失败')
      }

      setSuccess('项目删除成功！')
      setDeleteDialogOpen(false)
      setDeletingProjectId(null)
      loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    } finally {
      setActionLoading(false)
    }
  }

  const resetFilters = () => {
    setFilterType('all')
    setFilterRiskLevel(0)
    setFilterMaxThreshold('')
  }

  const getRiskLevelText = (level: number) => {
    const labels = ['', '★ 低风险', '★★ 中低风险', '★★★ 中风险', '★★★★ 中高风险', '★★★★★ 高风险']
    return labels[level] || ''
  }

  const getRiskLevelColor = (level: number) => {
    const colors = ['', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-orange-400', 'text-red-400']
    return colors[level] || ''
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        {/* 页面标题 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">项目库</h1>
            <p className="mt-2 text-zinc-400">管理投资项目，为智能推荐提供数据支撑</p>
          </div>
          <button
            onClick={() => {
              setEditingProject(null)
              setModalOpen(true)
            }}
            className="px-6 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
          >
            + 添加投资项目
          </button>
        </div>

        {/* 消息提示 */}
        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-900 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-950/50 border border-green-900 text-green-300 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* 高级筛选栏 */}
        <div className="mb-6 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">高级筛选</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              重置筛选
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 项目类型 */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">项目类型</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              >
                <option value="all">全部类型</option>
                <option value="债券">债券</option>
                <option value="基金">基金</option>
                <option value="股票">股票</option>
                <option value="理财产品">理财产品</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 风险等级 */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">风险等级</label>
              <select
                value={filterRiskLevel}
                onChange={(e) => setFilterRiskLevel(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              >
                <option value="0">全部等级</option>
                <option value="1">★ 低风险</option>
                <option value="2">★★ 中低风险</option>
                <option value="3">★★★ 中风险</option>
                <option value="4">★★★★ 中高风险</option>
                <option value="5">★★★★★ 高风险</option>
              </select>
            </div>

            {/* 投资门槛 */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">投资门槛（≤ X 元）</label>
              <input
                type="number"
                value={filterMaxThreshold}
                onChange={(e) => setFilterMaxThreshold(e.target.value)}
                placeholder="例如：10000"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* 项目数据表格 */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">项目名称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">风险等级</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">预期收益率</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">投资门槛</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                      {projects.length === 0 ? '暂无项目，点击上方按钮添加' : '没有符合筛选条件的项目'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4 text-zinc-100 font-medium">{project.name}</td>
                      <td className="px-6 py-4 text-zinc-400">{project.type}</td>
                      <td className={`px-6 py-4 font-medium ${getRiskLevelColor(project.riskLevel)}`}>
                        {getRiskLevelText(project.riskLevel)}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{project.expectedReturn.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-zinc-400">¥{project.investmentThreshold.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingProject(project)
                            setModalOpen(true)
                          }}
                          className="text-zinc-400 hover:text-zinc-100 transition-colors mr-4"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProjectId(project.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mt-4 text-sm text-zinc-400 text-center">
          共 {projects.length} 个项目
          {filteredProjects.length !== projects.length && ` · 当前显示 ${filteredProjects.length} 个`}
        </div>
      </div>

      {/* 新增/编辑模态框 */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingProject(null)
        }}
        onSubmit={editingProject ? handleUpdateProject : handleAddProject}
        project={editingProject}
        loading={actionLoading}
      />

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="确认删除"
        message="确定要删除这个投资项目吗？此操作不可撤销。"
        confirmText="删除"
        onConfirm={handleDeleteProject}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setDeletingProjectId(null)
        }}
        loading={actionLoading}
      />
    </div>
  )
}

'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  loading
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 max-w-md w-full">
        <h2 className="text-xl font-bold text-zinc-100 mb-4">{title}</h2>
        <p className="text-zinc-400 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-900 text-red-100 rounded-lg font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : confirmText}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 bg-zinc-800 text-zinc-100 rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Custom confirm dialog — no browser site-name header.
 */
'use client'

import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

export default function ConfirmDialog({
  open,
  title = 'Confirmation',
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Annuler',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  const confirmClass =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-dice-blue hover:bg-dice-blue-dark text-white'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          aria-label="Fermer"
        >
          <FaTimes />
        </button>

        <div className="text-center mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              tone === 'danger' ? 'bg-red-100 text-red-500' : 'bg-[#E8F3FE] text-[#0A89F2]'
            }`}
          >
            <FaExclamationTriangle className="text-xl" />
          </div>
          <h3 id="confirm-dialog-title" className="text-lg font-bold text-gray-800 mb-2">
            {title}
          </h3>
          {typeof message === 'string' ? (
            <p className="text-sm text-gray-600 whitespace-pre-line">{message}</p>
          ) : (
            <div className="text-sm text-gray-600">{message}</div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? 'Patientez…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

export default function LoadError({ onRetry, retryLabel = 'Réessayer' }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-center">
      <p className="text-sm font-semibold text-red-700">Impossible de charger</p>
      {typeof onRetry === 'function' ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}

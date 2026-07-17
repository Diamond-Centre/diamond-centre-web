'use client'

import Link from 'next/link'

export default function EventEditPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <div className="max-w-lg w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Modification indisponible
        </h1>
        <p className="text-gray-600 mb-6">
          La modification des événements sera activée lorsque l’API correspondante sera disponible.
        </p>
        <Link
          href="/events"
          className="inline-flex rounded-xl bg-dice-blue px-5 py-2.5 text-white hover:bg-dice-blue-dark transition-colors"
        >
          Retour aux événements
        </Link>
      </div>
    </div>
  )
}
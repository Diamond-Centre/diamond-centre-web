/**
 * Graphique des revenus mensuels - Version simplifiée
 */
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus mensuels</h3>
        <div className="h-80 flex items-center justify-center text-gray-400">
          Aucune donnée disponible
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus mensuels</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-sm text-dice-blue font-bold">{payload[0].value.toLocaleString()} FCFA</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="revenue" fill="#0a89f2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
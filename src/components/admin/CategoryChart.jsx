/**
 * Graphique des catégories d'événements
 */
'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const COLORS = ['#0a89f2', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']

export default function CategoryChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-dice-blue font-bold">
            {payload[0].value} événements ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Catégories d'événements</h3>
        <span className="text-xs text-gray-400">Distribution</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
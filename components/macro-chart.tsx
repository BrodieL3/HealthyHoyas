"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

type MacroData = {
  name: string
  value: number
  goal: number
  color: string
}

interface MacroChartProps {
  data?: MacroData[]
}

export function MacroChart({ data }: MacroChartProps) {
  const defaultData = [
    { name: "Protein", value: 95, goal: 120, color: "#3b82f6" },
    { name: "Carbs", value: 160, goal: 200, color: "#22c55e" },
    { name: "Fat", value: 45, goal: 65, color: "#eab308" },
  ]

  const chartData = data || defaultData

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          formatter={(value, entry, index) => {
            const item = chartData[index]
            return `${value}: ${Math.round(item.value)}g / ${item.goal}g`
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}


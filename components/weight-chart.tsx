"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function WeightChart() {
  const data = [
    { date: "Mar 19", weight: 167.5 },
    { date: "Mar 20", weight: 167.0 },
    { date: "Mar 21", weight: 166.5 },
    { date: "Mar 22", weight: 166.0 },
    { date: "Mar 23", weight: 165.5 },
    { date: "Mar 24", weight: 165.0 },
    { date: "Mar 25", weight: 165.0 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}


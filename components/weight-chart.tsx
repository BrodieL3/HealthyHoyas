"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { type WeightEntry } from "@/lib/supabase"
import { format, parseISO } from "date-fns"

interface WeightChartProps {
  weightEntries: WeightEntry[]
}

export function WeightChart({ weightEntries }: WeightChartProps) {
  // Format the data for the chart
  const data = weightEntries
    .slice(0, 7) // Get the last 7 entries
    .reverse() // Reverse to show oldest to newest
    .map(entry => ({
      date: format(parseISO(entry.date), "MMM d"),
      weight: entry.weight
    }))

  // If no data, show a message
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No weight data available yet.</p>
      </div>
    )
  }

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


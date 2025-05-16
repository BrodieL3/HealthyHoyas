"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { type SleepEntry } from "@/lib/supabase"
import { format, parseISO } from "date-fns" 

interface SleepChartProps {
    sleepEntries: SleepEntry[]
}

export function SleepChart({sleepEntries}: SleepChartProps) {
    const data = sleepEntries
        .slice() // make a shallow copy so we don't mutate the original
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // newest to oldest
        .slice(0, 7) // get the most recent 7
        .reverse()  // so they go from oldest to newest for chart x-axis
        .map(entry => ({
            date: format(parseISO(entry.date), "MMM d"),
            sleep: entry.sleep,
            quality: entry.sleep_quality
        }))

    if (data.length === 0 ) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No sleep data available yet.</p>
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
            <YAxis yAxisId="left" domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="sleep" 
                name="Sleep Duration (hours)"
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
            />
            <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="quality" 
                name="Sleep Quality (1-10)"
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      )
}
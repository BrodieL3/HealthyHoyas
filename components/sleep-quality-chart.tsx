"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { type SleepEntry } from "@/lib/supabase"
import { format, parseISO } from "date-fns" 

interface SleepQualityProps {
    sleepEntries: SleepEntry[]
}

export function SleepQualityChart({sleepEntries}: SleepQualityProps) {

    const data = sleepEntries
        .slice(0, 7)
        .reverse()
        .map(entry => ({
            date: format(parseISO(entry.date), "MMM d"),
            sleep_quality: entry.sleep_quality
        }))

    if(data.length === 0) {
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
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="sleep_quality" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      )
}
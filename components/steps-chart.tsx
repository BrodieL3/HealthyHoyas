"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { type StepsEntry } from "@/lib/supabase"
import { format, parseISO } from "date-fns" 
import { parse } from "path"

interface StepsChartProps {
    stepsEntries: StepsEntry[]
}

export function StepsChart({stepsEntries} : StepsChartProps) {
    const data = stepsEntries
        .slice(0,7)
        .reverse()
        .map(entry => ({
            date: format(parseISO(entry.date), "MMM d"),
            steps: entry.steps,
            quality: entry.steps_quality
        }))

        if (data.length === 0 ) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No steps data available yet.</p>
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
                    dataKey="steps" 
                    name="Amount of Steps"
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                />
                <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="quality" 
                    name="How You Felt (1-10)"
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )
    }
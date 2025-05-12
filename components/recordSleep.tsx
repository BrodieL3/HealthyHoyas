"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { saveSleepEntry, getUserSleepEntries, type SleepEntry } from "@/lib/supabase"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { SleepChart } from "./sleep-chart"
import { SleepQualityChart } from "./sleep-quality-chart"

export function LogSleep() {
  const [submitted, setSubmitted] = useState(false)
  const [sleep, setSleep] = useState("")
  const [sleepQuality, setSleepQuality] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSleepEntries() {
      try {
        setError(null)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError("Please sign in to view sleep entry") 
          return
        }

        const entries = await getUserSleepEntries(user.id)
        setSleepEntries(entries || [])
      } catch(error) {
        console.error("Error fetching sleep entries:", error)
        setError("Failed to load sleep history. Please try again later.")
      }
    }

    fetchSleepEntries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sleep) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const sleepValue = parseFloat(sleep)
      
      if (isNaN(sleepValue) || sleepValue <= 0) {
        setError("Please enter a valid sleep duration.")
        setIsLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("Please sign in to log your sleep")
        setIsLoading(false)
        return
      }
      
      const result = await saveSleepEntry(user.id, sleepValue, sleepQuality)
      
      if (result) {
        setSubmitted(true)
        setSleep("")
        setSleepQuality(5) // Reset to middle value
        
        // Refresh sleep entries
        const entries = await getUserSleepEntries(user.id)
        setSleepEntries(entries || [])
        
        toast.success("Sleep logged successfully!")
        
        setTimeout(() => {
          setSubmitted(false)
        }, 2000)
      } else {
        setError("Failed to log sleep. Please try again.")
        toast.error("Failed to log sleep. Please try again.")
      }
    } catch (error) {
      console.error("Error saving sleep:", error)
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Log Sleep</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record Your Sleep</CardTitle>
          <CardDescription>Keep track of your sleep patterns by logging your sleep duration and quality.</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-xl font-medium">Sleep Logged Successfully!</h3>
              <p className="text-muted-foreground text-center mt-1">Your sleep data has been updated.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="sleep">Sleep Duration</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="sleep"
                    type="number"
                    placeholder="e.g., 7.5"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    required
                    className="flex-1"
                    disabled={isLoading}
                    min="0"
                    step="0.1"
                  />
                  <span className="text-muted-foreground">hours</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Sleep Quality</Label>
                <div className="space-y-2">
                  <Slider
                    value={[sleepQuality]}
                    onValueChange={(value) => setSleepQuality(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Poor (1)</span>
                    <span>Excellent (10)</span>
                  </div>
                  <div className="text-center font-medium">
                    Rating: {sleepQuality}/10
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging..." : "Log Sleep"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle>Sleep History</CardTitle>
          <CardDescription>Your trend over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <SleepChart sleepEntries={sleepEntries} />
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Sleep Quality</CardTitle>
          <CardDescription>Your sleep quality over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <SleepQualityChart sleepEntries={sleepEntries} />
          </div>
        </CardContent>
      </Card>

      Need to decide if we want a single chart with two data points
      or 2 charts displaying each indivdual variable

      */}

    </div>
  )
}
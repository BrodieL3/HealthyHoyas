"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { WeightChart } from "@/components/weight-chart"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { saveWeightEntry, getUserWeightEntries, type WeightEntry } from "@/lib/supabase"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export function WeighIn() {
  const [submitted, setSubmitted] = useState(false)
  const [weight, setWeight] = useState("")
  const [syncHealth, setSyncHealth] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeightEntries() {
      try {
        setError(null)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError("Please sign in to view your weight history")
          return
        }

        const entries = await getUserWeightEntries(user.id)
        setWeightEntries(entries)
      } catch (error) {
        console.error("Error fetching weight entries:", error)
        setError("Failed to load weight history. Please try again later.")
      }
    }

    fetchWeightEntries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!weight) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const weightValue = parseFloat(weight)
      
      if (isNaN(weightValue) || weightValue <= 0) {
        setError("Please enter a valid weight value.")
        setIsLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("Please sign in to log your weight")
        setIsLoading(false)
        return
      }
      
      const result = await saveWeightEntry(user.id, weightValue)
      
      if (result) {
        setSubmitted(true)
        setWeight("")
        
        // Refresh weight entries
        const entries = await getUserWeightEntries(user.id)
        setWeightEntries(entries)
        
        toast.success("Weight logged successfully!")
        
        setTimeout(() => {
          setSubmitted(false)
        }, 2000)
      } else {
        setError("Failed to log weight. Please try again.")
        toast.error("Failed to log weight. Please try again.")
      }
    } catch (error) {
      console.error("Error saving weight:", error)
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Weigh In</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record Your Weight</CardTitle>
          <CardDescription>Keep track of your progress by logging your weight regularly.</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-xl font-medium">Weight Logged Successfully!</h3>
              <p className="text-muted-foreground text-center mt-1">Your weight data has been updated.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 165"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="flex-1"
                    disabled={isLoading}
                    min="0"
                    step="0.1"
                  />
                  <span className="text-muted-foreground">lbs</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="sync-health" checked={syncHealth} onCheckedChange={setSyncHealth} />
                <Label htmlFor="sync-health" className="cursor-pointer">
                  Sync with Apple Health
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging..." : "Log Weight"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
          <CardDescription>Your weight trend over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <WeightChart weightEntries={weightEntries} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


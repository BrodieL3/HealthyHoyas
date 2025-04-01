"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { WeightChart } from "@/components/weight-chart"
import { CheckCircle2 } from "lucide-react"

export function WeighIn() {
  const [submitted, setSubmitted] = useState(false)
  const [weight, setWeight] = useState("")
  const [syncHealth, setSyncHealth] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally save the data
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setWeight("")
    }, 2000)
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

              <Button type="submit" className="w-full">
                Log Weight
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
            <WeightChart />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


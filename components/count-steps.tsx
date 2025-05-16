"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { type StepsEntry, getUserStepsEntries, saveStepsEntry } from "@/lib/supabase"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { StepsChart } from "./steps-chart"

export function LogSteps() {

    const [submitted, setSubmitted]= useState(false)
    const [steps, setSteps] = useState("")
    const [stepsQuality, setStepsQuality] = useState(5)
    const [isLoading, setIsLoading] = useState(false)
    const [stepsEntries, setStepsEntries] = useState<StepsEntry[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStepsEntries() {
            try {
                setError(null)
                const supabase = createClient()

                const {data: {user}} = await supabase.auth.getUser()

                if (!user) {
                    setError("Please sign in to view steps")
                    return
                }

                const entries = await getUserStepsEntries(user.id)

                setStepsEntries(entries || [])

            } catch(error) {
                console.error("Error fetching sleep entries:", error)
                setError("Failed to load sleep history. Please try again later.")
            } 
        
            }
    
            fetchStepsEntries()
        }, [])

        const handleSubmit = async(e: React.FormEvent) => {
            e.preventDefault()

            if (!steps) return

            setIsLoading(true)
            setError(null)

            try {
                const stepsValue = parseFloat(steps)

                if (isNaN(stepsValue) || stepsValue < 0) {
                    setError("Please enter a valid steps count")
                    setIsLoading(false)
                    return
                }

                const supabase = createClient()

                const {data: {user}} = await supabase.auth.getUser()

                if(!user) {
                    setError("Please sign in to view your steps")
                    setIsLoading(false)
                    return
                }

                const result = await saveStepsEntry(user.id, stepsValue, stepsQuality) 
                
                if (result) {
                    setSubmitted(true)
                    setSteps("")
                    setStepsQuality(5)

                    const entries = await getUserStepsEntries(user.id);
                    setStepsEntries(entries || []);

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
                  <h1 className="text-2xl font-bold tracking-tight mb-6">Count Steps</h1>
            
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Record Your Steps</CardTitle>
                      <CardDescription>Keep track of your movement patterns by logging your steps and how you felt.</CardDescription>
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
                            <Label htmlFor="sleep">Number of Steps</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="sleep"
                                type="number"
                                placeholder="e.g., 5000"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                required
                                className="flex-1"
                                disabled={isLoading}
                                min="0"
                                step="100"
                              />
                              <span className="text-muted-foreground">steps</span>
                            </div>
                          </div>
            
                          <div className="space-y-4">
                            <Label>How You Felt Moving</Label>
                            <div className="space-y-2">
                              <Slider
                                value={[stepsQuality]}
                                onValueChange={(value) => setStepsQuality(value[0])}
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
                                Rating: {stepsQuality}/10
                              </div>
                            </div>
                          </div>
            
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging..." : "Log Steps"}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
            
            
            
                  <Card>
                    <CardHeader>
                      <CardTitle>Steps History</CardTitle>
                      <CardDescription>Your trend over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <StepsChart stepsEntries={stepsEntries} />
                      </div>
                    </CardContent>
                  </Card>
            
            
                </div>
              )
            }

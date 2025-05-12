"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, Weight, Footprints, Moon, ArrowRight, AlertCircle, Bed } from "lucide-react"
import { MacroChart } from "@/components/macro-chart"
import {
  getUserMeals,
  getDailyNutritionSummary,
  type MealWithFoodItems,
  type DailyNutritionSummary,
} from "@/lib/supabase"
import { format, parseISO } from "date-fns"
import { createClient } from "@/utils/supabase/client"

export function Dashboard() {
  const [meals, setMeals] = useState<MealWithFoodItems[]>([])
  const [nutritionSummary, setNutritionSummary] = useState<DailyNutritionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setError(null)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError("Please sign in to view your dashboard")
          setIsLoading(false)
          return
        }

        const today = format(new Date(), "yyyy-MM-dd")
        const [mealsData, summaryData] = await Promise.all([
          getUserMeals(user.id, 5),
          getDailyNutritionSummary(user.id, today)
        ])

        setMeals(mealsData)
        setNutritionSummary(summaryData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    )
  }

  // Calculate remaining calories
  const dailyCalorieGoal = 2000
  const consumedCalories = nutritionSummary?.total_calories || 0
  const remainingCalories = dailyCalorieGoal - consumedCalories
  const caloriePercentage = Math.min(100, (consumedCalories / dailyCalorieGoal) * 100)

  // Format macros for the chart
  const macroData = [
    {
      name: "Protein",
      value: nutritionSummary?.total_protein || 0,
      goal: 120,
      color: "#3b82f6",
    },
    {
      name: "Carbs",
      value: nutritionSummary?.total_carbs || 0,
      goal: 200,
      color: "#22c55e",
    },
    {
      name: "Fat",
      value: nutritionSummary?.total_fat || 0,
      goal: 65,
      color: "#eab308",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Daily Nutrition Summary</h1>
        <div className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionSummary?.total_calories || 0}</div>
            <p className="text-xs text-muted-foreground">kcal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionSummary?.total_protein || 0}g</div>
            <p className="text-xs text-muted-foreground">grams</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionSummary?.total_carbs || 0}g</div>
            <p className="text-xs text-muted-foreground">grams</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionSummary?.total_fat || 0}g</div>
            <p className="text-xs text-muted-foreground">grams</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Meals</CardTitle>
          <CardDescription>Your food logs from the past 5 days</CardDescription>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <p className="text-muted-foreground">No meals logged yet</p>
          ) : (
            <div className="space-y-4">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{meal.meal_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(meal.meal_date), "MMM d, yyyy")} at {meal.meal_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {meal.food_items.reduce((total, item) => total + (item.calories * item.quantity), 0)} kcal
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {meal.food_items.length} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-6">Activity Summary</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Footprints className="mr-2 h-4 w-4" />
              Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,842</div>
            <div className="text-xs text-muted-foreground">Goal: 10,000</div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5 hrs</div>
            <div className="text-xs text-muted-foreground">Goal: 8 hrs</div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[94%] rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Bed className="mr-2 h-4 w-4" />
              Record Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <a href="/record-sleep">
                Record Sleep
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


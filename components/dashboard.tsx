"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UtensilsCrossed,
  Weight,
  Footprints,
  Moon,
  ArrowRight,
} from "lucide-react";
import { MacroChart } from "@/components/macro-chart";
import {
  getUserMeals,
  getDailyNutritionSummary,
  getCurrentUser,
  type MealWithDetails,
  type DailyNutritionSummary,
} from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export function Dashboard() {
  const [recentMeals, setRecentMeals] = useState<MealWithDetails[]>([]);
  const [nutritionSummary, setNutritionSummary] =
    useState<DailyNutritionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // First get the user ID
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  // Then fetch data once we have the user ID
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      setIsLoading(true);
      try {
        // Get today's date in YYYY-MM-DD format
        const today = format(new Date(), "yyyy-MM-dd");

        // Fetch recent meals
        const meals = await getUserMeals(userId, 5);
        setRecentMeals(meals);

        // Fetch nutrition summary for today
        const summary = await getDailyNutritionSummary(userId, today);
        setNutritionSummary(summary);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Calculate remaining calories
  const dailyCalorieGoal = 2000;
  const consumedCalories = nutritionSummary?.total_calories || 0;
  const remainingCalories = dailyCalorieGoal - consumedCalories;
  const caloriePercentage = Math.min(
    100,
    (consumedCalories / dailyCalorieGoal) * 100
  );

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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Daily Nutrition Summary
        </h1>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Calories</CardTitle>
            <CardDescription>
              Daily Goal: {dailyCalorieGoal.toLocaleString()} kcal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(consumedCalories).toLocaleString()}
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${caloriePercentage}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {remainingCalories > 0
                ? `${Math.round(
                    remainingCalories
                  ).toLocaleString()} kcal remaining`
                : "Daily goal reached"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Macronutrients</CardTitle>
            <CardDescription>Protein, Carbs, Fat</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-[150px]">
              <MacroChart data={macroData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Log your progress</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              className="w-full justify-between"
              variant="outline"
              onClick={() => (window.location.hash = "log-food")}
            >
              <div className="flex items-center">
                <UtensilsCrossed className="mr-2 h-4 w-4" />
                Log Food
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              className="w-full justify-between"
              variant="outline"
              onClick={() => (window.location.hash = "weigh-in")}
            >
              <div className="flex items-center">
                <Weight className="mr-2 h-4 w-4" />
                Weigh In
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-6">Recent Meals</h2>
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Loading recent meals...
            </CardContent>
          </Card>
        ) : recentMeals.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No meals logged yet.</p>
              <p className="text-sm mt-1">Start by logging your first meal!</p>
            </CardContent>
          </Card>
        ) : (
          recentMeals.map((meal) => {
            // Get the meal period name
            const mealPeriodName = meal.daily_menu?.meal_period?.name || "Meal";
            // Get dining hall name if it exists
            const diningHallName = meal.daily_menu?.dining_hall?.name;
            // Get creation date and format it
            const createdAt = meal.created_at
              ? format(parseISO(meal.created_at), "MMM d")
              : "";
            // Get date from daily menu if available
            const menuDate = meal.daily_menu?.date
              ? format(parseISO(meal.daily_menu.date), "MMM d")
              : "";
            // Use menu date if available, otherwise fall back to meal creation date
            const displayDate = menuDate || createdAt;

            return (
              <Card key={meal.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center">
                      <UtensilsCrossed className="mr-2 h-4 w-4" />
                      {mealPeriodName}
                      {diningHallName && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          at {diningHallName}
                        </span>
                      )}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {displayDate}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {meal.food_items.map((food, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {food.name}{" "}
                          {food.quantity !== 1 && `(${food.quantity}x)`}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round((food.calories || 0) * food.quantity)} cal
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-4 pt-2 border-t text-sm font-medium">
                    <span>Total</span>
                    <span>
                      {Math.round(
                        meal.food_items.reduce(
                          (sum, food) =>
                            sum + (food.calories || 0) * food.quantity,
                          0
                        )
                      )}{" "}
                      calories
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

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
            <div className="text-xs text-muted-foreground">Goal: 8 hours</div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[94%] rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Weight className="mr-2 h-4 w-4" />
              Current Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">165 lbs</div>
            <div className="text-xs text-muted-foreground">Goal: 160 lbs</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <span>↓ 0.5 lbs from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

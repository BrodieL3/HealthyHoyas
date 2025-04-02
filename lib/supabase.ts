import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our data models
export type DiningHall = {
  id: number;
  name: string;
  location: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  description?: string;
  is_dining_hall_food: boolean;
  dining_hall_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type Meal = {
  id: number;
  user_id: string;
  meal_type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  location_type: "Dining Hall" | "Off-Campus";
  dining_hall_id?: number;
  meal_date: string;
  meal_time: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type MealFoodItem = {
  id: number;
  meal_id: number;
  food_item_id: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
};

export type MealWithFoodItems = Meal & {
  dining_hall?: DiningHall;
  food_items: (FoodItem & { quantity: number })[];
};

export type DailyNutritionSummary = {
  meal_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
};

// Mock user ID for demo purposes
export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

// API functions
export async function getDiningHalls(): Promise<DiningHall[]> {
  try {
    const { data, error } = await supabase
      .from("dining_halls")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching dining halls:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching dining halls:", error);
    return [];
  }
}

export async function getFoodsByDiningHall(
  diningHallId: number
): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .eq("dining_hall_id", diningHallId)
      .eq("is_dining_hall_food", true)
      .order("name");

    if (error) {
      console.error("Error fetching food items:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
}

export async function getCommonFoodItems(): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .eq("is_dining_hall_food", false)
      .order("name");

    if (error) {
      console.error("Error fetching common food items:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching common food items:", error);
    return [];
  }
}

export async function createMeal(
  meal: Omit<Meal, "id" | "created_at" | "updated_at">,
  foodItems: { food_item_id: number; quantity: number }[]
): Promise<number | null> {
  try {
    // Insert the meal
    const { data: mealData, error: mealError } = await supabase
      .from("meals")
      .insert(meal)
      .select("id")
      .single();

    if (mealError) {
      console.error("Error creating meal:", mealError);
      return null;
    }

    const mealId = mealData.id;

    // Insert the meal_food_items
    const mealFoodItems = foodItems.map((item) => ({
      meal_id: mealId,
      food_item_id: item.food_item_id,
      quantity: item.quantity,
    }));

    const { error: foodItemsError } = await supabase
      .from("meal_food_items")
      .insert(mealFoodItems);

    if (foodItemsError) {
      console.error("Error adding food items to meal:", foodItemsError);
      // Consider rolling back the meal insertion here
      return null;
    }

    return mealId;
  } catch (error) {
    console.error("Error creating meal with food items:", error);
    return null;
  }
}

export async function getUserMeals(
  userId: string,
  limit = 10
): Promise<MealWithFoodItems[]> {
  try {
    // First get the meals
    const { data: meals, error: mealsError } = await supabase
      .from("meals")
      .select(
        `
        *,
        dining_hall:dining_halls(*)
      `
      )
      .eq("user_id", userId)
      .order("meal_date", { ascending: false })
      .order("meal_time", { ascending: false })
      .limit(limit);

    if (mealsError) {
      console.error("Error fetching meals:", mealsError);
      return [];
    }

    if (!meals || meals.length === 0) {
      return [];
    }

    // For each meal, get the food items
    const mealsWithFoodItems: MealWithFoodItems[] = await Promise.all(
      meals.map(async (meal) => {
        const { data: mealFoodItems, error: mfError } = await supabase
          .from("meal_food_items")
          .select(
            `
            *,
            food_item:food_items(*)
          `
          )
          .eq("meal_id", meal.id);

        if (mfError) {
          console.error(
            `Error fetching food items for meal ${meal.id}:`,
            mfError
          );
          return { ...meal, food_items: [] };
        }

        const foodItems =
          mealFoodItems?.map((mfi) => ({
            ...mfi.food_item,
            quantity: mfi.quantity,
          })) || [];

        return { ...meal, food_items: foodItems };
      })
    );

    return mealsWithFoodItems;
  } catch (error) {
    console.error("Error fetching user meals with food items:", error);
    return [];
  }
}

export async function getDailyNutritionSummary(
  userId: string,
  date: string
): Promise<DailyNutritionSummary | null> {
  try {
    const { data, error } = await supabase
      .from("daily_nutrition_summary")
      .select("*")
      .eq("user_id", userId)
      .eq("meal_date", date)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found for this date
        return {
          meal_date: date,
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fat: 0,
        };
      }
      console.error("Error fetching daily nutrition summary:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching daily nutrition summary:", error);
    return null;
  }
}

export async function createCustomFoodItem(
  foodItem: Omit<FoodItem, "id" | "created_at" | "updated_at">
): Promise<FoodItem | null> {
  try {
    const { data, error } = await supabase
      .from("food_items")
      .insert(foodItem)
      .select()
      .single();

    if (error) {
      console.error("Error creating custom food item:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error creating custom food item:", error);
    return null;
  }
}

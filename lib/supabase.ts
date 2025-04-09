import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our data models
export type DiningHall = {
  id: number;
  name: string;
  location: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Station = {
  id: number;
  name: string;
  dining_hall_id: number;
  created_at?: string;
  updated_at?: string;
};

export type MealPeriod = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
};

export type DailyMenu = {
  id: number;
  dining_hall_id: number;
  meal_period_id: number;
  date: string;
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
  cholesterol?: number;
  saturated_fat?: number;
  trans_fat?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitamin_d?: number;
  description?: string;
  serving_size?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  recipe_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type MenuItem = {
  id: number;
  daily_menu_id: number;
  food_item_id: number;
  station_id: number;
  created_at?: string;
  updated_at?: string;
};

export type Meal = {
  id: number;
  user_id: string;
  daily_menu_id?: number;
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

export type MealWithDetails = Meal & {
  daily_menu?: DailyMenu & {
    dining_hall: DiningHall;
    meal_period: MealPeriod;
  };
  food_items: (FoodItem & { quantity: number })[];
};

export type DailyNutritionSummary = {
  meal_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
};

// API functions
export async function getDiningHalls(): Promise<DiningHall[]> {
  try {
    const { data, error } = await supabase
      .from("dining_halls")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching dining halls:", error);
    return [];
  }
}

export async function getMealPeriods(): Promise<MealPeriod[]> {
  try {
    const { data, error } = await supabase
      .from("meal_periods")
      .select("*")
      .order("start_time");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching meal periods:", error);
    return [];
  }
}

export async function getStations(diningHallId: number): Promise<Station[]> {
  try {
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .eq("dining_hall_id", diningHallId)
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
}

export async function getDailyMenus(
  diningHallId: number,
  date: string
): Promise<(DailyMenu & { meal_period: MealPeriod })[]> {
  try {
    const { data, error } = await supabase
      .from("daily_menus")
      .select(
        `
        *,
        meal_period:meal_periods(*)
      `
      )
      .eq("dining_hall_id", diningHallId)
      .eq("date", date);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching daily menus:", error);
    return [];
  }
}

export async function getMenuItems(
  dailyMenuId: number
): Promise<(MenuItem & { food_item: FoodItem; station: Station })[]> {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        food_item:food_items!food_item_id(*),
        station:stations!station_id(*)
      `
      )
      .eq("daily_menu_id", dailyMenuId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export async function getFoodsByDailyMenu(
  dailyMenuId: number
): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        food_items(*)
      `
      )
      .eq("daily_menu_id", dailyMenuId);

    if (error) throw error;

    // Extract and flatten the food items from the result
    const foodItems = data?.flatMap(
      (item) => item.food_items || []
    ) as FoodItem[];
    return foodItems;
  } catch (error) {
    console.error("Error fetching foods by daily menu:", error);
    return [];
  }
}

export async function getCommonFoodItems(): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .is("is_dining_hall_food", false)
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching common food items:", error);
    return [];
  }
}

export async function createMeal(
  meal: {
    user_id: string;
    daily_menu_id?: number;
    notes?: string;
  },
  foodItems: { food_item_id: number; quantity: number }[]
): Promise<number | null> {
  try {
    // Insert the meal
    const { data: mealData, error: mealError } = await supabase
      .from("meals")
      .insert(meal)
      .select("id")
      .single();

    if (mealError) throw mealError;

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

    if (foodItemsError) throw foodItemsError;

    return mealId;
  } catch (error) {
    console.error("Error creating meal with food items:", error);
    return null;
  }
}

export async function getUserMeals(
  userId: string,
  limit = 10
): Promise<MealWithDetails[]> {
  try {
    // First get the meals
    const { data: meals, error: mealsError } = await supabase
      .from("meals")
      .select(
        `
        *,
        daily_menu:daily_menus(
          *,
          dining_hall:dining_halls(*),
          meal_period:meal_periods(*)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (mealsError) throw mealsError;

    if (!meals || meals.length === 0) {
      return [];
    }

    // For each meal, get the food items
    const mealsWithFoodItems: MealWithDetails[] = await Promise.all(
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

        if (mfError) throw mfError;

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
    // We'll calculate this from meals rather than a separate table
    const { data: meals, error } = await supabase
      .from("meals")
      .select(
        `
        id,
        meal_food_items:meal_food_items(
          quantity,
          food_items:food_items(calories, protein, carbs, fat)
        ),
        daily_menu:daily_menus(date)
      `
      )
      .eq("user_id", userId)
      .eq("daily_menu.date", date);

    if (error) throw error;

    // Calculate nutrition totals
    const summary = {
      meal_date: date,
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };

    meals?.forEach((meal) => {
      meal.meal_food_items?.forEach((item) => {
        const quantity = item.quantity || 0;
        // Fix the food_item access - it's the first item in an array
        const foodItem = Array.isArray(item.food_items)
          ? item.food_items[0]
          : item.food_items;

        summary.total_calories +=
          ((foodItem?.calories as number) || 0) * quantity;
        summary.total_protein +=
          ((foodItem?.protein as number) || 0) * quantity;
        summary.total_carbs += ((foodItem?.carbs as number) || 0) * quantity;
        summary.total_fat += ((foodItem?.fat as number) || 0) * quantity;
      });
    });

    return summary;
  } catch (error) {
    console.error("Error calculating daily nutrition summary:", error);
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating custom food item:", error);
    return null;
  }
}

// Helper function to get current user (replace MOCK_USER_ID)
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  return data?.user || null;
}

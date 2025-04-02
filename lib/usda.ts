import { FoodItem } from "./supabase";

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export interface USDASearchResult {
  fdcId: string | number;
  description: string;
  foodNutrients: {
    nutrientName: string;
    value: number;
  }[];
}

export async function searchUSDAFoods(
  query: string
): Promise<USDASearchResult[]> {
  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
        query
      )}&pageSize=10`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch USDA data");
    }

    const data = await response.json();
    return data.foods.map((food: any) => ({
      fdcId: food.fdcId,
      description: food.description,
      foodNutrients: food.foodNutrients,
    }));
  } catch (error) {
    console.error("Error searching USDA foods:", error);
    return [];
  }
}

export function convertUSDAToFoodItem(usdaFood: USDASearchResult): FoodItem {
  return {
    id:
      typeof usdaFood.fdcId === "string"
        ? parseInt(usdaFood.fdcId)
        : usdaFood.fdcId,
    name: usdaFood.description,
    calories:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Energy")?.value ||
      0,
    protein:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Protein")?.value ||
      0,
    carbs:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Carbohydrate")
        ?.value || 0,
    fat:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Fat")?.value || 0,
    fiber:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Fiber")?.value ||
      0,
    sugar:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Sugar")?.value ||
      0,
    sodium:
      usdaFood.foodNutrients.find((n) => n.nutrientName === "Sodium")?.value ||
      0,
    dining_hall_id: undefined,
    is_dining_hall_food: false,
    created_at: new Date().toISOString(),
  };
}

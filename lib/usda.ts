import { FoodItem } from "./supabase";

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export interface USDASearchResult {
  fdcId: number;
  description: string;
  foodNutrients: {
    nutrientId: number;
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

export function convertUSDAToFoodItem(
  usdaFood: USDASearchResult
): Omit<FoodItem, "id" | "created_at" | "updated_at"> {
  const getNutrientValue = (nutrientName: string) => {
    const nutrient = usdaFood.foodNutrients.find(
      (n) => n.nutrientName.toLowerCase() === nutrientName.toLowerCase()
    );
    return nutrient?.value || 0;
  };

  return {
    name: usdaFood.description,
    calories: getNutrientValue("Energy"),
    protein: getNutrientValue("Protein"),
    carbs: getNutrientValue("Carbohydrate, by difference"),
    fat: getNutrientValue("Total lipid (fat)"),
    fiber: getNutrientValue("Fiber, total dietary"),
    sugar: getNutrientValue("Sugars, total"),
    sodium: getNutrientValue("Sodium, Na"),
    description: "",
    is_dining_hall_food: false,
    dining_hall_id: undefined,
  };
}

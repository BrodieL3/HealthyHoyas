"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ArrowLeft,
  Search,
  Loader2,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import {
  getDiningHalls,
  getMealPeriods,
  getDailyMenus,
  getFoodsByDailyMenu,
  getCommonFoodItems,
  createMeal,
  createCustomFoodItem,
  getCurrentUser,
  type DiningHall,
  type FoodItem,
  type Meal,
  type MealPeriod,
  type DailyMenu,
} from "@/lib/supabase";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  searchUSDAFoods,
  convertUSDAToFoodItem,
  type USDASearchResult,
} from "@/lib/usda";

export function LogFood() {
  // Form state
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [mealPeriod, setMealPeriod] = useState<MealPeriod | null>(null);
  const [locationType, setLocationType] = useState<
    "Dining Hall" | "Off-Campus"
  >("Dining Hall");
  const [diningHallId, setDiningHallId] = useState<number | null>(null);
  const [dailyMenuId, setDailyMenuId] = useState<number | null>(null);
  const [mealDate, setMealDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [mealTime, setMealTime] = useState(format(new Date(), "HH:mm"));
  const [mealNotes, setMealNotes] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Data state
  const [diningHalls, setDiningHalls] = useState<DiningHall[]>([]);
  const [mealPeriods, setMealPeriods] = useState<MealPeriod[]>([]);
  const [dailyMenus, setDailyMenus] = useState<
    (DailyMenu & { meal_period: MealPeriod })[]
  >([]);
  const [menuFoods, setMenuFoods] = useState<FoodItem[]>([]);
  const [commonFoods, setCommonFoods] = useState<FoodItem[]>([]);
  const [selectedFoodItems, setSelectedFoodItems] = useState<
    (FoodItem & { quantity: number })[]
  >([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFoodSelector, setOpenFoodSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dining-hall");
  const [editingCustomFood, setEditingCustomFood] = useState(false);

  // Custom food form
  const [customFoodForm, setCustomFoodForm] = useState<
    Omit<FoodItem, "id" | "created_at" | "updated_at">
  >({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    description: "",
    // removed is_dining_hall_food as it doesn't appear to be in schema
  });

  // USDA state
  const [usdaSearchResults, setUsdaSearchResults] = useState<
    USDASearchResult[]
  >([]);
  const [isSearchingUSDA, setIsSearchingUSDA] = useState(false);

  // Dining hall search state
  const [diningHallSearchResults, setDiningHallSearchResults] = useState<
    FoodItem[]
  >([]);
  const [isSearchingDiningHall, setIsSearchingDiningHall] = useState(false);

  // Add state for showing suggestions
  const [showDiningHallSuggestions, setShowDiningHallSuggestions] =
    useState(false);
  const [showUSDASuggestions, setShowUSDASuggestions] = useState(false);

  // Get current user on component mount
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  // Fetch dining halls and meal periods on component mount
  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      try {
        // Fetch dining halls
        const halls = await getDiningHalls();
        setDiningHalls(halls);

        // Set default dining hall if available
        if (halls.length > 0) {
          setDiningHallId(halls[0].id);
        }

        // Fetch meal periods
        const periods = await getMealPeriods();
        setMealPeriods(periods);

        // Set default meal period if available
        if (periods.length > 0) {
          setMealPeriod(periods[0]);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // Fetch daily menus when dining hall and date are selected
  useEffect(() => {
    async function fetchDailyMenus() {
      if (diningHallId && mealDate) {
        setIsLoading(true);
        try {
          const menus = await getDailyMenus(diningHallId, mealDate);
          setDailyMenus(menus);
        } catch (error) {
          console.error("Error fetching daily menus:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchDailyMenus();
  }, [diningHallId, mealDate]);

  // Fetch food items when a daily menu is selected
  useEffect(() => {
    async function fetchMenuFoods() {
      if (dailyMenuId) {
        setIsLoading(true);
        try {
          const foods = await getFoodsByDailyMenu(dailyMenuId);
          setMenuFoods(foods);
        } catch (error) {
          console.error("Error fetching menu foods:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchMenuFoods();
  }, [dailyMenuId]);

  // Fetch common food items
  useEffect(() => {
    async function fetchCommonFoods() {
      setIsLoading(true);
      try {
        const foods = await getCommonFoodItems();
        setCommonFoods(foods);
      } catch (error) {
        console.error("Error fetching common food items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommonFoods();
  }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowDiningHallSuggestions(false);
        setShowUSDASuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update step order
  const handleLocationTypeSelect = (value: "Dining Hall" | "Off-Campus") => {
    setLocationType(value);
    if (value === "Off-Campus") {
      setDiningHallId(null);
      setDailyMenuId(null);
      setActiveTab("custom");
    }
    setStep(2);
  };

  const handleMealPeriodSelect = (period: MealPeriod) => {
    setMealPeriod(period);

    // If we already have a dining hall, find the daily menu for this meal period
    if (diningHallId && dailyMenus.length > 0) {
      const matchingMenu = dailyMenus.find(
        (menu) => menu.meal_period.id === period.id
      );
      if (matchingMenu) {
        setDailyMenuId(matchingMenu.id);
      }
    }

    setStep(3);
  };

  const handleDiningHallSelect = (id: number) => {
    setDiningHallId(id);
    setStep(4);
  };

  const handleAddFoodItem = (food: FoodItem) => {
    // Check if the food item is already in the list
    const existingIndex = selectedFoodItems.findIndex(
      (item) => item.id === food.id
    );

    if (existingIndex >= 0) {
      // Update quantity if already exists
      const updatedItems = [...selectedFoodItems];
      updatedItems[existingIndex].quantity += 1;
      setSelectedFoodItems(updatedItems);
    } else {
      // Add new food item with quantity 1
      setSelectedFoodItems([...selectedFoodItems, { ...food, quantity: 1 }]);
    }

    setOpenFoodSelector(false);
  };

  const handleUpdateFoodQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      // Remove the item if quantity is 0 or negative
      setSelectedFoodItems(selectedFoodItems.filter((item) => item.id !== id));
    } else {
      // Update the quantity
      setSelectedFoodItems(
        selectedFoodItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFoodItem = (id: number) => {
    setSelectedFoodItems(selectedFoodItems.filter((item) => item.id !== id));
  };

  const handleCustomFoodChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomFoodForm((prev) => ({
      ...prev,
      [name]: name === "name" || name === "description" ? value : Number(value),
    }));
  };

  const handleCreateCustomFood = async () => {
    setIsLoading(true);
    try {
      const newFood = await createCustomFoodItem(customFoodForm);
      if (newFood) {
        // Add to common foods list
        setCommonFoods([...commonFoods, newFood]);
        // Add to selected foods
        handleAddFoodItem(newFood);
        // Reset form
        setCustomFoodForm({
          name: "",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          description: "",
        });
        setEditingCustomFood(false);
      }
    } catch (error) {
      console.error("Error creating custom food:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to log a meal");
      return;
    }

    if (selectedFoodItems.length === 0) {
      alert("Please add at least one food item to your meal");
      return;
    }

    setIsLoading(true);
    try {
      // Create the meal object
      const meal: Omit<Meal, "id" | "created_at" | "updated_at"> = {
        user_id: userId,
        daily_menu_id: dailyMenuId || undefined,
        notes: mealNotes || undefined,
      };

      // Create the food items array
      const foodItems = selectedFoodItems.map((item) => ({
        food_item_id: item.id,
        quantity: item.quantity,
      }));

      // Create the meal with food items
      const mealId = await createMeal(meal, foodItems);

      if (mealId) {
        setSubmitted(true);
        setTimeout(() => {
          // Reset the form
          setSubmitted(false);
          setStep(1);
          setMealPeriod(mealPeriods[0] || null);
          setLocationType("Dining Hall");
          setDiningHallId(diningHalls[0]?.id || null);
          setDailyMenuId(null);
          setMealDate(format(new Date(), "yyyy-MM-dd"));
          setMealTime(format(new Date(), "HH:mm"));
          setMealNotes("");
          setSelectedFoodItems([]);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update goBack function to match new step order
  const goBack = () => {
    if (step > 1) {
      if (step === 4) {
        // If on food selection, go back to meal type
        setStep(3);
      } else if (step === 3) {
        // If on dining hall selection, go back to location type
        setStep(2);
      } else {
        // For other steps, just go back one step
        setStep(step - 1);
      }
    }
  };

  // Calculate total nutrition for selected food items
  const totalNutrition = selectedFoodItems.reduce(
    (acc, item) => {
      return {
        calories: acc.calories + (item.calories || 0) * item.quantity,
        protein: acc.protein + (item.protein || 0) * item.quantity,
        carbs: acc.carbs + (item.carbs || 0) * item.quantity,
        fat: acc.fat + (item.fat || 0) * item.quantity,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Filter food items based on search query
  const filteredMenuFoods = menuFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommonFoods = commonFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update dining hall search handler
  const handleDiningHallSearch = async (query: string) => {
    if (!query) {
      setDiningHallSearchResults([]);
      setShowDiningHallSuggestions(false);
      return;
    }

    setIsSearchingDiningHall(true);
    try {
      const results = menuFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setDiningHallSearchResults(results);
      setShowDiningHallSuggestions(true);
    } catch (error) {
      console.error("Error searching dining hall foods:", error);
    } finally {
      setIsSearchingDiningHall(false);
    }
  };

  // USDA search
  const handleCustomFoodSearch = async (query: string) => {
    if (!query) {
      setUsdaSearchResults([]);
      setShowUSDASuggestions(false);
      return;
    }

    setIsSearchingUSDA(true);
    try {
      const results = await searchUSDAFoods(query);
      setUsdaSearchResults(results);
      setShowUSDASuggestions(true);
    } catch (error) {
      console.error("Error searching USDA:", error);
    } finally {
      setIsSearchingUSDA(false);
    }
  };

  // Update USDA food selection handler
  const handleUSDAFoodSelect = async (usdaFood: USDASearchResult) => {
    const foodItem = convertUSDAToFoodItem(usdaFood);
    setIsLoading(true);
    try {
      // Create the custom food item first
      const newFood = await createCustomFoodItem(foodItem);
      if (newFood) {
        // Add to selected items
        handleAddFoodItem(newFood);
        setUsdaSearchResults([]);
        setSearchQuery("");
        setShowUSDASuggestions(false);
      }
    } catch (error) {
      console.error("Error creating custom food:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add click handler for dining hall food selection
  const handleDiningHallFoodSelect = (food: FoodItem) => {
    handleAddFoodItem(food);
    setDiningHallSearchResults([]);
    setSearchQuery("");
    setShowDiningHallSuggestions(false);
  };

  // Render step 1: Location type selection
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Select Location Type</h2>
        <p className="text-muted-foreground">Where are you eating?</p>
      </div>

      <div className="grid gap-3">
        <Button
          variant="outline"
          className="flex flex-col items-start justify-between h-auto p-4 border-2 w-full"
          onClick={() => handleLocationTypeSelect("Dining Hall")}
        >
          <div className="flex flex-col items-start">
            <span className="text-base font-medium">Dining Hall</span>
            <span className="text-sm text-muted-foreground">
              On-campus dining locations
            </span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start justify-between h-auto p-4 border-2 w-full"
          onClick={() => handleLocationTypeSelect("Off-Campus")}
        >
          <div className="flex flex-col items-start">
            <span className="text-base font-medium">Off-Campus</span>
            <span className="text-sm text-muted-foreground">
              Home, restaurant, or other location
            </span>
          </div>
        </Button>
      </div>
    </div>
  );

  // Render step 2: Meal period selection
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Select Meal Period</h2>
          <p className="text-muted-foreground">
            Choose which meal you're logging
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mealPeriods.map((period) => (
          <Button
            key={period.id}
            variant="outline"
            className="flex flex-col items-center justify-center h-auto py-4 border-2"
            onClick={() => handleMealPeriodSelect(period)}
          >
            <span className="text-base font-medium">{period.name}</span>
            <span className="text-xs text-muted-foreground">
              {period.start_time} - {period.end_time}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );

  // Render step 3: Dining hall selection (only if location is Dining Hall)
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Select Dining Hall</h2>
          <p className="text-muted-foreground">
            Choose where you're eating on campus
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {diningHalls.map((hall) => (
          <Button
            key={hall.id}
            variant="outline"
            className="flex flex-col items-start justify-between h-auto p-4 border-2 w-full"
            onClick={() => handleDiningHallSelect(hall.id)}
          >
            <div className="flex flex-col items-start">
              <span className="text-base font-medium">{hall.name}</span>
              <span className="text-sm text-muted-foreground">
                {hall.location}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  // Render step 4: Food selection and meal details
  const renderStep4 = () => {
    const currentDiningHall = diningHalls.find(
      (hall) => hall.id === diningHallId
    );

    const currentMenu = dailyMenus.find((menu) => menu.id === dailyMenuId);

    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Add Food Items</h2>
            <p className="text-muted-foreground">
              {locationType === "Dining Hall" && currentDiningHall && mealPeriod
                ? `${currentDiningHall.name} - ${mealPeriod.name}`
                : `Off-Campus ${mealPeriod?.name || ""}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {locationType === "Dining Hall" ? (
            <div className="space-y-2">
              <Label htmlFor="dining-hall-search">
                Search Dining Hall Foods
              </Label>
              <div className="relative search-container">
                <Input
                  id="dining-hall-search"
                  name="dining-hall-search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleDiningHallSearch(e.target.value);
                  }}
                  placeholder="Search dining hall foods..."
                />
                {isSearchingDiningHall && (
                  <div className="absolute right-2 top-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {showDiningHallSuggestions &&
                  diningHallSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-1">
                        {diningHallSearchResults.map((food) => (
                          <div
                            key={food.id}
                            className="px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm flex flex-col"
                            onClick={() => handleDiningHallFoodSelect(food)}
                          >
                            <span className="font-medium">{food.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {food.calories || 0} cal | P: {food.protein || 0}g
                              | C: {food.carbs || 0}g | F: {food.fat || 0}g
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="custom-food-search">Search Custom Foods</Label>
              <div className="relative search-container">
                <Input
                  id="custom-food-search"
                  name="custom-food-search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleCustomFoodSearch(e.target.value);
                  }}
                  placeholder="Search USDA database or enter custom food..."
                />
                {isSearchingUSDA && (
                  <div className="absolute right-2 top-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {showUSDASuggestions && usdaSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-1">
                      {usdaSearchResults.map((food) => (
                        <div
                          key={food.fdcId}
                          className="px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm flex flex-col"
                          onClick={() => handleUSDAFoodSelect(food)}
                        >
                          <span className="font-medium">
                            {food.description}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {food.foodNutrients.find(
                              (n) => n.nutrientName === "Energy"
                            )?.value || 0}{" "}
                            cal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected food items */}
          <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Selected Food Items</h3>
              <Badge variant="outline">{selectedFoodItems.length} items</Badge>
            </div>

            {selectedFoodItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No food items selected yet.</p>
                <p className="text-sm">Search and add foods from above.</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4 space-y-2">
                  {selectedFoodItems.map((food) => (
                    <div
                      key={food.id}
                      className="flex justify-between items-center p-2 rounded-md hover:bg-muted"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((food.calories || 0) * food.quantity)} cal
                          | P:{" "}
                          {((food.protein || 0) * food.quantity).toFixed(1)}g |
                          C: {((food.carbs || 0) * food.quantity).toFixed(1)}g |
                          F: {((food.fat || 0) * food.quantity).toFixed(1)}g
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleUpdateFoodQuantity(
                              food.id,
                              food.quantity - 0.5
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="w-10 text-center">
                          {food.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleUpdateFoodQuantity(
                              food.id,
                              food.quantity + 0.5
                            )
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleRemoveFoodItem(food.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {selectedFoodItems.length > 0 && (
              <div className="rounded-md border p-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Meal Totals</h4>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-lg font-semibold">
                      {Math.round(totalNutrition.calories)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Calories
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {totalNutrition.protein.toFixed(1)}g
                    </div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {totalNutrition.carbs.toFixed(1)}g
                    </div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {totalNutrition.fat.toFixed(1)}g
                    </div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Meal details */}
          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Meal Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-date">Date</Label>
                <Input
                  id="meal-date"
                  type="date"
                  value={mealDate}
                  onChange={(e) => setMealDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-time">Time</Label>
                <Input
                  id="meal-time"
                  type="time"
                  value={mealTime}
                  onChange={(e) => setMealTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-notes">Notes (Optional)</Label>
              <Textarea
                id="meal-notes"
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="Add any notes about this meal"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full mt-6"
            disabled={selectedFoodItems.length === 0 || isLoading || !userId}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Log Meal
          </Button>
        </div>
      </div>
    );
  };

  // Render success message
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-6">
      <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
      <h3 className="text-xl font-medium">Meal Logged Successfully!</h3>
      <p className="text-muted-foreground text-center mt-1">
        Your nutrition data has been updated.
      </p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Log Food</h1>

      <Card>
        <CardContent className="pt-6">
          {submitted ? (
            renderSuccess()
          ) : (
            <>
              {isLoading && step === 1 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 &&
                    locationType === "Dining Hall" &&
                    renderStep3()}
                  {((step === 4 && locationType === "Dining Hall") ||
                    (step === 3 && locationType === "Off-Campus")) &&
                    renderStep4()}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

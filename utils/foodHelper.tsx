import { Dispatch, SetStateAction } from "react";

interface FoodStats {
  product_name: string;
  product_type: string;
  product_desc: string;
  fat: string;
  protein: string;
  carbs: string;
  calories: string;
  quantity: string;
}

// Ensure input is numerical (float)
export function handleTextChange(text: string) {
  let numericValue = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  return numericValue;
}

// Helper to update food object
export const updateFoodItem = (
  setFoodData: Dispatch<SetStateAction<Array<FoodStats>>>,
  index: number,
  changes: Partial<FoodStats>,
) => {
  setFoodData((prev) =>
    prev.map((entry, i) => (i === index ? { ...entry, ...changes } : entry)),
  );
};

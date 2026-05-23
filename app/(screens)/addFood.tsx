import FoodItem from "@/components/FoodItem";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddFoodScreen = () => {
  const [loading, setLoading] = useState(false);

  async function addToGroceries(productName: string, productDescription: string, productType: string, calories: string, fat: string, carbs: string, protein: string, quantity: string) {
    if (
      productName.trim() === "" ||
      productType.trim() === "" ||
      calories.trim() === "" ||
      fat.trim() === "" ||
      carbs.trim() === "" ||
      protein.trim() === "" ||
      quantity.trim() === "" ||
      quantity === "0"
    ) {
      Alert.alert("Please fill the required fields");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("groceries").insert([
          {
            uuid: user.id,
            product_name: productName.toLowerCase(),
            product_desc: productDescription.toLowerCase(),
            product_type: productType.toLowerCase(),
            calories: Number(calories),
            fat: Number(fat),
            carbs: Number(carbs),
            protein: Number(protein),
            quantity: Number(quantity),
          },
        ]);

        if (error) {
          Alert.alert("Unexpected Error Occurred");
          console.log(error);
        } else {
          Alert.alert("Successfully Added to Groceries");
          router.back();
        }
      }

      if (error) {
        Alert.alert("Unexpected Error Occurred");
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }


  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1">
        <FoodItem title={"Add Food Item"} loading={loading} addToGroceries={addToGroceries} />
      </SafeAreaView>
    </KeyboardAvoidingView >
  );
};

export default AddFoodScreen;


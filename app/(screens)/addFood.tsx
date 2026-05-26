import FoodItem from "@/components/FoodItem";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const AddFoodScreen = () => {
  const [loading, setLoading] = useState(false);

  async function addToGroceries(
    productName: string,
    productDescription: string,
    productType: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string,
    quantity: string,
  ) {
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
      Toast.show({
        type: "error",
        text1: "Please fill the required fields",
      });
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
          Toast.show({
            type: "error",
            text1: "Unexpected Error Occurred",
          });
          console.log(error);
        } else {
          Toast.show({
            type: "success",
            text1: "Successfully Added to Groceries",
          });
          router.back();
        }
      }

      if (error) {
        Toast.show({
          type: "error",
          text1: "Unexpected Error Occurred",
        });
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
        <FoodItem
          title={"Add Food Item"}
          loading={loading}
          addToGroceries={addToGroceries}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AddFoodScreen;

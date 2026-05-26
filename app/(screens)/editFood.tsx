import FoodItem from "@/components/FoodItem";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface GroceryDetails {
  productName: string;
  productDescription: string;
  productType: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  quantity: string;
}

const EditFoodScreen = () => {
  const { userID, groceryID } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [groceryData, setGroceryData] = useState<GroceryDetails | null>(null);

  async function updateGroceries(
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
        const { error } = await supabase
          .from("groceries")
          .update({
            product_name: productName.toLowerCase(),
            product_desc: productDescription.toLowerCase(),
            product_type: productType.toLowerCase(),
            calories: Number(calories),
            fat: Number(fat),
            carbs: Number(carbs),
            protein: Number(protein),
            quantity: Number(quantity),
          })
          .eq("id", groceryID)
          .eq("uuid", user.id);

        if (error) {
          Toast.show({
            type: "error",
            text1: "Unexpected Error Occurred",
          });
          console.log(error);
        } else {
          Toast.show({
            type: "success",
            text1: "Successfully Updated Groceries",
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

  async function getGroceryDetails() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("groceries")
        .select()
        .eq("id", groceryID)
        .eq("uuid", userID)
        .single();

      if (error) throw error;
      setGroceryData({
        productName: String(data.product_name),
        productDescription: String(data.product_desc),
        productType: String(data.product_type),
        calories: String(data.calories),
        fat: String(data.fat),
        carbs: String(data.carbs),
        protein: String(data.protein),
        quantity: String(data.quantity),
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Unexpected Error Occurred",
      });
      console.log("Error in getGroceryDetails:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getGroceryDetails();
  }, []);

  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="black" />
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <SafeAreaView className="flex-1">
              <FoodItem
                title={"Edit Food Item"}
                loading={loading}
                addToGroceries={updateGroceries}
                groceryData={groceryData}
              />
            </SafeAreaView>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};

export default EditFoodScreen;

const styles = StyleSheet.create({});

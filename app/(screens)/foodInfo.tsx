import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { updateFoodItem } from "@/utils/foodHelper";
import { FontAwesome6 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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

const FoodInfoScreen = () => {
  const API_MOBILE = process.env.EXPO_PUBLIC_API_MOBILE;
  const API_WEB = process.env.EXPO_PUBLIC_API_WEB;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [foodData, setFoodData] = useState<Array<FoodStats>>([]);
  const itemCount = foodData.length;
  const { photoURI } = useLocalSearchParams();

  useEffect(() => {
    // If the photoURI is an array, grab the first item. Otherwise, use it.
    const uri = Array.isArray(photoURI) ? photoURI[0] : photoURI;
    if (!uri) return;

    const callModel = async () => {
      try {
        const formData = new FormData();

        // If the user is using a web browser, we need to fetch the image as a blob
        if (Platform.OS === "web") {
          const response = await fetch(uri);
          const blob = await response.blob();

          formData.append("file", blob, "photo.jpg");
        } else {
          // Otherwise, the user is using a mobile device, so we use the uri directly
          formData.append("file", {
            uri,
            name: "photo.jpg",
            type: "image/jpeg",
          } as any);
        }

        // Fetch response from the server (development)
        const response = await fetch(
          Platform.OS === "web" ? "" + API_WEB : "" + API_MOBILE,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();
        setFoodData(data);

        console.log("Server response:", data);
      } catch (e) {
        console.log("Upload error:", e);
      } finally {
        setLoading(false);
      }
    };
    callModel();
  }, []);

  async function addToGroceries(
    foodData: Array<FoodStats>,
    removeIndex?: number,
  ) {
    setActionLoading(true);

    try {
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updatedFoodData = foodData.map((item: FoodStats) => ({
        uuid: user!.id,
        ...item,
      }));
      console.log("updatedFoodData:", updatedFoodData);

      // Update groceries table
      const { error } = await supabase
        .from("groceries")
        .insert(updatedFoodData);

      if (error) {
        Toast.show({
          type: "error",
          text1: "Unexpected Error Occurred",
        });
        console.log(error);
      } else {
        if (removeIndex !== undefined) {
          setFoodData((prev) => prev.filter((_, i) => i !== removeIndex));
        } else {
          setFoodData([]);
        }
        Toast.show({
          type: "success",
          text1: "Successfully Added to Groceries",
        });
      }
    } catch (e) {
      console.log("Error in addToGroceries:", e);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 mx-4 gap-3">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <View className="p-5 border-b-2 h-[6rem] border-[#008000]">
              <Text className="text-3xl text-center text-[#008000]">
                Food Info
              </Text>
            </View>

            {/* Food image */}
            <View className="h-1/3 rounded-lg overflow-hidden">
              <Image
                source={{ uri: String(photoURI) }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-row min-h-[5rem] justify-start bg-green-100 p-3 gap-2 rounded-lg">
              <View className="bg-green-200 w-12 rounded-full h-12 m-auto">
                <AntDesign
                  name="check-circle"
                  size={24}
                  color="green"
                  className="m-auto"
                />
              </View>
              <View className="flex-col gap-1 flex-1">
                <Text className="font-semibold">
                  {itemCount} item(s) detected
                </Text>
                <Text className="text-xs text-slate-600">
                  Review and add the items you want to your groceries.
                </Text>
              </View>
            </View>

            {/* Nutrition information */}
            <View className="flex-1">
              <FlatList
                data={foodData}
                className="flex-1"
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  // Plan: Simplify View component by creating it in a separate file.
                  <View className="flex-col gap-3 border-none bg-white shadow-sm rounded-lg mb-3 p-2 flex-1">
                    <Text className="font-semibold">{item.product_name}</Text>
                    <View className="flex-row justify-around">
                      <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                        <TextInput
                          className="text-xs bg-white w-full"
                          keyboardType="decimal-pad"
                          autoCapitalize="none"
                          onChangeText={(text) => {
                            updateFoodItem(setFoodData, index, {
                              calories: text,
                            });
                          }}
                          value={item.calories?.toString()}
                        />
                        <Text className="text-xs text-gray-600">kcal</Text>
                      </View>
                      <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                        <TextInput
                          className="text-xs bg-white w-full"
                          keyboardType="decimal-pad"
                          autoCapitalize="none"
                          onChangeText={(text) => {
                            updateFoodItem(setFoodData, index, { fat: text });
                          }}
                          value={item.fat?.toString()}
                        />
                        <Text className="text-xs text-gray-600">Fat(g)</Text>
                      </View>
                      <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                        <TextInput
                          className="text-xs bg-white w-full"
                          keyboardType="decimal-pad"
                          autoCapitalize="none"
                          onChangeText={(text) => {
                            updateFoodItem(setFoodData, index, { carbs: text });
                          }}
                          value={item.carbs?.toString()}
                        />
                        <Text className="text-xs text-gray-600">Carbs(g)</Text>
                      </View>
                      <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                        <TextInput
                          className="text-xs bg-white w-full"
                          keyboardType="decimal-pad"
                          autoCapitalize="none"
                          onChangeText={(text) => {
                            updateFoodItem(setFoodData, index, {
                              protein: text,
                            });
                          }}
                          value={item.protein?.toString()}
                        />
                        <Text className="text-xs text-gray-600">
                          Protein(g)
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row gap-3 items-center">
                        <Text className="text-xs text-gray-600">Quantity</Text>
                        <TextInput
                          className="border w-[4rem] h-[2rem] rounded-lg"
                          autoCapitalize="none"
                          keyboardType="number-pad"
                          onChangeText={(text) => {
                            updateFoodItem(setFoodData, index, {
                              quantity: text,
                            });
                          }}
                          value={item.quantity?.toString()}
                        />
                      </View>
                      <Button
                        className="flex gap-5 bg-green-600 bottom-0"
                        isDisabled={
                          actionLoading || foodData.length === 0 ? true : false
                        }
                        onPress={() => addToGroceries([item], index)}
                      >
                        <View>
                          <FontAwesome6 name="add" size={15} color="white" />
                        </View>
                        <View>
                          <ButtonText className="text-white text-sm">
                            Add
                          </ButtonText>
                        </View>
                      </Button>
                    </View>
                  </View>
                )}
              />
            </View>

            <View>
              <Button
                className="flex gap-5 bg-green-600"
                onPress={() => {
                  addToGroceries(foodData);
                }}
                isDisabled={
                  actionLoading || foodData.length === 0 ? true : false
                }
              >
                <View>
                  <FontAwesome6 name="add" size={20} color="white" />
                </View>
                <View>
                  <ButtonText className="text-white text-xs">
                    Add {itemCount} item(s) to Groceries
                  </ButtonText>
                </View>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FoodInfoScreen;

const styles = StyleSheet.create({});

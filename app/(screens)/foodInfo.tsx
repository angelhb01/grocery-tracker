import { Button, ButtonText } from "@/components/ui/button";
import { FontAwesome6 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FoodStats {
  name: string;
  fat: number;
  protein: number;
  carbs: number;
  calories: number;
  quantity: number;
}

const FoodInfoScreen = () => {
  const API_MOBILE = process.env.EXPO_PUBLIC_API_MOBILE;
  const API_WEB = process.env.EXPO_PUBLIC_API_WEB;

  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState<Array<FoodStats>>([]);
  const itemCount = useRef(0);
  const { photoURI } = useLocalSearchParams();

  // Nutrition info
  const [calories, setCalories] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [quantity, setQuantity] = useState(1);

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

        for (let i = 0; i < data.length; i++) {
          itemCount.current += 1;
        }

        console.log("Server response:", data);
      } catch (e) {
        console.log("Upload error:", e);
      } finally {
        setLoading(false);
      }
    };
    callModel();
  }, []);

  async function addToGroceries() {}

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 mx-4 gap-3">
      <View className="p-5 border-b-2 h-[6rem] border-[#008000]">
        <Text className="text-3xl text-center text-[#008000]">Food Info</Text>
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
            {itemCount.current} item(s) detected
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
          renderItem={({ item }) => (
            <View className="flex-col gap-3 border-none bg-white shadow-sm rounded-lg mb-3 p-2">
              <Text className="font-semibold">{item.name}</Text>
              <View className="flex-row justify-around">
                <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                  <TextInput
                    className="text-xs bg-white w-full"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                    onChangeText={(text) => setCalories(text)}
                    value={item.calories?.toString()}
                  />
                  <Text className="text-xs text-gray-600">kcal</Text>
                </View>
                <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                  <TextInput
                    className="text-xs bg-white w-full"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                    onChangeText={(text) => setFat(text)}
                    value={item.fat?.toString()}
                  />
                  <Text className="text-xs text-gray-600">Fat(g)</Text>
                </View>
                <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                  <TextInput
                    className="text-xs bg-white w-full"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                    onChangeText={(text) => setCarbs(text)}
                    value={item.carbs?.toString()}
                  />
                  <Text className="text-xs text-gray-600">Carbs(g)</Text>
                </View>
                <View className="bg-gray-100 w-[6rem] p-2 rounded-lg flex justify-center items-center">
                  <TextInput
                    className="text-xs bg-white w-full"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                    onChangeText={(text) => setProtein(text)}
                    value={item.protein?.toString()}
                  />
                  <Text className="text-xs text-gray-600">Protein(g)</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row gap-3 items-center">
                  <Text className="text-xs text-gray-600">Quantity</Text>
                  <TextInput
                    className="border w-[4rem] h-[2rem] rounded-lg"
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    onChangeText={(text) => setQuantity(Number(text))}
                    value={item.quantity?.toString()}
                  />
                </View>
                <Button
                  className="flex gap-5 bg-green-600 bottom-0"
                  //onPress={addToGroceries}
                  disabled={loading}
                >
                  <View>
                    <FontAwesome6 name="add" size={15} color="white" />
                  </View>
                  <View>
                    <ButtonText className="text-white text-sm">Add</ButtonText>
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
          //onPress={addToGroceries}
          disabled={loading}
        >
          <View>
            <FontAwesome6 name="add" size={20} color="white" />
          </View>
          <View>
            <ButtonText className="text-white text-xs">
              Add {itemCount.current} item(s) to Groceries
            </ButtonText>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default FoodInfoScreen;

const styles = StyleSheet.create({});

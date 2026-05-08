import { Button, ButtonText } from "@/components/ui/button";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FoodInfoScreen = () => {
  const [loading, setLoading] = useState(false);
  const { photoURI } = useLocalSearchParams();

  useEffect(() => {
    console.log(photoURI);
  }, []);

  /*
  // Send request to the model
  const formData = new FormData();

  formData.append("file", {
    uri: photo.uri,
    name: "photo.jpg",
    type: "image/jpeg",
  });

  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const data = await response.json();
  console.log(data);
  */

  async function addToGroceries() {}

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem] border-[#008000]">
        <Text className="text-3xl text-center text-[#008000]">Food Info</Text>
      </View>

      {/* Food image */}
      <View className="w-1/2 h-1/2 flex items-center justify-center">
        <Image
          source={{ uri: String(photoURI) }}
          className="w-full h-full"
          resizeMode="cover"
        ></Image>
      </View>

      {/* Nutrition information */}
      <View>
        <Text>Name:</Text>
        <Text>Calories:</Text>
        <Text>Fat:</Text>
        <Text>Carbs:</Text>
        <Text>Protein:</Text>
      </View>

      <View>
        <Button
          className="flex gap-5 bg-green-600"
          onPress={addToGroceries}
          disabled={loading}
        >
          <View>
            <FontAwesome6 name="add" size={24} color="white" />
          </View>
          <View>
            <ButtonText className="text-white">Add to Groceries</ButtonText>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default FoodInfoScreen;

const styles = StyleSheet.create({});

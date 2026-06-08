import { Button, ButtonText } from "@/components/ui/button";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FoodInfoScreen = () => {
  const [loading, setLoading] = useState(true);
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
          Platform.OS === "web"
            ? "http://localhost:8000/predict"
            : `http://${process.env.EXPO_PUBLIC_API_URL}:8000/predict`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();
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
    <SafeAreaView className="flex-1">
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

import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Food {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: Array<Object>;
}

const FoodScreen = () => {
  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState<Array<Food>>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Scroll down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function getFoodData() {
    setLoading(true);
    try {
      const response = await fetch("/api/food");
      const json = await response.json();
      setFoodData(json);
    } catch (e) {
      console.log("Unexpected error occurred: " + e);
      Alert.alert("" + e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFoodData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Food</Text>
      </View>
      {/* Food content (from an API) */}
      {loading ? (
        <View>
          <ActivityIndicator color={"black"} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1, gap: 10, padding: 10 }}
        >
          {foodData.map((food) => (
            <Button
              onPress={() =>
                router.push({
                  pathname: "/FoodInfo",
                  params: { description: food.description },
                })
              }
              className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black"
              key={food.fdcId}
            >
              <ButtonText>{food.description}</ButtonText>
            </Button>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({});

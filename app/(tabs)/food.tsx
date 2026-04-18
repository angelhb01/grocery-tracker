import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
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
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodData, setFoodData] = useState<Array<Food>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<string>();

  // Scroll down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function getFoodData() {
    setFoodLoading(true);
    try {
      const response = await fetch("/api/food");
      const json = await response.json();
      setFoodData(json);
    } catch (e) {
      console.log("Unexpected error occurred: " + e);
      Alert.alert("" + e);
    } finally {
      setFoodLoading(false);
    }
  }

  async function getUserData() {
    setLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user.id)
        console.log(user.id)
      } else {
        console.log(error);
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
    getFoodData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Food</Text>
      </View>
      {/* Food content (from an API) */}
      {foodLoading || loading ? (
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
                  params: { description: food.description, user: user},
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

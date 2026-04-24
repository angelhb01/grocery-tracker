import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FoodInfo {
  food_id: string;
  food_description: string;
  food_name: string;
  food_type: string;
  brand_name: string;
}

const FoodScreen = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodData, setFoodData] = useState<FoodInfo[]>([]);
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
      const response = await fetch(`/api/food?q=${searchTerm}`);
      const json = await response.json();
      console.log("Data response:", json);
      setFoodData(json.foods.food);
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
        setUser(user.id);
        console.log(user.id);
      } else {
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
    getFoodData();
  }, []);

  useEffect(() => {
    console.log("foodData:", foodData);
  }, [foodData]);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Food</Text>
      </View>
      {/* Search Bar */}
      <View className="flex flex-row w-full">
        <TextInput
          className="bg-white w-3/4"
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
          autoCapitalize="none"
        />
        <Button className="w-1/4 bg-green-400" onPress={getFoodData}>
          <FontAwesome5 name="search" size={32} color="black" />
        </Button>
      </View>
      {/* Food content (from an API) */}
      {foodLoading ? (
        <SafeAreaView className="">
          <ActivityIndicator color={"black"} />
        </SafeAreaView>
      ) : (
        <View className="flex flex-1">
          <FlatList
            contentContainerStyle={{ gap: 10, padding: 10 }}
            data={foodData}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={(food) => (
              <>
                <Button
                  onPress={() =>
                    router.push({
                      pathname: "/foodInfo",
                      params: {
                        food_id: food.item.food_id,
                        name: food.item.food_name,
                        brand_name: `${food.item.brand_name ? `${food.item.brand_name}` : ""}`,
                        type: food.item.food_type,
                        description: food.item.food_description,
                        user: user,
                      },
                    })
                  }
                  className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black"
                  key={food.item.food_id}
                >
                  <ButtonText>
                    {food.item.food_name}{" "}
                    {`${food.item.brand_name ? `(${food.item.brand_name})` : ""}`}
                  </ButtonText>
                </Button>
              </>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({});

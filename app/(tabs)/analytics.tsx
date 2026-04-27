import { supabase } from "@/lib/supabase";
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
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

interface FoodData {
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  quantity: number;
}

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState<FoodData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [pieData, setPieData] = useState([
    { value: 1229, color: "#177AD5" },
    { value: 200, color: "#79D2DE" },
    { value: 242, color: "#ED6665" },
    { value: 140, color: "yellow" },
  ]);

  // Scroll down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function getFoodData(id: string) {
    try {
      const { data, error } = await supabase
        .from("groceries")
        .select("calories, fat, carbs, protein, quantity")
        .eq("uuid", id);
      if (error) {
        console.log(error);
        Alert.alert("Unexpected Error Occurred");
      } else {
        setFoodData(data);
        console.log(foodData);
      }
    } catch (e) {
      Alert.alert("Unexpected Error Occurred");
      console.log(e);
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
        console.log("User:", user.id);
        getFoodData(user.id);
      } else {
        Alert.alert("Unexpected Error Occurred");
        console.log(error);
      }
    } catch (e) {
      Alert.alert("Unexpected Error Occurred");
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Analytics</Text>
      </View>
      {/* Food Analytics */}
      {loading ? (
        <View className="flex-col flex-1 justify-center items-center">
          <ActivityIndicator color={"black"} />
        </View>
      ) : (
        <ScrollView
          contentContainerClassName="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Pie Chart */}
          <View className="flex-row justify-center items-center p-5">
            <PieChart donut radius={130} innerRadius={20} data={pieData} />
          </View>

          {/* Food Info */}
          <View className="flex-col m-2 min-h-[5rem] gap-3">
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Calories</Text>
                <Text>1229</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-blue-500 h-full`}
                  style={{ width: `70%` }}
                />
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Carbs</Text>
                <Text>15.2g</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-red-500 h-full`}
                  style={{ width: `30%` }}
                />
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Fat</Text>
                <Text>10.5g</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-cyan-500 h-full`}
                  style={{ width: `20%` }}
                />
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Protein</Text>
                <Text>140g</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-blue-500 h-full`}
                  style={{ width: `40%` }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({});

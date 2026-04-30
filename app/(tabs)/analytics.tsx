import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

interface FoodData {
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  quantity: number;
}

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState<FoodData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Compute totals once
  const totals = useMemo(() => {
    const calories = foodData.reduce((t, c) => t + c.calories * c.quantity, 0);
    const carbs = foodData.reduce((t, c) => t + c.carbs * c.quantity, 0);
    const fat = foodData.reduce((t, c) => t + c.fat * c.quantity, 0);
    const protein = foodData.reduce((t, c) => t + c.protein * c.quantity, 0);

    const total = calories + carbs + fat + protein;

    return { calories, carbs, fat, protein, total };
  }, [foodData]);

  // Pie data derived from totals
  const pieData = useMemo(() => {
    return [
      { value: totals.calories, color: "#177ad5" },
      { value: totals.fat, color: "#79D2DE" },
      { value: totals.carbs, color: "#ED6665" },
      { value: totals.protein, color: "yellow" },
    ];
  }, [totals]);

  // Helper for percentages
  const getPercent = (value: number) => {
    if (totals.total === 0) return 0;
    return (value / totals.total) * 100;
  };

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
        setFoodData(data || []);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Unexpected Error Occurred");
    }
  }

  async function getUserData(isRefresh = false) {
    try {
      if (!isRefresh) setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        await getFoodData(user.id);
      } else {
        console.log(error);
        Alert.alert("Unexpected Error Occurred");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Unexpected Error Occurred");
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    getUserData();
  }, []);

  // Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserData(true);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Analytics</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="black" />
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

          {/* Bars */}
          <View className="flex-col m-2 gap-3">
            {/* Calories */}
            <View>
              <View className="flex-row justify-between">
                <Text>Calories</Text>
                <Text>{getPercent(totals.calories).toFixed(2)}%</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className="bg-blue-500 h-full"
                  style={{ width: `${getPercent(totals.calories)}%` }}
                />
              </View>
            </View>

            {/* Carbs */}
            <View>
              <View className="flex-row justify-between">
                <Text>Carbs</Text>
                <Text>{getPercent(totals.carbs).toFixed(2)}%</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className="bg-red-500 h-full"
                  style={{ width: `${getPercent(totals.carbs)}%` }}
                />
              </View>
            </View>

            {/* Fat */}
            <View>
              <View className="flex-row justify-between">
                <Text>Fat</Text>
                <Text>{getPercent(totals.fat).toFixed(2)}%</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className="bg-cyan-500 h-full"
                  style={{ width: `${getPercent(totals.fat)}%` }}
                />
              </View>
            </View>

            {/* Protein */}
            <View>
              <View className="flex-row justify-between">
                <Text>Protein</Text>
                <Text>{getPercent(totals.protein).toFixed(2)}%</Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className="bg-yellow-500 h-full"
                  style={{ width: `${getPercent(totals.protein)}%` }}
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

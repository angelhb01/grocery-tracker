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
  carbs: number;
  fat: number;
  protein: number;
  quantity: number;
}

interface PieData {
  value: number;
  color: string;
}

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState<FoodData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const [pieData, setPieData] = useState<PieData[]>([]);

  const [dataTotal, setDataTotal] = useState(0);

  // Scroll down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Update latest information about the food
  function updateAnalytics(data: FoodData[]) {
    // Add the total value of all the nutrients
    setDataTotal(
      data.reduce((total, curr) => {
        return (
          (total + curr.calories + curr.carbs + curr.fat + curr.protein) *
          curr.quantity
        );
      }, 0),
    );

    setPieData([
      {
        value: data.reduce((total, curr) => {
          return (total + curr.calories) * curr.quantity;
        }, 0),
        color: "#177ad5",
      },
      {
        value: data.reduce((total, curr) => {
          return (total + curr.fat) * curr.quantity;
        }, 0),
        color: "#79D2DE",
      },
      {
        value: data.reduce((total, curr) => {
          return (total + curr.carbs) * curr.quantity;
        }, 0),
        color: "#ED6665",
      },
      {
        value: data.reduce((total, curr) => {
          return (total + curr.protein) * curr.quantity;
        }, 0),
        color: "yellow",
      },
    ]);
  }

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
        updateAnalytics(data);
        console.log(data);
      }
    } catch (e) {
      Alert.alert("Unexpected Error Occurred");
      console.log(e);
    }
  }

  async function getUserData() {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        //console.log("User:", user.id);
        //console.log(userID);
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
    setTimeout(() => {
      setInitialLoad(true);
    }, 1000);
  }, []);

  useEffect(() => {
    getUserData();
  }, [refreshing]);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Analytics</Text>
      </View>
      {/* Food Analytics */}
      {loading && !initialLoad ? (
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
                <Text>
                  {(
                    (foodData.reduce((total, curr) => {
                      return (total + curr.calories) * curr.quantity;
                    }, 0) /
                      dataTotal) *
                    100
                  ).toFixed(2)}
                  %
                </Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-blue-500 h-full`}
                  style={{
                    width: `${
                      (foodData.reduce((total, curr) => {
                        return (total + curr.calories) * curr.quantity;
                      }, 0) /
                        dataTotal) *
                      100
                    }%`,
                  }}
                />
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Carbs</Text>
                <Text>
                  {(
                    (foodData.reduce((total, curr) => {
                      return (total + curr.carbs) * curr.quantity;
                    }, 0) /
                      dataTotal) *
                    100
                  ).toFixed(2)}
                  %
                </Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-red-500 h-full`}
                  style={{
                    width: `${
                      (foodData.reduce((total, curr) => {
                        return (total + curr.carbs) * curr.quantity;
                      }, 0) /
                        dataTotal) *
                      100
                    }%`,
                  }}
                />
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Fat</Text>
                <Text>
                  {(
                    (foodData.reduce((total, curr) => {
                      return (total + curr.fat) * curr.quantity;
                    }, 0) /
                      dataTotal) *
                    100
                  ).toFixed(2)}
                  %
                </Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-cyan-500 h-full`}
                  style={{
                    width: `${
                      (foodData.reduce((total, curr) => {
                        return (total + curr.fat) * curr.quantity;
                      }, 0) /
                        dataTotal) *
                      100
                    }%`,
                  }}
                />
              </View>
            </View>
            <View className="flex-col">
              <View className="flex-row justify-between">
                <Text>Protein</Text>
                <Text>
                  {(
                    (foodData.reduce((total, curr) => {
                      return (total + curr.protein) * curr.quantity;
                    }, 0) /
                      dataTotal) *
                    100
                  ).toFixed(2)}
                  %
                </Text>
              </View>
              <View className="h-8 w-full rounded-xl overflow-hidden bg-gray-200">
                <View
                  className={`bg-yellow-500 h-full`}
                  style={{
                    width: `${
                      (foodData.reduce((total, curr) => {
                        return (total + curr.protein) * curr.quantity;
                      }, 0) /
                        dataTotal) *
                      100
                    }%`,
                  }}
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

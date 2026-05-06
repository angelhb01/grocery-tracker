import Nutrition from "@/components/Nutrition";
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const nutritionColors = {
    calories: "#4CAF50",
    carbs: "#F5A623",
    fat: "#81C784",
    protein: "#C8E6C9",
  };

  // Pie data derived from totals
  const pieData = useMemo(() => {
    return [
      { value: totals.calories, color: nutritionColors.calories },
      { value: totals.fat, color: nutritionColors.fat },
      { value: totals.carbs, color: nutritionColors.carbs },
      { value: totals.protein, color: nutritionColors.protein },
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
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Pie Chart */}
          <View style={styles.pieChartContainer}>
            <PieChart
              donut
              radius={130}
              innerRadius={70}
              data={pieData}
              centerLabelComponent={() => {
                return (
                  <>
                    <View className="flex-col items-center gap-1">
                      <View>
                        <Entypo name="leaf" size={24} color="green" />
                      </View>
                      <View>
                        <Text style={styles.smallText}>Total Calories</Text>
                      </View>
                      <View>
                        <Text className="text-[#008000] text-[1.5rem]">
                          {totals.total.toFixed(2)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.smallText}>kcal</Text>
                      </View>
                    </View>
                  </>
                );
              }}
            />
            <View className="flex-row gap-5">
              <View className="flex-row items-center gap-1">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: `${nutritionColors.calories}` }}
                />
                <Text style={styles.smallText}>Calories</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: `${nutritionColors.carbs}` }}
                />
                <Text style={styles.smallText}>Carbs</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: `${nutritionColors.fat}` }}
                />
                <Text style={styles.smallText}>Fat</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: `${nutritionColors.protein}` }}
                />
                <Text style={styles.smallText}>Protein</Text>
              </View>
            </View>
          </View>

          {/* Bars */}
          <View className="flex-col mx-5 gap-3">
            {/* Calories */}
            <Nutrition
              name={"Calories"}
              icon={
                <AntDesign
                  name="fire"
                  size={25}
                  color={nutritionColors.calories}
                />
              }
              getPercent={getPercent}
              total={totals.total}
              nutritionValue={totals.calories}
              nutritionColor={nutritionColors.calories}
            />

            {/* Carbs */}
            <Nutrition
              name={"Carbs"}
              icon={
                <FontAwesome6
                  name="wheat-awn"
                  size={25}
                  color={nutritionColors.carbs}
                />
              }
              getPercent={getPercent}
              total={totals.total}
              nutritionValue={totals.carbs}
              nutritionColor={nutritionColors.carbs}
            />

            {/* Fat */}
            <Nutrition
              name={"Fat"}
              icon={<Ionicons name="water-sharp" size={30} color="#4CAF50" />}
              getPercent={getPercent}
              total={totals.total}
              nutritionValue={totals.fat}
              nutritionColor={nutritionColors.fat}
            />

            {/* Protein */}
            <Nutrition
              name={"Protein"}
              icon={
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={30}
                  color="#4CAF50"
                />
              }
              getPercent={getPercent}
              total={totals.total}
              nutritionValue={totals.protein}
              nutritionColor={nutritionColors.protein}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  smallText: {
    fontSize: 11,
    color: "#696969",
  },
  pieChartContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});

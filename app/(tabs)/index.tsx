import GroceryItem from "@/components/GroceryItem";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface Groceries {
  id: number;
  product_name: string;
  product_desc: string;
  quantity: number;
}

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [groceries, setGroceries] = useState<Groceries[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userID, setUserID] = useState("");

  async function loadGroceries(isRefresh = false) {
    try {
      if (!isRefresh) setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      setUserID(user.id);

      const { data, error } = await supabase
        .from("groceries")
        .select()
        .eq("uuid", user.id);

      if (error) throw error;

      setGroceries(data || []);
    } catch (e) {
      console.log(e);
      Alert.alert("Error loading groceries");
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const { error } = await supabase.from("groceries").delete().eq("id", id);
      if (error) throw error;

      setGroceries((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.log(e);
      Alert.alert("Unexpected Error Occurred");
    }
  }

  async function handleEdit(id: number) {
    console.log("Editing item");
    router.push({
      pathname: "/editFood",
      params: { userID: userID, groceryID: id },
    });
  }

  // Initial load
  useEffect(() => {
    loadGroceries();
  }, []);

  // Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGroceries(true);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView>
        {/* Header */}
        <View className="p-5 border-b-2 h-[6rem]">
          <Text className="text-3xl text-center">Grocery List</Text>
        </View>

        {/* Add food */}
        <View>
          <Button onPress={() => router.push({ pathname: "/addFood" })}>
            <Entypo name="circle-with-plus" size={32} color="black" />
          </Button>
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="black" />
          </View>
        ) : (
          <ScrollView
            contentContainerClassName="flex-grow gap-5 p-5"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {groceries.length === 0 ? (
              <Text className="text-center text-gray-500">
                No groceries yet
              </Text>
            ) : (
              groceries.map((item) => (
                <GroceryItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            )}
          </ScrollView>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Groceries {
  product_name: string;
  product_desc: string;
  quantity: number;
}

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [groceries, setGroceries] = useState<Array<Groceries>>();
  const [refreshing, setRefreshing] = useState(false);

  // Scroll down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function loadGroceries() {
    setLoading(true);

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("groceries")
          .select("product_name, product_desc, quantity")
          .eq("uuid", user.id);

        if (error) {
          console.log(error);
        } else {
          setGroceries(data);
          console.log(data);
        }
      } else {
        console.log(error);
      }
    } catch (e) {
      Alert.alert("" + e);
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroceries();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Grocery List</Text>
      </View>

      {/* Grocery list */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, gap: 10, padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* List of Foods */}
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
        <View className="h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black">
          <Text>Apple</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

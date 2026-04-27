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
import { SafeAreaView } from "react-native-safe-area-context";

interface Groceries {
  id: number;
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
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("groceries")
          .select("id, product_name, product_desc, quantity")
          .eq("uuid", user.id);

        if (error) {
          console.log(error);
        } else {
          setGroceries(data);
          //console.log(data);
        }
      } else {
        console.log(error);
      }
    } catch (e) {
      Alert.alert("" + e);
      console.log(e);
    }
  }

  // Initital groceries list rendered
  useEffect(() => {
    setLoading(true);
    loadGroceries();
    setLoading(false);
  }, []);

  // Refresh groceries list
  useEffect(() => {
    loadGroceries();
  }, [refreshing]);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Grocery List</Text>
      </View>

      {/* Add your own food */}
      <View className="">
        <Button onPress={() => router.push({ pathname: "/addFood" })}>
          <Entypo name="circle-with-plus" size={32} color="black" />
        </Button>
      </View>

      {/* Grocery list */}
      {loading ? (
        <View>
          <ActivityIndicator color={"black"} />
        </View>
      ) : (
        /* List of Foods */
        <ScrollView
          contentContainerClassName="flex-grow-1 gap-5 p-5"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {groceries?.map((item) => (
            <View
              className="min-h-[10rem] p-5 bg-white rounded-xl border-2 border-solid border-black"
              key={item.id}
            >
              <Text>Name: {item.product_name}</Text>
              <Text>Description:</Text>
              <Text>{item.product_desc}</Text>
              <Text>Quantity: {item.quantity}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

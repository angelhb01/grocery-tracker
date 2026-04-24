import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FoodInfo = () => {
  const { food_id, name, brand_name, type, description, user } =
    useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  async function addToGroceries() {
    setLoading(true);
    try {
      const { data: existing, error } = await supabase
        .from("groceries")
        .select("quantity")
        .eq("uuid", user)
        .eq("id", food_id)
        .single();

      if (existing) {
        await supabase
          .from("groceries")
          .update({ quantity: existing.quantity + 1 })
          .eq("uuid", user)
          .eq("id", food_id);

        Alert.alert("Successfully added to groceries");
      } else if (!existing) {
        await supabase.from("groceries").insert([
          {
            id: food_id,
            uuid: user,
            product_name: name,
            product_desc: description,
            product_type: type,
            brand_name: brand_name,
            quantity: 1,
          },
        ]);
        Alert.alert("Successfully added to groceries");
      } else {
        Alert.alert(error);
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="p-10 flex-col gap-5 justify-center h-full">
      {/* Description Header */}
      <View>
        <Text>Name:</Text>
        <Text>
          {name} {brand_name ? `(${brand_name})` : ""}
        </Text>
      </View>
      <View>
        <Text>Type:</Text>
        <Text>{type}</Text>
      </View>
      <View>
        <Text>Description:</Text>
        <Text>{description}</Text>
      </View>
      {/* Button to add to groceries */}
      <Button
        className="flex gap-5 bg-blue-300"
        onPress={addToGroceries}
        disabled={loading}
      >
        <View>
          <FontAwesome6 name="add" size={24} color="black" />
        </View>
        <View>
          <ButtonText>Add to Groceries</ButtonText>
        </View>
      </Button>
    </SafeAreaView>
  );
};

export default FoodInfo;

const styles = StyleSheet.create({});

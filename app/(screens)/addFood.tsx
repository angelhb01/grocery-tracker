import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const AddFood = () => {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [user, setUser] = useState();

  // Dropdown values
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState("");
  const [items, setItems] = useState([
    { label: "Generic", value: "generic" },
    { label: "Brand", value: "brand" },
  ]);

  async function addToGroceries() {
    if (
      productName.trim() === "" ||
      productType.trim() === "" ||
      calories.trim() === "" ||
      fat.trim() === "" ||
      carbs.trim() === "" ||
      protein.trim() === "" ||
      quantity.trim() === "" ||
      quantity === "0"
    ) {
      Alert.alert("Please fill the required fields");
      return;
    }
    setLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from("groceries").insert([
          {
            uuid: user.id,
            product_name: productName.toLowerCase(),
            product_desc: productDescription.toLowerCase(),
            product_type: productType.toLowerCase(),
            calories: Number(calories),
            fat: Number(fat),
            carbs: Number(carbs),
            protein: Number(protein),
            quantity: Number(quantity),
          },
        ]);

        if (error) {
          Alert.alert("Unexpected Error Occurred");
          console.log(error);
        } else {
          Alert.alert("Successfully Added to Groceries");
          router.back();
        }
      }

      if (error) {
        Alert.alert("Unexpected Error Occurred");
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  function handleTextChange(text: string) {
    let numericValue = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    return numericValue;
  }

  return (
    <SafeAreaView className="p-10 flex-col gap-5 justify-center h-full">
      {/* Add product description */}
      <View className="flex-col gap-1">
        <Text>
          Name:
          <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="bg-white h-12 p-2 border-[1px] rounded-md"
          value={productName}
          onChangeText={(text) => setProductName(text)}
          autoCapitalize="none"
        />
      </View>
      <View className="flex-col gap-1">
        <Text>Description:</Text>
        <TextInput
          className="bg-white h-12 p-2 border-[1px] rounded-md"
          value={productDescription}
          onChangeText={(text) => setProductDescription(text)}
          autoCapitalize="none"
        />
      </View>
      <View className="flex-col gap-1">
        <Text>
          Type:
          <Text className="text-red-500">*</Text>
        </Text>
        <DropDownPicker
          open={open}
          value={productType}
          items={items}
          setOpen={setOpen}
          setValue={setProductType}
          setItems={setItems}
        />
      </View>
      {/* Numerical inputs */}
      <View className="gap-2 w-1/2">
        <View className="flex flex-row justify-between">
          <Text>
            Calories:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white w-[4rem] p-1 border-[1px] rounded-md"
            keyboardType="decimal-pad"
            value={calories}
            onChangeText={(text) => setCalories(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>
            Fat (g):
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white w-[4rem] p-1 border-[1px] rounded-md"
            keyboardType="decimal-pad"
            value={fat}
            onChangeText={(text) => setFat(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>
            Carbs (g):
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white w-[4rem] p-1 border-[1px] rounded-md"
            keyboardType="decimal-pad"
            value={carbs}
            onChangeText={(text) => setCarbs(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>
            Protein (g):
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white w-[4rem] p-1 border-[1px] rounded-md"
            keyboardType="decimal-pad"
            value={protein}
            onChangeText={(text) => setProtein(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>
            Quantity:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white w-[4rem] p-1 border-[1px] rounded-md"
            keyboardType="decimal-pad"
            value={quantity}
            onChangeText={(text) => setQuantity(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
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

export default AddFood;

const styles = StyleSheet.create({});

import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
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
  const [quantity, setQuantity] = useState("");

  // Dropdown values
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState("");
  const [items, setItems] = useState([
    { label: "Generic", value: "generic" },
    { label: "Brand", value: "brand" },
  ]);

  async function addToGroceries() {
    setLoading(true);
    try {
      await supabase.from("groceries").insert([
        {
          product_name: productName,
          product_type: productType,
          calories: Number(calories),
          fat: Number(fat),
          carbs: Number(carbs),
          protein: Number(protein),
          quantity: Number(quantity),
        },
      ]);
      Alert.alert("Successfully added to groceries");
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
        <Text>Name:</Text>
        <TextInput
          className="bg-white h-10 border-solid p-2"
          value={productName}
          onChangeText={(text) => setProductName(text)}
          autoCapitalize="none"
        />
      </View>
      <View className="flex-col gap-1">
        <Text>Description:</Text>
        <TextInput
          className="bg-white h-10 p-2"
          value={productDescription}
          onChangeText={(text) => setProductDescription(text)}
          autoCapitalize="none"
        />
      </View>
      <View className="flex-col gap-1">
        <Text>Type:</Text>
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
          <Text>Calories:</Text>
          <TextInput
            className="bg-white w-[4rem] p-1"
            keyboardType="decimal-pad"
            value={calories}
            onChangeText={(text) => setCalories(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>Fat (g):</Text>
          <TextInput
            className="bg-white w-[4rem] p-1"
            keyboardType="decimal-pad"
            value={fat}
            onChangeText={(text) => setFat(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>Carbs (g):</Text>
          <TextInput
            className="bg-white w-[4rem] p-1"
            keyboardType="decimal-pad"
            value={carbs}
            onChangeText={(text) => setCarbs(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>Protein (g):</Text>
          <TextInput
            className="bg-white w-[4rem] p-1"
            keyboardType="decimal-pad"
            value={protein}
            onChangeText={(text) => setProtein(handleTextChange(text))}
            autoCapitalize="none"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text>Quantity:</Text>
          <TextInput
            className="bg-white w-[4rem] p-1"
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

import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const AddFoodScreen = () => {
  const { userID, groceryID } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [quantity, setQuantity] = useState("1");

  // Dropdown values
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState("");
  const [items, setItems] = useState([
    { label: "Generic", value: "generic" },
    { label: "Brand", value: "brand" },
  ]);

  async function updateGroceries() {
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
        const { data, error } = await supabase
          .from("groceries")
          .update({
            product_name: productName.toLowerCase(),
            product_desc: productDescription.toLowerCase(),
            product_type: productType.toLowerCase(),
            calories: Number(calories),
            fat: Number(fat),
            carbs: Number(carbs),
            protein: Number(protein),
            quantity: Number(quantity),
          })
          .eq("id", groceryID)
          .eq("uuid", user.id);

        if (error) {
          Alert.alert("Unexpected Error Occurred");
          console.log(error);
        } else {
          Alert.alert("Successfully Updated Groceries");
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

  async function getGroceryDetails() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("groceries")
        .select()
        .eq("id", groceryID)
        .eq("uuid", userID);

      if (error) {
        throw new Error();
      } else {
        setProductName(String(data[0].product_name));
        setProductDescription(String(data[0].product_desc));
        setProductType(String(data[0].product_type));
        setCalories(String(data[0].calories));
        setFat(String(data[0].fat));
        setCarbs(String(data[0].carbs));
        setProtein(String(data[0].protein));
        setQuantity(String(data[0].quantity));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getGroceryDetails();
  }, []);

  function handleTextChange(text: string) {
    let numericValue = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    return numericValue;
  }

  return (
    <SafeAreaView className="p-10 flex-col gap-5 justify-center h-full">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="black" />
        </View>
      ) : (
        <>
          {/* Add product description */}
          <View className="flex-col gap-1">
            <Text>
              Name:
              <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="bg-white text-black h-12 p-2 border-[1px] rounded-md"
              value={productName}
              onChangeText={(text) => setProductName(text)}
              autoCapitalize="none"
            />
          </View>
          <View className="flex-col gap-1">
            <Text>Description:</Text>
            <TextInput
              className="bg-white text-black h-12 p-2 border-[1px] rounded-md"
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
              style={{ backgroundColor: "white" }}
              dropDownContainerStyle={{
                backgroundColor: "white",
                zIndex: 1000,
              }}
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
                className="bg-white text-black w-[4rem] p-1 border-[1px] rounded-md"
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
                className="bg-white text-black w-[4rem] p-1 border-[1px] rounded-md"
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
                className="bg-white text-black w-[4rem] p-1 border-[1px] rounded-md"
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
                className="bg-white text-black w-[4rem] p-1 border-[1px] rounded-md"
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
                className="bg-white text-black w-[4rem] p-1 border-[1px] rounded-md"
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
            onPress={updateGroceries}
            disabled={loading}
          >
            <View>
              <FontAwesome6 name="add" size={24} color="black" />
            </View>
            <View>
              <ButtonText>Update Groceries</ButtonText>
            </View>
          </Button>
        </>
      )}
    </SafeAreaView>
  );
};

export default AddFoodScreen;

const styles = StyleSheet.create({});

import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Feather,
  FontAwesome6,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const AddFoodScreen = () => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="">
          <ScrollView contentContainerClassName="flex-col justify-center mt-5 mx-5 gap-7 pb-5">
            <View className="flex-col justify-center w-full items-center">
              <View className="flex-row w-full">
                <Button
                  className="rounded-full absolute bg-green-100 w-[3rem] h-[3rem] flex justify-center items-center p-0"
                  onPress={() => router.back()}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={20}
                    color="#008000"
                  />
                </Button>
                <View className="w-[4.5rem] h-[4.5rem] rounded-full bg-green-100 m-auto flex justify-center items-center">
                  <FontAwesome
                    name="shopping-basket"
                    size={24}
                    color="#008000"
                  />
                </View>
              </View>
              <Text className="text-[2rem] text-[#008000]">Add Food Item</Text>
              <Text className="text-xs text-slate-500">
                Add a new item to your groceries
              </Text>
            </View>
            <View
              className="bg-white p-10 flex-col gap-5 rounded-xl"
              style={styles.formContainer}
            >
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
              <View className="gap-2 flex-col">
                <View className="flex flex-row justify-start gap-10">
                  <Text className="min-w-[8rem]">
                    Calories:
                    <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="bg-white border-[1px] rounded-md ml-auto h-[3rem] flex-row justify-start flex-1">
                    <View className="h-full w-[2.5rem] border-r-[1px] items-center justify-center">
                      <SimpleLineIcons name="fire" size={24} color="#008000" />
                    </View>
                    <TextInput
                      className=" text-black p-1 h-full flex-1"
                      keyboardType="decimal-pad"
                      value={calories}
                      onChangeText={(text) =>
                        setCalories(handleTextChange(text))
                      }
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View className="flex flex-row justify-start gap-10">
                  <Text className="min-w-[8rem]">
                    Fat (g):
                    <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="bg-white border-[1px] rounded-md ml-auto h-[3rem] flex-row justify-start flex-1">
                    <View className="h-full w-[2.5rem] border-r-[1px] items-center justify-center">
                      <Ionicons
                        name="water-outline"
                        size={24}
                        color="#008000"
                      />
                    </View>
                    <TextInput
                      className="text-black p-1 h-full flex-1"
                      keyboardType="decimal-pad"
                      value={fat}
                      onChangeText={(text) => setFat(handleTextChange(text))}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View className="flex flex-row justify-between gap-10">
                  <Text className="min-w-[8rem]">
                    Carbs (g):
                    <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="bg-white border-[1px] rounded-md ml-auto h-[3rem] flex-row justify-start flex-1">
                    <View className="h-full w-[2.5rem] border-r-[1px] items-center justify-center">
                      <FontAwesome6
                        name="jar-wheat"
                        size={24}
                        color="#008000"
                      />
                    </View>
                    <TextInput
                      className="text-black p-1 h-full flex-1"
                      keyboardType="decimal-pad"
                      value={carbs}
                      onChangeText={(text) => setCarbs(handleTextChange(text))}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View className="flex flex-row justify-between gap-10">
                  <Text className="min-w-[8rem]">
                    Protein (g):
                    <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="bg-white border-[1px] rounded-md ml-auto h-[3rem] flex-row justify-start flex-1">
                    <View className="h-full w-[2.5rem] border-r-[1px] items-center justify-center">
                      <MaterialCommunityIcons
                        name="arm-flex-outline"
                        size={24}
                        color="#008000"
                      />
                    </View>
                    <TextInput
                      className="text-black p-1 h-full flex-1"
                      keyboardType="decimal-pad"
                      value={protein}
                      onChangeText={(text) =>
                        setProtein(handleTextChange(text))
                      }
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View className="flex flex-row justify-between gap-10">
                  <Text className="min-w-[8rem]">
                    Quantity:
                    <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="bg-white border-[1px] rounded-md ml-auto h-[3rem] flex-row justify-start flex-1">
                    <View className="h-full w-[2.5rem] border-r-[1px] flex justify-center items-center">
                      <Feather name="shopping-bag" size={25} color="#008000" />
                    </View>
                    <TextInput
                      className="text-black p-1 h-full flex-1"
                      keyboardType="decimal-pad"
                      value={quantity}
                      onChangeText={(text) =>
                        setQuantity(handleTextChange(text))
                      }
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>
              {/* Button to add to groceries */}
              <Button
                className="flex gap-5 bg-green-600"
                onPress={addToGroceries}
                disabled={loading}
              >
                <View>
                  <FontAwesome6 name="add" size={24} color="white" />
                </View>
                <View>
                  <ButtonText className="text-white">
                    Add to Groceries
                  </ButtonText>
                </View>
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddFoodScreen;

const styles = StyleSheet.create({
  formContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

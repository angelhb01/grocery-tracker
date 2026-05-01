import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "./ui/button";

interface Groceries {
  id: number;
  product_name: string;
  product_desc: string;
  quantity: number;
}

export default function GroceryItem({
  item,
  onDelete,
  onEdit,
}: {
  item: Groceries;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const translateX = useSharedValue(0);

  const swipe = Gesture.Pan()
    .activeOffsetX([-10, 10]) // require horizontal movement
    .failOffsetY([-10, 10]) // fail if vertical movement detected
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        translateX.value = withTiming(-120, { duration: 200 });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedSwipe = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="w-full">
      {/* Background */}
      <View className="absolute right-0 top-0 bottom-0 h-full w-full">
        <Button
          className="absolute right-0 top-0 bottom-0 w-[110px] h-[40%] bg-red-500 justify-center items-center rounded-full"
          onPress={() => onDelete(item.id)}
        >
          <AntDesign name="delete" size={24} color="white" />
        </Button>
        <Button
          className="absolute right-0 top-auto bottom-0 w-[110px] h-[40%] bg-blue-400 justify-center items-center rounded-full"
          onPress={() => onEdit(item.id)}
        >
          <Feather name="edit" size={24} color="white" />
        </Button>
      </View>

      {/* Foreground */}
      <GestureDetector gesture={swipe}>
        <Animated.View style={[animatedSwipe, styles.groceryContainer]}>
          <View className="border-b border-slate-300 flex-row justify-start gap-5 items-center">
            <View className="bg-green-200 rounded-full p-2">
              <AntDesign name="tag" size={24} color="#008000" />
            </View>
            <View>
              <Text className="color-[#929292]">Name:</Text>
              <Text>{item.product_name}</Text>
            </View>
          </View>
          <View className="border-b border-slate-300 flex-row justify-start gap-5 items-center">
            <View className="bg-green-200 rounded-full p-2">
              <FontAwesome5 name="list-alt" size={24} color="#008000" />
            </View>
            <View>
              <Text className="color-[#929292]">Description:</Text>
              <Text>{`${item.product_desc ? item.product_desc : "--"}`}</Text>
            </View>
          </View>
          <View className="flex-row justify-start gap-5 items-center">
            <View className="bg-green-200 rounded-full p-2">
              <Feather name="package" size={24} color="#008000" />
            </View>
            <View>
              <Text className="color-[#929292]">Quantity:</Text>
              <Text>{item.quantity}</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  groceryContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#FFFFFF",
    minHeight: 230,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

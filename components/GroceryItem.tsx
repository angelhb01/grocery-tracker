import { Text, View } from "react-native";
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
  const translateY = useSharedValue(0);

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
          className="absolute right-0 top-0 bottom-0 w-[110px] h-1/2 bg-red-500 justify-center items-center rounded-xl"
          onPress={() => onDelete(item.id)}
        >
          <Text className="text-white font-bold">Delete</Text>
        </Button>
        <Button
          className="absolute right-0 top-auto bottom-0 w-[110px] h-1/2 bg-blue-400 justify-center items-center rounded-xl"
          onPress={() => onEdit(item.id)}
        >
          <Text className="text-white font-bold">Edit</Text>
        </Button>
      </View>

      {/* Foreground */}
      <GestureDetector gesture={swipe}>
        <Animated.View
          className="min-h-[10rem] p-5 bg-white rounded-xl border-2 border-black"
          style={animatedSwipe}
        >
          <Text>Name: {item.product_name}</Text>
          <Text>Description:</Text>
          <Text>{item.product_desc}</Text>
          <Text>Quantity: {item.quantity}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

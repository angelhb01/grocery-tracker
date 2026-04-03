import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Grocery List</Text>
      </View>

      {/* Grocery list */}
      <View className="flex-1 p-10 justify-center flex-col">
        <View className="bg-yellow-400 p-3 h-[35rem] rounded-lg border-2 shadow-md">
          {/* Title */}
          <View className="flex flex-row justify-between mb-5">
            <Text className="text-2xl">Grocery list</Text>
            <Text className="text-2xl">Edit</Text>
          </View>
          {/* Content */}
          <ScrollView className="">
            {/* List of Foods */}
            <View className="bg-yellow-500 h-20 mb-5">
              <Text>Apple</Text>
            </View>
            <View className="bg-yellow-500 h-20 mb-5">
              <Text>Orange</Text>
            </View>
            <View className="bg-yellow-500 h-20 mb-5">
              <Text>Grapes</Text>
            </View>
            <View className="bg-yellow-500 h-20 mb-5">
              <Text>Beef</Text>
            </View>
            <View className="bg-yellow-500 h-20 mb-5">
              <Text>Chicken</Text>
            </View>
            <View className="bg-yellow-500 h-20 mb-5">
              <Text>Brocolli</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

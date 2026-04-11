import { Button, ButtonText } from "@/components/ui/button";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const foodInfo = () => {
  const { description } = useLocalSearchParams();

  return (
    <SafeAreaView className="p-10 flex-col gap-5 justify-center h-full">
      {/* Description Header */}
      <View>
        <Text>Description:</Text>
        <Text>{description}</Text>
      </View>
      {/* Button to add to groceries */}
      <Button className="flex gap-5 bg-blue-300 ">
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

export default foodInfo;

const styles = StyleSheet.create({});

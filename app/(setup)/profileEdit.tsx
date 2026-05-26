import ProfileEdit from "@/components/auth/ProfileEdit";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileEditScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView className="mt-5">
        <View className="flex-col items-center justify-start gap-2">
          <View className="bg-green-200 p-5 rounded-full">
            <Feather name="shopping-bag" size={30} color="green" />
          </View>
          <Text className="text-3xl mt-1 text-center text-[#008000] font-semibold">
            Welcome!
          </Text>
          <Text className="text-xs text-slate-600">
            Let's get to know you better
          </Text>
        </View>
        <ProfileEdit />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

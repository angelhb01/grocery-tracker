import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const Signout = () => {
  const [loading, setLoading] = useState<boolean>(false);

  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(error.message);
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      disabled={loading}
      onPress={signOut}
      className="bg-white mx-5 min-h-[6rem] flex flex-row items-center justify-start gap-10 rounded-xl"
      variant="solid"
      size="md"
      action="primary"
      style={styles.buttonContainer}
    >
      <View className="bg-green-100 w-[3rem] h-[3rem] flex justify-center items-center rounded-full">
        <Entypo name="log-out" size={25} color="#008000" />
      </View>
      <View className="flex-col flex-1">
        <View className="">
          <ButtonText>Log out</ButtonText>
        </View>
        <View className="text-xs">
          <Text className="text-xs text-slate-500">
            Sign out of your account
          </Text>
        </View>
      </View>
      <View className="ml-auto">
        <MaterialIcons name="keyboard-arrow-right" size={32} />
      </View>
    </Button>
  );
};

export default Signout;

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

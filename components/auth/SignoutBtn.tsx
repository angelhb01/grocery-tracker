import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

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
      router.replace("/(authentication)/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      disabled={loading}
      onPress={signOut}
      className="bg-white m-5 h-[5rem] flex flex-row items-center justify-between gap-10 rounded-xl"
      variant="solid"
      size="md"
      action="primary"
      style={styles.buttonContainer}
    >
      <View>
        <Entypo name="log-out" size={32} />
      </View>
      <View className="mr-auto">
        <ButtonText>Log out</ButtonText>
      </View>
      <View>
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

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, ButtonText } from "../ui/button";

export default function DeleteBtn() {
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    setLoading(true);

    setLoading(false);
  }

  function deleteUser() {
    Alert.alert(
      "Delete account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleConfirmDelete(),
        },
      ],
    );
  }

  return (
    <Button
      disabled={loading}
      onPress={deleteUser}
      className="bg-white mx-5 min-h-[6rem] flex flex-row items-center justify-between gap-10 rounded-xl py-5"
      variant="solid"
      size="md"
      action="primary"
      style={styles.buttonContainer}
    >
      <View className="bg-red-100 w-[3rem] h-[3rem] flex justify-center items-center rounded-full">
        <AntDesign name="user-delete" size={25} color="red" />
      </View>
      <View className="flex-col flex-1">
        <View className="">
          <ButtonText>Delete Account</ButtonText>
        </View>
        <View className="text-xs">
          <Text className="text-xs text-slate-500">
            Permanently delete your account
          </Text>
        </View>
      </View>
      <View className="ml-auto">
        <MaterialIcons name="keyboard-arrow-right" size={32} />
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

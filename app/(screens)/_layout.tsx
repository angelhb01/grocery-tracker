import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

const ScreensLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="addFood" />
      <Stack.Screen name="editFood" />
      {/*
      <Stack.Screen name="foodInfo" />
      */}
    </Stack>
  );
};

export default ScreensLayout;

const styles = StyleSheet.create({});

import { Stack } from "expo-router";

export default function SetupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name='profileEdit' options={{ headerBackVisible: false, gestureEnabled: false }} />
    </Stack>
  );
}

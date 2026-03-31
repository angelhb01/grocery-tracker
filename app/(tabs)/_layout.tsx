import { Tabs } from "expo-router";

export default function TabLayout() {

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Grocery" }} />
      <Tabs.Screen name="food" options={{ title: "Food" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
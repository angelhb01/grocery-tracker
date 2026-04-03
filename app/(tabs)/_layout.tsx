import { Tabs } from "expo-router";
import { AntDesign, Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons'

export default function TabLayout() {

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: () => <Foundation name="home" size={30} /> }} />
      <Tabs.Screen name="food" options={{ title: "Food", tabBarIcon: () => <FontAwesome5 name="apple-alt" size={25} /> }} />
      <Tabs.Screen name="camera" options={{ title: "Camera", tabBarIcon: () => <AntDesign name="camera" size={30} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: () => <Ionicons name="person" size={30} /> }} />
    </Tabs>
  );
}
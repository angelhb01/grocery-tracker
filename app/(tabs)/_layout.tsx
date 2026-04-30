import {
  AntDesign,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "",
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ color }) => (
            <AntDesign name="camera" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "",
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="google-analytics"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

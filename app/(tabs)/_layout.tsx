import {
  AntDesign,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
        },
        sceneStyle: { backgroundColor: "#F6FFF7" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarActiveTintColor: "#008000",
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          href: null,
          title: "",
          tabBarActiveTintColor: "#008000",
          tabBarIcon: ({ color }) => (
            <AntDesign name="camera" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "",
          tabBarActiveTintColor: "#008000",
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
          tabBarActiveTintColor: "#008000",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

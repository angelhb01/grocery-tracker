import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

const ScreensLayout = () => {
  return (
    <GluestackUIProvider mode="system">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="addFood" />
        <Stack.Screen name="foodInfo" />
      </Stack>
    </GluestackUIProvider>
  );
};

export default ScreensLayout;

const styles = StyleSheet.create({});

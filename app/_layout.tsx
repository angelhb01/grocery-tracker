import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [hasSession, setHasSession] = useState<boolean>(false);

  useEffect(() => {
    // Checks if a session currently exists on the server.
    const checkSession = async () => {
      const sessionExists = await supabase.auth.getSession();
      setHasSession(!!sessionExists);
      console.log(!!sessionExists);
    };
    checkSession();
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <Stack>
        <Stack.Screen
          name="(authentication)"
          options={{ headerShown: false }}
        />
        <Stack.Protected guard={hasSession}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen
          name="FoodInfo"
          options={{
            title: "Details",
            headerBackButtonDisplayMode: "minimal",
            presentation: "formSheet",
            sheetAllowedDetents: [0.7],
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}

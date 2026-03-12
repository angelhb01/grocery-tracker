import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import '@/global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar, useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export default function RootLayout() {

  const [hasSession, setHasSession] = useState<boolean>(false);

  useEffect(() => {
    // Checks if a session currently exists on the server.
    const checkSession = async () => {
      const sessionExists = await supabase.auth.getSession();
      setHasSession(!!sessionExists)
      console.log(!!sessionExists)
    }
    checkSession()
  }, [])

  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="dark">
      <Stack>
        <Stack.Screen name="(authentication)" options={{headerShown: false}} />
        <Stack.Protected guard={hasSession}>
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  )
}

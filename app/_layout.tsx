import "@/global.css";
import { supabase } from "@/lib/supabase";
import { Session } from '@supabase/supabase-js'
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function RootLayout() {
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Grabs current session and sets the state of whether its true or false
    const loadSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(!!session);
      } catch (e) {
        Alert.alert("Unexpected Error Occurred");
        console.log("Error in loadSession():", e);
      } finally {
        setLoading(false);
      }
    }
    loadSession();

    // Keeps track if the session changes (if user logs out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      setLoading(false);
    })
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} />
      </View>
    )
  }

  const hasSession = !!session;

  return (
    <Stack>
      <Stack.Protected guard={!hasSession}>
        <Stack.Screen name="(authentication)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={hasSession}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(screens)"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

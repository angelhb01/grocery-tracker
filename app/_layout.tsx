import "@/global.css";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// A context is used to keep track of username updates
export const UserProfileContext = createContext<{
  setUsername: (username: string | null) => void;
} | null>(null);

export default function RootLayout() {
  const [username, setUsername] = useState<string | null>(null);
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (error) {
      console.log(error);
      setUsername(null);
      return;
    }

    setUsername(data?.username ?? null);
  }

  useEffect(() => {
    const initalize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(!!session);
        if (session?.user) {
          await loadProfile(session.user.id);
        }
      } catch (e) {
        console.log("Error in loadSession():", e);
      } finally {
        setLoading(false);
      }
    };

    initalize();

    // Keeps track if the session changes (if user logs out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isActive = !!session;
      if (isActive && session?.user) {
        setLoading(true);
        loadProfile(session.user.id).finally(() => setLoading(false));
        setSession(true);
      } else {
        setSession(false);
        setUsername(null);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const hasSession = !!session;
  const hasUsername = !!username;

  return (
    <UserProfileContext.Provider value={{ setUsername }}>
      <Stack>
        {/* Not authenticated */}
        <Stack.Protected guard={!hasSession}>
          <Stack.Screen
            name="(authentication)"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        {/* authenticated but no profile */}
        <Stack.Protected guard={hasSession && !hasUsername}>
          <Stack.Screen name="(setup)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Both authenticated and has a profile */}
        <Stack.Protected guard={hasSession && hasUsername}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </UserProfileContext.Provider>
  );
}

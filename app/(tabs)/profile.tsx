import DeleteBtn from "@/components/auth/DeleteBtn";
import SignOutBtn from "@/components/auth/SignoutBtn";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstlName] = useState("");
  const [lastName, setLastName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Scroll down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Get user's username
  async function getUsername() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id);

        if (error) {
          console.log(error);
        } else {
          setUsername(data[0].username);
          setFirstlName(data[0].first_name);
          setLastName(data[0].last_name);
        }
      } else {
        console.log(error);
      }
    } catch (e) {
      console.log("Unexpected error occurred: " + e);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUsername();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
        <Text className="text-3xl text-center">Profile</Text>
      </View>

      {loading ? (
        <View className="flex-col flex-1 justify-center items-center">
          <ActivityIndicator color={"black"} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Profile */}
          <View className="flex flex-col px-20 p-10 justify-center items-center h-[20rem] gap-1 border-b-slate-50">
            {/* Profile picture */}
            <View className="bg-red-200 rounded-full h-28 w-28 flex justify-center items-center shadow-md mb-5">
              <Text className="text-center text-3xl">
                {String(username[0]).toUpperCase()}
              </Text>
            </View>
            {/* User info */}
            <Text>
              {firstName} {lastName}
            </Text>
            <Text className="text-slate-500">{String(username)}</Text>
          </View>
          {/* Profile buttons */}
          <View>
            <SignOutBtn />
            <DeleteBtn />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

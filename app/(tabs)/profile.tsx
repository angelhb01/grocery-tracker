import DeleteBtn from "@/components/auth/DeleteBtn";
import SignOutBtn from "@/components/auth/SignoutBtn";
import { supabase } from "@/lib/supabase";
import { Entypo } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstlName] = useState("");
  const [lastName, setLastName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Get user's username
  async function getUsername(isRefresh = false) {
    try {
      if (!isRefresh) setLoading(true);

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
      if (!isRefresh) setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    getUsername();
  }, []);

  // Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUsername(true);
    setRefreshing(false);
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
          contentContainerClassName="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Profile */}
          <View
            className="bg-white m-5 rounded-xl flex flex-col px-20 p-10 justify-center items-center h-[19rem] gap-1 border-b-slate-50"
            style={styles.profileContainer}
          >
            {/* Profile picture */}
            <View className="bg-gray-100 rounded-full h-28 w-28 flex justify-center items-center border-solid border-slate-200 border-2 mb-5">
              <View className="bg-green-100 rounded-full h-24 w-24 flex justify-center items-center border-solid">
                <Text className="text-center text-[2.5rem] font-semibold text-[#008000]">
                  {String(username[0]).toUpperCase()}
                </Text>
              </View>
            </View>
            {/* User info */}
            <Text className="text-xl font-semibold">
              {firstName} {lastName}
            </Text>
            <Text className="text-slate-500">{String(username)}</Text>
            <View className="flex-row bg-green-100 rounded-xl items-center justify-start gap-1 p-1 mt-3">
              <View>
                <Entypo name="leaf" size={15} color="green" />
              </View>
              <View>
                <Text className="text-green-800 text-xs">
                  Healthy habits, better you.
                </Text>
              </View>
            </View>
          </View>
          {/* Profile buttons */}
          <View className="flex-col gap-5">
            <SignOutBtn />
            <DeleteBtn />
            <View className="bg-green-100 min-h-[6rem] mx-5 rounded-xl py-5 flex-row items-center justify-between gap-10 px-5 mt-3">
              <View className="bg-green-200 w-[4rem] h-[4rem] flex justify-center items-center rounded-full">
                <FontAwesome6 name="shield-halved" size={24} color="#008000" />
              </View>
              <View className="flex-col flex-1">
                <View className="">
                  <Text className="text-xs text-[#008000]">
                    Your data is safe with us
                  </Text>
                </View>
                <View className="text-xs">
                  <Text className="text-xs text-slate-500">
                    We use industry-standard security to keep your data
                    protected.
                  </Text>
                </View>
              </View>
              <View className="ml-auto">
                <View>
                  <FontAwesome6 name="lock" size={24} color="#008000" />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

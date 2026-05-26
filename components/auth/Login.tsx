import { supabase } from "@/lib/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);

  async function onboarding(user_id: any) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user_id)
        .single();

      if (error) {
        console.log(error.message);
        return null;
      }
      return data;
    } catch (error) {
      console.log("An unknown error occurred:", error);
      return null;
    }
  }

  async function signInWithEmail() {
    setLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Account not found. Try signing up.",
        });
        return;
      }

      const onboardingData = await onboarding(user?.id);
      if (!onboardingData || !onboardingData.username) {
        router.replace("/profileEdit");
      } else {
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={styles.container}
        className="m-6 border-white shadow-sm rounded-md bg-white"
      >
        <View className="flex-col justify-center items-center gap-3">
          <View className="rounded-full bg-green-100 p-4 flex justify-center items-center">
            <Feather name="shopping-bag" size={30} color="green" />
          </View>
          <Text className="text-2xl text-center font-bold">Welcome Back!</Text>
          <Text className="text-1xl text-center text-slate-600">
            Sign in to continue tracking your groceries.
          </Text>
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Text style={styles.label}>Email</Text>
          <View className="flex-row justify-start items-center border border-gray-300 rounded-md">
            <View className="p-2 flex justify-center items-center">
              <Feather name="mail" size={20} color="green" />
            </View>
            <TextInput
              className="text-black flex-1"
              placeholder="Enter your email"
              autoComplete="email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.verticallySpaced}>
          <Text style={styles.label}>Password</Text>
          <View className="flex-row justify-start items-center border border-gray-300 rounded-md">
            <View className="p-2 flex justify-center items-center">
              <AntDesign name="lock" size={20} color="green" />
            </View>
            <TextInput
              className="text-black flex-1"
              placeholder="Enter your password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={securePassword}
              autoCapitalize="none"
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setSecurePassword(!securePassword)}
              className="flex justify-center items-center w-[3rem]"
            >
              <Text>
                {securePassword ? (
                  <Feather name="eye-off" size={20} color="gray" />
                ) : (
                  <Feather name="eye" size={20} color="gray" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => signInWithEmail()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <View className="">
          <Text className="">Don't have an account?</Text>
          <Link
            href={{ pathname: "/(authentication)/signup" }}
            className="text-cyan-600"
          >
            Sign up here
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2E8B57",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

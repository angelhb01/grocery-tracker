import { supabase } from "@/lib/supabase";
import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
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

export default function Signup() {
  // Email and password are updated in the auth.users table
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);

  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    const isValid = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,})/.test(
      password,
    );
    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Password does not meet the requirements.",
        text2: "Please try again.",
      });
      return;
    } else if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error?.status === 422) {
        Toast.show({
          type: "error",
          text1: "User already exists",
          text2: "Please log in",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected Error Occurred",
        });
        console.log(error);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Unexpected Error Occurred",
      });
      console.log("Error in signUpWithEmail():", e);
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
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={30}
              color="green"
            />
          </View>
          <Text className="text-2xl text-center font-bold">
            Create Your Account
          </Text>
          <Text className="text-1xl text-center text-slate-600">
            Join us and start tracking your groceries today.
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
        <View style={styles.verticallySpaced}>
          <Text style={styles.label}>Confirm Password</Text>
          <View className="flex-row justify-start items-center border border-gray-300 rounded-md">
            <View className="p-2 flex justify-center items-center">
              <AntDesign name="lock" size={20} color="green" />
            </View>
            <TextInput
              className="text-black flex-1"
              placeholder="Confirm your password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
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
        <View className="min-h-20 bg-green-100 rounded-md border border-green-200 my-2 p-3">
          <View className="flex-row gap-4">
            <View className="flex-col justify-start">
              <FontAwesome6 name="shield-halved" size={24} color="#008000" />
            </View>
            <View className="flex-1 gap-3">
              <Text className="text-green-700">Password must contain:</Text>
              <View className="flex-col gap-2">
                <View className="flex-row gap-2 justify-start">
                  <AntDesign name="check-circle" size={15} color="green" />
                  <Text className="text-[0.8rem] flex-1">
                    At least 8 characters
                  </Text>
                </View>
                <View className="flex-row gap-2 justify-start">
                  <AntDesign name="check-circle" size={15} color="green" />
                  <Text className="text-[0.8rem] flex-1">1 number</Text>
                </View>
                <View className="flex-row gap-2 justify-start">
                  <AntDesign name="check-circle" size={15} color="green" />
                  <Text className="text-[0.8rem] flex-1">1 uppercase</Text>
                </View>
                <View className="flex-row gap-2 justify-start">
                  <AntDesign name="check-circle" size={15} color="green" />
                  <Text className="text-[0.8rem] flex-1">
                    1 special character
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => signUpWithEmail()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row my-2">
          <Text>Already have an account? </Text>
          <Link
            href={{ pathname: "/(authentication)/login" }}
            className="text-green-700"
          >
            Login here
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

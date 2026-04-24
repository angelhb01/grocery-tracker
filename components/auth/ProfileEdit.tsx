import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileEdit() {
  const [loading, setLoading] = useState(false);

  // firstName, lastName, username are updated in the public.profiles table
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  async function getUserId() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log(error.message);
        return null;
      }
      if (user) {
        console.log("Current user ID:", user.id);
        return user.id;
      } else {
        console.log("No user currently signed in");
        return null;
      }
    } catch (error) {
      console.log("Unexpected error occurred", error);
    }
  }

  async function addUserDetails() {
    setLoading(true);

    try {
      const user_id = await getUserId();
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          username: username,
        })
        .eq("id", user_id)
        .select();

      if (error) {
        console.log(error);
      } else if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        username.trim() === ""
      ) {
        // Issue with else if() statement: prevent the user from inserting invalid credenetials('', ' ', etc.)
        Alert.alert("Invalid Credentials");
      } else {
        router.replace("/(tabs)");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          placeholder="John"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Last name</Text>
        <TextInput
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          placeholder="Doe"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="johndoe123"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => addUserDetails()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    color: "#86939e",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#86939e",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2089dc",
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

import { UserProfileContext } from "@/app/_layout";
import { supabase } from "@/lib/supabase";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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
        return user.id;
      } else {
        console.log("No user currently signed in");
        return null;
      }
    } catch (error) {
      console.log("Unexpected error occurred", error);
    }
  }

  const userProfileContext = useContext(UserProfileContext);

  async function addUserDetails() {
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      username.trim() === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Invalid Credentials",
      });
      return;
    } else if (username.length < 6) {
      Toast.show({
        type: "error",
        text1: "Username has to be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);

    try {
      const user_id = await getUserId();

      if (!user_id) {
        Toast.show({
          type: "error",
          text1: "No user found",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          username,
        })
        .eq("id", user_id);

      if (error) throw error;

      // Update the username data from the UserProfileContext in the root layout
      userProfileContext?.setUsername(username);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={styles.container}
      className="bg-white border border-white shadow rounded-lg mx-4 p-5"
    >
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          placeholder="Your first name"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Last name</Text>
        <TextInput
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          placeholder="Your last name"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Your username"
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

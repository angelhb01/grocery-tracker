import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "../../lib/supabase";
import { Button, ButtonText } from "../ui/button";

export default function DeleteBtn() {
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const router = useRouter();

  async function handleConfirmDelete() {
    setLoading(true);

    try {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId: userId },
      });

      if (error) {
        if (error) {
          let errorMessage = error.message;
          let statusCode = "Unknown";

          try {
            if (error.context) {
              const errorBody = await error.context.json();
              errorMessage = errorBody.error || error.message;
              statusCode = error.context.status.toString();
            }
          } catch (parseError) {
            console.log("Failed to parse error response:", parseError);
          }

          console.log("Status Code:", statusCode);
          console.log("Error Message:", errorMessage);

          Toast.show({
            type: "error",
            text1: "Unexpected Error Occurred",
          });
        }
      } else {
        await supabase.auth.signOut();
        router.replace("/login");
        Toast.show({
          type: "success",
          text1: "Successfully deleted your account",
        });
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Unexpected Error Occurred",
      });
      console.log("Error in handleConfirmDelete():", e);
    } finally {
      setLoading(false);
    }
  }

  function deleteUser() {
    setConfirmVisible(true);
  }

  function onCancelConfirm() {
    setConfirmVisible(false);
  }

  function onConfirm() {
    setConfirmVisible(false);
    handleConfirmDelete();
  }

  return (
    <Button
      disabled={loading}
      onPress={deleteUser}
      className="bg-white mx-5 min-h-[6rem] flex flex-row items-center justify-between gap-10 rounded-xl py-5"
      variant="solid"
      size="md"
      action="primary"
      style={styles.buttonContainer}
    >
      <ConfirmDelete
        visible={confirmVisible}
        onCancel={onCancelConfirm}
        onConfirm={onConfirm}
        loading={loading}
      />
      <View className="bg-red-100 w-[3rem] h-[3rem] flex justify-center items-center rounded-full">
        <AntDesign name="user-delete" size={25} color="red" />
      </View>
      <View className="flex-col flex-1">
        <View className="">
          <ButtonText>Delete Account</ButtonText>
        </View>
        <View className="text-xs">
          <Text className="text-xs text-slate-500">
            Permanently delete your account
          </Text>
        </View>
      </View>
      <View className="ml-auto">
        <MaterialIcons name="keyboard-arrow-right" size={32} />
      </View>
    </Button>
  );
}

// component to display the delete popup
function ConfirmDelete({
  visible,
  onConfirm,
  onCancel,
  loading,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Delete account</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.deleteButton]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.deleteText}>
                {loading ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  cancelText: {
    color: "#111",
    fontWeight: "600",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});

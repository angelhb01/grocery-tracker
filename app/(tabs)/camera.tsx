import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const CameraScreen = () => {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // Set photo uri that was taken
  async function takePicture() {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync();
        router.push({ pathname: "/foodInfo", params: { photoURI: photo.uri } });
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Unexpected Error Occurred",
        });
        console.log("Error at takePicture():", e);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      {isFocused ? (
        <View style={styles.container}>
          <CameraView style={styles.camera} facing="back" ref={cameraRef} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              className={`${loading ? "opacity-[0.5]" : "opacity-[1]"}`}
              style={styles.button}
              onPress={takePicture}
              disabled={loading ? true : false}
            >
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View />
      )}
    </>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

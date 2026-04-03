import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { useState, useRef } from 'react'

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // Breakpoint: Take pictures and show an image of the result to the screen.
  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri)

      return (
        <View>
          <Image 
            source={{ uri: photo.uri}}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing='back' ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CameraScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
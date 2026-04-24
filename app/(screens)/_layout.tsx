import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

const ScreensLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='addFood' />
      <Stack.Screen name='foodInfo' />
    </Stack>
  )
}

export default ScreensLayout

const styles = StyleSheet.create({})
import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='index' />
      <Stack.Screen name='login' />
      <Stack.Screen name='signup' />
    </Stack>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})
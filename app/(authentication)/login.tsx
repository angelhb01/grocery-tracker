import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Login from '@/components/auth/Login';

const LoginScreen = () => {
  return (
    <SafeAreaView className='h-full flex justify-center'>
      <View className='bg-green-400 h-[50%] absolute top-0 left-0 right-0' />
      <View className=''>
        <Text className='w-full text-center text-white text-6xl p-5'>Grocery Tracker</Text>
      </View>
      <Login />
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
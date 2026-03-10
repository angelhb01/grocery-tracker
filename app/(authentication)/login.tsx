import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Login = () => {
  return (
    <SafeAreaView className='h-full'>
      <View className='flex bg-blue-500 m-auto w-[70%] h-[50%]'>
        <Text className='text-4xl'>Login</Text>
        <TextInput className='text-2xl' placeholder='hello' />
      </View>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})
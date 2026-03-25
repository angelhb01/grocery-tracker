import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import Signup from '@/components/auth/Signup';

const signup = () => {
  return (
    <SafeAreaView className='h-full flex justify-center'>
      <View className='bg-green-400 h-[50%] absolute top-0 left-0 right-0' />
        <View className=''>
          <Text className='w-full text-center text-white text-6xl p-5'>Grocery Tracker</Text>
        </View>
        <Signup />
    </SafeAreaView>
  )
}

export default signup

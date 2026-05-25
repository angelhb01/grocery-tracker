import { Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import Signup from '@/components/auth/Signup';
import { Entypo } from '@expo/vector-icons';

const SignupScreen = () => {
  return (
    <SafeAreaView className='h-full flex justify-center'>
      <ScrollView>
        <View className='w-[60%] flex-col items-center justify-center m-auto mt-5 gap-3'>
          <Text className='w-full text-center text-[#4CAF50] text-6xl font-semibold'>Grocery Tracker</Text>
          <Text className='text-slate-600'>Track. Analyze. Eat Better.</Text>
          <Entypo name="leaf" size={20} color="green" />
        </View>
        <Signup />
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignupScreen

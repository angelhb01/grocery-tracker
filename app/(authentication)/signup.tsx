import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import Signup from '@/components/auth/Signup';

const signup = () => {
  return (
    <SafeAreaView className='h-full'>
      <Signup />
    </SafeAreaView>
  )
}

export default signup

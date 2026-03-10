import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Auth from '@/components/Auth';

const Login = () => {
  return (
    <SafeAreaView className='h-full'>
      <Auth />

    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})
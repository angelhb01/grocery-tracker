import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Login from '@/components/auth/Login';

const login = () => {
  return (
    <SafeAreaView className='h-full'>
      <Login />
    </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({})
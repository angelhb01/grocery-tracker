import React, { useState } from 'react'
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Link, router } from 'expo-router'

// Checkpoint: prevent the user from navigating to the tabs unless they completed their profile (username, first_name, etc.)
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onboarding(user_id: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user_id)

      if (error) {
        console.log(error.message)
        return
      } else {
        console.log('Data:', data)
        return data
      }

    } catch (error) {
      console.log('An unknown error occurred:', error)
      return
    }
  }

  async function signInWithEmail() {
    setLoading(true)
    try {
      const {data: {user}, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      const onboardingData = await onboarding(user?.id);

      if (error) {
          Alert.alert(error.message)
      } else if (onboardingData![0].username === null || onboardingData![0].username === ''){
        router.replace('/(authentication)/profileEdit');
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container} className='m-5 border-white shadow-sm rounded-md bg-white'>
      <Text className='text-5xl text-center'>Sign In</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoComplete='email'
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <View className=''>
        <Text className=''>Don't have an account?</Text>
        <Link href={{pathname: '/(authentication)/signup'}} className='text-cyan-600'>Sign up here</Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#86939e',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#86939e',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E8B57',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
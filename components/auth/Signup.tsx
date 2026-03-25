import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Link, router } from 'expo-router'

export default function Signup() {
  // Email and password are updated in the auth.users table
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)

  // Fix: Prevent the user from adding spaces, empty values, etc. when they sign up.
  async function signUpWithEmail() {
    setLoading(true)
    try {
      if (password === confirmPassword) {
        const {
          data: { session, user },
          error,
        } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) {
          Alert.alert(error.message);
        } else if (user?.identities?.length === 0){
          Alert.alert('User is already registered. Please try to log in.')
        } else {
          router.replace('/(authentication)/profileEdit');
          //Alert.alert("Please check your inbox for email verification!")
        }
      } else {
        Alert.alert('Passwords do not match. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container} className='m-5 border-white shadow-sm rounded-md bg-white'>
        <Text className='text-5xl text-center'>Sign Up</Text>
        <View style={[styles.verticallySpaced]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
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
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => signUpWithEmail()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <Text>Already have an account?</Text>
        <Link href={{pathname: '/(authentication)/login'}} className='text-cyan-600'>Login here</Link>
      </View>
    </KeyboardAvoidingView>
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
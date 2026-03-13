import { Alert } from 'react-native'
import { Button, ButtonText } from '../ui/button'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

export default function DeleteBtn() {
  const [loading, setLoading] = useState(false)
  
  async function handleConfirmDelete() {
    setLoading(true)

    

    setLoading(false)
  }

  function deleteUser() {
    Alert.alert(
      'Delete account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleConfirmDelete() },
      ],
    )
  }

  return (
      <Button disabled={loading} onPress={deleteUser} className={`bg-primary-0 h-[3.5rem]`} variant='solid' size='md' action='primary'>
      <ButtonText>Delete Account</ButtonText>
      </Button>
  )
}
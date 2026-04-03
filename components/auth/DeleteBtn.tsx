import { Alert, View } from 'react-native'
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
      <Button disabled={loading} onPress={deleteUser} className='h-[3.5rem] justify-between items-center gap-10' variant='solid' size='md' action='primary'>
        <View>
          <ButtonText>Img</ButtonText>
        </View>
        <View className='mr-auto'>
          <ButtonText>Delete Account</ButtonText>
        </View>
        <View>
          <ButtonText>Img</ButtonText>
        </View>
      </Button>
  )
}
import { supabase } from '@/lib/supabase'
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

const Signout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  async function signOut(){
    try{
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(error.message)
        return;
      };
      router.replace('/(authentication)/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button disabled={loading} onPress={signOut} className='h-[3.5rem] flex flex-row items-center justify-between gap-10' variant='solid' size='md' action='primary'>
      <View>
        <ButtonText>Img</ButtonText>
      </View>
      <View className='mr-auto'>
        <ButtonText>Log out</ButtonText>
      </View>
      <View>
        <ButtonText>Img</ButtonText>
      </View>
    </Button>
  )
}

export default Signout

const styles = StyleSheet.create({})
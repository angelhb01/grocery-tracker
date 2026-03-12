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
    <View>
      <Button disabled={loading} onPress={signOut} className={`bg-primary-0 h-[3.5rem]`} variant='solid' size='md' action='primary'>
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </View>
  )
}

export default Signout

const styles = StyleSheet.create({})
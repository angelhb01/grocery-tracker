import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutBtn from '@/components/auth/SignoutBtn'
import DeleteBtn from '@/components/auth/DeleteBtn'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'


const ProfileScreen = () => {

  const [loading, setLoading] = useState(false);

  // Get user's username
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true)
      try {
        const {data, error } = await supabase.auth.getSession();
        if (error) {
          console.log(error)
        } else {
          console.log("Current Data: "+data)
        }

      } catch (e) {
        console.log("Error: "+e)
      } finally {
        setLoading(false)
      }
    }

    checkSession();
  }, [])

  return (
    <SafeAreaView>
      <View>
        <Text>Username</Text>
      </View>
      {/* Profile buttons */}
      <View>
        <SignOutBtn />
        <DeleteBtn />
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})
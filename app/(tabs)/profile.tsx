import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutBtn from '@/components/auth/SignoutBtn'

const profile = () => {
  return (
    <SafeAreaView>
      <SignOutBtn />
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({})
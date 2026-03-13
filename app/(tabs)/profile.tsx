import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOutBtn from '@/components/auth/SignoutBtn'
import DeleteBtn from '@/components/auth/DeleteBtn'

const profile = () => {
  return (
    <SafeAreaView>
      <View>
        <SignOutBtn />
        <DeleteBtn />
      </View>
    </SafeAreaView>

  )
}

export default profile

const styles = StyleSheet.create({})
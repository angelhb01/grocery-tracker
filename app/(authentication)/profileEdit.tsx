import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileEdit from '@/components/auth/ProfleEdit'

const ProfileEditScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Text className='flex flex-col text-3xl mt-10 text-center'>Onboarding</Text>
        <ProfileEdit />
      </View>
    </SafeAreaView>
  )
}

export default ProfileEditScreen
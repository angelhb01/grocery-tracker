import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'

const foodInfo = () => {
  const {description} = useLocalSearchParams();

  return (
    <SafeAreaView className='p-10'>
      <Text>Description:</Text>
      <Text>{description}</Text>
    </SafeAreaView>
  )
}

export default foodInfo

const styles = StyleSheet.create({})
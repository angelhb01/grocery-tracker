import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const FoodScreen = () => {
  return (
    <SafeAreaView>
      {/* Header */}
      <View className="p-5 border-b-2">
        <Text className="text-3xl text-center">Food</Text>
      </View>
      {/* Food content (from an API) */}
      <ScrollView>
        <View className='h-10 bg-blue-500'>
            <Text>Food1</Text>
        </View>
        <View>
            <Text>Food2</Text>
        </View>
        <View>
            <Text>Food3</Text>
        </View>
        <View>
            <Text>Food4</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FoodScreen

const styles = StyleSheet.create({})
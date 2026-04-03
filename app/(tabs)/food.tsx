import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'

const FoodScreen = () => {
  const [loading, setLoading] = useState(false)

  async function getFoodData() {
    setLoading(true)
    try{
      const response = await fetch('/api/food');
      const json = await response.json();
      console.log(json);
    } catch (e) {
      console.log("Unexpected error occurred: "+e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFoodData();
  }, [])

  return (
    <SafeAreaView>
      {/* Header */}
      <View className="p-5 border-b-2 h-[6rem]">
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
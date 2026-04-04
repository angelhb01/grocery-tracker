import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

interface Food {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: Array<Object>;
}

const FoodScreen = () => {

  const [loading, setLoading] = useState(false)
  const [foodData, setFoodData] = useState<Array<Food>>([])

  async function getFoodData() {
    setLoading(true)
    try{
      const response = await fetch('/api/food');
      const json = await response.json();
      setFoodData(json)
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
      <ScrollView className=''>
        {loading ? (
          <View>
            <ActivityIndicator color={'black'} />
          </View>
        ) : 
          foodData.map((food => 
            (
              <View className='h-10 bg-gray-500' key={food.fdcId}>
                <Text>{food.description}</Text>
              </View>
            )
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default FoodScreen

const styles = StyleSheet.create({})
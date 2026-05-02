import { StyleSheet, Text, View } from "react-native";

const Nutrition = ({
  name,
  icon,
  getPercent,
  total,
  nutritionValue,
  nutritionColor,
}: {
  name: string;
  icon: React.ReactNode;
  getPercent: (val: number) => number;
  total: number;
  nutritionValue: number;
  nutritionColor: string;
}) => {
  return (
    <View
      className="flex-row h-[7rem] w-full justify-start gap-5 items-center p-5"
      style={styles.nutritionContainer}
    >
      <View
        className="w-[3rem] h-[3rem] flex items-center justify-center rounded-full"
        style={{
          backgroundColor: `${name === "Carbs" ? `${nutritionColor}33` : `${"#4CAF50"}33`}`,
        }}
      >
        {icon}
      </View>
      <View className="flex-col flex-1 justify-center gap-2">
        <View className="flex-row justify-between">
          <Text>{name}</Text>
          <Text>{getPercent(nutritionValue).toFixed(2)}%</Text>
        </View>
        <View>
          <Text style={styles.smallText}>
            {nutritionValue.toFixed(2)} / {total.toFixed(2)} kcal
          </Text>
        </View>
        <View className="h-4 w-full rounded-xl overflow-hidden bg-gray-200">
          <View
            className="h-full rounded-xl"
            style={{
              width: `${getPercent(nutritionValue)}%`,
              backgroundColor: `${name === "Carbs" ? `${nutritionColor}` : `${"#4CAF50"}`}`,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Nutrition;

const styles = StyleSheet.create({
  smallText: {
    fontSize: 11,
    color: "#696969",
  },
  nutritionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});

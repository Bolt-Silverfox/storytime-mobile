import { ScrollView, Text, View } from "react-native";

const ParentsTopRecommendationsScreen = () => {
  return (
    <View className="flex-1 flex-col flex">
      <ScrollView
        contentContainerClassName="flex flex-col gap-y-2 justify-center items-center"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-[abeezee] text-black">
          Parents top recommendations
        </Text>
      </ScrollView>
    </View>
  );
};

export default ParentsTopRecommendationsScreen;

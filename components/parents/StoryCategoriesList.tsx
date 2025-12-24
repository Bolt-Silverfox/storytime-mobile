import { Text, View } from "react-native";

const StoryCategoriesList = () => {
  return (
    <View className="flex flex-col gap-y-4">
      <View className="flex flex-col gap-y-1.5">
        <Text className="font-[abeezee] text-black text-[18px]">
          All catgories
        </Text>
        <Text className="font-[abeezee] text-text text-sm">
          Gain access to all our stories
        </Text>
      </View>
      <View>
        <Text className="font-[abeezee] text-text text-sm">
          Categories list
        </Text>
      </View>
    </View>
  );
};

export default StoryCategoriesList;

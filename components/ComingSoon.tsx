import { Text, View } from "react-native";

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <View className="flex flex-1 justify-center items-center gap-2">
      <Text className="font-[quilka]">Coming Soon</Text>
      <Text className="font-[abeezee]">{title} page</Text>
    </View>
  );
};

export default ComingSoon;

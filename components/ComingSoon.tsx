import { Text, View } from "react-native";

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2">
      <Text className="text-fg font-[quilka]">Coming Soon</Text>
      <Text className="text-fg font-[abeezee]">{title} page</Text>
    </View>
  );
};

export default ComingSoon;

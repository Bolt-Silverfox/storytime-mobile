import { Text, View } from "react-native";

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2">
      <Text className="font-[quilka] text-fg">Coming Soon</Text>
      <Text className="font-[abeezee] text-fg">{title} page</Text>
    </View>
  );
};

export default ComingSoon;

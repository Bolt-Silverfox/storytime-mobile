import { Pressable, Text, View } from "react-native";
import Icon from "./Icon";

const PageTitle = ({
  goBack,
  title,
}: {
  goBack: () => void;
  title: string;
}) => {
  return (
    <View className="flex flex-row bg-white py-5 px-4">
      <Pressable onPress={goBack}>
        <Icon name="ChevronLeft" />
      </Pressable>
      <Text className="text-center flex-1  text-[18px] font-[abeezee]">
        {title}
      </Text>
    </View>
  );
};

export default PageTitle;

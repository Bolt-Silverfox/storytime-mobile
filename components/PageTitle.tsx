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
    <View className="flex flex-row border-b border-b-black/10 bg-white px-4 py-5">
      <Pressable onPress={goBack}>
        <Icon name="ChevronLeft" />
      </Pressable>
      <Text className="flex-1 text-center  font-[abeezee] text-[18px]">
        {title}
      </Text>
    </View>
  );
};

export default PageTitle;

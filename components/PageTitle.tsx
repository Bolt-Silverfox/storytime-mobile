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
    <View className="bg-surface flex flex-row items-center border-b border-b-black/10 px-4 pt-4 pb-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={goBack}
      >
        <Icon name="ChevronLeft" color="#212121" />
      </Pressable>
      <Text className="flex-1 text-center font-[abeezee] text-[18px]">
        {title}
      </Text>
    </View>
  );
};

export default PageTitle;

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
    <View className="flex flex-row items-center border-b border-b-line-light bg-surface px-4 pb-5 pt-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={goBack}
      >
        <Icon name="ChevronLeft" />
      </Pressable>
      <Text className="flex-1 text-center font-[abeezee] text-[18px] text-fg">
        {title}
      </Text>
    </View>
  );
};

export default PageTitle;

import { Pressable, Text, View } from "react-native";
import Icon from "./Icon";
import { ReactNode } from "react";

const PageTitle = ({
  goBack,
  title,
  rightIcon,
}: {
  goBack: () => void;
  title: string;
  rightIcon?: ReactNode;
}) => {
  return (
    <View className="flex flex-row items-center border-b border-b-black/10 bg-white px-4 pb-5 pt-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={goBack}
      >
        <Icon name="ChevronLeft" color="#212121" />
      </Pressable>
      <Text className="flex-1 text-center  font-[abeezee] text-[18px]">
        {title}
      </Text>
      {rightIcon}
    </View>
  );
};

export default PageTitle;

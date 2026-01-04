import { Text, View } from "react-native";
import CustomButton from "../UI/CustomButton";

const EmptyKidsState = ({ onClose }: { onClose: () => void }) => {
  return (
    <View className="flex flex-col gap-y-3 flex-1 justify-center items-center">
      <Text className="font-[quilka] text-primary text-3xl text-center">
        No child added yet{" "}
      </Text>
      <CustomButton onPress={onClose} text="Cancel" />
    </View>
  );
};

export default EmptyKidsState;

import { Pressable, Text, View } from "react-native";

const ChildrenEmptyState = ({ navigate }: { navigate: () => void }) => {
  return (
    <View className="flex flex-col gap-y-3 flex-1 justify-center items-center">
      <Text className="font-[quilka] text-primary text-3xl text-center">
        No child added yet{" "}
      </Text>
      <Pressable
        className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
        onPress={navigate}
      >
        <Text className="text-white font-[abeezee] text-center text-base">
          Add child
        </Text>
      </Pressable>
    </View>
  );
};

export default ChildrenEmptyState;

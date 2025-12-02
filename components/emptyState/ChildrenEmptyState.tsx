import { TagUser } from "iconsax-react-nativejs";
import { Pressable, Text, View } from "react-native";

const ChildrenEmptyState = ({ navigate }: { navigate?: () => void }) => {
  return (
    <View className="flex gap-y-3 flex-1 justify-center items-center">
      <View className="items-center gap-y-5">
        <TagUser size={112} color="#EC40074D" />
        <Text className="font-[abeezee]  text-xl text-center">
          No child added yet
        </Text>
        <Text className="font-[abeezee]  text-base text-center max-w-[338px] mx-8 text-[#616161]">
          Add your child’s profile to personalize their stories, track progress
          and support their learning experience.
        </Text>
      </View>

      {navigate && (
        <Pressable
          className="bg-primary mt-20  py-4 w-full max-w-96 rounded-full mx-auto"
          onPress={navigate}
        >
          <Text className="text-white font-[abeezee] text-center text-base">
            Add child
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ChildrenEmptyState;

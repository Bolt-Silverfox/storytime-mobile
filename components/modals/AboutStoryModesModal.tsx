import { Pressable, Text, View } from "react-native";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

const AboutStoryModesModal = ({
  isOpen,
  onClose,
}: Omit<CustomModalProps, "children">) => {
  return (
    <CustomModal onClose={onClose} isOpen={isOpen}>
      <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-[quilka] text-xl">
            About preferred story mode
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <Text className="font-[abeezee] text-sm text-text">
          Here's a breakdown of the dirrerence between the two preferred story
          modes.
        </Text>
        <View className="flex flex-col gap-y-8 ">
          <View className="flex flex-row gap-x-3">
            <Pressable className="flex size-14 items-center justify-center rounded-full border border-border-lighter">
              <Icon name="BookOpenText" />
            </Pressable>
            <View className="flex flex-1 flex-col gap-y-1">
              <Text className="font-[abeezee] text-base text-black">
                Plain Story Mode
              </Text>
              <Text className="text-wrap font-[abeezee] text-sm text-text">
                Sit back and enjoy the story. In this mode, children can read
                along or listen as the story is narrated from start to
                finish—perfect for relaxed reading, bedtime, or quiet time.
              </Text>
            </View>
          </View>
          <View className="flex flex-row gap-x-3">
            <Pressable className="flex size-14 items-center justify-center rounded-full border border-border-lighter">
              <Icon name="Gamepad2" />
            </Pressable>
            <View className="flex flex-1 flex-col gap-y-1">
              <Text className="font-[abeezee] text-base text-black">
                Interactive Story Mode
              </Text>
              <Text className="text-wrap font-[abeezee] text-sm text-text">
                Turn storytelling into a fun learning experience. After the
                story is read, children are asked simple, engaging questions to
                test understanding, spark curiosity, and encourage critical
                thinking.
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-4 flex flex-row items-center gap-x-3 rounded-2xl bg-yellow p-4">
          <Pressable className="flex size-14 items-center justify-center rounded-full bg-[#F8D62B]">
            <Icon name="CircleAlert" />
          </Pressable>
          <View className="flex flex-1 flex-col gap-y-1">
            <Text className="font-[abeezee] text-sm text-black">Tips</Text>
            <Text className="text-wrap font-[abeezee] text-sm text-black">
              Plain mode is great for calm listening, while Interactive mode
              helps boost comprehension and engagement.
            </Text>
          </View>
        </View>
      </View>
    </CustomModal>
  );
};

export default AboutStoryModesModal;

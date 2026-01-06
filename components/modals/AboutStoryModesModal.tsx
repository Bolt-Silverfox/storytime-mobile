import { Pressable, Text, View } from "react-native";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

const AboutStoryModesModal = ({
  isOpen,
  onClose,
}: Omit<CustomModalProps, "children">) => {
  return (
    <CustomModal onClose={onClose} isOpen={isOpen}>
      <View className="flex flex-col max-w-screen-md w-full mx-auto gap-y-4">
        <View className="flex flex-row justify-between items-center">
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
            <Pressable className="size-14 border border-border-lighter flex justify-center items-center rounded-full">
              <Icon name="BookOpenText" />
            </Pressable>
            <View className="flex flex-1 flex-col gap-y-1">
              <Text className="font-[abeezee] text-base text-black">
                Plain Story Mode
              </Text>
              <Text className="font-[abeezee] text-wrap text-text text-sm">
                Sit back and enjoy the story. In this mode, children can read
                along or listen as the story is narrated from start to
                finish—perfect for relaxed reading, bedtime, or quiet time.
              </Text>
            </View>
          </View>
          <View className="flex flex-row gap-x-3">
            <Pressable className="size-14 border border-border-lighter flex justify-center items-center rounded-full">
              <Icon name="Gamepad2" />
            </Pressable>
            <View className="flex flex-1 flex-col gap-y-1">
              <Text className="font-[abeezee] text-base text-black">
                Interactive Story Mode
              </Text>
              <Text className="font-[abeezee] text-wrap text-text text-sm">
                Turn storytelling into a fun learning experience. After the
                story is read, children are asked simple, engaging questions to
                test understanding, spark curiosity, and encourage critical
                thinking.
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-yellow mt-4 flex flex-row gap-x-3 items-center p-4 rounded-2xl">
          <Pressable className="size-14 flex justify-center items-center bg-[#F8D62B] rounded-full">
            <Icon name="CircleAlert" />
          </Pressable>
          <View className="flex flex-1 flex-col gap-y-1">
            <Text className="text-sm text-black font-[abeezee]">Tips</Text>
            <Text className="text-sm text-wrap text-black font-[abeezee]">
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

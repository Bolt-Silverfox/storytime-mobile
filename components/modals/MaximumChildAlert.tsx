import { InfoCircle } from "iconsax-react-nativejs";
import { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import defaultStyles from "../../styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  subscribe: () => void;
};

const MaximumChildAlert = ({ isOpen, onClose, children, subscribe }: Props) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40 items-center justify-center px-[16px]"
      >
        <View className="bg-white gap-y-8 px-[20px] rounded-[20px] p-6 pb-12 absolute  w-full">
          <View className="items-center">
            <View className="bg-[#EC400733] rounded-full p-4 items-center">
              <InfoCircle variant="Bold" size={49} color="#EC4007" />
            </View>
          </View>

          <View className="gap-y-[10px]">
            <Text style={[defaultStyles.heading, { fontSize: 20 }]}>
              Maximum number reached
            </Text>
            <Text
              style={[defaultStyles.defaultText, { fontSize: 16 }]}
              className="text-center"
            >
              You have reached the maximum number of children you can add to
              your account
            </Text>
          </View>
          <View className="gap-y-6">
            <Pressable
              onPress={subscribe}
              className="bg-primary py-3 w-full max-w-96 rounded-full mx-auto"
            >
              <Text className="text-white font-[abeezee] text-center text-base">
                Subscribe to storytime premium
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              className="border-[black] border py-3 w-full max-w-96 rounded-full mx-auto"
            >
              <Text className="text-[black] font-[abeezee] text-center text-base">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default MaximumChildAlert;

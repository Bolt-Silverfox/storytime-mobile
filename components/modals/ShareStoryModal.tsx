import { Text, View } from "react-native";
import { shareContent } from "../../utils/utils";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

type ShareStoryModalProps = Omit<CustomModalProps, "children"> & {
  storyTitle: string;
};

const ShareStoryModal = ({
  isOpen,
  onClose,
  storyTitle,
}: ShareStoryModalProps) => {
  return (
    <CustomModal onClose={onClose} isOpen={isOpen}>
      <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-[abeezee] text-xl">Share story</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <Text className="font-[abeezee] text-sm text-text">
          Share this story with friends and family
        </Text>
        <Icon
          name="Share2"
          onPress={() =>
            shareContent({
              message: `Check out "${storyTitle}" on Storytime4Kids!`,
              title: storyTitle,
            })
          }
        />
      </View>
    </CustomModal>
  );
};

export default ShareStoryModal;

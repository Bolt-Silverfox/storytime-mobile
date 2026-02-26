import { Text, View } from "react-native";
import { DEEP_LINK_BASE_URL } from "../../constants";
import { shareContent } from "../../utils/utils";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

type ShareStoryModalProps = Omit<CustomModalProps, "children"> & {
  storyId: string;
  storyTitle: string;
};

const ShareStoryModal = ({
  isOpen,
  onClose,
  storyId,
  storyTitle,
}: ShareStoryModalProps) => {
  const shareUrl = `${DEEP_LINK_BASE_URL}/story/${storyId}`;

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
              message: `Check out "${storyTitle}" on Storytime4Kids!\n${shareUrl}`,
              title: storyTitle,
            })
          }
        />
      </View>
    </CustomModal>
  );
};

export default ShareStoryModal;

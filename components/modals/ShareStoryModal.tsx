import * as Clipboard from "expo-clipboard";
import { Alert, Text, View } from "react-native";
import { shareContent } from "../../utils/utils";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

type ShareStoryModalProps = Omit<CustomModalProps, "children"> & {
  storyId: string;
  storyTitle: string;
};

const SHARE_BASE_URL = "https://www.storytimeapp.me";

const ShareStoryModal = ({
  isOpen,
  onClose,
  storyId,
  storyTitle,
}: ShareStoryModalProps) => {
  const shareUrl = `${SHARE_BASE_URL}/story/${storyId}`;

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(shareUrl);
      Alert.alert("Copied", "Link copied to clipboard");
    } catch (e) {
      if (__DEV__) console.error("Clipboard copy failed:", e);
      Alert.alert("Error", "Failed to copy link to clipboard");
    }
  };

  return (
    <CustomModal onClose={onClose} isOpen={isOpen}>
      <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-[abeezee] text-xl">Share story</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-row items-center justify-between gap-x-5 rounded-2xl bg-[#FFF8D7] p-4">
          <Text
            className="flex-1 text-wrap font-[abeezee] text-base text-black"
            numberOfLines={2}
          >
            {shareUrl}
          </Text>
          <Icon name="Copy" onPress={handleCopy} />
        </View>
        <Icon
          name="Share2"
          onPress={() =>
            shareContent({
              message: `Check out "${storyTitle}" on Storytime4Kids!`,
              url: shareUrl,
              title: storyTitle,
            })
          }
        />
      </View>
    </CustomModal>
  );
};

export default ShareStoryModal;

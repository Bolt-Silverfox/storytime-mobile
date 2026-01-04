import { Text, View } from "react-native";
import { shareContent } from "../../utils/utils";
import Icon from "../Icon";
import CustomModal, { CustomModalProps } from "./CustomModal";

const ShareStoryModal = ({
  isOpen,
  onClose,
}: Omit<CustomModalProps, "children">) => {
  return (
    <CustomModal onClose={onClose} isOpen={isOpen}>
      <View className="flex flex-col max-w-screen-md w-full mx-auto gap-y-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="font-[abeezee] text-xl">Share story</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-row justify-between gap-x-5 rounded-2xl  items-center p-4 bg-[#FFF8D7]">
          <Text className="font-[abeezee] text-wrap text-base text-black flex-1">
            https://www.storytimeapp.me/ejehreiuewewjew/wdwejdejwfe
          </Text>
          <Icon
            name="Copy"
            onPress={() =>
              shareContent({
                url: "https://www.storytimeapp.me/ejehreiuewewjew/wdwejdejwfe",
              })
            }
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default ShareStoryModal;

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
      <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="font-[abeezee] text-xl">Share story</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-row items-center justify-between gap-x-5  rounded-2xl bg-[#FFF8D7] p-4">
          <Text className="flex-1 text-wrap font-[abeezee] text-base text-black">
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

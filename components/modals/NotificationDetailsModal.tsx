import { Text, View } from "react-native";
import CustomModal from "./CustomModal";
import type { Notification } from "../../types";
import {
  getNotificationIcon,
  mapCategoryToIconType,
  getRelativeTime,
} from "../../utils/utils";

type PropTypes = {
  closeModal: () => void;
  isOpen: boolean;
  notification: Notification | null;
};

const NotificationDetailsModal = ({
  closeModal,
  isOpen,
  notification,
}: PropTypes) => {
  if (!notification) return null;

  return (
    <CustomModal onClose={closeModal} isOpen={isOpen}>
      <View className="flex flex-col px-4 py-8">
        <View className="mb-4 items-center">
          {getNotificationIcon(mapCategoryToIconType(notification.category))}
        </View>
        <Text className="text-center font-[quilka] text-[18px]">
          {notification.title}
        </Text>
        <Text className="text-text my-10 font-[abeezee] text-base">
          {notification.body}
        </Text>
        <Text className="text-text mb-4 font-[abeezee] text-xs">
          {getRelativeTime(notification.createdAt)}
        </Text>

        <Text
          onPress={closeModal}
          className="border-border text-text mx-5 max-w-screen-md rounded-full border py-2 text-center font-[abeezee] text-base sm:mx-auto sm:w-full lg:max-w-screen-lg xl:max-w-screen-xl"
        >
          Close
        </Text>
      </View>
    </CustomModal>
  );
};

export default NotificationDetailsModal;

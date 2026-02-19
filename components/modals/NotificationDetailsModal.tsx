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
        <Text className="my-10 font-[abeezee] text-base text-text">
          {notification.body}
        </Text>
        <Text className="mb-4 font-[abeezee] text-xs text-text">
          {getRelativeTime(notification.createdAt)}
        </Text>

        <Text
          onPress={closeModal}
          className="mx-5 max-w-screen-md rounded-full border border-border py-2 text-center font-[abeezee] text-base text-text sm:mx-auto sm:w-full"
        >
          Close
        </Text>
      </View>
    </CustomModal>
  );
};

export default NotificationDetailsModal;

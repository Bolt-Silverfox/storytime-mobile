import { Text, View } from "react-native";
import CustomModal from "./CustomModal";

type PropTypes = {
  closeModal: () => void;
  isOpen: boolean;
};

const NotificationDetailsModal = ({ closeModal, isOpen }: PropTypes) => {
  return (
    <CustomModal onClose={closeModal} isOpen={isOpen}>
      <View className="flex flex-col py-8 px-4">
        <Text className="text-center font-[quilka] text-[18px]">
          New Login Alert
        </Text>
        <Text className="text-base my-10  font-[abeezee] text-text">
          Your account was accessed from a new device.
        </Text>
        <View className="flex flex-col gap-y-1">
          <Text className="text-base font-[abeezee] text-text">New Login</Text>
          <Text className="text-base font-[abeezee] text-text">
            Device: Android
          </Text>
          <Text className="text-base font-[abeezee] text-text">
            Location : Lagos, Nigeria
          </Text>
          <Text className="text-base font-[abeezee] text-text">
            When : Tuesday, December 19, 2025 at 9:31 PM WAT (2 hours ago)
          </Text>
        </View>

        <Text
          onPress={closeModal}
          className="text-base mt-5 font-[abeezee] text-center text-text mx-5 py-2 border border-border rounded-full"
        >
          Close
        </Text>
      </View>
    </CustomModal>
  );
};

export default NotificationDetailsModal;

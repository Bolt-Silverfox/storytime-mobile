import { Text, View } from "react-native";
import CustomModal from "./CustomModal";

type PropTypes = {
  closeModal: () => void;
  isOpen: boolean;
};

const NotificationDetailsModal = ({ closeModal, isOpen }: PropTypes) => {
  return (
    <CustomModal onClose={closeModal} isOpen={isOpen}>
      <View className="flex flex-col px-4 py-8">
        <Text className="text-center font-[quilka] text-[18px]">
          New Login Alert
        </Text>
        <Text className="my-10 font-[abeezee]  text-base text-text">
          Your account was accessed from a new device.
        </Text>
        <View className="flex flex-col gap-y-1">
          <Text className="font-[abeezee] text-base text-text">New Login</Text>
          <Text className="font-[abeezee] text-base text-text">
            Device: Android
          </Text>
          <Text className="font-[abeezee] text-base text-text">
            Location : Lagos, Nigeria
          </Text>
          <Text className="font-[abeezee] text-base text-text">
            When : Tuesday, December 19, 2025 at 9:31 PM WAT (2 hours ago)
          </Text>
        </View>

        <Text
          onPress={closeModal}
          className="mx-5 mt-5 max-w-screen-md rounded-full border border-border py-2 text-center font-[abeezee] text-base text-text sm:mx-auto sm:w-full"
        >
          Close
        </Text>
      </View>
    </CustomModal>
  );
};

export default NotificationDetailsModal;

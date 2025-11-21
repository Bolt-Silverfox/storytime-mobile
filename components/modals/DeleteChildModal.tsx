import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: () => void;
  isDeleting: boolean;
  name: string;
};

const DeleteChildModal = ({
  isOpen,
  onClose,
  name,
  isDeleting,
  handleDelete,
}: Props) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <View className="bg-white rounded-t-3xl p-6 pb-12 absolute px-3 bottom-0 w-full">
        <Text className="text-lg font-[quilka] mb-4 text-center">
          Delete child's profile
        </Text>
        <Text className="text-base font-[abeezee] text-center mb-3">
          Are you sure you want to delete {name} profile?
        </Text>

        <View className="flex flex-col gap-y-3">
          <Pressable
            onPress={handleDelete}
            className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
          >
            <Text className="text-white font-[abeezee] text-center text-base">
              {isDeleting ? "Deleting..." : "Yes, delete child"}
            </Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            className="bg-transparent border border-primary py-4 w-full max-w-96 rounded-full mx-auto"
          >
            <Text className="text-primary font-[abeezee] text-center text-base">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteChildModal;

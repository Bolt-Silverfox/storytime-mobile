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

      <View
        style={{ borderTopRightRadius: 30, borderTopLeftRadius: 30 }}
        className="bg-white p-6 pb-12 absolute px-3 bottom-0 w-full"
      >
        <View className="h-[6px] w-[68px] mx-auto bg-[#C5C5C5] mb-10 rounded-full" />
        <Text className="text-2xl font-[quilka] mb-4 text-center">
          Delete child's profile
        </Text>
        <Text className="text-base font-[abeezee] text-center mb-10">
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

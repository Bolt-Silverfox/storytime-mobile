import { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const CustomModal = ({ isOpen, onClose, children }: Props) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <View className="bg-white rounded-t-3xl p-6 pb-12 absolute px-3 bottom-0 w-full">
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;

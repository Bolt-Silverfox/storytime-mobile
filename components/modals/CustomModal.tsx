import { ReactNode } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  View,
} from "react-native";
import ErrorComponent from "../ErrorComponent";

export type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  isPending?: boolean;
  error?: {
    message: string;
    retry: () => void;
  };
};

const CustomModal = ({
  isOpen,
  onClose,
  children,
  isPending,
  error,
}: CustomModalProps) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <View
        style={{ maxHeight: Dimensions.get("window").height * 0.7 }}
        className="absolute bottom-0 w-full flex-1 overflow-hidden rounded-t-3xl bg-white p-6 px-4 pb-12"
      >
        {isPending ? (
          <View className="flex flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} />
          </View>
        ) : error?.message ? (
          <ErrorComponent refetch={error.retry} message={error.message} />
        ) : (
          children
        )}
      </View>
    </Modal>
  );
};

export default CustomModal;

import { Dispatch, SetStateAction } from "react";
import { Pressable, View } from "react-native";
import useImagePicker from "../../hooks/others/useImagePicker";
import useParentalGate from "../../hooks/others/useParentalGate";
import Icon from "../Icon";
import CustomModal from "./CustomModal";
import ParentalGateModal from "./ParentalGateModal";

const UploadAvatarModal = ({
  isOpen,
  onClose,
  setImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  setImage: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { pickImage, launchCamera } = useImagePicker({ onClose, setImage });
  const gate = useParentalGate();
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-row items-center gap-x-14">
        <Pressable
          onPress={() => gate.guard(launchCamera)}
          className="flex size-[60px] items-center justify-center rounded-full border border-border-lighter bg-[#FFFCFBFB]"
        >
          <Icon name="Camera" />
        </Pressable>
        <Pressable
          onPress={() => gate.guard(pickImage)}
          className="flex size-[60px] items-center justify-center rounded-full border border-border-lighter bg-[#FFFCFBFB]"
        >
          <Icon name="Folder" />
        </Pressable>
      </View>
      <ParentalGateModal
        visible={gate.visible}
        onPass={gate.onPass}
        onCancel={gate.onCancel}
      />
    </CustomModal>
  );
};

export default UploadAvatarModal;

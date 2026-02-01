import { Dispatch, SetStateAction } from "react";
import { Pressable, View } from "react-native";
import useImagePicker from "../../hooks/others/useImagePicker";
import Icon from "../Icon";
import CustomModal from "./CustomModal";

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
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-row items-center gap-x-14">
        <Pressable
          onPress={launchCamera}
          className="flex size-[60px] items-center justify-center rounded-full border border-border-lighter bg-[#FFFCFBFB]"
        >
          <Icon name="Camera" />
        </Pressable>
        <Pressable
          onPress={pickImage}
          className="flex size-[60px] items-center justify-center rounded-full border border-border-lighter bg-[#FFFCFBFB]"
        >
          <Icon name="Folder" />
        </Pressable>
      </View>
    </CustomModal>
  );
};

export default UploadAvatarModal;

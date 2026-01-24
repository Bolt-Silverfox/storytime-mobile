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
      <View className="flex flex-row gap-x-14 items-center">
        <Pressable
          onPress={launchCamera}
          className="rounded-full size-[60px] border border-border-lighter flex justify-center items-center bg-[#FFFCFBFB]"
        >
          <Icon name="Camera" />
        </Pressable>
        <Pressable
          onPress={pickImage}
          className="rounded-full size-[60px] border border-border-lighter flex justify-center items-center bg-[#FFFCFBFB]"
        >
          <Icon name="Folder" />
        </Pressable>
      </View>
    </CustomModal>
  );
};

export default UploadAvatarModal;

import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";

const useImagePicker = ({
  onClose,
  setImage,
}: {
  setImage: Dispatch<SetStateAction<string | undefined>>;
  onClose: () => void;
}) => {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Allow permission to access media library to continue."
      );
      onClose();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets[0].fileSize && result.assets[0].fileSize > 2000000) {
        Alert.alert("Size Exceeded", "Maximum image size is 3MB");
        onClose();
        return;
      }
      setImage(result.assets[0].uri);
      onClose();
    }
  };

  const launchCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Allow permission to access media library to continue."
      );
      onClose();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ["images"],
      quality: 0.7,
      shape: "oval",
    });
    if (!result.canceled) {
      if (result.assets[0].fileSize && result.assets[0].fileSize > 3000000) {
        Alert.alert("Size Exceeded", "Maximum image size is 3MB");
        onClose();
        return;
      }
      setImage(result.assets[0].uri);
      onClose();
    }
  };

  return { pickImage, launchCamera };
};

export default useImagePicker;

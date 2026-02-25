import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import { IMAGE_MIME_MAP, MAX_IMAGE_SIZE } from "../../constants";

function validateImageAsset(
  asset: ImagePicker.ImagePickerAsset,
  skipExtensionCheck = false
): string | null {
  if (!asset.fileSize || asset.fileSize > MAX_IMAGE_SIZE) {
    return `Maximum image size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`;
  }

  // Camera URIs on some Android devices lack file extensions (e.g. content://...),
  // so callers can opt out of the extension check when the source is the camera.
  if (!skipExtensionCheck) {
    const ext = asset.uri.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
    if (!(ext in IMAGE_MIME_MAP)) {
      return "Unsupported image format. Please use JPG, PNG, GIF, or WebP.";
    }
  }

  return null;
}

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
      const error = validateImageAsset(result.assets[0]);
      if (error) {
        Alert.alert("Invalid Image", error);
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
      const error = validateImageAsset(result.assets[0], true);
      if (error) {
        Alert.alert("Invalid Image", error);
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

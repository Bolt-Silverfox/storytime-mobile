import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import { MAX_IMAGE_SIZE } from "../../constants";

// Avatars never need to be larger than this; downscaling keeps the JPEG small
// and well under the backend's 5MB limit.
const MAX_AVATAR_DIMENSION = 1024;

function validateImageSize(asset: ImagePicker.ImagePickerAsset): string | null {
  if (typeof asset.fileSize === "number" && asset.fileSize > MAX_IMAGE_SIZE) {
    return `Maximum image size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`;
  }
  return null;
}

// Convert any picked asset (HEIC from iPhone photos, extensionless camera
// captures, PNG, etc.) to a JPEG on-device. This guarantees a format the
// backend accepts (png|jpeg|gif|webp) and a URI with a real .jpg extension,
// which the upload path relies on.
async function normalizeToJpeg(
  asset: ImagePicker.ImagePickerAsset
): Promise<string> {
  const context = ImageManipulator.manipulate(asset.uri);
  if (typeof asset.width === "number" && asset.width > MAX_AVATAR_DIMENSION) {
    context.resize({ width: MAX_AVATAR_DIMENSION });
  }
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.8,
  });
  return result.uri;
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
      const error = validateImageSize(result.assets[0]);
      if (error) {
        Alert.alert("Invalid Image", error);
        onClose();
        return;
      }
      try {
        const uri = await normalizeToJpeg(result.assets[0]);
        setImage(uri);
      } catch {
        Alert.alert(
          "Invalid Image",
          "We couldn't process that image. Please try a different photo."
        );
      }
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
      const error = validateImageSize(result.assets[0]);
      if (error) {
        Alert.alert("Invalid Image", error);
        onClose();
        return;
      }
      try {
        const uri = await normalizeToJpeg(result.assets[0]);
        setImage(uri);
      } catch {
        Alert.alert(
          "Invalid Image",
          "We couldn't process that image. Please try a different photo."
        );
      }
      onClose();
    }
  };

  return { pickImage, launchCamera };
};

export default useImagePicker;

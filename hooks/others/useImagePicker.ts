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
  // Constrain the longer edge so both wide and tall images are downscaled while
  // preserving aspect ratio (resizing only one dimension scales the other).
  const width = typeof asset.width === "number" ? asset.width : 0;
  const height = typeof asset.height === "number" ? asset.height : 0;
  if (Math.max(width, height) > MAX_AVATAR_DIMENSION) {
    context.resize(
      width >= height
        ? { width: MAX_AVATAR_DIMENSION }
        : { height: MAX_AVATAR_DIMENSION }
    );
  }
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.8,
  });
  return result.uri;
}

// Shared size-check -> normalize-to-JPEG -> setImage flow, with a single
// alert path for both invalid-size and processing failures. Used by the
// library and camera handlers so they can't silently diverge.
async function processPickedAsset(
  asset: ImagePicker.ImagePickerAsset,
  setImage: Dispatch<SetStateAction<string | undefined>>
): Promise<void> {
  const error = validateImageSize(asset);
  if (error) {
    Alert.alert("Invalid Image", error);
    return;
  }
  try {
    setImage(await normalizeToJpeg(asset));
  } catch {
    Alert.alert(
      "Invalid Image",
      "We couldn't process that image. Please try a different photo."
    );
  }
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
      await processPickedAsset(result.assets[0], setImage);
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
      await processPickedAsset(result.assets[0], setImage);
      onClose();
    }
  };

  return { pickImage, launchCamera };
};

export default useImagePicker;

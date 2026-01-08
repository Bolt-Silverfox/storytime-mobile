import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";

const useImagePicker = (
  setImage: Dispatch<SetStateAction<string | undefined>>
) => {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Allow permission to access media library to continue."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets[0].fileSize && result.assets[0].fileSize > 2000000) {
        Alert.alert("Maximum image size is 2MB");
        return;
      }
      setImage(result.assets[0].uri);
    }
  };

  return { pickImage };
};

export default useImagePicker;

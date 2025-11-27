import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  Alert,
  ImageURISource,
} from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { Camera, Folder2, GalleryAdd } from "iconsax-react-nativejs";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import * as ImagePicker from "expo-image-picker";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";
import { useUpdateProfileWithImage } from "../../../hooks/tanstack/queryHooks/useGetUserImage";
import LoadingOverlay from "../../../components/LoadingOverlay";

export default function EditParentImage() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const { data } = useGetUserProfile();
  const { uploadAndUpdate, isLoading: isUpdating } = useUpdateProfileWithImage(
    data?.data?.id
  );
  // console.log(data?.data?.id);

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image");
      return;
    }
    try {
      await uploadAndUpdate(image);
    } catch (err) {
      Alert.alert("could not upload file");
    }

    // if (!file) return;

    // try {
    //   await uploadAndUpdate(file, {
    //     title: formData.get("title") as string,
    //     name: formData.get("name") as string,
    //     language: formData.get("language") as string,
    //     country: formData.get("country") as string,
    //   });

    //   alert("Profile updated successfully!");
    // } catch (error) {
    //   alert("Failed to update profile");
    // }
  };

  const UploadImage = async (mode?: string) => {
    try {
      let result;
      if (mode == "gallery") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert(
            "Permission required",
            "Permission to access the media library is required."
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        if (!result.canceled) {
          saveImage(result.assets[0].uri);
        }
      } else {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        await ImagePicker;
        ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert(
            "Permission required",
            "Permission to access the Camera is required."
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.canceled) {
          await saveImage(result.assets[0].uri);
        }
      }
    } catch (err) {
      Alert.alert("Error Uploading Image");
      console.log(err);
      setOpen(false);
    }
  };

  const saveImage = async (image: any) => {
    try {
      setImage(image);
      setOpen(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <View className="flex-1 bg-[#FFFCFBFB] ">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Edit Image
        </Text>
      </View>

      <View className="flex-1">
        <Text style={[defaultStyles.defaultText]} className="mx-auto mt-8">
          Add a photo to personalise your profile.
        </Text>
        <View className="w-[250px] mt-16 gap-11 h-[250px] border border-[#616161] mx-auto border-dashed rounded-full justify-center items-center">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-[250] h-[250] rounded-full absolute"
            />
          ) : (
            <>
              <View className="gap-5 items-center">
                <GalleryAdd size={24} color="#212121" />
                <Text style={[defaultStyles.defaultText, { fontSize: 14 }]}>
                  Please upload a profile picture
                </Text>
              </View>

              <Pressable onPress={() => setOpen(true)}>
                <Text
                  className="border-[0.5px] border-[#616161] rounded-[31px] p-2"
                  style={[defaultStyles.defaultText]}
                >
                  Upload a file
                </Text>
              </Pressable>
            </>
          )}
        </View>
        <View className="flex-1 justify-center px-4 gap-6">
          <Pressable
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text
              style={[defaultStyles.defaultText, { color: "white" }]}
              className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full ${image ? "bg-[#EC4007]" : "bg-[#FF8771] "}`}
            >
              Save
            </Text>
          </Pressable>
          {image && (
            <Pressable onPress={() => setImage("")}>
              <Text
                style={[defaultStyles.defaultText, { color: "black" }]}
                className="border-[#212121] border-[0.5px]  rounded-[99px] py-3 px-2 text-center mx-auto w-full"
              >
                Cancel
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <ScreenModal
        open={open}
        setOpen={setOpen}
        onPressCamera={() => UploadImage()}
        onPressFile={() => UploadImage("gallery")}
      />
      <LoadingOverlay label="Uplaoding" visible={isUpdating} />
    </View>
  );
}

export const ScreenModal = ({
  open,
  setOpen,
  onPressCamera,
  onPressFile,
}: {
  open: boolean;
  setOpen: (s: boolean) => void;
  onPressCamera: () => void;
  onPressFile: (mode?: string) => void;
}) => {
  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable
        onPress={() => setOpen(false)}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          className="px-[54px] pb-[68px]"
          onStartShouldSetResponder={() => true}
        >
          <View className="h-[6px] w-[68px] bg-[#C5C5C5] mx-auto rounded-[32px] mt-[28px]" />
          <View className="flex-row mt-[34px] gap-[56px]">
            <Pressable
              onPress={onPressCamera}
              className="bg-[#FFFCFBFB] border-[1.18px] border-[#FAF4F2] h-[60px] w-[60px] justify-center items-center  rounded-full"
            >
              <Camera size="30" color="#212121" />
            </Pressable>
            <Pressable
              onPress={() => onPressFile("gallery")}
              className="bg-[#FFFCFBFB] items-center border-[1.18px] border-[#FAF4F2] rounded-full h-[60px] justify-center w-[60px]"
            >
              <Folder2 size="30" color="#212121" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

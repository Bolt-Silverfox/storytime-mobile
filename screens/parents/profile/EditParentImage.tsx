import { useNavigation } from "@react-navigation/native";
import { GalleryAdd } from "iconsax-react-nativejs";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useUploadCustomAvatar from "../../../hooks/tanstack/mutationHooks/useUploadCustomAvatar";
import useImagePicker from "../../../hooks/useImagePicker";
import defaultStyles from "../../../styles";

export default function EditParentImage() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { pickImage } = useImagePicker(setImage);
  const { isPending, mutate } = useUploadCustomAvatar({
    onSuccess: () => navigator.goBack(),
  });

  return (
    <View className="flex-1 bg-[bg-light] ">
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

              <Pressable onPress={pickImage}>
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
              if (!image) {
                Alert.alert("Pick a valid image");
                return;
              }
              mutate(image);
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
      <LoadingOverlay label="Uploading" visible={isPending} />
    </View>
  );
}

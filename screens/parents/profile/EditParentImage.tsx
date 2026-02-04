import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import LoadingOverlay from "../../../components/LoadingOverlay";
import UploadAvatarModal from "../../../components/modals/UploadAvatarModal";
import useUploadCustomAvatar from "../../../hooks/tanstack/mutationHooks/useUploadCustomAvatar";
import defaultStyles from "../../../styles";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";

export default function EditParentImage() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isPending, mutate } = useUploadCustomAvatar({
    onSuccess: () => navigator.goBack(),
  });
  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[bg-light] ">
        <View className="relative flex-row justify-center gap-[10px] border-b-[0.5px] border-[#EAE8E8] bg-white p-4 ">
          <Pressable className="absolute left-0 p-4">
            <ChevronLeft onPress={() => navigator.goBack()} />
          </Pressable>
          <Text
            style={[defaultStyles.defaultText, editStyles.headerTitle]}
            className="self-center text-center  "
          >
            Edit Image
          </Text>
        </View>

        <View className="flex-1">
          <Text style={[defaultStyles.defaultText]} className="mx-auto mt-8">
            Add a photo to personalise your profile.
          </Text>
          <View className="mx-auto mt-16 h-[250px] w-[250px] items-center justify-center gap-11 rounded-full border border-dashed border-[#616161]">
            {image ? (
              <View className="relative">
                <Image
                  source={{ uri: image }}
                  className="h-[250] w-[250] rounded-full"
                />
                <Pressable
                  onPress={() => setIsModalOpen(true)}
                  className="absolute bottom-0 right-6 flex size-12 items-center justify-center rounded-full border border-border-light bg-white"
                >
                  <FontAwesome5 name="edit" size={15} color="black" />
                </Pressable>
              </View>
            ) : (
              <>
                <View className="items-center gap-5">
                  <MaterialCommunityIcons
                    name="image-plus-outline"
                    size={24}
                    color="#212121"
                  />
                  <Text
                    style={[defaultStyles.defaultText, editStyles.uploadText]}
                  >
                    Please upload a profile picture
                  </Text>
                </View>

                <Pressable onPress={() => setIsModalOpen(true)}>
                  <Text
                    className="rounded-[31px] border-[0.5px] border-[#616161] p-2"
                    style={[defaultStyles.defaultText]}
                  >
                    Upload a file
                  </Text>
                </Pressable>
              </>
            )}
          </View>
          <View className="flex-1 justify-center gap-6 px-4">
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
                style={[defaultStyles.defaultText, editStyles.whiteText]}
                className={` mx-auto w-full rounded-[99px] px-2 py-3 text-center ${image ? "bg-[#EC4007]" : "bg-[#FF8771] "}`}
              >
                Save
              </Text>
            </Pressable>
            {image && (
              <Pressable onPress={() => setImage("")}>
                <Text
                  style={[defaultStyles.defaultText, editStyles.blackText]}
                  className="mx-auto w-full  rounded-[99px] border-[0.5px] border-[#212121] px-2 py-3 text-center"
                >
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        <LoadingOverlay label="Uploading" visible={isPending} />
        <UploadAvatarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setImage={setImage}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const editStyles = StyleSheet.create({
  headerTitle: {
    color: "black",
    fontSize: 18,
  },
  uploadText: {
    fontSize: 14,
  },
  whiteText: {
    color: "white",
  },
  blackText: {
    color: "black",
  },
});

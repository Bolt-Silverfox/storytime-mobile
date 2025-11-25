import { View, Text, Pressable, Image, Modal } from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { Camera, Folder2, GalleryAdd } from "iconsax-react-nativejs";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

export default function EditParentImage() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const [open, setOpen] = useState(false);
  return (
    <View className="flex-1 ">
      <View className="flex-row p-4 gap-[10px] bg-white">
        <ChevronLeft onPress={() => navigator.goBack()} />
        <Text
          style={[defaultStyles.defaultText, { color: "black" }]}
          className="self-center "
        >
          Edit image
        </Text>
      </View>

      <View className="flex-1">
        <Text style={[defaultStyles.defaultText]} className="mx-auto mt-8">
          Add a photo to personalise your profile.
        </Text>
        <View className="w-[250px] mt-16 gap-11 h-[250px] border border-[#616161] mx-auto border-dashed rounded-full justify-center items-center">
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
        </View>
        <View className="flex-1 justify-center px-4 gap-6">
          <Pressable onPress={() => navigator.navigate("indexPage")}>
            <Text
              style={[defaultStyles.defaultText, { color: "white" }]}
              className=" bg-[#FF8771] rounded-[99px] py-3 px-2 text-center mx-auto w-full"
            >
              Save
            </Text>
          </Pressable>
          {
            <Pressable>
              <Text
                style={[defaultStyles.defaultText, { color: "black" }]}
                className="border-[#212121] border-[0.5px]  rounded-[99px] py-3 px-2 text-center mx-auto w-full"
              >
                Cancel
              </Text>
            </Pressable>
          }
        </View>
      </View>
      <ScreenModal open={open} setOpen={setOpen} />
    </View>
  );
}

const ScreenModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (s: boolean) => void;
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
            <Pressable className="bg-[#FFFCFBFB] border-[1.18px] border-[#FAF4F2] h-[60px] w-[60px] justify-center items-center  rounded-full">
              <Camera size="30" color="#212121" />
            </Pressable>
            <Pressable className="bg-[#FFFCFBFB] items-center border-[1.18px] border-[#FAF4F2] rounded-full h-[60px] justify-center w-[60px]">
              <Folder2 size="30" color="#212121" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

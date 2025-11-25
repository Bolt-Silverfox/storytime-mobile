import { View, Text, Pressable, Image, Modal } from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";

export default function EditParentImage() {
  const [open, setOpen] = useState(true);
  return (
    <View className="flex-1 ">
      <View className="flex-row p-4 gap-[10px] bg-white">
        <ChevronLeft />
        <Text style={[defaultStyles.defaultText]} className="self-center ">
          Edit image
        </Text>
      </View>

      <View className="flex-1">
        <Text style={[defaultStyles.defaultText]} className="mx-auto mt-8">
          Add a photo to personalise your profile.
        </Text>
        <View className="w-[250px] mt-16 gap-11 h-[250px] border border-[#616161] mx-auto border-dashed rounded-full justify-center items-center">
          <View className="gap-5">
            <Image
              source={require("../../../assets/icons/gallery-export.png")}
              className="mx-auto"
            />
            <Text style={[defaultStyles.defaultText, { fontSize: 14 }]}>
              Please upload a profile picture
            </Text>
          </View>

          <Pressable>
            <Text
              className="border-[0.5px] border-[#616161] rounded-[31px] p-2"
              style={[defaultStyles.defaultText]}
            >
              Upload a file
            </Text>
          </Pressable>
        </View>
        <View className="flex-1 justify-center px-4">
          <Pressable>
            <Text
              style={[defaultStyles.defaultText, { color: "white" }]}
              className=" bg-[#FF8771] rounded-[99px] py-3 px-2 text-center mx-auto w-full"
            >
              Save
            </Text>
          </Pressable>
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
        >
          <View className="h-[6px] w-[68px] bg-[#C5C5C5] mx-auto rounded-[32px] mt-[28px]" />
          <View className="flex-row mt-[34px] gap-[56px]">
            <View className="bg-[#FFFCFBFB] border-[1.18px] border-[#FAF4F2] h-[60px] w-[60px] justify-center  rounded-full">
              <Image
                source={require("../../../assets/icons/camera.png")}
                className="mx-auto"
              />
            </View>
            <View className="bg-[#FFFCFBFB] border-[1.18px] border-[#FAF4F2] rounded-full h-[60px] justify-center w-[60px]">
              <Image
                source={require("../../../assets/icons/folder.png")}
                className="mx-auto"
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

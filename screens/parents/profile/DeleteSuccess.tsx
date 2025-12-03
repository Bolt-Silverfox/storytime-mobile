import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../styles";
import { ArrowLeft2 } from "iconsax-react-nativejs";

export default function DeleteSuccess() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const onNavigate = () => {
    navigator.reset({
      index: 1,
      routes: [{ name: "indexPage" }, { name: "manageChildProfiles" }],
    });
  };
  return (
    <View className="flex-1 ">
      <View className="px-5 my-5">
        <Pressable className="w-8 py-2" onPress={onNavigate}>
          <ChevronLeft size={25} />
        </Pressable>
      </View>
      <View
        className="  items-center justify-center"
        style={{ marginTop: 100 }}
      >
        <Image
          source={require("../../../assets/icons/successful-reset-illustration.png")}
        />
        <View className=" mt-10">
          <Text style={[defaultStyles.heading, { fontSize: 28 }]}>
            Successfull
          </Text>
          <Text className="mx-auto mt-10" style={[defaultStyles.defaultText]}>
            Child profile has been deleted successfully
          </Text>
        </View>
      </View>
      <View className="justify-center w-[95%] mx-auto h-[250px] ">
        <Pressable style={[defaultStyles.button]} onPress={onNavigate}>
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className="text-center text-white"
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

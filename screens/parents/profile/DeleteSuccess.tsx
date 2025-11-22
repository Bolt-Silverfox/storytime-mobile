import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../styles";

export default function DeleteSuccess() {
  const inset = useSafeAreaInsets();
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <View
      style={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
      className="flex-1 bg-[#FFFCFBFB]"
    >
      <View className="px-5">
        <Pressable
          className="w-8 py-2"
          onPress={() => navigator.navigate("manageChildProfiles")}
        >
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
            Child profile as been deleted successfully
          </Text>
        </View>
      </View>
      <View className="justify-center w-[95%] mx-auto h-[250px] ">
        <Pressable
          style={[defaultStyles.button]}
          onPress={() => navigator.navigate("manageChildProfiles")}
        >
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

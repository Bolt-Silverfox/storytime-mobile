import { View, Text, Switch, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react-nativejs";

export default function ManagePassword() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [isResetPassWord, setIsResetPassWord] = useState(false);
  const toggleSwitch = () =>
    setIsResetPassWord((previousState) => !previousState);
  const [isSetpin, setIsSetPin] = useState(false);
  const toggleSwitchPin = () => setIsSetPin((previousState) => !previousState);

  useEffect(() => {
    if (isResetPassWord) {
      setTimeout(() => {
        navigator.navigate("resetParentPassword");
      }, 1000);
    }

    if (isSetpin) {
      setTimeout(() => {
        navigator.navigate("setPin");
      }, 1000);
    }
  }, [isSetpin, isResetPassWord]);

  return (
    <View className="bg-[#FFFCFBFB] flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ArrowLeft2 onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Manage Password/Pin
        </Text>
      </View>
      <View className="mt-[24px] mx-[16] gap-4">
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white">
          <Text
            style={[defaultStyles.defaultText, { color: "black" }]}
            className="self-center"
          >
            Reset Password
          </Text>
          <ArrowRight2 />
        </View>
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white">
          <Text
            style={[defaultStyles.defaultText, { color: "black" }]}
            className="self-center"
          >
            Set pin
          </Text>
          <ArrowRight2 />
        </View>
      </View>
      <View className="flex-1 justify-end  px-4 gap-6">
        <Pressable
          className="pb-10"
          onPress={() => navigator.navigate("indexPage")}
        >
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full bg-[#EC4007]`}
          >
            Save
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

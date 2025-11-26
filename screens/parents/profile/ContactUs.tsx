import { View, Text, Switch, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import {
  Call,
  Facebook,
  Instagram,
  Message,
  Sms,
} from "iconsax-react-nativejs";

export default function ContactUs() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <View className="bg-[#FFFCFBFB] flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Contact us
        </Text>
      </View>
      <View className="mt-9 mb-8 items-center">
        <Text
          style={[defaultStyles.defaultText, { fontSize: 16 }]}
          className="text-center max-w-[311px]"
        >
          Contact our team for help and enquiries
        </Text>
      </View>
      <View className="mt-[24px] mx-[16] gap-4">
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8] gap-3 rounded-[20px] px-[16] bg-white">
          <Sms />
          <View>
            <Text style={[defaultStyles.defaultText, { color: "black" }]}>
              Email us
            </Text>
            <Text style={[defaultStyles.defaultText, { color: "black" }]}>
              support@storytimeapp.me
            </Text>
          </View>
        </View>
        <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8] gap-3 rounded-[20px] px-[16] bg-white">
          <Call />
          <View>
            <Text
              style={[defaultStyles.defaultText, { color: "black" }]}
            >
              Call us
            </Text>
            <Text>+1 (765) 765 7656</Text>
          </View>
        </View>
      </View>
      <View className="flex-1   px-4 gap-6 mx-auto justify-center items-center">
        <Text style={[defaultStyles.defaultText, { color: "black" }]}>
          Our social media links
        </Text>
        <View className="flex-row gap-3">
          <Facebook size="50" color="#EC4007" variant="Bold" />
          <Instagram size="50" color="#EC4007" variant="Bold" />
          <Image
            source={require("../../../assets/icons/tiktok.png")}
            width={50}
            height={50}
          />
        </View>
      </View>
    </View>
  );
}

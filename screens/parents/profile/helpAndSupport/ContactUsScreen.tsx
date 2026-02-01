import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";

export default function ContactUsScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="flex-1 bg-[#FFFCFBFB]">
      <View className="relative flex-row justify-center gap-[10px] border-b-[0.5px] border-[#EAE8E8] bg-white p-4 ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, contactStyles.headerTitle]}
          className="self-center text-center  "
        >
          Contact us
        </Text>
      </View>
      <View className="mb-8 mt-9 items-center">
        <Text
          style={[defaultStyles.defaultText, contactStyles.subtitle]}
          className="max-w-[311px] text-center"
        >
          Contact our team for help and enquiries
        </Text>
      </View>
      <View className="mx-[16] mt-[24px] gap-4">
        <View className="flex-row gap-3 rounded-[20px] border-[0.5px] border-[#EAE8E8] bg-white px-[16] py-[34]">
          <Ionicons name="mail-outline" size={24} color="black" />
          <View>
            <Text style={[defaultStyles.defaultText, contactStyles.blackText]}>
              Email us
            </Text>
            <Text style={[defaultStyles.defaultText, contactStyles.blackText]}>
              team@storytimeapp.me
            </Text>
          </View>
        </View>
        {/* <View className="flex-row py-[34] border-[0.5px] border-[#EAE8E8] gap-3 rounded-[20px] px-[16] bg-white">
          <Ionicons name="call-outline" size={24} color="black" />
          <View>
            <Text style={[defaultStyles.defaultText, { color: "black" }]}>
              Call us
            </Text>
            <Text>+1 (765) 765 7656</Text>
          </View>
        </View> */}
      </View>
      <View className="mx-auto   flex-1 items-center justify-center gap-6 px-4">
        <Text style={[defaultStyles.defaultText, contactStyles.blackText]}>
          Our social media links
        </Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() =>
              openURL("https://www.facebook.com/profile.php?id=61585584201713")
            }
          >
            <FontAwesome5 name="facebook-square" size={50} color="#EC4007" />
          </Pressable>
          <Pressable
            onPress={() =>
              openURL("https://www.instagram.com/teamstorytimehq/")
            }
          >
            <FontAwesome6 name="square-instagram" size={50} color="#EC4007" />
          </Pressable>
          <Pressable
            onPress={() => openURL("https://www.tiktok.com/@teamstorytimehq")}
          >
            <Image
              source={require("../../../../assets/icons/tiktok.png")}
              style={contactStyles.socialIcon}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              openURL("https://www.linkedin.com/company/storytimehq/")
            }
          >
            <FontAwesome5 name="linkedin" size={50} color="#EC4007" />
          </Pressable>
          <Pressable onPress={() => openURL("https://x.com/storytimehq")}>
            <FontAwesome6 name="x-twitter" size={50} color="#EC4007" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const contactStyles = StyleSheet.create({
  headerTitle: {
    color: "black",
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
  },
  blackText: {
    color: "black",
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
});

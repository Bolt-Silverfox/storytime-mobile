import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";

export default function ContactUsScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="bg-[#FFFCFBFB] flex-1">
        <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
          <Pressable className="absolute left-0 p-4">
            <ChevronLeft onPress={() => navigator.goBack()} />
          </Pressable>
          <Text
            style={[
              defaultStyles.defaultText,
              { color: "black", fontSize: 18 },
            ]}
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
            <Ionicons name="mail-outline" size={24} color="black" />
            <View>
              <Text style={[defaultStyles.defaultText, { color: "black" }]}>
                Email us
              </Text>
              <Text style={[defaultStyles.defaultText, { color: "black" }]}>
                team@storytimeapp.me
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-1   px-4 gap-6 mx-auto justify-center items-center">
          <Text style={[defaultStyles.defaultText, { color: "black" }]}>
            Our social media links
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() =>
                openURL(
                  "https://www.facebook.com/profile.php?id=61585584201713",
                )
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
                style={{ width: 50, height: 50 }}
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
    </SafeAreaWrapper>
  );
}

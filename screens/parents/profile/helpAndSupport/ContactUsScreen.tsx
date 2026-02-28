import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";
import PageTitle from "../../../../components/PageTitle";

export default function ContactUsScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[#FFFCFBFB]">
        <PageTitle goBack={() => navigator.goBack()} title="Contact us" />
        <View className="my-8 items-center">
          <Text
            style={[defaultStyles.defaultText, contactStyles.subtitle]}
            className="max-w-[311px] text-center"
          >
            Contact our team for help and enquiries
          </Text>
        </View>
        <View className="mx-4 gap-4">
          <View className="flex-row items-center gap-3 rounded-[20px] border-[0.5px] border-[#EAE8E8] bg-white px-[16] py-[34]">
            <View className="flex size-[72px] items-center justify-center rounded-full bg-[#EEE7FF]">
              <Ionicons name="mail-outline" size={40} color="#4807EC" />
            </View>
            <View>
              <Text
                style={[defaultStyles.defaultText, contactStyles.blackText]}
              >
                Email
              </Text>
              <Text
                style={[defaultStyles.defaultText, contactStyles.blackText]}
              >
                team@storytimeapp.me
              </Text>
            </View>
          </View>
        </View>
        <View className="mx-auto mb-9 flex-1 items-center justify-end gap-6 px-4">
          <Text style={[defaultStyles.defaultText, contactStyles.blackText]}>
            Our social media links
          </Text>
          <View className="flex w-full flex-row items-center justify-between">
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Storytime on Facebook"
              hitSlop={8}
              onPress={() =>
                openURL(
                  "https://www.facebook.com/profile.php?id=61585584201713"
                )
              }
            >
              <FontAwesome5 name="facebook-square" size={50} color="black" />
            </Pressable>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Storytime on Instagram"
              hitSlop={8}
              onPress={() =>
                openURL("https://www.instagram.com/teamstorytimehq/")
              }
            >
              <FontAwesome6 name="square-instagram" size={50} color="black" />
            </Pressable>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Storytime on TikTok"
              hitSlop={8}
              onPress={() => openURL("https://www.tiktok.com/@teamstorytimehq")}
              className="flex size-[51px] flex-col items-center justify-center rounded-full bg-black"
            >
              <FontAwesome6 name="tiktok" size={35} color="white" />
            </Pressable>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Storytime on Linkedin"
              hitSlop={8}
              onPress={() =>
                openURL("https://www.linkedin.com/company/storytimehq/")
              }
              className="flex size-[51px] flex-col items-center justify-center rounded-full bg-black"
            >
              <FontAwesome5 name="linkedin-in" size={35} color="white" />
            </Pressable>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Storytime on X (FKA Twitter)"
              hitSlop={8}
              onPress={() => openURL("https://x.com/storytimehq")}
            >
              <FontAwesome6 name="x-twitter" size={50} color="black" />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const contactStyles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
  },
  blackText: {
    color: "black",
  },
});

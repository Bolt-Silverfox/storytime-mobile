import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";
import { privacy } from "../../../../constants/constants";

export default function PrivacyAndPolicyScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <View className="flex-1 bg-[#FFFCFBFB]">
      <View className="relative flex-row justify-center gap-[10px] border-b-[0.5px] border-[#EAE8E8] bg-white p-4 ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, privacyStyles.headerTitle]}
          className="self-center text-center  "
        >
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" mx-[16] gap-4 "
      >
        {privacy.map((term, i) => (
          <View key={i} className="mt-5">
            <Text style={[defaultStyles.heading, privacyStyles.sectionTitle]}>
              {term.title}
            </Text>
            <Text
              style={[defaultStyles.defaultText, privacyStyles.description]}
            >
              {term.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const privacyStyles = StyleSheet.create({
  headerTitle: {
    color: "black",
    fontSize: 18,
  },
  sectionTitle: {
    textAlign: "left",
    fontSize: 18,
  },
  description: {
    marginVertical: 15,
  },
});

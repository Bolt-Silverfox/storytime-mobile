import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageTitle from "../../../../components/PageTitle";
import { privacy } from "../../../../constants/constants";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";

export default function PrivacyAndPolicyScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[#FFFCFBFB]">
        <PageTitle title="Privacy Policy" goBack={() => navigator.goBack()} />
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
    </SafeAreaWrapper>
  );
}

const privacyStyles = StyleSheet.create({
  sectionTitle: {
    textAlign: "left",
    fontSize: 18,
  },
  description: {
    marginVertical: 15,
  },
});

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";

import PageTitle from "../../../../components/PageTitle";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { terms } from "../../../../constants/constants";

export default function TermsAndConditions() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[#FFFCFBFB]">
        <PageTitle
          title="Terms and Conditions"
          goBack={() => navigator.goBack()}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          className=" mx-[16] gap-4 "
        >
          {terms.map((term, i) => (
            <View key={i} className="mt-5">
              <Text style={[defaultStyles.heading, termsStyles.sectionTitle]}>
                {term.title}
              </Text>
              <Text
                style={[defaultStyles.defaultText, termsStyles.description]}
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

const termsStyles = StyleSheet.create({
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

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import PageTitle from "../../../../components/PageTitle";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { privacyPolicyData } from "../../../../data";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";

export default function PrivacyAndPolicyScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[#FFFCFBFB]">
        <PageTitle title="Privacy Policy" goBack={() => navigator.goBack()} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-col gap-y-8"
          className="mx-4 mb-5 mt-8"
        >
          {privacyPolicyData.map((item, i) => (
            <View key={i} className="flex flex-col gap-y-3">
              <Text className="font-[abeezee] text-[18px] text-black">
                {item.number}. {item.title}
              </Text>
              <Text className="font-[abeezee] text-base text-text">
                {item.paragraph}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

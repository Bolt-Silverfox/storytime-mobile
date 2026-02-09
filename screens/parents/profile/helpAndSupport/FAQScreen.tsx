import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import Icon from "../../../../components/Icon";
import PageTitle from "../../../../components/PageTitle";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { FAQ } from "../../../../constants/constants";
import defaultStyles from "../../../../styles";

export default function FaQScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [currentlyOpenQuestion, setCurrentlyOpenQuestion] = useState(-1);

  const toggleOpenQuestion = (questionId: number) => {
    setCurrentlyOpenQuestion((o) => (o === questionId ? -1 : questionId));
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bg-light">
        <PageTitle goBack={() => navigator.goBack()} title="FAQs" />
        <ScrollView contentContainerStyle={faqStyles.scrollContent}>
          <View className="mt-9  items-center">
            <Text
              style={[defaultStyles.defaultText, faqStyles.subtitle]}
              className="max-w-[311px] text-center"
            >
              Find answers to frequently asked questions
            </Text>
          </View>
          <View
            style={styles.menuList}
            className="rounded-[20px] border border-border-lighter bg-white px-[16]"
          >
            {FAQ.map((faq, i) => (
              <View
                key={faq.id}
                className={`flex flex-col gap-y-2 border-b border-b-border-light ${
                  i === FAQ.length - 1 ? "border-b-0" : ""
                }`}
              >
                <Pressable
                  onPress={() => toggleOpenQuestion(faq.id)}
                  className="flex flex-row items-center justify-between gap-x-3 py-6"
                >
                  <Text className="flex-1 font-[abeezee] text-[18px] text-black">
                    {faq.q}
                  </Text>
                  <Icon
                    name={
                      currentlyOpenQuestion === faq.id
                        ? "ChevronUp"
                        : "ChevronDown"
                    }
                  />
                </Pressable>
                {currentlyOpenQuestion === faq.id && (
                  <Text className="mb-4 ml-4 font-[abeezee] text-[18px] text-text">
                    {faq.a}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  menuList: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignSelf: "center",
    width: "90%",
  },
});

const faqStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 16,
  },
});

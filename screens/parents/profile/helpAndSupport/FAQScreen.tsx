import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import MenuItem from "../../../../components/MenuItem";
import PageTitle from "../../../../components/PageTitle";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { FAQ } from "../../../../constants/constants";
import defaultStyles from "../../../../styles";

export default function FaQScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[#FFFCFBFB]">
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
          <View>
            <Text
              style={[defaultStyles.heading, faqStyles.sectionTitle]}
              className="mt-6"
            >
              Getting Started
            </Text>
            <View
              style={styles.menuList}
              className="rounded-[20px]   border border-border-lighter px-[16]"
            >
              {FAQ.gettingStarted.map((faq, i) => (
                <MenuItem
                  key={i}
                  label={faq.q}
                  isTablet={isTablet}
                  description={faq.a}
                />
              ))}
            </View>
          </View>
          <View>
            <Text
              style={[defaultStyles.heading, faqStyles.sectionTitle]}
              className="mt-6"
            >
              Safety & Privacy
            </Text>
            <View
              style={styles.menuList}
              className="rounded-[20px]   border border-border-lighter px-[16]"
            >
              {FAQ.safetyAndPrivacy.map((faq, i) => (
                <MenuItem
                  key={i}
                  label={faq.q}
                  isTablet={isTablet}
                  description={faq.a}
                />
              ))}
            </View>
          </View>
          <View>
            <Text
              style={[defaultStyles.heading, faqStyles.sectionTitle]}
              className="mt-6"
            >
              Stories & Subscription
            </Text>
            <View
              style={styles.menuList}
              className="rounded-[20px]   border border-border-lighter px-[16]"
            >
              {FAQ.storiesAndSubscription.map((faq, i) => (
                <MenuItem
                  key={i}
                  label={faq.q}
                  isTablet={isTablet}
                  description={faq.a}
                />
              ))}
            </View>
          </View>
          <View>
            <Text
              style={[defaultStyles.heading, faqStyles.sectionTitle]}
              className="mt-6"
            >
              Help & Support
            </Text>
            <View
              style={styles.menuList}
              className="rounded-[20px]   border border-border-lighter px-[16]"
            >
              {FAQ.helpAndSupport.map((faq, i) => (
                <MenuItem
                  key={i}
                  label={faq.q}
                  isTablet={isTablet}
                  description={faq.a}
                />
              ))}
            </View>
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
  sectionTitle: {
    fontSize: 19,
  },
});

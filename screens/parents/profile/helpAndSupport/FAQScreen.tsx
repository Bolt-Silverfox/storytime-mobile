import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import MenuItem from "../../../../components/MenuItem";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import { FAQ } from "../../../../constants/constants";

export default function FaQScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <View className="flex-1 bg-[#FFFCFBFB]">
      <View className="relative flex-row justify-center gap-[10px] border-b-[0.5px] border-[#EAE8E8] bg-white p-4 ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, faqStyles.headerTitle]}
          className="self-center text-center  "
        >
          FAQs
        </Text>
      </View>

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
  headerTitle: {
    color: "black",
    fontSize: 18,
  },
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

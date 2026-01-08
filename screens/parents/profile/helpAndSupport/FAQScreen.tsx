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
    <View className="bg-[#FFFCFBFB] flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          FAQs
        </Text>
      </View>

      <ScrollView contentContainerStyle={[{ paddingBottom: 100 }]}>
        <View className="mt-9  items-center">
          <Text
            style={[defaultStyles.defaultText, { fontSize: 16 }]}
            className="text-center max-w-[311px]"
          >
            Find answers to frequently asked questions
          </Text>
        </View>
        <View>
          <Text
            style={[defaultStyles.heading, { fontSize: 19 }]}
            className="mt-6"
          >
            Parent and Account management
          </Text>
          <View
            style={styles.menuList}
            className="px-[16]   border rounded-[20px] border-border-lighter"
          >
            {FAQ.parentAcountManagement.map((faq, i) => (
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
            style={[defaultStyles.heading, { fontSize: 19 }]}
            className="mt-6"
          >
            Safety & Controls
          </Text>
          <View
            style={styles.menuList}
            className="px-[16]   border rounded-[20px] border-border-lighter"
          >
            {FAQ.safety.map((faq, i) => (
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
            style={[defaultStyles.heading, { fontSize: 19 }]}
            className="mt-6"
          >
            Stories & Audio
          </Text>
          <View
            style={styles.menuList}
            className="px-[16]   border rounded-[20px] border-border-lighter"
          >
            {FAQ.storiesAndAudio.map((faq, i) => (
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
            style={[defaultStyles.heading, { fontSize: 19 }]}
            className="mt-6"
          >
            Subscription & Billing
          </Text>
          <View
            style={styles.menuList}
            className="px-[16]   border rounded-[20px] border-border-lighter"
          >
            {FAQ.subscription.map((faq, i) => (
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
            style={[defaultStyles.heading, { fontSize: 19 }]}
            className="mt-6"
          >
            Privacy & Data
          </Text>
          <View
            style={styles.menuList}
            className="px-[16]   border rounded-[20px] border-border-lighter"
          >
            {FAQ.privacy.map((faq, i) => (
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

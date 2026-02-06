import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { MessageCircleQuestionMark } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import MenuItem from "../../../../components/MenuItem";
import PageTitle from "../../../../components/PageTitle";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";

export default function HelpAndSupportIndexScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-[#FFFCFBFB]">
        <PageTitle goBack={() => navigator.goBack()} title="Help & Support" />
        <ScrollView contentContainerStyle={helpStyles.scrollContent}>
          <View
            style={styles.menuList}
            className="rounded-[20px] border  border-border-lighter px-[16] pt-7"
          >
            <MenuItem
              icon={
                <MessageCircleQuestionMark
                  color={"#EC4007"}
                  size={isTablet ? 20 : 18}
                />
              }
              label="FAQs"
              onPress={() =>
                navigator.navigate("helpAndSupport", { screen: "faq" })
              }
              isTablet={isTablet}
            />
            <MenuItem
              icon={
                <Ionicons
                  name="chatbubbles-outline"
                  color={"#EC4007"}
                  size={isTablet ? 20 : 18}
                />
              }
              label="Suggestions & Feedback"
              onPress={() =>
                navigator.navigate("helpAndSupport", { screen: "suggestions" })
              }
              isTablet={isTablet}
            />
            <MenuItem
              icon={
                <Feather
                  name="headphones"
                  color={"#EC4007"}
                  size={isTablet ? 20 : 18}
                />
              }
              label="Contact us"
              onPress={() =>
                navigator.navigate("helpAndSupport", { screen: "contactUs" })
              }
              isTablet={isTablet}
            />
            <MenuItem
              icon={
                <SimpleLineIcons
                  name="notebook"
                  color={"#EC4007"}
                  size={isTablet ? 20 : 18}
                />
              }
              label="Terms and Conditions"
              isTablet={isTablet}
              onPress={() =>
                navigator.navigate("helpAndSupport", {
                  screen: "termsAndConditions",
                })
              }
            />
            <MenuItem
              icon={
                <Feather
                  name="lock"
                  color={"#EC4007"}
                  size={isTablet ? 20 : 18}
                />
              }
              label="Privacy and Policy"
              isTablet={isTablet}
              onPress={() =>
                navigator.navigate("helpAndSupport", {
                  screen: "privacyAndPolicy",
                })
              }
            />
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

const helpStyles = StyleSheet.create({
  headerTitle: {
    color: "black",
    fontSize: 18,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

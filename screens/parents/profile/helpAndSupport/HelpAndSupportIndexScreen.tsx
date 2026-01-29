import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, MessageCircleQuestionMark } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import MenuItem from "../../../../components/MenuItem";
import SafeAreaWrapper from "../../../../components/UI/SafeAreaWrapper";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";

export default function HelpAndSupportIndexScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="bg-bgLight flex-1">
        <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
          <Pressable className="absolute left-0 p-4">
            <ChevronLeft onPress={() => navigator.goBack()} />
          </Pressable>
          <Text
            style={[
              defaultStyles.defaultText,
              { color: "black", fontSize: 18 },
            ]}
            className="self-center text-center  "
          >
            Help & Support
          </Text>
        </View>
        <ScrollView contentContainerStyle={[{ paddingBottom: 100 }]}>
          <View className="px-4 pt-7 bg-white border rounded-[20px] border-border-lighter mt-10 mx-4">
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
              isLastItem
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

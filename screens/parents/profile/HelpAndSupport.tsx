import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import MenuItem from "../../../components/MenuItem";
import { ChevronLeft, MessageCircleQuestionMark } from "lucide-react-native";
import {
  Headphone,
  LockCircle,
  Message2,
  Messages2,
  Notepad2,
} from "iconsax-react-nativejs";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

export default function HelpAndSupport() {
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
          Help & Support
        </Text>
      </View>
      <ScrollView contentContainerStyle={[{ paddingBottom: 100 }]}>
        <View
          style={styles.menuList}
          className="px-[16] pt-7  border rounded-[20px] border-[#FAF4F2]"
        >
          <MenuItem
            icon={
              <MessageCircleQuestionMark
                color={"#EC4007"}
                size={isTablet ? 20 : 18}
              />
            }
            label="FAQs"
            onPress={() => navigator.navigate("FAQ")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Messages2 color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Suggestions & Feedback"
            onPress={() => navigator.navigate("feedBack")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={
              <Headphone
                color={"#EC4007"}
                variant="Outline"
                size={isTablet ? 20 : 18}
              />
            }
            label="Contact us"
            onPress={() => navigator.navigate("contactUs")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Notepad2 color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Terms and Conditions"
            isTablet={isTablet}
            onPress={() => navigator.navigate("termsAndConditions")}
          />
          <MenuItem
            icon={<LockCircle color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Privacy and Policy"
            isTablet={isTablet}
            onPress={() => navigator.navigate("privacyAndPolicy")}
          />
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

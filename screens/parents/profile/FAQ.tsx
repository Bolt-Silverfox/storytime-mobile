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
import { ChevronLeft,  } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

export default function FaQ() {
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
      <View className="mt-9  items-center">
        <Text
          style={[defaultStyles.defaultText, { fontSize: 16 }]}
          className="text-center max-w-[311px]"
        >
          Find answers to frequently asked questions
        </Text>
      </View>
      <ScrollView contentContainerStyle={[{ paddingBottom: 100 }]}>
        <View
          style={styles.menuList}
          className="px-[16] pt-7  border rounded-[20px] border-[#FAF4F2]"
        >
          <MenuItem
            label="FAQs"
            onPress={() => navigator.navigate("FAQ")}
            isTablet={isTablet}
            description={"yes there are"}
          />
          <MenuItem
            label="Do i need an internet connection to listen"
            isTablet={isTablet}
          />
          <MenuItem
            label="How do i upgrade my subscription"
            isTablet={isTablet}
            description={
              "Log into your account, go to profile, select the subscription option, choose a premium and follow the prompts."
            }
          />
          <MenuItem
            label="Can parents track reading progress"
            isTablet={isTablet}
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

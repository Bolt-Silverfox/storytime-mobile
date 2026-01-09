import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";
import { privacy } from "../../../../constants/constants";

export default function PrivacyAndPolicyScreen() {
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
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" mx-[16] gap-4 "
      >
        {privacy.map((term, i) => (
          <View key={i} className="mt-5">
            <Text
              style={[
                defaultStyles.heading,
                { textAlign: "left", fontSize: 18 },
              ]}
            >
              {term.title}
            </Text>
            <Text style={[defaultStyles.defaultText, { marginVertical: 15 }]}>
              {term.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

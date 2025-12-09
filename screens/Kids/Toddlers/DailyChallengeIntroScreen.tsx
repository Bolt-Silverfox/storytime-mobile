import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { ArrowRight, ChevronLeft } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";

type Props = NativeStackScreenProps<KidsSetupNavigatorParamList, "challenge">;

const ChallengeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { storyId, childId } = route.params;
  return (
    <View className="flex-1 bg-[#866EFF]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        {/* Header: left icon, centered title, right spacer */}
        <View className="relative mb-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="w-10"
              accessibilityLabel="Back"
            >
              <ChevronLeft color="#fff" size={34} />
            </Pressable>

            {/* right spacer keeps title truly centered */}
            <View className="w-10" />
          </View>

          {/* Absolutely center the title so it's visually centered regardless of icon widths */}
          <View className="absolute left-0 right-0 top-1/2 -translate-y-1/2 items-center">
            <Text className="text-white text-3xl font-[quilka]">
              Today’s Challenge
            </Text>
          </View>
        </View>

        {/* Avatar */}
        <View className="items-center mb-6">
          <Image
            source={require("../../../assets/avatars/zylo.png")}
            className="w-80 h-80 my-12"
            resizeMode="contain"
          />
        </View>

        {/* Greeting card */}
        <View className="bg-white/30 border border-white p-5 rounded-3xl mb-6">
          <Text className="text-3xl font-[quilka] text-center text-white mb-2">
            Well done!
          </Text>

          <Text className="text-base text-center text-white font-[abeezee] leading-relaxed">
            Good job completing the story. Now let’s learn some new words from
            the story.
          </Text>
        </View>

        {/* CTA button */}
        <Pressable
          onPress={() => {
            navigation.navigate("index" as any, {
              screen: "home",
              params: { childId },
            });
          }}
          className="bg-white py-3 rounded-full flex-row items-center justify-center mt-2"
          android_ripple={{ color: "rgba(0,0,0,0.05)" }}
          accessibilityRole="button"
          accessibilityLabel="Start challenge"
        >
          <Text className="text-[#866EFF] text-3xl font-[quilka] mr-3">
            Let’s go
          </Text>
          <ArrowRight color="#866EFF" size={48} />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ChallengeScreen;

import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProtectedRoutesParamList } from "../../../Navigation/ProtectedNavigator";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";

const SAMPLE_WORDS = [
  { id: "1", word: "Voyage", meaning: "A long journey, especially by sea." },
  { id: "2", word: "Brave", meaning: "Ready to face danger or pain." },
  { id: "3", word: "Companion", meaning: "A friend or travel partner." },
];

type Props = NativeStackScreenProps<
  KidsSetupNavigatorParamList,
  "storyReader"
>;

const ChallengeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 bg-[#9F50E5] p-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Top header */}
        <Text className="text-white text-lg mb-1">09:51</Text>
        <Text className="text-white text-3xl font-[quilka] mb-6">
          Today’s Challenge
        </Text>

        {/* White card */}
        <View className="bg-white rounded-3xl p-6 border-4 border-[#7130AB]">
          
          {/* Stars row */}
          <View className="flex-row justify-center mb-4">
            {[1, 2, 3].map((i) => (
              <Image
                key={i}
                source={require("../assets/star.png")}
                style={{ width: 32, height: 32, marginHorizontal: 6 }}
                resizeMode="contain"
              />
            ))}
          </View>

          {/* Greeting */}
          <Text className="text-2xl font-[quilka] text-center text-[#2D0B55]">
            Welldone Tim!
          </Text>

          <Text className="text-base text-center text-gray-700 mt-2 mb-6">
            Good job completing the story.  
            Now let’s learn some new words from the story.
          </Text>

          {/* Word preview */}
          <View className="bg-[#F7EFFF] rounded-2xl p-4 mb-5">
            <Text className="text-sm text-gray-500 mb-3">New words</Text>

            {SAMPLE_WORDS.map((w) => (
              <View key={w.id} className="flex-row mb-3">
                <View className="w-8 items-center">
                  <View className="bg-[#E3D4FF] rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-xs text-[#5A3BAA] font-semibold">
                      {w.id}
                    </Text>
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-[#2D0B55]">
                    {w.word}
                  </Text>
                  <Text className="text-sm text-gray-600">{w.meaning}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Estimated time / activity */}
          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-sm text-gray-500">Activity</Text>
              <Text className="text-lg font-semibold text-[#2D0B55]">
                Word Match
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-500">Estimated</Text>
              <Text className="text-lg font-semibold">5 min</Text>
            </View>
          </View>

          {/* CTA button */}
          <Pressable
            className="bg-[#6F2CD8] py-3 rounded-full flex-row items-center justify-center"
          >
            <Text className="text-white text-lg font-[quilka] mr-3">
              Let’s go
            </Text>
            <ArrowRight color="white" size={18} />
          </Pressable>

        </View>
      </ScrollView>
    </View>
  );
};

export default ChallengeScreen;

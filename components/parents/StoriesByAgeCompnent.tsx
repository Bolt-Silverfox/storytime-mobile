import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { ageRange } from "../../data";
import StoryItem from "./StoryItem";

type AgeRangeType = (typeof ageRange)[number];

const StoriesByAgeComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const [activeRange, setActiveRange] = useState<AgeRangeType>("1 - 4");

  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Stories by age
        </Text>
        <Text
          onPress={() => navigator.navigate("parentsTopPicks")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>
      <View className="flex flex-row items-center gap-x-2 gap-y-4 justify-center">
        {ageRange.map((age) => (
          <Text
            onPress={() => setActiveRange(age)}
            key={age}
            className={`font-[abeezee] text-center rounded-full py-2 w-32 text-base ${age === activeRange ? "text-white bg-blue" : "text-text border border-border"}`}
          >
            {age}
          </Text>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
      >
        {dummyStories.map((story, index) => (
          <StoryItem
            index={index}
            isPremium={true}
            key={story.id}
            onNavigate={() => navigator.navigate("parentsTopPicks")}
            story={story}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StoriesByAgeComponent;

const dummyStories: {
  name: string;
  ageRange: AgeRangeType;
  category: string;
  duration: number;
  imageUrl: ImageSourcePropType;
  id: string;
}[] = [
  {
    name: "Bannies egg, curated by Samil",
    ageRange: "9 - 12",
    category: "adventure",
    duration: 10,
    imageUrl: require("../../assets/images/recommended_stories/bunnies_by_samil.jpg"),
    id: "1",
  },
  {
    name: "The night time stories from granny",
    ageRange: "9 - 12",
    category: "mystery",
    duration: 16,
    imageUrl: require("../../assets/images/recommended_stories/granny_night_time_stories.jpg"),
    id: "2",
  },
  {
    name: "Bannies egg, curated by Samil",
    ageRange: "9 - 12",
    category: "adventure",
    duration: 10,
    imageUrl: require("../../assets/images/recommended_stories/bunnies_by_samil.jpg"),
    id: "3",
  },
  {
    name: "The night time stories from granny",
    ageRange: "9 - 12",
    category: "mystery",
    duration: 16,
    imageUrl: require("../../assets/images/recommended_stories/granny_night_time_stories.jpg"),
    id: "4",
  },
];

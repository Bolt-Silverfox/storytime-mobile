import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import useStoryMode from "../../contexts/StoryModeContext";
import { ageRange } from "../../data";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";
import StoryItem from "./StoryItem";

type AgeRangeType = (typeof ageRange)[number];

const StoriesByAgeComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  const [activeRange, setActiveRange] = useState<AgeRangeType>("1 - 4");

  return (
    <View className="flex mx-auto max-w-screen-md w-full flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Stories by age
        </Text>
        <Text
          onPress={() => navigator.navigate("storiesByAge")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex flex-row items-center gap-x-2 gap-y-4 justify-center min-w-full"
      >
        {ageRange.map((age) => (
          <Text
            onPress={() => setActiveRange(age)}
            key={age}
            className={`font-[abeezee] text-center rounded-full py-2 w-32 text-base ${age === activeRange ? "text-white bg-blue" : "text-text border border-border"}`}
          >
            {age}
          </Text>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
      >
        {data.map((story, index) => (
          <StoryItem
            index={index}
            isPremium={true}
            key={story.id}
            onNavigate={() => {
              setActiveStoryId(story.id);
              navigator.navigate("childStoryDetails", { storyId: story.id });
            }}
            story={story}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StoriesByAgeComponent;

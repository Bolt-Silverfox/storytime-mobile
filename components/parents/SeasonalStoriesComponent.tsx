import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import StoryItem from "./StoryItem";
import useStoryMode from "../../contexts/StoryModeContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";

const SeasonalStoriesComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row max-w-screen-md mx-auto w-full justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Seasonal stories
        </Text>
        <Text
          onPress={() => navigator.navigate("seasonalStories")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>

      <View className="max-w-screen-md mx-auto w-full">
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
                navigator.navigate("childStoryDetails", { storyId: story.id });
                setActiveStoryId(story.id);
              }}
              story={story}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default SeasonalStoriesComponent;

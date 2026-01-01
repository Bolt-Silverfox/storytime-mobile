import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import useStoryMode from "../../contexts/StoryModeContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";
import StoryItem from "./StoryItem";

const FunAndAdventuresComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex max-w-screen-md mx-auto w-full flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Fun and adventures
        </Text>
        <Text
          onPress={() => navigator.navigate("funAndAdventureStories")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>

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

export default FunAndAdventuresComponent;

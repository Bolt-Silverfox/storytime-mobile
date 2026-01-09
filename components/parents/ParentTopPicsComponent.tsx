import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";
import CustomEmptyState from "../emptyState/CustomEmptyState";
import StoryItem from "./StoryItem";

const ParentsTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex max-w-screen-md mx-auto w-full flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Top picks from parents
        </Text>
        <Text
          onPress={() => {
            if (!data.length) return;
            navigator.navigate("parentsTopPicks");
          }}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>

      <View className=" max-w-screen-md mx-auto w-full">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
        >
          {data.length ? (
            data.map((story, index) => (
              <StoryItem
                index={index}
                key={story.id}
                onNavigate={() => {
                  navigator.navigate("childStoryDetails", {
                    storyId: story.id,
                  });
                }}
                story={story}
              />
            ))
          ) : (
            <CustomEmptyState message="No data yet" />
          )}
        </ScrollView>
      </View>
    </View>
  );
};
export default ParentsTopPicksComponent;

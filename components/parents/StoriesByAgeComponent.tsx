import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import useStoryMode from "../../contexts/StoryModeContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { AgeGroupType } from "../../types";
import ErrorComponent from "../ErrorComponent";
import AgeSelectionComponent from "../UI/AgeSelectionComponent";
import StoryItem from "./StoryItem";

const StoriesByAgeComponent = () => {
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-2");
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex max-w-screen-md mx-auto w-full flex-col border-b gap-y-6 border-b-border-light pb-8">
      <AgeSelectionComponent
        selectedAgeGroup={selectedGroup}
        setSelectedAgeGroup={setSelectedGroup}
      />
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
      <Pressable
        onPress={() =>
          navigator.navigate("storiesByAge", { ageGroup: selectedGroup })
        }
        className="border border-border-light bg-white rounded-full px-5 h-10 mx-auto flex justify-center items-center"
      >
        <Text className="text-base font-[abeezee] text-black">
          See all stories Age {selectedGroup}
        </Text>
      </Pressable>
    </View>
  );
};

export default StoriesByAgeComponent;

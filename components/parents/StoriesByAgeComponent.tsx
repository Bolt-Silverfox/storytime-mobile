import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { AgeGroupType } from "../../types";
import ErrorComponent from "../ErrorComponent";
import StoryCarousel from "../StoryCarousel";
import AgeSelectionComponent from "../UI/AgeSelectionComponent";

const StoriesByAgeComponent = () => {
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-3");
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex max-w-screen-md mx-auto w-full flex-col border-b gap-y-6 border-b-border-light pb-8">
      <AgeSelectionComponent
        selectedAgeGroup={selectedGroup}
        setSelectedAgeGroup={setSelectedGroup}
      />
      <StoryCarousel stories={data} />
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

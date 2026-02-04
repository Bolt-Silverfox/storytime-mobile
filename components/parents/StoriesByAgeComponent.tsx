import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import useAuth from "../../contexts/AuthContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { AgeGroupType } from "../../types";
import ErrorComponent from "../ErrorComponent";
import StoryCarousel from "../StoryCarousel";
import AgeSelectionComponent from "../UI/AgeSelectionComponent";

const StoriesByAgeComponent = () => {
  const { user } = useAuth();
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch } = useSuspenseQuery(
    queryRecommendedStories(user?.id!)
  );
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-3");

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 border-b border-b-border-light py-8">
      <AgeSelectionComponent setSelectedCallback={setSelectedGroup} />
      <StoryCarousel stories={data} />
      <Pressable
        onPress={() =>
          navigator.navigate("storiesByAge", { ageGroup: selectedGroup })
        }
        className="mx-auto flex h-10 items-center justify-center rounded-full border border-border-light bg-white px-5"
      >
        <Text className="font-[abeezee] text-base text-black">
          See all stories Age {selectedGroup}
        </Text>
      </Pressable>
    </View>
  );
};

export default StoriesByAgeComponent;

import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { AgeGroupType } from "../../types";
import StoryCarousel from "../StoryCarousel";
import AgeSelectionComponent from "../UI/AgeSelectionComponent";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const StoriesByAgeComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-3");
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({
      minAge: selectedGroup.split("-")[0],
      maxAge: selectedGroup.split("-")[1],
      limit: 10,
    })
  );
  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 border-b border-b-border-light py-8">
        <AgeSelectionComponent
          selectedGroupProp={selectedGroup}
          setSelectedCallback={setSelectedGroup}
        />
        <StoryCarousel stories={data!} />
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
    </HomeScreenCarouselComponent>
  );
};

export default StoriesByAgeComponent;

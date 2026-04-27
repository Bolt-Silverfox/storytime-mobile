import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { AgeGroupType } from "../../types";
import StoryCarousel from "../StoryCarousel";
import AgeSelectionComponent from "../UI/AgeSelectionComponent";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";
import useAuth from "../../contexts/AuthContext";
import ErrorComponent from "../ErrorComponent";

const StoriesByAgeComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("All");
  const { isGuest } = useAuth();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({ ageGroup: selectedGroup, shuffle: true })
  );

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-bgLight px-4">
        <ActivityIndicator size="large" color="#866EFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-bgLight px-4">
        <ErrorComponent message={error.message} refetch={refetch} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="bg-bgLight px-4 py-8">
        <AgeSelectionComponent
          selectedGroupProp={selectedGroup}
          setSelectedCallback={setSelectedGroup}
        />
        <View className="mt-6 items-center justify-center">
          <Text className="mb-4 text-center font-[quilka] text-2xl text-black">
            {isGuest ? "No stories available" : "No stories found"}
          </Text>
          <Text className="mb-6 text-center font-[abeezee] text-text">
            {isGuest
              ? "Sign up to access our full library"
              : "Try a different age group"}
          </Text>
          {!isGuest && (
            <Pressable
              onPress={() =>
                navigator.navigate("storiesByAge", { ageGroup: selectedGroup })
              }
              className="mx-auto h-10 items-center justify-center rounded-full border border-border-light bg-white px-5"
            >
              <Text className="font-[abeezee] text-base text-black">
                {selectedGroup === "All"
                  ? "See all stories"
                  : `See all stories Aged ${selectedGroup}`}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <HomeScreenCarouselComponent
      isPending={false}
      error={error}
      refetch={refetch}
      hasData={!!data}
    >
      <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-6 border-b border-b-border-light py-4 lg:max-w-screen-lg xl:max-w-screen-xl">
        <AgeSelectionComponent
          selectedGroupProp={selectedGroup}
          setSelectedCallback={setSelectedGroup}
        />
        <StoryCarousel stories={data ?? []} />
        <Pressable
          onPress={() =>
            navigator.navigate("storiesByAge", { ageGroup: selectedGroup })
          }
          className="mx-auto flex h-10 items-center justify-center rounded-full border border-border-light bg-white px-5"
        >
          <Text className="font-[abeezee] text-base text-black">
            {selectedGroup === "All"
              ? "See all stories"
              : `See all stories Aged ${selectedGroup}`}
          </Text>
        </Pressable>
      </View>
    </HomeScreenCarouselComponent>
  );
};

export default StoriesByAgeComponent;

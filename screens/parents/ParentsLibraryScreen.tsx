import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import CustomEmptyState from "../../components/emptyState/CustomEmptyState";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import ProgressBar from "../../components/UI/ProgressBar";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import { secondsToMinutes } from "../../utils/utils";

const ParentsLibraryScreen = () => {
  const [storyFilter, setStoryFilter] =
    useState<LibraryFilterType>("ongoing");
  const { data, isPending, error, refetch } = useQuery(
    queryRecommendedStories()
  );
  const protectedNavigator = useNavigation<ProtectedRoutesNavigationProp>();
  if (isPending) return <LoadingOverlay visible />;
  return (
    <View className="flex-1 bg-bgLight flex-col gap-y-8">
      <View className="flex flex-row border-b border-b-border-lighter bg-white py-5 px-4">
        <Text className="flex-1  text-[18px] font-[abeezee]">Library</Text>
      </View>
      <View className="flex flex-row gap-x-2 mx-4 justify-between items-center">
        {libraryFilters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setStoryFilter(filter)}
            className={`${filter === storyFilter ? "bg-blue" : "bg-white border"} h-10 flex justify-center rounded-full items-center flex-1`}
          >
            <Text
              className={`text-base capitalize font-[abeezee] ${filter === storyFilter ? "text-white" : "text-text"}`}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerClassName="flex flex-col gap-y-6 px-4 pb-5">
        {data?.length ? (
          data?.map((story) => (
            <Pressable
              key={story.id}
              onPress={() =>
                protectedNavigator.navigate("stories", {
                  screen: "childStoryDetails",
                  params: { storyId: story.id },
                })
              }
              className="border border-border-light p-1 rounded-xl flex flex-col"
            >
              <Image
                source={{ uri: story.coverImageUrl }}
                className="rounded-xl h-40 mb-3"
              />
              <View className="flex flex-row items-center">
                <View className="flex flex-1 flex-row gap-x-0.5 items-center">
                  <Icon name="Dot" color="#EC0794" />
                  <Text className="text-xs font-[abeezee] text-[#EC0794]">
                    {story.categories.at(0)?.name}
                  </Text>
                </View>
                <View className="flex flex-row gap-x-2 items-center flex-1">
                  <Icon name="Clock" size={12} color="#616161" />
                  <Text className="font-[abeezee] text-text text-xs">
                    {secondsToMinutes(story.durationSeconds)}{" "}
                    {secondsToMinutes(story.durationSeconds) > 1
                      ? "mins"
                      : "min"}
                  </Text>
                </View>
              </View>
              <Text className="my-1.5 text-base text-black font-[abeezee]">
                {story.title}
              </Text>
              <Text className="text-xs mb-4 text-text font-[abeezee]">
                {story.ageMin} - {story.ageMax} years
              </Text>
              <ProgressBar
                currentStep={10}
                totalSteps={40}
                label="Pages"
                height={32}
                backgroundColor="#4807EC"
              />
            </Pressable>
          ))
        ) : (
          <CustomEmptyState
            url={require("../../assets/images/stories-empty-state.png")}
            message={`No ${storyFilter} stories`}
            secondaryMessage={`You do not have any ${storyFilter} stories yet`}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ParentsLibraryScreen;

const libraryFilters = ["ongoing", "completed"] as const;
type LibraryFilterType = (typeof libraryFilters)[number];

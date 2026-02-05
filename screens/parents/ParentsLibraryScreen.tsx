import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import CustomEmptyState from "../../components/emptyState/CustomEmptyState";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import {
  secondsToMinutes,
  splitByWordCountPreservingSentences,
} from "../../utils/utils";
import useGetOngoingStories from "../../hooks/tanstack/queryHooks/useGetOngoingStories";
import ProgressBar from "../../components/parents/ProgressBar";
import queryGetStory from "../../hooks/tanstack/queryHooks/useGetStory";
import useGetCompletedStories from "../../hooks/tanstack/queryHooks/useGetCompletedStories";
import RemoveStoryModal from "../../components/modals/storyModals/RemoveStoryModal";
import Toast from "../../components/UI/Toast";

const ParentsLibraryScreen = () => {
  const [storyFilter, setStoryFilter] = useState<LibraryFilterType>("ongoing");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [selectedStoryTitle, setSelectedStoryTitle] = useState<string>("");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const ongoingQuery = useGetOngoingStories();
  const completedQuery = useGetCompletedStories();

  const data =
    storyFilter === "ongoing" ? ongoingQuery.data : completedQuery.data;

  const isPending = ongoingQuery.isPending || completedQuery.isPending;

  const protectedNavigator = useNavigation<ProtectedRoutesNavigationProp>();
  if (isPending) return <LoadingOverlay visible />;

  const handleRemoveSuccess = (title: string) => {
    setToastMsg(`"${title}" removed from library`);
    setShowToast(true);
  };

  return (
    <View className="flex-1 flex-col gap-y-8 bg-bgLight">
      <View className="flex flex-row border-b border-b-border-lighter bg-white px-4 py-5">
        <Text className="flex-1  font-[abeezee] text-[18px]">Library</Text>
      </View>
      <View className="mx-4 flex flex-row items-center justify-between gap-x-2">
        {libraryFilters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setStoryFilter(filter)}
            className={`${filter === storyFilter ? "bg-blue" : "border bg-white"} flex h-10 flex-1 items-center justify-center rounded-full`}
          >
            <Text
              className={`font-[abeezee] text-base capitalize ${filter === storyFilter ? "text-white" : "text-text"}`}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerClassName="flex flex-col gap-y-6 px-4 pb-5">
        {data?.length ? (
          data?.map((story) => {
            const paragraphs = splitByWordCountPreservingSentences(
              story.textContent,
              30
            );

            const totalSteps = paragraphs.length;
            const progressRatio =
              totalSteps > 0 ? story.progress / totalSteps : 0;
            const storyDuration = secondsToMinutes(story.durationSeconds);
            return (
              <Pressable
                key={story.id}
                onPress={() =>
                  protectedNavigator.navigate("stories", {
                    screen: "childStoryDetails",
                    params: { storyId: story.id },
                  })
                }
                className="flex flex-col rounded-xl border border-border-light p-1"
              >
                <Image
                  source={{ uri: story.coverImageUrl }}
                  className="mb-3 h-40 rounded-xl"
                />
                <View className="p-2">
                  <View className="flex flex-row items-center">
                    <View className="flex flex-1 flex-row items-center gap-x-px">
                      <Icon name="Dot" color="#EC0794" />
                      <StoryCategory storyId={story.id} />
                    </View>
                    <View className="flex flex-1 flex-row items-center gap-x-2">
                      <Icon name="Clock" size={12} color="#616161" />
                      <Text className="font-[abeezee] text-xs text-text">
                        {storyDuration > 0 ? storyDuration : "<1"}{" "}
                        {storyDuration > 1 ? "mins" : "min"}
                      </Text>
                    </View>
                  </View>
                  <Text className="my-1.5 font-[abeezee] text-base text-black">
                    {story.title}
                  </Text>
                  <Text className="mb-4 font-[abeezee] text-xs text-text">
                    {story.ageMin} - {story.ageMax} years
                  </Text>
                  <View className="flex-row items-center gap-6">
                    <View className="flex-1">
                      <ProgressBar progress={progressRatio} color="#4807EC" />
                    </View>

                    <Pressable
                      onPress={() => {
                        setRemoveId(story.id);
                        setSelectedStoryTitle(story.title);
                      }}
                      className="rounded-full bg-[#EC0707] p-2"
                    >
                      <Icon name="Trash" color="#fff" size={24} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          })
        ) : (
          <CustomEmptyState
            url={require("../../assets/images/stories-empty-state.png")}
            message={`No ${storyFilter} stories`}
            secondaryMessage={`You do not have any ${storyFilter} stories yet`}
          />
        )}
      </ScrollView>
      {removeId && (
        <RemoveStoryModal
          isOpen={!!removeId}
          storyId={removeId}
          onClose={() => setRemoveId(null)}
          storyTitle={selectedStoryTitle}
          onRemoveSuccess={handleRemoveSuccess}
        />
      )}
      <Toast
        visible={showToast}
        message={toastMsg}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
};

export default ParentsLibraryScreen;

const libraryFilters = ["ongoing", "completed"] as const;
type LibraryFilterType = (typeof libraryFilters)[number];

const StoryCategory = ({ storyId }: { storyId: string }) => {
  const { data } = useQuery(queryGetStory(storyId));

  if (!data?.categories?.length) return null;

  return (
    <Text className="font-[abeezee] text-xs text-[#EC0794]">
      {data.categories[0].name}
    </Text>
  );
};

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
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";

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
    console.log("SHOW TOAST", title);
    setToastMsg(`"${title}" removed from library`);
    setShowToast(true);
  };

  return (
    <SafeAreaWrapper variant="solid">
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
            data?.map((story) => {
              const paragraphs = splitByWordCountPreservingSentences(
                story.textContent,
                30,
              );

              const totalSteps = paragraphs.length;
              const progressRatio =
                totalSteps > 0 ? story.progress / totalSteps : 0;

              return (
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
                  <View className="p-2">
                    <View className="flex flex-row items-center">
                      <View className="flex flex-1 flex-row gap-x-px items-center">
                        <Icon name="Dot" color="#EC0794" />
                        <StoryCategory storyId={story.id} />
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
                    <View className="flex-row items-center gap-6">
                      <View className="flex-1">
                        <ProgressBar progress={progressRatio} color="#4807EC" />
                      </View>

                      <Pressable
                        onPress={() => {
                          setRemoveId(story.id);
                          setSelectedStoryTitle(story.title);
                        }}
                        className="p-2 bg-[#EC0707] rounded-full"
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
    </SafeAreaWrapper>
  );
};

export default ParentsLibraryScreen;

const libraryFilters = ["ongoing", "completed"] as const;
type LibraryFilterType = (typeof libraryFilters)[number];

const StoryCategory = ({ storyId }: { storyId: string }) => {
  const { data } = useQuery(queryGetStory(storyId));

  if (!data?.categories?.length) return null;

  return (
    <Text className="text-xs font-[abeezee] text-[#EC0794]">
      {data.categories[0].name}
    </Text>
  );
};

import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../Navigation/ParentHomeNavigator";
import useStoryMode from "../contexts/StoryModeContext";
import queryGetKidsStories from "../hooks/tanstack/queryHooks/useGetKidsStories";
import { ChildStoryStatus } from "../types";
import ErrorComponent from "./ErrorComponent";
import Icon from "./Icon";
import ProgressBar from "./UI/ProgressBar";

const TrackChildStoryComponent = ({
  category,
  childId,
}: {
  category: ChildStoryStatus;
  childId: string;
}) => {
  const { data, error, refetch } = useSuspenseQuery(
    queryGetKidsStories(childId, category)
  );
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  console.log("child id", childId);
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  if (!data.length) return <EmptyState category={category} />;

  return (
    <ScrollView
      className="mx-4"
      contentContainerClassName="flex bg-white border border-border-lighter p-4 gap-y-6 rounded-2xl flex-col"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 flex flex-col gap-y-6">
        {data.map((story) => (
          <Pressable
            onPress={() => {
              setActiveStoryId(story.id);
              navigator.navigate("childStoryDetails", { storyId: story.id });
            }}
            key={story.id}
            className="flex bg-white flex-col p-2 border border-border-light rounded-xl gap-2"
          >
            <Image
              source={{ uri: story.coverImageUrl }}
              className="h-[150px] bg-cover w-full rounded-xl"
            />
            <View className="flex px-0.5 flex-row justify-between items-center">
              <View className="flex flex-1 flex-row items-center">
                <Icon name="Dot" color={"#EC0794"} />
                <Text
                  className="font-[abeezee] text-wrap flex-1 capitalize text-xs"
                  style={{
                    color: "#EC0794",
                  }}
                >
                  {story.categories[0].name}
                </Text>
              </View>
              <View className="flex flex-row gap-x-2 items-center">
                <Icon size={12} name="Clock" color="#616161" />
                <Text className="font-[abeezee] text-text capitalize text-xs">
                  {32} mins
                </Text>
              </View>
            </View>
            <View className="flex flex-col gap-y-1.5">
              <Text className="font-[abeezee] text-xl text-black">
                {story.title}
              </Text>
              <Text className="font-[abeezee] text-sm text-text">
                {story.ageMin} - {story.ageMax} years
              </Text>
            </View>
            <ProgressBar
              currentStep={10}
              totalSteps={20}
              height={25}
              backgroundColor="#4807EC"
              label="Page"
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default TrackChildStoryComponent;

const EmptyState = ({ category }: { category: string }) => {
  return (
    <View className="flex flex-1 flex-col gap-y-4 mt-7 items-center">
      <Image
        source={require("../assets/images/stories-empty-state.png")}
        className="size-[156px]"
      />
      <Text className="font-[abeezee] text-xl text-black">
        No {category} stories
      </Text>
      <Text className="font-[abeezee] text-sm text-text">
        You do not have any {category} stories yet.
      </Text>
    </View>
  );
};

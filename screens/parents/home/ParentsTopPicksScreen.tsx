import { ImageBackground, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import useStoryMode from "../../../contexts/StoryModeContext";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import CustomButton from "../../../components/UI/CustomButton";
import PageTitle from "../../../components/PageTitle";
import StoryItem from "../../../components/parents/StoryItem";

const ParentsTopPicksScreen = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories()
  );

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!data.length) {
    return (
      <View className="flex-1 flex flex-col gap-y-3 bg-bgLight justify-center items-center">
        <Text className="text-xl font-[abeezee] text-black">
          No stories in this category yet
        </Text>
        <CustomButton text="Go Back" onPress={() => navigator.goBack()} />
      </View>
    );
  }

  return (
    <View className="flex flex-1 bg-bgLight">
      <PageTitle
        title="Parents top recommendations"
        goBack={() => navigator.goBack()}
      />
      <ScrollView
        contentContainerClassName="flex min-h-full bg-bgLight flex-col"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: data[0].coverImageUrl }}
          resizeMode="cover"
          className="px-4 h-[50vh] w-full flex flex-col justify-end pb-8 max-h-[500px]"
        >
          <View className="flex flex-col gap-y-1.5">
            <Text className="font-[quilka] text-3xl capitalize text-white">
              Top recommended stories by other parents
            </Text>
            <Text className="font-[abeezee] text-base text-white">
              Read great and popular stories.
            </Text>
          </View>
        </ImageBackground>
        <View className="flex flex-row flex-wrap py-6 bg-white gap-x-3 gap-y-6 -mt-4 rounded-t-3xl justify-center">
          {data.map((story, index) => (
            <StoryItem
              index={index}
              key={story.id}
              onNavigate={() => {
                setActiveStoryId(story.id);
                navigator.navigate("childStoryDetails", { storyId: story.id });
              }}
              story={story}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ParentsTopPicksScreen;

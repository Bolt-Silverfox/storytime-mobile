import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import StoryItem from "../../../components/parents/StoryItem";
import useStoryMode from "../../../contexts/StoryModeContext";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const StoriesByAgeScreen = () => {
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
      <PageTitle title="Stories by age" goBack={() => navigator.goBack()} />
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
              Stories by age
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

export default StoriesByAgeScreen;

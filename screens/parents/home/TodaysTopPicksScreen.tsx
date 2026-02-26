import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import CustomButton from "../../../components/UI/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import queryGetStories from "../../../hooks/tanstack/queryHooks/queryGetStories";
import useRefreshControl from "../../../hooks/others/useRefreshControl";
import StoryItem from "../../../components/parents/StoryItem";
import Icon from "../../../components/Icon";
import { CustomImageBackground } from "../../../components/UI/CustomImage";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import StoryCarouselSkeleton from "../../../components/skeletons/StoryCarouselSkeleton";
import ErrorComponent from "../../../components/ErrorComponent";

const TodaysTopPicksScreen = () => {
  const navigator = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    data: stories,
    isPending,
    error,
    refetch,
  } = useQuery(queryGetStories({ topPicksFromUs: true }));
  const { refreshing, onRefresh } = useRefreshControl(refetch);

  return (
    <SafeAreaWrapper variant="transparent">
      <View className="flex flex-1 bg-bgLight">
        <CustomImageBackground
          source={{
            uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__4_1_wx1rwq.jpg",
          }}
          className="flex h-[30vh] max-h-[500px] w-full flex-col justify-end px-4 pb-8"
        >
          <Pressable
            onPress={() => navigator.canGoBack() && navigator.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-black/30"
            style={{ top: insets.top + 8 }}
          >
            <Icon name="ChevronLeft" color="white" />
          </Pressable>
          <View className="flex flex-col gap-y-1.5">
            <Text className="font-[quilka] text-3xl capitalize text-white">
              Top picks from us
            </Text>
            <Text className="font-[abeezee] text-base text-white">
              These are the top picks for today
            </Text>
          </View>
        </CustomImageBackground>

        {isPending ? (
          <StoryCarouselSkeleton variant="vertical" />
        ) : error ? (
          <ErrorComponent message={error.message} refetch={refetch} />
        ) : !stories?.length ? (
          <View className="flex flex-1 flex-col items-center justify-center gap-y-3 bg-bgLight px-5">
            <Text className="font-[abeezee] text-xl text-black">
              No top picks from us yet
            </Text>
            <CustomButton
              text="Go Back"
              onPress={() => navigator.canGoBack() && navigator.goBack()}
            />
          </View>
        ) : (
          <ScrollView
            className="-mt-4 rounded-t-3xl bg-white pt-5"
            contentContainerClassName="flex flex-row flex-wrap gap-x-3 gap-y-6 px-4 py-6 pb-5"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {stories.map((story) => (
              <StoryItem key={story.id} story={story} isGrouped />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default TodaysTopPicksScreen;

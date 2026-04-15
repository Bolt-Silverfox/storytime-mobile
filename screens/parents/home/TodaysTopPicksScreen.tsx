import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Pressable, RefreshControl, Text, View } from "react-native";
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
import {
  AdaptiveFlashList,
  adaptiveColumnItemStyle,
} from "../../../components/UI/AdaptiveFlashList";

/**
 * Key extractor function for Story items in the FlatList
 */
const storyKeyExtractor = (item: { id: string }) => item.id;

/**
 * Screen component displaying today's top story picks in a responsive grid layout.
 *
 * Shows a featured header image with navigation back button, and displays stories
 * in an adaptive grid (2-4 columns based on screen width) with pull-to-refresh.
 *
 * @returns The Today's Top Picks screen UI
 */
const TodaysTopPicksScreen = () => {
  const navigator = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    data: stories,
    isPending,
    error,
    refetch,
  } = useQuery(queryGetStories({ topPicksFromUs: true, shuffle: true }));
  const { refreshing, onRefresh } = useRefreshControl(refetch);

  const renderStoryItem = ({
    item: story,
  }: {
    item: NonNullable<typeof stories>[number];
  }) => (
    <View style={adaptiveColumnItemStyle}>
      <StoryItem story={story} isGrouped />
    </View>
  );

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
        ) : error && !stories ? (
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
          <AdaptiveFlashList
            data={stories}
            keyExtractor={storyKeyExtractor}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={renderStoryItem}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default TodaysTopPicksScreen;

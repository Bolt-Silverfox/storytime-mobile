import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Text, View } from "react-native";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import { extractStoryId } from "../../../constants";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import {
  StoryNavigatorParamList,
  StoryNavigatorProp,
} from "../../../Navigation/StoryNavigator";

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "storyDeepLink">;

const StoryDeepLinkScreen = () => {
  const navigator = useNavigation<StoryNavigatorProp>();
  const { params } = useRoute<RoutePropTypes>();
  // Universal links arrive as `<slug>-<uuid>`; the API needs the bare UUID.
  const storyId = extractStoryId(params.storyId);
  const { data, isPending, error, refetch } = useQuery(
    useGetStory(storyId, { consumeGuestAccess: false })
  );

  useEffect(() => {
    if (!data) return;
    navigator.replace("childStoryDetails", {
      story: {
        id: data.id,
        title: data.title,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        durationSeconds: data.durationSeconds,
        categories: data.categories,
        createdAt: data.createdAt,
        isInteractive: data.isInteractive,
        questions: data.questions,
      },
    });
  }, [data, navigator]);

  if (isPending) return <LoadingOverlay visible />;
  if (error) {
    return (
      <SafeAreaWrapper variant="solid">
        <ErrorComponent message={error.message} refetch={refetch} />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 items-center justify-center">
        <Text className="font-[abeezee] text-base text-text">
          Loading story...
        </Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default StoryDeepLinkScreen;

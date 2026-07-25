import Feather from "@expo/vector-icons/Feather";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import CustomButton from "../../../components/UI/CustomButton";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useCancelStoryJob from "../../../hooks/tanstack/mutationHooks/useCancelStoryJob";
import useStoryJobResult from "../../../hooks/tanstack/queryHooks/useStoryJobResult";
import useStoryJobStatus from "../../../hooks/tanstack/queryHooks/useStoryJobStatus";
import useStoryJobSSE from "../../../hooks/useStoryJobSSE";
import {
  StoryNavigatorParamList,
  StoryNavigatorProp,
} from "../../../Navigation/StoryNavigator";

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "generationProgress">;

const clampProgress = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const GenerationProgressScreen = () => {
  const navigation = useNavigation<StoryNavigatorProp>();
  const { params } = useRoute<RoutePropTypes>();
  const { jobId, estimatedWaitTime } = params;

  const sse = useStoryJobSSE(jobId);
  const { mutate: cancelJob, isPending: isCancelling } = useCancelStoryJob();

  const [resolvedStoryId, setResolvedStoryId] = useState<string | null>(null);
  const navigatedRef = useRef(false);

  // Fall back to polling the status endpoint only once the SSE stream errors.
  const pollingEnabled = sse.sseFailed && !resolvedStoryId;
  const { data: status } = useStoryJobStatus(jobId, pollingEnabled);

  // When the poll fallback reports "completed" but we never got a storyId from
  // the SSE `completed` event, fetch the result endpoint to finalize.
  const pollCompleted = status?.status === "completed";
  const needResult = pollCompleted && !resolvedStoryId;
  const { data: result } = useStoryJobResult(jobId, needResult);

  // Surface a storyId from whichever source resolves first.
  useEffect(() => {
    if (sse.storyId) setResolvedStoryId(sse.storyId);
  }, [sse.storyId]);

  useEffect(() => {
    if (result?.storyId) setResolvedStoryId(result.storyId);
  }, [result?.storyId]);

  // Auto-navigate to the reader once the new story is ready.
  useEffect(() => {
    if (resolvedStoryId && !navigatedRef.current) {
      navigatedRef.current = true;
      navigation.replace("readStory", {
        storyId: resolvedStoryId,
        mode: "plain",
      });
    }
  }, [resolvedStoryId, navigation]);

  const failed =
    sse.status === "failed" ||
    status?.status === "failed" ||
    status?.status === "cancelled";

  const errorMessage =
    sse.error ??
    status?.error ??
    "Something went wrong while creating your story.";

  // Prefer live SSE values; fall back to the polled status once SSE has failed.
  const progress = clampProgress(
    sse.sseFailed ? (status?.progress ?? 0) : sse.progress
  );
  const progressMessage = sse.sseFailed
    ? status?.progressMessage
    : sse.progressMessage;

  const handleCancel = () => {
    cancelJob(jobId, {
      onSettled: () => {
        if (!navigatedRef.current) {
          navigatedRef.current = true;
          navigation.goBack();
        }
      },
    });
  };

  const handleRetry = () => {
    if (!navigatedRef.current) navigation.goBack();
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 items-center justify-center gap-y-8 bg-bgLight px-6">
        {failed ? (
          <>
            <View className="size-20 items-center justify-center rounded-full bg-red-100">
              <Feather name="alert-triangle" size={40} color="#dc2626" />
            </View>
            <View className="gap-y-2">
              <Text className="text-center font-[quilka] text-2xl text-black">
                Story creation failed
              </Text>
              <Text className="text-center font-[abeezee] text-base text-text">
                {errorMessage}
              </Text>
            </View>
            <View className="w-full">
              <CustomButton
                text="Try Again"
                onPress={handleRetry}
                ariaLabel="Try creating the story again"
              />
            </View>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#EC4007" />
            <View className="gap-y-2">
              <Text className="text-center font-[quilka] text-2xl text-black">
                Creating your story…
              </Text>
              <Text className="text-center font-[abeezee] text-base text-text">
                {progressMessage ??
                  "Our AI is busy writing something magical. This can take a little while."}
              </Text>
            </View>

            {/* Progress bar */}
            <View className="w-full gap-y-2">
              <View className="h-3 w-full overflow-hidden rounded-full bg-primary-light">
                <View
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="font-[abeezee] text-xs text-text">
                  Progress
                </Text>
                <Text className="font-[abeezee] text-xs text-text">
                  {progress}%
                </Text>
              </View>
            </View>

            {typeof estimatedWaitTime === "number" && estimatedWaitTime > 0 && (
              <Text className="text-center font-[abeezee] text-xs text-text">
                Estimated wait: about {Math.ceil(estimatedWaitTime / 1000)}s
              </Text>
            )}

            <View className="w-full">
              {isCancelling ? (
                <View className="mx-5 mt-4 h-[46px] w-full flex-row items-center justify-center self-center rounded-full border border-border">
                  <ActivityIndicator color="#212121" />
                </View>
              ) : (
                <CustomButton
                  text="Cancel"
                  onPress={handleCancel}
                  transparent
                  ariaLabel="Cancel story generation"
                />
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default GenerationProgressScreen;

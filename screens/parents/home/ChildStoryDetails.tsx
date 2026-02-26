import Entypo from "@expo/vector-icons/Entypo";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon from "../../../components/Icon";
import AboutStoryModesModal from "../../../components/modals/AboutStoryModesModal";
import ShareStoryModal from "../../../components/modals/ShareStoryModal";
import SubscriptionModal from "../../../components/modals/SubscriptionModal";
import StoryDetailsCTA from "../../../components/StoryDetailsCTA";
import CustomButton from "../../../components/UI/CustomButton";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useGetStoryProgress from "../../../hooks/tanstack/queryHooks/useGetStoryProgress";
import useGetStoryQuota from "../../../hooks/tanstack/queryHooks/useGetStoryQuota";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";
import {
  StoryNavigatorParamList,
  StoryNavigatorProp,
} from "../../../Navigation/StoryNavigator";
import { secondsToMinutes } from "../../../utils/utils";

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "childStoryDetails">;

const ChildStoryDetails = () => {
  const navigator = useNavigation<StoryNavigatorProp>();
  const { params } = useRoute<RoutePropTypes>();
  const {
    ageMax,
    ageMin,
    durationSeconds,
    categories,
    title,
    description,
    coverImageUrl,
    id,
    createdAt,
  } = params.story;
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const { data: user } = useGetUserProfile();
  const isPremium =
    user?.subscriptionStatus === "active" || user?.role === "admin";
  const { data: quota, isFetching: isQuotaFetching } = useGetStoryQuota();
  const { data: storyProgress } = useGetStoryProgress(id);
  const alreadyRead = !!storyProgress;
  const hasReachedLimit =
    !isPremium && !alreadyRead && !isQuotaFetching && (quota?.remaining ?? 0) === 0;

  const duration = secondsToMinutes(durationSeconds);
  return (
    <SafeAreaWrapper variant="transparent">
      <View className="relative flex flex-1 bg-bgLight pb-5">
        <ScrollView contentContainerClassName="flex pb-10 bg-bgLight flex-col">
          <ImageBackground
            source={{ uri: coverImageUrl }}
            resizeMode="cover"
            className="relative flex h-[50vh] max-h-[500px] flex-col justify-end px-4 pb-8"
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => navigator.goBack()}
              className="absolute  left-4 top-10 flex size-10 items-center justify-center rounded-full bg-primary"
            >
              <Entypo name="chevron-thin-left" size={24} color="white" />
            </Pressable>
            <View className="flex flex-row justify-around gap-3 rounded-2xl bg-purple p-5">
              <View className="flex flex-col gap-y-2">
                <Text className="text-center font-[quilka] text-sm text-white">
                  Age range
                </Text>
                <Text className="text-center font-[abeezee] text-xs text-purple-light">
                  {ageMin} - {ageMax} Years
                </Text>
              </View>
              <View className="flex flex-col gap-y-2">
                <Text className="text-center font-[quilka] text-sm text-white">
                  Duration
                </Text>
                <Text className="text-center font-[abeezee] text-xs text-purple-light">
                  {duration > 0 ? duration : "<1"}
                  {duration > 1 ? " mins" : " min"}
                </Text>
              </View>
              <View className="flex flex-col gap-y-2">
                <Text className="text-center font-[quilka] text-sm text-white">
                  Category
                </Text>
                <Text className="text-center font-[abeezee] text-xs capitalize text-purple-light">
                  {categories?.[0]?.name ?? "Uncategorized"}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <View className="-mt-4 flex flex-col rounded-t-3xl bg-white px-4 py-6">
            <View className="flex flex-col gap-y-3 border-b border-b-border-light pb-6">
              <Text
                accessibilityLabel="story title"
                className="font-[quilka] text-3xl text-black"
              >
                {title}{" "}
              </Text>
              <Text
                accessibilityLabel="story description"
                className="font-[abeezee] text-base text-text"
              >
                {description}
              </Text>
            </View>
            <View className="flex flex-col gap-y-6 border-b border-border-light py-6">
              <View className="flex flex-row items-center justify-between">
                <Text className="font-[abeezee] text-sm text-black">
                  Select preferred story mode
                </Text>
                <Icon
                  onPress={() => setShowAboutModal(true)}
                  name="CircleQuestionMark"
                  size={18}
                />
              </View>
              <View className="flex flex-row gap-x-2">
                <View className="flex-1 rounded-lg border border-primary/20 bg-primary p-3">
                  <Text className="font-[quilka] text-sm text-white">
                    Plain story mode
                  </Text>
                  <Text className="text-wrap font-[abeezee] text-sm text-[#FED0C1]">
                    Enjoy storytelling without stress.
                  </Text>
                </View>
                <View className="flex-1 rounded-lg border border-border-light bg-white/60 p-3 opacity-60">
                  <View className="mb-1 flex h-6 items-center justify-center self-start rounded-full bg-[#E0F2FE] px-2">
                    <Text className="font-[abeezee] text-xs text-[#0369A1]">
                      Coming Soon
                    </Text>
                  </View>
                  <Text className="font-[quilka] text-sm text-black">
                    Interactive story mode
                  </Text>
                  <Text className="text-wrap font-[abeezee] text-sm text-text">
                    Listen, enjoy and answer questions to the stories.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <StoryDetailsCTA
            setShowShareModal={setShowShareModal}
            story={{
              ageRange: `${ageMin}-${ageMax}`,
              id,
              title,
              description,
              coverImageUrl,
              createdAt,
              durationSeconds,
              categories,
              storyId: id,
            }}
          />
        </ScrollView>
        <View className="border-t border-t-border-light bg-bgLight px-4">
          {!isPremium && quota && !hasReachedLimit && (
            <Text className="py-2 text-center font-[abeezee] text-xs text-text">
              {quota.remaining} {quota.remaining === 1 ? "story" : "stories"}{" "}
              remaining
            </Text>
          )}
          {hasReachedLimit ? (
            <CustomButton
              onPress={() => setIsSubscriptionModalOpen(true)}
              text="Subscribe to Read"
              ariaLabel="Subscribe to read more stories"
            />
          ) : (
            <CustomButton
              onPress={() =>
                navigator.navigate("readStory", {
                  storyId: id,
                  mode: "plain",
                  page: params.page,
                })
              }
              text="Start Reading"
              ariaLabel="Start reading this story"
            />
          )}
        </View>
        <AboutStoryModesModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />
        <ShareStoryModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          storyId={id}
          storyTitle={title}
        />
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default ChildStoryDetails;

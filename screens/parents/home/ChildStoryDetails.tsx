import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ErrorComponent from "../../../components/ErrorComponent";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import AboutStoryModesModal from "../../../components/modals/AboutStoryModesModal";
import ShareStoryModal from "../../../components/modals/ShareStoryModal";
import StoryDetailsCTA from "../../../components/StoryDetailsCTA";
import CustomButton from "../../../components/UI/CustomButton";
import queryGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import {
  StoryNavigatorParamList,
  StoryNavigatorProp,
} from "../../../Navigation/StoryNavigator";
import { StoryModes } from "../../../types";
import { secondsToMinutes } from "../../../utils/utils";
import SubscriptionModal from "../../../components/modals/SubscriptionModal";
import Entypo from "@expo/vector-icons/Entypo";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "childStoryDetails">;

const ChildStoryDetails = () => {
  const navigator = useNavigation<StoryNavigatorProp>();
  const { params } = useRoute<RoutePropTypes>();
  const [storyMode, setStoryMode] = useState<StoryModes>("plain");
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const { isPending, data, error, refetch } = useQuery(
    queryGetStory(params.storyId)
  );
  const { data: user } = useGetUserProfile();
  const isPremium =
    user?.subscriptionStatus === "active" || user?.role === "admin";
  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  const handleStoryMode = (storyMode: StoryModes) => {
    if (storyMode === "interactive") {
      isPremium
        ? setStoryMode("interactive")
        : setIsSubscriptionModalOpen(true);
      return;
    }
    setStoryMode("plain");
  };

  const duration = secondsToMinutes(data.durationSeconds);
  return (
    <SafeAreaWrapper variant="transparent">
      <View className="relative flex flex-1 bg-bgLight pb-5">
        <ScrollView contentContainerClassName="flex pb-10 bg-bgLight flex-col">
          <ImageBackground
            source={{ uri: data.coverImageUrl }}
            resizeMode="cover"
            className="relative flex h-[50vh] max-h-[500px] flex-col justify-end px-4 pb-8"
          >
            <Pressable
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
                  {data.ageMin} - {data.ageMax} Years
                </Text>
              </View>
              <View className="flex flex-col gap-y-2">
                <Text className="text-center font-[quilka] text-sm text-white">
                  Duration
                </Text>
                <Text className="text-center font-[abeezee] text-xs text-purple-light">
                  {duration} {duration > 1 ? "mins" : "min"}
                </Text>
              </View>
              <View className="flex flex-col gap-y-2">
                <Text className="text-center font-[quilka] text-sm text-white">
                  Category
                </Text>
                <Text className="text-center font-[abeezee] text-xs capitalize text-purple-light">
                  {data.categories?.[0]?.name ?? "Uncategorized"}
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
                {data.title}{" "}
              </Text>
              <Text
                accessibilityLabel="story description"
                className="font-[abeezee] text-base text-text"
              >
                {data.description}
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
                <Pressable
                  onPress={() => handleStoryMode("plain")}
                  className={`flex-1 rounded-lg border p-3 ${storyMode === "plain" ? "border-primary/20 bg-primary" : "border-border-light bg-white"}`}
                >
                  <Text
                    className={`font-[quilka] text-sm ${storyMode === "plain" ? "text-white" : "text-black"}`}
                  >
                    Plain story mode
                  </Text>
                  <Text
                    className={`text-wrap font-[abeezee] text-sm ${
                      storyMode === "plain" ? "text-[#FED0C1]" : "text-text"
                    }`}
                  >
                    Enjoy storytelling without stress.
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleStoryMode("interactive");
                  }}
                  className={`flex-1 rounded-lg border p-3 ${storyMode === "interactive" ? "border-primary/20 bg-primary" : "border-border-light bg-white"}`}
                >
                  <Text
                    className={`font-[quilka] text-sm ${storyMode === "interactive" ? "text-white" : "text-black"}`}
                  >
                    Interactive story mode
                  </Text>
                  <Text
                    className={`text-wrap font-[abeezee] text-sm ${
                      storyMode === "interactive"
                        ? "text-[#FED0C1]"
                        : "text-text"
                    }`}
                  >
                    Listen, enjoy and answer questions to the stories.
                  </Text>
                  {!isPremium && (
                    <View className="flex h-6 items-center justify-center self-end rounded-full bg-[#FFF8D2] px-2">
                      <Text className="font-[abeezee] text-xs text-black">
                        Premium
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
          <StoryDetailsCTA setShowShareModal={setShowShareModal} story={data} />
        </ScrollView>
        <View className="border-t border-t-border-light bg-bgLight px-4">
          <CustomButton
            onPress={() =>
              navigator.navigate("readStory", {
                storyId: params.storyId,
                mode: storyMode,
              })
            }
            text="Start Reading"
            disabled={!storyMode}
          />
        </View>
        <AboutStoryModesModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />
        <ShareStoryModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
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

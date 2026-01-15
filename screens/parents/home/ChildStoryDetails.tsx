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
  const isPremium = false;

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
    <View className="flex flex-1 pb-5 bg-bgLight">
      <ScrollView contentContainerClassName="flex min-h-full pb-10 bg-bgLight flex-col">
        <ImageBackground
          source={{ uri: data.coverImageUrl }}
          resizeMode="cover"
          className="px-4 h-[50vh] flex flex-col justify-end pb-8 max-h-[500px]"
        >
          <View className="bg-purple flex flex-row p-5 rounded-2xl gap-3 justify-around">
            <View className="flex flex-col gap-y-2">
              <Text className="font-[quilka] text-sm text-white text-center">
                Age range
              </Text>
              <Text className="font-[abeezee] text-xs text-purple-light text-center">
                {data.ageMin} - {data.ageMax} Years
              </Text>
            </View>
            <View className="flex flex-col gap-y-2">
              <Text className="font-[quilka] text-sm text-white text-center">
                Duration
              </Text>
              <Text className="font-[abeezee] text-xs text-purple-light text-center">
                {duration} {duration > 1 ? "mins" : "min"}
              </Text>
            </View>
            <View className="flex flex-col gap-y-2">
              <Text className="font-[quilka] text-sm text-white text-center">
                Category
              </Text>
              <Text className="font-[abeezee] capitalize text-xs text-purple-light text-center">
                {data.categories[0].name}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View className="flex flex-col -mt-4 py-6 px-4 bg-white rounded-t-3xl">
          <View className="flex flex-col gap-y-3 border-b pb-6 border-b-border-light">
            <Text
              aria-labelledby="story title"
              className="font-[quilka] text-3xl text-black"
            >
              {data.title}{" "}
            </Text>
            <Text
              aria-labelledby="story description"
              className="text-text font-[abeezee] text-base"
            >
              {data.description}
            </Text>
          </View>
          <View className="flex flex-col gap-y-6 py-6 border-b border-border-light">
            <View className="flex flex-row justify-between items-center">
              <Text className="font-[abeezee] text-black text-sm">
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
                className={`border flex-1 p-3 rounded-lg ${storyMode === "plain" ? "bg-primary border-primary/20" : "bg-white border-border-light"}`}
              >
                <Text
                  className={`font-[quilka] text-sm ${storyMode === "plain" ? "text-white" : "text-black"}`}
                >
                  Plain story mode
                </Text>
                <Text
                  className={`font-[abeezee] text-wrap text-sm ${
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
                className={`border flex-1 p-3 rounded-lg ${storyMode === "interactive" ? "bg-primary border-primary/20" : "bg-white border-border-light"}`}
              >
                <Text
                  className={`font-[quilka] text-sm ${storyMode === "interactive" ? "text-white" : "text-black"}`}
                >
                  Interactive story mode
                </Text>
                <Text
                  className={`font-[abeezee] text-wrap text-sm ${
                    storyMode === "interactive" ? "text-[#FED0C1]" : "text-text"
                  }`}
                >
                  Listen, enjoy and answer questions to the stories.
                </Text>
                {!isPremium && (
                  <View className="bg-[#FFF8D2] self-end rounded-full h-6 flex justify-center items-center px-2">
                    <Text className="font-[abeezee] text-black text-xs">
                      Premium
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </View>
        <StoryDetailsCTA setShowShareModal={setShowAboutModal} story={data} />
      </ScrollView>
      <View className="border-t px-4 bg-bgLight border-t-border-light">
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
  );
};

export default ChildStoryDetails;

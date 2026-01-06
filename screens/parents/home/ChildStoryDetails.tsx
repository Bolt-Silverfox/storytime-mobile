import { useNavigation } from "@react-navigation/native";
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
import RecommendStoryModal from "../../../components/modals/storyModals/RecommendStoryModal";
import CustomButton from "../../../components/UI/CustomButton";
import useStoryMode from "../../../contexts/StoryModeContext";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import { useQuery } from "@tanstack/react-query";
import { queryGetStory } from "../../../hooks/tanstack/queryHooks/useGetStory";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";

const ChildStoryDetails = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const { storyMode, setStoryMode, activeStoryId } = useStoryMode();
  const { isPending, data, error, refetch } = useQuery(
    queryGetStory(activeStoryId!)
  );
  const onNavigate = () => {
    if (storyMode === "plain") {
      navigator.navigate("newPlainStoryMode", { storyId: activeStoryId! });
      return;
    }
    navigator.navigate("newInteractiveStoryMode", { storyId: activeStoryId! });
  };

  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
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
                32 mins
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
                onPress={() => setStoryMode("plain")}
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
                onPress={() => setStoryMode("interactive")}
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
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex px-4 flex-row gap-x-3">
          <Pressable
            onPress={() => setShowShareModal(true)}
            className="rounded-full border flex-1 border-border-light flex justify-center flex-row gap-x-1.5 items-center h-11"
          >
            <Icon name="Share2" />
            <Text className="font-[abeezee] text-base text-black">Share</Text>
          </Pressable>
          <Pressable className="rounded-full border flex-1 border-border-light flex justify-center flex-row gap-x-1.5 items-center h-11">
            <Icon name="Heart" />
            <Text className="font-[abeezee] text-base text-black">
              Favourite
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowRecommendationModal(true)}
            className="rounded-full border flex-1 border-border-light flex justify-center flex-row gap-x-1.5 items-center h-11"
          >
            <Icon name="HandHeart" />
            <Text className="font-[abeezee] text-base text-black">
              Recommend
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <View className="border-t px-4 bg-bgLight border-t-border-light">
        <CustomButton
          onPress={onNavigate}
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
      <RecommendStoryModal
        isOpen={showRecommendationModal}
        onClose={() => setShowRecommendationModal(false)}
      />
    </View>
  );
};

export default ChildStoryDetails;

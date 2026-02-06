import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { AgeGroupType, Story } from "../types";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import AgeSelectionComponent from "./UI/AgeSelectionComponent";
import CustomButton from "./UI/CustomButton";
import StoryItem from "./parents/StoryItem";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";

type PropTypes = {
  stories: Story[] | undefined;
  error: Error | null;
  imageSource?: ImageSourcePropType;
  title: string;
  description: string;
  isPending: boolean;
  refetch: () => void;
  showAges?: boolean;
};

const GroupedStoriesContainer = ({
  stories,
  error,
  imageSource,
  title,
  description,
  isPending,
  refetch,
  showAges = true,
}: PropTypes) => {
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-3");
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [isImageLoading, setIsImageLoading] = useState(false);

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!stories?.length) {
    return (
      <View className="flex flex-1 flex-col items-center justify-center gap-y-3 bg-bgLight px-5">
        <Text className="font-[abeezee] text-xl text-black">
          No stories in this category yet
        </Text>
        <CustomButton text="Go Back" onPress={() => navigator.goBack()} />
      </View>
    );
  }

  return (
    <SafeAreaWrapper variant="transparent">
      <View className="flex flex-1 bg-bgLight">
        <ImageBackground
          onLoadStart={() => {
            setIsImageLoading(true);
          }}
          onLoadEnd={() => setIsImageLoading(false)}
          source={imageSource ?? { uri: stories[0].coverImageUrl }}
          resizeMode="cover"
          className="flex h-[30vh] max-h-[500px] w-full flex-col justify-end px-4 pb-8"
        >
          {isImageLoading && (
            <View className="absolute inset-0 items-center justify-center bg-black/40">
              <ActivityIndicator size="large" color="#EC4007" />
            </View>
          )}

          <View className="flex flex-col gap-y-1.5">
            <Text className="font-[quilka] text-3xl capitalize text-white">
              {title}
            </Text>
            <Text className="font-[abeezee] text-base text-white">
              {description}
            </Text>
          </View>
        </ImageBackground>
        <ScrollView
          className="-mt-4 rounded-t-3xl bg-white pt-5"
          contentContainerClassName="flex flex-col px-4 pb-5"
          showsVerticalScrollIndicator={false}
        >
          {showAges && (
            <AgeSelectionComponent
              selectedAgeGroup={selectedGroup}
              setSelectedAgeGroup={setSelectedGroup}
            />
          )}
          <View className="-mt-4 flex flex-row flex-wrap justify-center gap-x-3 gap-y-6 rounded-t-3xl py-6">
            {stories.map((story, index) => (
              <StoryItem
                index={index}
                key={story.id}
                onNavigate={() => {
                  navigator.navigate("stories", {
                    screen: "childStoryDetails",
                    params: { storyId: story.id },
                  });
                }}
                story={story}
                isGrouped
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default GroupedStoriesContainer;

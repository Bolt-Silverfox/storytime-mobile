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

type PropTypes = {
  stories: Story[] | undefined;
  error: Error | null;
  imageSource?: ImageSourcePropType;
  title: string;
  description: string;
  isPending: boolean;
  refetch: () => void;
};

const GroupedStoriesContainer = ({
  stories,
  error,
  imageSource,
  title,
  description,
  isPending,
  refetch,
}: PropTypes) => {
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-3");
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [isImageLoading, setIsImageLoading] = useState(false);

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!stories?.length) {
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
      <ImageBackground
        onLoadStart={() => {
          setIsImageLoading(true);
        }}
        onLoadEnd={() => setIsImageLoading(false)}
        source={imageSource ?? { uri: stories[0].coverImageUrl }}
        resizeMode="cover"
        className="px-4 h-[30vh] w-full flex flex-col justify-end pb-8 max-h-[500px]"
      >
        {isImageLoading && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <ActivityIndicator size="large" color="EC4007" />
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
        className="bg-white pt-5 rounded-t-3xl -mt-4"
        contentContainerClassName="flex flex-col px-4 pb-5"
        showsVerticalScrollIndicator={false}
      >
        <AgeSelectionComponent
          selectedAgeGroup={selectedGroup}
          setSelectedAgeGroup={setSelectedGroup}
        />
        <View className="flex flex-row flex-wrap py-6 gap-x-3 gap-y-6 -mt-4 rounded-t-3xl justify-center">
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
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default GroupedStoriesContainer;

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import CustomButton from "../../../components/UI/CustomButton";
import StoryItem from "../../../components/parents/StoryItem";
import { storiesByAgeImages } from "../../../data";
import { useQueryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

type RoutePropTypes = RouteProp<ParentHomeNavigatorParamList, "storiesByAge">;
const StoriesByAgeScreen = () => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { params } = useRoute<RoutePropTypes>();
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { isPending, error, refetch, data } = useQuery(
    useQueryRecommendedStories()
  );

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!data.length) {
    return (
      <View className="flex flex-1 flex-col items-center justify-center gap-y-3 bg-bgLight">
        <Text className="font-[abeezee] text-xl text-black">
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
        source={{ uri: storiesByAgeImages[params.ageGroup] }}
        resizeMode="stretch"
        className="flex h-[30vh] max-h-[500px] w-full flex-col justify-end px-4 pb-8"
      >
        {isImageLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/40">
            <ActivityIndicator size="large" color="EC4007" />
          </View>
        )}
        <View className="flex flex-col gap-y-1.5">
          <Text className="font-[quilka] text-3xl capitalize text-white">
            Age {params.ageGroup}
          </Text>
          <Text className="font-[abeezee] text-base text-white">
            Access all stories from ages {params.ageGroup}
          </Text>
        </View>
      </ImageBackground>
      <ScrollView
        className="-mt-4 rounded-t-3xl bg-white pt-5"
        contentContainerClassName="flex flex-col"
        showsVerticalScrollIndicator={false}
      >
        <View className="-mt-4 flex flex-row flex-wrap  justify-center gap-x-3 gap-y-6 rounded-t-3xl py-6">
          {data.map((story, index) => (
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

export default StoriesByAgeScreen;

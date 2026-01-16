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
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import CustomButton from "../../../components/UI/CustomButton";
import StoryItem from "../../../components/parents/StoryItem";
import { storiesByAgeImages } from "../../../data";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

type RoutePropTypes = RouteProp<ParentHomeNavigatorParamList, "storiesByAge">;
const StoriesByAgeScreen = () => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { params } = useRoute<RoutePropTypes>();
  const navigator = useNavigation<ParentsNavigatorProp>();
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories()
  );

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!data.length) {
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
        source={{ uri: storiesByAgeImages[params.ageGroup] }}
        resizeMode="stretch"
        className="px-4 h-[30vh] w-full flex flex-col justify-end pb-8 max-h-[500px]"
      >
        {isImageLoading && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
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
        className="bg-white pt-5 rounded-t-3xl -mt-4"
        contentContainerClassName="flex flex-col"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-row flex-wrap py-6  gap-x-3 gap-y-6 -mt-4 rounded-t-3xl justify-center">
          {data.map((story, index) => (
            <StoryItem
              index={index}
              key={story.id}
              onNavigate={() => {
                navigator.navigate("story", {
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

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import {
  ParentHomeNavigatorParamList,
  ParntHomeNavigatorProp,
} from "../../../Navigation/ParentHomeNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import StoryItem from "../../../components/parents/StoryItem";
import { queryStoryByCategory } from "../../../hooks/tanstack/queryHooks/useGetStoriesByCategory";
import useStoryMode from "../../../contexts/StoryModeContext";
import CustomButton from "../../../components/UI/CustomButton";

type RouteProps = RouteProp<ParentHomeNavigatorParamList, "storiesByCategory">;
const StoriesByCategoryScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();

  const { isPending, data, refetch, error } = useQuery(
    queryStoryByCategory(params.id)
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
      <ScrollView
        contentContainerClassName="flex min-h-full bg-bgLight flex-col"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: data[0].coverImageUrl }}
          resizeMode="cover"
          className="px-4 h-[50vh] w-full flex flex-col justify-end pb-8 max-h-[500px]"
        >
          <View className="flex flex-col gap-y-1.5">
            <Text className="font-[quilka] text-3xl capitalize text-white">
              {params.category}
            </Text>
            <Text className="font-[abeezee] text-base text-white">
              Read great and amazing stories on {params.category}.
            </Text>
          </View>
        </ImageBackground>
        <View className="flex flex-row flex-wrap py-6 bg-white gap-x-3 gap-y-6 -mt-4 rounded-t-3xl justify-center">
          {data.map((story, index) => (
            <StoryItem
              index={index}
              key={story.id}
              onNavigate={() => {
                setActiveStoryId(story.id);
                navigator.navigate("childStoryDetails", { storyId: story.id });
              }}
              story={story}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default StoriesByCategoryScreen;

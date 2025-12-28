import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import {
  ParentHomeNavigatorParamList,
  ParntHomeNavigatorProp,
} from "../../../Navigation/ParentHomeNavigator";
import { dummyStories } from "../../../components/parents/ParentTopPicsComponent";
import StoryItem from "../../../components/parents/StoryItem";

type RouteProps = RouteProp<ParentHomeNavigatorParamList, "storiesByCategory">;
const StoriesByCategoryScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  return (
    <View className="flex flex-1 bg-bgLight">
      <ScrollView
        contentContainerClassName="flex min-h-full bg-bgLight flex-col"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../../assets/images/recommended_stories/the_bear_and_his_friends.jpg")}
          resizeMode="cover"
          className="px-4 h-[50vh] flex flex-col justify-end pb-8 max-h-[500px]"
        >
          <View className="flex flex-col gap-y-1.5">
            <Text className="font-[quilka] text-3xl capitalize text-white">
              {params.category}
            </Text>
            <Text className="font-[abeezee] text-base text-white">
              Read great and amazing stories on honesty.
            </Text>
          </View>
        </ImageBackground>
        <View className="flex flex-row flex-wrap py-6 bg-white gap-x-3 gap-y-6 -mt-4 rounded-t-3xl justify-center">
          {dummyStories.map((story, index) => (
            <StoryItem
              index={index}
              key={story.id}
              onNavigate={() =>
                navigator.navigate("childStoryDetails", { storyId: story.id })
              }
              story={story}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default StoriesByCategoryScreen;

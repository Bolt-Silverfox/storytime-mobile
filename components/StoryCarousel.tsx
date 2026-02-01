import { useNavigation } from "@react-navigation/native";
import { ScrollView, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { Story } from "../types";
import StoryItem from "./parents/StoryItem";

type PropTypes = {
  stories: Story[];
};
const StoryCarousel = ({ stories }: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <View className=" mx-auto w-full max-w-screen-md">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
      >
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
      </ScrollView>
    </View>
  );
};

export default StoryCarousel;

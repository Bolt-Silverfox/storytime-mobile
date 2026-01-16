import { useNavigation } from "@react-navigation/native";
import { ScrollView, View } from "react-native";
import { ParntHomeNavigatorProp } from "../Navigation/ParentHomeNavigator";
import { Story } from "../types";
import StoryItem from "./parents/StoryItem";

type PropTypes = {
  stories: Story[];
};
const StoryCarousel = ({ stories }: PropTypes) => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  return (
    <View className=" max-w-screen-md mx-auto w-full">
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
              navigator.navigate("childStoryDetails", { storyId: story.id });
            }}
            story={story}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StoryCarousel;

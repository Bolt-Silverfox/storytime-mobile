import { RouteProp, useRoute } from "@react-navigation/native";
import StoryComponent from "../../../components/StoryComponent";
import { StoryNavigatorParamList } from "../../../Navigation/StoryNavigator";

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "readStory">;

const ReadStoryScreen = () => {
  const { params } = useRoute<RoutePropTypes>();

  return <StoryComponent storyId={params.storyId} storyMode={params.mode} />;
};

export default ReadStoryScreen;

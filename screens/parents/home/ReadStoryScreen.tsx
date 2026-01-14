import { RouteProp, useRoute } from "@react-navigation/native";
import StoryComponent from "../../../components/StoryComponent";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";

type RoutePropTypes = RouteProp<ParentHomeNavigatorParamList, "readStory">;

const ReadStoryScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  return <StoryComponent storyId={params.storyId} storyMode={params.mode} />;
};

export default ReadStoryScreen;

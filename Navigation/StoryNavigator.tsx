import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Story, StoryModes } from "../types";
import ChildStoryDetails from "../screens/parents/home/ChildStoryDetails";
import ReadStoryScreen from "../screens/parents/home/ReadStoryScreen";
import StoryDeepLinkScreen from "../screens/parents/home/StoryDeepLinkScreen";
import CreateStoryScreen from "../screens/parents/home/CreateStoryScreen";
import GenerationProgressScreen from "../screens/parents/home/GenerationProgressScreen";
import { FEATURE_AI_STORY_GENERATION } from "../constants/constants";

type StoryNavigatorParamList = {
  childStoryDetails: {
    story: Pick<
      Story,
      | "ageMax"
      | "ageMin"
      | "durationSeconds"
      | "categories"
      | "title"
      | "description"
      | "coverImageUrl"
      | "id"
      | "createdAt"
    > &
      Partial<Pick<Story, "isInteractive" | "questions">>;
    page?: number;
  };
  readStory: { storyId: string; mode: StoryModes; page?: number };
  storyDeepLink: { storyId: string };
  createStory: undefined;
  generationProgress: { jobId: string; estimatedWaitTime?: number };
};
type StoryNavigatorProp = NativeStackNavigationProp<StoryNavigatorParamList>;
const Stack = createNativeStackNavigator();

const StoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="childStoryDetails" component={ChildStoryDetails} />
      <Stack.Screen name="readStory" component={ReadStoryScreen} />
      <Stack.Screen name="storyDeepLink" component={StoryDeepLinkScreen} />
      {/* Hard gate: when the flag is off these routes do not exist, so deep
          links or stale navigation state cannot reach them either. */}
      {FEATURE_AI_STORY_GENERATION && (
        <>
          <Stack.Screen name="createStory" component={CreateStoryScreen} />
          <Stack.Screen
            name="generationProgress"
            component={GenerationProgressScreen}
            options={{ gestureEnabled: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export type { StoryNavigatorProp, StoryNavigatorParamList };
export default StoryNavigator;

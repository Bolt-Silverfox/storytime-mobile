import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Story, StoryModes } from "../types";
import ChildStoryDetails from "../screens/parents/home/ChildStoryDetails";
import ReadStoryScreen from "../screens/parents/home/ReadStoryScreen";
import StoryDeepLinkScreen from "../screens/parents/home/StoryDeepLinkScreen";

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
    >;
    page?: number;
  };
  readStory: { storyId: string; mode: StoryModes; page?: number };
  storyDeepLink: { storyId: string };
};
type StoryNavigatorProp = NativeStackNavigationProp<StoryNavigatorParamList>;
const Stack = createNativeStackNavigator();

const StoryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="childStoryDetails" component={ChildStoryDetails} />
      <Stack.Screen name="readStory" component={ReadStoryScreen} />
      <Stack.Screen name="storyDeepLink" component={StoryDeepLinkScreen} />
    </Stack.Navigator>
  );
};

export type { StoryNavigatorProp, StoryNavigatorParamList };
export default StoryNavigator;

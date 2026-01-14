import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StoryModes } from "../types";
import ChildStoryDetails from "../screens/parents/home/ChildStoryDetails";
import ReadStoryScreen from "../screens/parents/home/ReadStoryScreen";

type StoryNavigatorParamList = {
  childStoryDetails: { storyId: string };
  readStory: { storyId: string; mode: StoryModes };
};
type StoryNavigatorProp = NativeStackNavigationProp<StoryNavigatorParamList>;
const Stack = createNativeStackNavigator();

const StoryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="childStoryDetails" component={ChildStoryDetails} />
      <Stack.Screen name="readStory" component={ReadStoryScreen} />
    </Stack.Navigator>
  );
};

export type { StoryNavigatorProp, StoryNavigatorParamList };
export default StoryNavigator;

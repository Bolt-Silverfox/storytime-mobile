import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import CustomizeKidStory from "../screens/Kids/generate/CustomizeKidStory";
import GenerateStoryScreen from "../screens/Kids/generate/GenerateStoryScreen";
import { Dispatch, SetStateAction } from "react";
import { ImageSourcePropType } from "react-native";

type GenerateStoryNavigatorParamList = {
  generateStory: undefined;
  customizeStory: {
    heroName: string;
    setHeroName: Dispatch<SetStateAction<string>>;
    avatarSource: ImageSourcePropType;
  };
};

type GenerateStoryNavigatorProps =
  NativeStackNavigationProp<GenerateStoryNavigatorParamList>;
const Stack = createNativeStackNavigator<GenerateStoryNavigatorParamList>();

const GenerateStoryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="generateStory" component={GenerateStoryScreen} />
      <Stack.Screen name="customizeStory" component={CustomizeKidStory} />
    </Stack.Navigator>
  );
};

export type { GenerateStoryNavigatorParamList, GenerateStoryNavigatorProps };
export default GenerateStoryNavigator;

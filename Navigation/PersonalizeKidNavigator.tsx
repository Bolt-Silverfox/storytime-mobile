import { RouteProp, useRoute } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { CustomizeStoryProvider } from "../contexts/CustomizeStoryContext";
import CustomizeKidStory from "../screens/Kids/personalize/CustomizeKidStory";
import GenerateStoryScreen from "../screens/Kids/personalize/GenerateStoryScreen";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";
import PersonalizeKidStoryIndex from "../screens/Kids/personalize/PersonalizeKidStoryIndex";

type PersonalizeKidNavigatorParamList = {
  index: { childId: string };
  generateStory: { childId: string };
  customizeStory: { childId: string };
  previewScreen: { childId: string };
};

type PersonalizeKidsNavigatorProps =
  NativeStackNavigationProp<PersonalizeKidNavigatorParamList>;
const Stack = createNativeStackNavigator<PersonalizeKidNavigatorParamList>();

type RoutePropTypes = RouteProp<KidsTabNavigatorParamList, "personalize">;

const PersonalizeKidNavigator = () => {
  const { params } = useRoute<RoutePropTypes>();
  const childId = params.childId;

  return (
    <CustomizeStoryProvider childId={childId}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen
          initialParams={{ childId }}
          name="index"
          component={PersonalizeKidStoryIndex}
        /> */}
        <Stack.Screen
          initialParams={{ childId }}
          name="generateStory"
          component={GenerateStoryScreen}
        />
        <Stack.Screen
          initialParams={{ childId }}
          name="customizeStory"
          component={CustomizeKidStory}
        />
      </Stack.Navigator>
    </CustomizeStoryProvider>
  );
};

export type { PersonalizeKidNavigatorParamList, PersonalizeKidsNavigatorProps };
export default PersonalizeKidNavigator;

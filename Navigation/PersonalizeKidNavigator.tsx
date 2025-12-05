import { RouteProp, useRoute } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { CustomizeStoryProvider } from "../contexts/CustomizeStoryContext";
import CustomizeKidsStoryPreviewScreen from "../screens/Kids/personalize/CustomizeKidsStoryPreviewScreen";
import CustomizeKidStory from "../screens/Kids/personalize/CustomizeKidStory";
import PersonalizeStoriesIndex from "../screens/Kids/personalize/PersonalizeStoriesIndex";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";

type PersonalizeKidNavigatorParamList = {
  index: { childId: string };
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
        <Stack.Screen
          initialParams={{ childId }}
          name="index"
          component={PersonalizeStoriesIndex}
        />
        <Stack.Screen
          initialParams={{ childId }}
          name="customizeStory"
          component={CustomizeKidStory}
        />
        <Stack.Screen
          initialParams={{ childId }}
          name="previewScreen"
          component={CustomizeKidsStoryPreviewScreen}
        />
      </Stack.Navigator>
    </CustomizeStoryProvider>
  );
};

export type { PersonalizeKidNavigatorParamList, PersonalizeKidsNavigatorProps };
export default PersonalizeKidNavigator;

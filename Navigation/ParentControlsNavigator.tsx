import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LinkChild from "../screens/parents/profile/LinkChild";
import ControlsIndexScreen from "../screens/parents/controls/ControlsIndexScreen";
import ContentFilter from "../screens/parents/controls/ContentFilter";
import ExcludeStoryTags from "../screens/parents/controls/ExcludeStoryTags";
import CustomizeReadingVoice from "../screens/parents/controls/CustomizeReadingVoice";
import RecordVoice from "../screens/parents/controls/RecordVoice";
import SetBedtime from "../screens/parents/controls/SetBedtime";
import SetDailyLimit from "../screens/parents/controls/SetDailyLimit";
import ViewActivityLog from "../screens/parents/controls/ViewActivityLog";

type ParentControlNavigatorParamList = {
  indexPage: undefined;
  linkChild: { childId: string };
  contentFilter: undefined;
  excludeStoryTags: undefined;
  recordVoice: undefined;
  customizeReadingVoices: undefined;

  setBedtime: undefined;
  setDailyLimit: undefined;
  viewActivityLog: undefined;
};

type ParentControlNavigatorProp =
  NativeStackNavigationProp<ParentControlNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentControlNavigatorParamList>();

const ParentControlNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={ControlsIndexScreen} />
      <Stack.Screen name="linkChild" component={LinkChild} />
      <Stack.Screen name="contentFilter" component={ContentFilter} />
      <Stack.Screen name="excludeStoryTags" component={ExcludeStoryTags} />
      <Stack.Screen name="recordVoice" component={RecordVoice} />
      <Stack.Screen
        name="customizeReadingVoices"
        component={CustomizeReadingVoice}
      />

      <Stack.Screen name="setBedtime" component={SetBedtime} />
      <Stack.Screen name="setDailyLimit" component={SetDailyLimit} />
      <Stack.Screen name="viewActivityLog" component={ViewActivityLog} />
    </Stack.Navigator>
  );
};

export type { ParentControlNavigatorProp, ParentControlNavigatorParamList };
export default ParentControlNavigator;

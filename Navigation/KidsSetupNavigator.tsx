import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import BuddySelectionScreen from "../screens/Kids/BuddySelectionScreen";
import KidWelcomeScreen from "../screens/Kids/KidWelcomeScreen";
import ChooseHero from "../screens/Kids/ChooseHero";
import StoryModeSelector from "../screens/Kids/Toddlers/StoryModeSelector";
import StoryInteractionScreen, {
  KidStory,
} from "../screens/Kids/Toddlers/StoryInteraction";
import StoryReaderScreen from "../screens/Kids/Toddlers/StoryReaderScreen";

type KidsSetupNavigatorParamList = {
  buddySelectionPage: { childId: string };
  welcomeScreen: { selected: "zylo" | "lumina"; childId: string };
  chooseHero: { selected: "zylo" | "lumina"; childId: string };
  // homePage: { selected: "zylo" | "lumina"; childId: string };
  storyModeSelector: { storyId?: string; story?: KidStory };
  storyInteraction: { storyId: string; mode?: string; voice?: string };
  storyReader: { storyId: string; mode?: string; voice?: string };
};

const SetupStack = createNativeStackNavigator<KidsSetupNavigatorParamList>();
type KidsSetupProp = NativeStackNavigationProp<KidsSetupNavigatorParamList>;
const KidSetupNavigator = () => {
  return (
    <SetupStack.Navigator screenOptions={{ headerShown: false }}>
      <SetupStack.Screen
        name="buddySelectionPage"
        component={BuddySelectionScreen}
      />
      <SetupStack.Screen name="welcomeScreen" component={KidWelcomeScreen} />
      <SetupStack.Screen name="chooseHero" component={ChooseHero} />
      <SetupStack.Screen
        name="storyModeSelector"
        component={StoryModeSelector}
      />
      <SetupStack.Screen
        name="storyInteraction"
        component={StoryInteractionScreen}
      />
      <SetupStack.Screen name="storyReader" component={StoryReaderScreen} />
    </SetupStack.Navigator>
  );
};
export type { KidsSetupNavigatorParamList, KidsSetupProp };
export default KidSetupNavigator;

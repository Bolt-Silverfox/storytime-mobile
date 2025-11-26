import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import BuddySelectionScreen from "../screens/Kids/BuddySelectionScreen";
import KidWelcomeScreen from "../screens/Kids/KidWelcomeScreen";
// import KidDetailsScreen from "../screens/KidDetailsScreen";
import ChooseHero from "../screens/Kids/ChooseHero";

type KidsSetupNavigatorParamList = {
  buddySelectionPage: { childId: string };
  welcomeScreen: { selected: "zylo" | "lumina"; childId: string };
  chooseHero: { selected: "zylo" | "lumina"; childId: string };
  // homePage: { selected: "zylo" | "lumina"; childId: string };
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
    </SetupStack.Navigator>
  );
};
export type { KidsSetupNavigatorParamList, KidsSetupProp };
export default KidSetupNavigator;

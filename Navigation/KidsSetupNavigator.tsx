// Navigation/KidsSetupNavigator.tsx
import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import BuddySelectionScreen from "../screens/Kids/BuddySelectionScreen";
import KidWelcomeScreen from "../screens/Kids/KidWelcomeScreen";
import ChooseHero from "../screens/Kids/ChooseHero";
import StoryModeSelector from "../screens/Kids/Toddlers/StoryModeSelector";
import StoryInteractionScreen from "../screens/Kids/Toddlers/StoryInteraction";
import StoryReaderScreen from "../screens/Kids/Toddlers/StoryReaderScreen";
import ChallengeScreen from "../screens/Kids/Toddlers/DailyChallengeIntroScreen";
// import ChallengeScreen from "../screens/Kids/ChallengeScreen"; // <-- import

export type KidsSetupNavigatorParamList = {
  buddySelectionPage: { childId: string };
  welcomeScreen: { selected: "zylo" | "lumina"; childId: string };
  chooseHero: { selected: "zylo" | "lumina"; childId: string };
  storyModeSelector: { storyId?: string; story?: any };
  storyInteraction: { storyId: string; mode?: string; voice?: string };
  storyReader: { storyId: string; mode?: string; voice?: string };
  challenge: { storyId?: string };
};

const SetupStack = createNativeStackNavigator<KidsSetupNavigatorParamList>();
export type KidsSetupProp = NativeStackNavigationProp<KidsSetupNavigatorParamList>;

const KidSetupNavigator = () => {
  return (
    <SetupStack.Navigator screenOptions={{ headerShown: false }}>
      <SetupStack.Screen name="buddySelectionPage" component={BuddySelectionScreen} />
      <SetupStack.Screen name="welcomeScreen" component={KidWelcomeScreen} />
      <SetupStack.Screen name="chooseHero" component={ChooseHero} />
      <SetupStack.Screen name="storyModeSelector" component={StoryModeSelector} />
      <SetupStack.Screen name="storyInteraction" component={StoryInteractionScreen} />
      <SetupStack.Screen name="storyReader" component={StoryReaderScreen} />
      <SetupStack.Screen name="challenge" component={ChallengeScreen} />
    </SetupStack.Navigator>
  );
};

export default KidSetupNavigator;

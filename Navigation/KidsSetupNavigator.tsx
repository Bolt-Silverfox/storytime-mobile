import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import React from "react";
import BuddySelectionScreen from "../screens/Kids/BuddySelectionScreen";
import KidWelcomeScreen from "../screens/Kids/KidWelcomeScreen";

export type KidsSetupNavigatorParamList = {
  buddySelectionPage: { childId: string };
  welcomeScreen: { selected: string; childId: string };
  chooseHero: { selected: string; childId: string };
};

const SetupStack = createNativeStackNavigator<KidsSetupNavigatorParamList>();
export type KidsSetupProp =
  NativeStackNavigationProp<KidsSetupNavigatorParamList>;

const KidSetupNavigator = () => {
  return (
    <SetupStack.Navigator screenOptions={{ headerShown: false }}>
      <SetupStack.Screen
        name="buddySelectionPage"
        component={BuddySelectionScreen}
      />
      <SetupStack.Screen name="welcomeScreen" component={KidWelcomeScreen} />
    </SetupStack.Navigator>
  );
};

export default KidSetupNavigator;

import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { Book } from "iconsax-react-nativejs";
import React from "react";
import colours from "../colours";
import Icon from "../components/Icon";
import KidsHomeScreen from "../screens/Kids/KidsHomeScreen";
import ChallengeScreen from "../screens/Kids/Toddlers/DailyChallengeIntroScreen";
import StoryInteractionScreen from "../screens/Kids/Toddlers/StoryInteraction";
import StoryModeSelector from "../screens/Kids/Toddlers/StoryModeSelector";
import StoryReaderScreen from "../screens/Kids/Toddlers/StoryReaderScreen";
import GenerateStoryNavigator from "./GenerateStoryNavigator";
import KidsLibraryNavigator, {
  KidsLibraryNavigatorParamList,
} from "./KidsLibraryNavigator";
import kidsProfileNavigator from "./KidsProfileNavigator";

type KidsTabNavigatorParamList = {
  home: undefined;
  library: NavigatorScreenParams<KidsLibraryNavigatorParamList>;
  generate: undefined;
  profile: undefined;

  storyModeSelector: { storyId?: string; story?: any; childId?: string };
  storyInteraction: {
    storyId: string;
    mode?: string;
    voice?: string;
    childId?: string;
  };
  storyReader: {
    storyId: string;
    mode?: string;
    voice?: string;
    childId?: string;
  };
  challenge: { storyId?: string; childId?: string };
};

type KidsTabNavigatorProp = BottomTabNavigationProp<KidsTabNavigatorParamList>;

const Tab = createBottomTabNavigator<KidsTabNavigatorParamList>();

const KidsTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="home"
        component={KidsHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="House"
              color={focused ? colours.primary : colours.black}
            />
          ),
          tabBarActiveTintColor: colours.primary,
          tabBarLabelStyle: {
            textTransform: "capitalize",
          },
        }}
      />
      <Tab.Screen
        name="library"
        component={KidsLibraryNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Book color={focused ? colours.primary : colours.black} />
          ),
          tabBarActiveTintColor: colours.primary,
          tabBarLabelStyle: {
            textTransform: "capitalize",
          },
        }}
      />
      <Tab.Screen
        name="generate"
        component={GenerateStoryNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="Wand"
              color={focused ? colours.primary : colours.black}
            />
          ),
          tabBarActiveTintColor: colours.primary,
          tabBarLabelStyle: {
            textTransform: "capitalize",
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={kidsProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="User"
              color={focused ? colours.primary : colours.black}
            />
          ),
          tabBarActiveTintColor: colours.primary,
          tabBarLabelStyle: {
            textTransform: "capitalize",
          },
        }}
      />
      <Tab.Screen
        name="storyModeSelector"
        component={StoryModeSelector}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="storyInteraction"
        component={StoryInteractionScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="storyReader"
        component={StoryReaderScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="challenge"
        component={ChallengeScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
};

export type { KidsTabNavigatorParamList, KidsTabNavigatorProp };
export default KidsTabNavigator;

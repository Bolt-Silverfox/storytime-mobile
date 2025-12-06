import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import colours from "../colours";
import Icon from "../components/Icon";
import KidsHomeScreen from "../screens/Kids/KidsHomeScreen";
import KidsLibraryNavigator from "./KidsLibraryNavigator";
import { KidsNavigatorParamList } from "./KidsNavigator";
import kidsProfileNavigator from "./KidsProfileNavigator";
import { Book } from "iconsax-react-nativejs";
import PersonalizeKidNavigator from "./PersonalizeKidNavigator";

type KidsTabNavigatorParamList = {
  home: { childId: string };
  library: { childId: string };
  personalize: { childId: string };
  profile: { childId: string };
  progress: { childId: string };
};

type KidsTabNavigatorProp = BottomTabNavigationProp<KidsTabNavigatorParamList>;

const Tab = createBottomTabNavigator<KidsTabNavigatorParamList>();

type KidsTabNavigatorRouteProp = RouteProp<KidsNavigatorParamList, "index">;

const KidsTabNavigator = () => {
  const route = useRoute<KidsTabNavigatorRouteProp>();
  const childId = route.params?.childId;

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
        initialParams={{ childId: childId! }}
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
        initialParams={{ childId }}
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
        name="personalize"
        initialParams={{ childId: childId }}
        component={PersonalizeKidNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="NotebookPen"
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
        initialParams={{ childId: childId! }}
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
    </Tab.Navigator>
  );
};

export type { KidsTabNavigatorParamList, KidsTabNavigatorProp };
export default KidsTabNavigator;

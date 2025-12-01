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
import KidsProgressNavigator from "./KidsProgressNavigator";

type KidsTabNavigatorParamList = {
  home: { childId: string };
  library: { childId: string };
  progress: undefined;
  profile: { childId: string };
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
            <Icon
              name="Book"
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
        name="progress"
        component={KidsProgressNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="Trophy"
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

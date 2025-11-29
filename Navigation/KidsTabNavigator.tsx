import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RouteProp, useRoute } from "@react-navigation/native";
import KidsHomeScreen from "../screens/Kids/KidsHomeScreen";
import Icon from "../components/Icon";
import colours from "../colours";
import KidsLibraryScreen from "../screens/Kids/KidsLibraryScreen";
import KidsProgressScreen from "../screens/Kids/KidsProgressScreen";
import KidsLibraryNavigator from "./KidsLibraryNavigator";
import kidsProfileNavigator from "./KidsProfileNavigator";
import { KidsNavigatorParamList } from "./KidsNavigator";
import React from "react";

type KidsTabNavigatorParamList = {
  home: { childId: string };
  library: undefined;
  progress: undefined;
  profile: undefined;
};

type KidsTabNavigatorProp = BottomTabNavigationProp<KidsTabNavigatorParamList>;

const Tab = createBottomTabNavigator<KidsTabNavigatorParamList>();

type KidsTabNavigatorRouteProp = RouteProp<KidsNavigatorParamList, "index">;
export const ChildContext = React.createContext<
  { childId: string | undefined } | undefined
>(undefined);

const KidsTabNavigator = () => {
  const route = useRoute<KidsTabNavigatorRouteProp>();
  const childId = route.params?.childId;

  return (
    <ChildContext.Provider value={{ childId }}>
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
          component={KidsProgressScreen}
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
    </ChildContext.Provider>
  );
};

export type { KidsTabNavigatorProp, KidsTabNavigatorParamList };
export default KidsTabNavigator;

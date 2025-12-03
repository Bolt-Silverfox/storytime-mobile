import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import colours from "../colours";
import Icon from "../components/Icon";
import FavouriteScreen from "../screens/parents/favourite/FavouriteScreen";
import ParentControlNavigator from "./ParentControlsNavigator";
import ParentHomeNavigator from "./ParentHomeNavigator";
import ParentProfileNavigator, {
  ParentProfileNavigatorParamList,
} from "./ParentProfileNavigator";
import ParentReportNavigator from "./ParentsReportNavigator";
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from "@react-navigation/native";

type ParentsNavigatorParamList = {
  home: undefined;
  reports: undefined;
  controls: undefined;
  favourite: undefined;
  profile: NavigatorScreenParams<ParentProfileNavigatorParamList>;
};

type ParentsNavigatorProp = BottomTabNavigationProp<ParentsNavigatorParamList>;

const Tab = createBottomTabNavigator<ParentsNavigatorParamList>();

const ParentsTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        // tabBarStyle: { backgroundColor: "#FFFCFBFB" },
      }}
    >
      <Tab.Screen
        name="home"
        component={ParentHomeNavigator}
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
        name="reports"
        component={ParentReportNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ChartColumnIncreasing"
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
        name="controls"
        component={ParentControlNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="ShieldUser"
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
        name="favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="Heart"
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
        component={ParentProfileNavigator}
        // options={{
        //   tabBarIcon: ({ focused }) => (
        //     <Icon
        //       name="User"
        //       color={focused ? colours.primary : colours.black}
        //     />
        //   ),
        //   tabBarActiveTintColor: colours.primary,
        //   tabBarLabelStyle: {
        //     textTransform: "capitalize",
        //   },
        // }},
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "indexPage";
          return {
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
            tabBarStyle: {
              opacity: routeName === "indexPage" ? 100 : 0,
            },
          };
        }}
      />
    </Tab.Navigator>
  );
};

export type { ParentsNavigatorParamList, ParentsNavigatorProp };
export default ParentsTabNavigator;

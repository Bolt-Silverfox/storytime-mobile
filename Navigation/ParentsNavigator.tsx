import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { Heart } from "lucide-react-native";
import colours from "../colours";
import Icon from "../components/Icon";
import ParentsFavouritesScreen from "../screens/parents/ParentsFavouritesScreen";
import ParentsLibraryScreen from "../screens/parents/ParentsLibraryScreen";
import ParentHomeNavigator, {
  ParentHomeNavigatorParamList,
} from "./ParentHomeNavigator";
import ParentProfileNavigator, {
  ParentProfileNavigatorParamList,
} from "./ParentProfileNavigator";

type ParentsNavigatorParamList = {
  home: NavigatorScreenParams<ParentHomeNavigatorParamList>;
  library: undefined;
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
      }}
    >
      <Tab.Screen
        name="home"
        component={ParentHomeNavigator}
        options={({ route }) => {
          const currentRoute =
            getFocusedRouteNameFromRoute(route) ?? "homePage";

          return {
            tabBarStyle: {
              display: currentRoute === "homePage" ? "flex" : "none",
            },
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
          };
        }}
      />
      <Tab.Screen
        name="library"
        component={ParentsLibraryScreen}
        options={({ route }) => {
          const currentRoute = getFocusedRouteNameFromRoute(route) ?? "index";

          return {
            tabBarStyle: {
              display: currentRoute === "index" ? "flex" : "none",
            },
            tabBarIcon: ({ focused }) => (
              <Feather
                name="book"
                size={24}
                color={focused ? colours.primary : colours.black}
              />
            ),
            tabBarActiveTintColor: colours.primary,
            tabBarLabelStyle: {
              textTransform: "capitalize",
            },
          };
        }}
      />
      <Tab.Screen
        name="favourite"
        component={ParentsFavouritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Heart color={focused ? colours.primary : colours.black} />
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
        options={({ route }) => {
          const currentRoute =
            getFocusedRouteNameFromRoute(route) ?? "indexPage";
          return {
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? colours.primary : colours.black}
              />
            ),
            tabBarActiveTintColor: colours.primary,
            tabBarLabelStyle: {
              textTransform: "capitalize",
            },
            tabBarStyle: {
              display: currentRoute === "indexPage" ? "flex" : "none",
            },
          };
        }}
      />
    </Tab.Navigator>
  );
};

export type { ParentsNavigatorParamList, ParentsNavigatorProp };
export default ParentsTabNavigator;

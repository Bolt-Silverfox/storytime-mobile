import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { AlignBottom, Profile, SecurityUser } from "iconsax-react-nativejs";
import { Heart } from "lucide-react-native";
import colours from "../colours";
import Icon from "../components/Icon";
import GetPremiumScreen from "../screens/parents/home/GetPremiumScreen";
import NotificationsNavigator, {
  NotificationsNavigatorParamList,
} from "./NotificationsNavigator";
import ParentControlNavigator from "./ParentControlsNavigator";
import ParentHomeNavigator, {
  ParentHomeNavigatorParamList,
} from "./ParentHomeNavigator";
import ParentProfileNavigator, {
  ParentProfileNavigatorParamList,
} from "./ParentProfileNavigator";
import ParentReportNavigator from "./ParentsReportNavigator";
import ParentsFavouritesScreen from "../screens/parents/ParentsFavouritesScreen";

type ParentsNavigatorParamList = {
  home: NavigatorScreenParams<ParentHomeNavigatorParamList>;
  reports: undefined;
  controls: undefined;
  favourite: undefined;
  profile: NavigatorScreenParams<ParentProfileNavigatorParamList>;
  getPremium: undefined;
  notifications: NavigatorScreenParams<NotificationsNavigatorParamList>;
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
            <AlignBottom color={focused ? colours.primary : colours.black} />
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
            <SecurityUser color={focused ? colours.primary : colours.black} />
          ),
          tabBarActiveTintColor: colours.primary,
          tabBarLabelStyle: {
            textTransform: "capitalize",
          },
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
          const routeName = getFocusedRouteNameFromRoute(route) ?? "indexPage";
          return {
            tabBarIcon: ({ focused }) => (
              <Profile color={focused ? colours.primary : colours.black} />
            ),
            tabBarActiveTintColor: colours.primary,
            tabBarLabelStyle: {
              textTransform: "capitalize",
            },
          };
        }}
      />
      <Tab.Screen
        name="getPremium"
        component={GetPremiumScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="notifications"
        component={NotificationsNavigator}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
};

export type { ParentsNavigatorParamList, ParentsNavigatorProp };
export default ParentsTabNavigator;

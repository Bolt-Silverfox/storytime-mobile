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
import { AlignBottom, Profile, SecurityUser } from "iconsax-react-nativejs";
import { Heart } from "lucide-react-native";

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
        component={FavouriteScreen}
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
              <Profile color={focused ? colours.primary : colours.black} />
            ),
            tabBarActiveTintColor: colours.primary,
            tabBarLabelStyle: {
              textTransform: "capitalize",
            },
            // tabBarStyle: {
            //   opacity: routeName === "indexPage" ? 100 : 0,
            // },
          };
        }}
      />
    </Tab.Navigator>
  );
};

export type { ParentsNavigatorParamList, ParentsNavigatorProp };
export default ParentsTabNavigator;

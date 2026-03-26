import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colours from "../colours";
import Icon from "../components/Icon";
import ParentHomeNavigator, {
  ParentHomeNavigatorParamList,
} from "./ParentHomeNavigator";

type GuestTabParamList = {
  home: NavigatorScreenParams<ParentHomeNavigatorParamList>;
  signUpPrompt: undefined;
};

type GuestTabNavigatorProp = BottomTabNavigationProp<GuestTabParamList>;

const Tab = createBottomTabNavigator<GuestTabParamList>();

/** Placeholder that triggers the auth prompt when the tab is pressed */
const SignUpPromptPlaceholder = () => null;

const GuestTabNavigator = () => {
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
            tabBarLabelStyle: { textTransform: "capitalize" },
          };
        }}
      />
      <Tab.Screen
        name="signUpPrompt"
        component={SignUpPromptPlaceholder}
        options={{
          tabBarLabel: "Sign Up",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-add-outline"
              size={24}
              color={focused ? colours.primary : colours.black}
            />
          ),
          tabBarActiveTintColor: colours.primary,
          tabBarLabelStyle: { textTransform: "capitalize" },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // Navigate back to auth flow for registration
            navigation.getParent()?.navigate("auth", { screen: "signUp" });
          },
        })}
      />
    </Tab.Navigator>
  );
};

export type { GuestTabParamList, GuestTabNavigatorProp };
export default GuestTabNavigator;

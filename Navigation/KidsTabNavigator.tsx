import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import KidsHomeScreen from "../screens/Kids/KidsHomeScreen";
import Icon from "../components/Icon";
import colours from "../colours";
import KidsLibraryScreen from "../screens/Kids/KidsLibraryScreen";
import KidsProgressScreen from "../screens/Kids/KidsProgressScreen";
import KidsProfileScreen from "../screens/Kids/KidsProfileScreen";

type KidsTabNavigatorParamList = {
  home: undefined;
  library: undefined;
  progress: undefined;
  profile: undefined;
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
        component={KidsLibraryScreen}
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
        component={KidsProfileScreen}
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

export type { KidsTabNavigatorProp, KidsTabNavigatorParamList };
export default KidsTabNavigator;

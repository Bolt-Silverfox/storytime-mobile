import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FavouriteScreen from "../screens/parents/favourite/FavouriteScreen";
import ParentControlNavigator from "./ParentControlsNavigator";
import ParentHomeNavigator from "./ParentHomeNavigator";
import ParentProfileNavigator from "./ParentProfileNavigator";
import ParentReportNavigator from "./ParentsReportNavigator";
import ParentHomeScreen from "../screens/parents/home/ParentHomeScreen";

type ParentsNavigatorParamList = {
  home: undefined;
  reports: undefined;
  controls: undefined;
  favourite: undefined;
  profile: undefined;
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
      <Tab.Screen name="home" component={ParentHomeScreen} />
      <Tab.Screen name="controls" component={ParentControlNavigator} />
      <Tab.Screen name="profile" component={ParentProfileNavigator} />
      <Tab.Screen name="reports" component={ParentReportNavigator} />
      <Tab.Screen name="favourite" component={FavouriteScreen} />
    </Tab.Navigator>
  );
};

export type { ParentsNavigatorProp };
export default ParentsTabNavigator;

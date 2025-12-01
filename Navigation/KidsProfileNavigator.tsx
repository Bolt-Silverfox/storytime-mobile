import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsIndexProfileScreen from "../screens/Kids/profile/KidsIndexProfileScreen";
import ChangeKidAvatar from "../screens/Kids/profile/ChangeKidAvatar";
import ChangekidTheme from "../screens/Kids/profile/ChangekidTheme";
import KidAchievement from "../screens/Kids/profile/KidAchievement";
import ReadKidHistory from "../screens/Kids/profile/ReadKidHistory";
import { RouteProp, useRoute } from "@react-navigation/native";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";

export type KidsProfileNavigatorParams = {
  indexPage: { childId: string };
  changeKidAvatar: { childId: string };
  readKidHistory: undefined;
  changeKidTheme: undefined;
  kidAchievement: undefined;
};

export type kidsProfileNavigatorProp =
  NativeStackNavigationProp<KidsProfileNavigatorParams>;
const Stack = createNativeStackNavigator<KidsProfileNavigatorParams>();

type RouteProps = RouteProp<KidsTabNavigatorParamList, "profile">;

export default function KidsProfileNavigator() {
  const route = useRoute<RouteProps>();
  const childId = route.params?.childId;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="indexPage"
        component={KidsIndexProfileScreen}
        initialParams={{ childId: childId! }}
      />
      <Stack.Screen name="changeKidAvatar" component={ChangeKidAvatar} />
      <Stack.Screen name="readKidHistory" component={ReadKidHistory} />
      <Stack.Screen name="changeKidTheme" component={ChangekidTheme} />
      <Stack.Screen name="kidAchievement" component={KidAchievement} />
    </Stack.Navigator>
  );
}

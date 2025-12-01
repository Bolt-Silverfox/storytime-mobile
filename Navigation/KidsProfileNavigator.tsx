import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsIndexProfileScreen from "../screens/Kids/profile/KidsIndexProfileScreen";
import ChangeKidAvatar from "../screens/Kids/profile/ChangeKidAvatar";
import ChangekidTheme from "../screens/Kids/profile/ChangekidTheme";
import KidAchievement from "../screens/Kids/profile/KidAchievement";
import ReadKidHistory from "../screens/Kids/profile/ReadKidHistory";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";

export type KidsProfileNavigatorParams = {
  indexPage: { childId: string };
  changeKidAvatar: { childId: string };
  readKidHistory: { childId: string };
  changeKidTheme: { childId: string };
  kidAchievement: { childId: string };
};

export type kidsProfileNavigatorProp =
  NativeStackNavigationProp<KidsProfileNavigatorParams>;
const Stack = createNativeStackNavigator<KidsProfileNavigatorParams>();

type KidsTabNavigatorRouteProp = RouteProp<
  KidsTabNavigatorParamList,
  "profile"
>;

export default function KidsProfileNavigator() {
  const { params } = useRoute<KidsTabNavigatorRouteProp>();
  const childId = params.childId;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="indexPage"
        component={KidsIndexProfileScreen}
        initialParams={{ childId }}
      />
      <Stack.Screen
        name="changeKidAvatar"
        component={ChangeKidAvatar}
        initialParams={{ childId }}
      />
      <Stack.Screen
        name="readKidHistory"
        component={ReadKidHistory}
        initialParams={{ childId }}
      />
      <Stack.Screen
        name="changeKidTheme"
        component={ChangekidTheme}
        initialParams={{ childId }}
      />
      <Stack.Screen
        name="kidAchievement"
        component={KidAchievement}
        initialParams={{ childId }}
      />
    </Stack.Navigator>
  );
}

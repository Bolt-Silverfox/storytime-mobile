import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsIndexProfileScreen from "../screens/Kids/profile/KidsIndexProfileScreen";
import ChangeKidAvatar from "../screens/Kids/profile/ChangeKidAvatar";
import ChangekidTheme from "../screens/Kids/profile/ChangekidTheme";
import KidAchievement from "../screens/Kids/profile/KidAchievement";
import ReadKidHistory from "../screens/Kids/profile/ReadKidHistory";

export type KidsProfileNavigatorParams = {
  indexPage: undefined;
  changeKidAvatar: undefined;
  readKidHistory: undefined;
  changeKidTheme: undefined;
  kidAchievement: undefined;
};

export type kidsProfileNavigatorProp =
  NativeStackNavigationProp<KidsProfileNavigatorParams>;
const Stack = createNativeStackNavigator<KidsProfileNavigatorParams>();

export default function kidsProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={KidsIndexProfileScreen} />
      <Stack.Screen name="changeKidAvatar" component={ChangeKidAvatar} />
      <Stack.Screen name="readKidHistory" component={ReadKidHistory} />
      <Stack.Screen name="changeKidTheme" component={ChangekidTheme} />
      <Stack.Screen name="kidAchievement" component={KidAchievement} />
    </Stack.Navigator>
  );
}

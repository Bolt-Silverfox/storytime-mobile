import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import NotificationsScreen from "../screens/parents/notifications/NotificationsScreen";
import NotificationsSettingsScreen from "../screens/parents/notifications/NotificationsSettingsScreen";

type NotificationsNavigatorParamList = {
  index: undefined;
  settings: undefined;
};

type NotificationsNavigatorProp =
  NativeStackNavigationProp<NotificationsNavigatorParamList>;
const Stack = createNativeStackNavigator();

const NotificationsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={NotificationsScreen} />
      <Stack.Screen name="settings" component={NotificationsSettingsScreen} />
    </Stack.Navigator>
  );
};

export type { NotificationsNavigatorProp, NotificationsNavigatorParamList };
export default NotificationsNavigator;

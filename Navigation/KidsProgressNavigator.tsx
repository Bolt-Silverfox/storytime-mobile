import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsProgressScreen from "../screens/Kids/Progress/KidsProgressScreen";

export type KidsProgressNavigatorParams = {
  indexPage: undefined;
};

export type kidsProgressNavigatorProp =
  NativeStackNavigationProp<KidsProgressNavigatorParams>;
const Stack = createNativeStackNavigator<KidsProgressNavigatorParams>();

export default function KidsProgressNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={KidsProgressScreen} />
    </Stack.Navigator>
  );
}

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsProgressScreen from "../screens/Kids/Progress/KidsProgressScreen";
import { RouteProp, useRoute } from "@react-navigation/native";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";

export type KidsProgressNavigatorParams = {
  indexPage: { childId: string };
};

export type kidsProgressNavigatorProp =
  NativeStackNavigationProp<KidsProgressNavigatorParams>;
const Stack = createNativeStackNavigator<KidsProgressNavigatorParams>();

type KidsTabNavigatorRouteProp = RouteProp<
  KidsTabNavigatorParamList,
  "progress"
>;

export default function KidsProgressNavigator() {
  const { params } = useRoute<KidsTabNavigatorRouteProp>();
  const childId = params.childId;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="indexPage"
        component={KidsProgressScreen}
        initialParams={{ childId }}
      />
    </Stack.Navigator>
  );
}

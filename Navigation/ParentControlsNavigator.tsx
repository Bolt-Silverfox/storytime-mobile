import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LinkChild from "../screens/parents/profile/LinkChild";
import ManageChild from "../screens/parents/profile/ManageChild";

type ParentControlNavigatorParamList = {
  manageChild: undefined;
  linkChild: { childId: string };
};

type ParntControlNavigatorProp =
  NativeStackNavigationProp<ParentControlNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentControlNavigatorParamList>();

const ParentControlNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="manageChild" component={ManageChild} />
      <Stack.Screen name="linkChild" component={LinkChild} />
    </Stack.Navigator>
  );
};

export type { ParntControlNavigatorProp };
export default ParentControlNavigator;

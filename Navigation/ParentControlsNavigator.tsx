import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LinkChild from "../screens/parents/profile/LinkChild";

type ParentControlNavigatorParamList = {
  manageChild: undefined;
  linkChild: { childId: string };
  editChild: undefined;
  deleteSuccess: undefined;
};

type ParntControlNavigatorProp =
  NativeStackNavigationProp<ParentControlNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentControlNavigatorParamList>();

const ParentControlNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="linkChild" component={LinkChild} />
    </Stack.Navigator>
  );
};

export type { ParntControlNavigatorProp };
export default ParentControlNavigator;

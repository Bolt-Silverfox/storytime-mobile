import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LinkChild from "../screens/parents/profile/LinkChild";
import ManageChild from "../screens/parents/profile/ManageChild";
import EditChild from "../screens/parents/profile/EditChild";
import DeleteSuccess from "../screens/parents/profile/DeleteSuccess";

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
      <Stack.Screen name="manageChild" component={ManageChild} />
      <Stack.Screen name="linkChild" component={LinkChild} />
      <Stack.Screen name="editChild" component={EditChild} />
      <Stack.Screen name="deleteSuccess" component={DeleteSuccess} />
    </Stack.Navigator>
  );
};

export type { ParntControlNavigatorProp };
export default ParentControlNavigator;

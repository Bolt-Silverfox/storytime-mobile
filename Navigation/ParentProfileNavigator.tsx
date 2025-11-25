import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import AddChildScreen from "../screens/parents/profile/AddChildScreen";
import DeleteSuccess from "../screens/parents/profile/DeleteSuccess";
import EditChildProfile from "../screens/parents/profile/EditChildProfile";
import ManageChildProfilesScreen from "../screens/parents/profile/ManageChildProfilesScreen";
import ProfileScreen from "../screens/parents/profile/ProfileScreen";

type ParentProfileNavigatorParamList = {
  indexPage: undefined;
  manageChildProfiles: undefined;
  editChildProfile: {
    name: string;
    ageRange: string;
    imageUrl: string | null;
    userName?: string;
    id: string;
  };
  addChild: undefined;
  deleteProfileSucessful: undefined;
};

type ParentProfileNavigatorProp =
  NativeStackNavigationProp<ParentProfileNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentProfileNavigatorParamList>();

const ParentProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={ProfileScreen} />
      <Stack.Screen
        name="manageChildProfiles"
        component={ManageChildProfilesScreen}
      />
      <Stack.Screen name="editChildProfile" component={EditChildProfile} />
      <Stack.Screen name="addChild" component={AddChildScreen} />
      <Stack.Screen name="deleteProfileSucessful" component={DeleteSuccess} />
    </Stack.Navigator>
  );
};

export type { ParentProfileNavigatorParamList, ParentProfileNavigatorProp };
export default ParentProfileNavigator;

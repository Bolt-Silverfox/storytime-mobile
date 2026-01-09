import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ManageChildProfilesIndexScreen from "../screens/parents/profile/manageChild/ManageChildProfilesIndexScreen";
import EditChildProfileScreen from "../screens/parents/profile/manageChild/EditChildProfileScreen";
import AddChildScreen from "../screens/parents/profile/manageChild/AddChildScreen";
import ChildAvatar from "../screens/parents/profile/manageChild/ChildAvatarScreen";

type ManageChildProfilesNavigatorParamList = {
  index: undefined;
  editChildProfile: {
    name: string;
    ageRange: string;
    imageUrl: string | undefined;
    id: string;
  };
  addChild: { avatarId: string } | undefined;
  childAvatar: undefined;
};

type ManageChildProfilesNavigatorProp =
  NativeStackNavigationProp<ManageChildProfilesNavigatorParamList>;
const Stack =
  createNativeStackNavigator<ManageChildProfilesNavigatorParamList>();

const ManageChildProfilesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={ManageChildProfilesIndexScreen} />
      <Stack.Screen
        name="editChildProfile"
        component={EditChildProfileScreen}
      />
      <Stack.Screen name="addChild" component={AddChildScreen} />
      <Stack.Screen name="childAvatar" component={ChildAvatar} />
    </Stack.Navigator>
  );
};

export type {
  ManageChildProfilesNavigatorParamList,
  ManageChildProfilesNavigatorProp,
};

export default ManageChildProfilesNavigator;

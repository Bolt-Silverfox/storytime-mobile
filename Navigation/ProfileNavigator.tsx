import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";
import KidsInfoFormScreen from "../screens/auth/KidsInfoFormScreen";

type ProfileNavigatorParamList = {
  completeProfile: undefined;
  kidsInfoForm: { kidsCount?: number };
};

type ProfileNavigatorProp =
  NativeStackNavigationProp<ProfileNavigatorParamList>;
const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="completeProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="kidsInfoForm" component={KidsInfoFormScreen} />
    </Stack.Navigator>
  );
};

export type { ProfileNavigatorParamList, ProfileNavigatorProp };
export default ProfileNavigator;

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import HomeScree from "../screens/HomeScree";
import CompleteProfileNewScreen from "../screens/CompleteProfileNewScreen";

type ProfileNavigatorParamList = {
  completeProfile: undefined;
  homeScreen: undefined;
};

type ProfileNavigatorProp =
  NativeStackNavigationProp<ProfileNavigatorParamList>;
const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homeScreen" component={HomeScree} />
      <Stack.Screen
        name="completeProfile"
        component={CompleteProfileNewScreen}
      />
    </Stack.Navigator>
  );
};

export type { ProfileNavigatorParamList, ProfileNavigatorProp };
export default ProfileNavigator;

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import TrackChallengeScreen from "../screens/parents/home/track-challenge/TrackChallengeScreen";
import ChildChallengeDetailsScreen from "../screens/parents/home/track-challenge/ChildChallengeDetailScreen";

type ChallengeTrackerNavigatorParamList = {
  index: undefined;
  childChallengeDetails: { childId: string };
};

type ChallengeTrackerNavigatorProps =
  NativeStackNavigationProp<ChallengeTrackerNavigatorParamList>;

const Stack = createNativeStackNavigator<ChallengeTrackerNavigatorParamList>();

const ChallengeTrackerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={TrackChallengeScreen} />
      <Stack.Screen
        name="childChallengeDetails"
        component={ChildChallengeDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export type {
  ChallengeTrackerNavigatorParamList,
  ChallengeTrackerNavigatorProps,
};
export default ChallengeTrackerNavigator;

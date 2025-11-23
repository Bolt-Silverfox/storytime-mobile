import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import FavouriteScreen from "../../screens/parents/favourite/FavouriteScreen";
import FavouriteStoryDetailsScreen from "../../screens/parents/favourite/FavouriteStoryDetailsScreen";

type ParentFavouritesNavigatorParamList = {
  home: undefined;
  storyDetails: { id: string };
};

type ParentFavouritesNavigatorProp =
  NativeStackNavigationProp<ParentFavouritesNavigatorParamList>;

const Stack = createNativeStackNavigator<ParentFavouritesNavigatorParamList>();

const ParentFavouritesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={FavouriteScreen} />
      <Stack.Screen
        name="storyDetails"
        component={FavouriteStoryDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export type {
  ParentFavouritesNavigatorParamList,
  ParentFavouritesNavigatorProp,
};
export default ParentFavouritesNavigator;

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsLibraryScreen from "../screens/Kids/KidsLibraryScreen";
import BookDetailsScreen from "../screens/Kids/BookDetailsScreen";

type KidsLibraryNavigatorParamList = {
  indexPage: undefined;
  bookDetails: { bookId: string };
  readBook: { bookId: string };
};

type KidsLibraryNavigatorProps =
  NativeStackNavigationProp<KidsLibraryNavigatorParamList>;

const Stack = createNativeStackNavigator<KidsLibraryNavigatorParamList>();

const KidsLibraryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={KidsLibraryScreen} />
      <Stack.Screen name="bookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="readBook" component={KidsLibraryScreen} />
    </Stack.Navigator>
  );
};

export type { KidsLibraryNavigatorParamList, KidsLibraryNavigatorProps };
export default KidsLibraryNavigator;

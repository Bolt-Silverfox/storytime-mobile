import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsLibraryScreen from "../screens/Kids/library/KidsLibraryScreen";
import BookDetailsScreen from "../screens/Kids/BookDetailsScreen";
import { RouteProp, useRoute } from "@react-navigation/native";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";

type KidsLibraryNavigatorParamList = {
  indexPage: { childId: string };
  bookDetails: { bookId: string };
  readBook: { bookId: string };
};

type KidsLibraryNavigatorProps =
  NativeStackNavigationProp<KidsLibraryNavigatorParamList>;

const Stack = createNativeStackNavigator<KidsLibraryNavigatorParamList>();

type KidsTabNavigatorRouteProp = RouteProp<
  KidsTabNavigatorParamList,
  "library"
>;

const KidsLibraryNavigator = () => {
  const { params } = useRoute<KidsTabNavigatorRouteProp>();
  const childId = params.childId;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="indexPage"
        component={KidsLibraryScreen}
        initialParams={{ childId }}
      />
      <Stack.Screen name="bookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="readBook" component={KidsLibraryScreen} />
    </Stack.Navigator>
  );
};

export type { KidsLibraryNavigatorParamList, KidsLibraryNavigatorProps };
export default KidsLibraryNavigator;

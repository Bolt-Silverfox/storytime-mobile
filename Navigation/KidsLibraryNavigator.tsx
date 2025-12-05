import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import KidsLibraryScreen from "../screens/Kids/library/KidsLibraryScreen";
import BookDetailsScreen from "../screens/Kids/BookDetailsScreen";
import { RouteProp, useRoute } from "@react-navigation/native";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";
import AllStories from "../screens/Kids/library/AllStories";
import LibraryFavourite from "../screens/Kids/library/LibraryFavourite";
import ContinueReading from "../screens/Kids/library/ContinueReading";
import LibraryDownloads from "../screens/Kids/library/LibraryDownloads";
import MyCreations from "../screens/Kids/library/MyCreations";
import LibraryCompleted from "../screens/Kids/library/LibraryCompleted";
import ReturningUser from "../screens/Kids/library/ReturningUser";
import ContinueReadingLibrary from "../screens/Kids/library/ContinueReading";

type KidsLibraryNavigatorParamList = {
  indexPage: { childId: string };
  allStories: { childId: string };
  bookDetails: { bookId: string };
  readBook: { bookId: string };
  returningUser: { childId: string };
  continueReading: { childId: string };
  favourite: { childId: string };
  downloads: { childId: string };
  myCreations: { childId: string };
  completed: { childId: string };
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
  const returningUser = true;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!returningUser ? (
        <Stack.Screen
          name="returningUser"
          component={ReturningUser}
          initialParams={{ childId }}
        />
      ) : (
        <Stack.Screen
          name="indexPage"
          component={KidsLibraryScreen}
          initialParams={{ childId }}
        />
      )}

      <Stack.Screen name="allStories" component={AllStories} />
      <Stack.Screen name="bookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="readBook" component={KidsLibraryScreen} />
      <Stack.Screen
        name="continueReading"
        component={ContinueReadingLibrary}
        initialParams={{ childId }}
      />
      <Stack.Screen name="favourite" component={LibraryFavourite} />
      <Stack.Screen name="downloads" component={LibraryDownloads} />
      <Stack.Screen name="myCreations" component={MyCreations} />
      <Stack.Screen name="completed" component={LibraryCompleted} />
    </Stack.Navigator>
  );
};

export type { KidsLibraryNavigatorParamList, KidsLibraryNavigatorProps };
export default KidsLibraryNavigator;

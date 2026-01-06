import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LoadingOverlay from "../components/LoadingOverlay";
import useKidNavigator from "../contexts/KidNavigatorContext";
import useGetCompletedStories from "../hooks/tanstack/queryHooks/useGetCompletedStories";
import useGetContinueReading from "../hooks/tanstack/queryHooks/useGetContinueReading";
import BookDetailsScreen from "../screens/Kids/BookDetailsScreen";
import AllStories from "../screens/Kids/library/AllStories";
import ContinueReadingLibrary from "../screens/Kids/library/ContinueReading";
import KidsLibraryScreen from "../screens/Kids/library/KidsLibraryScreen";
import LibraryCompleted from "../screens/Kids/library/LibraryCompleted";
import LibraryDownloads from "../screens/Kids/library/LibraryDownloads";
import LibraryFavourite from "../screens/Kids/library/LibraryFavourite";
import MyCreations from "../screens/Kids/library/MyCreations";
import ReturningUser from "../screens/Kids/library/ReturningUser";

type KidsLibraryNavigatorParamList = {
  indexPage: undefined;
  allStories: undefined;
  bookDetails: { bookId: string };
  readBook: { bookId: string };
  returningUser: undefined;
  continueReading: undefined;
  favourite: undefined;
  downloads: undefined;
  myCreations: undefined;
  completed: undefined;
};

type KidsLibraryNavigatorProps =
  NativeStackNavigationProp<KidsLibraryNavigatorParamList>;

const Stack = createNativeStackNavigator<KidsLibraryNavigatorParamList>();

const KidsLibraryNavigator = () => {
  const { childId } = useKidNavigator();
  const { data: continueReading, isLoading } = useGetContinueReading(childId!);
  const { data: completedStories, isLoading: completedStoriesLoading } =
    useGetCompletedStories(childId!);
  const returningUser =
    (continueReading?.length ?? 0) > 0 || (completedStories?.length ?? 0) > 0;

  if (!childId || isLoading || completedStoriesLoading) {
    return <LoadingOverlay visible={isLoading || completedStoriesLoading} />;
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {returningUser ? (
        <Stack.Screen name="returningUser" component={ReturningUser} />
      ) : (
        <Stack.Screen name="indexPage" component={KidsLibraryScreen} />
      )}

      <Stack.Screen name="allStories" component={AllStories} />
      <Stack.Screen name="bookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="readBook" component={KidsLibraryScreen} />
      <Stack.Screen name="continueReading" component={ContinueReadingLibrary} />
      <Stack.Screen name="favourite" component={LibraryFavourite} />
      <Stack.Screen name="downloads" component={LibraryDownloads} />
      <Stack.Screen name="myCreations" component={MyCreations} />
      <Stack.Screen name="completed" component={LibraryCompleted} />
    </Stack.Navigator>
  );
};

export type { KidsLibraryNavigatorParamList, KidsLibraryNavigatorProps };
export default KidsLibraryNavigator;

import { RouteProp, useRoute } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import CustomizeKidStory, {
  ThemeTypes,
} from "../screens/Kids/personalize/CustomizeKidStory";
import PersonalizeStoriesIndex from "../screens/Kids/personalize/PersonalizeStoriesIndex";
import { KidsTabNavigatorParamList } from "./KidsTabNavigator";
import CustomizeKidsStoryPreviewScreen from "../screens/Kids/personalize/CustomizeKidsStoryPreviewScreen";
import { ImageSourcePropType } from "react-native";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import useGetKidById from "../hooks/tanstack/queryHooks/useGetKidById";

type PersonalizeKidNavigatorParamList = {
  index: { childId: string };
  customizeStory: {
    childId: string;
  };
  previewScreen: { childId: string };
};

type PersonalizeKidsNavigatorProps =
  NativeStackNavigationProp<PersonalizeKidNavigatorParamList>;
const Stack = createNativeStackNavigator<PersonalizeKidNavigatorParamList>();

type RoutePropTypes = RouteProp<KidsTabNavigatorParamList, "personalize">;

const PersonalizeKidNavigator = () => {
  const { params } = useRoute<RoutePropTypes>();
  const childId = params.childId;

  return (
    <CustomizeStoryProvider childId={childId}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          initialParams={{ childId }}
          name="index"
          component={PersonalizeStoriesIndex}
        />
        <Stack.Screen
          initialParams={{ childId }}
          name="customizeStory"
          component={CustomizeKidStory}
        />
        <Stack.Screen
          initialParams={{ childId }}
          name="previewScreen"
          component={CustomizeKidsStoryPreviewScreen}
        />
      </Stack.Navigator>
    </CustomizeStoryProvider>
  );
};

export type { PersonalizeKidNavigatorParamList, PersonalizeKidsNavigatorProps };
export default PersonalizeKidNavigator;

type CustomizeStoryContextTypes = {
  heroName: string;
  setHeroName: Dispatch<SetStateAction<string>>;
  storyTheme: ThemeTypes;
  setStoryTheme: Dispatch<SetStateAction<ThemeTypes>>;
  heroGender: string;
  setHeroGender: Dispatch<SetStateAction<string>>;
  avatarSource: ImageSourcePropType | null;
  setAvatarSource: Dispatch<SetStateAction<ImageSourcePropType>>;
};
const CustomizeStoryContext = createContext<
  CustomizeStoryContextTypes | undefined
>(undefined);

const CustomizeStoryProvider = ({
  children,
  childId,
}: {
  children: ReactNode;
  childId: string;
}) => {
  const [heroName, setHeroName] = useState("");
  const [heroGender, setHeroGender] = useState("");
  const [storyTheme, setStoryTheme] = useState<ThemeTypes>("castle");
  const [avatarSource, setAvatarSource] = useState<ImageSourcePropType>(
    require("../assets/avatars/Avatars-3.png")
  );
  const { data, isPending, refetch } = useGetKidById(childId);

  useEffect(() => {
    if (data?.avatar?.url) {
      setAvatarSource({ uri: data.avatar.url });
      setHeroGender("me");
    }
  }, [data]);

  const returnedValues = {
    heroName,
    setHeroName,
    heroGender,
    setHeroGender,
    storyTheme,
    setStoryTheme,
    avatarSource,
    setAvatarSource,
  };
  return (
    <CustomizeStoryContext.Provider value={returnedValues}>
      {children}
    </CustomizeStoryContext.Provider>
  );
};

const useCustomizeStory = () => {
  const context = useContext(CustomizeStoryContext);
  if (!context)
    throw new Error("Customize story context was used outside its scope");
  return context;
};

export { useCustomizeStory };

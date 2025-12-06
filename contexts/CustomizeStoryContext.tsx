import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ImageSourcePropType } from "react-native";
import { ThemeTypes } from "../screens/Kids/personalize/CustomizeKidStory";
import useGetKidById from "../hooks/tanstack/queryHooks/useGetKidById";

type CustomizeStoryContextTypes = {
  heroName: string;
  setHeroName: Dispatch<SetStateAction<string>>;
  storyTheme: ThemeTypes;
  setStoryTheme: Dispatch<SetStateAction<ThemeTypes>>;
  heroGender: string;
  setHeroGender: Dispatch<SetStateAction<string>>;
  avatarSource: ImageSourcePropType;
  setAvatarSource: Dispatch<SetStateAction<ImageSourcePropType>>;
  themeImage: ImageSourcePropType;
  setThemeImage: Dispatch<SetStateAction<ImageSourcePropType>>;
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
    require("../assets/avatars/Avatars-4.png")
  );
  const [themeImage, setThemeImage] = useState<ImageSourcePropType>(
    require("../assets/images/castle.png")
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
    themeImage,
    setThemeImage,
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

export { CustomizeStoryProvider };
export default useCustomizeStory;

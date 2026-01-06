import { useNavigation } from "@react-navigation/native";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ParentsNavigatorProp } from "../Navigation/ParentsNavigator";
import { StoryModes } from "../types";

type StoryModeContextType = {
  storyMode: StoryModes;
  setStoryMode: Dispatch<SetStateAction<StoryModes>>;
  confirmStoryMode: (closeModal: () => void, newMode: StoryModes) => void;
  activeStoryId: string | null;
  setActiveStoryId: Dispatch<SetStateAction<string | null>>;
  onExitStory: () => void;
};
const StoryModeContext = createContext<StoryModeContextType | undefined>(
  undefined
);

const StoryModeProvider = ({ children }: { children: ReactNode }) => {
  const [storyMode, setStoryMode] = useState<StoryModes>("plain");
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const navigator = useNavigation<ParentsNavigatorProp>();

  const confirmStoryMode = (closeModal: () => void, newMode: StoryModes) => {
    closeModal();
    if (newMode === storyMode) return;

    if (newMode === "interactive") {
      setStoryMode("interactive");
      navigator.navigate("home", {
        screen: "newInteractiveStoryMode",
        params: {
          storyId: activeStoryId!,
        },
      });
    } else {
      setStoryMode("plain");
      navigator.navigate("home", {
        screen: "newPlainStoryMode",
        params: {
          storyId: activeStoryId!,
        },
      });
    }
    setStoryMode("plain");
    closeModal();
  };

  const onExitStory = () => {
    setActiveStoryId(null);
    navigator.reset({
      index: 0,
      routes: [{ name: "home" }],
    });
  };

  const contextReturnValues = {
    storyMode,
    setStoryMode,
    confirmStoryMode,
    activeStoryId,
    setActiveStoryId,
    onExitStory,
  };
  return (
    <StoryModeContext.Provider value={contextReturnValues}>
      {children}
    </StoryModeContext.Provider>
  );
};

const useStoryMode = () => {
  const context = useContext(StoryModeContext);
  if (!context)
    throw new Error("Story mode context was used outside its scope");
  return context;
};

export { StoryModeProvider };
export default useStoryMode;

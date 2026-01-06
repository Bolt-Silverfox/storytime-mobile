import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type KidNavigatorContextType = {
  childId: null | string;
  setChildId: Dispatch<SetStateAction<string | null>>;
};
const KidNavigatorContext = createContext<KidNavigatorContextType | undefined>(
  undefined
);

const KidNavigatorProvider = ({ children }: { children: ReactNode }) => {
  const [childId, setChildId] =
    useState<KidNavigatorContextType["childId"]>(null);
  return (
    <KidNavigatorContext.Provider value={{ childId, setChildId }}>
      {children}
    </KidNavigatorContext.Provider>
  );
};

const useKidNavigator = () => {
  const context = useContext(KidNavigatorContext);
  if (!context) throw new Error("Kid context was used outside its scope");
  return context;
};

export { KidNavigatorProvider };
export default useKidNavigator;

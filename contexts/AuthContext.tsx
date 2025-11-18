import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  email: string;
  name: string;
  title: string;
};

type Login = (email: string, password: string) => void;
type SignUp = (
  email: string,
  password: string,
  name: string,
  title: string
) => void;

type AuthContextType = {
  user: User | null | undefined;
  logout: () => void;
  login: Login;
  signUp: SignUp;
  isLoading: boolean;
  errorMessage: string | undefined;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    async function getUserSession() {
      try {
        setIsLoading(true);
        const localStoredSession = await AsyncStorage.getItem("user");
        console.log("locally stored user session", localStoredSession);
        if (!localStoredSession) {
          setUser(null);
          return;
        }
        setUser(JSON.parse(localStoredSession));
      } catch (err) {
        const errMessage =
          err instanceof Error
            ? err.message
            : "Unexpected error, reload the app and try again!";
        setErrorMessage(errMessage);
      } finally {
        setIsLoading(false);
      }
    }

    getUserSession();
  }, []);

  const logout = () => {};

  const login = () => {};

  const signUp = () => {};

  const providerReturnValues = {
    user,
    login,
    logout,
    signUp,
    errorMessage,
    isLoading,
  };
  return (
    <AuthContext.Provider value={providerReturnValues}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext was used outside of it's scope");
  return context;
};

export { AuthProvider };
export default useAuth;

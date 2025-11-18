import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../Navigation/RootNavigator";

type Profile = {
  id: string;
  explicitContent: boolean;
  maxScreenTimeMins: number;
  language: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  profile: Profile;
  numberOfKids: number;
};

type Login = (email: string, password: string) => void;
type SignUp = (
  email: string,
  password: string,
  fullName: string,
  title: string
) => void;

type AuthContextType = {
  user: User | null | undefined;
  logout: () => void;
  login: Login;
  signUp: SignUp;
  isLoading: boolean;
  errorMessage: string | undefined | string[];
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<
    string | string[] | undefined
  >(undefined);
  const navigator = useNavigation<RootNavigatorProp>();
  console.log("accesstoken", accessToken);
  useEffect(() => {
    async function getUserSession() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const localStoredSession = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("accessToken");
        console.log("locally stored user session", localStoredSession);
        if (!localStoredSession || !storedToken) {
          setUser(null);
          return;
        }
        setAccessToken(storedToken);
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

  const logout = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(undefined);
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data: { error?: string; message?: string[]; statusCode?: number } =
        await response.json();

      if (data.message) {
        setErrorMessage(data.message);
        return;
      }
      console.log("loaout response", data);
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      setUser(null);
      navigator.navigate("auth", { screen: "login" });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unexpected logout error, try again later";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const login: Login = async (email, password) => {
    try {
      setErrorMessage(undefined);
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data:
        | { user: User; jwt: string; refreshToken: string }
        | { error: string; message: string[]; statusCode: number } =
        await response.json();

      if ("message" in data) {
        setErrorMessage(data.message);
        return;
      }

      await AsyncStorage.setItem("accessToken", data.jwt);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("login response", data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unexpected error while logging in, try again later.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp: SignUp = async (email, password, fullName, title) => {
    console.log("i received", {
      fullName,
      title,
      password,
      email,
    });
    try {
      setIsLoading(true);
      setErrorMessage(undefined);

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, title, fullName }),
      });
      const data:
        | { user: User; jwt: string; refreshToken: string }
        | { error: string; message: string[]; statusCode: number } =
        await response.json();

      if ("message" in data) {
        setErrorMessage(data.message);
        return;
      }
      navigator.navigate("auth", {
        screen: "login",
      });

      console.log("signup data", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unexpected signup error, try again later";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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

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
import apiFetch from "../apiFetch";
import { emailRegex } from "../constants";

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
  verifyEmail: (token: string) => void;
  requestPasswordReset: (email: string) => void;
  resendVerificationEmail: (email: string) => Promise<AuthResponse>;
};

type AuthSuccessResponse<T = { message: string }> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

type AuthErrorResponse = {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  timeStamp: string;
};

type AuthResponse<T = { messaege: string }> =
  | AuthSuccessResponse<T>
  | AuthErrorResponse;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    string | string[] | undefined
  >(undefined);
  const navigator = useNavigation<RootNavigatorProp>();

  useEffect(() => {
    async function getUserSession() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const localStoredSession = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (!localStoredSession || !storedToken) {
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

  const logout = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(undefined);
      const response = await apiFetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
      });
      const data: AuthResponse = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
        return;
      }
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      setUser(null);
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
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid Email");
      return;
    }
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
      const data: AuthResponse<{
        user: User;
        jwt: string;
        refreshToken: string;
      }> = await response.json();

      if (!data.success) {
        setErrorMessage(data.message);
        return;
      }
      await AsyncStorage.setItem("accessToken", data.data.jwt);
      await AsyncStorage.setItem("refreshToken", data.data.refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
      setUser(data.data.user);
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
      const data: AuthResponse<{
        user: User;
        jwt: string;
        refreshToken: string;
      }> = await response.json();

      if (!data.success) {
        setErrorMessage(data.message);
        return;
      }
      await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
      await AsyncStorage.setItem("refreshToken", data.data.refreshToken);
      navigator.navigate("auth", {
        screen: "verifyEmail",
        params: {
          email,
          refreshToken: data.data.refreshToken,
          jwt: data.data.jwt,
        },
      });
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

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(undefined);

      const response = await fetch(
        `${BASE_URL}/auth/verify-email?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: AuthResponse = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
        return;
      }
      await AsyncStorage.setItem("accessToken", token);
      const locallyStoredUser = await AsyncStorage.getItem("user");
      setUser(JSON.parse(locallyStoredUser!));
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

  const resendVerificationEmail = async (
    email: string
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setErrorMessage(undefined);

      const response = await fetch(
        `${BASE_URL}/auth/send-verification?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        return {
          statusCode: response.status,
          success: false,
          error: response.statusText ?? "Request failed",
          message: data.message ?? "Unable to resend verification email",
          timeStamp: new Date().toISOString(),
        };
      }

      if (!data.success) {
        setErrorMessage(data.message);
        return data;
      }

      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unexpected signup error, try again later";

      setErrorMessage(message);
      return {
        statusCode: 500,
        success: false,
        error: "NetworkError",
        message,
        timeStamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Typp": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (data.message) {
        setErrorMessage(data.message);
        return;
      }
      navigator.navigate("auth", { screen: "createNewPassword" });
      console.log("reset password data", data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unexpected error, try again later";
      setErrorMessage(message);
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
    requestPasswordReset,
    verifyEmail,
    resendVerificationEmail,
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

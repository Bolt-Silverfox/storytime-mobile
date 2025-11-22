import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { RootNavigatorProp } from "../Navigation/RootNavigator";
import { emailRegex } from "../constants";
import { User } from "../types";
import auth from "../utils/auth";

type Login = (email: string, password: string) => void;
type SignUp = (
  email: string,
  password: string,
  fullName: string,
  title: string
) => void;

type AuthContextType = {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
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

  const authTryCatch = async <T,>(
    callback: () => Promise<T>
  ): Promise<T | AuthErrorResponse> => {
    try {
      setIsLoading(true);
      setErrorMessage(undefined);
      return await callback();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unexpected error, reload the app and try again";
      setErrorMessage(message);
      return {
        statusCode: 500,
        success: false,
        error: "NetworkError",
        message: message.length ? message : "Unexpected error, try again",
        timeStamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const logoutData = await authTryCatch<AuthResponse>(auth.logout);
    if (!logoutData.success) {
      setErrorMessage(logoutData.message);
      return;
    }
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
    setUser(null);
  };

  const login: Login = async (email, password) => {
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid Email");
      return;
    }

    const loginData = await authTryCatch<
      AuthResponse<{
        user: User;
        jwt: string;
        refreshToken: string;
      }>
    >(() => auth.login(email, password));
    if (!loginData.success) {
      setErrorMessage(loginData.message);
      return;
    }
    await AsyncStorage.setItem("accessToken", loginData.data.jwt);
    await AsyncStorage.setItem("refreshToken", loginData.data.refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(loginData.data.user));
    setUser(loginData.data.user);
  };

  const signUp: SignUp = async (email, password, fullName, title) => {
    const signupData = await authTryCatch<
      AuthResponse<{
        user: User;
        jwt: string;
        refreshToken: string;
      }>
    >(() => auth.signup({ email, password, fullName, title }));
    if (!signupData.success) {
      setErrorMessage(signupData.message);
      return;
    }
    navigator.navigate("auth", {
      screen: "verifyEmail",
      params: {
        email,
      },
    });
  };

  const verifyEmail = async (token: string) => {
    const verifyEmailData = await authTryCatch<AuthResponse>(() =>
      auth.verifyEmail(token)
    );
    if (!verifyEmailData.success) {
      setErrorMessage(verifyEmailData.message);
      return;
    }
    navigator.navigate("auth", {
      screen: "emailVerificationSuccessful",
    });
  };

  const resendVerificationEmail = async (
    email: string
  ): Promise<AuthResponse> => {
    if (!emailRegex.test(email)) {
      setErrorMessage("invalid email");
      throw new Error("invalid email, try again");
    }
    const resendData = await authTryCatch(() =>
      auth.resendVerificationEmail(email)
    );
    if (!resendData.success) {
      setErrorMessage(resendData.message);
      return resendData;
    }
    return resendData;
  };

  const requestPasswordReset = async (email: string) => {
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email");
      return;
    }
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.requestPasswordReset(email)
    );
    console.log("requestdata", requestData);
    if (!requestData.success) {
      setErrorMessage(requestData.message);
      return;
    }
    navigator.navigate("auth", {
      screen: "confirmResetPasswordToken",
      params: {
        email,
      },
    });
  };

  const providerReturnValues = {
    user,
    setUser,
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

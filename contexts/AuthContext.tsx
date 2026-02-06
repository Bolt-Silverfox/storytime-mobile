import AsyncStorage from "@react-native-async-storage/async-storage";
import { secureTokenStorage } from "../utils/secureTokenStorage";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import auth from "../utils/auth";
import {
  BASE_URL,
  emailRegex,
  IOS_CLIENT_ID,
  WEB_CLIENT_ID,
} from "../constants";
// import {
//   GoogleSignin,
//   isSuccessResponse,
// } from "@react-native-google-signin/google-signin";
import { Alert, Platform } from "react-native";
import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";

type AuthFnTypes = {
  login: (data: {
    email: string;
    password: string;
    setErrorCb: SetErrorCallback;
  }) => void;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  verifyEmail: (data: {
    token: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  requestPasswordReset: (data: {
    email: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  resendVerificationEmail: (data: {
    email: string;
    setErrorCb: SetErrorCallback;
  }) => Promise<AuthResponse>;
  validatePasswordReset: (data: {
    email: string;
    token: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  resetPassword: (data: {
    email: string;
    token: string;
    newPassword: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  handleGoogleAuth: () => void;
  handleAppleAuth: () => void;
  setInAppPin: (data: {
    pin: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  verifyInAppPin: (data: {
    pin: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  updateInAppPin: (data: {
    oldPin: string;
    newPin: string;
    confirmNewPin: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  requestPinReset: (data: {
    onSuccess: () => void;
    setErrorCb: SetErrorCallback;
  }) => void;
  validatePinResetOtp: (data: {
    otp: string;
    onSuccess: () => void;
    setErrorCb: SetErrorCallback;
  }) => void;
  resetPinWithOtp: (data: {
    otp: string;
    newPin: string;
    confirmNewPin: string;
    onSuccess: () => void;
    setErrorCb: SetErrorCallback;
  }) => void;
  changePassword: (data: {
    oldPassword: string;
    newPassword: string;
    setErrorCb: SetErrorCallback;
    onSuccess: () => void;
  }) => void;
  deleteAccount: (setErrorCb: SetErrorCallback) => void;
};

type AuthContextType = {
  isLoading: boolean;
  errorMessage: string | undefined | string[];
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  logout: () => Promise<void>;
  login: AuthFnTypes["login"];
  signUp: AuthFnTypes["signUp"];
  verifyEmail: AuthFnTypes["verifyEmail"];
  requestPasswordReset: AuthFnTypes["requestPasswordReset"];
  resendVerificationEmail: AuthFnTypes["resendVerificationEmail"];
  validatePasswordReset: AuthFnTypes["validatePasswordReset"];
  resetPassword: AuthFnTypes["resetPassword"];
  handleGoogleAuth: AuthFnTypes["handleGoogleAuth"];
  handleAppleAuth: AuthFnTypes["handleAppleAuth"];
  changePassword: AuthFnTypes["changePassword"];
  setInAppPin: AuthFnTypes["setInAppPin"];
  verifyInAppPin: AuthFnTypes["verifyInAppPin"];
  requestPinReset: AuthFnTypes["requestPinReset"];
  validatePinResetOtp: AuthFnTypes["validatePinResetOtp"];
  resetPinWithOtp: AuthFnTypes["resetPinWithOtp"];
  updateInAppPin: AuthFnTypes["updateInAppPin"];
  deleteAccount: AuthFnTypes["deleteAccount"];
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

type SetErrorCallback = Dispatch<SetStateAction<string>>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    string | string[] | undefined
  >(undefined);

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     iosClientId: IOS_CLIENT_ID,
  //     webClientId: WEB_CLIENT_ID,
  //     profileImageSize: 200,
  //   });
  // }, []);

  useEffect(() => {
    async function getUserSession() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const localStoredSession = await AsyncStorage.getItem("user");
        const hasToken = await secureTokenStorage.hasAccessToken();
        if (!localStoredSession || !hasToken) {
          setUser(null);
          return;
        }
        try {
          setUser(JSON.parse(localStoredSession));
        } catch {
          // Corrupted user data - clear it and reset
          await AsyncStorage.removeItem("user");
          setUser(null);
          return;
        }
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

  const logout = useCallback(async () => {
    try {
      await Promise.all([
        secureTokenStorage.clearTokens(),
        AsyncStorage.removeItem("user"),
      ]);
    } catch (error) {
      if (__DEV__) {
        console.error("Logout storage clear failed:", error);
      }
    } finally {
      // Always reset state even if storage clear fails
      setUser(null);
      setErrorMessage(undefined);
    }
  }, []);

  const login: AuthFnTypes["login"] = async ({
    email,
    password,
    setErrorCb,
  }) => {
    if (!emailRegex.test(email)) {
      setErrorCb("Invalid Email");
      return;
    }

    const loginData = await authTryCatch<
      AuthResponse<{
        user: User;
        jwt: string;
        refreshToken: string;
      }>
    >(() => auth.login(email, password));
    setErrorCb("");
    if (!loginData.success) {
      setErrorCb(loginData.message);
      return;
    }
    await secureTokenStorage.setTokens(
      loginData.data.jwt,
      loginData.data.refreshToken
    );
    await AsyncStorage.setItem("user", JSON.stringify(loginData.data.user));
    setUser(loginData.data.user);
  };

  const signUp: AuthFnTypes["signUp"] = async ({
    email,
    password,
    fullName,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const signupData = await authTryCatch<
      AuthResponse<{
        user: User;
        jwt: string;
        refreshToken: string;
      }>
    >(() => auth.signup({ email, password, fullName, role: "parent" }));
    if (!signupData.success) {
      setErrorCb(signupData.message);
      return;
    }
    await secureTokenStorage.setTokens(
      signupData.data.jwt,
      signupData.data.refreshToken
    );
    await AsyncStorage.setItem(
      "unverifiedUser",
      JSON.stringify(signupData.data.user)
    );
    onSuccess();
  };

  const verifyEmail: AuthFnTypes["verifyEmail"] = async ({
    token,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const verifyEmailData = await authTryCatch<AuthResponse>(() =>
      auth.verifyEmail(token)
    );
    if (!verifyEmailData.success) {
      setErrorCb(verifyEmailData.message);
      return;
    }
    onSuccess();
  };

  const resendVerificationEmail: AuthFnTypes["resendVerificationEmail"] =
    async ({ email, setErrorCb }) => {
      setErrorCb("");
      if (!emailRegex.test(email)) {
        setErrorCb("invalid email");
        throw new Error("invalid email, try again");
      }
      const resendData = await authTryCatch(() =>
        auth.resendVerificationEmail(email)
      );
      if (!resendData.success) {
        setErrorCb(resendData.message);
        return resendData;
      }
      return resendData;
    };

  const requestPasswordReset: AuthFnTypes["requestPasswordReset"] = async ({
    email,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    if (!emailRegex.test(email)) {
      setErrorCb("Invalid email");
      return;
    }
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.requestPasswordReset(email)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const validatePasswordReset: AuthFnTypes["validatePasswordReset"] = async ({
    email,
    token,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    if (!emailRegex.test(email)) {
      setErrorCb("Invalid email");
      return;
    }
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.vaildateResetToken(email, token)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const resetPassword: AuthFnTypes["resetPassword"] = async ({
    email,
    token,
    newPassword,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.resetpassword(email, token, newPassword)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const handleGoogleAuth = async () => {
    // try {
    //   setIsLoading(true);
    //   const googlePlayService = await GoogleSignin.hasPlayServices();
    //   if (!googlePlayService)
    //     throw new Error(
    //       "You don't have google play services enabled, enable it and try again."
    //     );
    //   const googleResponse = await GoogleSignin.signIn();
    //   if (!isSuccessResponse(googleResponse)) {
    //     throw new Error("Authentication unsuccesful, try again");
    //   }
    //   const { idToken } = googleResponse.data;
    //   const request = await fetch(`${BASE_URL}/auth/google`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ id_token: idToken }),
    //     method: "POST",
    //   });
    //   const response = await request.json();
    //   if (!response.success) {
    //     throw new Error(response.message);
    //   }
    //   await secureTokenStorage.setTokens(
    //     response.data.jwt,
    //     response.data.refreshToken
    //   );
    //   await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    //   setUser(response.data.user);
    // } catch (error) {
    //   const message =
    //     error instanceof Error ? error.message : "Unexpected error, try again";
    //   Alert.alert(message);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleAppleAuth = async () => {
    try {
      setIsLoading(true);

      let idToken, firstName, lastName;

      if (Platform.OS === "ios") {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user
        );

        if (credentialState === appleAuth.State.AUTHORIZED) {
          idToken = appleAuthRequestResponse.identityToken;
          firstName = appleAuthRequestResponse.fullName?.givenName;
          lastName = appleAuthRequestResponse.fullName?.familyName;
        } else {
          throw new Error("Apple Auth Failed");
        }
      } else {
        // Android
        // Configure for Android
        const rawNonce = Math.random().toString(36).substring(2, 15);
        const state = Math.random().toString(36).substring(2, 15);

        appleAuthAndroid.configure({
          clientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
          redirectUri: process.env.EXPO_PUBLIC_APPLE_REDIRECT_URI,
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state: state,
        });

        const response = await appleAuthAndroid.signIn();
        if (response) {
          idToken = response.id_token;
        }
      }

      if (!idToken) {
        throw new Error("No identity token returned");
      }

      const request = await fetch(`${BASE_URL}/auth/apple`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
        method: "POST",
      });

      const response = await request.json();
      if (!response.success) {
        throw new Error(response.message);
      }

      // Store tokens and user
      if (response.data && response.data.jwt) {
        await secureTokenStorage.setTokens(
          response.data.jwt,
          response.data.refreshToken
        );
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      } else if (response.jwt) {
        await secureTokenStorage.setTokens(response.jwt, response.refreshToken);
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error, try again";
      Alert.alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const setInAppPin: AuthFnTypes["setInAppPin"] = async ({
    pin,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.setInAppPin(pin)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const verifyInAppPin: AuthFnTypes["verifyInAppPin"] = async ({
    pin,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.verifyInAppPin(pin)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const updateInAppPin: AuthFnTypes["updateInAppPin"] = async ({
    oldPin,
    newPin,
    confirmNewPin,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.udpateInAppPin({ oldPin, newPin, confirmNewPin })
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const requestPinReset: AuthFnTypes["requestPinReset"] = async ({
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.requestPinReset()
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const validatePinResetOtp: AuthFnTypes["validatePinResetOtp"] = async ({
    otp,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.validatePinResetOtp(otp)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const resetPinWithOtp: AuthFnTypes["resetPinWithOtp"] = async ({
    otp,
    newPin,
    confirmNewPin,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.resetInAppPin({ otp, newPin, confirmNewPin })
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const changePassword: AuthFnTypes["changePassword"] = async ({
    oldPassword,
    newPassword,
    setErrorCb,
    onSuccess,
  }) => {
    setErrorCb("");
    const requestData = await authTryCatch<AuthResponse>(() =>
      auth.changePassword(oldPassword, newPassword)
    );
    if (!requestData.success) {
      setErrorCb(requestData.message);
      return;
    }
    onSuccess();
  };

  const deleteAccount: AuthFnTypes["deleteAccount"] = async (setErrorCb) => {
    setErrorCb("");
    const request = await authTryCatch<AuthResponse>(() =>
      auth.deleteAccount()
    );
    if (!request.success) {
      setErrorCb(request.message);
      return;
    }
    await Promise.all([
      secureTokenStorage.clearTokens(),
      AsyncStorage.removeItem("user"),
    ]);
    setUser(null);
    setErrorMessage(undefined);
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
    validatePasswordReset,
    resetPassword,
    handleGoogleAuth,
    handleAppleAuth,
    setInAppPin,
    updateInAppPin,
    verifyInAppPin,
    requestPinReset,
    validatePinResetOtp,
    resetPinWithOtp,
    changePassword,
    deleteAccount,
  };
  return (
    <AuthContext.Provider value={providerReturnValues}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext was used outside of its scope");
  return context;
};

export { AuthProvider };
export default useAuth;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { secureTokenStorage } from "../utils/secureTokenStorage";
import { cleanupPushNotifications } from "../utils/notifications";
import { authLogger } from "../utils/logger";
import { setSentryUser, clearSentryUser } from "../utils/sentry";
import { setCrashlyticsUser, clearCrashlyticsUser } from "../utils/crashlytics";
// Environment validation should be called from app bootstrap, not here
import {
  SESSION_REFRESH_THRESHOLD_MS,
  REQUEST_TIMEOUT_MS,
  MAX_RETRY_ATTEMPTS,
} from "../constants/constants";
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
import auth, { publicHeaders } from "../utils/auth";
import {
  setGuestMode,
  setGuestSessionId,
  setGuestDeviceId,
  refreshTokensWithLock,
  RefreshResult,
} from "../apiFetch";
import {
  BASE_URL,
  emailRegex,
  IOS_CLIENT_ID,
  WEB_CLIENT_ID,
} from "../constants";
import * as Application from "expo-application";
import { v4 as uuidv4 } from "uuid";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
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
  handleAppleAuth: (mode?: "signup" | "login") => void;
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
  isGuest: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
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

type AuthResponse<T = { message: string }> =
  | AuthSuccessResponse<T>
  | AuthErrorResponse;

type SetErrorCallback = Dispatch<SetStateAction<string>>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session creation promise cache to prevent duplicate requests
let sessionCreationPromise: Promise<string | null> | null = null;

// Extracted outside the component — no dependencies on component state.
// Uses only module-level BASE_URL and process.env.
// Includes debouncing to prevent duplicate session creation
const createGuestSession = async (
  deviceId: string | null,
  maxAttempts = MAX_RETRY_ATTEMPTS
): Promise<string | null> => {
  // If a session creation is already in progress, return that promise
  if (sessionCreationPromise) {
    return sessionCreationPromise;
  }

  // Create new session promise
  sessionCreationPromise = (async () => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let timeout: NodeJS.Timeout | null = null;
      try {
        const controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        const res = await fetch(`${BASE_URL}/guest/session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.EXPO_PUBLIC_API_KEY
              ? { "X-API-Key": process.env.EXPO_PUBLIC_API_KEY }
              : {}),
            ...(deviceId ? { "X-Guest-Device-Id": deviceId } : {}),
          },
          signal: controller.signal,
        });

        // Check for HTTP errors and retry on non-2xx responses
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        if (data?.data?.sessionId) {
          return data.data.sessionId;
        }
        // If we got a response but no sessionId, it's likely an error response
        throw new Error(data?.message || "No sessionId in response");
      } catch (err) {
        // Log error for debugging while still retrying
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        authLogger.warn(
          `Guest session creation attempt ${attempt} failed: ${errorMessage}`
        );

        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      } finally {
        // Always clear the timeout to prevent leaks
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    }
    return null;
  })();

  // Clear the promise after completion to allow new requests
  sessionCreationPromise.finally(() => {
    sessionCreationPromise = null;
  });

  return sessionCreationPromise;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    string | string[] | undefined
  >(undefined);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: IOS_CLIENT_ID,
      webClientId: WEB_CLIENT_ID,
      profileImageSize: 200,
    });
  }, []);

  useEffect(() => {
    async function getUserSession() {
      try {
        setIsLoading(true);
        setErrorMessage(undefined);
        const localStoredSession = await AsyncStorage.getItem("user");
        const hasToken = await secureTokenStorage.hasAccessToken();
        const hasRefreshToken = await secureTokenStorage.hasRefreshToken();

        if (!localStoredSession || (!hasToken && !hasRefreshToken)) {
          // Check if guest mode was previously active
          const guestModeStored = await AsyncStorage.getItem("guestMode");
          if (guestModeStored === "true") {
            await secureTokenStorage.clearTokens();
            // Restore device ID for quota tracking
            const deviceId = await getOrCreateDeviceId();
            setGuestDeviceId(deviceId);
            // Refresh session if older than 6 days (1 day before 7-day TTL expiry)
            const storedSessionId =
              await AsyncStorage.getItem("guestSessionId");
            const sessionCreatedAt = await AsyncStorage.getItem(
              "guestSessionCreatedAt"
            );

            // Handle both epoch ms and ISO string formats
            let timestamp = 0;
            if (sessionCreatedAt) {
              const numValue = Number(sessionCreatedAt);
              if (!isNaN(numValue)) {
                timestamp = numValue;
              } else {
                // Try parsing as ISO string
                const parsed = Date.parse(sessionCreatedAt);
                timestamp = isNaN(parsed) ? 0 : parsed;
              }
            }

            const isExpired =
              !sessionCreatedAt ||
              timestamp === 0 ||
              Date.now() - timestamp > SESSION_REFRESH_THRESHOLD_MS;

            // Restore guest state immediately for better UX
            setIsGuest(true);
            setGuestMode(true);

            if (storedSessionId && !isExpired) {
              // Set stored session immediately, validate asynchronously
              setGuestSessionId(storedSessionId);

              // Run backend validation in background
              (async () => {
                let validationSucceeded = false;
                let sessionValid = false;

                for (
                  let attempt = 1;
                  attempt <= MAX_RETRY_ATTEMPTS;
                  attempt++
                ) {
                  let timeout: NodeJS.Timeout | null = null;
                  try {
                    const controller = new AbortController();
                    timeout = setTimeout(
                      () => controller.abort(),
                      REQUEST_TIMEOUT_MS
                    );
                    const res = await fetch(`${BASE_URL}/guest/quota`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "X-Guest-Session-Id": storedSessionId,
                        ...(deviceId ? { "X-Guest-Device-Id": deviceId } : {}),
                        ...(process.env.EXPO_PUBLIC_API_KEY
                          ? { "X-API-Key": process.env.EXPO_PUBLIC_API_KEY }
                          : {}),
                      },
                      signal: controller.signal,
                    });

                    if (res.status === 401) {
                      // Session explicitly expired
                      validationSucceeded = true;
                      sessionValid = false;
                      break;
                    } else if (!res.ok) {
                      // Other HTTP errors - throw to trigger retry
                      throw new Error(
                        `HTTP ${res.status}: ${res.statusText || "Validation failed"}`
                      );
                    } else {
                      // Success (2xx response)
                      validationSucceeded = true;
                      sessionValid = true;
                      break;
                    }
                  } catch {
                    if (attempt === MAX_RETRY_ATTEMPTS) {
                      // Final attempt failed, keep using stored session (offline tolerance)
                      return;
                    } else {
                      // Wait before retry with incremental backoff
                      await new Promise((r) => setTimeout(r, 1000 * attempt));
                    }
                  } finally {
                    // Always clear timeout to prevent memory leaks
                    if (timeout) {
                      clearTimeout(timeout);
                    }
                  }
                }

                if (validationSucceeded && !sessionValid) {
                  // Session expired server-side, create new session and update state
                  await AsyncStorage.multiRemove([
                    "guestSessionId",
                    "guestSessionCreatedAt",
                  ]);
                  const newSessionId = await createGuestSession(deviceId);
                  if (newSessionId) {
                    await AsyncStorage.setItem("guestSessionId", newSessionId);
                    await AsyncStorage.setItem(
                      "guestSessionCreatedAt",
                      String(Date.now())
                    );
                    setGuestSessionId(newSessionId);
                  }
                }
              })().catch(() => {
                // Background validation failed, but guest mode continues with stored session
              });
            } else {
              // Session expired client-side or missing — set guest mode and create session in background
              const provisionalId =
                storedSessionId || `provisional-${Date.now()}`;
              setGuestSessionId(provisionalId);

              // Create fresh session in background
              (async () => {
                try {
                  const newSessionId = await createGuestSession(deviceId);
                  if (newSessionId) {
                    await AsyncStorage.setItem("guestSessionId", newSessionId);
                    await AsyncStorage.setItem(
                      "guestSessionCreatedAt",
                      String(Date.now())
                    );
                    setGuestSessionId(newSessionId);
                  }
                } catch {
                  // Non-fatal: guest mode works without backend session
                }
              })();
            }
          }
          await Promise.all([
            secureTokenStorage.clearTokens(),
            AsyncStorage.removeItem("user"),
          ]);
          setUser(null);
          clearSentryUser();
          clearCrashlyticsUser();
          return;
        }
        try {
          const restoredUser = JSON.parse(localStoredSession) as User;

          if (!hasToken && hasRefreshToken) {
            const result = await refreshTokensWithLock();
            if (result === RefreshResult.InvalidToken) {
              await Promise.all([
                secureTokenStorage.clearTokens(),
                AsyncStorage.removeItem("user"),
              ]);
              setUser(null);
              clearSentryUser();
              clearCrashlyticsUser();
              return;
            }
          }

          setUser(restoredUser);
          setSentryUser(restoredUser.id, restoredUser.email);
          setCrashlyticsUser(restoredUser.id);
        } catch {
          // Corrupted user data - clear it and reset
          await AsyncStorage.removeItem("user");
          setUser(null);
          clearSentryUser();
          clearCrashlyticsUser();
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

  const exitGuestMode = useCallback(async () => {
    setIsGuest(false);
    setGuestMode(false);
    setGuestSessionId(null);
    setGuestDeviceId(null);
    await AsyncStorage.multiRemove([
      "guestMode",
      "guestSessionId",
      "guestSessionCreatedAt",
      "guestDeviceId",
    ]);
  }, []);

  // Get or create a persistent device ID for guest quota tracking
  const getOrCreateDeviceId = useCallback(async (): Promise<string> => {
    let deviceId = await AsyncStorage.getItem("guestDeviceId");
    if (!deviceId) {
      // Use platform-specific device ID, fallback to UUID
      if (Platform.OS === "android") {
        const androidId = Application.getAndroidId();
        deviceId = androidId ?? uuidv4();
      } else if (Platform.OS === "ios") {
        const iosId = await Application.getIosIdForVendorAsync();
        deviceId = iosId || uuidv4();
      } else {
        deviceId = uuidv4();
      }
      await AsyncStorage.setItem("guestDeviceId", deviceId);
    }
    return deviceId;
  }, []);

  const enterGuestMode = useCallback(async () => {
    // Clear any existing tokens first
    await secureTokenStorage.clearTokens();
    await AsyncStorage.removeItem("user");
    setUser(null);
    await AsyncStorage.setItem("guestMode", "true");

    // Get or create device ID for quota tracking
    const deviceId = await getOrCreateDeviceId();
    setGuestDeviceId(deviceId);

    // Create backend guest session for progress tracking
    try {
      const newSessionId = await createGuestSession(deviceId);
      if (newSessionId) {
        await AsyncStorage.setItem("guestSessionId", newSessionId);
        await AsyncStorage.setItem("guestSessionCreatedAt", String(Date.now()));
        setGuestSessionId(newSessionId);
      }
    } catch (err) {
      authLogger.warn("Failed to create guest session:", err);
    }
    // Only set guest mode after session ID is established
    setIsGuest(true);
    setGuestMode(true);
  }, [getOrCreateDeviceId]);

  const logout = useCallback(async () => {
    try {
      // Unregister push notifications first (while we still have auth token)
      await cleanupPushNotifications();

      await Promise.all([
        secureTokenStorage.clearTokens(),
        AsyncStorage.removeItem("user"),
      ]);
    } catch (error) {
      authLogger.error("Logout storage clear failed:", error);
    } finally {
      // Always reset state even if storage clear fails
      setUser(null);
      setErrorMessage(undefined);
      await exitGuestMode();
      clearSentryUser();
      clearCrashlyticsUser();
    }
  }, [exitGuestMode]);

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
    await exitGuestMode();
    await secureTokenStorage.setTokens(
      loginData.data.jwt,
      loginData.data.refreshToken
    );
    await AsyncStorage.setItem("user", JSON.stringify(loginData.data.user));
    setUser(loginData.data.user);
    setSentryUser(loginData.data.user.id, loginData.data.user.email);
    setCrashlyticsUser(loginData.data.user.id);
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
    // Exit guest mode when user signs up
    if (isGuest) {
      await exitGuestMode();
    }
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

  const processOAuthResponse = async (response: Record<string, unknown>) => {
    if (!response.success) {
      throw new Error((response.message as string) || "Authentication failed");
    }
    const authData = (response.data as Record<string, unknown>) ?? response;
    if (!authData.jwt || !authData.refreshToken || !authData.user) {
      throw new Error(
        "Invalid auth response: missing jwt, refreshToken, or user"
      );
    }
    await exitGuestMode();
    await secureTokenStorage.setTokens(
      authData.jwt as string,
      authData.refreshToken as string
    );
    await AsyncStorage.setItem("user", JSON.stringify(authData.user));
    const oauthUser = authData.user as User;
    setUser(oauthUser);
    setSentryUser(oauthUser.id, oauthUser.email);
    setCrashlyticsUser(oauthUser.id);
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const googlePlayService = await GoogleSignin.hasPlayServices();
      if (!googlePlayService)
        throw new Error(
          "You don't have google play services enabled, enable it and try again."
        );
      const googleResponse = await GoogleSignin.signIn();
      if (!isSuccessResponse(googleResponse)) {
        throw new Error("Authentication unsuccesful, try again");
      }
      const { idToken } = googleResponse.data;
      const request = await fetch(`${BASE_URL}/auth/google`, {
        headers: publicHeaders,
        body: JSON.stringify({ id_token: idToken }),
        method: "POST",
      });
      const response = await request.json();
      if (
        request.status === 409 &&
        response.error === "ACCOUNT_EXISTS_LINK_REQUIRED"
      ) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Please log in with your original method first, then link Google from Profile → Linked Accounts."
        );
        return;
      }
      await processOAuthResponse(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error, try again";
      Alert.alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async (_mode: "signup" | "login" = "login") => {
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
        headers: publicHeaders,
        body: JSON.stringify({
          id_token: idToken,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        }),
        method: "POST",
      });

      const response = await request.json();
      if (
        request.status === 409 &&
        response.error === "ACCOUNT_EXISTS_LINK_REQUIRED"
      ) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Please log in with your original method first, then link Apple from Profile → Linked Accounts."
        );
        return;
      }
      await processOAuthResponse(response);
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
    isGuest,
    enterGuestMode,
    exitGuestMode,
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

import apiFetch, { ApiError } from "../apiFetch";
import { notifLogger } from "./logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { getToken } from "@react-native-firebase/messaging";
import {
  initializePushNotifications,
  registerDeviceToken,
  unregisterDeviceToken,
} from "./notifications";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  AndroidNotificationPriority: { HIGH: 1 },
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  setNotificationChannelAsync: jest.fn(),
  getDevicePushTokenAsync: jest.fn().mockResolvedValue({ data: "tok" }),
  AndroidImportance: { HIGH: 4 },
}));
jest.mock("expo-device", () => ({ isDevice: true, modelName: "Pixel" }));
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("@react-native-firebase/messaging", () => ({
  getMessaging: jest.fn(),
  registerDeviceForRemoteMessages: jest.fn(),
  getToken: jest.fn(),
  onTokenRefresh: jest.fn(),
}));
jest.mock("../apiFetch", () => {
  class ApiError extends Error {
    status: number;
    transientAuth?: boolean;
    constructor(message: string, status: number) {
      super(message);
      this.name = "ApiError";
      this.status = status;
    }
  }
  return { __esModule: true, default: jest.fn(), ApiError };
});
jest.mock("../constants", () => ({ BASE_URL: "https://api.test" }));
jest.mock("./logger", () => ({
  notifLogger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockedFetch = apiFetch as jest.Mock;

describe("registerDeviceToken", () => {
  beforeEach(() => jest.clearAllMocks());

  it("treats a duplicate-token rejection as already registered, without an error log", async () => {
    mockedFetch.mockRejectedValue(
      new ApiError("A record with this identifier already exists: token.", 409)
    );

    const result = await registerDeviceToken("tok");

    expect(result).toBeTruthy();
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(notifLogger.error).not.toHaveBeenCalled();
  });

  it("recognises the duplicate message even when the backend uses another status", async () => {
    mockedFetch.mockRejectedValue(
      new ApiError("A record with this identifier already exists: token.", 400)
    );

    expect(await registerDeviceToken("tok")).toBeTruthy();
    expect(notifLogger.error).not.toHaveBeenCalled();
  });

  it("treats a 409 as already registered whatever the message", async () => {
    mockedFetch.mockRejectedValue(new ApiError("Conflict", 409));

    expect(await registerDeviceToken("tok")).toBeTruthy();
    expect(notifLogger.error).not.toHaveBeenCalled();
  });

  it("does not treat an unrelated 'already exists' failure as success", async () => {
    mockedFetch.mockRejectedValue(
      new ApiError("Database error: relation already exists", 400)
    );

    expect(await registerDeviceToken("tok")).toBeNull();
    expect(notifLogger.error).toHaveBeenCalled();
  });

  it("stores the token locally when the backend already holds it", async () => {
    (getToken as jest.Mock).mockResolvedValue("tok");
    (Notifications.getDevicePushTokenAsync as jest.Mock).mockResolvedValue({
      data: "tok",
    });
    mockedFetch.mockRejectedValue(
      new ApiError("A record with this identifier already exists: token.", 409)
    );

    await initializePushNotifications();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("pushToken", "tok");
  });

  it("still reports genuine failures as errors", async () => {
    mockedFetch.mockRejectedValue(new ApiError("Invalid token", 400));

    expect(await registerDeviceToken("tok")).toBeNull();
    expect(notifLogger.error).toHaveBeenCalled();
  });
});

describe("unregisterDeviceToken", () => {
  beforeEach(() => jest.clearAllMocks());

  it("does not log an error when the session is gone", async () => {
    mockedFetch.mockRejectedValue(new ApiError("Session expired", 401));

    expect(await unregisterDeviceToken("tok")).toBe(false);
    expect(notifLogger.error).not.toHaveBeenCalled();
  });
});

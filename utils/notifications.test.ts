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

const duplicateTokenConflict = () =>
  new ApiError("A record with this identifier already exists: token.", 409);

const registeredRecord = {
  id: "device-1",
  platform: "android",
  isActive: true,
  createdAt: "2026-11-26T00:00:00.000Z",
  lastUsed: "2026-11-26T00:00:00.000Z",
};

const registeredResponse = () => ({
  json: async () => ({ success: true, data: registeredRecord }),
});

const settle = async <T>(promise: Promise<T>): Promise<T> => {
  await jest.runAllTimersAsync();
  return promise;
};

describe("registerDeviceToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetch.mockReset();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it("retries a duplicate-token conflict and returns the record the backend assigns to this user", async () => {
    mockedFetch
      .mockRejectedValueOnce(duplicateTokenConflict())
      .mockResolvedValueOnce(registeredResponse());

    const result = await settle(registerDeviceToken("tok"));

    expect(result).toEqual(registeredRecord);
    expect(mockedFetch).toHaveBeenCalledTimes(2);
    expect(notifLogger.error).not.toHaveBeenCalled();
  });

  it("does not report a conflict that never resolves as registered", async () => {
    mockedFetch.mockRejectedValue(duplicateTokenConflict());

    expect(await settle(registerDeviceToken("tok"))).toBeNull();
    expect(mockedFetch).toHaveBeenCalledTimes(3);
  });

  it("does not treat a non-409 'already exists: token' message as registered", async () => {
    mockedFetch.mockRejectedValue(
      new ApiError("A record with this identifier already exists: token.", 400)
    );

    expect(await settle(registerDeviceToken("tok"))).toBeNull();
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("does not store the token locally when the conflict never resolves", async () => {
    (getToken as jest.Mock).mockResolvedValue("tok");
    (Notifications.getDevicePushTokenAsync as jest.Mock).mockResolvedValue({
      data: "tok",
    });
    mockedFetch.mockRejectedValue(duplicateTokenConflict());

    await settle(initializePushNotifications());

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("stores the token locally once the retried registration succeeds", async () => {
    (getToken as jest.Mock).mockResolvedValue("tok");
    (Notifications.getDevicePushTokenAsync as jest.Mock).mockResolvedValue({
      data: "tok",
    });
    mockedFetch
      .mockRejectedValueOnce(duplicateTokenConflict())
      .mockResolvedValueOnce(registeredResponse());

    await settle(initializePushNotifications());

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

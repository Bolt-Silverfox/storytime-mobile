import apiFetch from "../apiFetch";
import { BASE_URL } from "../constants";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

/** Headers for unauthenticated endpoints that still require the API key. */
const publicHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
};

const auth = {
  logout: async () => {
    const response = await apiFetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
    });
    return await response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    return await response.json();
  },

  signup: async (data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
    return response.json();
  },

  verifyEmail: async (token: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Email verification failed");
    }
    return await response.json();
  },

  resendVerificationEmail: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/send-verification`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send verification email");
    }
    const data = await response.json();
    return data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to request password reset");
    }
    return await response.json();
  },

  vaildateResetToken: async (email: string, token: string) => {
    const response = await fetch(`${BASE_URL}/auth/validate-reset-token`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email, token }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to validate reset token");
    }
    return await response.json();
  },
  resetpassword: async (email: string, token: string, newPassword: string) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email, token, newPassword }),
    });
    return await response.json();
  },
  setInAppPin: async (pin: string) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin`, {
      method: "POST",
      passThroughStatuses: [400],
      body: JSON.stringify({ pin }),
    });
    return await response.json();
  },
  verifyInAppPin: async (pin: string) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/verify`, {
      method: "POST",
      passThroughStatuses: [400],
      body: JSON.stringify({ pin }),
    });
    return await response.json();
  },
  udpateInAppPin: async (data: {
    oldPin: string;
    newPin: string;
    confirmNewPin: string;
  }) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/reset`, {
      method: "POST",
      body: JSON.stringify(data),
      passThroughStatuses: [400],
    });
    return await response.json();
  },
  requestPinReset: async () => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/request-reset`, {
      method: "POST",
    });
    return await response.json();
  },
  resetInAppPin: async (data: {
    otp: string;
    newPin: string;
    confirmNewPin: string;
  }) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/reset-with-otp`, {
      method: "POST",
      body: JSON.stringify(data),
      passThroughStatuses: [400],
    });
    return await response.json();
  },
  validatePinResetOtp: async (otp: string) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/validate-otp`, {
      method: "POST",
      body: JSON.stringify({ otp }),
      passThroughStatuses: [400],
    });
    return await response.json();
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiFetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
      passThroughStatuses: [400],
    });
    return await response.json();
  },
  deleteAccount: async () => {
    const request = await apiFetch(`${BASE_URL}/user/me?permanent=true`, {
      method: "DELETE",
    });
    return await request.json();
  },
  getLinkedAccounts: async () => {
    const response = await apiFetch(`${BASE_URL}/auth/linked-accounts`, {
      method: "GET",
    });
    return await response.json();
  },
  linkGoogle: async (idToken: string) => {
    const response = await apiFetch(`${BASE_URL}/auth/link/google`, {
      method: "POST",
      body: JSON.stringify({ id_token: idToken }),
    });
    return await response.json();
  },
  linkApple: async (idToken: string) => {
    const response = await apiFetch(`${BASE_URL}/auth/link/apple`, {
      method: "POST",
      body: JSON.stringify({ id_token: idToken }),
    });
    return await response.json();
  },
  unlinkProvider: async (provider: string) => {
    const response = await apiFetch(`${BASE_URL}/auth/unlink/${provider}`, {
      method: "DELETE",
    });
    return await response.json();
  },
};

export { publicHeaders };
export default auth;

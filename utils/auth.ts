import apiFetch from "../apiFetch";
import { BASE_URL } from "../constants";

const auth = {
  logout: async () => {
    const response = await apiFetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(response.statusText ?? "Unexpected error");
    }
    return await response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  signup: async (data: {
    email: string;
    password: string;
    nationality: string;
    fullName: string;
    role: string;
  }) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyEmail: async (token: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    return await response.json();
  },

  resendVerificationEmail: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/send-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  },

  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  },

  vaildateResetToken: async (email: string, token: string) => {
    const response = await fetch(`${BASE_URL}/auth/validate-reset-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token }),
    });
    return await response.json();
  },
  resetpassword: async (email: string, token: string, newPassword: string) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token, newPassword }),
    });
    return await response.json();
  },
  setInAppPin: async (pin: string) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
    });
    return await response.json();
  },
  verifyInAppPin: async (pin: string) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  requestPinReset: async () => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  validatePinResetOtp: async (otp: string) => {
    const response = await apiFetch(`${BASE_URL}/user/me/pin/validate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    });
    return await response.json();
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiFetch(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return await response.json();
  },
};

export default auth;
